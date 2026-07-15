---
title: "Skripsi Mini Series Part 3: Metodologi Pengembangan (Development Methodology)"
titleId: "Seri Mini Skripsi Bagian 3: Metodologi Pengembangan"
date: 2026-07-14
updated: 2026-07-14
category: tutorial
author: SE Lab
lang: en
featured: false
excerpt: "Part 3 of the Skripsi Mini Series. Learn how to write BAB III (Metodologi Pengembangan): choosing a development method, drawing the Alur Penelitian, and precisely defining metrics and instruments, with a week-by-week timeline to finish on time."
excerptId: "Bagian 3 dari Seri Mini Skripsi. Pelajari cara menulis BAB III (Metodologi Pengembangan): memilih metode pengembangan, menggambar Alur Penelitian, dan mendefinisikan metrik serta instrumen secara presisi, dengan linimasa mingguan agar selesai tepat waktu."
stream: se-methodologies-architecture
tags:
  - Skripsi
  - Research Methodology
  - Laravel
  - Software Engineering
tagsId:
  - Skripsi
  - Metodologi Penelitian
  - Laravel
  - Rekayasa Perangkat Lunak
series: skripsi-mini-series
seriesOrder: 3
---

<section lang="en">

## 1. What is BAB III: Metodologi Pengembangan (Development Methodology)?

**BAB III (Metodologi Pengembangan)** is the chapter that turns your BAB I questions into a concrete, executable **plan**. Where BAB I asked *what* you want to know, BAB III answers *how* you will find out, and, critically, *how you will measure it*. A typical Polinema JTI Metodologi chapter covers:

| Subsection | Purpose |
|---|---|
| **3.1 Alur Penelitian (Research Flow)** | A visual flow of every research phase, start to finish |
| **3.2 Lokasi dan Waktu Penelitian (Location and Time of Research)** | Where and when the work happens |
| **3.3 Metode Pengumpulan Data (Data Collection Method)** | How you will gather requirements, reference material, and measurement data |
| **3.4 Metode Pengembangan Sistem (System Development Method)** | Which SDLC model you follow to build the system |
| **3.x Analisis** (metrics/instruments) | Precisely what you will measure and with what tools |
| **3.7 Pengujian (Testing)** | How correctness and comparison will be validated |

Get this chapter wrong and everything downstream suffers: an undefined metric in BAB III cannot be reported credibly in BAB VI.

</section>

<section lang="id">

## 1. Apa Itu BAB III: Metodologi Pengembangan?

**BAB III (Metodologi Pengembangan)** adalah bab yang mengubah pertanyaan BAB I Anda menjadi **rencana** yang konkret dan dapat dieksekusi. Jika BAB I menanyakan *apa* yang ingin Anda ketahui, BAB III menjawab *bagaimana* Anda akan mengetahuinya, dan, yang krusial, *bagaimana Anda akan mengukurnya*. Bab Metodologi JTI Polinema yang tipikal mencakup:

| Subbab | Tujuan |
|---|---|
| **3.1 Alur Penelitian** | Alur visual dari setiap fase penelitian, dari awal hingga akhir |
| **3.2 Lokasi dan Waktu Penelitian** | Di mana dan kapan pekerjaan dilakukan |
| **3.3 Metode Pengumpulan Data** | Bagaimana Anda mengumpulkan kebutuhan, materi referensi, dan data pengukuran |
| **3.4 Metode Pengembangan Sistem** | Model SDLC mana yang Anda ikuti untuk membangun sistem |
| **3.x Analisis** (metrik/instrumen) | Persis apa yang akan Anda ukur dan dengan tool apa |
| **3.7 Pengujian** | Bagaimana kebenaran dan perbandingan akan divalidasi |

Jika penulisan bab ini keliru, semua yang mengikutinya akan terdampak: metrik yang tidak terdefinisi di BAB III tidak dapat dilaporkan secara kredibel di BAB VI.

</section>

---

<section lang="en">

## 2. Why Getting Metodologi Right Matters

### What is it?
Metodologi is the operational contract for your project: a defined process, a defined timeline, and defined instruments, the same discipline a software team applies before a sprint begins.

### Why does it matter?
- **It is the single biggest lever for finishing on time.** A named methodology with phases and a timeline turns "build a Todo app" into a checklist you can actually track week by week.
- **It makes your comparison defensible.** Without a precisely defined metric ("cyclomatic complexity, measured with PHPMD, averaged per method"), a reviewer cannot tell if your BAB VI numbers mean anything.
- **It is reused as your instrument, not just described.** Whatever you define here (the tools, the formulas) you must actually run in BAB V and report in BAB VI. Vague definitions here become impossible measurements later.

