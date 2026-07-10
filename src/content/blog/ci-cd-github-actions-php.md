---
title: "CI/CD with GitHub Actions for PHP Projects"
titleId: "CI/CD dengan GitHub Actions untuk Proyek PHP"
date: 2026-07-10
updated: 2026-07-10
category: tutorial
author: SE Lab
lang: en
featured: false
excerpt: "Learn how to automate the build-test-deploy pipeline for PHP projects using GitHub Actions. Covers workflow syntax, Composer caching, PHPUnit matrix testing across multiple PHP versions, deployment to VPS via SSH, and managing secrets and environment variables securely."
excerptId: "Pelajari cara mengotomatiskan pipeline build-test-deploy untuk proyek PHP menggunakan GitHub Actions. Mencakup sintaks workflow, caching Composer, matrix testing PHPUnit di berbagai versi PHP, deployment ke VPS via SSH, dan mengelola secrets dan environment variables dengan aman."
stream: se-methodologies-architecture
tags:
  - CI/CD
  - GitHub Actions
  - PHP
  - Automation
  - DevOps
tagsId:
  - CI/CD
  - GitHub Actions
  - PHP
  - Otomatisasi
  - DevOps
---

<section lang="en">

## What Is CI/CD and Why Should You Care?

**Continuous Integration (CI)** is the practice of automatically building and testing your code every time you push changes to a shared repository. Instead of waiting until the night before a deadline to discover that your branch conflicts with a teammate's work, CI gives you an answer within minutes of every push: did my change break anything?

**Continuous Delivery / Deployment (CD)** extends CI by automating the release process. Once your code passes all tests and quality checks, CD can deliver it to a staging environment (Continuous Delivery) or all the way to production (Continuous Deployment) — without a human copying files via FTP at 2 AM.

Together, CI/CD forms the backbone of modern software delivery. It replaces hope with evidence. You do not *hope* your merge works. You push, the pipeline runs, and you know.

### The Problem CI/CD Solves

Without CI/CD, the typical student or small-team workflow looks like this:

1. Write code locally
2. Run tests locally (if you remember)
3. Push to GitHub
4. Manually pull on the server
5. Run `composer install` on the server
6. Hope nothing broke
7. Discover something broke
8. SSH in at midnight to fix it

With CI/CD, steps 2 through 8 become a single automated pipeline. You push code, and the machine does everything else — including telling you exactly what went wrong if something fails.

### Connection to SE Lab Research

The Software Engineering Lab at Politeknik Negeri Malang researches **SE Methodologies & Architecture**, which includes build automation, deployment pipelines, and quality assurance workflows. This tutorial bridges the gap between the testing tutorials (TDD, blackbox/whitebox) and shipping real software — a critical skill for internships, thesis projects, and open-source contributions.

### What You Will Learn

By the end of this tutorial you will be able to:

- Write a complete `.github/workflows/php.yml` workflow file from scratch
- Cache Composer dependencies to speed up builds
- Use a **matrix strategy** to test against multiple PHP versions in parallel
- Add code quality gates (PHPStan, PHPCS) to the pipeline
- Deploy to a VPS via SSH as the final CD step
- Store and use secrets for sensitive data like SSH keys and database passwords
- Debug common workflow failures using GitHub Actions logs
- Decide when CI/CD is worth the effort and when it is overkill

</section>

<section lang="id">

## Apa Itu CI/CD dan Mengapa Anda Harus Peduli?

**Continuous Integration (CI)** adalah praktik membangun dan menguji kode Anda secara otomatis setiap kali Anda mendorong perubahan ke repositori bersama. Alih-alih menunggu hingga malam sebelum tenggat waktu untuk mengetahui bahwa cabang Anda bentrok dengan pekerjaan rekan tim, CI memberi Anda jawaban dalam hitungan menit setelah setiap push: apakah perubahan saya merusak sesuatu?

**Continuous Delivery / Deployment (CD)** memperluas CI dengan mengotomatiskan proses rilis. Setelah kode Anda lulus semua pengujian dan pemeriksaan kualitas, CD dapat mengirimkannya ke lingkungan staging (Continuous Delivery) atau langsung ke production (Continuous Deployment) — tanpa manusia menyalin file via FTP pada pukul 2 pagi.

Bersama-sama, CI/CD membentuk tulang punggung pengiriman perangkat lunak modern. Ia menggantikan harapan dengan bukti. Anda tidak *berharap* merge Anda berhasil. Anda push, pipeline berjalan, dan Anda tahu.

### Masalah yang Dipecahkan CI/CD

Tanpa CI/CD, alur kerja mahasiswa atau tim kecil yang umum terlihat seperti ini:

1. Tulis kode secara lokal
2. Jalankan pengujian secara lokal (jika Anda ingat)
3. Push ke GitHub
4. Tarik secara manual di server
5. Jalankan `composer install` di server
6. Berharap tidak ada yang rusak
7. Temukan sesuatu yang rusak
8. SSH masuk tengah malam untuk memperbaikinya

Dengan CI/CD, langkah 2 hingga 8 menjadi satu pipeline otomatis. Anda mendorong kode, dan mesin melakukan segalanya — termasuk memberi tahu Anda dengan tepat apa yang salah jika sesuatu gagal.

### Koneksi ke Riset SE Lab

Software Engineering Lab Politeknik Negeri Malang meneliti **SE Methodologies & Architecture**, yang mencakup otomatisasi build, pipeline deployment, dan alur kerja jaminan kualitas. Tutorial ini menjembatani kesenjangan antara tutorial pengujian (TDD, blackbox/whitebox) dan mengirimkan perangkat lunak nyata — keterampilan penting untuk magang, proyek skripsi, dan kontribusi open-source.

### Apa yang Akan Anda Pelajari

Di akhir tutorial ini Anda akan mampu:

- Menulis file workflow `.github/workflows/php.yml` lengkap dari awal
- Men-cache dependensi Composer untuk mempercepat build
- Menggunakan **matrix strategy** untuk menguji terhadap beberapa versi PHP secara paralel
- Menambahkan gerbang kualitas kode (PHPStan, PHPCS) ke pipeline
- Melakukan deploy ke VPS via SSH sebagai langkah CD akhir
- Menyimpan dan menggunakan secrets untuk data sensitif seperti kunci SSH dan kata sandi database
- Men-debug kegagalan workflow umum menggunakan log GitHub Actions
- Memutuskan kapan CI/CD sepadan dengan usahanya dan kapan berlebihan

</section>

---

<section lang="en">

## GitHub Actions Basics: Workflow, Jobs, Steps, and Runners

GitHub Actions is a CI/CD platform built directly into GitHub. It is free for public repositories and includes 2,000–3,000 minutes per month for private repositories on the free plan. You configure it by creating YAML files in `.github/workflows/`.

### The Four Building Blocks

Every GitHub Actions pipeline consists of four concepts:

| Concept | What It Is | Analogy |
|---------|-----------|---------|
| **Workflow** | A YAML file that defines the entire pipeline | The blueprint for a factory |
| **Job** | A group of steps that run on the same runner | One assembly line in the factory |
| **Step** | A single command or action within a job | One station on the assembly line |
| **Runner** | A virtual machine that executes the jobs | The factory floor where work happens |

A workflow can contain multiple jobs. By default, jobs run **in parallel** on separate runners. If you need one job to wait for another, you specify `needs`.

### Triggering a Workflow

Workflows are triggered by **events**. The most common event is `push`:

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
```

This workflow runs when you push to `main` or `develop`, or when someone opens a pull request against `main`. Other useful events include `schedule` (cron-based), `workflow_dispatch` (manual trigger), and `release`.

### The Minimal Workflow File

```yaml
name: PHP CI

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Run a one-line script
        run: echo "Hello, CI/CD!"
