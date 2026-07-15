---
title: "Skripsi Mini Series Part 1 — Pendahuluan (Introduction)"
titleId: "Seri Mini Skripsi Bagian 1 — Pendahuluan"
date: 2026-07-14
updated: 2026-07-14
category: tutorial
author: SE Lab
lang: en
featured: false
excerpt: "Part 1 of the Skripsi Mini Series. Learn how to write BAB I (Pendahuluan) of a Polinema skripsi — Latar Belakang, Rumusan Masalah, Batasan Masalah, Tujuan, and Manfaat — using a simple Laravel Todo app that evaluates the Action Pattern as the running example."
excerptId: "Bagian 1 dari Seri Mini Skripsi. Pelajari cara menulis BAB I (Pendahuluan) skripsi Polinema — Latar Belakang, Rumusan Masalah, Batasan Masalah, Tujuan, dan Manfaat — menggunakan aplikasi Todo Laravel sederhana yang mengevaluasi Action Pattern sebagai contoh berkelanjutan."
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
seriesOrder: 1
---

<section lang="en">

## 1. What is BAB I — Pendahuluan?

**BAB I (Pendahuluan)** is the opening chapter of a Polinema skripsi. Its job is not to teach the reader anything new — it is to convince an examiner, in five short subsections, that your project is a **real problem worth solving**, that you have **scoped it to finish in one semester**, and that you know **exactly what you will and will not build**.

Every JTI Polinema skripsi follows the same five-subsection skeleton:

| Subsection | Question it answers |
|---|---|
| **1.1 Latar Belakang** | Why does this problem exist, and why now? |
| **1.2 Rumusan Masalah** | What, precisely, are you trying to answer? |
| **1.3 Batasan Masalah** | What is explicitly *out* of scope? |
| **1.4 Tujuan** | What will you have produced when you are done? |
| **1.5 Manfaat** | Who benefits, and how? |

These five subsections are not independent essays — they are **one argument told five times, from five angles**. A weak Latar Belakang produces vague Rumusan Masalah, which makes Batasan Masalah impossible to write tightly, which lets scope creep in, which is the single biggest reason skripsi projects miss their semester deadline. Getting BAB I right is a **software-engineering activity**, not just an academic formality: it is where you write your project's first (and most important) requirements document.

</section>

<section lang="id">

## 1. Apa Itu BAB I — Pendahuluan?

**BAB I (Pendahuluan)** adalah bab pembuka skripsi Polinema. Tugasnya bukan mengajarkan sesuatu yang baru kepada pembaca — melainkan meyakinkan penguji, dalam lima subbab singkat, bahwa proyek Anda adalah **masalah nyata yang layak diselesaikan**, bahwa Anda telah **membatasi ruang lingkupnya agar selesai dalam satu semester**, dan bahwa Anda tahu **persis apa yang akan dan tidak akan Anda bangun**.

Setiap skripsi JTI Polinema mengikuti kerangka lima subbab yang sama:

| Subbab | Pertanyaan yang dijawab |
|---|---|
| **1.1 Latar Belakang** | Mengapa masalah ini ada, dan mengapa sekarang? |
| **1.2 Rumusan Masalah** | Apa, secara presisi, yang ingin Anda jawab? |
| **1.3 Batasan Masalah** | Apa yang secara eksplisit *di luar* ruang lingkup? |
| **1.4 Tujuan** | Apa yang akan Anda hasilkan ketika selesai? |
| **1.5 Manfaat** | Siapa yang diuntungkan, dan bagaimana? |

Kelima subbab ini bukanlah esai independen — melainkan **satu argumen yang diceritakan lima kali, dari lima sudut pandang**. Latar Belakang yang lemah menghasilkan Rumusan Masalah yang kabur, yang membuat Batasan Masalah mustahil ditulis dengan ketat, yang membiarkan scope creep masuk, yang merupakan penyebab terbesar proyek skripsi meleset dari tenggat satu semester. Menulis BAB I dengan benar adalah **aktivitas rekayasa perangkat lunak**, bukan sekadar formalitas akademik: di sinilah Anda menulis dokumen requirements pertama (dan terpenting) dari proyek Anda.

</section>

---

<section lang="en">

## 2. Why Does Getting BAB I Right Matter?

### What is it?
BAB I is a funnel: it narrows from a broad, real-world context down to one precisely stated, answerable set of questions — and then draws a hard boundary around what you will actually deliver.

### Why does it matter?
- **It is your first requirements document.** Rumusan Masalah and Batasan Masalah are, functionally, a requirements spec for your own thesis project — sloppy requirements here cause the same downstream pain they cause in any software project: rework, scope creep, and missed deadlines.
- **It is graded before anyone reads BAB IV or V.** Pembimbing and penguji judge feasibility from BAB I alone. A background that is too broad or a scope that is left open gets sent back for revision before you write a single line of code.
- **It protects your semester.** A tight Batasan Masalah is the single most effective tool against scope creep — the #1 reason mini-skripsi projects do not finish on time.
- **It sets the acceptance criteria for your own defense.** Tujuan and Rumusan Masalah must match 1:1; at your sidang, the first thing an examiner checks is whether BAB VI actually answered every question BAB I asked.

### When do you use it?
Draft BAB I **before** you write any code — ideally before you even pick your final tech stack. It should be revised at least once after you finish BAB III (Metodologi), once your scope has been reality-tested against an actual development plan.

