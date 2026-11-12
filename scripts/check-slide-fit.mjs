// Checks that every slide of every live deck fits the 1920x1080 stage: nothing runs into the footer or off the canvas.
// Renders each slide (polls both plain and with revealed results) in headless Chrome and measures the real layout.
//
//   npm run build        # once, so the site CSS and tokens exist in dist/
//   npm run check:fit    # all decks
//   npm run check:fit -- --shots   # also save a PNG of every failing slide to .fit-shots/
//   npm run check:fit -- --all     # PNG of every slide state
//
// Needs Google Chrome (CHROME env var or google-chrome on PATH). Local check, not part of CI.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createServer } from 'vite'

const repo = resolve(new URL('..', import.meta.url).pathname)
const shots = process.argv.includes('--shots') || process.argv.includes('--all')
const all = process.argv.includes('--all')
const chrome = process.env.CHROME || 'google-chrome'
const tmp = resolve(repo, '.fit-tmp')
mkdirSync(tmp, { recursive: true })

const astroDir = resolve(repo, 'dist/_astro')
const globalCss = existsSync(astroDir) ? readdirSync(astroDir).find((f) => /^global\..*\.css$/.test(f)) : null
if (!globalCss) {
  console.error('dist/_astro/global.*.css not found. Run `npm run build` first.')
  process.exit(2)
}
const css = readFileSync(resolve(astroDir, globalCss), 'utf8') + '\n' + readFileSync(resolve(repo, 'src/styles/live.css'), 'utf8')

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const cases = []
try {
  const { decks } = await vite.ssrLoadModule('/src/decks/index.ts')
  const { slideHtml } = await vite.ssrLoadModule('/src/lib/live/stage.ts')
  const { paintOptions, paintSuggestions } = await vite.ssrLoadModule('/src/lib/live/paint.ts')
  const ctx = { qr: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', joinUrl: 'https://se-polinema.github.io/vote/?code=ABCDEF', code: 'ABCDEF' }
  const fake = { innerHTML: '' }
  for (const deck of decks) {
    deck.slides.forEach((s, i) => {
      const q = deck.questions.find((x) => x.key === s.question)
      const states = q && q.kind !== 'text' ? ['plain', 'revealed'] : ['plain']
      for (const state of states) {
        let html = slideHtml(deck, i, ctx)
        if (q && q.kind !== 'text') {
          const counts = Object.fromEntries(q.options.map((o, k) => [o.key, 40 - k * 5]))
          const res = {
            n: 60,
            counts,
            n_other: q.other ? 6 : 0,
            others: q.other ? Array.from({ length: 6 }, () => 'Usulan lain yang cukup panjang dari dosen tentang cara melaksanakan solusi ini di kelas') : [],
          }
          paintOptions(fake, q, state === 'revealed' ? res : null, state === 'revealed')
          html = html.replace(/(<div class="lv-opts"[^>]*>)<\/div>/, `$1${fake.innerHTML}</div>`)
        } else if (q) {
          paintSuggestions(fake, Array.from({ length: 5 }, () => ({ body: 'Saran dari dosen yang cukup panjang untuk menguji apakah daftar saran muat di layar proyektor.' })))
          html = html.replace(/(<div class="lv-sug-list"[^>]*>)<\/div>/, `$1${fake.innerHTML}</div>`)
        }
        if (s.recap && deck.paintRecap) {
          const all = Object.fromEntries(deck.questions.filter((x) => x.kind !== 'text').map((x) => [x.key, { n: 20, counts: Object.fromEntries(x.options.map((o, k) => [o.key, 12 - k])), n_other: 3 }]))
          deck.paintRecap(fake, all)
          html = html.replace(/(<div class="lv-recap"[^>]*>)[\s\S]*?(<\/div>\s*<p class="lv-closing)/, `$1${fake.innerHTML}$2`)
        }
        cases.push({ deck: deck.slug, i: i + 1, id: s.id, state, html })
      }
    })
  }
} finally {
  await vite.close()
}

const page = (list, only) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=DM+Serif+Display:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
<style>${css}
body{margin:0;background:#888}.fit-case{position:relative;width:1920px;height:1080px;margin:0 0 24px}
.fit-case .lv-stage{position:absolute;left:0;top:0;transform:none}</style></head>
<body><div class="live">${list
  .map((c, k) => `<div class="fit-case" data-k="${k}"><div class="lv-stage">${c.html}</div></div>`)
  .join('')}</div>
<pre id="out"></pre>
<script>
${only ? '' : `
document.fonts.ready.then(() => setTimeout(() => {
  const out = []
  document.querySelectorAll('.fit-case').forEach((el) => {
    const body = el.querySelector('.lv-body'), foot = el.querySelector('footer'), box = el.getBoundingClientRect()
    const footTop = foot ? foot.getBoundingClientRect().top : box.bottom
    let low = 0, right = 0
    body.querySelectorAll('*').forEach((n) => {
      const r = n.getBoundingClientRect()
      if (!r.width && !r.height) return
      low = Math.max(low, r.bottom)
      right = Math.max(right, r.right)
    })
    let footLow = 0
    if (foot) foot.querySelectorAll('span').forEach((n) => { footLow = Math.max(footLow, n.getBoundingClientRect().bottom) })
    out.push({ k: +el.dataset.k, footPast: Math.round(footLow - (box.bottom - 12)), intoFooter: Math.round(low - footTop), pastRight: Math.round(right - box.right), scroll: body.scrollHeight - body.clientHeight, fonts: document.fonts.check('16px Inter') })
  })
  document.getElementById('out').textContent = JSON.stringify(out)
}, 300))`}
</script></body></html>`

const html = resolve(tmp, 'fit.html')
writeFileSync(html, page(cases))
const run = (args) => execFileSync(chrome, ['--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 })
let dom
try {
  dom = run(['--virtual-time-budget=20000', '--window-size=1920,1080', '--dump-dom', 'file://' + html])
} catch (e) {
  console.error('Could not run Chrome (set CHROME=/path/to/chrome):', e.message.split('\n')[0])
  process.exit(2)
}
const m = dom.match(/<pre id="out">([\s\S]*?)<\/pre>/)
if (!m || !m[1].trim()) {
  console.error('No measurements came back from Chrome.')
  process.exit(2)
}
const res = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'))
if (!res.some((r) => r.fonts)) console.log('note: Inter did not load (offline?); measured with fallback fonts, leave extra margin')

const MARGIN = 0 // px that content may touch the footer line
let bad = 0
for (const r of res) {
  const c = cases[r.k]
  const over = r.intoFooter > MARGIN || r.pastRight > 0 || r.scroll > 0 || r.footPast > 0
  if (over) bad++
  if (over) console.log(`FAIL ${c.deck} slide ${c.i} (${c.id}, ${c.state}): ${r.intoFooter > 0 ? `${r.intoFooter}px into the footer; ` : ''}${r.pastRight > 0 ? `${r.pastRight}px past the right edge; ` : ''}${r.scroll > 0 ? `body overflows by ${r.scroll}px; ` : ''}${r.footPast > 0 ? `source line runs ${r.footPast}px too low (shorten it)` : ''}`)
  if (shots && (over || all)) {
    mkdirSync(resolve(repo, '.fit-shots'), { recursive: true })
    const one = resolve(tmp, `one-${r.k}.html`)
    writeFileSync(one, page([c], true))
    run(['--window-size=1920,1080', `--screenshot=${resolve(repo, '.fit-shots', `${c.i}-${c.id}-${c.state}.png`)}`, '--virtual-time-budget=6000', 'file://' + one])
  }
}
console.log(bad ? `${bad} slide state(s) overflow (${cases.length} checked)` : `ok, ${cases.length} slide states fit`)
process.exit(bad ? 1 : 0)