```

This file does three things: (1) it triggers on push to `main`, (2) it spins up an Ubuntu VM, and (3) it checks out your code and prints a message. Real pipelines build on this skeleton.

</section>

<section lang="id">

## Dasar-Dasar GitHub Actions: Workflow, Jobs, Steps, dan Runners

GitHub Actions adalah platform CI/CD yang terintegrasi langsung ke dalam GitHub. Gratis untuk repositori publik dan mencakup 2.000–3.000 menit per bulan untuk repositori privat pada paket gratis. Anda mengonfigurasinya dengan membuat file YAML di `.github/workflows/`.

### Empat Blok Bangunan

Setiap pipeline GitHub Actions terdiri dari empat konsep:

| Konsep | Apa Itu | Analogi |
|--------|---------|---------|
| **Workflow** | File YAML yang mendefinisikan seluruh pipeline | Cetak biru untuk sebuah pabrik |
| **Job** | Sekelompok langkah yang berjalan pada runner yang sama | Satu jalur perakitan di pabrik |
| **Step** | Satu perintah atau action dalam sebuah job | Satu stasiun di jalur perakitan |
| **Runner** | Mesin virtual yang mengeksekusi job | Lantai pabrik tempat pekerjaan terjadi |

Sebuah workflow dapat berisi beberapa job. Secara default, job berjalan **secara paralel** pada runner terpisah. Jika Anda memerlukan satu job menunggu job lain, Anda menentukan `needs`.

### Memicu Workflow

Workflow dipicu oleh **event**. Event yang paling umum adalah `push`:

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
```

Workflow ini berjalan ketika Anda push ke `main` atau `develop`, atau ketika seseorang membuka pull request terhadap `main`. Event berguna lainnya termasuk `schedule` (berbasis cron), `workflow_dispatch` (pemicu manual), dan `release`.

### File Workflow Minimal

```yaml
name: PHP CI

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Run a one-line script
        run: echo "Hello, CI/CD!"
```

File ini melakukan tiga hal: (1) dipicu saat push ke `main`, (2) menjalankan VM Ubuntu, dan (3) men-checkout kode Anda dan mencetak pesan. Pipeline nyata dibangun di atas kerangka ini.

</section>

---

<section lang="en">

## Setting Up a PHP Project for CI

Before we write any workflow YAML, we need a PHP project with tests. If you already have one, skip to the next section. Otherwise, follow these steps to create a minimal project.

### Create the Project

```bash
$ mkdir php-ci-demo && cd php-ci-demo
$ composer init --name="polinema/ci-demo" --type="project" --no-interaction
$ composer require --dev phpunit/phpunit
```

Your project structure should look like this:

```
php-ci-demo/
├── composer.json
├── composer.lock
├── src/
│   └── Calculator.php
├── tests/
│   └── CalculatorTest.php
└── vendor/
```

### Write the Production Code

Create `src/Calculator.php`:

```php
<?php

declare(strict_types=1);

namespace App;

class Calculator
{
    public function add(int $a, int $b): int
    {
        return $a + $b;
    }

    public function subtract(int $a, int $b): int
    {
        return $a - $b;
    }

    public function multiply(int $a, int $b): int
    {
        return $a * $b;
    }

    public function divide(int $a, int $b): float
    {
        if ($b === 0) {
            throw new \InvalidArgumentException('Division by zero');
        }
        return $a / $b;
    }
}
```

### Write the Tests

Create `tests/CalculatorTest.php`:

```php
<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

class CalculatorTest extends TestCase
{
    private Calculator $calculator;

    protected function setUp(): void
    {
        $this->calculator = new Calculator();
    }

    public function testAdd(): void
    {
        $this->assertEquals(5, $this->calculator->add(2, 3));
    }

    public function testSubtract(): void
    {
        $this->assertEquals(1, $this->calculator->subtract(3, 2));
    }

    public function testMultiply(): void
    {
        $this->assertEquals(6, $this->calculator->multiply(2, 3));
    }

    public function testDivide(): void
    {
        $this->assertEquals(2.5, $this->calculator->divide(5, 2));
    }

    public function testDivideByZeroThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->calculator->divide(5, 0);
    }
}
```

### Configure PHPUnit

Create `phpunit.xml` in the project root:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit bootstrap="vendor/autoload.php"
         colors="true"
         cacheDirectory=".phpunit.cache">
    <testsuites>
        <testsuite name="Calculator">
            <directory>tests</directory>
        </testsuite>
    </testsuites>
    <source>
        <include>
            <directory>src</directory>
        </include>
    </source>
</phpunit>
```

### Configure Composer Autoloading

Add the autoload section to `composer.json`:

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        }
    }
}
```

Then regenerate the autoloader:

```bash
$ composer dump-autoload
```

### Verify Locally

Run the tests to confirm everything works before we move to CI:

```bash
$ vendor/bin/phpunit

PHPUnit 11.0.0 by Sebastian Bergmann and contributors.

.....                                                    5 / 5 (100%)

Time: 00:00.006, Memory: 6.00 MB

OK (5 tests, 5 assertions)
```

All green. We are ready to automate.

</section>

<section lang="id">

## Menyiapkan Proyek PHP untuk CI

Sebelum kita menulis YAML workflow apa pun, kita memerlukan proyek PHP dengan pengujian. Jika Anda sudah memilikinya, lewati ke bagian berikutnya. Jika belum, ikuti langkah-langkah ini untuk membuat proyek minimal.

### Buat Proyek

```bash
$ mkdir php-ci-demo && cd php-ci-demo
$ composer init --name="polinema/ci-demo" --type="project" --no-interaction
$ composer require --dev phpunit/phpunit
```

Struktur proyek Anda seharusnya terlihat seperti ini:

```
php-ci-demo/
├── composer.json
├── composer.lock
├── src/
│   └── Calculator.php
├── tests/
│   └── CalculatorTest.php
└── vendor/
```

### Tulis Kode Produksi

Buat `src/Calculator.php`:

```php
<?php

declare(strict_types=1);

namespace App;

class Calculator
{
    public function add(int $a, int $b): int
    {
        return $a + $b;
    }

    public function subtract(int $a, int $b): int
    {
        return $a - $b;
    }

    public function multiply(int $a, int $b): int
    {
        return $a * $b;
    }

    public function divide(int $a, int $b): float
    {
        if ($b === 0) {
            throw new \InvalidArgumentException('Division by zero');
        }
        return $a / $b;
    }
}
```

### Tulis Pengujian

Buat `tests/CalculatorTest.php`:

```php
<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

class CalculatorTest extends TestCase
{
    private Calculator $calculator;

    protected function setUp(): void
    {
        $this->calculator = new Calculator();
    }

    public function testAdd(): void
    {
        $this->assertEquals(5, $this->calculator->add(2, 3));
    }

    public function testSubtract(): void
    {
        $this->assertEquals(1, $this->calculator->subtract(3, 2));
    }

    public function testMultiply(): void
    {
        $this->assertEquals(6, $this->calculator->multiply(2, 3));
    }

    public function testDivide(): void
    {
        $this->assertEquals(2.5, $this->calculator->divide(5, 2));
    }

    public function testDivideByZeroThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->calculator->divide(5, 0);
    }
}
```

### Konfigurasi PHPUnit

Buat `phpunit.xml` di root proyek:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit bootstrap="vendor/autoload.php"
         colors="true"
         cacheDirectory=".phpunit.cache">
    <testsuites>
        <testsuite name="Calculator">
            <directory>tests</directory>
        </testsuite>
    </testsuites>
    <source>
        <include>
            <directory>src</directory>
        </include>
    </source>
</phpunit>
```

### Konfigurasi Autoloading Composer

Tambahkan bagian autoload ke `composer.json`:

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        }
    }
}
```

Kemudian regenerasi autoloader:

```bash
$ composer dump-autoload
```

### Verifikasi Secara Lokal

Jalankan pengujian untuk mengonfirmasi semuanya bekerja sebelum kita beralih ke CI:

```bash
$ vendor/bin/phpunit

PHPUnit 11.0.0 by Sebastian Bergmann and contributors.

.....                                                    5 / 5 (100%)

Time: 00:00.006, Memory: 6.00 MB

OK (5 tests, 5 assertions)
```

Semua hijau. Kita siap untuk mengotomatisasi.

</section>

---

<section lang="en">

## Writing Your First Workflow: Install, Test, and Cache

Now we create the workflow file that automates everything we just did manually. Create `.github/workflows/php.yml`:

```yaml
name: PHP CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Run PHPUnit Tests
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          coverage: none

      - name: Get Composer cache directory
        id: composer-cache
        run: echo "dir=$(composer config cache-files-dir)" >> $GITHUB_OUTPUT

      - uses: actions/cache@v4
        with:
          path: ${{ steps.composer-cache.outputs.dir }}
          key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
          restore-keys: |
            ${{ runner.os }}-composer-

      - name: Install dependencies
        run: composer install --no-progress --no-interaction --prefer-dist

      - name: Run PHPUnit
        run: vendor/bin/phpunit
```

### Walkthrough: What Each Step Does

**`actions/checkout@v4`** — Clones your repository onto the runner. Without this, the runner is an empty machine.

