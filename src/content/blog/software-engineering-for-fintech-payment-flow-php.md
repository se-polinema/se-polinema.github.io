---
title: "Software Engineering for Fintech: Secure Payment Flow with PHP"
titleId: "Rekayasa Perangkat Lunak untuk Fintech: Alur Pembayaran Aman dengan PHP"
date: 2026-07-06
updated: 2026-07-06
category: tutorial
author: SE Lab
lang: en
featured: false
stream: domain-specific-se-applications
tags:
  - Fintech
  - PHP
  - Payment
  - Security
  - Idempotency
tagsId:
  - Fintech
  - PHP
  - Pembayaran
  - Keamanan
  - Idempotensi
excerpt: "Learn how software engineering principles apply to financial technology. This tutorial covers building a secure payment flow in PHP with input validation, idempotency keys, append-only audit logs, and basic fraud detection guards."
excerptId: "Pelajari bagaimana prinsip-prinsip rekayasa perangkat lunak diterapkan pada teknologi keuangan. Tutorial ini membahas pembangunan alur pembayaran aman dalam PHP dengan validasi input, kunci idempotensi, log audit append-only, dan penjaga deteksi penipuan dasar."
---

<section lang="en">

## Why Fintech Software Is Different

**Money is not a CRUD resource.** When you update a blog post and the database writes fail, the user refreshes and tries again. When you transfer money and the database writes fail halfway — someone is missing funds, and the error is measured in real currency, not UX friction.

Fintech software carries constraints that most other domains never encounter:

| Constraint | Generic Software | Fintech Software |
|---|---|---|
| **Irreversibility** | Most operations are undoable (soft delete, rollback) | Payments are final. Refunds are separate transactions — never "undo." |
| **Compliance** | GDPR, cookie consent (external-facing) | PCI-DSS, AML, KYC, central-bank reporting (pervasive) |
| **Concurrency** | Optimistic locking is a nice-to-have | Double-spend prevention is existential |
| **Auditability** | Optional logging | Every mutation is a ledger entry — immutability is legally required |
| **Precision** | `float` rounding errors are cosmetic | One cent off breaks reconciliation; use integer cents or `decimal` |
| **Trust** | The user trusts the app to display data | The user, the merchant, the bank, and the regulator must all trust the system simultaneously |
| **Fraud surface** | Spam forms, SQL injection | Credential stuffing, account takeover, money laundering, chargeback fraud |

These constraints mean that **generic CRUD patterns are dangerous in fintech.** Every write must be atomic, every mutation must be recorded, and every operation must be idempotent — because a retried HTTP request should never result in a double charge.

</section>

<section lang="id">

## Mengapa Perangkat Lunak Fintech Berbeda

**Uang bukanlah sumber daya CRUD.** Ketika Anda memperbarui posting blog dan penulisan database gagal, pengguna menyegarkan dan mencoba lagi. Ketika Anda mentransfer uang dan penulisan database gagal di tengah jalan, seseorang kehilangan dana, dan kesalahannya diukur dalam mata uang nyata, bukan friksi UX.

Perangkat lunak fintech membawa batasan yang tidak pernah ditemui oleh sebagian besar domain lain:

| Batasan | Perangkat Lunak Generik | Perangkat Lunak Fintech |
|---|---|---|
| **Irreversibilitas** | Sebagian besar operasi dapat dibatalkan (*soft delete*, *rollback*) | Pembayaran bersifat final. *Refund* adalah transaksi terpisah, tidak pernah "undo." |
| **Kepatuhan** | GDPR, *cookie consent* (bersifat eksternal) | PCI-DSS, AML, KYC, pelaporan bank sentral (meluas) |
| **Konkurensi** | *Optimistic locking* adalah *nice-to-have* | Pencegahan *double-spend* adalah eksistensial |
| **Auditabilitas** | Pencatatan opsional | Setiap mutasi adalah entri buku besar, dan immutabilitas diwajibkan secara hukum |
| **Presisi** | Kesalahan pembulatan `float` bersifat kosmetik | Satu sen meleset merusak rekonsiliasi; gunakan integer sen atau `decimal` |
| **Kepercayaan** | Pengguna mempercayai aplikasi untuk menampilkan data | Pengguna, *merchant*, bank, dan regulator harus semuanya mempercayai sistem secara simultan |
| **Permukaan penipuan** | *Form spam*, *SQL injection* | *Credential stuffing*, pengambilalihan akun, pencucian uang, *chargeback fraud* |

Batasan ini berarti bahwa **pola CRUD generik berbahaya di fintech.** Setiap penulisan harus atomik, setiap mutasi harus dicatat, dan setiap operasi harus idempoten, karena permintaan HTTP yang dicoba ulang tidak boleh menghasilkan *double charge*.

</section>

---

<section lang="en">

## The Anatomy of a Secure Payment Flow

A payment is not a single database row update. It is a **pipeline** with guardrails at every stage. Here is the canonical flow:

```
Request → Validate → Check Idempotency → Authorise → Record → Confirm
```

| Stage | What Happens | Failure Mode |
|---|---|---|
| **Request** | Client sends `POST /payments` with amount, currency, payee, idempotency key | Missing fields, malformed JSON |
| **Validate** | Check amount range, currency support, payee existence, signature/HMAC | Invalid input, suspicious amount |
| **Check Idempotency** | Look up idempotency key; if already processed, return cached result | Prevents double charge on retry |
| **Authorise** | Check balance, apply fraud rules, reserve funds | Insufficient balance, velocity limit exceeded |
| **Record** | Write transaction to `transactions` table + append to `ledger` | Must be atomic — never debit without credit |
| **Confirm** | Return success with transaction ID + receipt payload | Network timeout after record — idempotency saves you here |

Every arrow in this pipeline can fail, and every failure must leave the system in a consistent state. That is what separates fintech engineering from general web development.

### Why This Pipeline Matters

Without explicit validation, you accept negative amounts. Without idempotency, a network retry charges twice. Without a ledger, you cannot prove what happened during a dispute. Without fraud guards, your system becomes a money-laundering vector.

Each stage in the pipeline is a **principle applied** — not just a step.

</section>

<section lang="id">

## Anatomi Alur Pembayaran Aman

Pembayaran bukanlah pembaruan satu baris database. Ini adalah **pipeline** dengan guardrail di setiap tahap. Berikut adalah alur kanoniknya:

```
Permintaan → Validasi → Periksa Idempotensi → Otorisasi → Catat → Konfirmasi
```

| Tahap | Yang Terjadi | Mode Kegagalan |
|---|---|---|
| **Permintaan** | Klien mengirim `POST /payments` dengan *amount*, *currency*, *payee*, *idempotency key* | *Field* hilang, JSON *malformed* |
| **Validasi** | Periksa rentang *amount*, dukungan *currency*, keberadaan *payee*, *signature*/HMAC | Input tidak valid, *amount* mencurigakan |
| **Periksa Idempotensi** | Cari *idempotency key*; jika sudah diproses, kembalikan hasil yang di-cache | Mencegah *double charge* saat *retry* |
| **Otorisasi** | Periksa saldo, terapkan aturan penipuan, cadangkan dana | Saldo tidak cukup, batas kecepatan terlampaui |
| **Catat** | Tulis transaksi ke tabel `transactions` + tambahkan ke `ledger` | Harus atomik, tidak pernah debit tanpa kredit |
| **Konfirmasi** | Kembalikan sukses dengan ID transaksi + *payload* tanda terima | *Timeout* jaringan setelah pencatatan, idempotensi menyelamatkan Anda di sini |

Setiap panah dalam pipeline ini dapat gagal, dan setiap kegagalan harus meninggalkan sistem dalam keadaan konsisten. Itulah yang membedakan rekayasa fintech dari pengembangan web umum.

### Mengapa Pipeline Ini Penting

Tanpa validasi eksplisit, Anda menerima *amount* negatif. Tanpa idempotensi, *retry* jaringan mengenakan biaya dua kali. Tanpa buku besar, Anda tidak dapat membuktikan apa yang terjadi selama sengketa. Tanpa penjaga penipuan, sistem Anda menjadi vektor pencucian uang.

Setiap tahap dalam pipeline adalah **prinsip yang diterapkan**, bukan sekadar langkah.

</section>

---

<section lang="en">

## Building a Minimal Payment Service in PHP

Before we write code, let us define the project structure. A modular monolith — a pattern we recommend for early-stage fintech projects — keeps bounded contexts separate without distributed-system overhead.

```
src/
├── Payment/
│   ├── Domain/
│   │   ├── Money.php              # Value object: amount + currency
│   │   ├── PaymentStatus.php      # Enum: pending, completed, failed, refunded
│   │   ├── PaymentResult.php      # DTO: success/failure with structured errors
│   │   ├── Transaction.php        # Entity: payment transaction record
│   │   └── LedgerEntry.php        # Value object: append-only audit entry
│   ├── Application/
│   │   ├── PaymentService.php           # Orchestrator: validate → idempotency → pay
│   │   ├── PaymentServiceInterface.php  # Contract for the payment service
│   │   └── FraudCheckService.php        # Fraud rule engine
│   └── Infrastructure/
│       ├── TransactionRepository.php       # Persistence for transactions
│       ├── LedgerRepository.php            # Append-only audit storage
│       └── IdempotencyKeyRepository.php    # Idempotency key store
├── Account/
│   └── Domain/
│       └── Account.php             # Entity: user account with balance
└── Shared/
    └── ValueObject.php             # Base value object
```

This structure keeps payment logic isolated. The `Account` module owns balances; the `Payment` module executes payments and records the ledger. They communicate through interfaces — never direct table access.

### Dependencies

Plain PHP with PDO for database access. No framework required. We assume a MySQL or PostgreSQL database.

</section>

<section lang="id">

## Membangun Layanan Pembayaran Minimal dalam PHP

Sebelum kita menulis kode, mari kita definisikan struktur proyek. *Modular monolith*, pola yang kami rekomendasikan untuk proyek fintech tahap awal, menjaga *bounded context* tetap terpisah tanpa *overhead* sistem terdistribusi.

```
src/
├── Payment/
│   ├── Domain/
│   │   ├── Money.php              # Value object: amount + currency
│   │   ├── PaymentStatus.php      # Enum: pending, completed, failed, refunded
│   │   ├── PaymentResult.php      # DTO: sukses/gagal dengan error terstruktur
│   │   ├── Transaction.php        # Entity: catatan transaksi pembayaran
│   │   └── LedgerEntry.php        # Value object: entri audit append-only
│   ├── Application/
│   │   ├── PaymentService.php           # Orkestrator: validasi → idempotensi → bayar
│   │   ├── PaymentServiceInterface.php  # Kontrak untuk layanan pembayaran
│   │   └── FraudCheckService.php        # Mesin aturan penipuan
│   └── Infrastructure/
│       ├── TransactionRepository.php       # Persistensi untuk transaksi
│       ├── LedgerRepository.php            # Penyimpanan audit append-only
│       └── IdempotencyKeyRepository.php    # Penyimpanan kunci idempotensi
├── Account/
│   └── Domain/
│       └── Account.php             # Entity: akun pengguna dengan saldo
└── Shared/
    └── ValueObject.php             # Value object dasar
```

