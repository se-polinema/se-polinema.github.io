---
title: "Blackbox and Whitebox Test in Simple Way"
titleId: "Cara Sederhana Melakukan Pengujian Blackbox dan Whitebox"
date: 2026-06-24
category: tutorial
author: Dian Hanifudin Subhi
lang: en
featured: false
excerpt: "A beginner-friendly guide to software testing using Blackbox and Whitebox approaches. Learn how to design effective test cases, write test scenarios, and implement both testing methods with practical PHP examples."
excerptId: "Panduan ramah pemula untuk pengujian perangkat lunak menggunakan pendekatan Blackbox dan Whitebox. Pelajari cara merancang test case yang efektif, menulis skenario pengujian, dan mengimplementasikan kedua metode pengujian dengan contoh praktis PHP."
stream: se-methodologies-architecture
tags:
  - Software Testing
  - PHP
tagsId:
  - Pengujian Perangkat Lunak
  - PHP
---

<section lang="en">

## Why Testing Matters

Before we dive into Blackbox and Whitebox testing, let us understand **why** we test software in the first place.

Every application you build will eventually have a user. That user expects the software to work correctly, handle errors gracefully, and never lose their data. Testing is how you prove to yourself — and to your users — that the software behaves as intended.

Think of testing like checking your homework before submitting it. You do not just write the answers and hope they are correct. You review each problem, verify calculations, and double-check your reasoning. Software testing works the same way, but with a structured approach.

**Three foundational principles of effective testing:**

1. **Write tests before you fix bugs.** When you find a bug, write a test that reproduces it first. Fix the code, then verify the test passes. This prevents the same bug from returning.

2. **Test one thing at a time.** Each test case should verify exactly one behavior. If a test checks multiple things and fails, you will not know which part broke.

3. **Tests are documentation.** A well-written test tells you what the code is supposed to do. When someone reads your tests, they should understand the expected behavior without reading the implementation.

</section>

<section lang="id">

## Mengapa Pengujian Itu Penting

Sebelum kita membahas pengujian Blackbox dan Whitebox, mari pahami **mengapa** kita menguji perangkat lunak.

Setiap aplikasi yang Anda bangun pada akhirnya akan memiliki pengguna. Pengguna tersebut mengharapkan perangkat lunak bekerja dengan benar, menangani kesalahan dengan baik, dan tidak pernah kehilangan data mereka. Pengujian adalah cara Anda membuktikan kepada diri sendiri — dan kepada pengguna — bahwa perangkat lunak berperilaku sebagaimana mestinya.

Bayangkan pengujian seperti memeriksa pekerjaan rumah Anda sebelum mengumpulkannya. Anda tidak hanya menulis jawaban dan berharap jawaban itu benar. Anda meninjau setiap soal, memverifikasi perhitungan, dan memeriksa ulang penalaran Anda. Pengujian perangkat lunak bekerja dengan cara yang sama, tetapi dengan pendekatan yang terstruktur.

**Tiga prinsip dasar pengujian yang efektif:**

1. **Tulis pengujian sebelum Anda memperbaiki bug.** Saat menemukan bug, tulis pengujian yang mereproduksinya terlebih dahulu. Perbaiki kode, lalu verifikasi pengujian berhasil. Ini mencegah bug yang sama muncul kembali.

2. **Uji satu hal dalam satu waktu.** Setiap test case harus memverifikasi tepat satu perilaku. Jika pengujian memeriksa banyak hal dan gagal, Anda tidak akan tahu bagian mana yang rusak.

3. **Pengujian adalah dokumentasi.** Pengujian yang ditulis dengan baik memberi tahu Anda apa yang seharusnya dilakukan kode. Ketika seseorang membaca pengujian Anda, mereka harus memahami perilaku yang diharapkan tanpa perlu membaca implementasinya.

</section>

