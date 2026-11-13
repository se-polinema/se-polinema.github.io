import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { scholarly } from 'node-scholarly'
import matter from 'gray-matter'
import { normalizeTitle, splitAuthors } from './lib/publications.mjs'

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
// down to individual publications; it only fills author-level fields like
// h-index). This delay is between those per-publication fill() calls,
// distinct from REQUEST_DELAY_MS which is between researchers.
// Jittered so the request cadence doesn't look machine-regular to Scholar.
const FILL_DELAY_MIN_MS = 10000
const FILL_DELAY_MAX_MS = 30000
// A failed fill() is retried with exponential backoff (60s, 120s, 240s).
const FILL_BACKOFF_MS = [60000, 120000, 240000]
// After this many publications in a row fail all their retries, Scholar is
// treated as blocking us: stop filling for the rest of the run (metrics and
// citations are still recorded) instead of hammering it with more requests.
const FILL_BLOCK_THRESHOLD = 3

scholarly.setTimeout(15000)
scholarly.setRetries(2)

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const jitteredFillDelay = () =>
  FILL_DELAY_MIN_MS + Math.random() * (FILL_DELAY_MAX_MS - FILL_DELAY_MIN_MS)

const fillStats = { filled: 0, skippedExisting: 0, failed: 0, skippedBlocked: 0 }
let consecutiveFillFailures = 0
let scholarBlocked = false

// scholarly.fill() with the library's own immediate retries turned off (they
// fire within seconds and keep the IP rate-limited) and our own backoff
// instead. Throws the last error once every attempt has failed.
async function fillWithBackoff(pub) {
  scholarly.setRetries(0)
  try {
    for (let attempt = 0; ; attempt++) {
      try {
        return await scholarly.fill(pub)
      } catch (err) {
        if (attempt >= FILL_BACKOFF_MS.length) throw err
        console.warn(`  fill() failed (${err.message}); retrying in ${FILL_BACKOFF_MS[attempt] / 1000}s`)
        await sleep(FILL_BACKOFF_MS[attempt])
      }
    }
  } finally {
    scholarly.setRetries(2)
  }
}

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

// Reads the previous sync's per-researcher metrics (if any), keyed by
// researcher slug, so a researcher whose fetch fails this run (e.g. a
// Scholar rate-limit) can fall back to their last-known-good numbers
// instead of the fetch error path's zeroed placeholder values silently
// overwriting real data.
function loadPreviousResearcherMetrics() {
  if (!existsSync(SCHOLAR_METRICS_FILE)) return new Map()
  try {
    const previous = JSON.parse(readFileSync(SCHOLAR_METRICS_FILE, 'utf-8'))
    const entries = (previous.researcherMetrics || []).map(m => [m.researcher, m])
    return new Map(entries)
  } catch (err) {
    console.warn(`  Warning: could not read previous ${SCHOLAR_METRICS_FILE}: ${err.message}`)
    return new Map()
  }
}

function loadPreviousPublicationCitations() {
  if (!existsSync(SCHOLAR_METRICS_FILE)) return {}
  try {
    return JSON.parse(readFileSync(SCHOLAR_METRICS_FILE, 'utf-8')).publicationCitations || {}
  } catch (err) {
    console.warn(`  Warning: could not read previous publication citations: ${err.message}`)
    return {}
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
        url: data.url,
      })
    }
  }
  return existing
}

// Patches just url/googleScholarUrl on an existing publication file via a
// surgical text replacement, preserving every other frontmatter field
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

