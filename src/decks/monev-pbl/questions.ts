// Polls for the Monev PBL deck. Each option names who does the work and quotes the survey, including what
// makes the option hard (lecturer workload, preparation time, weak coordination). Every class already has a
// PIC, the lecturer of the core course (see pic.ts), so coordination work goes to the PIC and supporting
// lecturers only send a date or confirm a note. Every number comes from src/data/monev-pbl/*.json.
import agregat from '../../data/monev-pbl/agregat.json'
import temaJson from '../../data/monev-pbl/tema.json'
import { pc, pick } from '../../lib/live/format'
import type { Question } from '../../lib/live/types'

const A: any = (agregat as any).all
const m = A.mhs
const l = A.dosen
const mo = m.monitored
const tema: any = temaJson
const us = (lab: string) => tema.usulan.find((x: any) => x.label === lab)?.n ?? 0

const sup = (lab: string) => pc(pick(l.support, lab).pct)
const bar = (lab: string) => pc(pick(l.barriers, lab).pct)
const mb = (lab: string) => pc(pick(l.material_barriers, lab).pct)

const bebanDosen = bar('Beban mengajar dan administrasi lain')
const waktuSiapDosen = mb('Waktu persiapan terbatas')
const sepakatPeran = pc(l.coord_yn[2].ya)
const rujukanJelas = pc(l.coord_yn[3].ya)