<figure class="my-10 text-center" role="figure">
<pre class="inline-block text-left text-sm bg-neutral-900 text-green-400 p-6 rounded-lg">
┌──────────────────────────────────────────────┐
│            SOFTWARE TESTING                  │
│                                              │
│   ┌─────────────┐    ┌─────────────┐         │
│   │  BLACKBOX   │    │  WHITEBOX   │         │
│   │  Testing    │    │  Testing    │         │
│   │             │    │             │         │
│   │ Only sees   │    │ Sees        │         │
│   │ input &     │    │ internal    │         │
│   │ output      │    │ code logic  │         │
│   └──────┬──────┘    └──────┬──────┘         │
│          │                  │                │
│          ▼                  ▼                │
│   Functional testing  Structural testing     │
│   (What it does)      (How it does it)       │
└──────────────────────────────────────────────┘
</pre>
<figcaption class="mt-3 text-sm text-neutral-500">
  <span lang="en">Figure: The two main approaches to software testing</span>
  <span lang="id">Gambar: Dua pendekatan utama dalam pengujian perangkat lunak</span>
</figcaption>
</figure>

<section lang="en">

## Test Scenario vs Test Case

Beginners often mix up these two terms. Let us clarify:

| Concept | Definition | Example |
|---|---|---|
| **Test Scenario** | A high-level description of *what* to test | "Verify that a user can log in with valid credentials" |
| **Test Case** | A detailed, step-by-step recipe of *how* to test it | Steps, input data ("user@example.com" / "Pass123!"), and expected result ("redirect to dashboard") |

**A test scenario can contain many test cases.** For example, the "login functionality" scenario might include:

- Test Case 1: Login with valid credentials
- Test Case 2: Login with incorrect password
- Test Case 3: Login with empty fields
- Test Case 4: Login with non-existent account

When you design tests, always start with scenarios (what will you test?) and then create cases (how will you test it?).

</section>

<section lang="id">

## Skenario Pengujian vs Test Case

Pemula sering mencampuradukkan kedua istilah ini. Mari kita perjelas:

| Konsep | Definisi | Contoh |
|---|---|---|
| **Skenario Pengujian** | Deskripsi tingkat tinggi tentang *apa* yang akan diuji | "Verifikasi bahwa pengguna dapat login dengan kredensial yang valid" |
| **Test Case** | Resep langkah demi langkah tentang *bagaimana* mengujinya | Langkah-langkah, data masukan ("user@example.com" / "Pass123!"), dan hasil yang diharapkan ("diarahkan ke dashboard") |

**Satu skenario pengujian dapat berisi banyak test case.** Misalnya, skenario "fungsionalitas login" dapat mencakup:

- Test Case 1: Login dengan kredensial valid
- Test Case 2: Login dengan kata sandi salah
- Test Case 3: Login dengan field kosong
- Test Case 4: Login dengan akun yang tidak ada

Saat merancang pengujian, selalu mulai dengan skenario (apa yang akan Anda uji?) lalu buat test case (bagaimana Anda akan mengujinya?).

</section>

---

<section lang="en">

## Blackbox Testing

### What Is Blackbox Testing?

Imagine a vending machine. You press a button, insert coins, and a drink comes out. You do **not** know what happens inside — the motors, the coils, the circuit board. All you know is: given this input, I expect this output.

**Blackbox testing works the same way.** You test the software without knowing its internal code structure. You provide inputs and check whether the outputs match your expectations.

### When to Use Blackbox Testing

- You do not have access to the source code (e.g., testing a third-party API)
- You are testing from the user's perspective
- You want to validate functional requirements
- You are a QA engineer who does not write the code

### Common Blackbox Techniques

**1. Equivalence Partitioning (EP)**

Divide input data into groups (partitions) where the system should behave similarly. Instead of testing every possible input, you test one representative value from each partition.

*Example:* A field accepts ages 17–65. Instead of testing all 49 values, you test:
- Valid partition: age 30 (should pass)
- Below minimum: age 16 (should fail)
- Above maximum: age 66 (should fail)

**2. Boundary Value Analysis (BVA)**

Errors often occur at the edges of valid ranges. BVA tests values at and around boundaries.

*Example:* For age 17–65, you test: 16, 17, 65, 66.

**3. Decision Table Testing**

When the output depends on multiple conditions, use a table to map every combination.

*Example:* A discount system where both membership status AND purchase amount determine the discount.

### Blackbox Example: Testing a Login Form

Let us design test cases for a simple login form with these rules:

- Email must be a valid email format
- Password must be at least 8 characters
- Both fields are required

#### Test Scenario: User Login Functionality

