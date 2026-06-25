import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { getCollection } from 'astro:content'
import { getMemberProjects, getMemberBooks } from './memberWorks'
import researchData from '../data/research.json'

export interface LabStats {
  researchers: number
  publications: number
  projects: number
  books: number
  focusAreas: number
  lastUpdated: string | null
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
