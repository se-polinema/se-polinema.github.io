---
title: "Skripsi Mini Series Part 2: Landasan Teori (Literature Review & Theory)"
titleId: "Seri Mini Skripsi Bagian 2: Landasan Teori"
date: 2026-07-14
updated: 2026-07-14
category: tutorial
author: SE Lab
lang: en
featured: false
excerpt: "Part 2 of the Skripsi Mini Series. Learn how to write BAB II (Landasan Teori): running a real Studi Literatur, avoiding plagiarism, and building the Dasar Teori that grounds our Laravel Action Pattern comparison in existing knowledge."
excerptId: "Bagian 2 dari Seri Mini Skripsi. Pelajari cara menulis BAB II (Landasan Teori): menjalankan Studi Literatur yang sesungguhnya, menghindari plagiarisme, dan menyusun Dasar Teori yang mendasarkan perbandingan Action Pattern Laravel dalam penelitian ini pada pengetahuan yang sudah ada."
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
seriesOrder: 2
---

<section lang="en">

## 1. What is BAB II: Landasan Teori (Theoretical Foundation)?

**BAB II (Landasan Teori)** answers a different question than BAB I. BAB I argued *why your problem matters*; BAB II proves *you understand the concepts needed to solve it*, and *you know what other researchers have already tried*. It has two subsections:

| Subsection | Purpose |
|---|---|
| **2.1 Studi Literatur (Literature Review)** | A comparison table of prior related work: what others studied, how, and what gap remains for your project to fill. |
| **2.2 Dasar Teori (Theoretical Basis)** | Definitions and theory for every concept your project depends on, cited from credible sources. |

A common misconception is that BAB II is "the chapter where I explain what Laravel is." It is not a tutorial for the reader: it is **evidence that your project rests on solid ground**, and a **map of the gap** your **Rumusan Masalah (Research Questions)** (BAB I) sits in.

</section>

<section lang="id">

## 1. Apa Itu BAB II: Landasan Teori?

**BAB II (Landasan Teori)** menjawab pertanyaan yang berbeda dari BAB I. BAB I berargumen *mengapa masalah Anda penting*; BAB II membuktikan *Anda memahami konsep yang dibutuhkan untuk menyelesaikannya*, dan *Anda tahu apa yang sudah dicoba peneliti lain*. Bab ini memiliki dua subbab:

| Subbab | Tujuan |
|---|---|
| **2.1 Studi Literatur (Literature Review)** | Tabel perbandingan penelitian terkait sebelumnya: apa yang diteliti orang lain, bagaimana caranya, dan kesenjangan apa yang tersisa untuk diisi proyek Anda. |
| **2.2 Dasar Teori** | Definisi dan teori untuk setiap konsep yang menjadi landasan proyek Anda, dikutip dari sumber yang kredibel. |

Kesalahpahaman umum adalah menganggap BAB II sebagai "bab tempat saya menjelaskan apa itu Laravel." Bukan begitu: bab ini adalah **bukti bahwa proyek Anda berdiri di atas landasan yang kokoh**, dan **peta kesenjangan** tempat Rumusan Masalah Anda (BAB I) berada.

</section>

---

<section lang="en">

## 2. Why Getting Landasan Teori Right Matters

### What is it?
Landasan Teori is the bridge between "what has been established" (literature, theory) and "what you are about to test" (your Rumusan Masalah).

### Why does it matter?
- **It protects you from reinventing known findings.** If a comparable comparison already exists, your examiner will ask why yours is different: Studi Literatur is where you answer that *before* it is asked.
- **It supplies your vocabulary.** Every technical term you use in BAB III–VI (cyclomatic complexity, coupling, Action Pattern) must first be defined here, with a citation: using an undefined term later is an easy point deduction.
- **It is where plagiarism risk is highest.** Copy-pasted definitions without paraphrasing or citation are the single most common cause of failed Turnitin/plagiarism checks in skripsi.
- **It anchors your metrics.** In our example, the *reason* cyclomatic complexity and coupling are valid maintainability proxies is a theoretical claim (traceable to McCabe's 1976 complexity metric and Chidamber & Kemerer's coupling metrics), not something you get to assert for free in BAB III.

