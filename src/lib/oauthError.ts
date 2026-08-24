// Supabase appends OAuth failures (e.g. a misconfigured provider secret) to
// the redirect URL as `error`/`error_code`/`error_description`: on the
// query string for some flows, on the URL hash for others. Read either,
// return a human message, and strip the params so a refresh doesn't
// re-show a stale error.
export function readOAuthError(): string {
  if (typeof window === 'undefined') return ''

  const search = new URLSearchParams(window.location.search)
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))

  const message =
    search.get('error_description') ||
    hash.get('error_description') ||
    search.get('error') ||
    hash.get('error') ||
    ''

  if (message) {
    const url = new URL(window.location.href)
    for (const key of ['error', 'error_code', 'error_description']) {
      url.searchParams.delete(key)
    }
    url.hash = ''
    window.history.replaceState(window.history.state, '', url.toString())
  }

  return message.replace(/\+/g, ' ')
}
