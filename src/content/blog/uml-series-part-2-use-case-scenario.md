---
title: "UML Mini Series Part 2 — Use Case Scenario"
titleId: "Seri Mini UML Bagian 2 — Use Case Scenario"
date: 2026-06-30
category: tutorial
author: SE Lab
lang: en
featured: false
excerpt: "Part 2 of the UML Mini Series. Learn what a Use Case Scenario is, why it bridges requirements and design, and how to write a full scenario for the 'Enrol in Course' use case — with structured table, main success flow, and alternative flows."
excerptId: "Bagian 2 dari Seri Mini UML. Pelajari apa itu Use Case Scenario, mengapa ia menjembatani persyaratan dan desain, dan cara menulis skenario lengkap untuk use case 'Daftar Mata Kuliah' — dengan tabel terstruktur, alur sukses utama, dan alur alternatif."
---

<nav aria-label="Series navigation" class="mb-8 p-4 bg-neutral-50 dark:bg-gray-800 rounded-lg border border-neutral-200 dark:border-gray-700">
  <p class="font-semibold mb-2">
    <span lang="en">UML Mini Series — 5 Parts</span>
    <span lang="id">Seri Mini UML — 5 Bagian</span>
  </p>
  <ol class="list-decimal list-inside space-y-1 text-sm">
    <li><a href="/blog/uml-series-part-1-introduction-use-case">Part 1: Introduction to UML & Use Case Diagram</a></li>
    <li class="font-bold">
      <span lang="en">Part 2: Use Case Scenario ← You are here</span>
      <span lang="id">Bagian 2: Use Case Scenario ← Anda di sini</span>
    </li>
    <li><a href="/blog/uml-series-part-3-activity-diagram">Part 3: Activity Diagram</a></li>
    <li><a href="/blog/uml-series-part-4-sequence-diagram">Part 4: Sequence Diagram</a></li>
    <li><a href="/blog/uml-series-part-5-class-diagram-laravel">Part 5: Class Diagram & Laravel Realization</a></li>
  </ol>
</nav>

<section lang="en">

## 1. What is a Use Case Scenario?

A **Use Case Scenario** (also called a Use Case Specification or Use Case Narrative) is a detailed textual description of how an actor interacts with a system to achieve a specific goal. While the Use Case Diagram gives you the "table of contents" of system functionality, the scenario gives you the full chapter — with step-by-step interactions, alternative paths, and failure conditions.

Think of it this way:
- **Use Case Diagram** = the answer to *"What can users do?"*
- **Use Case Scenario** = the answer to *"How exactly does the user accomplish a specific goal, and what could go wrong?"*

</section>

<section lang="id">

## 1. Apa Itu Use Case Scenario?

**Use Case Scenario** (juga disebut Use Case Specification atau Use Case Narrative) adalah deskripsi tekstual terperinci tentang bagaimana seorang aktor berinteraksi dengan sistem untuk mencapai tujuan tertentu. Sementara Use Case Diagram memberi Anda "daftar isi" fungsionalitas sistem, skenario memberi Anda bab lengkapnya — dengan interaksi langkah-demi-langkah, jalur alternatif, dan kondisi kegagalan.

Pikirkan seperti ini:
- **Use Case Diagram** = jawaban untuk *"Apa yang dapat dilakukan pengguna?"*
- **Use Case Scenario** = jawaban untuk *"Bagaimana tepatnya pengguna mencapai tujuan tertentu, dan apa yang bisa salah?"*

</section>

---

<section lang="en">

## 2. Why Write a Use Case Scenario? (4W+H)

### What
A use case scenario is a structured document that captures the dialogue between an actor and the system. It includes preconditions (what must be true before the use case starts), a main success scenario (the "happy path"), alternative flows (branching conditions), and postconditions (what is true when the use case completes).

### Why
- **Shared understanding.** Developers, testers, product owners, and stakeholders align on exactly what the system must do before anyone writes code.
- **Test case generation.** Every step in the main and alternative flows becomes a test case. If a step says "System validates that the student has no schedule conflict," QA writes a test for it.
- **Estimation.** Breaking a feature down into numbered steps makes it easier to estimate implementation effort.
- **Traceability.** The scenario links requirements (what the stakeholder wants) to design (sequence diagrams, class diagrams) and implementation (code).