### When do you use it?
Draft it right after BAB II theory is stable, since your metrics (3.x) must be theoretically justified (cyclomatic complexity is valid *because* of the theory in BAB II Section 2.2.5). Revisit the timeline weekly throughout the semester as an actual project-tracking tool, not a one-time document.

### Where does it fit?
Metodologi's outputs are consumed everywhere downstream: 3.4 (development method) shapes how BAB IV/V are organised; 3.x (metrics) defines exactly what BAB VI must report; 3.7 (testing approach) defines the Blackbox/UAT scenarios detailed in BAB IV Section 4.4 and executed in BAB V Section 5.5.

### How do you create one?
1. Draw the Alur Penelitian as a single diagram covering every phase.
2. State location/time (often just "Laboratorium SE, Polinema, semester genap 2026").
3. Name your data-collection methods (literature study, tool documentation, direct measurement).
4. Choose and justify a development methodology.
5. Define every metric with an exact formula/tool: no metric without a measurement procedure.
6. Describe your testing approach at a methodological level (details go in BAB IV).

</section>

<section lang="id">

## 2. Mengapa Menulis Metodologi dengan Benar Itu Penting?

### Apa itu?
Metodologi adalah kontrak operasional untuk proyek Anda: proses yang terdefinisi, linimasa yang terdefinisi, dan instrumen yang terdefinisi, disiplin yang sama yang diterapkan tim software sebelum sprint dimulai.

### Mengapa penting?
- **Ini adalah faktor terpenting untuk selesai tepat waktu.** Metodologi yang diberi nama, lengkap dengan fase dan linimasa, mengubah "bangun aplikasi Todo" menjadi daftar periksa yang benar-benar bisa Anda lacak minggu demi minggu.
- **Membuat perbandingan Anda dapat dipertahankan.** Tanpa metrik yang terdefinisi secara presisi ("cyclomatic complexity, diukur dengan PHPMD, dirata-ratakan per method"), peninjau tidak dapat menilai apakah angka BAB VI Anda berarti sesuatu.
- **Digunakan kembali sebagai instrumen Anda, bukan hanya dideskripsikan.** Apa pun yang Anda definisikan di sini (tool, formula) harus benar-benar Anda jalankan di BAB V dan laporkan di BAB VI. Definisi yang kabur di sini menjadi pengukuran yang mustahil nanti.

### Kapan digunakan?
Susun segera setelah teori BAB II stabil, karena metrik Anda (3.x) harus dijustifikasi secara teoretis (cyclomatic complexity valid *karena* teori di BAB II bagian 2.2.5). Tinjau ulang linimasa mingguan sepanjang semester sebagai alat pelacakan yang sesungguhnya bagi proyek Anda, bukan dokumen sekali jadi.

### Di mana tempatnya?
Keluaran Metodologi digunakan di berbagai bagian selanjutnya: 3.4 (metode pengembangan) membentuk bagaimana BAB IV/V diorganisasikan; 3.x (metrik) mendefinisikan persis apa yang harus dilaporkan BAB VI; 3.7 (pendekatan pengujian) mendefinisikan skenario Blackbox/UAT yang dirinci di BAB IV bagian 4.4 dan dijalankan di BAB V bagian 5.5.

### Bagaimana membuatnya?
1. Gambar Alur Penelitian sebagai satu diagram yang mencakup setiap fase.
2. Nyatakan lokasi/waktu (seringnya cukup "Laboratorium SE, Polinema, semester genap 2026").
3. Sebutkan metode pengumpulan data Anda (studi literatur, dokumentasi tool, pengukuran langsung).
4. Pilih dan justifikasi metode pengembangan.
5. Definisikan setiap metrik dengan formula/tool yang persis: tidak ada metrik tanpa prosedur pengukuran.
6. Deskripsikan pendekatan pengujian Anda pada level metodologis (detail masuk ke BAB IV).

</section>

---

<section lang="en">

## 3. Continuing Our Example: Alur Penelitian and Timeline

### 3.1 Alur Penelitian