**`shivammathur/setup-php@v2`** — Installs PHP with the specified version, Composer, and optional extensions. This is the community-standard PHP action, maintained by Shivam Mathur. It handles PHP installation, extension setup, and `php.ini` configuration.

**Composer cache step** — The `composer config cache-files-dir` command returns the path where Composer stores downloaded packages. We save this path to `$GITHUB_OUTPUT` so the caching step can use it.

**`actions/cache@v4`** — GitHub's official caching action. It stores the Composer cache directory and restores it on subsequent runs if the `composer.lock` hash has not changed. This turns a 60-second `composer install` into a 5-second one.

**`composer install`** — Installs project dependencies. The flags `--no-progress`, `--no-interaction`, and `--prefer-dist` make it suitable for non-interactive CI environments.

**`vendor/bin/phpunit`** — Runs the test suite. If any test fails, the step exits with a non-zero code, and the job is marked as failed.

### Why Caching Matters

On the first run, `composer install` downloads every package from scratch — typically 30–90 seconds. On subsequent runs with a cache hit, Composer finds the packages already stored locally and installation drops to 3–10 seconds. Over 100 workflow runs, this saves roughly an hour of compute time.

### Commit and Push

```bash
$ git init
$ git add .
$ git commit -m "Add PHP CI workflow"
$ git branch -M main
$ git remote add origin https://github.com/your-username/php-ci-demo.git
$ git push -u origin main
```

Switch to the **Actions** tab in your GitHub repository. You should see the workflow running — and passing.

</section>

<section lang="id">

## Menulis Workflow Pertama Anda: Install, Test, dan Cache

Sekarang kita membuat file workflow yang mengotomatiskan semua yang baru saja kita lakukan secara manual. Buat `.github/workflows/php.yml`:

```yaml
name: PHP CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Run PHPUnit Tests
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          coverage: none

      - name: Get Composer cache directory
        id: composer-cache
        run: echo "dir=$(composer config cache-files-dir)" >> $GITHUB_OUTPUT

      - uses: actions/cache@v4
        with:
          path: ${{ steps.composer-cache.outputs.dir }}
          key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
          restore-keys: |
            ${{ runner.os }}-composer-

      - name: Install dependencies
        run: composer install --no-progress --no-interaction --prefer-dist

      - name: Run PHPUnit
        run: vendor/bin/phpunit
```

### Penjelasan: Apa yang Dilakukan Setiap Langkah

**`actions/checkout@v4`** — Mengkloning repositori Anda ke runner. Tanpa ini, runner adalah mesin kosong.

**`shivammathur/setup-php@v2`** — Menginstal PHP dengan versi yang ditentukan, Composer, dan ekstensi opsional. Ini adalah action PHP standar komunitas, dikelola oleh Shivam Mathur. Action ini menangani instalasi PHP, setup ekstensi, dan konfigurasi `php.ini`.

**Langkah cache Composer** — Perintah `composer config cache-files-dir` mengembalikan path tempat Composer menyimpan paket yang diunduh. Kita menyimpan path ini ke `$GITHUB_OUTPUT` agar langkah caching dapat menggunakannya.

**`actions/cache@v4`** — Action caching resmi GitHub. Ini menyimpan direktori cache Composer dan mengembalikannya pada run berikutnya jika hash `composer.lock` tidak berubah. Ini mengubah `composer install` 60 detik menjadi 5 detik.

**`composer install`** — Menginstal dependensi proyek. Flag `--no-progress`, `--no-interaction`, dan `--prefer-dist` membuatnya cocok untuk lingkungan CI non-interaktif.

**`vendor/bin/phpunit`** — Menjalankan suite pengujian. Jika ada pengujian yang gagal, langkah keluar dengan kode non-nol, dan job ditandai sebagai gagal.

### Mengapa Caching Penting

Pada run pertama, `composer install` mengunduh setiap paket dari awal — biasanya 30–90 detik. Pada run berikutnya dengan cache hit, Composer menemukan paket sudah tersimpan secara lokal dan instalasi turun menjadi 3–10 detik. Selama 100 run workflow, ini menghemat sekitar satu jam waktu komputasi.

### Commit dan Push

```bash
$ git init
$ git add .
$ git commit -m "Add PHP CI workflow"
$ git branch -M main
$ git remote add origin https://github.com/your-username/php-ci-demo.git
$ git push -u origin main
```

Beralihlah ke tab **Actions** di repositori GitHub Anda. Anda seharusnya melihat workflow berjalan — dan berhasil.

</section>

---

<section lang="en">

## Running PHPUnit Across Multiple PHP Versions with a Matrix

Real projects need to support multiple PHP versions. Your production server might run PHP 8.2 while a client's environment still uses 8.1 — or your library claims support for 8.0 through 8.3 and you need to prove it.

GitHub Actions supports **matrix strategies**: you define a list of values, and the runner spawns one parallel job for each combination. For PHP, the most common matrix dimension is `php-version`.

### The Matrix Workflow

Replace your single `test` job with a matrix:

```yaml
name: PHP CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    name: PHP ${{ matrix.php-version }}
    runs-on: ubuntu-latest

    strategy:
      fail-fast: false
      matrix:
        php-version: ['8.0', '8.1', '8.2', '8.3']

    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP ${{ matrix.php-version }}
        uses: shivammathur/setup-php@v2
        with:
          php-version: ${{ matrix.php-version }}
          coverage: none

      - name: Get Composer cache directory
        id: composer-cache
        run: echo "dir=$(composer config cache-files-dir)" >> $GITHUB_OUTPUT

      - uses: actions/cache@v4
        with:
          path: ${{ steps.composer-cache.outputs.dir }}
          key: ${{ runner.os }}-composer-${{ matrix.php-version }}-${{ hashFiles('**/composer.lock') }}
          restore-keys: |
            ${{ runner.os }}-composer-${{ matrix.php-version }}-

      - name: Install dependencies
        run: composer install --no-progress --no-interaction --prefer-dist

      - name: Run PHPUnit
        run: vendor/bin/phpunit
```

### Key Additions

**`strategy.fail-fast: false`** — By default, GitHub cancels all matrix jobs as soon as one fails. Setting `fail-fast` to `false` lets all versions run to completion, so you see the full picture. If PHP 8.0 fails but 8.1, 8.2, and 8.3 pass, you know the problem is specific to 8.0.

**`matrix.php-version: ['8.0', '8.1', '8.2', '8.3']`** — Defines four parallel jobs. You can add or remove versions freely.

**`${{ matrix.php-version }}` in the cache key** — Critical. Without this, all four jobs share one cache, and PHP 8.0 packages overwrite PHP 8.3 packages (or vice versa), causing version mismatches. Adding the PHP version to the cache key gives each version its own cache.

### What This Looks Like in Practice

After pushing this workflow, the Actions tab shows **four parallel checkmarks** — one for each PHP version. If all four pass, your codebase is proven compatible. If one fails, you expand the job log and see exactly which test failed on which version.

</section>

<section lang="id">

## Menjalankan PHPUnit di Berbagai Versi PHP dengan Matrix

Proyek nyata perlu mendukung beberapa versi PHP. Server production Anda mungkin menjalankan PHP 8.2 sementara lingkungan klien masih menggunakan 8.1 — atau library Anda mengklaim mendukung 8.0 hingga 8.3 dan Anda perlu membuktikannya.

GitHub Actions mendukung **matrix strategies**: Anda mendefinisikan daftar nilai, dan runner membuat satu job paralel untuk setiap kombinasi. Untuk PHP, dimensi matrix yang paling umum adalah `php-version`.

### Workflow Matrix

Ganti job `test` tunggal Anda dengan matrix:

```yaml
name: PHP CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    name: PHP ${{ matrix.php-version }}
    runs-on: ubuntu-latest

    strategy:
      fail-fast: false
      matrix:
        php-version: ['8.0', '8.1', '8.2', '8.3']

    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP ${{ matrix.php-version }}
        uses: shivammathur/setup-php@v2
        with:
          php-version: ${{ matrix.php-version }}
          coverage: none

      - name: Get Composer cache directory
        id: composer-cache
        run: echo "dir=$(composer config cache-files-dir)" >> $GITHUB_OUTPUT

      - uses: actions/cache@v4
        with:
          path: ${{ steps.composer-cache.outputs.dir }}
          key: ${{ runner.os }}-composer-${{ matrix.php-version }}-${{ hashFiles('**/composer.lock') }}
          restore-keys: |
            ${{ runner.os }}-composer-${{ matrix.php-version }}-

      - name: Install dependencies
        run: composer install --no-progress --no-interaction --prefer-dist

      - name: Run PHPUnit
        run: vendor/bin/phpunit
```

