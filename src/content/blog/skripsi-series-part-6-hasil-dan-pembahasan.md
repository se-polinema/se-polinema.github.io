---
title: "Skripsi Mini Series Part 6: Results and Discussion (Hasil dan Pembahasan)"
titleId: "Seri Mini Skripsi Bagian 6: Hasil dan Pembahasan"
date: 2026-07-14
updated: 2026-07-14
category: tutorial
author: SE Lab
lang: en
featured: false
excerpt: "Part 6 of the Skripsi Mini Series. Learn how to write Chapter 6: Results and Discussion (BAB VI: Hasil dan Pembahasan): presenting measured results against literature thresholds, interpreting maintainability and testability metrics, and tying every result back to the Research Questions (Rumusan Masalah), including a threats-to-validity discussion."
excerptId: "Bagian 6 dari Seri Mini Skripsi. Pelajari cara menulis BAB VI (Hasil dan Pembahasan): menyajikan hasil terukur terhadap ambang batas literatur, menginterpretasikan metrik maintainability dan testability, dan mengaitkan setiap hasil kembali ke Rumusan Masalah, termasuk pembahasan ancaman validitas."
stream: se-methodologies-architecture
tags:
  - Thesis
  - Research Methodology
  - Laravel
  - Software Engineering
tagsId:
  - Skripsi
  - Metodologi Penelitian
  - Laravel
  - Rekayasa Perangkat Lunak
series: skripsi-mini-series
seriesOrder: 6
---

<section lang="en">

## 1. What is Chapter 6: Results and Discussion (BAB VI: Hasil dan Pembahasan)?

**Chapter 6** is where your project pays off. Examiners scrutinise this chapter more closely than any other, because it is where you must prove that your **Research Questions (Rumusan Masalah)** (Chapter 1) have actually been answered, with evidence rather than assertion. It typically covers:

| Subsection | Purpose |
|---|---|
| **6.1 Case Study Description (Deskripsi Studi Kasus)** | Recap what was built and measured |
| **Measurement Results** | Present the raw measured data as tables |
| **Discussion** | Interpret what the numbers mean, tied to each Research Question |
| **System Testing Results and Discussion** | Black Box and UAT results |

A common failure mode is treating "Results" and "Discussion" as the same thing. They are not: **Results** is what you measured (a table, a number); **Discussion** is what it means, why it happened, and whether it supports or refutes your hypothesis.

</section>

<section lang="id">

## 1. Apa Itu BAB VI: Hasil dan Pembahasan?

**BAB VI (Hasil dan Pembahasan)** adalah tempat proyek Anda membuahkan hasil. Ini adalah bab yang paling diteliti penguji, karena di sinilah Anda harus membuktikan Rumusan Masalah (BAB I) benar-benar telah terjawab, dengan bukti, bukan asersi. Bab ini biasanya mencakup:

| Subbab | Tujuan |
|---|---|
| **6.1 Deskripsi Studi Kasus** | Rangkuman apa yang dibangun dan diukur |
| **Hasil pengukuran** | Menyajikan data mentah terukur sebagai tabel |
| **Pembahasan** | Menginterpretasikan arti angka-angka, dikaitkan ke setiap Rumusan Masalah |
| **Hasil dan Pembahasan Pengujian Sistem** | Hasil Blackbox dan UAT |

Mode kegagalan umum adalah memperlakukan "Hasil" dan "Pembahasan" sebagai hal yang sama. Keduanya berbeda: **Hasil** adalah apa yang Anda ukur (tabel, angka); **Pembahasan** adalah artinya, mengapa itu terjadi, dan apakah itu mendukung atau membantah hipotesis Anda.

</section>

---

<section lang="en">

## 2. Why Getting Results and Discussion Right Matters

### What is it?
This chapter closes the loop opened in Chapter 1: every Research Question gets a direct, evidence-backed answer here.

