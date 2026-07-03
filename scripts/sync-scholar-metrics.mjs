import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { scholarly } from 'node-scholarly'
import matter from 'gray-matter'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const RESEARCHERS_DIR = resolve(ROOT, 'src/content/researchers')
const PUBLICATIONS_DIR = resolve(ROOT, 'src/content/publications')
const DATA_DIR = resolve(ROOT, 'src/data')
const METRICS_FILE = resolve(DATA_DIR, '_scholar-metrics.json')

const PUBLICATION_LIMIT = 20
const REQUEST_DELAY_MS = 8000
const MAX_RETRIES = 3

scholarly.setTimeout(30000)
scholarly.setRetries(MAX_RETRIES)

function getGoogleScholarUserId(url) {
  const match = url.match(/user=([^&]+)/)
  return match ? match[1] : null
}

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function loadResearchers() {
  if (!existsSync(RESEARCHERS_DIR)) {
    console.error('Researchers directory not found:', RESEARCHERS_DIR)
    return []
  }

  const files = readdirSync(RESEARCHERS_DIR).filter(f => f.endsWith('.md'))
  const researchers = []

  for (const file of files) {
    const content = readFileSync(resolve(RESEARCHERS_DIR, file), 'utf-8')
    const { data } = matter(content)
    const slug = file.replace('.md', '')
    const userId = getGoogleScholarUserId(data.googleScholarUrl || '')

    if (userId) {
      researchers.push({ slug, name: data.name, userId })
    } else {
      console.warn(`  Warning: No Google Scholar user ID found for ${slug}`)
    }
  }

  return researchers
}

function loadExistingPublications() {
  const existing = []
  if (!existsSync(PUBLICATIONS_DIR)) return existing

  const files = readdirSync(PUBLICATIONS_DIR).filter(f => f.endsWith('.md'))
  for (const file of files) {
    const content = readFileSync(resolve(PUBLICATIONS_DIR, file), 'utf-8')
    const { data } = matter(content)
    if (data.title && data.year) {
      existing.push({
        file,
        key: `${normalizeTitle(data.title)}-${data.year}`,
        title: data.title,
        year: data.year,
      })
    }
  }
  return existing
}

async function fetchMetricsForResearcher(researcher) {
  console.log(`Fetching metrics for ${researcher.name} (${researcher.slug})...`)

  try {
    const author = await scholarly.searchAuthorId(researcher.userId, true, 'date', PUBLICATION_LIMIT)

    const metrics = {
      researcher: researcher.slug,
      name: researcher.name,
      scholarId: researcher.userId,
      citedby: author.citedby ?? 0,
      citedby5y: author.citedby5y ?? 0,
      hindex: author.hindex ?? 0,
      hindex5y: author.hindex5y ?? 0,
      i10index: author.i10index ?? 0,
      i10index5y: author.i10index5y ?? 0,
    }

    const publicationCitations = {}
    const publications = author.publications || []

    for (const pub of publications) {
      const bib = pub.bib || {}
      const title = (bib.title || '').trim()
      const pubYear = bib.pub_year ? parseInt(bib.pub_year, 10) : null

      if (!title || !pubYear) continue

      const key = `${normalizeTitle(title)}-${pubYear}`
      const numCitations = pub.num_citations ?? 0
      publicationCitations[key] = {
        title,
        year: pubYear,
        citedByCount: numCitations,
      }
    }

    return { metrics, publicationCitations }
  } catch (err) {
    console.error(`  Error fetching metrics for ${researcher.name}:`, err.message)
    return {
      metrics: {
        researcher: researcher.slug,
        name: researcher.name,
        scholarId: researcher.userId,
        citedby: 0,
        citedby5y: 0,
        hindex: 0,
        hindex5y: 0,
        i10index: 0,
        i10index5y: 0,
        _error: err.message,
      },
      publicationCitations: {},
    }
  }
}

