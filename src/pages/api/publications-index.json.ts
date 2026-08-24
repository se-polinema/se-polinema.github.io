import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

// Full lightweight metadata for every publication, the same shape
// src/pages/publications/index.astro used to bake directly into the
// archive page's props. Fetched client-side by PublicationsArchive.vue
// instead, so the archive page's own HTML stays constant-size as the
// collection grows (see the pagination plan for why this matters
// long-term). Author/stream lookup data (researchers, streamNames) stays
// a build-time prop on the page: it scales with researcher count, not
// publication count, so it doesn't need this treatment.
export const GET: APIRoute = async () => {
  const allPublications = await getCollection('publications')
  const publications = allPublications
    .sort((a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title))
    .map((publication) => ({
      id: publication.id,
      title: publication.data.title,
      year: publication.data.year,
      authors: publication.data.authors,
      venue: publication.data.venue,
      type: publication.data.type,
      url: publication.data.url,
      researchers: publication.data.researchers,
    }))

  return new Response(JSON.stringify(publications), {
    headers: { 'Content-Type': 'application/json' },
  })
}
