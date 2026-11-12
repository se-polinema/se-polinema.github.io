// Stand-in for src/lib/live/session.ts in the phone check: scripted states built from the real deck questions.
import { decks } from '../../src/decks'
import type { QuestionRow, Results, Session } from '../../src/lib/live/types'

export const caseName = new URLSearchParams(location.search).get('case') ?? 'code'
const deck = decks[0]
const row = (key: string): QuestionRow => {
  const q = deck.questions.find((x) => x.key === key)!
  return { key: q.key, kind: q.kind, max_choices: q.max, area: q.area, prompt: q.prompt, options: q.options, allow_other: Boolean(q.other) }
}
const base: Session = {
  id: 's1', code: 'ABCDEF', title: deck.title, deck: deck.slug, is_open: true, current_slide: 0,
  active_question: 'fasilitas', voting_open: true, reveal: false,
}
type Case = { session: Session | null; q?: string; mine?: string[] | null; other?: string; results?: Results }
const results: Results = { n: 18, counts: { sop: 11, ujibersama: 8, serverjurusan: 6, kredit: 4, patungan: 3, gratis: 2 }, n_other: 2 }
const cases: Record<string, Case> = {
  code: { session: null },
  notfound: { session: null },
  loading: { session: base },
  waiting: { session: { ...base, active_question: null } },
  ended: { session: { ...base, is_open: false } },
  choice: { session: base, q: 'fasilitas' },
  selected: { session: base, q: 'fasilitas', mine: ['sop', 'kredit'] },
  other: { session: base, q: 'fasilitas', mine: ['sop'], other: 'Server dari kampus, dipakai bergantian antar kelas selama pengujian' },
  single: { session: { ...base, active_question: 'prioritas' }, q: 'prioritas' },
  closed: { session: { ...base, voting_open: false }, q: 'fasilitas', mine: ['sop'] },
  reveal: { session: { ...base, reveal: true, voting_open: false }, q: 'fasilitas', mine: ['sop'], results },
  text: { session: { ...base, active_question: 'saran' }, q: 'saran' },
}
const c = cases[caseName] ?? cases.choice

export const errCode = () => 'unknown' as const
export const findSession = async () => (caseName === 'notfound' ? null : c.session)
export const getSession = async () => c.session
export const getQuestion = async () => (c.q ? row(c.q) : null)
export const getResults = async () => c.results ?? results
export const myVote = async () => c.mine ?? null
export const myOther = async () => c.other ?? ''
export const mySuggestionCount = async () => 1
export const castVote = async () => {}
export const submitSuggestion = async () => 2
export const watchSession = () => () => {}