### Where does it fit?
BAB I sits at the very start of the skripsi lifecycle, but its influence runs through the whole document:
- **Rumusan Masalah** is answered by **BAB VI (Hasil dan Pembahasan)**.
- **Batasan Masalah** constrains **BAB IV (Analisis dan Perancangan)** — anything outside the boundary should not appear in your requirements or diagrams.
- **Tujuan** is restated as **Kesimpulan** in **BAB VII**.

### How do you create one?
Work top-down: research the general context first (Latar Belakang), narrow it into specific questions (Rumusan Masalah), draw a hard line around what you will build (Batasan Masalah), restate each question as a deliverable (Tujuan), then explain who benefits (Manfaat). Section 4 below walks through each subsection in detail.

</section>

<section lang="id">

## 2. Mengapa Menulis BAB I dengan Benar Itu Penting?

### Apa itu?
BAB I adalah sebuah corong: menyempit dari konteks dunia nyata yang luas menjadi satu set pertanyaan yang dinyatakan secara presisi dan dapat dijawab — lalu menarik garis batas tegas di sekitar apa yang benar-benar akan Anda hasilkan.

### Mengapa penting?
- **Ini adalah dokumen requirements pertama Anda.** Rumusan Masalah dan Batasan Masalah, secara fungsional, adalah spesifikasi requirements untuk proyek skripsi Anda sendiri — requirements yang ceroboh di sini menyebabkan masalah hilir yang sama seperti pada proyek software apa pun: pekerjaan ulang, scope creep, dan tenggat yang meleset.
- **Dinilai sebelum siapa pun membaca BAB IV atau V.** Pembimbing dan penguji menilai kelayakan hanya dari BAB I. Latar belakang yang terlalu luas atau ruang lingkup yang dibiarkan terbuka akan dikembalikan untuk revisi sebelum Anda menulis satu baris kode pun.
- **Melindungi semester Anda.** Batasan Masalah yang ketat adalah alat paling efektif melawan scope creep — penyebab #1 proyek mini-skripsi tidak selesai tepat waktu.
- **Menetapkan kriteria penerimaan untuk sidang Anda sendiri.** Tujuan dan Rumusan Masalah harus cocok 1:1; di sidang Anda, hal pertama yang diperiksa penguji adalah apakah BAB VI benar-benar menjawab setiap pertanyaan yang diajukan BAB I.

### Kapan digunakan?
Susun BAB I **sebelum** Anda menulis kode apa pun — idealnya bahkan sebelum Anda memilih tech stack final. Bab ini harus direvisi setidaknya sekali setelah Anda menyelesaikan BAB III (Metodologi), setelah ruang lingkup Anda diuji terhadap kenyataan rencana pengembangan yang sebenarnya.

### Di mana tempatnya?
BAB I berada di awal siklus hidup skripsi, tetapi pengaruhnya berjalan sepanjang dokumen:
- **Rumusan Masalah** dijawab oleh **BAB VI (Hasil dan Pembahasan)**.
- **Batasan Masalah** membatasi **BAB IV (Analisis dan Perancangan)** — apa pun di luar batas seharusnya tidak muncul di requirements atau diagram Anda.
- **Tujuan** dinyatakan kembali sebagai **Kesimpulan** di **BAB VII**.

### Bagaimana membuatnya?
Kerjakan dari atas ke bawah: teliti konteks umum terlebih dahulu (Latar Belakang), persempit menjadi pertanyaan spesifik (Rumusan Masalah), tarik garis batas tegas di sekitar apa yang akan Anda bangun (Batasan Masalah), nyatakan kembali setiap pertanyaan sebagai deliverable (Tujuan), lalu jelaskan siapa yang diuntungkan (Manfaat). Bagian 4 di bawah membahas setiap subbab secara detail.

</section>

---

<section lang="en">

## 3. Introducing Our Continuous Example: A Todo App That Evaluates the Laravel Action Pattern

Throughout this seven-part series, we will carry **one deliberately simple system** through every BAB of the skripsi — a **Todo List application built with Laravel**. The application itself is intentionally trivial: create, complete, edit, delete, and filter todos, for a single user. There is no multi-tenant complexity, no payment integration, no real-time features.

The application being simple is the point. What makes it **skripsi-worthy** is not the app — it is the **research question wrapped around it**.

### The Research Angle

Our continuous example asks a genuinely researchable — and, importantly, **beginner-achievable** — software-engineering question:

> **"Does a Laravel Todo application built with the Action Pattern meet the maintainability and testability thresholds established in software-engineering literature?"**

We will build the Todo application **once**, using the Action Pattern (each operation extracted into a dedicated, single-purpose class), and then **measure** it against concrete, literature-sourced thresholds: cyclomatic complexity, coupling, lines of code per method, and unit-test coverage. The conventional "fat controller" style — where business logic is packed directly into controller methods — is discussed only as **motivation and a conceptual design contrast** (BAB II and BAB IV); it is never built or measured. This deliberately trades a full controlled A/B comparison (harder, doubles the implementation work) for a single-build, threshold-validation study that is far more achievable in one semester, especially for a beginner or slow-pace student — while still being genuinely evidence-based, not just "I built it."

Note the two roles **coupling** and **coverage** play, since it is easy to conflate them: coupling is our *structural* indicator of testability — fewer dependencies on a class means fewer things to fake/mock to test it in isolation. Unit tests themselves exist to verify *functional correctness*, not to measure testability directly; the coverage we achieve with them is *confirming evidence* that the low-coupling design was actually easy to test in practice, not the definition of testability itself.

This is a template you can adapt: swap "Action Pattern" for any design pattern, architecture style, or tool you want to evaluate (Repository Pattern, DDD, a specific package, a caching strategy), keep the same small application and single-build approach, and the same skripsi skeleton applies.

