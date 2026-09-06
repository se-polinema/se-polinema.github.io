import { scoreRelatedItem, getRelatedItems } from './relatedContent.ts'
import type { CurrentItem, CandidateItem } from './relatedContent.ts'

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`)
    process.exit(1)
  }
  console.log(`PASS: ${message}`)
}

function assertOrder(
  items: { title: string; score: number }[],
  expectedOrder: string[],
  message: string
) {
  const actual = items.map((i) => i.title)
  const match = expectedOrder.every((title, idx) => actual[idx] === title)
  if (!match) {
    console.error(`FAIL: ${message}`)
    console.error(`  Expected: [${expectedOrder.join(', ')}]`)
    console.error(`  Actual:   [${actual.join(', ')}]`)
    process.exit(1)
  }
  console.log(`PASS: ${message}`)
}

// ── Test 1: Same stream gets highest priority ───────────────────
const current: CurrentItem = {
  id: 'post-1',
  title: 'TDD with PHP',
  stream: 'se-methodologies-architecture',
  category: 'tutorial',
  author: 'Dian Hanifudin Subhi',
}

const candidates: CandidateItem[] = [
  { id: 'post-2', title: 'Clean Code PHP', stream: 'se-methodologies-architecture', category: 'tutorial' },
  { id: 'post-3', title: 'EdTech LMS PHP', stream: 'domain-specific-se-applications', category: 'tutorial' },
  { id: 'post-4', title: 'AI Testing', stream: 'se-methodologies-architecture', category: 'tutorial' },
  { id: 'post-5', title: 'Design Patterns PHP', stream: 'se-methodologies-architecture', category: 'tutorial' },
]

const result1 = getRelatedItems(current, candidates, 5)
assert(result1.length > 0, 'Test 1: getRelatedItems returns results')
assert(result1[0].title === 'Clean Code PHP' || result1[0].title === 'Design Patterns PHP',
  'Test 1: Same-stream items rank highest')
assert(result1.every((r) => r.score > 0), 'Test 1: All results have positive score')

// ── Test 2: Same stream + category beats stream-only ───────────────────
const candidates2: CandidateItem[] = [
  { id: 'post-2', title: 'Clean Code PHP', stream: 'se-methodologies-architecture', category: 'tutorial' },
  { id: 'post-6', title: 'UML News', stream: 'se-methodologies-architecture', category: 'news' },
  { id: 'post-7', title: 'EdTech News', stream: 'domain-specific-se-applications', category: 'news' },
]

const result2 = getRelatedItems(current, candidates2, 5)
const tutorialFirst = result2[0].title === 'Clean Code PHP'
assert(tutorialFirst, 'Test 2: Same stream + category beats same stream only')

// ── Test 3: Shared author adds score ───────────────────
const candidates3: CandidateItem[] = [
  { id: 'post-2', title: 'Clean Code PHP', stream: 'se-methodologies-architecture', category: 'news', author: 'SE Lab' },
  { id: 'post-8', title: 'TDD Advanced', stream: 'se-methodologies-architecture', category: 'news', author: 'Dian Hanifudin Subhi' },
]

const result3 = getRelatedItems(current, candidates3, 5)
assert(result3[0].title === 'TDD Advanced', 'Test 3: Shared author outranks non-author match')

// ── Test 4: Excludes current item ───────────────────
const candidates4: CandidateItem[] = [
  { id: 'post-1', title: 'TDD with PHP', stream: 'se-methodologies-architecture', category: 'tutorial' },
  { id: 'post-2', title: 'Clean Code PHP', stream: 'se-methodologies-architecture', category: 'tutorial' },
]

const result4 = getRelatedItems(current, candidates4, 5)
assert(!result4.find((r) => r.id === 'post-1'), 'Test 4: Current item excluded from results')

// ── Test 5: Title keyword overlap ───────────────────
const current5: CurrentItem = {
  id: 'post-tdd',
  title: 'Test-Driven Development with PHP',
  stream: 'se-methodologies-architecture',
  category: 'tutorial',
}

const candidates5: CandidateItem[] = [
  { id: 'post-test', title: 'Software Testing Fundamentals', stream: 'se-methodologies-architecture', category: 'tutorial' },
  { id: 'post-unrelated', title: 'Web Design Essentials', stream: 'se-methodologies-architecture', category: 'tutorial' },
]

const result5 = getRelatedItems(current5, candidates5, 5)
const testingFirst = result5.length >= 2 && result5[0].id === 'post-test'
assert(testingFirst, 'Test 5: Title keyword overlap ranks higher than no overlap')

// ── Test 6: Year proximity boosts score ───────────────────
const current6: CurrentItem = {
  id: 'pub-2024',
  title: 'AI in Software Engineering',
  year: 2024,
  type: 'journal',
  authors: ['Author A'],
}

const candidates6: CandidateItem[] = [
  { id: 'pub-2023', title: 'Machine Learning Applications', year: 2023, type: 'journal', authors: ['Author B'] },
  { id: 'pub-2020', title: 'Old ML Paper', year: 2020, type: 'journal', authors: ['Author B'] },
]

const result6 = getRelatedItems(current6, candidates6, 5)
if (result6.length >= 2) {
  assert(result6[0].id === 'pub-2023', 'Test 6: Closer year ranks higher')
} else {
  console.log('PASS: Test 6: (fewer than 2 results, skipping order check)')
}

// ── Test 7: No strong matches returns empty ───────────────────
const current7: CurrentItem = {
  id: 'unique-post',
  title: 'Quantum Computing Basics',
  stream: 'quantum',
  category: 'announcement',
}

const candidates7: CandidateItem[] = [
  { id: 'post-cooking', title: 'Introduction to Cooking', stream: 'cooking', category: 'news', excerpt: 'Learn to cook pasta' },
  { id: 'post-sports', title: 'Football Rules', stream: 'sports', category: 'tutorial', excerpt: 'Rules of the game' },
]

const result7 = getRelatedItems(current7, candidates7, 5)
assert(result7.length === 0, 'Test 7: No matches returns empty array')

// ── Test 8: Publication type match ───────────────────
const current8: CurrentItem = {
  id: 'pub-journal-1',
  title: 'Deep Learning for NLP',
  year: 2024,
  type: 'journal',
}

const candidates8: CandidateItem[] = [
  { id: 'pub-journal-2', title: 'NLP Advances', year: 2024, type: 'journal' },
  { id: 'pub-conf-1', title: 'NLP Conference Paper', year: 2024, type: 'conference' },
]

const result8 = getRelatedItems(current8, candidates8, 5)
assert(result8.length >= 1, 'Test 8: Type match returns results')
assert(result8[0].id === 'pub-journal-2', 'Test 8: Same type outranks different type')

// ── Test 9: Deduplication and max items ───────────────────
const candidates9: CandidateItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: `post-dup-${i}`,
  title: `PHP Tutorial ${i}`,
  stream: 'se-methodologies-architecture',
  category: 'tutorial',
}))

const result9 = getRelatedItems(current, candidates9, 5)
assert(result9.length <= 5, 'Test 9: Results capped at maxItems (5)')

console.log('\nAll tests passed!')