### When do you use it?
Start Studi Literatur searches **early** (in parallel with drafting BAB I) because what you find may reshape your Rumusan Masalah. Finalise Dasar Teori once your Rumusan Masalah and **Batasan Masalah (Scope and Limitations)** are stable, since it must cover exactly (and only) the concepts your finalised scope needs.

### Where does it fit?
Dasar Teori's concepts get **used**, not repeated, in every later chapter: BAB III cites theory to justify metric choices, BAB IV cites architecture/design theory (MVC, SOLID) to justify design decisions, BAB VI cites the same theory to interpret results.

### How do you create one?
1. Search academic databases (Google Scholar, Garuda, Sinta, ACM/IEEE Digital Library) using keywords from your Rumusan Masalah.
2. Read abstracts first; keep only papers relevant to your specific gap.
3. Fill a Studi Literatur comparison table (Section 4 below).
4. Write Dasar Teori subsections: one per concept your Rumusan Masalah/Batasan Masalah actually names.
5. Cite every claim; paraphrase, never copy verbatim without quotation.

</section>

<section lang="id">

## 2. Mengapa Menulis Landasan Teori dengan Benar Itu Penting?

### Apa itu?
Landasan Teori adalah jembatan antara "apa yang sudah mapan" (literatur, teori) dan "apa yang akan Anda uji" (Rumusan Masalah Anda).

### Mengapa penting?
- **Melindungi Anda dari menemukan ulang temuan yang sudah ada.** Jika perbandingan serupa sudah ada, penguji Anda akan bertanya mengapa penelitian Anda berbeda: Studi Literatur adalah tempat Anda menjawabnya *sebelum* ditanyakan.
- **Menyediakan kosakata Anda.** Setiap istilah teknis yang Anda gunakan di BAB III–VI (cyclomatic complexity, coupling, Action Pattern) harus didefinisikan di sini terlebih dahulu, dengan sitasi: menggunakan istilah tanpa definisi berisiko mudah mengurangi nilai Anda di bagian selanjutnya.
- **Di sinilah risiko plagiarisme tertinggi.** Definisi hasil copy-paste tanpa parafrase atau sitasi adalah penyebab paling umum kegagalan pemeriksaan Turnitin/plagiarisme dalam skripsi.
- **Menjadi dasar bagi metrik Anda.** Dalam penelitian ini, *alasan* cyclomatic complexity dan coupling menjadi proksi maintainability yang valid adalah klaim teoretis (dapat ditelusuri ke metrik kompleksitas McCabe 1976 dan metrik coupling Chidamber & Kemerer), bukan sesuatu yang bisa Anda asumsikan begitu saja di BAB III.

### Kapan digunakan?
Mulai pencarian Studi Literatur **sejak awal** (paralel dengan menyusun BAB I) karena apa yang Anda temukan dapat membentuk ulang Rumusan Masalah Anda. Finalisasi Dasar Teori setelah Rumusan Masalah dan Batasan Masalah Anda stabil, karena bab ini harus mencakup persis (dan hanya) konsep yang dibutuhkan ruang lingkup final Anda.

### Di mana tempatnya?
Konsep di Dasar Teori **digunakan**, bukan diulang, di setiap bab berikutnya: BAB III mengutip teori untuk menjustifikasi pilihan metrik, BAB IV mengutip teori arsitektur/desain (MVC, SOLID) untuk menjustifikasi keputusan desain, BAB VI mengutip teori yang sama untuk menginterpretasikan hasil.

