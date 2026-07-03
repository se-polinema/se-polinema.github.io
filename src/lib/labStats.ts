import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { getCollection } from 'astro:content'
import { getMemberProjects, getMemberBooks } from './memberWorks'
import researchData from '../data/research.json'
import achievementsData from '../data/achievements.json'
import learningTracksData from '../data/learning-tracks.json'

export interface LabStats {
  researchers: number
  publications: number
  projects: number
  books: number
  focusAreas: number
  lastUpdated: string | null
}

export interface ImpactStats extends LabStats {
  tutorials: number
  events: number
  achievements: number
  publicationsByYear: Record<number, number>
  publicationsByType: Record<string, number>
  publicationsByStream: Record<string, number>
  researcherStats: ResearcherStat[]
  streamNames: Record<string, { en: string; id: string }>
}

export interface ResearcherStat {
  id: string
  name: string
  publicationCount: number
  primaryStream: string | null
  primaryStreamEn: string | null
  primaryStreamId: string | null
}

function buildStreamNameMap(): Record<string, { en: string; id: string }> {
  const map: Record<string, { en: string; id: string }> = {}
  for (const stream of researchData as { id: string; name: { en: string; id: string } }[]) {
    map[stream.id] = { en: stream.name.en, id: stream.name.id }
  }
  return map
}

export async function getLabImpactStats(): Promise<ImpactStats> {
  const [researchers, publications, projects, books] = await Promise.all([
    getCollection('researchers'),
    getCollection('publications'),
    getMemberProjects(),
    getMemberBooks(),
  ])

  let lastUpdated: string | null = null
  const syncMetaPath = resolve('src/data/_sync-meta.json')
  if (existsSync(syncMetaPath)) {
    try {
      const meta = JSON.parse(readFileSync(syncMetaPath, 'utf-8'))
      lastUpdated = meta.lastUpdated ?? null
    } catch {
      lastUpdated = null
    }
  }

  const publicationsByYear: Record<number, number> = {}
  const publicationsByType: Record<string, number> = {}

  for (const pub of publications) {
    const year = pub.data.year
    publicationsByYear[year] = (publicationsByYear[year] ?? 0) + 1
    const type = pub.data.type
    publicationsByType[type] = (publicationsByType[type] ?? 0) + 1
  }

  const researcherStreamMap = new Map<string, string[]>()
  for (const r of researchers) {
    researcherStreamMap.set(r.id, r.data.streams ?? [])
  }

  const streamNames = buildStreamNameMap()

  const publicationsByStream: Record<string, number> = {}
  for (const pub of publications) {
    const researcherIds = pub.data.researchers ?? []
    const streamsTouched = new Set<string>()
    for (const rid of researcherIds) {
      const resStreams = researcherStreamMap.get(rid) ?? []
      for (const s of resStreams) streamsTouched.add(s)
    }
    for (const s of streamsTouched) {
      if (streamNames[s]) {
        const key = streamNames[s].en
        publicationsByStream[key] = (publicationsByStream[key] ?? 0) + 1
      }
    }
  }

  const researcherStats: ResearcherStat[] = researchers.map((r) => {
    const pubCount = publications.filter((p) =>
      (p.data.researchers ?? []).includes(r.id),
    ).length
    const streams = r.data.streams ?? []
    const primaryStream = streams[0] ?? null
    const primaryStreamEn = primaryStream && streamNames[primaryStream] ? streamNames[primaryStream].en : null
    const primaryStreamId = primaryStream && streamNames[primaryStream] ? streamNames[primaryStream].id : null
    return {
      id: r.id,
      name: r.data.name,
      publicationCount: pubCount,
      primaryStream,
      primaryStreamEn,
      primaryStreamId,
    }
  }).sort((a, b) => b.publicationCount - a.publicationCount)

  const blogPosts = await getCollection('blog')

  // Count blog posts with category "tutorial" (not learning-track steps)
  const tutorialCount = blogPosts
    .filter((post) => post.data.category === 'tutorial').length

  const eventCount = blogPosts
    .filter((post) => post.data.category === 'event').length

  // Build-time regression guard: if tutorialCount ever equals the sum of all
  // learning-track steps (the old buggy behaviour), fail the build.
  // This prevents the data source from accidentally being changed back.
  const learningTrackStepCount = (learningTracksData as { steps?: unknown[] }[])
    .reduce((sum, track) => sum + ((track as { steps?: unknown[] }).steps?.length ?? 0), 0)
  if (tutorialCount === learningTrackStepCount) {
    throw new Error(
      'Regression detected: tutorialCount equals total learning-track steps instead of blog tutorial posts.',
    )
  }

  const achievementCount = (achievementsData as unknown[]).length

  return {
    researchers: researchers.length,
    publications: publications.length,
    projects: projects.length,
    books: books.length,
    focusAreas: (researchData as unknown[]).length,
    lastUpdated,
    tutorials: tutorialCount,
    events: eventCount,
    achievements: achievementCount,
    publicationsByYear,
    publicationsByType,
    publicationsByStream,
    researcherStats,
    streamNames,
  }
}

export async function getLabStats(): Promise<LabStats> {
  const [researchers, publications, projects, books] = await Promise.all([
    getCollection('researchers'),
    getCollection('publications'),
    getMemberProjects(),
    getMemberBooks(),
  ])

  let lastUpdated: string | null = null
  const syncMetaPath = resolve('src/data/_sync-meta.json')
  if (existsSync(syncMetaPath)) {
    try {
      const meta = JSON.parse(readFileSync(syncMetaPath, 'utf-8'))
      lastUpdated = meta.lastUpdated ?? null
    } catch {
      lastUpdated = null
    }
  }

  return {
    researchers: researchers.length,
    publications: publications.length,
    projects: projects.length,
    books: books.length,
    focusAreas: (researchData as unknown[]).length,
    lastUpdated,
  }
}
