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
  const publications = await getCollection('publications')

  publications.sort((a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title))

  const siteUrl = (site ?? new URL('https://se.polinema.ac.id')).toString()

  const items = publications
    .map((pub) => {
      const url = new URL(`/publications/${pub.id}`, siteUrl).toString()
      const title = pub.data.title
      const authors = pub.data.authors.join(', ')
      const venue = pub.data.venue
      const year = pub.data.year
      const pubType = pub.data.type
      const doi = pub.data.doi
      const externalUrl = pub.data.url

      let descriptionHtml = ''
      descriptionHtml += `<p>${escapeXml(authors)}</p>`
      descriptionHtml += `<p><em>${escapeXml(venue)}</em> (${year}) — ${escapeXml(pubType)}</p>`
      if (doi) {
        descriptionHtml += `<p>DOI: <a href="https://doi.org/${escapeXml(doi)}">${escapeXml(doi)}</a></p>`
      }
      descriptionHtml += `<p><a href="${escapeXml(externalUrl)}">${escapeXml(externalUrl)}</a></p>`

      const itemXml = `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${new Date(year, 0, 1).toUTCString()}</pubDate>
      <author>${escapeXml(authors)}</author>
      <category>${escapeXml(pubType)}</category>
      <description>${escapeXml(descriptionHtml)}</description>
    </item>`

      return itemXml
    })
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>SE Lab Publications — JTI Polinema | Publikasi SE Lab — JTI Polinema</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>Scholarly publications from the Software Engineering Laboratory at Politeknik Negeri Malang. | Publikasi ilmiah dari Software Engineering Laboratory, Politeknik Negeri Malang.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(new URL('/publications.xml', siteUrl).toString())}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