### Why a Small Application Is the Right Choice for a Mini Skripsi

- **It fits one semester — with room to spare.** A single-implementation Todo app is buildable in a couple of weeks, leaving most of the semester for measurement, writing, and revision.
- **It isolates the variable you are testing.** With a trivial domain, your metrics are attributable to the *architectural choice*, not to incidental domain complexity.
- **It is fully reproducible.** Anyone — including your examiners — can read the code and verify your claims in minutes.
- **It avoids the hardest part of comparative studies.** No second implementation to keep fairly comparable, no risk of accidental drift between variants, no controlled-experiment methodology to defend — just "does this code meet a cited standard?"

### Key Elements

| Element | Description |
|---|---|
| **Actor** | A single **User** who manages their own todos. |
| **Core functionality** | Create Todo, Complete Todo, Edit Todo, Delete Todo, Filter Todos (by status). |
| **Implementation (built and measured)** | Action Pattern — each operation extracted into a single-purpose invokable class, e.g. `CreateTodoAction`, `CompleteTodoAction`. |
| **Conceptual contrast (discussed, not built)** | Fat Controller — business logic inline in `TodoController` methods; used only as motivation (BAB II) and a design-illustration contrast (BAB IV). |
| **Evaluation metrics** | Cyclomatic complexity, class coupling, lines of code per method, and unit-test coverage — each checked against a literature threshold. |

</section>

<section lang="id">

## 3. Memperkenalkan Contoh Berkelanjutan Ini: Aplikasi Todo yang Mengevaluasi Action Pattern Laravel

Sepanjang seri tujuh bagian ini, **satu sistem yang sengaja dibuat sederhana** dibawa melalui setiap BAB skripsi — sebuah **aplikasi Todo List yang dibangun dengan Laravel**. Aplikasinya sendiri sengaja dibuat trivial: membuat, menyelesaikan, mengedit, menghapus, dan memfilter todo, untuk satu pengguna. Tidak ada kompleksitas multi-tenant, integrasi pembayaran, atau fitur real-time.

Kesederhanaan aplikasi ini adalah intinya. Yang membuatnya **layak-skripsi** bukanlah aplikasinya — melainkan **pertanyaan penelitian yang dibungkus di sekitarnya**.

### Sudut Pandang Penelitian

Contoh berkelanjutan ini mengajukan pertanyaan rekayasa perangkat lunak yang benar-benar dapat diteliti — dan, yang penting, **dapat dicapai oleh pemula**:

> **"Apakah aplikasi Todo Laravel yang dibangun dengan Action Pattern memenuhi ambang batas maintainability dan testability yang ditetapkan literatur rekayasa perangkat lunak?"**

Penelitian ini membangun aplikasi Todo **satu kali**, menggunakan Action Pattern (setiap operasi diekstraksi ke dalam kelas khusus bertujuan tunggal), lalu **mengukurnya** terhadap ambang batas konkret bersumber literatur: cyclomatic complexity, coupling, lines of code per method, dan test coverage unit. Gaya "fat controller" konvensional — business logic dipadatkan langsung ke dalam metode controller — hanya dibahas sebagai **motivasi dan kontras desain konseptual** (BAB II dan BAB IV); tidak pernah dibangun atau diukur. Ini secara sengaja menukar perbandingan A/B terkontrol penuh (lebih sulit, menggandakan pekerjaan implementasi) dengan studi validasi-ambang-batas satu-implementasi yang jauh lebih dapat dicapai dalam satu semester, terutama bagi mahasiswa pemula atau yang bertempo lambat — namun tetap berbasis bukti yang sesungguhnya, bukan sekadar "saya sudah membangunnya."

Perhatikan dua peran berbeda dari **coupling** dan **coverage**, karena keduanya mudah tertukar: coupling adalah indikator *struktural* testability dalam penelitian ini: semakin sedikit dependensi sebuah kelas, semakin sedikit yang perlu di-fake/mock untuk mengujinya secara terisolasi. Unit test sendiri ada untuk memverifikasi *kebenaran fungsional*, bukan untuk mengukur testability secara langsung; coverage yang dicapai penelitian ini adalah *bukti penguat* bahwa desain dengan coupling rendah tersebut benar-benar mudah diuji dalam praktik, bukan definisi dari testability itu sendiri.

Ini adalah template yang dapat Anda sesuaikan: ganti "Action Pattern" dengan design pattern, gaya arsitektur, atau tool apa pun yang ingin Anda evaluasi (Repository Pattern, DDD, package tertentu, strategi caching), pertahankan aplikasi kecil dan pendekatan satu-implementasi yang sama, dan kerangka skripsi yang sama berlaku.

### Mengapa Aplikasi Kecil Adalah Pilihan Tepat untuk Mini Skripsi

- **Muat dalam satu semester — dengan ruang tersisa.** Aplikasi Todo satu-implementasi dapat dibangun dalam hitungan minggu, menyisakan sebagian besar semester untuk pengukuran, penulisan, dan revisi.
- **Mengisolasi variabel yang Anda uji.** Dengan domain yang trivial, metrik Anda dapat diatribusikan ke *pilihan arsitektur*, bukan ke kompleksitas domain yang tidak relevan.
- **Sepenuhnya dapat direproduksi.** Siapa pun — termasuk penguji Anda — dapat membaca kode dan memverifikasi klaim Anda dalam hitungan menit.
- **Menghindari bagian tersulit dari studi komparatif.** Tidak ada implementasi kedua yang harus dijaga tetap sebanding, tidak ada risiko penyimpangan tidak sengaja antarvarian, tidak ada metodologi eksperimen terkontrol yang harus dipertahankan — cukup "apakah kode ini memenuhi standar yang dikutip?"