### Bagaimana membuatnya?
1. Cari database akademik (Google Scholar, Garuda, Sinta, ACM/IEEE Digital Library) menggunakan kata kunci dari Rumusan Masalah Anda.
2. Baca abstrak terlebih dahulu; simpan hanya makalah yang relevan dengan kesenjangan spesifik Anda.
3. Isi tabel perbandingan Studi Literatur (Bagian 4 di bawah).
4. Tulis subbab Dasar Teori: satu per konsep yang benar-benar disebut Rumusan Masalah/Batasan Masalah Anda.
5. Kutip setiap klaim; parafrasekan, jangan pernah menyalin verbatim tanpa tanda kutip.

</section>

---

<section lang="en">

## 3. Continuing Our Example: What Theory Does Our Evaluation Need?

Our Rumusan Masalah (Part 1) names four concepts that must each get a Dasar Teori subsection: the **Action Pattern**, **maintainability** (as a measurable quality attribute), **testability**, and the **literature thresholds** we evaluate against. Working backward from Rumusan Masalah to a theory list is the fastest way to avoid writing theory you never use:

| Rumusan Masalah keyword | Required theory subsection |
|---|---|
| "Action Pattern" | 2.2.1 Laravel Framework & MVC · 2.2.2 Single Responsibility Principle · 2.2.3 The Action Pattern |
| "maintainability" | 2.2.4 Software Quality (ISO/IEC 25010) · 2.2.5 Cyclomatic Complexity · 2.2.6 Coupling |
| "testability" | 2.2.7 Unit Testing & Testability · 2.2.8 Black Box Testing and UAT |
| "ambang batas yang direkomendasikan literatur" | 2.2.9 Code Metric Thresholds |

Notice this list contains **nothing about Todo apps**: the domain (todos) is incidental; the theory is entirely about *evaluating an implementation against established standards*, which is the actual research contribution. This is a useful test for your own project: if a theory subsection doesn't trace back to a Rumusan Masalah keyword, cut it.

</section>

<section lang="id">

## 3. Melanjutkan Contoh Berkelanjutan Ini: Teori Apa yang Dibutuhkan Evaluasi dalam Penelitian Ini?

Rumusan Masalah penelitian ini (Bagian 1) menyebutkan empat konsep yang masing-masing harus mendapat subbab Dasar Teori: **Action Pattern**, **maintainability** (sebagai atribut kualitas yang terukur), **testability**, dan **ambang batas literatur** yang menjadi acuan evaluasi dalam penelitian ini. Bekerja mundur dari Rumusan Masalah ke daftar teori adalah cara tercepat menghindari menulis teori yang tidak pernah Anda gunakan:

| Kata kunci Rumusan Masalah | Subbab teori yang dibutuhkan |
|---|---|
| "Action Pattern" | 2.2.1 Framework Laravel & MVC · 2.2.2 Single Responsibility Principle · 2.2.3 Action Pattern |
| "maintainability" | 2.2.4 Kualitas Perangkat Lunak (ISO/IEC 25010) · 2.2.5 Cyclomatic Complexity · 2.2.6 Coupling |
| "testability" | 2.2.7 Unit Testing & Testability · 2.2.8 Black Box Testing dan UAT |
| "ambang batas yang direkomendasikan literatur" | 2.2.9 Ambang Batas Metrik Kode |

Perhatikan daftar ini **tidak menyebut apa pun tentang aplikasi Todo**: domain (todo) bersifat insidental; teorinya sepenuhnya tentang *evaluasi implementasi terhadap standar yang mapan*, yang merupakan kontribusi penelitian sebenarnya. Ini adalah tes berguna untuk proyek Anda sendiri: jika sebuah subbab teori tidak dapat ditelusuri kembali ke kata kunci Rumusan Masalah, hapus.

</section>

---

<section lang="en">

## 4. Writing BAB II Section by Section

### 2.1 Studi Literatur

Build a comparison table, not a summarised list. Each row is one prior study; columns force you to state the **gap** explicitly rather than leave it implied.