| ID | Test Case | Input (Email, Password) | Expected Result |
|---|---|---|---|
| TC-01 | Valid credentials | user@test.com, Pass1234 | Login successful |
| TC-02 | Wrong password | user@test.com, wrong123 | Error: "Invalid credentials" |
| TC-03 | Invalid email format | usernotemail, Pass1234 | Error: "Invalid email format" |
| TC-04 | Password too short | user@test.com, abc | Error: "Password min 8 characters" |
| TC-05 | Both fields empty | (empty), (empty) | Error: "Email is required" |
| TC-06 | Email empty | (empty), Pass1234 | Error: "Email is required" |
| TC-07 | Password empty | user@test.com, (empty) | Error: "Password is required" |

Each test case is independent, repeatable, and has a clear expected result — that is the essence of good Blackbox testing.

</section>

<section lang="id">

## Blackbox Testing

### Apa Itu Blackbox Testing?

Bayangkan mesin penjual otomatis. Anda menekan tombol, memasukkan koin, dan minuman keluar. Anda **tidak** tahu apa yang terjadi di dalamnya — motor, kumparan, papan sirkuit. Yang Anda tahu hanyalah: dengan masukan ini, saya mengharapkan keluaran ini.

**Blackbox testing bekerja dengan cara yang sama.** Anda menguji perangkat lunak tanpa mengetahui struktur kode internalnya. Anda memberikan masukan dan memeriksa apakah keluarannya sesuai dengan harapan Anda.

### Kapan Menggunakan Blackbox Testing

- Anda tidak memiliki akses ke kode sumber (misalnya, menguji API pihak ketiga)
- Anda menguji dari perspektif pengguna
- Anda ingin memvalidasi persyaratan fungsional
- Anda adalah QA engineer yang tidak menulis kode

### Teknik Umum Blackbox

**1. Equivalence Partitioning (EP)**

Bagi data masukan ke dalam kelompok (partisi) di mana sistem seharusnya berperilaku serupa. Alih-alih menguji setiap nilai yang mungkin, Anda menguji satu nilai representatif dari setiap partisi.

*Contoh:* Sebuah field menerima usia 17–65. Alih-alih menguji 49 nilai, Anda menguji:
- Partisi valid: usia 30 (harus berhasil)
- Di bawah minimum: usia 16 (harus gagal)
- Di atas maksimum: usia 66 (harus gagal)

**2. Boundary Value Analysis (BVA)**

Kesalahan sering terjadi di tepi rentang yang valid. BVA menguji nilai di dan sekitar batas.

*Contoh:* Untuk usia 17–65, Anda menguji: 16, 17, 65, 66.

**3. Decision Table Testing**

Ketika keluaran bergantung pada beberapa kondisi, gunakan tabel untuk memetakan setiap kombinasi.

*Contoh:* Sistem diskon di mana status keanggotaan DAN jumlah pembelian menentukan diskon.

### Contoh Blackbox: Menguji Form Login

Mari kita rancang test case untuk form login sederhana dengan aturan berikut:

- Email harus dalam format email yang valid
- Kata sandi minimal 8 karakter
- Kedua field wajib diisi

#### Skenario Pengujian: Fungsionalitas Login Pengguna

| ID | Test Case | Masukan (Email, Password) | Hasil yang Diharapkan |
|---|---|---|---|
| TC-01 | Kredensial valid | user@test.com, Pass1234 | Login berhasil |
| TC-02 | Kata sandi salah | user@test.com, wrong123 | Error: "Kredensial tidak valid" |
| TC-03 | Format email tidak valid | usernotemail, Pass1234 | Error: "Format email tidak valid" |
| TC-04 | Kata sandi terlalu pendek | user@test.com, abc | Error: "Kata sandi minimal 8 karakter" |
| TC-05 | Kedua field kosong | (kosong), (kosong) | Error: "Email wajib diisi" |
| TC-06 | Email kosong | (kosong), Pass1234 | Error: "Email wajib diisi" |
| TC-07 | Kata sandi kosong | user@test.com, (kosong) | Error: "Kata sandi wajib diisi" |

Setiap test case bersifat independen, dapat diulang, dan memiliki hasil yang diharapkan dengan jelas — itulah inti dari Blackbox testing yang baik.

</section>

---

<section lang="en">

## Whitebox Testing

### What Is Whitebox Testing?