### Elemen Kunci

| Elemen | Deskripsi |
|---|---|
| **Aktor** | Satu **User** yang mengelola todo miliknya sendiri. |
| **Fungsionalitas inti** | Buat Todo, Selesaikan Todo, Edit Todo, Hapus Todo, Filter Todo (berdasarkan status). |
| **Implementasi (dibangun dan diukur)** | Action Pattern — setiap operasi diekstraksi ke dalam kelas invokable bertujuan tunggal, mis. `CreateTodoAction`, `CompleteTodoAction`. |
| **Kontras konseptual (dibahas, tidak dibangun)** | Fat Controller — business logic langsung di dalam metode `TodoController`; hanya digunakan sebagai motivasi (BAB II) dan kontras ilustrasi desain (BAB IV). |
| **Metrik evaluasi** | Cyclomatic complexity, class coupling, lines of code per method, dan test coverage unit — masing-masing diperiksa terhadap ambang batas literatur. |

</section>

---

<section lang="en">

## 4. Writing BAB I Section by Section

### 1.1 Latar Belakang

Structure Latar Belakang as a **funnel**: general context → an observed problem or gap → why it matters now → how your project addresses it. Aim for 3–5 paragraphs, not a page-long literature dump (that belongs in BAB II).

**SE angle:** if your topic is an engineering-practice evaluation (like ours), your funnel usually goes: *industry practice* (Laravel is widely used; fat controllers are a common default) → *known pain point* (fat controllers are hard to test and maintain as an app grows) → *proposed remedy in the literature/community* (Action Pattern, Service classes, etc.) → *the gap* (limited beginner-accessible demonstrations that actually validate the remedy against established thresholds, rather than asserting it works) → *your contribution* (a single, reproducible implementation measured against literature-sourced thresholds).

### 1.2 Rumusan Masalah

Turn your Latar Belakang into a short, numbered list of **answerable questions**, not tasks, not goals, questions. Each should be answerable with evidence you will actually collect in BAB VI.

**SE angle:** phrase these like research questions (RQs) in a software-engineering study: "How does X compare to Y, measured by Z?" rather than "Build a Todo app." A Rumusan Masalah that can be satisfied just by shipping code, with no measurement, is a red flag.

### 1.3 Batasan Masalah

This is your **scope contract**, and your best defence against not finishing on time. Be explicit about the domain, the tech stack, the environment, and the metrics you will *not* cover.

> **Time-boxing tip:** Write Batasan Masalah as if you are telling your future self, in week 10, exactly what you are *not allowed* to add. Every scope-creep decision later in the semester gets checked against this list; if it isn't in Batasan Masalah, it isn't in the project.

### 1.4 Tujuan

State one objective **per Rumusan Masalah item**, in the same order, using the same wording. If a Tujuan does not trace back to a Rumusan Masalah question, delete it, since it is scope creep that has not been caught yet.

### 1.5 Manfaat

Split into **Manfaat Teoretis** (what this adds to the body of knowledge, e.g. empirical evidence on Action Pattern maintainability at small scale) and **Manfaat Praktis** (who benefits day-to-day, e.g. developers deciding whether to adopt Action Pattern in their own Laravel projects).

### Quick Reference: Must Do / Don't Do

**Latar Belakang**

Must:
- Structure it as a funnel: general context, then a specific problem, then why it matters now.
- Name every distinct issue before proposing a solution.
- Ground each issue in credible practice or literature, not personal opinion.
- Close with an explicit hypothesis statement connecting the issues to what the research investigates.

Don't:
- Don't write a textbook chapter explaining basic concepts; that belongs in BAB II.
- Don't bury the actual research gap inside a sentence about the proposed remedy; state it as its own point.
- Don't claim comparative "improvement" evidence you have not measured; if you are not building a control group, ground the baseline in what is documented instead.

**Rumusan Masalah**

Must:
- Phrase every item as an answerable question, not a task.
- Make at least one item measurable.
- Keep parallel structure across items, using the same closing criteria phrasing.

Don't:
- Don't include a "how was it built" question with no measurement attached.
- Don't leave a term like "criteria" or "threshold" unanchored; state whose criteria and how they are measured.
- Don't conflate two different constructs under one metric, such as treating test coverage as if it were the definition of testability.

**Batasan Masalah**

Must:
- List concrete inclusions and exclusions: features, tech stack, environment, metrics.
- State explicitly if something is discussed conceptually but not built or measured.

Don't:
- Don't leave scope vague, such as "as simple as possible."
- Don't let Batasan Masalah imply a scope that Rumusan Masalah does not ask about, or vice versa.

**Tujuan**

Must:
- Write exactly one Tujuan per Rumusan Masalah item, same order, matching wording.

Don't:
- Don't add a Tujuan with no matching Rumusan Masalah item; that is uncaught scope creep.

**Manfaat**

Must:
- Name a specific theoretical contribution and a specific practical beneficiary.

Don't:
- Don't use generic boilerplate, such as "benefits the wider community."

</section>

<section lang="id">

## 4. Menulis BAB I Subbab demi Subbab

### 1.1 Latar Belakang

Susun Latar Belakang sebagai sebuah **corong**: konteks umum → masalah atau gap yang diamati → mengapa ini penting sekarang → bagaimana proyek Anda mengatasinya. Targetkan 3–5 paragraf, bukan tumpukan literatur sepanjang halaman (itu tempatnya di BAB II).

