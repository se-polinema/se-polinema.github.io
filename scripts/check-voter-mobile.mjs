// Phone check for the live-poll voter page: mounts the real LiveVoter (Supabase mocked) in headless Chrome at 360x740 and
// 320x568 for every state and reports horizontal overflow, small tap targets, a hidden send bar and inputs under 16px
// (which make iOS zoom in). Run: npm run build (once, for the site CSS), then npm run check:voter [-- --shots]
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { createServer } from 'vite'

const repo = resolve(new URL('..', import.meta.url).pathname)
const shots = process.argv.includes('--shots')
const chrome = process.env.CHROME || 'google-chrome'
const astroDir = resolve(repo, 'dist/_astro')
const globalCss = existsSync(astroDir) ? readdirSync(astroDir).find((f) => /^global\..*\.css$/.test(f)) : null
if (!globalCss) {
  console.error('dist/_astro/global.*.css not found. Run `npm run build` first.')
  process.exit(2)
}
const siteCss = readFileSync(resolve(astroDir, globalCss), 'utf8')

const server = await createServer({
  root: repo,
  logLevel: 'error',
  server: { port: 0, host: '127.0.0.1' },
  plugins: [
    vue(),
    { name: 'site-css', transformIndexHtml: () => [{ tag: 'style', children: siteCss, injectTo: 'head-prepend' }] },
  ],
  resolve: { alias: [{ find: /^(\.\.\/)+lib\/live\/session$/, replacement: resolve(repo, 'scripts/voter-harness/mock-session.ts') }] },
})
await server.listen()
const port = server.httpServer.address().port
const cases = ['code', 'notfound', 'waiting', 'ended', 'choice', 'selected', 'other', 'single', 'closed', 'reveal', 'text']
const sizes = [[360, 740], [320, 568]]
const exec = promisify(execFile)
const run = async (args) => (await exec(chrome, ['--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', ...args], { maxBuffer: 32 * 1024 * 1024, timeout: 60000 }).catch((e) => ({ stdout: e.stdout ?? '' }))).stdout
let bad = 0
try {
  const jobs = sizes.flatMap(([w, h]) => cases.map((name) => ({ w, h, name })))
  const one = async ({ w, h, name }) => {
    const url = `http://127.0.0.1:${port}/scripts/voter-harness/voter.html?case=${name}`
    const dom = await run(['--virtual-time-budget=4000', `--window-size=${w},${h}`, '--dump-dom', url])
    const m = dom.match(/<pre id="out"[^>]*>([\s\S]*?)<\/pre>/)
    if (shots) await run([`--window-size=${w},${h}`, `--screenshot=${resolve(repo, '.voter-shots', `${name}-${w}x${h}.png`)}`, '--virtual-time-budget=4000', url])
    if (!m || !m[1].trim()) return `FAIL ${name} ${w}x${h}: no measurement (page did not render)`
    const r = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'))
    const problems = []
    if (!r.hasContent) problems.push('nothing rendered')
    if (r.overflowX || r.wide.length) problems.push(`horizontal overflow: ${r.wide.slice(0, 3).join(', ') || 'page wider than screen'}`)
    if (r.small.length) problems.push(`tap targets under 44px: ${r.small.slice(0, 3).join(', ')}`)
    if (r.sendbarVisible === false) problems.push('send bar below the screen')
    if (r.fontSmall) problems.push('input font under 16px (iOS zooms in)')
    return problems.length ? `FAIL ${name} ${w}x${h}: ${problems.join('; ')}` : null
  }
  if (shots) mkdirSync(resolve(repo, '.voter-shots'), { recursive: true })
  const queue = [...jobs]
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (queue.length) {
        const msg = await one(queue.shift())
        if (msg) {
          bad++
          console.log(msg)
        }
      }
    }),
  )
} finally {
  await server.close()
}
console.log(bad ? `${bad} problem(s)` : `ok, ${cases.length * sizes.length} phone states checked`)
process.exitCode = bad ? 1 : 0
