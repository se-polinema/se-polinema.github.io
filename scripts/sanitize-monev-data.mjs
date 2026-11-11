// Copies the Monev PBL survey aggregates into src/data/monev-pbl/ for the public site.
// The site and its static HTML are public, so this uses an ALLOWLIST: only aggregate numbers and
// analyst-coded theme labels pass through. Student quote excerpts and the analyst's free-text
// summaries (quotes, ringkasan, makna) and lecturer free-text suggestion labels are dropped.
//
//   node scripts/sanitize-monev-data.mjs [sourceDir]
//   default sourceDir: ../../polinema/pbl35/monev/laporan/data (relative to this repo)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const repo = resolve(new URL('..', import.meta.url).pathname)
const src = resolve(process.argv[2] ?? resolve(repo, '../../polinema/pbl35/monev/laporan/data'))
const out = resolve(repo, 'src/data/monev-pbl')
mkdirSync(out, { recursive: true })

const read = (f) => JSON.parse(readFileSync(resolve(src, f), 'utf8'))
const pickKeys = (o, keys) => Object.fromEntries(keys.filter((k) => k in o).map((k) => [k, o[k]]))

// agregat.json is aggregate-only (verified: no string value over 90 chars). Pass through whole,
// but fail loudly if a free-text-looking field ever appears.
const agregat = read('agregat.json')
const suspicious = []
;(function walk(o, p = '') {
  if (Array.isArray(o)) o.forEach((v, i) => walk(v, `${p}[${i}]`))
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) walk(v, `${p}.${k}`)
  else if (typeof o === 'string' && (o.length > 120 || /quote|komentar|comment/i.test(p))) suspicious.push(p)
})(agregat)
if (suspicious.length) {
  console.error('agregat.json has free-text-looking fields, refusing to publish:', suspicious.slice(0, 5))
  process.exit(1)
}

const sub = (s) => pickKeys(s, ['label', 'n', 'ti', 'sib'])
const tema = read('tema.json')
const temaOut = {
  ...pickKeys(tema, ['total_answers', 'substantive', 'substantive_ti', 'substantive_sib']),
  themes: tema.themes.map((t) => ({ ...pickKeys(t, ['key', 'kind', 'label', 'n', 'ti', 'sib']), subs: t.subs.map(sub) })),
  usulan: tema.usulan.map(sub),
  sib_info: pickKeys(tema.sib_info, ['n', 'ti', 'sib']),
  membaik: pickKeys(tema.membaik, ['n', 'ti', 'sib']),
}

const td = read('tema_dosen.json')
const tdOut = {
  ...pickKeys(td, ['dosen_n', 'input']),
  penulis: pickKeys(td.penulis, ['n', 'ti', 'sib']),
  themes: td.themes.map((t) => pickKeys(t, ['key', 'kind', 'label', 'n', 'ti', 'sib'])),
}

const w = (f, o) => writeFileSync(resolve(out, f), JSON.stringify(o, null, 1) + '\n')
w('agregat.json', agregat)
w('tema.json', temaOut)
w('tema_dosen.json', tdOut)
console.log(`wrote 3 files to ${out}`)
