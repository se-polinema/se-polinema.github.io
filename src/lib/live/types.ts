// Shared types for the live-voting presentation engine (src/decks/*, src/components/live/*).

export type QuestionKind = 'single' | 'multi' | 'text'

export interface Option {
  key: string
  label: string
  note?: string
}

/** A poll declared by a deck. `key` is local to the deck; the DB id is `${deck}.${key}` (see qid). */
export interface Question {
  key: string
  kind: QuestionKind
  max: number
  area: string
  prompt: string
  options: Option[]
  /** Show an optional free-text "Lainnya" field next to the options. */
  other?: boolean
}

/** What the voter page reads back from monev.questions (flat DB shape). */
export interface QuestionRow {
  key: string
  kind: QuestionKind
  max_choices: number
  area: string | null
  prompt: string
  options: Option[]
  allow_other: boolean
}

export interface Results {
  n: number
  counts: Record<string, number>
  /** Voters who wrote a "Lainnya" answer. */
  n_other?: number
  /** The "Lainnya" texts. Only returned to admins. */
  others?: string[]
}

export interface Session {
  id: string
  code: string
  title: string
  deck: string | null
  is_open: boolean
  current_slide: number
  active_question: string | null
  voting_open: boolean
  reveal: boolean
  created_at?: string
}

export interface SlideCtx {
  qr: string
  joinUrl: string
  code: string
}

export interface Slide {
  id: string
  title: string
  /** Full-bleed slide (cover): no header, no source footer. */
  bare?: boolean
  appendix?: boolean
  /** Local question key. Entering this slide opens voting on it. */
  question?: string
  /** Ask the deck to fill the slide from every question's results (see Deck.paintRecap). */
  recap?: boolean
  /** Footer source line (plain text or simple HTML). */
  src?: string
  render: (ctx: SlideCtx) => string
}

export interface Deck {
  slug: string
  title: string
  description: string
  questions: Question[]
  slides: Slide[]
  /** Fill a recap slide's `[data-recap]` element. Keys are local question keys. */
  paintRecap?: (el: HTMLElement, results: Record<string, Results>) => void
}

export type LiveErrorCode =
  | 'voting_closed'
  | 'session_closed'
  | 'invalid_choices'
  | 'invalid_body'
  | 'too_many'
  | 'unknown'