Struktur ini menjaga logika pembayaran tetap terisolasi. Modul `Account` memiliki saldo; modul `Payment` mengeksekusi pembayaran dan mencatat buku besar. Mereka berkomunikasi melalui *interface*, tidak pernah akses tabel langsung.

### Dependensi

PHP biasa dengan PDO untuk akses database. Tidak diperlukan *framework*. Kita mengasumsikan database MySQL atau PostgreSQL.

</section>

---

<section lang="en">

## Input Validation & Sanitisation

In fintech, validation is your first and most important security layer. Invalid input that reaches the payment processor can cause anything from a confusing error to a financial loss.

### What to Validate

| Field | Rules | Rationale |
|---|---|---|
| `amount` | Strictly positive integer (in smallest currency unit, e.g., cents/sen) | No zero-amount payments. No negative amounts (that is a refund). No floating-point. |
| `currency` | Must be in allowed list (e.g., `IDR`, `USD`); normalise to uppercase | Prevents currency confusion and unsupported currency attempts |
| `payee_account_id` | Must exist, must be active, must not be the same as payer | Prevents self-payment and payments to closed accounts |
| `payer_account_id` | Must exist, must be active, must be authenticated | Only authenticated account holders can initiate payments |
| `idempotency_key` | Required, non-empty, max 64 chars, alphanumeric + hyphens | Every payment must be idempotent — this key is the contract |
| `metadata` | Optional JSON object, max 1 KB | Stores reference numbers, invoice IDs, notes; sanitise before storage |
| `signature` | HMAC-SHA256 of `amount|currency|payee|idempotency_key|timestamp` | Tamper detection between client and server |

### The Money Value Object

Never use `float` for money. Store amounts as integers in the smallest currency unit (cents for USD, sen for IDR). A value object enforces this at the type level:

```php
<?php

declare(strict_types=1);

namespace App\Payment\Domain;

use InvalidArgumentException;

class Money
{
    private const SUPPORTED_CURRENCIES = ['IDR', 'USD'];
    private const DECIMALS = [
        'IDR' => 2,
        'USD' => 2,
    ];

    private function __construct(
        public readonly int $amount,
        public readonly string $currency,
    ) {}

    public static function fromSmallestUnit(int $amount, string $currency): self
    {
        $currency = strtoupper($currency);

        if (!in_array($currency, self::SUPPORTED_CURRENCIES, true)) {
            throw new InvalidArgumentException(
                sprintf('Unsupported currency: %s.', $currency),
            );
        }

        if ($amount <= 0) {
            throw new InvalidArgumentException(
                sprintf('Amount must be positive, got %d.', $amount),
            );
        }

        return new self($amount, $currency);
    }

    public static function fromDecimal(float $decimal, string $currency): self
    {
        $currency = strtoupper($currency);
        $decimals = self::DECIMALS[$currency] ?? 2;
        $amount = (int) round($decimal * (10 ** $decimals));

        return self::fromSmallestUnit($amount, $currency);
    }

    public function toDecimal(): float
    {
        $decimals = self::DECIMALS[$this->currency] ?? 2;

        return $this->amount / (10 ** $decimals);
    }

    public function toString(): string
    {
        return number_format($this->toDecimal(), 2) . ' ' . $this->currency;
    }

    public function equals(self $other): bool
    {
        return $this->amount === $other->amount
            && $this->currency === $other->currency;
    }
}
```

### Payment Request Validator

```php
<?php

declare(strict_types=1);

namespace App\Payment\Application;

use App\Payment\Domain\Money;

class PaymentRequestValidator
{
    private const MAX_IDEMPOTENCY_KEY_LENGTH = 64;
    private const MAX_METADATA_SIZE = 1024;

    public function validate(array $request): array
    {
        $errors = [];

        if (empty($request['amount']) || !is_int($request['amount'])) {
            $errors[] = 'Amount is required and must be a positive integer (in smallest currency unit).';
        }

        if (empty($request['currency']) || !is_string($request['currency'])) {
            $errors[] = 'Currency is required (e.g., IDR, USD).';
        }

        if (empty($request['payee_account_id']) || !is_string($request['payee_account_id'])) {
            $errors[] = 'Payee account ID is required.';
        }

        if (empty($request['payer_account_id']) || !is_string($request['payer_account_id'])) {
            $errors[] = 'Payer account ID is required.';
        }

        if (
            !empty($request['payer_account_id'])
            && !empty($request['payee_account_id'])
            && $request['payer_account_id'] === $request['payee_account_id']
        ) {
            $errors[] = 'Payer and payee cannot be the same account.';
        }

        if (empty($request['idempotency_key']) || !is_string($request['idempotency_key'])) {
            $errors[] = 'Idempotency key is required.';
        } elseif (strlen($request['idempotency_key']) > self::MAX_IDEMPOTENCY_KEY_LENGTH) {
            $errors[] = sprintf(
                'Idempotency key must not exceed %d characters.',
                self::MAX_IDEMPOTENCY_KEY_LENGTH,
            );
        } elseif (!preg_match('/^[a-zA-Z0-9\-_]+$/', $request['idempotency_key'])) {
            $errors[] = 'Idempotency key must contain only alphanumeric characters, hyphens, and underscores.';
        }

        if (!empty($request['metadata'])) {
            $json = is_string($request['metadata'])
                ? $request['metadata']
                : json_encode($request['metadata']);

            if ($json === false || strlen($json) > self::MAX_METADATA_SIZE) {
                $errors[] = sprintf(
                    'Metadata must be valid JSON and not exceed %d bytes.',
                    self::MAX_METADATA_SIZE,
                );
            }
        }

        return $errors;
    }
}
```

Notice that validation errors are **structured and specific.** A message like `"Amount is required and must be a positive integer (in smallest currency unit)."` tells the API consumer exactly what they need to fix. Errors like `"ERR_001"` force developers to consult documentation for every integration.

</section>

<section lang="id">

## Validasi & Sanitasi Input

Dalam fintech, validasi adalah lapisan keamanan pertama dan terpenting Anda. Input tidak valid yang mencapai pemroses pembayaran dapat menyebabkan apa saja mulai dari kesalahan yang membingungkan hingga kerugian finansial.

### Yang Harus Divalidasi

| Field | Aturan | Alasan |
|---|---|---|
| `amount` | Integer positif ketat (dalam unit mata uang terkecil, misalnya, sen) | Tidak ada pembayaran nol. Tidak ada *amount* negatif (itu adalah *refund*). Tidak ada *floating-point*. |
| `currency` | Harus dalam daftar yang diizinkan (misalnya, `IDR`, `USD`); normalisasi ke huruf besar | Mencegah kebingungan mata uang dan percobaan mata uang yang tidak didukung |
| `payee_account_id` | Harus ada, harus aktif, tidak boleh sama dengan *payer* | Mencegah *self-payment* dan pembayaran ke akun yang ditutup |
| `payer_account_id` | Harus ada, harus aktif, harus terautentikasi | Hanya pemegang akun terautentikasi yang dapat memulai pembayaran |
| `idempotency_key` | Wajib, tidak kosong, maks 64 karakter, alfanumerik + strip | Setiap pembayaran harus idempoten, kunci ini adalah kontraknya |
| `metadata` | Objek JSON opsional, maks 1 KB | Menyimpan nomor referensi, ID invoice, catatan; sanitasi sebelum penyimpanan |
| `signature` | HMAC-SHA256 dari `amount\|currency\|payee\|idempotency_key\|timestamp` | Deteksi manipulasi antara klien dan server |

### Value Object Money

Jangan pernah menggunakan `float` untuk uang. Simpan *amount* sebagai integer dalam unit mata uang terkecil (sen untuk USD, rupiah untuk IDR). *Value object* menegakkan ini di tingkat tipe:

```php
<?php

declare(strict_types=1);

namespace App\Payment\Domain;

use InvalidArgumentException;

class Money
{
    private const SUPPORTED_CURRENCIES = ['IDR', 'USD'];
    private const DECIMALS = [
        'IDR' => 2,
        'USD' => 2,
    ];

    private function __construct(
        public readonly int $amount,
        public readonly string $currency,
    ) {}

    public static function fromSmallestUnit(int $amount, string $currency): self
    {
        $currency = strtoupper($currency);

        if (!in_array($currency, self::SUPPORTED_CURRENCIES, true)) {
            throw new InvalidArgumentException(
                sprintf('Mata uang tidak didukung: %s.', $currency),
            );
        }

        if ($amount <= 0) {
            throw new InvalidArgumentException(
                sprintf('Amount harus positif, dapat %d.', $amount),
            );
        }

        return new self($amount, $currency);
    }

    public static function fromDecimal(float $decimal, string $currency): self
    {
        $currency = strtoupper($currency);
        $decimals = self::DECIMALS[$currency] ?? 2;
        $amount = (int) round($decimal * (10 ** $decimals));

        return self::fromSmallestUnit($amount, $currency);
    }

    public function toDecimal(): float
    {
        $decimals = self::DECIMALS[$this->currency] ?? 2;

        return $this->amount / (10 ** $decimals);
    }

    public function toString(): string
    {
        return number_format($this->toDecimal(), 2) . ' ' . $this->currency;
    }

    public function equals(self $other): bool
    {
        return $this->amount === $other->amount
            && $this->currency === $other->currency;
    }
}
```

### Validator Permintaan Pembayaran