### When
Write the use case scenario **after** the use case diagram is approved and **before** you start drawing activity diagrams, sequence diagrams, or writing code. It is the bridge between requirements and design.

### Where
The use case scenario lives in the Software Requirements Specification (SRS) or a dedicated use case document. In modern teams, it may live in a wiki, a project management tool, or even as structured comments in a ticket.

### How
A complete use case scenario contains at minimum:
1. **Use Case Name** — a verb-noun phrase matching the oval on the diagram
2. **Primary Actor** — who initiates the use case
3. **Preconditions** — what must be true before the use case starts
4. **Postconditions** — what is true after the use case completes successfully
5. **Main Success Scenario** — numbered steps of actor-system interaction
6. **Alternative Flows** — what happens when something deviates from the main path

</section>

<section lang="id">

## 2. Mengapa Menulis Use Case Scenario? (4W+H)

### What (Apa)
Use case scenario adalah dokumen terstruktur yang menangkap dialog antara aktor dan sistem. Ini mencakup prasyarat (apa yang harus benar sebelum use case dimulai), skenario sukses utama ("happy path"), alur alternatif (kondisi percabangan), dan pascasyarat (apa yang benar setelah use case selesai).

### Why (Mengapa)
- **Pemahaman bersama.** Developer, tester, product owner, dan stakeholder menyelaraskan diri tentang apa yang harus dilakukan sistem sebelum siapa pun menulis kode.
- **Pembuatan test case.** Setiap langkah dalam alur utama dan alternatif menjadi test case. Jika satu langkah mengatakan "Sistem memvalidasi bahwa mahasiswa tidak memiliki konflik jadwal," QA menulis tes untuk itu.
- **Estimasi.** Memecah fitur menjadi langkah bernomor memudahkan estimasi upaya implementasi.
- **Ketertelusuran.** Skenario menghubungkan persyaratan (apa yang diinginkan stakeholder) ke desain (sequence diagram, class diagram) dan implementasi (kode).

### When (Kapan)
Tulis use case scenario **setelah** use case diagram disetujui dan **sebelum** Anda mulai menggambar activity diagram, sequence diagram, atau menulis kode. Ini adalah jembatan antara persyaratan dan desain.

### Where (Di Mana)
Use case scenario berada di Software Requirements Specification (SRS) atau dokumen use case khusus. Di tim modern, ini bisa berada di wiki, alat manajemen proyek, atau bahkan sebagai komentar terstruktur di tiket.

### How (Bagaimana)
Use case scenario yang lengkap minimal berisi:
1. **Nama Use Case** — frasa kata kerja-benda yang cocok dengan oval di diagram
2. **Aktor Utama** — siapa yang memulai use case
3. **Prasyarat** — apa yang harus benar sebelum use case dimulai
4. **Pascasyarat** — apa yang benar setelah use case selesai dengan sukses
5. **Skenario Sukses Utama** — langkah bernomor interaksi aktor-sistem
6. **Alur Alternatif** — apa yang terjadi ketika sesuatu menyimpang dari jalur utama

</section>

---

<section lang="en">

## 3. Use Case Scenario: Enrol in Course

We will focus on the **Enrol in Course** use case from our Campus Course Registration System. This is the most complex use case and demonstrates how to handle dependencies, alternative flows, and external system interactions.

### Use Case Header

| Field | Value |
|---|---|
| **Use Case Name** | Enrol in Course |
| **Use Case ID** | UC-004 |
| **Primary Actor** | Student |
| **Secondary Actors** | Payment Gateway (external system) |
| **Preconditions** | 1. Student is registered and logged into the system.<br>2. Student has browsed available courses.<br>3. The registration period for the selected course is open.<br>4. The course has available seats (quota > 0). |
| **Postconditions (Success)** | 1. Student is enrolled in the selected course.<br>2. Course available quota is decremented by one.<br>3. Payment record is created with status "paid."<br>4. Student receives an enrolment confirmation (email or notification).<br>5. Student's schedule is updated to include the new course. |
| **Postconditions (Failure)** | 1. System state is unchanged — no partial enrolment.<br>2. Payment is either not charged or automatically refunded.<br>3. Error message is displayed to the student explaining the reason. |

</section>

<section lang="id">

## 3. Use Case Scenario: Daftar Mata Kuliah

