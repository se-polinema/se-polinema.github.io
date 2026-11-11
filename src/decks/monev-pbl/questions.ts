// Polls for the Monev PBL deck. Built from the problem analysis (monev/analisis in the survey repo): every option
// names who does the work and quotes the data, including what makes it hard (lecturer workload, preparation time,
// weak coordination) and how strong the evidence is. Every class already has a PIC, the lecturer of the core course
// (see pic.ts), so coordination work goes to the PIC and supporting lecturers only send a date or confirm a note.
// Numbers come from src/data/monev-pbl/*.json through the helpers below; nothing is typed in by hand.
import agregat from '../../data/monev-pbl/agregat.json'
import temaJson from '../../data/monev-pbl/tema.json'
import { pc, pick } from '../../lib/live/format'
import type { Question } from '../../lib/live/types'
import { AN, ci, coef, sg } from './analysis'

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
const selarasDosen = AN.p3_jadwal.dosen_menyelaraskan[0]
const bebanModel = AN.p2_beban.model_beban_berat
const tugasTambahan = coef(bebanModel, 'Tugas mata kuliah menambah beban')
const adilModel = coef(AN.p6_penilaian.model_penilaian_adil, 'Rubrik jelas')
const timpangTI3 = AN.p6_penilaian.per_semester_timpang.find((g: any) => g.kelompok === 'TI Sem 3')

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
      { key: 'pekan', label: 'Tidak ada tugas baru di luar proyek selama pekan Milestone 2', note: `${pc(m.material[0].pct)} menyebut tugas menambah beban, tetapi setelah faktor lain dikontrol tidak membedakan siapa yang merasa berat (${sg(tugasTambahan.b)} ${ci(tugasTambahan.b_ci, 2)}). Murah dan cepat` },
      { key: 'konsul', label: 'Tugas baru di luar proyek dikonsultasikan ke PIC dulu', note: 'PIC sudah mengenal beban proyek tim. Bukti lemah, dan menambah satu langkah bagi dosen pendukung' },
      { key: 'batas', label: 'Batas jumlah tugas di luar proyek per pekan, daftarnya dipegang PIC', note: 'Bukti lemah. Angka batasnya ditentukan bersama dosen pengampu' },
      { key: 'gabung', label: 'Tugas praktikum dan jobsheet digabung ke hasil kerja proyek', note: `Bukti lemah, dan dosen perlu waktu menyiapkannya (${waktuSiapDosen} dosen menyebut waktu persiapan terbatas)` },
    ],
  },
  {
    key: 'jadwal',
    kind: 'multi',
    max: 2,
    other: true,
    area: 'Jadwal milestone',
    prompt: 'Solusi mana yang paling perlu agar tenggat milestone tidak menumpuk dengan kuis dan UTS mata kuliah lain?',
    options: [
      { key: 'geser', label: 'Tanggal milestone digeser satu minggu dari minggu kuis dan UTS mata kuliah non-PBL', note: `${pc(AN.p3_jadwal.jadwal_tidak_realistis.pct)} mahasiswa menilai jadwal milestone tidak realistis. Efek pergeseran belum bisa diuji; butuh kalender mata kuliah lain` },
      { key: 'kalender', label: 'Jurusan menerbitkan kalender kuis dan UTS semua mata kuliah sebelum tanggal milestone ditetapkan', note: 'Prasyarat pergeseran. Milestone tidak bisa dijadwalkan tanpa kalender itu' },
      { key: 'nonpbl', label: 'Dosen mata kuliah non-PBL tidak menjadwalkan kuis atau tugas besar di minggu milestone', note: 'Di luar kendali program PBL, jadi perlu kesepakatan lintas dosen' },
      { key: 'jendela', label: 'Jendela pengumpulan beberapa hari setelah minggu kuis dan UTS untuk dokumen milestone, tanggal demo tetap', note: 'Murah. Perlu kesepakatan para penilai' },
      { key: 'urut', label: 'PIC mengurutkan tanggal pengumpulan tiap mata kuliah PBL di dalam jendela milestone', note: `${selarasDosen.tidak_pernah_atau_jarang} dari ${selarasDosen.n} dosen PBL jarang menyelaraskan tenggat. Menambah pekerjaan PIC, padahal ${bebanDosen} dosen terkendala beban` },
      { key: 'kunci', label: 'Semua tanggal fase dikunci di awal semester, perubahan hanya lewat PIC', note: 'Murah. Menyasar tenggat yang berubah-ubah' },
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
      { key: 'peta', label: 'PIC menyusun peta keterkaitan mata kuliah dan milestone, dosen mata kuliah pendukung melengkapi bagiannya', note: `Hanya ${pc(m.pooled.bc[3].ya)} mahasiswa menjawab tugas mata kuliah bagian dari proyek, tetapi hal ini tidak berkaitan dengan beban atau kepuasan di data ini. Bukan yang paling mendesak` },
      { key: 'rubrik', label: 'Rubrik berbasis PBL beserta contoh, disusun PIC bersama dosen mata kuliah pendukung', note: `${sup('Panduan dan contoh penilaian')} dosen meminta panduan dan contoh penilaian. Juga menjawab masalah penilaian` },
      { key: 'bobot', label: 'Bobot PBL minimal 51% di RPS semua mata kuliah', note: `Batas IKU 7. ${mb('Capaian pembelajaran atau RPS sulit disesuaikan')} dosen menilai RPS sulit disesuaikan. Efeknya tidak bisa diuji` },
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
      { key: 'pic', label: 'PIC (pengampu mata kuliah inti) diumumkan ke dosen dan mahasiswa, lengkap per kelas', note: `PIC sudah ada menurut mata kuliah, tetapi hanya ${rujukanJelas} dosen menyatakan dosen rujukan jelas, dan ${sup('PIC dosen per kelas')} meminta PIC per kelas. Pastikan dulu PIC tahu perannya` },
      { key: 'peran', label: 'Tugas PIC dan dosen mata kuliah pendukung ditulis di juknis PBL Jurusan', note: `${sup('Pembagian peran dosen yang tertulis')} dosen memintanya, dan hanya ${sepakatPeran} punya kesepakatan peran` },
      { key: 'wa', label: 'PIC mengumumkan rencana tiap milestone di grup dosen kelas (tanggal, luaran, fokus penilaian); dosen cukup membalas bila ada bentrok sebelum batas tanggal', note: `${pc(pick(l.wa.items, 'Membaca tetapi jarang menanggapi').pct)} dosen membaca grup tetapi jarang menanggapi, jadi cara ini tidak menuntut balasan dari semua dosen` },
      { key: 'form', label: 'Di awal semester dosen mata kuliah pendukung mengisi satu formulir: tenggat tugas dan kapan tim butuh server; PIC menyusun kalender kelas', note: `Hambatan utama dosen adalah beban mengajar dan administrasi (${bebanDosen}), jadi satu isian per semester, bukan balasan di tiap milestone` },
      { key: 'rapat', label: 'PIC mengadakan rapat singkat daring sekali per milestone', note: `${sup('Rapat koordinasi dosen rutin')} dosen memintanya, tetapi ${bebanDosen} terkendala beban dan hanya ${pc(l.meeting.items[0].pct)} selalu hadir. Uji dulu` },
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
      { key: 'contoh', label: 'Rubrik beserta contoh penilaian', note: `Kejelasan rubrik adalah penentu terkuat persepsi adil (koefisien baku ${fmt2(adilModel.beta)}). Hanya ${pc(m.ops[5].pct_agree)} mahasiswa setuju rubrik jelas, dan ${sup('Panduan dan contoh penilaian')} dosen meminta contoh` },
      { key: 'n360', label: 'Penilaian 360 dengan bukti yang objektif, dikumpulkan PIC', note: `Kontribusi tidak seimbang dipilih ${pc(AN.p6_penilaian.kontribusi_timpang_dipilih.pct)} mahasiswa, tertinggi di TI Semester 3 (${pc(timpangTI3.pct)}). Pengaruh terpisahnya pada persepsi adil kecil, dan menambah pekerjaan menilai` },
      { key: 'lms', label: 'Progres dan milestone tim dipantau PIC lewat LMS', note: `${us('Sediakan sistem pemantau progres dan kontribusi (termasuk milestone di LMS)')} komentar mahasiswa meminta sistem pemantau progres` },
      { key: 'halaman', label: 'Halaman informasi resmi per program studi', note: `${tema.sib_info.n} komentar SIB menyebut template dan jadwal yang dipakai berasal dari TI` },
    ],
  },
  {
    key: 'fasilitas',
    kind: 'multi',
    max: 2,
    other: true,
    area: 'Fasilitas dan server',
    prompt: 'Solusi mana yang paling perlu agar mahasiswa tidak menanggung sendiri biaya server deployment?',
    options: [
      { key: 'sop', label: 'Kebutuhan server dan perkiraan biayanya ditulis di SOP sejak minggu 1, beserta kapan tiap mata kuliah membutuhkannya', note: 'Deployment wajib untuk aplikasi web dan pengujian Penjaminan Mutu, tetapi belum tertulis. Tim bisa menyewa sesingkat mungkin. Hampir tanpa biaya' },
      { key: 'ujibersama', label: 'Lingkungan uji bersama dari jurusan, dipakai selama pengujian Penjaminan Mutu', note: 'Menyasar kebutuhan wajib di Semester 5. Perlu perangkat, pengelola, dan pengaturan keamanan' },
      { key: 'serverjurusan', label: 'Server atau mesin virtual per tim yang disediakan jurusan', note: `Fasilitas adalah prioritas pertama (${pc(100 - m.ops[7].pct_agree)} tidak setuju fasilitas memadai). Biaya jurusan belum diketahui` },
      { key: 'kredit', label: 'Kredit cloud untuk mahasiswa', note: 'Periksa program kredit pelajar yang sedang berlaku. Kuota dan masa berlaku terbatas' },
      { key: 'patungan', label: 'Patungan terkoordinasi per kelas: satu VPS bersama dengan akun terpisah per tim', note: 'Memecah biaya, tetapi perlu pengelola dan aturan keamanan' },
      { key: 'gratis', label: 'Layanan dengan tier gratis untuk pengembangan, VPS berbayar hanya saat dibutuhkan', note: 'Batas performa, dan bug deployment bisa baru terlihat belakangan' },
    ],
  },
  {
    key: 'prioritas',
    kind: 'multi',
    max: 2,
    area: 'Prioritas',
    prompt: 'Dari tujuh masalah tadi, mana yang paling perlu didahulukan?',
    options: [
      { key: 'fasilitas', label: 'Fasilitas dan biaya server deployment' },
      { key: 'beban', label: 'Beban tugas mahasiswa' },
      { key: 'jadwal', label: 'Jadwal milestone yang bersamaan dengan kuis dan UTS' },
      { key: 'koordinasi', label: 'Koordinasi antar dosen' },
      { key: 'nilai', label: 'Penilaian dan kontribusi' },
      { key: 'selaras', label: 'Keselarasan tugas dan proyek' },
      { key: 'respons', label: 'Respons survei' },
    ],
  },
  {
    key: 'komitmen',
    kind: 'multi',
    max: 5,
    area: 'Kesediaan dosen',
    prompt: 'Saya bersedia (boleh pilih lebih dari satu):',
    options: [
      { key: 'pic', label: 'Menjalankan tugas PIC di kelas yang saya ampu (bagi pengampu mata kuliah inti)' },
      { key: 'kirim', label: 'Mengisi formulir tenggat tugas di awal semester untuk PIC kelas (bagi pengampu mata kuliah pendukung)' },
      { key: 'server', label: 'Menyampaikan sejak awal kapan tim perlu server untuk mata kuliah saya (bagi pengampu aplikasi web dan Penjaminan Mutu)' },
      { key: 'notask', label: 'Tidak menambah tugas baru di luar proyek selama pekan Milestone 2' },
      { key: 'wa', label: 'Membalas pengumuman milestone PIC bila tugas mata kuliah saya bentrok' },
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

function fmt2(x: number) {
  return x.toFixed(2).replace('.', ',')
}
