---
title: "Clean Code Principles with PHP"
titleId: "Prinsip Clean Code dengan PHP"
date: 2026-06-28
category: tutorial
author: SE Lab
lang: en
featured: false
excerpt: "A beginner-friendly guide to writing readable, maintainable PHP code. Learn meaningful naming, small functions, single responsibility, self-documenting code, and how to avoid magic numbers — with concrete before-and-after examples."
excerptId: "Panduan ramah pemula untuk menulis kode PHP yang mudah dibaca dan dipelihara. Pelajari penamaan yang bermakna, fungsi kecil, tanggung jawab tunggal, kode yang mendokumentasikan diri sendiri, dan cara menghindari magic number — dengan contoh before-and-after yang konkret."
---

<section lang="en">

## What Is Clean Code and Why Should You Care?

**Clean Code** is code that is easy to read, understand, and modify. It is not about writing clever one-liners or impressing your peers — it is about writing code that a tired developer (including your future self) can pick up and work with six months from now without wanting to quit.

Think about the time you spend on a typical coding task. Studies and industry surveys consistently show that developers spend **far more time reading code than writing it** — often 70% or more. Every unclear variable name, every hundred-line function, every magic number you have to puzzle over steals minutes from your day. Those minutes compound into hours and weeks.

**Technical debt** is the term for shortcuts you take today that cost extra time tomorrow. Clean Code practices reduce technical debt from the start.

Here is what Clean Code gives you:

| Benefit | What It Means in Practice |
|---|---|
| **Readability** | Anyone on your team can understand the code without a decoder ring. |
| **Maintainability** | Adding features or fixing bugs does not break unrelated parts. |
| **Testability** | Clean code is easy to unit-test. Messy code is not. |
| **Onboarding speed** | New team members become productive faster. |
| **Fewer bugs** | Clear logic is harder to get wrong. |

In this tutorial, we will cover five foundational Clean Code principles with PHP examples. Each principle includes a **Before** (messy) and **After** (clean) snippet so you can see the difference immediately.

</section>

<section lang="id">

## Apa Itu Clean Code dan Mengapa Anda Harus Peduli?

**Clean Code** adalah kode yang mudah dibaca, dipahami, dan dimodifikasi. Ini bukan tentang menulis one-liner yang cerdik atau membuat rekan Anda terkesan — ini tentang menulis kode yang dapat diambil dan dikerjakan oleh pengembang yang lelah (termasuk diri Anda di masa depan) enam bulan dari sekarang tanpa ingin menyerah.

Pikirkan tentang waktu yang Anda habiskan untuk tugas coding pada umumnya. Studi dan survei industri secara konsisten menunjukkan bahwa pengembang menghabiskan **jauh lebih banyak waktu membaca kode daripada menulisnya** — seringkali 70% atau lebih. Setiap nama variabel yang tidak jelas, setiap fungsi seratus baris, setiap magic number yang harus Anda tebak artinya mencuri menit dari hari Anda. Menit-menit itu bertambah menjadi jam dan minggu.

**Utang teknis (technical debt)** adalah istilah untuk jalan pintas yang Anda ambil hari ini yang memakan waktu ekstra besok. Praktik Clean Code mengurangi utang teknis sejak awal.

Berikut adalah apa yang diberikan Clean Code kepada Anda:

| Manfaat | Artinya dalam Praktik |
|---|---|
| **Keterbacaan** | Siapa pun di tim Anda dapat memahami kode tanpa penerjemah. |
| **Kemudahan pemeliharaan** | Menambahkan fitur atau memperbaiki bug tidak merusak bagian yang tidak terkait. |
| **Kemudahan pengujian** | Kode bersih mudah diuji unit. Kode berantakan tidak. |
| **Kecepatan onboarding** | Anggota tim baru menjadi produktif lebih cepat. |
| **Lebih sedikit bug** | Logika yang jelas lebih sulit untuk salah. |

Dalam tutorial ini, kita akan membahas lima prinsip dasar Clean Code dengan contoh PHP. Setiap prinsip menyertakan cuplikan **Before** (berantakan) dan **After** (bersih) sehingga Anda dapat melihat perbedaannya secara langsung.

</section>

<figure class="my-10 text-center" role="figure">
<pre class="inline-block text-left text-sm bg-neutral-900 text-green-400 p-6 rounded-lg">
┌──────────────────────────────────────────────────────────────┐
│                    CLEAN CODE PRINCIPLES                      │
│                                                              │
│   1. Meaningful Names                                        │
│   2. Small Functions That Do One Thing                       │
│   3. Comments vs. Self-Documenting Code                      │
│   4. Avoid Magic Numbers and Strings                         │
│   5. Error Handling with Early Returns                       │
│                                                              │
│   Your code is read far more often than it is written.       │
└──────────────────────────────────────────────────────────────┘
</pre>
<figcaption class="mt-3 text-sm text-neutral-500">
  <span lang="en">Figure: The five Clean Code principles covered in this tutorial</span>
  <span lang="id">Gambar: Lima prinsip Clean Code yang dibahas dalam tutorial ini</span>
</figcaption>
</figure>

---

<section lang="en">

## Principle 1: Meaningful Names

The most fundamental Clean Code rule: **names should reveal intent**. A variable named `$d` or `$tmp` forces the reader to search the surrounding code to understand what it holds. A variable named `$elapsedSeconds` or `$studentEmail` answers the question immediately.

### Rules for Good Names

- **Use intention-revealing names.** The name should say why something exists and how it is used.
- **Avoid abbreviations.** `$addr` might mean address, adder, or addition. Spell it out: `$billingAddress`.
- **Avoid disinformation.** Do not call a list of accounts `$accountSet` if it is an array. Do not use `$i`, `$j`, `$k` outside of trivial loops.
- **Use pronounceable names.** If you cannot say it out loud in a code review, it is not a good name.
- **Classes and types get nouns.** `OrderRepository`, `EmailService`, `Student`.
- **Methods and functions get verbs.** `calculateTotal()`, `sendNotification()`, `validateEmail()`.

### Before: Poor Names

```php
<?php

class Stu
{
    public function calc($d)
    {
        $r = [];
        foreach ($d as $i) {
            if ($i->s >= 75) {
                $r[] = $i;
            }
        }
        return $r;
    }

    public function fmt($n, $a)
    {
        return $n . ' (' . $a . ')';
    }
}
```

What does `Stu` mean? Student? Studio? Stub? What does `calc` do? What is `$d`? `$r`? `$i->s`? `fmt`? `$a`? The reader must reverse-engineer the entire class just to understand what it is supposed to do.

### After: Intention-Revealing Names

```php
<?php

class StudentGradeFilter
{
    public function findPassingStudents(array $students): array
    {
        $passingStudents = [];
        foreach ($students as $student) {
            if ($student->score >= 75) {
                $passingStudents[] = $student;
            }
        }
        return $passingStudents;
    }

    public function formatStudentDisplay(string $name, int $score): string
    {
        return $name . ' (' . $score . ')';
    }
}
```

Now the names tell a story. You can read the code aloud and understand the intent without any mental translation.

</section>

<section lang="id">

## Prinsip 1: Penamaan yang Bermakna

Aturan Clean Code yang paling mendasar: **nama harus mengungkapkan maksud**. Variabel bernama `$d` atau `$tmp` memaksa pembaca mencari kode di sekitarnya untuk memahami apa isinya. Variabel bernama `$elapsedSeconds` atau `$studentEmail` menjawab pertanyaan dengan segera.

### Aturan untuk Nama yang Baik

- **Gunakan nama yang mengungkapkan maksud.** Nama harus mengatakan mengapa sesuatu ada dan bagaimana ia digunakan.
- **Hindari singkatan.** `$addr` bisa berarti address, adder, atau addition. Tulis lengkap: `$billingAddress`.
- **Hindari disinformasi.** Jangan menyebut daftar akun sebagai `$accountSet` jika ia adalah array. Jangan gunakan `$i`, `$j`, `$k` di luar loop trivial.
- **Gunakan nama yang dapat diucapkan.** Jika Anda tidak bisa mengucapkannya dalam code review, itu bukan nama yang baik.
- **Kelas dan tipe mendapat kata benda.** `OrderRepository`, `EmailService`, `Student`.
- **Metode dan fungsi mendapat kata kerja.** `calculateTotal()`, `sendNotification()`, `validateEmail()`.

### Before: Nama yang Buruk

```php
<?php

class Stu
{
    public function calc($d)
    {
        $r = [];
        foreach ($d as $i) {
            if ($i->s >= 75) {
                $r[] = $i;
            }
        }
        return $r;
    }

    public function fmt($n, $a)
    {
        return $n . ' (' . $a . ')';
    }
}
```

