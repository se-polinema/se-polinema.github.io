// Dosen rujukan (PIC) tiap kelas: the lecturer of the core course of the program and semester.
// Source: "Sosialisasi PBL TI dan SIB" (pembagian mata kuliah Utama/Inti dan Pendukung per semester),
// plus the PBL coordinator's decision of one PIC course per semester where the file lists several
// core courses. If the department decides differently for a semester, change only this file.
import agregat from '../../data/monev-pbl/agregat.json'

export type PicRow = { prodi: 'TI' | 'SIB'; sem: 3 | 5; course: string }

export const picRows: PicRow[] = [
  { prodi: 'TI', sem: 3, course: 'Manajemen Proyek' },
  { prodi: 'TI', sem: 5, course: 'Pembelajaran Mesin' },
  { prodi: 'SIB', sem: 3, course: 'Pemrograman Web' },
  { prodi: 'SIB', sem: 5, course: 'Pemrograman Web Lanjut' },
]

type SurveyCourse = { prodi: string; sem: number; course: string }
const surveyCourses = (): SurveyCourse[] => (agregat as any).all.mhs.courses

/** Other integrated courses of the same program and semester, with the names the survey used. */
export const supporting = (r: PicRow): string[] =>
  surveyCourses()
    .filter((c) => c.prodi === r.prodi && c.sem === r.sem && c.course !== r.course)
    .map((c) => c.course)

/** Every PIC course must exist in the survey data for its program and semester, so names cannot drift. */
export function validatePic(): string[] {
  const problems: string[] = []
  for (const r of picRows) {
    const found = surveyCourses().some((c) => c.prodi === r.prodi && c.sem === r.sem && c.course === r.course)
    if (!found) problems.push(`PIC course "${r.course}" not found in survey data for ${r.prodi} Semester ${r.sem}`)
  }
  return problems
}
