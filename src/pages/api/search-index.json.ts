import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export interface SearchEntry {
  id: string
  type: 'researcher' | 'publication' | 'blog'
  title: string
  titleId: string
  excerpt: string
  excerptId: string
  href: string
  searchText: string
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ')
}

export const GET: APIRoute = async () => {
  const entries: SearchEntry[] = []

  const researchers = await getCollection('researchers')
  for (const r of researchers) {
    const title = r.data.name
    const titleId = r.data.name
    const excerpt = [r.data.title.en, ...r.data.expertise].filter(Boolean).join(' · ')
    const excerptId = [r.data.title.id, ...r.data.expertise].filter(Boolean).join(' · ')
    const searchText = normalize([
      title,
      r.data.title.en,
      r.data.title.id,
      r.data.role.en,
      r.data.role.id,
      r.data.shortBio.en,
      r.data.shortBio.id,
      ...r.data.expertise,
    ].filter(Boolean).join(' '))
    entries.push({
      id: r.id,
      type: 'researcher',
      title,
      titleId,
      excerpt,
      excerptId,
      href: `/researchers/${r.id}`,
      searchText,
    })
  }

  const publications = await getCollection('publications')
  for (const p of publications) {
    const title = p.data.title
    const titleId = p.data.title
    const excerpt = [p.data.venue, p.data.authors.join(', '), p.data.type].filter(Boolean).join(' · ')
    const excerptId = [p.data.venue, p.data.authors.join(', '), p.data.type].filter(Boolean).join(' · ')
    const searchText = normalize([
      title,
      p.data.venue,
      ...p.data.authors,
      p.data.type,
      String(p.data.year),
    ].filter(Boolean).join(' '))
    entries.push({
      id: p.id,
      type: 'publication',
      title,
      titleId,
      excerpt,
      excerptId,
      href: `/publications`,
      searchText,
    })
  }

  const posts = await getCollection('blog')
  for (const post of posts) {
    const title = post.data.title
    const titleId = post.data.titleId || title
    const excerpt = post.data.excerpt || ''
    const excerptId = post.data.excerptId || excerpt
    const searchText = normalize([
      title,
      titleId,
      excerpt,
      excerptId,
      post.data.author,
      post.data.category,
    ].filter(Boolean).join(' '))
    entries.push({
      id: post.id,
      type: 'blog',
      title,
      titleId,
      excerpt,
      excerptId,
      href: `/blog/${post.id}`,
      searchText,
    })
  }

  return new Response(JSON.stringify(entries), {
    headers: { 'Content-Type': 'application/json' },
  })
}
