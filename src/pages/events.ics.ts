import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { generateIcsFeed, type IcsEventData } from '../lib/ics'

// All-events subscription feed: a single .ics a calendar client can add
// once (by URL) and have auto-update as events are announced, rather than
// downloading one-off files per event via events/[slug].ics.ts. Same
// category === 'event' filter as that per-event endpoint (not the
// managed === true filter used by events.json.ts/sync-events.mjs, which is
// about Supabase registration sync, a separate concern from "does this
// event have a calendar entry").
export const prerender = true

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection('blog')

  const events = posts
    .filter((post) => post.data.category === 'event')
    .sort((a, b) => {
      const aDate = (a.data.eventDate ?? a.data.date).getTime()
      const bDate = (b.data.eventDate ?? b.data.date).getTime()
      return aDate - bDate
    })
    .map(
      (post): IcsEventData => ({
        slug: post.id,
        title: post.data.title,
        titleId: post.data.titleId,
        excerpt: post.data.excerpt,
        excerptId: post.data.excerptId,
        eventDate: post.data.eventDate ?? post.data.date,
        eventEndDate: post.data.eventEndDate,
        location: post.data.location,
        eventLang: post.data.lang,
      })
    )

  const baseUrl = site?.origin ?? 'https://se.polinema.ac.id'
  const ics = generateIcsFeed(events, baseUrl)

  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
    },
  })
}
