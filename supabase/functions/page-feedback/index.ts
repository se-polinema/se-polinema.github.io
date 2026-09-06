// Turnstile-gated page feedback ingestion. The client (PageFeedback.vue)
// collects an anonymous thumbs-up/down vote + optional comment and posts it
// here; this function verifies the Turnstile token then writes the row with
// the service-role key. There is no anon INSERT policy on se.page_feedback, so
// this is the only write path and Turnstile actually gates the insert (same
// pattern as subscribe-newsletter).
import { createClient } from 'npm:@supabase/supabase-js@2'
import { verifyTurnstile, corsHeaders, jsonResponse } from '../_shared/turnstile.ts'

interface FeedbackPayload {
  turnstileToken?: string
  page_path?: string
  page_type?: string
  slug?: string
  lang?: string
  vote?: string
  comment?: string | null
  visitor_hash?: string
}

Deno.serve(async (req) => {
  const headers = corsHeaders(req)

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed' }, 405, headers)
  }

  let payload: FeedbackPayload
  try {
    payload = await req.json()
  } catch {
    return jsonResponse({ error: 'bad_request' }, 400, headers)
  }

  const { page_path, page_type, slug, lang, vote, visitor_hash, turnstileToken } = payload

  if (!turnstileToken || !page_path || !slug || !visitor_hash) {
    return jsonResponse({ error: 'invalid_request' }, 400, headers)
  }

  if (page_type !== 'tutorial' && page_type !== 'publication' && page_type !== 'blog') {
    return jsonResponse({ error: 'invalid_request' }, 400, headers)
  }

  if (vote !== 'helpful' && vote !== 'not_helpful') {
    return jsonResponse({ error: 'invalid_request' }, 400, headers)
  }

  const comment = typeof payload.comment === 'string' ? payload.comment.trim().slice(0, 500) : null

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
    .from('page_feedback')
    .insert({
      page_path,
      page_type,
      slug,
      lang: lang === 'id' ? 'id' : 'en',
      vote,
      comment: comment || null,
      visitor_hash,
    })

  if (error) {
    // A duplicate vote (same page_path + visitor_hash) is a normal,
    // non-fatal outcome: the visitor already voted this page this session.
    if (error.code === '23505') {
      return jsonResponse({ error: 'duplicate' }, 409, headers)
    }
    console.error('page-feedback insert failed', error)
    return jsonResponse({ error: 'insert_failed' }, 500, headers)
  }

  return jsonResponse({ success: true }, 200, headers)
})
