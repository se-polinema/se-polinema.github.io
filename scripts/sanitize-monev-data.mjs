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

// Public site: program and semester level only. Class tables, class lists and per-course tables are dropped;
// the few counts the slides need (how many classes had no respondents) are kept as plain numbers.
for (const scope of ['all', 'ti', 'sib']) {
  const mhs = agregat[scope]?.mhs
  if (!mhs) continue
  const classes = mhs.response?.classes ?? []
  if (mhs.response) {
    mhs.response.kelas_total = classes.length
    mhs.response.kelas_nol = classes.filter((c) => c.n === 0).length
    mhs.response.kelas_min5 = classes.filter((c) => c.n >= 5).length
    delete mhs.response.classes
  }
  // course names only (program, semester, name); the per-course results are dropped
  mhs.mata_kuliah = (mhs.courses ?? []).map(({ prodi, sem, course }) => ({ prodi, sem, course }))
  delete mhs.courses
  if (mhs.monitored) delete mhs.monitored.classes
}
const agregatLeaks = JSON.stringify(agregat).match(/\b(TI|SIB)-\d[A-Z]\b/g)
if (agregatLeaks) {
  console.error('agregat.json still names classes, refusing to publish:', [...new Set(agregatLeaks)].slice(0, 5))
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

// analisis.json (monev/analisis/data/analisis.json in the survey repo): aggregates of the problem analysis.
// The site is public, so it keeps program and semester level results only. Everything that names a class
// (per_kelas, kelas) or a course (per_mata_kuliah) is removed, as are the course names of the PIC mapping.
const analisisPath = resolve(src, '../../analisis/data/analisis.json')
const DROP_KEYS = /^(per_kelas.*|kelas|per_mata_kuliah|pemeriksaan|pic)$/
function scrub(o) {
  if (Array.isArray(o)) return o.map(scrub)
  if (o && typeof o === 'object') {
    return Object.fromEntries(Object.entries(o).filter(([k]) => !DROP_KEYS.test(k)).map(([k, v]) => [k, scrub(v)]))
  }
  return o
}
const analisis = scrub(JSON.parse(readFileSync(analisisPath, 'utf8')))
if (analisis.p4_selaras?.pic_vs_pendukung) delete analisis.p4_selaras.pic_vs_pendukung.per_semester // names a PIC course
delete analisis.p4_selaras?.jenis_tugas_utama
const text = JSON.stringify(analisis)
const leaks = text.match(/\b(TI|SIB)-\d[A-Z]\b/g)
if (leaks) {
  console.error('analisis.json still names classes, refusing to publish:', [...new Set(leaks)].slice(0, 5))
  process.exit(1)
}

const w = (f, o) => writeFileSync(resolve(out, f), JSON.stringify(o, null, 1) + '\n')
w('agregat.json', agregat)
w('tema.json', temaOut)
w('tema_dosen.json', tdOut)
w('analisis.json', analisis)
console.log(`wrote 4 files to ${out}`)
