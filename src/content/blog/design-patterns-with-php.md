---
title: "Design Patterns with PHP"
titleId: "Design Patterns dengan PHP"
date: 2026-06-29
category: tutorial
author: SE Lab
lang: en
featured: false
excerpt: "A hands-on introduction to reusable object-oriented design patterns with PHP. Learn Strategy, Observer, and Factory Method with before-and-after code examples, understand when to apply each pattern, and refactor a messy notification service using what you have learned."
excerptId: "Pengenalan praktis pola desain berorientasi objek yang dapat digunakan kembali dengan PHP. Pelajari Strategy, Observer, dan Factory Method dengan contoh kode before-and-after, pahami kapan menerapkan setiap pola, dan refactor layanan notifikasi yang berantakan menggunakan apa yang telah Anda pelajari."
stream: se-methodologies-architecture
tags:
  - Design Patterns
  - PHP
tagsId:
  - Pola Desain
  - PHP
---

<section lang="en">

## What Are Design Patterns and Why Should You Learn Them?

**Design patterns** are proven, reusable solutions to common problems in software design. They are not finished code you copy and paste — they are templates you adapt to your own context. The term was popularised by the "Gang of Four" (GoF) in their 1994 book *Design Patterns: Elements of Reusable Object-Oriented Software*, and more than three decades later, the core patterns remain foundational vocabulary for every professional developer.

Think of design patterns as **shared vocabulary**. When a colleague says "we should use a Strategy here", everyone who knows patterns immediately understands: *we have a family of interchangeable algorithms, and we want to select one at runtime without hard-coding a switch statement*. That one word replaces a five-minute explanation.

Here is what learning design patterns gives you:

| Benefit | What It Means in Practice |
|---|---|
| **Shared vocabulary** | Communicate design intent with your team in one word instead of a paragraph. |
| **Proven solutions** | Patterns have been refined by thousands of developers over decades — you are not guessing. |
| **Better design instincts** | Recognising patterns sharpens your ability to spot coupling, rigidity, and abstraction opportunities. |
| **Framework literacy** | Laravel, Symfony, and most PHP frameworks are built on patterns. Understanding them makes frameworks predictable instead of magical. |
| **Interview readiness** | Pattern-based questions ("Design a payment gateway...") appear in nearly every technical interview. |

In this tutorial, we cover three GoF patterns selected for their immediate, everyday usefulness in PHP applications. Each pattern follows the same template so you can compare them easily.

</section>

<section lang="id">

## Apa Itu Design Patterns dan Mengapa Anda Harus Mempelajarinya?

**Design patterns** adalah solusi yang telah terbukti dan dapat digunakan kembali untuk masalah umum dalam desain perangkat lunak. Mereka bukan kode jadi yang Anda salin dan tempel — mereka adalah template yang Anda adaptasi ke konteks Anda sendiri. Istilah ini dipopulerkan oleh "Gang of Four" (GoF) dalam buku mereka tahun 1994 *Design Patterns: Elements of Reusable Object-Oriented Software*, dan lebih dari tiga dekade kemudian, pola-pola inti tetap menjadi kosakata dasar bagi setiap pengembang profesional.

Anggaplah design patterns sebagai **kosakata bersama**. Ketika seorang kolega mengatakan "kita harus menggunakan Strategy di sini", semua orang yang memahami pola langsung tahu: *kita memiliki kumpulan algoritma yang dapat dipertukarkan, dan kita ingin memilih satu saat runtime tanpa hard-coding switch statement*. Satu kata itu menggantikan penjelasan lima menit.

Berikut adalah apa yang diberikan oleh mempelajari design patterns:

| Manfaat | Artinya dalam Praktik |
|---|---|
| **Kosakata bersama** | Komunikasikan maksud desain dengan tim Anda dalam satu kata, bukan satu paragraf. |
| **Solusi terbukti** | Pola telah disempurnakan oleh ribuan pengembang selama beberapa dekade — Anda tidak sedang menebak. |
| **Insting desain yang lebih baik** | Mengenali pola mempertajam kemampuan Anda untuk melihat coupling, rigidity, dan peluang abstraksi. |
| **Literasi framework** | Laravel, Symfony, dan sebagian besar framework PHP dibangun di atas pola. Memahami pola membuat framework dapat diprediksi, bukan magis. |
| **Kesiapan wawancara** | Pertanyaan berbasis pola ("Desain payment gateway...") muncul di hampir setiap wawancara teknis. |

Dalam tutorial ini, kita membahas tiga pola GoF yang dipilih karena kegunaannya yang langsung dan sehari-hari dalam aplikasi PHP. Setiap pola mengikuti template yang sama sehingga Anda dapat membandingkannya dengan mudah.

</section>

<figure class="my-10 text-center" role="figure">
<pre class="inline-block text-left text-sm bg-neutral-900 text-green-400 p-6 rounded-lg">
┌──────────────────────────────────────────────────────────────────┐
│                     DESIGN PATTERNS IN THIS TUTORIAL               │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │
│  │   STRATEGY   │  │   OBSERVER   │  │     FACTORY METHOD       │ │
│  │              │  │              │  │                          │ │
│  │ Interchange- │  │ Publish /    │  │ Decouple object creation │ │
│  │ able algo-   │  │ Subscribe    │  │ from business logic     │ │
│  │ rithms       │  │ event        │  │                          │ │
│  │              │  │ handling     │  │ Category: Creational     │ │
│  │ Category:    │  │              │  │                          │ │
│  │ Behavioural  │  │ Category:    │  │                          │ │
│  │              │  │ Behavioural  │  │                          │ │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘ │
│                                                                    │
│  Each pattern: Motivation → Before (code smell) → After (pattern) │
└──────────────────────────────────────────────────────────────────┘
</pre>
<figcaption class="mt-3 text-sm text-neutral-500">
  <span lang="en">Figure: The three GoF design patterns covered in this tutorial — Strategy, Observer, and Factory Method</span>
  <span lang="id">Gambar: Tiga pola desain GoF yang dibahas dalam tutorial ini — Strategy, Observer, dan Factory Method</span>
</figcaption>
</figure>

---

<section lang="en">

## How to Read This Tutorial

Each pattern follows a consistent template so you can compare them directly:

1. **Real-world motivation** — a concrete scenario where the pattern solves a genuine problem (not a toy example).
2. **Before: the code smell** — PHP code written without the pattern, annotated with what makes it hard to maintain.
3. **After: pattern-based refactor** — the same scenario restructured using the pattern, with implementation details explained.
4. **When to use & when not to use** — a short, honest guide. Patterns are tools, not dogma.

Skip around if you like, but reading all three patterns in sequence helps you see how they complement each other without overlapping.

</section>

<section lang="id">

## Cara Membaca Tutorial Ini

Setiap pola mengikuti template yang konsisten sehingga Anda dapat membandingkannya secara langsung:

1. **Motivasi dunia nyata** — skenario konkret di mana pola menyelesaikan masalah yang sesungguhnya (bukan contoh mainan).
2. **Before: code smell** — kode PHP yang ditulis tanpa pola, dengan anotasi tentang apa yang membuatnya sulit dipelihara.
3. **After: refactor berbasis pola** — skenario yang sama direstrukturisasi menggunakan pola, dengan detail implementasi yang dijelaskan.
4. **Kapan menggunakan & kapan tidak** — panduan singkat dan jujur. Pola adalah alat, bukan dogma.

Silakan lompat-lompat jika Anda suka, tetapi membaca ketiga pola secara berurutan membantu Anda melihat bagaimana mereka saling melengkapi tanpa tumpang tindih.

</section>

---

<section lang="en">

## Pattern 1: Strategy Pattern

### Real-World Motivation

Your campus EdTech platform needs to apply discount rules during course registration. One rule gives 10% off for early enrolment, another offers a fixed amount for scholarship students, and next semester the marketing team wants to add a "buy three courses, get one free" promotion.

A naive implementation uses `if`/`elseif` chains spread across the registration controller:

```php
<?php

class RegistrationController
{
    public function calculatePrice(float $basePrice, string $discountType, array $student): float
    {
        if ($discountType === 'early_bird') {
            return $basePrice * 0.90;
        } elseif ($discountType === 'scholarship') {
            return $basePrice - 200000;
        } elseif ($discountType === 'bulk_promo') {
            // coming soon...
        }

        return $basePrice;
    }
}
```

This works, but every new discount rule forces you to modify `RegistrationController` — a class that should care about HTTP requests, not discount math. The controller violates the **Open/Closed Principle**: it is open for modification every time marketing invents a promotion.

### Before: The Code Smell

Here is a fuller example with multiple discount rules crammed into one method. Notice how the `switch` grows with every new requirement:

```php
<?php

class OrderService
{
    public function calculateTotal(array $items, string $discountType): float
    {
        $subtotal = array_sum(array_column($items, 'price'));

        switch ($discountType) {
            case 'no_discount':
                $discount = 0;
                break;
            case 'early_bird':
                $discount = $subtotal * 0.10;
                break;
            case 'scholarship':
                $discount = min($subtotal, 200000);
                break;
            case 'weekend_flash':
                $discount = $subtotal * 0.15;
                break;
            default:
                throw new \InvalidArgumentException("Unknown discount type: $discountType");
        }

        return $subtotal - $discount;
    }
}

$service = new OrderService();
echo $service->calculateTotal([['price' => 500000], ['price' => 300000]], 'early_bird');
// Output: 720000
```

**Problems:**

- Adding a new discount type requires editing `OrderService` — and re-testing every existing discount path.
- The discount logic is trapped inside the service; you cannot reuse it in a command-line script or a reporting module without duplicating the code.
- Every `case` branch couples two concerns: *how* the discount is calculated and *when* it is selected.

