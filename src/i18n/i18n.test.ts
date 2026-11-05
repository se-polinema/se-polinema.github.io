import { describe, expect, it } from 'vitest'
import en from './en.json'
import id from './id.json'

function flatten(obj: unknown, prefix = ''): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      Object.assign(out, flatten(v, prefix ? `${prefix}.${k}` : k))
    }
  } else {
    out[prefix] = obj
  }
  return out
}

describe('i18n dictionaries', () => {
  const enKeys = flatten(en)
  const idKeys = flatten(id)

  it('have the same keys in English and Indonesian', () => {
    const missingInId = Object.keys(enKeys).filter((k) => !(k in idKeys))
    const missingInEn = Object.keys(idKeys).filter((k) => !(k in enKeys))
    expect({ missingInId, missingInEn }).toEqual({ missingInId: [], missingInEn: [] })
  })

  it('have no empty string values', () => {
    const empty = [...Object.entries(enKeys), ...Object.entries(idKeys)]
      .filter(([, v]) => typeof v === 'string' && v.trim() === '')
      .map(([k]) => k)
    expect(empty).toEqual([])
  })

  it('contain no em-dashes in prose (see AGENTS.md writing style)', () => {
    const offenders = [...Object.entries(enKeys), ...Object.entries(idKeys)]
      .filter(([, v]) => typeof v === 'string' && v.includes('—'))
      .map(([k]) => k)
    expect(offenders).toEqual([])
  })
})
