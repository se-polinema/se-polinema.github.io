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
const SCHOLAR_METRICS_FILE = resolve(DATA_DIR, '_scholar-metrics.json')

const PUBLICATION_LIMIT = 100
const REQUEST_DELAY_MS = 5000
// scholarly.fill(pub) is a separate Scholar request per publication (the
// author-level searchAuthorId(..., filled=true, ...) call does NOT cascade
// down to individual publications — it only fills author-level fields like
// h-index). This delay is between those per-publication fill() calls,
// distinct from REQUEST_DELAY_MS which is between researchers.
const FILL_DELAY_MS = 2000

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
        url: data.url,
      })
    }
  }
  return existing
}

// Patches just url/googleScholarUrl on an existing publication file via a
// surgical text replacement — preserving every other frontmatter field
// (featured, researchers, hand edits, etc.) AND the file's existing
// formatting/quoting exactly. Deliberately does NOT round-trip through
// gray-matter's parse+stringify: matter.stringify() re-serializes the
// whole frontmatter block with its own YAML formatting (dropping the
// double-quotes generatePublicationMd() always uses), which would leave
// patched files stylistically inconsistent with freshly-created ones.
function patchPublicationUrl(file, newUrl, googleScholarUrl) {
  const filePath = resolve(PUBLICATIONS_DIR, file)
  const raw = readFileSync(filePath, 'utf-8')

  let updated = raw.replace(/^url:.*$/m, `url: "${newUrl}"`)

  if (googleScholarUrl) {
    updated = /^googleScholarUrl:.*$/m.test(updated)
      ? updated.replace(/^googleScholarUrl:.*$/m, `googleScholarUrl: "${googleScholarUrl}"`)
      : updated.replace(/^(url:.*)$/m, `$1\ngoogleScholarUrl: "${googleScholarUrl}"`)
  }

  writeFileSync(filePath, updated, 'utf-8')
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

    // Author-level metrics (h-index, i10-index, citations) come from this
    // same searchAuthorId() call — reused here instead of a second, separate
    // Google Scholar fetch (see scripts/sync-scholar-metrics.mjs, now removed).
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

    console.log(`  Found ${publications.length} publications in profile.`)

    const results = []
    for (const pub of publications) {
      // fill() is required before bib.author (and pub_url/eprint_url) are
      // populated at all — the unfilled publication object from
      // searchAuthorId() only has title/pub_year/citation, no authors.
      // This is why the author/venue check below used to skip every
      // single publication: it was reading an object that never had
      // authors in the first place. One extra Scholar request per
      // publication; degrade gracefully (skip via the author check below,
      // same as always) if it fails rather than aborting the whole sync.
      let filled = pub
      try {
        filled = await scholarly.fill(pub)
      } catch (err) {
        console.warn(`  Warning: fill() failed for "${(pub.bib?.title || 'untitled').trim()}": ${err.message}`)
      }
      await new Promise(resolve => setTimeout(resolve, FILL_DELAY_MS))

      const bib = filled.bib || {}
      const title = (bib.title || '').trim()
      const pubYear = bib.pub_year ? parseInt(bib.pub_year, 10) : null

      if (!title || !pubYear) continue

      const venue = bib.venue || bib.journal || bib.conference || ''
      const hasVenue = venue.trim().length > 0

      let authors = []
      if (Array.isArray(bib.author)) {
        authors = bib.author.map(a => a.trim()).filter(Boolean)
      } else if (typeof bib.author === 'string') {
        authors = bib.author.split(',').map(a => a.trim()).filter(Boolean)
      }

      if (authors.length === 0 || !hasVenue) {
        console.warn(`  Skipping "${title}" (${pubYear}): missing ${authors.length === 0 ? 'authors' : 'venue'}`)
        continue
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

      // citedby_url comes back as a Scholar-relative path (e.g.
      // "/scholar?hl=en&cites=...") once the publication has been
      // filled, unlike the absolute URL on the unfilled object — needs
      // the domain re-added, or it fell back to the profile URL, which is
      // already absolute.
      const rawGsUrl = filled.citedby_url || pub.citedby_url ||
        `https://scholar.google.com/citations?user=${researcher.userId}&hl=en`
      const gsUrl = rawGsUrl.startsWith('/') ? `https://scholar.google.com${rawGsUrl}` : rawGsUrl

      // pub_url is the actual journal/publisher link Scholar shows as the
      // title link; eprint_url is a PDF link. Only available post-fill.
      // Falls back to the Scholar link only when Scholar itself doesn't
      // expose either.
      const publisherUrl = filled.pub_url || filled.eprint_url || null

      const citedByCount = filled.num_citations ?? pub.num_citations ?? null

      results.push({
        title,
        year: pubYear,
        type: inferPublicationType(bib),
        venue,
        authors,
        url: publisherUrl || gsUrl,
        googleScholarUrl: gsUrl,
        citedByCount,
        researchers: matchedResearchers,
        featured: false,
        language: detectLanguage(title, authors),
        key: `${normalizeTitle(title)}-${pubYear}`,
      })
    }

    return { publications: results, metrics }
  } catch (err) {
    console.error(`  Error fetching for ${researcher.name}:`, err.message)
    return {
      publications: [],
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
    }
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
  const existingByKey = new Map(existing.map(e => [e.key, e]))
  const existingKeys = new Set(existing.map(e => e.key))
  const originalExistingKeys = new Set(existingKeys)
  console.log(`Found ${existing.length} existing publications.\n`)

  const allNew = []
  let totalFetched = 0
  let totalPatched = 0
  const researcherMetrics = []
  const allPublicationCitations = {}

  for (const researcher of researchers) {
    const { publications: pubs, metrics } = await fetchPublicationsForResearcher(researcher, researchers)
    totalFetched += pubs.length
    researcherMetrics.push(metrics)

    for (const pub of pubs) {
      if (!existingKeys.has(pub.key)) {
        allNew.push(pub)
        existingKeys.add(pub.key)
      } else if (originalExistingKeys.has(pub.key)) {
        // Already on disk from a previous sync — backfill the real
        // publisher link if this file still only has the old Scholar URL
        // (from before this fix) and we now have a better one. Only
        // touches url/googleScholarUrl; every other field on the file is
        // left exactly as-is.
        const existingEntry = existingByKey.get(pub.key)
        const stillOnScholar = typeof existingEntry?.url === 'string' &&
          existingEntry.url.includes('scholar.google.com')
        const gotRealUrl = typeof pub.url === 'string' && !pub.url.includes('scholar.google.com')
        if (existingEntry && stillOnScholar && gotRealUrl) {
          patchPublicationUrl(existingEntry.file, pub.url, pub.googleScholarUrl)
          console.log(`  Patched URL for existing: ${existingEntry.file}`)
          totalPatched++
        }
      }

      if (pub.citedByCount != null) {
        const citation = { title: pub.title, year: pub.year, citedByCount: pub.citedByCount }
        if (originalExistingKeys.has(pub.key)) {
          allPublicationCitations[pub.key] = citation
        } else if (allPublicationCitations[pub.key]) {
          if (citation.citedByCount > allPublicationCitations[pub.key].citedByCount) {
            allPublicationCitations[pub.key] = citation
          }
        } else {
          allPublicationCitations[pub.key] = citation
        }
      }
    }

    await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS))
  }

  console.log(`\nTotal fetched: ${totalFetched} publications across all researchers`)
  console.log(`New publications to add: ${allNew.length}`)
  console.log(`Existing publications patched with a real URL: ${totalPatched}\n`)

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

  const errors = researcherMetrics.filter(m => m._error).map(m => `${m.name}: ${m._error}`)

  const scholarMetricsData = {
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

  writeFileSync(SCHOLAR_METRICS_FILE, JSON.stringify(scholarMetricsData, null, 2) + '\n', 'utf-8')
  console.log(`Scholar metrics written to ${SCHOLAR_METRICS_FILE}`)

  console.log('\n=== Per-Researcher Scholar Metrics ===')
  for (const m of researcherMetrics) {
    const err = m._error ? ` (error: ${m._error})` : ''
    console.log(`  ${m.name}: h=${m.hindex} i10=${m.i10index} citedby=${m.citedby}${err}`)
  }

  console.log('=== Done ===')
}

main().catch(err => {
  console.error('Sync failed:', err)
  process.exit(1)
})