### Why does it matter?
- **It is graded against Chapter 1, not in isolation.** Examiners read your Research Questions, then flip straight to Chapter 6 to check whether each one was actually answered. A Results table with no matching Discussion paragraph is an automatic gap.
- **Raw numbers alone are not a contribution.** "Cyclomatic complexity measures 2.4" is a fact; explaining *why* the Action Pattern produces that low value (single-responsibility classes instead of one class handling five concerns) is the actual analysis.
- **It is where you demonstrate scientific honesty.** Reporting only favourable numbers, or omitting where your hypothesis was *not* supported, undermines credibility. A Threats to Validity discussion is expected, not optional, especially since this study has no built comparison group.

### When do you use it?
Write this only after Chapter 5's implementation and measurement are complete. Do not draft interpretive prose around numbers you have not measured yet.

### Where does it fit?
Chapter 6's conclusions become Chapter 7's Conclusion almost verbatim. If Chapter 6 is rigorous, Chapter 7 becomes easy to write.

### How do you create one?
1. Recap the case study briefly (6.1).
2. Present each metric as a table of raw results, checked against its literature threshold.
3. Write a Discussion paragraph for each Research Question, explicitly referencing the relevant question number.
4. Present and discuss Black Box/UAT results.
5. Add a short Threats to Validity discussion, including the lack of a built comparison group.

</section>

<section lang="id">

## 2. Mengapa Menulis Hasil dan Pembahasan dengan Benar Itu Penting?

### Apa itu?
Bab ini menuntaskan apa yang dibuka di BAB I: setiap pertanyaan Rumusan Masalah mendapat jawaban langsung yang didukung bukti di sini.

### Mengapa penting?
- **Dinilai terhadap BAB I, bukan secara terisolasi.** Penguji membaca Rumusan Masalah, lalu langsung membuka BAB VI untuk memeriksa apakah setiap pertanyaan benar-benar terjawab. Tabel "Hasil" tanpa paragraf "Pembahasan" yang cocok otomatis menjadi kekurangan.
- **Angka mentah saja bukan kontribusi.** "Cyclomatic complexity terukur 2,4" adalah fakta; menjelaskan *mengapa* Action Pattern menghasilkan nilai rendah itu (kelas bertujuan tunggal, bukan satu kelas menangani lima *concern*) adalah analisis sesungguhnya.
- **Di sinilah Anda menunjukkan kejujuran ilmiah.** Melaporkan hanya angka yang menguntungkan, atau menyembunyikan bagian yang menunjukkan hipotesis Anda *tidak* terdukung, merusak kredibilitas. Pembahasan Threats to Validity diwajibkan, bukan opsional, terutama karena studi ini tidak memiliki kelompok pembanding yang dibangun.

### Kapan digunakan?
Tulis ini hanya setelah implementasi dan pengukuran BAB V selesai. Jangan susun prosa interpretatif seputar angka yang belum benar-benar Anda ukur.

### Di mana tempatnya?
Kesimpulan BAB VI menjadi Kesimpulan BAB VII hampir kata demi kata. Jika BAB VI ketat dan cermat, BAB VII menjadi mudah ditulis.

### Bagaimana membuatnya?
1. Rangkum studi kasus secara singkat (6.1).
2. Sajikan setiap metrik sebagai tabel (Hasil mentah), diperiksa terhadap ambang batas literaturnya.
3. Tulis paragraf Pembahasan per Rumusan Masalah, secara eksplisit merujuk nomor pertanyaan yang relevan.
4. Sajikan dan bahas hasil Black Box/UAT.
5. Tambahkan pembahasan singkat Threats to Validity, termasuk ketiadaan kelompok pembanding yang dibangun.

</section>

---

<section lang="en">

## 3. 6.1 Case Study Description