Kita akan fokus pada use case **Daftar Mata Kuliah** dari Sistem Pendaftaran Mata Kuliah Kampus kita. Ini adalah use case yang paling kompleks dan mendemonstrasikan cara menangani dependensi, alur alternatif, dan interaksi sistem eksternal.

### Header Use Case

| Kolom | Nilai |
|---|---|
| **Nama Use Case** | Daftar Mata Kuliah |
| **ID Use Case** | UC-004 |
| **Aktor Utama** | Mahasiswa |
| **Aktor Sekunder** | Payment Gateway (sistem eksternal) |
| **Prasyarat** | 1. Mahasiswa terdaftar dan login ke sistem.<br>2. Mahasiswa telah menelusuri mata kuliah yang tersedia.<br>3. Periode pendaftaran untuk mata kuliah yang dipilih terbuka.<br>4. Mata kuliah memiliki kursi tersedia (kuota > 0). |
| **Pascasyarat (Sukses)** | 1. Mahasiswa terdaftar di mata kuliah yang dipilih.<br>2. Kuota mata kuliah yang tersedia berkurang satu.<br>3. Catatan pembayaran dibuat dengan status "lunas."<br>4. Mahasiswa menerima konfirmasi pendaftaran (email atau notifikasi).<br>5. Jadwal mahasiswa diperbarui untuk mencakup mata kuliah baru. |
| **Pascasyarat (Gagal)** | 1. Status sistem tidak berubah — tidak ada pendaftaran parsial.<br>2. Pembayaran tidak dikenakan atau secara otomatis dikembalikan.<br>3. Pesan error ditampilkan kepada mahasiswa menjelaskan alasannya. |

</section>

---

<section lang="en">

## 4. Main Success Scenario (Happy Path)

This is the ideal path where everything goes right. Each step is a discrete interaction between the actor and the system.

| Step | Actor Action | System Response |
|------|-------------|-----------------|
| 1 | Student selects a course from the course catalogue and clicks **"Enrol."** | |
| 2 | | System checks that the student is authenticated. |
| 3 | | System verifies that the registration period for this course is open. |
| 4 | | System checks that the course still has available seats (quota > 0). |
| 5 | | System checks for schedule conflicts — the student must not already be enrolled in another course at the same time slot. |
| 6 | | System calculates the tuition fee for the course and displays the enrolment summary screen: course name, credits, schedule, and fee amount. |
| 7 | Student reviews the summary and clicks **"Confirm Enrolment."** | |
| 8 | | System initiates a payment request to the Payment Gateway with the fee amount, student ID, and course ID. |
| 9 | | Payment Gateway processes the transaction and returns a payment confirmation with a transaction ID. |
| 10 | | System creates an enrolment record in the database linking the student to the course, with status "enrolled" and the payment transaction ID. |
| 11 | | System decrements the course available quota by 1. |
| 12 | | System sends an enrolment confirmation notification (email and/or in-app notification). |
| 13 | | System redirects the student to the **"My Schedule"** page, where the newly enrolled course now appears. |

</section>

<section lang="id">

## 4. Skenario Sukses Utama (Happy Path)

Ini adalah jalur ideal di mana semuanya berjalan dengan benar. Setiap langkah adalah interaksi diskrit antara aktor dan sistem.

| Langkah | Aksi Aktor | Respons Sistem |
|---------|-----------|---------------|
| 1 | Mahasiswa memilih mata kuliah dari katalog dan mengklik **"Daftar."** | |
| 2 | | Sistem memeriksa bahwa mahasiswa sudah terotentikasi. |
| 3 | | Sistem memverifikasi bahwa periode pendaftaran untuk mata kuliah ini terbuka. |
| 4 | | Sistem memeriksa bahwa mata kuliah masih memiliki kursi tersedia (kuota > 0). |
| 5 | | Sistem memeriksa konflik jadwal — mahasiswa tidak boleh sudah terdaftar di mata kuliah lain pada slot waktu yang sama. |
| 6 | | Sistem menghitung biaya kuliah untuk mata kuliah dan menampilkan layar ringkasan pendaftaran: nama mata kuliah, SKS, jadwal, dan jumlah biaya. |
| 7 | Mahasiswa meninjau ringkasan dan mengklik **"Konfirmasi Pendaftaran."** | |
| 8 | | Sistem memulai permintaan pembayaran ke Payment Gateway dengan jumlah biaya, ID mahasiswa, dan ID mata kuliah. |
| 9 | | Payment Gateway memproses transaksi dan mengembalikan konfirmasi pembayaran dengan ID transaksi. |
| 10 | | Sistem membuat catatan pendaftaran di database yang menghubungkan mahasiswa ke mata kuliah, dengan status "terdaftar" dan ID transaksi pembayaran. |
| 11 | | Sistem mengurangi kuota mata kuliah yang tersedia sebanyak 1. |
| 12 | | Sistem mengirim notifikasi konfirmasi pendaftaran (email dan/atau notifikasi dalam aplikasi). |
| 13 | | Sistem mengarahkan mahasiswa ke halaman **"Jadwal Saya,"** di mana mata kuliah yang baru didaftarkan sekarang muncul. |

