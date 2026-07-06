---
title: "AI-Assisted Unit Test Generation with PHP"
titleId: "Pembuatan Unit Test Berbantuan AI dengan PHP"
date: 2026-06-28
updated: 2026-06-28
category: tutorial
author: SE Lab
lang: en
featured: false
excerpt: "Learn how to use AI coding assistants to generate, review, and refine PHPUnit tests. Covers practical workflows with PHP examples, common AI pitfalls (hallucinations, brittle tests, missing edge cases), and when AI-assisted test generation helps — and when it fails."
excerptId: "Pelajari cara menggunakan asisten coding AI untuk menghasilkan, meninjau, dan menyempurnakan pengujian PHPUnit. Mencakup alur kerja praktis dengan contoh PHP, jebakan umum AI (halusinasi, pengujian rapuh, kasus tepi yang hilang), serta kapan pembuatan pengujian berbantuan AI membantu — dan kapan ia gagal."
stream: emerging-technologies-se
tags:
  - AI
  - AI-Assisted Testing
  - Software Testing
  - PHP
tagsId:
  - AI
  - Pengujian Berbantuan AI
  - Pengujian Perangkat Lunak
  - PHP
---

<section lang="en">

## What Is AI-Assisted Test Generation?

**AI-assisted test generation** is the practice of using large language models (LLMs) — like those powering GitHub Copilot, Codeium, or JetBrains AI Assistant — to suggest, draft, or extend unit tests for your code. Instead of staring at a blank test file, you provide the AI with your production code, describe the behaviour you want to test, and receive an initial test skeleton in seconds.

The AI does not *understand* your code the way a human does. It predicts what tokens (words, symbols, patterns) are likely to follow based on its training data. When you give it a PHP function and ask for PHPUnit tests, it draws on millions of open-source test files it has seen to produce a plausible-looking test suite.

This is fundamentally different from traditional test generation tools (like property-based testing frameworks or symbolic execution engines). Those tools reason about inputs and paths mathematically. AI tools reason probabilistically — which makes them remarkably flexible but also occasionally wrong in subtle, confident-sounding ways.

</section>

<section lang="id">

## Apa Itu Pembuatan Unit Test Berbantuan AI?

**Pembuatan unit test berbantuan AI** adalah praktik menggunakan model bahasa besar (LLM) — seperti yang mendukung GitHub Copilot, Codeium, atau JetBrains AI Assistant — untuk menyarankan, menyusun, atau memperluas pengujian unit untuk kode Anda. Alih-alih menatap file pengujian kosong, Anda memberikan kode produksi Anda ke AI, mendeskripsikan perilaku yang ingin Anda uji, dan menerima kerangka pengujian awal dalam hitungan detik.

AI tidak *memahami* kode Anda seperti yang dilakukan manusia. AI memprediksi token apa (kata, simbol, pola) yang mungkin mengikuti berdasarkan data pelatihannya. Saat Anda memberinya fungsi PHP dan meminta pengujian PHPUnit, ia mengambil dari jutaan file pengujian open-source yang telah dilihatnya untuk menghasilkan suite pengujian yang tampak masuk akal.

Ini secara fundamental berbeda dari alat pembuatan pengujian tradisional (seperti framework property-based testing atau symbolic execution engine). Alat-alat tersebut bernalar tentang masukan dan jalur secara matematis. Alat AI bernalar secara probabilistik — yang membuatnya sangat fleksibel tetapi terkadang salah dengan cara yang halus dan terdengar meyakinkan.

</section>

---

<section lang="en">

## Why Use AI for PHP Test Generation?

PHP developers at Politeknik Negeri Malang and beyond already write tests with PHPUnit. Adding an AI assistant to the workflow brings several practical benefits — but only when used with discipline.

### Faster Initial Draft

Writing the first test for a new class is often the hardest part. You need to decide on the test structure, mock dependencies, and choose representative inputs. An AI assistant can generate a complete test skeleton from your class definition in under a minute. You then review and refine it — which is much faster than typing it from scratch.

```php
// You write the class, then ask the AI: "Generate PHPUnit tests for this"
class DiscountCalculator
{
    public function calculate(float $price, string $memberLevel): float
    {
        return match ($memberLevel) {
            'gold'   => $price * 0.80,
            'silver' => $price * 0.90,
            default  => $price,
        };
    }
}
```

The AI responds with something like:

```php
use PHPUnit\Framework\TestCase;

class DiscountCalculatorTest extends TestCase
{
    private DiscountCalculator $calc;

    protected function setUp(): void
    {
        $this->calc = new DiscountCalculator();
    }

    public function testGoldMemberGets20PercentDiscount(): void
    {
        $this->assertEquals(80.0, $this->calc->calculate(100.0, 'gold'));
    }

    public function testSilverMemberGets10PercentDiscount(): void
    {
        $this->assertEquals(90.0, $this->calc->calculate(100.0, 'silver'));
    }

    public function testRegularMemberGetsNoDiscount(): void
    {
        $this->assertEquals(100.0, $this->calc->calculate(100.0, 'regular'));
    }
}
```

Three meaningful tests, properly structured, in seconds. That is real time saved.

### Consistent Test Structure

AI assistants tend to produce tests that follow common conventions: `setUp()` for shared fixtures, descriptive method names, and the Arrange-Act-Assert pattern. This consistency is valuable when multiple developers contribute to the same test suite.

### Learning Aid for Beginners

For students learning PHPUnit, reading AI-generated tests is an excellent way to absorb patterns. You see how to structure test methods, how to use `$this->assertEquals()` vs `$this->assertTrue()`, and how to handle exceptions with `$this->expectException()`. Over time, you internalize these patterns and write them on your own.

### Regression Safety at Speed

When adding a feature to an existing class, you can ask the AI: "Add tests for the new `applyBulkDiscount()` method." The AI reads the method signature, generates relevant test cases, and you commit them alongside your change. This keeps coverage growing without breaking your flow.

</section>

<section lang="id">

## Mengapa Menggunakan AI untuk Pembuatan Test PHP?

Developer PHP di Politeknik Negeri Malang dan sekitarnya sudah menulis pengujian dengan PHPUnit. Menambahkan asisten AI ke dalam alur kerja membawa beberapa manfaat praktis — tetapi hanya bila digunakan dengan disiplin.

### Draf Awal yang Lebih Cepat

Menulis pengujian pertama untuk kelas baru seringkali menjadi bagian tersulit. Anda perlu memutuskan struktur pengujian, mock dependensi, dan memilih masukan representatif. Asisten AI dapat menghasilkan kerangka pengujian lengkap dari definisi kelas Anda dalam waktu kurang dari satu menit. Anda kemudian meninjau dan menyempurnakannya — yang jauh lebih cepat daripada mengetiknya dari awal.

