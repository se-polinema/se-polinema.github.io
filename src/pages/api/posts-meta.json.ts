import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog')
  const categories = [...new Set(posts.map(p => p.data.category))].sort()
  return new Response(JSON.stringify({ categories }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