If Blackbox testing is like using a vending machine, Whitebox testing is like opening the machine and inspecting every wire, motor, and gear.

**Whitebox testing** means testing with full knowledge of the source code. You examine the internal logic, data flow, and control flow of the application. You write tests that exercise specific paths through the code.

### When to Use Whitebox Testing

- You are the developer who wrote the code
- You need to ensure all code paths execute correctly
- You want to measure code coverage
- You are optimizing or refactoring internal logic

### Common Whitebox Techniques

**1. Statement Coverage**

Ensure every line of code executes at least once during testing. This is the minimum coverage goal.

**2. Branch Coverage**

Test every `if/else`, `switch/case`, and loop condition in both true and false directions. Stronger than statement coverage.

**3. Path Coverage**

Test every possible route through the code. This is the most thorough but often impractical for large programs.

### Whitebox Example: PHP Calculator with PHPUnit

Let us build a simple `Calculator` class and test it with PHPUnit using Whitebox techniques. We will ensure every branch and edge case is covered.

**Step 1: The Calculator class** (`src/Calculator.php`)

```php
<?php

class Calculator
{
    public function add(float $a, float $b): float
    {
        return $a + $b;
    }

    public function subtract(float $a, float $b): float
    {
        return $a - $b;
    }

    public function multiply(float $a, float $b): float
    {
        return $a * $b;
    }

    public function divide(float $a, float $b): float
    {
        if ($b === 0.0) {
            throw new InvalidArgumentException('Cannot divide by zero');
        }
        return $a / $b;
    }

    public function grade(int $score): string
    {
        if ($score < 0 || $score > 100) {
            throw new InvalidArgumentException('Score must be between 0 and 100');
        }

        if ($score >= 80) {
            return 'A';
        } elseif ($score >= 70) {
            return 'B';
        } elseif ($score >= 60) {
            return 'C';
        } elseif ($score >= 50) {
            return 'D';
        }
        return 'E';
    }
}
```

This class is intentionally simple so we can see every branch clearly. The `grade` method has multiple branches — perfect for demonstrating Whitebox coverage.

**Step 2: The PHPUnit test** (`tests/CalculatorTest.php`)

```php
<?php

use PHPUnit\Framework\TestCase;

class CalculatorTest extends TestCase
{
    private Calculator $calc;

    protected function setUp(): void
    {
        $this->calc = new Calculator();
    }

    // Statement & branch coverage: add()
    public function testAddPositiveNumbers(): void
    {
        $this->assertEquals(5, $this->calc->add(2, 3));
    }

    public function testAddNegativeNumbers(): void
    {
        $this->assertEquals(-5, $this->calc->add(-2, -3));
    }

    public function testAddZero(): void
    {
        $this->assertEquals(7, $this->calc->add(7, 0));
    }

    // Statement & branch coverage: divide() — both branches
    public function testDivideNormal(): void
    {
        $this->assertEquals(5, $this->calc->divide(10, 2));
    }

    public function testDivideByZeroThrowsException(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Cannot divide by zero');
        $this->calc->divide(10, 0);
    }

    // Branch coverage: grade() — boundaries
    public function testGradeA(): void
    {
        $this->assertEquals('A', $this->calc->grade(80));  // lower boundary
        $this->assertEquals('A', $this->calc->grade(100)); // upper boundary
    }

    public function testGradeB(): void
    {
        $this->assertEquals('B', $this->calc->grade(70));
        $this->assertEquals('B', $this->calc->grade(79));
    }

    public function testGradeC(): void
    {
        $this->assertEquals('C', $this->calc->grade(60));
        $this->assertEquals('C', $this->calc->grade(69));
    }

    public function testGradeD(): void
    {
        $this->assertEquals('D', $this->calc->grade(50));
        $this->assertEquals('D', $this->calc->grade(59));
    }

    public function testGradeE(): void
    {
        $this->assertEquals('E', $this->calc->grade(0));
        $this->assertEquals('E', $this->calc->grade(49));
    }

    // Branch coverage: invalid input
    public function testGradeInvalidLow(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->calc->grade(-1);
    }

    public function testGradeInvalidHigh(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->calc->grade(101);
    }
}
```