### After: Strategy Pattern

The **Strategy pattern** defines a family of algorithms, encapsulates each one in its own class, and makes them interchangeable. The context (caller) delegates to a strategy object without knowing which concrete strategy it holds.

Step 1 — define the strategy interface:

```php
<?php

interface DiscountStrategy
{
    public function calculate(float $subtotal): float;
}
```

Step 2 — implement each discount as a concrete strategy class:

```php
<?php

class NoDiscount implements DiscountStrategy
{
    public function calculate(float $subtotal): float
    {
        return 0;
    }
}

class EarlyBirdDiscount implements DiscountStrategy
{
    public function calculate(float $subtotal): float
    {
        return $subtotal * 0.10;
    }
}

class ScholarshipDiscount implements DiscountStrategy
{
    public function calculate(float $subtotal): float
    {
        return min($subtotal, 200000);
    }
}

class WeekendFlashDiscount implements DiscountStrategy
{
    public function calculate(float $subtotal): float
    {
        return $subtotal * 0.15;
    }
}
```

Step 3 — refactor `OrderService` to accept a strategy instead of a string:

```php
<?php

class OrderService
{
    public function calculateTotal(array $items, DiscountStrategy $discount): float
    {
        $subtotal = array_sum(array_column($items, 'price'));
        $discountAmount = $discount->calculate($subtotal);

        return $subtotal - $discountAmount;
    }
}

$service = new OrderService();
echo $service->calculateTotal(
    [['price' => 500000], ['price' => 300000]],
    new EarlyBirdDiscount()
);
// Output: 720000
```

Step 4 — now you can inject any strategy at runtime:

```php
<?php

// Select strategy based on request, config, or user profile
$discount = match ($student->discountType) {
    'early_bird'    => new EarlyBirdDiscount(),
    'scholarship'   => new ScholarshipDiscount(),
    'weekend_flash' => new WeekendFlashDiscount(),
    default         => new NoDiscount(),
};

$total = $orderService->calculateTotal($cart->items, $discount);
```

**What changed:**

- `OrderService` is **closed for modification** — you add a new discount by creating one new class, zero changes to existing code.
- Each discount is **independently testable** in isolation. `EarlyBirdDiscountTest` can verify the 10% math without booting the entire order system.
- The `match` statement at the boundary (controller or service provider) is the single place where you map inputs to strategies. That is a dependency wiring concern, not business logic.

### When to Use (and When Not to Use) the Strategy Pattern

| Use When... | Avoid When... |
|---|---|
| You have multiple variants of an algorithm and they all share the same interface. | You only have one or two variants — a simple `if`/`else` is cheaper. |
| The algorithm is likely to change independently of the context that uses it. | The algorithm is trivial (one line) and adding a class hierarchy is overkill. |
| You want to unit-test each variant in isolation. | The variants differ in required parameters, not just behaviour — Strategy requires a uniform interface. |
| You find yourself adding `elseif` branches to a method every sprint. | The total number of strategies will never realistically exceed three. |

</section>

<section lang="id">

## Pola 1: Strategy Pattern

### Motivasi Dunia Nyata

Platform EdTech kampus Anda perlu menerapkan aturan diskon saat pendaftaran mata kuliah. Satu aturan memberikan potongan 10% untuk pendaftaran awal, aturan lain menawarkan jumlah tetap untuk mahasiswa beasiswa, dan semester depan tim pemasaran ingin menambahkan promosi "beli tiga mata kuliah, gratis satu".

Implementasi naif menggunakan rantai `if`/`elseif` yang tersebar di controller pendaftaran:

```php
<?php

class RegistrationController
{
    public function calculatePrice(float $basePrice, string $discountType, array $student): float
    {
        if ($discountType === 'early_bird') {
            return $basePrice * 0.90;
        } elseif ($discountType === 'scholarship') {
            return $basePrice - 200000;
        } elseif ($discountType === 'bulk_promo') {
            // coming soon...
        }

        return $basePrice;
    }
}
```

Ini berfungsi, tetapi setiap aturan diskon baru memaksa Anda memodifikasi `RegistrationController` — kelas yang seharusnya peduli tentang HTTP request, bukan matematika diskon. Controller ini melanggar **Open/Closed Principle**: ia terbuka untuk modifikasi setiap kali pemasaran menciptakan promosi.

### Before: Code Smell

Berikut adalah contoh yang lebih lengkap dengan beberapa aturan diskon yang dipadatkan ke dalam satu metode. Perhatikan bagaimana `switch` bertambah dengan setiap persyaratan baru:

```php
<?php

class OrderService
{
    public function calculateTotal(array $items, string $discountType): float
    {
        $subtotal = array_sum(array_column($items, 'price'));

        switch ($discountType) {
            case 'no_discount':
                $discount = 0;
                break;
            case 'early_bird':
                $discount = $subtotal * 0.10;
                break;
            case 'scholarship':
                $discount = min($subtotal, 200000);
                break;
            case 'weekend_flash':
                $discount = $subtotal * 0.15;
                break;
            default:
                throw new \InvalidArgumentException("Unknown discount type: $discountType");
        }

        return $subtotal - $discount;
    }
}

$service = new OrderService();
echo $service->calculateTotal([['price' => 500000], ['price' => 300000]], 'early_bird');
// Output: 720000
```

**Masalah:**

- Menambahkan jenis diskon baru memerlukan pengeditan `OrderService` — dan pengujian ulang setiap jalur diskon yang ada.
- Logika diskon terperangkap di dalam service; Anda tidak dapat menggunakannya kembali di skrip command-line atau modul pelaporan tanpa menduplikasi kode.
- Setiap cabang `case` menggabungkan dua perhatian: *bagaimana* diskon dihitung dan *kapan* diskon dipilih.

### After: Strategy Pattern

Pola **Strategy** mendefinisikan kumpulan algoritma, mengenkapsulasi masing-masing di kelasnya sendiri, dan membuatnya dapat dipertukarkan. Konteks (pemanggil) mendelegasikan ke objek strategi tanpa mengetahui strategi konkret mana yang dipegangnya.

Langkah 1 — definisikan antarmuka strategi:

```php
<?php

interface DiscountStrategy
{
    public function calculate(float $subtotal): float;
}
```

Langkah 2 — implementasikan setiap diskon sebagai kelas strategi konkret:

```php
<?php

class NoDiscount implements DiscountStrategy
{
    public function calculate(float $subtotal): float
    {
        return 0;
    }
}

class EarlyBirdDiscount implements DiscountStrategy
{
    public function calculate(float $subtotal): float
    {
        return $subtotal * 0.10;
    }
}

class ScholarshipDiscount implements DiscountStrategy
{
    public function calculate(float $subtotal): float
    {
        return min($subtotal, 200000);
    }
}

class WeekendFlashDiscount implements DiscountStrategy
{
    public function calculate(float $subtotal): float
    {
        return $subtotal * 0.15;
    }
}
```

Langkah 3 — refactor `OrderService` untuk menerima strategi, bukan string:

```php
<?php

class OrderService
{
    public function calculateTotal(array $items, DiscountStrategy $discount): float
    {
        $subtotal = array_sum(array_column($items, 'price'));
        $discountAmount = $discount->calculate($subtotal);

        return $subtotal - $discountAmount;
    }
}

$service = new OrderService();
echo $service->calculateTotal(
    [['price' => 500000], ['price' => 300000]],
    new EarlyBirdDiscount()
);
// Output: 720000
```

Langkah 4 — sekarang Anda dapat menginjeksi strategi apa pun saat runtime:

```php
<?php

// Pilih strategi berdasarkan request, config, atau profil pengguna
$discount = match ($student->discountType) {
    'early_bird'    => new EarlyBirdDiscount(),
    'scholarship'   => new ScholarshipDiscount(),
    'weekend_flash' => new WeekendFlashDiscount(),
    default         => new NoDiscount(),
};

$total = $orderService->calculateTotal($cart->items, $discount);
```

**Apa yang berubah:**

- `OrderService` **tertutup untuk modifikasi** — Anda menambahkan diskon baru dengan membuat satu kelas baru, nol perubahan pada kode yang ada.
- Setiap diskon **dapat diuji secara independen** dalam isolasi. `EarlyBirdDiscountTest` dapat memverifikasi matematika 10% tanpa mem-boot seluruh sistem pemesanan.
- Statement `match` di batas (controller atau service provider) adalah satu-satunya tempat di mana Anda memetakan input ke strategi. Itu adalah masalah wiring dependensi, bukan logika bisnis.

### Kapan Menggunakan (dan Kapan Tidak) Strategy Pattern

| Gunakan Ketika... | Hindari Ketika... |
|---|---|
| Anda memiliki beberapa varian algoritma dan semuanya berbagi antarmuka yang sama. | Anda hanya memiliki satu atau dua varian — `if`/`else` sederhana lebih murah. |
| Algoritma kemungkinan berubah secara independen dari konteks yang menggunakannya. | Algoritma bersifat trivial (satu baris) dan menambahkan hierarki kelas adalah overkill. |
| Anda ingin menguji setiap varian secara terisolasi. | Varian berbeda dalam parameter yang diperlukan, bukan hanya perilaku — Strategy memerlukan antarmuka yang seragam. |
| Anda mendapati diri menambahkan cabang `elseif` ke metode setiap sprint. | Jumlah total strategi tidak akan pernah realistis melebihi tiga. |

</section>

---

<section lang="en">

## Pattern 2: Observer Pattern

### Real-World Motivation

