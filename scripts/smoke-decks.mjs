// Renders every slide of every live deck through Vite's SSR loader and fails on leaked
// "undefined" / "NaN" / "[object" / "null%" values, duplicate or invalid question keys, and
// slides that reference unknown questions. Run: npm run smoke:decks
import { createServer } from 'vite'

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
let bad = 0
const fail = (m) => {
  bad++
  console.log('FAIL', m)
}
try {
  const { decks } = await vite.ssrLoadModule('/src/decks/index.ts')
  const ctx = { qr: 'data:,', joinUrl: 'http://x/vote/?code=ABCDE', code: 'ABCDE' }
  for (const deck of decks) {
    if (deck.slug.includes('.')) fail(`${deck.slug}: slug must not contain '.'`)
    const keys = deck.questions.map((q) => q.key)
    if (new Set(keys).size !== keys.length) fail(`${deck.slug}: duplicate question keys`)
    for (const q of deck.questions) {
      if (!/^[a-z0-9_.-]{2,64}$/.test(`${deck.slug}.${q.key}`)) fail(`${deck.slug}.${q.key}: key format`)
      if (q.kind !== 'text' && (q.options.length < 2 || q.max < 1 || q.max > q.options.length)) fail(`${deck.slug}.${q.key}: options/max`)
    }
    // Plain language: statistics terms belong in the appendix only (slides) and nowhere in poll text.
    const STATS = /\bselang\b|koefisien|regresi|\br = |R²|\[\d|tenggat|skala 1 sampai 5|\d,\d poin/i
    for (const q of deck.questions) {
      const hit = (q.prompt + q.options.map((o) => o.label + (o.note ?? '')).join(' ')).match(STATS)
      if (hit) fail(`${deck.slug}.${q.key}: statistics term in poll text: ${hit[0]}`)
    }
    for (const msg of deck.validate?.() ?? []) fail(`${deck.slug}: ${msg}`)
    deck.slides.forEach((s, i) => {
      if (s.question && !keys.includes(s.question)) fail(`${deck.slug} slide ${i + 1} (${s.id}): unknown question ${s.question}`)
      const html = s.title + s.render(ctx) + (s.src ?? '')
      const stats = s.appendix && s.id !== 'a-metode' ? null : html.replace(/<[^>]+>/g, ' ').match(STATS)
      if (stats) fail(`${deck.slug} slide ${i + 1} (${s.id}): statistics term on a main slide: ${stats[0]}`)
      const hit = html.match(/undefined|NaN|\[object|null%|[\u2013\u2014]/g)
      if (hit) fail(`${deck.slug} slide ${i + 1} (${s.id}): ${[...new Set(hit)].join(', ')}`)
    })
    console.log(`${deck.slug}: ${deck.slides.length} slides, ${deck.questions.length} questions`)
  }
} finally {
  await vite.close()
}
console.log(bad ? `${bad} problem(s)` : 'ok')
process.exit(bad ? 1 : 0)
