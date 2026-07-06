/**
 * scrape-books.mjs
 *
 * Scrapes Polinema Press books by searching for each researcher name and
 * matching authors against researchers defined in src/content/researchers/*.md.
 * Falls back to Jina Reader Markdown when the Polinema Press site blocks
 * direct automated requests.
 *
 * Outputs a JSON summary to /tmp/scraped-books.json and prints
 * YAML-ready frontmatter snippets to stdout for manual curation.
 *
 * Run:
 *   node scripts/scrape-books.mjs
 *
 * Set SCRAPE_BOOKS_INCLUDE_CATALOG=1 to also crawl the catalog/category
 * discovery pages. The default mode is intentionally focused on researcher
 * search results to avoid rate-limiting the fallback source.
 *
 * Dependencies: none (uses Node.js 18+ built-in fetch).
 */

import { writeFileSync, readdirSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const CATALOG_BASE = 'https://polinemapress21.com/katalog-buku/'
const SITE_BASE = 'https://polinemapress21.com'
const JINA_READER_BASE = 'https://r.jina.ai/http://r.jina.ai/http://'
const BROAD_DISCOVERY_URLS = [
  CATALOG_BASE,
  `${SITE_BASE}/product-category/teknik-informatika/`,
]
const RESEARCHERS_DIR = resolve(__dirname, '../src/content/researchers')
const REQUEST_DELAY_MS = 1200
const FETCH_RETRIES = 3
const INCLUDE_BROAD_DISCOVERY = process.env.SCRAPE_BOOKS_INCLUDE_CATALOG === '1'

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function toJinaUrl(url) {
  return `${JINA_READER_BASE}${url}`
}

function isBlockedResponse(text, status) {
  return status === 415
    || /Imunify360|bot-protection|Mohon tunggu sebentar|Access denied/i.test(text)
}

async function fetchRawText(url) {
  let lastError

  for (let attempt = 1; attempt <= FETCH_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,text/markdown;q=0.8,*/*;q=0.7',
          'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        },
      })
      const text = await res.text()

      if (res.status === 429 && attempt < FETCH_RETRIES) {
        await sleep(3000 * attempt)
        continue
      }

      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`, { cause: { status: res.status, text } })
      return { text, status: res.status }
    } catch (err) {
      lastError = err
      if (attempt < FETCH_RETRIES && !err.cause?.status) {
        await sleep(1500 * attempt)
        continue
      }
      break
    }
  }

  throw lastError
}

async function fetchJinaText(url) {
  const jinaUrl = toJinaUrl(url)
  const jina = await fetchRawText(jinaUrl)
  return { text: jina.text, source: 'jina', sourceUrl: jinaUrl }
}

async function fetchText(url, { preferJina = false } = {}) {
  if (preferJina) return fetchJinaText(url)

  try {
    const direct = await fetchRawText(url)
    if (!isBlockedResponse(direct.text, direct.status)) {
      return { text: direct.text, source: 'direct', sourceUrl: url }
    }
  } catch (err) {
    if (!err.cause?.status || !isBlockedResponse(err.cause.text ?? '', err.cause.status)) {
      console.warn(`   ⚠ Direct fetch failed for ${url}: ${err.message}`)
    }
  }

  return fetchJinaText(url)
}

function decodeEntities(text) {
  return text
    .replace(/&#038;/g, '&')
    .replace(/&#8211;/g, '-')
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
}

function cleanMarkdownText(text) {
  return decodeEntities(text)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[[^\]]*]\([^)]+\)/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanHtmlText(text) {
  return decodeEntities(text)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractGooglePlayDescription(html) {
  const aboutMatch = html.match(/About this ebook[\s\S]*?<div[^>]*>(?:<div[^>]*>)*([\s\S]*?)<\/div>/i)
    ?? html.match(/About this ebook[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/i)
  if (aboutMatch) return cleanHtmlText(aboutMatch[1])
  const metaDesc = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i)
  return metaDesc ? cleanHtmlText(metaDesc[1]) : ''
}

function extractFromDetail(html) {
  const titleMatch = html.match(/<h1[^>]*class="(?:[^"]*\s)?post-title[^"]*"[^>]*>([^<]+)<\/h1>/)
    ?? html.match(/<h1[^>]*class="product_title[^"]*"[^>]*>([^<]+)<\/h1>/)
    ?? html.match(/<title>([^<]+)/)
  const title = titleMatch?.[1].replace(/ &#8211; .*$/, '').replace(/\s*[-–]\s*POLINEMA PRESS.*$/i, '').trim() ?? ''

  const penulisMatch = html.match(/Penulis\s*:\s*([^<\n]+)/)
  const authors = penulisMatch
    ? penulisMatch[1].split(',').map((s) => s.trim()).filter(Boolean)
    : []

  const isbnMatch = html.match(/ISBN\s*:\s*([^<\n]+)/)
  const isbn = isbnMatch?.[1].trim() ?? ''

  const publisherMatch = html.match(/(?:Publisher|Penerbit)\s*:\s*([^<\n]+)/)
  const publisher = publisherMatch?.[1].trim() ?? ''

  const yearMatch = html.match(/Tahun\s*Terbit\s*:\s*(\d{4})/)
  const year = yearMatch ? parseInt(yearMatch[1], 10) : undefined

  const articleDescMatch = html.match(/<div[^>]*class="(?:[^"]*\s)?entry[^"]*themeform[^"]*"[^>]*>[\s\S]*?<p[^>]*class="(?:[^"]*\s)?wp-block-paragraph[^"]*"[^>]*>([\s\S]*?)<\/p>/)
    ?? html.match(/<div[^>]*class="(?:[^"]*\s)?entry[^"]*"[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/)

  const tabDescMatch = html.match(/<div[^>]*id="tab-description"[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/)
    ?? html.match(/class="woocommerce-Tabs-panel[^"]*"[^>]*>\s*<h2>Deskripsi<\/h2>\s*<p>([\s\S]*?)<\/p>/)

  const shortDescMatch = html.match(/<div[^>]*class="woocommerce-product-details__short-description"[^>]*>\s*<p>([^<]+)/)

  const playDesc = extractGooglePlayDescription(html)

  const descText = articleDescMatch?.[1] ?? tabDescMatch?.[1] ?? shortDescMatch?.[1] ?? playDesc ?? ''
  const description = cleanHtmlText(descText)

  return { title: cleanHtmlText(title), authors, isbn, publisher, year, description, coverImageUrl: '' }
}

function extractMarkdownField(markdown, label) {
  const re = new RegExp(`^\\s*${label}\\s*:\\s*(.+)$`, 'im')
  const match = markdown.match(re)
  return cleanMarkdownText(match?.[1] ?? '')
}

function extractMarkdownTitle(markdown) {
  const headings = [...markdown.matchAll(/^#\s+(.+)$/gm)]
    .map((m) => cleanMarkdownText(m[1]))
    .filter((h) => h && !/POLINEMA PRESS|Katalog Buku|Search Results/i.test(h))
  if (headings.length > 0) return headings[0]

  const titleLine = markdown.match(/^Title:\s*(.+)$/m)
  return cleanMarkdownText(titleLine?.[1]?.replace(/\s+[–-]\s+POLINEMA PRESS.*$/i, '') ?? '')
}

function extractMarkdownDescription(markdown) {
  const match = markdown.match(/^##\s+Deskripsi\s*$([\s\S]*?)(?=^##\s+|^\*?\s*Related products|^###\s+|$)/im)
  if (match) return cleanMarkdownText(match[1])

  const aboutMatch = markdown.match(/^#+\s*About this ebook\s*$([\s\S]*?)(?=^#+\s|^$)/im)
    ?? markdown.match(/^About this ebook\s*$([\s\S]*?)(?=^[A-Z][a-z]+\s*$|^#+\s|$)/im)
  if (aboutMatch) return cleanMarkdownText(aboutMatch[1])

  return ''
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function isLikelyBookCoverImage(url) {
  return !/polinema-press-header|Logo-|lambang-|ikapilogoo|header-appti|s\.w\.org|secure\.gravatar/i.test(url)
    && !/-80x80\.|-100x100\./.test(url)
}

function extractMarkdownCoverImage(markdown, title) {
  if (title) {
    const titleImageRe = new RegExp(
      `!\\[[^\\]]*${escapeRegex(title)}[^\\]]*]\\((https:\\/\\/polinemapress21\\.com\\/wp-content\\/uploads\\/[^)]+)\\)` +
      `(?:\\]\\((https:\\/\\/polinemapress21\\.com\\/wp-content\\/uploads\\/[^)]+)\\))?`,
      'i',
    )
    const titleImage = markdown.match(titleImageRe)
    const fullSizeUrl = titleImage?.[2] ?? titleImage?.[1]
    if (fullSizeUrl && isLikelyBookCoverImage(fullSizeUrl)) return fullSizeUrl
  }

  const beforeTitle = title ? markdown.split(new RegExp(`^#\\s+${escapeRegex(title)}\\s*$`, 'im'))[0] ?? markdown : markdown
  const imageLinks = [...beforeTitle.matchAll(/!\[[^\]]*]\((https:\/\/polinemapress21\.com\/wp-content\/uploads\/[^)]+)\)/g)]
    .map((m) => m[1])
    .filter(isLikelyBookCoverImage)

  return imageLinks[0] ?? ''
}

function extractFromMarkdownDetail(markdown) {
  const title = extractMarkdownTitle(markdown)
  const authors = extractMarkdownField(markdown, 'Penulis')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const isbn = extractMarkdownField(markdown, 'ISBN')
  const publisher = extractMarkdownField(markdown, '(?:Publisher|Penerbit)')
  const yearText = extractMarkdownField(markdown, 'Tahun\\s*Terbit')
  const yearMatch = yearText.match(/\d{4}/)
  const year = yearMatch ? parseInt(yearMatch[0], 10) : undefined
  const description = extractMarkdownDescription(markdown)
  const coverImageUrl = extractMarkdownCoverImage(markdown, title)

  return { title, authors, isbn, publisher, year, description, coverImageUrl }
}

function extractDetail(content, source) {
  return source === 'jina' ? extractFromMarkdownDetail(content) : extractFromDetail(content)
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

function extractProductUrlsFromMarkdown(markdown) {
  const urls = new Set()
  const re = /\]\((https:\/\/polinemapress21\.com\/produk\/[^)\s#?]+\/?)\)/g
  let m
  while ((m = re.exec(markdown)) !== null) {
    urls.add(m[1])
  }
  return [...urls]
}

function extractProductUrlsFromContent(content, source) {
  return source === 'jina' ? extractProductUrlsFromMarkdown(content) : extractProductUrls(content)
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

  console.log('📡 Discovering product pages...')
  if (!INCLUDE_BROAD_DISCOVERY) {
    console.log('   Using researcher search discovery. Set SCRAPE_BOOKS_INCLUDE_CATALOG=1 for broad catalog discovery.')
  }

  const discoveryUrls = [
    ...(INCLUDE_BROAD_DISCOVERY ? BROAD_DISCOVERY_URLS : []),
    ...researchers
      .filter((r) => r.name)
      .map((r) => `${SITE_BASE}/?s=${encodeURIComponent(r.name)}&post_type=product`),
  ]
  const productUrlSet = new Set()

  for (let i = 0; i < discoveryUrls.length; i++) {
    const url = discoveryUrls[i]
    console.log(`   [${i + 1}/${discoveryUrls.length}] ${url}`)

    try {
      const { text, source } = await fetchText(url)

      if (text.includes('Produk tidak ditemukan') || text.includes('No products were found')) {
        console.log(`   → No products found (${source})`)
        continue
      }

      const urls = extractProductUrlsFromContent(text, source)
      for (const productUrl of urls) productUrlSet.add(productUrl)
      console.log(`   → Found ${urls.length} products (${source})`)
    } catch (err) {
      console.error(`   ❌ Error fetching discovery URL ${url}: ${err.message}`)
    }

    await sleep(REQUEST_DELAY_MS)
  }

  const allProductUrls = [...productUrlSet]

  console.log(`\n📚 Found ${allProductUrls.length} total product URLs.\n`)

  const books = []
  const unmatched = new Set()
  const matchedResearchers = new Map()

  for (let i = 0; i < allProductUrls.length; i++) {
    const productUrl = allProductUrls[i]
    console.log(`   [${i + 1}/${allProductUrls.length}] ${productUrl}`)

    try {
      const { text, source, sourceUrl } = await fetchText(productUrl, { preferJina: true })
      const detail = extractDetail(text, source)
      const coverImageUrl = detail.coverImageUrl || (source === 'direct' ? extractCoverImage(text, productUrl) : '')

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
            publisher: detail.publisher,
            isbn: detail.isbn,
            year: detail.year,
            coverImageUrl,
            description: detail.description,
          })
        } else if (a.length > 2) {
          unmatched.add(a)
        }
      }

      books.push({
        ...detail,
        coverImageUrl,
        productUrl,
        source,
        sourceUrl,
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
        coverImageUrl: '',
        productUrl,
        source: '',
        sourceUrl: '',
        matchedResearchers: [],
        error: err.message,
      })
    }

    await sleep(REQUEST_DELAY_MS)
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
      if (b.coverImageUrl) console.log(`    # remoteCoverImage: "${b.coverImageUrl}"`)
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