An EdTech campus portal needs to react when a student enrols in a course: send a confirmation email, log the enrolment for audit, update the attendance roster, and — in future — send a push notification to the student's mobile app. Each of these side effects is a separate concern that should not be hard-wired into the enrolment method.

Without the Observer pattern, the `enrol()` method becomes a dumping ground for every side effect:

```php
<?php

class EnrolmentService
{
    public function enrol(Student $student, Course $course): void
    {
        // Core logic: save enrolment
        $this->repository->save($student, $course);

        // Side effect 1: email
        $this->mailer->send($student->email, 'Enrolment Confirmed', '...');

        // Side effect 2: audit log
        $this->logger->info('Student enrolled', ['student' => $student->id, 'course' => $course->id]);

        // Side effect 3: attendance roster
        $this->attendanceService->addStudent($course->id, $student->id);

        // Side effect 4 (coming soon): push notification
        // Side effect 5 (coming soon): analytics tracking
        // Side effect 6 (coming soon): LMS integration
    }
}
```

Every new side effect forces you to edit `EnrolmentService` and re-deploy the entire module — even though the core enrolment logic never changed.

### Before: The Code Smell

```php
<?php

class CourseEnrolment
{
    private $db;
    private $mailer;
    private $logger;
    private $attendance;

    public function __construct($db, $mailer, $logger, $attendance)
    {
        $this->db = $db;
        $this->mailer = $mailer;
        $this->logger = $logger;
        $this->attendance = $attendance;
    }

    public function enrol(int $studentId, int $courseId): void
    {
        $this->db->insert('enrolments', [
            'student_id' => $studentId,
            'course_id'  => $courseId,
            'enrolled_at' => date('Y-m-d H:i:s'),
        ]);

        $student = $this->db->find('students', $studentId);
        $course  = $this->db->find('courses', $courseId);

        $this->mailer->send(
            $student['email'],
            "Enrolled: {$course['title']}",
            "You have been enrolled in {$course['title']}."
        );

        $this->logger->log("Student {$student['name']} enrolled in {$course['title']}");

        $this->attendance->addStudent($courseId, $studentId);
    }
}
```

**Problems:**

- `CourseEnrolment` knows about email, logging, and attendance. It has four reasons to change — that is three too many (Single Responsibility Principle violation).
- Adding a new listener (push notification, analytics) requires editing this class and retesting everything.
- You cannot disable email notifications in a test environment without mocking the mailer or modifying the class.

### After: Observer Pattern

The **Observer pattern** defines a one-to-many dependency: when one object (the subject) changes state, all its dependents (observers) are notified automatically. The subject knows only that observers implement a given interface — it never knows their concrete types.

PHP provides `SplSubject` and `SplObserver` in the Standard PHP Library, but a lightweight custom implementation is often clearer:

Step 1 — define the observer interface:

```php
<?php

interface EnrolmentObserver
{
    public function onEnrolmentCreated(array $enrolmentData): void;
}
```

Step 2 — define the subject (what gets observed):

```php
<?php

class EnrolmentSubject
{
    /** @var EnrolmentObserver[] */
    private array $observers = [];

    public function attach(EnrolmentObserver $observer): void
    {
        $this->observers[] = $observer;
    }

    public function detach(EnrolmentObserver $observer): void
    {
        $this->observers = array_filter(
            $this->observers,
            fn($o) => $o !== $observer
        );
    }

    protected function notify(array $enrolmentData): void
    {
        foreach ($this->observers as $observer) {
            $observer->onEnrolmentCreated($enrolmentData);
        }
    }
}
```

Step 3 — implement concrete observers:

```php
<?php

class EmailNotificationObserver implements EnrolmentObserver
{
    private $mailer;

    public function __construct($mailer)
    {
        $this->mailer = $mailer;
    }

    public function onEnrolmentCreated(array $data): void
    {
        $this->mailer->send(
            $data['student_email'],
            "Enrolled: {$data['course_title']}",
            "You have been enrolled in {$data['course_title']}."
        );
    }
}

class AuditLogObserver implements EnrolmentObserver
{
    private $logger;

    public function __construct($logger)
    {
        $this->logger = $logger;
    }

    public function onEnrolmentCreated(array $data): void
    {
        $this->logger->log(
            "Student {$data['student_name']} enrolled in {$data['course_title']}"
        );
    }
}

class AttendanceObserver implements EnrolmentObserver
{
    private $attendanceService;

    public function __construct($attendanceService)
    {
        $this->attendanceService = $attendanceService;
    }

    public function onEnrolmentCreated(array $data): void
    {
        $this->attendanceService->addStudent(
            $data['course_id'],
            $data['student_id']
        );
    }
}
```

Step 4 — refactor `CourseEnrolment` to extend the subject:

```php
<?php

class CourseEnrolment extends EnrolmentSubject
{
    private $db;

    public function __construct($db, array $observers = [])
    {
        $this->db = $db;
        foreach ($observers as $observer) {
            $this->attach($observer);
        }
    }

    public function enrol(int $studentId, int $courseId): void
    {
        $this->db->insert('enrolments', [
            'student_id'  => $studentId,
            'course_id'   => $courseId,
            'enrolled_at' => date('Y-m-d H:i:s'),
        ]);

        $student = $this->db->find('students', $studentId);
        $course  = $this->db->find('courses', $courseId);

        $this->notify([
            'student_id'    => $studentId,
            'student_name'  => $student['name'],
            'student_email' => $student['email'],
            'course_id'     => $courseId,
            'course_title'  => $course['title'],
        ]);
    }
}
```

Step 5 — wire observers at application bootstrap:

```php
<?php

$enrolment = new CourseEnrolment($db, [
    new EmailNotificationObserver($mailer),
    new AuditLogObserver($logger),
    new AttendanceObserver($attendanceService),
]);

$enrolment->enrol(42, 7);
```

**What changed:**

- `CourseEnrolment` now has **one reason to change**: the core enrolment logic. Every side effect is an independent class.
- Adding push notifications is a new `PushNotificationObserver` class and one line in the bootstrap — zero changes to `CourseEnrolment`.
- In tests, you can construct `CourseEnrolment` with an empty observer array and assert only the core logic. Observers get their own isolated tests.

### When to Use (and When Not to Use) the Observer Pattern

| Use When... | Avoid When... |
|---|---|
| One action triggers multiple, independent side effects. | There is only one consumer of the event — direct calling is simpler. |
| The set of side effects changes frequently or varies by environment. | The set of side effects is fixed and small (one or two). |
| You want to add listeners from different modules or packages without touching core code. | Order of notification matters critically — Observer does not (and should not) guarantee execution order. |
| You need to disable specific side effects in tests or staging without mocking everything. | The side effects are tightly coupled and must run in a specific transactional context. |

</section>

<section lang="id">

## Pola 2: Observer Pattern

### Motivasi Dunia Nyata

Portal kampus EdTech perlu bereaksi ketika seorang mahasiswa mendaftar mata kuliah: mengirim email konfirmasi, mencatat pendaftaran untuk audit, memperbarui daftar hadir, dan — di masa depan — mengirim push notification ke aplikasi seluler mahasiswa. Setiap efek samping ini adalah concern terpisah yang tidak boleh di-hard-wire ke dalam metode pendaftaran.

Tanpa pola Observer, metode `enrol()` menjadi tempat pembuangan untuk setiap efek samping:

```php
<?php

class EnrolmentService
{
    public function enrol(Student $student, Course $course): void
    {
        // Logika inti: simpan pendaftaran
        $this->repository->save($student, $course);

        // Efek samping 1: email
        $this->mailer->send($student->email, 'Pendaftaran Dikonfirmasi', '...');

        // Efek samping 2: audit log
        $this->logger->info('Mahasiswa terdaftar', ['student' => $student->id, 'course' => $course->id]);

        // Efek samping 3: daftar hadir
        $this->attendanceService->addStudent($course->id, $student->id);

        // Efek samping 4 (segera hadir): push notification
        // Efek samping 5 (segera hadir): analytics tracking
        // Efek samping 6 (segera hadir): integrasi LMS
    }
}
```

Setiap efek samping baru memaksa Anda mengedit `EnrolmentService` dan mendeploy ulang seluruh modul — meskipun logika inti pendaftaran tidak pernah berubah.

### Before: Code Smell

```php
<?php

class CourseEnrolment
{
    private $db;
    private $mailer;
    private $logger;
    private $attendance;

    public function __construct($db, $mailer, $logger, $attendance)
    {
        $this->db = $db;
        $this->mailer = $mailer;
        $this->logger = $logger;
        $this->attendance = $attendance;
    }

    public function enrol(int $studentId, int $courseId): void
    {
        $this->db->insert('enrolments', [
            'student_id' => $studentId,
            'course_id'  => $courseId,
            'enrolled_at' => date('Y-m-d H:i:s'),
        ]);

        $student = $this->db->find('students', $studentId);
        $course  = $this->db->find('courses', $courseId);

        $this->mailer->send(
            $student['email'],
            "Terdaftar: {$course['title']}",
            "Anda telah terdaftar di {$course['title']}."
        );

        $this->logger->log("Mahasiswa {$student['name']} terdaftar di {$course['title']}");

        $this->attendance->addStudent($courseId, $studentId);
    }
}
```

**Masalah:**

- `CourseEnrolment` mengetahui tentang email, logging, dan attendance. Ia memiliki empat alasan untuk berubah — itu tiga terlalu banyak (pelanggaran Single Responsibility Principle).
- Menambahkan listener baru (push notification, analytics) memerlukan pengeditan kelas ini dan pengujian ulang semuanya.
- Anda tidak dapat menonaktifkan notifikasi email di lingkungan pengujian tanpa memock mailer atau memodifikasi kelas.

### After: Observer Pattern

