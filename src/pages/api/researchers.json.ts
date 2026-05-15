import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const GET: APIRoute = async () => {
  const researchers = await getCollection('researchers')
  const data = researchers
    .sort((a, b) => a.data.order - b.data.order)
    .map(r => ({ id: r.id, name: r.data.name }))
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })
}