async function main() {
  console.log('=== Scholar Metrics Sync ===\n')

  console.log('Loading researchers...')
  const researchers = loadResearchers()

  if (researchers.length === 0) {
    console.log('No researchers with Google Scholar URLs found. Exiting.')
    return
  }

  console.log(`Found ${researchers.length} researchers with Google Scholar profiles.\n`)

  console.log('Loading existing publications...')
  const existing = loadExistingPublications()
  const existingMap = new Map()
  for (const pub of existing) {
    existingMap.set(pub.key, pub)
  }
  console.log(`Found ${existing.length} existing publications.\n`)

  const researcherMetrics = []
  const allPublicationCitations = {}
  const errors = []

  for (let i = 0; i < researchers.length; i++) {
    const researcher = researchers[i]
    const result = await fetchMetricsForResearcher(researcher)
    researcherMetrics.push(result.metrics)

    if (result.metrics._error) {
      errors.push(`${researcher.name}: ${result.metrics._error}`)
    }

    for (const [key, citation] of Object.entries(result.publicationCitations)) {
      if (existingMap.has(key)) {
        allPublicationCitations[key] = citation
      } else if (allPublicationCitations[key]) {
        if (citation.citedByCount > allPublicationCitations[key].citedByCount) {
          allPublicationCitations[key] = citation
        }
      } else {
        allPublicationCitations[key] = citation
      }
    }

    if (i < researchers.length - 1) {
      console.log(`  Waiting ${REQUEST_DELAY_MS / 1000}s before next request...`)
      await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS))
    }
  }

  const totalLabCitedby = researcherMetrics.reduce((sum, m) => sum + (m.citedby || 0), 0)
  const totalLabCitedby5y = researcherMetrics.reduce((sum, m) => sum + (m.citedby5y || 0), 0)

  const citationCounts = Object.values(allPublicationCitations).map(p => p.citedByCount || 0)
  const totalPubCitations = citationCounts.reduce((sum, c) => sum + c, 0)
  const avgCitations = citationCounts.length > 0
    ? Math.round((totalPubCitations / citationCounts.length) * 100) / 100
    : 0

  const mostCited = Object.entries(allPublicationCitations)
    .sort((a, b) => (b[1].citedByCount || 0) - (a[1].citedByCount || 0))
    .slice(0, 10)
    .map(([key, val]) => ({
      key,
      title: val.title,
      year: val.year,
      citedByCount: val.citedByCount || 0,
    }))

  const metricsData = {
    lastUpdated: new Date().toISOString(),
    labMetrics: {
      totalCitations: totalLabCitedby,
      totalCitations5y: totalLabCitedby5y,
      totalCitedPublications: Object.keys(allPublicationCitations).length,
      totalPublicationCitations: totalPubCitations,
      avgCitationsPerPublication: avgCitations,
    },
    researcherMetrics,
    publicationCitations: allPublicationCitations,
    mostCitedPublications: mostCited,
    errors: errors.length > 0 ? errors : undefined,
  }

  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true })
  }

  writeFileSync(METRICS_FILE, JSON.stringify(metricsData, null, 2) + '\n', 'utf-8')
  console.log(`\nMetrics written to ${METRICS_FILE}`)

  console.log('\n=== Lab Citation Summary ===')
  console.log(`  Total citations (lab): ${totalLabCitedby}`)
  console.log(`  Total citations 5y: ${totalLabCitedby5y}`)
  console.log(`  Pub-level total citations: ${totalPubCitations}`)
  console.log(`  Avg citations per publication: ${avgCitations}`)

  console.log('\n=== Per-Researcher Summary ===')
  for (const m of researcherMetrics) {
    const err = m._error ? ` (error: ${m._error})` : ''
    console.log(`  ${m.name}: h=${m.hindex} i10=${m.i10index} citedby=${m.citedby}${err}`)
  }

  if (errors.length > 0) {
    console.log('\n=== Errors ===')
    for (const e of errors) console.log(`  - ${e}`)
  }

  console.log('=== Done ===')
}

main().catch(err => {
  console.error('Scholar metrics sync failed:', err)
  process.exit(1)
})
