// Monev PBL slides. Every number comes from src/data/monev-pbl/*.json (sanitized aggregates of the survey report and
// of the problem analysis), so the deck cannot drift from the analysis. Each problem slide is followed by a poll slide
// where lecturers pick a solution or write their own under "Lainnya". Two discussion slides collect the open items.
// Public site: program and semester level only, no class or course results.
import agregat from '../../data/monev-pbl/agregat.json'
import temaJson from '../../data/monev-pbl/tema.json'
import temaDosenJson from '../../data/monev-pbl/tema_dosen.json'
import { esc, fmt, pc, pick, sgn } from '../../lib/live/format'
import { withBase } from '../../lib/paths'
import type { Results, Slide, SlideCtx } from '../../lib/live/types'
import { AN, PRI, bySem, ci, coef, pp, sg, sure, target } from './analysis'
import { picRows, supporting } from './pic'
import { questions } from './questions'

const D: any = agregat
const tema: any = temaJson
const temaDosen: any = temaDosenJson
const A = D.all
const m = A.mhs
const l = A.dosen
const mo = m.monitored
const th = (k: string) => tema.themes.find((t: any) => t.key === k)
const cepat = m.consult_resp.items.find((i: any) => i.label === 'Kurang dari 1 hari').pct
const imp = (lab: string) => pick(m.improve, lab)
const Q = (k: string) => questions.find((q) => q.key === k)!
const bar = (lab: string) => pick(l.barriers, lab).count

// analysis shortcuts
const p1 = AN.p1_respons
const p2 = AN.p2_beban
const p3 = AN.p3_jadwal
const p4 = AN.p4_selaras
const p5 = AN.p5_koordinasi
const p6 = AN.p6_penilaian
const p7 = AN.p7_fasilitas_bimbingan
const pctSem = (g: any) => `${pc(g.pct, 1)} ${ci(g.ci)}`

// ------------------------------------------------------------------ building blocks
type Tone = 'good' | 'bad'
type Stat = { num: string; label: string; tone: Tone }
const stat = (s: Stat) => `<div class="lv-stat is-${s.tone}"><div class="lv-num">${s.num}</div><div class="lv-lab">${s.label}</div></div>`
const li = (xs: string[]) => `<ul>${xs.map((x) => `<li>${x}</li>`).join('')}</ul>`
const bb = (good: string[], bad: string[]) => `
  <div class="lv-bb">
    <div class="lv-panel is-good"><h3>Yang sudah berjalan</h3>${li(good)}</div>
    <div class="lv-panel is-bad"><h3>Yang bermasalah</h3>${li(bad)}</div>
  </div>`
const closing = (t: string) => `<p class="lv-closing">${t}</p>`
const table = (head: string[], rows: string[][]) =>
  `<table class="lv-tbl"><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`

function bars(
  items: [string, number, ('good' | 'bad' | 'mute')?][],
  o: { max?: number; unit?: '%' | 'n' | '2'; lw?: number; size?: number } = {},
) {
  const max = o.max ?? 100
  const unit = o.unit ?? '%'
  return `<div class="lv-hbars" style="--lw:${o.lw ?? 520}px;--fs:${o.size ?? 30}px">${items
    .map(([lab, v, tone]) => {
      const val = unit === '%' ? pc(v) : unit === 'n' ? String(Math.round(v)) : fmt(v, 2)
      return `<div class="lv-hb"><span class="lv-hl">${esc(lab)}</span><span class="lv-hbar"><i class="is-${tone ?? 'good'}" style="width:${Math.max(0.5, (v / max) * 100)}%"></i><b>${val}</b></span></div>`
    })
    .join('')}</div>`
}

function problem(o: { id: string; title: string; stats: Stat[]; good: string[]; bad: string[]; closing: string; src: string; extra?: string }): Slide {
  return {
    id: o.id,
    title: o.title,
    src: o.src,
    render: () => `${o.extra ?? ''}<div class="lv-stats">${o.stats.map(stat).join('')}</div>${bb(o.good, o.bad)}${closing(o.closing)}`,
  }
}

function joinPanel(c: SlideCtx, hint: string, big = false) {
  return `<aside class="lv-join ${big ? 'is-big' : ''}">
    <img src="${c.qr}" alt="QR" />
    <div class="lv-code">${esc(c.code)}</div>
    <div class="lv-hint">${esc(hint)}</div>
    <div class="lv-live" data-live></div>
  </aside>`
}

/** Poll slide: one sentence that ties it to the problem, the solutions, and a pointer to "Lainnya". */
function vote(qkey: string, id: string, lead: string): Slide {
  const q = Q(qkey)
  return {
    id,
    title: q.prompt,
    question: qkey,
    render: (c) => `
      <div class="lv-votegrid">
        <div>
          <p class="lv-recapline">${lead}</p>
          <div class="lv-opts" data-q="${qkey}"></div>
          ${q.other ? '<p class="lv-note lv-other-hint">Tidak ada yang cocok? Tulis usulan Bapak/Ibu di kolom Lainnya pada ponsel.</p>' : ''}
        </div>
        ${joinPanel(c, `${q.kind === 'multi' && q.max > 1 ? `Pilih maksimal ${q.max}` : 'Pilih satu'} di ponsel Anda`)}
      </div>`,
  }
}

/** Open-discussion card: the question to the room, what is known, what is not. */
const disc = (qs: { q: string; known: string; unknown: string }[]) =>
  `<div class="lv-disc">${qs
    .map((x) => `<div class="lv-disc-card"><h3>${x.q}</h3><p><b>Yang sudah diketahui.</b> ${x.known}</p><p class="lv-unknown"><b>Yang belum diketahui.</b> ${x.unknown}</p></div>`)
    .join('')}</div>`

const effCell = (b: number, c: number[]) => (sure(c) ? `<b>${sg(b)}</b>` : sg(b)) + ` <small>${ci(c, 2)}</small>`