Apa artinya `Stu`? Student? Studio? Stub? Apa yang dilakukan `calc`? Apa itu `$d`? `$r`? `$i->s`? `fmt`? `$a`? Pembaca harus mereverse-engineer seluruh kelas hanya untuk memahami apa yang seharusnya dilakukannya.

### After: Nama yang Mengungkapkan Maksud

```php
<?php

class StudentGradeFilter
{
    public function findPassingStudents(array $students): array
    {
        $passingStudents = [];
        foreach ($students as $student) {
            if ($student->score >= 75) {
                $passingStudents[] = $student;
            }
        }
        return $passingStudents;
    }

    public function formatStudentDisplay(string $name, int $score): string
    {
        return $name . ' (' . $score . ')';
    }
}
```

Sekarang nama-nama tersebut menceritakan sebuah kisah. Anda dapat membaca kode dengan lantang dan memahami maksudnya tanpa terjemahan mental apa pun.

</section>

---

<section lang="en">

## Principle 2: Small Functions That Do One Thing

A function should do **one thing, and do it well**. If a function is named `processOrder`, it should process the order — not validate payment, send emails, update inventory, and generate a PDF invoice all in the same 200-line body.

### Why Small Functions Matter

| Problem | Consequence |
|---|---|
| **Long functions** | Hard to understand, hard to test, hard to reuse. |
| **Multiple responsibilities** | A change to one behaviour risks breaking another. |
| **Deep nesting** | `if` inside `for` inside `if` inside `while` — cognitive overload. |
| **Mixed abstraction levels** | Detail code next to high-level code confuses the reader. |

### Rules for Good Functions

- **Keep them short.** A function should rarely exceed 20 lines. Ten lines is even better.
- **Do one thing.** If the function name contains "and" or "or", it probably does more than one thing.
- **One level of abstraction per function.** Do not mix SQL queries with business logic with string formatting.
- **Prefer fewer arguments.** Zero, one, or two arguments are ideal. Three is a warning sign. Four or more needs a refactor.

### Before: A Function That Does Too Much

```php
<?php

function processOrder($orderData)
{
    $total = 0;
    foreach ($orderData['items'] as $item) {
        $total += $item['price'] * $item['qty'];
    }

    if ($orderData['coupon'] === 'WELCOME10') {
        $total = $total * 0.9;
    }

    if ($total > 500000) {
        $total -= 25000;
    }

    $db = new PDO('mysql:host=localhost;dbname=store', 'root', '');
    $stmt = $db->prepare('INSERT INTO orders (customer_id, total, status) VALUES (?, ?, ?)');
    $stmt->execute([$orderData['customer_id'], $total, 'pending']);

    $to = $orderData['email'];
    $subject = 'Order Confirmed';
    $message = 'Thank you for your order! Total: Rp ' . number_format($total);
    mail($to, $subject, $message);

    return ['status' => 'ok', 'order_id' => $db->lastInsertId()];
}
```

This function calculates totals, applies discounts and coupons, saves to the database, and sends an email — all in one place. If any single behaviour changes, you must touch this function. Testing it requires a database, a mail server, and coupon logic all at once.

### After: Decomposed Into Small, Single-Responsibility Functions

```php
<?php

function calculateOrderTotal(array $items): float
{
    return array_reduce($items, function ($sum, $item) {
        return $sum + ($item['price'] * $item['qty']);
    }, 0);
}

function applyDiscount(float $total, ?string $couponCode): float
{
    if ($couponCode === 'WELCOME10') {
        $total *= 0.9;
    }
    if ($total > 500000) {
        $total -= 25000;
    }
    return max($total, 0);
}

function saveOrder(PDO $db, int $customerId, float $total): int
{
    $stmt = $db->prepare('INSERT INTO orders (customer_id, total, status) VALUES (?, ?, ?)');
    $stmt->execute([$customerId, $total, 'pending']);
    return (int) $db->lastInsertId();
}

function sendOrderConfirmation(string $email, float $total): void
{
    $message = 'Thank you for your order! Total: Rp ' . number_format($total);
    mail($email, 'Order Confirmed', $message);
}

function processOrder(PDO $db, array $orderData): array
{
    $total = calculateOrderTotal($orderData['items']);
    $total = applyDiscount($total, $orderData['coupon'] ?? null);
    $orderId = saveOrder($db, $orderData['customer_id'], $total);
    sendOrderConfirmation($orderData['email'], $total);

    return ['status' => 'ok', 'order_id' => $orderId];
}
```

Now each function does exactly one thing. You can read `processOrder` and see the workflow at a glance: calculate, discount, save, notify. Each helper function is independently testable, reusable, and easy to understand.

</section>

<section lang="id">

## Prinsip 2: Fungsi Kecil yang Melakukan Satu Hal

Sebuah fungsi harus melakukan **satu hal, dan melakukannya dengan baik**. Jika sebuah fungsi bernama `processOrder`, ia harus memproses pesanan — bukan memvalidasi pembayaran, mengirim email, memperbarui inventaris, dan menghasilkan faktur PDF semuanya dalam satu tubuh 200 baris.

### Mengapa Fungsi Kecil Penting

| Masalah | Konsekuensi |
|---|---|
| **Fungsi panjang** | Sulit dipahami, sulit diuji, sulit digunakan kembali. |
| **Banyak tanggung jawab** | Perubahan pada satu perilaku berisiko merusak yang lain. |
| **Nesting dalam** | `if` di dalam `for` di dalam `if` di dalam `while` — beban kognitif berlebihan. |
| **Tingkat abstraksi campuran** | Kode detail bersebelahan dengan kode tingkat tinggi membingungkan pembaca. |

### Aturan untuk Fungsi yang Baik

- **Jaga agar tetap pendek.** Sebuah fungsi jarang melebihi 20 baris. Sepuluh baris bahkan lebih baik.
- **Lakukan satu hal.** Jika nama fungsi mengandung "dan" atau "atau", ia mungkin melakukan lebih dari satu hal.
- **Satu tingkat abstraksi per fungsi.** Jangan mencampur kueri SQL dengan logika bisnis dengan format string.
- **Pilih argumen yang lebih sedikit.** Nol, satu, atau dua argumen ideal. Tiga adalah tanda peringatan. Empat atau lebih perlu refactor.

### Before: Fungsi yang Melakukan Terlalu Banyak

```php
<?php

function processOrder($orderData)
{
    $total = 0;
    foreach ($orderData['items'] as $item) {
        $total += $item['price'] * $item['qty'];
    }

    if ($orderData['coupon'] === 'WELCOME10') {
        $total = $total * 0.9;
    }

    if ($total > 500000) {
        $total -= 25000;
    }

    $db = new PDO('mysql:host=localhost;dbname=store', 'root', '');
    $stmt = $db->prepare('INSERT INTO orders (customer_id, total, status) VALUES (?, ?, ?)');
    $stmt->execute([$orderData['customer_id'], $total, 'pending']);

    $to = $orderData['email'];
    $subject = 'Order Confirmed';
    $message = 'Thank you for your order! Total: Rp ' . number_format($total);
    mail($to, $subject, $message);

    return ['status' => 'ok', 'order_id' => $db->lastInsertId()];
}
```

Fungsi ini menghitung total, menerapkan diskon dan kupon, menyimpan ke database, dan mengirim email — semuanya di satu tempat. Jika satu perilaku berubah, Anda harus menyentuh fungsi ini. Mengujinya memerlukan database, server email, dan logika kupon sekaligus.

### After: Didekomposisi Menjadi Fungsi Kecil Bertanggung Jawab Tunggal

```php
<?php

function calculateOrderTotal(array $items): float
{
    return array_reduce($items, function ($sum, $item) {
        return $sum + ($item['price'] * $item['qty']);
    }, 0);
}

function applyDiscount(float $total, ?string $couponCode): float
{
    if ($couponCode === 'WELCOME10') {
        $total *= 0.9;
    }
    if ($total > 500000) {
        $total -= 25000;
    }
    return max($total, 0);
}

function saveOrder(PDO $db, int $customerId, float $total): int
{
    $stmt = $db->prepare('INSERT INTO orders (customer_id, total, status) VALUES (?, ?, ?)');
    $stmt->execute([$customerId, $total, 'pending']);
    return (int) $db->lastInsertId();
}

function sendOrderConfirmation(string $email, float $total): void
{
    $message = 'Thank you for your order! Total: Rp ' . number_format($total);
    mail($email, 'Order Confirmed', $message);
}

function processOrder(PDO $db, array $orderData): array
{
    $total = calculateOrderTotal($orderData['items']);
    $total = applyDiscount($total, $orderData['coupon'] ?? null);
    $orderId = saveOrder($db, $orderData['customer_id'], $total);
    sendOrderConfirmation($orderData['email'], $total);

    return ['status' => 'ok', 'order_id' => $orderId];
}
```

