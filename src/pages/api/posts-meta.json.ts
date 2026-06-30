import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { BLOG_CATEGORIES } from '../../content.config'

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog')
  const categories = [...new Set(posts.map(p => p.data.category))].filter(c => (BLOG_CATEGORIES as readonly string[]).includes(c)).sort()
  return new Response(JSON.stringify({ categories }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