```plantuml
@startuml
skinparam backgroundColor #FFFFFF
skinparam activity {
  BackgroundColor #dbeafe
  BorderColor #2563eb
  FontColor #0f172a
  DiamondBackgroundColor #fef3c7
  DiamondBorderColor #d97706
}
skinparam arrow {
  Color #475569
  FontColor #0f172a
}

start
:Identifikasi Masalah\n(BAB I);
:Studi Literatur &\nDasar Teori\n(BAB II);
:Analisis Kebutuhan\n& Perancangan Sistem\n(BAB IV);
:Implementasi\nAction Pattern\n(BAB V);
:Pengujian Blackbox & UAT;
:Pengukuran Metrik &\nPerbandingan terhadap\nAmbang Batas Literatur;
:Analisis & Pembahasan\nHasil (BAB VI);
:Penarikan Kesimpulan\n(BAB VII);
stop
@enduml
```

### 3.2 Lokasi dan Waktu Penelitian

State this plainly: e.g. *"Penelitian dilakukan secara mandiri menggunakan environment pengembangan lokal, selama semester genap 2026, dari minggu ke-1 hingga minggu ke-16."*

### Suggested Timeline (16-week semester)

| Week | Milestone |
|---|---|
| 1–2 | Finalise BAB I (Latar Belakang, Rumusan Masalah, Batasan Masalah) |
| 3–4 | Studi Literatur + Dasar Teori (BAB II) |
| 5 | Seminar proposal |
| 6–7 | Analisis Kebutuhan + start Perancangan (BAB IV) |
| 8–9 | Finish Perancangan: UML diagrams, DB schema, UI wireframes, test scenarios |
| 10–11 | Implementasi Action Pattern (BAB V) |
| 12 | Buffer week: review with **pembimbing** (thesis advisor), catch-up slack (freed up by building only one implementation instead of two) |
| 13 | Pengujian: Blackbox, UAT, metric measurement |
| 14 | Analisis hasil, draft BAB VI |
| 15 | Draft BAB VII, finalise full manuscript |
| 16 | Sidang (defense) |

> **Time-boxing tip:** if week 9 arrives and Perancangan is not finished, that is your earliest, cheapest signal to revisit Batasan Masalah (Part 1): cut scope now, not in week 14.

</section>

<section lang="id">

## 3. Melanjutkan Contoh Berkelanjutan Ini: Alur Penelitian dan Linimasa

### 3.1 Alur Penelitian

```plantuml
@startuml
skinparam backgroundColor #FFFFFF
skinparam activity {
  BackgroundColor #dbeafe
  BorderColor #2563eb
  FontColor #0f172a
  DiamondBackgroundColor #fef3c7
  DiamondBorderColor #d97706
}
skinparam arrow {
  Color #475569
  FontColor #0f172a
}

start
:Identifikasi Masalah\n(BAB I);
:Studi Literatur &\nDasar Teori\n(BAB II);
:Analisis Kebutuhan\n& Perancangan Sistem\n(BAB IV);
:Implementasi\nAction Pattern\n(BAB V);
:Pengujian Blackbox & UAT;
:Pengukuran Metrik &\nPerbandingan terhadap\nAmbang Batas Literatur;
:Analisis & Pembahasan\nHasil (BAB VI);
:Penarikan Kesimpulan\n(BAB VII);
stop
@enduml
```

### 3.2 Lokasi dan Waktu Penelitian

Nyatakan ini secara langsung: mis. *"Penelitian dilakukan secara mandiri menggunakan lingkungan pengembangan lokal, selama semester genap 2026, dari minggu ke-1 hingga minggu ke-16."*

### Linimasa yang Disarankan (semester 16 minggu)

| Minggu | Milestone |
|---|---|
| 1–2 | Finalisasi BAB I (Latar Belakang, Rumusan Masalah, Batasan Masalah) |
| 3–4 | Studi Literatur + Dasar Teori (BAB II) |
| 5 | Seminar proposal |
| 6–7 | Analisis Kebutuhan + mulai Perancangan (BAB IV) |
| 8–9 | Selesaikan Perancangan: diagram UML, skema DB, wireframe UI, skenario pengujian |
| 10–11 | Implementasi Action Pattern (BAB V) |
| 12 | Minggu buffer: tinjauan bersama pembimbing, waktu cadangan (dihemat karena hanya membangun satu implementasi, bukan dua) |
| 13 | Pengujian: Blackbox, UAT, pengukuran metrik |
| 14 | Analisis hasil, draf BAB VI |
| 15 | Draf BAB VII, finalisasi naskah lengkap |
| 16 | Sidang |

