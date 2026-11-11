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
    deck.slides.forEach((s, i) => {
      if (s.question && !keys.includes(s.question)) fail(`${deck.slug} slide ${i + 1} (${s.id}): unknown question ${s.question}`)
      const html = s.title + s.render(ctx) + (s.src ?? '')
      const hit = html.match(/undefined|NaN|\[object|null%/g)
      if (hit) fail(`${deck.slug} slide ${i + 1} (${s.id}): ${[...new Set(hit)].join(', ')}`)
    })
    console.log(`${deck.slug}: ${deck.slides.length} slides, ${deck.questions.length} questions`)
  }
} finally {
  await vite.close()
}
console.log(bad ? `${bad} problem(s)` : 'ok')
process.exit(bad ? 1 : 0)