</section>

---

<section lang="en">

## 5. Alternative Flows

Alternative flows describe what happens when the happy path cannot be followed. Each alternative flow references the step in the main success scenario where it branches off.

### Alternative Flow A: Registration Period Closed (at Step 3)

| Step | Actor Action | System Response |
|------|-------------|-----------------|
| A1 | | System detects that the registration period for the selected course is not open. |
| A2 | | System displays a message: *"Registration for this course is currently closed. Registration opens on [date]."* |
| A3 | | System returns the student to the course catalogue page. Use case ends. |

### Alternative Flow B: Course Is Full (at Step 4)

| Step | Actor Action | System Response |
|------|-------------|-----------------|
| B1 | | System detects that the course quota is zero. |
| B2 | | System displays a message: *"This course is full. You may join the waiting list."* |
| B3 | Student clicks **"Join Waiting List."** | |
| B4 | | System adds the student to the course waiting list with a timestamp. |
| B5 | | System displays confirmation: *"You have been added to the waiting list. You will be notified if a seat becomes available."* |
| B6 | | Use case ends. (The waiting list notification is a separate use case.) |

### Alternative Flow C: Schedule Conflict (at Step 5)

| Step | Actor Action | System Response |
|------|-------------|-----------------|
| C1 | | System detects a time conflict with an already-enrolled course. |
| C2 | | System displays a message: *"Schedule conflict: You are already enrolled in [Course Name] during this time slot."* |
| C3 | Student sees the conflict details and can choose to drop the conflicting course or cancel enrolment. | |
| C4 | Student clicks **"Cancel."** | |
| C5 | | System returns the student to the course catalogue page. Use case ends. |

### Alternative Flow D: Payment Failed (at Step 9)

| Step | Actor Action | System Response |
|------|-------------|-----------------|
| D1 | | Payment Gateway returns a failure response (insufficient funds, network timeout, card declined). |
| D2 | | System does NOT create an enrolment record. The database remains unchanged. |
| D3 | | System displays a message: *"Payment failed: [reason]. Please try again or use a different payment method."* |
| D4 | Student can retry payment or cancel. | |
| D5a | Student clicks **"Retry Payment."** | System returns to Step 8 of the main flow. |
| D5b | Student clicks **"Cancel."** | System returns to the course catalogue page. Use case ends. |

</section>

<section lang="id">

## 5. Alur Alternatif

Alur alternatif mendeskripsikan apa yang terjadi ketika happy path tidak dapat diikuti. Setiap alur alternatif merujuk ke langkah dalam skenario sukses utama di mana ia bercabang.

### Alur Alternatif A: Periode Pendaftaran Tertutup (di Langkah 3)

| Langkah | Aksi Aktor | Respons Sistem |
|---------|-----------|---------------|
| A1 | | Sistem mendeteksi bahwa periode pendaftaran untuk mata kuliah yang dipilih tidak terbuka. |
| A2 | | Sistem menampilkan pesan: *"Pendaftaran untuk mata kuliah ini saat ini ditutup. Pendaftaran dibuka pada [tanggal]."* |
| A3 | | Sistem mengembalikan mahasiswa ke halaman katalog mata kuliah. Use case berakhir. |

### Alur Alternatif B: Mata Kuliah Penuh (di Langkah 4)