> **Tips time-boxing:** jika minggu ke-9 tiba dan Perancangan belum selesai, itu adalah sinyal termurah dan paling awal untuk meninjau ulang Batasan Masalah (Bagian 1): potong ruang lingkup sekarang, bukan di minggu ke-14.

</section>

---

<section lang="en">

## 4. Writing BAB III Section by Section

### 3.3 Metode Pengumpulan Data (Data Collection Method)

Name your actual sources: literature study (BAB II sources), official framework documentation (Laravel docs), and (specific to a measurement-based project) **direct instrumentation**: running static-analysis tools against your own code.

### 3.4 Metode Pengembangan Sistem (System Development Method)

We use **Prototyping**, a natural fit for a solo, time-boxed **mini-skripsi** (course-scale thesis project) built around a single analyze-design-build-evaluate loop. Prototyping's phases, adapted for a solo student:

1. **Requirements Gathering & Analysis**: BAB I/II output feeds directly in, alongside BAB IV's Analisis Kebutuhan.
2. **Quick Design**: BAB IV: UML diagrams, DB schema, UI wireframes, just enough design to start building, refined iteratively with your pembimbing acting as the "user" stakeholder.
3. **Build Prototype**: BAB V: build the Action Pattern implementation, test continuously rather than in one block at the end.
4. **Evaluation**: BAB VI: Blackbox/UAT testing plus metric measurement against literature thresholds. If evaluation reveals issues, Prototyping allows refining the design and rebuilding, an honest, natural fit for a scoped mini-skripsi, unlike a rigid waterfall.
5. **Finalise & Document**: final integration, BAB VI conclusions, and BAB VII.

Because Prototyping iterates, expect to build more than one version of your prototype as evaluation surfaces gaps. Document this with a compact Iteration Log in BAB V (Section 5.4), not a full diagram-and-code narrative per version; Part 5 shows exactly what that looks like.

Justify your own choice. Waterfall, Scrum/Agile, and RAD are equally valid if you argue why they fit your project's constraints (team size, timeline, requirement volatility) better.

### 3.5 Defining Metrics (Research Instrument)

This is the section most projects under-specify. Each metric needs a **name, a formula/tool, and a unit**: nothing vague like "we will measure code quality."

| Metric | Definition | Tool | Unit | Threshold (literature) |
|---|---|---|---|---|
| **Cyclomatic Complexity** | Number of independent linear paths through a method (McCabe) | PHPMD (`codesize` ruleset) | integer per method, reported as average | ≤ 10 per method (McCabe, 1976) |
| **Coupling** | Count of distinct external classes a class directly depends on (CBO-style) | PHPMD (`design` ruleset) / manual review | integer per class, reported as average | single digits as a rule of thumb (no single canonical source); find and cite your own defensible threshold |
| **Lines of Code per Method** | Executable lines within a method body | PHPMD / manual count | LOC, reported as average | ≈ 20 lines or fewer (Martin, *Clean Code*, 2008) |
| **Test Coverage** | Percentage of executable lines exercised by the unit test suite | PHPUnit with Xdebug/PCOV coverage driver | percentage | ≥ 80% (common industry target) |

### 3.7 Pengujian (Testing)

State, at a methodological level: the implementation will be validated with **Black Box Testing** (functional correctness) and **User Acceptance Testing** (does the end result meet user expectations). The detailed scenario tables belong in BAB IV Section 4.4: this section only states the approach and acceptance criteria (e.g., "seluruh skenario Blackbox harus lulus; indeks penerimaan UAT ≥ 80%").

</section>

<section lang="id">

## 4. Menulis BAB III Subbab demi Subbab

### 3.3 Metode Pengumpulan Data (Data Collection Method)

Sebutkan sumber Anda yang sebenarnya: studi literatur (sumber BAB II), dokumentasi resmi framework (dokumentasi Laravel), dan (spesifik untuk proyek berbasis pengukuran) **instrumentasi langsung**: menjalankan tool static-analysis terhadap kode Anda sendiri.

### 3.4 Metode Pengembangan Sistem (System Development Method)

Penelitian ini menggunakan **Prototyping**, cocok secara alami untuk mini-skripsi solo yang time-boxed, dibangun di sekitar satu putaran analisis-desain-bangun-evaluasi. Fase Prototyping, disesuaikan untuk mahasiswa solo:

1. **Requirements Gathering & Analysis**: output BAB I/II langsung masuk ke sini, bersama Analisis Kebutuhan BAB IV.
2. **Quick Design**: BAB IV: diagram UML, skema DB, wireframe UI, cukup untuk mulai membangun, disempurnakan secara iteratif dengan pembimbing Anda berperan sebagai pemangku kepentingan "pengguna".
3. **Build Prototype**: BAB V: bangun implementasi Action Pattern, uji secara berkelanjutan, bukan dalam satu blok di akhir.
4. **Evaluation**: BAB VI: pengujian Blackbox/UAT ditambah pengukuran metrik terhadap ambang batas literatur. Jika evaluasi mengungkap masalah, Prototyping memungkinkan penyempurnaan desain dan pembangunan ulang, sangat cocok untuk mini-skripsi berskala kecil, tidak seperti waterfall yang kaku.
5. **Finalise & Document**: integrasi akhir, kesimpulan BAB VI, dan BAB VII.

Karena Prototyping bersifat iteratif, Anda perlu bersiap membangun lebih dari satu versi prototipe seiring evaluasi mengungkap kesenjangan. Dokumentasikan ini dengan Log Iterasi ringkas di BAB V (bagian 5.4), bukan narasi diagram-dan-kode lengkap per versi; Bagian 5 menunjukkan persis seperti apa bentuknya.

Justifikasi pilihan Anda sendiri. Waterfall, Scrum/Agile, dan RAD sama validnya jika Anda berargumen mengapa metode itu lebih cocok dengan kendala proyek Anda (ukuran tim, linimasa, volatilitas kebutuhan).

### 3.5 Mendefinisikan Metrik (Instrumen Penelitian)

Ini adalah bagian yang paling sering kurang spesifik di kebanyakan proyek. Setiap metrik membutuhkan **nama, formula/tool, dan satuan**: bukan hal kabur seperti "kami akan mengukur kualitas kode."

| Metrik | Definisi | Tool | Satuan | Ambang Batas (literatur) |
|---|---|---|---|---|
| **Cyclomatic Complexity** | Jumlah jalur linear independen melalui sebuah method (McCabe) | PHPMD (ruleset `codesize`) | integer per method, dilaporkan sebagai rata-rata | ≤ 10 per method (McCabe, 1976) |
| **Coupling** | Jumlah kelas eksternal berbeda yang secara langsung bergantung pada sebuah kelas (gaya CBO) | PHPMD (ruleset `design`) / tinjauan manual | integer per kelas, dilaporkan sebagai rata-rata | angka tunggal (single digit) sebagai rule of thumb (tidak ada sumber kanonik tunggal); temukan dan kutip sumber Anda sendiri yang dapat dipertanggungjawabkan |
| **Lines of Code per Method** | Baris eksekutabel dalam badan sebuah method | PHPMD / hitung manual | LOC, dilaporkan sebagai rata-rata | ≈ 20 baris atau kurang (Martin, *Clean Code*, 2008) |
| **Test Coverage** | Persentase baris eksekutabel yang dijalankan oleh test suite unit | PHPUnit dengan coverage driver Xdebug/PCOV | persentase | ≥ 80% (target umum industri) |

### 3.7 Pengujian

Nyatakan, pada level metodologis: implementasi akan divalidasi dengan **Black Box Testing** (kebenaran fungsional) dan **User Acceptance Testing** (apakah hasil akhir memenuhi ekspektasi pengguna). Tabel skenario detail masuk ke BAB IV bagian 4.4: bagian ini hanya menyatakan pendekatan dan kriteria penerimaan (mis., "seluruh skenario Blackbox harus lulus; indeks penerimaan UAT ≥ 80%").

</section>

---

<section lang="en">

## 5. Self-Check: Is Your Metodologi Ready?

1. Does the Alur Penelitian diagram include every phase you will actually go through, no hidden steps?
2. Does every metric have a name, a formula or tool, and a unit? If you can't say "measured how," it isn't defined yet.
3. Is your chosen SDLC model justified (not just named) for *your* project's constraints?
4. Does your timeline account for review/revision cycles with your pembimbing, not just "build" time?
5. Would a classmate be able to reproduce your measurement procedure exactly from this chapter alone?

</section>

<section lang="id">

## 5. Periksa Sendiri: Apakah Metodologi Anda Siap?

1. Apakah diagram Alur Penelitian mencakup setiap fase yang benar-benar akan Anda lalui, tanpa langkah tersembunyi?
2. Apakah setiap metrik punya nama, formula atau tool, dan satuan? Jika Anda tidak bisa menyebut "diukur bagaimana," berarti belum terdefinisi.
3. Apakah model SDLC yang Anda pilih dijustifikasi (bukan hanya disebutkan) untuk kendala proyek *Anda*?
4. Apakah linimasa Anda memperhitungkan siklus tinjauan/revisi dengan pembimbing, bukan hanya waktu "membangun"?
5. Bisakah teman sekelas mereproduksi prosedur pengukuran Anda persis hanya dari bab ini?

