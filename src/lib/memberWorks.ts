import { getCollection } from 'astro:content'

export interface MemberProject {
  name?: string
  repo: string
  description?: string
  researcherId: string
  researcherName: string
}

export interface MemberBook {
  title: string
  playstoreUrl?: string
  coverImage?: string
  description?: string
  researcherId: string
  researcherName: string
}

export async function getMemberProjects(): Promise<MemberProject[]> {
  const researchers = await getCollection('researchers')
  return researchers
    .flatMap((r) =>
      (r.data.projects ?? []).map((p) => ({
        ...p,
        researcherId: r.id,
        researcherName: r.data.name,
      })),
    )
    .sort((a, b) => a.researcherName.localeCompare(b.researcherName))
}

export async function getMemberBooks(): Promise<MemberBook[]> {
  const researchers = await getCollection('researchers')
  return researchers
    .flatMap((r) =>
      (r.data.books ?? []).map((b) => ({
        ...b,
        researcherId: r.id,
        researcherName: r.data.name,
      })),
    )
    .sort((a, b) => a.title.localeCompare(b.title))
}

export interface MemberDeck {
  title: string
  url: string
  type: 'web' | 'pdf' | 'pptx' | 'google-slides' | 'canva' | 'other'
  embedUrl?: string
  description?: string
  date?: string
  researcherId: string
  researcherName: string
}

export async function getMemberDecks(): Promise<MemberDeck[]> {
  const researchers = await getCollection('researchers')
  return researchers
    .flatMap((r) =>
      (r.data.decks ?? []).map((d) => ({
        ...d,
        url: d.url.toString(),
        embedUrl: d.embedUrl?.toString(),
        researcherId: r.id,
        researcherName: r.data.name,
      })),
    )
    .sort((a, b) => a.title.localeCompare(b.title))
}
