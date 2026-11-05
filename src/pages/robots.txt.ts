import type { APIRoute } from 'astro'
import { IS_BASE_DEPLOY } from '../lib/paths'

export const prerender = true

// Crawlers only honor /robots.txt at the host root, so the beta build (served
// from /beta/) is effectively covered by the production file. The beta branch
// here still disallows everything in case it is ever served on its own host.
const PRIVATE_PATHS = ['/admin', '/account', '/login', '/register', '/profile', '/checkin']

export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? 'https://se.polinema.ac.id'
  const lines = IS_BASE_DEPLOY
    ? ['User-agent: *', 'Disallow: /']
    : [
        'User-agent: *',
        'Allow: /',
        ...PRIVATE_PATHS.map((p) => `Disallow: ${p}`),
        '',
        `Sitemap: ${origin}/sitemap-index.xml`,
      ]
  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