| Langkah | Aksi Aktor | Respons Sistem |
|---------|-----------|---------------|
| B1 | | Sistem mendeteksi bahwa kuota mata kuliah adalah nol. |
| B2 | | Sistem menampilkan pesan: *"Mata kuliah ini penuh. Anda dapat bergabung dengan daftar tunggu."* |
| B3 | Mahasiswa mengklik **"Gabung Daftar Tunggu."** | |
| B4 | | Sistem menambahkan mahasiswa ke daftar tunggu mata kuliah dengan timestamp. |
| B5 | | Sistem menampilkan konfirmasi: *"Anda telah ditambahkan ke daftar tunggu. Anda akan diberitahu jika kursi tersedia."* |
| B6 | | Use case berakhir. (Notifikasi daftar tunggu adalah use case terpisah.) |

### Alur Alternatif C: Konflik Jadwal (di Langkah 5)

| Langkah | Aksi Aktor | Respons Sistem |
|---------|-----------|---------------|
| C1 | | Sistem mendeteksi konflik waktu dengan mata kuliah yang sudah terdaftar. |
| C2 | | Sistem menampilkan pesan: *"Konflik jadwal: Anda sudah terdaftar di [Nama Mata Kuliah] selama slot waktu ini."* |
| C3 | Mahasiswa melihat detail konflik dan dapat memilih untuk drop mata kuliah yang bentrok atau membatalkan pendaftaran. | |
| C4 | Mahasiswa mengklik **"Batal."** | |
| C5 | | Sistem mengembalikan mahasiswa ke halaman katalog mata kuliah. Use case berakhir. |

### Alur Alternatif D: Pembayaran Gagal (di Langkah 9)

| Langkah | Aksi Aktor | Respons Sistem |
|---------|-----------|---------------|
| D1 | | Payment Gateway mengembalikan respons kegagalan (dana tidak cukup, timeout jaringan, kartu ditolak). |
| D2 | | Sistem TIDAK membuat catatan pendaftaran. Database tetap tidak berubah. |
| D3 | | Sistem menampilkan pesan: *"Pembayaran gagal: [alasan]. Silakan coba lagi atau gunakan metode pembayaran yang berbeda."* |
| D4 | Mahasiswa dapat mencoba ulang pembayaran atau membatalkan. | |
| D5a | Mahasiswa mengklik **"Coba Lagi."** | Sistem kembali ke Langkah 8 dari alur utama. |
| D5b | Mahasiswa mengklik **"Batal."** | Sistem kembali ke halaman katalog mata kuliah. Use case berakhir. |

</section>

---

<section lang="en">

## 6. Scenario Best Practices

Writing a good use case scenario is a skill. Here are guidelines refined from industry practice:

### Atomic Steps
Each step should be a single interaction. Never combine "System validates credentials and redirects to dashboard" into one step — those are two distinct actions that can fail independently.

### Active Voice
Write from the system's perspective using active voice. "System validates the student's login credentials" is clearer than "The student's login credentials are validated."

### No UI Details
Avoid mentioning specific UI elements like "clicks the blue button" or "selects from dropdown." Say "clicks Enrol" or "enters payment details." The scenario describes *what* happens, not *how* the UI looks.

### Technology-Agnostic
The scenario should not mention Laravel, MySQL, or any specific technology. Those decisions come during design and implementation (Parts 4 and 5 of this series).

### Testable
Every system response should be something a tester can verify. "System is fast" is not a testable step. "System responds within 3 seconds" is.

### Complete Alternative Flows
For every `if` condition in the main flow, there should be a corresponding alternative flow. Two common categories:

| Alternative Flow Type | Example |
|---|---|
| **Validation failure** | Invalid input, expired credentials, quota exhausted |
| **System failure** | Payment gateway timeout, database unavailable, network error |
| **User cancellation** | Student decides not to proceed at confirmation step |

</section>

<section lang="id">

## 6. Praktik Terbaik Skenario

Menulis use case scenario yang baik adalah sebuah keterampilan. Berikut adalah panduan yang disempurnakan dari praktik industri:

### Langkah Atomik
Setiap langkah harus berupa interaksi tunggal. Jangan pernah menggabungkan "Sistem memvalidasi kredensial dan mengarahkan ke dashboard" menjadi satu langkah — itu adalah dua aksi berbeda yang dapat gagal secara independen.

### Kalimat Aktif
Tulis dari perspektif sistem menggunakan kalimat aktif. "Sistem memvalidasi kredensial login mahasiswa" lebih jelas daripada "Kredensial login mahasiswa divalidasi."

### Tanpa Detail UI
Hindari menyebutkan elemen UI spesifik seperti "mengklik tombol biru" atau "memilih dari dropdown." Katakan "mengklik Daftar" atau "memasukkan detail pembayaran." Skenario mendeskripsikan *apa* yang terjadi, bukan *bagaimana* tampilan UI.