// ------------------------------------------------------------------ main slides
const komposisi: any[] = p1.komposisi
const sib5 = komposisi.find((k) => k.sel === 'SIB Sem 5')
const geserMax = Math.max(...p1.pasca_stratifikasi.map((x: any) => Math.abs(x.bergeser)))
const beratTenggat = p2.berat_vs_tenggat
const tenggatModel = coef(p2.model_beban_berat, 'Tenggat sering bertabrakan')
const rapatSelalu = p5.dosen.kehadiran_rapat.find((i: any) => i.label === 'Selalu hadir').count
const pmpl = p7.fasilitas_semester_pmpl_vs_tanpa
const prodiFas = (k: string) => p7.per_prodi_fasilitas.find((g: any) => g.kelompok === k).mean
const rubrikBeta = coef(p6.model_penilaian_adil, 'Rubrik jelas').beta
const timpangBeta = coef(p6.model_penilaian_adil, 'Kontribusi tim tidak seimbang').beta

const main: Slide[] = [
  {
    id: 'judul',
    title: 'Hasil Survei Monev PBL',
    bare: true,
    render: (c) => `
      <div class="lv-cover">
        <div>
          <img class="lv-logo" src="${withBase('/images/logo-polinema.png')}" alt="Politeknik Negeri Malang" />
          <p class="lv-kicker">Monitoring dan Evaluasi PBL · Semester Ganjil 2026/2027</p>
          <h1>Hasil Survei Monev PBL</h1>
          <p class="lv-sub">Program Studi Sarjana Terapan Teknik Informatika dan Sistem Informasi Bisnis</p>
          <p class="lv-how">Ada tujuh masalah. Untuk tiap masalah, Bapak/Ibu memilih solusi lewat ponsel, atau menulis usulan sendiri di kolom Lainnya. Dua slide menjelang akhir dibuka untuk diskusi.</p>
        </div>
        ${joinPanel(c, `Pindai untuk ikut memilih · ${c.joinUrl}`, true)}
      </div>`,
  },
  {
    id: 'ringkasan',
    title: 'Mahasiswa menilai PBL bermanfaat, tetapi belum puas dengan pelaksanaannya',
    src: `survei mahasiswa (n = ${m.n}), persentase setuju atau sangat setuju`,
    render: () => `
      ${bars(
        [
          ['PBL meningkatkan keterampilan teknis', m.ben[0].pct_agree],
          ['PBL melatih kerja sama', m.ben[1].pct_agree],
          ['PBL meningkatkan kesiapan kerja', m.ben[2].pct_agree],
          ['Puas dengan pelaksanaan PBL', m.ben[3].pct_agree, 'bad'],
          ['Setuju PBL dilanjutkan', m.ben[4].pct_agree, 'bad'],
        ],
        { lw: 620, size: 34 },
      )}
      <p class="lv-note">Biru: manfaat. Oranye: kepuasan dan keinginan melanjutkan.</p>
      ${closing(`Keluhan mahasiswa tertuju pada cara PBL dijalankan, bukan pada konsepnya. Mahasiswa yang pernah ikut PBL sama puasnya dengan yang belum (${pc(m.by_experience[1].sat_agree)} dan ${pc(m.by_experience[0].sat_agree)}).`)}`,
  },
  {
    id: 'prioritas-data',
    title: 'Dua masalah paling memengaruhi kepuasan: fasilitas dan beban',
    src: `analisis survei mahasiswa (n = ${m.n}); efek dihitung dengan semua faktor dikontrol bersamaan, selang kepercayaan 95%`,
    render: () => {
      const rows: [string, string][] = [
        ['fasilitas', 'Fasilitas tidak memadai (server deployment)'],
        ['beban', 'Beban berat'],
        ['jadwal_realistis', 'Jadwal milestone tidak realistis'],
        ['koordinasi', 'Arahan dosen tidak konsisten'],
        ['penilaian', 'Penilaian tidak adil'],
        ['selaras', 'Tugas dan penilaian tidak selaras'],
      ]
      return `${table(
        ['Masalah', 'Mahasiswa terdampak', 'Efek pada kepuasan (poin)', 'Efek pada keinginan melanjutkan (poin)'],
        rows.map(([k, lab]) => {
          const a = PRI(k, 'puas')
          const b = PRI(k, 'lanjut')
          return [lab, pc(a.prevalensi.pct), effCell(a.koef_terkontrol.b, a.koef_terkontrol.ci), effCell(b.koef_terkontrol.b, b.koef_terkontrol.ci)]
        }),
      )}
      <p class="lv-note">Tebal: efek pasti, selangnya tidak mencakup nol. Yang lain nyata jika dilihat sendiri-sendiri, tetapi berbagi pengaruh sehingga belum bisa dipisahkan dengan ${m.n} responden.</p>
      ${closing('Hanya fasilitas dan beban yang efeknya pasti pada kepuasan maupun keinginan melanjutkan. Jadwal milestone yang realistis berkaitan kuat dengan keinginan melanjutkan.')}`
    },
  },
  {
    id: 'peta',
    title: 'Tujuh masalah yang dibahas hari ini',
    src: `survei mahasiswa (n = ${m.n}) dan dosen (n = ${l.n}); wawancara mahasiswa (sampel acak) untuk masalah jadwal`,
    render: () => `
      <div class="lv-stats">
        ${stat({ num: pc(m.response.rate), label: '1. Respons: mahasiswa yang mengisi survei (target 70%)', tone: 'bad' })}
        ${stat({ num: pp(p2.prevalensi), label: '2. Beban: mahasiswa yang menilai PBL berat', tone: 'bad' })}
        ${stat({ num: pp(p3.prevalensi), label: '3. Jadwal: sering atau selalu mengalami tenggat bertabrakan', tone: 'bad' })}
        ${stat({ num: pc(m.pooled.bc[3].ya), label: '4. Keselarasan: menjawab tugas mata kuliah bagian dari proyek', tone: 'bad' })}
      </div>
      <div class="lv-stats">
        ${stat({ num: pp(p5.konsisten_ya), label: '5. Koordinasi: menilai arahan antar dosen konsisten', tone: 'bad' })}
        ${stat({ num: pp(p6.adil_setuju), label: '6. Penilaian: setuju penilaian adil', tone: 'bad' })}
        ${stat({ num: pc(100 - m.ops[7].pct_agree), label: '7. Fasilitas: tidak setuju fasilitas dan server memadai', tone: 'bad' })}
      </div>
      ${closing('Setiap masalah diikuti satu pemungutan suara. Pilihan solusi disertai data yang mendukung atau menyulitkannya.')}`,
  },

  // 1. respons
  problem({
    id: 'm-respons',
    title: `Masalah 1. Hanya ${pc(m.response.rate)} mahasiswa mengisi survei`,
    src: `survei mahasiswa (n = ${m.n} dari ${m.response.roster}) dan dosen (n = ${l.n} dari ${l.roster}); target respons 70%`,
    stats: [
      { num: pc(l.rate, 1), label: `dosen mengisi (${l.n} dari ${l.roster})`, tone: 'good' },
      { num: pc(mo.enf.rate, 1), label: `respons di ${mo.enf.n_classes} kelas yang dipantau`, tone: 'good' },
      { num: pc(m.response.rate, 1), label: `respons mahasiswa (${m.n} dari ${m.response.roster})`, tone: 'bad' },
      { num: pc(mo.oth.rate, 1), label: `respons di ${mo.oth.n_classes} kelas yang tidak dipantau`, tone: 'bad' },
    ],
    good: [
      `Setelah dibobot ke ukuran populasi, angka utama bergeser paling banyak ${fmt(geserMax, 0)} poin, jadi temuan umum bisa dipercaya.`,
      `Kelas yang dipantau dan yang tidak dipantau tidak berbeda dalam kepuasan, beban, tenggat, dan konsistensi arahan.`,
    ],
    bad: [
      `${m.response.kelas_nol} dari ${m.response.kelas_total} kelas tidak punya responden, dan hanya ${m.response.kelas_min5} kelas punya 5 responden atau lebih.`,
      `SIB Semester 5 adalah ${pc(sib5.pct_responden)} responden tetapi ${pc(sib5.pct_populasi)} populasi.`,
    ],
    closing: 'Rendahnya respons mengurangi ketepatan angka, bukan arah temuannya. Yang membedakan hanya pemantauan di kelas: 81,5% melawan 11,6%.',
    extra: table(
      ['Program dan semester', 'Responden', 'Populasi', '% responden', '% populasi'],
      komposisi.map((k) => [k.sel, String(k.n), String(k.roster), pc(k.pct_responden, 1), pc(k.pct_populasi, 1)]),
    ),
  }),
  vote('respons', 'v-respons', `Kelas yang dipantau mengisi ${pc(mo.enf.rate)}, kelas yang tidak dipantau ${pc(mo.oth.rate)}.`),

  // 2. beban
  problem({
    id: 'm-beban',
    title: 'Masalah 2. Beban terasa berat terutama saat tenggat bertabrakan',
    src: `analisis survei mahasiswa (n = ${m.n}) dan dosen (n = ${l.n}); selang kepercayaan 95% dalam kurung siku`,
    stats: [
      { num: pp(p2.prevalensi), label: `mahasiswa menilai beban berat ${ci(p2.prevalensi.ci)}`, tone: 'bad' },
      { num: `${pc(beratTenggat.mean_ya * 100)} dan ${pc(beratTenggat.mean_tidak * 100)}`, label: 'menilai beban berat: yang sering mengalami tenggat bertabrakan, dan yang tidak', tone: 'bad' },
      { num: sg(PRI('beban').koef_terkontrol.b), label: `poin kepuasan pada yang menilai beban berat, setelah faktor lain dikontrol ${ci(PRI('beban').koef_terkontrol.ci, 2)}`, tone: 'bad' },
      { num: pc(l.workload_heavy_pct), label: 'dosen menilai beban berat', tone: 'good' },
    ],
    good: [
      `${pc(m.workload.items[1].pct)} mahasiswa menilai beban sudah sesuai.`,
      `TI Semester 3 paling ringan: ${pctSem(bySem(p2.per_semester, 'TI Sem 3'))} menilai berat.`,
    ],
    bad: [
      `SIB Semester 3 paling berat: ${pctSem(bySem(p2.per_semester, 'SIB Sem 3'))}, dengan hanya ${bySem(p2.per_semester, 'SIB Sem 3').n} responden.`,
      `Tugas di luar proyek disebut ${pc(m.material[0].pct)}, tetapi tidak membedakan siapa yang merasa berat; tenggat bertabrakan membedakan (${sg(tenggatModel.b)} ${ci(tenggatModel.b_ci, 2)}).`,
    ],
    closing: 'Dosen hanya melihat satu mata kuliah, sedangkan mahasiswa menanggung semuanya sekaligus. Jumlah tugas bukan pembeda utama; menumpuknya tenggat yang menjadi pembeda.',
  }),
  vote('beban', 'v-beban', `${pp(p2.prevalensi)} mahasiswa menilai beban berat. Yang paling membedakan adalah tenggat yang bertabrakan, bukan jumlah tugas.`),

  // 3. jadwal
  problem({
    id: 'm-jadwal',
    title: 'Masalah 3. Milestone PBL jatuh di minggu yang sama dengan kuis dan UTS mata kuliah lain',
    src: `jadwal dari koordinator PBL; wawancara mahasiswa (sampel acak, jumlah tidak tercatat); survei mahasiswa (n = ${m.n}) dan dosen (n = ${l.n})`,
    extra: `<div class="lv-timeline">${[
      ['Minggu 4', 'Proposal', 'kuis 1'],
      ['Minggu 8', 'Milestone 1', 'UTS'],
      ['Minggu 12', 'Milestone 2', 'kuis 2'],
      ['Minggu 16', 'Milestone 3', 'UAS (dibahas hari ini)'],
    ]
      .map(([w, a, b]) => `<div class="lv-tl"><small>${w}</small><b>${a}</b><span>bersamaan dengan ${b}, mata kuliah non-PBL</span></div>`)
      .join('')}</div>`,
    stats: [
      { num: pp(p3.prevalensi), label: `sering atau selalu mengalami tenggat antar mata kuliah bertabrakan ${ci(p3.prevalensi.ci)}`, tone: 'bad' },
      { num: pp(p3.jadwal_tidak_realistis), label: `tidak setuju jadwal dan tenggat milestone realistis ${ci(p3.jadwal_tidak_realistis.ci)}`, tone: 'bad' },
      { num: sg(p3.lanjut_jika_jadwal_tidak_realistis.selisih), label: `poin keinginan melanjutkan pada yang jadwalnya tidak realistis ${ci(p3.lanjut_jika_jadwal_tidak_realistis.ci, 2)}`, tone: 'bad' },
      { num: `${fmt(p3.dosen_jadwal_realistis.dosen, 2)} dan ${fmt(p3.dosen_jadwal_realistis.mahasiswa, 2)}`, label: 'skor jadwal realistis menurut dosen dan menurut mahasiswa', tone: 'bad' },
    ],
    good: [
      `Jumlah mata kuliah terintegrasi tidak membedakan (4 melawan 3 mata kuliah: ${sg(100 * p3.tenggat_empat_vs_tiga_mata_kuliah.selisih, 0)} poin).`,
      `Tugas yang menyatu dengan proyek berkaitan dengan lebih sedikit tenggat bertabrakan (r = ${fmt(p3.tenggat_vs_porsi_tugas_bagian_proyek.r, 2)} ${ci(p3.tenggat_vs_porsi_tugas_bagian_proyek.ci, 2)}).`,
    ],
    bad: [
      `${p3.dosen_menyelaraskan[0].tidak_pernah_atau_jarang} dari ${p3.dosen_menyelaraskan[0].n} dosen PBL jarang atau tidak pernah menyelaraskan tenggat dengan dosen lain.`,
      'Survei tidak membedakan bentrok dengan kuis dan UTS dari bentrok antar mata kuliah PBL. Keluhan dari wawancara menjelaskan sumbernya.',
    ],
    closing: 'Kuis dan UTS berasal dari mata kuliah non-PBL dan di luar kendali program PBL. Tanggal milestone adalah hal yang paling dekat dengan kendali program.',
  }),
  vote('jadwal', 'v-jadwal', `${pp(p3.prevalensi)} mahasiswa sering mengalami tenggat bertabrakan, dan ${pp(p3.jadwal_tidak_realistis)} menilai jadwal milestone tidak realistis.`),

  // 4. keselarasan
  problem({
    id: 'm-selaras',
    title: 'Masalah 4. Tugas mata kuliah belum menjadi bagian dari proyek, tetapi tidak berkaitan dengan beban',
    src: `survei mahasiswa (n = ${m.n}) dan dosen (n = ${l.n}), butir keselarasan mata kuliah; analisis kaitan dengan beban dan kepuasan`,
    stats: [
      { num: pc(m.pooled.bc[3].ya), label: `menjawab tugas mata kuliah bagian dari proyek (dosen: ${pc(l.align[3].ya)})`, tone: 'bad' },
      { num: pc(pick(m.pooled.share, 'Tidak disampaikan').pct), label: 'jawaban: bobot nilai PBL tidak disampaikan', tone: 'bad' },
      { num: `r = ${fmt(p4.porsi_tugas_bagian_proyek_vs_berat.r, 2)}`, label: 'kaitan porsi tugas bagian proyek dengan beban: tidak ada', tone: 'good' },
      { num: `r = ${fmt(p4.porsi_tugas_bagian_proyek_vs_puas.r, 2)}`, label: 'kaitan dengan kepuasan: tidak ada', tone: 'good' },
    ],
    good: [
      `${pc(l.align[0].ya)} dosen menyatakan RPS sudah disesuaikan untuk mendukung PBL.`,
      `Mata kuliah PIC punya kegiatan PBL di kelas lebih sering (${sg(p4.pic_vs_pendukung.kegiatan_pbl_sering.selisih_poin, 1)} poin ${ci(p4.pic_vs_pendukung.kegiatan_pbl_sering.ci)}).`,
    ],
    bad: [
      `Hanya ${pc(m.pooled.bc[3].ya)} jawaban mahasiswa dan ${pc(l.align[3].ya)} dosen menyatakan tugas menjadi bagian proyek.`,
      `Mata kuliah PIC tidak lebih sering menjadikan tugasnya bagian proyek (${sg(p4.pic_vs_pendukung.tugas_bagian_proyek.selisih_poin, 1)} poin ${ci(p4.pic_vs_pendukung.tugas_bagian_proyek.ci)}).`,
    ],
    closing: 'Di data ini keselarasan tugas tidak menjelaskan beban atau kepuasan. Satu-satunya kaitan: lebih sedikit tenggat bertabrakan. Ini pekerjaan semester depan, bukan yang paling mendesak.',
  }),
  vote('selaras', 'v-selaras', `Hanya ${pc(m.pooled.bc[3].ya)} mahasiswa menjawab tugas mata kuliah bagian dari proyek (dosen: ${pc(l.align[3].ya)}).`),

  // 5. koordinasi
  problem({
    id: 'm-koordinasi',
    title: 'Masalah 5. Arahan antar dosen berbeda-beda',
    src: `survei mahasiswa (n = ${m.n}) dan dosen (n = ${l.n}); komentar bebas tema koordinasi (${th('koordinasi').n})`,
    stats: [
      { num: pp(p5.konsisten_ya), label: `mahasiswa menilai arahan antar dosen konsisten ${ci(p5.konsisten_ya.ci)}`, tone: 'bad' },
      { num: pc(l.coord_yn[2].ya), label: 'dosen punya kesepakatan peran', tone: 'bad' },
      { num: pc(l.coord_yn[3].ya), label: 'dosen menyatakan dosen rujukan utama tim jelas', tone: 'bad' },
      { num: pp(p5.tahu_hubungi_ya), label: 'mahasiswa tahu harus menghubungi dosen siapa', tone: 'good' },
    ],
    good: [
      `Informasi dari koordinator dinilai jelas dan tepat waktu (${fmt(l.ops_extra[2].mean, 2)} dari 5).`,
      `${pc(l.coord_yn[1].ya)} dosen mengenal dosen lain di kelas yang sama.`,
    ],
    bad: [
      `Paling rendah di SIB Semester 5 (${pctSem(bySem(p5.per_semester, 'SIB Sem 5'))}), tertinggi di TI Semester 3 (${pc(bySem(p5.per_semester, 'TI Sem 3').pct)}).`,
      `Hambatan dosen: beban mengajar dan administrasi (${bar('Beban mengajar dan administrasi lain')} dari ${l.n}) dan tidak ada jadwal rapat rutin (${bar('Tidak ada jadwal rapat rutin')}); hanya ${rapatSelalu} dari ${l.n} selalu hadir di rapat.`,
    ],
    closing: `Pengaruh arahan yang berbeda pada kepuasan belum terbukti setelah faktor lain dikontrol. Yang berkaitan dengan kepuasan adalah mengetahui harus bertanya ke dosen siapa (${sg(p5.puas_jika_tidak_tahu_hubungi.selisih)} poin ${ci(p5.puas_jika_tidak_tahu_hubungi.ci, 2)}).`,
  }),
  {
    id: 'm-pic',
    title: 'Dosen rujukan (PIC) sudah ada: pengampu mata kuliah inti di tiap kelas',
    src: `Sosialisasi PBL TI dan SIB (mata kuliah inti dan pendukung tiap semester); survei mahasiswa (n = ${m.n}) dan dosen (n = ${l.n})`,
    render: () => `
      <div class="lv-stats">
        ${stat({ num: pc(l.coord_yn[3].ya), label: 'dosen menyatakan dosen rujukan utama tim sudah jelas', tone: 'bad' })}
        ${stat({ num: pc(m.coord[2].ya), label: 'mahasiswa tahu harus bertanya ke dosen siapa', tone: 'good' })}
        ${stat({ num: pc(imp('Tidak jelas dosen yang menjadi rujukan tim').pct), label: 'mahasiswa memilih "tidak jelas dosen rujukan" sebagai masalah', tone: 'good' })}
      </div>
      ${table(
        ['Program dan semester', 'PIC: pengampu mata kuliah', 'Mata kuliah pendukung'],
        picRows.map((r) => [`${r.prodi} Semester ${r.sem}`, `<b>${esc(r.course)}</b>`, supporting(r).map(esc).join(', ')]),
      )}
      ${closing('Perannya sudah ada, jadi yang perlu diputuskan adalah cara memakainya. Belum dipastikan apakah PIC tiap kelas sudah diberi tahu.')}`,
  },
  vote('koordinasi', 'v-koordinasi', `Hanya ${pp(p5.konsisten_ya)} mahasiswa menilai arahan dosen konsisten. PIC kelas sudah ada, tetapi baru ${pc(l.coord_yn[3].ya)} dosen menyatakan dosen rujukan jelas, dan hambatan utama dosen adalah beban mengajar dan administrasi.`),

  // 6. penilaian
  problem({
    id: 'm-nilai',
    title: 'Masalah 6. Rubrik dan penilaian belum dianggap adil',
    src: `survei mahasiswa (n = ${m.n}) dan dosen (n = ${l.n}); analisis penentu persepsi penilaian adil`,
    stats: [
      { num: pp(p6.rubrik_jelas_setuju), label: `setuju rubrik jelas ${ci(p6.rubrik_jelas_setuju.ci)}`, tone: 'bad' },
      { num: pp(p6.adil_setuju), label: `setuju penilaian adil ${ci(p6.adil_setuju.ci)}`, tone: 'bad' },
      { num: `r = ${fmt(p6.korelasi_rubrik_adil.r, 2)}`, label: 'kaitan rubrik jelas dengan penilaian adil: sangat kuat', tone: 'good' },
      { num: pp(p6.kontribusi_timpang_dipilih), label: 'memilih kontribusi anggota tidak seimbang sebagai masalah', tone: 'bad' },
    ],
    good: [
      `SOP dan template adalah butir pelaksanaan dengan skor tertinggi (${pc(m.ops[1].pct_agree)} setuju).`,
      `Bimbingan dosen dinilai memadai oleh ${pc(m.ops[3].pct_agree)}.`,
    ],
    bad: [
      `Kontribusi tidak seimbang paling tinggi di TI Semester 3: ${pctSem(bySem(p6.per_semester_timpang, 'TI Sem 3'))}, melawan ${pctSem(bySem(p6.per_semester_timpang, 'SIB Sem 5'))} di SIB Semester 5.`,
      `Dosen menilai rubrik lebih jelas (${fmt(p6.dosen.rubrik_jelas_rata, 2)}) dan nilai lebih adil (${fmt(p6.dosen.adil_rata, 2)}) daripada mahasiswa (${fmt(p6.dosen.mahasiswa_rubrik_rata, 2)} dan ${fmt(p6.dosen.mahasiswa_adil_rata, 2)}).`,
    ],
    closing: `Kejelasan rubrik adalah pengungkit terkuat persepsi adil: koefisien baku ${fmt(rubrikBeta, 2)}, jauh di atas kontribusi tidak seimbang (${fmt(timpangBeta, 2)}).`,
  }),
  vote('nilai', 'v-nilai', `Hanya ${pp(p6.rubrik_jelas_setuju)} mahasiswa setuju rubrik jelas dan ${pp(p6.adil_setuju)} setuju penilaian adil.`),

  // 7. fasilitas
  problem({
    id: 'm-fasilitas',
    title: 'Masalah 7. Server untuk deployment wajib, dan mahasiswa membeli VPS sendiri',
    src: `survei mahasiswa (n = ${m.n}); keterangan koordinator PBL tentang kebutuhan deployment; komentar bebas tema fasilitas (${th('fasilitas').n})`,
    stats: [
      { num: pc(100 - m.ops[7].pct_agree), label: 'tidak setuju fasilitas dan sumber daya (server, data, perangkat) memadai', tone: 'bad' },
      { num: sg(PRI('fasilitas').koef_terkontrol.b), label: `poin kepuasan hilang, setelah faktor lain dikontrol ${ci(PRI('fasilitas').koef_terkontrol.ci, 2)}`, tone: 'bad' },
      { num: `${fmt(prodiFas('TI'), 2)} dan ${fmt(prodiFas('SIB'), 2)}`, label: 'skor fasilitas TI dan SIB: sama rendah', tone: 'bad' },
      { num: sg(pmpl.selisih), label: `selisih skor semester dengan dan tanpa Penjaminan Mutu ${ci(pmpl.ci, 2)}: tidak berbeda`, tone: 'bad' },
    ],
    good: [
      'Kebutuhannya jelas: aplikasi web dan pengujian Penjaminan Mutu Perangkat Lunak (TI dan SIB Semester 5) mensyaratkan aplikasi yang sudah ter-deploy.',
      `Dosen menilai fasilitas lebih tinggi (${fmt(A.dosen.ops[7].mean, 2)}) daripada mahasiswa (${fmt(m.ops[7].mean, 2)}).`,
    ],
    bad: [
      'Mahasiswa membeli VPS sendiri. Biaya per tim, siapa yang membayar, dan sejak milestone mana server dibutuhkan belum diketahui.',
      'Kebutuhan server dan perkiraan biayanya belum tertulis di SOP, jadi tim baru tahu setelah semester berjalan.',
    ],
    closing: 'Karena deployment wajib dan skornya sama rendah di semua semester, ini biaya struktural, bukan keluhan satu program. Pertanyaannya siapa menyediakan, sejak kapan, dan berapa lama.',
  }),
  vote('fasilitas', 'v-fasilitas', `${pc(100 - m.ops[7].pct_agree)} mahasiswa tidak setuju fasilitas memadai, dan fasilitas adalah prioritas pertama dalam analisis kepuasan.`),
  problem({
    id: 'm-konsultasi',
    title: 'Satu temuan yang mengubah usulan: konsultasi yang jarang tidak menurunkan kepuasan',
    src: `survei mahasiswa (n = ${m.n}); butir konsultasi dan bimbingan dosen`,
    stats: [
      { num: pp(p7.belum_konsultasi), label: 'tim belum pernah berkonsultasi dengan dosen di luar jam kuliah', tone: 'bad' },
      { num: sg(p7.puas_jika_belum_konsultasi.selisih), label: `selisih kepuasan tim yang belum berkonsultasi ${ci(p7.puas_jika_belum_konsultasi.ci, 2)}: tidak berbeda`, tone: 'good' },
      { num: sg(p7.bimbingan_memadai_jika_belum_konsultasi.selisih), label: `selisih penilaian bimbingan memadai ${ci(p7.bimbingan_memadai_jika_belum_konsultasi.ci, 2)}`, tone: 'bad' },
      { num: pc(cepat), label: 'mengatakan dosen menjawab dalam kurang dari sehari', tone: 'good' },
    ],
    good: ['Dosen cepat menanggapi pertanyaan mahasiswa.', 'Tim yang belum berkonsultasi tidak lebih rendah kepuasannya, dan cenderung lebih ingin melanjutkan.'],
    bad: [`Tim yang belum berkonsultasi menilai bimbingan kurang memadai, dan ${pc(100 - m.ops[3].pct_agree)} mahasiswa tidak setuju bimbingan dosen memadai.`],
    closing: 'Karena itu konsultasi dengan jadwal tetap tidak dijadikan usulan utama. Yang berkaitan dengan kepuasan adalah persepsi bahwa bimbingan memadai.',
  }),

  // closing votes and discussion
  vote('prioritas', 'v-prioritas', 'Tidak semua masalah bisa dikerjakan sekaligus. Pilih dua yang paling perlu didahulukan.'),
  {
    id: 'v-komitmen',
    title: 'Kesediaan Bapak/Ibu dosen',
    question: 'komitmen',
    render: (c) => `
      <div class="lv-votegrid">
        <div>
          <p class="lv-recapline">Sebagian solusi hanya berjalan kalau dosen ikut. PIC kelas adalah pengampu mata kuliah inti, dan baru ${pc(l.coord_yn[3].ya)} dosen yang menyatakan dosen rujukan utama tim sudah jelas.</p>
          <div class="lv-opts" data-q="komitmen"></div>
        </div>
        ${joinPanel(c, 'Pilih yang bersedia di ponsel Anda')}
      </div>`,
  },
  {
    id: 'd-jadwal',
    title: 'Untuk dibahas bersama: jadwal milestone',
    src: 'jadwal dari koordinator PBL; survei mahasiswa dan wawancara mahasiswa (sampel acak)',
    render: () =>
      disc([
        {
          q: 'Bisakah Milestone 2 (minggu 12, bersama kuis 2) digeser atau diberi jendela pengumpulan?',
          known: `Milestone 2 jatuh di minggu yang sama dengan kuis 2 mata kuliah non-PBL. ${pp(p3.prevalensi)} mahasiswa sering mengalami tenggat bertabrakan.`,
          unknown: 'Apakah masih mungkin untuk semester ini.',
        },
        {
          q: 'Apakah Milestone 3 (minggu 16) tetap bersama UAS?',
          known: 'Menurut jadwal sekarang keduanya di minggu 16.',
          unknown: 'Apakah keduanya bisa dipisah.',
        },
        {
          q: 'Bisakah Jurusan menerbitkan kalender kuis dan UTS semua mata kuliah sebelum tanggal milestone ditetapkan?',
          known: 'Kuis dan UTS berasal dari mata kuliah non-PBL dan di luar kendali program PBL.',
          unknown: 'Kalender kuis dan UTS per semester masih dibutuhkan koordinator PBL untuk menggeser tanggal milestone.',
        },
      ]),
  },
  {
    id: 'd-server',
    title: 'Untuk dibahas bersama: server dan peran PIC',
    src: 'keterangan koordinator PBL; survei mahasiswa dan dosen; Sosialisasi PBL TI dan SIB',
    render: () =>
      disc([
        {
          q: 'Siapa yang menyediakan lingkungan deployment dan uji, dan sejak fase mana?',
          known: `Aplikasi web wajib di-deploy dan pengujian Penjaminan Mutu mensyaratkan aplikasi ter-deploy. Mahasiswa membeli VPS sendiri. ${pc(100 - m.ops[7].pct_agree)} tidak setuju fasilitas memadai.`,
          unknown: 'Biaya per tim, siapa yang membayar, dan sejak milestone mana server dibutuhkan untuk pengujian.',
        },
        {
          q: 'Apakah PIC tiap kelas sudah diberi tahu perannya?',
          known: `PIC adalah pengampu mata kuliah inti. Baru ${pc(l.coord_yn[3].ya)} dosen menyatakan dosen rujukan utama tim jelas.`,
          unknown: 'Belum dipastikan apakah PIC sudah diberi tahu.',
        },
        {
          q: 'Data apa yang perlu dikumpulkan sebelum keputusan diambil?',
          known: 'Survei lanjutan singkat tentang server dan biaya sudah dirancang (10 pertanyaan). Wawancara mahasiswa berupa sampel acak.',
          unknown: 'Siapa yang menjalankan survei lanjutan dan kapan; jumlah mahasiswa yang diwawancarai tidak tercatat.',
        },
      ]),
  },
  {
    id: 'v-saran',
    title: 'Saran dan usulan lain dari Bapak/Ibu',
    question: 'saran',
    render: (c) => `
      <div class="lv-votegrid">
        <div>
          <p class="lv-recapline">Ada masalah atau solusi yang belum disebut, atau hal dari diskusi tadi yang perlu dicatat? Tuliskan di ponsel Anda. Saran dikirim tanpa nama.</p>
          <div class="lv-sug-list" data-suggestions></div>
        </div>
        ${joinPanel(c, 'Tulis saran di ponsel Anda')}
      </div>`,
  },
  {
    id: 'targets',
    title: 'Ukuran keberhasilan semester depan',
    src: `analisis survei mahasiswa (n = ${m.n}); target di tepi selang kepercayaan 95% angka sekarang`,
    render: () => {
      const keys = ['Beban berat', 'Tenggat antar mata kuliah', 'Tidak setuju jadwal', 'Setuju fasilitas', 'Setuju rubrik', 'Setuju penilaian adil', 'Arahan dosen antar mata kuliah']
      const rows = keys.map((k) => target(k)).filter(Boolean)
      const mdds = rows.map((r: any) => r.selisih_terkecil_terbukti_poin)
      const n10 = Math.round((2.8 ** 2 * 2 * 0.4 * 0.6) / 0.01 / 25) * 25
      const n70 = Math.round(0.7 * m.response.roster)
      return `${table(
        ['Ukuran', 'Sekarang [selang]', 'Target', 'Selisih terkecil yang bisa dibuktikan'],
        rows.map((r: any) => [esc(r.ukuran), `${pc(r.persen, 1)} ${ci(r.ci)}`, `${r.arah === 'turun' ? 'di bawah' : 'di atas'} ${pc(r.target_persen, 1)}`, `${fmt(r.selisih_terkecil_terbukti_poin, 1)} poin`]),
      )}
      ${closing(`Target di tepi selang adalah batas praktis, bukan bukti. Membuktikan perubahan nyata pada ${m.n} responden butuh sekitar ${fmt(Math.min(...mdds), 0)} sampai ${fmt(Math.max(...mdds), 0)} poin, atau sekitar ${n10} responden per survei untuk 10 poin. Respons 70% (sekitar ${n70} mahasiswa) cukup untuk sekitar 8 poin, jadi Masalah 1 menjadi syarat bagi ukuran yang lain.`)}`
    },
  },
  {
    id: 'rekap',
    title: 'Solusi yang dipilih Bapak/Ibu',
    recap: true,
    render: () => `<div class="lv-recap" data-recap><p class="lv-note">Memuat hasil…</p></div>
      ${closing('Solusi dengan suara terbanyak masuk rencana tindak lanjut. Usulan di kolom Lainnya dan hasil diskusi dibahas bersama sebelum jadwalnya ditetapkan.')}`,
  },
]