Sekarang setiap fungsi melakukan tepat satu hal. Anda dapat membaca `processOrder` dan melihat alur kerja sekilas: hitung, diskon, simpan, notifikasi. Setiap fungsi pembantu dapat diuji secara independen, digunakan kembali, dan mudah dipahami.

</section>

---

<section lang="en">

## Principle 3: Single Responsibility Principle

The **Single Responsibility Principle (SRP)** states that a class should have only one reason to change. If a class handles user authentication, email formatting, and database logging, it has three reasons to change — and a change to any one of them risks breaking the others.

SRP is not just about classes. It applies to functions, modules, and even whole packages. The principle keeps your code decoupled: when one part changes, the rest stays intact.

### Before: A Class With Too Many Jobs

```php
<?php

class ReportGenerator
{
    public function generate(array $sales): string
    {
        $csv = "Date,Amount,Customer\n";
        foreach ($sales as $sale) {
            $csv .= "{$sale['date']},{$sale['amount']},{$sale['customer']}\n";
        }

        $file = '/tmp/report_' . date('Ymd') . '.csv';
        file_put_contents($file, $csv);

        $conn = new PDO('mysql:host=localhost;dbname=reports', 'root', '');
        $stmt = $conn->prepare('INSERT INTO report_logs (report_name, generated_at) VALUES (?, NOW())');
        $stmt->execute([$file]);

        $zip = new ZipArchive();
        $zipPath = str_replace('.csv', '.zip', $file);
        $zip->open($zipPath, ZipArchive::CREATE);
        $zip->addFile($file, basename($file));
        $zip->close();

        $monthName = date('F');
        $subject = "Sales Report — {$monthName}";
        $body = "Please find the attached sales report for {$monthName}.";
        mail('admin@company.com', $subject, $body);

        return $zipPath;
    }
}
```

This class formats CSV data, writes files, logs to a database, compresses files, and sends emails. If the email template changes, the report format changes, or you switch database engines, you must modify this class.

### After: One Responsibility Per Class

```php
<?php

class CsvReportWriter
{
    public function write(array $sales): string
    {
        $csv = "Date,Amount,Customer\n";
        foreach ($sales as $sale) {
            $csv .= "{$sale['date']},{$sale['amount']},{$sale['customer']}\n";
        }
        return $csv;
    }
}

class ReportFileStorage
{
    public function save(string $content, string $folder): string
    {
        $path = $folder . '/report_' . date('Ymd') . '.csv';
        file_put_contents($path, $content);
        return $path;
    }
}

class ReportLogger
{
    public function __construct(private PDO $db) {}

    public function log(string $reportName): void
    {
        $stmt = $this->db->prepare(
            'INSERT INTO report_logs (report_name, generated_at) VALUES (?, NOW())'
        );
        $stmt->execute([$reportName]);
    }
}

class FileCompressor
{
    public function compress(string $filePath): string
    {
        $zipPath = str_replace('.csv', '.zip', $filePath);
        $zip = new ZipArchive();
        $zip->open($zipPath, ZipArchive::CREATE);
        $zip->addFile($filePath, basename($filePath));
        $zip->close();
        return $zipPath;
    }
}

class ReportMailer
{
    public function send(string $recipient, string $month): void
    {
        $subject = "Sales Report — {$month}";
        $body = "Please find the attached sales report for {$month}.";
        mail($recipient, $subject, $body);
    }
}

class ReportGenerator
{
    public function __construct(
        private CsvReportWriter $writer,
        private ReportFileStorage $storage,
        private ReportLogger $logger,
        private FileCompressor $compressor,
        private ReportMailer $mailer,
    ) {}

    public function generate(array $sales): string
    {
        $csv = $this->writer->write($sales);
        $filePath = $this->storage->save($csv, '/tmp');
        $this->logger->log($filePath);
        $zipPath = $this->compressor->compress($filePath);

        $this->mailer->send('admin@company.com', date('F'));

        return $zipPath;
    }
}
```

Now each class has exactly one reason to change. You can swap the CSV format for JSON, change the email provider, or compress with a different tool — and only one class changes. The `ReportGenerator` coordinates the workflow without knowing implementation details.

</section>

<section lang="id">

## Prinsip 3: Single Responsibility Principle

**Single Responsibility Principle (SRP)** menyatakan bahwa sebuah kelas seharusnya hanya memiliki satu alasan untuk berubah. Jika sebuah kelas menangani otentikasi pengguna, format email, dan pencatatan database, ia memiliki tiga alasan untuk berubah — dan perubahan pada salah satunya berisiko merusak yang lain.

SRP bukan hanya tentang kelas. Ini berlaku untuk fungsi, modul, dan bahkan seluruh paket. Prinsip ini menjaga kode Anda tetap terdecouple: ketika satu bagian berubah, sisanya tetap utuh.

### Before: Kelas dengan Terlalu Banyak Pekerjaan

```php
<?php

class ReportGenerator
{
    public function generate(array $sales): string
    {
        $csv = "Date,Amount,Customer\n";
        foreach ($sales as $sale) {
            $csv .= "{$sale['date']},{$sale['amount']},{$sale['customer']}\n";
        }

        $file = '/tmp/report_' . date('Ymd') . '.csv';
        file_put_contents($file, $csv);

        $conn = new PDO('mysql:host=localhost;dbname=reports', 'root', '');
        $stmt = $conn->prepare('INSERT INTO report_logs (report_name, generated_at) VALUES (?, NOW())');
        $stmt->execute([$file]);

        $zip = new ZipArchive();
        $zipPath = str_replace('.csv', '.zip', $file);
        $zip->open($zipPath, ZipArchive::CREATE);
        $zip->addFile($file, basename($file));
        $zip->close();

        $monthName = date('F');
        $subject = "Sales Report — {$monthName}";
        $body = "Please find the attached sales report for {$monthName}.";
        mail('admin@company.com', $subject, $body);

        return $zipPath;
    }
}
```

Kelas ini memformat data CSV, menulis file, mencatat ke database, mengompres file, dan mengirim email. Jika template email berubah, format laporan berubah, atau Anda mengganti mesin database, Anda harus memodifikasi kelas ini.

### After: Satu Tanggung Jawab Per Kelas

```php
<?php

class CsvReportWriter
{
    public function write(array $sales): string
    {
        $csv = "Date,Amount,Customer\n";
        foreach ($sales as $sale) {
            $csv .= "{$sale['date']},{$sale['amount']},{$sale['customer']}\n";
        }
        return $csv;
    }
}

class ReportFileStorage
{
    public function save(string $content, string $folder): string
    {
        $path = $folder . '/report_' . date('Ymd') . '.csv';
        file_put_contents($path, $content);
        return $path;
    }
}

class ReportLogger
{
    public function __construct(private PDO $db) {}

    public function log(string $reportName): void
    {
        $stmt = $this->db->prepare(
            'INSERT INTO report_logs (report_name, generated_at) VALUES (?, NOW())'
        );
        $stmt->execute([$reportName]);
    }
}

class FileCompressor
{
    public function compress(string $filePath): string
    {
        $zipPath = str_replace('.csv', '.zip', $filePath);
        $zip = new ZipArchive();
        $zip->open($zipPath, ZipArchive::CREATE);
        $zip->addFile($filePath, basename($filePath));
        $zip->close();
        return $zipPath;
    }
}

class ReportMailer
{
    public function send(string $recipient, string $month): void
    {
        $subject = "Sales Report — {$month}";
        $body = "Please find the attached sales report for {$month}.";
        mail($recipient, $subject, $body);
    }
}

class ReportGenerator
{
    public function __construct(
        private CsvReportWriter $writer,
        private ReportFileStorage $storage,
        private ReportLogger $logger,
        private FileCompressor $compressor,
        private ReportMailer $mailer,
    ) {}

    public function generate(array $sales): string
    {
        $csv = $this->writer->write($sales);
        $filePath = $this->storage->save($csv, '/tmp');
        $this->logger->log($filePath);
        $zipPath = $this->compressor->compress($filePath);

        $this->mailer->send('admin@company.com', date('F'));

        return $zipPath;
    }
}
```

Sekarang setiap kelas memiliki tepat satu alasan untuk berubah. Anda dapat mengganti format CSV menjadi JSON, mengubah penyedia email, atau mengompres dengan alat yang berbeda — dan hanya satu kelas yang berubah. `ReportGenerator` mengoordinasikan alur kerja tanpa mengetahui detail implementasi.

</section>

---

<section lang="en">

## Principle 4: Comments vs. Self-Documenting Code