```php
// Anda menulis kelasnya, lalu minta AI: "Buatkan pengujian PHPUnit untuk ini"
class DiscountCalculator
{
    public function calculate(float $price, string $memberLevel): float
    {
        return match ($memberLevel) {
            'gold'   => $price * 0.80,
            'silver' => $price * 0.90,
            default  => $price,
        };
    }
}
```

AI merespons dengan sesuatu seperti:

```php
use PHPUnit\Framework\TestCase;

class DiscountCalculatorTest extends TestCase
{
    private DiscountCalculator $calc;

    protected function setUp(): void
    {
        $this->calc = new DiscountCalculator();
    }

    public function testGoldMemberGets20PercentDiscount(): void
    {
        $this->assertEquals(80.0, $this->calc->calculate(100.0, 'gold'));
    }

    public function testSilverMemberGets10PercentDiscount(): void
    {
        $this->assertEquals(90.0, $this->calc->calculate(100.0, 'silver'));
    }

    public function testRegularMemberGetsNoDiscount(): void
    {
        $this->assertEquals(100.0, $this->calc->calculate(100.0, 'regular'));
    }
}
```

Tiga pengujian bermakna, terstruktur dengan baik, dalam hitungan detik. Itu adalah waktu yang benar-benar dihemat.

### Struktur Pengujian yang Konsisten

Asisten AI cenderung menghasilkan pengujian yang mengikuti konvensi umum: `setUp()` untuk fixture bersama, nama metode deskriptif, dan pola Arrange-Act-Assert. Konsistensi ini berharga ketika banyak developer berkontribusi pada suite pengujian yang sama.

### Alat Bantu Belajar untuk Pemula

Bagi mahasiswa yang belajar PHPUnit, membaca pengujian yang dihasilkan AI adalah cara yang sangat baik untuk menyerap pola. Anda melihat cara menyusun metode pengujian, cara menggunakan `$this->assertEquals()` vs `$this->assertTrue()`, dan cara menangani exception dengan `$this->expectException()`. Seiring waktu, Anda menginternalisasi pola-pola ini dan menulisnya sendiri.

### Keamanan Regresi dengan Cepat

Saat menambahkan fitur ke kelas yang sudah ada, Anda dapat meminta AI: "Tambahkan pengujian untuk metode `applyBulkDiscount()` yang baru." AI membaca tanda tangan metode, menghasilkan test case yang relevan, dan Anda meng-commit-nya bersama perubahan Anda. Ini menjaga cakupan terus bertumbuh tanpa mengganggu alur Anda.

</section>

---

<section lang="en">

## Tools You Can Try

Not all AI coding tools are equal. Here are the ones most relevant to PHP developers, ranging from cloud-hosted to fully local.

| Tool | Type | PHP Support | Cost |
|---|---|---|---|
| **GitHub Copilot** | Cloud IDE extension | Excellent | \$10/month (free for students) |
| **Codeium** | Cloud IDE extension | Good | Free tier available |
| **JetBrains AI Assistant** | IDE-native (PhpStorm) | Excellent | Subscription |
| **Tabnine** | Cloud + local | Good | Free tier available |
| **Continue + Ollama** | Fully local / open-source | Good | Free |

### GitHub Copilot

Copilot integrates directly into VS Code and JetBrains IDEs. For PHP, it understands PHPUnit assertions, mock patterns with Mockery/Prophecy, and PSR conventions. Its strongest feature for testing is **Copilot Chat**: you select a class, type `/tests`, and it generates a full test file in context.

**Example prompt in Copilot Chat:**
```
/tests Generate PHPUnit tests for the DiscountCalculator class.
Cover boundary values like zero price, negative price, and unknown member levels.
```

### JetBrains AI Assistant (PhpStorm)

If you use PhpStorm, JetBrains' own AI assistant is deeply integrated. It can generate tests directly from the "Generate" menu (Alt+Insert), read your project's existing test style, and suggest tests that match your conventions.

### Continue + Ollama (Local)

For students concerned about privacy or internet access, Continue is a VS Code extension that connects to local LLMs via Ollama. Install Ollama, pull a model like `codellama` or `deepseek-coder`, and Continue lets you generate tests entirely offline. The output quality is lower than Copilot but perfectly usable for learning.

```bash
# Install Ollama, then pull a coding model
ollama pull codellama:7b
```

The workflow: write your class, select it in the editor, and ask Continue: "Generate PHPUnit tests with edge cases." The model runs on your machine with zero data leaving your network.

</section>

<section lang="id">

## Alat yang Dapat Anda Coba

Tidak semua alat coding AI setara. Berikut adalah yang paling relevan untuk developer PHP, mulai dari cloud-hosted hingga sepenuhnya lokal.

| Alat | Tipe | Dukungan PHP | Biaya |
|---|---|---|---|
| **GitHub Copilot** | Ekstensi IDE cloud | Sangat baik | \$10/bulan (gratis untuk mahasiswa) |
| **Codeium** | Ekstensi IDE cloud | Baik | Tersedia tier gratis |
| **JetBrains AI Assistant** | IDE-native (PhpStorm) | Sangat baik | Berlangganan |
| **Tabnine** | Cloud + lokal | Baik | Tersedia tier gratis |
| **Continue + Ollama** | Sepenuhnya lokal / open-source | Baik | Gratis |

### GitHub Copilot

Copilot terintegrasi langsung ke dalam VS Code dan JetBrains IDE. Untuk PHP, ia memahami asersi PHPUnit, pola mock dengan Mockery/Prophecy, dan konvensi PSR. Fitur terkuatnya untuk pengujian adalah **Copilot Chat**: Anda memilih kelas, mengetik `/tests`, dan ia menghasilkan file pengujian lengkap dalam konteks.

**Contoh prompt di Copilot Chat:**
```
/tests Buatkan pengujian PHPUnit untuk kelas DiscountCalculator.
Cakup nilai batas seperti harga nol, harga negatif, dan tingkat member yang tidak dikenal.
```

### JetBrains AI Assistant (PhpStorm)

Jika Anda menggunakan PhpStorm, asisten AI milik JetBrains terintegrasi secara mendalam. Ia dapat menghasilkan pengujian langsung dari menu "Generate" (Alt+Insert), membaca gaya pengujian yang ada di proyek Anda, dan menyarankan pengujian yang cocok dengan konvensi Anda.

### Continue + Ollama (Lokal)

Untuk mahasiswa yang khawatir tentang privasi atau akses internet, Continue adalah ekstensi VS Code yang terhubung ke LLM lokal melalui Ollama. Instal Ollama, tarik model seperti `codellama` atau `deepseek-coder`, dan Continue memungkinkan Anda menghasilkan pengujian sepenuhnya offline. Kualitas keluarannya lebih rendah dari Copilot tetapi sangat dapat digunakan untuk belajar.

```bash
# Instal Ollama, lalu tarik model coding
ollama pull codellama:7b
```

