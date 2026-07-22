// AI-drafts bilingual Showcase copy (tagline, description, tags) from a
// title + short brief. Auth-required (a valid signed-in caller JWT) but,
// unlike submit-project, NOT Turnstile-gated — Turnstile is specifically
// an anonymous-abuse gate, and this endpoint already requires sign-in
// before it will trigger a paid external API call. No rate-limiting
// beyond that auth gate exists here; accepted as a v1 limitation rather
// than building a token-bucket limiter (nothing else in this codebase
// rate-limits either).
//
// Calls the OpenCode Go gateway (an OpenAI-compatible REST API) using the
// OPENCODE_GO_API_KEY secret already used by this repo's CI dev-tooling
// workflows (.github/workflows/weekly-recommendation.yml,
// .github/workflows/opencode.yml) — reused here rather than provisioning
// a new AI provider. Model id is the bare "kimi-k2.7-code" (the gateway's
// own id), not the opencode CLI's "opencode-go/"-prefixed routing syntax.
//
// kimi-k2.7-code always operates in "thinking mode" and may wrap its JSON
// answer in a ```json fence or prepend reasoning text, so the response is
// parsed with the exact fence-strip + first-{...}-regex + JSON.parse
// strategy already used in weekly-recommendation.yml's "Create issue"
// step — a bare JSON.parse on the raw content is not safe here.
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders, jsonResponse } from '../_shared/turnstile.ts'

const OPENCODE_GO_ENDPOINT = 'https://opencode.ai/zen/go/v1/chat/completions'
const MODEL = 'kimi-k2.7-code'

const SYSTEM_PROMPT = `You are a technical writer for a university software-engineering lab's project showcase. Given a project title, a short brief, and optionally a repo URL, produce concise marketing-quality copy in BOTH English and Indonesian.

Respond with ONLY a single JSON object, no prose, no markdown fences, with exactly these keys:
- tagline_en (string, <=120 chars, a punchy one-line English tagline)
- tagline_id (string, the Indonesian translation of the tagline)
- description_en (string, 2-4 sentences, English)
- description_id (string, the Indonesian translation of the description)
- tags (array of 3-6 short lowercase technology/topic strings)

Do not invent facts that aren't implied by the brief.`

interface SuggestPayload {
  title?: string
  brief?: string
  repo_url?: string | null
}

interface Suggestion {
  tagline_en: string
  tagline_id: string
  description_en: string
  description_id: string
  tags: string[]
}

Deno.serve(async (req) => {
  const headers = corsHeaders(req)

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed' }, 405, headers)
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return jsonResponse({ error: 'not_authenticated' }, 401, headers)
  }

  let payload: SuggestPayload
  try {
    payload = await req.json()
  } catch {
    return jsonResponse({ error: 'bad_request' }, 400, headers)
  }

  if (!payload.title?.trim() || !payload.brief?.trim()) {
    return jsonResponse({ error: 'invalid_request' }, 400, headers)
  }

  // Anon key + the caller's own Authorization header — this is the auth
  // gate. We don't need the user's role, just proof of a real session.
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return jsonResponse({ error: 'not_authenticated' }, 401, headers)
  }

  const apiKey = Deno.env.get('OPENCODE_GO_API_KEY')
  if (!apiKey) {
    console.error('OPENCODE_GO_API_KEY is not configured')
    return jsonResponse({ error: 'ai_unavailable' }, 500, headers)
  }

  const userPrompt = `Title: ${payload.title.trim()}\nBrief: ${payload.brief.trim()}\nRepo: ${payload.repo_url?.trim() || 'n/a'}`

  let content: string | undefined
  try {
    const res = await fetch(OPENCODE_GO_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
      }),
    })

    if (!res.ok) {
      console.error('OpenCode Go request failed', res.status, await res.text())
      return jsonResponse({ error: 'ai_failed' }, 502, headers)
    }

    const data = await res.json()
    content = data?.choices?.[0]?.message?.content
  } catch (err) {
    console.error('OpenCode Go request errored', err)
    return jsonResponse({ error: 'ai_failed' }, 502, headers)
  }

  if (!content) {
    return jsonResponse({ error: 'ai_failed' }, 502, headers)
  }

  // Strip optional ```json … ``` fences, then take the first {...} block —
  // mirrors the parsing already used in weekly-recommendation.yml.
  const stripped = content.replace(/^```json\s*/m, '').replace(/^```\s*$/m, '').trim()
  const match = stripped.match(/\{[\s\S]*\}/)
  if (!match) {
    console.error('suggest-project-content: no JSON object in AI response', content)
    return jsonResponse({ error: 'ai_parse_failed' }, 502, headers)
  }

  let suggestion: Suggestion
  try {
    suggestion = JSON.parse(match[0])
  } catch (err) {
    console.error('suggest-project-content: JSON parse error', err, match[0])
    return jsonResponse({ error: 'ai_parse_failed' }, 502, headers)
  }

  return jsonResponse({ suggestion }, 200, headers)
})
