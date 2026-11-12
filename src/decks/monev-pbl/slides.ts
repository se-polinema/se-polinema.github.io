// Monev PBL slides. Every number comes from src/data/monev-pbl/*.json (sanitized aggregates of the survey report and
// of the problem analysis), so the deck cannot drift from the analysis. Main slides use plain words and percentages;
// statistics terms (intervals, coefficients) stay in the appendix. Each problem slide is followed by a poll slide where
// lecturers pick a solution or write their own under "Lainnya". Two discussion slides collect the open items.
// Public site: program and semester level only, no class or course results (the class grid is anonymous).
import agregat from '../../data/monev-pbl/agregat.json'
import temaJson from '../../data/monev-pbl/tema.json'
import temaDosenJson from '../../data/monev-pbl/tema_dosen.json'
import { esc, fmt, pc, pick, sgn } from '../../lib/live/format'
import { withBase } from '../../lib/paths'
import type { Results, Slide, SlideCtx } from '../../lib/live/types'
import { AN, PRI, bySem, ci, plainEffect, pp, sg, sure, target } from './analysis'
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
const wa = (lab: string) => pick(l.wa.items, lab).count

// analysis shortcuts
const p1 = AN.p1_respons
const p2 = AN.p2_beban
const p3 = AN.p3_jadwal
const p4 = AN.p4_selaras
const p5 = AN.p5_koordinasi
const p6 = AN.p6_penilaian
const p7 = AN.p7_fasilitas_bimbingan
const pctSem = (g: any) => pc(g.pct)
const d1 = (x: number) => fmt(x, 1)
const poin = (b: number) => `sekitar ${fmt(Math.abs(b), 1)} poin`

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

