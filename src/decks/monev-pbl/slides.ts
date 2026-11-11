// Monev PBL slides. Every number comes from src/data/monev-pbl/*.json (sanitized aggregates of the
// survey report), so the deck cannot drift from the report. Each problem slide is followed by a poll
// slide where lecturers pick a solution or write their own under "Lainnya".
import agregat from '../../data/monev-pbl/agregat.json'
import temaJson from '../../data/monev-pbl/tema.json'
import temaDosenJson from '../../data/monev-pbl/tema_dosen.json'
import { esc, fmt, pc, pick, sgn } from '../../lib/live/format'
import { withBase } from '../../lib/paths'
import type { Results, Slide, SlideCtx } from '../../lib/live/types'
import { questions } from './questions'

const D: any = agregat
const tema: any = temaJson
const temaDosen: any = temaDosenJson
const A = D.all
const m = A.mhs
const l = A.dosen
const mo = m.monitored
const dr = m.drivers
const th = (k: string) => tema.themes.find((t: any) => t.key === k)
const us = (lab: string) => tema.usulan.find((x: any) => x.label === lab)?.n ?? 0
const cross = (f: string) => dr.cross.find((c: any) => c.factor === f)
const grp = (c: any, lab: string) => c.groups.find((x: any) => x.label === lab)
const cepat = m.consult_resp.items.find((i: any) => i.label === 'Kurang dari 1 hari').pct
const beban = cross('Beban PBL dibanding waktu tersedia')
const imp = (lab: string) => pick(m.improve, lab)
const Q = (k: string) => questions.find((q) => q.key === k)!

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