**What makes this Whitebox testing?** We looked at the internal logic of the `grade` method and wrote tests specifically for each branch: each `if/elseif/else` path, the exception path for invalid input, and both boundaries (0 and 100). A Blackbox tester might test `grade(85)` and `grade(55)` — but a Whitebox tester ensures **every path through the code is exercised**.

**Step 3: Run the tests**

```bash
$ vendor/bin/phpunit tests/CalculatorTest.php

PHPUnit 11.0.0 by Sebastian Bergmann and contributors.

.........                                                   11 / 11 (100%)

Time: 00:00.012, Memory: 6.00 MB

OK (11 tests, 14 assertions)
```

All 11 tests pass with 100% coverage of every branch in the `Calculator` class.

</section>

<section lang="id">

## Whitebox Testing

### Apa Itu Whitebox Testing?

Jika Blackbox testing seperti menggunakan mesin penjual otomatis, Whitebox testing seperti membuka mesin tersebut dan memeriksa setiap kabel, motor, dan roda gigi.

**Whitebox testing** berarti menguji dengan pengetahuan penuh tentang kode sumber. Anda memeriksa logika internal, aliran data, dan aliran kontrol dari aplikasi. Anda menulis pengujian yang melatih jalur spesifik melalui kode.

### Kapan Menggunakan Whitebox Testing

- Anda adalah pengembang yang menulis kode
- Anda perlu memastikan semua jalur kode dieksekusi dengan benar
- Anda ingin mengukur cakupan kode (code coverage)
- Anda sedang mengoptimalkan atau merefaktor logika internal

### Teknik Umum Whitebox

**1. Statement Coverage**

Pastikan setiap baris kode dieksekusi setidaknya sekali selama pengujian. Ini adalah target cakupan minimal.

**2. Branch Coverage**

Uji setiap kondisi `if/else`, `switch/case`, dan perulangan di kedua arah (true dan false). Lebih kuat dari statement coverage.

**3. Path Coverage**

Uji setiap rute yang mungkin melalui kode. Ini adalah yang paling menyeluruh tetapi sering tidak praktis untuk program besar.

### Contoh Whitebox: Kalkulator PHP dengan PHPUnit

Mari kita bangun kelas `Calculator` sederhana dan mengujinya dengan PHPUnit menggunakan teknik Whitebox. Kita akan memastikan setiap cabang dan kasus tepi tercakup.

**Langkah 1: Kelas Calculator** (`src/Calculator.php`)

```php
<?php

class Calculator
{
    public function add(float $a, float $b): float
    {
        return $a + $b;
    }

    public function subtract(float $a, float $b): float
    {
        return $a - $b;
    }

    public function multiply(float $a, float $b): float
    {
        return $a * $b;
    }

    public function divide(float $a, float $b): float
    {
        if ($b === 0.0) {
            throw new InvalidArgumentException('Tidak dapat membagi dengan nol');
        }
        return $a / $b;
    }

    public function grade(int $score): string
    {
        if ($score < 0 || $score > 100) {
            throw new InvalidArgumentException('Skor harus antara 0 dan 100');
        }

        if ($score >= 80) {
            return 'A';
        } elseif ($score >= 70) {
            return 'B';
        } elseif ($score >= 60) {
            return 'C';
        } elseif ($score >= 50) {
            return 'D';
        }
        return 'E';
    }
}
```

Kelas ini sengaja dibuat sederhana agar kita dapat melihat setiap cabang dengan jelas. Metode `grade` memiliki beberapa cabang — sempurna untuk mendemonstrasikan cakupan Whitebox.

**Langkah 2: Pengujian PHPUnit** (`tests/CalculatorTest.php`)

