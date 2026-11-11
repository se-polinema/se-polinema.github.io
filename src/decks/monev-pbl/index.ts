import type { Deck } from '../../lib/live/types'
import { validateAnalysis } from './analysis'
import { validatePic } from './pic'
import { questions } from './questions'
import { paintRecap, slides } from './slides'

// Slug is the DB prefix of every question id (`monev-pbl-2026.beban`), so it must not contain '.'.
export const deck: Deck = {
  slug: 'monev-pbl-2026',
  title: 'Hasil Survei Monev PBL',
  description: 'Hasil survei Monev PBL TI dan SIB, Semester Ganjil 2026/2027: masalah dan pemilihan solusi secara langsung.',
  questions,
  slides,
  paintRecap,
  validate: () => [...validatePic(), ...validateAnalysis()],
}
