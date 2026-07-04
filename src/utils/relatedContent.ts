const STREAM_WEIGHT = 50
const CATEGORY_WEIGHT = 30
const SHARED_AUTHOR_WEIGHT = 25
const TITLE_KEYWORD_WEIGHT = 15
const PROXIMITY_WEIGHT = 10
const MIN_SCORE_THRESHOLD = 5

export interface CurrentItem {
  id: string
  title: string
  stream?: string
  category?: string
  authors?: string[]
  author?: string
  year?: number
  date?: Date
  type?: string
  excerpt?: string
}

export interface CandidateItem {
  id: string
  title: string
  stream?: string
  category?: string
  authors?: string[]
  author?: string
  year?: number
  date?: Date
  type?: string
  excerpt?: string
}

export interface ScoredItem extends CandidateItem {
  score: number
  matchReasons: string[]
}

function tokenize(text: string): Set<string> {
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'could', 'should', 'may', 'might', 'can', 'shall', 'you',
    'your', 'we', 'our', 'their', 'its', 'it', 'this', 'that', 'these',
    'those', 'about', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'between', 'under', 'again', 'further', 'then',
    'once', 'here', 'there', 'all', 'each', 'every', 'both', 'few',
    'more', 'most', 'other', 'some', 'such', 'no', 'not', 'only', 'same',
    'so', 'than', 'too', 'very', 'just', 'how', 'what', 'when', 'where',
    'why', 'which', 'who', 'whom', 'while', 'over', 'also', 'if', 'up',
    'out', 'down', 'off', 'de', 'la', 'el', 'en', 'un', 'una', 'los',
    'las', 'del', 'y', 'e', 'o', 'que', 'para', 'por', 'con', 'sin',
    'se', 'su', 'al', 'como', 'mas', 'pero', 'entre', 'hasta', 'desde',
    'part', 'series', 'mini', 'laravel', 'php', 'mereka', 'saya', 'kami',
    'dia', 'ada', 'ini', 'itu', 'di', 'ke', 'dari', 'yang', 'dan',
    'atau', 'pada', 'akan', 'dapat', 'bisa', 'telah', 'sudah', 'masih',
    'harus', 'perlu', 'belum', 'punya', 'agar', 'tetapi', 'maupun',
    'ialah', 'yaitu', 'adalah', 'bagi', 'guna', 'ialah', 'ialah',
  ])
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w))
  )
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0
  let intersection = 0
  const aArr = [...a]
  const bArr = [...b]
  for (const tokenA of aArr) {
    for (const tokenB of bArr) {
      if (tokenA === tokenB || tokenA.includes(tokenB) || tokenB.includes(tokenA)) {
        intersection++
        break
      }
    }
  }
  return intersection / Math.max(1, aArr.length + bArr.length - intersection)
}

export function scoreRelatedItem(
  current: CurrentItem,
  candidate: CandidateItem
): ScoredItem | null {
  if (current.id === candidate.id) return null

  let score = 0
  const reasons: string[] = []

  if (current.stream && candidate.stream && current.stream === candidate.stream) {
    score += STREAM_WEIGHT
    reasons.push('stream')
  }

  if (current.category && candidate.category && current.category === candidate.category) {
    score += CATEGORY_WEIGHT
    reasons.push('category')
  }

  if (current.type && candidate.type && current.type === candidate.type) {
    score += CATEGORY_WEIGHT
    reasons.push('type')
  }

  const currentAuthors = new Set([
    ...(current.authors ?? []),
    ...(current.author ? [current.author] : []),
  ])
  const candidateAuthors = new Set([
    ...(candidate.authors ?? []),
    ...(candidate.author ? [candidate.author] : []),
  ])

  for (const a of currentAuthors) {
    if (a !== 'SE Lab' && candidateAuthors.has(a)) {
      score += SHARED_AUTHOR_WEIGHT
      reasons.push('author')
      break
    }
  }

  const currentText = [current.title, current.excerpt ?? ''].join(' ')
  const candidateText = [candidate.title, candidate.excerpt ?? ''].join(' ')
  const titleSim = jaccardSimilarity(tokenize(current.title), tokenize(candidate.title))
  const textSim = jaccardSimilarity(tokenize(currentText), tokenize(candidateText))
  const keywordScore = Math.round((titleSim * 0.6 + textSim * 0.4) * TITLE_KEYWORD_WEIGHT)
  score += keywordScore
  if (keywordScore >= 5) reasons.push('keyword')

  if (current.year !== undefined && candidate.year !== undefined) {
    const yearDiff = Math.abs(current.year - candidate.year)
    const proximityScore = Math.max(0, PROXIMITY_WEIGHT - yearDiff * 2)
    score += proximityScore
    if (proximityScore >= 3) reasons.push('year')
  }

  if (current.date && candidate.date) {
    const dayDiff = Math.abs(current.date.getTime() - candidate.date.getTime()) / (1000 * 60 * 60 * 24)
    const proximityScore = Math.max(0, PROXIMITY_WEIGHT - dayDiff / 30)
    score += proximityScore
    if (proximityScore >= 3) reasons.push('date')
  }

  score = Math.round(score * 100) / 100

  if (score < MIN_SCORE_THRESHOLD) return null

  return { ...candidate, score, matchReasons: reasons }
}

export function getRelatedItems(
  current: CurrentItem,
  candidates: CandidateItem[],
  maxItems = 5
): ScoredItem[] {
  const scored = candidates
    .map((c) => scoreRelatedItem(current, c))
    .filter((item): item is ScoredItem => item !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxItems)

  return scored
}