function problem(o: { id: string; title: string; stats: Stat[]; good: string[]; bad: string[]; closing: string; src: string }): Slide {
  return {
    id: o.id,
    title: o.title,
    src: o.src,
    render: () => `<div class="lv-stats">${o.stats.map(stat).join('')}</div>${bb(o.good, o.bad)}${closing(o.closing)}`,
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

function responseGrid() {
  const classes: any[] = m.response.classes
  const monitored: string[] = mo.classes
  const tile = (c: any) => {
    const cls = c.n === 0 ? 'zero' : c.rate < 30 ? 'low' : c.rate < 70 ? 'mid' : 'hi'
    return `<div class="lv-tile is-${cls} ${monitored.includes(c.label) ? 'is-mon' : ''}"><b>${esc(c.label)}</b><span>${pc(c.rate)}</span><small>${c.n} dari ${c.roster}</small></div>`
  }
  return m.response.sems
    .map((sm: any) => {
      const cs = classes.filter((c) => `${c.prodi} Semester ${c.sem}` === sm.label)
      return `<div class="lv-semrow"><div class="lv-semlab"><b>${esc(sm.label)}</b><small>${sm.n} dari ${sm.roster} · ${pc(sm.rate, 1)}</small></div><div class="lv-tiles">${cs.map(tile).join('')}</div></div>`
    })
    .join('')
}

const nolKelas = m.response.classes.filter((c: any) => c.n === 0).length
const lulusKelas = m.response.classes.filter((c: any) => c.rate >= 70).length
const bar = (lab: string) => pick(l.barriers, lab).count

// ------------------------------------------------------------------ main slides
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
          <p class="lv-how">Ada tujuh masalah. Untuk tiap masalah, Bapak/Ibu memilih solusi lewat ponsel, atau menulis usulan sendiri di kolom Lainnya.</p>
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
    id: 'peta',
    title: 'Tujuh masalah yang dibahas hari ini',
    src: `survei mahasiswa (n = ${m.n}) dan dosen (n = ${l.n}); wawancara langsung dengan mahasiswa untuk masalah jadwal`,
    render: () => `
      <div class="lv-stats">
        ${stat({ num: pc(m.response.rate), label: '1. Respons: mahasiswa yang mengisi survei (target 70%)', tone: 'bad' })}
        ${stat({ num: pc(m.workload_heavy_pct), label: '2. Beban: mahasiswa yang menilai PBL berat', tone: 'bad' })}
        ${stat({ num: pc(m.coord[3].pct_oa), label: '3. Jadwal: sering atau selalu mengalami tenggat bertabrakan', tone: 'bad' })}
        ${stat({ num: pc(m.pooled.bc[3].ya), label: '4. Keselarasan: menjawab tugas mata kuliah bagian dari proyek', tone: 'bad' })}
      </div>
      <div class="lv-stats">
        ${stat({ num: pc(m.coord[1].ya), label: '5. Koordinasi: menilai arahan antar dosen konsisten', tone: 'bad' })}
        ${stat({ num: pc(m.ops[6].pct_agree), label: '6. Penilaian: setuju penilaian adil', tone: 'bad' })}
        ${stat({ num: fmt(m.ops[7].mean, 2), label: '7. Fasilitas: skor dari 5, yang terendah', tone: 'bad' })}
      </div>
      ${closing('Setiap masalah diikuti satu pemungutan suara. Pilihan solusi disertai data survei yang mendukung atau menyulitkannya.')}`,
  },

  // 1. respons
  {
    id: 'm-respons',
    title: `Masalah 1. Hanya ${pc(m.response.rate)} mahasiswa mengisi survei`,
    src: `survei mahasiswa (n = ${m.n} dari ${m.response.roster}) dan dosen (n = ${l.n} dari ${l.roster}); target respons 70%`,
    render: () => `
      <div class="lv-stats">
        ${stat({ num: pc(l.rate, 1), label: `dosen mengisi (${l.n} dari ${l.roster})`, tone: 'good' })}
        ${stat({ num: pc(mo.enf.rate, 1), label: `respons di ${mo.enf.n_classes} kelas yang dipantau`, tone: 'good' })}
        ${stat({ num: pc(m.response.rate, 1), label: `respons mahasiswa (${m.n} dari ${m.response.roster})`, tone: 'bad' })}
        ${stat({ num: pc(mo.oth.rate, 1), label: `respons di ${mo.oth.n_classes} kelas yang tidak dipantau`, tone: 'bad' })}
      </div>
      <div class="lv-grid">${responseGrid()}</div>
      <p class="lv-note">Abu-abu: tidak ada responden. Muda: di bawah 30%. Sedang: 30 sampai 69%. Tua: 70% atau lebih. Garis tebal: kelas yang dipantau langsung.</p>
      ${closing(`${nolKelas} dari ${m.response.classes.length} kelas tidak punya responden, dan hanya ${lulusKelas} kelas melewati target. Skor pelaksanaan di kelas yang dipantau dan yang tidak hampir sama (${fmt(mo.enf.stats.ops_mean, 2)} dan ${fmt(mo.oth.stats.ops_mean, 2)}), jadi bedanya ada pada pemantauan, bukan pada jawaban. Hasil kelas yang sedikit respondennya baru gambaran awal.`)}`,
  },
  vote('respons', 'v-respons', `Kelas yang dipantau mengisi ${pc(mo.enf.rate)}, kelas yang tidak dipantau ${pc(mo.oth.rate)}.`),

  // 2. beban
  problem({
    id: 'm-beban',
    title: 'Masalah 2. Tugas di luar proyek membuat PBL terasa berat',
    src: `survei mahasiswa (n = ${m.n}) dan dosen (n = ${l.n}); komentar bebas tema beban (${th('beban').n})`,
    stats: [
      { num: pc(m.workload_heavy_pct), label: 'mahasiswa menilai beban berat', tone: 'bad' },
      { num: pc(m.material[0].pct), label: 'menyebut tugas mata kuliah menambah beban di luar proyek', tone: 'bad' },
      { num: fmt(grp(beban, 'Berat atau sangat berat').puas, 2), label: `kepuasan mahasiswa yang merasa berat (yang tidak: ${fmt(grp(beban, 'Ringan atau sesuai').puas, 2)})`, tone: 'bad' },
      { num: pc(l.workload_heavy_pct), label: 'dosen menilai beban berat', tone: 'good' },
    ],
    good: [
      `${pc(m.workload.items[1].pct)} mahasiswa menilai beban sudah sesuai.`,
      `TI Semester 3 paling ringan: ${pc(m.sem_stats[0].berat)} menilai berat.`,
    ],
    bad: [
      `Paling berat di SIB Semester 3 (${pc(m.sem_stats[2].berat)}) dan TI Semester 5 (${pc(m.sem_stats[1].berat)}).`,
      `${th('beban').subs[0].n} komentar menyebut tugas praktikum, jobsheet, atau tugas besar yang terpisah dari PBL.`,
    ],
    closing: 'Dosen hanya melihat satu mata kuliah, sedangkan mahasiswa menanggung semua tugas sekaligus.',
  }),
  vote('beban', 'v-beban', `${pc(m.workload_heavy_pct)} mahasiswa menilai beban berat, dan ${pc(m.material[0].pct)} menyebut tugas mata kuliah sebagai penyebabnya.`),

  // 3. jadwal (new, from the student interviews)
  problem({
    id: 'm-jadwal',
    title: 'Masalah 3. Tenggat milestone berdekatan dengan kuis, UTS, dan UAS',
    src: `wawancara langsung dengan mahasiswa; survei mahasiswa (n = ${m.n}), butir tenggat dan pilihan masalah; komentar bebas (${tema.substantive})`,
    stats: [
      { num: 'Wawancara', label: 'mahasiswa mengeluh milestone berdekatan dengan kuis, UTS, dan UAS', tone: 'bad' },
      { num: pc(m.coord[3].pct_oa), label: 'sering atau selalu mengalami tenggat antar mata kuliah bertabrakan (survei)', tone: 'bad' },
      { num: pc(imp('Waktu dan beban kerja').pct), label: 'memilih waktu dan beban kerja sebagai masalah, pilihan terbanyak', tone: 'bad' },
      { num: pc(m.workload.items[1].pct), label: 'menilai beban sudah sesuai', tone: 'good' },
    ],
    good: [
      `Lebih dari separuh mahasiswa (${pc(m.workload.items[1].pct)}) menilai beban sudah sesuai.`,
      `Dosen sudah tahu topik proyek tiap tim (${pc(l.coord_yn[0].ya)}), jadi jadwal bisa disusun dari data yang ada.`,
    ],
    bad: [
      `${us('Perpanjang waktu atau durasi PBL')} komentar mahasiswa meminta waktu atau durasi PBL diperpanjang.`,
      `Survei tidak menanyakan jadwal kuis dan ujian. Keluhan ini datang dari wawancara, dan angka tenggat bertabrakan sejalan dengannya.`,
    ],
    closing: 'Beban terasa berat ketika tenggat milestone, kuis, dan ujian jatuh di pekan yang sama.',
  }),
  vote('jadwal', 'v-jadwal', `${pc(m.coord[3].pct_oa)} mahasiswa sering atau selalu mengalami tenggat bertabrakan, dan dalam wawancara mereka menyebut kuis, UTS, dan UAS.`),

  // 4. keselarasan
  problem({
    id: 'm-selaras',
    title: 'Masalah 4. Tugas mata kuliah belum menjadi bagian dari proyek',
    src: `survei mahasiswa (n = ${m.n}) dan dosen (n = ${l.n}), butir keselarasan mata kuliah`,
    stats: [
      { num: pc(m.pooled.bc[3].ya), label: `menjawab tugas mata kuliah bagian dari proyek (dosen: ${pc(l.align[3].ya)})`, tone: 'bad' },
      { num: pc(pick(m.pooled.type, 'Latihan umum').pct), label: 'tugas utama berupa latihan umum di luar proyek', tone: 'bad' },
      { num: pc(pick(m.pooled.share, 'Tidak disampaikan').pct), label: 'jawaban: bobot nilai PBL tidak disampaikan', tone: 'bad' },
      { num: pc(m.pooled.bc[0].ya), label: 'menjawab kontrak kuliah memuat kaitan dengan proyek', tone: 'good' },
    ],
    good: [
      `${pc(m.pooled.bc[8].ya)} menjawab dosen tahu topik proyek tim.`,
      `${pc(pick(m.pooled.type, 'Deliverable proyek').pct)} tugas utama berupa hasil kerja proyek.`,
    ],
    bad: [
      `Hanya ${pc(m.pooled.bc[3].ya)} menjawab tugas mata kuliah bagian dari proyek.`,
      `Bobot nilai PBL tidak disampaikan pada ${pc(pick(m.pooled.share, 'Tidak disampaikan').pct)} jawaban.`,
    ],
    closing: 'Dokumennya sudah mengarah ke proyek, tetapi tugasnya belum. Tugas yang terpisah dari proyek memicu keluhan beban.',
  }),
  vote('selaras', 'v-selaras', `Hanya ${pc(m.pooled.bc[3].ya)} mahasiswa menjawab tugas mata kuliah bagian dari proyek (dosen: ${pc(l.align[3].ya)}).`),

  // 5. koordinasi
  problem({
    id: 'm-koordinasi',
    title: 'Masalah 5. Arahan antar dosen berbeda-beda',
    src: `survei mahasiswa (n = ${m.n}) dan dosen (n = ${l.n}); komentar bebas tema koordinasi (${th('koordinasi').n})`,
    stats: [
      { num: pc(m.coord[1].ya), label: 'mahasiswa menilai arahan antar dosen konsisten', tone: 'bad' },
      { num: pc(l.coord_yn[2].ya), label: 'dosen punya kesepakatan peran', tone: 'bad' },
      { num: `${l.meeting.items[0].count} dari ${l.n}`, label: 'dosen selalu hadir di rapat', tone: 'bad' },
      { num: pc(l.coord_yn[0].ya), label: 'dosen tahu topik proyek tiap tim', tone: 'good' },
    ],
    good: [
      `Informasi dari koordinator dinilai jelas dan tepat waktu (${fmt(l.ops_extra[2].mean, 2)} dari 5).`,
      `${pc(m.coord[2].ya)} mahasiswa tahu harus bertanya ke dosen siapa.`,
    ],
    bad: [
      `${th('koordinasi').n} komentar mahasiswa membahas arahan yang berbeda antar dosen.`,
      `Hambatan dosen: beban mengajar dan administrasi (${bar('Beban mengajar dan administrasi lain')} dari ${l.n}) dan tidak ada jadwal rapat (${bar('Tidak ada jadwal rapat rutin')}).`,
    ],
    closing: 'Mahasiswa dan dosen melihat masalah yang sama. Penyebabnya ada pada cara kerja: belum ada jadwal rapat dan pembagian peran.',
  }),
  vote('koordinasi', 'v-koordinasi', `Hanya ${pc(m.coord[1].ya)} mahasiswa menilai arahan dosen konsisten, dan hambatan utama dosen adalah beban mengajar dan administrasi.`),

  // 6. penilaian
  problem({
    id: 'm-nilai',
    title: 'Masalah 6. Rubrik dan penilaian belum dianggap adil',
    src: `survei mahasiswa (n = ${m.n}) dan dosen (n = ${l.n}); komentar bebas tema tim dan nilai`,
    stats: [
      { num: pc(m.ops[5].pct_agree), label: 'setuju rubrik jelas', tone: 'bad' },
      { num: pc(m.ops[6].pct_agree), label: 'setuju penilaian adil', tone: 'bad' },
      { num: pc(imp('Kontribusi anggota tim tidak seimbang').pct), label: 'memilih kontribusi anggota tidak seimbang sebagai masalah', tone: 'bad' },
      { num: pc(m.ops[1].pct_agree), label: 'menilai SOP dan template membantu', tone: 'good' },
    ],
    good: [
      `SOP dan template adalah butir pelaksanaan dengan skor tertinggi (${pc(m.ops[1].pct_agree)}).`,
      `Bimbingan dosen dinilai memadai oleh ${pc(m.ops[3].pct_agree)}.`,
    ],
    bad: [
      `Rubrik jelas dan penilaian adil sangat berkaitan dengan kepuasan (r = ${fmt(dr.corr[1].r_puas, 2)} dan ${fmt(dr.corr[2].r_puas, 2)}).`,
      'Kontribusi tiap anggota tidak bisa dibuktikan dari laporan.',
    ],
    closing: 'Selama mahasiswa belum merasa nilainya adil, kepuasan mereka terhadap PBL ikut turun.',
  }),
  vote('nilai', 'v-nilai', `Hanya ${pc(m.ops[5].pct_agree)} mahasiswa setuju rubrik jelas dan ${pc(m.ops[6].pct_agree)} setuju penilaian adil.`),

  // 7. fasilitas
  problem({
    id: 'm-fasilitas',
    title: 'Masalah 7. Bimbingan cepat, tetapi sebagian tim belum dibimbing dan fasilitas lemah',
    src: `survei mahasiswa (n = ${m.n}); komentar bebas tema fasilitas (${th('fasilitas').n}) dan bimbingan (${th('bimbingan').n})`,
    stats: [
      { num: fmt(m.ops[7].mean, 2), label: `skor fasilitas, terendah; hubungannya dengan kepuasan paling kuat (r = ${fmt(dr.corr[0].r_puas, 2)})`, tone: 'bad' },
      { num: pc(m.consult_freq.items[0].pct), label: 'tim belum pernah berkonsultasi', tone: 'bad' },
      { num: pc(pick(m.material, 'Materi terlambat dibanding kebutuhan milestone').pct), label: 'menyebut materi terlambat', tone: 'bad' },
      { num: pc(cepat), label: 'mengatakan dosen menjawab dalam kurang dari sehari', tone: 'good' },
    ],
    good: [
      `Konsultasi biasanya dimulai oleh mahasiswa maupun dosen (${pc(pick(m.consult_init.items, 'Keduanya').pct)}).`,
      'Dosen cepat menanggapi pertanyaan mahasiswa.',
    ],
    bad: [
      `${th('bimbingan').subs[0].n} komentar menyebut sulit mendapat waktu bimbingan.`,
      `Semua komentar fasilitas (${th('fasilitas').n}) dari SIB, soal server dan jaringan.`,
    ],
    closing: 'Dosen cepat menanggapi, tetapi sebagian tim belum dibimbing. Soal fasilitas perlu keputusan di luar kelas.',
  }),
  vote('fasilitas', 'v-fasilitas', `Fasilitas bernilai terendah (${fmt(m.ops[7].mean, 2)} dari 5), dan ${pc(m.consult_freq.items[0].pct)} tim belum pernah berkonsultasi.`),

  // closing polls
  vote('prioritas', 'v-prioritas', 'Tidak semua masalah bisa dikerjakan sekaligus. Pilih dua yang paling perlu didahulukan.'),
  {
    id: 'v-komitmen',
    title: 'Kesediaan Bapak/Ibu dosen',
    question: 'komitmen',
    render: (c) => `
      <div class="lv-votegrid">
        <div>
          <p class="lv-recapline">Sebagian solusi hanya berjalan kalau dosen pengampu ikut. Baru ${pc(l.coord_yn[3].ya)} dosen yang menyatakan dosen rujukan utama tim sudah jelas.</p>
          <div class="lv-opts" data-q="komitmen"></div>
        </div>
        ${joinPanel(c, 'Pilih yang bersedia di ponsel Anda')}
      </div>`,
  },
  {
    id: 'v-saran',
    title: 'Saran dan usulan lain dari Bapak/Ibu',
    question: 'saran',
    render: (c) => `
      <div class="lv-votegrid">
        <div>
          <p class="lv-recapline">Ada masalah atau solusi yang belum disebut? Tuliskan di ponsel Anda. Saran dikirim tanpa nama.</p>
          <div class="lv-sug-list" data-suggestions></div>
        </div>
        ${joinPanel(c, 'Tulis saran di ponsel Anda')}
      </div>`,
  },
  {
    id: 'rekap',
    title: 'Solusi yang dipilih Bapak/Ibu',
    recap: true,
    render: () => `<div class="lv-recap" data-recap><p class="lv-note">Memuat hasil…</p></div>
      ${closing('Solusi dengan suara terbanyak masuk rencana tindak lanjut. Usulan di kolom Lainnya dibahas bersama sebelum jadwalnya ditetapkan.')}`,
  },
]

// ------------------------------------------------------------------ appendix
const masalahKecil = (lab: string) => ['Tidak ada masalah berarti', 'Tidak ada kendala'].includes(lab)

const appendix: Slide[] = [
  {
    id: 'a-divider',
    title: 'Lampiran: data lengkap',
    appendix: true,
    render: () => `<p class="lv-recapline">Slide berikut adalah cadangan untuk menjawab pertanyaan. Semua pilihan ditampilkan tanpa disaring.</p>`,
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