```php
<?php

declare(strict_types=1);

namespace App\Payment\Application;

use App\Payment\Domain\Money;

class PaymentRequestValidator
{
    private const MAX_IDEMPOTENCY_KEY_LENGTH = 64;
    private const MAX_METADATA_SIZE = 1024;

    public function validate(array $request): array
    {
        $errors = [];

        if (empty($request['amount']) || !is_int($request['amount'])) {
            $errors[] = 'Amount wajib diisi dan harus berupa integer positif (dalam unit mata uang terkecil).';
        }

        if (empty($request['currency']) || !is_string($request['currency'])) {
            $errors[] = 'Currency wajib diisi (misalnya, IDR, USD).';
        }

        if (empty($request['payee_account_id']) || !is_string($request['payee_account_id'])) {
            $errors[] = 'ID akun penerima wajib diisi.';
        }

        if (empty($request['payer_account_id']) || !is_string($request['payer_account_id'])) {
            $errors[] = 'ID akun pembayar wajib diisi.';
        }

        if (
            !empty($request['payer_account_id'])
            && !empty($request['payee_account_id'])
            && $request['payer_account_id'] === $request['payee_account_id']
        ) {
            $errors[] = 'Pembayar dan penerima tidak boleh akun yang sama.';
        }

        if (empty($request['idempotency_key']) || !is_string($request['idempotency_key'])) {
            $errors[] = 'Kunci idempotensi wajib diisi.';
        } elseif (strlen($request['idempotency_key']) > self::MAX_IDEMPOTENCY_KEY_LENGTH) {
            $errors[] = sprintf(
                'Kunci idempotensi tidak boleh melebihi %d karakter.',
                self::MAX_IDEMPOTENCY_KEY_LENGTH,
            );
        } elseif (!preg_match('/^[a-zA-Z0-9\-_]+$/', $request['idempotency_key'])) {
            $errors[] = 'Kunci idempotensi hanya boleh berisi karakter alfanumerik, strip, dan underscore.';
        }

        if (!empty($request['metadata'])) {
            $json = is_string($request['metadata'])
                ? $request['metadata']
                : json_encode($request['metadata']);

            if ($json === false || strlen($json) > self::MAX_METADATA_SIZE) {
                $errors[] = sprintf(
                    'Metadata harus berupa JSON valid dan tidak melebihi %d byte.',
                    self::MAX_METADATA_SIZE,
                );
            }
        }

        return $errors;
    }
}
```

Perhatikan bahwa kesalahan validasi **terstruktur dan spesifik.** Pesan seperti `"Amount wajib diisi dan harus berupa integer positif (dalam unit mata uang terkecil)."` memberi tahu konsumen API tepat apa yang perlu diperbaiki. Kesalahan seperti `"ERR_001"` memaksa pengembang untuk berkonsultasi dengan dokumentasi untuk setiap integrasi.

</section>

---

<section lang="en">

## Idempotency: Preventing Double Charges

**Idempotency is the single most important concept in payment systems.** It means that making the same request multiple times produces the same result as making it once. Without it, any network failure between a client and your server can result in a double charge.

### How It Works

1. The client generates a unique `idempotency_key` (typically a UUID v4) before each payment attempt.
2. The client sends the key in the `Idempotency-Key` HTTP header with every payment request.
3. The server stores the key → result mapping in a dedicated table.
4. If the server receives a key it has already processed, it returns the cached result — without executing the payment again.

This means the client can safely retry a payment request after a network timeout. If the first request succeeded, the retry returns the same result. If the first request failed, the retry processes normally.

### Idempotency Key Repository

```php
<?php

declare(strict_types=1);

namespace App\Payment\Infrastructure;

use PDO;
use DateTimeImmutable;

class IdempotencyKeyRepository
{
    public function __construct(
        private readonly PDO $pdo,
    ) {}

    public function find(string $key): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT idempotency_key, response_status, response_body, created_at
             FROM idempotency_keys
             WHERE idempotency_key = :key
             AND created_at > :expiry'
        );

        $stmt->execute([
            'key'    => $key,
            'expiry' => (new DateTimeImmutable('-24 hours'))->format('Y-m-d H:i:s'),
        ]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ?: null;
    }

    public function store(string $key, string $responseStatus, string $responseBody): void
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO idempotency_keys (idempotency_key, response_status, response_body)
             VALUES (:key, :status, :body)'
        );

        $stmt->execute([
            'key'    => $key,
            'status' => $responseStatus,
            'body'   => $responseBody,
        ]);
    }
}
```

Keys expire after 24 hours. After that, the same key can be reused. This prevents unbounded storage growth while covering the practical retry window.

### Schema

```sql
CREATE TABLE idempotency_keys (
    idempotency_key VARCHAR(64) PRIMARY KEY,
    response_status VARCHAR(20) NOT NULL,
    response_body JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at)
);
```

### Idempotency in the Payment Service

Later, in the full `PaymentService`, the idempotency check is the **first database operation** — before balance checks, before fraud rules, before the ledger write:

```php
$existing = $this->idempotencyRepo->find($request->idempotencyKey);
if ($existing !== null) {
    return json_decode($existing['response_body'], true);
}
```

This is a **read-before-write** pattern. The key lookup must be fast (primary key on `idempotency_key`). If found, the entire payment pipeline is skipped.

### The Client's Responsibility

The client must **never reuse an idempotency key for a different payment.** Each payment attempt must have a unique key. A common pattern:

```javascript
const idempotencyKey = crypto.randomUUID(); // fresh UUID for each attempt

async function pay(amount, payee) {
    const idempotencyKey = crypto.randomUUID();
    const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({ amount, payee, idempotency_key: idempotencyKey }),
    });

    // Safe to retry with the same key if network fails
    return response.json();
}
```

</section>

<section lang="id">

## Idempotensi: Mencegah Double Charge

**Idempotensi adalah konsep paling penting dalam sistem pembayaran.** Ini berarti bahwa membuat permintaan yang sama beberapa kali menghasilkan hasil yang sama seperti membuatnya sekali. Tanpanya, setiap kegagalan jaringan antara klien dan server Anda dapat mengakibatkan *double charge*.

### Cara Kerjanya

1. Klien menghasilkan `idempotency_key` unik (biasanya UUID v4) sebelum setiap percobaan pembayaran.
2. Klien mengirim kunci di header HTTP `Idempotency-Key` dengan setiap permintaan pembayaran.
3. Server menyimpan pemetaan kunci → hasil di tabel khusus.
4. Jika server menerima kunci yang sudah diproses, ia mengembalikan hasil yang di-cache, tanpa mengeksekusi pembayaran lagi.

Ini berarti klien dapat dengan aman mencoba ulang permintaan pembayaran setelah timeout jaringan. Jika permintaan pertama berhasil, percobaan ulang mengembalikan hasil yang sama. Jika permintaan pertama gagal, percobaan ulang diproses secara normal.

### Repository Kunci Idempotensi

```php
<?php

declare(strict_types=1);

namespace App\Payment\Infrastructure;

use PDO;
use DateTimeImmutable;

class IdempotencyKeyRepository
{
    public function __construct(
        private readonly PDO $pdo,
    ) {}

    public function find(string $key): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT idempotency_key, response_status, response_body, created_at
             FROM idempotency_keys
             WHERE idempotency_key = :key
             AND created_at > :expiry'
        );

        $stmt->execute([
            'key'    => $key,
            'expiry' => (new DateTimeImmutable('-24 jam'))->format('Y-m-d H:i:s'),
        ]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ?: null;
    }

    public function store(string $key, string $responseStatus, string $responseBody): void
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO idempotency_keys (idempotency_key, response_status, response_body)
             VALUES (:key, :status, :body)'
        );

        $stmt->execute([
            'key'    => $key,
            'status' => $responseStatus,
            'body'   => $responseBody,
        ]);
    }
}
```

Kunci kedaluwarsa setelah 24 jam. Setelah itu, kunci yang sama dapat digunakan kembali. Ini mencegah pertumbuhan penyimpanan tanpa batas sambil mencakup jendela percobaan ulang praktis.

### Skema

```sql
CREATE TABLE idempotency_keys (
    idempotency_key VARCHAR(64) PRIMARY KEY,
    response_status VARCHAR(20) NOT NULL,
    response_body JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at)
);
```

### Idempotensi dalam Layanan Pembayaran

Nanti, dalam `PaymentService` lengkap, pemeriksaan idempotensi adalah **operasi database pertama**, sebelum pemeriksaan saldo, sebelum aturan penipuan, sebelum penulisan buku besar:

```php
$existing = $this->idempotencyRepo->find($request->idempotencyKey);
if ($existing !== null) {
    return json_decode($existing['response_body'], true);
}
```

Ini adalah pola **read-before-write.** Pencarian kunci harus cepat (*primary key* pada `idempotency_key`). Jika ditemukan, seluruh pipeline pembayaran dilewati.

### Tanggung Jawab Klien

Klien **tidak boleh menggunakan kembali kunci idempotensi untuk pembayaran yang berbeda.** Setiap percobaan pembayaran harus memiliki kunci unik. Pola umum:

```javascript
const idempotencyKey = crypto.randomUUID(); // UUID baru untuk setiap percobaan

async function pay(amount, payee) {
    const idempotencyKey = crypto.randomUUID();
    const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({ amount, payee, idempotency_key: idempotencyKey }),
    });

    // Aman untuk mencoba ulang dengan kunci yang sama jika jaringan gagal
    return response.json();
}
```

</section>

---

<section lang="en">

## Transaction Integrity with a Ledger / Audit Log

A payment system without an audit log is a lawsuit waiting to happen. Every movement of money must leave a permanent, append-only record. This is called a **ledger** or **double-entry bookkeeping** — the same principle banks have used for centuries.

### Why Append-Only

| Operation | Allowed? | Why |
|---|---|---|
| INSERT into ledger | Yes | Every transaction creates a ledger entry |
| SELECT from ledger | Yes | Read for reconciliation and reporting |
| UPDATE on ledger | **No** | Once written, immutable — corrections are new entries, not edits |
| DELETE from ledger | **No** | Nothing is ever deleted — a voided transaction gets a reversing entry |

This means even a "cancelled" payment leaves a trail: the original debit entry and a matching credit entry that reverses it. Both stay in the ledger forever.

### The Ledger Repository

```php
<?php

declare(strict_types=1);

namespace App\Payment\Infrastructure;

use PDO;
use DateTimeImmutable;

class LedgerRepository
{
    public function __construct(
        private readonly PDO $pdo,
    ) {}

    public function appendEntry(array $entry): int
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO ledger (
                transaction_id, account_id, entry_type, amount, currency,
                balance_before, balance_after, description, created_at
            ) VALUES (
                :transaction_id, :account_id, :entry_type, :amount, :currency,
                :balance_before, :balance_after, :description, :created_at
            )'
        );

        $stmt->execute([
            'transaction_id' => $entry['transaction_id'],
            'account_id'     => $entry['account_id'],
            'entry_type'     => $entry['entry_type'],     // 'debit' or 'credit'
            'amount'         => $entry['amount'],
            'currency'       => $entry['currency'],
            'balance_before' => $entry['balance_before'],
            'balance_after'  => $entry['balance_after'],
            'description'    => $entry['description'],
            'created_at'     => (new DateTimeImmutable())->format('Y-m-d H:i:s'),
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    public function getBalance(string $accountId, string $currency): int
    {
        $stmt = $this->pdo->prepare(
            'SELECT COALESCE(SUM(CASE WHEN entry_type = ? THEN amount ELSE -amount END), 0) AS balance
             FROM ledger
             WHERE account_id = :account_id AND currency = :currency'
        );

        $stmt->execute(['account_id' => $accountId, 'currency' => $currency]);
        $stmt->bindValue(1, 'credit');

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return (int) ($result['balance'] ?? 0);
    }
}
```