// ------------------------------------------------------------------ appendix
const masalahKecil = (lab: string) => ['Tidak ada masalah berarti', 'Tidak ada kendala'].includes(lab)

const appendix: Slide[] = [
  {
    id: 'a-divider',
    title: 'Lampiran: data lengkap',
    appendix: true,
    render: () => `<p class="lv-recapline">Slide berikut adalah cadangan untuk menjawab pertanyaan. Semua pilihan ditampilkan tanpa disaring. Hasil per kelas dan per mata kuliah tidak ditampilkan.</p>`,
  },
  {
    id: 'a-metode',
    title: 'Cara membaca angka dan keterbatasannya',
    appendix: true,
    src: 'analisis survei monev PBL; mahasiswa 177 dari 806, dosen 22 dari 34',
    render: () => `<div class="lv-bb">
      <div class="lv-panel is-good"><h3>Cara membaca</h3>${li([
        'Setiap persentase diberi selang kepercayaan 95% dalam kurung siku; selisih yang selangnya mencakup nol belum terbukti.',
        '"Efek terkontrol" memperhitungkan semua faktor lain bersamaan lewat regresi linear; ini pendekatan, karena skor 1 sampai 5 diperlakukan sebagai angka.',
        'Angka dibobot ke ukuran populasi per program dan semester untuk memeriksa kemiringan komposisi responden.',
      ])}</div>
      <div class="lv-panel is-bad"><h3>Keterbatasan</h3>${li([
        'Survei satu kali dan jawaban diri sendiri: yang ditemukan adalah kaitan, bukan sebab-akibat.',
        'Respons 22%: ketepatannya terbatas, dan perbedaan di dalam kelas antara yang mengisi dan tidak tidak bisa diuji.',
        'Dosen hanya 22 orang; perubahan kecil tidak bisa dibuktikan, jadi baca angka mentahnya.',
        'Wawancara mahasiswa berupa sampel acak tanpa jumlah tercatat; dipakai sebagai bukti kualitatif.',
      ])}</div></div>`,
  },
  {
    id: 'a-pendorong',
    title: 'Pendorong kepuasan dan keinginan melanjutkan',
    appendix: true,
    src: `regresi pada ${AN.umum.model_pendorong.puas.n} mahasiswa (kepuasan, R² = ${fmt(AN.umum.model_pendorong.puas.r2, 2)}) dan ${AN.umum.model_pendorong.lanjut.n} (melanjutkan, R² = ${fmt(AN.umum.model_pendorong.lanjut.r2, 2)}); b = poin skor per kenaikan satu poin`,
    render: () => {
      const pu: any[] = AN.umum.model_pendorong.puas.koef
      const la: any[] = AN.umum.model_pendorong.lanjut.koef
      const rows = [...pu].sort((a, b) => Math.abs(b.beta) - Math.abs(a.beta)).slice(0, 8)
      return `${table(
        ['Faktor', 'Kepuasan: b [selang]', 'Melanjutkan: b [selang]'],
        rows.map((r) => {
          const o = la.find((x) => x.nama === r.nama)
          return [esc(r.nama), effCell(r.b, r.b_ci), effCell(o.b, o.b_ci)]
        }),
      )}<p class="lv-note">Tebal: selang tidak mencakup nol. Faktor yang berkaitan satu sama lain saling berbagi pengaruh dalam model.</p>`
    },
  },
  {
    id: 'a-masalah-mhs',
    title: 'Semua masalah yang dipilih mahasiswa',
    appendix: true,
    src: `survei mahasiswa (n = ${m.n}); persentase dihitung dari ${m.n} mahasiswa`,
    render: () => `
      <div class="lv-two">
        <div><h4>Masalah yang dipilih (boleh lebih dari satu)</h4>${bars(m.improve.map((x: any) => [x.label, x.pct, masalahKecil(x.label) ? 'mute' : 'bad']), { max: 45, lw: 460, size: 20 })}</div>
        <div><h4>Kendala materi dan koordinasi</h4>${bars(
          [
            ...m.material.map((x: any) => [x.label, x.pct, masalahKecil(x.label) ? 'mute' : 'bad']),
            [m.coord[3].label + ' (sering atau selalu)', m.coord[3].pct_oa, 'bad'],
            [m.coord[4].label + ' (sering atau selalu)', m.coord[4].pct_oa, 'bad'],
          ],
          { max: 70, lw: 460, size: 20 },
        )}</div>
      </div>`,
  },
  {
    id: 'a-masalah-dosen',
    title: 'Semua masalah dari sisi dosen',
    appendix: true,
    src: `survei dosen (n = ${l.n}); jumlah dosen`,
    render: () => `
      <div class="lv-two">
        <div><h4>Hal yang perlu diperbaiki</h4>${bars(l.improve.map((x: any) => [x.label, x.count, 'bad']), { max: 12, unit: 'n', lw: 460, size: 20 })}</div>
        <div><h4>Hambatan koordinasi antar dosen</h4>${bars(l.barriers.map((x: any) => [x.label, x.count, masalahKecil(x.label) ? 'mute' : 'bad']), { max: 20, unit: 'n', lw: 460, size: 20 })}
        <h4 style="margin-top:24px">Hambatan menyesuaikan materi</h4>${bars(l.material_barriers.map((x: any) => [x.label, x.count, masalahKecil(x.label) ? 'mute' : 'bad']), { max: 20, unit: 'n', lw: 460, size: 20 })}</div>
      </div>`,
  },
  {
    id: 'a-dukungan',
    title: 'Dukungan yang diminta dosen',
    appendix: true,
    src: `survei dosen (n = ${l.n}); jumlah dosen`,
    render: () => `${bars(l.support.map((x: any) => [x.label, x.count, 'good']), { max: 12, unit: 'n', lw: 620, size: 26 })}
      ${closing('Dasar pilihan solusi: yang diminta dosen dibandingkan dengan hambatan yang mereka sebut.')}`,
  },
  {
    id: 'a-butir',
    title: 'Semua butir penilaian: mahasiswa dan dosen',
    appendix: true,
    src: `butir yang sama pada survei mahasiswa (n = ${m.n}) dan dosen (n = ${l.n}); diurutkan dari persetujuan mahasiswa terendah`,
    render: () => `<table class="lv-tbl"><thead><tr><th>Butir</th><th>Mahasiswa setuju</th><th>Dosen setuju</th><th>Selisih skor</th></tr></thead><tbody>${[...A.gap]
      .sort((a: any, b: any) => a.mhs_agree - b.mhs_agree)
      .map((g: any) => `<tr><td>${esc(g.label)}</td><td class="${g.mhs_agree < 50 ? 'is-bad' : ''}">${pc(g.mhs_agree)}</td><td>${pc(g.dosen_agree)}</td><td>${sgn(g.gap)}</td></tr>`)
      .join('')}</tbody></table><p class="lv-note">Oranye: kurang dari separuh mahasiswa setuju.</p>`,
  },
  {
    id: 'a-tema-mhs',
    title: 'Semua tema komentar bebas mahasiswa',
    appendix: true,
    src: `komentar bebas mahasiswa TI dan SIB (${tema.substantive} komentar bermakna), dikelompokkan per tema dan subtema`,
    render: () => `<div class="lv-cols">${[...tema.themes]
      .sort((a: any, b: any) => b.n - a.n)
      .map((t: any) => `<div class="lv-theme ${t.key === 'baik' ? 'is-ok' : ''}"><b>${esc(t.label)}</b> <small>(${t.n}; TI ${t.ti}, SIB ${t.sib})</small>${t.subs.map((s: any) => `<div class="lv-sub-item">${esc(s.label)} (${s.n})</div>`).join('')}</div>`)
      .join('')}</div>`,
  },
  {
    id: 'a-tema-dosen',
    title: 'Tema isian terbuka dosen',
    appendix: true,
    src: `isian terbuka survei dosen (${temaDosen.input} isian dari ${temaDosen.penulis.n} dari ${l.n} dosen); hanya jumlah per tema`,
    render: () => `<p class="lv-note">Jumlahnya kecil, jadi ini usulan, bukan pendapat seluruh dosen. Isian lengkap tidak dipublikasikan.</p><div class="lv-cols">${temaDosen.themes
      .map((t: any) => `<div class="lv-theme ${t.kind === 'baik' ? 'is-ok' : ''}"><b>${esc(t.label)}</b> <small>(${t.n} dosen; TI ${t.ti}, SIB ${t.sib})</small></div>`)
      .join('')}</div>`,
  },
]