We built the Todo application once, using the Action Pattern to implement functional requirements FR-1 through FR-5 (Part 4). All measurements below come from the final prototype iteration (`v0.3-final`, logged in Chapter 5 Section 5.4's Iteration Log), collected with the tools defined in Chapter 3 Section 3.5 and checked against the literature thresholds that section established. The conceptual Fat Controller alternative (Chapter 2, Chapter 4) was never built or instrumented; it appears below only as documented, literature-sourced context for comparison.

## 4. Results: Maintainability

### Cyclomatic Complexity per Operation (Action Pattern)

| Operation | Measured |
|---|---|
| Create | 3 |
| Edit | 3 |
| Complete | 1 |
| Delete | 1 |
| Filter | 4 |
| **Average** | **2.4** |

### Maintainability Metrics Summary vs. Threshold

| Metric | Measured | Threshold | Meets Threshold? |
|---|---|---|---|
| Cyclomatic Complexity (avg/method) | 2.4 | ≤10 (McCabe, 1976) | Yes, well within |
| Coupling (avg external classes referenced) | 1.8 | single digits (rule of thumb) | Yes |
| Lines of Code (avg/method) | 9 | ≈20 or fewer (Martin, *Clean Code*, 2008) | Yes, well within |

## 5. Results: Testability

| Metric | Measured | Threshold | Meets Threshold? |
|---|---|---|---|
| Unit test coverage of business logic | 94% | ≥80% (common industry target) | Yes |

## 6. Discussion

### Answering Research Question 1: Does the Action Pattern Improve Maintainability in the Laravel-Based Todo List Application?

All three maintainability metrics comfortably clear the thresholds established in Chapter 3 Section 3.5. This result is consistent with Single Responsibility Principle theory from Chapter 2 Section 2.2.2. The literature documents that concentrating validation, model construction, and persistence inside a single controller method, exactly what the conceptual Fat Controller alternative does (Chapter 2, Chapter 4), raises a method's branching (complexity) and its number of direct collaborators (coupling). Distributing those concerns across five single-purpose Action classes instead keeps every measured value well within the established limits, supporting the claim that the Action Pattern improves maintainability relative to the conventional approach documented in Chapter 1 and Chapter 2. This support, however, is relative to a *documented* baseline rather than a directly measured one; see Threats to Validity below.

### Answering Research Question 2: Does the Action Pattern Ease Isolated Unit Testing (Testability) in the Laravel-Based Todo List Application?

Unit test coverage of 94% exceeds the 80% industry target, and the explanation is structural rather than incidental. Each Action class can be instantiated and called directly (see the unit test in Chapter 5 Section 5.4) with no HTTP request, routing, or middleware involved. The conceptual Fat Controller alternative, by contrast, could only have its logic exercised indirectly through the full request lifecycle (Chapter 2, Chapter 4). This supports the claim that the Action Pattern eases isolated unit testing relative to the conventional approach.

### Threats to Validity

- **No comparison group.** This study establishes that the Action Pattern implementation meets literature thresholds; it does not directly measure a built Fat Controller implementation. Claims of improvement rest on documented characteristics from the literature (Chapter 1, Chapter 2) rather than on a controlled, directly measured baseline.
- **Threshold generalisability.** The cited thresholds (McCabe's complexity guideline, Clean Code's method-length guidance, the coverage target) are general software-engineering guidelines, not ones derived specifically for small Todo-style CRUD applications. Whether they are the right bar for this exact domain is itself an assumption worth stating.
- **Scale.** A five-operation Todo application is deliberately small (see Scope and Limitations (Batasan Masalah), Part 1). Whether the same result holds at a larger scale is not established by this study.

## 7. System Testing Results and Discussion

| Test type | Result |
|---|---|
| **Black Box Testing** | 9/9 scenarios (BB-01 to BB-09) passed. |
| **UAT** | Acceptance index approximately 92% (target ≥80% met). |

Functional and acceptance testing alone could not reveal whether the implementation met the maintainability or testability standards; only the separate metrics above could answer that. This is precisely why Chapter 3 defined those metrics as a distinct research instrument, rather than relying on Black Box/UAT results alone.

### NFR Verification (Verifikasi NFR)

Chapter 4 named a verification method for each NFR. The results below close the loop between promise and evidence.

| NFR | Verification | Result | Met? |
|---|---|---|---|
| NFR-1 (response ≤1s) | Response time recorded during Blackbox execution (9 scenarios) | Average ≈150ms | Yes |
| NFR-2 (PHP 8.3, Laravel 11, MySQL 8) | Environment declaration (Chapter 5, Section 5.1) | Confirmed as declared | Yes |
| NFR-3 (desktop/mobile usable) | UAT acceptance index (above) | ≈92% | Yes |

NFR-3 is the concrete answer to why UAT exists as a distinct testing activity in this study. It is the verification method for the one NFR that Black Box testing cannot check, because usability is a subjective, user-facing quality rather than a pass/fail functional outcome.

</section>

<section lang="id">

## 3. 6.1 Deskripsi Studi Kasus

Penelitian ini membangun aplikasi Todo satu kali, menggunakan Action Pattern, mengimplementasikan kebutuhan fungsional FR-1 hingga FR-5 (Bagian 4). Semua pengukuran di bawah diambil dari iterasi prototipe final (`v0.3-final`, Log Iterasi BAB V bagian 5.4) menggunakan tool yang didefinisikan di BAB III bagian 3.5, dan diperiksa terhadap ambang batas literatur yang ditetapkan di sana. Alternatif Fat Controller konseptual (BAB II, BAB IV) tidak pernah dibangun atau diinstrumentasi; alternatif itu hanya dirujuk di bawah sebagai konteks terdokumentasi yang bersumber dari literatur.

## 4. Hasil: Maintainability

### Cyclomatic Complexity per Operasi (Action Pattern)

| Operasi | Terukur |
|---|---|
| Buat | 3 |
| Edit | 3 |
| Selesaikan | 1 |
| Hapus | 1 |
| Filter | 4 |
| **Rata-rata** | **2,4** |

### Ringkasan Metrik Maintainability vs. Ambang Batas

| Metrik | Terukur | Ambang Batas | Memenuhi Ambang Batas? |
|---|---|---|---|
| Cyclomatic Complexity (rata-rata/method) | 2,4 | ≤10 (McCabe, 1976) | Ya, jauh di bawah |
| Coupling (rata-rata kelas eksternal yang direferensikan) | 1,8 | angka tunggal (rule of thumb) | Ya |
| Lines of Code (rata-rata/method) | 9 | ≈20 atau kurang (Martin, *Clean Code*, 2008) | Ya, jauh di bawah |

## 5. Hasil: Testability

| Metrik | Terukur | Ambang Batas | Memenuhi Ambang Batas? |
|---|---|---|---|
| Cakupan uji unit pada logika bisnis | 94% | ≥80% (target umum industri) | Ya |

## 6. Pembahasan

### Menjawab Rumusan Masalah 1: Apakah penerapan Action Pattern dapat meningkatkan *maintainability* pada aplikasi Todo List berbasis Laravel?

Ketiga metrik *maintainability* memenuhi ambang batas yang ditetapkan di BAB III bagian 3.5 dengan mudah. Ini konsisten dengan teori Single Responsibility Principle dari BAB II bagian 2.2.2: memusatkan validasi, konstruksi model, dan persistensi di dalam satu method controller, persis yang dilakukan alternatif Fat Controller konseptual (BAB II, BAB IV): menurut literatur, hal itu meningkatkan percabangan method (kompleksitas) dan jumlah kolaborator langsungnya (*coupling*). Mendistribusikan *concern* tersebut ke lima kelas Action bertujuan tunggal menjaga setiap nilai terukur tetap jauh di bawah batas yang ditetapkan, mendukung klaim bahwa Action Pattern meningkatkan *maintainability* relatif terhadap pendekatan konvensional yang terdokumentasi di BAB I dan BAB II. Dukungan ini relatif terhadap baseline yang *terdokumentasi*, bukan yang diukur langsung; lihat Threats to Validity di bawah.

### Menjawab Rumusan Masalah 2: Apakah penerapan Action Pattern dapat memudahkan pengujian unit secara terisolasi (*testability*) pada aplikasi Todo List berbasis Laravel?

Cakupan uji unit sebesar 94% melampaui target industri 80%. Penjelasannya bersifat struktural, bukan insidental: setiap kelas Action dapat diinstansiasi dan dipanggil langsung (lihat unit test di BAB V bagian 5.4) tanpa keterlibatan HTTP request, routing, atau middleware, sedangkan logika alternatif Fat Controller konseptual hanya dapat dijalankan secara tidak langsung melalui siklus request penuh (BAB II, BAB IV). Ini mendukung klaim bahwa Action Pattern memudahkan pengujian unit secara terisolasi relatif terhadap pendekatan konvensional.

### Threats to Validity

- **Tidak ada kelompok pembanding.** Studi ini menetapkan bahwa implementasi Action Pattern memenuhi ambang batas literatur; studi ini tidak mengukur langsung sebuah implementasi Fat Controller. Klaim peningkatan bertumpu pada karakteristik terdokumentasi dari literatur (BAB I, BAB II), bukan baseline terkontrol yang diukur langsung.
- **Generalisasi ambang batas.** Ambang batas yang dikutip (panduan kompleksitas McCabe, panduan panjang method Clean Code, target *coverage*) adalah panduan rekayasa perangkat lunak umum, bukan diturunkan khusus untuk aplikasi CRUD bergaya Todo skala kecil; apakah itu tolok ukur yang tepat untuk domain persis ini adalah asumsi yang layak dinyatakan.
- **Skala.** Aplikasi Todo dengan lima operasi sengaja dibuat kecil (Batasan Masalah, Bagian 1); apakah hasil yang sama berlaku pada skala lebih besar tidak ditetapkan oleh studi ini.

## 7. Hasil dan Pembahasan Pengujian Sistem

| Jenis pengujian | Hasil |
|---|---|
| **Black Box Testing** | 9/9 skenario (BB-01 hingga BB-09) lulus. |
| **UAT** | Indeks penerimaan sekitar 92% (target ≥80% tercapai). |

Pengujian fungsional dan penerimaan saja tidak akan mengungkap apakah implementasi memenuhi standar *maintainability* atau *testability*; itu membutuhkan metrik terpisah di atas; justru itulah alasan BAB III mendefinisikan metrik tersebut sebagai instrumen penelitian yang berbeda, bukan mengandalkan hasil Black Box/UAT saja.

### Verifikasi NFR

BAB IV menyebutkan metode verifikasi untuk setiap NFR; berikut hasilnya, menuntaskan kaitan antara janji dan bukti.

| NFR | Verifikasi | Hasil | Terpenuhi? |
|---|---|---|---|
| NFR-1 (respons ≤1 detik) | Waktu respons dicatat selama eksekusi Black Box (9 skenario) | Rata-rata ≈150ms | Ya |
| NFR-2 (PHP 8.3, Laravel 11, MySQL 8) | Deklarasi lingkungan (BAB V, bagian 5.1) | Terkonfirmasi sesuai deklarasi | Ya |
| NFR-3 (dapat digunakan di desktop/mobile) | Indeks penerimaan UAT (di atas) | ≈92% | Ya |

NFR-3 adalah jawaban konkret untuk mengapa UAT ada sebagai aktivitas pengujian tersendiri dalam studi ini: UAT adalah metode verifikasi untuk satu-satunya NFR yang tidak dapat diperiksa oleh Black Box testing, karena *usability* adalah kualitas subjektif yang berorientasi pengguna, bukan hasil fungsional lulus/gagal.

</section>

---

<section lang="en">

## 8. Self-Check: Is Your Results and Discussion Ready?

1. Does every Research Question have a corresponding "Answering Research Question N" discussion?
2. Is every number in a Results table traceable to a specific tool run or measurement described in Chapter 5?
3. Does your Discussion explain *why*, using theory from Chapter 2, rather than just restating the numbers?
4. Have you included a Threats to Validity discussion, including the absence of a built comparison group if applicable?
5. Are Black Box and UAT results reported honestly, including any scenario that did not pass?

</section>

<section lang="id">

## 8. Periksa Sendiri: Apakah Hasil dan Pembahasan Anda Siap?

1. Apakah setiap item Rumusan Masalah punya pembahasan "Menjawab Rumusan Masalah N" yang sesuai?
2. Apakah setiap angka dalam tabel Hasil dapat ditelusuri ke tool run atau pengukuran spesifik yang dideskripsikan di BAB V?
3. Apakah Pembahasan Anda menjelaskan *mengapa*, menggunakan teori dari BAB II, bukan hanya menyatakan ulang angka?
4. Sudahkah Anda menyertakan pembahasan Threats to Validity, termasuk ketiadaan kelompok pembanding yang dibangun jika relevan?
5. Apakah hasil Black Box dan UAT dilaporkan secara jujur, termasuk skenario apa pun yang tidak lulus?

</section>

---

<section lang="en">

## 9. Common Mistakes in Chapter 6

| Mistake | Why It Is Wrong | Correct Approach |
|---|---|---|
| **Presenting a table with no discussion paragraph** | A number without interpretation leaves the "so what?" unanswered; examiners will ask it at your **thesis defense (sidang)** if you don't answer it here. | Follow every Results table with a Discussion paragraph that interprets it. |
| **Reporting numbers for something never built** | Fabricating or estimating precise metrics for an unbuilt comparison implementation misrepresents your evidence. | Only report measured numbers for what you actually built; reference the unbuilt alternative qualitatively, citing Chapter 2. |
| **No Threats to Validity section** | Silently ignoring limitations reads as not understanding them. | Always include a short, honest limitations discussion, including the lack of a comparison group where relevant. |
| **Discussion that restates numbers without theory** | "Complexity is low" is a restatement, not an explanation. | Explain *why*, citing the relevant Chapter 2 theory (e.g., SRP). |
| **Results not connected back to Research Questions by number** | Forces the examiner to hunt for which question each result answers. | Explicitly label each discussion "Answering Research Question N," as done in Section 6. |

</section>

<section lang="id">

## 9. Kesalahan Umum dalam BAB VI

| Kesalahan | Mengapa Salah | Pendekatan yang Benar |
|---|---|---|
| **Menyajikan tabel tanpa paragraf pembahasan** | Angka tanpa interpretasi meninggalkan "lalu kenapa?" tak terjawab; penguji akan menanyakannya di sidang jika Anda tidak menjawabnya di sini. | Ikuti setiap tabel Hasil dengan paragraf Pembahasan yang menginterpretasikannya. |
| **Melaporkan angka untuk sesuatu yang tidak pernah dibangun** | Mengarang atau mengestimasi metrik presisi untuk implementasi pembanding yang tidak dibangun menyajikan bukti Anda secara keliru. | Hanya laporkan angka terukur untuk apa yang benar-benar Anda bangun; rujuk alternatif yang tidak dibangun secara kualitatif, dengan mengutip BAB II. |
| **Tidak ada bagian Threats to Validity** | Mengabaikan keterbatasan secara diam-diam terbaca sebagai tidak memahaminya. | Selalu sertakan pembahasan keterbatasan yang singkat dan jujur, termasuk ketiadaan kelompok pembanding jika relevan. |
| **Pembahasan yang hanya menyatakan ulang angka tanpa teori** | "Kompleksitas rendah" adalah pernyataan ulang, bukan penjelasan. | Jelaskan *mengapa*, mengutip teori BAB II yang relevan (mis. SRP). |
| **Hasil tidak dikaitkan kembali ke Rumusan Masalah dengan nomor** | Memaksa penguji mencari sendiri pertanyaan mana yang dijawab setiap hasil. | Beri label eksplisit setiap pembahasan "Menjawab Rumusan Masalah N", seperti di Bagian 6. |

</section>

---

<section lang="en">

## 10. What Comes Next?

Every Research Question from Part 1 now has a measured, theory-grounded answer. In Part 7, the final part of this series, we cover **Chapter 7: Conclusion and Recommendations (BAB VII: Kesimpulan dan Saran)**: writing conclusions that trace directly back to Chapter 1, giving honest recommendations (saran) for future work, including a real comparative follow-up study, and preparing for your thesis defense, including how to package and hand off your project professionally.

</section>

<section lang="id">

## 10. Apa yang Akan Datang Selanjutnya?

Setiap pertanyaan Rumusan Masalah dari Bagian 1 kini punya jawaban yang terukur dan berlandaskan teori. Bagian 7, bagian terakhir seri ini, membahas **BAB VII (Kesimpulan dan Saran)**: menulis kesimpulan yang tertelusur langsung ke BAB I, memberikan saran yang jujur untuk pekerjaan mendatang termasuk studi lanjutan komparatif sesungguhnya, dan mempersiapkan sidang Anda, termasuk cara mengemas dan menyerahkan proyek Anda secara profesional.

</section>
