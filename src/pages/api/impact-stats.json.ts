import type { APIRoute } from 'astro'
import { getLabImpactStats } from '../../lib/labStats'

export const GET: APIRoute = async () => {
  const stats = await getLabImpactStats()
  return new Response(JSON.stringify(stats), {
    headers: { 'Content-Type': 'application/json' },
  })
}
