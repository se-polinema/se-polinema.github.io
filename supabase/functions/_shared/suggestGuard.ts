// Shared guards for the AI "suggest" Edge Functions. Every call is a paid
// external LLM request and sign-up is open (no email confirmation), so each
// function authenticates the caller, optionally requires the admin role,
// caps input size and enforces a per-user hourly limit.
import { createClient, type SupabaseClient, type User } from 'npm:@supabase/supabase-js@2'
import { jsonResponse } from './turnstile.ts'

const WINDOW_MS = 60 * 60 * 1000
const RETENTION_MS = 24 * WINDOW_MS

export interface GuardOptions {
  fn: string
  /** Max calls per user per hour (every attempt that passes validation counts). */
  hourlyLimit: number
  /** When true only profiles with role 'admin' may call. */
  adminOnly: boolean
}

export type GuardResult = { user: User } | { response: Response }

// Authenticates via the caller's own JWT, checks the role if required, then
// consumes one unit of the user's hourly budget. Returns the user, or a
// ready-to-send error response (401 / 403 / 429 / 500).
export async function guardSuggestCall(
  req: Request,
  headers: Record<string, string>,
  opts: GuardOptions,
): Promise<GuardResult> {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return { response: jsonResponse({ error: 'not_authenticated' }, 401, headers) }
  }

  const url = Deno.env.get('SUPABASE_URL')!
  const caller: SupabaseClient = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authHeader } },
  })

  const { data: { user }, error: userError } = await caller.auth.getUser()
  if (userError || !user) {
    return { response: jsonResponse({ error: 'not_authenticated' }, 401, headers) }
  }

  if (opts.adminOnly) {
    // RLS lets a user read their own profile row, so the caller client is enough.
    const { data: profile, error } = await caller
      .schema('se')
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
    if (error) {
      console.error(`${opts.fn}: role lookup failed`, error)
      return { response: jsonResponse({ error: 'server_error' }, 500, headers) }
    }
    if (profile?.role !== 'admin') {
      return { response: jsonResponse({ error: 'forbidden' }, 403, headers) }
    }
  }

  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!serviceKey) {
    console.error(`${opts.fn}: SUPABASE_SERVICE_ROLE_KEY is not available`)
    return { response: jsonResponse({ error: 'server_error' }, 500, headers) }
  }
  const service = createClient(url, serviceKey)
  const since = new Date(Date.now() - WINDOW_MS).toISOString()

  const { count, error: countError } = await service
    .schema('se')
    .from('ai_suggestion_log')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', since)
  if (countError) {
    console.error(`${opts.fn}: rate-limit count failed`, countError)
    return { response: jsonResponse({ error: 'server_error' }, 500, headers) }
  }
  if ((count ?? 0) >= opts.hourlyLimit) {
    return { response: jsonResponse({ error: 'rate_limited' }, 429, headers) }
  }

  const { error: insertError } = await service
    .schema('se')
    .from('ai_suggestion_log')
    .insert({ user_id: user.id, fn: opts.fn })
  if (insertError) {
    console.error(`${opts.fn}: rate-limit insert failed`, insertError)
    return { response: jsonResponse({ error: 'server_error' }, 500, headers) }
  }

  // Housekeeping: drop this user's rows older than a day so the table stays small.
  await service
    .schema('se')
    .from('ai_suggestion_log')
    .delete()
    .eq('user_id', user.id)
    .lt('created_at', new Date(Date.now() - RETENTION_MS).toISOString())

  return { user }
}