**Sudut pandang SE:** jika topik Anda adalah evaluasi praktik rekayasa (seperti contoh berkelanjutan ini), corong Anda biasanya berjalan: *praktik industri* (Laravel banyak digunakan; fat controller adalah pilihan bawaan yang umum) → *pain point yang diketahui* (fat controller sulit diuji dan dipelihara seiring aplikasi bertumbuh) → *solusi yang diusulkan di literatur/komunitas* (Action Pattern, kelas Service, dll.) → *kesenjangannya* (demonstrasi yang dapat diakses pemula dan benar-benar memvalidasi solusi tersebut terhadap ambang batas yang mapan masih terbatas, bukan sekadar mengklaim bahwa solusi itu berhasil) → *kontribusi Anda* (satu implementasi yang dapat direproduksi, diukur terhadap ambang batas bersumber literatur).

### 1.2 Rumusan Masalah

Ubah Latar Belakang Anda menjadi daftar bernomor singkat berisi **pertanyaan yang dapat dijawab**, bukan tugas, bukan tujuan, melainkan pertanyaan. Setiap pertanyaan harus dapat dijawab dengan bukti yang benar-benar akan Anda kumpulkan di BAB VI.

**Sudut pandang SE:** rumuskan seperti research question (RQ) dalam studi rekayasa perangkat lunak: "Bagaimana perbandingan X dan Y, diukur dengan Z?" bukan "Bangun aplikasi Todo." Rumusan Masalah yang bisa terpenuhi hanya dengan merilis kode, tanpa pengukuran, adalah tanda bahaya.

### 1.3 Batasan Masalah

Ini adalah **kontrak ruang lingkup** Anda, dan pertahanan terbaik Anda agar tidak gagal selesai tepat waktu. Jelaskan secara eksplisit domain, tech stack, lingkungan, dan metrik yang *tidak* akan Anda cakup.

> **Tips time-boxing:** Tulis Batasan Masalah seolah-olah Anda memberi tahu diri Anda sendiri di minggu ke-10, secara persis, apa yang *tidak boleh* ditambahkan. Setiap keputusan scope-creep nanti di semester tersebut diperiksa terhadap daftar ini; jika tidak ada di Batasan Masalah, itu tidak ada dalam proyek.

### 1.4 Tujuan

Nyatakan satu tujuan **per item Rumusan Masalah**, dengan urutan yang sama, menggunakan kata-kata yang senada. Jika sebuah Tujuan tidak dapat ditelusuri kembali ke pertanyaan Rumusan Masalah, hapus, karena itu adalah scope creep yang belum tertangkap.

### 1.5 Manfaat

Bagi menjadi **Manfaat Teoretis** (apa yang ditambahkan ke body of knowledge, mis. bukti empiris tentang maintainability Action Pattern pada skala kecil) dan **Manfaat Praktis** (siapa yang diuntungkan sehari-hari, mis. developer yang memutuskan apakah akan mengadopsi Action Pattern di proyek Laravel mereka sendiri).

### Referensi Cepat: Harus Dilakukan / Jangan Dilakukan

**Latar Belakang**

Harus:
- Susun sebagai corong: konteks umum, lalu masalah spesifik, lalu mengapa ini penting sekarang.
- Sebutkan setiap masalah yang berbeda sebelum mengusulkan solusi.
- Landasi setiap masalah dengan praktik atau literatur yang kredibel, bukan opini pribadi.
- Tutup dengan pernyataan hipotesis eksplisit yang menghubungkan masalah dengan apa yang diselidiki penelitian.

Jangan:
- Jangan menulis bab seperti buku teks yang menjelaskan konsep dasar; itu tempatnya di BAB II.
- Jangan mengubur kesenjangan penelitian sesungguhnya di dalam kalimat tentang solusi yang diusulkan; nyatakan sebagai poin tersendiri.
- Jangan mengklaim bukti "peningkatan" komparatif yang belum Anda ukur; jika Anda tidak membangun kelompok pembanding, landasi baseline pada apa yang terdokumentasi.

**Rumusan Masalah**

Harus:
- Rumuskan setiap item sebagai pertanyaan yang dapat dijawab, bukan tugas.
- Pastikan setidaknya satu item terukur.
- Jaga struktur paralel antaritem, menggunakan frasa kriteria penutup yang sama.

Jangan:
- Jangan menyertakan pertanyaan "bagaimana cara membangunnya" tanpa pengukuran yang menyertainya.
- Jangan biarkan istilah seperti "kriteria" atau "ambang batas" tanpa jangkar; nyatakan kriteria siapa dan bagaimana diukur.
- Jangan mencampuradukkan dua konstruk berbeda dalam satu metrik, seperti memperlakukan test coverage seolah-olah itu definisi dari testability.

**Batasan Masalah**

Harus:
- Sebutkan cakupan dan pengecualian yang konkret: fitur, tech stack, lingkungan, metrik.
- Nyatakan secara eksplisit jika sesuatu dibahas secara konseptual namun tidak dibangun atau diukur.

Jangan:
- Jangan biarkan ruang lingkup kabur, seperti "sesederhana mungkin."
- Jangan biarkan Batasan Masalah menyiratkan ruang lingkup yang tidak ditanyakan Rumusan Masalah, atau sebaliknya.

**Tujuan**

Harus:
- Tulis persis satu Tujuan per item Rumusan Masalah, urutan sama, kata-kata senada.

Jangan:
- Jangan menambahkan Tujuan tanpa item Rumusan Masalah yang cocok; itu adalah scope creep yang belum tertangkap.

