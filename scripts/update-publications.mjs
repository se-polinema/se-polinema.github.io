import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const RESEARCHERS_DIR = resolve(ROOT, 'src/content/researchers')
const PUBLICATIONS_DIR = resolve(ROOT, 'src/content/publications')
const DATA_DIR = resolve(ROOT, 'src/data')
const SYNC_META_FILE = resolve(DATA_DIR, '_sync-meta.json')

const REQUEST_DELAY_MS = 3000

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

function getGoogleScholarUserId(googleScholarUrl) {
  const match = googleScholarUrl.match(/user=([^&]+)/)
  return match ? match[1] : null
}

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function inferPublicationType(venue, title) {
  const lower = (venue + ' ' + title).toLowerCase()
  if (/\b(conference|proceeding|symposium|workshop|conf\.|proc\.)\b/i.test(venue)) {
    return 'conference'
  }
  if (/\b(chapter|book\s+chapter)\b/i.test(lower)) {
    return 'book-chapter'
  }
  if (/\bpreprint\b/i.test(lower) || /\barxiv\b/i.test(lower)) {
    return 'preprint'
  }
  if (/\bproceeding\b/i.test(lower)) {
    return 'proceeding'
  }
  return 'journal'
}

function detectLanguage(title, authors) {
  const text = title + ' ' + (authors || []).join(' ')
  const idPattern = /\b(dan|di|dalam|untuk|pada|dengan|metode|pengaruh|analisis|sistem|aplikasi|implementasi|pengembangan|studi|kasus|terhadap|berbasis|algoritma|teknik|pembelajaran|peningkatan|pengenalan|klasifikasi|deteksi|prediksi|segmentasi|rekomendasi|optimalisasi|evaluasi|penilaian|penerapan|pemodelan|perancangan|pengujian|pemanfaatan|penggunaan|pengelolaan|pemetaan|monitoring)\b/i
  return idPattern.test(text) ? 'id' : 'en'
}

function extractAuthorsFromHtml(html) {
  const authors = []
  const authorRegex = /<div class="gs_gray">([^<]+)<\/div>/g
  const matches = [...html.matchAll(authorRegex)]
  if (matches.length > 0) {
    const firstLine = matches[0][1]
    const names = firstLine.split(',').map(s => s.trim()).filter(Boolean)
    for (const name of names) {
      const cleaned = name.replace(/\s+/g, ' ').trim()
      if (cleaned && !cleaned.includes('...')) {
        authors.push(cleaned)
      }
    }
  }
  return authors
}

function extractVenueFromHtml(html) {
  const venueRegex = /<div class="gs_gray">([^<]+)<\/div>/g
  const matches = [...html.matchAll(venueRegex)]
  if (matches.length > 1) {
    return matches[1][1].trim()
  }
  return 'Unknown Venue'
}

function parsePublicationsHtml(html, researcherId, researcherName, allResearchers) {
  const publications = []
  const rowRegex = /<tr class="gsc_a_tr">([\s\S]*?)<\/tr>/g
  let rowMatch

  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const rowHtml = rowMatch[1]

    const titleMatch = rowHtml.match(/<a href="[^"]*" class="gsc_a_at"[^>]*>([^<]+)<\/a>/)
    if (!titleMatch) continue
    const title = titleMatch[1].trim()

    const hrefMatch = rowHtml.match(/<a href="(\/citations\?[^"]*)" class="gsc_a_at"/)
    const gsUrl = hrefMatch ? `https://scholar.google.com${hrefMatch[1].replace(/&/g, '&amp;').replace(/&amp;/g, '&')}` : null

    const yearMatch = rowHtml.match(/<span class="gsc_a_h[^"]*">(\d{4})<\/span>/)
    const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear()

    const authors = extractAuthorsFromHtml(rowHtml)
    const venue = extractVenueFromHtml(rowHtml)

    if (!title || !year) continue

    const pubAuthors = authors.length > 0 ? authors : [researcherName]

    const matchedResearchers = [researcherId]
    for (const author of pubAuthors) {
      for (const [slug, name] of Object.entries(allResearchers)) {
        if (slug === researcherId) continue
        if (name.toLowerCase() === author.toLowerCase()) {
          if (!matchedResearchers.includes(slug)) {
            matchedResearchers.push(slug)
          }
        }
      }
    }

    publications.push({
      title,
      year,
      type: inferPublicationType(venue, title),
      venue,
      authors: pubAuthors,
      url: gsUrl || `https://scholar.google.com/citations?user=${getGoogleScholarUserId(allResearchers._urls?.[researcherId] || '')}&hl=en`,
      googleScholarUrl: gsUrl || null,
      researchers: matchedResearchers,
      featured: false,
      language: detectLanguage(title, pubAuthors),
      key: `${normalizeTitle(title)}-${year}`,
    })
  }

  return publications
}