/** QR, session code, copyable link row and a hint. The copy button is wired by LivePresenter (data-copy-link). */
function joinPanel(c: SlideCtx, hint: string, big = false) {
  const short = c.joinUrl.replace(/^https?:\/\//, '')
  return `<aside class="lv-join ${big ? 'is-big' : ''}">
    <img src="${c.qr}" alt="QR" />
    <div class="lv-code">${esc(c.code)}</div>
    <div class="lv-link-row"><span class="lv-url">${esc(short)}</span><button type="button" class="lv-copy" data-copy-link>Salin</button></div>
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

/** Appendix only: effect with its interval. */
const effCell = (b: number, c: number[]) => (sure(c) ? `<b>${sg(b)}</b>` : sg(b)) + ` <small>${ci(c, 2)}</small>`

/** One box per class, no names: whole-percent response rate, thick outline for monitored classes. */
function responseGrid() {
  const tile = (k: any) => {
    const cls = k.rate === 0 ? 'zero' : k.rate < 30 ? 'low' : k.rate < 70 ? 'mid' : 'hi'
    return `<div class="lv-tile is-${cls} ${k.dipantau ? 'is-mon' : ''}"><span>${pc(k.rate)}</span></div>`
  }
  return m.response.sebaran
    .map(
      (sm: any) =>
        `<div class="lv-semrow"><div class="lv-semlab"><b>${esc(sm.label)}</b><small>${sm.n} dari ${sm.roster} mahasiswa · ${pc(sm.rate)}</small></div><div class="lv-tiles">${sm.kelas.map(tile).join('')}</div></div>`,
    )
    .join('')
}

// ------------------------------------------------------------------ main slides
const komposisi: any[] = p1.komposisi
const sib5 = komposisi.find((k) => k.sel === 'SIB Sem 5')
const geserMax = Math.max(...p1.pasca_stratifikasi.map((x: any) => Math.abs(x.bergeser)))
const beratTenggat = p2.berat_vs_tenggat
const dosenSelaras = p3.dosen_menyelaraskan[0]
const lanjutJadwal = p3.lanjut_jika_jadwal_tidak_realistis
const rapatSelalu = p5.dosen.kehadiran_rapat.find((i: any) => i.label === 'Selalu hadir').count
const pmpl = p7.fasilitas_semester_pmpl_vs_tanpa
const prodiFas = (k: string) => p7.per_prodi_fasilitas.find((g: any) => g.kelompok === k).mean
const picKegiatan = p4.pic_vs_pendukung.kegiatan_pbl_sering
const adaTugasPic = p4.pic_vs_pendukung.tugas_bagian_proyek

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
          <ol class="lv-steps">
            <li>Pindai QR atau salin tautan di sebelah kanan.</li>
            <li>Untuk tiap dari tujuh masalah, pilih solusi di ponsel. Tidak ada yang cocok? Tulis usulan sendiri di kolom Lainnya.</li>
            <li>Di akhir, kita diskusi dua hal yang belum diputuskan: jadwal milestone, serta server dan peran PIC.</li>
          </ol>
        </div>
        ${joinPanel(c, 'Pindai QR atau buka tautan untuk ikut memilih', true)}
      </div>`,
  },
  {
    id: 'ringkasan',
    title: 'Mahasiswa menilai PBL bermanfaat, tetapi belum puas dengan pelaksanaannya',
    src: `survei mahasiswa (${m.n} responden), persentase yang setuju atau sangat setuju`,
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
      ${closing(`Mahasiswa mengeluh tentang cara PBL dijalankan, sedangkan manfaatnya dinilai baik oleh ${pc(m.ben[2].pct_agree)} sampai ${pc(m.ben[0].pct_agree)}. Yang pernah ikut PBL sama puasnya dengan yang belum (${pc(m.by_experience[1].sat_agree)} dan ${pc(m.by_experience[0].sat_agree)}).`)}`,
  },
  {
    id: 'peta',
    title: 'Tujuh masalah yang dibahas hari ini',
    src: `survei mahasiswa (${m.n}) dan dosen (${l.n}); wawancara mahasiswa (dipilih acak) untuk masalah jadwal`,
    render: () => `
      <div class="lv-stats">
        ${stat({ num: pc(100 - m.response.rate), label: '1. Respons: mahasiswa yang tidak mengisi survei (target: di bawah 30%)', tone: 'bad' })}
        ${stat({ num: pp(p2.prevalensi), label: '2. Beban: mahasiswa yang menilai PBL berat', tone: 'bad' })}
        ${stat({ num: pp(p3.prevalensi), label: '3. Jadwal: sering atau selalu mengalami deadline bertabrakan', tone: 'bad' })}
        ${stat({ num: pc(PRI('selaras').prevalensi.pct), label: '4. Kesesuaian: menilai tugas dan penilaian antar mata kuliah tidak sejalan', tone: 'bad' })}
      </div>
      <div class="lv-stats">
        ${stat({ num: pc(PRI('koordinasi').prevalensi.pct), label: '5. Koordinasi: menilai arahan antar dosen tidak konsisten', tone: 'bad' })}
        ${stat({ num: pc(PRI('penilaian').prevalensi.pct), label: '6. Penilaian: menilai penilaian tidak adil', tone: 'bad' })}
        ${stat({ num: pc(100 - m.ops[7].pct_agree), label: '7. Fasilitas: tidak setuju fasilitas dan server memadai', tone: 'bad' })}
      </div>
      ${closing('Berikutnya: seberapa kuat tiap masalah memengaruhi kepuasan. Setelah itu, setiap masalah dibahas satu per satu dan diikuti satu pemungutan suara.')}`,
  },
  {
    id: 'prioritas-data',
    title: 'Dari tujuh masalah, fasilitas dan beban paling jelas memengaruhi kepuasan',
    src: `analisis survei mahasiswa (${m.n} responden). Tiap masalah dibandingkan dengan mahasiswa yang kondisinya sama dalam hal lain. Poin pada skala 1 sampai 5`,
    render: () => {
      const rows: [number, string, string, boolean][] = [
        [7, 'fasilitas', 'Fasilitas (server deployment)', true],
        [2, 'beban', 'Beban berat', true],
        [3, 'jadwal_realistis', 'Jadwal milestone tidak realistis', false],
        [5, 'koordinasi', 'Arahan dosen tidak konsisten', false],
        [6, 'penilaian', 'Penilaian tidak adil', false],
        [4, 'selaras', 'Tugas dan penilaian tidak sejalan', false],
      ]
      const hi = (x: string, on: boolean) => (on ? `<b>${x}</b>` : x)
      return `${table(
        ['No.', 'Masalah', 'Yang mengalami', 'Pengaruh pada kepuasan', 'Pengaruh pada keinginan melanjutkan'],
        [
          ...rows.map(([no, k, lab, on]) => [
            hi(String(no), on),
            hi(esc(lab), on),
            pc(PRI(k, 'puas').prevalensi.pct),
            plainEffect(k, 'puas'),
            plainEffect(k, 'lanjut'),
          ]),
          ['1', 'Respons survei rendah', pc(100 - m.response.rate) + ' tidak mengisi', 'tidak berlaku', 'tidak berlaku'],
        ],
      )}
      <p class="lv-note">Nomor mengikuti slide sebelumnya. Masalah 1 menyangkut survei itu sendiri, jadi tidak diukur terhadap kepuasan. "Belum pasti" berarti masalahnya nyata dikeluhkan, tetapi dengan ${m.n} responden belum bisa dipisahkan dari masalah lain yang saling terkait.</p>
      ${closing('Dari tujuh masalah, hanya fasilitas (7) dan beban (2) yang pengaruhnya pasti, baik pada kepuasan maupun keinginan melanjutkan. Jadwal milestone (3) tampak menurunkan keinginan melanjutkan, tetapi belum pasti.')}`
    },
  },

  // 1. respons
  problem({
    id: 'm-respons',
    title: `Masalah 1. Hanya ${pc(m.response.rate)} mahasiswa mengisi survei`,
    src: `survei mahasiswa (${m.n} dari ${m.response.roster}) dan dosen (${l.n} dari ${l.roster}); target respons 70%`,
    stats: [
      { num: pc(l.rate), label: `dosen mengisi (${l.n} dari ${l.roster})`, tone: 'good' },
      { num: pc(mo.enf.rate), label: `respons di ${mo.enf.n_classes} kelas yang dipantau`, tone: 'good' },
      { num: pc(m.response.rate), label: `respons mahasiswa (${m.n} dari ${m.response.roster})`, tone: 'bad' },
      { num: pc(mo.oth.rate), label: `respons di ${mo.oth.n_classes} kelas yang tidak dipantau`, tone: 'bad' },
    ],
    good: [
      `Hasilnya tetap bisa dipercaya untuk gambaran umum: saat dihitung ulang agar sesuai ukuran tiap program dan semester, angka utama paling jauh bergeser ${fmt(geserMax, 0)} poin.`,
      'Kelas yang dipantau dan yang tidak dipantau menjawab dengan pola yang sama tentang kepuasan, beban, deadline, dan konsistensi arahan.',
    ],
    bad: [
      `${m.response.kelas_nol} dari ${m.response.kelas_total} kelas tidak punya responden sama sekali, dan hanya ${m.response.kelas_min5} kelas punya 5 responden atau lebih.`,
      `Separuh responden (${pc(sib5.pct_responden)}) dari SIB Semester 5, padahal kelompok itu hanya ${pc(sib5.pct_populasi)} mahasiswa.`,
    ],
    closing: `Respons rendah membuat angka kurang tepat, tetapi arah temuannya tetap sama. Satu-satunya pembeda yang jelas adalah pemantauan di kelas: ${pc(mo.enf.rate)} melawan ${pc(mo.oth.rate)}.`,
    extra: table(
      ['Program dan semester', 'Responden', 'Jumlah mahasiswa', '% responden', '% mahasiswa'],
      komposisi.map((k) => [k.sel, String(k.n), String(k.roster), pc(k.pct_responden), pc(k.pct_populasi)]),
    ),
  }),
  {
    id: 'm-sebaran',
    title: 'Sebaran respons: banyak kelas tidak punya suara',
    src: `survei mahasiswa (${m.n} dari ${m.response.roster}); satu kotak mewakili satu kelas, nama kelas tidak ditampilkan`,
    render: () => `
      <div class="lv-grid">${responseGrid()}</div>
      <p class="lv-note">Satu kotak = satu kelas, berisi persen respons kelas itu. Garis tebal = kelas yang dipantau.</p>
      ${closing('Kelas yang dipantau hampir semuanya terisi. Kelas tanpa pemantauan sering kosong.')}`,
  },
  vote('respons', 'v-respons', `Kelas yang dipantau mengisi ${pc(mo.enf.rate)}, kelas yang tidak dipantau ${pc(mo.oth.rate)}.`),

  // 2. beban
  problem({
    id: 'm-beban',
    title: 'Masalah 2. Beban terasa berat terutama saat deadline bertabrakan',
    src: `survei mahasiswa (${m.n}) dan dosen (${l.n}). Poin pada skala 1 sampai 5`,
    stats: [
      { num: pp(p2.prevalensi), label: 'mahasiswa menilai beban berat', tone: 'bad' },
      { num: `${pc(beratTenggat.mean_ya * 100)} melawan ${pc(beratTenggat.mean_tidak * 100)}`, label: 'menilai beban berat: yang sering mengalami deadline bertabrakan, dan yang tidak', tone: 'bad' },
      { num: `-${fmt(Math.abs(PRI('beban').koef_terkontrol.b), 1)}`, label: 'poin kepuasan pada yang menilai beban berat, dibandingkan mahasiswa yang kondisinya sama dalam hal lain. Jelas berpengaruh', tone: 'bad' },
      { num: pc(l.workload_heavy_pct), label: 'dosen menilai beban berat', tone: 'good' },
    ],
    good: [
      `${pc(m.workload.items[1].pct)} mahasiswa menilai beban sudah sesuai.`,
      `TI Semester 3 paling ringan: ${pctSem(bySem(p2.per_semester, 'TI Sem 3'))} menilai berat.`,
    ],
    bad: [
      `SIB Semester 3 paling berat: ${pctSem(bySem(p2.per_semester, 'SIB Sem 3'))} menilai berat (hanya ${bySem(p2.per_semester, 'SIB Sem 3').n} responden, jadi angkanya kasar).`,
      `${pc(m.material[0].pct)} menyebut tugas di luar proyek menambah beban, tetapi yang menyebutnya tidak lebih sering merasa berat. Yang membedakan adalah deadline yang bertabrakan.`,
    ],
    closing: 'Dosen hanya melihat satu mata kuliah, sedangkan mahasiswa menanggung semuanya sekaligus. Yang membedakan adalah deadline yang menumpuk, bukan banyaknya tugas.',
  }),
  vote('beban', 'v-beban', `${pp(p2.prevalensi)} mahasiswa menilai beban berat, dan yang paling membedakan adalah deadline yang bertabrakan, bukan jumlah tugas.`),

  // 3. jadwal
  problem({
    id: 'm-jadwal',
    title: 'Masalah 3. Milestone PBL jatuh di minggu yang sama dengan kuis dan ujian mata kuliah lain',
    src: `jadwal dari koordinator PBL; wawancara mahasiswa (dipilih acak); survei mahasiswa (${m.n}) dan dosen (${l.n})`,
    extra: `<div class="lv-timeline">${[
      ['Minggu 4', 'Proposal', 'kuis 1'],
      ['Minggu 8', 'Milestone 1', 'UTS'],
      ['Minggu 12', 'Milestone 2', 'kuis 2'],
      ['Minggu 16', 'Milestone 3', 'UAS'],
    ]
      .map(([w, a, b]) => `<div class="lv-tl"><small>${w}</small><b>${a}</b><span>bersamaan dengan ${b}</span></div>`)
      .join('')}</div>
      <p class="lv-note">Kuis, UTS, dan UAS adalah mata kuliah non-PBL dan tanggalnya sudah tetap. Yang bisa digeser hanya milestone PBL.</p>`,
    stats: [
      { num: pp(p3.prevalensi), label: 'sering atau selalu mengalami deadline antar mata kuliah bertabrakan', tone: 'bad' },
      { num: pp(p3.jadwal_tidak_realistis), label: 'tidak setuju jadwal dan deadline milestone realistis', tone: 'bad' },
      { num: `${d1(lanjutJadwal.mean_ya)} melawan ${d1(lanjutJadwal.mean_tidak)}`, label: 'skor keinginan melanjutkan PBL (skala 1 sampai 5): yang menilai jadwal tidak realistis, dan yang tidak', tone: 'bad' },
      { num: `${d1(p3.dosen_jadwal_realistis.dosen)} melawan ${d1(p3.dosen_jadwal_realistis.mahasiswa)}`, label: 'skor jadwal realistis menurut dosen dan menurut mahasiswa', tone: 'bad' },
    ],
    good: [
      'Jumlah mata kuliah yang ikut PBL (empat atau tiga) tidak berpengaruh pada deadline bertabrakan.',
      'Mahasiswa yang tugasnya menyatu dengan proyek lebih jarang mengalami deadline bertabrakan.',
    ],
    bad: [
      `Belum ada cara bersama untuk menyamakan deadline tugas antar mata kuliah: ${dosenSelaras.tidak_pernah_atau_jarang} dari ${dosenSelaras.n} dosen jarang atau tidak pernah melakukannya, ${dosenSelaras.sering_atau_selalu} sering.`,
      'Survei tidak membedakan deadline yang bertabrakan dengan kuis dan ujian dari yang bertabrakan antar mata kuliah PBL. Wawancara mahasiswa menjelaskan sumbernya.',
    ],
    closing: 'Tanggal kuis dan ujian tidak bisa diubah, jadi solusinya ada di jadwal milestone: pindah minggu, beri tambahan waktu pengumpulan, atau kunci tanggal sejak awal.',
  }),
  vote('jadwal', 'v-jadwal', `${pp(p3.prevalensi)} mahasiswa sering mengalami deadline bertabrakan, dan ${pp(p3.jadwal_tidak_realistis)} menilai jadwal milestone tidak realistis. Kuis dan ujian sudah tetap, yang bisa digeser adalah milestone.`),

  // 4. kesesuaian tugas dengan proyek
  problem({
    id: 'm-selaras',
    title: 'Masalah 4. Separuh tugas mata kuliah belum menjadi bagian dari proyek, tetapi tidak terlihat kaitannya dengan beban',
    src: `survei mahasiswa (${m.n}) dan dosen (${l.n}), butir kesesuaian mata kuliah dengan proyek`,
    stats: [
      { num: pc(m.pooled.bc[3].ya), label: `mahasiswa menjawab tugas mata kuliah bagian dari proyek (dosen: ${pc(l.align[3].ya)})`, tone: 'bad' },
      { num: pc(pick(m.pooled.share, 'Tidak disampaikan').pct), label: 'jawaban: bobot nilai PBL tidak disampaikan', tone: 'bad' },
      { num: 'Tidak terlihat', label: 'kaitan porsi tugas bagian proyek dengan beban', tone: 'good' },
      { num: 'Tidak terlihat', label: 'kaitan porsi tugas bagian proyek dengan kepuasan', tone: 'good' },
    ],
    good: [
      `${pc(l.align[0].ya)} dosen menyatakan RPS sudah disesuaikan untuk mendukung PBL.`,
      `Mata kuliah PIC punya kegiatan PBL di kelas jauh lebih sering: ${pc(picKegiatan.pendukung + picKegiatan.selisih_poin)} melawan ${pc(picKegiatan.pendukung)} pada mata kuliah pendukung (selisih ${fmt(picKegiatan.selisih_poin, 0)} poin).`,
    ],
    bad: [
      `Hanya separuh jawaban mahasiswa (${pc(m.pooled.bc[3].ya)}) dan ${pc(l.align[3].ya)} jawaban dosen menyatakan tugas menjadi bagian proyek.`,
      `Mata kuliah PIC tidak lebih sering menjadikan tugasnya bagian proyek (selisih sekitar ${fmt(Math.abs(adaTugasPic.selisih_poin), 1)} poin, tidak berarti).`,
    ],
    closing: 'Di data ini kesesuaian tugas dengan proyek tidak menjelaskan beban atau kepuasan. Satu-satunya kaitannya adalah deadline yang lebih jarang bertabrakan. Pekerjaan ini bisa menunggu semester depan.',
  }),
  vote('selaras', 'v-selaras', `Separuh mahasiswa (${pc(m.pooled.bc[3].ya)}) menjawab tugas mata kuliah bagian dari proyek (dosen: ${pc(l.align[3].ya)}).`),

  // 5. koordinasi
  problem({
    id: 'm-koordinasi',
    title: 'Masalah 5. Arahan antar dosen berbeda-beda',
    src: `survei mahasiswa (${m.n}) dan dosen (${l.n}); komentar bebas mahasiswa bertema koordinasi (${th('koordinasi').n})`,
    stats: [
      { num: pp(p5.konsisten_ya), label: 'mahasiswa menilai arahan antar dosen konsisten', tone: 'bad' },
      { num: pc(l.coord_yn[2].ya), label: 'dosen punya kesepakatan peran', tone: 'bad' },
      { num: pc(l.coord_yn[3].ya), label: 'dosen menyatakan dosen rujukan utama tim jelas', tone: 'bad' },
      { num: pp(p5.tahu_hubungi_ya), label: 'mahasiswa tahu harus menghubungi dosen siapa', tone: 'good' },
    ],
    good: [
      `Informasi dari koordinator dinilai jelas dan tepat waktu (${d1(l.ops_extra[2].mean)} dari 5).`,
      `${pc(l.coord_yn[1].ya)} dosen mengenal dosen lain di kelas yang sama.`,
    ],
    bad: [
      `Paling rendah di SIB Semester 5 (${pc(bySem(p5.per_semester, 'SIB Sem 5').pct)} menilai konsisten), tertinggi di TI Semester 3 (${pc(bySem(p5.per_semester, 'TI Sem 3').pct)}).`,
      `Hambatan dosen: beban mengajar dan administrasi (${bar('Beban mengajar dan administrasi lain')} dari ${l.n}) dan tidak ada jadwal rapat rutin (${bar('Tidak ada jadwal rapat rutin')} dari ${l.n}). Hanya ${rapatSelalu} dari ${l.n} selalu hadir di rapat.`,
      `${wa('Membaca tetapi jarang menanggapi')} dari ${l.n} dosen membaca grup WhatsApp tetapi jarang menanggapi; hanya ${wa('Aktif menanggapi dan berbagi informasi')} yang aktif.`,
    ],
    closing: `Pengaruh arahan yang berbeda pada kepuasan belum pasti. Yang jelas berkaitan dengan kepuasan adalah tahu harus bertanya ke dosen siapa: yang tidak tahu kepuasannya lebih rendah ${poin(p5.puas_jika_tidak_tahu_hubungi.selisih)}.`,
  }),
  {
    id: 'm-pic',
    title: 'Dosen rujukan (PIC) sudah ada: pengampu mata kuliah inti di tiap kelas',
    src: `Sosialisasi PBL TI dan SIB (mata kuliah inti dan pendukung tiap semester); survei mahasiswa (${m.n}) dan dosen (${l.n})`,
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
    src: `survei mahasiswa (${m.n}) dan dosen (${l.n})`,
    stats: [
      { num: pp(p6.rubrik_jelas_setuju), label: 'setuju rubrik jelas', tone: 'bad' },
      { num: pp(p6.adil_setuju), label: 'setuju penilaian adil', tone: 'bad' },
      { num: 'Sangat kuat', label: 'hubungan rubrik jelas dengan penilaian adil: yang menilai rubrik jelas hampir selalu menilai penilaian adil', tone: 'good' },
      { num: pp(p6.kontribusi_timpang_dipilih), label: 'memilih kontribusi anggota tidak seimbang sebagai masalah', tone: 'bad' },
    ],
    good: [
      `SOP dan template adalah butir pelaksanaan dengan skor tertinggi (${pc(m.ops[1].pct_agree)} setuju).`,
      `Bimbingan dosen dinilai memadai oleh ${pc(m.ops[3].pct_agree)}.`,
    ],
    bad: [
      `Kontribusi tidak seimbang paling tinggi di TI Semester 3 (${pctSem(bySem(p6.per_semester_timpang, 'TI Sem 3'))}), melawan ${pctSem(bySem(p6.per_semester_timpang, 'SIB Sem 5'))} di SIB Semester 5.`,
      `Dosen menilai rubrik lebih jelas (${d1(p6.dosen.rubrik_jelas_rata)}) dan nilai lebih adil (${d1(p6.dosen.adil_rata)}) daripada mahasiswa (${d1(p6.dosen.mahasiswa_rubrik_rata)} dan ${d1(p6.dosen.mahasiswa_adil_rata)}).`,
    ],
    closing: 'Kejelasan rubrik paling kuat memengaruhi apakah penilaian dianggap adil, jauh di atas kontribusi tidak seimbang. Karena itu rubrik beserta contoh didahulukan daripada penilaian 360.',
  }),
  vote('nilai', 'v-nilai', `Hanya ${pp(p6.rubrik_jelas_setuju)} mahasiswa setuju rubrik jelas dan ${pp(p6.adil_setuju)} setuju penilaian adil.`),

  // 7. fasilitas
  problem({
    id: 'm-fasilitas',
    title: 'Masalah 7. Server untuk deployment wajib, dan mahasiswa membeli VPS sendiri',
    src: `survei mahasiswa (${m.n}); keterangan koordinator PBL; komentar bebas tentang fasilitas (${th('fasilitas').n}). Poin pada skala 1 sampai 5`,
    stats: [
      { num: pc(100 - m.ops[7].pct_agree), label: 'tidak setuju fasilitas dan sumber daya (server, data, perangkat) memadai', tone: 'bad' },
      { num: `-${fmt(Math.abs(PRI('fasilitas').koef_terkontrol.b), 1)}`, label: 'poin kepuasan pada yang menilai fasilitas kurang, dibandingkan mahasiswa yang kondisinya sama dalam hal lain. Jelas berpengaruh', tone: 'bad' },
      { num: `${d1(prodiFas('TI'))} dan ${d1(prodiFas('SIB'))}`, label: 'skor fasilitas TI dan SIB: sama rendah', tone: 'bad' },
      { num: 'Sama', label: `skor fasilitas semester dengan dan tanpa mata kuliah Penjaminan Mutu (${d1(pmpl.mean_ya)} dan ${d1(pmpl.mean_tidak)})`, tone: 'bad' },
    ],
    good: [
      'Kebutuhannya jelas: aplikasi web dan pengujian Penjaminan Mutu Perangkat Lunak (TI dan SIB Semester 5) mensyaratkan aplikasi yang sudah di-deploy.',
      `Dosen menilai fasilitas lebih tinggi (${d1(A.dosen.ops[7].mean)}) daripada mahasiswa (${d1(m.ops[7].mean)}).`,
    ],
    bad: [
      'Mahasiswa membeli VPS sendiri. Biaya per tim, siapa yang membayar, dan sejak milestone mana server dibutuhkan belum diketahui.',
      'Kebutuhan server dan perkiraan biayanya belum tertulis di SOP, jadi tim baru tahu setelah semester berjalan.',
    ],
    closing: 'Deployment wajib dan skor fasilitas sama rendah di semua semester, jadi biaya ini dialami semua program. Yang perlu diputuskan: siapa menyediakan, sejak kapan, dan berapa lama.',
  }),
  vote('fasilitas', 'v-fasilitas', `${pc(100 - m.ops[7].pct_agree)} mahasiswa tidak setuju fasilitas memadai, dan fasilitas adalah masalah yang paling jelas memengaruhi kepuasan.`),
  problem({
    id: 'm-konsultasi',
    title: 'Satu temuan yang mengubah usulan: konsultasi yang jarang tidak menurunkan kepuasan',
    src: `survei mahasiswa (${m.n}); butir konsultasi dan bimbingan dosen. Poin pada skala 1 sampai 5`,
    stats: [
      { num: pp(p7.belum_konsultasi), label: 'tim belum pernah berkonsultasi dengan dosen di luar jam kuliah', tone: 'bad' },
      { num: 'Sama saja', label: 'kepuasan tim yang belum berkonsultasi dibanding yang sudah: tidak terlihat bedanya', tone: 'good' },
      { num: `-${fmt(Math.abs(p7.bimbingan_memadai_jika_belum_konsultasi.selisih), 1)}`, label: 'poin penilaian bimbingan pada tim yang belum berkonsultasi', tone: 'bad' },
      { num: pc(cepat), label: 'mengatakan dosen menjawab dalam kurang dari sehari', tone: 'good' },
    ],
    good: ['Dosen cepat menanggapi pertanyaan mahasiswa.', 'Tim yang belum berkonsultasi tidak lebih rendah kepuasannya.'],
    bad: [`Tim yang belum berkonsultasi menilai bimbingan kurang memadai, dan ${pc(100 - m.ops[3].pct_agree)} mahasiswa tidak setuju bimbingan dosen memadai.`],
    closing: 'Karena itu konsultasi dengan jadwal tetap tidak dijadikan usulan utama. Yang berkaitan dengan kepuasan adalah penilaian bahwa bimbingan memadai.',
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
    src: 'jadwal dari koordinator PBL; survei mahasiswa; wawancara mahasiswa (dipilih acak)',
    render: () =>
      disc([
        {
          q: 'Ke minggu berapa tiap milestone dipindah?',
          known: 'Proposal (minggu 4), Milestone 1 (minggu 8), dan Milestone 2 (minggu 12) bersamaan dengan kuis 1, UTS, dan kuis 2 mata kuliah lain. Tanggal kuis dan ujian sudah tetap, jadi hanya milestone yang bisa bergeser.',
          unknown: 'Minggu baru untuk tiap milestone, dan apakah ada minggu yang bebas kuis di semua mata kuliah dalam satu semester.',
        },
        {
          q: 'Apakah Milestone 2 masih bisa dipindah atau diberi tambahan waktu pengumpulan semester ini?',
          known: `Milestone 2 jatuh di minggu yang sama dengan kuis 2, dan ${pp(p3.prevalensi)} mahasiswa sering mengalami deadline bertabrakan.`,
          unknown: 'Apakah tim dan penilai masih bisa menyesuaikan.',
        },
        {
          q: 'Apakah Milestone 3 tetap di minggu UAS atau dipindah ke minggu sebelum atau sesudahnya?',
          known: 'Menurut jadwal sekarang keduanya di minggu 16, dan tanggal UAS sudah tetap.',
          unknown: 'Minggu yang cocok untuk Milestone 3, dan dampaknya pada waktu penilaian akhir.',
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
          q: 'Siapa yang menyediakan lingkungan deployment dan uji, dan sejak tahap mana?',
          known: `Aplikasi web wajib di-deploy dan pengujian Penjaminan Mutu mensyaratkan aplikasi sudah di-deploy. Mahasiswa membeli VPS sendiri. ${pc(100 - m.ops[7].pct_agree)} tidak setuju fasilitas memadai.`,
          unknown: 'Biaya per tim, siapa yang membayar, dan sejak milestone mana server dibutuhkan untuk pengujian.',
        },
        {
          q: 'Apakah PIC tiap kelas sudah diberi tahu perannya?',
          known: `PIC adalah pengampu mata kuliah inti. Baru ${pc(l.coord_yn[3].ya)} dosen menyatakan dosen rujukan utama tim jelas.`,
          unknown: 'Belum dipastikan apakah PIC sudah diberi tahu.',
        },
        {
          q: 'Bagaimana pengumuman milestone PIC dan formulir awal semester dijalankan?',
          known: `${wa('Membaca tetapi jarang menanggapi')} dari ${l.n} dosen membaca grup WhatsApp tetapi jarang menanggapi, jadi PIC mengumumkan rencana dan dosen membalas hanya bila ada deadline yang bertabrakan; deadline tugas dikumpulkan sekali lewat formulir.`,
          unknown: 'Grup mana yang dipakai, berapa hari sebelum milestone pengumuman dikirim, apa yang dilakukan PIC bila kabar deadline bertabrakan datang terlambat, dan siapa yang menyiapkan formulir.',
        },
        {
          q: 'Apakah peran PIC diakui secara resmi, misalnya di juknis atau dalam beban kerja dosen?',
          known: `Beban mengajar dan administrasi adalah hambatan koordinasi yang paling banyak disebut dosen (${bar('Beban mengajar dan administrasi lain')} dari ${l.n}).`,
          unknown: 'Apakah pengakuan seperti itu dimungkinkan menurut aturan Jurusan.',
        },
        {
          q: 'Data apa yang perlu dikumpulkan sebelum keputusan diambil?',
          known: 'Survei lanjutan singkat tentang server dan biaya sudah dirancang (10 pertanyaan). Wawancara dilakukan pada mahasiswa yang dipilih acak.',
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
    src: `analisis survei mahasiswa (${m.n} responden)`,
    render: () => {
      const keys: [string, string][] = [
        ['Beban berat', 'Beban berat'],
        ['Tenggat antar mata kuliah', 'Deadline antar mata kuliah sering bertabrakan'],
        ['Tidak setuju jadwal', 'Tidak setuju jadwal milestone realistis'],
        ['Setuju fasilitas', 'Setuju fasilitas memadai'],
        ['Setuju rubrik', 'Setuju rubrik jelas'],
        ['Setuju penilaian adil', 'Setuju penilaian adil'],
        ['Arahan dosen antar mata kuliah', 'Menilai arahan dosen konsisten'],
      ]
      const rows = keys.map(([k, lab]) => ({ lab, t: target(k) })).filter((r) => r.t)
      const mdds = rows.map((r: any) => r.t.selisih_terkecil_terbukti_poin)
      const n10 = Math.round((2.8 ** 2 * 2 * 0.4 * 0.6) / 0.01 / 25) * 25
      const n70 = Math.round(0.7 * m.response.roster)
      return `${table(
        ['Ukuran', 'Sekarang', 'Target'],
        rows.map((r: any) => [esc(r.lab), pc(r.t.persen), `${r.t.arah === 'turun' ? 'di bawah' : 'di atas'} ${pc(r.t.target_persen)}`]),
      )}
      ${closing(`Targetnya hanya sedikit di atas atau di bawah angka sekarang. Dengan responden sebanyak ini, perubahan di bawah sekitar ${fmt(Math.max(...mdds), 0)} poin belum bisa dibedakan dari kebetulan. Melihat perubahan 10 poin butuh sekitar ${n10} responden, dan respons 70% (sekitar ${n70} mahasiswa) cukup untuk perubahan sekitar 8 poin. Karena itu Masalah 1 harus beres lebih dulu.`)}`
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
    src: `analisis survei monev PBL; mahasiswa ${m.n} dari ${m.response.roster}, dosen ${l.n} dari ${l.roster}`,
    render: () => `<div class="lv-bb">
      <div class="lv-panel is-good"><h3>Cara membaca</h3>${li([
        '<b>Jelas berpengaruh</b>: perbedaannya terlalu besar untuk dianggap kebetulan. Secara teknis, rentang kemungkinan nilai sebenarnya (selang kepercayaan 95%) tidak mencakup nol.',
        '<b>Ada tanda, belum pasti</b>: tampak berpengaruh, tetapi rentang kemungkinannya masih mencakup nol.',
        '<b>Tidak terlihat kaitannya</b>: hubungannya mendekati nol.',
        '"Dibandingkan dengan mahasiswa yang kondisinya sama dalam hal lain" berarti perhitungan regresi yang memperhitungkan semua faktor bersamaan. Skor 1 sampai 5 diperlakukan sebagai angka biasa, jadi ini pendekatan.',
        'Angka dihitung ulang agar sesuai ukuran tiap program dan semester, untuk memeriksa apakah asal responden menggeser hasil.',
      ])}</div>
      <div class="lv-panel is-bad"><h3>Keterbatasan</h3>${li([
        'Survei dilakukan satu kali dan berisi jawaban diri sendiri, jadi yang ditemukan adalah kaitan. Sebab-akibat belum terbukti.',
        `Respons ${pc(m.response.rate)}: ketepatan terbatas, dan perbedaan antara yang mengisi dan tidak mengisi tidak bisa diuji.`,
        `Dosen hanya ${l.n} orang; perubahan kecil tidak bisa dibuktikan, jadi baca angka mentahnya.`,
        'Wawancara dilakukan pada mahasiswa yang dipilih acak, jumlahnya tidak tercatat; dipakai sebagai keterangan pendukung.',
      ])}</div></div>`,
  },
  {
    id: 'a-pendorong',
    title: 'Pendorong kepuasan dan keinginan melanjutkan',
    appendix: true,
    src: `regresi pada ${AN.umum.model_pendorong.puas.n} mahasiswa (kepuasan, R² = ${fmt(AN.umum.model_pendorong.puas.r2, 2)}; kemampuan model menjelaskan variasi jawaban) dan ${AN.umum.model_pendorong.lanjut.n} (melanjutkan, R² = ${fmt(AN.umum.model_pendorong.lanjut.r2, 2)}); b = poin skor per kenaikan satu poin`,
    render: () => {
      const pu: any[] = AN.umum.model_pendorong.puas.koef
      const la: any[] = AN.umum.model_pendorong.lanjut.koef
      const rows = [...pu].sort((a, b) => Math.abs(b.beta) - Math.abs(a.beta)).slice(0, 8)
      return `${table(
        ['Faktor', 'Kepuasan: b [rentang]', 'Melanjutkan: b [rentang]'],
        rows.map((r) => {
          const o = la.find((x) => x.nama === r.nama)
          return [esc(r.nama), effCell(r.b, r.b_ci), effCell(o.b, o.b_ci)]
        }),
      )}<p class="lv-note">Tebal: rentang tidak mencakup nol. Faktor yang saling berkaitan berbagi pengaruh dalam model.</p>`
    },
  },
  {
    id: 'a-masalah-mhs',
    title: 'Semua masalah yang dipilih mahasiswa',
    appendix: true,
    src: `survei mahasiswa (${m.n}); persentase dihitung dari ${m.n} mahasiswa`,
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
    src: `survei dosen (${l.n}); jumlah dosen`,
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
    src: `survei dosen (${l.n}); jumlah dosen`,
    render: () => `${bars(l.support.map((x: any) => [x.label, x.count, 'good']), { max: 12, unit: 'n', lw: 620, size: 26 })}
      ${closing('Dasar pilihan solusi: yang diminta dosen dibandingkan dengan hambatan yang mereka sebut.')}`,
  },
  {
    id: 'a-butir',
    title: 'Semua butir penilaian: mahasiswa dan dosen',
    appendix: true,
    src: `butir yang sama pada survei mahasiswa (${m.n}) dan dosen (${l.n}); diurutkan dari persetujuan mahasiswa terendah`,
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
