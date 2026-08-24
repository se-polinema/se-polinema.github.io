---
title: "SIM-TA - Sistem Informasi Manajemen Tugas Akhir"
titleId: "SIM-TA - Sistem Informasi Manajemen Tugas Akhir"
description: "Web-based thesis management system for JTI Polinema: digitizes the complete academic workflow from proposal submission, seminar scheduling, online mentoring, to final defense registration. Includes role-based access control, document management, academic period tracking, and a Python-based supervisor recommendation engine."
descriptionId: "Sistem informasi manajemen Tugas Akhir berbasis web untuk JTI Polinema: mendigitalisasi seluruh alur akademik mulai dari pengajuan proposal, penjadwalan seminar, bimbingan online, hingga pendaftaran sidang akhir. Dilengkapi kontrol akses berbasis peran, manajemen dokumen, pelacakan periode akademik, dan mesin rekomendasi dosen pembimbing berbasis Python."
status: "active"
techStack:
  - "Laravel"
  - "Blade"
  - "MariaDB"
  - "AdminLTE 3"
  - "Laravel Storage"
  - "Google OAuth"
  - "Python"
  - Docker Container
  - Redis  
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
SIM-TA is a Laravel-based web application developed to support the management of student thesis processes at the Department of Information Technology, Politeknik Negeri Malang. This application has been in development since **2023** as part of the effort to digitize academic administrative processes, particularly in thesis management.

The application is designed to digitize the entire thesis administration workflow, from proposal submission, proposal seminars, mentoring processes, defense registration, revisions, to final report completion.

## Background

The thesis management process involves many stakeholders, such as students, supervisors, examiners, committees, admins, and department officials. Without a centralized system, this process can lead to issues such as validation delays, difficulty in status tracking, data duplication, and lack of transparency in administrative processes.

SIM-TA was created as a solution to simplify and integrate all these stages into a single information system that is easy to use, well-structured, and aligned with academic needs.

## Application Goals

The primary goal of SIM-TA is to provide a digital platform that helps educational institutions manage the thesis process more effectively, transparently, and with proper documentation.

Key goals of this application include:

- Simplifying proposal submission and defense registration for students.
- Assisting lecturers with approvals, mentoring, and assessments.
- Helping committees and admins manage seminar and defense schedules.
- Providing a real-time thesis status monitoring system.
- Reducing error-prone manual administrative processes.
- Providing more organized and centralized academic documentation.

## Key Features

### 1. Thesis Proposal Management

Students can submit thesis proposals through the system. Submitted proposals go through a validation and approval process by supervisors and related parties.

This feature includes:

- Proposal submission by students.
- Proposal document upload.
- Proposal validation and approval.
- Proposal status tracking.
- Proposal process history.
- Proposal revision management.

### 2. Proposal Seminar Management

After the proposal is approved, students can proceed with the proposal seminar process. The system supports schedule management, participants, examiners, and seminar results.

This feature includes:

- Proposal seminar registration.
- Seminar scheduling by admin or committee.
- Examiner assignment.
- Seminar results management.
- Proposal seminar revision records.

### 3. Thesis Management

After the proposal is accepted, students can proceed to the thesis work phase. The system provides features to manage thesis data and the mentoring process.

This feature includes:

- Thesis registration.
- Thesis progress monitoring.
- Supervisor data management.
- Thesis activity history.
- Eligibility validation for final defense.

### 4. Online Mentoring

The application provides a mentoring log feature between students and supervisors. Every mentoring activity is well-documented.

This feature includes:

- Mentoring note submission by students.
- Mentoring validation by lecturers.
- Mentoring history.
- Mentoring frequency and progress monitoring.

### 5. Final Defense Management

SIM-TA supports the registration and scheduling process for student final defenses. Admins or committees can manage schedules, rooms, examiners, and defense results.

This feature includes:

- Final defense registration.
- Defense schedule management.
- Examiner assignment.
- Grade and defense results management.
- Defense revision records.
- Final report validation.

### 6. User and Access Rights Management

The application implements a role-based access control system based on user roles. Each user can only access features according to their authority.

User roles include:

- Super Admin
- Admin
- Lecturer
- Student
- Thesis Committee

Each role has different access rights to read, add, modify, or delete data.

### 7. Academic Period Management

SIM-TA supports data management based on academic periods. Each thesis process can be linked to a specific period so that data is easier to manage and track.

### 8. Supervisor Recommendation

The application is equipped with a Python-based recommendation engine that helps provide supervisor recommendations based on student proposals.

This feature supports the decision-making process so that supervisor selection is more relevant to the thesis topic.

### 9. Reports and Recapitulation

The system provides reporting features to help admins, committees, and departments monitor student thesis progress.

Reports can be used for:

- Viewing student lists by thesis status.
- Monitoring approved proposals.
- Viewing seminar and defense schedules.
- Managing graduation or judicial data.
- Supporting department administrative needs.

## Technologies Used

SIM-TA is developed using the following technologies:

- Laravel as the backend framework.
- Blade Template Engine for the user interface.
- MySQL as the database management system.
- AdminLTE 3 as the dashboard template.
- Laravel Storage for file management.
- Google OAuth for SSO authentication.
- Python for the recommendation engine feature.

## Application Advantages

- Integrated into a single academic platform.
- Developed since 2023 and adapted to thesis process requirements.
- Supports multiple user roles.
- Has a complete thesis process workflow.
- User access rights can be controlled in detail.
- Supports local authentication and Google SSO.
- Has document upload and management features.
- Supports structured process history recording.
- Equipped with a supervisor recommendation system.
- Facilitates monitoring by admins, committees, lecturers, and students.

## My Role in the Project

In the development of the SIM-TA application, I contributed to building and developing a web-based information system that supports the digital thesis administration process.

My main contributions include:

- Designing and developing the proposal management feature.
- Implementing the submission, validation, and approval workflow.
- Developing the proposal seminar and final defense management features.
- Creating the role and user access rights system.
- Managing database integration with academic structures.
- Developing the AdminLTE-based dashboard interface.
- Integrating document upload features.
- Developing the thesis status monitoring feature.
- Supporting the integration of the Python-based recommendation engine.

## Application Impact

With SIM-TA, the thesis management process becomes more efficient, transparent, and well-documented. Students can monitor their submission status more easily, lecturers can perform validation and mentoring in a more structured manner, while admins and committees can manage schedules and reports more quickly.

This application helps reduce dependence on manual processes and improves the quality of academic administrative services.

## Summary

SIM-TA is a thesis management information system designed to support the entire academic process from proposal to final defense. With comprehensive features, a structured access rights system, and modern technology support, this application is an effective digital solution for thesis management in higher education environments.
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