### Penambahan Kunci

**`strategy.fail-fast: false`** — Secara default, GitHub membatalkan semua job matrix begitu satu gagal. Mengatur `fail-fast` ke `false` memungkinkan semua versi berjalan hingga selesai, sehingga Anda melihat gambaran penuh. Jika PHP 8.0 gagal tetapi 8.1, 8.2, dan 8.3 berhasil, Anda tahu masalahnya spesifik untuk 8.0.

**`matrix.php-version: ['8.0', '8.1', '8.2', '8.3']`** — Mendefinisikan empat job paralel. Anda dapat menambah atau menghapus versi dengan bebas.

**`${{ matrix.php-version }}` dalam cache key** — Kritis. Tanpa ini, keempat job berbagi satu cache, dan paket PHP 8.0 menimpa paket PHP 8.3 (atau sebaliknya), menyebabkan ketidakcocokan versi. Menambahkan versi PHP ke cache key memberi setiap versi cache-nya sendiri.

### Seperti Apa Ini dalam Praktik

Setelah mendorong workflow ini, tab Actions menampilkan **empat tanda centang paralel** — satu untuk setiap versi PHP. Jika keempatnya berhasil, codebase Anda terbukti kompatibel. Jika satu gagal, Anda perluas log job dan lihat dengan tepat pengujian mana yang gagal di versi mana.

</section>

---

<section lang="en">

## Adding Code Quality Gates to the Pipeline

Testing verifies that your code works. Code quality gates verify that your code is well-written. The two complement each other: you want code that both works *and* can be maintained.

We will add **PHPStan** (static analysis) and **PHP_CodeSniffer** (style linting) as separate parallel jobs so they do not slow down the test matrix.

### Install the Tools

```bash
$ composer require --dev phpstan/phpstan squizlabs/php_codesniffer
```

### Create Configurations

**`phpstan.neon`**:

```neon
parameters:
    level: 5
    paths:
        - src
```

**`phpcs.xml`**:

```xml
<?xml version="1.0"?>
<ruleset name="CI Demo">
    <description>PSR-12 coding standard</description>
    <arg name="colors"/>
    <arg name="extensions" value="php"/>
    <file>src</file>
    <file>tests</file>
    <rule ref="PSR12"/>
</ruleset>
```

### The Extended Workflow

Add the following two jobs below the `test` job in `.github/workflows/php.yml`:

```yaml
  static-analysis:
    name: Static Analysis (PHPStan)
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          coverage: none

      - name: Get Composer cache directory
        id: composer-cache
        run: echo "dir=$(composer config cache-files-dir)" >> $GITHUB_OUTPUT

      - uses: actions/cache@v4
        with:
          path: ${{ steps.composer-cache.outputs.dir }}
          key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
          restore-keys: |
            ${{ runner.os }}-composer-

      - name: Install dependencies
        run: composer install --no-progress --no-interaction --prefer-dist

      - name: Run PHPStan
        run: vendor/bin/phpstan analyse --no-progress --error-format=github

  code-style:
    name: Code Style (PHP_CodeSniffer)
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          coverage: none

      - name: Get Composer cache directory
        id: composer-cache
        run: echo "dir=$(composer config cache-files-dir)" >> $GITHUB_OUTPUT

      - uses: actions/cache@v4
        with:
          path: ${{ steps.composer-cache.outputs.dir }}
          key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
          restore-keys: |
            ${{ runner.os }}-composer-

      - name: Install dependencies
        run: composer install --no-progress --no-interaction --prefer-dist

      - name: Run PHP_CodeSniffer
        run: vendor/bin/phpcs --standard=phpcs.xml
```

### Why Separate Jobs?

Each quality tool runs in its own job for three reasons:

1. **Parallelism.** All jobs run simultaneously. The test matrix (4 jobs), PHPStan (1 job), and PHPCS (1 job) start at the same time. Total wall-clock time is the duration of the slowest single job, not the sum.

2. **Isolated failures.** If PHPStan finds errors, it does not prevent PHPCS or PHPUnit from running. You see all failures at once.

3. **Cleaner logs.** Each job has its own log output. You do not need to scroll through PHPStan warnings to find the PHPUnit failure.

### Optimisation: Deduplicating with Composite Actions

You may notice that the setup steps (checkout, PHP setup, cache, Composer install) are identical across jobs. GitHub Actions supports **reusable workflows** and **composite actions** to avoid this duplication, but for a single-project pipeline under 100 lines, duplication is acceptable and easier to understand.

</section>

<section lang="id">

## Menambahkan Gerbang Kualitas Kode ke Pipeline

Pengujian memverifikasi bahwa kode Anda bekerja. Gerbang kualitas kode memverifikasi bahwa kode Anda ditulis dengan baik. Keduanya saling melengkapi: Anda menginginkan kode yang berfungsi *dan* dapat dipelihara.

Kita akan menambahkan **PHPStan** (static analysis) dan **PHP_CodeSniffer** (style linting) sebagai job paralel terpisah sehingga tidak memperlambat matrix pengujian.

### Instal Alat

```bash
$ composer require --dev phpstan/phpstan squizlabs/php_codesniffer
```

### Buat Konfigurasi

**`phpstan.neon`**:

```neon
parameters:
    level: 5
    paths:
        - src
```

**`phpcs.xml`**:

```xml
<?xml version="1.0"?>
<ruleset name="CI Demo">
    <description>Standar koding PSR-12</description>
    <arg name="colors"/>
    <arg name="extensions" value="php"/>
    <file>src</file>
    <file>tests</file>
    <rule ref="PSR12"/>
</ruleset>
```

### Workflow yang Diperluas

Tambahkan dua job berikut di bawah job `test` di `.github/workflows/php.yml`:

```yaml
  static-analysis:
    name: Static Analysis (PHPStan)
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          coverage: none

      - name: Get Composer cache directory
        id: composer-cache
        run: echo "dir=$(composer config cache-files-dir)" >> $GITHUB_OUTPUT

      - uses: actions/cache@v4
        with:
          path: ${{ steps.composer-cache.outputs.dir }}
          key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
          restore-keys: |
            ${{ runner.os }}-composer-

      - name: Install dependencies
        run: composer install --no-progress --no-interaction --prefer-dist

      - name: Run PHPStan
        run: vendor/bin/phpstan analyse --no-progress --error-format=github

  code-style:
    name: Code Style (PHP_CodeSniffer)
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          coverage: none

      - name: Get Composer cache directory
        id: composer-cache
        run: echo "dir=$(composer config cache-files-dir)" >> $GITHUB_OUTPUT

      - uses: actions/cache@v4
        with:
          path: ${{ steps.composer-cache.outputs.dir }}
          key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
          restore-keys: |
            ${{ runner.os }}-composer-

      - name: Install dependencies
        run: composer install --no-progress --no-interaction --prefer-dist

      - name: Run PHP_CodeSniffer
        run: vendor/bin/phpcs --standard=phpcs.xml
```

### Mengapa Job Terpisah?

Setiap alat kualitas berjalan di job-nya sendiri karena tiga alasan:

1. **Paralelisme.** Semua job berjalan secara bersamaan. Matrix pengujian (4 job), PHPStan (1 job), dan PHPCS (1 job) dimulai pada saat yang sama. Total waktu wall-clock adalah durasi job tunggal paling lambat, bukan jumlahnya.

2. **Kegagalan terisolasi.** Jika PHPStan menemukan error, itu tidak mencegah PHPCS atau PHPUnit berjalan. Anda melihat semua kegagalan sekaligus.

3. **Log yang lebih bersih.** Setiap job memiliki output log-nya sendiri. Anda tidak perlu menggulir melalui peringatan PHPStan untuk menemukan kegagalan PHPUnit.

### Optimasi: Deduplikasi dengan Composite Actions

Anda mungkin menyadari bahwa langkah-langkah setup (checkout, setup PHP, cache, instal Composer) identik di semua job. GitHub Actions mendukung **reusable workflows** dan **composite actions** untuk menghindari duplikasi ini, tetapi untuk pipeline proyek tunggal di bawah 100 baris, duplikasi dapat diterima dan lebih mudah dipahami.

</section>

---

<section lang="en">

## Deployment: Shipping Code to a VPS via SSH

CI is about verifying code. CD is about delivering it. We will add a deployment job that runs **only after all tests and quality checks pass** and deploys the code to a Linux VPS via SSH and rsync.