Alur kerja: tulis kelas Anda, pilih di editor, dan minta Continue: "Buatkan pengujian PHPUnit dengan kasus tepi." Model berjalan di mesin Anda tanpa data meninggalkan jaringan Anda.

</section>

<figure class="my-10 text-center" role="figure">
<pre class="inline-block text-left text-sm bg-neutral-900 text-green-400 p-6 rounded-lg">
┌──────────────────────────────────────────────────────────┐
│              AI-ASSISTED TEST WORKFLOW                    │
│                                                          │
│  ┌─────────┐    ┌──────────┐    ┌────────┐              │
│  │  WRITE  │───▶│   ASK   │───▶│ REVIEW │              │
│  │  CODE   │    │   AI     │    │  & FIX │              │
│  └─────────┘    └──────────┘    └───┬────┘              │
│                                     │                   │
│                                     ▼                   │
│                               ┌──────────┐              │
│                               │   RUN    │              │
│                               │ PHPUnit  │              │
│                               └────┬─────┘              │
│                                    │                    │
│                          ┌─────────┴─────────┐         │
│                          ▼                   ▼         │
│                    ┌──────────┐        ┌──────────┐    │
│                    │  GREEN   │        │   RED    │    │
│                    │ Commit   │        │  Fix &   │    │
│                    │ tests    │        │  repeat  │    │
│                    └──────────┘        └──────────┘    │
│                                                          │
└──────────────────────────────────────────────────────────┘
</pre>
<figcaption class="mt-3 text-sm text-neutral-500">
  <span lang="en">Figure: The AI-assisted test workflow — AI drafts, you review, PHPUnit validates</span>
  <span lang="id">Gambar: Alur kerja pengujian berbantuan AI — AI membuat draf, Anda meninjau, PHPUnit memvalidasi</span>
</figcaption>
</figure>

---

<section lang="en">

## Hands-On: From a PHP Function to PHPUnit Tests with AI

Let us walk through a real workflow. We will write a `GradeConverter` class, use an AI assistant to generate tests, review what the AI produced, fix the issues, and verify everything with PHPUnit.

### Step 1: Write the Production Code

Create `src/GradeConverter.php`:

```php
<?php

class GradeConverter
{
    /**
     * Convert a numeric score (0–100) into a letter grade.
     *
     * @throws InvalidArgumentException if score is out of range
     */
    public function convert(int $score): string
    {
        if ($score < 0 || $score > 100) {
            throw new InvalidArgumentException(
                "Score must be between 0 and 100, got {$score}"
            );
        }

        return match (true) {
            $score >= 90 => 'A',
            $score >= 80 => 'B',
            $score >= 70 => 'C',
            $score >= 60 => 'D',
            default      => 'E',
        };
    }
}
```

### Step 2: Ask the AI to Generate Tests

In your AI assistant, provide the class above and ask:

> "Generate a PHPUnit test class for GradeConverter. Cover each grade boundary, the exception cases for invalid input, and multiple values within each grade range."

**What the AI might produce** (`tests/GradeConverterTest.php`):

```php
<?php

use PHPUnit\Framework\TestCase;

class GradeConverterTest extends TestCase
{
    private GradeConverter $converter;

    protected function setUp(): void
    {
        $this->converter = new GradeConverter();
    }

    public function testGradeA(): void
    {
        $this->assertEquals('A', $this->converter->convert(95));
        $this->assertEquals('A', $this->converter->convert(90));
        $this->assertEquals('A', $this->converter->convert(100));
    }

    public function testGradeB(): void
    {
        $this->assertEquals('B', $this->converter->convert(85));
        $this->assertEquals('B', $this->converter->convert(80));
        $this->assertEquals('B', $this->converter->convert(89));
    }

    public function testGradeC(): void
    {
        $this->assertEquals('C', $this->converter->convert(75));
    }

    public function testGradeD(): void
    {
        $this->assertEquals('D', $this->converter->convert(65));
    }

    public function testGradeE(): void
    {
        $this->assertEquals('E', $this->converter->convert(55));
        $this->assertEquals('E', $this->converter->convert(0));
    }

    public function testThrowsExceptionForNegativeScore(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->converter->convert(-1);
    }

    public function testThrowsExceptionForScoreAbove100(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->converter->convert(101);
    }
}
```

### Step 3: Review the AI Output Critically

Before running the tests, inspect the AI's output. Here is a **review checklist**:

1. **Are all expected behaviours covered?** Look at the class — did the AI test every branch? It covered A through E, plus the two exception paths. Good.

2. **Are boundary values tested?** The AI tested 90 (boundary between A and B), 80, 0, 100, -1, and 101. This is correct. However, it missed some boundaries: 89 (top of B), 79 (top of C), 69 (top of D), 59 (top of E). We should add those.

3. **Does each test method test one behaviour?** `testGradeA` tests three values in one method. This is acceptable — they all belong to the same equivalence class — but splitting them could make failures more specific.

4. **Are there any hallucinated methods?** The AI correctly used `expectException()` from PHPUnit. No hallucinated helpers.

5. **Is the test file self-contained?** Yes — it imports `TestCase`, instantiates the class, and calls `convert()`.

### Step 4: Run the Tests

```bash
$ vendor/bin/phpunit tests/GradeConverterTest.php

PHPUnit 11.0.0 by Sebastian Bergmann and contributors.

.......                                                     7 / 7 (100%)

Time: 00:00.008, Memory: 6.00 MB

OK (7 tests, 10 assertions)
```

All green. But we are not done — the AI missed boundary cases.

### Step 5: Extend with Human Edge Cases

Add the missing boundary tests yourself:

```php
public function testGradeAUpperBoundary(): void
{
    $this->assertEquals('A', $this->converter->convert(100));
}

public function testGradeBLowerBoundary(): void
{
    $this->assertEquals('B', $this->converter->convert(80));
}

public function testGradeBUpperBoundary(): void
{
    $this->assertEquals('B', $this->converter->convert(89));
}

public function testGradeCLowerBoundary(): void
{
    $this->assertEquals('C', $this->converter->convert(70));
}

public function testGradeDLowerBoundary(): void
{
    $this->assertEquals('D', $this->converter->convert(60));
}

public function testGradeELowerBoundary(): void
{
    $this->assertEquals('E', $this->converter->convert(0));
}

public function testGradeEUpperBoundary(): void
{
    $this->assertEquals('E', $this->converter->convert(59));
}
```

Run again:

```bash
$ vendor/bin/phpunit tests/GradeConverterTest.php

..............                                              14 / 14 (100%)

OK (14 tests, 17 assertions)
```

This is the AI-assisted workflow in practice: the AI handles the 80% boilerplate, and you — the developer — add the 20% that demands real understanding of the domain.

</section>

<section lang="id">

## Praktik: Dari Fungsi PHP ke Pengujian PHPUnit dengan AI