### Ledger Schema

```sql
CREATE TABLE ledger (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(36) NOT NULL,
    account_id VARCHAR(36) NOT NULL,
    entry_type ENUM('debit', 'credit') NOT NULL COMMENT 'debit = money leaving, credit = money entering',
    amount INT NOT NULL COMMENT 'In smallest currency unit (cents/sen)',
    currency VARCHAR(3) NOT NULL,
    balance_before INT NOT NULL COMMENT 'Account balance before this entry',
    balance_after INT NOT NULL COMMENT 'Account balance after this entry',
    description VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_account_currency (account_id, currency),
    INDEX idx_transaction (transaction_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;
```

### A Payment Creates Two Ledger Entries

Every payment is a **double-entry** operation:

1. **Debit** the payer's account: money leaves the payer.
2. **Credit** the payee's account: money enters the payee.

Both entries share the same `transaction_id` for traceability. Both record `balance_before` and `balance_after` — so you can reconstruct any account's balance at any point in time without scanning the entire table.

This is not over-engineering. Central banks and auditors require this level of traceability for licensed payment providers.

</section>

<section lang="id">

## Integritas Transaksi dengan Buku Besar / Log Audit

Sistem pembayaran tanpa log audit adalah tuntutan hukum yang menunggu untuk terjadi. Setiap pergerakan uang harus meninggalkan catatan permanen yang hanya bisa ditambah. Ini disebut **buku besar (ledger)** atau **pembukuan double-entry**, prinsip yang sama yang telah digunakan bank selama berabad-abad.

### Mengapa Append-Only

| Operasi | Diizinkan? | Mengapa |
|---|---|---|
| INSERT ke ledger | Ya | Setiap transaksi membuat entri buku besar |
| SELECT dari ledger | Ya | Baca untuk rekonsiliasi dan pelaporan |
| UPDATE pada ledger | **Tidak** | Setelah ditulis, tidak dapat diubah; koreksi adalah entri baru, bukan edit |
| DELETE dari ledger | **Tidak** | Tidak ada yang pernah dihapus; transaksi yang dibatalkan mendapat entri pembalik |

Ini berarti bahkan pembayaran yang "dibatalkan" meninggalkan jejak: entri debit asli dan entri kredit yang cocok yang membalikkannya. Keduanya tetap di buku besar selamanya.

### Repository Buku Besar

```php
<?php

declare(strict_types=1);

namespace App\Payment\Infrastructure;

use PDO;
use DateTimeImmutable;

class LedgerRepository
{
    public function __construct(
        private readonly PDO $pdo,
    ) {}

    public function appendEntry(array $entry): int
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO ledger (
                transaction_id, account_id, entry_type, amount, currency,
                balance_before, balance_after, description, created_at
            ) VALUES (
                :transaction_id, :account_id, :entry_type, :amount, :currency,
                :balance_before, :balance_after, :description, :created_at
            )'
        );

        $stmt->execute([
            'transaction_id' => $entry['transaction_id'],
            'account_id'     => $entry['account_id'],
            'entry_type'     => $entry['entry_type'],     // 'debit' atau 'credit'
            'amount'         => $entry['amount'],
            'currency'       => $entry['currency'],
            'balance_before' => $entry['balance_before'],
            'balance_after'  => $entry['balance_after'],
            'description'    => $entry['description'],
            'created_at'     => (new DateTimeImmutable())->format('Y-m-d H:i:s'),
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    public function getBalance(string $accountId, string $currency): int
    {
        $stmt = $this->pdo->prepare(
            'SELECT COALESCE(SUM(CASE WHEN entry_type = ? THEN amount ELSE -amount END), 0) AS balance
             FROM ledger
             WHERE account_id = :account_id AND currency = :currency'
        );

        $stmt->execute(['account_id' => $accountId, 'currency' => $currency]);
        $stmt->bindValue(1, 'credit');

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return (int) ($result['balance'] ?? 0);
    }
}
```

### Skema Buku Besar

```sql
CREATE TABLE ledger (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(36) NOT NULL,
    account_id VARCHAR(36) NOT NULL,
    entry_type ENUM('debit', 'credit') NOT NULL COMMENT 'debit = uang keluar, credit = uang masuk',
    amount INT NOT NULL COMMENT 'Dalam unit mata uang terkecil (sen/rupiah)',
    currency VARCHAR(3) NOT NULL,
    balance_before INT NOT NULL COMMENT 'Saldo akun sebelum entri ini',
    balance_after INT NOT NULL COMMENT 'Saldo akun setelah entri ini',
    description VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_account_currency (account_id, currency),
    INDEX idx_transaction (transaction_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;
```

### Satu Pembayaran Membuat Dua Entri Buku Besar

Setiap pembayaran adalah operasi **double-entry**:

1. **Debit** akun pembayar: uang keluar dari pembayar.
2. **Credit** akun penerima: uang masuk ke penerima.

Kedua entri berbagi `transaction_id` yang sama untuk ketertelusuran. Keduanya mencatat `balance_before` dan `balance_after`, sehingga Anda dapat merekonstruksi saldo akun mana pun pada titik waktu mana pun tanpa memindai seluruh tabel.

Ini bukan *over-engineering*. Bank sentral dan auditor memerlukan tingkat ketertelusuran ini untuk penyedia pembayaran berlisensi.

</section>

---

<section lang="en">

## Basic Fraud and Safety Guards

Fraud is not a "nice to have" filter at the end of the payment pipeline. It is a set of **safety guards** that run before money moves. Each guard inspects the request against historical patterns and hard limits.

### Guard 1: Maximum Transaction Amount

Any single payment above a configurable threshold is rejected until manual approval. This limits exposure if an account is compromised.

```php
<?php

declare(strict_types=1);

namespace App\Payment\Application;

class FraudCheckService
{
    private const MAX_SINGLE_TRANSACTION_IDR = 10_000_000_00; // 10 million IDR in sen
    private const MAX_SINGLE_TRANSACTION_USD = 1_000_00;      // 1,000 USD in cents

    private const DAILY_VOLUME_LIMIT_IDR = 50_000_000_00;     // 50 million IDR / day
    private const DAILY_VOLUME_LIMIT_USD = 5_000_00;           // 5,000 USD / day

    private const VELOCITY_WINDOW_MINUTES = 5;
    private const MAX_TRANSACTIONS_IN_WINDOW = 10;

    public function __construct(
        private readonly \PDO $pdo,
    ) {}

    public function checkMaximumAmount(int $amount, string $currency): ?string
    {
        $limits = [
            'IDR' => self::MAX_SINGLE_TRANSACTION_IDR,
            'USD' => self::MAX_SINGLE_TRANSACTION_USD,
        ];

        $limit = $limits[$currency] ?? PHP_INT_MAX;

        if ($amount > $limit) {
            return sprintf(
                'Transaction amount %d %s exceeds maximum allowed %d %s.',
                $amount,
                $currency,
                $limit,
                $currency,
            );
        }

        return null;
    }
}
```

### Guard 2: Daily Volume Limit

Sum all completed payments from the same account in the last 24 hours. If the sum plus the new payment exceeds a daily cap, reject.

```php
public function checkDailyVolume(string $accountId, int $newAmount, string $currency): ?string
{
    $limits = [
        'IDR' => self::DAILY_VOLUME_LIMIT_IDR,
        'USD' => self::DAILY_VOLUME_LIMIT_USD,
    ];

    $limit = $limits[$currency] ?? PHP_INT_MAX;

    $stmt = $this->pdo->prepare(
        'SELECT COALESCE(SUM(amount), 0) AS total
         FROM transactions
         WHERE payer_account_id = :account_id
         AND currency = :currency
         AND status = :status
         AND created_at > :since'
    );

    $stmt->execute([
        'account_id' => $accountId,
        'currency'   => $currency,
        'status'     => 'completed',
        'since'      => (new \DateTimeImmutable('-24 hours'))->format('Y-m-d H:i:s'),
    ]);

    $row = $stmt->fetch(\PDO::FETCH_ASSOC);
    $todayTotal = (int) $row['total'];

    if (($todayTotal + $newAmount) > $limit) {
        return sprintf(
            'Daily volume limit exceeded. Current: %d, New: %d, Limit: %d %s.',
            $todayTotal,
            $newAmount,
            $limit,
            $currency,
        );
    }

    return null;
}
```

### Guard 3: Velocity Check

Too many payments in a short window is a strong fraud signal — especially for small amounts (card testing or credential stuffing).

```php
public function checkVelocity(string $accountId): ?string
{
    $stmt = $this->pdo->prepare(
        'SELECT COUNT(*) AS cnt
         FROM transactions
         WHERE payer_account_id = :account_id
         AND created_at > :since'
    );

    $stmt->execute([
        'account_id' => $accountId,
        'since'      => (new \DateTimeImmutable(
            sprintf('-%d minutes', self::VELOCITY_WINDOW_MINUTES)
        ))->format('Y-m-d H:i:s'),
    ]);

    $row = $stmt->fetch(\PDO::FETCH_ASSOC);

    if ((int) $row['cnt'] >= self::MAX_TRANSACTIONS_IN_WINDOW) {
        return sprintf(
            'Too many transactions. Maximum %d in %d minutes.',
            self::MAX_TRANSACTIONS_IN_WINDOW,
            self::VELOCITY_WINDOW_MINUTES,
        );
    }

    return null;
}
```

### Guard 4: Suspicious Round-Amount Check

Fraudsters often test with clean round numbers (e.g., exactly 10,000 IDR). Genuine payments rarely land on exact thousands.

```php
public function checkSuspiciousAmount(int $amount, string $currency): ?string
{
    $divisors = [
        'IDR' => 1_000_00,  // 1,000 IDR in sen
        'USD' => 1_00,      // 1 USD in cents
    ];

    $divisor = $divisors[$currency] ?? 1;

    if ($amount < 10_000_00 && $amount % $divisor === 0) {
        return 'Suspicious round amount detected. Payment flagged for review.';
    }

    return null;
}
```

### Running All Guards

The `PaymentService` runs all guards as a batch — collecting every violation:

```php
$fraudErrors = [];

$error = $this->fraudCheck->checkMaximumAmount($money->amount, $money->currency);
if ($error) {
    $fraudErrors[] = $error;
}

$error = $this->fraudCheck->checkDailyVolume($request->payerAccountId, $money->amount, $money->currency);
if ($error) {
    $fraudErrors[] = $error;
}

$error = $this->fraudCheck->checkVelocity($request->payerAccountId);
if ($error) {
    $fraudErrors[] = $error;
}

$error = $this->fraudCheck->checkSuspiciousAmount($money->amount, $money->currency);
if ($error) {
    $fraudErrors[] = $error;
}

if (!empty($fraudErrors)) {
    return PaymentResult::failure($fraudErrors);
}
```

