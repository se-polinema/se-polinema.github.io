---
title: "Code Quality Analysis with PHP"
titleId: "Analisis Kualitas Kode dengan PHP"
date: 2026-07-08
updated: 2026-07-08
category: tutorial
author: SE Lab
lang: en
featured: false
excerpt: "Learn how to automate code quality checks with PHPStan, PHP_CodeSniffer, and PHPMD. Covers static analysis, PSR-12 style linting, code metrics, and a GitHub Actions CI/CD pipeline that blocks poor-quality code from reaching production."
excerptId: "Pelajari cara mengotomatiskan pemeriksaan kualitas kode dengan PHPStan, PHP_CodeSniffer, dan PHPMD. Mencakup static analysis, linting gaya PSR-12, metrik kode, dan pipeline CI/CD GitHub Actions yang memblokir kode berkualitas buruk mencapai production."
stream: emerging-technologies-se
tags:
  - Code Quality
  - Static Analysis
  - PHP
  - CI/CD
tagsId:
  - Kualitas Kode
  - Static Analysis
  - PHP
  - CI/CD
---

<section lang="en">

## What Is Code Quality Analysis?

Code quality analysis is the systematic examination of source code to find defects, enforce standards, and measure maintainability, before human reviewers ever touch the code. If a code review is a conversation between humans, code quality analysis is the automated checklist that runs silently in the background and catches the mechanical issues so the humans can focus on logic, architecture, and intent.

The distinction matters because human reviewers are expensive, inconsistent, and prone to fatigue. A tool like PHPStan will report the same violation on the tenth pull request of the day with the same precision as on the first. It does not get tired. It does not skip a check because the author is a friend. It does not miss a variable that can be `null` because it is in a hurry.

Automated quality analysis complements manual code review in three ways:

- **Speed.** Static analysis runs in seconds. A thorough human review of a 500-line change might take 20–30 minutes. The tool finds type mismatches and dead code while the reviewer is still reading the abstract.
- **Consistency.** Every pull request faces the same rules. There is no variance between reviewers or between Mondays and Fridays.
- **Knowledge preservation.** The rules encoded in a `phpstan.neon` or `phpcs.xml` file capture institutional knowledge that would otherwise live only in senior developers' heads.

### Connection to SE Lab Research

