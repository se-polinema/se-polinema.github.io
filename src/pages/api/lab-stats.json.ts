import type { APIRoute } from 'astro'
import { getLabStats } from '../../lib/labStats'

export const GET: APIRoute = async () => {
  const stats = await getLabStats()
  return new Response(JSON.stringify(stats), {
    headers: { 'Content-Type': 'application/json' },
  })
}
