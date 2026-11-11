// Number and text helpers for deck slides (Indonesian decimal comma).

export const fmt = (x: number | null | undefined, d = 1): string =>
  x == null || Number.isNaN(x) ? '–' : x.toFixed(d).replace('.', ',')

export const pc = (x: number | null | undefined, d = 0): string => fmt(x, d) + '%'

export const sgn = (x: number | null | undefined): string =>
  x == null ? '–' : (x > 0.004 ? '+' : '') + fmt(x, 2)

export const pick = (items: any[], label: string): any =>
  items.find((i) => i.label === label) ?? { label, count: 0, pct: 0 }

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
export const esc = (s: unknown): string => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]!)
