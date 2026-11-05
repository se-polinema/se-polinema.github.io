import { describe, expect, it } from 'vitest'
import { generateAPA, generateBibTeX, generateRIS, type PublicationData } from './citation.ts'

const journal: PublicationData = {
  title: 'Testing Laravel Applications',
  year: 2024,
  type: 'journal',
  venue: 'Journal of Software Engineering',
  authors: ['Dian Hanifudin Subhi', 'Imam Fahrur Rozi'],
  doi: '10.1000/xyz123',
  url: 'https://example.org/paper',
}

const conference: PublicationData = {
  title: 'Mining Student Theses',
  year: 2022,
  type: 'conference',
  venue: 'Proceedings of SENTIA',
  authors: ['Ridwan Rismanto'],
}

describe('generateBibTeX', () => {
  it('emits an @article for journals with journal, doi and url fields', () => {
    const out = generateBibTeX(journal)
    expect(out.startsWith('@article{subhi2024testing,')).toBe(true)
    expect(out).toContain('title = {Testing Laravel Applications},')
    expect(out).toContain('author = {Subhi, Dian Hanifudin and Rozi, Imam Fahrur},')
    expect(out).toContain('journal = {Journal of Software Engineering},')
    expect(out).toContain('doi = {10.1000/xyz123},')
    expect(out).toContain('url = {https://example.org/paper},')
    expect(out.trimEnd().endsWith('}')).toBe(true)
  })

  it('emits @inproceedings with booktitle for conferences and omits missing doi/url', () => {
    const out = generateBibTeX(conference)
    expect(out).toMatch(/^@inproceedings\{rismanto2022mining,/)
    expect(out).toContain('booktitle = {Proceedings of SENTIA},')
    expect(out).not.toContain('doi =')
    expect(out).not.toContain('url =')
  })
})

describe('generateRIS', () => {
  it('uses JOUR for journals and one AU line per author', () => {
    const out = generateRIS(journal)
    expect(out).toContain('TY  - JOUR')
    expect(out).toContain('AU  - Subhi, Dian Hanifudin')
    expect(out).toContain('AU  - Rozi, Imam Fahrur')
    expect(out).toContain('JO  - Journal of Software Engineering')
    expect(out).toContain('DO  - 10.1000/xyz123')
  })

  it('uses CONF for conferences', () => {
    expect(generateRIS(conference)).toContain('TY  - CONF')
  })
})

describe('generateAPA', () => {
  it('includes the authors, year, title and venue', () => {
    const out = generateAPA(journal)
    expect(out).toContain('Subhi, D. H.')
    expect(out).toContain('(2024)')
    expect(out).toContain('Testing Laravel Applications')
    expect(out).toContain('Journal of Software Engineering')
  })
})