| Column | What it captures |
|---|---|
| **Peneliti & Tahun** | Author(s), publication year |
| **Judul** | Study title |
| **Metode/Fokus** | What they did: method, tool, or comparison used |
| **Hasil** | Their key finding |
| **Perbedaan dengan Penelitian Ini** | What your project does differently: different metric, different scale, different framework, different pattern |

Aim for 4–6 rows: enough to establish you searched broadly, few enough that each row is meaningfully discussed (not just pasted).

**On avoiding plagiarism:** never copy a sentence from an abstract into your table or prose. Read the finding, close the source, and write it in your own words from memory, then verify accuracy against the source. Use a reference manager (Zotero or Mendeley) from day one so every citation is tracked and formatted consistently; retrofitting citations at the end of the semester is a common cause of missed deadlines.

### 2.2 Dasar Teori

Write one subsection per concept identified in Section 3. For each:
1. **Define it**, citing a credible source (textbook, standard, peer-reviewed paper, not a random blog post).
2. **Explain why it is relevant** to your specific project in 1–2 sentences.
3. Stop. Do not pad with unrelated background: a 3-paragraph history of PHP does not belong in a subsection about the Action Pattern.

</section>

<section lang="id">

## 4. Menulis BAB II Subbab demi Subbab

### 2.1 Studi Literatur

Susun tabel perbandingan, bukan daftar ringkasan. Setiap baris adalah satu penelitian sebelumnya; kolom memaksa Anda menyatakan **kesenjangan** secara eksplisit, bukan dibiarkan tersirat.

| Kolom | Apa yang ditangkap |
|---|---|
| **Peneliti & Tahun** | Penulis, tahun publikasi |
| **Judul** | Judul penelitian |
| **Metode/Fokus** | Apa yang mereka lakukan: metode, tool, atau perbandingan yang digunakan |
| **Hasil** | Temuan kunci mereka |
| **Perbedaan dengan Penelitian Ini** | Apa yang dilakukan proyek Anda secara berbeda: metrik berbeda, skala berbeda, framework berbeda, pattern berbeda |

Targetkan 4–6 baris: cukup untuk menunjukkan Anda mencari secara luas, cukup sedikit agar setiap baris dibahas secara bermakna (bukan hanya ditempel).

**Tentang menghindari plagiarisme:** jangan pernah menyalin kalimat dari abstrak ke tabel atau prosa Anda. Baca temuannya, sisihkan sumbernya, dan tulis dengan kata-kata Anda sendiri dari ingatan, lalu verifikasi akurasinya terhadap sumber. Gunakan reference manager (Zotero atau Mendeley) sejak hari pertama agar setiap sitasi terlacak dan diformat secara konsisten; menambahkan sitasi belakangan di akhir semester adalah penyebab umum tenggat yang terlewat.

### 2.2 Dasar Teori

Tulis satu subbab per konsep yang teridentifikasi di Bagian 3. Untuk masing-masing:
1. **Definisikan**, mengutip sumber yang kredibel (buku teks, standar, paper peer-review, bukan blog post acak).
2. **Jelaskan mengapa relevan** dengan proyek spesifik Anda dalam 1–2 kalimat.
3. Berhenti. Jangan menambah dengan latar belakang yang tidak relevan: sejarah PHP tiga paragraf tidak pantas ada di subbab tentang Action Pattern.

</section>

---

<section lang="en">

## 5. Worked Example: Landasan Teori for Our Action Pattern Evaluation

**2.1 Studi Literatur (template: replace with real sources you find)**