Each guard is **independent** — one guard failing does not prevent other guards from running. The client receives all violations at once, so they can address every issue in one iteration.

</section>

<section lang="id">

## Penjaga Penipuan dan Keamanan Dasar

Penipuan bukanlah filter "nice to have" di akhir pipeline pembayaran. Ini adalah seperangkat **penjaga keamanan** yang berjalan sebelum uang bergerak. Setiap penjaga memeriksa permintaan terhadap pola historis dan batas keras.

### Penjaga 1: Jumlah Transaksi Maksimum

Setiap pembayaran tunggal di atas ambang batas yang dapat dikonfigurasi ditolak hingga persetujuan manual. Ini membatasi eksposur jika akun disusupi.

```php
<?php

declare(strict_types=1);

namespace App\Payment\Application;

class FraudCheckService
{
    private const MAX_SINGLE_TRANSACTION_IDR = 10_000_000_00; // 10 juta IDR dalam sen
    private const MAX_SINGLE_TRANSACTION_USD = 1_000_00;      // 1.000 USD dalam sen

    private const DAILY_VOLUME_LIMIT_IDR = 50_000_000_00;     // 50 juta IDR / hari
    private const DAILY_VOLUME_LIMIT_USD = 5_000_00;           // 5.000 USD / hari

    private const VELOCITY_WINDOW_MINUTES = 5;
    private const MAX_TRANSACTIONS_IN_WINDOW = 10;

    public function __construct(
        private readonly \PDO $pdo,
    ) {}

    public function checkMaximumAmount(int $amount, string $currency): ?string
    {
        $limits = [
            'IDR' => self::MAX_SINGLE_TRANSACTION_IDR,
            'USD' => self::MAX_SINGLE_TRANSACTION_USD,
        ];

        $limit = $limits[$currency] ?? PHP_INT_MAX;

        if ($amount > $limit) {
            return sprintf(
                'Jumlah transaksi %d %s melebihi maksimum yang diizinkan %d %s.',
                $amount,
                $currency,
                $limit,
                $currency,
            );
        }

        return null;
    }
}
```

### Penjaga 2: Batas Volume Harian

Jumlahkan semua pembayaran yang diselesaikan dari akun yang sama dalam 24 jam terakhir. Jika jumlah ditambah pembayaran baru melebihi batas harian, tolak.

```php
public function checkDailyVolume(string $accountId, int $newAmount, string $currency): ?string
{
    $limits = [
        'IDR' => self::DAILY_VOLUME_LIMIT_IDR,
        'USD' => self::DAILY_VOLUME_LIMIT_USD,
    ];

    $limit = $limits[$currency] ?? PHP_INT_MAX;

    $stmt = $this->pdo->prepare(
        'SELECT COALESCE(SUM(amount), 0) AS total
         FROM transactions
         WHERE payer_account_id = :account_id
         AND currency = :currency
         AND status = :status
         AND created_at > :since'
    );

    $stmt->execute([
        'account_id' => $accountId,
        'currency'   => $currency,
        'status'     => 'completed',
        'since'      => (new \DateTimeImmutable('-24 jam'))->format('Y-m-d H:i:s'),
    ]);

    $row = $stmt->fetch(\PDO::FETCH_ASSOC);
    $todayTotal = (int) $row['total'];

    if (($todayTotal + $newAmount) > $limit) {
        return sprintf(
            'Batas volume harian terlampaui. Saat ini: %d, Baru: %d, Batas: %d %s.',
            $todayTotal,
            $newAmount,
            $limit,
            $currency,
        );
    }

    return null;
}
```

### Penjaga 3: Pemeriksaan Kecepatan (Velocity)

Terlalu banyak pembayaran dalam jendela singkat adalah sinyal penipuan yang kuat, terutama untuk jumlah kecil (pengujian kartu atau *credential stuffing*).

```php
public function checkVelocity(string $accountId): ?string
{
    $stmt = $this->pdo->prepare(
        'SELECT COUNT(*) AS cnt
         FROM transactions
         WHERE payer_account_id = :account_id
         AND created_at > :since'
    );

    $stmt->execute([
        'account_id' => $accountId,
        'since'      => (new \DateTimeImmutable(
            sprintf('-%d menit', self::VELOCITY_WINDOW_MINUTES)
        ))->format('Y-m-d H:i:s'),
    ]);

    $row = $stmt->fetch(\PDO::FETCH_ASSOC);

    if ((int) $row['cnt'] >= self::MAX_TRANSACTIONS_IN_WINDOW) {
        return sprintf(
            'Terlalu banyak transaksi. Maksimum %d dalam %d menit.',
            self::MAX_TRANSACTIONS_IN_WINDOW,
            self::VELOCITY_WINDOW_MINUTES,
        );
    }

    return null;
}
```

### Penjaga 4: Pemeriksaan Jumlah Bulat Mencurigakan

Penipu sering menguji dengan angka bulat bersih (misalnya, tepat 10.000 IDR). Pembayaran asli jarang mendarat di ribuan tepat.

```php
public function checkSuspiciousAmount(int $amount, string $currency): ?string
{
    $divisors = [
        'IDR' => 1_000_00,  // 1.000 IDR dalam sen
        'USD' => 1_00,      // 1 USD dalam sen
    ];

    $divisor = $divisors[$currency] ?? 1;

    if ($amount < 10_000_00 && $amount % $divisor === 0) {
        return 'Jumlah bulat mencurigakan terdeteksi. Pembayaran ditandai untuk ditinjau.';
    }

    return null;
}
```

### Menjalankan Semua Penjaga

`PaymentService` menjalankan semua penjaga sebagai *batch*, mengumpulkan setiap pelanggaran:

```php
$fraudErrors = [];

$error = $this->fraudCheck->checkMaximumAmount($money->amount, $money->currency);
if ($error) {
    $fraudErrors[] = $error;
}

$error = $this->fraudCheck->checkDailyVolume($request->payerAccountId, $money->amount, $money->currency);
if ($error) {
    $fraudErrors[] = $error;
}

$error = $this->fraudCheck->checkVelocity($request->payerAccountId);
if ($error) {
    $fraudErrors[] = $error;
}

$error = $this->fraudCheck->checkSuspiciousAmount($money->amount, $money->currency);
if ($error) {
    $fraudErrors[] = $error;
}

if (!empty($fraudErrors)) {
    return PaymentResult::failure($fraudErrors);
}
```

Setiap penjaga **independen**, satu penjaga gagal tidak mencegah penjaga lain berjalan. Klien menerima semua pelanggaran sekaligus, sehingga mereka dapat menangani setiap masalah dalam satu iterasi.

</section>

---

<section lang="en">

## Putting It Together: A Complete Payment Request

Now we assemble all the pieces into a single `PaymentService` that orchestrates the entire pipeline.

### PaymentResult Value Object

```php
<?php

declare(strict_types=1);

namespace App\Payment\Domain;

class PaymentResult
{
    private function __construct(
        public readonly bool $success,
        public readonly ?string $transactionId = null,
        public readonly ?string $status = null,
        public readonly array $errors = [],
        public readonly array $warnings = [],
    ) {}

    public static function success(string $transactionId, string $status, array $warnings = []): self
    {
        return new self(
            success: true,
            transactionId: $transactionId,
            status: $status,
            warnings: $warnings,
        );
    }

    public static function failure(array $errors): self
    {
        return new self(success: false, errors: $errors);
    }

    public function toArray(): array
    {
        return [
            'success'        => $this->success,
            'transaction_id' => $this->transactionId,
            'status'         => $this->status,
            'errors'         => $this->errors,
            'warnings'       => $this->warnings,
        ];
    }
}
```

### PaymentStatus Enum

```php
<?php

declare(strict_types=1);

namespace App\Payment\Domain;

enum PaymentStatus: string
{
    case PENDING   = 'pending';
    case COMPLETED = 'completed';
    case FAILED    = 'failed';
    case REFUNDED  = 'refunded';
}
```

### The Complete PaymentService

```php
<?php

declare(strict_types=1);

namespace App\Payment\Application;

use App\Payment\Domain\Money;
use App\Payment\Domain\PaymentResult;
use App\Payment\Domain\PaymentStatus;
use App\Payment\Infrastructure\IdempotencyKeyRepository;
use App\Payment\Infrastructure\LedgerRepository;
use PDO;

class PaymentService
{
    public function __construct(
        private readonly PDO $pdo,
        private readonly PaymentRequestValidator $validator,
        private readonly FraudCheckService $fraudCheck,
        private readonly IdempotencyKeyRepository $idempotencyRepo,
        private readonly LedgerRepository $ledgerRepo,
    ) {}

    public function pay(array $request): array
    {
        // Step 1: Validate input
        $validationErrors = $this->validator->validate($request);
        if (!empty($validationErrors)) {
            return PaymentResult::failure($validationErrors)->toArray();
        }

        $idempotencyKey = $request['idempotency_key'];

        // Step 2: Check idempotency
        $existing = $this->idempotencyRepo->find($idempotencyKey);
        if ($existing !== null) {
            $cached = json_decode($existing['response_body'], true);
            if (isset($cached['warnings'])) {
                $cached['warnings'][] = 'Result retrieved from idempotency cache.';
            }

            return $cached;
        }

        $money = Money::fromSmallestUnit(
            (int) $request['amount'],
            $request['currency'],
        );

        $payerId = $request['payer_account_id'];
        $payeeId = $request['payee_account_id'];

        $warnings = [];

        // Step 3: Check payer balance
        $payerBalance = $this->ledgerRepo->getBalance($payerId, $money->currency);
        if ($payerBalance < $money->amount) {
            $result = PaymentResult::failure([
                sprintf(
                    'Insufficient balance. Required: %s, Available: %s.',
                    $money->toString(),
                    (Money::fromSmallestUnit($payerBalance, $money->currency))->toString(),
                ),
            ]);

            $this->cacheIdempotencyResult($idempotencyKey, $result);

            return $result->toArray();
        }

        // Step 4: Fraud and safety checks
        $fraudErrors = [];

        $error = $this->fraudCheck->checkMaximumAmount($money->amount, $money->currency);
        if ($error !== null) {
            $fraudErrors[] = $error;
        }

        $error = $this->fraudCheck->checkDailyVolume($payerId, $money->amount, $money->currency);
        if ($error !== null) {
            $fraudErrors[] = $error;
        }

        $error = $this->fraudCheck->checkVelocity($payerId);
        if ($error !== null) {
            $fraudErrors[] = $error;
        }

        $error = $this->fraudCheck->checkSuspiciousAmount($money->amount, $money->currency);
        if ($error !== null) {
            $warnings[] = $error;
        }

        if (!empty($fraudErrors)) {
            $result = PaymentResult::failure($fraudErrors);
            $this->cacheIdempotencyResult($idempotencyKey, $result);

            return $result->toArray();
        }

        // Step 5: Execute payment atomically
        $transactionId = $this->generateTransactionId();

        $this->pdo->beginTransaction();

        try {
            $payeeBalance = $this->ledgerRepo->getBalance($payeeId, $money->currency);

            // Debit payer
            $this->ledgerRepo->appendEntry([
                'transaction_id' => $transactionId,
                'account_id'     => $payerId,
                'entry_type'     => 'debit',
                'amount'         => $money->amount,
                'currency'       => $money->currency,
                'balance_before' => $payerBalance,
                'balance_after'  => $payerBalance - $money->amount,
                'description'    => sprintf('Payment to %s', $payeeId),
            ]);

            // Credit payee
            $this->ledgerRepo->appendEntry([
                'transaction_id' => $transactionId,
                'account_id'     => $payeeId,
                'entry_type'     => 'credit',
                'amount'         => $money->amount,
                'currency'       => $money->currency,
                'balance_before' => $payeeBalance,
                'balance_after'  => $payeeBalance + $money->amount,
                'description'    => sprintf('Payment from %s', $payerId),
            ]);

            // Record the transaction
            $stmt = $this->pdo->prepare(
                'INSERT INTO transactions (id, payer_account_id, payee_account_id, amount, currency, status, metadata, created_at)
                 VALUES (:id, :payer, :payee, :amount, :currency, :status, :metadata, NOW())'
            );

            $stmt->execute([
                'id'       => $transactionId,
                'payer'    => $payerId,
                'payee'    => $payeeId,
                'amount'   => $money->amount,
                'currency' => $money->currency,
                'status'   => PaymentStatus::COMPLETED->value,
                'metadata' => $request['metadata'] ?? '{}',
            ]);

            $this->pdo->commit();

            $result = PaymentResult::success(
                $transactionId,
                PaymentStatus::COMPLETED->value,
                $warnings,
            );
        } catch (\Throwable $e) {
            $this->pdo->rollBack();

            $result = PaymentResult::failure([
                sprintf('Payment processing failed: %s', $e->getMessage()),
            ]);
        }

        // Step 6: Cache result for idempotency
        $this->cacheIdempotencyResult($idempotencyKey, $result);

        return $result->toArray();
    }

    private function cacheIdempotencyResult(string $key, PaymentResult $result): void
    {
        $responseBody = json_encode($result->toArray());

        $this->idempotencyRepo->store(
            $key,
            $result->success ? '200' : '422',
            $responseBody ?: '{}',
        );
    }

    private function generateTransactionId(): string
    {
        return sprintf(
            'TXN-%s-%s',
            (new \DateTimeImmutable())->format('YmdHis'),
            bin2hex(random_bytes(8)),
        );
    }
}
```