async function fetchPublicationsForResearcher(researcher, allResearchers, existingKeys, existingByKey) {
  console.log(`Fetching publications for ${researcher.name} (${researcher.slug})...`)

  try {
    const author = await scholarly.searchAuthorId(researcher.userId, true, 'date', PUBLICATION_LIMIT)
    const publications = author.publications || []

    // Author-level metrics (h-index, i10-index, citations) come from this
    // same searchAuthorId() call, reused here instead of a second, separate
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
    const citations = []
    for (const pub of publications) {
      // fill() is required before bib.author (and pub_url/eprint_url) are
      // populated at all: the unfilled publication object from
      // searchAuthorId() only has title/pub_year/citation, no authors.
      // That is one extra Scholar request per publication, so only pay for it
      // when the result is needed: a publication that is new, or already on
      // disk but still carrying a Scholar URL that a real publisher link
      // could replace. Title/year/citations are all on the unfilled object.
      const rawTitle = (pub.bib?.title || '').trim()
      const rawYear = pub.bib?.pub_year ? parseInt(pub.bib.pub_year, 10) : null
      const rawKey = rawTitle && rawYear ? `${normalizeTitle(rawTitle)}-${rawYear}` : null
      const existingEntry = rawKey ? existingByKey.get(rawKey) : null
      const needsFill = !rawKey || !existingKeys.has(rawKey) ||
        (existingEntry && typeof existingEntry.url === 'string' && existingEntry.url.includes('scholar.google.com'))

      let filled = pub
      if (!needsFill) {
        fillStats.skippedExisting++
      } else if (scholarBlocked) {
        fillStats.skippedBlocked++
      } else {
        try {
          filled = await fillWithBackoff(pub)
          fillStats.filled++
          consecutiveFillFailures = 0
        } catch (err) {
          console.warn(`  Warning: fill() failed for "${rawTitle || 'untitled'}": ${err.message}`)
          fillStats.failed++
          if (++consecutiveFillFailures >= FILL_BLOCK_THRESHOLD) {
            scholarBlocked = true
            console.warn(`  Scholar appears to be blocking us (${consecutiveFillFailures} fills failed in a row); skipping further fill() calls this run.`)
          }
        }
        await sleep(jitteredFillDelay())
      }

      const bib = filled.bib || {}
      const title = (bib.title || '').trim()
      const pubYear = bib.pub_year ? parseInt(bib.pub_year, 10) : null

      if (!title || !pubYear) continue

      // Record the citation count BEFORE the author/venue check below. The
      // count is already on the unfilled search result, so it must not depend
      // on fill() succeeding: when Scholar blocks the per-publication requests
      // (every fill() fails, so every publication is skipped for "missing
      // authors"), the old code recorded no citations at all and
      // publicationCitations / mostCitedPublications silently went empty.
      const citedByCount = filled.num_citations ?? pub.num_citations ?? null
      if (citedByCount != null) {
        citations.push({ key: `${normalizeTitle(title)}-${pubYear}`, title, year: pubYear, citedByCount })
      }

      // Already on disk and nothing to patch: citations are recorded above,
      // there is nothing else to do with an unfilled result.
      if (!needsFill) continue

      const venue = bib.venue || bib.journal || bib.conference || ''
      const hasVenue = venue.trim().length > 0

      // Scholar's author field is either an array or one "A and B and C" string.
      const authors = splitAuthors(bib.author)

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
      // filled, unlike the absolute URL on the unfilled object; needs
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

    return { publications: results, metrics, citations }
  } catch (err) {
    console.error(`  Error fetching for ${researcher.name}:`, err.message)
    return {
      publications: [],
      citations: [],
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
    const { publications: pubs, metrics, citations } = await fetchPublicationsForResearcher(researcher, researchers, existingKeys, existingByKey)
    totalFetched += pubs.length
    researcherMetrics.push(metrics)

    for (const pub of pubs) {
      if (!existingKeys.has(pub.key)) {
        allNew.push(pub)
        existingKeys.add(pub.key)
      } else if (originalExistingKeys.has(pub.key)) {
        // Already on disk from a previous sync: backfill the real
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
    }

    // Keep the highest count seen for a publication across researchers.
    for (const c of citations) {
      const prev = allPublicationCitations[c.key]
      if (!prev || c.citedByCount > prev.citedByCount) {
        allPublicationCitations[c.key] = { title: c.title, year: c.year, citedByCount: c.citedByCount }
      }
    }

    await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS))
  }

  // Only publications that exist on the site (already on disk or about to be
  // created) belong in the citation map.
  for (const key of Object.keys(allPublicationCitations)) {
    if (!existingKeys.has(key)) delete allPublicationCitations[key]
  }
  // If this run produced no citation data at all (e.g. every request failed),
  // keep the last known values instead of wiping them.
  if (Object.keys(allPublicationCitations).length === 0) {
    const previousCitations = loadPreviousPublicationCitations()
    if (Object.keys(previousCitations).length > 0) {
      Object.assign(allPublicationCitations, previousCitations)
      console.warn('  No citation data this run; preserved previous publicationCitations.')
    }
  }

  console.log(`\nfill() requests: ${fillStats.filled} filled, ${fillStats.skippedExisting} skipped (already on disk), ` +
    `${fillStats.failed} failed, ${fillStats.skippedBlocked} not attempted (Scholar blocking)`)
  console.log(`Total fetched: ${totalFetched} publications across all researchers`)
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

  // A researcher whose fetch errored this run currently has zeroed
  // placeholder metrics (see the catch block in
  // fetchPublicationsForResearcher), fall back to their previous synced
  // values here rather than let a transient failure regress real data.
  // _error stays set so the failure is still visible in the output.
  const previousMetrics = loadPreviousResearcherMetrics()
  for (const m of researcherMetrics) {
    if (!m._error) continue
    const prev = previousMetrics.get(m.researcher)
    if (!prev) continue
    m.citedby = prev.citedby ?? m.citedby
    m.citedby5y = prev.citedby5y ?? m.citedby5y
    m.hindex = prev.hindex ?? m.hindex
    m.hindex5y = prev.hindex5y ?? m.hindex5y
    m.i10index = prev.i10index ?? m.i10index
    m.i10index5y = prev.i10index5y ?? m.i10index5y
    console.log(`  Preserved previous metrics for ${m.name} (fetch failed this run)`)
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