### The Deployment Job

Add this job at the end of `.github/workflows/php.yml`:

```yaml
  deploy:
    name: Deploy to VPS
    runs-on: ubuntu-latest
    needs: [test, static-analysis, code-style]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
      - uses: actions/checkout@v4

      - name: Deploy via SSH and rsync
        uses: easingthemes/ssh-deploy@v5.1.0
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          ARGS: "-avz --delete --exclude='.git' --exclude='.github' --exclude='.env' --exclude='vendor/'"
          SOURCE: "./"
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          TARGET: ${{ secrets.REMOTE_PATH }}
          SCRIPT_AFTER: |
            cd ${{ secrets.REMOTE_PATH }}
            composer install --no-dev --no-interaction --optimize-autoloader
            php artisan migrate --force
```

### Breaking Down the Deployment Logic

**`needs: [test, static-analysis, code-style]`** — This job starts only after all three prerequisite jobs succeed. If any of them fail, deployment is skipped. This is the fundamental safety guarantee of CD: broken code never reaches production.

**`if: github.ref == 'refs/heads/main' && github.event_name == 'push'`** — Two conditions:
- Only deploy from the `main` branch (not `develop` or feature branches)
- Only deploy on `push` events (not on pull requests, which should only verify, not deploy)

**`easingthemes/ssh-deploy`** — A popular community action that:
1. Establishes an SSH connection using the private key
2. Uses rsync to copy files to the remote server
3. Runs post-deployment commands via `SCRIPT_AFTER`

**`--exclude` flags** — Critical for not overwriting server-specific files:
- `.git/` — The server does not need Git history
- `.github/` — Workflow files are only for CI
- `.env` — Production environment variables should never be overwritten from the repository
- `vendor/` — Dependencies will be installed fresh on the server

### Alternative Deployment Targets

| Target | When to Use | Action / Approach |
|--------|------------|-------------------|
| **Shared hosting (FTP)** | Low-cost hosting with cPanel | Use `SamKirkland/FTP-Deploy-Action` |
| **VPS (SSH + rsync)** | Full control, Laravel/Composer projects | Use `easingthemes/ssh-deploy` as shown above |
| **GitHub Pages** | Static sites, documentation | Use `peaceiris/actions-gh-pages` |
| **Docker / Kubernetes** | Containerised applications | Build image with `docker/build-push-action`, push to registry, apply manifests |
| **Serverless (Vercel, Netlify)** | Jamstack, frontend-heavy apps | Native integrations; usually a single `--prod` flag |

For student projects, the VPS + SSH approach is the most educational because it mirrors what you would do on most entry-level backend jobs.

</section>

<section lang="id">

## Deployment: Mengirim Kode ke VPS via SSH

CI adalah tentang memverifikasi kode. CD adalah tentang mengirimkannya. Kita akan menambahkan job deployment yang berjalan **hanya setelah semua pengujian dan pemeriksaan kualitas berhasil** dan men-deploy kode ke VPS Linux melalui SSH dan rsync.

### Job Deployment

Tambahkan job ini di akhir `.github/workflows/php.yml`:

```yaml
  deploy:
    name: Deploy to VPS
    runs-on: ubuntu-latest
    needs: [test, static-analysis, code-style]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
      - uses: actions/checkout@v4

      - name: Deploy via SSH and rsync
        uses: easingthemes/ssh-deploy@v5.1.0
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          ARGS: "-avz --delete --exclude='.git' --exclude='.github' --exclude='.env' --exclude='vendor/'"
          SOURCE: "./"
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          TARGET: ${{ secrets.REMOTE_PATH }}
          SCRIPT_AFTER: |
            cd ${{ secrets.REMOTE_PATH }}
            composer install --no-dev --no-interaction --optimize-autoloader
            php artisan migrate --force
```

### Mengurai Logika Deployment

**`needs: [test, static-analysis, code-style]`** — Job ini dimulai hanya setelah ketiga job prasyarat berhasil. Jika ada yang gagal, deployment dilewati. Ini adalah jaminan keamanan fundamental dari CD: kode yang rusak tidak pernah mencapai production.

**`if: github.ref == 'refs/heads/main' && github.event_name == 'push'`** — Dua kondisi:
- Hanya deploy dari branch `main` (bukan `develop` atau branch fitur)
- Hanya deploy pada event `push` (bukan pada pull request, yang seharusnya hanya memverifikasi, bukan deploy)

**`easingthemes/ssh-deploy`** — Action komunitas populer yang:
1. Membangun koneksi SSH menggunakan kunci privat
2. Menggunakan rsync untuk menyalin file ke server remote
3. Menjalankan perintah pasca-deployment melalui `SCRIPT_AFTER`

**Flag `--exclude`** — Kritis untuk tidak menimpa file spesifik server:
- `.git/` — Server tidak memerlukan riwayat Git
- `.github/` — File workflow hanya untuk CI
- `.env` — Environment variables production tidak boleh ditimpa dari repositori
- `vendor/` — Dependensi akan diinstal ulang di server

### Target Deployment Alternatif

| Target | Kapan Digunakan | Action / Pendekatan |
|--------|----------------|---------------------|
| **Shared hosting (FTP)** | Hosting murah dengan cPanel | Gunakan `SamKirkland/FTP-Deploy-Action` |
| **VPS (SSH + rsync)** | Kontrol penuh, proyek Laravel/Composer | Gunakan `easingthemes/ssh-deploy` seperti di atas |
| **GitHub Pages** | Situs statis, dokumentasi | Gunakan `peaceiris/actions-gh-pages` |
| **Docker / Kubernetes** | Aplikasi terkontainerisasi | Build image dengan `docker/build-push-action`, push ke registry, terapkan manifes |
| **Serverless (Vercel, Netlify)** | Jamstack, aplikasi frontend-heavy | Integrasi native; biasanya satu flag `--prod` |

Untuk proyek mahasiswa, pendekatan VPS + SSH adalah yang paling edukatif karena mencerminkan apa yang akan Anda lakukan di sebagian besar pekerjaan backend tingkat pemula.

</section>

---

<section lang="en">

## Managing Secrets and Environment Variables

The deployment job references `${{ secrets.SSH_PRIVATE_KEY }}`, `${{ secrets.REMOTE_HOST }}`, and other secret values. These are **not** stored in the workflow file — they are stored in GitHub's encrypted secrets store and injected at runtime.

### Where Secrets Live

Navigate to your repository on GitHub:
**Settings → Secrets and variables → Actions → New repository secret**

Add the following secrets:

| Secret Name | What It Contains | Example |
|-------------|-----------------|---------|
| `SSH_PRIVATE_KEY` | Your private SSH key (the whole file, including `-----BEGIN` and `-----END`) | `-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1r...` |
| `REMOTE_HOST` | IP address or domain of your VPS | `203.0.113.10` |
| `REMOTE_USER` | SSH username on the VPS | `deploy` |
| `REMOTE_PATH` | Absolute path to the web root | `/var/www/myapp` |

### Environment Variables

For non-sensitive configuration (app debug mode, cache driver, etc.), use **environment variables** directly in the workflow:

```yaml
- name: Run PHPUnit
  run: vendor/bin/phpunit
  env:
    APP_ENV: testing
    DB_CONNECTION: sqlite
    DB_DATABASE: ":memory:"
```

These are plain-text and visible in logs. Use them for anything that is not a credential.

### Security Rules

1. **Never hardcode secrets in workflow files.** Anyone with read access to the repository can see the file content. Secrets are encrypted at rest and only decrypted during workflow execution.

2. **Never echo secrets to logs.** GitHub automatically redacts secret values from log output — the string `***` replaces them. But if you base64-encode or otherwise transform a secret before printing, the redaction may fail.

3. **Use the principle of least privilege.** Create a dedicated `deploy` user on your VPS with SSH key access only — no password, no sudo unless needed for specific commands.

4. **Rotate SSH keys periodically.** If a team member leaves the project, regenerate the deploy key and update the `SSH_PRIVATE_KEY` secret.

### Troubleshooting Secrets

The most common mistake: pasting the SSH private key with extra whitespace or missing newlines. When you copy from `~/.ssh/id_ed25519`, make sure to copy the entire file including the `-----BEGIN` and `-----END` lines. A quick test:

```bash
$ ssh -i ~/.ssh/deploy_key deploy@your-server-ip "echo connected"
connected
```

If this manual SSH works but the GitHub Action fails with "Permission denied," double-check the secret formatting.

</section>

<section lang="id">

