import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { createClient } from '@supabase/supabase-js'

export interface SearchEntry {
  id: string
  type: 'researcher' | 'publication' | 'blog' | 'project' | 'event' | 'member'
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
      href: `/publications/${p.id}`,
      searchText,
    })
  }

  const projects = await getCollection('projects')
  for (const p of projects) {
    const title = p.data.title
    const titleId = p.data.titleId || title
    const excerpt = p.data.description
    const excerptId = p.data.descriptionId || excerpt
    const searchText = normalize([
      title,
      titleId,
      excerpt,
      excerptId,
      p.data.status,
      ...p.data.techStack,
      ...p.data.contributors,
      ...p.data.researchers,
      p.data.stream,
    ].filter(Boolean).join(' '))
    entries.push({
      id: p.id,
      type: 'project',
      title,
      titleId,
      excerpt,
      excerptId,
      href: `/projects/${p.id}`,
      searchText,
    })
  }

  const posts = await getCollection('blog')
  for (const post of posts) {
    const isEvent = post.data.category === 'event'
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
      isEvent ? post.data.location : '',
      isEvent && post.data.locationId ? post.data.locationId : '',
    ].filter(Boolean).join(' '))
    entries.push({
      id: post.id,
      type: isEvent ? 'event' : 'blog',
      title,
      titleId,
      excerpt,
      excerptId,
      href: isEvent ? `/events/${post.id}` : `/blog/${post.id}`,
      searchText,
    })
  }

  // se.members (alumni/student directory) is runtime Supabase data, not a
  // content collection: fetched here at build time so it's searchable
  // alongside everything else. Only approved rows are needed, which are
  // already fully public via the members_select_approved RLS policy, so
  // the anon key (already available in this build step) is sufficient; no
  // service-role key needed. persistSession: false since there's no
  // localStorage in a Node build; mirrors scripts/sync-events.mjs /
  // scripts/migrate-member-photos.mjs's server-side client setup.
  try {
    const url = import.meta.env.PUBLIC_SUPABASE_URL
    const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY
    if (url && key) {
      const supabase = createClient(url, key, {
        db: { schema: 'se' },
        auth: { persistSession: false },
      })
      const { data: members, error } = await supabase
        .from('members')
        .select('id, name, status, role_id, role_en, current_role_id, current_role_en, current_organization_id, current_organization_en')
        .eq('approved', true)

      if (error) throw error

      for (const m of members ?? []) {
        const positionEn = [m.current_role_en, m.current_organization_en ? `at ${m.current_organization_en}` : ''].filter(Boolean).join(' ')
        const positionId = [m.current_role_id, m.current_organization_id ? `di ${m.current_organization_id}` : ''].filter(Boolean).join(' ')
        const excerpt = positionEn || (m.status === 'alumni' ? 'Alumni' : 'Student')
        const excerptId = positionId || (m.status === 'alumni' ? 'Alumni' : 'Mahasiswa')
        const searchText = normalize([
          m.name,
          m.role_id,
          m.role_en,
          m.current_role_id,
          m.current_role_en,
          m.current_organization_id,
          m.current_organization_en,
        ].filter(Boolean).join(' '))
        entries.push({
          id: m.id,
          type: 'member',
          title: m.name,
          titleId: m.name,
          excerpt,
          excerptId,
          href: `/profile?id=${m.id}`,
          searchText,
        })
      }
    }
  } catch (err) {
    console.warn('search-index: skipping members (Supabase fetch failed):', err instanceof Error ? err.message : err)
  }

  return new Response(JSON.stringify(entries), {
    headers: { 'Content-Type': 'application/json' },
  })
}