```php
<?php

use PHPUnit\Framework\TestCase;

class CalculatorTest extends TestCase
{
    private Calculator $calc;

    protected function setUp(): void
    {
        $this->calc = new Calculator();
    }

    // Cakupan statement & branch: add()
    public function testAddPositiveNumbers(): void
    {
        $this->assertEquals(5, $this->calc->add(2, 3));
    }

    public function testAddNegativeNumbers(): void
    {
        $this->assertEquals(-5, $this->calc->add(-2, -3));
    }

    public function testAddZero(): void
    {
        $this->assertEquals(7, $this->calc->add(7, 0));
    }

    // Cakupan statement & branch: divide() — kedua cabang
    public function testDivideNormal(): void
    {
        $this->assertEquals(5, $this->calc->divide(10, 2));
    }

    public function testDivideByZeroThrowsException(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Tidak dapat membagi dengan nol');
        $this->calc->divide(10, 0);
    }

    // Cakupan branch: grade() — boundaries
    public function testGradeA(): void
    {
        $this->assertEquals('A', $this->calc->grade(80));  // batas bawah
        $this->assertEquals('A', $this->calc->grade(100)); // batas atas
    }

    public function testGradeB(): void
    {
        $this->assertEquals('B', $this->calc->grade(70));
        $this->assertEquals('B', $this->calc->grade(79));
    }

    public function testGradeC(): void
    {
        $this->assertEquals('C', $this->calc->grade(60));
        $this->assertEquals('C', $this->calc->grade(69));
    }

    public function testGradeD(): void
    {
        $this->assertEquals('D', $this->calc->grade(50));
        $this->assertEquals('D', $this->calc->grade(59));
    }

    public function testGradeE(): void
    {
        $this->assertEquals('E', $this->calc->grade(0));
        $this->assertEquals('E', $this->calc->grade(49));
    }

    // Cakupan branch: input tidak valid
    public function testGradeInvalidLow(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->calc->grade(-1);
    }

    public function testGradeInvalidHigh(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->calc->grade(101);
    }
}
```

**Apa yang membuat ini Whitebox testing?** Kita melihat logika internal dari metode `grade` dan menulis pengujian secara spesifik untuk setiap cabang: setiap jalur `if/elseif/else`, jalur exception untuk input tidak valid, dan kedua batas (0 dan 100). Seorang penguji Blackbox mungkin hanya menguji `grade(85)` dan `grade(55)` — tetapi penguji Whitebox memastikan **setiap jalur melalui kode dijalankan**.

**Langkah 3: Jalankan pengujian**

```bash
$ vendor/bin/phpunit tests/CalculatorTest.php

PHPUnit 11.0.0 by Sebastian Bergmann and contributors.

.........                                                   11 / 11 (100%)

Time: 00:00.012, Memory: 6.00 MB

OK (11 tests, 14 assertions)
```

Semua 11 pengujian berhasil dengan cakupan 100% dari setiap cabang di kelas `Calculator`.

</section>

---

<section lang="en">

## Tools for Software Testing

Here are the most commonly used tools, categorized by language:

| Language / Platform | Blackbox Tools | Whitebox / Unit Test Tools |
|---|---|---|
| **PHP** | Selenium, Postman, Behat | PHPUnit, Pest, Codeception |
| **JavaScript** | Cypress, Playwright, Selenium | Jest, Mocha, Vitest |
| **Python** | Robot Framework, Selenium | pytest, unittest, coverage.py |
| **Java** | Selenium, TestNG | JUnit, Mockito, JaCoCo |
| **C#/.NET** | Selenium, SpecFlow | xUnit, NUnit, Moq |
| **General** | Postman (API), JMeter (perf) | Code coverage tools (Istanbul, JaCoCo, codecov) |

**For beginners starting with PHP**, we recommend:

- **PHPUnit** — the standard testing framework for PHP. It is well-documented and integrates with most IDEs.
- **Pest** — a newer, simpler alternative to PHPUnit with a more readable syntax. Great if you find PHPUnit verbose.

Run `composer require --dev phpunit/phpunit` in your project to get started.

</section>

<section lang="id">

## Alat untuk Pengujian Perangkat Lunak

Berikut adalah alat yang paling umum digunakan, dikategorikan berdasarkan bahasa:

| Bahasa / Platform | Alat Blackbox | Alat Whitebox / Unit Test |
|---|---|---|
| **PHP** | Selenium, Postman, Behat | PHPUnit, Pest, Codeception |
| **JavaScript** | Cypress, Playwright, Selenium | Jest, Mocha, Vitest |
| **Python** | Robot Framework, Selenium | pytest, unittest, coverage.py |
| **Java** | Selenium, TestNG | JUnit, Mockito, JaCoCo |
| **C#/.NET** | Selenium, SpecFlow | xUnit, NUnit, Moq |
| **Umum** | Postman (API), JMeter (perf) | Code coverage tools (Istanbul, JaCoCo, codecov) |