Pola **Observer** mendefinisikan dependensi satu-ke-banyak: ketika satu objek (subject) berubah status, semua dependennya (observer) diberitahu secara otomatis. Subject hanya tahu bahwa observer mengimplementasikan antarmuka tertentu — ia tidak pernah tahu tipe konkretnya.

PHP menyediakan `SplSubject` dan `SplObserver` di Standard PHP Library, tetapi implementasi kustom yang ringan seringkali lebih jelas:

Langkah 1 — definisikan antarmuka observer:

```php
<?php

interface EnrolmentObserver
{
    public function onEnrolmentCreated(array $enrolmentData): void;
}
```

Langkah 2 — definisikan subject (apa yang diamati):

```php
<?php

class EnrolmentSubject
{
    /** @var EnrolmentObserver[] */
    private array $observers = [];

    public function attach(EnrolmentObserver $observer): void
    {
        $this->observers[] = $observer;
    }

    public function detach(EnrolmentObserver $observer): void
    {
        $this->observers = array_filter(
            $this->observers,
            fn($o) => $o !== $observer
        );
    }

    protected function notify(array $enrolmentData): void
    {
        foreach ($this->observers as $observer) {
            $observer->onEnrolmentCreated($enrolmentData);
        }
    }
}
```

Langkah 3 — implementasikan observer konkret:

```php
<?php

class EmailNotificationObserver implements EnrolmentObserver
{
    private $mailer;

    public function __construct($mailer)
    {
        $this->mailer = $mailer;
    }

    public function onEnrolmentCreated(array $data): void
    {
        $this->mailer->send(
            $data['student_email'],
            "Terdaftar: {$data['course_title']}",
            "Anda telah terdaftar di {$data['course_title']}."
        );
    }
}

class AuditLogObserver implements EnrolmentObserver
{
    private $logger;

    public function __construct($logger)
    {
        $this->logger = $logger;
    }

    public function onEnrolmentCreated(array $data): void
    {
        $this->logger->log(
            "Mahasiswa {$data['student_name']} terdaftar di {$data['course_title']}"
        );
    }
}

class AttendanceObserver implements EnrolmentObserver
{
    private $attendanceService;

    public function __construct($attendanceService)
    {
        $this->attendanceService = $attendanceService;
    }

    public function onEnrolmentCreated(array $data): void
    {
        $this->attendanceService->addStudent(
            $data['course_id'],
            $data['student_id']
        );
    }
}
```

Langkah 4 — refactor `CourseEnrolment` untuk memperluas subject:

```php
<?php

class CourseEnrolment extends EnrolmentSubject
{
    private $db;

    public function __construct($db, array $observers = [])
    {
        $this->db = $db;
        foreach ($observers as $observer) {
            $this->attach($observer);
        }
    }

    public function enrol(int $studentId, int $courseId): void
    {
        $this->db->insert('enrolments', [
            'student_id'  => $studentId,
            'course_id'   => $courseId,
            'enrolled_at' => date('Y-m-d H:i:s'),
        ]);

        $student = $this->db->find('students', $studentId);
        $course  = $this->db->find('courses', $courseId);

        $this->notify([
            'student_id'    => $studentId,
            'student_name'  => $student['name'],
            'student_email' => $student['email'],
            'course_id'     => $courseId,
            'course_title'  => $course['title'],
        ]);
    }
}
```

Langkah 5 — wire observer saat bootstrap aplikasi:

```php
<?php

$enrolment = new CourseEnrolment($db, [
    new EmailNotificationObserver($mailer),
    new AuditLogObserver($logger),
    new AttendanceObserver($attendanceService),
]);

$enrolment->enrol(42, 7);
```

**Apa yang berubah:**

- `CourseEnrolment` sekarang memiliki **satu alasan untuk berubah**: logika inti pendaftaran. Setiap efek samping adalah kelas independen.
- Menambahkan push notification adalah satu kelas `PushNotificationObserver` baru dan satu baris di bootstrap — nol perubahan pada `CourseEnrolment`.
- Dalam pengujian, Anda dapat mengonstruksi `CourseEnrolment` dengan array observer kosong dan hanya menguji logika inti. Observer mendapatkan pengujian terisolasi mereka sendiri.

### Kapan Menggunakan (dan Kapan Tidak) Observer Pattern

| Gunakan Ketika... | Hindari Ketika... |
|---|---|
| Satu aksi memicu beberapa efek samping yang independen. | Hanya ada satu konsumen dari event — pemanggilan langsung lebih sederhana. |
| Kumpulan efek samping sering berubah atau bervariasi berdasarkan lingkungan. | Kumpulan efek samping bersifat tetap dan kecil (satu atau dua). |
| Anda ingin menambahkan listener dari modul atau package yang berbeda tanpa menyentuh kode inti. | Urutan notifikasi sangat penting — Observer tidak (dan tidak seharusnya) menjamin urutan eksekusi. |
| Anda perlu menonaktifkan efek samping tertentu dalam pengujian atau staging tanpa memock semuanya. | Efek samping terkait erat dan harus berjalan dalam konteks transaksional tertentu. |

</section>

---

<section lang="en">

## Pattern 3: Factory Method Pattern

### Real-World Motivation

Your campus platform needs to generate reports in multiple formats: PDF for official transcripts, CSV for data exports, and Excel for administrative spreadsheets. Each format requires different libraries (`Dompdf`, `PhpSpreadsheet`, native `fputcsv`) and different configuration. Sprinkling `new` statements throughout the controller creates hidden coupling:

```php
<?php

class ReportController
{
    public function export(string $format, array $data)
    {
        if ($format === 'pdf') {
            $report = new PdfReport('A4', 'landscape');
        } elseif ($format === 'csv') {
            $report = new CsvReport(',', true);
        } elseif ($format === 'excel') {
            $report = new ExcelReport('Sheet1', true);
        } else {
            throw new \InvalidArgumentException("Unknown format: $format");
        }

        return $report->generate($data);
    }
}
```

Every new report format means editing the controller, and every controller that needs a report duplicates this `if`/`elseif` chain.

### Before: The Code Smell

```php
<?php

class ExportService
{
    public function exportStudentGrades(array $students, string $format): string
    {
        // Data preparation (shared logic)
        $rows = [];
        foreach ($students as $s) {
            $rows[] = [$s['nim'], $s['name'], $s['grade']];
        }

        // Format-specific creation + generation (duplicated concern)
        if ($format === 'pdf') {
            $report = new PdfExporter('A4', 'portrait');
            return $report->export('Student Grades', ['NIM', 'Name', 'Grade'], $rows);
        } elseif ($format === 'csv') {
            $report = new CsvExporter(',', '"');
            return $report->export('Student Grades', ['NIM', 'Name', 'Grade'], $rows);
        } elseif ($format === 'excel') {
            $report = new ExcelExporter();
            $report->setSheetName('Grades');
            return $report->export('Student Grades', ['NIM', 'Name', 'Grade'], $rows);
        }

        throw new \InvalidArgumentException("Unsupported export format: $format");
    }
}

$service = new ExportService();
echo $service->exportStudentGrades($students, 'csv');
```

**Problems:**

- `ExportService` knows how to construct three different exporter classes — it depends on every concrete exporter.
- The `if`/`elseif` chain is duplicated in every controller that needs an export (invoices, attendance, transcripts).
- Configuring an exporter constructor (paper size, delimiter, sheet name) leaks implementation details into the service layer.

### After: Factory Method Pattern

The **Factory Method** pattern defines an interface for creating an object, but lets subclasses decide which class to instantiate. The client depends only on the abstract creator and product interfaces — never on concrete classes.

Step 1 — define the product interface (the report):

```php
<?php

interface ReportExporter
{
    public function export(string $title, array $headers, array $rows): string;
}
```

Step 2 — implement concrete products:

```php
<?php

class PdfExporter implements ReportExporter
{
    private string $pageSize;
    private string $orientation;

    public function __construct(string $pageSize = 'A4', string $orientation = 'portrait')
    {
        $this->pageSize = $pageSize;
        $this->orientation = $orientation;
    }

    public function export(string $title, array $headers, array $rows): string
    {
        // In production: use Dompdf or TCPDF
        return "[PDF] {$title} ({$this->pageSize} {$this->orientation}) — " . count($rows) . " rows";
    }
}

class CsvExporter implements ReportExporter
{
    private string $delimiter;
    private string $enclosure;

    public function __construct(string $delimiter = ',', string $enclosure = '"')
    {
        $this->delimiter = $delimiter;
        $this->enclosure = $enclosure;
    }

    public function export(string $title, array $headers, array $rows): string
    {
        $output = $this->enclosure . implode("{$this->enclosure}{$this->delimiter}{$this->enclosure}", $headers) . $this->enclosure . "\n";
        foreach ($rows as $row) {
            $output .= $this->enclosure . implode("{$this->enclosure}{$this->delimiter}{$this->enclosure}", $row) . $this->enclosure . "\n";
        }
        return $output;
    }
}

class ExcelExporter implements ReportExporter
{
    private string $sheetName;

    public function __construct(string $sheetName = 'Sheet1')
    {
        $this->sheetName = $sheetName;
    }

    public function export(string $title, array $headers, array $rows): string
    {
        // In production: use PhpSpreadsheet
        return "[Excel] {$title} (sheet: {$this->sheetName}) — " . count($rows) . " rows";
    }
}
```

Step 3 — define the creator (factory) interface:

```php
<?php

interface ReportExporterFactory
{
    public function createExporter(): ReportExporter;
}
```

Step 4 — implement concrete factories:

