// Turnstile-gated newsletter signup. Replaces NewsletterForm.vue's previous
// direct anon insert into se.subscribers (subscribers_insert_anon policy,
// dropped in 017_drop_subscribers_anon_insert.sql) — this function is now
// the only insert path, using the service-role key, so Turnstile
// verification actually gates the write rather than being a bypassable UI
// nicety.
import { createClient } from 'npm:@supabase/supabase-js@2'
import { verifyTurnstile, corsHeaders, jsonResponse } from '../_shared/turnstile.ts'

Deno.serve(async (req) => {
  const headers = corsHeaders(req)

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed' }, 405, headers)
  }

  let payload: { email?: string; language?: string; interests?: string[]; turnstileToken?: string }
  try {
    payload = await req.json()
  } catch {
    return jsonResponse({ error: 'bad_request' }, 400, headers)
  }

  const { email, language, interests, turnstileToken } = payload

  if (!email || typeof email !== 'string' || !turnstileToken) {
    return jsonResponse({ error: 'invalid_request' }, 400, headers)
  }

  const remoteIp = req.headers.get('cf-connecting-ip') ?? undefined
  const verified = await verifyTurnstile(turnstileToken, remoteIp)
  if (!verified) {
    return jsonResponse({ error: 'captcha_failed' }, 400, headers)
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { error } = await supabase
    .schema('se')
    .from('subscribers')
    .insert({
      email: email.trim().toLowerCase(),
      language: language === 'id' ? 'id' : 'en',
      interests: Array.isArray(interests) ? interests : [],
    })

  if (error) {
    if (error.code === '23505') {
      return jsonResponse({ error: 'duplicate' }, 409, headers)
    }
    console.error('subscribe-newsletter insert failed', error)
    return jsonResponse({ error: 'insert_failed' }, 500, headers)
  }

  return jsonResponse({ success: true }, 200, headers)
})