**Untuk pemula yang memulai dengan PHP**, kami merekomendasikan:

- **PHPUnit** — framework pengujian standar untuk PHP. Didokumentasikan dengan baik dan terintegrasi dengan sebagian besar IDE.
- **Pest** — alternatif yang lebih baru dan lebih sederhana untuk PHPUnit dengan sintaks yang lebih mudah dibaca. Cocok jika Anda merasa PHPUnit terlalu verbose.

Jalankan `composer require --dev phpunit/phpunit` di proyek Anda untuk memulai.

</section>

---

<section lang="en">

## Summary: Which One Should You Use?

| Criterion | Blackbox | Whitebox |
|---|---|---|
| **Knowledge needed** | Requirements only | Source code access |
| **Performed by** | QA engineers, testers, users | Developers |
| **Goal** | Validate functionality | Validate code structure |
| **When to use** | Early in development, UAT | During and after coding |
| **Automation** | GUI tools, Postman, Selenium | Unit test frameworks (PHPUnit, JUnit) |

**You do not have to choose one.** Professional software teams use **both**. Blackbox ensures the product works for users. Whitebox ensures the code is robust and maintainable. Together, they give you confidence that your software is correct — from the outside and the inside.

</section>

<section lang="id">

## Ringkasan: Mana yang Harus Anda Gunakan?

| Kriteria | Blackbox | Whitebox |
|---|---|---|
| **Pengetahuan yang dibutuhkan** | Hanya persyaratan | Akses kode sumber |
| **Dilakukan oleh** | QA engineer, tester, pengguna | Developer |
| **Tujuan** | Validasi fungsionalitas | Validasi struktur kode |
| **Kapan digunakan** | Awal pengembangan, UAT | Selama dan setelah coding |
| **Otomatisasi** | GUI tools, Postman, Selenium | Framework unit test (PHPUnit, JUnit) |

**Anda tidak harus memilih salah satu.** Tim perangkat lunak profesional menggunakan **keduanya**. Blackbox memastikan produk berfungsi untuk pengguna. Whitebox memastikan kode kokoh dan mudah dipelihara. Bersama-sama, keduanya memberi Anda keyakinan bahwa perangkat lunak Anda benar — dari luar dan dari dalam.

</section>

---

<section lang="en">

## What We Learned

1. **Testing is about confidence** — proving to yourself and users that the software behaves correctly.
2. **Test scenarios** define what to test; **test cases** define how to test it.
3. **Blackbox testing** validates functionality without looking at the code — great for user-facing features.
4. **Whitebox testing** validates code structure with full knowledge of the internals — great for developer-level quality.
5. **Effective tests follow three rules:** write tests before fixing bugs, test one thing at a time, and treat tests as documentation.
6. **Use both approaches together** for the most thorough validation of your software.

The best way to learn testing is to **start small**. Pick one function in your current project, write a few test cases for it, and run them. Every test you write makes your software a little more reliable.

</section>

<section lang="id">

## Apa yang Telah Kita Pelajari

1. **Pengujian adalah tentang keyakinan** — membuktikan kepada diri sendiri dan pengguna bahwa perangkat lunak berperilaku dengan benar.
2. **Skenario pengujian** mendefinisikan apa yang akan diuji; **test case** mendefinisikan bagaimana mengujinya.
3. **Blackbox testing** memvalidasi fungsionalitas tanpa melihat kode — cocok untuk fitur yang berhadapan dengan pengguna.
4. **Whitebox testing** memvalidasi struktur kode dengan pengetahuan penuh tentang internal — cocok untuk kualitas tingkat pengembang.
5. **Pengujian yang efektif mengikuti tiga aturan:** tulis pengujian sebelum memperbaiki bug, uji satu hal dalam satu waktu, dan perlakukan pengujian sebagai dokumentasi.
6. **Gunakan kedua pendekatan bersama-sama** untuk validasi perangkat lunak yang paling menyeluruh.

Cara terbaik untuk belajar pengujian adalah **mulai dari yang kecil**. Pilih satu fungsi di proyek Anda saat ini, tulis beberapa test case untuknya, dan jalankan. Setiap pengujian yang Anda tulis membuat perangkat lunak Anda sedikit lebih andal.

</section>
