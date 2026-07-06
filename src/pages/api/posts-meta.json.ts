import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { BLOG_CATEGORIES } from '../../content.config'

function slugify(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog')
  const categories = [...new Set(posts.map(p => p.data.category))].filter(c => (BLOG_CATEGORIES as readonly string[]).includes(c)).sort()

  const tagSet = new Set<string>()
  for (const post of posts) {
    const tags = post.data.tags ?? []
    const tagsId = post.data.tagsId ?? []
    for (const t of tags) { const s = slugify(t); if (s) tagSet.add(s) }
    for (const t of tagsId) { const s = slugify(t); if (s) tagSet.add(s) }
  }
  const tags = Array.from(tagSet).sort()

  return new Response(JSON.stringify({ categories, tags }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
