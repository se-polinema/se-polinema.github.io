// Turnstile-gated alumni self-submission. Replaces AlumniSubmissionForm.vue's
// previous direct insert into se.members. Unlike subscribe-newsletter, this
// forwards the caller's own JWT (not the service role) so the existing
// members_insert_self RLS policy (auth.uid() = user_id AND approved = false
// AND status = 'alumni' — 013_alumni_self_service.sql) keeps doing the real
// identity enforcement; this function only adds the Turnstile gate in front
// of the same insert the client used to perform directly.
import { createClient } from 'npm:@supabase/supabase-js@2'
import { verifyTurnstile, corsHeaders, jsonResponse } from '../_shared/turnstile.ts'

interface AlumniPayload {
  turnstileToken?: string
  name?: string
  photo?: string | null
  cohort_year?: number
  exit_year?: number
  role_id?: string
  role_en?: string
  current_role_id?: string | null
  current_role_en?: string | null
  current_organization_id?: string | null
  current_organization_en?: string | null
  linkedin_url?: string | null
  profile_url?: string | null
  streams?: string[]
  research_topics?: string | null
  career_update?: string | null
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

  let payload: AlumniPayload
  try {
    payload = await req.json()
  } catch {
    return jsonResponse({ error: 'bad_request' }, 400, headers)
  }

  if (
    !payload.turnstileToken ||
    !payload.name ||
    !payload.cohort_year ||
    !payload.exit_year ||
    !payload.role_id ||
    !payload.role_en ||
    !payload.research_topics
  ) {
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
    .from('members')
    .insert({
      user_id: user.id,
      status: 'alumni',
      approved: false,
      name: payload.name.trim(),
      photo: payload.photo || null,
      cohort_year: payload.cohort_year,
      exit_year: payload.exit_year,
      role_id: payload.role_id.trim(),
      role_en: payload.role_en.trim(),
      current_role_id: payload.current_role_id?.trim() || null,
      current_role_en: payload.current_role_en?.trim() || null,
      current_organization_id: payload.current_organization_id?.trim() || null,
      current_organization_en: payload.current_organization_en?.trim() || null,
      linkedin_url: payload.linkedin_url?.trim() || null,
      profile_url: payload.profile_url?.trim() || null,
      streams: payload.streams ?? [],
      research_topics: payload.research_topics?.trim() || null,
      career_update: payload.career_update?.trim() || null,
    })

  if (error) {
    console.error('submit-alumni insert failed', error)
    return jsonResponse({ error: error.message }, 400, headers)
  }

  return jsonResponse({ success: true }, 200, headers)
})
