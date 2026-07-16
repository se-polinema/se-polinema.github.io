import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { BLOG_CATEGORIES } from '../../content.config'

function slugify(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog')
  const categories = [...new Set(posts.map(p => p.data.category))].filter(c => (BLOG_CATEGORIES as readonly string[]).includes(c)).sort()

  const tagSetEn = new Set<string>()
  const tagSetId = new Set<string>()
  for (const post of posts) {
    const tags = post.data.tags ?? []
    const tagsId = post.data.tagsId ?? []
    for (const t of tags) { const s = slugify(t); if (s) tagSetEn.add(s) }
    for (const t of tagsId) { const s = slugify(t); if (s) tagSetId.add(s) }
  }
  // Grouped by language so the UI can show only the tags relevant to the
  // active site language instead of a merged, doubled-up list.
  const tags = {
    en: Array.from(tagSetEn).sort(),
    id: Array.from(tagSetId).sort(),
  }

  return new Response(JSON.stringify({ categories, tags }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
