/**
 * scrape-books.mjs
 *
 * Scrapes the Polinema Press book catalog from
 * https://polinemapress21.com/katalog-buku/ and matches authors against
 * researchers defined in src/content/researchers/*.md.
 *
 * Outputs a JSON summary to /tmp/scraped-books.json and prints
 * YAML-ready frontmatter snippets to stdout for manual curation.
 *
 * Run:
 *   node scripts/scrape-books.mjs
 *
 * Dependencies: none (uses Node.js 18+ built-in fetch).
 */

import { writeFileSync, readdirSync, readFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const CATALOG_BASE = 'https://polinemapress21.com/katalog-buku/'
const RESEARCHERS_DIR = resolve(__dirname, '../src/content/researchers')
const REQUEST_DELAY_MS = 600

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'se-polinema-scraper/1.0 (+https://se-polinema.github.io)' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.text()
}

function extractFromDetail(html) {
  const titleMatch = html.match(/<h1[^>]*class="product_title[^"]*"[^>]*>([^<]+)<\/h1>/)
    ?? html.match(/<title>([^<]+)/)
  const title = titleMatch?.[1].replace(/ &#8211; .*$/, '').trim() ?? ''

  const penulisMatch = html.match(/Penulis\s*:\s*([^<\n]+)/)
  const authors = penulisMatch
    ? penulisMatch[1].split(',').map((s) => s.trim()).filter(Boolean)
    : []

  const isbnMatch = html.match(/ISBN\s*:\s*([^<\n]+)/)
  const isbn = isbnMatch?.[1].trim() ?? ''

  const publisherMatch = html.match(/Publisher\s*:\s*([^<\n]+)/)
  const publisher = publisherMatch?.[1].trim() ?? ''

  const yearMatch = html.match(/Tahun\s*Terbit\s*:\s*(\d{4})/)
  const year = yearMatch ? parseInt(yearMatch[1], 10) : undefined

  const descMatch = html.match(/<div[^>]*class="woocommerce-product-details__short-description"[^>]*>\s*<p>([^<]+)/)
    ?? html.match(/class="woocommerce-Tabs-panel[^"]*"[^>]*>\s*<h2>Deskripsi<\/h2>\s*<p>([\s\S]*?)<\/p>/)
  const description = descMatch?.[1].trim() ?? ''

  return { title, authors, isbn, publisher, year, description }
}

function extractProductUrls(html) {
  const re = /<li class="product[^"]*"[^>]*>\s*<a href="(https:\/\/polinemapress21\.com\/produk\/[^"]+)"/g
  const urls = []
  let m
  while ((m = re.exec(html)) !== null) {
    if (!urls.includes(m[1])) urls.push(m[1])
  }
  return urls
}

function extractCoverImage(html, productUrl) {
  const re = new RegExp(
    `<a href="${productUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>\\s*<img[^>]*src="([^"]+)"[^>]*>`,
    's',
  )
  const m = html.match(re)
  if (m) return m[1]
  const imgRe = /<img[^>]*src="([^"]+)"[^>]*class="attachment-woocommerce_thumbnail[^"]*"[^>]*>/g
  const imgs = [...html.matchAll(imgRe)]
  return imgs.length > 0 ? imgs[0][1] : ''
}

function loadResearchers() {
  const files = readdirSync(RESEARCHERS_DIR).filter((f) => f.endsWith('.md'))
  return files.map((f) => {
    const content = readFileSync(resolve(RESEARCHERS_DIR, f), 'utf8')
    const nameMatch = content.match(/^name:\s*"([^"]+)"/m)
    const id = f.replace(/\.md$/, '')
    return {
      id,
      name: nameMatch?.[1] ?? '',
      filename: f,
    }
  })
}

function fuzzyMatch(authorName, researchers) {
  const a = authorName.toLowerCase().replace(/[^a-z\s]/g, '').trim()
  if (!a) return null

  // direct match
  for (const r of researchers) {
    if (r.name.toLowerCase() === a) return r
  }

  // tokens match (handle "Dian Hanifudin Subhi" vs "Dian Hanifudin Subhi, S.Kom.")
  const tokens = a.split(/\s+/).filter((t) => t.length > 2)
  for (const r of researchers) {
    const rTokens = r.name.toLowerCase().split(/\s+/)
    if (tokens.length >= 2 && tokens.every((t) => rTokens.includes(t))) {
      return r
    }
  }

  // partial: first+last name match
  if (tokens.length >= 2) {
    const first = tokens[0]
    const last = tokens[tokens.length - 1]
    for (const r of researchers) {
      const rLower = r.name.toLowerCase()
      if (rLower.includes(first) && rLower.includes(last)) return r
    }
  }

  return null
}