## Mengelola Secrets dan Environment Variables

Job deployment mereferensikan `${{ secrets.SSH_PRIVATE_KEY }}`, `${{ secrets.REMOTE_HOST }}`, dan nilai rahasia lainnya. Ini **tidak** disimpan dalam file workflow — mereka disimpan di penyimpanan secrets terenkripsi GitHub dan disuntikkan saat runtime.

### Tempat Secrets Disimpan

Navigasi ke repositori Anda di GitHub:
**Settings → Secrets and variables → Actions → New repository secret**

Tambahkan secrets berikut:

| Nama Secret | Isinya | Contoh |
|-------------|--------|--------|
| `SSH_PRIVATE_KEY` | Kunci SSH privat Anda (seluruh file, termasuk `-----BEGIN` dan `-----END`) | `-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1r...` |
| `REMOTE_HOST` | Alamat IP atau domain VPS Anda | `203.0.113.10` |
| `REMOTE_USER` | Nama pengguna SSH di VPS | `deploy` |
| `REMOTE_PATH` | Path absolut ke root web | `/var/www/myapp` |

### Environment Variables

Untuk konfigurasi non-sensitif (mode debug aplikasi, cache driver, dll.), gunakan **environment variables** langsung di workflow:

```yaml
- name: Run PHPUnit
  run: vendor/bin/phpunit
  env:
    APP_ENV: testing
    DB_CONNECTION: sqlite
    DB_DATABASE: ":memory:"
```

Ini adalah teks biasa dan terlihat di log. Gunakan untuk apa pun yang bukan kredensial.

### Aturan Keamanan

1. **Jangan pernah hardcode secrets di file workflow.** Siapa pun dengan akses baca ke repositori dapat melihat konten file. Secrets dienkripsi saat diam dan hanya didekripsi selama eksekusi workflow.

2. **Jangan pernah menampilkan secrets ke log.** GitHub secara otomatis menyunting nilai secret dari output log — string `***` menggantikannya. Tetapi jika Anda melakukan base64-encode atau mentransformasi secret sebelum mencetak, penyuntingan mungkin gagal.

3. **Gunakan prinsip hak istimewa terendah.** Buat pengguna `deploy` khusus di VPS Anda dengan akses kunci SSH saja — tanpa kata sandi, tanpa sudo kecuali diperlukan untuk perintah tertentu.

4. **Rotasi kunci SSH secara berkala.** Jika anggota tim meninggalkan proyek, regenerasi kunci deploy dan perbarui secret `SSH_PRIVATE_KEY`.

### Troubleshooting Secrets

Kesalahan paling umum: menempelkan kunci privat SSH dengan spasi ekstra atau newline yang hilang. Saat Anda menyalin dari `~/.ssh/id_ed25519`, pastikan untuk menyalin seluruh file termasuk baris `-----BEGIN` dan `-----END`. Tes cepat:

```bash
$ ssh -i ~/.ssh/deploy_key deploy@your-server-ip "echo connected"
connected
```

Jika SSH manual ini berhasil tetapi GitHub Action gagal dengan "Permission denied," periksa kembali format secret.

</section>

---

<section lang="en">

## Common Pitfalls and How to Debug Failed Runs

CI/CD pipelines fail. Even experienced developers spend time in the Actions tab debugging red crosses. Here are the most common failure modes and how to diagnose them.

### Pitfall 1: "composer.lock is out of date"

**Symptom:** The workflow fails at `composer install` with a message about the lock file being out of sync with `composer.json`.

**Cause:** Someone updated `composer.json` locally but forgot to run `composer update` and commit the new `composer.lock`.

**Fix:** Always run `composer install` in CI. Use `composer update` only locally when you intentionally change dependencies — and commit the resulting `composer.lock`.

### Pitfall 2: Tests Pass Locally but Fail in CI

**Symptom:** `vendor/bin/phpunit` is green on your machine but red in GitHub Actions.

**Common causes:**

| Cause | How to Detect | Fix |
|-------|-------------|-----|
| Different PHP version | Check `php -v` output in the CI log | Align your local PHP version with the matrix |
| Different PHP extensions | Check `php -m` output in the CI log | Install the missing extension or add it to `setup-php` extensions |
| Case-sensitive filesystem | Windows/macOS are case-insensitive; Ubuntu is case-sensitive | Use consistent casing in class names and file paths |
| Missing environment variables | Tests reference `$_ENV['DB_HOST']` which is not set in CI | Add `env:` to the workflow step |
| Different line endings | CRLF (Windows) vs LF (Unix) | Configure `.gitattributes` with `* text=auto` |

**Diagnostic command:** Add a step before your test step to dump the environment:

```yaml
- name: Debug environment
  run: |
    php -v
    php -m
    echo "PHP version: $(php -r 'echo PHP_VERSION;')"
```

### Pitfall 3: Composer Install Takes Too Long

**Symptom:** Every workflow run spends 60+ seconds on `composer install`.

**Cause:** Caching is misconfigured. Common mistakes: wrong cache key, missing `hashFiles`, or caching the wrong directory.

**Fix:** Verify that your cache key includes `hashFiles('**/composer.lock')`. Check the cache step output in the Actions log — it will say "Cache not found" on first run and "Cache restored from key" on subsequent runs.

### Pitfall 4: Deployment Overwrites Production `.env`

**Symptom:** After deploying, your application shows database connection errors because `.env` was replaced with the CI version.

**Cause:** rsync `--delete` flag removed files that are only on the server, or the `.env` was included in the transfer.

**Fix:** Add `--exclude='.env'` to the rsync arguments and ensure your repository does **not** contain a `composer.lock` or `.env` with production credentials.

### Pitfall 5: Secret Values Are Empty at Runtime

**Symptom:** A step that references `${{ secrets.SOME_KEY }}` fails with an empty value.

**Cause:** Secrets are scoped to the repository, environment, or organisation where they are created. A secret created in the repository settings is not available when the workflow runs from a fork's pull request.

**Fix:** For pull request workflows, avoid depending on secrets in the test phase. Use repository-level secrets for deployment jobs only, and restrict deployment jobs to branch pushes (not PRs) with `if: github.event_name == 'push'`.

### How to Read GitHub Actions Logs

When a job fails, click on it in the Actions tab. Each step is expandable. The failing step is marked with a red cross. Expand it and scroll to the bottom — the error message is usually in the last 10 lines.

Look for:
- **Exit code:** The number after "Process completed with exit code" (non-zero = failure)
- **Stack traces:** PHPUnit and PHPStan print the file, line number, and error description
- **Permission errors:** "Permission denied" usually means the SSH key is wrong or the user lacks access

Enable **debug logging** for more detail: go to **Settings → Secrets and variables → Actions**, create a secret named `ACTIONS_STEP_DEBUG` with value `true`. This adds verbose output to every step.

</section>

<section lang="id">

## Jebakan Umum dan Cara Debug Run yang Gagal

Pipeline CI/CD gagal. Bahkan pengembang berpengalaman menghabiskan waktu di tab Actions untuk men-debug tanda silang merah. Berikut adalah mode kegagalan paling umum dan cara mendiagnosisnya.

### Jebakan 1: "composer.lock is out of date"

**Gejala:** Workflow gagal di `composer install` dengan pesan tentang file lock yang tidak sinkron dengan `composer.json`.

**Penyebab:** Seseorang memperbarui `composer.json` secara lokal tetapi lupa menjalankan `composer update` dan commit `composer.lock` yang baru.

**Perbaikan:** Selalu jalankan `composer install` di CI. Gunakan `composer update` hanya secara lokal ketika Anda sengaja mengubah dependensi — dan commit `composer.lock` yang dihasilkan.

### Jebakan 2: Pengujian Berhasil Secara Lokal tetapi Gagal di CI

**Gejala:** `vendor/bin/phpunit` hijau di mesin Anda tetapi merah di GitHub Actions.

**Penyebab umum:**

| Penyebab | Cara Mendeteksi | Perbaikan |
|----------|----------------|-----------|
| Versi PHP berbeda | Periksa output `php -v` di log CI | Sesuaikan versi PHP lokal Anda dengan matrix |
| Ekstensi PHP berbeda | Periksa output `php -m` di log CI | Instal ekstensi yang hilang atau tambahkan ke ekstensi `setup-php` |
| Filesystem case-sensitive | Windows/macOS case-insensitive; Ubuntu case-sensitive | Gunakan kapitalisasi yang konsisten dalam nama kelas dan path file |
| Environment variables hilang | Pengujian mereferensikan `$_ENV['DB_HOST']` yang tidak diatur di CI | Tambahkan `env:` ke langkah workflow |
| Line ending berbeda | CRLF (Windows) vs LF (Unix) | Konfigurasikan `.gitattributes` dengan `* text=auto` |