```php
<?php

class PdfExporterFactory implements ReportExporterFactory
{
    public function createExporter(): ReportExporter
    {
        return new PdfExporter('A4', 'portrait');
    }
}

class CsvExporterFactory implements ReportExporterFactory
{
    public function createExporter(): ReportExporter
    {
        return new CsvExporter(',', '"');
    }
}

class ExcelExporterFactory implements ReportExporterFactory
{
    public function createExporter(): ReportExporter
    {
        return new ExcelExporter('Student Grades');
    }
}
```

Step 5 — refactor `ExportService` to use a factory:

```php
<?php

class ExportService
{
    public function exportStudentGrades(array $students, ReportExporterFactory $factory): string
    {
        $rows = [];
        foreach ($students as $s) {
            $rows[] = [$s['nim'], $s['name'], $s['grade']];
        }

        $exporter = $factory->createExporter();
        return $exporter->export('Student Grades', ['NIM', 'Name', 'Grade'], $rows);
    }
}

$service = new ExportService();
echo $service->exportStudentGrades($students, new CsvExporterFactory());
```

**What changed:**

- `ExportService` depends on `ReportExporterFactory` (abstraction) instead of `PdfExporter`, `CsvExporter`, and `ExcelExporter` (concretions).
- Adding a new format (e.g., `JsonExporter`) means creating `JsonExporter` and `JsonExporterFactory` — zero changes to `ExportService` or any existing factory.
- Each factory encapsulates its product's construction details. The caller does not need to know that `PdfExporter` wants `A4` or that `ExcelExporter` takes a sheet name.
- The `match` or `switch` that selects a factory lives at the application boundary (controller or DI container), not inside business logic.

### Factory Method vs Abstract Factory

The **Factory Method** pattern (shown above) uses inheritance: each concrete factory subclass creates one type of product. It answers "how do I create a family member?"

The **Abstract Factory** pattern creates *families* of related products through composition. For example, if you also needed a `ChartRenderer` alongside your `ReportExporter`, an `ExportToolkit` abstract factory could create both `ReportExporter` and `ChartRenderer` together — ensuring PDF reports always pair with PDF charts.

### When to Use (and When Not to Use) the Factory Method Pattern

| Use When... | Avoid When... |
|---|---|
| Object creation involves logic or configuration that should not be repeated at every call site. | The object can be created with a simple `new` statement and no configuration. |
| You want to centralise which concrete class is instantiated so you can swap it in one place. | There is only one concrete implementation and no plausible second one in the foreseeable future. |
| The client should depend on an interface, not on a concrete class (Dependency Inversion). | The concrete class is a value object or DTO with no behaviour — a factory adds ceremony without value. |
| You are already using a DI container — factory wiring is a natural fit there. | The factory itself becomes a dumping ground for unrelated creation logic ("god factory"). |

</section>

<section lang="id">

## Pola 3: Factory Method Pattern

### Motivasi Dunia Nyata

Platform kampus Anda perlu menghasilkan laporan dalam berbagai format: PDF untuk transkrip resmi, CSV untuk ekspor data, dan Excel untuk spreadsheet administratif. Setiap format memerlukan library yang berbeda (`Dompdf`, `PhpSpreadsheet`, `fputcsv` native) dan konfigurasi yang berbeda. Menaburkan statement `new` di seluruh controller menciptakan coupling tersembunyi:

```php
<?php

class ReportController
{
    public function export(string $format, array $data)
    {
        if ($format === 'pdf') {
            $report = new PdfReport('A4', 'landscape');
        } elseif ($format === 'csv') {
            $report = new CsvReport(',', true);
        } elseif ($format === 'excel') {
            $report = new ExcelReport('Sheet1', true);
        } else {
            throw new \InvalidArgumentException("Unknown format: $format");
        }

        return $report->generate($data);
    }
}
```

Setiap format laporan baru berarti mengedit controller, dan setiap controller yang membutuhkan laporan menduplikasi rantai `if`/`elseif` ini.

### Before: Code Smell

```php
<?php

class ExportService
{
    public function exportStudentGrades(array $students, string $format): string
    {
        // Persiapan data (logika bersama)
        $rows = [];
        foreach ($students as $s) {
            $rows[] = [$s['nim'], $s['name'], $s['grade']];
        }

        // Pembuatan + generasi spesifik format (concern yang diduplikasi)
        if ($format === 'pdf') {
            $report = new PdfExporter('A4', 'portrait');
            return $report->export('Nilai Mahasiswa', ['NIM', 'Nama', 'Nilai'], $rows);
        } elseif ($format === 'csv') {
            $report = new CsvExporter(',', '"');
            return $report->export('Nilai Mahasiswa', ['NIM', 'Nama', 'Nilai'], $rows);
        } elseif ($format === 'excel') {
            $report = new ExcelExporter();
            $report->setSheetName('Nilai');
            return $report->export('Nilai Mahasiswa', ['NIM', 'Nama', 'Nilai'], $rows);
        }

        throw new \InvalidArgumentException("Format ekspor tidak didukung: $format");
    }
}

$service = new ExportService();
echo $service->exportStudentGrades($students, 'csv');
```

**Masalah:**

- `ExportService` tahu cara mengonstruksi tiga kelas exporter yang berbeda — ia bergantung pada setiap exporter konkret.
- Rantai `if`/`elseif` diduplikasi di setiap controller yang membutuhkan ekspor (invoice, attendance, transkrip).
- Mengonfigurasi konstruktor exporter (ukuran kertas, delimiter, nama sheet) membocorkan detail implementasi ke lapisan service.

### After: Factory Method Pattern

Pola **Factory Method** mendefinisikan antarmuka untuk membuat objek, tetapi membiarkan subclass memutuskan kelas mana yang akan diinstansiasi. Client hanya bergantung pada antarmuka creator dan product abstrak — tidak pernah pada kelas konkret.

Langkah 1 — definisikan antarmuka product (laporan):

```php
<?php

interface ReportExporter
{
    public function export(string $title, array $headers, array $rows): string;
}
```

Langkah 2 — implementasikan product konkret:

```php
<?php

class PdfExporter implements ReportExporter
{
    private string $pageSize;
    private string $orientation;

    public function __construct(string $pageSize = 'A4', string $orientation = 'portrait')
    {
        $this->pageSize = $pageSize;
        $this->orientation = $orientation;
    }

    public function export(string $title, array $headers, array $rows): string
    {
        // Di produksi: gunakan Dompdf atau TCPDF
        return "[PDF] {$title} ({$this->pageSize} {$this->orientation}) — " . count($rows) . " baris";
    }
}

class CsvExporter implements ReportExporter
{
    private string $delimiter;
    private string $enclosure;

    public function __construct(string $delimiter = ',', string $enclosure = '"')
    {
        $this->delimiter = $delimiter;
        $this->enclosure = $enclosure;
    }

    public function export(string $title, array $headers, array $rows): string
    {
        $output = $this->enclosure . implode("{$this->enclosure}{$this->delimiter}{$this->enclosure}", $headers) . $this->enclosure . "\n";
        foreach ($rows as $row) {
            $output .= $this->enclosure . implode("{$this->enclosure}{$this->delimiter}{$this->enclosure}", $row) . $this->enclosure . "\n";
        }
        return $output;
    }
}

class ExcelExporter implements ReportExporter
{
    private string $sheetName;

    public function __construct(string $sheetName = 'Sheet1')
    {
        $this->sheetName = $sheetName;
    }

    public function export(string $title, array $headers, array $rows): string
    {
        // Di produksi: gunakan PhpSpreadsheet
        return "[Excel] {$title} (sheet: {$this->sheetName}) — " . count($rows) . " baris";
    }
}
```

Langkah 3 — definisikan antarmuka creator (factory):

```php
<?php

interface ReportExporterFactory
{
    public function createExporter(): ReportExporter;
}
```

Langkah 4 — implementasikan factory konkret:

```php
<?php

class PdfExporterFactory implements ReportExporterFactory
{
    public function createExporter(): ReportExporter
    {
        return new PdfExporter('A4', 'portrait');
    }
}

class CsvExporterFactory implements ReportExporterFactory
{
    public function createExporter(): ReportExporter
    {
        return new CsvExporter(',', '"');
    }
}

class ExcelExporterFactory implements ReportExporterFactory
{
    public function createExporter(): ReportExporter
    {
        return new ExcelExporter('Nilai Mahasiswa');
    }
}
```

Langkah 5 — refactor `ExportService` untuk menggunakan factory:

```php
<?php

class ExportService
{
    public function exportStudentGrades(array $students, ReportExporterFactory $factory): string
    {
        $rows = [];
        foreach ($students as $s) {
            $rows[] = [$s['nim'], $s['name'], $s['grade']];
        }

        $exporter = $factory->createExporter();
        return $exporter->export('Nilai Mahasiswa', ['NIM', 'Nama', 'Nilai'], $rows);
    }
}

$service = new ExportService();
echo $service->exportStudentGrades($students, new CsvExporterFactory());
```

**Apa yang berubah:**

- `ExportService` bergantung pada `ReportExporterFactory` (abstraksi) alih-alih `PdfExporter`, `CsvExporter`, dan `ExcelExporter` (konkresi).
- Menambahkan format baru (misalnya, `JsonExporter`) berarti membuat `JsonExporter` dan `JsonExporterFactory` — nol perubahan pada `ExportService` atau factory yang sudah ada.
- Setiap factory mengenkapsulasi detail konstruksi produknya. Pemanggil tidak perlu tahu bahwa `PdfExporter` menginginkan `A4` atau bahwa `ExcelExporter` menerima nama sheet.
- `match` atau `switch` yang memilih factory berada di batas aplikasi (controller atau DI container), bukan di dalam logika bisnis.