Mari kita jalani alur kerja nyata. Kita akan menulis kelas `GradeConverter`, menggunakan asisten AI untuk menghasilkan pengujian, meninjau apa yang dihasilkan AI, memperbaiki masalah, dan memverifikasi semuanya dengan PHPUnit.

### Langkah 1: Tulis Kode Produksi

Buat `src/GradeConverter.php`:

```php
<?php

class GradeConverter
{
    /**
     * Mengonversi skor numerik (0–100) menjadi nilai huruf.
     *
     * @throws InvalidArgumentException jika skor di luar rentang
     */
    public function convert(int $score): string
    {
        if ($score < 0 || $score > 100) {
            throw new InvalidArgumentException(
                "Skor harus antara 0 dan 100, diterima {$score}"
            );
        }

        return match (true) {
            $score >= 90 => 'A',
            $score >= 80 => 'B',
            $score >= 70 => 'C',
            $score >= 60 => 'D',
            default      => 'E',
        };
    }
}
```

### Langkah 2: Minta AI untuk Menghasilkan Pengujian

Di asisten AI Anda, berikan kelas di atas dan minta:

> "Buatkan kelas pengujian PHPUnit untuk GradeConverter. Cakup setiap batas nilai, kasus exception untuk input tidak valid, dan beberapa nilai dalam setiap rentang nilai."

**Apa yang mungkin dihasilkan AI** (`tests/GradeConverterTest.php`):

```php
<?php

use PHPUnit\Framework\TestCase;

class GradeConverterTest extends TestCase
{
    private GradeConverter $converter;

    protected function setUp(): void
    {
        $this->converter = new GradeConverter();
    }

    public function testGradeA(): void
    {
        $this->assertEquals('A', $this->converter->convert(95));
        $this->assertEquals('A', $this->converter->convert(90));
        $this->assertEquals('A', $this->converter->convert(100));
    }

    public function testGradeB(): void
    {
        $this->assertEquals('B', $this->converter->convert(85));
        $this->assertEquals('B', $this->converter->convert(80));
        $this->assertEquals('B', $this->converter->convert(89));
    }

    public function testGradeC(): void
    {
        $this->assertEquals('C', $this->converter->convert(75));
    }

    public function testGradeD(): void
    {
        $this->assertEquals('D', $this->converter->convert(65));
    }

    public function testGradeE(): void
    {
        $this->assertEquals('E', $this->converter->convert(55));
        $this->assertEquals('E', $this->converter->convert(0));
    }

    public function testThrowsExceptionForNegativeScore(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->converter->convert(-1);
    }

    public function testThrowsExceptionForScoreAbove100(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->converter->convert(101);
    }
}
```

### Langkah 3: Tinjau Output AI Secara Kritis

Sebelum menjalankan pengujian, periksa output AI. Berikut adalah **daftar periksa peninjauan**:

1. **Apakah semua perilaku yang diharapkan tercakup?** Lihat kelasnya — apakah AI menguji setiap cabang? Ia mencakup A sampai E, ditambah dua jalur exception. Bagus.

2. **Apakah nilai batas diuji?** AI menguji 90 (batas antara A dan B), 80, 0, 100, -1, dan 101. Ini benar. Namun, ia melewatkan beberapa batas: 89 (atas B), 79 (atas C), 69 (atas D), 59 (atas E). Kita harus menambahkannya.

3. **Apakah setiap metode pengujian menguji satu perilaku?** `testGradeA` menguji tiga nilai dalam satu metode. Ini dapat diterima — semuanya termasuk dalam kelas ekuivalensi yang sama — tetapi memisahkannya bisa membuat kegagalan lebih spesifik.

4. **Apakah ada metode halusinasi?** AI dengan benar menggunakan `expectException()` dari PHPUnit. Tidak ada helper yang dihalusinasi.

5. **Apakah file pengujian mandiri?** Ya — ia mengimpor `TestCase`, menginstansiasi kelas, dan memanggil `convert()`.

### Langkah 4: Jalankan Pengujian

```bash
$ vendor/bin/phpunit tests/GradeConverterTest.php

PHPUnit 11.0.0 by Sebastian Bergmann and contributors.

.......                                                     7 / 7 (100%)

Time: 00:00.008, Memory: 6.00 MB

OK (7 pengujian, 10 asersi)
```

Semua hijau. Tapi kita belum selesai — AI melewatkan kasus batas.

### Langkah 5: Perluas dengan Kasus Tepi Manusia

Tambahkan sendiri pengujian batas yang hilang:

```php
public function testGradeAUpperBoundary(): void
{
    $this->assertEquals('A', $this->converter->convert(100));
}

public function testGradeBLowerBoundary(): void
{
    $this->assertEquals('B', $this->converter->convert(80));
}

public function testGradeBUpperBoundary(): void
{
    $this->assertEquals('B', $this->converter->convert(89));
}

public function testGradeCLowerBoundary(): void
{
    $this->assertEquals('C', $this->converter->convert(70));
}

public function testGradeDLowerBoundary(): void
{
    $this->assertEquals('D', $this->converter->convert(60));
}

public function testGradeELowerBoundary(): void
{
    $this->assertEquals('E', $this->converter->convert(0));
}

public function testGradeEUpperBoundary(): void
{
    $this->assertEquals('E', $this->converter->convert(59));
}
```

Jalankan lagi:

```bash
$ vendor/bin/phpunit tests/GradeConverterTest.php

..............                                              14 / 14 (100%)

OK (14 pengujian, 17 asersi)
```

Inilah alur kerja berbantuan AI dalam praktik: AI menangani 80% boilerplate, dan Anda — sang developer — menambahkan 20% yang membutuhkan pemahaman nyata tentang domain.

</section>

---

<section lang="en">

## Common Pitfalls of AI-Generated Tests

AI is a powerful accelerator but not an oracle. Here are the most common ways AI-generated tests go wrong — and how to catch them.

### 1. Tests That Pass but Assert Nothing

The most dangerous failure mode: the AI writes a test that runs without errors but never actually verifies the behaviour.

```php
// BAD: no assertion — this always passes
public function testCalculate(): void
{
    $result = $this->calc->calculate(100.0, 'gold');
    // Missing: $this->assertEquals(expected, $result);
}
```

**How to catch it:** Every test method must contain at least one `assert*()` call. Scan AI output for methods without assertions. In PHPUnit, configure `requireCoverageMetadata` or use the `@doesNotPerformAssertions` annotation sparingly to make the absence of assertions explicit.

### 2. Hallucinated Methods and Imports

The AI may invent methods, classes, or assertions that do not exist.

```php
// The AI might hallucinate a non-existent helper
public function testSomething(): void
{
    $result = $this->calc->calculateWithTax(100.0);
    $this->assertCalculationMatches(80.0, $result); // ← This method does not exist
}
```

**How to catch it:** PHPUnit will fail immediately with "Call to undefined method." Always run the test suite after generating. If the AI invents imports (e.g., `use App\Helpers\NonExistentHelper;`), the test won't even parse.

