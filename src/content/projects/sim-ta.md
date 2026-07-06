---
title: "SIM-TA - Sistem Informasi Manajemen Tugas Akhir"
titleId: "SIM-TA - Sistem Informasi Manajemen Tugas Akhir"
description: "Web-based thesis management system for JTI Polinema — digitizes the complete academic workflow from proposal submission, seminar scheduling, online mentoring, to final defense registration. Includes role-based access control, document management, academic period tracking, and a Python-based supervisor recommendation engine."
descriptionId: "Sistem informasi manajemen Tugas Akhir berbasis web untuk JTI Polinema — mendigitalisasi seluruh alur akademik mulai dari pengajuan proposal, penjadwalan seminar, bimbingan online, hingga pendaftaran sidang akhir. Dilengkapi kontrol akses berbasis peran, manajemen dokumen, pelacakan periode akademik, dan mesin rekomendasi dosen pembimbing berbasis Python."
status: "active"
techStack:
  - "Laravel"
  - "Blade"
  - "MySQL"
  - "AdminLTE 3"
  - "Laravel Storage"
  - "Google OAuth"
  - "Python"
images:
  - "/images/projects/SIM-TA.png"
contributors: []
researchers:
  - "moch-zawaruddin-abdullah"
stream: "domain-specific-se-applications"
repo: "jti-polinema/SIM-TA"
featured: true
private: true
---

<section lang="en">
</section>

<section lang="id">
SIM-TA adalah aplikasi web berbasis Laravel yang dikembangkan untuk membantu pengelolaan proses Tugas Akhir mahasiswa di Jurusan Teknologi Informasi, Politeknik Negeri Malang. Aplikasi ini mulai dikembangkan sejak tahun **2023** sebagai bagian dari upaya digitalisasi proses administrasi akademik, khususnya dalam pengelolaan Tugas Akhir.

Aplikasi ini dirancang untuk mendigitalisasi seluruh alur administrasi Tugas Akhir, mulai dari pengajuan proposal, seminar proposal, proses bimbingan, pendaftaran sidang, revisi, hingga penyelesaian laporan akhir.

## Latar Belakang

Proses pengelolaan Tugas Akhir melibatkan banyak pihak, seperti mahasiswa, dosen pembimbing, dosen penguji, panitia, admin, dan pihak jurusan. Tanpa sistem yang terpusat, proses ini dapat menimbulkan kendala seperti keterlambatan validasi, kesulitan pemantauan status, duplikasi data, serta kurangnya transparansi dalam proses administrasi.

SIM-TA hadir sebagai solusi untuk menyederhanakan dan mengintegrasikan seluruh tahapan tersebut dalam satu sistem informasi yang mudah digunakan, terstruktur, dan sesuai dengan kebutuhan akademik.

## Tujuan Aplikasi

Tujuan utama SIM-TA adalah menyediakan platform digital yang dapat membantu institusi pendidikan dalam mengelola proses Tugas Akhir secara lebih efektif, transparan, dan terdokumentasi dengan baik.

Beberapa tujuan utama aplikasi ini meliputi:

- Mempermudah mahasiswa dalam mengajukan proposal dan mendaftar sidang.
- Membantu dosen dalam melakukan persetujuan, pembimbingan, dan penilaian.
- Mempermudah panitia dan admin dalam mengelola jadwal seminar maupun sidang.
- Menyediakan sistem pemantauan status Tugas Akhir secara real-time.
- Mengurangi proses administrasi manual yang rawan kesalahan.
- Menyediakan dokumentasi akademik yang lebih rapi dan terpusat.

## Fitur Utama

### 1. Manajemen Proposal Tugas Akhir

Mahasiswa dapat mengajukan proposal Tugas Akhir melalui sistem. Proposal yang diajukan akan melalui proses validasi dan persetujuan oleh dosen pembimbing maupun pihak terkait.

Fitur ini mencakup:

- Pengajuan proposal oleh mahasiswa.
- Unggah dokumen proposal.
- Validasi dan persetujuan proposal.
- Pemantauan status proposal.
- Riwayat proses proposal.
- Manajemen revisi proposal.

### 2. Manajemen Seminar Proposal

Setelah proposal disetujui, mahasiswa dapat mengikuti proses seminar proposal. Sistem mendukung pengelolaan jadwal, peserta, dosen penguji, serta hasil seminar.

Fitur ini mencakup:

- Pendaftaran seminar proposal.
- Penjadwalan seminar oleh admin atau panitia.
- Penentuan dosen penguji.
- Pengelolaan hasil seminar.
- Pencatatan revisi seminar proposal.

### 3. Manajemen Skripsi

Setelah proposal dinyatakan diterima, mahasiswa dapat melanjutkan ke tahap pengerjaan skripsi. Sistem menyediakan fitur untuk mengelola data skripsi dan proses bimbingan.

Fitur ini mencakup:

- Registrasi skripsi.
- Pemantauan progres pengerjaan skripsi.
- Pengelolaan data pembimbing.
- Riwayat aktivitas skripsi.
- Validasi kelayakan menuju sidang akhir.

### 4. Bimbingan Online

Aplikasi menyediakan fitur pencatatan bimbingan antara mahasiswa dan dosen pembimbing. Setiap aktivitas bimbingan dapat terdokumentasi dengan baik.

Fitur ini mencakup:

- Pengajuan catatan bimbingan oleh mahasiswa.
- Validasi bimbingan oleh dosen.
- Riwayat bimbingan.
- Pemantauan frekuensi dan progres bimbingan.

### 5. Manajemen Sidang Akhir

SIM-TA mendukung proses pendaftaran dan penjadwalan sidang akhir mahasiswa. Admin atau panitia dapat mengelola jadwal, ruangan, dosen penguji, serta hasil sidang.

Fitur ini mencakup:

- Pendaftaran sidang akhir.
- Pengelolaan jadwal sidang.
- Penentuan dosen penguji.
- Pengelolaan nilai dan hasil sidang.
- Pencatatan revisi sidang.
- Validasi laporan akhir.

### 6. Manajemen Pengguna dan Hak Akses

Aplikasi menerapkan sistem role-based access control berdasarkan peran pengguna. Setiap pengguna hanya dapat mengakses fitur sesuai dengan kewenangannya.

Role pengguna meliputi:

- Super Admin
- Admin
- Dosen
- Mahasiswa
- Panitia Tugas Akhir

Setiap role memiliki hak akses yang berbeda untuk membaca, menambah, mengubah, atau menghapus data.

### 7. Manajemen Periode Akademik

SIM-TA mendukung pengelolaan data berdasarkan periode akademik. Setiap proses Tugas Akhir dapat dikaitkan dengan periode tertentu sehingga data lebih mudah dikelola dan dilacak.

### 8. Rekomendasi Dosen Pembimbing

Aplikasi dilengkapi dengan fitur recommendation engine berbasis Python yang dapat membantu memberikan rekomendasi dosen pembimbing berdasarkan proposal mahasiswa.

Fitur ini mendukung proses pengambilan keputusan agar pemilihan pembimbing lebih relevan dengan topik Tugas Akhir.

### 9. Laporan dan Rekapitulasi

Sistem menyediakan fitur laporan untuk membantu admin, panitia, dan jurusan dalam memantau perkembangan Tugas Akhir mahasiswa.

Laporan dapat digunakan untuk:

- Melihat daftar mahasiswa berdasarkan status Tugas Akhir.
- Memantau proposal yang telah disetujui.
- Melihat jadwal seminar dan sidang.
- Mengelola data kelulusan atau yudisium.
- Mendukung kebutuhan administrasi jurusan.

## Teknologi yang Digunakan

SIM-TA dikembangkan menggunakan teknologi berikut:

- Laravel sebagai framework backend.
- Blade Template Engine untuk antarmuka pengguna.
- MySQL sebagai sistem manajemen basis data.
- AdminLTE 3 sebagai template dashboard.
- Laravel Storage untuk pengelolaan file.
- Google OAuth untuk autentikasi SSO.
- Python untuk fitur recommendation engine.

## Keunggulan Aplikasi

- Terintegrasi dalam satu platform akademik.
- Dikembangkan sejak tahun 2023 dan disesuaikan dengan kebutuhan proses Tugas Akhir.
- Mendukung banyak role pengguna.
- Memiliki alur proses Tugas Akhir yang lengkap.
- Hak akses pengguna dapat dikontrol secara detail.
- Mendukung autentikasi lokal dan Google SSO.
- Memiliki fitur unggah dan pengelolaan dokumen.
- Mendukung pencatatan riwayat proses secara terstruktur.
- Dilengkapi sistem rekomendasi pembimbing.
- Mempermudah monitoring oleh admin, panitia, dosen, dan mahasiswa.

## Peran Saya dalam Proyek

Dalam pengembangan aplikasi SIM-TA, saya berperan dalam membangun dan mengembangkan sistem informasi berbasis web yang mendukung proses administrasi Tugas Akhir secara digital.

Kontribusi utama saya meliputi:

- Merancang dan mengembangkan fitur manajemen proposal.
- Mengimplementasikan alur pengajuan, validasi, dan persetujuan.
- Mengembangkan fitur manajemen seminar proposal dan sidang akhir.
- Membuat sistem role dan hak akses pengguna.
- Mengelola integrasi database dengan struktur akademik.
- Mengembangkan tampilan dashboard berbasis AdminLTE.
- Mengintegrasikan fitur unggah dokumen.
- Mengembangkan fitur monitoring status Tugas Akhir.
- Mendukung integrasi recommendation engine berbasis Python.

## Dampak Aplikasi

Dengan adanya SIM-TA, proses pengelolaan Tugas Akhir menjadi lebih efisien, transparan, dan terdokumentasi. Mahasiswa dapat memantau status pengajuan mereka dengan lebih mudah, dosen dapat melakukan validasi dan pembimbingan secara lebih terstruktur, sementara admin dan panitia dapat mengelola jadwal serta laporan dengan lebih cepat.

Aplikasi ini membantu mengurangi ketergantungan pada proses manual dan meningkatkan kualitas layanan administrasi akademik.

## Ringkasan

SIM-TA adalah sistem informasi manajemen Tugas Akhir yang dirancang untuk mendukung seluruh proses akademik mulai dari proposal hingga sidang akhir. Dengan fitur yang lengkap, sistem hak akses yang terstruktur, serta dukungan teknologi modern, aplikasi ini menjadi solusi digital yang efektif untuk pengelolaan Tugas Akhir di lingkungan perguruan tinggi.
</section>