**Perintah diagnostik:** Tambahkan langkah sebelum langkah pengujian Anda untuk men-dump environment:

```yaml
- name: Debug environment
  run: |
    php -v
    php -m
    echo "PHP version: $(php -r 'echo PHP_VERSION;')"
```

### Jebakan 3: Composer Install Terlalu Lama

**Gejala:** Setiap workflow run menghabiskan 60+ detik pada `composer install`.

**Penyebab:** Caching salah dikonfigurasi. Kesalahan umum: cache key salah, `hashFiles` hilang, atau caching direktori yang salah.

**Perbaikan:** Verifikasi bahwa cache key Anda mencakup `hashFiles('**/composer.lock')`. Periksa output langkah cache di log Actions — ia akan mengatakan "Cache not found" pada run pertama dan "Cache restored from key" pada run berikutnya.

### Jebakan 4: Deployment Menimpa `.env` Production

**Gejala:** Setelah deploy, aplikasi Anda menampilkan error koneksi database karena `.env` diganti dengan versi CI.

**Penyebab:** Flag rsync `--delete` menghapus file yang hanya ada di server, atau `.env` termasuk dalam transfer.

**Perbaikan:** Tambahkan `--exclude='.env'` ke argumen rsync dan pastikan repositori Anda **tidak** berisi `composer.lock` atau `.env` dengan kredensial production.

### Jebakan 5: Nilai Secret Kosong saat Runtime

**Gejala:** Langkah yang mereferensikan `${{ secrets.SOME_KEY }}` gagal dengan nilai kosong.

**Penyebab:** Secrets memiliki ruang lingkup ke repositori, environment, atau organisasi tempat mereka dibuat. Secret yang dibuat di pengaturan repositori tidak tersedia ketika workflow berjalan dari pull request fork.

**Perbaikan:** Untuk workflow pull request, hindari bergantung pada secrets di fase pengujian. Gunakan secrets tingkat repositori hanya untuk job deployment, dan batasi job deployment ke push branch (bukan PR) dengan `if: github.event_name == 'push'`.

### Cara Membaca Log GitHub Actions

Ketika sebuah job gagal, klik di tab Actions. Setiap langkah dapat diperluas. Langkah yang gagal ditandai dengan tanda silang merah. Perluas dan gulir ke bawah — pesan error biasanya ada di 10 baris terakhir.

Cari:
- **Kode keluar:** Angka setelah "Process completed with exit code" (non-nol = kegagalan)
- **Stack trace:** PHPUnit dan PHPStan mencetak file, nomor baris, dan deskripsi error
- **Error izin:** "Permission denied" biasanya berarti kunci SSH salah atau pengguna tidak memiliki akses

Aktifkan **debug logging** untuk detail lebih: buka **Settings → Secrets and variables → Actions**, buat secret bernama `ACTIONS_STEP_DEBUG` dengan nilai `true`. Ini menambahkan output verbose ke setiap langkah.

</section>

---

<section lang="en">

## When to Use CI/CD (and When Not To)

CI/CD is powerful, but it is not free. Every workflow run consumes GitHub Actions minutes, and complex pipelines require maintenance. Here is a pragmatic guide to deciding when the investment pays off.

### When CI/CD Is Worth It

| Situation | Why CI/CD helps |
|-----------|----------------|
| **Multi-contributor projects** | Without CI, you discover merge conflicts only at code review. CI catches them on every push. |
| **Projects with tests** | If you have tests but no CI, tests are only as good as the developer's memory. CI makes them mandatory. |
| **Library or package code** | Libraries must support multiple PHP versions. A matrix strategy proves compatibility automatically. |
| **Frequently deployed applications** | If you deploy weekly or daily, automation eliminates the most error-prone part of the process. |
| **Team projects (academic or industry)** | CI enforces standards that instructors or tech leads set — consistently, without manual checking. |
| **Open-source projects** | External contributors need to know within minutes whether their PR passes. CI gives them that feedback. |

### When CI/CD May Be Overkill

| Situation | Why CI/CD might not be the priority |
|-----------|-------------------------------------|
| **Single-developer prototypes** | If only you work on the code and it is not deployed publicly, CI adds overhead with little benefit. |
| **Projects with no tests** | CI without tests is just a build step. The value of CI comes from running tests automatically. Write tests first. |
| **Static sites with no build step** | A plain HTML/CSS site pushed directly to GitHub Pages needs no CI. GitHub Pages handles the deployment. |
| **Environments without GitHub access** | Some internal or offline projects cannot use GitHub Actions. Consider GitLab CI, Jenkins, or local hooks instead. |
| **Very short-lived projects** | A 2-day hackathon project that will never be touched again does not need a pipeline. |

### A Sensible Progression

If you are new to CI/CD, here is the order in which to adopt it:

1. **Add a `.github/workflows/test.yml`** that runs PHPUnit on push. This is the base layer.
2. **Add a matrix** for multiple PHP versions. This catches compatibility bugs.
3. **Add code quality jobs** (PHPStan, PHPCS). This enforces standards.
4. **Add deployment** as the final step, protected by `needs` and branch conditions.

Each layer builds on the previous one. Start with testing — if you have no tests, CI gives you nothing to verify. The progression mirrors how professional teams adopt DevOps: test first, then quality, then deployment.

</section>

<section lang="id">

## Kapan Menggunakan CI/CD (dan Kapan Tidak)

CI/CD itu kuat, tetapi tidak gratis. Setiap workflow run mengonsumsi menit GitHub Actions, dan pipeline yang kompleks memerlukan pemeliharaan. Berikut adalah panduan pragmatis untuk memutuskan kapan investasi terbayar.

### Ketika CI/CD Sepadan

| Situasi | Mengapa CI/CD membantu |
|---------|----------------------|
| **Proyek multi-kontributor** | Tanpa CI, Anda menemukan konflik merge hanya saat code review. CI menangkapnya di setiap push. |
| **Proyek dengan pengujian** | Jika Anda memiliki pengujian tetapi tidak ada CI, pengujian hanya sebaik ingatan pengembang. CI membuatnya wajib. |
| **Kode library atau package** | Library harus mendukung beberapa versi PHP. Matrix strategy membuktikan kompatibilitas secara otomatis. |
| **Aplikasi yang sering di-deploy** | Jika Anda deploy mingguan atau harian, otomatisasi menghilangkan bagian paling rawan kesalahan dari proses. |
| **Proyek tim (akademik atau industri)** | CI menegakkan standar yang ditetapkan instruktur atau tech lead — secara konsisten, tanpa pengecekan manual. |
| **Proyek open-source** | Kontributor eksternal perlu tahu dalam hitungan menit apakah PR mereka lolos. CI memberi mereka umpan balik itu. |

### Ketika CI/CD Mungkin Berlebihan

| Situasi | Mengapa CI/CD mungkin bukan prioritas |
|---------|--------------------------------------|
| **Prototipe pengembang tunggal** | Jika hanya Anda yang mengerjakan kode dan tidak di-deploy secara publik, CI menambah overhead dengan sedikit manfaat. |
| **Proyek tanpa pengujian** | CI tanpa pengujian hanyalah langkah build. Nilai CI berasal dari menjalankan pengujian secara otomatis. Tulis pengujian terlebih dahulu. |
| **Situs statis tanpa langkah build** | Situs HTML/CSS biasa yang di-push langsung ke GitHub Pages tidak memerlukan CI. GitHub Pages menangani deployment. |
| **Lingkungan tanpa akses GitHub** | Beberapa proyek internal atau offline tidak dapat menggunakan GitHub Actions. Pertimbangkan GitLab CI, Jenkins, atau hook lokal. |
| **Proyek berumur sangat pendek** | Proyek hackathon 2 hari yang tidak akan pernah disentuh lagi tidak memerlukan pipeline. |

### Progresi yang Masuk Akal

Jika Anda baru mengenal CI/CD, berikut adalah urutan untuk mengadopsinya:

1. **Tambahkan `.github/workflows/test.yml`** yang menjalankan PHPUnit saat push. Ini adalah lapisan dasar.
2. **Tambahkan matrix** untuk beberapa versi PHP. Ini menangkap bug kompatibilitas.
3. **Tambahkan job kualitas kode** (PHPStan, PHPCS). Ini menegakkan standar.
4. **Tambahkan deployment** sebagai langkah terakhir, dilindungi oleh `needs` dan kondisi branch.

