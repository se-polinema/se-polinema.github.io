import { getCollection } from 'astro:content'

export interface MemberProject {
  name?: string
  nameId?: string
  repo: string
  description?: string
  descriptionId?: string
  researcherId: string
  researcherName: string
  slug?: string
  status?: string
  stream?: string
  techStack?: string[]
  images?: string[]
  contributors?: string[]
  demoUrl?: string
  featured?: boolean
}

export interface MemberBook {
  title: string
  titleId?: string
  playstoreUrl?: string
  coverImage?: string
  description?: string
  descriptionId?: string
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

export async function getCollectionProjects(): Promise<MemberProject[]> {
  const [projects, researchers] = await Promise.all([
    getCollection('projects'),
    getCollection('researchers'),
  ])
  const researcherMap = new Map(researchers.map((r) => [r.id, r.data.name]))

  return projects
    .map((p) => {
      const primaryResearcherId = p.data.researchers[0] ?? 'unknown'
      const primaryResearcherName = researcherMap.get(primaryResearcherId) ?? 'SE Lab'
      return {
        name: p.data.title,
        nameId: p.data.titleId,
        repo: p.data.repo,
        description: p.data.description,
        descriptionId: p.data.descriptionId,
        researcherId: primaryResearcherId,
        researcherName: primaryResearcherName,
        slug: p.id,
        status: p.data.status,
        stream: p.data.stream,
        techStack: p.data.techStack,
        images: p.data.images,
        contributors: p.data.contributors,
        demoUrl: p.data.demoUrl,
        featured: p.data.featured,
      }
    })
    .sort((a, b) => (a.name ?? a.repo).localeCompare(b.name ?? b.repo))
}
