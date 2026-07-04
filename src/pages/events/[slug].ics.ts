import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { generateIcs, type IcsEventData } from '../../lib/ics'

export async function getStaticPaths() {
  const posts = await getCollection('blog')
  const events = posts.filter((post) => post.data.category === 'event')
  return events.map((post) => ({
    params: { slug: post.id },
  }))
}

export const GET: APIRoute = async ({ params, site }) => {
  const posts = await getCollection('blog')
  const post = posts.find((p) => p.id === params.slug)

  if (!post || post.data.category !== 'event') {
    return new Response('Not Found', { status: 404 })
  }

  const eventData: IcsEventData = {
    slug: post.id,
    title: post.data.title,
    titleId: post.data.titleId,
    excerpt: post.data.excerpt,
    excerptId: post.data.excerptId,
    eventDate: post.data.eventDate ?? post.data.date,
    eventEndDate: post.data.eventEndDate,
    location: post.data.location,
    eventLang: post.data.lang,
  }

  const baseUrl = site?.origin ?? 'https://se.polinema.ac.id'
  const ics = generateIcs(eventData, baseUrl)

  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${post.id}.ics"`,
    },
  })
}
