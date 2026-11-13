// Turnstile-gated self-submission for current students. Self-registration
// always creates a status='student' row: becoming an alumnus is a
// graduation event on an existing row (see se.graduate_member,
// 20260722023755_member_graduation.sql), not a second registration form.
// The caller's JWT only identifies them; the insert runs with the service
// role because the members_insert_self RLS policy was dropped
// (20261113000001_security_hardening.sql): with it in place a signed-in user
// could POST straight to PostgREST and skip Turnstile. The row is pinned
// here to user_id = the verified caller, approved = false, status =
// 'student', so nothing is widened.
import { createClient } from 'npm:@supabase/supabase-js@2'
import { verifyTurnstile, corsHeaders, jsonResponse, httpUrlOrNull } from '../_shared/turnstile.ts'

interface MemberPayload {
  turnstileToken?: string
  name?: string
  photo?: string | null
  cohort_year?: number
  role_id?: string
  role_en?: string
  current_role_id?: string | null
  current_role_en?: string | null
  current_organization_id?: string | null
  current_organization_en?: string | null
  linkedin_url?: string | null
  profile_url?: string | null
  github_url?: string | null
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

  let payload: MemberPayload
  try {
    payload = await req.json()
  } catch {
    return jsonResponse({ error: 'bad_request' }, 400, headers)
  }

  if (
    !payload.turnstileToken ||
    !payload.name ||
    !payload.cohort_year ||
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

  const caller = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  const { data: { user }, error: userError } = await caller.auth.getUser()
  if (userError || !user) {
    return jsonResponse({ error: 'not_authenticated' }, 401, headers)
  }

  const linkedinUrl = httpUrlOrNull(payload.linkedin_url)
  const profileUrl = httpUrlOrNull(payload.profile_url)
  const githubUrl = httpUrlOrNull(payload.github_url)
  if (linkedinUrl === undefined || profileUrl === undefined || githubUrl === undefined) {
    return jsonResponse({ error: 'invalid_url' }, 400, headers)
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { error } = await supabase
    .schema('se')
    .from('members')
    .insert({
      user_id: user.id,
      status: 'student',
      approved: false,
      name: payload.name.trim(),
      photo: payload.photo || null,
      cohort_year: payload.cohort_year,
      exit_year: null,
      role_id: payload.role_id.trim(),
      role_en: payload.role_en.trim(),
      current_role_id: payload.current_role_id?.trim() || null,
      current_role_en: payload.current_role_en?.trim() || null,
      current_organization_id: payload.current_organization_id?.trim() || null,
      current_organization_en: payload.current_organization_en?.trim() || null,
      linkedin_url: linkedinUrl,
      profile_url: profileUrl,
      github_url: githubUrl,
      streams: payload.streams ?? [],
      research_topics: payload.research_topics?.trim() || null,
      career_update: payload.career_update?.trim() || null,
    })

  if (error) {
    console.error('submit-member insert failed', error)
    return jsonResponse({ error: 'insert_failed' }, 400, headers)
  }

  return jsonResponse({ success: true }, 200, headers)
})
