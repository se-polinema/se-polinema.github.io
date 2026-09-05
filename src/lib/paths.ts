// Base-path awareness for the dual deploy: production serves from '/', the
// beta build (BASE_PATH=/beta/ in CI, develop branch) serves from '/beta/'.
// Store all internal paths base-free ("/members", not "/beta/members") and
// apply withBase() exactly once, at the render or navigation edge. Applying
// it twice would double-prefix; withBase() guards against that, but the
// convention is to only ever call it once per path.

const RAW_BASE = import.meta.env.BASE_URL ?? '/'

/** Always has a leading and trailing slash: '/' in production, '/beta/' on beta. */
export const BASE = RAW_BASE.endsWith('/') ? RAW_BASE : `${RAW_BASE}/`

/** True when the current build is served from a subdirectory (e.g. beta). */
export const IS_BASE_DEPLOY = BASE !== '/'

const EXTERNAL_OR_SPECIAL = /^([a-z][a-z0-9+.-]*:|\/\/|#|\?)/i

/**
 * Prefixes a base-free, root-absolute path with the active BASE.
 * Passes through external URLs, protocol-relative URLs, hashes, and query
 * strings unchanged. Idempotent: calling it on an already-prefixed path is a
 * no-op rather than double-prefixing.
 */
export function withBase(path: string): string {
  if (!path || EXTERNAL_OR_SPECIAL.test(path)) return path
  if (BASE === '/') return path
  if (path === '/') return BASE
  if (path === BASE || path.startsWith(BASE)) return path
  const clean = path.startsWith('/') ? path.slice(1) : path
  return BASE + clean
}

/**
 * Strips the active BASE from a pathname (e.g. from window.location.pathname)
 * so existing root-relative comparison logic keeps working under a subdirectory
 * deploy. Safe to call even when BASE is '/'.
 */
export function stripBase(pathname: string): string {
  if (BASE === '/' || !pathname) return pathname
  const baseNoTrailingSlash = BASE.slice(0, -1)
  if (pathname === baseNoTrailingSlash) return '/'
  if (pathname.startsWith(BASE)) return `/${pathname.slice(BASE.length)}`
  return pathname
}