### 3. Overfitting to the Current Implementation

The AI generates tests that test *what the code does* rather than *what the code should do*. If your implementation has a bug, the AI's test will encode that bug as the expected value.

```php
// Implementation has a bug: 10% for gold instead of 20%
public function calculate(float $price, string $memberLevel): float
{
    return match ($memberLevel) {
        'gold'   => $price * 0.90, // BUG: should be 0.80
        'silver' => $price * 0.90,
        default  => $price,
    };
}

// AI generates this test, encoding the bug:
public function testGoldDiscount(): void
{
    $this->assertEquals(90.0, $this->calc->calculate(100.0, 'gold'));
    // Passes — but is wrong!
}
```

**How to catch it:** Always verify at least two test values against your business knowledge. Do not trust the AI's expected values. Ask yourself: "If I were calculating this by hand, what would the correct answer be?"

### 4. Missing Edge Cases

AI tends to generate tests for the "happy path" and the most obvious error cases. It systematically underestimates what can go wrong.

For a `DiscountCalculator`, the AI will test:
- Gold member, normal price
- Silver member, normal price
- Regular member, normal price

The AI will likely **miss**:
- Zero price: `calculate(0.0, 'gold')` — should return 0.0, not throw a division-by-zero
- Negative price: `calculate(-50.0, 'silver')` — should this throw? Return 0? The spec must decide.
- Unknown member level: `calculate(100.0, 'platinum')` — should this fall through to default or throw?
- Very large price: `calculate(1_000_000_000.0, 'gold')` — any overflow issues?
- Empty string member level: `calculate(100.0, '')`

**How to catch it:** After the AI generates tests, ask yourself: "What inputs could break this?" Use Boundary Value Analysis (from Blackbox testing) and add at least two tests for values the AI missed.

### 5. Brittle Tests with Hardcoded Values

The AI may generate tests that couple too tightly to implementation details. If you change the discount percentage for gold members from 20% to 25%, every test with `assertEquals(80.0, ...)` breaks — even though the behaviour is still correct.

**How to catch it:** Use data providers or test the invariant rather than the exact value:

```php
/**
 * @dataProvider discountProvider
 */
public function testGoldDiscountIsApplied(float $price, float $expected): void
{
    $this->assertEquals($expected, $this->calc->calculate($price, 'gold'));
}

public static function discountProvider(): array
{
    return [
        'whole number'  => [100.0, 80.0],
        'zero price'    => [0.0, 0.0],
        'fractional'    => [99.99, 79.992],
    ];
}
```

Data providers keep the test logic separate from the test values, making updates easier.

### 6. Ignoring Test Isolation

The AI may generate tests that depend on shared state (a database, a file, a static variable) without mocking or resetting it. These tests pass when run alone but fail when run in a different order.

**How to catch it:** Run the test suite multiple times in random order:

```bash
vendor/bin/phpunit --order-by=random
```

If tests fail only in certain orders, you have an isolation problem.

</section>

<section lang="id">

## Jebakan Umum dari Pengujian yang Dihasilkan AI

AI adalah akselerator yang kuat tetapi bukan orakel. Berikut adalah cara paling umum pengujian yang dihasilkan AI menjadi salah — dan cara menangkapnya.

### 1. Pengujian yang Berhasil Tetapi Tidak Mengasersi Apa Pun

Mode kegagalan paling berbahaya: AI menulis pengujian yang berjalan tanpa error tetapi tidak pernah benar-benar memverifikasi perilaku.

```php
// BURUK: tidak ada asersi — ini selalu berhasil
public function testCalculate(): void
{
    $result = $this->calc->calculate(100.0, 'gold');
    // Hilang: $this->assertEquals(expected, $result);
}
```

**Cara menangkapnya:** Setiap metode pengujian harus berisi setidaknya satu panggilan `assert*()`. Pindai output AI untuk metode tanpa asersi. Di PHPUnit, konfigurasikan `requireCoverageMetadata` atau gunakan anotasi `@doesNotPerformAssertions` secara hemat untuk membuat ketiadaan asersi eksplisit.

### 2. Metode dan Impor yang Dihalusinasi

AI mungkin menciptakan metode, kelas, atau asersi yang tidak ada.

```php
// AI mungkin menghalusinasi helper yang tidak ada
public function testSomething(): void
{
    $result = $this->calc->calculateWithTax(100.0);
    $this->assertCalculationMatches(80.0, $result); // ← Metode ini tidak ada
}
```

**Cara menangkapnya:** PHPUnit akan langsung gagal dengan "Call to undefined method." Selalu jalankan suite pengujian setelah menghasilkan. Jika AI menciptakan impor (misalnya, `use App\Helpers\NonExistentHelper;`), pengujian bahkan tidak akan ter-parse.

### 3. Overfitting pada Implementasi Saat Ini

AI menghasilkan pengujian yang menguji *apa yang dilakukan kode* alih-alih *apa yang seharusnya dilakukan kode*. Jika implementasi Anda memiliki bug, pengujian AI akan mengkodekan bug tersebut sebagai nilai yang diharapkan.

```php
// Implementasi memiliki bug: 10% untuk gold, bukan 20%
public function calculate(float $price, string $memberLevel): float
{
    return match ($memberLevel) {
        'gold'   => $price * 0.90, // BUG: seharusnya 0.80
        'silver' => $price * 0.90,
        default  => $price,
    };
}

// AI menghasilkan pengujian ini, mengkodekan bug:
public function testGoldDiscount(): void
{
    $this->assertEquals(90.0, $this->calc->calculate(100.0, 'gold'));
    // Berhasil — tetapi salah!
}
```

**Cara menangkapnya:** Selalu verifikasi setidaknya dua nilai pengujian terhadap pengetahuan bisnis Anda. Jangan percaya nilai yang diharapkan dari AI. Tanyakan pada diri sendiri: "Jika saya menghitung ini secara manual, apa jawaban yang benar?"

### 4. Kasus Tepi yang Hilang

AI cenderung menghasilkan pengujian untuk "happy path" dan kasus error yang paling jelas. AI secara sistematis meremehkan apa yang bisa salah.

Untuk `DiscountCalculator`, AI akan menguji:
- Member gold, harga normal
- Member silver, harga normal
- Member reguler, harga normal

AI kemungkinan akan **melewatkan**:
- Harga nol: `calculate(0.0, 'gold')` — harus mengembalikan 0.0, bukan melempar division-by-zero
- Harga negatif: `calculate(-50.0, 'silver')` — haruskah ini melempar? Mengembalikan 0? Spesifikasi harus memutuskan.
- Tingkat member tidak dikenal: `calculate(100.0, 'platinum')` — haruskah ini jatuh ke default atau melempar?
- Harga sangat besar: `calculate(1_000_000_000.0, 'gold')` — ada masalah overflow?
- Tingkat member string kosong: `calculate(100.0, '')`