**Manfaat**

Harus:
- Sebutkan kontribusi teoretis yang spesifik dan penerima manfaat praktis yang spesifik.

Jangan:
- Jangan menggunakan boilerplate generik, seperti "bermanfaat bagi masyarakat luas."

</section>

---

<section lang="en">

## 5. Worked Example: BAB I for "Evaluating the Laravel Action Pattern"

Below is a condensed draft of BAB I for our continuous example, showing how each subsection traces to the next.

**1.1 Latar Belakang (excerpt)**
> Laravel is one of the most widely adopted PHP frameworks for building web applications, including many student and small-team projects at Polinema. Its default MVC structure makes it easy, often the path of least resistance, for developers to place validation and business logic directly inside controller methods. As an application grows, this "fat controller" style is known in industry practice to reduce readability, since business logic accumulates within a single class alongside HTTP handling code. It also makes unit testing difficult, because business logic becomes entangled with the request/response lifecycle and cannot be exercised in isolation. Software-engineering literature consistently associates this style with higher cyclomatic complexity and coupling, established proxies for poor maintainability; these documented characteristics serve as the comparison baseline for this study, so a second fat-controller implementation does not need to be built purely for comparison.
>
> The Laravel community has popularised the *Action Pattern*, extracting each business operation into a dedicated, single-purpose class, as a remedy for these problems. However, this guidance is largely anecdotal: beginner-accessible demonstrations that actually validate the remedy against established code-quality thresholds, rather than simply asserting that it works, remain limited.
>
> Given these issues, this research proposes that restructuring business logic using the Action Pattern will improve maintainability and ease isolated unit testing, compared to the conventional fat-controller approach. This project investigates that proposition by building a Todo List application with the Action Pattern and evaluating it against established code-quality thresholds and the documented fat-controller characteristics above, providing a minimal, reproducible demonstration accessible to beginner students.

**1.2 Rumusan Masalah**
1. Apakah penerapan Action Pattern dapat meningkatkan maintainability pada aplikasi Todo List berbasis Laravel, ditinjau dari cyclomatic complexity, coupling, dan lines of code per method?
2. Apakah penerapan Action Pattern dapat memudahkan pengujian unit secara terisolasi (testability) pada aplikasi Todo List berbasis Laravel, ditinjau dari cakupan pengujian (test coverage) yang dicapai?

**1.3 Batasan Masalah**
- Aplikasi dibatasi pada fitur CRUD Todo (create, read, update, delete) dan filter status, dengan autentikasi dasar satu pengguna per akun (memakai scaffolding auth default Laravel) sebagai prasyarat; tidak ada sistem registrasi/manajemen akun multi-user, notifikasi, atau integrasi eksternal yang dibangun.
- Evaluasi hanya pada lapisan business logic (Action), tidak mencakup frontend atau desain UI.
- Evaluasi dilakukan terhadap ambang batas dari literatur, bukan terhadap implementasi Fat Controller kedua — Fat Controller dibahas sebagai motivasi (BAB II) dan ilustrasi desain (BAB IV), namun tidak diimplementasikan maupun diukur.
- Stack tetap: PHP 8.3, Laravel 11, PHPUnit, dijalankan pada satu lingkungan lokal.
- Metrik dibatasi pada cyclomatic complexity, coupling, LOC per method, dan test coverage — bukan performance benchmarking.

**1.4 Tujuan**
1. Mengevaluasi apakah penerapan Action Pattern dapat meningkatkan maintainability pada aplikasi Todo List berbasis Laravel, ditinjau dari cyclomatic complexity, coupling, dan lines of code per method.
2. Mengevaluasi apakah penerapan Action Pattern dapat memudahkan pengujian unit secara terisolasi (testability) pada aplikasi Todo List berbasis Laravel, ditinjau dari cakupan pengujian (test coverage) yang dicapai.

**1.5 Manfaat**
- **Teoretis:** menyediakan bukti empiris tentang tingkat kepatuhan implementasi Action Pattern pada aplikasi Laravel skala kecil terhadap ambang batas maintainability dan testability yang direkomendasikan literatur.
- **Praktis:** memberi panduan bagi mahasiswa dan developer pemula dalam menerapkan Action Pattern pada proyek Laravel mereka, dengan tolok ukur yang jelas dan dapat dicapai dalam satu semester.

Notice the traceability: every Rumusan Masalah has exactly one matching Tujuan, and every element of Batasan Masalah exists to keep the project buildable within one semester.

</section>

<section lang="id">

## 5. Contoh Terapan: BAB I untuk "Evaluasi Action Pattern Laravel"

Berikut draf ringkas BAB I untuk contoh berkelanjutan ini, menunjukkan bagaimana setiap subbab tertelusur ke subbab berikutnya.

