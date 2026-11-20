---
title: "Recommender Systems Fundamentals with PHP"
titleId: "Dasar-Dasar Sistem Rekomendasi dengan PHP"
date: 2026-11-20
updated: 2026-11-20
category: tutorial
author: SE Lab
lang: en
featured: false
excerpt: "Build a small course recommender in PHP using user-based collaborative filtering, Pearson similarity, weighted rating predictions, and MAE/RMSE evaluation."
excerptId: "Bangun sistem rekomendasi mata kuliah sederhana dengan PHP menggunakan collaborative filtering berbasis pengguna, kemiripan Pearson, prediksi rating berbobot, dan evaluasi MAE/RMSE."
stream: requirements-decision-support
tags:
  - Recommender Systems
  - Collaborative Filtering
  - PHP
  - Decision Support
tagsId:
  - Sistem Rekomendasi
  - Collaborative Filtering
  - PHP
  - Pendukung Keputusan
---

<section lang="en">

## Why Recommender Systems Matter

A recommender system ranks items that may be useful to a particular person. In a campus setting, the items might be elective courses, learning resources, or research topics. The system should help a student explore relevant options, not make an academic decision on the student's behalf.

Recommendations are estimates based on available data. Explain the factors behind a recommendation, let students inspect the full catalog, and do not treat an unobserved rating as a rejection.

## Types of Recommenders

- **Content-based filtering** recommends items similar to ones a person already likes. It uses item attributes such as topic, level, or prerequisite.
- **Collaborative filtering** finds patterns in interactions from multiple people. User-based filtering looks for people with similar rating patterns; item-based filtering looks for items that receive similar ratings.
- **Hybrid systems** combine interaction data with item features. They can reduce some cold-start problems, but require more data and more careful evaluation.

This tutorial builds a small user-based collaborative filter. It uses explicit course ratings from 1 to 5. A production system may instead use implicit signals such as course bookmarks or completed enrollments, but those events should not be treated as equivalent to a student's stated preference.

## Design a Course-Rating Dataset

Keep the course catalog separate from student ratings. A relational design can use:

```text
courses(id, code, title, stream, level)
course_ratings(student_id, course_id, rating, created_at)
```

Add a unique constraint on `(student_id, course_id)` if each student can keep only one current rating. Store unrated courses as absent rows, not as `0`. A zero would be a real value in the data and would incorrectly affect similarity calculations.

The in-memory example below uses an associative array instead of a database so the recommendation steps are easy to inspect. The sample values are illustrative, not real student data.

## Measure Similarity with Pearson Correlation

Pearson correlation compares two people's deviations from their own average ratings, using only courses both have rated. A value near `1` means their ratings tend to move together, a value near `-1` means they tend to move in opposite directions, and a value near `0` means there is little linear relationship.

Using only overlapping ratings prevents a missing value from being mistaken for a low rating. Require enough overlap in a real system, and consider shrinkage or a minimum-support rule because a high correlation based on only two ratings is unreliable. The compact example uses two shared courses so its data remains easy to follow.

## Predict Ratings and Recommend Courses in PHP

The prediction is the target student's average rating plus a similarity-weighted adjustment from neighbors who rated the course. Only positive Pearson neighbors are used here. The result is clamped to the supported 1-to-5 scale.

Save the following as `recommender.php` and run it with PHP 8.1 or later:

```php
<?php

$ratings = [
    'ani' => ['php' => 5, 'data' => 4, 'ux' => 2, 'security' => 5, 'ai' => 5],
    'budi' => ['php' => 4, 'data' => 4, 'ux' => 2, 'security' => 4, 'ai' => 4],
    'citra' => ['php' => 1, 'data' => 2, 'ux' => 5, 'security' => 1, 'ai' => 1],
    'doni' => ['php' => 2, 'data' => 3, 'ux' => 4, 'security' => 2, 'ai' => 2],
    'siti' => ['php' => 5, 'data' => 4, 'ux' => 1, 'security' => 4],
];

function averageRating(array $ratings): ?float
{
    if ($ratings === []) {
        return null;
    }

    return array_sum($ratings) / count($ratings);
}

function pearsonSimilarity(array $left, array $right): float
{
    $shared = array_intersect_key($left, $right);
    if (count($shared) < 2) {
        return 0.0;
    }

    $leftMean = averageRating(array_intersect_key($left, $shared));
    $rightMean = averageRating(array_intersect_key($right, $shared));
    if ($leftMean === null || $rightMean === null) {
        return 0.0;
    }

    $numerator = 0.0;
    $leftSquares = 0.0;
    $rightSquares = 0.0;

    foreach ($shared as $course => $leftRating) {
        $leftDeviation = $leftRating - $leftMean;
        $rightDeviation = $right[$course] - $rightMean;
        $numerator += $leftDeviation * $rightDeviation;
        $leftSquares += $leftDeviation ** 2;
        $rightSquares += $rightDeviation ** 2;
    }

    $denominator = sqrt($leftSquares * $rightSquares);
    return $denominator === 0.0 ? 0.0 : $numerator / $denominator;
}

function predictRating(string $student, string $course, array $ratings): ?float
{
    $targetRatings = $ratings[$student] ?? [];
    $targetMean = averageRating($targetRatings);
    if ($targetMean === null || array_key_exists($course, $targetRatings)) {
        return null;
    }

    $weightedDeviation = 0.0;
    $weightTotal = 0.0;

    foreach ($ratings as $neighbor => $neighborRatings) {
        if ($neighbor === $student || !array_key_exists($course, $neighborRatings)) {
            continue;
        }

        $similarity = pearsonSimilarity($targetRatings, $neighborRatings);
        $neighborMean = averageRating($neighborRatings);
        if ($similarity <= 0.0 || $neighborMean === null) {
            continue;
        }

        $weightedDeviation += $similarity * ($neighborRatings[$course] - $neighborMean);
        $weightTotal += $similarity;
    }

    if ($weightTotal === 0.0) {
        return null;
    }

    return min(5.0, max(1.0, $targetMean + ($weightedDeviation / $weightTotal)));
}

function recommendCourses(string $student, array $ratings, int $limit = 3): array
{
    $recommendations = [];
    $ratedCourses = $ratings[$student] ?? [];
    $allCourses = [];

    foreach ($ratings as $studentRatings) {
        $allCourses += $studentRatings;
    }

    foreach (array_keys($allCourses) as $course) {
        if (array_key_exists($course, $ratedCourses)) {
            continue;
        }

        $prediction = predictRating($student, $course, $ratings);
        if ($prediction !== null) {
            $recommendations[] = ['course' => $course, 'score' => $prediction];
        }
    }

    usort(
        $recommendations,
        static fn (array $left, array $right): int => $right['score'] <=> $left['score']
    );

    return array_slice($recommendations, 0, $limit);
}

$recommendations = recommendCourses('siti', $ratings);
echo "Recommendations for siti:\n";
foreach ($recommendations as $recommendation) {
    printf("- %s: %.2f / 5\n", $recommendation['course'], $recommendation['score']);
}

// Hold out known ratings to measure predictions the model did not train on.
$testSet = [
    ['student' => 'siti', 'course' => 'ai', 'actual' => 5],
    ['student' => 'doni', 'course' => 'security', 'actual' => 2],
];
$trainingRatings = $ratings;
foreach ($testSet as $test) {
    unset($trainingRatings[$test['student']][$test['course']]);
}

$errors = [];
foreach ($testSet as $test) {
    $prediction = predictRating($test['student'], $test['course'], $trainingRatings);
    if ($prediction !== null) {
        $errors[] = $prediction - $test['actual'];
    }
}

if ($errors === []) {
    echo "No test ratings could be predicted.\n";
} else {
    $mae = array_sum(array_map('abs', $errors)) / count($errors);
    $rmse = sqrt(array_sum(array_map(
        static fn (float $error): float => $error ** 2,
        $errors
    )) / count($errors));
    printf("MAE: %.3f\nRMSE: %.3f\n", $mae, $rmse);
}
```

The `recommendCourses` function only considers courses the student has not rated. If there are no sufficiently similar neighbors, the prediction is `null`, so the system does not invent a score. A real application should join course IDs to catalog titles and filter out courses the student is ineligible to take.

## Evaluate with MAE and RMSE

Evaluation must use ratings that were not used to make the predictions. The sample removes two known ratings from a copy of the training data, predicts them, then compares predictions with the held-out values:

- **Mean Absolute Error (MAE)** is the average absolute difference between predicted and actual ratings. Lower is better, and its unit is rating points.
- **Root Mean Squared Error (RMSE)** squares each error before averaging and taking the square root. It penalizes large misses more strongly than MAE.

For a meaningful evaluation, repeat the holdout across many students and use a time-based split if the system will predict future choices. Report coverage as well as error: a model with a low error on a tiny, easy subset may be less useful than one that makes reasonable predictions for more students.

