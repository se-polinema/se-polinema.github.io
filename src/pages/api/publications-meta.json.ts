import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import researchData from '../../data/research.json'

export const GET: APIRoute = async () => {
  const [pubs, researchers] = await Promise.all([
    getCollection('publications'),
    getCollection('researchers'),
  ])
  const years = [...new Set(pubs.map(p => p.data.year))].sort((a, b) => b - a)
  const types = [...new Set(pubs.map(p => p.data.type))].sort()

  const researcherStreamMap = new Map<string, string[]>()
  for (const r of researchers) {
    researcherStreamMap.set(r.id, r.data.streams ?? [])
  }

  const streamIdsWithPubs = new Set<string>()
  for (const pub of pubs) {
    const researcherIds = pub.data.researchers ?? []
    for (const rid of researcherIds) {
      const resStreams = researcherStreamMap.get(rid) ?? []
      for (const s of resStreams) streamIdsWithPubs.add(s)
    }
  }

  const streams = (researchData as { id: string; name: { en: string; id: string } }[])
    .filter((s) => streamIdsWithPubs.has(s.id))
    .map((s) => ({ id: s.id, nameEn: s.name.en, nameId: s.name.id }))

  return new Response(JSON.stringify({ years, types, streams }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
