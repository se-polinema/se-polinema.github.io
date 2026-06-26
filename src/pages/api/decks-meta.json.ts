import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const GET: APIRoute = async () => {
  const researchers = await getCollection('researchers')

  const members = researchers
    .filter((r) => r.data.decks?.length)
    .map((r) => ({ id: r.id, name: r.data.name }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const types = [
    ...new Set(
      researchers.flatMap((r) => (r.data.decks ?? []).map((d) => d.type)),
    ),
  ].sort()

  return new Response(JSON.stringify({ members, types }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