A common misconception is that more comments equal better code. The truth is subtler: **the best comment is the one you did not need to write** because the code already says it.

Comments have a maintenance cost. When code changes, comments often do not — leaving behind lies that mislead the next developer. A misleading comment is worse than no comment at all.

### When Comments Are Useful

| Good Comment | Bad Comment |
|---|---|
| Explains *why* the code does something unusual | Restates *what* the code obviously does |
| Documents a workaround for a known library bug | Describes trivial implementation details |
| Provides context: a regex explanation, a formula reference | Is a placeholder for poorly named variables |
| Marks a TODO with a ticket number | Is outdated and contradicts the code |

### Before: Comments That Should Be Names

```php
<?php

function c($d)
{
    $t = 0;
    foreach ($d as $x) {
        $t = $t + $x;
    }
    $r = $t / count($d);
    return $r;
}

// check if admin
function ca($u)
{
    if ($u->r == 1) {
        return true;
    }
    return false;
}

// convert price from USD to IDR
// multiply by 15500
function p($usd)
{
    return $usd * 15500;
}
```

The comments explain what the code does — but only because the code is unreadable. Every one of those comments would be unnecessary with good names.

### After: Let the Code Speak

```php
<?php

function calculateAverage(array $numbers): float
{
    $sum = array_sum($numbers);
    return $sum / count($numbers);
}

function isUserAdmin(User $user): bool
{
    return $user->role === 'admin';
}

function convertUsdToIdr(float $amountInUsd): float
{
    const USD_TO_IDR_EXCHANGE_RATE = 15500;
    return $amountInUsd * USD_TO_IDR_EXCHANGE_RATE;
}
```

No comments needed. The code is its own documentation.

### When to Write a Comment

Sometimes a comment is the right tool. Use comments when the *why* is not obvious from the code:

```php
<?php

function calculateShippingCost(float $weight, string $destination): float
{
    // Courier API returns weight in grams but expects it as kilograms
    // in the request body. Converting here to avoid a breaking change
    // in the CourierService integration.
    $weightInKg = $weight / 1000;

    // Workaround for courier API bug #4217: the Sandbox endpoint
    // rejects destinations with spaces. Remove when v3.2 ships.
    $sanitizedDestination = str_replace(' ', '-', $destination);

    return $this->courierService->estimate($weightInKg, $sanitizedDestination);
}
```

Notice the comments explain why the unusual conversions exist — not what the code does.

</section>

<section lang="id">

## Prinsip 4: Komentar vs. Kode yang Mendokumentasikan Diri Sendiri

Kesalahpahaman umum adalah bahwa lebih banyak komentar sama dengan kode yang lebih baik. Kebenarannya lebih halus: **komentar terbaik adalah yang tidak perlu Anda tulis** karena kode sudah mengatakannya.

Komentar memiliki biaya pemeliharaan. Ketika kode berubah, komentar sering tidak — meninggalkan kebohongan yang menyesatkan pengembang berikutnya. Komentar yang menyesatkan lebih buruk daripada tidak ada komentar sama sekali.

### Kapan Komentar Berguna

| Komentar Baik | Komentar Buruk |
|---|---|
| Menjelaskan *mengapa* kode melakukan sesuatu yang tidak biasa | Mengulangi *apa* yang sudah jelas dilakukan kode |
| Mendokumentasikan workaround untuk bug library yang diketahui | Mendeskripsikan detail implementasi yang sepele |
| Memberikan konteks: penjelasan regex, referensi rumus | Menjadi placeholder untuk variabel yang dinamai buruk |
| Menandai TODO dengan nomor tiket | Sudah kadaluarsa dan bertentangan dengan kode |

### Before: Komentar yang Seharusnya Menjadi Nama

```php
<?php

function c($d)
{
    $t = 0;
    foreach ($d as $x) {
        $t = $t + $x;
    }
    $r = $t / count($d);
    return $r;
}

// check if admin
function ca($u)
{
    if ($u->r == 1) {
        return true;
    }
    return false;
}

// convert price from USD to IDR
// multiply by 15500
function p($usd)
{
    return $usd * 15500;
}
```

Komentar menjelaskan apa yang dilakukan kode — tetapi hanya karena kode tidak dapat dibaca. Setiap komentar itu tidak akan diperlukan dengan nama yang baik.

### After: Biarkan Kode Berbicara

```php
<?php

function calculateAverage(array $numbers): float
{
    $sum = array_sum($numbers);
    return $sum / count($numbers);
}

function isUserAdmin(User $user): bool
{
    return $user->role === 'admin';
}

function convertUsdToIdr(float $amountInUsd): float
{
    const USD_TO_IDR_EXCHANGE_RATE = 15500;
    return $amountInUsd * USD_TO_IDR_EXCHANGE_RATE;
}
```

Tidak perlu komentar. Kode adalah dokumentasinya sendiri.

### Kapan Menulis Komentar

Terkadang komentar adalah alat yang tepat. Gunakan komentar ketika *mengapa* tidak jelas dari kode:

```php
<?php

function calculateShippingCost(float $weight, string $destination): float
{
    // Courier API returns weight in grams but expects it as kilograms
    // in the request body. Converting here to avoid a breaking change
    // in the CourierService integration.
    $weightInKg = $weight / 1000;

    // Workaround for courier API bug #4217: the Sandbox endpoint
    // rejects destinations with spaces. Remove when v3.2 ships.
    $sanitizedDestination = str_replace(' ', '-', $destination);

    return $this->courierService->estimate($weightInKg, $sanitizedDestination);
}
```

Perhatikan komentar menjelaskan mengapa konversi yang tidak biasa itu ada — bukan apa yang dilakukan kode.

</section>

---

<section lang="en">

## Principle 5: Avoid Magic Numbers and Strings

A **magic number** is a literal value that appears in code without obvious meaning. `if ($status === 3)` — what is 3? Approved? Pending? Cancelled? Magic numbers force the reader to guess or search for the meaning.

Magic strings are the same problem: `$response['type'] === 'A'` is cryptic. Use descriptive constants instead.

### Before: Full of Magic Values

```php
<?php

function getDiscount(float $amount, int $type, int $loyaltyYears): float
{
    if ($type === 1) {
        return $amount * 0.05;
    }
    if ($type === 2) {
        return $amount * 0.10;
    }
    if ($loyaltyYears > 5) {
        return $amount * 0.03;
    }
    return 0;
}

function processWithdrawal(float $amount, int $status): string
{
    if ($status === 1) {
        return 'Processing';
    } elseif ($status === 2) {
        return 'Approved';
    } elseif ($status === 3) {
        return 'Rejected';
    }
    return 'Unknown';
}

function validateStudentScore(int $score): bool
{
    return $score >= 0 && $score <= 100;
}
```

What do `1`, `2`, `3`, `0.05`, `0.10`, `5`, `0.03`, `0`, `100` mean? The reader must infer meaning from context.

### After: Named Constants and Enums

```php
<?php

class CustomerType
{
    public const REGULAR = 1;
    public const PREMIUM = 2;
}

class WithdrawalStatus
{
    public const PROCESSING = 1;
    public const APPROVED = 2;
    public const REJECTED = 3;

    private const LABELS = [
        self::PROCESSING => 'Processing',
        self::APPROVED => 'Approved',
        self::REJECTED => 'Rejected',
    ];

    public static function getLabel(int $status): string
    {
        return self::LABELS[$status] ?? 'Unknown';
    }
}

class DiscountCalculator
{
    private const REGULAR_DISCOUNT_RATE = 0.05;
    private const PREMIUM_DISCOUNT_RATE = 0.10;
    private const LOYALTY_DISCOUNT_RATE = 0.03;
    private const LOYALTY_THRESHOLD_YEARS = 5;

    public function calculate(float $amount, int $customerType, int $loyaltyYears): float
    {
        if ($customerType === CustomerType::PREMIUM) {
            return $amount * self::PREMIUM_DISCOUNT_RATE;
        }
        if ($customerType === CustomerType::REGULAR) {
            return $amount * self::REGULAR_DISCOUNT_RATE;
        }
        if ($loyaltyYears > self::LOYALTY_THRESHOLD_YEARS) {
            return $amount * self::LOYALTY_DISCOUNT_RATE;
        }
        return 0;
    }
}

function validateStudentScore(int $score): bool
{
    const MIN_SCORE = 0;
    const MAX_SCORE = 100;
    return $score >= MIN_SCORE && $score <= MAX_SCORE;
}
```

Now every value has a name. You can change a discount rate in one place. The `WithdrawalStatus` class provides a single source of truth for status labels.

</section>

<section lang="id">

## Prinsip 5: Hindari Magic Number dan String