| Peneliti & Tahun | Judul | Metode/Fokus | Hasil | Perbedaan dengan Penelitian Ini |
|---|---|---|---|---|
| *[cari studi 1]* | Studi tentang penerapan design pattern pada maintainability aplikasi web | Studi kasus, pengukuran cyclomatic complexity | Pattern X menurunkan kompleksitas rata-rata Y% | Penelitian ini fokus pada Action Pattern spesifik Laravel, bukan pattern umum |
| *[cari studi 2]* | Perbandingan arsitektur MVC dan layered architecture pada testability | Eksperimen terkontrol | Layered architecture meningkatkan test coverage | Penelitian ini mengevaluasi satu implementasi Action Pattern terhadap ambang batas literatur, bukan perbandingan A/B antar gaya arsitektur |
| *[cari studi 3]* | Evaluasi coupling pada aplikasi PHP skala kecil | Studi literatur + tooling statis | Coupling tinggi berkorelasi dengan bug density | Penelitian ini mengukur coupling sebagai proksi maintainability, bukan bug density |

> This table is a **structural template**. Fill each `[cari studi N]` row with an actual paper you located through Google Scholar, Garuda, or Sinta: never submit placeholder rows like these in a real skripsi.

**2.2 Dasar Teori (outline)**

- **2.2.1 Laravel Framework & MVC**: Laravel's Model-View-Controller structure and where business logic conventionally lives.
- **2.2.2 Single Responsibility Principle**: one of the SOLID principles; a class should have one reason to change (see our [Design Patterns with PHP](/blog/design-patterns-with-php) and [Clean Code Principles](/blog/clean-code-principles) tutorials for a deeper treatment).
- **2.2.3 The Action Pattern**: a design convention that extracts one business operation per invokable class, aligning with SRP.
- **2.2.4 Software Quality (ISO/IEC 25010)**: the standard's maintainability sub-characteristics: Modularity, Reusability, Analysability, Modifiability, Testability.
- **2.2.5 Cyclomatic Complexity**: McCabe's metric for counting independent paths through a method, as a maintainability proxy.
- **2.2.6 Coupling**: the degree of interdependency between classes; lower coupling is theorised to ease isolated changes and testing.
- **2.2.7 Unit Testing & Testability**: what makes code easy or hard to unit test in isolation.
- **2.2.8 Black Box Testing and UAT**: functional testing theory, used later in BAB IV/V to validate the implementation behaves correctly for end users.
- **2.2.9 Code Metric Thresholds**: established reference values used to judge whether a measured metric is acceptable: McCabe's (1976) cyclomatic complexity guideline (≤10 per method), Robert C. Martin's *Clean Code* (2008) guidance on short methods (~20 lines), and commonly cited industry test-coverage targets (~80%). Coupling has no single canonical threshold in the literature; a real thesis must locate and cite its own defensible source for this one.

</section>

<section lang="id">

## 5. Contoh Terapan: Landasan Teori untuk Evaluasi Action Pattern dalam Penelitian Ini

**2.1 Studi Literatur (template: ganti dengan sumber nyata yang Anda temukan)**

| Peneliti & Tahun | Judul | Metode/Fokus | Hasil | Perbedaan dengan Penelitian Ini |
|---|---|---|---|---|
| *[cari studi 1]* | Studi tentang penerapan design pattern pada maintainability aplikasi web | Studi kasus, pengukuran cyclomatic complexity | Pattern X menurunkan kompleksitas rata-rata Y% | Penelitian ini fokus pada Action Pattern spesifik Laravel, bukan pattern umum |
| *[cari studi 2]* | Perbandingan arsitektur MVC dan layered architecture pada testability | Eksperimen terkontrol | Layered architecture meningkatkan test coverage | Penelitian ini mengevaluasi satu implementasi Action Pattern terhadap ambang batas literatur, bukan perbandingan A/B antar gaya arsitektur |
| *[cari studi 3]* | Evaluasi coupling pada aplikasi PHP skala kecil | Studi literatur + tooling statis | Coupling tinggi berkorelasi dengan bug density | Penelitian ini mengukur coupling sebagai proksi maintainability, bukan bug density |

> Tabel ini adalah **template struktural**. Isi setiap baris `[cari studi N]` dengan makalah nyata yang Anda temukan melalui Google Scholar, Garuda, atau Sinta: jangan pernah menyerahkan baris placeholder seperti ini dalam skripsi sesungguhnya.