### Factory Method vs Abstract Factory

Pola **Factory Method** (ditunjukkan di atas) menggunakan inheritance: setiap subclass factory konkret membuat satu jenis produk. Ia menjawab "bagaimana cara membuat anggota keluarga?"

Pola **Abstract Factory** menciptakan *keluarga* produk yang terkait melalui composition. Misalnya, jika Anda juga membutuhkan `ChartRenderer` bersama `ReportExporter`, abstract factory `ExportToolkit` dapat membuat `ReportExporter` dan `ChartRenderer` bersama-sama — memastikan laporan PDF selalu berpasangan dengan chart PDF.

### Kapan Menggunakan (dan Kapan Tidak) Factory Method Pattern

| Gunakan Ketika... | Hindari Ketika... |
|---|---|
| Pembuatan objek melibatkan logika atau konfigurasi yang tidak boleh diulang di setiap titik pemanggilan. | Objek dapat dibuat dengan statement `new` sederhana dan tanpa konfigurasi. |
| Anda ingin memusatkan kelas konkret mana yang diinstansiasi sehingga Anda dapat menukarnya di satu tempat. | Hanya ada satu implementasi konkret dan tidak ada yang kedua yang masuk akal di masa mendatang. |
| Client harus bergantung pada antarmuka, bukan pada kelas konkret (Dependency Inversion). | Kelas konkret adalah value object atau DTO tanpa perilaku — factory menambahkan seremoni tanpa nilai. |
| Anda sudah menggunakan DI container — wiring factory adalah kecocokan alami di sana. | Factory itu sendiri menjadi tempat pembuangan untuk logika pembuatan yang tidak terkait ("god factory"). |

</section>

---

<section lang="en">

## Pattern Comparison

Here is a summary of the three patterns side by side so you can choose the right one:

| Aspect | Strategy | Observer | Factory Method |
|---|---|---|---|
| **GoF Category** | Behavioural | Behavioural | Creational |
| **Problem it solves** | Switching between algorithms at runtime without conditionals | Notifying multiple dependent objects when state changes | Decoupling object creation from business logic |
| **Key phrase** | "I have multiple ways to do X — let me plug in the one I want." | "When X happens, let Y, Z, and anyone else who cares know." | "I need an X, but I do not want to know how it is built." |
| **PHP keyword** | `interface` + multiple `implements` | `attach()` / `notify()` on subject | `interface` for factory + product |
| **Tests become** | One test class per strategy | One test per observer + one test for subject in isolation | One test per factory + one test per product |
| **Overuse risk** | "Strategy for everything" — a strategy interface for a single-line `if` | "Observer spaghetti" — too many observers without clear contracts | "Factory explosion" — a factory for every `new` statement |

</section>

<section lang="id">

## Perbandingan Pola

Berikut adalah ringkasan ketiga pola berdampingan sehingga Anda dapat memilih yang tepat:

| Aspek | Strategy | Observer | Factory Method |
|---|---|---|---|
| **Kategori GoF** | Behavioural | Behavioural | Creational |
| **Masalah yang dipecahkan** | Berganti algoritma saat runtime tanpa kondisional | Memberitahu beberapa objek dependen ketika status berubah | Memisahkan pembuatan objek dari logika bisnis |
| **Frasa kunci** | "Saya punya beberapa cara untuk melakukan X — biarkan saya pasang yang saya inginkan." | "Ketika X terjadi, beri tahu Y, Z, dan siapa pun yang peduli." | "Saya butuh X, tetapi saya tidak ingin tahu bagaimana ia dibuat." |
| **Keyword PHP** | `interface` + beberapa `implements` | `attach()` / `notify()` pada subject | `interface` untuk factory + product |
| **Pengujian menjadi** | Satu kelas uji per strategi | Satu uji per observer + satu uji untuk subject dalam isolasi | Satu uji per factory + satu uji per product |
| **Risiko penggunaan berlebihan** | "Strategy untuk segalanya" — antarmuka strategi untuk `if` satu baris | "Observer spaghetti" — terlalu banyak observer tanpa kontrak yang jelas | "Factory explosion" — factory untuk setiap statement `new` |

</section>

---

<section lang="en">

## Common Pitfalls

Design patterns are powerful, but they have sharp edges. Here are the three most common ways developers shoot themselves in the foot with patterns:

### 1. Patterns Before Problems (Over-Engineering)

Writing a Strategy interface and three concrete strategies for a discount that has never changed and never will is not engineering — it is résumé padding. **The pattern must solve a real, current problem.** If your `if`/`else` has two branches and no foreseeable third, leave it alone.

**Red flag:** You spend more time writing interfaces and factories than you spend writing the actual business logic.

**Rule of thumb:** Refactor to a pattern when the second variant arrives. Do not pre-empt the third.

### 2. Pattern Misuse (Wrong Tool for the Job)

- **Singleton masquerading as Factory:** A `DatabaseFactory` that always returns the same `Database` instance (because it caches a static property) is not a factory — it is a Singleton with extra steps.
- **Observer used like a queue:** If observers must run in order and the failure of observer 2 must cancel observer 1's work, you need a transactional pipeline or a message queue — not Observer.
- **Strategy used like configuration:** If your "strategies" only differ by numeric values (e.g., `TaxFixedAmount` vs `TaxPercentage`), you do not need Strategy — you need a single `TaxCalculator` with configuration parameters.

### 3. Premature Abstraction

Abstracting too early locks you into a shape you do not yet understand. Write the concrete implementation first. When duplication emerges across three or more places, *then* extract the interface and the pattern. The cost of premature abstraction (wrong abstraction, rigid interface) is far higher than the cost of temporary duplication.

> "Duplication is far cheaper than the wrong abstraction." — Sandi Metz

</section>

<section lang="id">

## Jebakan Umum

Design patterns sangat kuat, tetapi mereka memiliki sisi tajam. Berikut adalah tiga cara paling umum pengembang menembak kaki mereka sendiri dengan pola:

### 1. Pola Sebelum Masalah (Over-Engineering)

Menulis antarmuka Strategy dan tiga strategi konkret untuk diskon yang tidak pernah berubah dan tidak akan pernah berubah bukanlah rekayasa — itu adalah padding résumé. **Pola harus menyelesaikan masalah nyata saat ini.** Jika `if`/`else` Anda memiliki dua cabang dan tidak ada cabang ketiga yang terlihat, biarkan saja.

**Red flag:** Anda menghabiskan lebih banyak waktu menulis antarmuka dan factory daripada menulis logika bisnis yang sebenarnya.

**Rule of thumb:** Refactor ke pola ketika varian kedua tiba. Jangan mengantisipasi yang ketiga.

### 2. Penyalahgunaan Pola (Alat yang Salah untuk Pekerjaan)

- **Singleton menyamar sebagai Factory:** `DatabaseFactory` yang selalu mengembalikan instance `Database` yang sama (karena ia menyimpan properti statis) bukanlah factory — ia adalah Singleton dengan langkah tambahan.
- **Observer digunakan seperti queue:** Jika observer harus berjalan berurutan dan kegagalan observer 2 harus membatalkan pekerjaan observer 1, Anda membutuhkan pipeline transaksional atau message queue — bukan Observer.
- **Strategy digunakan seperti konfigurasi:** Jika "strategi" Anda hanya berbeda dalam nilai numerik (misalnya, `TaxFixedAmount` vs `TaxPercentage`), Anda tidak membutuhkan Strategy — Anda membutuhkan `TaxCalculator` tunggal dengan parameter konfigurasi.

### 3. Abstraksi Prematur

Mengabstraksi terlalu dini mengunci Anda ke dalam bentuk yang belum Anda pahami. Tulis implementasi konkret terlebih dahulu. Ketika duplikasi muncul di tiga tempat atau lebih, *baru* ekstrak antarmuka dan polanya. Biaya abstraksi prematur (abstraksi yang salah, antarmuka yang kaku) jauh lebih tinggi daripada biaya duplikasi sementara.

> "Duplikasi jauh lebih murah daripada abstraksi yang salah." — Sandi Metz

</section>

---

<section lang="en">

## When to Use Patterns (and When to Stop)

Patterns are tools, not trophies. The goal is not to maximise the number of patterns in your codebase — it is to write software that is easy to understand, modify, and extend. Here is a decision framework:

### Start with a Pattern When...

- You have at least **two concrete variants** of an algorithm or product.
- The set of variants **changes independently** of the code that uses them.
- The pattern **solves a problem you actually have today**, not a problem you might have next year.
- The pattern makes the code **simpler to read**, not more complex. If a junior developer cannot trace the flow in under five minutes, the abstraction is too deep.

### Stop (Revert) When...