**Cara menangkapnya:** Setelah AI menghasilkan pengujian, tanyakan pada diri sendiri: "Input apa yang bisa merusak ini?" Gunakan Boundary Value Analysis (dari pengujian Blackbox) dan tambahkan setidaknya dua pengujian untuk nilai yang dilewatkan AI.

### 5. Pengujian Rapuh dengan Nilai Hardcoded

AI mungkin menghasilkan pengujian yang terlalu erat terikat pada detail implementasi. Jika Anda mengubah persentase diskon untuk member gold dari 20% menjadi 25%, setiap pengujian dengan `assertEquals(80.0, ...)` rusak — meskipun perilakunya masih benar.

**Cara menangkapnya:** Gunakan data provider atau uji invarian alih-alih nilai tepat:

```php
/**
 * @dataProvider discountProvider
 */
public function testGoldDiscountIsApplied(float $price, float $expected): void
{
    $this->assertEquals($expected, $this->calc->calculate($price, 'gold'));
}

public static function discountProvider(): array
{
    return [
        'bilangan bulat'  => [100.0, 80.0],
        'harga nol'       => [0.0, 0.0],
        'pecahan'         => [99.99, 79.992],
    ];
}
```

Data provider menjaga logika pengujian terpisah dari nilai pengujian, membuat pembaruan lebih mudah.

### 6. Mengabaikan Isolasi Pengujian

AI mungkin menghasilkan pengujian yang bergantung pada state bersama (database, file, variabel statis) tanpa mocking atau meresetnya. Pengujian ini berhasil ketika dijalankan sendiri tetapi gagal ketika dijalankan dalam urutan berbeda.

**Cara menangkapnya:** Jalankan suite pengujian beberapa kali dalam urutan acak:

```bash
vendor/bin/phpunit --order-by=random
```

Jika pengujian gagal hanya dalam urutan tertentu, Anda memiliki masalah isolasi.

</section>

---

<section lang="en">

## Best Practices for AI-Assisted Test Generation

### 1. Treat AI Output as a First Draft

Never commit AI-generated tests without reviewing them. The AI is a junior developer who types very fast — not a senior engineer who understands your domain. Review every assertion, every expected value, and every edge case.

### 2. Always Run Tests and Inspect Coverage

After generating tests, run them immediately. Then check what code is actually covered:

```bash
vendor/bin/phpunit --coverage-text
```

If the coverage report shows uncovered branches, the AI missed something. Add tests for those paths manually.

### 3. Keep One Behaviour Per Test

AI sometimes generates "mega-tests" that assert ten things in one method. Split these into focused tests. When a focused test fails, you know exactly what broke.

### 4. Add Edge Cases the AI Missed

This is your superpower as a human. The AI will test `grade(85)` but not `grade(0)`, `grade(100)`, `grade(-1)`, or `grade(101)`. Always add boundary values, null inputs, empty strings, and extreme values.

### 5. Verify Business Logic Independently

Pick two test cases and verify the expected values by hand — or better yet, ask a domain expert. Never trust that the AI computed the discount percentage correctly.

### 6. Review Tests During Code Review

When reviewing a teammate's PR that includes AI-generated tests, ask:

- Are there assertions in every test?
- Do the expected values match the requirements?
- Are edge cases covered?
- Could these tests break for the wrong reason?

### 7. Use AI to Generate Tests for Existing Untested Code

The highest-impact use of AI test generation is adding tests to legacy code that has none. Feed a class to the AI, ask for tests, review, and immediately add coverage to an area that has been untested for months.

</section>

<section lang="id">

## Praktik Terbaik untuk Pembuatan Unit Test Berbantuan AI

### 1. Perlakukan Output AI sebagai Draf Pertama

Jangan pernah meng-commit pengujian yang dihasilkan AI tanpa meninjaunya. AI adalah developer junior yang mengetik sangat cepat — bukan insinyur senior yang memahami domain Anda. Tinjau setiap asersi, setiap nilai yang diharapkan, dan setiap kasus tepi.

### 2. Selalu Jalankan Pengujian dan Periksa Cakupan

Setelah menghasilkan pengujian, segera jalankan. Lalu periksa kode apa yang benar-benar tercakup:

```bash
vendor/bin/phpunit --coverage-text
```

Jika laporan cakupan menunjukkan cabang yang tidak tercakup, AI melewatkan sesuatu. Tambahkan pengujian untuk jalur tersebut secara manual.

### 3. Jaga Satu Perilaku Per Pengujian

AI terkadang menghasilkan "mega-test" yang mengasersi sepuluh hal dalam satu metode. Pisahkan menjadi pengujian yang fokus. Ketika pengujian yang fokus gagal, Anda tahu persis apa yang rusak.

### 4. Tambahkan Kasus Tepi yang Dilewatkan AI

Ini adalah kekuatan super Anda sebagai manusia. AI akan menguji `grade(85)` tetapi tidak `grade(0)`, `grade(100)`, `grade(-1)`, atau `grade(101)`. Selalu tambahkan nilai batas, input null, string kosong, dan nilai ekstrem.

### 5. Verifikasi Logika Bisnis Secara Independen

Pilih dua test case dan verifikasi nilai yang diharapkan secara manual — atau lebih baik lagi, tanyakan pada ahli domain. Jangan pernah percaya bahwa AI menghitung persentase diskon dengan benar.

### 6. Tinjau Pengujian Selama Code Review

Saat meninjau PR rekan tim yang berisi pengujian yang dihasilkan AI, tanyakan:

- Apakah ada asersi di setiap pengujian?
- Apakah nilai yang diharapkan sesuai dengan persyaratan?
- Apakah kasus tepi tercakup?
- Bisakah pengujian ini rusak karena alasan yang salah?

### 7. Gunakan AI untuk Menghasilkan Pengujian untuk Kode yang Belum Diuji

Penggunaan AI dengan dampak tertinggi adalah menambahkan pengujian ke kode legacy yang tidak memiliki pengujian. Berikan kelas ke AI, minta pengujian, tinjau, dan segera tambahkan cakupan ke area yang belum diuji selama berbulan-bulan.

</section>

---

<section lang="en">

## When to Use AI Test Generation (and When Not To)

### Strong Candidates for AI Assistance

| Situation | Why AI Helps |
|---|---|
| **Simple utility classes** | Calculators, formatters, validators — the input/output contract is clear, and AI excels at enumerating cases. |
| **CRUD service classes** | Create, read, update, delete operations follow predictable patterns that AI recognizes well. |
| **Adding tests to legacy code** | Untested classes that have been stable for months are perfect candidates. The AI generates a safety net quickly. |
| **Data transformation pipelines** | Functions that map one data structure to another — AI generates both valid and invalid input tests. |
| **Boilerplate-heavy tests** | Tests that require extensive `setUp()`, mock configuration, or data providers. Let the AI write the ceremony. |

### When AI Struggles

