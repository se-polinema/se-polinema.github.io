// Guard for the base-path convention in AGENTS.md: never hardcode a
// root-absolute path in src/. Use withBase()/stripBase() from src/lib/paths.ts.
//
// Flags, in .vue/.astro/.ts files under src/:
//   href="/x"   src="/x"   action="/x"      (static attributes)
//   fetch('/x')  fetch(`/x`)
//   '/x/' + var                              (string concatenation)
// Concatenation passed straight into withBase(...) is fine. A line containing the marker `base-path-ok` is ignored, for deliberate
// cases such as production-only links; give a reason next to the marker.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('../src/', import.meta.url).pathname
const SKIP_DIRS = new Set(['graphify-out', 'node_modules'])
const SKIP_FILES = [/\.test\.ts$/, /[\\/]lib[\\/]paths\.ts$/, /[\\/]utils[\\/]rehype-base-paths\.ts$/]
const EXT = /\.(vue|astro|ts)$/

const RULES = [
  { name: 'static attribute', re: /\b(?:href|src|action)=["']\/(?!\/)[^"']*["']/ },
  { name: 'fetch with root path', re: /\bfetch\(\s*['"`]\/(?!\/)/ },
  { name: 'root path concatenation', re: /['"]\/[\w-]+\/['"]\s*\+/ },
]

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) yield* walk(full)
    else if (EXT.test(entry) && !SKIP_FILES.some((re) => re.test(full))) yield full
  }
}

const violations = []
for (const file of walk(ROOT)) {
  readFileSync(file, 'utf-8').split('\n').forEach((line, i) => {
    const trimmed = line.trim()
    if (line.includes('base-path-ok') || trimmed.startsWith('//') || trimmed.startsWith('*')) return
    for (const rule of RULES) {
      if (rule.name === 'root path concatenation' && /withBase\(\s*['"]\/[\w-]+\/['"]\s*\+/.test(line)) continue
      if (rule.re.test(line)) {
        violations.push(`${relative(process.cwd(), file)}:${i + 1}  [${rule.name}]  ${line.trim()}`)
      }
    }
  })
}

if (violations.length > 0) {
  console.error(`Found ${violations.length} hardcoded root-absolute path(s):\n`)
  for (const v of violations) console.error('  ' + v)
  console.error('\nWrap them with withBase() from src/lib/paths.ts (see AGENTS.md), or add a `base-path-ok: reason` marker on deliberate cases.')
  process.exit(1)
}
console.log('check-base-paths: OK')