### Transactions Table Schema

```sql
CREATE TABLE transactions (
    id VARCHAR(40) PRIMARY KEY,
    payer_account_id VARCHAR(36) NOT NULL,
    payee_account_id VARCHAR(36) NOT NULL,
    amount INT NOT NULL COMMENT 'In smallest currency unit',
    currency VARCHAR(3) NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_payer (payer_account_id, created_at),
    INDEX idx_payee (payee_account_id, created_at),
    INDEX idx_status (status, created_at)
) ENGINE=InnoDB;
```

### Walkthrough

1. **Validate**: The `PaymentRequestValidator` checks every field. Malformed requests never reach the database.
2. **Idempotency**: If the key exists, return the cached result immediately. This is a single primary-key lookup — sub-millisecond.
3. **Balance check**: Query the ledger (`SELECT SUM(...)`) for the payer's current balance. No balance table to maintain — the ledger **is** the source of truth.
4. **Fraud checks**: Run all four guards. Suspicious amounts trigger warnings (not rejection), allowing human review without blocking legitimate users.
5. **Execute**: All writes happen inside a database transaction. If any write fails, the entire transaction rolls back. The ledger entries and the transaction row are written together or not at all.
6. **Cache**: Store the result against the idempotency key so subsequent retries return the same outcome.

</section>

<section lang="id">

## Menggabungkan Semuanya: Permintaan Pembayaran Lengkap

Sekarang kita merakit semua bagian menjadi satu `PaymentService` yang mengorkestrasi seluruh pipeline.

### Value Object PaymentResult

```php
<?php

declare(strict_types=1);

namespace App\Payment\Domain;

class PaymentResult
{
    private function __construct(
        public readonly bool $success,
        public readonly ?string $transactionId = null,
        public readonly ?string $status = null,
        public readonly array $errors = [],
        public readonly array $warnings = [],
    ) {}

    public static function success(string $transactionId, string $status, array $warnings = []): self
    {
        return new self(
            success: true,
            transactionId: $transactionId,
            status: $status,
            warnings: $warnings,
        );
    }

    public static function failure(array $errors): self
    {
        return new self(success: false, errors: $errors);
    }

    public function toArray(): array
    {
        return [
            'success'        => $this->success,
            'transaction_id' => $this->transactionId,
            'status'         => $this->status,
            'errors'         => $this->errors,
            'warnings'       => $this->warnings,
        ];
    }
}
```

### Enum PaymentStatus

```php
<?php

declare(strict_types=1);

namespace App\Payment\Domain;

enum PaymentStatus: string
{
    case PENDING   = 'pending';
    case COMPLETED = 'completed';
    case FAILED    = 'failed';
    case REFUNDED  = 'refunded';
}
```

### PaymentService Lengkap

```php
<?php

declare(strict_types=1);

namespace App\Payment\Application;

use App\Payment\Domain\Money;
use App\Payment\Domain\PaymentResult;
use App\Payment\Domain\PaymentStatus;
use App\Payment\Infrastructure\IdempotencyKeyRepository;
use App\Payment\Infrastructure\LedgerRepository;
use PDO;

class PaymentService
{
    public function __construct(
        private readonly PDO $pdo,
        private readonly PaymentRequestValidator $validator,
        private readonly FraudCheckService $fraudCheck,
        private readonly IdempotencyKeyRepository $idempotencyRepo,
        private readonly LedgerRepository $ledgerRepo,
    ) {}

    public function pay(array $request): array
    {
        // Langkah 1: Validasi input
        $validationErrors = $this->validator->validate($request);
        if (!empty($validationErrors)) {
            return PaymentResult::failure($validationErrors)->toArray();
        }

        $idempotencyKey = $request['idempotency_key'];

        // Langkah 2: Periksa idempotensi
        $existing = $this->idempotencyRepo->find($idempotencyKey);
        if ($existing !== null) {
            $cached = json_decode($existing['response_body'], true);
            if (isset($cached['warnings'])) {
                $cached['warnings'][] = 'Hasil diambil dari cache idempotensi.';
            }

            return $cached;
        }

        $money = Money::fromSmallestUnit(
            (int) $request['amount'],
            $request['currency'],
        );

        $payerId = $request['payer_account_id'];
        $payeeId = $request['payee_account_id'];

        $warnings = [];

        // Langkah 3: Periksa saldo pembayar
        $payerBalance = $this->ledgerRepo->getBalance($payerId, $money->currency);
        if ($payerBalance < $money->amount) {
            $result = PaymentResult::failure([
                sprintf(
                    'Saldo tidak cukup. Dibutuhkan: %s, Tersedia: %s.',
                    $money->toString(),
                    (Money::fromSmallestUnit($payerBalance, $money->currency))->toString(),
                ),
            ]);

            $this->cacheIdempotencyResult($idempotencyKey, $result);

            return $result->toArray();
        }

        // Langkah 4: Pemeriksaan penipuan dan keamanan
        $fraudErrors = [];

        $error = $this->fraudCheck->checkMaximumAmount($money->amount, $money->currency);
        if ($error !== null) {
            $fraudErrors[] = $error;
        }

        $error = $this->fraudCheck->checkDailyVolume($payerId, $money->amount, $money->currency);
        if ($error !== null) {
            $fraudErrors[] = $error;
        }

        $error = $this->fraudCheck->checkVelocity($payerId);
        if ($error !== null) {
            $fraudErrors[] = $error;
        }

        $error = $this->fraudCheck->checkSuspiciousAmount($money->amount, $money->currency);
        if ($error !== null) {
            $warnings[] = $error;
        }

        if (!empty($fraudErrors)) {
            $result = PaymentResult::failure($fraudErrors);
            $this->cacheIdempotencyResult($idempotencyKey, $result);

            return $result->toArray();
        }

        // Langkah 5: Eksekusi pembayaran secara atomik
        $transactionId = $this->generateTransactionId();

        $this->pdo->beginTransaction();

        try {
            $payeeBalance = $this->ledgerRepo->getBalance($payeeId, $money->currency);

            // Debit pembayar
            $this->ledgerRepo->appendEntry([
                'transaction_id' => $transactionId,
                'account_id'     => $payerId,
                'entry_type'     => 'debit',
                'amount'         => $money->amount,
                'currency'       => $money->currency,
                'balance_before' => $payerBalance,
                'balance_after'  => $payerBalance - $money->amount,
                'description'    => sprintf('Pembayaran ke %s', $payeeId),
            ]);

            // Kredit penerima
            $this->ledgerRepo->appendEntry([
                'transaction_id' => $transactionId,
                'account_id'     => $payeeId,
                'entry_type'     => 'credit',
                'amount'         => $money->amount,
                'currency'       => $money->currency,
                'balance_before' => $payeeBalance,
                'balance_after'  => $payeeBalance + $money->amount,
                'description'    => sprintf('Pembayaran dari %s', $payerId),
            ]);

            // Catat transaksi
            $stmt = $this->pdo->prepare(
                'INSERT INTO transactions (id, payer_account_id, payee_account_id, amount, currency, status, metadata, created_at)
                 VALUES (:id, :payer, :payee, :amount, :currency, :status, :metadata, NOW())'
            );

            $stmt->execute([
                'id'       => $transactionId,
                'payer'    => $payerId,
                'payee'    => $payeeId,
                'amount'   => $money->amount,
                'currency' => $money->currency,
                'status'   => PaymentStatus::COMPLETED->value,
                'metadata' => $request['metadata'] ?? '{}',
            ]);

            $this->pdo->commit();

            $result = PaymentResult::success(
                $transactionId,
                PaymentStatus::COMPLETED->value,
                $warnings,
            );
        } catch (\Throwable $e) {
            $this->pdo->rollBack();

            $result = PaymentResult::failure([
                sprintf('Pemrosesan pembayaran gagal: %s', $e->getMessage()),
            ]);
        }

        // Langkah 6: Cache hasil untuk idempotensi
        $this->cacheIdempotencyResult($idempotencyKey, $result);

        return $result->toArray();
    }

    private function cacheIdempotencyResult(string $key, PaymentResult $result): void
    {
        $responseBody = json_encode($result->toArray());

        $this->idempotencyRepo->store(
            $key,
            $result->success ? '200' : '422',
            $responseBody ?: '{}',
        );
    }

    private function generateTransactionId(): string
    {
        return sprintf(
            'TXN-%s-%s',
            (new \DateTimeImmutable())->format('YmdHis'),
            bin2hex(random_bytes(8)),
        );
    }
}
```

