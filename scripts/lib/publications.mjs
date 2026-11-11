// Pure helpers shared by the publication scripts (update-publications,
// normalize-publication-authors, enrich-dois). No I/O here so they are unit-testable.

export function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Splits Google Scholar's author field into individual names.
 * Scholar returns either an array or one string like
 * "A Hidayati and S Kom and A Retno". Accepts both, and also tolerates
 * ";"-separated lists and (when no "and"/";" is present) comma-separated ones.
 */
export function splitAuthors(input) {
  const items = Array.isArray(input) ? input : typeof input === 'string' ? [input] : []
  const names = []
  for (const item of items) {
    if (typeof item !== 'string') continue
    let parts = item.split(/\s+and\s+|;/i)
    if (parts.length === 1 && item.includes(',')) parts = item.split(',')
    for (const part of parts) {
      const name = part.trim()
      if (name) names.push(name)
    }
  }
  return names
}

// Indonesian academic degree tokens that Scholar sometimes parses as a
// separate "author" (e.g. "S Kom" from "Hidayati, S.Kom."). These need a human
// decision, so scripts report them rather than deleting them.
const DEGREE_RE = /^(?:s\.?\s?kom|m\.?\s?kom|s\.?\s?t|m\.?\s?t|m\.?\s?cs|m\.?\s?ti|s\.?\s?si|m\.?\s?si|m\.?\s?m|ph\.?\s?d|dr|ir|prof)\.?$/i

export function looksLikeDegreeToken(name) {
  return DEGREE_RE.test(name.trim())
}

/** True when the two titles are the same after normalization. */
export function titlesMatch(a, b) {
  const na = normalizeTitle(a)
  return na.length > 0 && na === normalizeTitle(b)
}

const SEMINAR_RE = /\b(?:seminar|semin\.?|conference|conf\.?|proceeding|proceding|prosiding|symposium|snatif|senatik|sentia|workshop)\b/i
const GENERIC_VENUES = new Set(['international conference proceedings', 'conference proceedings', 'proceedings'])

/**
 * Returns human-readable reasons a publication's venue/type looks wrong
 * (empty array when nothing stands out). Used only for reporting.
 */
export function venueProblems({ venue, type }) {
  const problems = []
  const v = (venue ?? '').trim()
  if (/^https?:\/\//i.test(v)) problems.push('venue is a raw URL')
  if (GENERIC_VENUES.has(v.toLowerCase())) problems.push('venue is generic')
  if (type === 'journal' && SEMINAR_RE.test(v)) problems.push('type is "journal" but venue looks like a conference')
  return problems
}