async function fetchGoogleScholarProfile(userId) {
  const url = `https://scholar.google.com/citations?user=${userId}&hl=en&cstart=0&pagesize=100`
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    })
    if (!response.ok) {
      console.error(`  HTTP ${response.status} for ${userId}`)
      return null
    }
    return await response.text()
  } catch (err) {
    console.error(`  Fetch error for ${userId}:`, err.message)
    return null
  }
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

function loadResearchers() {
  if (!existsSync(RESEARCHERS_DIR)) {
    console.error('Researchers directory not found:', RESEARCHERS_DIR)
    return {}
  }

  const researchers = {}
  const files = readdirSync(RESEARCHERS_DIR).filter(f => f.endsWith('.md'))

  for (const file of files) {
    const content = readFileSync(resolve(RESEARCHERS_DIR, file), 'utf-8')
    const { data } = matter(content)
    const slug = file.replace('.md', '')
    const userId = getGoogleScholarUserId(data.googleScholarUrl || '')

    if (userId) {
      researchers[slug] = {
        name: data.name,
        userId,
        googleScholarUrl: data.googleScholarUrl,
      }
    } else {
      console.warn(`  Warning: No Google Scholar user ID found for ${slug}`)
    }
  }

  return researchers
}

function generatePublicationMd(pub) {
  const authorsYaml = pub.authors.map(a => `  - "${a}"`).join('\n')
  const researchersYaml = pub.researchers.map(r => `  - "${r}"`).join('\n')

  let frontmatter = `---
title: "${pub.title}"
year: ${pub.year}
type: "${pub.type}"
venue: "${pub.venue}"
authors:
${authorsYaml}
url: "${pub.url}"
`

  if (pub.googleScholarUrl) {
    frontmatter += `googleScholarUrl: "${pub.googleScholarUrl}"\n`
  }
  if (pub.doi) {
    frontmatter += `doi: "${pub.doi}"\n`
  }

  frontmatter += `researchers:
${researchersYaml}
featured: ${pub.featured}
language: "${pub.language}"
---
${pub.title}
`

  return frontmatter
}

async function main() {
  console.log('=== Publication Sync ===\n')

  console.log('Loading researchers...')
  const researchers = loadResearchers()
  const researcherEntries = Object.entries(researchers)

  if (researcherEntries.length === 0) {
    console.log('No researchers with Google Scholar URLs found. Exiting.')
    return
  }

  console.log(`Found ${researcherEntries.length} researchers with Google Scholar profiles.\n`)

  const allResearcherNames = {}
  const allResearcherUrls = {}
  for (const [slug, info] of researcherEntries) {
    allResearcherNames[slug] = info.name
    allResearcherUrls[slug] = info.googleScholarUrl
  }

  console.log('Loading existing publications...')
  const existing = loadExistingPublications()
  const existingKeys = new Set(existing.map(e => e.key))
  console.log(`Found ${existing.length} existing publications.\n`)

  const allNew = []
  let totalFetched = 0

  for (const [slug, info] of researcherEntries) {
    console.log(`Fetching publications for ${info.name} (${slug})...`)

    const html = await fetchGoogleScholarProfile(info.userId)

    if (!html) {
      console.log(`  Skipping ${slug} - could not fetch profile.\n`)
      continue
    }

    const pubs = parsePublicationsHtml(html, slug, info.name, {
      ...allResearcherNames,
      _urls: allResearcherUrls,
    })
    totalFetched += pubs.length
    console.log(`  Found ${pubs.length} publications in profile.\n`)

    for (const pub of pubs) {
      if (!existingKeys.has(pub.key)) {
        allNew.push(pub)
        existingKeys.add(pub.key)
      }
    }

    await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS))
  }

  console.log(`Total fetched: ${totalFetched} publications across all researchers`)
  console.log(`New publications to add: ${allNew.length}\n`)

  if (allNew.length === 0) {
    console.log('No new publications to add.')
  } else {
    if (!existsSync(PUBLICATIONS_DIR)) {
      mkdirSync(PUBLICATIONS_DIR, { recursive: true })
    }

    for (const pub of allNew) {
      const slug = slugify(pub.title)
      const filename = `${pub.year}-${slug}.md`
      const filePath = resolve(PUBLICATIONS_DIR, filename)

      if (existsSync(filePath)) {
        console.log(`  Skipping existing file: ${filename}`)
        continue
      }

      const md = generatePublicationMd(pub)
      writeFileSync(filePath, md, 'utf-8')
      console.log(`  Created: ${filename}`)
    }

    console.log(`\nCreated ${allNew.length} new publication files.`)
  }

  const now = new Date().toISOString()
  const syncMeta = {
    lastUpdated: now,
    totalPublications: existing.length + allNew.length,
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
