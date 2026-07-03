import { getCollection } from 'astro:content'
import { generateOgImage } from '../../../lib/og-image'

export async function getStaticPaths() {
  const publications = await getCollection('publications')
  return publications.map((p) => ({
    params: { slug: p.id },
    props: { publication: p },
  }))
}

export async function GET({ props }: { props: { publication: any } }) {
  const { publication } = props
  const { title, year, type, venue, authors, language } = publication.data

  const png = await generateOgImage(
    'publication',
    {
      title,
      year,
      type,
      venue,
      authors,
      language: language as 'en' | 'id',
    },
    (language as 'en' | 'id') ?? 'en',
  )

  const headers = new Headers({
    'Content-Type': 'image/png',
    'Cache-Control': 'public, max-age=31536000, immutable',
  })
  return new Response(png as unknown as BodyInit, { headers })
}