**2.2 Dasar Teori (kerangka)**

- **2.2.1 Framework Laravel & MVC**: struktur Model-View-Controller Laravel dan di mana business logic konvensional berada.
- **2.2.2 Single Responsibility Principle**: salah satu prinsip SOLID; sebuah kelas seharusnya punya satu alasan untuk berubah (lihat tutorial [Design Patterns with PHP](/blog/design-patterns-with-php) dan [Clean Code Principles](/blog/clean-code-principles) ini untuk pembahasan lebih dalam).
- **2.2.3 Action Pattern**: konvensi desain yang mengekstraksi satu operasi bisnis per kelas invokable, selaras dengan SRP.
- **2.2.4 Kualitas Perangkat Lunak (ISO/IEC 25010)**: subkarakteristik maintainability pada standar ini: Modularity, Reusability, Analysability, Modifiability, Testability.
- **2.2.5 Cyclomatic Complexity**: metrik McCabe untuk menghitung jalur independen melalui sebuah method, sebagai proksi maintainability.
- **2.2.6 Coupling**: derajat interdependensi antar kelas; coupling rendah secara teoretis memudahkan perubahan dan pengujian terisolasi.
- **2.2.7 Unit Testing & Testability**: apa yang membuat kode mudah atau sulit diuji secara unit secara terisolasi.
- **2.2.8 Black Box Testing dan UAT**: teori pengujian fungsional, digunakan nanti di BAB IV/V untuk memvalidasi implementasi berperilaku benar bagi pengguna akhir.
- **2.2.9 Ambang Batas Metrik Kode**: nilai acuan mapan yang digunakan untuk menilai apakah metrik terukur dapat diterima: panduan cyclomatic complexity McCabe (1976) (≤10 per method), panduan *Clean Code* Robert C. Martin (2008) tentang method yang singkat (~20 baris), dan target test coverage industri yang umum dikutip (~80%). Coupling tidak memiliki satu ambang batas kanonik tunggal dalam literatur; skripsi sesungguhnya harus menemukan dan mengutip sumbernya sendiri yang dapat dipertanggungjawabkan untuk metrik ini.

</section>

---

<section lang="en">

## 6. Self-Check: Is Your Landasan Teori Ready?

1. Does every Dasar Teori subsection trace back to a word actually used in your Rumusan Masalah or Batasan Masalah?
2. Does every Studi Literatur row end with a stated difference from your own project, not just a summary of theirs?
3. Is every direct quote inside quotation marks with a page number? Is everything else paraphrased in your own words?
4. Could you explain each theory concept out loud, from memory, without looking at your source? If not, you don't understand it well enough to cite it correctly.
5. Did you run your draft through your campus's plagiarism checker before submitting?

</section>

<section lang="id">

## 6. Periksa Sendiri: Apakah Landasan Teori Anda Siap?

1. Apakah setiap subbab Dasar Teori dapat ditelusuri kembali ke kata yang benar-benar digunakan di Rumusan Masalah atau Batasan Masalah Anda?
2. Apakah setiap baris Studi Literatur diakhiri dengan perbedaan yang dinyatakan dari proyek Anda sendiri, bukan hanya ringkasan penelitian mereka?
3. Apakah setiap kutipan langsung berada dalam tanda kutip dengan nomor halaman? Apakah semua yang lain diparafrasekan dengan kata-kata Anda sendiri?
4. Bisakah Anda menjelaskan setiap konsep teori secara lisan, dari ingatan, tanpa melihat sumber Anda? Jika tidak, Anda belum memahaminya cukup baik untuk mengutipnya dengan benar.
5. Apakah Anda menjalankan draf Anda melalui pemeriksa plagiarisme kampus sebelum menyerahkannya?

</section>

---

<section lang="en">

## 7. Common Mistakes in BAB II

