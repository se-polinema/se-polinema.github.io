// Numbers from the problem analysis (src/data/monev-pbl/analisis.json: aggregates only, program and semester level,
// with intervals). Slides and poll notes quote these helpers so the deck cannot drift from the analysis.
import analisisJson from '../../data/monev-pbl/analisis.json'
import { fmt, pc } from '../../lib/live/format'

export const AN: any = analisisJson

/** `[a; b]` interval text. */
export const ci = (c: number[] | null | undefined, d = 1): string => (c ? `[${fmt(c[0], d)}; ${fmt(c[1], d)}]` : '')
/** Signed number with the sign always shown: +0,07, -0,45. */
export const sg = (x: number | null | undefined, d = 2): string => (x == null ? '–' : (x > 0 ? '+' : '') + fmt(x, d))
/** Percentage of a `prop` object, e.g. `{pct: 40.7, ci: [33.7, 48]}`. */
export const pp = (x: any, d = 0): string => pc(x.pct, d)
export const ppCi = (x: any): string => `${pc(x.pct, 1)} ${ci(x.ci)}`
/** True when a bootstrap interval excludes zero (the difference is established). */
export const sure = (c: number[] | null | undefined): boolean => Boolean(c && (c[0] > 0 || c[1] < 0))

/** Priority rows (satisfaction and wish to continue) by problem key. */
export const PRI = (k: string, out: 'puas' | 'lanjut' = 'puas') => AN.umum.prioritas[out].baris.find((r: any) => r.masalah === k)
export const bySem = (list: any[], sem: string) => list.find((g: any) => g.kelompok === sem)
export const coef = (model: any, nama: string) => model.koef.find((c: any) => c.nama === nama)
export const target = (label: string) => AN.ukuran_keberhasilan.find((u: any) => u.ukuran.startsWith(label))

/** Public site: the analysis must stay at program and semester level. */
export function validateAnalysis(): string[] {
  const out: string[] = []
  const raw = JSON.stringify(analisisJson)
  const leak = raw.match(/\b(TI|SIB)-\d[A-Z]\b/g)
  if (leak) out.push(`analisis.json names classes: ${[...new Set(leak)].slice(0, 3).join(', ')}`)
  for (const k of ['umum', 'p1_respons', 'p2_beban', 'p3_jadwal', 'p4_selaras', 'p5_koordinasi', 'p6_penilaian', 'p7_fasilitas_bimbingan', 'ukuran_keberhasilan']) {
    if (!(k in (analisisJson as any))) out.push(`analisis.json is missing ${k}`)
  }
  return out
}
