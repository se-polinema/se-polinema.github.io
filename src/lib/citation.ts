export interface PublicationData {
  title: string
  year: number
  type: 'journal' | 'conference' | 'book-chapter' | 'proceeding' | 'preprint'
  venue: string
  authors: string[]
  url?: string
  doi?: string
}

function formatAuthorName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return { first: parts[0], last: parts[0] }
  const last = parts[parts.length - 1]
  const first = parts.slice(0, -1).join(' ')
  return { first, last }
}

function authorLastName(fullName: string): string {
  return formatAuthorName(fullName).last
}

function bibtexAuthorList(authors: string[]): string {
  return authors.map((name) => {
    const { last, first } = formatAuthorName(name)
    return `${last}, ${first}`
  }).join(' and ')
}

function apaAuthorList(authors: string[]): string {
  if (authors.length === 0) return ''
  if (authors.length === 1) return formatAuthorName(authors[0]).last + ', ' + authors[0].split(/\s+/).slice(0, -1).map(s => s.charAt(0) + '.').join(' ') + '.'
  if (authors.length <= 7) {
    return authors.map((name) => {
      const { last, first } = formatAuthorName(name)
      const initials = first.split(/\s+/).map(s => s.charAt(0) + '.').join(' ')
      return `${last}, ${initials}`
    }).join(', ') + '.'
  }
  return authors.slice(0, 6).map((name) => {
    const { last, first } = formatAuthorName(name)
    const initials = first.split(/\s+/).map(s => s.charAt(0) + '.').join(' ')
    return `${last}, ${initials}`
  }).join(', ') + ', … ' + authorLastName(authors[authors.length - 1]) + ' ' + authors[authors.length - 1].split(/\s+/).slice(0, -1).map(s => s.charAt(0) + '.').join(' ') + '.'
}

function bibtexEntryType(type: string): string {
  switch (type) {
    case 'journal': return 'article'
    case 'conference': case 'proceeding': return 'inproceedings'
    case 'book-chapter': return 'incollection'
    case 'preprint': return 'unpublished'
    default: return 'misc'
  }
}

function risTypeTag(type: string): string {
  switch (type) {
    case 'journal': return 'JOUR'
    case 'conference': case 'proceeding': return 'CONF'
    case 'book-chapter': return 'CHAP'
    case 'preprint': return 'UNPB'
    default: return 'GEN'
  }
}

function generateCiteKey(authors: string[], year: number, title: string): string {
  const firstAuthor = authors.length > 0 ? authorLastName(authors[0]).toLowerCase().replace(/[^a-z0-9]/g, '') : 'anonymous'
  const firstTitleWord = title.replace(/[^a-zA-Z0-9\s]/g, '').trim().split(/\s+/)[0]?.toLowerCase() ?? 'untitled'
  return `${firstAuthor}${year}${firstTitleWord}`
}

export function generateBibTeX(pub: PublicationData): string {
  const entryType = bibtexEntryType(pub.type)
  const citeKey = generateCiteKey(pub.authors, pub.year, pub.title)
  const authors = bibtexAuthorList(pub.authors)
  const venueField = pub.type === 'journal' ? 'journal' : 'booktitle'

  const lines = [
    `@${entryType}{${citeKey},`,
    `  title = {${pub.title}},`,
  ]
  if (pub.authors.length > 0) {
    lines.push(`  author = {${authors}},`)
  }
  lines.push(`  year = {${pub.year}},`)
  lines.push(`  ${venueField} = {${pub.venue}},`)
  if (pub.doi) {
    lines.push(`  doi = {${pub.doi}},`)
  }
  if (pub.url) {
    lines.push(`  url = {${pub.url}},`)
  }
  lines.push('}')
  return lines.join('\n')
}

export function generateRIS(pub: PublicationData): string {
  const lines: string[] = []
  lines.push(`TY  - ${risTypeTag(pub.type)}`)
  lines.push(`TI  - ${pub.title}`)
  if (pub.authors.length > 0) {
    for (const author of pub.authors) {
      const { last, first } = formatAuthorName(author)
      lines.push(`AU  - ${last}, ${first}`)
    }
  }
  lines.push(`PY  - ${pub.year}`)
  if (pub.type === 'journal') {
    lines.push(`JO  - ${pub.venue}`)
  } else if (pub.type === 'book-chapter') {
    lines.push(`T2  - ${pub.venue}`)
  } else {
    lines.push(`CY  - ${pub.venue}`)
  }
  if (pub.doi) {
    lines.push(`DO  - ${pub.doi}`)
  }
  if (pub.url) {
    lines.push(`UR  - ${pub.url}`)
  }
  lines.push('ER  - ')
  return lines.join('\n')
}

export function generateAPA(pub: PublicationData): string {
  const authorPart = apaAuthorList(pub.authors)
  const yearPart = `(${pub.year}).`
  const titlePart = `${pub.title}.`

  let venuePart = ''
  if (pub.type === 'journal') {
    venuePart = ` ${pub.venue}.`
  } else if (pub.type === 'conference' || pub.type === 'proceeding') {
    venuePart = ` In ${pub.venue}.`
  } else if (pub.type === 'book-chapter') {
    venuePart = ` In ${pub.venue}.`
  } else if (pub.type === 'preprint') {
    venuePart = ` ${pub.venue}.`
  }

  let doiPart = ''
  if (pub.doi) {
    doiPart = ` https://doi.org/${pub.doi}`
  } else if (pub.url) {
    doiPart = ` ${pub.url}`
  }

  return `${authorPart} ${yearPart} ${titlePart}${venuePart}${doiPart}`.replace(/\s+/g, ' ').trim()
}

export function generateCitations(pub: PublicationData) {
  return {
    bibtex: generateBibTeX(pub),
    ris: generateRIS(pub),
    apa: generateAPA(pub),
  }
}
