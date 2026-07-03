import { getCollection } from 'astro:content'
import { generateOgImage } from '../../../lib/og-image'

export async function getStaticPaths() {
  const posts = await getCollection('blog')
  return posts.map((p) => ({
    params: { slug: p.id },
    props: { post: p },
  }))
}

export async function GET({ props }: { props: { post: any } }) {
  const { post } = props
  const { title, titleId, category, author, lang } = post.data

  const bodyText = post.body ?? ''
  const wordCount = bodyText
    .replace(/[#*`_\[\]()>|{}.!\-:~=<>]/g, ' ')
    .replace(/<[^>]*>/g, '')
    .split(/\s+/)
    .filter(Boolean).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  const png = await generateOgImage(
    'blog',
    {
      title,
      titleId: titleId ?? undefined,
      category,
      author,
      readingTime,
      lang: lang as 'en' | 'id',
    },
    (lang as 'en' | 'id') ?? 'en',
  )

  const headers = new Headers({
    'Content-Type': 'image/png',
    'Cache-Control': 'public, max-age=31536000, immutable',
  })
  return new Response(png as unknown as BodyInit, { headers })
}