| Situation | Why AI Falls Short |
|---|---|
| **Complex business rules** | Domain logic with many interacting conditions often requires judgment the AI lacks. Write these tests yourself. |
| **Tests that require deep domain knowledge** | If the expected value requires understanding tax law, medical regulations, or institutional policy, the AI will likely get it wrong. |
| **Integration tests with external services** | Tests involving databases, message queues, or HTTP APIs have setup that the AI rarely gets right without extensive prompting. |
| **Performance or concurrency tests** | The AI does not understand race conditions, deadlocks, or response-time budgets. |
| **Tests for novel algorithms** | If your code implements a unique algorithm not well-represented in training data, the AI's suggestions will be generic at best. |
| **Security-sensitive code** | AI-generated tests are unlikely to probe for SQL injection, XSS, or authentication bypass. Security testing requires human creativity. |

### The Pragmatic Approach

Use AI test generation where the risk of getting it wrong is low and the cost of writing tests manually is high. For mission-critical logic, write the tests yourself — but use AI to suggest edge cases you might have overlooked. The goal is not to replace your judgment but to eliminate the tedious parts of test writing so you can focus on the parts that require intelligence.

</section>

<section lang="id">

## Kapan Menggunakan AI Test Generation (dan Kapan Tidak)

### Kandidat Kuat untuk Bantuan AI

| Situasi | Mengapa AI Membantu |
|---|---|
| **Kelas utilitas sederhana** | Kalkulator, formatter, validator — kontrak input/output jelas, dan AI unggul dalam mengenumerasi kasus. |
| **Kelas layanan CRUD** | Operasi create, read, update, delete mengikuti pola yang dapat diprediksi dan dikenali AI dengan baik. |
| **Menambahkan pengujian ke kode legacy** | Kelas yang belum diuji dan telah stabil selama berbulan-bulan adalah kandidat sempurna. AI menghasilkan jaring pengaman dengan cepat. |
| **Pipeline transformasi data** | Fungsi yang memetakan satu struktur data ke struktur lain — AI menghasilkan pengujian input valid dan tidak valid. |
| **Pengujian dengan banyak boilerplate** | Pengujian yang memerlukan `setUp()` ekstensif, konfigurasi mock, atau data provider. Biarkan AI menulis seremoni. |

### Ketika AI Kesulitan

| Situasi | Mengapa AI Kurang |
|---|---|
| **Aturan bisnis yang kompleks** | Logika domain dengan banyak kondisi yang berinteraksi sering memerlukan penilaian yang tidak dimiliki AI. Tulis pengujian ini sendiri. |
| **Pengujian yang memerlukan pengetahuan domain mendalam** | Jika nilai yang diharapkan memerlukan pemahaman hukum pajak, regulasi medis, atau kebijakan institusional, AI kemungkinan akan salah. |
| **Integration test dengan layanan eksternal** | Pengujian yang melibatkan database, message queue, atau API HTTP memiliki setup yang jarang benar oleh AI tanpa prompting ekstensif. |
| **Pengujian performa atau konkurensi** | AI tidak memahami race condition, deadlock, atau anggaran waktu respons. |
| **Pengujian untuk algoritma baru** | Jika kode Anda mengimplementasikan algoritma unik yang tidak terwakili dengan baik dalam data pelatihan, saran AI akan generik paling banter. |
| **Kode yang sensitif terhadap keamanan** | Pengujian yang dihasilkan AI tidak mungkin memeriksa SQL injection, XSS, atau authentication bypass. Pengujian keamanan memerlukan kreativitas manusia. |

### Pendekatan Pragmatis

Gunakan AI test generation di mana risiko salah rendah dan biaya menulis pengujian secara manual tinggi. Untuk logika yang kritis terhadap misi, tulis pengujian sendiri — tetapi gunakan AI untuk menyarankan kasus tepi yang mungkin Anda lewatkan. Tujuannya bukan untuk menggantikan penilaian Anda tetapi untuk menghilangkan bagian yang membosankan dari penulisan pengujian sehingga Anda dapat fokus pada bagian yang memerlukan kecerdasan.

</section>

---

<section lang="en">

## Practice Exercise: Discount Calculator

Now it is your turn. Below is a `DiscountCalculator` class. Your task is to use an AI assistant to generate tests, review the output, fix any issues, and extend the tests with edge cases the AI missed.

### The Class (`src/DiscountCalculator.php`)

```php
<?php

class DiscountCalculator
{
    /**
     * Calculate the final price after applying a member discount.
     *
     * Discount rates:
     *   - gold:   20% off
     *   - silver: 10% off
     *   - bronze:  5% off
     *   - regular: 0% off
     *
     * @throws InvalidArgumentException if price is negative
     * @throws InvalidArgumentException if member level is empty
     */
    public function calculate(float $price, string $memberLevel): float
    {
        if ($price < 0) {
            throw new InvalidArgumentException('Price cannot be negative');
        }

        if ($memberLevel === '') {
            throw new InvalidArgumentException('Member level cannot be empty');
        }

        return round(match ($memberLevel) {
            'gold'    => $price * 0.80,
            'silver'  => $price * 0.90,
            'bronze'  => $price * 0.95,
            'regular' => $price,
            default   => $price,
        }, 2);
    }
}
```

### Your Task

1. **Generate:** Give the class to your AI assistant and ask it to generate a PHPUnit test file. Use a prompt like:
   > "Generate PHPUnit tests for this DiscountCalculator class. Cover each member level, boundary values (zero price, negative price, empty member level), and unknown member levels."

2. **Review:** Go through the review checklist:
   - Does every test method have an assertion?
   - Are all five discount levels tested (gold, silver, bronze, regular, unknown)?
   - Are negative price and empty member level tested?
   - Is zero price tested?
   - Are there any hallucinated methods?

3. **Run:** Execute the tests with PHPUnit and confirm all pass.

4. **Extend:** Add at least three test cases the AI missed. Suggestions:
   - Very large price (e.g., 999999.99)
   - Price with many decimal places (e.g., 19.999)
   - Member level with unexpected casing (e.g., 'GOLD', 'Gold')

5. **Reflect:** Write down one thing the AI got right and one thing you had to fix.

### Expected Behaviour

```
calculate(100.0, 'gold')     → 80.00
calculate(100.0, 'silver')   → 90.00
calculate(100.0, 'bronze')   → 95.00
calculate(100.0, 'regular')  → 100.00
calculate(100.0, 'unknown')  → 100.00
calculate(0.0, 'gold')       → 0.00
calculate(-10.0, 'gold')     → throws InvalidArgumentException
calculate(50.0, '')           → throws InvalidArgumentException
```

Share your experience with a classmate. Compare what your AI generated versus theirs. Different AI assistants (Copilot vs Codeium vs Continue+Ollama) will produce different test suites — which one caught the most edge cases?

</section>

<section lang="id">

## Latihan Praktik: Kalkulator Diskon