| Mistake | Why It Is Wrong | Correct Approach |
|---|---|---|
| **Dasar Teori reads like a Wikipedia dump** | Copying definitions verbatim (even with a citation) demonstrates you found the source, not that you understand it. | Paraphrase every definition in your own words; quote only when the exact wording matters. |
| **Studi Literatur is a list, not a table** | Lists let you skip stating the gap for each study: a table's last column forces it. | Always use the comparison table format with an explicit "Perbedaan" column. |
| **Citing blogs and unranked websites as primary sources** | Weak sources undermine the credibility of your entire argument. | Prefer peer-reviewed papers, textbooks, and official documentation; use blogs only for implementation details, never for theoretical claims. |
| **Theory sections with no citation at all** | An uncited claim is, by definition, unverifiable, and looks like it was invented for the thesis. | Every definition and every claim of fact needs a citation. |
| **Writing Dasar Teori for concepts your project doesn't use** | Padding wastes the reader's time and signals you don't know your own scope. | Use the traceability check in Section 3: cut anything that doesn't map to a Rumusan Masalah keyword. |

</section>

<section lang="id">

## 7. Kesalahan Umum dalam BAB II

| Kesalahan | Mengapa Salah | Pendekatan yang Benar |
|---|---|---|
| **Dasar Teori terasa seperti tumpukan Wikipedia** | Menyalin definisi secara verbatim (bahkan dengan sitasi) menunjukkan Anda menemukan sumbernya, bukan memahaminya. | Parafrasekan setiap definisi dengan kata-kata Anda sendiri; kutip hanya ketika kata-kata persis itu penting. |
| **Studi Literatur berupa daftar, bukan tabel** | Daftar memungkinkan Anda melewatkan pernyataan kesenjangan untuk setiap studi: kolom terakhir pada tabel memaksanya. | Selalu gunakan format tabel perbandingan dengan kolom "Perbedaan" yang eksplisit. |
| **Mengutip blog dan website tidak terverifikasi sebagai sumber utama** | Sumber yang lemah merusak kredibilitas seluruh argumen Anda. | Utamakan paper peer-review, buku teks, dan dokumentasi resmi; gunakan blog hanya untuk detail implementasi, jangan pernah untuk klaim teoretis. |
| **Bagian teori tanpa sitasi sama sekali** | Klaim tanpa sitasi, secara definisi, tidak dapat diverifikasi, dan terlihat seperti dikarang untuk skripsi. | Setiap definisi dan setiap klaim fakta membutuhkan sitasi. |
| **Menulis Dasar Teori untuk konsep yang tidak digunakan proyek Anda** | Penambahan yang tidak perlu membuang waktu pembaca dan menandakan Anda tidak tahu ruang lingkup Anda sendiri. | Gunakan pemeriksaan traceability di Bagian 3: hapus apa pun yang tidak terpetakan ke kata kunci Rumusan Masalah. |

</section>

---

<section lang="en">

## 8. What Comes Next?

With BAB I giving us a scoped question and BAB II grounding it in theory, we are ready to design *how* we will actually answer it. In Part 3, we cover **BAB III (Metodologi Pengembangan, Development Methodology)**: choosing a development method (we use Prototyping), drawing the Alur Penelitian, and precisely defining the metrics and instruments we will use to measure maintainability and testability.

</section>

<section lang="id">

## 8. Apa yang Akan Datang Selanjutnya?

Dengan BAB I memberikan pertanyaan yang terlingkup dan BAB II mendasarinya pada teori, langkah berikutnya adalah merancang *bagaimana* pertanyaan itu akan benar-benar dijawab. Bagian 3 membahas **BAB III (Metodologi Pengembangan)**: memilih metode pengembangan (penelitian ini menggunakan Prototyping), menggambar Alur Penelitian, dan mendefinisikan secara presisi metrik dan instrumen yang digunakan untuk mengukur maintainability dan testability.

</section>
