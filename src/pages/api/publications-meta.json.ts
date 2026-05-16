import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const GET: APIRoute = async () => {
  const pubs = await getCollection('publications')
  const years = [...new Set(pubs.map(p => p.data.year))].sort((a, b) => b - a)
  const types = [...new Set(pubs.map(p => p.data.type))].sort()
  return new Response(JSON.stringify({ years, types }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
