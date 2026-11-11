// Registry of live-voting decks. Add a deck by creating src/decks/<slug>/index.ts that exports `deck`
// and listing it here; src/pages/live/[slug].astro builds one presenter page per entry.
import type { Deck } from '../lib/live/types'
import { deck as monevPbl } from './monev-pbl'

export const decks: Deck[] = [monevPbl]
export const getDeck = (slug: string) => decks.find((d) => d.slug === slug)
