// Looks up missing DOIs on Crossref and writes them into publication frontmatter.
//
//   node scripts/enrich-dois.mjs                 # enrich all files without a doi
//   node scripts/enrich-dois.mjs --dry-run       # report matches, change nothing
//   node scripts/enrich-dois.mjs --limit 10      # only look at the first N candidates
//
// A DOI is accepted only when Crossref's top hit has the same normalized title
// AND a publication year within one year of ours. Anything weaker is ignored:
// a wrong DOI is worse than a missing one. Only a `doi:` line is inserted
// (right after the `url:` line); nothing else in the file changes.
//
// Env: CROSSREF_MAILTO (optional) puts a contact address in the request so
// Crossref can route us to its "polite" pool. No address is hard-coded here.
//
// It also prints a review list of venue/type problems (raw-URL venues, generic
// venues, "journal" type on conference venues). Those are reported, never fixed.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { titlesMatch, venueProblems } from './lib/publications.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIR = resolve(ROOT, 'src/content/publications')
const DELAY_MS = 1000
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const limitIdx = args.indexOf('--limit')
const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : Infinity
const mailto = process.env.CROSSREF_MAILTO

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function lookupDoi(title, year) {
  const params = new URLSearchParams({
    'query.bibliographic': title,
    rows: '1',
    select: 'DOI,title,issued',
  })
  if (mailto) params.set('mailto', mailto)
  const res = await fetch(`https://api.crossref.org/works?${params}`, {
    headers: { 'User-Agent': `se-polinema-site/1.0 (+https://se.polinema.ac.id${mailto ? `; mailto:${mailto}` : ''})` },
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`Crossref HTTP ${res.status}`)
  const item = (await res.json())?.message?.items?.[0]
  if (!item?.DOI) return null
  const candidateTitle = Array.isArray(item.title) ? item.title[0] : item.title
  const candidateYear = item.issued?.['date-parts']?.[0]?.[0]
  if (!candidateTitle || !titlesMatch(title, candidateTitle)) return null
  if (typeof candidateYear === 'number' && Math.abs(candidateYear - year) > 1) return null
  return item.DOI
}

const files = readdirSync(DIR).filter((f) => f.endsWith('.md')).sort()
const review = []
const candidates = []

for (const file of files) {
  const raw = readFileSync(resolve(DIR, file), 'utf-8')
  const d = matter(raw).data
  const problems = venueProblems({ venue: d.venue, type: d.type })
  if (problems.length > 0) review.push(`${file}: ${problems.join('; ')} (venue: "${d.venue}", type: ${d.type})`)
  if (!d.doi) candidates.push({ file, raw, title: d.title, year: d.year })
}

console.log(`${candidates.length} publication(s) without a DOI${Number.isFinite(limit) ? `, checking the first ${limit}` : ''}.`)

let found = 0
let failures = 0
for (const c of candidates.slice(0, limit)) {
  try {
    const doi = await lookupDoi(c.title, c.year)
    if (doi) {
      found++
      console.log(`  + ${c.file}  ->  ${doi}`)
      if (!dryRun) {
        const next = c.raw.replace(/^(url:[^\n]*\n)/m, `$1doi: ${JSON.stringify(doi)}\n`)
        if (next === c.raw) console.warn(`    ! no url: line to anchor on, skipped`)
        else writeFileSync(resolve(DIR, c.file), next, 'utf-8')
      }
    }
  } catch (err) {
    failures++
    console.warn(`  ! ${c.file}: ${err.message}`)
    // Stop early if Crossref is unreachable rather than hammering it.
    if (failures >= 5) {
      console.warn('Too many failures, stopping.')
      break
    }
  }
  await sleep(DELAY_MS)
}

console.log(`\n${dryRun ? 'Would add' : 'Added'} ${found} DOI(s).`)
if (review.length > 0) {
  console.log(`\nVenue/type entries to review manually (${review.length}):`)
  for (const r of review) console.log('  ' + r)
}