The Software Engineering Lab at Politeknik Negeri Malang lists **Code Quality Analysis** as one of its five core topics under the [Emerging Technologies in Software Engineering](https://se.polinema.ac.id/research/emerging-technologies-se/) research stream. This tutorial connects that research direction to practical, runnable tools you can use today.

### What You Will Learn

By the end of this tutorial you will be able to:

- Install and configure **PHPStan** for type-aware static analysis at increasing strictness levels
- Enforce **PSR-12 coding standards** with PHP_CodeSniffer and auto-fix violations
- Measure and interpret **code metrics** (cyclomatic complexity, method length, and coupling) using PHPMD
- Wire all three tools into a **GitHub Actions workflow** that blocks pull requests when quality checks fail
- Know when to fix a warning, when to suppress it, and when the metric itself is misleading

</section>

<section lang="id">

## Apa Itu Analisis Kualitas Kode?

Analisis kualitas kode adalah pemeriksaan sistematis terhadap kode sumber untuk menemukan cacat, menegakkan standar, dan mengukur *maintainability*, sebelum pengulas manusia sempat menyentuh kode tersebut. Jika *code review* adalah percakapan antar manusia, analisis kualitas kode adalah daftar periksa otomatis yang berjalan tanpa suara di latar belakang dan menangkap masalah mekanis sehingga manusia dapat fokus pada logika, arsitektur, dan maksud.

Perbedaan ini penting karena pengulas manusia mahal, tidak konsisten, dan rentan terhadap kelelahan. Alat seperti PHPStan akan melaporkan pelanggaran yang sama pada *pull request* kesepuluh hari itu dengan presisi yang sama seperti pada yang pertama. Alat ini tidak lelah. Alat ini tidak melewatkan pemeriksaan karena penulisnya adalah teman. Alat ini tidak melewatkan variabel yang bisa `null` karena sedang terburu-buru.

Analisis kualitas otomatis melengkapi *code review* manual dalam tiga cara:

- **Kecepatan.** *Static analysis* berjalan dalam hitungan detik. *Review* manusia yang menyeluruh terhadap perubahan 500 baris mungkin memakan waktu 20–30 menit. Alat menemukan ketidakcocokan tipe dan kode mati sementara pengulas masih membaca abstrak.
- **Konsistensi.** Setiap *pull request* menghadapi aturan yang sama. Tidak ada varians antar pengulas atau antara hari Senin dan Jumat.
- **Pelestarian pengetahuan.** Aturan yang dikodekan dalam file `phpstan.neon` atau `phpcs.xml` menangkap pengetahuan institusional yang seharusnya hanya ada di kepala pengembang senior.

### Koneksi ke Riset SE Lab

Software Engineering Lab Politeknik Negeri Malang mencantumkan **Code Quality Analysis** sebagai salah satu dari lima topik inti di bawah alur riset [Emerging Technologies in Software Engineering](https://se.polinema.ac.id/research/emerging-technologies-se/). Tutorial ini menghubungkan arah riset tersebut ke alat praktis yang dapat Anda jalankan hari ini.

### Apa yang Akan Anda Pelajari

Di akhir tutorial ini Anda akan mampu:

- Menginstal dan mengkonfigurasi **PHPStan** untuk *static analysis* berbasis tipe pada tingkat ketat yang meningkat
- Menegakkan **standar koding PSR-12** dengan PHP_CodeSniffer dan memperbaiki pelanggaran secara otomatis
- Mengukur dan menginterpretasikan **metrik kode** (*cyclomatic complexity*, panjang metode, dan *coupling*) menggunakan PHPMD
- Menghubungkan ketiga alat ke dalam **workflow GitHub Actions** yang memblokir *pull request* ketika pemeriksaan kualitas gagal
- Mengetahui kapan harus memperbaiki peringatan, kapan menekannya, dan kapan metrik itu sendiri menyesatkan

</section>

---

<section lang="en">

## Three Lenses of Quality

Code quality is not a single number. It is a composite view formed by looking at your code through at least three independent lenses. Each lens catches a different class of problem, and the three together provide coverage that no single tool can match.

### Lens 1: Static Analysis for Finding Bugs Before They Run

Static analysis examines source code without executing it. It uses type inference, data-flow analysis, and control-flow analysis to answer questions like:

- Can this variable be `null` at this point?
- Does this method actually exist on this type?
- Is this branch of the `if` ever reachable?
- Are we passing the right type to `array_filter`?

Static analysis tools model the type system and execution paths of your program. PHPStan implements **rule levels** from 0 (loose) to 9 (strictest), and each level adds a new class of checks. At level 0, it checks for unknown classes and functions. By level 5, it validates that all method calls match declared parameter and return types. At level 9, it checks for impossible type constraints and exhaustive `match` arms.

### Lens 2: Style Linting for Making Code Consistent

Style linting enforces syntactic conventions: indentation, spacing, naming, brace placement, and import ordering. These issues rarely cause bugs, but they cause something equally damaging: **cognitive friction**. When every file in the project uses the same conventions, your brain stops parsing syntax and starts parsing meaning.

PHP_CodeSniffer (phpcs) checks PHP files against coding standards. The **PSR-12** standard is the de facto community baseline for modern PHP projects. It mandates:

- Four-space indentation (no tabs)
- Opening braces on the same line as the class/method declaration
- One blank line between methods
- `use` statements sorted alphabetically
- `declare(strict_types=1)` on new lines

The companion tool **phpcbf** (PHP Code Beautifier and Fixer) can automatically fix many of these violations. You do not need to fix every indentation error by hand.

### Lens 3: Code Metrics for Measuring Complexity

Code metrics quantify structural properties of your code. They answer questions like:

- **How complex is this method?** (Cyclomatic Complexity)
- **Is this method too long?** (Lines of Code per method)
- **Is this class doing too much?** (Number of public methods)
- **Are these classes too tightly coupled?** (Coupling Between Objects)

PHPMD (PHP Mess Detector) checks your code against configurable thresholds for each of these metrics. A method with cyclomatic complexity of 15 is harder to test and modify than one with complexity of 3. A class with 30 public methods probably has too many responsibilities.

The three lenses complement each other. Static analysis prevents runtime errors. Style linting prevents cognitive errors. Metrics prevent structural decay. Together, they form a quality gate that catches problems at every layer of the codebase.

</section>

<section lang="id">

## Tiga Lensa Kualitas

Kualitas kode bukanlah satu angka tunggal. Ini adalah pandangan gabungan yang dibentuk dengan melihat kode Anda melalui setidaknya tiga lensa independen. Setiap lensa menangkap kelas masalah yang berbeda, dan ketiganya bersama-sama memberikan cakupan yang tidak dapat ditandingi oleh alat tunggal mana pun.

### Lensa 1: Static Analysis untuk Menemukan Bug Sebelum Dijalankan

*Static analysis* memeriksa kode sumber tanpa menjalankannya. Ia menggunakan inferensi tipe, analisis aliran data, dan analisis aliran kontrol untuk menjawab pertanyaan seperti:

- Apakah variabel ini bisa `null` pada titik ini?
- Apakah metode ini benar-benar ada pada tipe ini?
- Apakah cabang `if` ini pernah tercapai?
- Apakah kita mengirimkan tipe yang benar ke `array_filter`?

Alat *static analysis* memodelkan sistem tipe dan jalur eksekusi program Anda. PHPStan menerapkan **level aturan** dari 0 (longgar) hingga 9 (paling ketat), dan setiap level menambahkan kelas pemeriksaan baru. Pada level 0, ia memeriksa kelas dan fungsi yang tidak dikenal. Pada level 5, ia memvalidasi bahwa semua panggilan metode cocok dengan parameter dan tipe pengembalian yang dideklarasikan. Pada level 9, ia memeriksa batasan tipe yang tidak mungkin dan cabang `match` yang lengkap.

### Lensa 2: Style Linting untuk Membuat Kode Konsisten

*Style linting* menegakkan konvensi sintaksis: indentasi, spasi, penamaan, penempatan kurung kurawal, dan urutan impor. Masalah ini jarang menyebabkan bug, tetapi menyebabkan sesuatu yang sama merusaknya: **gesekan kognitif**. Ketika setiap file dalam proyek menggunakan konvensi yang sama, otak Anda berhenti mem-parsing sintaks dan mulai mem-parsing makna.

PHP_CodeSniffer (phpcs) memeriksa file PHP terhadap standar koding. Standar **PSR-12** adalah *baseline* komunitas *de facto* untuk proyek PHP modern. Standar ini mewajibkan:

- Indentasi empat spasi (tanpa tab)
- Kurung kurawal pembuka pada baris yang sama dengan deklarasi kelas/metode
- Satu baris kosong antar metode
- Statement `use` diurutkan secara alfabetis
- `declare(strict_types=1)` pada baris baru

Alat pendamping **phpcbf** (PHP Code Beautifier and Fixer) dapat secara otomatis memperbaiki banyak pelanggaran ini, sehingga Anda tidak perlu memperbaiki setiap kesalahan indentasi secara manual.

### Lensa 3: Code Metrics untuk Mengukur Kompleksitas

Metrik kode mengkuantifikasi properti struktural kode Anda. Mereka menjawab pertanyaan seperti:

- **Seberapa kompleks metode ini?** (Cyclomatic Complexity)
- **Apakah metode ini terlalu panjang?** (Baris Kode per metode)
- **Apakah kelas ini melakukan terlalu banyak?** (Jumlah metode publik)
- **Apakah kelas-kelas ini terlalu erat tergandeng?** (Coupling Between Objects)

PHPMD (PHP Mess Detector) memeriksa kode Anda terhadap ambang batas yang dapat dikonfigurasi untuk setiap metrik ini. Metode dengan *cyclomatic complexity* 15 lebih sulit diuji dan dimodifikasi daripada yang memiliki kompleksitas 3. Kelas dengan 30 metode publik mungkin memiliki terlalu banyak tanggung jawab.

Ketiga lensa saling melengkapi. *Static analysis* mencegah kesalahan *runtime*. *Style linting* mencegah kesalahan kognitif. Metrik mencegah pelapukan struktural. Bersama-sama, mereka membentuk gerbang kualitas yang menangkap masalah di setiap lapisan *codebase*.

</section>

---

<section lang="en">

## Tooling Setup

Create a new PHP project (or navigate into an existing one) and install all three tools as development dependencies via Composer:

```bash
$ mkdir code-quality-demo && cd code-quality-demo
$ composer init --name="polinema/code-quality-demo" --type="project" --no-interaction
$ composer require --dev phpstan/phpstan squizlabs/php_codesniffer phpmd/phpmd
```

After installation, verify the tools are available:

```bash
$ vendor/bin/phpstan --version
PHPStan - PHP Static Analysis Tool 1.12.x

$ vendor/bin/phpcs --version
PHP_CodeSniffer version 3.10.x

$ vendor/bin/phpmd --version
PHPMD X.Y.Z
```

Each tool reads its configuration from a dedicated file:

| Tool | Config File | Purpose |
|------|-------------|---------|
| PHPStan | `phpstan.neon` | Rule level, paths to scan, ignored errors |
| PHP_CodeSniffer | `phpcs.xml` | Coding standard, file extensions, exclusions |
| PHPMD | `phpmd.xml` | Metric thresholds, rule sets, exclusions |

Create minimal configuration files now. We will refine them as we go.

</section>

<section lang="id">

## Setup Alat

Buat proyek PHP baru (atau masuk ke proyek yang sudah ada) dan instal ketiga alat sebagai dependensi pengembangan melalui Composer:

```bash
$ mkdir code-quality-demo && cd code-quality-demo
$ composer init --name="polinema/code-quality-demo" --type="project" --no-interaction
$ composer require --dev phpstan/phpstan squizlabs/php_codesniffer phpmd/phpmd
```

Setelah instalasi, verifikasi bahwa alat tersedia:

```bash
$ vendor/bin/phpstan --version
PHPStan - PHP Static Analysis Tool 1.12.x

$ vendor/bin/phpcs --version
PHP_CodeSniffer version 3.10.x

$ vendor/bin/phpmd --version
PHPMD X.Y.Z
```

Setiap alat membaca konfigurasinya dari file khusus:

| Alat | File Konfigurasi | Tujuan |
|------|------------------|--------|
| PHPStan | `phpstan.neon` | Level aturan, *path* yang dipindai, error yang diabaikan |
| PHP_CodeSniffer | `phpcs.xml` | Standar koding, ekstensi file, pengecualian |
| PHPMD | `phpmd.xml` | Ambang metrik, set aturan, pengecualian |

Buat file konfigurasi minimal sekarang. Kita akan menyempurnakannya seiring berjalan.

</section>

---

<section lang="en">

## Static Analysis with PHPStan

### Our Example: A User Registration Service

Let's write a small PHP class, deliberately imperfect, that receives a user registration request (name, email, password), validates the inputs, and creates a user record. We will run PHPStan against it at each level and watch the tool catch progressively more issues.

Create `src/UserRegistrationService.php`:

```php
<?php

declare(strict_types=1);

namespace App;

use PDO;

class UserRegistrationService
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function register(array $data): int
    {
        $name = $data['name'];
        $email = $data['email'];
        $password = $data['password'];

        if (strlen($name) < 3) {
            throw new \InvalidArgumentException('Name too short');
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('Invalid email');
        }

        $hashed = password_hash($password, PASSWORD_BCRYPT);

        $stmt = $this->db->prepare(
            'INSERT INTO users (name, email, password) VALUES (:name, :email, :password)'
        );
        $stmt->execute([
            'name' => $name,
            'email' => $email,
            'password' => $hashed,
        ]);

        $result = $this->db->query('SELECT LAST_INSERT_ID()');
        $id = $result->fetch(PDO::FETCH_COLUMN);

        return $id;
    }

    public function findById($id)
    {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE id = :id');
        $stmt->execute(['id' => $id]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
```

Create the minimal PHPStan configuration file `phpstan.neon`:

```neon
parameters:
  level: 0
  paths:
    - src
```

### Level 0 → 2: Basic Checks

Run PHPStan at level 0:

```bash
$ vendor/bin/phpstan analyse
 [OK] No errors
```

At level 0, PHPStan only checks for unknown classes, functions, and constants. Our code uses standard PHP functions and PDO, so it passes. Let us raise the bar step by step:

```bash
$ vendor/bin/phpstan analyse --level=1
  ------ -------------------------------------------------------------------
   Line   UserRegistrationService.php
  ------ -------------------------------------------------------------------
   39     Parameter #1 $statement of method PDO::query() expects string,
          PDOStatement|false given.
  ------ -------------------------------------------------------------------

$ vendor/bin/phpstan analyse --level=2
  ------ -------------------------------------------------------------------
   Line   UserRegistrationService.php
  ------ -------------------------------------------------------------------
   39     Parameter #1 $statement of method PDO::query() expects string,
          PDOStatement|false given.
   40     Cannot call method fetch() on PDOStatement|false.
  ------ -------------------------------------------------------------------
```

At level 1, PHPStan notices that we passed a `prepare()` result to `query()`. We mistakenly called `$this->db->query(...)` instead of `$this->db->lastInsertId()`. At level 2, it also warns that `fetch()` cannot be called on `false`, because `query()` can return `false` on failure. Both are real bugs, even though the code appears syntactically correct.

**Fix:** Replace lines 38–42 with:

```php
$id = (int) $this->db->lastInsertId();
return $id;
```

### Level 3 → 5: Type Safety

```bash
$ vendor/bin/phpstan analyse --level=3
  ------ -------------------------------------------------------------------
   Line   UserRegistrationService.php
  ------ -------------------------------------------------------------------
   47     Parameter #2 $id of method PDOStatement::execute() expects
          array<int<0, max>, mixed>|null, array{id: int|string} given.
  ------ -------------------------------------------------------------------

$ vendor/bin/phpstan analyse --level=5
  ------ -------------------------------------------------------------------
   Line   UserRegistrationService.php
  ------ -------------------------------------------------------------------
   13     Method UserRegistrationService::register() has parameter $data with
          no type specified.
   21     Variable $data['password'] might not exist. 💡 Because the array
          comes from an array shape with optional offset 'password'.
   21     Parameter $password of function password_hash() expects string,
          string|null given.
   44     Method UserRegistrationService::findById() has parameter $id with
          no type specified.
   44     Method UserRegistrationService::findById() has no return type
          specified.
  ------ -------------------------------------------------------------------
```

At level 5, PHPStan requires type declarations on parameters and return types, and it performs strict array-shape analysis. These warnings are actionable:

- `$data` should be typed as `array{name: string, email: string, password: string}` or a dedicated DTO
- `findById` needs a parameter type `int|string` and return type `array|false`
- The `password` field might not exist in `$data`

**Fix the signature and add fallback:**

```php
public function register(array $data): int
{
    $name = $data['name'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    // ...
}

public function findById(int|string $id): array|false
{
    // ...
}
```

At level 6 and beyond, PHPStan checks for missing type hints on generic arrays (`array` vs `array<string, mixed>`), missing `mixed` on closures, and similar strictness items. For student and real-world projects, **level 5 is a pragmatic target**: it catches meaningful bugs without the noise that higher levels introduce.

### The Value of Level Progression

The step-by-step increase is not a gimmick. It keeps the barrier to adoption low. Start a legacy project at level 0 and fix the baseline errors. Deploy. Raise to level 2 and fix the type-vs-false issues. Deploy. Continue until you reach your team's agreed target level. Each increment is small enough that it fits into a single sprint, and each one makes the code measurably safer.

</section>

<section lang="id">

## Static Analysis dengan PHPStan

### Contoh Kita: Layanan Registrasi Pengguna

Mari kita tulis kelas PHP kecil yang sengaja dibuat tidak sempurna, yang menerima permintaan registrasi pengguna (nama, email, password), memvalidasi input, dan membuat *record* pengguna. Kita akan menjalankan PHPStan terhadapnya di setiap level dan melihat alat menangkap lebih banyak masalah secara progresif.

Buat `src/UserRegistrationService.php`:

```php
<?php

declare(strict_types=1);

namespace App;

use PDO;

class UserRegistrationService
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function register(array $data): int
    {
        $name = $data['name'];
        $email = $data['email'];
        $password = $data['password'];

        if (strlen($name) < 3) {
            throw new \InvalidArgumentException('Name too short');
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('Invalid email');
        }

        $hashed = password_hash($password, PASSWORD_BCRYPT);

        $stmt = $this->db->prepare(
            'INSERT INTO users (name, email, password) VALUES (:name, :email, :password)'
        );
        $stmt->execute([
            'name' => $name,
            'email' => $email,
            'password' => $hashed,
        ]);

        $result = $this->db->query('SELECT LAST_INSERT_ID()');
        $id = $result->fetch(PDO::FETCH_COLUMN);

        return $id;
    }

    public function findById($id)
    {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE id = :id');
        $stmt->execute(['id' => $id]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
```

Buat file konfigurasi PHPStan minimal `phpstan.neon`:

```neon
parameters:
  level: 0
  paths:
    - src
```

### Level 0 → 2: Pemeriksaan Dasar

Jalankan PHPStan pada level 0:

```bash
$ vendor/bin/phpstan analyse
 [OK] No errors
```

Pada level 0, PHPStan hanya memeriksa kelas, fungsi, dan konstanta yang tidak dikenal. Kode kita menggunakan fungsi PHP standar dan PDO, jadi lulus. Mari kita naikkan level secara bertahap:

```bash
$ vendor/bin/phpstan analyse --level=1
  ------ -------------------------------------------------------------------
   Line   UserRegistrationService.php
  ------ -------------------------------------------------------------------
   39     Parameter #1 $statement of method PDO::query() expects string,
          PDOStatement|false given.
  ------ -------------------------------------------------------------------

$ vendor/bin/phpstan analyse --level=2
  ------ -------------------------------------------------------------------
   Line   UserRegistrationService.php
  ------ -------------------------------------------------------------------
   39     Parameter #1 $statement of method PDO::query() expects string,
          PDOStatement|false given.
   40     Cannot call method fetch() on PDOStatement|false.
  ------ -------------------------------------------------------------------
```

Pada level 1, PHPStan menyadari bahwa kita mengirimkan hasil `prepare()` ke `query()`. Kita salah memanggil `$this->db->query(...)` alih-alih `$this->db->lastInsertId()`. Pada level 2, ia juga memperingatkan bahwa `fetch()` tidak dapat dipanggil pada `false`, karena `query()` bisa mengembalikan `false` saat gagal. Keduanya adalah bug nyata, meskipun kode tampak benar secara sintaksis.

**Perbaiki:** Ganti baris 38–42 dengan:

```php
$id = (int) $this->db->lastInsertId();
return $id;
```

### Level 3 → 5: Keamanan Tipe

```bash
$ vendor/bin/phpstan analyse --level=3
  ------ -------------------------------------------------------------------
   Line   UserRegistrationService.php
  ------ -------------------------------------------------------------------
   47     Parameter #2 $id of method PDOStatement::execute() expects
          array<int<0, max>, mixed>|null, array{id: int|string} given.
  ------ -------------------------------------------------------------------

$ vendor/bin/phpstan analyse --level=5
  ------ -------------------------------------------------------------------
   Line   UserRegistrationService.php
  ------ -------------------------------------------------------------------
   13     Method UserRegistrationService::register() has parameter $data with
          no type specified.
   21     Variable $data['password'] might not exist. 💡 Because the array
          comes from an array shape with optional offset 'password'.
   21     Parameter $password of function password_hash() expects string,
          string|null given.
   44     Method UserRegistrationService::findById() has parameter $id with
          no type specified.
   44     Method UserRegistrationService::findById() has no return type
          specified.
  ------ -------------------------------------------------------------------
```

Pada level 5, PHPStan memerlukan deklarasi tipe pada parameter dan tipe pengembalian, dan melakukan analisis array-shape yang ketat. Peringatan ini dapat ditindaklanjuti:

- `$data` harus diberi tipe `array{name: string, email: string, password: string}` atau DTO khusus
- `findById` memerlukan tipe parameter `int|string` dan tipe pengembalian `array|false`
- Field `password` mungkin tidak ada di `$data`

**Perbaiki *signature* dan tambahkan *fallback*:**

```php
public function register(array $data): int
{
    $name = $data['name'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    // ...
}

public function findById(int|string $id): array|false
{
    // ...
}
```

Pada level 6 ke atas, PHPStan memeriksa petunjuk tipe yang hilang pada array generik (`array` vs `array<string, mixed>`), `mixed` yang hilang pada closure, dan item ketat serupa. Untuk proyek mahasiswa dan dunia nyata, **level 5 adalah target pragmatis**: ia menangkap bug yang berarti tanpa *noise* yang diperkenalkan oleh level yang lebih tinggi.

### Nilai dari Progresi Level

Peningkatan bertahap bukanlah *gimmick*. Ini menjaga hambatan adopsi tetap rendah. Mulai proyek *legacy* di level 0 dan perbaiki error *baseline*. Deploy. Naikkan ke level 2 dan perbaiki masalah tipe-vs-false. Deploy. Lanjutkan hingga Anda mencapai level target yang disepakati tim. Setiap kenaikan cukup kecil sehingga muat dalam satu sprint, dan masing-masing membuat kode lebih aman secara terukur.

</section>

---

<section lang="en">

## Style Linting with PHP_CodeSniffer

### Configuring PSR-12

Create `phpcs.xml` in the project root:

```xml
<?xml version="1.0"?>
<ruleset name="Polinema Coding Standard">
    <description>PSR-12 with additional project-specific rules</description>

    <arg name="colors"/>
    <arg name="extensions" value="php"/>

    <file>src</file>
    <file>tests</file>

    <rule ref="PSR12"/>

    <!-- Additional rules -->
    <rule ref="Generic.Arrays.DisallowLongArraySyntax"/>
    <rule ref="Generic.PHP.ForbiddenFunctions">
        <properties>
            <property name="forbiddenFunctions" type="array">
                <element key="var_dump" value="null"/>
                <element key="dd" value="null"/>
                <element key="die" value="null"/>
            </property>
        </properties>
    </rule>
</ruleset>
```

This ruleset builds on PSR-12 and adds two project-specific rules: ban the long `array()` syntax in favor of short `[]`, and forbid leftover debugging functions (`var_dump`, `dd`, `die`). The `<file>` directives tell phpcs which directories to scan.

### Running the Check

Let us apply this to a deliberately messy file. Create `src/OrderCalculator.php`:

```php
<?php

namespace App;

class OrderCalculator{
    private $taxRate;
    private $discountRate;

    public function __construct($taxRate,$discountRate){
        $this->taxRate = $taxRate;
        $this->discountRate=$discountRate;
    }

    public function calculateTotal(array $items): float
    {
        $subtotal = 0;
        foreach($items as $item){
            $subtotal+=$item['price']*$item['quantity'];
        }

        $tax = $subtotal*$this->taxRate;
        $discount = $subtotal*$this->discountRate;

        var_dump($subtotal, $tax, $discount);

        return $subtotal+$tax-$discount;
    }
}
```

Run phpcs:

```bash
$ vendor/bin/phpcs
FILE: src/OrderCalculator.php
----------------------------------------------------------------------
FOUND 14 ERRORS AFFECTING 6 LINES
----------------------------------------------------------------------
 5 | ERROR | [x] Opening brace of class must be on the same line as
   |       |     the name (PSR12.Classes.OpeningBraceSpace.Found)
 6 | ERROR | [ ] Line indented incorrectly; expected at least 4
   |       |     spaces, found 3
   |       |     (Generic.WhiteSpace.ScopeIndent.IncorrectExact)
 8 | ERROR | [x] Expected 1 space after comma in argument list; 0
   |       |     found (Squiz.Functions.FunctionDeclarationArgument
   |       |     Spacing.SpacingAfterComma)
 9 | ERROR | [x] Expected at least 1 space after assignment; 0 found
   |       |     (Squiz.WhiteSpace.OperatorSpacing.NoSpaceAfter)
16 | ERROR | [x] Expected 1 space after FOREACH keyword; 0 found
   |       |     (Squiz.ControlStructures.ForEachLoopDeclaration.
   |       |     SpaceAfterOpen)
17 | ERROR | [ ] Line indented incorrectly; expected at least 4
   |       |     spaces, found 3
   |       |     (Generic.WhiteSpace.ScopeIndent.IncorrectExact)
22 | ERROR | [x] Forbidden function var_dump() found
   |       |     (Generic.PHP.ForbiddenFunctions.Found)
----------------------------------------------------------------------
PHPCBF CAN FIX THE 5 MARKED [x] AUTOMATICALLY
----------------------------------------------------------------------
```

### Auto-Fixing with phpcbf

The `[x]` markers indicate fixable violations. Let phpcbf handle them:

```bash
$ vendor/bin/phpcbf
PHPCBF RESULT SUMMARY
----------------------------------------------------------------------
FILE                                            FIXED  REMAINING
----------------------------------------------------------------------
src/OrderCalculator.php                         5      9
----------------------------------------------------------------------
A TOTAL OF 5 ERRORS WERE FIXED IN 1 FILE
----------------------------------------------------------------------
```

Running phpcs again shows only the remaining errors (indentation and the forbidden `var_dump`). Remove `var_dump` manually, fix the remaining indentation, and run phpcs one last time:

```bash
$ vendor/bin/phpcs
 [OK] No errors
```

### Adding the Script to composer.json

Add convenience scripts so you do not need to remember the full vendor paths:

```json
{
    "scripts": {
        "cs": "phpcs",
        "cs-fix": "phpcbf"
    }
}
```

Now `composer cs` runs the check and `composer cs-fix` applies auto-fixes.

</section>

<section lang="id">

## Style Linting dengan PHP_CodeSniffer

### Mengkonfigurasi PSR-12

Buat `phpcs.xml` di root proyek:

```xml
<?xml version="1.0"?>
<ruleset name="Polinema Coding Standard">
    <description>PSR-12 dengan aturan spesifik proyek tambahan</description>

    <arg name="colors"/>
    <arg name="extensions" value="php"/>

    <file>src</file>
    <file>tests</file>

    <rule ref="PSR12"/>

    <!-- Aturan tambahan -->
    <rule ref="Generic.Arrays.DisallowLongArraySyntax"/>
    <rule ref="Generic.PHP.ForbiddenFunctions">
        <properties>
            <property name="forbiddenFunctions" type="array">
                <element key="var_dump" value="null"/>
                <element key="dd" value="null"/>
                <element key="die" value="null"/>
            </property>
        </properties>
    </rule>
</ruleset>
```

*Ruleset* ini dibangun di atas PSR-12 dan menambahkan dua aturan spesifik proyek: larang sintaks `array()` panjang demi `[]` pendek, dan larang fungsi debugging yang tertinggal (`var_dump`, `dd`, `die`). Direktif `<file>` memberi tahu phpcs direktori mana yang akan dipindai.

### Menjalankan Pemeriksaan

Mari kita terapkan ini pada file yang sengaja berantakan. Buat `src/OrderCalculator.php`:

```php
<?php

namespace App;

class OrderCalculator{
    private $taxRate;
    private $discountRate;

    public function __construct($taxRate,$discountRate){
        $this->taxRate = $taxRate;
        $this->discountRate=$discountRate;
    }

    public function calculateTotal(array $items): float
    {
        $subtotal = 0;
        foreach($items as $item){
            $subtotal+=$item['price']*$item['quantity'];
        }

        $tax = $subtotal*$this->taxRate;
        $discount = $subtotal*$this->discountRate;

        var_dump($subtotal, $tax, $discount);

        return $subtotal+$tax-$discount;
    }
}
```

Jalankan phpcs:

```bash
$ vendor/bin/phpcs
FILE: src/OrderCalculator.php
----------------------------------------------------------------------
FOUND 14 ERRORS AFFECTING 6 LINES
----------------------------------------------------------------------
 5 | ERROR | [x] Opening brace of class must be on the same line as
   |       |     the name (PSR12.Classes.OpeningBraceSpace.Found)
 6 | ERROR | [ ] Line indented incorrectly; expected at least 4
   |       |     spaces, found 3
   |       |     (Generic.WhiteSpace.ScopeIndent.IncorrectExact)
 8 | ERROR | [x] Expected 1 space after comma in argument list; 0
   |       |     found (Squiz.Functions.FunctionDeclarationArgument
   |       |     Spacing.SpacingAfterComma)
 9 | ERROR | [x] Expected at least 1 space after assignment; 0 found
   |       |     (Squiz.WhiteSpace.OperatorSpacing.NoSpaceAfter)
16 | ERROR | [x] Expected 1 space after FOREACH keyword; 0 found
   |       |     (Squiz.ControlStructures.ForEachLoopDeclaration.
   |       |     SpaceAfterOpen)
17 | ERROR | [ ] Line indented incorrectly; expected at least 4
   |       |     spaces, found 3
   |       |     (Generic.WhiteSpace.ScopeIndent.IncorrectExact)
22 | ERROR | [x] Forbidden function var_dump() found
   |       |     (Generic.PHP.ForbiddenFunctions.Found)
----------------------------------------------------------------------
PHPCBF CAN FIX THE 5 MARKED [x] AUTOMATICALLY
----------------------------------------------------------------------
```

### Auto-Fix dengan phpcbf

Penanda `[x]` menunjukkan pelanggaran yang dapat diperbaiki. Biarkan phpcbf menanganinya:

```bash
$ vendor/bin/phpcbf
PHPCBF RESULT SUMMARY
----------------------------------------------------------------------
FILE                                            FIXED  REMAINING
----------------------------------------------------------------------
src/OrderCalculator.php                         5      9
----------------------------------------------------------------------
A TOTAL OF 5 ERRORS WERE FIXED IN 1 FILE
----------------------------------------------------------------------
```

Menjalankan phpcs lagi hanya menampilkan error yang tersisa (indentasi dan `var_dump` yang dilarang). Hapus `var_dump` secara manual, perbaiki indentasi yang tersisa, dan jalankan phpcs sekali lagi:

```bash
$ vendor/bin/phpcs
 [OK] No errors
```

### Menambahkan Script ke composer.json

Tambahkan *script* kenyamanan agar Anda tidak perlu mengingat *path* vendor penuh:

```json
{
    "scripts": {
        "cs": "phpcs",
        "cs-fix": "phpcbf"
    }
}
```

Sekarang `composer cs` menjalankan pemeriksaan dan `composer cs-fix` menerapkan perbaikan otomatis.

</section>

---

<section lang="en">

## Code Metrics with PHPMD

### Understanding the Metrics

PHPMD ships several rule sets. The most immediately useful for code quality are:

| Rule Set | What It Measures | Typical Thresholds |
|----------|-----------------|-------------------|
| `cleancode` | Boolean arguments, else expressions, static access | N/A (presence checks) |
| `codesize` | Cyclomatic complexity, method length, class size, public method count | Complexity ≤ 10, method ≤ 100 lines, class ≤ 1000 lines |
| `design` | Coupling Between Objects (CBO), depth of inheritance | CBO ≤ 13 |
| `naming` | Variable/method length, naming conventions | Method name ≥ 3 chars |
| `unusedcode` | Unused private methods, fields, parameters | N/A (presence checks) |

### Configuring phpmd.xml

```xml
<?xml version="1.0"?>
<ruleset name="Polinema PHPMD Rules"
         xmlns="http://pmd.sf.net/ruleset/1.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://pmd.sf.net/ruleset/1.0.0
                     http://pmd.sf.net/ruleset_xml_schema.xsd"
         xsi:noNamespaceSchemaLocation="
                     http://pmd.sf.net/ruleset_xml_schema.xsd">
    <description>Code quality rules for Polinema PHP projects</description>

    <rule ref="rulesets/cleancode.xml">
        <exclude name="StaticAccess"/>
    </rule>

    <rule ref="rulesets/codesize.xml">
        <exclude name="TooManyPublicMethods"/>
    </rule>

    <rule ref="rulesets/codesize.xml/CyclomaticComplexity">
        <properties>
            <property name="reportLevel" value="5"/>
        </properties>
    </rule>

    <rule ref="rulesets/design.xml">
        <exclude name="CouplingBetweenObjects"/>
    </rule>

    <rule ref="rulesets/naming.xml">
        <exclude name="ShortVariable"/>
        <exclude name="LongVariable"/>
        <exclude name="ShortMethodName"/>
    </rule>

    <rule ref="rulesets/unusedcode.xml"/>
</ruleset>
```

This configuration excludes rules that are too noisy for most projects (StaticAccess, TooManyPublicMethods, CouplingBetweenObjects, ShortVariable) while keeping the rules that catch real structural problems. The Cyclomatic Complexity threshold is raised from the default of 10 to 5; methods that exceed this are flagged for review.

### Running PHPMD Against Real Code

Create a file with intentional complexity issues. Save this as `src/ReportGenerator.php`:

```php
<?php

namespace App;

class ReportGenerator
{
    public function generate(array $orders, string $format, bool $includeTax, bool $includeDiscount, string $currency, ?\DateTime $startDate = null, ?\DateTime $endDate = null): string
    {
        $output = '';

        if ($format === 'csv') {
            $output .= "ID,Date,Total\n";
            foreach ($orders as $order) {
                if ($includeTax && $includeDiscount) {
                    $total = $order['total'] * 1.11 * 0.9;
                } elseif ($includeTax) {
                    $total = $order['total'] * 1.11;
                } elseif ($includeDiscount) {
                    $total = $order['total'] * 0.9;
                } else {
                    $total = $order['total'];
                }
                $output .= "{$order['id']},{$order['date']},{$total}\n";
            }
        } elseif ($format === 'json') {
            $result = [];
            foreach ($orders as $order) {
                if ($includeTax && $includeDiscount) {
                    $total = $order['total'] * 1.11 * 0.9;
                } elseif ($includeTax) {
                    $total = $order['total'] * 1.11;
                } elseif ($includeDiscount) {
                    $total = $order['total'] * 0.9;
                } else {
                    $total = $order['total'];
                }

                if ($startDate && $endDate) {
                    $orderDate = new \DateTime($order['date']);
                    if ($orderDate >= $startDate && $orderDate <= $endDate) {
                        $result[] = ['id' => $order['id'], 'total' => $total];
                    }
                } else {
                    $result[] = ['id' => $order['id'], 'total' => $total];
                }
            }
            $output = json_encode($result, JSON_PRETTY_PRINT);
        } elseif ($format === 'xml') {
            $xml = new \SimpleXMLElement('<report/>');
            foreach ($orders as $order) {
                if ($includeTax && $includeDiscount) {
                    $total = $order['total'] * 1.11 * 0.9;
                } elseif ($includeTax) {
                    $total = $order['total'] * 1.11;
                } elseif ($includeDiscount) {
                    $total = $order['total'] * 0.9;
                } else {
                    $total = $order['total'];
                }
                $item = $xml->addChild('order');
                $item->addChild('id', (string) $order['id']);
                $item->addChild('total', (string) $total);
            }
            $output = $xml->asXML();
        } elseif ($format === 'html') {
            $output .= '<table><tr><th>ID</th><th>Total</th></tr>';
            foreach ($orders as $order) {
                if ($includeTax && $includeDiscount) {
                    $total = $order['total'] * 1.11 * 0.9;
                } elseif ($includeTax) {
                    $total = $order['total'] * 1.11;
                } elseif ($includeDiscount) {
                    $total = $order['total'] * 0.9;
                } else {
                    $total = $order['total'];
                }
                $output .= "<tr><td>{$order['id']}</td><td>{$total}</td></tr>";
            }
            $output .= '</table>';
        }

        return $output;
    }
}
```

Run PHPMD:

```bash
$ vendor/bin/phpmd src text phpmd.xml
src/ReportGenerator.php:7  The method generate() has a Cyclomatic
Complexity of 20. The configured cyclomatic complexity threshold
is 5.

src/ReportGenerator.php:7  The method generate() has 81 lines of
code. Current threshold is 60 lines. Consider refactoring.

src/ReportGenerator.php:7  The method generate() has 7 parameters.
Consider reducing the number of parameters to fewer than 5.
```

PHPMD identified all three structural problems: excessive cyclomatic complexity (20 vs the threshold of 5), an over-long method (81 lines vs 60), and too many parameters (7 vs 5). These are precisely the metrics that correlate with higher defect rates.

**The root problem is that `generate()` handles too many concerns.** The solution is to split it into smaller methods, one for each output format, and replace the boolean flags with a value object or strategy pattern.

</section>

<section lang="id">

## Metrik Kode dengan PHPMD

### Memahami Metrik

PHPMD menyediakan beberapa set aturan. Yang paling berguna untuk kualitas kode adalah:

| Set Aturan | Apa yang Diukur | Ambang Batas Umum |
|------------|-----------------|-------------------|
| `cleancode` | Argumen boolean, ekspresi else, akses statis | N/A (pemeriksaan keberadaan) |
| `codesize` | Cyclomatic complexity, panjang metode, ukuran kelas, jumlah metode publik | Kompleksitas ≤ 10, metode ≤ 100 baris, kelas ≤ 1000 baris |
| `design` | Coupling Between Objects (CBO), kedalaman pewarisan | CBO ≤ 13 |
| `naming` | Panjang variabel/metode, konvensi penamaan | Nama metode ≥ 3 karakter |
| `unusedcode` | Metode privat, field, parameter yang tidak digunakan | N/A (pemeriksaan keberadaan) |

### Mengkonfigurasi phpmd.xml

```xml
<?xml version="1.0"?>
<ruleset name="Polinema PHPMD Rules"
         xmlns="http://pmd.sf.net/ruleset/1.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://pmd.sf.net/ruleset/1.0.0
                     http://pmd.sf.net/ruleset_xml_schema.xsd"
         xsi:noNamespaceSchemaLocation="
                     http://pmd.sf.net/ruleset_xml_schema.xsd">
    <description>Aturan kualitas kode untuk proyek PHP Polinema</description>

    <rule ref="rulesets/cleancode.xml">
        <exclude name="StaticAccess"/>
    </rule>

    <rule ref="rulesets/codesize.xml">
        <exclude name="TooManyPublicMethods"/>
    </rule>

    <rule ref="rulesets/codesize.xml/CyclomaticComplexity">
        <properties>
            <property name="reportLevel" value="5"/>
        </properties>
    </rule>

    <rule ref="rulesets/design.xml">
        <exclude name="CouplingBetweenObjects"/>
    </rule>

    <rule ref="rulesets/naming.xml">
        <exclude name="ShortVariable"/>
        <exclude name="LongVariable"/>
        <exclude name="ShortMethodName"/>
    </rule>

    <rule ref="rulesets/unusedcode.xml"/>
</ruleset>
```

Konfigurasi ini mengecualikan aturan yang terlalu bising untuk kebanyakan proyek (StaticAccess, TooManyPublicMethods, CouplingBetweenObjects, ShortVariable) sambil mempertahankan aturan yang menangkap masalah struktural nyata. Ambang Cyclomatic Complexity dinaikkan dari default 10 menjadi 5, sehingga metode yang melebihi ini ditandai untuk ditinjau.

### Menjalankan PHPMD terhadap Kode Nyata

Buat file dengan masalah kompleksitas yang disengaja. Simpan ini sebagai `src/ReportGenerator.php`:

```php
<?php

namespace App;

class ReportGenerator
{
    public function generate(array $orders, string $format, bool $includeTax, bool $includeDiscount, string $currency, ?\DateTime $startDate = null, ?\DateTime $endDate = null): string
    {
        $output = '';

        if ($format === 'csv') {
            $output .= "ID,Date,Total\n";
            foreach ($orders as $order) {
                if ($includeTax && $includeDiscount) {
                    $total = $order['total'] * 1.11 * 0.9;
                } elseif ($includeTax) {
                    $total = $order['total'] * 1.11;
                } elseif ($includeDiscount) {
                    $total = $order['total'] * 0.9;
                } else {
                    $total = $order['total'];
                }
                $output .= "{$order['id']},{$order['date']},{$total}\n";
            }
        } elseif ($format === 'json') {
            $result = [];
            foreach ($orders as $order) {
                if ($includeTax && $includeDiscount) {
                    $total = $order['total'] * 1.11 * 0.9;
                } elseif ($includeTax) {
                    $total = $order['total'] * 1.11;
                } elseif ($includeDiscount) {
                    $total = $order['total'] * 0.9;
                } else {
                    $total = $order['total'];
                }

                if ($startDate && $endDate) {
                    $orderDate = new \DateTime($order['date']);
                    if ($orderDate >= $startDate && $orderDate <= $endDate) {
                        $result[] = ['id' => $order['id'], 'total' => $total];
                    }
                } else {
                    $result[] = ['id' => $order['id'], 'total' => $total];
                }
            }
            $output = json_encode($result, JSON_PRETTY_PRINT);
        } elseif ($format === 'xml') {
            $xml = new \SimpleXMLElement('<report/>');
            foreach ($orders as $order) {
                if ($includeTax && $includeDiscount) {
                    $total = $order['total'] * 1.11 * 0.9;
                } elseif ($includeTax) {
                    $total = $order['total'] * 1.11;
                } elseif ($includeDiscount) {
                    $total = $order['total'] * 0.9;
                } else {
                    $total = $order['total'];
                }
                $item = $xml->addChild('order');
                $item->addChild('id', (string) $order['id']);
                $item->addChild('total', (string) $total);
            }
            $output = $xml->asXML();
        } elseif ($format === 'html') {
            $output .= '<table><tr><th>ID</th><th>Total</th></tr>';
            foreach ($orders as $order) {
                if ($includeTax && $includeDiscount) {
                    $total = $order['total'] * 1.11 * 0.9;
                } elseif ($includeTax) {
                    $total = $order['total'] * 1.11;
                } elseif ($includeDiscount) {
                    $total = $order['total'] * 0.9;
                } else {
                    $total = $order['total'];
                }
                $output .= "<tr><td>{$order['id']}</td><td>{$total}</td></tr>";
            }
            $output .= '</table>';
        }

        return $output;
    }
}
```

Jalankan PHPMD:

```bash
$ vendor/bin/phpmd src text phpmd.xml
src/ReportGenerator.php:7  The method generate() has a Cyclomatic
Complexity of 20. The configured cyclomatic complexity threshold
is 5.

src/ReportGenerator.php:7  The method generate() has 81 lines of
code. Current threshold is 60 lines. Consider refactoring.

src/ReportGenerator.php:7  The method generate() has 7 parameters.
Consider reducing the number of parameters to fewer than 5.
```

PHPMD mengidentifikasi ketiga masalah struktural: *cyclomatic complexity* berlebihan (20 vs ambang batas 5), metode yang terlalu panjang (81 baris vs 60), dan terlalu banyak parameter (7 vs 5). Ini tepatnya adalah metrik yang berkorelasi dengan tingkat cacat yang lebih tinggi.

**Akar masalahnya adalah `generate()` menangani terlalu banyak urusan.** Solusinya adalah membaginya menjadi metode yang lebih kecil (satu untuk setiap format output) dan mengganti *flag* boolean dengan *value object* atau *strategy pattern*.

</section>

---

<section lang="en">

## Quality Gates in CI/CD

The tools we have configured run locally, but the real power comes from running them in CI/CD. A quality gate in your pipeline means that no pull request can merge until all three tools pass: the machine enforces the standard, and humans are freed from being the "no" person.

### GitHub Actions Workflow

Create `.github/workflows/code-quality.yml`:

```yaml
name: Code Quality Checks

on:
  pull_request:
    branches: [main, develop]
    paths:
      - '**.php'
      - 'composer.json'
      - 'composer.lock'

jobs:
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

  style-linting:
    name: Style Linting (PHP_CodeSniffer)
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          coverage: none

      - name: Install dependencies
        run: composer install --no-progress --no-interaction --prefer-dist

      - name: Run PHP_CodeSniffer
        run: vendor/bin/phpcs --report=checkstyle | cs2pr

  code-metrics:
    name: Code Metrics (PHPMD)
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          coverage: none

      - name: Install dependencies
        run: composer install --no-progress --no-interaction --prefer-dist

      - name: Run PHPMD
        run: vendor/bin/phpmd src github phpmd.xml
```

### What This Workflow Does

- **Triggers on pull requests** targeting `main` or `develop` that modify PHP files or Composer configuration.
- **Runs three parallel jobs** (static analysis, style linting, and code metrics) so a failing style check does not block the PHPStan result from appearing.
- **Uses `--error-format=github`** for PHPStan so errors are annotated directly on the PR diff view.
- **Uses `cs2pr`** (a small tool that converts checkstyle output to GitHub annotations) so PHP_CodeSniffer results appear inline.
- **Uses `github` output format** for PHPMD to achieve the same inline annotation behavior.
- **Caches Composer dependencies** to keep runs fast (PHPStan and friends are large packages).

### Adding a Composer Script for Local Gate

Add a single command that runs all three checks locally, identical to what CI will run:

```json
{
    "scripts": {
        "cs": "phpcs",
        "cs-fix": "phpcbf",
        "analyse": "phpstan analyse --no-progress",
        "metrics": "phpmd src text phpmd.xml",
        "qa": [
            "@analyse",
            "@cs",
            "@metrics"
        ]
    }
}
```

Now `composer qa` runs all three quality gates in sequence. If any one fails, the entire command exits with a non-zero status, the same behavior as the CI pipeline.

Run `composer qa` before pushing your branch and you will never be surprised by a red CI build on GitHub.

</section>

<section lang="id">

## Gerbang Kualitas di CI/CD

Alat yang telah kita konfigurasi berjalan secara lokal, tetapi kekuatan sebenarnya datang dari menjalankannya di CI/CD. Gerbang kualitas di *pipeline* Anda berarti tidak ada *pull request* yang dapat digabungkan hingga ketiga alat lulus: mesin menegakkan standar, dan manusia dibebaskan dari menjadi "orang yang menolak".

### Workflow GitHub Actions

Buat `.github/workflows/code-quality.yml`:

```yaml
name: Code Quality Checks

on:
  pull_request:
    branches: [main, develop]
    paths:
      - '**.php'
      - 'composer.json'
      - 'composer.lock'

jobs:
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

  style-linting:
    name: Style Linting (PHP_CodeSniffer)
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          coverage: none

      - name: Install dependencies
        run: composer install --no-progress --no-interaction --prefer-dist

      - name: Run PHP_CodeSniffer
        run: vendor/bin/phpcs --report=checkstyle | cs2pr

  code-metrics:
    name: Code Metrics (PHPMD)
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          coverage: none

      - name: Install dependencies
        run: composer install --no-progress --no-interaction --prefer-dist

      - name: Run PHPMD
        run: vendor/bin/phpmd src github phpmd.xml
```

### Apa yang Dilakukan Workflow Ini

- **Dipicu pada pull request** yang menargetkan `main` atau `develop` yang memodifikasi file PHP atau konfigurasi Composer.
- **Menjalankan tiga *job* paralel** (*static analysis*, *style linting*, dan *code metrics*) sehingga pemeriksaan gaya yang gagal tidak memblokir hasil PHPStan agar tidak muncul.
- **Menggunakan `--error-format=github`** untuk PHPStan sehingga error dianotasi langsung pada tampilan diff PR.
- **Menggunakan `cs2pr`** (alat kecil yang mengkonversi output checkstyle ke anotasi GitHub) sehingga hasil PHP_CodeSniffer muncul inline.
- **Menggunakan format output `github`** untuk PHPMD untuk mencapai perilaku anotasi inline yang sama.
- **Meng-cache dependensi Composer** untuk menjaga proses tetap cepat (PHPStan dan teman-temannya adalah paket besar).

### Menambahkan Composer Script untuk Gerbang Lokal

Tambahkan satu perintah yang menjalankan ketiga pemeriksaan secara lokal, identik dengan apa yang akan dijalankan CI:

```json
{
    "scripts": {
        "cs": "phpcs",
        "cs-fix": "phpcbf",
        "analyse": "phpstan analyse --no-progress",
        "metrics": "phpmd src text phpmd.xml",
        "qa": [
            "@analyse",
            "@cs",
            "@metrics"
        ]
    }
}
```

Sekarang `composer qa` menjalankan ketiga gerbang kualitas secara berurutan. Jika salah satu gagal, seluruh perintah keluar dengan status non-zero, perilaku yang sama dengan *pipeline* CI.

Jalankan `composer qa` sebelum mendorong branch Anda dan Anda tidak akan pernah terkejut oleh build CI merah di GitHub.

</section>

---

<section lang="en">

## Interpreting the Numbers

A tool that reports 400 warnings is not more useful than a tool that reports 0. The value of code quality analysis comes from knowing which warnings matter and which do not in your context. Here is a decision framework for interpreting the output of each tool.

### PHPStan: Fix, Baseline, or Suppress

| Situation | Action |
|-----------|--------|
| Level 0–2 error on a method you maintain | **Fix it.** These are almost certainly bugs. |
| Level 3–5 error in a legacy file you do not own | **Baseline it.** Run `phpstan analyse --generate-baseline` to generate a list of known errors and exclude them from future runs. This lets you enforce the standard on new code without fixing the old code. |
| Level 6+ error about `mixed` return type in a generic helper | **Suppress with a comment.** Add `// @phpstan-ignore-next-line` with a justification. Generic helpers that exist to handle "anything" are legitimate uses of `mixed`. |
| Error about a dynamic property on a class you extend from a third-party library | **Stub it.** PHPStan stubs let you declare the shape of code you do not control. |

The baseline is the most powerful feature for legacy projects. It says: "Here are the 1,200 errors we know about. Do not introduce any new ones." Every new pull request is checked against a moving baseline: errors shrink over time, never grow.

### PHP_CodeSniffer: Fix or Exclude

Style violations are almost always worth fixing. The `[x]` marker from phpcbf makes it fast. The only time to exclude a rule is when your framework flat-out requires a different convention (e.g., Laravel sometimes encourages `snake_case` method names for route model binding, if your team is okay with that, add an exclusion in `phpcs.xml`).

**Never ignore a PSR-12 violation.** PSR-12 is the community baseline. A developer who joins your project expects PSR-12. Violating it adds unnecessary onboarding friction.

### PHPMD: Threshold Tuning, Not Rule Disabling

PHPMD thresholds should reflect your project's maturity, not an abstract ideal:

| Project Stage | Cyclomatic Complexity Threshold | Method Length Threshold |
|--------------|-------------------------------|------------------------|
| **Greenfield (new project)** | 5 | 40 lines |
| **Mid-life (active development, 6+ months)** | 10 | 60 lines |
| **Legacy (stable, maintenance mode)** | 15 | 100 lines |

Start strict and relax only when you have a specific, documented reason. If `ReportGenerator::generate()` reports a complexity of 20, the answer is not to raise the threshold to 20; it is to split the method. But if your ORM generates 15-line methods with complexity of 12 because of dynamic query building, and there is nothing you can do about it, exclude those files and move on.

### The Connection to Bug Prediction

The metrics that PHPMD measures (cyclomatic complexity, method length, coupling) are the same features used by the classifiers in our [Bug Prediction with PHP](/blog/bug-prediction-php) tutorial. High cyclomatic complexity correlates with higher defect density because complex methods have more execution paths, and each path is an opportunity for a bug. When PHPMD flags a method, it is flagging the same code that a Naive Bayes classifier would assign a high risk score. The tools are two views of the same problem: PHPMD uses static thresholds, and bug prediction uses statistical models. Both point in the same direction.

</section>

<section lang="id">

## Menginterpretasikan Angka

Alat yang melaporkan 400 peringatan tidak lebih berguna daripada alat yang melaporkan 0. Nilai dari analisis kualitas kode berasal dari mengetahui peringatan mana yang penting dan mana yang tidak dalam konteks Anda. Berikut adalah kerangka keputusan untuk menginterpretasikan output setiap alat.

### PHPStan: Perbaiki, Baseline, atau Suppress

| Situasi | Tindakan |
|---------|----------|
| Error level 0–2 pada metode yang Anda kelola | **Perbaiki.** Ini hampir pasti bug. |
| Error level 3–5 di file *legacy* yang bukan milik Anda | **Baseline.** Jalankan `phpstan analyse --generate-baseline` untuk menghasilkan daftar error yang diketahui dan mengecualikannya dari proses mendatang. Ini memungkinkan Anda menegakkan standar pada kode baru tanpa memperbaiki kode lama. |
| Error level 6+ tentang tipe pengembalian `mixed` di helper generik | **Suppress dengan komentar.** Tambahkan `// @phpstan-ignore-next-line` dengan justifikasi. Helper generik yang ada untuk menangani "apa saja" adalah penggunaan `mixed` yang sah. |
| Error tentang properti dinamis pada kelas yang Anda warisi dari library pihak ketiga | **Stub.** PHPStan *stub* memungkinkan Anda mendeklarasikan bentuk kode yang tidak Anda kendalikan. |

Baseline adalah fitur paling kuat untuk proyek *legacy*. Ini mengatakan: "Ini adalah 1.200 error yang kami ketahui. Jangan perkenalkan yang baru." Setiap *pull request* baru diperiksa terhadap *baseline* yang bergerak, sehingga error menyusut seiring waktu dan tidak pernah bertambah.

### PHP_CodeSniffer: Perbaiki atau Kecualikan

Pelanggaran gaya hampir selalu layak diperbaiki. Penanda `[x]` dari phpcbf membuatnya cepat. Satu-satunya waktu untuk mengecualikan aturan adalah ketika framework Anda benar-benar memerlukan konvensi yang berbeda (misalnya, Laravel kadang-kadang mendorong nama metode `snake_case` untuk *route model binding*, jika tim Anda setuju dengan itu, tambahkan pengecualian di `phpcs.xml`).

**Jangan pernah mengabaikan pelanggaran PSR-12.** PSR-12 adalah *baseline* komunitas. Pengembang yang bergabung dengan proyek Anda mengharapkan PSR-12. Melanggarnya menambah friksi *onboarding* yang tidak perlu.

### PHPMD: Penyetelan Ambang Batas, Bukan Menonaktifkan Aturan

Ambang batas PHPMD harus mencerminkan kematangan proyek Anda, bukan ideal abstrak:

| Tahap Proyek | Ambang Cyclomatic Complexity | Ambang Panjang Metode |
|-------------|------------------------------|-----------------------|
| **Greenfield (proyek baru)** | 5 | 40 baris |
| **Mid-life (pengembangan aktif, 6+ bulan)** | 10 | 60 baris |
| **Legacy (stabil, mode pemeliharaan)** | 15 | 100 baris |

Mulai ketat dan longgarkan hanya ketika Anda memiliki alasan spesifik dan terdokumentasi. Jika `ReportGenerator::generate()` melaporkan kompleksitas 20, jawabannya bukanlah menaikkan ambang batas ke 20, melainkan membagi metode. Tetapi jika ORM Anda menghasilkan metode 15 baris dengan kompleksitas 12 karena pembangunan query dinamis, dan tidak ada yang dapat Anda lakukan tentang itu, kecualikan file tersebut dan lanjutkan.

### Koneksi ke Prediksi Bug

Metrik yang diukur PHPMD, yaitu *cyclomatic complexity*, panjang metode, dan *coupling*, adalah fitur yang sama yang digunakan oleh *classifier* di tutorial [Prediksi Bug dengan PHP](/blog/bug-prediction-php) kami. *Cyclomatic complexity* tinggi berkorelasi dengan kepadatan cacat yang lebih tinggi karena metode kompleks memiliki lebih banyak jalur eksekusi, dan setiap jalur adalah peluang untuk bug. Ketika PHPMD menandai sebuah metode, ia menandai kode yang sama yang akan diberi skor risiko tinggi oleh *classifier* Naive Bayes. Alat-alat ini adalah dua pandangan dari masalah yang sama: PHPMD menggunakan ambang batas statis, dan prediksi bug menggunakan model statistik. Keduanya menunjuk ke arah yang sama.

</section>

---

<section lang="en">

## Practice Exercise

### Starter Code

Below is a PHP class with multiple quality issues: style violations, a real bug that static analysis would catch, and structural complexity that metrics would flag. Your task is to clean it up until `composer qa` passes cleanly.

Copy this into `src/LibraryService.php`:

```php
<?php

namespace App;

use PDO;
class LibraryService{
private $db;
public function __construct(\PDO $db)
{
$this->db=$db;
}
public function CheckOut($userId,$bookId):bool
{
$sql = 'SELECT * FROM books WHERE id = '.$bookId;
$book=$this->db->query($sql)->fetch();

if($book===false){
throw new \Exception("Book not found");
}
if($book['stock']<=0){
return false;
}
$this->db->exec('UPDATE books SET stock = stock - 1 WHERE id = '.$bookId);
$stmt = $this->db->prepare('INSERT INTO loans (user_id,book_id,borrowed_at) VALUES (:uid,:bid, NOW())');
$stmt->execute(['uid'=>$userId,'bid'=>$bookId]);
return true;
}

public function returnBook(int $loanId):void{
    $loan = $this->db->query('SELECT * FROM loans WHERE id = '.$loanId)->fetch();
    if(!$loan){
        throw new \Exception('Loan not found');
    }
    $this->db->exec('UPDATE books SET stock = stock + 1 WHERE id = '.$loan['book_id']);
    $this->db->exec('UPDATE loans SET returned_at = NOW() WHERE id = '.$loanId);
}

public function getOverdueBooks():array{
    $result = $this->db->query(
        'SELECT l.*, u.name as user_name, b.title as book_title FROM loans l JOIN users u ON l.user_id = u.id JOIN books b ON l.book_id = b.id WHERE l.returned_at IS NULL AND l.borrowed_at < DATE_SUB(NOW(), INTERVAL 14 DAY)'
    );
    $overdue = [];
    foreach($result as $row){
        $overdue[]=$row;
    }
    return $overdue;
}
}
```

### What to Do

1. **Run PHPStan** at level 5 against this file. Identify each error and fix it. Common issues you should find:
   - Missing type declarations on properties
   - SQL injection vulnerabilities (string concatenation in queries)
   - Missing return type on `getOverdueBooks`
   - Calling `->fetch()` on a `PDOStatement|false` without checking the result
   - Inconsistent parameter types (`$userId` is untyped but `$loanId` is typed)

2. **Run PHP_CodeSniffer** and fix all PSR-12 violations. Use `composer cs-fix` to handle fixable ones automatically, then manually fix indentation, brace placement, and spacing.

3. **Run PHPMD** and address the metric warnings. The method `CheckOut` likely triggers cyclomatic complexity warnings: refactor it into smaller private methods (e.g., `fetchBook`, `decrementStock`, `createLoanRecord`).

4. **Verify** that `composer qa` produces zero errors.

### Expected Outcome After Clean-Up

The cleaned file should:

- Declare types on all properties, parameters, and return types
- Use prepared statements with parameterized queries throughout: no string concatenation in SQL
- Follow PSR-12 conventions for spacing, braces, and indentation
- Have methods with cyclomatic complexity under 5, each responsible for a single operation
- Contain no unused variables or unreachable code

Once your solution passes `composer qa`, compare it with a classmate's. Did you both split the methods the same way? Did you choose the same names? Code quality tools enforce consistency, but they leave room for design judgment: that is where engineering skill develops.

</section>

<section lang="id">

## Latihan Praktik

### Kode Awal

Berikut adalah kelas PHP dengan beberapa masalah kualitas: pelanggaran gaya, bug nyata yang akan ditangkap oleh *static analysis*, dan kompleksitas struktural yang akan ditandai oleh metrik. Tugas Anda adalah membersihkannya hingga `composer qa` lulus dengan bersih.

Salin ini ke `src/LibraryService.php`:

```php
<?php

namespace App;

use PDO;
class LibraryService{
private $db;
public function __construct(\PDO $db)
{
$this->db=$db;
}
public function CheckOut($userId,$bookId):bool
{
$sql = 'SELECT * FROM books WHERE id = '.$bookId;
$book=$this->db->query($sql)->fetch();

if($book===false){
throw new \Exception("Book not found");
}
if($book['stock']<=0){
return false;
}
$this->db->exec('UPDATE books SET stock = stock - 1 WHERE id = '.$bookId);
$stmt = $this->db->prepare('INSERT INTO loans (user_id,book_id,borrowed_at) VALUES (:uid,:bid, NOW())');
$stmt->execute(['uid'=>$userId,'bid'=>$bookId]);
return true;
}

public function returnBook(int $loanId):void{
    $loan = $this->db->query('SELECT * FROM loans WHERE id = '.$loanId)->fetch();
    if(!$loan){
        throw new \Exception('Loan not found');
    }
    $this->db->exec('UPDATE books SET stock = stock + 1 WHERE id = '.$loan['book_id']);
    $this->db->exec('UPDATE loans SET returned_at = NOW() WHERE id = '.$loanId);
}

public function getOverdueBooks():array{
    $result = $this->db->query(
        'SELECT l.*, u.name as user_name, b.title as book_title FROM loans l JOIN users u ON l.user_id = u.id JOIN books b ON l.book_id = b.id WHERE l.returned_at IS NULL AND l.borrowed_at < DATE_SUB(NOW(), INTERVAL 14 DAY)'
    );
    $overdue = [];
    foreach($result as $row){
        $overdue[]=$row;
    }
    return $overdue;
}
}
```

### Apa yang Harus Dilakukan

1. **Jalankan PHPStan** pada level 5 terhadap file ini. Identifikasi setiap error dan perbaiki. Masalah umum yang harus Anda temukan:
   - Deklarasi tipe yang hilang pada properti
   - Kerentanan SQL injection (penggabungan string dalam query)
   - Tipe pengembalian yang hilang pada `getOverdueBooks`
   - Memanggil `->fetch()` pada `PDOStatement|false` tanpa memeriksa hasilnya
   - Tipe parameter yang tidak konsisten (`$userId` tidak bertipe tetapi `$loanId` bertipe)

2. **Jalankan PHP_CodeSniffer** dan perbaiki semua pelanggaran PSR-12. Gunakan `composer cs-fix` untuk menangani yang dapat diperbaiki secara otomatis, lalu perbaiki indentasi, penempatan kurung kurawal, dan spasi secara manual.

3. **Jalankan PHPMD** dan tangani peringatan metrik. Metode `CheckOut` kemungkinan memicu peringatan *cyclomatic complexity*. Refactor metode ini menjadi metode privat yang lebih kecil (misalnya, `fetchBook`, `decrementStock`, `createLoanRecord`).

4. **Verifikasi** bahwa `composer qa` menghasilkan nol error.

### Hasil yang Diharapkan Setelah Pembersihan

File yang dibersihkan seharusnya:

- Mendeklarasikan tipe pada semua properti, parameter, dan tipe pengembalian
- Menggunakan *prepared statement* dengan *parameterized query* di seluruh kode: tidak ada penggabungan string dalam SQL
- Mengikuti konvensi PSR-12 untuk spasi, kurung kurawal, dan indentasi
- Memiliki metode dengan *cyclomatic complexity* di bawah 5, masing-masing bertanggung jawab atas satu operasi
- Tidak mengandung variabel yang tidak digunakan atau kode yang tidak tercapai

Setelah solusi Anda lulus `composer qa`, bandingkan dengan teman sekelas. Apakah Anda berdua membagi metode dengan cara yang sama? Apakah Anda memilih nama yang sama? Alat kualitas kode menegakkan konsistensi, tetapi menyisakan ruang untuk penilaian desain: di situlah keterampilan rekayasa berkembang.

</section>

---

<section lang="en">

## Summary

Code quality analysis moves quality assurance left in the development lifecycle, from manual review at the end of a sprint to automated enforcement at the moment code is written. Here are the key takeaways:

1. **Three complementary lenses.** Static analysis catches type errors and data-flow bugs before they execute. Style linting eliminates cognitive friction by enforcing a consistent syntax. Code metrics quantify structural complexity and surface maintenance risks before they become production incidents.

2. **PHPStan level progression is a practical adoption strategy.** Start at level 0 and raise the bar one level per sprint. Each increment catches a new class of bugs without overwhelming the team with noise. Target level 5 for active projects: it catches the bugs that matter without the pedantry of levels 6–9.

3. **PSR-12 is non-negotiable.** It is the community baseline for modern PHP. Configure phpcs once, auto-fix with phpcbf, and never think about spacing or brace placement again. Focus your code review energy on logic, not formatting.

4. **PHPMD thresholds should match project maturity.** Start strict (complexity ≤ 5, method length ≤ 40) on greenfield projects and relax as the codebase stabilizes. Never raise a threshold to silence a warning on a single file; baseline or exclude that file instead.

5. **Quality gates belong in CI/CD.** Wire PHPStan, PHP_CodeSniffer, and PHPMD into a GitHub Actions workflow that runs on every pull request. The machine enforces the standard. The humans review the design.

6. **Metrics feed bug prediction.** The same features that PHPMD measures (complexity, length, coupling) are used by statistical bug-prediction models. Running code quality tools is the first step toward building a data-driven risk assessment of your codebase.

</section>

<section lang="id">

## Ringkasan

Analisis kualitas kode menggeser jaminan kualitas ke kiri dalam siklus hidup pengembangan: dari *review* manual di akhir sprint ke penegakan otomatis pada saat kode ditulis. Berikut adalah poin-poin utamanya:

1. **Tiga lensa yang saling melengkapi.** *Static analysis* menangkap error tipe dan bug aliran data sebelum dieksekusi. *Style linting* menghilangkan friksi kognitif dengan menegakkan sintaks yang konsisten. Metrik kode mengkuantifikasi kompleksitas struktural dan mengungkap risiko pemeliharaan sebelum menjadi insiden produksi.

2. **Progresi level PHPStan adalah strategi adopsi praktis.** Mulai dari level 0 dan naikkan level satu per sprint. Setiap kenaikan menangkap kelas bug baru tanpa membanjiri tim dengan *noise*. Targetkan level 5 untuk proyek aktif: ia menangkap bug yang penting tanpa ketelitian level 6–9.

3. **PSR-12 tidak bisa ditawar.** Ini adalah *baseline* komunitas untuk PHP modern. Konfigurasikan phpcs sekali, *auto-fix* dengan phpcbf, dan jangan pernah memikirkan spasi atau penempatan kurung kurawal lagi. Fokuskan energi *code review* pada logika, bukan format.

4. **Ambang batas PHPMD harus sesuai dengan kematangan proyek.** Mulai ketat (kompleksitas ≤ 5, panjang metode ≤ 40) pada proyek *greenfield* dan longgarkan seiring stabilnya *codebase*. Jangan pernah menaikkan ambang batas hanya untuk membungkam peringatan pada satu file, lakukan *baseline* atau kecualikan file itu saja.

5. **Gerbang kualitas harus ada di CI/CD.** Hubungkan PHPStan, PHP_CodeSniffer, dan PHPMD ke dalam *workflow* GitHub Actions yang berjalan pada setiap *pull request*. Mesin menegakkan standar. Manusia meninjau desain.

6. **Metrik memberi makan prediksi bug.** Fitur yang sama yang diukur PHPMD, yaitu kompleksitas, panjang, dan *coupling*, digunakan oleh model prediksi bug statistik. Menjalankan alat kualitas kode adalah langkah pertama menuju penilaian risiko *codebase* berbasis data.

</section>

---

<section lang="en">

## Related Tutorials

- [Bug Prediction with PHP: From Metrics to Models](/blog/bug-prediction-php): how the metrics you measured in this tutorial become features in a Naive Bayes classifier
- [Test-Driven Development with PHP](/blog/test-driven-development): writing tests first reduces the complexity that code quality tools later flag
- [Clean Code Principles in PHP](/blog/clean-code-principles): the human-readable foundation that automated tools help enforce
- [AI-Assisted Unit Test Generation](/blog/ai-assisted-unit-test-generation): combining AI with static analysis to generate coverage for the problems PHPStan finds
- [Microservices Architecture Fundamentals](/blog/microservices-architecture-fundamentals): quality gates become more important as you split into independent services

</section>

<section lang="id">

## Tutorial Terkait

- [Prediksi Bug dengan PHP: Dari Metrik ke Model](/blog/bug-prediction-php): bagaimana metrik yang Anda ukur di tutorial ini menjadi fitur dalam *classifier* Naive Bayes
- [Test-Driven Development dengan PHP](/blog/test-driven-development): menulis tes terlebih dahulu mengurangi kompleksitas yang kemudian ditandai oleh alat kualitas kode
- [Prinsip Clean Code dalam PHP](/blog/clean-code-principles): fondasi yang dapat dibaca manusia yang dibantu ditegakkan oleh alat otomatis
- [Pembuatan Unit Test Berbantuan AI](/blog/ai-assisted-unit-test-generation): menggabungkan AI dengan *static analysis* untuk menghasilkan cakupan untuk masalah yang ditemukan PHPStan
- [Fundamental Arsitektur Microservices](/blog/microservices-architecture-fundamentals): gerbang kualitas menjadi lebih penting saat Anda membagi menjadi layanan independen

</section>