## Cold Start and Sparse Ratings

A new student has no rating history, and a new course has no ratings. Collaborative filtering cannot compare either one reliably. Offer popular or advisor-curated courses as a clearly labeled fallback, and use course attributes such as topics and prerequisites to support content-based recommendations. Ask for a small number of optional preference signals rather than requiring extensive rating history.

Rating matrices are usually sparse. Do not fill missing entries with zero. Require a minimum number of shared ratings, cap the influence of a very small neighborhood, and monitor how recommendation coverage changes as data grows.

## Practical Safeguards

- Collect only the interaction data needed for recommendations, explain its use, and follow institutional privacy rules.
- Treat recommendations as decision support, not enrollment approval or a substitute for prerequisites.
- Show why an item was suggested and offer a way to dismiss or correct a recommendation.
- Measure quality for different student groups and check that course availability and eligibility are respected.
- Recompute recommendations when ratings or the course catalog changes, and keep a simple popularity fallback for sparse cases.

## References

- Ricci, F., Rokach, L., and Shapira, B. (eds.). *Recommender Systems Handbook*, 3rd edition. Springer, 2022. [https://doi.org/10.1007/978-1-0716-2197-4](https://doi.org/10.1007/978-1-0716-2197-4)
- PHP Manual. [Arrays](https://www.php.net/manual/en/language.types.array.php) and [anonymous functions](https://www.php.net/manual/en/functions.anonymous.php).

</section>

<section lang="id">

## Mengapa Sistem Rekomendasi Penting

Sistem rekomendasi mengurutkan pilihan yang mungkin berguna bagi seseorang. Di lingkungan kampus, pilihannya dapat berupa mata kuliah pilihan, sumber belajar, atau topik penelitian. Sistem membantu mahasiswa menjelajahi pilihan yang relevan, bukan mengambil keputusan akademik untuk mereka.

Rekomendasi merupakan perkiraan berdasarkan data yang tersedia. Jelaskan faktor di balik rekomendasi, tetap sediakan katalog lengkap, dan jangan menganggap rating yang belum diberikan sebagai penolakan.

## Jenis Sistem Rekomendasi

- **Content-based filtering** merekomendasikan item yang mirip dengan item yang disukai seseorang, berdasarkan atribut seperti topik, tingkat, atau prasyarat.
- **Collaborative filtering** menemukan pola interaksi dari banyak orang. Pendekatan berbasis pengguna mencari orang dengan pola rating serupa, sedangkan pendekatan berbasis item mencari item yang memperoleh rating serupa.
- **Sistem hybrid** menggabungkan data interaksi dengan fitur item. Pendekatan ini dapat mengurangi sebagian masalah cold start, tetapi membutuhkan lebih banyak data dan evaluasi yang lebih cermat.

Tutorial ini membuat collaborative filtering berbasis pengguna. Contohnya memakai rating eksplisit mata kuliah dari 1 sampai 5. Sistem produksi dapat memakai sinyal implisit seperti bookmark atau penyelesaian mata kuliah, tetapi sinyal tersebut tidak boleh dianggap sama dengan preferensi yang dinyatakan langsung oleh mahasiswa.

## Merancang Dataset Rating Mata Kuliah

Simpan katalog mata kuliah terpisah dari rating mahasiswa. Desain relasional dapat menggunakan:

```text
courses(id, code, title, stream, level)
course_ratings(student_id, course_id, rating, created_at)
```

Tambahkan batasan unik pada `(student_id, course_id)` jika setiap mahasiswa hanya boleh memiliki satu rating terbaru. Simpan mata kuliah yang belum dinilai sebagai baris yang tidak ada, bukan sebagai nilai `0`. Nilai nol akan dianggap sebagai data nyata dan mengganggu perhitungan kemiripan.

Contoh PHP pada bagian sebelumnya menggunakan array asosiatif, bukan basis data, agar langkah rekomendasi mudah diperiksa. Nilai contoh hanya ilustrasi, bukan data mahasiswa sebenarnya.

## Mengukur Kemiripan dengan Korelasi Pearson

Korelasi Pearson membandingkan selisih rating dua orang dari rata-rata masing-masing, hanya pada mata kuliah yang dinilai oleh keduanya. Nilai mendekati `1` berarti pola rating cenderung searah, nilai mendekati `-1` berarti cenderung berlawanan, dan nilai mendekati `0` berarti hubungan linearnya lemah.

Dengan hanya memakai rating yang sama-sama tersedia, nilai kosong tidak keliru dianggap sebagai rating rendah. Pada sistem nyata, minta jumlah rating bersama yang memadai dan pertimbangkan shrinkage atau batas minimum dukungan. Korelasi tinggi dari dua rating saja belum tentu dapat diandalkan. Contoh ringkas ini memakai dua rating bersama agar datanya mudah diikuti.

## Memprediksi Rating dan Merekomendasikan Mata Kuliah

Prediksi dimulai dari rata-rata rating mahasiswa sasaran, lalu menambahkan penyesuaian berbobot kemiripan dari tetangga yang sudah menilai mata kuliah tersebut. Contoh kode hanya menggunakan tetangga dengan korelasi Pearson positif. Hasilnya dibatasi pada skala 1 sampai 5.

Simpan kode pada bagian sebelumnya sebagai `recommender.php`, lalu jalankan dengan PHP 8.1 atau yang lebih baru. Fungsi `recommendCourses` hanya mempertimbangkan mata kuliah yang belum dinilai mahasiswa. Jika tidak ada tetangga yang cukup mirip, prediksi bernilai `null` sehingga sistem tidak mengarang skor. Aplikasi nyata perlu menghubungkan ID mata kuliah dengan nama pada katalog serta mengecualikan mata kuliah yang tidak memenuhi syarat mahasiswa.

## Mengevaluasi dengan MAE dan RMSE

Evaluasi harus memakai rating yang tidak digunakan untuk membuat prediksi. Contoh kode menghapus dua rating yang diketahui dari salinan data pelatihan, memprediksinya, lalu membandingkan hasil dengan nilai yang disimpan:

- **Mean Absolute Error (MAE)** adalah rata-rata selisih absolut antara rating prediksi dan rating sebenarnya. Nilai yang lebih rendah lebih baik dan satuannya adalah poin rating.
- **Root Mean Squared Error (RMSE)** menguadratkan setiap galat sebelum menghitung rata-rata dan akar kuadratnya. Metrik ini memberi penalti lebih besar pada kesalahan yang besar.

Untuk evaluasi yang bermakna, ulangi pengujian pada banyak mahasiswa dan gunakan pembagian berdasarkan waktu jika sistem akan memprediksi pilihan di masa mendatang. Laporkan cakupan prediksi selain galat. Model dengan galat rendah pada sedikit data yang mudah belum tentu lebih bermanfaat daripada model yang memberi prediksi wajar kepada lebih banyak mahasiswa.

## Cold Start dan Rating yang Jarang

Mahasiswa baru belum memiliki riwayat rating, sedangkan mata kuliah baru belum memiliki rating dari siapa pun. Collaborative filtering belum dapat membandingkan keduanya secara andal. Tawarkan mata kuliah populer atau pilihan yang dikurasi dosen sebagai alternatif yang diberi label jelas, lalu gunakan atribut mata kuliah seperti topik dan prasyarat untuk mendukung rekomendasi berbasis konten. Minta beberapa sinyal preferensi secara opsional, bukan mewajibkan riwayat rating yang panjang.

Matriks rating biasanya jarang terisi. Jangan mengisi nilai yang tidak ada dengan nol. Terapkan jumlah minimum rating bersama, batasi pengaruh tetangga yang sangat sedikit, dan pantau perubahan cakupan rekomendasi seiring bertambahnya data.

## Pengamanan Praktis

- Kumpulkan hanya data interaksi yang diperlukan, jelaskan penggunaannya, dan ikuti aturan privasi institusi.
- Perlakukan rekomendasi sebagai alat bantu keputusan, bukan persetujuan pendaftaran atau pengganti pemeriksaan prasyarat.
- Tampilkan alasan item disarankan dan sediakan cara untuk menolak atau memperbaiki rekomendasi.
- Ukur kualitas untuk kelompok mahasiswa yang berbeda dan pastikan ketersediaan serta kelayakan mata kuliah diperhatikan.
- Hitung ulang rekomendasi ketika rating atau katalog berubah, dan sediakan alternatif berbasis popularitas untuk kasus dengan data terbatas.

## Referensi

- Ricci, F., Rokach, L., dan Shapira, B. (ed.). *Recommender Systems Handbook*, edisi ke-3. Springer, 2022. [https://doi.org/10.1007/978-1-0716-2197-4](https://doi.org/10.1007/978-1-0716-2197-4)
- PHP Manual. [Array](https://www.php.net/manual/en/language.types.array.php) dan [anonymous function](https://www.php.net/manual/en/functions.anonymous.php).

</section>