### Skema Tabel Transactions

```sql
CREATE TABLE transactions (
    id VARCHAR(40) PRIMARY KEY,
    payer_account_id VARCHAR(36) NOT NULL,
    payee_account_id VARCHAR(36) NOT NULL,
    amount INT NOT NULL COMMENT 'Dalam unit mata uang terkecil',
    currency VARCHAR(3) NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_payer (payer_account_id, created_at),
    INDEX idx_payee (payee_account_id, created_at),
    INDEX idx_status (status, created_at)
) ENGINE=InnoDB;
```

### Panduan Langkah Demi Langkah

1. **Validasi**: `PaymentRequestValidator` memeriksa setiap *field*. Permintaan yang salah format tidak pernah mencapai database.
2. **Idempotensi**: Jika kunci ada, kembalikan hasil yang di-cache segera. Ini adalah pencarian *primary-key* tunggal, sub-milidetik.
3. **Pemeriksaan saldo**: *Query* buku besar (`SELECT SUM(...)`) untuk saldo pembayar saat ini. Tidak ada tabel saldo yang harus dipelihara, buku besar **adalah** sumber kebenaran.
4. **Pemeriksaan penipuan**: Jalankan keempat penjaga. Jumlah mencurigakan memicu peringatan (bukan penolakan), memungkinkan peninjauan manusia tanpa memblokir pengguna yang sah.
5. **Eksekusi**: Semua penulisan terjadi di dalam transaksi database. Jika ada penulisan yang gagal, seluruh transaksi di-rollback. Entri buku besar dan baris transaksi ditulis bersama atau tidak sama sekali.
6. **Cache**: Simpan hasil terhadap kunci idempotensi sehingga percobaan ulang berikutnya mengembalikan hasil yang sama.

</section>

---

<section lang="en">

## Common Mistakes in Fintech Code

Learning from mistakes is cheaper than making them. Here are the four most common and costly errors in payment codebases.

### Mistake 1: Floating-Point for Money

```php
// NEVER do this
$balance = 100.50;
$payment = 33.33;
$new_balance = $balance - $payment; // 67.17? Or 67.17000000000001?
```

IEEE 754 floating-point cannot precisely represent decimal fractions. The classic result:

```php
var_dump(0.1 + 0.2 === 0.3); // bool(false)
var_dump(0.1 + 0.2);         // float(0.30000000000000004)
```

Now multiply this by thousands of transactions per day. Reconciliation becomes a nightmare.

**Do this instead:** Store amounts as integers in the smallest currency unit. `100.50 USD` → `10050` cents. All arithmetic is integer arithmetic — exact and predictable.

### Mistake 2: Missing Idempotency

```php
// DANGEROUS: no idempotency check before processing
public function processPayment(PaymentRequest $request): PaymentResult
{
    $this->debitPayer($request);
    $this->creditPayee($request);
    // If client retries after a network timeout, payer is debited twice.
}
```

A network timeout between `debitPayer` and the HTTP response means the client has no way to know if the payment succeeded. Without idempotency, a retry creates a double debit.

**Do this instead:** Always look up the idempotency key **first**, before any business logic. Return the cached result if it exists.

### Mistake 3: No Audit Trail

```php
// DANGEROUS: no ledger, direct balance column update
$stmt = $pdo->prepare('UPDATE accounts SET balance = balance - :amount WHERE id = :id');
$stmt->execute(['amount' => $amount, 'id' => $payerId]);
```

If this update runs and then something crashes, you have no record of **what** the previous balance was, **when** the debit occurred, or **why**. During a dispute or audit, you cannot reconstruct the account history.

**Do this instead:** Write an append-only ledger entry. Never update a balance column directly. The balance is a **computed value** derived from the ledger.

### Mistake 4: Synchronous External Calls Inside a Transaction

```php
// DANGEROUS: HTTP call inside a database transaction
$this->pdo->beginTransaction();

$this->debitPayer($payerId, $amount);

// This could take 5 seconds or time out
$response = $this->bankGateway->transfer($payeeId, $amount);

$this->recordTransaction($transactionId);
$this->pdo->commit();
```

A slow or failed external call holds a database transaction open, locks rows, and can cascade into cascading failures. The entire payment system freezes waiting for a third-party HTTP response.

**Do this instead:**
- Record the transaction as `pending` inside the transaction.
- Commit the transaction quickly.
- Call the external gateway **outside** the transaction.
- Update the transaction status based on the gateway response.

</section>

<section lang="id">

## Kesalahan Umum dalam Kode Fintech

Belajar dari kesalahan lebih murah daripada membuatnya. Berikut adalah empat kesalahan paling umum dan mahal dalam codebase pembayaran.

### Kesalahan 1: Floating-Point untuk Uang

```php
// JANGAN PERNAH lakukan ini
$balance = 100.50;
$payment = 33.33;
$new_balance = $balance - $payment; // 67.17? Atau 67.17000000000001?
```

IEEE 754 *floating-point* tidak dapat merepresentasikan pecahan desimal secara tepat. Hasil klasiknya:

```php
var_dump(0.1 + 0.2 === 0.3); // bool(false)
var_dump(0.1 + 0.2);         // float(0.30000000000000004)
```

Sekarang kalikan ini dengan ribuan transaksi per hari. Rekonsiliasi menjadi mimpi buruk.

**Lakukan ini sebagai gantinya:** Simpan *amount* sebagai integer dalam unit mata uang terkecil. `100.50 USD` → `10050` sen. Semua aritmatika adalah aritmatika integer, tepat dan dapat diprediksi.

### Kesalahan 2: Tidak Ada Idempotensi

```php
// BERBAHAYA: tidak ada pemeriksaan idempotensi sebelum pemrosesan
public function processPayment(PaymentRequest $request): PaymentResult
{
    $this->debitPayer($request);
    $this->creditPayee($request);
    // Jika klien mencoba ulang setelah timeout jaringan, pembayar didebit dua kali.
}
```

*Timeout* jaringan antara `debitPayer` dan respons HTTP berarti klien tidak tahu apakah pembayaran berhasil. Tanpa idempotensi, percobaan ulang menciptakan debit ganda.

**Lakukan ini sebagai gantinya:** Selalu cari kunci idempotensi **pertama**, sebelum logika bisnis apa pun. Kembalikan hasil yang di-cache jika ada.

### Kesalahan 3: Tidak Ada Jejak Audit

```php
// BERBAHAYA: tidak ada buku besar, pembaruan kolom saldo langsung
$stmt = $pdo->prepare('UPDATE accounts SET balance = balance - :amount WHERE id = :id');
$stmt->execute(['amount' => $amount, 'id' => $payerId]);
```

Jika pembaruan ini berjalan dan kemudian sesuatu *crash*, Anda tidak memiliki catatan tentang **apa** saldo sebelumnya, **kapan** debit terjadi, atau **mengapa**. Selama sengketa atau audit, Anda tidak dapat merekonstruksi riwayat akun.

**Lakukan ini sebagai gantinya:** Tulis entri buku besar append-only. Jangan pernah memperbarui kolom saldo secara langsung. Saldo adalah **nilai yang dihitung** yang berasal dari buku besar.

### Kesalahan 4: Panggilan Eksternal Sinkron di dalam Transaksi

```php
// BERBAHAYA: panggilan HTTP di dalam transaksi database
$this->pdo->beginTransaction();

$this->debitPayer($payerId, $amount);

// Ini bisa memakan waktu 5 detik atau timeout
$response = $this->bankGateway->transfer($payeeId, $amount);

$this->recordTransaction($transactionId);
$this->pdo->commit();
```

Panggilan eksternal yang lambat atau gagal menahan transaksi database terbuka, mengunci baris, dan dapat mengalir menjadi kegagalan berantai. Seluruh sistem pembayaran membeku menunggu respons HTTP pihak ketiga.

**Lakukan ini sebagai gantinya:**
- Catat transaksi sebagai `pending` di dalam transaksi.
- Commit transaksi dengan cepat.
- Panggil gateway eksternal **di luar** transaksi.
- Perbarui status transaksi berdasarkan respons gateway.

</section>

---

<section lang="en">

## Practice Exercise

Now it is your turn. Extend the payment service with two new features.

### Exercise 1: Implement a Refund

Add a `refund` method to `PaymentService`. Requirements:

1. Accept a `transaction_id` (the original payment) and an optional `amount` (partial refund).
2. If `amount` is not provided, refund the full original amount.
3. Validate that the original transaction exists, is in `completed` status, and has not already been refunded.
4. Create a **reversing entry** in the ledger: credit the payer (money back), debit the payee (money removed).
5. Update the original transaction status to `refunded`.
6. Return a new `PaymentResult` with the refund transaction ID.

### Exercise 2: Implement Transaction History

Add a `getTransactionHistory` method. Requirements:

1. Accept an `account_id`, optional `limit` (default 20), and optional `offset` (default 0).
2. Return all transactions where the account is either the payer or the payee.
3. Each result must include the transaction ID, the counterparty (the other account), the amount (positive for incoming, negative for outgoing), the currency, the status, and the timestamp.
4. Results must be ordered by most recent first.
5. Implement proper SQL parameter binding — no string interpolation.

### Starter Code

```php
<?php

declare(strict_types=1);

namespace App\Payment\Application;

use App\Payment\Domain\PaymentResult;

class PaymentServiceExtended extends PaymentService
{
    /**
     * Refund all or part of a completed payment.
     */
    public function refund(string $transactionId, ?int $amount = null): array
    {
        $errors = [];

        // 1. Look up the original transaction
        // 2. Validate status
        // 3. Create reversing ledger entries
        // 4. Update the original transaction status
        // 5. Return result

        if (!empty($errors)) {
            return PaymentResult::failure($errors)->toArray();
        }

        return PaymentResult::success(
            'TXN-REFUND-...',
            'completed',
            [],
        )->toArray();
    }

    /**
     * Get transaction history for an account.
     */
    public function getTransactionHistory(
        string $accountId,
        int $limit = 20,
        int $offset = 0,
    ): array {
        // 1. Query transactions where account is payer or payee
        // 2. Map amount sign: negative for outgoing, positive for incoming
        // 3. Return ordered by created_at DESC

        return [];
    }
}
```

### Expected Behaviour

**Refund:**
```
Request:  refund('TXN-20260706-abc123')
Result:   success, transaction_id='TXN-REFUND-...', status='completed'

Request:  refund('TXN-20260706-abc123')  // second attempt
Result:   failure, errors=['Transaction has already been refunded.']
```

