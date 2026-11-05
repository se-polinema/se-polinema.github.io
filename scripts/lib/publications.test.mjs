import { describe, expect, it } from 'vitest'
import {
  looksLikeDegreeToken,
  normalizeTitle,
  splitAuthors,
  titlesMatch,
  venueProblems,
} from './publications.mjs'

describe('splitAuthors', () => {
  it('splits the "A and B and C" string Scholar returns', () => {
    expect(splitAuthors('A Hidayati and S Kom and A Retno and T Hayati')).toEqual([
      'A Hidayati', 'S Kom', 'A Retno', 'T Hayati',
    ])
  })

  it('passes arrays through, trimming and dropping empties', () => {
    expect(splitAuthors([' Dian Subhi ', '', 'Imam Rozi'])).toEqual(['Dian Subhi', 'Imam Rozi'])
  })

  it('splits array items that are themselves "and"-joined', () => {
    expect(splitAuthors(['A Budi and C Dewi'])).toEqual(['A Budi', 'C Dewi'])
  })

  it('splits comma lists only when there is no "and" or ";"', () => {
    expect(splitAuthors('A Budi, C Dewi')).toEqual(['A Budi', 'C Dewi'])
    expect(splitAuthors('Budi, A and Dewi, C')).toEqual(['Budi, A', 'Dewi, C'])
  })

  it('does not split names that merely contain "and" inside a word', () => {
    expect(splitAuthors('Sandra Anderson')).toEqual(['Sandra Anderson'])
  })

  it('returns [] for unsupported input', () => {
    expect(splitAuthors(undefined)).toEqual([])
    expect(splitAuthors(42)).toEqual([])
  })
})

describe('looksLikeDegreeToken', () => {
  it('flags degree artifacts but not real names', () => {
    for (const t of ['S Kom', 'S.Kom', 'M Kom', 'MT', 'Ph.D']) expect(looksLikeDegreeToken(t)).toBe(true)
    for (const n of ['A Hidayati', 'Dian Subhi']) expect(looksLikeDegreeToken(n)).toBe(false)
  })
})

describe('titlesMatch / normalizeTitle', () => {
  it('ignores case, punctuation and spacing', () => {
    expect(normalizeTitle('  Hello,   World! ')).toBe('hello world')
    expect(titlesMatch('Testing Laravel: A Guide', 'testing laravel a guide')).toBe(true)
    expect(titlesMatch('A', 'B')).toBe(false)
    expect(titlesMatch('', '')).toBe(false)
  })
})

describe('venueProblems', () => {
  it('reports raw-URL and generic venues', () => {
    expect(venueProblems({ venue: 'https://unindra.ac.id/x', type: 'conference' })).toContain('venue is a raw URL')
    expect(venueProblems({ venue: 'International Conference Proceedings', type: 'conference' })).toContain('venue is generic')
  })

  it('reports journal type on a conference-like venue', () => {
    expect(venueProblems({ venue: 'Seminar Nasional Informatika', type: 'journal' })).toHaveLength(1)
    expect(venueProblems({ venue: 'Seminar Nasional Informatika', type: 'conference' })).toEqual([])
  })

  it('is quiet for a normal journal', () => {
    expect(venueProblems({ venue: 'Jurnal Teknologi Informasi', type: 'journal' })).toEqual([])
  })
})
