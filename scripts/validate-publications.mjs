import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const PUBLICATIONS_DIR = resolve(ROOT, 'src/content/publications')

function main() {
  const errors = []

  if (!existsSync(PUBLICATIONS_DIR)) {
    console.log('No publications directory found. Skipping validation.')
    process.exit(0)
  }

  const files = readdirSync(PUBLICATIONS_DIR).filter(f => f.endsWith('.md'))

  if (files.length === 0) {
    console.log('No publication files found. Skipping validation.')
    process.exit(0)
  }

  for (const file of files) {
    const filePath = resolve(PUBLICATIONS_DIR, file)
    let content
    try {
      content = readFileSync(filePath, 'utf-8')
    } catch (e) {
      errors.push(`${file}: cannot read file`)
      continue
    }

    let data
    try {
      data = matter(content).data
    } catch (e) {
      errors.push(`${file}: invalid frontmatter`)
      continue
    }

    if (!data.authors || !Array.isArray(data.authors) || data.authors.length === 0) {
      errors.push(`${file}: missing or empty authors`)
    }

    if (!data.venue || data.venue.trim() === 'Unknown Venue') {
      errors.push(`${file}: missing or placeholder venue ("Unknown Venue")`)
    }
  }

  if (errors.length > 0) {
    console.error(`Validation failed: ${errors.length} error(s) found:`)
    for (const err of errors) {
      console.error(`  - ${err}`)
    }
    process.exit(1)
  }

  console.log(`Validation passed: ${files.length} publication(s) look good.`)
}

main()