- The interface has only one implementation — **YAGNI** (You Ain't Gonna Need It).
- Debugging requires stepping through six files for a simple operation.
- The pattern is adding ceremony without reducing coupling — e.g., a factory whose only job is `return new ConcreteClass()` with no configuration.
- Onboarding time for new team members is increasing because of pattern-heavy code.

### A Practical Decision Table

| Situation | Recommendation |
|---|---|
| Two discount types, unlikely to grow beyond four. | Simple `match` statement or configuration array. |
| Two discount types, marketing department adds a new one every quarter. | Strategy pattern. |
| One event (enrolment) triggers exactly one side effect (email). | Direct call. No Observer. |
| One event triggers email, SMS, push notification, analytics, and audit log. | Observer pattern. |
| One report format (PDF) used everywhere. | Direct `new PdfExporter()`. |
| Three report formats selected at runtime, each with different constructor config. | Factory Method. |
| You are building a framework or library consumed by unknown users. | Patterns make sense earlier — you control the contract, users provide the implementations. |

</section>

<section lang="id">

## Kapan Menggunakan Pola (dan Kapan Berhenti)

Pola adalah alat, bukan trofi. Tujuannya bukan memaksimalkan jumlah pola dalam basis kode Anda — melainkan menulis perangkat lunak yang mudah dipahami, dimodifikasi, dan diperluas. Berikut adalah kerangka keputusan:

### Mulai dengan Pola Ketika...

- Anda memiliki setidaknya **dua varian konkret** dari suatu algoritma atau produk.
- Kumpulan varian **berubah secara independen** dari kode yang menggunakannya.
- Pola **menyelesaikan masalah yang benar-benar Anda miliki hari ini**, bukan masalah yang mungkin Anda miliki tahun depan.
- Pola membuat kode **lebih mudah dibaca**, bukan lebih kompleks. Jika pengembang junior tidak dapat melacak alur dalam waktu kurang dari lima menit, abstraksinya terlalu dalam.

### Berhenti (Kembalikan) Ketika...

- Antarmuka hanya memiliki satu implementasi — **YAGNI** (You Ain't Gonna Need It).
- Debugging memerlukan melangkah melalui enam file untuk operasi sederhana.
- Pola menambahkan seremoni tanpa mengurangi coupling — misalnya, factory yang tugasnya hanya `return new ConcreteClass()` tanpa konfigurasi.
- Waktu onboarding untuk anggota tim baru meningkat karena kode yang dipenuhi pola.

### Tabel Keputusan Praktis

| Situasi | Rekomendasi |
|---|---|
| Dua jenis diskon, tidak mungkin bertambah lebih dari empat. | Statement `match` sederhana atau array konfigurasi. |
| Dua jenis diskon, departemen pemasaran menambahkan yang baru setiap kuartal. | Strategy pattern. |
| Satu event (pendaftaran) memicu tepat satu efek samping (email). | Panggilan langsung. Tanpa Observer. |
| Satu event memicu email, SMS, push notification, analytics, dan audit log. | Observer pattern. |
| Satu format laporan (PDF) digunakan di mana-mana. | Langsung `new PdfExporter()`. |
| Tiga format laporan dipilih saat runtime, masing-masing dengan konfigurasi konstruktor berbeda. | Factory Method. |
| Anda membangun framework atau library yang digunakan oleh pengguna yang tidak dikenal. | Pola masuk akal lebih awal — Anda mengontrol kontrak, pengguna menyediakan implementasi. |

</section>

---

<section lang="en">

## Practice Exercise: Refactor a PaymentGateway

Now it is your turn. Below is a messy `PaymentGateway` class that handles multiple payment methods with a `switch` statement and hard-coded logic. Your task is to refactor it using the **Strategy pattern**.

### The Messy Code

```php
<?php

class PaymentGateway
{
    private string $apiKey;

    public function __construct(string $apiKey)
    {
        $this->apiKey = $apiKey;
    }

    public function pay(array $order, string $method): array
    {
        switch ($method) {
            case 'credit_card':
                $fee = $order['amount'] * 0.025;
                $total = $order['amount'] + $fee;
                // Simulated API call
                $result = $this->callApi('card', [
                    'key'    => $this->apiKey,
                    'number' => $order['card_number'],
                    'amount' => $total,
                ]);
                return ['status' => $result ? 'paid' : 'failed', 'method' => 'credit_card', 'total' => $total];

            case 'bank_transfer':
                $fee = 5000;
                $total = $order['amount'] + $fee;
                $result = $this->callApi('bank', [
                    'key'    => $this->apiKey,
                    'bank'   => $order['bank_code'],
                    'amount' => $total,
                ]);
                return ['status' => $result ? 'paid' : 'failed', 'method' => 'bank_transfer', 'total' => $total];

            case 'e_wallet':
                $fee = $order['amount'] * 0.015;
                if ($fee < 2500) {
                    $fee = 2500;
                }
                $total = $order['amount'] + $fee;
                $result = $this->callApi('wallet', [
                    'key'    => $this->apiKey,
                    'wallet' => $order['wallet_id'],
                    'amount' => $total,
                ]);
                return ['status' => $result ? 'paid' : 'failed', 'method' => 'e_wallet', 'total' => $total];

            default:
                throw new \InvalidArgumentException("Unknown payment method: $method");
        }
    }

    private function callApi(string $endpoint, array $data): bool
    {
        // Simulated — always succeeds in this exercise
        return true;
    }
}

$gateway = new PaymentGateway('sk_live_abc123');
$result = $gateway->pay(
    ['amount' => 150000, 'card_number' => '4111111111111111'],
    'credit_card'
);
print_r($result);
```

### Your Task

1. **Define a `PaymentMethod` interface** with a single method `process(array $order): array`.
2. **Create concrete strategy classes** — `CreditCardPayment`, `BankTransferPayment`, `EwalletPayment` — each implementing `PaymentMethod`.
3. **Refactor `PaymentGateway`** so that `pay()` accepts a `PaymentMethod` instead of a `$method` string. The `$apiKey` should still be available to strategies.
4. **Write a factory or `match`** at the boundary (e.g., in a controller) that maps strings to strategy instances.

### Expected Behaviour After Refactor

```
Input: amount=150000, method=CreditCardPayment
Output: ['status' => 'paid', 'method' => 'credit_card', 'total' => 153750]

Input: amount=150000, method=BankTransferPayment
Output: ['status' => 'paid', 'method' => 'bank_transfer', 'total' => 155000]

Input: amount=150000, method=EwalletPayment
Output: ['status' => 'paid', 'method' => 'e_wallet', 'total' => 152500]  // 1.5% fee (above minimum)
```

Try refactoring yourself before checking the solution below.

### One Possible Solution

```php
<?php

interface PaymentMethod
{
    public function process(float $amount, array $orderDetails): array;
}

class CreditCardPayment implements PaymentMethod
{
    public function process(float $amount, array $orderDetails): array
    {
        $fee = $amount * 0.025;
        $total = $amount + $fee;

        // In production: actual card API call using $orderDetails['card_number']
        return ['status' => 'paid', 'method' => 'credit_card', 'total' => $total];
    }
}

class BankTransferPayment implements PaymentMethod
{
    public function process(float $amount, array $orderDetails): array
    {
        $fee = 5000;
        $total = $amount + $fee;

        // In production: actual bank API call using $orderDetails['bank_code']
        return ['status' => 'paid', 'method' => 'bank_transfer', 'total' => $total];
    }
}

class EwalletPayment implements PaymentMethod
{
    private const FEE_RATE = 0.015;
    private const MINIMUM_FEE = 2500;

    public function process(float $amount, array $orderDetails): array
    {
        $fee = max($amount * self::FEE_RATE, self::MINIMUM_FEE);
        $total = $amount + $fee;

        // In production: actual e-wallet API call using $orderDetails['wallet_id']
        return ['status' => 'paid', 'method' => 'e_wallet', 'total' => $total];
    }
}

class PaymentGateway
{
    private string $apiKey;

    public function __construct(string $apiKey)
    {
        $this->apiKey = $apiKey;
    }

    public function pay(array $order, PaymentMethod $method): array
    {
        return $method->process($order['amount'], $order);
    }
}

// Boundary — maps request input to strategy
function resolvePaymentMethod(string $methodName): PaymentMethod
{
    return match ($methodName) {
        'credit_card'   => new CreditCardPayment(),
        'bank_transfer' => new BankTransferPayment(),
        'e_wallet'      => new EwalletPayment(),
        default         => throw new \InvalidArgumentException("Unknown payment method: $methodName"),
    };
}

// Usage
$gateway = new PaymentGateway('sk_live_abc123');
$strategy = resolvePaymentMethod('credit_card');
$result = $gateway->pay(
    ['amount' => 150000, 'card_number' => '4111111111111111'],
    $strategy
);
print_r($result);
```

Compare with the original: adding a new payment method (`QRIS`, `PayLater`) means creating one new class and adding one line to `resolvePaymentMethod()`. Zero changes to `PaymentGateway` or any existing strategy. Every strategy is independently testable.

</section>

<section lang="id">

## Latihan Praktik: Refactor PaymentGateway

Sekarang giliran Anda. Di bawah ini adalah kelas `PaymentGateway` yang berantakan yang menangani beberapa metode pembayaran dengan statement `switch` dan logika hard-coded. Tugas Anda adalah melakukan refactor menggunakan **Strategy pattern**.

### Kode yang Berantakan

```php
<?php

class PaymentGateway
{
    private string $apiKey;

    public function __construct(string $apiKey)
    {
        $this->apiKey = $apiKey;
    }

    public function pay(array $order, string $method): array
    {
        switch ($method) {
            case 'credit_card':
                $fee = $order['amount'] * 0.025;
                $total = $order['amount'] + $fee;
                // Simulasi panggilan API
                $result = $this->callApi('card', [
                    'key'    => $this->apiKey,
                    'number' => $order['card_number'],
                    'amount' => $total,
                ]);
                return ['status' => $result ? 'paid' : 'failed', 'method' => 'credit_card', 'total' => $total];

            case 'bank_transfer':
                $fee = 5000;
                $total = $order['amount'] + $fee;
                $result = $this->callApi('bank', [
                    'key'    => $this->apiKey,
                    'bank'   => $order['bank_code'],
                    'amount' => $total,
                ]);
                return ['status' => $result ? 'paid' : 'failed', 'method' => 'bank_transfer', 'total' => $total];

            case 'e_wallet':
                $fee = $order['amount'] * 0.015;
                if ($fee < 2500) {
                    $fee = 2500;
                }
                $total = $order['amount'] + $fee;
                $result = $this->callApi('wallet', [
                    'key'    => $this->apiKey,
                    'wallet' => $order['wallet_id'],
                    'amount' => $total,
                ]);
                return ['status' => $result ? 'paid' : 'failed', 'method' => 'e_wallet', 'total' => $total];

            default:
                throw new \InvalidArgumentException("Metode pembayaran tidak dikenal: $method");
        }
    }

    private function callApi(string $endpoint, array $data): bool
    {
        // Simulasi — selalu berhasil dalam latihan ini
        return true;
    }
}

$gateway = new PaymentGateway('sk_live_abc123');
$result = $gateway->pay(
    ['amount' => 150000, 'card_number' => '4111111111111111'],
    'credit_card'
);
print_r($result);
```

### Tugas Anda

1. **Definisikan antarmuka `PaymentMethod`** dengan satu metode `process(array $order): array`.
2. **Buat kelas strategi konkret** — `CreditCardPayment`, `BankTransferPayment`, `EwalletPayment` — masing-masing mengimplementasikan `PaymentMethod`.
3. **Refactor `PaymentGateway`** sehingga `pay()` menerima `PaymentMethod`, bukan string `$method`. `$apiKey` harus tetap tersedia untuk strategi.
4. **Tulis factory atau `match`** di batas (misalnya, di controller) yang memetakan string ke instance strategi.

### Perilaku yang Diharapkan Setelah Refactor

```
Input: amount=150000, method=CreditCardPayment
Output: ['status' => 'paid', 'method' => 'credit_card', 'total' => 153750]

Input: amount=150000, method=BankTransferPayment
Output: ['status' => 'paid', 'method' => 'bank_transfer', 'total' => 155000]

Input: amount=150000, method=EwalletPayment
Output: ['status' => 'paid', 'method' => 'e_wallet', 'total' => 152500]  // biaya 1.5% (di atas minimum)
```

Coba refactor sendiri sebelum memeriksa solusi di bawah ini.

### Salah Satu Solusi yang Mungkin

```php
<?php

interface PaymentMethod
{
    public function process(float $amount, array $orderDetails): array;
}

class CreditCardPayment implements PaymentMethod
{
    public function process(float $amount, array $orderDetails): array
    {
        $fee = $amount * 0.025;
        $total = $amount + $fee;

        // Di produksi: panggilan API kartu aktual menggunakan $orderDetails['card_number']
        return ['status' => 'paid', 'method' => 'credit_card', 'total' => $total];
    }
}

class BankTransferPayment implements PaymentMethod
{
    public function process(float $amount, array $orderDetails): array
    {
        $fee = 5000;
        $total = $amount + $fee;

        // Di produksi: panggilan API bank aktual menggunakan $orderDetails['bank_code']
        return ['status' => 'paid', 'method' => 'bank_transfer', 'total' => $total];
    }
}

class EwalletPayment implements PaymentMethod
{
    private const FEE_RATE = 0.015;
    private const MINIMUM_FEE = 2500;

    public function process(float $amount, array $orderDetails): array
    {
        $fee = max($amount * self::FEE_RATE, self::MINIMUM_FEE);
        $total = $amount + $fee;

        // Di produksi: panggilan API e-wallet aktual menggunakan $orderDetails['wallet_id']
        return ['status' => 'paid', 'method' => 'e_wallet', 'total' => $total];
    }
}

class PaymentGateway
{
    private string $apiKey;

    public function __construct(string $apiKey)
    {
        $this->apiKey = $apiKey;
    }

    public function pay(array $order, PaymentMethod $method): array
    {
        return $method->process($order['amount'], $order);
    }
}

// Batas — memetakan input request ke strategi
function resolvePaymentMethod(string $methodName): PaymentMethod
{
    return match ($methodName) {
        'credit_card'   => new CreditCardPayment(),
        'bank_transfer' => new BankTransferPayment(),
        'e_wallet'      => new EwalletPayment(),
        default         => throw new \InvalidArgumentException("Metode pembayaran tidak dikenal: $methodName"),
    };
}

// Penggunaan
$gateway = new PaymentGateway('sk_live_abc123');
$strategy = resolvePaymentMethod('credit_card');
$result = $gateway->pay(
    ['amount' => 150000, 'card_number' => '4111111111111111'],
    $strategy
);
print_r($result);
```

Bandingkan dengan yang asli: menambahkan metode pembayaran baru (`QRIS`, `PayLater`) berarti membuat satu kelas baru dan menambahkan satu baris ke `resolvePaymentMethod()`. Nol perubahan pada `PaymentGateway` atau strategi yang sudah ada. Setiap strategi dapat diuji secara independen.

</section>

---

<section lang="en">

## Summary

1. **Design patterns are shared vocabulary** for common object-oriented design problems. They let you communicate complex ideas in one word.
2. **Strategy** lets you swap algorithms at runtime by encapsulating each variant behind a common interface. Use it when you have multiple algorithms that change independently of their context.
3. **Observer** decouples a subject from its dependents by defining a one-to-many notification mechanism. Use it when one event triggers multiple, independently maintainable side effects.
4. **Factory Method** delegates object creation to subclasses, so calling code depends on abstractions, not concrete classes. Use it when object construction involves non-trivial configuration or you need to centralise which class gets instantiated.
5. **Do not pattern everything.** Write concrete code first. Refactor to a pattern when a real problem emerges — not before. The wrong abstraction costs more than temporary duplication.
6. **Practise deliberately.** The PaymentGateway exercise in this tutorial is a real refactoring sequence. Do it by hand. The muscle memory of extracting an interface, creating concrete strategies, and wiring them at the boundary is what makes patterns second nature.

> "Patterns are not a substitute for thinking. They are a starting point for thinking." — Ralph Johnson (GoF co-author)

## What to Read Next

- **[Clean Code Principles with PHP](/blog/clean-code-principles)** — Write readable, maintainable PHP classes before applying patterns to them.
- **[Test-Driven Development (TDD) with PHP](/blog/test-driven-development)** — Use TDD to verify your pattern-based refactors without breaking existing behaviour.
- **[Microservices Architecture Fundamentals with PHP](/blog/microservices-architecture-fundamentals)** — See how design patterns scale from classes to distributed services.
- **[Design Patterns: Elements of Reusable Object-Oriented Software](https://www.oreilly.com/library/view/design-patterns-elements/0201633612/)** by Gamma, Helm, Johnson, and Vlissides — The original GoF book.
- **[Head First Design Patterns (2nd Edition)](https://www.oreilly.com/library/view/head-first-design/9781492077992/)** by Freeman and Robson — A beginner-friendly, visually rich introduction.
- **[PHP: The Right Way — Design Patterns](https://phptherightway.com/pages/Design-Patterns.html)** — PHP-specific pattern examples and community best practices.

</section>

<section lang="id">

## Ringkasan

1. **Design patterns adalah kosakata bersama** untuk masalah desain berorientasi objek yang umum. Mereka memungkinkan Anda mengomunikasikan ide kompleks dalam satu kata.
2. **Strategy** memungkinkan Anda menukar algoritma saat runtime dengan mengenkapsulasi setiap varian di balik antarmuka bersama. Gunakan ketika Anda memiliki beberapa algoritma yang berubah secara independen dari konteksnya.
3. **Observer** memisahkan subject dari dependennya dengan mendefinisikan mekanisme notifikasi satu-ke-banyak. Gunakan ketika satu event memicu beberapa efek samping yang dapat dipelihara secara independen.
4. **Factory Method** mendelegasikan pembuatan objek ke subclass, sehingga kode pemanggil bergantung pada abstraksi, bukan kelas konkret. Gunakan ketika konstruksi objek melibatkan konfigurasi non-trivial atau Anda perlu memusatkan kelas mana yang diinstansiasi.
5. **Jangan mempola segalanya.** Tulis kode konkret terlebih dahulu. Refactor ke pola ketika masalah nyata muncul — bukan sebelumnya. Abstraksi yang salah lebih mahal daripada duplikasi sementara.
6. **Berlatih dengan sengaja.** Latihan PaymentGateway dalam tutorial ini adalah urutan refactoring nyata. Lakukan secara manual. Memori otot dari mengekstrak antarmuka, membuat strategi konkret, dan menghubungkannya di batas adalah apa yang membuat pola menjadi kebiasaan.

> "Pola bukanlah pengganti untuk berpikir. Mereka adalah titik awal untuk berpikir." — Ralph Johnson (rekan penulis GoF)

## Bacaan Selanjutnya

- **[Prinsip Clean Code dengan PHP](/blog/clean-code-principles)** — Tulis kelas PHP yang mudah dibaca dan dipelihara sebelum menerapkan pola padanya.
- **[Test-Driven Development (TDD) dengan PHP](/blog/test-driven-development)** — Gunakan TDD untuk memverifikasi refactor berbasis pola Anda tanpa merusak perilaku yang ada.
- **[Dasar-Dasar Arsitektur Microservices dengan PHP](/blog/microservices-architecture-fundamentals)** — Lihat bagaimana design patterns diskalakan dari kelas ke layanan terdistribusi.
- **[Design Patterns: Elements of Reusable Object-Oriented Software](https://www.oreilly.com/library/view/design-patterns-elements/0201633612/)** oleh Gamma, Helm, Johnson, dan Vlissides — Buku GoF asli.
- **[Head First Design Patterns (Edisi ke-2)](https://www.oreilly.com/library/view/head-first-design/9781492077992/)** oleh Freeman dan Robson — Pengenalan ramah pemula yang kaya visual.
- **[PHP: The Right Way — Design Patterns](https://phptherightway.com/pages/Design-Patterns.html)** — Contoh pola spesifik PHP dan praktik terbaik komunitas.

</section>