**1.1 Latar Belakang (kutipan)**
> Laravel adalah salah satu framework PHP yang paling banyak diadopsi untuk membangun aplikasi web, termasuk banyak proyek mahasiswa dan tim kecil di Polinema. Struktur MVC bawaannya membuat developer mudah, bahkan cenderung menjadi jalan yang paling mudah diambil, untuk menempatkan validasi dan business logic langsung di dalam metode controller. Seiring aplikasi bertumbuh, gaya "fat controller" ini dikenal dalam praktik industri mengurangi keterbacaan, karena business logic menumpuk dalam satu kelas bersama kode penanganan HTTP. Gaya ini juga menyulitkan unit testing, karena business logic menjadi terjalin dengan siklus request/response dan tidak dapat diuji secara terisolasi. Literatur rekayasa perangkat lunak secara konsisten mengaitkan gaya ini dengan cyclomatic complexity dan coupling yang lebih tinggi, proksi mapan untuk maintainability yang buruk; karakteristik terdokumentasi inilah yang menjadi acuan pembanding (baseline) dalam penelitian ini, sehingga implementasi fat controller kedua tidak perlu dibangun semata untuk pembanding.
>
> Komunitas Laravel memopulerkan *Action Pattern*, mengekstraksi setiap operasi bisnis ke dalam kelas khusus bertujuan tunggal, sebagai solusi atas masalah-masalah ini. Namun, panduan ini sebagian besar bersifat anekdotal: demonstrasi yang dapat diakses mahasiswa dan benar-benar memvalidasi solusi tersebut terhadap ambang batas kualitas kode yang mapan, bukan sekadar mengklaim bahwa solusi itu berhasil, masih terbatas.
>
> Berdasarkan permasalahan-permasalahan tersebut, penelitian ini mengajukan hipotesis bahwa merestrukturisasi business logic menggunakan Action Pattern akan meningkatkan maintainability dan memudahkan pengujian unit secara terisolasi, dibandingkan dengan pendekatan fat controller konvensional. Proyek ini menginvestigasi proposisi tersebut dengan membangun aplikasi Todo List menggunakan Action Pattern dan mengevaluasinya terhadap ambang batas kualitas kode yang mapan serta karakteristik fat controller terdokumentasi di atas, menyediakan demonstrasi yang minimal dan dapat direproduksi yang dapat diakses mahasiswa pemula.

**1.2 Rumusan Masalah**
1. Apakah penerapan Action Pattern dapat meningkatkan maintainability pada aplikasi Todo List berbasis Laravel, ditinjau dari cyclomatic complexity, coupling, dan lines of code per method?
2. Apakah penerapan Action Pattern dapat memudahkan pengujian unit secara terisolasi (testability) pada aplikasi Todo List berbasis Laravel, ditinjau dari cakupan pengujian (test coverage) yang dicapai?

**1.3 Batasan Masalah**
- Aplikasi dibatasi pada fitur CRUD Todo (create, read, update, delete) dan filter status, dengan autentikasi dasar satu pengguna per akun (memakai scaffolding auth default Laravel) sebagai prasyarat; tidak ada sistem registrasi/manajemen akun multi-user, notifikasi, atau integrasi eksternal yang dibangun.
- Evaluasi hanya pada lapisan business logic (Action), tidak mencakup frontend atau desain UI.
- Evaluasi dilakukan terhadap ambang batas dari literatur, bukan terhadap implementasi Fat Controller kedua — Fat Controller dibahas sebagai motivasi (BAB II) dan ilustrasi desain (BAB IV), namun tidak diimplementasikan maupun diukur.
- Stack tetap: PHP 8.3, Laravel 11, PHPUnit, dijalankan pada satu lingkungan lokal.
- Metrik dibatasi pada cyclomatic complexity, coupling, LOC per method, dan test coverage — bukan performance benchmarking.

**1.4 Tujuan**
1. Mengevaluasi apakah penerapan Action Pattern dapat meningkatkan maintainability pada aplikasi Todo List berbasis Laravel, ditinjau dari cyclomatic complexity, coupling, dan lines of code per method.
2. Mengevaluasi apakah penerapan Action Pattern dapat memudahkan pengujian unit secara terisolasi (testability) pada aplikasi Todo List berbasis Laravel, ditinjau dari cakupan pengujian (test coverage) yang dicapai.

**1.5 Manfaat**
- **Teoretis:** menyediakan bukti empiris tentang tingkat kepatuhan implementasi Action Pattern pada aplikasi Laravel skala kecil terhadap ambang batas maintainability dan testability yang direkomendasikan literatur.
- **Praktis:** memberi panduan bagi mahasiswa dan developer pemula dalam menerapkan Action Pattern pada proyek Laravel mereka, dengan tolok ukur yang jelas dan dapat dicapai dalam satu semester.

Perhatikan traceability-nya: setiap Rumusan Masalah punya tepat satu Tujuan yang cocok, dan setiap elemen Batasan Masalah ada untuk menjaga proyek tetap dapat diselesaikan dalam satu semester.

</section>

---

<section lang="en">

## 6. Self-Check: Is Your BAB I Ready?

Before moving on to BAB II, trace through your own draft with this checklist:

1. Can every sentence in Latar Belakang's last paragraph be traced to a Rumusan Masalah item? If a sentence introduces an idea no question follows up on, cut it.
2. Does every Rumusan Masalah item have exactly one matching Tujuan, in the same order?
3. Could you defend Batasan Masalah in a sidang by saying "this is out of scope because it's not in Batasan Masalah, full stop"? If a boundary is fuzzy, tighten the wording.
4. Is at least one Rumusan Masalah item **measurable** — answerable with a number, a table, or a comparison, not just a description?
5. Does Manfaat name a specific beneficiary (not just "masyarakat" or "peneliti selanjutnya")?

If any answer is "no," revise BAB I now — it is far cheaper to fix a sentence in week 1 than to redesign your metrics in week 10.

</section>

<section lang="id">

## 6. Periksa Sendiri: Apakah BAB I Anda Siap?

Sebelum melanjutkan ke BAB II, telusuri draf Anda sendiri dengan daftar periksa ini:

