// All Supabase access for live voting lives here (schema `monev`). Components never call .schema('monev') directly.
import { supabase } from '../supabase'
import type { Deck, LiveErrorCode, QuestionRow, Results, Session } from './types'

const db = () => supabase.schema('monev')

// ---- ids -------------------------------------------------------------------
/** DB question id for a deck-local key. Deck slugs must not contain '.'. */
export const qid = (deck: string, key: string) => `${deck}.${key}`
export const localKey = (id: string) => (id.includes('.') ? id.slice(id.indexOf('.') + 1) : id)

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
export const newCode = () =>
  Array.from({ length: 5 }, () => CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]).join('')

/** Random per-device token; the only identity a participant has. */
export function voterId(): string {
  try {
    let v = localStorage.getItem('se-live-voter')
    if (!v) {
      v = crypto.randomUUID()
      localStorage.setItem('se-live-voter', v)
    }
    return v
  } catch {
    return ((window as any).__seLiveVoter ??= crypto.randomUUID())
  }
}

export function errCode(e: unknown): LiveErrorCode {
  const m = String((e as any)?.message ?? e)
  for (const c of ['voting_closed', 'session_closed', 'invalid_choices', 'invalid_body', 'too_many'] as const) {
    if (m.includes(c)) return c
  }
  return 'unknown'
}

// ---- sessions --------------------------------------------------------------
export async function findSession(code: string): Promise<Session | null> {
  const { data } = await db().from('sessions').select('*').eq('code', code.trim().toUpperCase()).maybeSingle()
  return (data as Session) ?? null
}

/** Returns null when the row does not exist (or is no longer visible); throws on a request error. */
export async function getSession(id: string): Promise<Session | null> {
  const { data, error } = await db().from('sessions').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return (data as Session) ?? null
}

/** Admin picker list: this deck's sessions plus legacy ones with no deck (made before decks existed). */
export async function listSessions(deck: string): Promise<Session[]> {
  const { data } = await db()
    .from('sessions')
    .select('*')
    .or(`deck.eq.${deck},deck.is.null`)
    .order('created_at', { ascending: false })
    .limit(30)
  return (data as Session[]) ?? []
}

/** Admin only (RLS). Votes and suggestions go with the session (ON DELETE CASCADE). */
export async function deleteSessions(ids: string[]): Promise<number> {
  if (!ids.length) return 0
  const { data, error } = await db().from('sessions').delete().in('id', ids).select('id')
  if (error) throw error
  // RLS hides rows from non-admins instead of failing, so an empty result means nothing was deleted.
  if (!data?.length) throw new Error('nothing deleted')
  return data.length
}

/**
 * Admin only (RLS). Saves the deck's questions to the database. The voter page reads questions from
 * there, so this runs whenever a session starts or resumes: otherwise a session made by an older build
 * keeps old prompts and no "Lainnya" field. Questions no longer in the deck are left alone because
 * deleting them would cascade-delete their votes.
 */
export async function syncQuestions(deck: Deck): Promise<void> {
  const rows = deck.questions.map((q, i) => ({
    key: qid(deck.slug, q.key),
    deck: deck.slug,
    kind: q.kind,
    prompt: q.prompt,
    area: q.area,
    max_choices: q.max,
    options: q.options,
    allow_other: Boolean(q.other),
    ord: i,
  }))
  const up = await db().from('questions').upsert(rows, { onConflict: 'key' })
  if (up.error) throw up.error
}

/** Admin only (RLS). Syncs the deck's questions, then creates a session with a fresh join code. */
export async function createSession(deck: Deck): Promise<Session> {
  await syncQuestions(deck)
  const { data, error } = await db()
    .from('sessions')
    .insert({ code: newCode(), title: deck.title, deck: deck.slug })
    .select()
    .single()
  if (error) throw error
  return data as Session
}

export async function patchSession(id: string, patch: Partial<Session>) {
  const { error } = await db().from('sessions').update(patch).eq('id', id)
  if (error) throw error
}

/** Calls `cb` on every change of the session row. Returns an unsubscribe function. */
export function watchSession(id: string, cb: (s: Session) => void): () => void {
  const ch = supabase
    .channel(`live-session-${id}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'monev', table: 'sessions', filter: `id=eq.${id}` }, (p) =>
      cb(p.new as Session),
    )
    .subscribe()
  return () => {
    supabase.removeChannel(ch)
  }
}

// ---- questions, votes ------------------------------------------------------
const questionCache = new Map<string, QuestionRow>()
export async function getQuestion(id: string): Promise<QuestionRow | null> {
  const hit = questionCache.get(id)
  if (hit) return hit
  const { data } = await db().from('questions').select('key,kind,max_choices,area,prompt,options,allow_other').eq('key', id).maybeSingle()
  if (data) questionCache.set(id, data as QuestionRow)
  return (data as QuestionRow) ?? null
}

export async function getResults(session: string, question: string): Promise<Results> {
  const { data, error } = await db().rpc('get_results', { p_session: session, p_question: question })
  if (error) throw error
  return data as Results
}

export async function castVote(session: string, question: string, choices: string[], other?: string) {
  const { error } = await db().rpc('cast_vote', {
    p_session: session,
    p_voter: voterId(),
    p_question: question,
    p_choices: choices,
    p_other: other?.trim() || null,
  })
  if (error) throw error
}

export async function myVote(session: string, question: string): Promise<string[] | null> {
  const { data } = await db().rpc('my_vote', { p_session: session, p_voter: voterId(), p_question: question })
  return (data as string[] | null) ?? null
}

export async function myOther(session: string, question: string): Promise<string> {
  const { data } = await db().rpc('my_other', { p_session: session, p_voter: voterId(), p_question: question })
  return (data as string | null) ?? ''
}

export async function submitSuggestion(session: string, body: string): Promise<number> {
  const { data, error } = await db().rpc('submit_suggestion', { p_session: session, p_voter: voterId(), p_body: body })
  if (error) throw error
  return data as number
}

export async function mySuggestionCount(session: string): Promise<number> {
  const { data } = await db().rpc('my_suggestion_count', { p_session: session, p_voter: voterId() })
  return (data as number) ?? 0
}

// ---- admin reads -----------------------------------------------------------
export async function listSuggestions(session: string, question?: string): Promise<{ body: string }[]> {
  let q = db().from('suggestions').select('body,question_key,created_at').eq('session_id', session).order('created_at')
  if (question) q = q.eq('question_key', question)
  const { data } = await q
  return (data as { body: string }[]) ?? []
}

/** CSV with no device identifiers. */
export async function exportCsv(session: string): Promise<string> {
  const [v, s] = await Promise.all([
    db().from('votes').select('question_key,choices,other_text,created_at').eq('session_id', session),
    db().from('suggestions').select('question_key,body,created_at').eq('session_id', session),
  ])
  const cell = (x: string) => `"${String(x).replace(/"/g, '""')}"`
  const lines = ['jenis,pertanyaan,isi,waktu']
  for (const r of (v.data ?? []) as any[]) {
    lines.push(['suara', r.question_key, r.choices.join('|'), r.created_at].map(cell).join(','))
    if (r.other_text) lines.push(['lainnya', r.question_key, r.other_text, r.created_at].map(cell).join(','))
  }
  for (const r of (s.data ?? []) as any[]) lines.push(['saran', r.question_key ?? '', r.body, r.created_at].map(cell).join(','))
  return lines.join('\n')
}
