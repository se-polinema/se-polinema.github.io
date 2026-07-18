import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

// Build-time event dates for AdminDashboard.vue, joined client-side by slug
// against se.events (which has no date column of its own — see
// supabase/migrations/001_initial_schema.sql). Same category/managed filter
// as scripts/sync-events.mjs, so slugs here line up 1:1 with se.events rows.
export const GET: APIRoute = async () => {
  const posts = await getCollection('blog')

  const events = posts
    .filter((p) => p.data.category === 'event' && p.data.managed === true)
    .map((p) => ({
      slug: p.id,
      eventDate: (p.data.eventDate ?? p.data.date).toISOString(),
      eventEndDate: p.data.eventEndDate ? p.data.eventEndDate.toISOString() : null,
    }))

  return new Response(JSON.stringify(events), {
    headers: { 'Content-Type': 'application/json' },
  })
}