Sekarang giliran Anda. Di bawah ini adalah kelas `DiscountCalculator`. Tugas Anda adalah menggunakan asisten AI untuk menghasilkan pengujian, meninjau output, memperbaiki masalah, dan memperluas pengujian dengan kasus tepi yang dilewatkan AI.

### Kelas (`src/DiscountCalculator.php`)

```php
<?php

class DiscountCalculator
{
    /**
     * Menghitung harga akhir setelah menerapkan diskon member.
     *
     * Tingkat diskon:
     *   - gold:    diskon 20%
     *   - silver:  diskon 10%
     *   - bronze:   diskon 5%
     *   - regular:  diskon 0%
     *
     * @throws InvalidArgumentException jika harga negatif
     * @throws InvalidArgumentException jika tingkat member kosong
     */
    public function calculate(float $price, string $memberLevel): float
    {
        if ($price < 0) {
            throw new InvalidArgumentException('Harga tidak boleh negatif');
        }

        if ($memberLevel === '') {
            throw new InvalidArgumentException('Tingkat member tidak boleh kosong');
        }

        return round(match ($memberLevel) {
            'gold'    => $price * 0.80,
            'silver'  => $price * 0.90,
            'bronze'  => $price * 0.95,
            'regular' => $price,
            default   => $price,
        }, 2);
    }
}
```

### Tugas Anda

1. **Hasilkan:** Berikan kelas ke asisten AI Anda dan minta untuk menghasilkan file pengujian PHPUnit. Gunakan prompt seperti:
   > "Buatkan pengujian PHPUnit untuk kelas DiscountCalculator ini. Cakup setiap tingkat member, nilai batas (harga nol, harga negatif, tingkat member kosong), dan tingkat member yang tidak dikenal."

2. **Tinjau:** Gunakan daftar periksa peninjauan:
   - Apakah setiap metode pengujian memiliki asersi?
   - Apakah kelima tingkat diskon diuji (gold, silver, bronze, regular, unknown)?
   - Apakah harga negatif dan tingkat member kosong diuji?
   - Apakah harga nol diuji?
   - Apakah ada metode yang dihalusinasi?

3. **Jalankan:** Eksekusi pengujian dengan PHPUnit dan pastikan semua berhasil.

4. **Perluas:** Tambahkan setidaknya tiga test case yang dilewatkan AI. Saran:
   - Harga sangat besar (mis. 999999.99)
   - Harga dengan banyak tempat desimal (mis. 19.999)
   - Tingkat member dengan kapitalisasi tak terduga (mis. 'GOLD', 'Gold')

5. **Refleksikan:** Tulis satu hal yang AI lakukan dengan benar dan satu hal yang harus Anda perbaiki.

### Perilaku yang Diharapkan

```
calculate(100.0, 'gold')     → 80.00
calculate(100.0, 'silver')   → 90.00
calculate(100.0, 'bronze')   → 95.00
calculate(100.0, 'regular')  → 100.00
calculate(100.0, 'unknown')  → 100.00
calculate(0.0, 'gold')       → 0.00
calculate(-10.0, 'gold')     → melempar InvalidArgumentException
calculate(50.0, '')           → melempar InvalidArgumentException
```

Bagikan pengalaman Anda dengan teman sekelas. Bandingkan apa yang dihasilkan AI Anda versus AI mereka. Asisten AI yang berbeda (Copilot vs Codeium vs Continue+Ollama) akan menghasilkan suite pengujian yang berbeda — mana yang menangkap kasus tepi paling banyak?

</section>

---

<section lang="en">

## Summary

1. **AI-assisted test generation** uses large language models to draft PHPUnit tests from your production code. It saves time but is not a substitute for thinking.
2. **The workflow is simple:** write code → ask AI for tests → review critically → run with PHPUnit → add edge cases the AI missed.
3. **Common AI pitfalls** include tests without assertions, hallucinated methods, overfitting to buggy implementations, and missing edge cases. All are caught by running the tests and reviewing output carefully.
4. **Best practices:** treat AI output as a first draft, verify expected values manually, use data providers for maintainable tests, and always run `--order-by=random` to catch isolation problems.
5. **Be pragmatic:** use AI for simple utility classes, CRUD services, and legacy code coverage. Write mission-critical tests yourself, but ask AI to suggest edge cases.
6. **AI is a junior pair programmer** — fast, tireless, often helpful, but never fully trustworthy without human review.

> The AI can write the tests, but only you can decide what the right behaviour is.

### Related Tutorials

- [Test-Driven Development (TDD) with PHP](/blog/test-driven-development) — Learn the Red → Green → Refactor cycle that pairs naturally with AI test generation.
- [Blackbox and Whitebox Test in Simple Way](/blog/blackbox-and-whitebox-test) — Master boundary value analysis and equivalence partitioning to spot the edge cases AI misses.

</section>

<section lang="id">

## Ringkasan

1. **Pembuatan unit test berbantuan AI** menggunakan model bahasa besar untuk menyusun pengujian PHPUnit dari kode produksi Anda. Ini menghemat waktu tetapi bukan pengganti untuk berpikir.
2. **Alur kerjanya sederhana:** tulis kode → minta AI untuk pengujian → tinjau secara kritis → jalankan dengan PHPUnit → tambahkan kasus tepi yang dilewatkan AI.
3. **Jebakan umum AI** meliputi pengujian tanpa asersi, metode yang dihalusinasi, overfitting pada implementasi yang bermasalah, dan kasus tepi yang hilang. Semuanya tertangkap dengan menjalankan pengujian dan meninjau output dengan hati-hati.
4. **Praktik terbaik:** perlakukan output AI sebagai draf pertama, verifikasi nilai yang diharapkan secara manual, gunakan data provider untuk pengujian yang mudah dipelihara, dan selalu jalankan `--order-by=random` untuk menangkap masalah isolasi.
5. **Bersikap pragmatis:** gunakan AI untuk kelas utilitas sederhana, layanan CRUD, dan cakupan kode legacy. Tulis pengujian kritis misi sendiri, tetapi minta AI untuk menyarankan kasus tepi.
6. **AI adalah pair programmer junior** — cepat, tak kenal lelah, sering membantu, tetapi tidak pernah sepenuhnya dapat dipercaya tanpa tinjauan manusia.

> AI dapat menulis pengujian, tetapi hanya Anda yang dapat memutuskan apa perilaku yang benar.

### Tutorial Terkait

- [Test-Driven Development (TDD) dengan PHP](/blog/test-driven-development) — Pelajari siklus Red → Green → Refactor yang berpasangan secara alami dengan pembuatan pengujian AI.
- [Cara Sederhana Melakukan Pengujian Blackbox dan Whitebox](/blog/blackbox-and-whitebox-test) — Kuasai boundary value analysis dan equivalence partitioning untuk menemukan kasus tepi yang dilewatkan AI.

</section>
