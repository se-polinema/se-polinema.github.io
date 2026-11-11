// One-off / repeatable cleanup: older publication files stored all authors as a
// single "A and B and C" string (the sync used to split Scholar's author field
// on commas only). Rewrites the `authors:` block of each file as one list item
// per author. Only that block is touched; the rest of the file is byte-for-byte
// unchanged.
//
//   node scripts/normalize-publication-authors.mjs            # apply
//   node scripts/normalize-publication-authors.mjs --dry-run  # report only
//
// Tokens that look like academic degrees ("S Kom") are NOT removed; they are
// listed at the end for a manual decision.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { looksLikeDegreeToken, splitAuthors } from './lib/publications.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIR = resolve(ROOT, 'src/content/publications')
const dryRun = process.argv.includes('--dry-run')

const AUTHORS_BLOCK = /^authors:\n(?:[ \t]+-[^\n]*\n)+/m

let changed = 0
const degreeHits = []

for (const file of readdirSync(DIR).filter((f) => f.endsWith('.md')).sort()) {
  const path = resolve(DIR, file)
  const raw = readFileSync(path, 'utf-8')
  const current = matter(raw).data.authors
  if (!Array.isArray(current)) continue

  const next = splitAuthors(current)
  for (const name of next) if (looksLikeDegreeToken(name)) degreeHits.push(`${file}: "${name}"`)

  if (next.length === current.length && next.every((n, i) => n === current[i])) continue
  if (!AUTHORS_BLOCK.test(raw)) {
    console.warn(`  ! ${file}: could not locate authors block, skipped`)
    continue
  }

  const block = 'authors:\n' + next.map((n) => `  - ${JSON.stringify(n)}\n`).join('')
  if (!dryRun) writeFileSync(path, raw.replace(AUTHORS_BLOCK, () => block), 'utf-8')
  changed++
}

console.log(`${dryRun ? 'Would update' : 'Updated'} ${changed} file(s).`)
if (degreeHits.length > 0) {
  console.log(`\nPossible degree tokens parsed as authors (review manually, not removed):`)
  for (const h of degreeHits) console.log('  ' + h)
}
