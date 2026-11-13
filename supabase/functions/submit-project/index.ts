// Turnstile-gated self-submission for the Showcase (Projects/Products).
// Clone of submit-member/index.ts's pattern: the caller's JWT only identifies
// them, and the insert runs with the service role because the
// projects_insert_self RLS policy was dropped
// (20261113000001_security_hardening.sql): with it in place a signed-in user
// could POST straight to PostgREST and skip Turnstile. The row is pinned here
// to user_id = the verified caller and approved = false; every curatorial
// field (featured/private/status/stream/researchers/contributors/video_url/
// slug) stays at its column default. Unlike se.members, a user may submit
// more than one project; every call is a fresh insert.
import { createClient } from 'npm:@supabase/supabase-js@2'
import { verifyTurnstile, corsHeaders, jsonResponse, httpUrlOrNull } from '../_shared/turnstile.ts'

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

  const caller = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  const { data: { user }, error: userError } = await caller.auth.getUser()
  if (userError || !user) {
    return jsonResponse({ error: 'not_authenticated' }, 401, headers)
  }

  const repoUrl = httpUrlOrNull(payload.repo_url)
  const demoUrl = httpUrlOrNull(payload.demo_url)
  if (repoUrl === undefined || demoUrl === undefined) {
    return jsonResponse({ error: 'invalid_url' }, 400, headers)
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

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
      repo_url: repoUrl,
      demo_url: demoUrl,
      images: payload.images ?? [],
    })

  if (error) {
    console.error('submit-project insert failed', error)
    return jsonResponse({ error: 'insert_failed' }, 400, headers)
  }

  return jsonResponse({ success: true }, 200, headers)
})