async function main() {
  console.log('🔍 Loading researchers...')
  const researchers = loadResearchers()
  console.log(`   Found ${researchers.length} researcher(s)\n`)

  console.log('📡 Fetching catalog listing pages...')

  const allProductUrls = []
  let page = 1
  while (true) {
    const url = page === 1 ? CATALOG_BASE : `${CATALOG_BASE}page/${page}/`
    console.log(`   Page ${page}: ${url}`)
    const html = await fetchText(url)

    // check if this page actually has content (some WP configs return last page again)
    if (html.includes('Produk tidak ditemukan') || html.includes('No products were found')) {
      console.log('   → No more products, stopping pagination.')
      break
    }

    const urls = extractProductUrls(html)
    if (urls.length === 0) {
      console.log('   → No product URLs found on this page, stopping.')
      break
    }

    allProductUrls.push(...urls)
    console.log(`   → Found ${urls.length} products on this page`)

    page++
    await new Promise((r) => setTimeout(r, REQUEST_DELAY_MS))
  }

  console.log(`\n📚 Found ${allProductUrls.length} total product URLs.\n`)

  const books = []
  const unmatched = new Set()
  const matchedResearchers = new Map()

  for (let i = 0; i < allProductUrls.length; i++) {
    const productUrl = allProductUrls[i]
    console.log(`   [${i + 1}/${allProductUrls.length}] ${productUrl}`)

    try {
      const detailHtml = await fetchText(productUrl)
      const detail = extractFromDetail(detailHtml)

      // match authors to researchers
      const matched = []
      for (const a of detail.authors) {
        const match = fuzzyMatch(a, researchers)
        if (match) {
          matched.push(match)
          if (!matchedResearchers.has(match.id)) {
            matchedResearchers.set(match.id, [])
          }
          matchedResearchers.get(match.id).push({
            title: detail.title,
            url: productUrl,
          })
        } else if (a.length > 2) {
          unmatched.add(a)
        }
      }

      books.push({
        ...detail,
        productUrl,
        matchedResearchers: matched.map((m) => ({ id: m.id, name: m.name })),
      })
    } catch (err) {
      console.error(`   ❌ Error fetching ${productUrl}: ${err.message}`)
      books.push({
        title: '',
        authors: [],
        isbn: '',
        publisher: '',
        year: undefined,
        description: '',
        productUrl,
        matchedResearchers: [],
        error: err.message,
      })
    }

    await new Promise((r) => setTimeout(r, REQUEST_DELAY_MS))
  }

  const labBooks = books.filter((b) => b.matchedResearchers.length > 0)

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`📊 Summary`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`   Total books scraped:    ${books.length}`)
  console.log(`   Matched to researchers: ${labBooks.length}`)
  console.log(`   Unmatched authors:      ${unmatched.size}`)

  if (unmatched.size > 0) {
    console.log(`\n   Unmatched author names:`)
    for (const name of [...unmatched].sort()) {
      console.log(`     - "${name}"`)
    }
  }

  console.log(`\n   Matched researcher → book counts:`)
  for (const [id, bookList] of matchedResearchers.entries()) {
    console.log(`     ${id}: ${bookList.length} book(s)`)
    for (const b of bookList) {
      console.log(`       - ${b.title}`)
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`📝 YAML-ready frontmatter snippets`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

  for (const [id, bookList] of matchedResearchers.entries()) {
    console.log(`\n  # ── ${id} ──`)
    for (const b of bookList) {
      console.log(`  - title: "${b.title}"`)
      if (b.publisher) console.log(`    publisher: "${b.publisher}"`)
      if (b.isbn) console.log(`    isbn: "${b.isbn}"`)
      if (b.year) console.log(`    year: ${b.year}`)
      console.log(`    url: "${b.url}"`)
      if (b.description) console.log(`    description: "${b.description.slice(0, 120)}..."`)
      console.log('')
    }
  }

  // Write full JSON output for review
  const outPath = '/tmp/scraped-books.json'
  writeFileSync(outPath, JSON.stringify({ books, labBooks, unmatched: [...unmatched] }, null, 2))
  console.log(`\n✅ Full dataset written to ${outPath}`)
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
