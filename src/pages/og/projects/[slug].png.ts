import { getCollection } from 'astro:content'
import { generateOgImage } from '../../../lib/og-image'
import researchData from '../../../data/research.json'

export async function getStaticPaths() {
  const projects = await getCollection('projects')
  return projects.map((p) => ({
    params: { slug: p.id },
    props: { project: p },
  }))
}

export async function GET({ props }: { props: { project: any } }) {
  const { project } = props
  const { title, titleId, status, stream } = project.data

  const streamEntry = stream
    ? researchData.find((s: { id: string }) => s.id === stream)
    : null
  const streamName = streamEntry
    ? (streamEntry as { name: { en: string; id: string } }).name.en
    : undefined

  const png = await generateOgImage(
    'project',
    {
      title,
      titleId: titleId ?? undefined,
      status,
      stream: stream ?? undefined,
      streamName,
    },
    'en',
  )

  const headers = new Headers({
    'Content-Type': 'image/png',
    'Cache-Control': 'public, max-age=31536000, immutable',
  })
  return new Response(png as unknown as BodyInit, { headers })
}
