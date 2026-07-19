import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

// Full lightweight metadata for every blog post — the same shape
// src/pages/blog/index.astro used to bake directly into the archive
// page's props. Fetched client-side by BlogArchivePage.vue instead, so
// the archive page's own HTML stays constant-size as the collection
// grows (see the pagination plan for why this matters long-term).
export const GET: APIRoute = async () => {
  const allPosts = await getCollection('blog')
  const posts = allPosts
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map((post) => ({
      id: post.id,
      title: post.data.title,
      titleId: post.data.titleId,
      excerpt: post.data.excerpt,
      excerptId: post.data.excerptId,
      category: post.data.category,
      date: post.data.date,
      tags: post.data.tags,
      tagsId: post.data.tagsId,
    }))

  return new Response(JSON.stringify(posts), {
    headers: { 'Content-Type': 'application/json' },
  })
}