**Magic number** adalah nilai literal yang muncul dalam kode tanpa makna yang jelas. `if ($status === 3)` — apa itu 3? Approved? Pending? Cancelled? Magic number memaksa pembaca menebak atau mencari artinya.

Magic string adalah masalah yang sama: `$response['type'] === 'A'` bersifat kriptik. Gunakan konstanta deskriptif sebagai gantinya.

### Before: Penuh dengan Nilai Magic

```php
<?php

function getDiscount(float $amount, int $type, int $loyaltyYears): float
{
    if ($type === 1) {
        return $amount * 0.05;
    }
    if ($type === 2) {
        return $amount * 0.10;
    }
    if ($loyaltyYears > 5) {
        return $amount * 0.03;
    }
    return 0;
}

function processWithdrawal(float $amount, int $status): string
{
    if ($status === 1) {
        return 'Processing';
    } elseif ($status === 2) {
        return 'Approved';
    } elseif ($status === 3) {
        return 'Rejected';
    }
    return 'Unknown';
}

function validateStudentScore(int $score): bool
{
    return $score >= 0 && $score <= 100;
}
```

Apa arti `1`, `2`, `3`, `0.05`, `0.10`, `5`, `0.03`, `0`, `100`? Pembaca harus menyimpulkan makna dari konteks.

### After: Konstanta Bernama dan Enum

```php
<?php

class CustomerType
{
    public const REGULAR = 1;
    public const PREMIUM = 2;
}

class WithdrawalStatus
{
    public const PROCESSING = 1;
    public const APPROVED = 2;
    public const REJECTED = 3;

    private const LABELS = [
        self::PROCESSING => 'Processing',
        self::APPROVED => 'Approved',
        self::REJECTED => 'Rejected',
    ];

    public static function getLabel(int $status): string
    {
        return self::LABELS[$status] ?? 'Unknown';
    }
}

class DiscountCalculator
{
    private const REGULAR_DISCOUNT_RATE = 0.05;
    private const PREMIUM_DISCOUNT_RATE = 0.10;
    private const LOYALTY_DISCOUNT_RATE = 0.03;
    private const LOYALTY_THRESHOLD_YEARS = 5;

    public function calculate(float $amount, int $customerType, int $loyaltyYears): float
    {
        if ($customerType === CustomerType::PREMIUM) {
            return $amount * self::PREMIUM_DISCOUNT_RATE;
        }
        if ($customerType === CustomerType::REGULAR) {
            return $amount * self::REGULAR_DISCOUNT_RATE;
        }
        if ($loyaltyYears > self::LOYALTY_THRESHOLD_YEARS) {
            return $amount * self::LOYALTY_DISCOUNT_RATE;
        }
        return 0;
    }
}

function validateStudentScore(int $score): bool
{
    const MIN_SCORE = 0;
    const MAX_SCORE = 100;
    return $score >= MIN_SCORE && $score <= MAX_SCORE;
}
```

Sekarang setiap nilai memiliki nama. Anda dapat mengubah tingkat diskon di satu tempat. Kelas `WithdrawalStatus` menyediakan sumber kebenaran tunggal untuk label status.

</section>

---

<section lang="en">

## Error Handling and Formatting

Clean Code also means writing error handling that does not obscure the main logic, and formatting that makes the structure visible at a glance.

### Use Early Returns Instead of Deep Nesting

Deeply nested `if/else` blocks are hard to follow. An **early return** (or guard clause) handles the error or edge case immediately and lets the main logic flow without indentation.

**Before: Nested conditions**

```php
<?php

function transferFunds(array $from, array $to, float $amount): bool
{
    if (isset($from['balance'])) {
        if ($from['balance'] >= $amount) {
            if (isset($to['active']) && $to['active']) {
                if ($amount > 0) {
                    return true;
                }
            }
        }
    }
    return false;
}
```

**After: Guard clauses**

```php
<?php

function transferFunds(array $from, array $to, float $amount): bool
{
    if (!isset($from['balance'])) {
        return false;
    }
    if ($from['balance'] < $amount) {
        return false;
    }
    if ($amount <= 0) {
        return false;
    }
    if (empty($to['active'])) {
        return false;
    }
    return true;
}
```

The after version is longer in lines, but the logic is flat and readable. Each condition is a single clear rule.

### Throw Meaningful Exceptions

Do not let your code fail silently. Use exceptions with descriptive messages.

**Before: Silent failure**

```php
<?php

function findUserById(int $id): ?array
{
    $db = new PDO('mysql:host=localhost;dbname=app', 'root', '');
    $stmt = $db->prepare('SELECT * FROM users WHERE id = ?');
    $stmt->execute([$id]);
    $user = $stmt->fetch();
    if (!$user) {
        return null;
    }
    return $user;
}
```

If `findUserById` returns `null`, the calling code has no idea whether the user was not found or the database connection failed.

**After: Clear exceptions**

```php
<?php

class UserNotFoundException extends RuntimeException
{
    public function __construct(int $userId)
    {
        parent::__construct("User with ID {$userId} was not found.");
    }
}

function findUserById(PDO $db, int $id): array
{
    $stmt = $db->prepare('SELECT * FROM users WHERE id = ?');
    $stmt->execute([$id]);
    $user = $stmt->fetch();

    if (!$user) {
        throw new UserNotFoundException($id);
    }
    return $user;
}
```

Now the caller knows exactly what went wrong and can decide how to handle it.

### Consistent Formatting

Consistent formatting makes code scannable. Follow these rules:

- **Indent consistently.** Use 4 spaces (or your team's agreed standard). Never mix tabs and spaces.
- **One statement per line.** Do not chain multiple operations with `;` on the same line.
- **Blank lines separate logical blocks.** Group related lines and separate them from other groups with one blank line.
- **Opening braces on the same line or next line — pick one.** PSR-12 (the PHP standard) puts them on the same line for functions and the next line for classes.

```php
<?php

declare(strict_types=1);

namespace App\Service;

class InvoiceService
{
    private const TAX_RATE = 0.11;

    public function __construct(
        private InvoiceRepository $repository,
        private TaxCalculator $taxCalculator,
    ) {}

    public function createInvoice(array $items): Invoice
    {
        $subtotal = $this->calculateSubtotal($items);
        $tax = $this->taxCalculator->calculate($subtotal, self::TAX_RATE);
        $total = $subtotal + $tax;

        $invoice = new Invoice($items, $subtotal, $tax, $total);
        $this->repository->save($invoice);

        return $invoice;
    }

    private function calculateSubtotal(array $items): float
    {
        return array_reduce($items, fn ($sum, $item) => $sum + $item->price, 0.0);
    }
}
```

Notice the blank lines inside `createInvoice`: they separate variable setup, object creation, and the return statement — each a logical group.

</section>

<section lang="id">

## Penanganan Error dan Formatting

Clean Code juga berarti menulis penanganan error yang tidak mengaburkan logika utama, dan formatting yang membuat struktur terlihat sekilas.

### Gunakan Early Return Alih-Alih Nesting Dalam

Blok `if/else` yang bertingkat dalam sulit diikuti. **Early return** (atau guard clause) menangani error atau kasus tepi segera dan membiarkan logika utama mengalir tanpa indentasi.

**Before: Kondisi bertingkat**

```php
<?php

function transferFunds(array $from, array $to, float $amount): bool
{
    if (isset($from['balance'])) {
        if ($from['balance'] >= $amount) {
            if (isset($to['active']) && $to['active']) {
                if ($amount > 0) {
                    return true;
                }
            }
        }
    }
    return false;
}
```

**After: Guard clause**

```php
<?php

function transferFunds(array $from, array $to, float $amount): bool
{
    if (!isset($from['balance'])) {
        return false;
    }
    if ($from['balance'] < $amount) {
        return false;
    }
    if ($amount <= 0) {
        return false;
    }
    if (empty($to['active'])) {
        return false;
    }
    return true;
}
```

Versi after lebih panjang dalam baris, tetapi logikanya datar dan mudah dibaca. Setiap kondisi adalah satu aturan yang jelas.

### Lempar Exception yang Bermakna

Jangan biarkan kode Anda gagal secara diam-diam. Gunakan exception dengan pesan deskriptif.

**Before: Kegagalan diam**

```php
<?php

function findUserById(int $id): ?array
{
    $db = new PDO('mysql:host=localhost;dbname=app', 'root', '');
    $stmt = $db->prepare('SELECT * FROM users WHERE id = ?');
    $stmt->execute([$id]);
    $user = $stmt->fetch();
    if (!$user) {
        return null;
    }
    return $user;
}
```

Jika `findUserById` mengembalikan `null`, kode pemanggil tidak tahu apakah pengguna tidak ditemukan atau koneksi database gagal.

**After: Exception yang jelas**

```php
<?php

class UserNotFoundException extends RuntimeException
{
    public function __construct(int $userId)
    {
        parent::__construct("User dengan ID {$userId} tidak ditemukan.");
    }
}

function findUserById(PDO $db, int $id): array
{
    $stmt = $db->prepare('SELECT * FROM users WHERE id = ?');
    $stmt->execute([$id]);
    $user = $stmt->fetch();

    if (!$user) {
        throw new UserNotFoundException($id);
    }
    return $user;
}
```

Sekarang pemanggil tahu persis apa yang salah dan dapat memutuskan bagaimana menanganinya.

### Formatting yang Konsisten

Formatting yang konsisten membuat kode mudah dipindai. Ikuti aturan ini:

- **Indentasi secara konsisten.** Gunakan 4 spasi (atau standar yang disepakati tim Anda). Jangan pernah mencampur tab dan spasi.
- **Satu pernyataan per baris.** Jangan merangkai beberapa operasi dengan `;` di baris yang sama.
- **Baris kosong memisahkan blok logis.** Kelompokkan baris terkait dan pisahkan dari kelompok lain dengan satu baris kosong.
- **Kurung kurawal pembuka di baris yang sama atau baris berikutnya — pilih satu.** PSR-12 (standar PHP) menempatkannya di baris yang sama untuk fungsi dan baris berikutnya untuk kelas.

```php
<?php

declare(strict_types=1);

namespace App\Service;

class InvoiceService
{
    private const TAX_RATE = 0.11;

    public function __construct(
        private InvoiceRepository $repository,
        private TaxCalculator $taxCalculator,
    ) {}

    public function createInvoice(array $items): Invoice
    {
        $subtotal = $this->calculateSubtotal($items);
        $tax = $this->taxCalculator->calculate($subtotal, self::TAX_RATE);
        $total = $subtotal + $tax;

        $invoice = new Invoice($items, $subtotal, $tax, $total);
        $this->repository->save($invoice);

        return $invoice;
    }

    private function calculateSubtotal(array $items): float
    {
        return array_reduce($items, fn ($sum, $item) => $sum + $item->price, 0.0);
    }
}
```

Perhatikan baris kosong di dalam `createInvoice`: mereka memisahkan pengaturan variabel, pembuatan objek, dan pernyataan return — masing-masing adalah kelompok logis.

</section>

---

<section lang="en">

## Before and After: Refactoring a Messy PHP Class

Let us apply everything we have learned. Here is a `LibraryService` class you might find in a student project — it works, but it is messy. We will refactor it step by step.

### Before: The Original Messy Code

```php
<?php

class LibraryService
{
    public function d($a, $b)
    {
        $f = 0;
        if ($b['m'] == 1) {
            $f = $a * 0.1;
        }
        return $f;
    }

    public function r($x)
    {
        $c = 0;
        foreach ($x as $y) {
            if ($y['t'] == 'bk') {
                $c++;
            }
        }
        return $c;
    }

    public function fee($d, $s)
    {
        $fee = 0;
        if ($s == 1) {
            $fee = 1000;
        } elseif ($s == 2) {
            $fee = 2000;
        }
        $late = (time() - strtotime($d)) / 86400;
        if ($late > 7) {
            $fee += ($late - 7) * 500;
        }
        return $fee;
    }

    public function check($items, $mem)
    {
        $b = 0;
        foreach ($items as $i) {
            if ($i['t'] == 'bk') {
                $b++;
            }
        }
        if ($b > 5) {
            return "Too many books";
        }
        if ($mem == 0) {
            return "Not a member";
        }
        $ov = false;
        foreach ($items as $i) {
            if ($i['od'] < date('Y-m-d', strtotime('-14 days'))) {
                $ov = true;
            }
        }
        if ($ov) {
            return "Has overdue items";
        }
        return "OK";
    }
}
```

This class has every problem we discussed: cryptic names (`$a`, `$b`, `$x`, `$y`), magic numbers (`1`, `2`, `7`, `500`, `1000`, `2000`, `5`, `14`, `86400`), magic strings (`'bk'`), mixed responsibilities, and logic that is hard to follow.

### After: Clean, Readable, Maintainable

```php
<?php

class LibraryService
{
    private const MEMBER_DISCOUNT_RATE = 0.1;
    private const STATUS_ACTIVE = 1;
    private const STATUS_VIP = 2;
    private const FINE_PER_DAY = 500;
    private const GRACE_PERIOD_DAYS = 7;
    private const BOOK_TYPE = 'bk';
    private const MAX_BOOKS_ALLOWED = 5;
    private const OVERDUE_THRESHOLD_DAYS = 14;
    private const SECONDS_PER_DAY = 86400;

    private const BASE_FINE_ACTIVE = 1000;
    private const BASE_FINE_VIP = 2000;

    public function calculateMemberDiscount(float $amount, array $member): float
    {
        if ($member['membership_type'] !== self::STATUS_ACTIVE) {
            return 0;
        }
        return $amount * self::MEMBER_DISCOUNT_RATE;
    }

    public function countBooks(array $items): int
    {
        $bookCount = 0;
        foreach ($items as $item) {
            if ($item['type'] === self::BOOK_TYPE) {
                $bookCount++;
            }
        }
        return $bookCount;
    }

    public function calculateLateFee(string $dueDate, int $membershipStatus): float
    {
        $baseFee = match ($membershipStatus) {
            self::STATUS_ACTIVE => self::BASE_FINE_ACTIVE,
            self::STATUS_VIP => self::BASE_FINE_VIP,
            default => 0,
        };

        $daysLate = $this->calculateDaysLate($dueDate);
        if ($daysLate <= self::GRACE_PERIOD_DAYS) {
            return $baseFee;
        }

        $overdueDays = $daysLate - self::GRACE_PERIOD_DAYS;
        return $baseFee + ($overdueDays * self::FINE_PER_DAY);
    }

    public function validateCheckout(array $items, int $membershipType): string
    {
        $bookCount = $this->countBooks($items);

        if ($bookCount > self::MAX_BOOKS_ALLOWED) {
            return "Too many books";
        }
        if ($membershipType === 0) {
            return "Not a member";
        }
        if ($this->hasOverdueItems($items)) {
            return "Has overdue items";
        }
        return "OK";
    }

    private function calculateDaysLate(string $dueDate): int
    {
        $dueTimestamp = strtotime($dueDate);
        $nowTimestamp = time();
        $secondsLate = $nowTimestamp - $dueTimestamp;
        return (int) ceil($secondsLate / self::SECONDS_PER_DAY);
    }

    private function hasOverdueItems(array $items): bool
    {
        $cutoffDate = date('Y-m-d', strtotime("-" . self::OVERDUE_THRESHOLD_DAYS . " days"));
        foreach ($items as $item) {
            if ($item['overdue_date'] < $cutoffDate) {
                return true;
            }
        }
        return false;
    }
}
```

Here is what changed and why:

| Change | Reason |
|---|---|
| All magic values extracted to `const` | Single source of truth; easy to adjust limits and fees |
| `$a`, `$b`, `$x`, `$y` renamed to descriptive names | Code tells you what it does without mental translation |
| `$s == 1` replaced by `MembershipStatus::ACTIVE` | Meaningful constant names instead of raw integers |
| `"bk"` replaced by `self::BOOK_TYPE` | No more magic strings floating in logic |
| `time() - strtotime($d)` extracted to `calculateDaysLate()` | One responsibility per function; testable in isolation |
| `check()` renamed to `validateCheckout()` | Verb-noun pattern tells you exactly what the method returns |
| Early returns in `validateCheckout()` | Flat logic: read top to bottom, no nesting |
| Separate `hasOverdueItems()` method | Boolean check extracted; reusable and self-documenting |

The refactored class tells a clear story. You can read the public methods and understand the library workflow without tracing through nested conditions or deciphering abbreviations.

</section>

<section lang="id">

## Before and After: Merefaktor Kelas PHP yang Berantakan

Mari terapkan semua yang telah kita pelajari. Berikut adalah kelas `LibraryService` yang mungkin Anda temukan di proyek mahasiswa — berfungsi, tetapi berantakan. Kita akan merefaktornya langkah demi langkah.

### Before: Kode Berantakan Asli

```php
<?php

class LibraryService
{
    public function d($a, $b)
    {
        $f = 0;
        if ($b['m'] == 1) {
            $f = $a * 0.1;
        }
        return $f;
    }

    public function r($x)
    {
        $c = 0;
        foreach ($x as $y) {
            if ($y['t'] == 'bk') {
                $c++;
            }
        }
        return $c;
    }

    public function fee($d, $s)
    {
        $fee = 0;
        if ($s == 1) {
            $fee = 1000;
        } elseif ($s == 2) {
            $fee = 2000;
        }
        $late = (time() - strtotime($d)) / 86400;
        if ($late > 7) {
            $fee += ($late - 7) * 500;
        }
        return $fee;
    }

    public function check($items, $mem)
    {
        $b = 0;
        foreach ($items as $i) {
            if ($i['t'] == 'bk') {
                $b++;
            }
        }
        if ($b > 5) {
            return "Too many books";
        }
        if ($mem == 0) {
            return "Not a member";
        }
        $ov = false;
        foreach ($items as $i) {
            if ($i['od'] < date('Y-m-d', strtotime('-14 days'))) {
                $ov = true;
            }
        }
        if ($ov) {
            return "Has overdue items";
        }
        return "OK";
    }
}
```

Kelas ini memiliki setiap masalah yang kita bahas: nama kriptik (`$a`, `$b`, `$x`, `$y`), magic number (`1`, `2`, `7`, `500`, `1000`, `2000`, `5`, `14`, `86400`), magic string (`'bk'`), tanggung jawab campuran, dan logika yang sulit diikuti.

### After: Bersih, Terbaca, Mudah Dipelihara

```php
<?php

class LibraryService
{
    private const MEMBER_DISCOUNT_RATE = 0.1;
    private const STATUS_ACTIVE = 1;
    private const STATUS_VIP = 2;
    private const FINE_PER_DAY = 500;
    private const GRACE_PERIOD_DAYS = 7;
    private const BOOK_TYPE = 'bk';
    private const MAX_BOOKS_ALLOWED = 5;
    private const OVERDUE_THRESHOLD_DAYS = 14;
    private const SECONDS_PER_DAY = 86400;

    private const BASE_FINE_ACTIVE = 1000;
    private const BASE_FINE_VIP = 2000;

    public function calculateMemberDiscount(float $amount, array $member): float
    {
        if ($member['membership_type'] !== self::STATUS_ACTIVE) {
            return 0;
        }
        return $amount * self::MEMBER_DISCOUNT_RATE;
    }

    public function countBooks(array $items): int
    {
        $bookCount = 0;
        foreach ($items as $item) {
            if ($item['type'] === self::BOOK_TYPE) {
                $bookCount++;
            }
        }
        return $bookCount;
    }

    public function calculateLateFee(string $dueDate, int $membershipStatus): float
    {
        $baseFee = match ($membershipStatus) {
            self::STATUS_ACTIVE => self::BASE_FINE_ACTIVE,
            self::STATUS_VIP => self::BASE_FINE_VIP,
            default => 0,
        };

        $daysLate = $this->calculateDaysLate($dueDate);
        if ($daysLate <= self::GRACE_PERIOD_DAYS) {
            return $baseFee;
        }

        $overdueDays = $daysLate - self::GRACE_PERIOD_DAYS;
        return $baseFee + ($overdueDays * self::FINE_PER_DAY);
    }

    public function validateCheckout(array $items, int $membershipType): string
    {
        $bookCount = $this->countBooks($items);

        if ($bookCount > self::MAX_BOOKS_ALLOWED) {
            return "Too many books";
        }
        if ($membershipType === 0) {
            return "Not a member";
        }
        if ($this->hasOverdueItems($items)) {
            return "Has overdue items";
        }
        return "OK";
    }

    private function calculateDaysLate(string $dueDate): int
    {
        $dueTimestamp = strtotime($dueDate);
        $nowTimestamp = time();
        $secondsLate = $nowTimestamp - $dueTimestamp;
        return (int) ceil($secondsLate / self::SECONDS_PER_DAY);
    }

    private function hasOverdueItems(array $items): bool
    {
        $cutoffDate = date('Y-m-d', strtotime("-" . self::OVERDUE_THRESHOLD_DAYS . " days"));
        foreach ($items as $item) {
            if ($item['overdue_date'] < $cutoffDate) {
                return true;
            }
        }
        return false;
    }
}
```

Berikut adalah apa yang berubah dan mengapa:

| Perubahan | Alasan |
|---|---|
| Semua nilai magic diekstrak ke `const` | Sumber kebenaran tunggal; mudah menyesuaikan batas dan biaya |
| `$a`, `$b`, `$x`, `$y` diganti dengan nama deskriptif | Kode memberi tahu Anda apa yang dilakukannya tanpa terjemahan mental |
| `$s == 1` diganti oleh `MembershipStatus::ACTIVE` | Nama konstanta yang bermakna alih-alih integer mentah |
| `"bk"` diganti oleh `self::BOOK_TYPE` | Tidak ada lagi magic string mengambang dalam logika |
| `time() - strtotime($d)` diekstrak ke `calculateDaysLate()` | Satu tanggung jawab per fungsi; dapat diuji secara terisolasi |
| `check()` diganti menjadi `validateCheckout()` | Pola kata kerja-kata benda memberi tahu persis apa yang dikembalikan metode |
| Early return di `validateCheckout()` | Logika datar: baca dari atas ke bawah, tanpa nesting |
| Metode `hasOverdueItems()` terpisah | Pemeriksaan boolean diekstrak; dapat digunakan kembali dan mendokumentasikan diri sendiri |

Kelas yang direfaktor menceritakan kisah yang jelas. Anda dapat membaca metode publik dan memahami alur kerja perpustakaan tanpa menelusuri kondisi bertingkat atau menguraikan singkatan.

</section>

---

<section lang="en">

## Practice Exercise: Refactor a Messy PHP Function

Now it is your turn. Below is a `StudentEnrollment` class written in a typical beginner style. Your task is to refactor it using the Clean Code principles from this tutorial.

### The Code to Refactor

```php
<?php

class StudentEnrollment
{
    public function reg($data)
    {
        $e = [];
        if ($data['a'] < 17) {
            $e[] = 'Underage';
        }
        if ($data['a'] > 60) {
            $e[] = 'Over age limit';
        }
        if (empty($data['n'])) {
            $e[] = 'Name required';
        }
        if (!filter_var($data['em'], FILTER_VALIDATE_EMAIL)) {
            $e[] = 'Invalid email';
        }

        $c = 0;
        foreach ($data['sub'] as $s) {
            if ($s == 1) {
                $c += 300000;
            } elseif ($s == 2) {
                $c += 400000;
            } elseif ($s == 3) {
                $c += 500000;
            }
        }

        if (count($data['sub']) > 4) {
            $c = $c * 0.95;
        }

        if (!empty($e)) {
            return ['status' => 'error', 'errors' => $e];
        }

        $id = 'STD' . date('Y') . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
        return ['status' => 'ok', 'student_id' => $id, 'total' => $c];
    }
}
```

### Your Task

1. **Rename** `$a`, `$n`, `$em`, `$sub`, `$c`, `$e`, and the class method and variable names to reveal intent.
2. **Replace magic numbers** (`17`, `60`, `1`, `2`, `3`, `300000`, `400000`, `500000`, `4`, `0.95`) with named constants.
3. **Extract helper methods** — validation, cost calculation, student ID generation — so each does one thing.
4. **Use early returns** to flatten the validation logic.

### Expected Behaviour After Refactoring

```
Input: age=16, name="", email="bad", subjects=[1]
Output: ['status' => 'error', 'errors' => ['Underage', 'Name required', 'Invalid email']]

Input: age=20, name="Budi", email="budi@test.com", subjects=[1, 2]
Output: ['status' => 'ok', 'student_id' => 'STD2026...', 'total' => 700000]

Input: age=20, name="Sari", email="sari@test.com", subjects=[1, 1, 2, 3, 1]
Output: ['status' => 'ok', 'student_id' => 'STD2026...', 'total' => 1710000] (discounted 5%)
```

Try it yourself before looking at the solution below.

### One Possible Solution

```php
<?php

class StudentEnrollment
{
    private const MIN_AGE = 17;
    private const MAX_AGE = 60;
    private const BULK_DISCOUNT_THRESHOLD = 4;
    private const BULK_DISCOUNT_RATE = 0.95;

    private const SUBJECT_PRICES = [
        1 => 300000,
        2 => 400000,
        3 => 500000,
    ];

    public function register(array $data): array
    {
        $errors = $this->validateEnrollment($data);
        if (!empty($errors)) {
            return ['status' => 'error', 'errors' => $errors];
        }

        $totalCost = $this->calculateTotalCost($data['subjects']);
        $studentId = $this->generateStudentId();

        return ['status' => 'ok', 'student_id' => $studentId, 'total' => $totalCost];
    }

    private function validateEnrollment(array $data): array
    {
        $errors = [];

        if ($data['age'] < self::MIN_AGE) {
            $errors[] = 'Underage';
        }
        if ($data['age'] > self::MAX_AGE) {
            $errors[] = 'Over age limit';
        }
        if (empty($data['name'])) {
            $errors[] = 'Name required';
        }
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Invalid email';
        }

        return $errors;
    }

    private function calculateTotalCost(array $subjectIds): int
    {
        $total = 0;
        foreach ($subjectIds as $subjectId) {
            $total += self::SUBJECT_PRICES[$subjectId] ?? 0;
        }

        if (count($subjectIds) > self::BULK_DISCOUNT_THRESHOLD) {
            $total = (int) round($total * self::BULK_DISCOUNT_RATE);
        }

        return $total;
    }

    private function generateStudentId(): string
    {
        $year = date('Y');
        $sequence = str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
        return "STD{$year}{$sequence}";
    }
}
```

Compare this to the original: every piece of logic lives in a named method. Every value is a named constant. The `register` method reads like a checklist: validate, calculate, generate, return.

</section>

<section lang="id">

## Latihan Praktik: Refaktor Fungsi PHP yang Berantakan

Sekarang giliran Anda. Berikut adalah kelas `StudentEnrollment` yang ditulis dalam gaya pemula pada umumnya. Tugas Anda adalah merefaktornya menggunakan prinsip Clean Code dari tutorial ini.

### Kode untuk Direfaktor

```php
<?php

class StudentEnrollment
{
    public function reg($data)
    {
        $e = [];
        if ($data['a'] < 17) {
            $e[] = 'Underage';
        }
        if ($data['a'] > 60) {
            $e[] = 'Over age limit';
        }
        if (empty($data['n'])) {
            $e[] = 'Name required';
        }
        if (!filter_var($data['em'], FILTER_VALIDATE_EMAIL)) {
            $e[] = 'Invalid email';
        }

        $c = 0;
        foreach ($data['sub'] as $s) {
            if ($s == 1) {
                $c += 300000;
            } elseif ($s == 2) {
                $c += 400000;
            } elseif ($s == 3) {
                $c += 500000;
            }
        }

        if (count($data['sub']) > 4) {
            $c = $c * 0.95;
        }

        if (!empty($e)) {
            return ['status' => 'error', 'errors' => $e];
        }

        $id = 'STD' . date('Y') . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
        return ['status' => 'ok', 'student_id' => $id, 'total' => $c];
    }
}
```

### Tugas Anda

1. **Ganti nama** `$a`, `$n`, `$em`, `$sub`, `$c`, `$e`, dan nama metode serta variabel kelas untuk mengungkapkan maksud.
2. **Ganti magic number** (`17`, `60`, `1`, `2`, `3`, `300000`, `400000`, `500000`, `4`, `0.95`) dengan konstanta bernama.
3. **Ekstrak metode pembantu** — validasi, perhitungan biaya, pembuatan ID mahasiswa — sehingga masing-masing melakukan satu hal.
4. **Gunakan early return** untuk meratakan logika validasi.

### Perilaku yang Diharapkan Setelah Refaktor

```
Input: age=16, name="", email="bad", subjects=[1]
Output: ['status' => 'error', 'errors' => ['Underage', 'Name required', 'Invalid email']]

Input: age=20, name="Budi", email="budi@test.com", subjects=[1, 2]
Output: ['status' => 'ok', 'student_id' => 'STD2026...', 'total' => 700000]

Input: age=20, name="Sari", email="sari@test.com", subjects=[1, 1, 2, 3, 1]
Output: ['status' => 'ok', 'student_id' => 'STD2026...', 'total' => 1710000] (diskon 5%)
```

Coba sendiri sebelum melihat solusi di bawah.

### Salah Satu Solusi yang Mungkin

```php
<?php

class StudentEnrollment
{
    private const MIN_AGE = 17;
    private const MAX_AGE = 60;
    private const BULK_DISCOUNT_THRESHOLD = 4;
    private const BULK_DISCOUNT_RATE = 0.95;

    private const SUBJECT_PRICES = [
        1 => 300000,
        2 => 400000,
        3 => 500000,
    ];

    public function register(array $data): array
    {
        $errors = $this->validateEnrollment($data);
        if (!empty($errors)) {
            return ['status' => 'error', 'errors' => $errors];
        }

        $totalCost = $this->calculateTotalCost($data['subjects']);
        $studentId = $this->generateStudentId();

        return ['status' => 'ok', 'student_id' => $studentId, 'total' => $totalCost];
    }

    private function validateEnrollment(array $data): array
    {
        $errors = [];

        if ($data['age'] < self::MIN_AGE) {
            $errors[] = 'Underage';
        }
        if ($data['age'] > self::MAX_AGE) {
            $errors[] = 'Over age limit';
        }
        if (empty($data['name'])) {
            $errors[] = 'Name required';
        }
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Invalid email';
        }

        return $errors;
    }

    private function calculateTotalCost(array $subjectIds): int
    {
        $total = 0;
        foreach ($subjectIds as $subjectId) {
            $total += self::SUBJECT_PRICES[$subjectId] ?? 0;
        }

        if (count($subjectIds) > self::BULK_DISCOUNT_THRESHOLD) {
            $total = (int) round($total * self::BULK_DISCOUNT_RATE);
        }

        return $total;
    }

    private function generateStudentId(): string
    {
        $year = date('Y');
        $sequence = str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
        return "STD{$year}{$sequence}";
    }
}
```

Bandingkan dengan yang asli: setiap bagian logika berada dalam metode bernama. Setiap nilai adalah konstanta bernama. Metode `register` dibaca seperti daftar periksa: validasi, hitung, buat, kembalikan.

</section>

---

<section lang="en">

## Summary

1. **Meaningful names** are your first line of documentation. Replace `$d`, `$tmp`, and `calc()` with names that reveal intent.
2. **Small functions do one thing.** If a function name contains "and", split it. Aim for under 20 lines.
3. **Single Responsibility Principle** means each class and function has exactly one reason to change.
4. **Self-documenting code** is better than comments. Write comments to explain *why*, not *what*.
5. **Replace magic numbers and strings** with named constants. Your future self will thank you.
6. **Use early returns** to keep logic flat and readable. Deep nesting is a code smell.
7. **Throw meaningful exceptions.** Returning `null` or `false` silently loses information.

Clean Code is not about perfection on the first draft. Write code that works, then *refactor it into something you would enjoy reading six months from now*. Every refactoring pass makes the codebase a little better — and makes you a little faster on the next feature.

> "Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler

## What to Read Next

- **[Test-Driven Development (TDD) with PHP](/blog/test-driven-development)** — Apply the Red-Green-Refactor cycle to write code that is both clean and correct.
- **[Blackbox and Whitebox Test](/blog/blackbox-and-whitebox-test)** — Learn to test software from the outside (what it does) and the inside (how it does it).

</section>

<section lang="id">

## Ringkasan

1. **Nama yang bermakna** adalah lini pertama dokumentasi Anda. Ganti `$d`, `$tmp`, dan `calc()` dengan nama yang mengungkapkan maksud.
2. **Fungsi kecil melakukan satu hal.** Jika nama fungsi mengandung "dan", pisahkan. Targetkan di bawah 20 baris.
3. **Single Responsibility Principle** berarti setiap kelas dan fungsi memiliki tepat satu alasan untuk berubah.
4. **Kode yang mendokumentasikan diri sendiri** lebih baik dari komentar. Tulis komentar untuk menjelaskan *mengapa*, bukan *apa*.
5. **Ganti magic number dan string** dengan konstanta bernama. Diri Anda di masa depan akan berterima kasih.
6. **Gunakan early return** untuk menjaga logika tetap datar dan mudah dibaca. Nesting dalam adalah code smell.
7. **Lempar exception yang bermakna.** Mengembalikan `null` atau `false` secara diam-diam kehilangan informasi.

Clean Code bukan tentang kesempurnaan pada draf pertama. Tulis kode yang berfungsi, lalu *refaktor menjadi sesuatu yang Anda nikmati untuk dibaca enam bulan dari sekarang*. Setiap langkah refactoring membuat basis kode sedikit lebih baik — dan membuat Anda sedikit lebih cepat pada fitur berikutnya.

> "Siapa pun bisa menulis kode yang dimengerti komputer. Programmer yang baik menulis kode yang dimengerti manusia." — Martin Fowler

## Bacaan Selanjutnya

- **[Test-Driven Development (TDD) dengan PHP](/blog/test-driven-development)** — Terapkan siklus Red-Green-Refactor untuk menulis kode yang bersih dan benar.
- **[Blackbox and Whitebox Test](/blog/blackbox-and-whitebox-test)** — Pelajari menguji perangkat lunak dari luar (apa yang dilakukannya) dan dari dalam (bagaimana ia melakukannya).

</section>
