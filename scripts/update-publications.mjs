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
const SYNC_META_FILE = resolve(DATA_DIR, '_sync-meta.json')

const PUBLICATION_LIMIT = 100
const REQUEST_DELAY_MS = 5000

scholarly.setTimeout(15000)
scholarly.setRetries(2)

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

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

function detectLanguage(title, authors) {
  const text = title + ' ' + (Array.isArray(authors) ? authors.join(' ') : authors || '')
  const idPattern = /\b(dan|di|dalam|untuk|pada|dengan|metode|pengaruh|analisis|sistem|aplikasi|implementasi|pengembangan|studi|kasus|terhadap|berbasis|algoritma|teknik|pembelajaran|peningkatan|pengenalan|klasifikasi|deteksi|prediksi|segmentasi|rekomendasi|optimalisasi|evaluasi|penilaian|penerapan|pemodelan|perancangan|pengujian|pemanfaatan|penggunaan|pengelolaan|pemetaan|monitoring)\b/i
  return idPattern.test(text) ? 'id' : 'en'
}

function inferPublicationType(bib) {
  const bibType = (bib.pub_type || '').toLowerCase()
  const venue = (bib.venue || '').toLowerCase()
  const journal = (bib.journal || '').toLowerCase()
  const conference = (bib.conference || '').toLowerCase()
  const combined = [bibType, venue, journal, conference].join(' ')

  if (/\b(conference|symposium|workshop|conf\.|proc\.)\b/i.test(combined)) {
    return 'conference'
  }
  if (/\b(chapter|book\s+chapter)\b/i.test(combined)) {
    return 'book-chapter'
  }
  if (/\bpreprint\b/i.test(combined) || /\barxiv\b/i.test(combined)) {
    return 'preprint'
  }
  if (/\bproceeding\b/i.test(combined)) {
    return 'proceeding'
  }
  return 'journal'
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

function generatePublicationMd(pub, researcherSlugs) {
  const authorsYaml = pub.authors.map(a => `  - "${a}"`).join('\n')
  const researchersYaml = researcherSlugs.map(r => `  - "${r}"`).join('\n')

  let frontmatter = `---
title: "${pub.title}"
year: ${pub.year}
type: "${pub.type}"
venue: "${pub.venue}"
authors:
${authorsYaml}
url: "${pub.url}"
`

  if (pub.doi) {
    frontmatter += `doi: "${pub.doi}"\n`
  }
  if (pub.googleScholarUrl) {
    frontmatter += `googleScholarUrl: "${pub.googleScholarUrl}"\n`
  }
  if (pub.citedByCount != null && pub.citedByCount >= 0) {
    frontmatter += `citedByCount: ${pub.citedByCount}\n`
  }

  frontmatter += `researchers:
${researchersYaml}
featured: false
language: "${pub.language}"
---
${pub.title}
`

  return frontmatter
}

async function fetchPublicationsForResearcher(researcher, allResearchers) {
  console.log(`Fetching publications for ${researcher.name} (${researcher.slug})...`)

  try {
    const author = await scholarly.searchAuthorId(researcher.userId, true, 'date', PUBLICATION_LIMIT)
    const publications = author.publications || []

    console.log(`  Found ${publications.length} publications in profile.`)

    const results = []
    for (const pub of publications) {
      const bib = pub.bib || {}
      const title = (bib.title || '').trim()
      const pubYear = bib.pub_year ? parseInt(bib.pub_year, 10) : null

      if (!title || !pubYear) continue

      const venue = bib.venue || bib.journal || bib.conference || 'Unknown Venue'

      let authors = []
      if (Array.isArray(bib.author)) {
        authors = bib.author.map(a => a.trim()).filter(Boolean)
      } else if (typeof bib.author === 'string') {
        authors = bib.author.split(',').map(a => a.trim()).filter(Boolean)
      }

      const matchedResearchers = [researcher.slug]

      for (const authorName of authors) {
        for (const other of allResearchers) {
          if (other.slug === researcher.slug) continue
          if (authorName.toLowerCase() === other.name.toLowerCase() ||
              authorName.toLowerCase().includes(other.name.toLowerCase().split(' ').pop() || '')) {
            if (!matchedResearchers.includes(other.slug)) {
              matchedResearchers.push(other.slug)
            }
          }
        }
      }

      const gsUrl = pub.citedby_url || `https://scholar.google.com/citations?user=${researcher.userId}&hl=en`

      const citedByCount = pub.num_citations != null ? pub.num_citations : null

      results.push({
        title,
        year: pubYear,
        type: inferPublicationType(bib),
        venue,
        authors,
        url: gsUrl,
        googleScholarUrl: gsUrl,
        doi: bib.volume || null,
        citedByCount,
        researchers: matchedResearchers,
        featured: false,
        language: detectLanguage(title, authors),
        key: `${normalizeTitle(title)}-${pubYear}`,
      })
    }

    return results
  } catch (err) {
    console.error(`  Error fetching for ${researcher.name}:`, err.message)
    return []
  }
}

async function main() {
  console.log('=== Publication Sync ===\n')

  console.log('Loading researchers...')
  const researchers = loadResearchers()

  if (researchers.length === 0) {
    console.log('No researchers with Google Scholar URLs found. Exiting.')
    return
  }

  console.log(`Found ${researchers.length} researchers with Google Scholar profiles.\n`)

  console.log('Loading existing publications...')
  const existing = loadExistingPublications()
  const existingKeys = new Set(existing.map(e => e.key))
  console.log(`Found ${existing.length} existing publications.\n`)

  const allNew = []
  let totalFetched = 0

  for (const researcher of researchers) {
    const pubs = await fetchPublicationsForResearcher(researcher, researchers)
    totalFetched += pubs.length

    for (const pub of pubs) {
      if (!existingKeys.has(pub.key)) {
        allNew.push(pub)
        existingKeys.add(pub.key)
      }
    }

    await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS))
  }

  console.log(`\nTotal fetched: ${totalFetched} publications across all researchers`)
  console.log(`New publications to add: ${allNew.length}\n`)

  if (allNew.length === 0) {
    console.log('No new publications to add.')
  } else {
    if (!existsSync(PUBLICATIONS_DIR)) {
      mkdirSync(PUBLICATIONS_DIR, { recursive: true })
    }

    let created = 0
    for (const pub of allNew) {
      const filename = `${pub.year}-${slugify(pub.title)}.md`
      const filePath = resolve(PUBLICATIONS_DIR, filename)

      if (existsSync(filePath)) {
        console.log(`  Skipping (filename exists): ${filename}`)
        continue
      }

      const md = generatePublicationMd(pub, pub.researchers)
      writeFileSync(filePath, md, 'utf-8')
      console.log(`  Created: ${filename}`)
      created++
    }

    console.log(`\nCreated ${created} new publication files.`)
  }

  const totalPublicationFiles = existsSync(PUBLICATIONS_DIR)
    ? readdirSync(PUBLICATIONS_DIR).filter(f => f.endsWith('.md')).length
    : 0

  const syncMeta = {
    lastUpdated: new Date().toISOString(),
    totalPublications: totalPublicationFiles,
    newInThisSync: allNew.length,
  }

  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true })
  }
  writeFileSync(SYNC_META_FILE, JSON.stringify(syncMeta, null, 2) + '\n', 'utf-8')
  console.log(`\nSync meta written to ${SYNC_META_FILE}`)
  console.log('=== Done ===')
}

main().catch(err => {
  console.error('Sync failed:', err)
  process.exit(1)
})