**Transaction History:**
```
Request:  getTransactionHistory('account-001', limit: 5)
Result:   [
    { transaction_id: 'TXN-...', counterparty: 'account-002', amount: -50000, currency: 'IDR', status: 'completed', ... },
    { transaction_id: 'TXN-...', counterparty: 'account-003', amount: +25000, currency: 'IDR', status: 'completed', ... },
    ...
]
```

</section>

<section lang="id">

## Latihan Praktik

Sekarang giliran Anda. Perluas layanan pembayaran dengan dua fitur baru.

### Latihan 1: Implementasikan Refund

Tambahkan metode `refund` ke `PaymentService`. Persyaratan:

1. Terima `transaction_id` (pembayaran asli) dan `amount` opsional (*refund* sebagian).
2. Jika `amount` tidak diberikan, *refund* jumlah penuh asli.
3. Validasi bahwa transaksi asli ada, dalam status `completed`, dan belum di-refund.
4. Buat **entri pembalik** di buku besar: kredit pembayar (uang kembali), debit penerima (uang dihapus).
5. Perbarui status transaksi asli menjadi `refunded`.
6. Kembalikan `PaymentResult` baru dengan ID transaksi refund.

### Latihan 2: Implementasikan Riwayat Transaksi

Tambahkan metode `getTransactionHistory`. Persyaratan:

1. Terima `account_id`, `limit` opsional (default 20), dan `offset` opsional (default 0).
2. Kembalikan semua transaksi di mana akun adalah pembayar atau penerima.
3. Setiap hasil harus menyertakan ID transaksi, pihak lawan (akun lainnya), *amount* (positif untuk masuk, negatif untuk keluar), *currency*, status, dan *timestamp*.
4. Hasil harus diurutkan berdasarkan yang terbaru terlebih dahulu.
5. Implementasikan pengikatan parameter SQL yang tepat, tidak ada interpolasi string.

### Kode Awal

```php
<?php

declare(strict_types=1);

namespace App\Payment\Application;

use App\Payment\Domain\PaymentResult;

class PaymentServiceExtended extends PaymentService
{
    /**
     * Refund semua atau sebagian dari pembayaran yang telah selesai.
     */
    public function refund(string $transactionId, ?int $amount = null): array
    {
        $errors = [];

        // 1. Cari transaksi asli
        // 2. Validasi status
        // 3. Buat entri buku besar pembalik
        // 4. Perbarui status transaksi asli
        // 5. Kembalikan hasil

        if (!empty($errors)) {
            return PaymentResult::failure($errors)->toArray();
        }

        return PaymentResult::success(
            'TXN-REFUND-...',
            'completed',
            [],
        )->toArray();
    }

    /**
     * Dapatkan riwayat transaksi untuk akun.
     */
    public function getTransactionHistory(
        string $accountId,
        int $limit = 20,
        int $offset = 0,
    ): array {
        // 1. Query transaksi di mana akun adalah pembayar atau penerima
        // 2. Petakan tanda amount: negatif untuk keluar, positif untuk masuk
        // 3. Kembalikan diurutkan berdasarkan created_at DESC

        return [];
    }
}
```

### Perilaku yang Diharapkan

**Refund:**
```
Permintaan:  refund('TXN-20260706-abc123')
Hasil:       sukses, transaction_id='TXN-REFUND-...', status='completed'

Permintaan:  refund('TXN-20260706-abc123')  // percobaan kedua
Hasil:       gagal, errors=['Transaksi telah di-refund.']
```

**Riwayat Transaksi:**
```
Permintaan:  getTransactionHistory('account-001', limit: 5)
Hasil:       [
    { transaction_id: 'TXN-...', counterparty: 'account-002', amount: -50000, currency: 'IDR', status: 'completed', ... },
    { transaction_id: 'TXN-...', counterparty: 'account-003', amount: +25000, currency: 'IDR', status: 'completed', ... },
    ...
]
```

</section>

---

<section lang="en">

## Summary

1. **Fintech is a distinct domain** where mistakes are measured in currency, not UX friction. Every operation must be atomic, auditable, and idempotent.
2. **The payment pipeline** follows a strict order: validate → check idempotency → authorise → record → confirm. Each stage has a specific failure mode and a safety net.
3. **Input validation is your first security layer.** Validate amounts (positive integers only, no floats), currencies (allowlist), account existence, and idempotency key format before any business logic runs.
4. **Idempotency keys prevent double charges.** Store a key → result mapping. Check it first — before balance queries, before fraud checks, before ledger writes. Cache results for 24 hours.
5. **A double-entry ledger is non-negotiable.** Every payment creates a debit entry and a credit entry. Every entry records `balance_before` and `balance_after`. No UPDATES, no DELETES — append-only. The ledger **is** the source of truth for account balances.
6. **Fraud guards must run before money moves.** Maximum amount limits, daily volume caps, velocity checks, and suspicious pattern detection protect both your users and your platform.
7. **Use integer cents for money.** `float` cannot represent `0.1 + 0.2` accurately. Store `100.50 USD` as `10050`. Your reconciliation team will thank you.
8. **Keep external calls outside database transactions.** A slow bank gateway response should not hold rows locked. Record the transaction as `pending`, commit, call the gateway, then update the status.

> "In fintech, you are not building features — you are building trust. Every transaction is a promise that your system will not lose, double-count, or misplace money. Honour that promise in every line of code."

## What to Read Next

- **[Domain-Driven Design Fundamentals with PHP](/blog/domain-driven-design-fundamentals-php)** — Learn how bounded contexts separate payment, account, and fraud domains cleanly.
- **[Microservices Architecture Fundamentals with PHP](/blog/microservices-architecture-fundamentals)** — Understand when to extract a Payment microservice as transaction volume grows.
- **[Blackbox and Whitebox Test](/blog/blackbox-and-whitebox-test)** — Master testing strategies for payment validation, fraud rules, and idempotency guarantees.
- **[Test-Driven Development (TDD) with PHP](/blog/test-driven-development)** — Build your payment service with confidence using the Red-Green-Refactor cycle.
- **[Clean Code Principles with PHP](/blog/clean-code-principles)** — Keep your payment pipeline readable as business rules and compliance requirements grow.
- **[Design Patterns with PHP](/blog/design-patterns-with-php)** — Apply Command (payment request), Strategy (fraud rules), and Memento (transaction snapshots) patterns.
- **[PCI-DSS Quick Reference](https://www.pcisecuritystandards.org/)** — The Payment Card Industry Data Security Standard. Required reading for anyone handling card payments.
- **[Stripe API Idempotency Documentation](https://docs.stripe.com/api/idempotent_requests)** — Production-grade idempotency implementation from one of the world's largest payment processors.

</section>

<section lang="id">

## Ringkasan

1. **Fintech adalah domain yang berbeda** di mana kesalahan diukur dalam mata uang, bukan friksi UX. Setiap operasi harus atomik, dapat diaudit, dan idempoten.
2. **Pipeline pembayaran** mengikuti urutan ketat: validasi → periksa idempotensi → otorisasi → catat → konfirmasi. Setiap tahap memiliki mode kegagalan spesifik dan jaring pengaman.
3. **Validasi input adalah lapisan keamanan pertama Anda.** Validasi *amount* (hanya integer positif, tidak ada *float*), mata uang (*allowlist*), keberadaan akun, dan format kunci idempotensi sebelum logika bisnis apa pun berjalan.
4. **Kunci idempotensi mencegah double charge.** Simpan pemetaan kunci → hasil. Periksa terlebih dahulu, sebelum *query* saldo, sebelum pemeriksaan penipuan, sebelum penulisan buku besar. Cache hasil selama 24 jam.
5. **Buku besar double-entry tidak dapat dinegosiasikan.** Setiap pembayaran membuat entri debit dan entri kredit. Setiap entri mencatat `balance_before` dan `balance_after`. Tidak ada UPDATE, tidak ada DELETE, hanya append-only. Buku besar **adalah** sumber kebenaran untuk saldo akun.
6. **Penjaga penipuan harus berjalan sebelum uang bergerak.** Batas jumlah maksimum, batas volume harian, pemeriksaan kecepatan, dan deteksi pola mencurigakan melindungi pengguna dan platform Anda.
7. **Gunakan integer sen untuk uang.** `float` tidak dapat merepresentasikan `0.1 + 0.2` secara akurat. Simpan `100.50 USD` sebagai `10050`. Tim rekonsiliasi Anda akan berterima kasih.
8. **Jaga panggilan eksternal di luar transaksi database.** Respons gateway bank yang lambat tidak boleh menahan baris terkunci. Catat transaksi sebagai `pending`, commit, panggil gateway, lalu perbarui status.

> "Dalam fintech, Anda tidak membangun fitur, Anda membangun kepercayaan. Setiap transaksi adalah janji bahwa sistem Anda tidak akan kehilangan, menghitung ganda, atau salah menempatkan uang. Hormati janji itu di setiap baris kode."

## Bacaan Selanjutnya

- **[Dasar-Dasar Domain-Driven Design dengan PHP](/blog/domain-driven-design-fundamentals-php)**: Pelajari bagaimana bounded context memisahkan domain pembayaran, akun, dan penipuan dengan bersih.
- **[Dasar-Dasar Arsitektur Microservices dengan PHP](/blog/microservices-architecture-fundamentals)**: Pahami kapan harus mengekstrak microservice Payment seiring bertambahnya volume transaksi.
- **[Blackbox dan Whitebox Test](/blog/blackbox-and-whitebox-test)**: Kuasai strategi pengujian untuk validasi pembayaran, aturan penipuan, dan jaminan idempotensi.
- **[Test-Driven Development (TDD) dengan PHP](/blog/test-driven-development)**: Bangun layanan pembayaran Anda dengan percaya diri menggunakan siklus Red-Green-Refactor.
- **[Prinsip Clean Code dengan PHP](/blog/clean-code-principles)**: Jaga pipeline pembayaran Anda tetap terbaca seiring bertambahnya aturan bisnis dan persyaratan kepatuhan.
- **[Design Patterns dengan PHP](/blog/design-patterns-with-php)**: Terapkan pola Command (permintaan pembayaran), Strategy (aturan penipuan), dan Memento (snapshot transaksi).
- **[Referensi Cepat PCI-DSS](https://www.pcisecuritystandards.org/)**: Standar Keamanan Data Industri Kartu Pembayaran. Bacaan wajib bagi siapa pun yang menangani pembayaran kartu.
- **[Dokumentasi Idempotensi Stripe API](https://docs.stripe.com/api/idempotent_requests)**: Implementasi idempotensi tingkat produksi dari salah satu pemroses pembayaran terbesar di dunia.

</section>