### Agnostik Teknologi
Skenario tidak boleh menyebutkan Laravel, MySQL, atau teknologi spesifik apa pun. Keputusan tersebut datang selama desain dan implementasi (Bagian 4 dan 5 dari seri ini).

### Dapat Diuji
Setiap respons sistem harus menjadi sesuatu yang dapat diverifikasi oleh tester. "Sistem cepat" bukanlah langkah yang dapat diuji. "Sistem merespons dalam waktu 3 detik" adalah.

### Alur Alternatif Lengkap
Untuk setiap kondisi `if` dalam alur utama, harus ada alur alternatif yang sesuai. Dua kategori umum:

| Tipe Alur Alternatif | Contoh |
|---|---|
| **Kegagalan validasi** | Input tidak valid, kredensial kedaluwarsa, kuota habis |
| **Kegagalan sistem** | Timeout payment gateway, database tidak tersedia, error jaringan |
| **Pembatalan pengguna** | Mahasiswa memutuskan untuk tidak melanjutkan di langkah konfirmasi |

</section>

---

<section lang="en">

## 7. From Scenario to Diagrams

The use case scenario you just read is the **source of truth** for all downstream design work:

- **Activity Diagram (Part 3):** The steps in the main success scenario and alternative flows map directly to actions and decision nodes in the activity diagram. We will visualise the entire enrolment workflow with swimlanes.
- **Sequence Diagram (Part 4):** Steps 8–12 of the main flow show interactions between four objects: Student, EnrolmentController, PaymentGateway, and the Database. The sequence diagram will show these messages in chronological order.
- **Class Diagram (Part 5):** The nouns in the scenario — Student, Course, Enrolment, Payment — become the classes in our class diagram and ultimately the Eloquent models in Laravel.

This traceability is the power of UML. Every diagram connects back to a line in this scenario, which connects back to a stakeholder's requirement.

</section>

<section lang="id">

## 7. Dari Skenario ke Diagram

Use case scenario yang baru saja Anda baca adalah **sumber kebenaran** untuk semua pekerjaan desain selanjutnya:

- **Activity Diagram (Bagian 3):** Langkah-langkah dalam skenario sukses utama dan alur alternatif dipetakan langsung ke aksi dan decision node dalam activity diagram. Kita akan memvisualisasikan seluruh alur kerja pendaftaran dengan swimlanes.
- **Sequence Diagram (Bagian 4):** Langkah 8–12 dari alur utama menunjukkan interaksi antara empat objek: Student, EnrolmentController, PaymentGateway, dan Database. Sequence diagram akan menunjukkan pesan-pesan ini dalam urutan kronologis.
- **Class Diagram (Bagian 5):** Kata benda dalam skenario — Student, Course, Enrolment, Payment — menjadi kelas-kelas dalam class diagram kita dan akhirnya menjadi Eloquent model di Laravel.

Ketertelusuran inilah kekuatan UML. Setiap diagram terhubung kembali ke sebuah baris dalam skenario ini, yang terhubung kembali ke persyaratan stakeholder.

</section>

---

<nav aria-label="Series navigation" class="mt-8 p-4 bg-neutral-50 dark:bg-gray-800 rounded-lg border border-neutral-200 dark:border-gray-700">
  <p class="font-semibold mb-2">
    <span lang="en">Continue the series:</span>
    <span lang="id">Lanjutkan seri:</span>
  </p>
  <div class="text-sm flex justify-between">
    <span>
      <span lang="en"><strong>Previous:</strong> <a href="/blog/uml-series-part-1-introduction-use-case">← Part 1: Introduction to UML & Use Case Diagram</a></span>
      <span lang="id"><strong>Sebelumnya:</strong> <a href="/blog/uml-series-part-1-introduction-use-case">← Bagian 1: Pengenalan UML & Use Case Diagram</a></span>
    </span>
    <span>
      <span lang="en"><strong>Next:</strong> <a href="/blog/uml-series-part-3-activity-diagram">Part 3: Activity Diagram →</a></span>
      <span lang="id"><strong>Selanjutnya:</strong> <a href="/blog/uml-series-part-3-activity-diagram">Bagian 3: Activity Diagram →</a></span>
    </span>
  </div>
</nav>
