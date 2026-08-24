// Shared helpers for the Turnstile-gated Edge Functions (subscribe-newsletter,
// submit-alumni); see docs/issue-10-form-abuse-protection.md for why this
// exists: the site is a pure static Astro build with no server of its own,
// so verifying a Turnstile token requires an actual server hop, which these
// functions are.

const ALLOWED_ORIGINS = ['https://se.polinema.ac.id', 'http://localhost:4321']

// Verifies a Turnstile token against Cloudflare's siteverify endpoint using
// the TURNSTILE_SECRET_KEY function secret (set via `supabase secrets set`,
// never checked into config.toml; see deploy-supabase.yml).
export async function verifyTurnstile(token: string, remoteIp?: string): Promise<boolean> {
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY')
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY is not configured')
    return false
  }

  const body = new FormData()
  body.append('secret', secret)
  body.append('response', token)
  if (remoteIp) body.append('remoteip', remoteIp)

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    })
    const data = await res.json()
    return data.success === true
  } catch (err) {
    console.error('Turnstile verification request failed', err)
    return false
  }
}

// Reflects the request's Origin header back only if it's on the allowlist:
// both functions are called from the browser, so this is the CORS surface.
export function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') ?? ''
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }
}

export function jsonResponse(body: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), { status, headers })
}
