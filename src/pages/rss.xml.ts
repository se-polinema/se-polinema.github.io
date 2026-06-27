import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const prerender = true

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection('blog')

  posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

  const siteUrl = (site ?? new URL('https://se.polinema.ac.id')).toString()

  const items = posts
    .map((post) => {
      const url = new URL(`/blog/${post.id}`, siteUrl).toString()
      const title =
        post.data.lang === 'id' && post.data.titleId
          ? post.data.titleId
          : post.data.title
      const excerpt = post.data.excerpt || ''
      const excerptId = post.data.excerptId || ''
      const titleId = post.data.titleId || ''

      let descriptionHtml = ''
      descriptionHtml += `<p>${escapeXml(excerpt)}</p>`
      if (titleId) {
        descriptionHtml += `<p lang="id"><em>${escapeXml(titleId)}</em> — ${escapeXml(excerptId)}</p>`
      }

      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${post.data.date.toUTCString()}</pubDate>
      <author>${escapeXml(post.data.author)}</author>
      <category>${escapeXml(post.data.category)}</category>
      <description>${escapeXml(descriptionHtml)}</description>
    </item>`
    })
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>SE Lab Blog — JTI Polinema</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>Software Engineering Laboratory at Politeknik Negeri Malang — announcements, news, and tutorials.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(new URL('/rss.xml', siteUrl).toString())}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
