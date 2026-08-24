// AI-drafts a bilingual announcement banner message from a short brief.
// Auth-required (a valid signed-in caller JWT) but, unlike submit-project,
// NOT Turnstile-gated, same reasoning as suggest-project-content: this is
// an authenticated-admin-surface endpoint (the Announcements tab in
// AdminDashboard.vue), not a public one, and the RLS-enforced write it
// feeds into is already admin-only.
//
// Mirrors suggest-project-content/index.ts's OpenCode Go gateway call,
// secret, model id, and JSON-recovery strategy exactly; see that file's
// comments for the rationale. Only the prompt and response shape differ:
// an announcement is a single bilingual message pair, not five fields.
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders, jsonResponse } from '../_shared/turnstile.ts'

const OPENCODE_GO_ENDPOINT = 'https://opencode.ai/zen/go/v1/chat/completions'
const MODEL = 'kimi-k2.7-code'

const SYSTEM_PROMPT = `You are drafting a short, urgent site-wide announcement banner message for a university software engineering lab website. Given a brief description of what should be announced, produce concise banner copy in BOTH English and Indonesian.

Respond with ONLY a single JSON object, no prose, no markdown fences, with exactly these keys:
- message_en (string, <=200 chars, one or two sentences, plain and direct: this is an urgent notice, not marketing copy)
- message_id (string, the Indonesian translation of message_en)

Do not invent facts that aren't implied by the brief.`

interface SuggestPayload {
  brief?: string
}

interface Suggestion {
  message_en: string
  message_id: string
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

  if (!payload.brief?.trim()) {
    return jsonResponse({ error: 'invalid_request' }, 400, headers)
  }

  // Anon key + the caller's own Authorization header: this is the auth
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

  const userPrompt = `Brief: ${payload.brief.trim()}`

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

  // Strip optional ```json … ``` fences, then take the first {...} block:
  // mirrors the parsing already used in suggest-project-content and
  // weekly-recommendation.yml.
  const stripped = content.replace(/^```json\s*/m, '').replace(/^```\s*$/m, '').trim()
  const match = stripped.match(/\{[\s\S]*\}/)
  if (!match) {
    console.error('suggest-announcement-content: no JSON object in AI response', content)
    return jsonResponse({ error: 'ai_parse_failed' }, 502, headers)
  }

  let suggestion: Suggestion
  try {
    suggestion = JSON.parse(match[0])
  } catch (err) {
    console.error('suggest-announcement-content: JSON parse error', err, match[0])
    return jsonResponse({ error: 'ai_parse_failed' }, 502, headers)
  }

  return jsonResponse({ suggestion }, 200, headers)
})
