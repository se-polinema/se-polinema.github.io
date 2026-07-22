// Turnstile-gated self-submission for the Showcase (Projects/Products).
// Clone of submit-member/index.ts's exact pattern: forwards the caller's
// own JWT (not the service role) so the projects_insert_self RLS policy
// (auth.uid() = user_id AND approved = false, plus every curatorial field
// — featured/private/status/stream/researchers/contributors/video_url/
// slug — pinned to its default; see 20260722031833_projects.sql and
// 20260722082908_projects_extend.sql) keeps doing the real identity and
// scope enforcement; this function only adds the Turnstile gate in front
// of the same insert the client used to perform directly. Unlike
// se.members, a user may submit more than one project — there is no
// existing-row check here, every call is a fresh insert.
import { createClient } from 'npm:@supabase/supabase-js@2'
import { verifyTurnstile, corsHeaders, jsonResponse } from '../_shared/turnstile.ts'

interface ProjectPayload {
  turnstileToken?: string
  title?: string
  tagline_en?: string | null
  tagline_id?: string | null
  description_en?: string | null
  description_id?: string | null
  tags?: string[]
  repo_url?: string | null
  demo_url?: string | null
  images?: string[]
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

  let payload: ProjectPayload
  try {
    payload = await req.json()
  } catch {
    return jsonResponse({ error: 'bad_request' }, 400, headers)
  }

  if (!payload.turnstileToken || !payload.title || !payload.title.trim()) {
    return jsonResponse({ error: 'invalid_request' }, 400, headers)
  }

  const remoteIp = req.headers.get('cf-connecting-ip') ?? undefined
  const verified = await verifyTurnstile(payload.turnstileToken, remoteIp)
  if (!verified) {
    return jsonResponse({ error: 'captcha_failed' }, 400, headers)
  }

  // Anon key + the caller's own Authorization header — RLS runs as this
  // user, exactly as it did for the client's old direct insert.
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return jsonResponse({ error: 'not_authenticated' }, 401, headers)
  }

  const { error } = await supabase
    .schema('se')
    .from('projects')
    .insert({
      user_id: user.id,
      approved: false,
      title: payload.title.trim(),
      tagline_en: payload.tagline_en?.trim() || null,
      tagline_id: payload.tagline_id?.trim() || null,
      description_en: payload.description_en?.trim() || null,
      description_id: payload.description_id?.trim() || null,
      tags: payload.tags ?? [],
      repo_url: payload.repo_url?.trim() || null,
      demo_url: payload.demo_url?.trim() || null,
      images: payload.images ?? [],
    })

  if (error) {
    console.error('submit-project insert failed', error)
    return jsonResponse({ error: error.message }, 400, headers)
  }

  return jsonResponse({ success: true }, 200, headers)
})