export const questions: Question[] = [
  {
    key: 'respons',
    kind: 'multi',
    max: 2,
    other: true,
    area: 'Respons survei',
    prompt: 'Solusi mana yang paling perlu agar lebih banyak mahasiswa mengisi survei?',
    options: [
      { key: 'sesi', label: 'Satu sesi pengisian 10 menit di kelas lewat kode QR, dipandu PIC kelas', note: `Kelas yang dipantau mengisi ${pc(mo.enf.rate)} dan kelas lain ${pc(mo.oth.rate)}. PIC sudah ada di tiap kelas, jadi tidak perlu dosen tambahan` },
      { key: 'pantau', label: 'PIC memantau pengisian di kelasnya dan melapor ke koordinator PBL', note: 'Cara yang sama dengan kelas yang dipantau semester ini' },
      { key: 'singkat', label: 'Formulir mahasiswa dipersingkat', note: 'Pertanyaan inti saja. Pengaruhnya pada respons belum diukur' },
      { key: 'pengingat', label: 'Pengingat berkala di grup kelas', note: `Murah, tetapi kelas tanpa pemantauan hanya mengisi ${pc(mo.oth.rate)}` },
    ],
  },
  {
    key: 'beban',
    kind: 'multi',
    max: 2,
    other: true,
    area: 'Beban tugas',
    prompt: 'Solusi mana yang paling perlu untuk mengurangi beban tugas mahasiswa?',
    options: [
      { key: 'pekan', label: 'Tidak ada tugas baru di luar proyek selama pekan Milestone 2', note: `${pc(m.material[0].pct)} mahasiswa menyebut tugas mata kuliah menambah beban di luar proyek` },
      { key: 'konsul', label: 'Tugas baru di luar proyek dikonsultasikan ke PIC dulu', note: 'PIC sudah mengenal beban proyek tim. Cara ini menambah satu langkah bagi dosen mata kuliah pendukung' },
      { key: 'batas', label: 'Batas jumlah tugas di luar proyek per pekan, daftarnya dipegang PIC', note: 'Angka batasnya ditentukan bersama dosen pengampu' },
      { key: 'gabung', label: 'Tugas praktikum dan jobsheet digabung ke hasil kerja proyek', note: `Dosen perlu waktu menyiapkannya, dan ${waktuSiapDosen} dosen menyebut waktu persiapan terbatas` },
    ],
  },
  {
    key: 'jadwal',
    kind: 'multi',
    max: 2,
    other: true,
    area: 'Jadwal milestone',
    prompt: 'Solusi mana yang paling perlu agar tenggat milestone tidak menumpuk dengan kuis, UTS, dan UAS?',
    options: [
      { key: 'kalender', label: 'PIC menyusun kalender milestone di awal semester, dari jadwal kuis, UTS, dan UAS semua mata kuliah di kelasnya', note: `${mb('Kurang informasi tentang kebutuhan setiap milestone')} dosen menyebut kurang informasi tentang kebutuhan tiap milestone. Cara ini menambah pekerjaan PIC` },
      { key: 'kirim', label: 'Dosen mata kuliah pendukung menyampaikan jadwal kuis ke PIC, dan tidak ada kuis di pekan tenggat milestone', note: `Hanya ${sepakatPeran} dosen punya kesepakatan peran. PIC menjadi satu pintu jadwal, dosen lain cukup mengirim tanggal` },
      { key: 'tenang', label: 'Tidak ada tenggat milestone di pekan UTS dan UAS', note: 'Jadwal milestone perlu digeser, tanpa menambah tugas' },
      { key: 'bertahap', label: 'Tenggat milestone dipecah menjadi tahap yang lebih kecil', note: `Tahap kecil menambah titik penilaian, sedangkan ${bebanDosen} dosen terkendala beban mengajar` },
    ],
  },
  {
    key: 'selaras',
    kind: 'multi',
    max: 2,
    other: true,
    area: 'Keselarasan tugas',
    prompt: 'Solusi mana yang paling perlu agar tugas mata kuliah sejalan dengan proyek?',
    options: [
      { key: 'peta', label: 'PIC menyusun peta keterkaitan mata kuliah dan milestone, dosen mata kuliah pendukung melengkapi bagiannya', note: `Hanya ${pc(m.pooled.bc[3].ya)} mahasiswa menjawab tugas mata kuliah bagian dari proyek. Dosen pendukung hanya mengisi bagiannya` },
      { key: 'rubrik', label: 'Rubrik berbasis PBL beserta contoh, disusun PIC bersama dosen mata kuliah pendukung', note: `${sup('Panduan dan contoh penilaian')} dosen meminta panduan dan contoh penilaian` },
      { key: 'bobot', label: 'Bobot PBL minimal 51% di RPS semua mata kuliah', note: `Batas IKU 7. ${mb('Capaian pembelajaran atau RPS sulit disesuaikan')} dosen menilai RPS sulit disesuaikan` },
      { key: 'ulang', label: 'Bobot nilai dan ketentuan milestone dijelaskan ulang di kelas oleh tiap dosen', note: `Bobot tidak disampaikan pada ${pc(pick(m.pooled.share, 'Tidak disampaikan').pct)} jawaban mahasiswa, dan cara ini tidak menambah beban dosen` },
    ],
  },
  {
    key: 'koordinasi',
    kind: 'multi',
    max: 2,
    other: true,
    area: 'Koordinasi dosen',
    prompt: 'Solusi mana yang paling perlu agar arahan antar dosen seragam?',
    options: [
      { key: 'pic', label: 'PIC (pengampu mata kuliah inti) diumumkan ke dosen dan mahasiswa, lengkap per kelas', note: `PIC sudah ada menurut mata kuliah, tetapi hanya ${rujukanJelas} dosen menyatakan dosen rujukan jelas, dan ${sup('PIC dosen per kelas')} meminta PIC per kelas` },
      { key: 'peran', label: 'Tugas PIC dan dosen mata kuliah pendukung ditulis di juknis PBL Jurusan', note: `${sup('Pembagian peran dosen yang tertulis')} dosen memintanya, dan hanya ${sepakatPeran} punya kesepakatan peran` },
      { key: 'wa', label: 'PIC mengirim catatan milestone di WhatsApp, dosen lain mengonfirmasi dengan satu kata', note: `${pc(pick(l.wa.items, 'Membaca tetapi jarang menanggapi').pct)} dosen membaca grup tetapi jarang menanggapi, jadi konfirmasi perlu` },
      { key: 'rapat', label: 'PIC mengadakan rapat singkat daring sekali per milestone', note: `${sup('Rapat koordinasi dosen rutin')} dosen memintanya, tetapi ${bebanDosen} terkendala beban dan hanya ${pc(l.meeting.items[0].pct)} selalu hadir` },
    ],
  },
  {
    key: 'nilai',
    kind: 'multi',
    max: 2,
    other: true,
    area: 'Penilaian dan kontribusi',
    prompt: 'Solusi mana yang paling perlu agar penilaian lebih adil dan kontribusi terlihat?',
    options: [
      { key: 'n360', label: 'Penilaian 360 dengan bukti yang objektif, dikumpulkan PIC', note: `Kontribusi tidak seimbang dipilih ${pc(pick(m.improve, 'Kontribusi anggota tim tidak seimbang').pct)} mahasiswa dan ${pc(pick(l.improve, 'Kontribusi anggota tim mahasiswa tidak seimbang').pct)} dosen. Cara ini menambah pekerjaan menilai` },
      { key: 'contoh', label: 'Rubrik beserta contoh penilaian', note: `Hanya ${pc(m.ops[5].pct_agree)} mahasiswa setuju rubrik jelas, dan ${sup('Panduan dan contoh penilaian')} dosen meminta contoh` },
      { key: 'lms', label: 'Progres dan milestone tim dipantau PIC lewat LMS', note: `${us('Sediakan sistem pemantau progres dan kontribusi (termasuk milestone di LMS)')} komentar mahasiswa meminta sistem pemantau progres` },
      { key: 'halaman', label: 'Halaman informasi resmi per program studi', note: `${tema.sib_info.n} komentar SIB menyebut template dan jadwal yang dipakai berasal dari TI` },
    ],
  },
  {
    key: 'fasilitas',
    kind: 'multi',
    max: 2,
    other: true,
    area: 'Bimbingan dan fasilitas',
    prompt: 'Solusi mana yang paling perlu untuk bimbingan dan fasilitas?',
    options: [
      { key: 'materi', label: 'Dosen mata kuliah pendukung mengirim materi ke PIC dua pekan sebelum milestone', note: `${pc(pick(m.material, 'Materi terlambat dibanding kebutuhan milestone').pct)} menyebut materi terlambat, tetapi ${waktuSiapDosen} dosen menyebut waktu persiapan terbatas` },
      { key: 'konsul', label: 'PIC membuka sesi konsultasi terbuka dengan jadwal tetap', note: `${pc(m.consult_freq.items[0].pct)} tim belum pernah berkonsultasi. Jadwal tetap menggantikan jam tambahan, bukan menambahnya` },
      { key: 'cloud', label: 'Panduan deployment dengan kredit cloud dulu', note: 'Solusi cepat sambil menunggu keputusan tentang server kampus' },
      { key: 'server', label: 'Server kampus bersama dan perbaikan jaringan', note: `Semua ${tema.themes.find((t: any) => t.key === 'fasilitas').n} komentar fasilitas dari SIB. Perlu keputusan di luar kelas` },
    ],
  },
  {
    key: 'prioritas',
    kind: 'multi',
    max: 2,
    area: 'Prioritas',
    prompt: 'Dari tujuh masalah tadi, mana yang paling perlu didahulukan?',
    options: [
      { key: 'beban', label: 'Beban tugas mahasiswa' },
      { key: 'jadwal', label: 'Jadwal milestone yang menumpuk dengan kuis, UTS, dan UAS' },
      { key: 'selaras', label: 'Keselarasan tugas dan proyek' },
      { key: 'koordinasi', label: 'Koordinasi antar dosen' },
      { key: 'nilai', label: 'Penilaian dan kontribusi' },
      { key: 'fasilitas', label: 'Bimbingan dan fasilitas' },
      { key: 'respons', label: 'Respons survei' },
    ],
  },
  {
    key: 'komitmen',
    kind: 'multi',
    max: 4,
    area: 'Kesediaan dosen',
    prompt: 'Saya bersedia (boleh pilih lebih dari satu):',
    options: [
      { key: 'pic', label: 'Menjalankan tugas PIC di kelas yang saya ampu (bagi pengampu mata kuliah inti)' },
      { key: 'kirim', label: 'Menyampaikan jadwal kuis dan tugas saya ke PIC kelas (bagi pengampu mata kuliah pendukung)' },
      { key: 'notask', label: 'Tidak menambah tugas baru di luar proyek selama pekan Milestone 2' },
      { key: 'wa', label: 'Mengonfirmasi catatan PIC di WhatsApp dengan satu kata atau reaksi' },
    ],
  },
  {
    key: 'saran',
    kind: 'text',
    max: 1,
    area: 'Saran',
    prompt: 'Tuliskan saran Bapak/Ibu untuk PBL semester depan.',
    options: [],
  },
]