export const slides: Slide[] = [...main, ...appendix]

// ------------------------------------------------------------------ recap
export function paintRecap(el: HTMLElement, all: Record<string, Results>) {
  const solved = ['respons', 'beban', 'jadwal', 'selaras', 'koordinasi', 'nilai', 'fasilitas']
  const prio = all['prioritas']
  const komit = all['komitmen']
  const card = (k: string) => {
    const q = Q(k)
    const r = all[k]
    const ranked = q.options.map((o) => ({ o, c: r?.counts[o.key] ?? 0 })).sort((a, b) => b.c - a.c)
    const first = ranked[0]
    const other = r?.n_other ? `<p class="is-second">${r.n_other} usulan di kolom Lainnya</p>` : ''
    return `<div class="lv-rc"><h4>${esc(q.area)}${prio ? `<em>prioritas ${pc(prio.n ? ((prio.counts[k] ?? 0) / prio.n) * 100 : 0)}</em>` : ''}</h4>
      ${first && first.c > 0 ? `<p>${esc(first.o.label)}<small>${first.c} dari ${r.n} pemilih</small></p>` : '<p><small>Belum ada suara</small></p>'}
      ${ranked[1] && ranked[1].c > 0 ? `<p class="is-second">${esc(ranked[1].o.label)}<small>${ranked[1].c} suara</small></p>` : ''}${other}</div>`
  }
  const kom = komit
    ? `<div class="lv-rc is-wide"><h4>Kesediaan dosen<em>${komit.n} pemilih</em></h4>${Q('komitmen')
        .options.map((o) => `<p>${esc(o.label)}<small>${komit.counts[o.key] ?? 0} dosen</small></p>`)
        .join('')}</div>`
    : ''
  el.innerHTML = solved.map(card).join('') + kom
}