</section>

---

<section lang="en">

## 6. Common Mistakes in BAB III

| Mistake | Why It Is Wrong | Correct Approach |
|---|---|---|
| **Alur Penelitian copied from a generic template** | A diagram with steps you won't actually follow is dishonest and confuses your own planning. | Draw your actual phases, specific to your project's build-and-evaluate structure. |
| **"We will measure code quality" with no metric named** | Unmeasurable: a reviewer cannot check your BAB VI numbers against anything. | Name each metric explicitly with a formula/tool, as in Section 4. |
| **Choosing a methodology without justification** | "We use Agile" with no reasoning is a name-drop, not a methodological choice. | State why the chosen method fits your team size, timeline, and requirement stability. |
| **No timeline, or a timeline with no buffer** | Without weekly milestones, scope creep is invisible until it's too late to correct. | Build a week-by-week table with review checkpoints, and revisit it: this is a living document. |
| **Testing approach only described in BAB V, never planned in BAB III** | Test scenarios invented after the code is written tend to test what the code *does*, not what it *should* do. | Define acceptance criteria in BAB III Section 3.7 before writing implementation code. |

</section>

<section lang="id">

## 6. Kesalahan Umum dalam BAB III

| Kesalahan | Mengapa Salah | Pendekatan yang Benar |
|---|---|---|
| **Alur Penelitian disalin dari template generik** | Diagram dengan langkah yang tidak benar-benar Anda ikuti tidak jujur dan membingungkan perencanaan Anda sendiri. | Gambar fase Anda yang sebenarnya, spesifik untuk struktur bangun-lalu-evaluasi proyek Anda. |
| **"Kami akan mengukur kualitas kode" tanpa metrik yang disebutkan** | Tidak terukur: peninjau tidak dapat memeriksa angka BAB VI Anda terhadap apa pun. | Sebutkan setiap metrik secara eksplisit dengan formula/tool, seperti di Bagian 4. |
| **Memilih metodologi tanpa justifikasi** | "Kami menggunakan Agile" tanpa alasan hanyalah name-drop, bukan pilihan metodologis. | Nyatakan mengapa metode yang dipilih cocok dengan ukuran tim, linimasa, dan stabilitas kebutuhan Anda. |
| **Tidak ada linimasa, atau linimasa tanpa buffer** | Tanpa milestone mingguan, scope creep tidak terlihat sampai terlambat untuk dikoreksi. | Buat tabel mingguan dengan checkpoint tinjauan, dan tinjau ulang: ini adalah dokumen hidup. |
| **Pendekatan pengujian hanya dideskripsikan di BAB V, tidak pernah direncanakan di BAB III** | Skenario pengujian yang dikarang setelah kode ditulis cenderung menguji apa yang kode *lakukan*, bukan apa yang *seharusnya* dilakukan. | Definisikan kriteria penerimaan di BAB III bagian 3.7 sebelum menulis kode implementasi. |

</section>

---

<section lang="en">

## 7. What Comes Next?

With a defined process, timeline, and, crucially, precisely defined metrics, we can now design the system itself. In Part 4, we cover **BAB IV (Analisis dan Perancangan Sistem, System Analysis and Design)**: requirements analysis, and the full UML design (Use Case, Activity, Class, Sequence diagrams) for our Action Pattern implementation, with Fat Controller kept as an explicitly labelled conceptual contrast, cross-linking the [UML Mini Series](/blog/uml-series-part-1-introduction-use-case).

</section>

<section lang="id">

## 7. Apa yang Akan Datang Selanjutnya?

Dengan proses, linimasa, dan, yang krusial, metrik yang terdefinisi secara presisi, sistem itu sendiri siap dirancang. Bagian 4 membahas **BAB IV (Analisis dan Perancangan Sistem)**: analisis kebutuhan, dan desain UML lengkap (diagram Use Case, Activity, Class, Sequence) untuk implementasi Action Pattern dalam penelitian ini, dengan Fat Controller dijaga sebagai kontras konseptual yang diberi label jelas, dengan tautan ke [Seri Mini UML](/blog/uml-series-part-1-introduction-use-case).

</section>