1. Bisakah setiap kalimat di paragraf terakhir Latar Belakang ditelusuri ke item Rumusan Masalah? Jika sebuah kalimat memperkenalkan ide yang tidak ditindaklanjuti pertanyaan mana pun, hapus.
2. Apakah setiap item Rumusan Masalah punya tepat satu Tujuan yang cocok, dengan urutan yang sama?
3. Bisakah Anda mempertahankan Batasan Masalah di sidang dengan mengatakan "ini di luar ruang lingkup karena tidak ada di Batasan Masalah, titik"? Jika sebuah batas kabur, perketat rumusannya.
4. Apakah setidaknya satu item Rumusan Masalah **terukur** — dapat dijawab dengan angka, tabel, atau perbandingan, bukan hanya deskripsi?
5. Apakah Manfaat menyebut penerima manfaat yang spesifik (bukan hanya "masyarakat" atau "peneliti selanjutnya")?

Jika ada jawaban "tidak," revisi BAB I sekarang — jauh lebih murah memperbaiki kalimat di minggu 1 daripada mendesain ulang metrik Anda di minggu 10.

</section>

---

<section lang="en">

## 7. Common Mistakes in BAB I

| Mistake | Why It Is Wrong | Correct Approach |
|---|---|---|
| **Latar Belakang reads like a textbook chapter** | Pages explaining "what is Laravel" or "what is a design pattern" belong in BAB II (Landasan Teori), not BAB I. | Keep Latar Belakang focused on the *problem and gap*; save definitions and theory for BAB II. |
| **Rumusan Masalah phrased as tasks** ("Membuat aplikasi Todo List") | A task is not a question — it cannot be "answered" with evidence in BAB VI. | Rephrase as a question: "Bagaimana perbandingan maintainability antara...?" |
| **Batasan Masalah left vague** ("Sistem dibuat sesederhana mungkin") | Vague scope cannot stop scope creep — every addition can be argued to fit. | List concrete inclusions/exclusions: specific features, stack, environment, metrics. |
| **Tujuan and Rumusan Masalah don't match 1:1** | Extra Tujuan with no matching question is scope that was never justified; a question with no Tujuan will never get answered. | Write them side by side and check the count and order match exactly. |
| **No measurable Rumusan Masalah** | A project with only "build X" as its question cannot demonstrate rigor — it is a build exercise, not a mini-thesis. | Add at least one comparison or measurement question. |
| **Manfaat is generic boilerplate** | "Bermanfaat bagi masyarakat luas" says nothing and convinces no one. | Name a specific role (developer, future student, the institution) and a specific benefit. |

</section>

<section lang="id">

## 7. Kesalahan Umum dalam BAB I

| Kesalahan | Mengapa Salah | Pendekatan yang Benar |
|---|---|---|
| **Latar Belakang terasa seperti bab buku teks** | Halaman yang menjelaskan "apa itu Laravel" atau "apa itu design pattern" seharusnya ada di BAB II (Landasan Teori), bukan BAB I. | Fokuskan Latar Belakang pada *masalah dan kesenjangan*; simpan definisi dan teori untuk BAB II. |
| **Rumusan Masalah dirumuskan sebagai tugas** ("Membuat aplikasi Todo List") | Tugas bukan pertanyaan — tidak bisa "dijawab" dengan bukti di BAB VI. | Rumuskan ulang sebagai pertanyaan: "Bagaimana perbandingan maintainability antara...?" |
| **Batasan Masalah dibiarkan kabur** ("Sistem dibuat sesederhana mungkin") | Ruang lingkup yang kabur tidak dapat menghentikan scope creep — setiap penambahan bisa diperdebatkan cocok. | Sebutkan cakupan/pengecualian yang konkret: fitur spesifik, stack, environment, metrik. |
| **Tujuan dan Rumusan Masalah tidak cocok 1:1** | Tujuan ekstra tanpa pertanyaan yang cocok adalah ruang lingkup yang tidak pernah dijustifikasi; pertanyaan tanpa Tujuan tidak akan pernah terjawab. | Tulis berdampingan dan periksa jumlah serta urutannya cocok persis. |
| **Tidak ada Rumusan Masalah yang terukur** | Proyek yang rumusan masalahnya hanya "bangun X" tidak dapat menunjukkan kerigoran — ini latihan membangun, bukan mini-tesis. | Tambahkan setidaknya satu pertanyaan perbandingan atau pengukuran. |
| **Manfaat adalah boilerplate generik** | "Bermanfaat bagi masyarakat luas" tidak mengatakan apa-apa dan tidak meyakinkan siapa pun. | Sebutkan peran spesifik (developer, mahasiswa berikutnya, institusi) dan manfaat spesifik. |

</section>

---

<section lang="en">

## 8. What Comes Next?

With BAB I drafted — a problem, a set of measurable questions, a tight scope, matching objectives, and named beneficiaries — you have the skeleton the rest of the skripsi hangs on. In Part 2, we cover **BAB II (Landasan Teori)**: how to run a proper Studi Literatur, find and cite credible sources without plagiarising, and write the Dasar Teori section that grounds our Action Pattern comparison in existing knowledge.

</section>

<section lang="id">

## 8. Apa yang Akan Datang Selanjutnya?

Dengan BAB I tersusun — sebuah masalah, sekumpulan pertanyaan terukur, ruang lingkup yang ketat, tujuan yang cocok, dan penerima manfaat yang disebutkan — Anda memiliki kerangka tempat sisa skripsi digantungkan. Bagian 2 membahas **BAB II (Landasan Teori)**: cara menjalankan Studi Literatur yang tepat, menemukan dan mengutip sumber yang kredibel tanpa plagiarisme, dan menulis bagian Dasar Teori yang mendasari perbandingan Action Pattern dalam penelitian ini pada pengetahuan yang sudah ada.

</section>