Setiap lapisan dibangun di atas yang sebelumnya. Mulai dengan pengujian — jika Anda tidak memiliki pengujian, CI tidak memberi Anda apa pun untuk diverifikasi. Progresi ini mencerminkan bagaimana tim profesional mengadopsi DevOps: uji dulu, lalu kualitas, lalu deployment.

</section>

---

<section lang="en">

## Summary

1. **CI/CD automates the build-test-deploy pipeline**, replacing manual, error-prone workflows with a repeatable machine-driven process.
2. **GitHub Actions** is free for public repos and uses YAML workflow files to define jobs, steps, and triggers.
3. **A basic PHP workflow** installs PHP, caches Composer dependencies, installs packages, and runs PHPUnit.
4. **Matrix strategies** let you test against multiple PHP versions in parallel, with `fail-fast: false` to see all results.
5. **Code quality gates** (PHPStan, PHP_CodeSniffer) run as separate parallel jobs and prevent poor-quality code from merging.
6. **Deployment jobs** use SSH + rsync (`easingthemes/ssh-deploy`) and are protected by `needs` so they only run when all checks pass.
7. **Secrets** (SSH keys, hostnames, credentials) are stored in GitHub's encrypted secrets store, never in workflow files.
8. **Debugging** involves reading logs, checking exit codes, and using `ACTIONS_STEP_DEBUG` for verbose output.
9. **Be pragmatic:** CI/CD is worth the investment for team projects, libraries, and frequently deployed applications. It may be overkill for solo prototypes and throwaway code.

> CI/CD does not replace discipline — it encodes it. The pipeline is the permanent, machine-readable version of "did you remember to run the tests?"

</section>

<section lang="id">

## Ringkasan

1. **CI/CD mengotomatiskan pipeline build-test-deploy**, menggantikan alur kerja manual yang rawan kesalahan dengan proses yang dapat diulang yang digerakkan mesin.
2. **GitHub Actions** gratis untuk repositori publik dan menggunakan file YAML workflow untuk mendefinisikan jobs, steps, dan trigger.
3. **Workflow PHP dasar** menginstal PHP, men-cache dependensi Composer, menginstal paket, dan menjalankan PHPUnit.
4. **Matrix strategies** memungkinkan Anda menguji terhadap beberapa versi PHP secara paralel, dengan `fail-fast: false` untuk melihat semua hasil.
5. **Gerbang kualitas kode** (PHPStan, PHP_CodeSniffer) berjalan sebagai job paralel terpisah dan mencegah kode berkualitas buruk dari penggabungan.
6. **Job deployment** menggunakan SSH + rsync (`easingthemes/ssh-deploy`) dan dilindungi oleh `needs` sehingga hanya berjalan ketika semua pemeriksaan lulus.
7. **Secrets** (kunci SSH, nama host, kredensial) disimpan di penyimpanan secrets terenkripsi GitHub, jangan pernah di file workflow.
8. **Debugging** melibatkan membaca log, memeriksa kode keluar, dan menggunakan `ACTIONS_STEP_DEBUG` untuk output verbose.
9. **Bersikap pragmatis:** CI/CD sepadan dengan investasi untuk proyek tim, library, dan aplikasi yang sering di-deploy. Mungkin berlebihan untuk prototipe solo dan kode sekali pakai.

> CI/CD tidak menggantikan disiplin — ia mengkodekannya. Pipeline adalah versi permanen yang dapat dibaca mesin dari "apakah kamu ingat untuk menjalankan pengujian?"

</section>

---

<section lang="en">

## Practice Exercise: Set Up CI/CD for Your Own Repository

Now it is your turn. Pick one of your existing PHP repositories (or create a new one) and set up a complete CI/CD pipeline.

### Requirements

1. **Create `.github/workflows/php.yml`** with a test job that runs PHPUnit.
2. **Add a matrix strategy** that tests against at least two PHP versions (e.g., 8.1 and 8.2).
3. **Configure Composer caching** so subsequent runs are faster.
4. **Add at least one code quality job** — either PHPStan at level 5 or PHP_CodeSniffer with PSR-12.
5. **Add a deployment job skeleton** that references `${{ secrets.* }}` for SSH credentials (you do not need to actually deploy — just the job definition counts).
6. **Push the workflow** and verify that all jobs pass in the Actions tab.

### Verification Checklist

| Check | Expected Result |
|-------|----------------|
| Push to `main` | The workflow triggers automatically |
| Test job | All PHP versions show green checkmarks |
| Cache step | On the second run, the cache step says "Cache restored from key" |
| Quality job | PHPStan or PHPCS runs and reports results |
| Deliberately break a test | The test job turns red, and the log shows which assertion failed |
| Deployment job | It is skipped (because you pushed to `main` but likely have no secrets set yet) |

### Starter Hint

If your personal project uses Laravel, you may need to configure environment variables for the test step:

```yaml
- name: Run PHPUnit
  run: vendor/bin/phpunit
  env:
    APP_ENV: testing
    DB_CONNECTION: sqlite
    DB_DATABASE: ":memory:"
```

### What You Will Learn from This Exercise

- The feeling of pushing code and watching the pipeline in the Actions tab turn green
- How caching shaves 30–60 seconds off consecutive runs
- How a failing test appears in the CI log versus your local terminal
- The difference between a red cross on one PHP version and green on all others

Set it up, break it, fix it — then check the "Deploy to VPS" job off by actually configuring SSH access to a server (a $5 VPS from any provider works). The first time you push to `main` and watch the code appear on a live URL without touching the terminal is a milestone worth reaching.

</section>

<section lang="id">

## Latihan Praktik: Siapkan CI/CD untuk Repositori Anda Sendiri

Sekarang giliran Anda. Pilih salah satu repositori PHP Anda yang sudah ada (atau buat yang baru) dan siapkan pipeline CI/CD lengkap.

### Persyaratan

1. **Buat `.github/workflows/php.yml`** dengan job test yang menjalankan PHPUnit.
2. **Tambahkan matrix strategy** yang menguji terhadap setidaknya dua versi PHP (misalnya, 8.1 dan 8.2).
3. **Konfigurasikan caching Composer** sehingga run berikutnya lebih cepat.
4. **Tambahkan setidaknya satu job kualitas kode** — baik PHPStan di level 5 atau PHP_CodeSniffer dengan PSR-12.
5. **Tambahkan kerangka job deployment** yang mereferensikan `${{ secrets.* }}` untuk kredensial SSH (Anda tidak perlu benar-benar deploy — definisi job saja sudah cukup).
6. **Push workflow** dan verifikasi bahwa semua job berhasil di tab Actions.

### Daftar Periksa Verifikasi

| Periksa | Hasil yang Diharapkan |
|---------|----------------------|
| Push ke `main` | Workflow terpicu secara otomatis |
| Job test | Semua versi PHP menampilkan tanda centang hijau |
| Langkah cache | Pada run kedua, langkah cache mengatakan "Cache restored from key" |
| Job kualitas | PHPStan atau PHPCS berjalan dan melaporkan hasil |
| Sengaja merusak pengujian | Job test berubah merah, dan log menunjukkan asersi mana yang gagal |
| Job deployment | Dilewati (karena Anda push ke `main` tetapi kemungkinan belum mengatur secrets) |

### Petunjuk Awal

Jika proyek pribadi Anda menggunakan Laravel, Anda mungkin perlu mengonfigurasi environment variables untuk langkah pengujian:

```yaml
- name: Run PHPUnit
  run: vendor/bin/phpunit
  env:
    APP_ENV: testing
    DB_CONNECTION: sqlite
    DB_DATABASE: ":memory:"
```

### Apa yang Akan Anda Pelajari dari Latihan Ini

- Sensasi mendorong kode dan menonton pipeline di tab Actions berubah hijau
- Bagaimana caching mengurangi 30–60 detik dari run berturut-turut
- Bagaimana pengujian yang gagal muncul di log CI versus terminal lokal Anda
- Perbedaan antara tanda silang merah di satu versi PHP dan hijau di semua yang lain

Siapkan, rusak, perbaiki — lalu centang job "Deploy to VPS" dengan benar-benar mengonfigurasi akses SSH ke server (VPS $5 dari penyedia mana pun bisa). Pertama kali Anda push ke `main` dan menonton kode muncul di URL langsung tanpa menyentuh terminal adalah tonggak yang layak dicapai.

</section>
