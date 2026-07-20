---
title: "Software Engineering for Healthcare: Patient Registration System with PHP"
titleId: "Rekayasa Perangkat Lunak untuk Kesehatan: Sistem Pendaftaran Pasien dengan PHP"
date: 2026-07-06
updated: 2026-07-06
category: tutorial
author: SE Lab
lang: en
featured: false
stream: domain-specific-se-applications
tags:
  - Healthcare
  - PHP
  - DDD
  - Clean Code
  - Patient Management
tagsId:
  - Kesehatan
  - PHP
  - DDD
  - Clean Code
  - Manajemen Pasien
excerpt: "Learn how software engineering principles adapt to healthcare. This tutorial walks through building a patient registration system in PHP with DDD-style value objects, invariant guards, duplicate detection, privacy-aware design, and PHPUnit tests."
excerptId: "Pelajari bagaimana prinsip-prinsip rekayasa perangkat lunak beradaptasi dengan domain kesehatan. Tutorial ini membahas pembangunan sistem pendaftaran pasien dalam PHP dengan value object ala DDD, penjaga invarian, deteksi duplikat, desain sadar privasi, dan pengujian PHPUnit."
---

<section lang="en">

## Why Healthcare Software Needs Disciplined Engineering

**Healthcare software is not just a CRUD app with a medical theme.** It is a domain where bugs can cause physical harm, data breaches can ruin lives, and regulatory non-compliance can shut down entire systems.

Consider the difference between a generic contact-management form and a patient registration system:

| Aspect | Generic CRUD | Patient Registration |
|---|---|---|
| **Data sensitivity** | Name, email — low risk if leaked | Medical record numbers, diagnoses, insurance IDs — protected by law |
| **Duplicate prevention** | Email uniqueness is nice | Registering the same person twice creates fragmented medical history with dangerous consequences |
| **Input validation** | Trim whitespace, validate email format | Validate medical record numbers against institutional format, validate consent flags, validate emergency contacts |
| **Auditability** | Optional | Who registered the patient, when, and what data was entered — legally required |
| **Consent management** | Not applicable | Patients must consent to data collection, storage, and sharing — revocable at any time |
| **Data minimisation** | Collect whatever helps marketing | Collect only what is clinically necessary — "data minimisation" is a legal principle |
| **Interoperability** | Not applicable | Data must be shareable with labs, pharmacies, referral hospitals (HL7/FHIR, SATUSEHAT) |

These constraints mean that **generic software engineering advice must be adapted**. The patterns you learn — DDD, Clean Code, TDD, modular architecture — all still apply, but they are applied to problems shaped by the healthcare domain. This tutorial shows you how.

</section>

<section lang="id">

## Mengapa Perangkat Lunak Kesehatan Membutuhkan Rekayasa yang Disiplin

**Perangkat lunak kesehatan bukan sekadar aplikasi CRUD dengan tema medis.** Ini adalah domain di mana bug dapat menyebabkan bahaya fisik, kebocoran data dapat menghancurkan kehidupan, dan ketidakpatuhan regulasi dapat menutup seluruh sistem.

Pertimbangkan perbedaan antara formulir manajemen kontak generik dan sistem pendaftaran pasien:

| Aspek | CRUD Generik | Pendaftaran Pasien |
|---|---|---|
| **Sensitivitas data** | Nama, email: risiko rendah jika bocor | Nomor rekam medis, diagnosis, ID asuransi: dilindungi oleh hukum |
| **Pencegahan duplikat** | Keunikan email itu bagus | Mendaftarkan orang yang sama dua kali menciptakan riwayat medis terfragmentasi dengan konsekuensi berbahaya |
| **Validasi input** | Trim spasi, validasi format email | Validasi nomor rekam medis terhadap format institusi, validasi flag persetujuan, validasi kontak darurat |
| **Auditabilitas** | Opsional | Diwajibkan secara hukum: siapa yang mendaftarkan pasien, kapan, dan data apa yang dimasukkan |
| **Manajemen persetujuan** | Tidak berlaku | Pasien harus menyetujui pengumpulan, penyimpanan, dan berbagi data: persetujuan dapat dicabut kapan saja |
| **Minimalisasi data** | Kumpulkan apa pun yang membantu pemasaran | Kumpulkan hanya yang diperlukan secara klinis: "minimalisasi data" adalah prinsip hukum |
| **Interoperabilitas** | Tidak berlaku | Data harus dapat dibagikan dengan lab, apotek, rumah sakit rujukan (HL7/FHIR, SATUSEHAT) |

Batasan ini berarti bahwa **saran rekayasa perangkat lunak generik harus diadaptasi**. Pola yang Anda pelajari (DDD, Clean Code, TDD, arsitektur modular) semuanya masih berlaku, tetapi diterapkan pada masalah yang dibentuk oleh domain kesehatan. Tutorial ini menunjukkan caranya.

</section>

---

<section lang="en">

## Domain Snapshot: A Small Clinic Patient Registration Flow

Before writing a single line of code, you must understand the **ubiquitous language** of a clinic. These are the terms that doctors, nurses, and administrative staff use every day. Your code must speak the same language.

### The Registration Flow

```
Walk-in / Phone Call → Check Existing Patient → New Registration → Assign Medical Record Number → Record Consent → Confirm
                              ↓
                         Existing Patient → Update Demographics → Verify Insurance → Proceed to Triage
```

| Step | What Happens | Domain Rule |
|---|---|---|
| **Check Existing Patient** | Search by name, date of birth, national ID (NIK), or phone number | Prevent duplicate registrations — one person, one medical record |
| **New Registration** | Collect demographics: name, DOB, gender, address, phone, email, emergency contact | All required fields must be present and valid |
| **Assign Medical Record Number** | Generate a unique, immutable identifier following institutional format (e.g., `RM-20260706-0001`) | Medical record numbers are never re-assigned or deleted |
| **Record Consent** | Capture patient consent for data collection, storage, and sharing | Consent must be explicit, recorded with timestamp, and revocable |
| **Verify Insurance** | Check insurance eligibility if the patient has coverage (BPJS, private) | Insurance verification may be asynchronous — registration must not block on it |
| **Confirm** | Return the medical record number and a confirmation receipt | The patient-facing output must not expose sensitive internal identifiers |

### Key Entities in a Clinic System

| Entity | Description | Key Attributes |
|---|---|---|
| **Patient** | A person registered in the clinic | medical record number, name, date of birth, gender, national ID (NIK) |
| **ContactInfo** | Value object grouping contact details | phone, email, address (street, city, postal code) |
| **EmergencyContact** | Value object for emergency contact | name, relationship, phone |
| **ConsentRecord** | A patient's consent for data handling | consent type (collection, storage, sharing), granted at, revoked at (nullable), version |
| **RegistrationAudit** | Immutable log of registration events | patient id, event type (created, updated, consent_granted, consent_revoked), timestamp, performer |

Understanding these entities is crucial — they are not just database rows. Each one carries business invariants that must be enforced at the domain level.

</section>

<section lang="id">

## Cuplikan Domain: Alur Pendaftaran Pasien Klinik Kecil

Sebelum menulis satu baris kode pun, Anda harus memahami **ubiquitous language** dari sebuah klinik. Ini adalah istilah yang digunakan dokter, perawat, dan staf administrasi setiap hari. Kode Anda harus berbicara dalam bahasa yang sama.

### Alur Pendaftaran

```
Datang / Telepon → Periksa Pasien Lama → Pendaftaran Baru → Tetapkan Nomor RM → Catat Persetujuan → Konfirmasi
                            ↓
                       Pasien Lama → Perbarui Demografi → Verifikasi Asuransi → Lanjut ke Triase
```

| Langkah | Yang Terjadi | Aturan Domain |
|---|---|---|
| **Periksa Pasien Lama** | Cari berdasarkan nama, tanggal lahir, NIK, atau nomor telepon | Cegah pendaftaran ganda: satu orang, satu rekam medis |
| **Pendaftaran Baru** | Kumpulkan demografi: nama, TTL, jenis kelamin, alamat, telepon, email, kontak darurat | Semua field wajib harus ada dan valid |
| **Tetapkan Nomor RM** | Hasilkan identifier unik dan immutable sesuai format institusi (misal: `RM-20260706-0001`) | Nomor rekam medis tidak pernah dialokasikan ulang atau dihapus |
| **Catat Persetujuan** | Tangkap persetujuan pasien untuk pengumpulan, penyimpanan, dan berbagi data | Persetujuan harus eksplisit, dicatat dengan timestamp, dan dapat dicabut |
| **Verifikasi Asuransi** | Periksa kelayakan asuransi jika pasien memiliki cakupan (BPJS, swasta) | Verifikasi asuransi mungkin berjalan asinkron sehingga pendaftaran tidak boleh terblokir olehnya |
| **Konfirmasi** | Kembalikan nomor rekam medis dan tanda terima konfirmasi | Output yang dilihat pasien tidak boleh mengekspos identifier internal sensitif |

### Entitas Kunci dalam Sistem Klinik

| Entitas | Deskripsi | Atribut Kunci |
|---|---|---|
| **Patient** | Orang yang terdaftar di klinik | nomor rekam medis, nama, tanggal lahir, jenis kelamin, NIK |
| **ContactInfo** | Value object pengelompokan detail kontak | telepon, email, alamat (jalan, kota, kode pos) |
| **EmergencyContact** | Value object untuk kontak darurat | nama, hubungan, telepon |
| **ConsentRecord** | Persetujuan pasien untuk penanganan data | tipe persetujuan (pengumpulan, penyimpanan, berbagi), diberikan pada, dicabut pada (nullable), versi |
| **RegistrationAudit** | Log immutable dari kejadian pendaftaran | id pasien, tipe kejadian (dibuat, diperbarui, persetujuan_diberikan, persetujuan_dicabut), timestamp, pelaksana |

Memahami entitas ini sangat penting: entitas-entitas ini bukan sekadar baris database. Masing-masing membawa invarian bisnis yang harus ditegakkan pada level domain.

</section>

---

<section lang="en">

## Modeling the Domain: Value Objects and Entities

Healthcare data is not a bag of strings. Every piece of information has rules. A medical record number follows a specific format. A phone number has a valid pattern. An email address must be structurally correct. Modeling these as **value objects** — immutable, self-validating types — catches errors at construction time, not deep inside a service method.

### The `MedicalRecordNumber` Value Object

Medical record numbers are the primary identifier for patients. They are never re-assigned, never deleted, and must follow the institutional format. A value object enforces these rules:

```php
<?php

declare(strict_types=1);

namespace App\Patient\Domain;

use InvalidArgumentException;

class MedicalRecordNumber
{
    private function __construct(
        public readonly string $value,
    ) {}

    public static function fromString(string $value): self
    {
        $value = trim($value);

        if ($value === '') {
            throw new InvalidArgumentException(
                'Medical record number must not be empty.',
            );
        }

        if (strlen($value) > 30) {
            throw new InvalidArgumentException(
                'Medical record number must not exceed 30 characters.',
            );
        }

        if (!preg_match('/^RM-\d{8}-\d{4}$/', $value)) {
            throw new InvalidArgumentException(
                sprintf(
                    'Medical record number must match format RM-YYYYMMDD-NNNN, got: %s.',
                    $value,
                ),
            );
        }

        return new self($value);
    }

    public static function generate(\DateTimeImmutable $date, int $sequence): self
    {
        $value = sprintf('RM-%s-%04d', $date->format('Ymd'), $sequence);

        return new self($value);
    }

    public function equals(self $other): bool
    {
        return $this->value === $other->value;
    }

    public function toString(): string
    {
        return $this->value;
    }
}
```

By modelling the medical record number as a value object, you guarantee that any `MedicalRecordNumber` in your system is valid. You never need to validate it again — the type system enforces it.

### The `Phone` Value Object

```php
<?php

declare(strict_types=1);

namespace App\Patient\Domain;

use InvalidArgumentException;

class Phone
{
    private function __construct(
        public readonly string $value,
    ) {}

    public static function fromString(string $value): self
    {
        $value = trim($value);

        $digitsOnly = preg_replace('/[^0-9+]/', '', $value);

        if (strlen($digitsOnly) < 8 || strlen($digitsOnly) > 15) {
            throw new InvalidArgumentException(
                sprintf('Phone number must have 8-15 digits, got %d.', strlen($digitsOnly)),
            );
        }

        return new self($digitsOnly);
    }

    public function equals(self $other): bool
    {
        return $this->value === $other->value;
    }

    public function toString(): string
    {
        return $this->value;
    }
}
```

### The `Email` Value Object

```php
<?php

declare(strict_types=1);

namespace App\Patient\Domain;

use InvalidArgumentException;

class Email
{
    private function __construct(
        public readonly string $value,
    ) {}

    public static function fromString(string $value): self
    {
        $value = trim($value);

        if ($value === '') {
            throw new InvalidArgumentException('Email must not be empty.');
        }

        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException(
                sprintf('Invalid email format: %s.', $value),
            );
        }

        return new self(strtolower($value));
    }

    public function equals(self $other): bool
    {
        return $this->value === $other->value;
    }

    public function toString(): string
    {
        return $this->value;
    }
}
```

### The `ContactInfo` Value Object

```php
<?php

declare(strict_types=1);

namespace App\Patient\Domain;

class ContactInfo
{
    public function __construct(
        public readonly Phone $phone,
        public readonly ?Email $email,
        public readonly string $street,
        public readonly string $city,
        public readonly string $postalCode,
    ) {}
}
```

### The `EmergencyContact` Value Object

```php
<?php

declare(strict_types=1);

namespace App\Patient\Domain;

class EmergencyContact
{
    public function __construct(
        public readonly string $name,
        public readonly string $relationship,
        public readonly Phone $phone,
    ) {
        if (trim($name) === '') {
            throw new \InvalidArgumentException('Emergency contact name is required.');
        }

        if (trim($relationship) === '') {
            throw new \InvalidArgumentException('Emergency contact relationship is required.');
        }
    }
}
```

### The `Patient` Entity

```php
<?php

declare(strict_types=1);

namespace App\Patient\Domain;

use DateTimeImmutable;

class Patient
{
    private function __construct(
        public readonly MedicalRecordNumber $medicalRecordNumber,
        public readonly string $fullName,
        public readonly DateTimeImmutable $dateOfBirth,
        public readonly Gender $gender,
        public readonly ?string $nationalId,
        public readonly ContactInfo $contactInfo,
        public readonly ?EmergencyContact $emergencyContact,
        public readonly ConsentRecord $consentRecord,
        public readonly DateTimeImmutable $registeredAt,
    ) {}

    public static function register(
        MedicalRecordNumber $mrn,
        string $fullName,
        DateTimeImmutable $dateOfBirth,
        Gender $gender,
        ?string $nationalId,
        ContactInfo $contactInfo,
        ?EmergencyContact $emergencyContact,
        bool $consentGranted,
    ): self {
        $fullName = trim($fullName);

        if ($fullName === '') {
            throw new \InvalidArgumentException('Patient full name is required.');
        }

        if ($dateOfBirth > new DateTimeImmutable('today')) {
            throw new \InvalidArgumentException('Date of birth cannot be in the future.');
        }

        if ($nationalId !== null) {
            $nationalId = trim($nationalId);
            if (!preg_match('/^\d{16}$/', $nationalId)) {
                throw new \InvalidArgumentException(
                    sprintf('National ID (NIK) must be exactly 16 digits, got: %s.', $nationalId),
                );
            }
        }

        $consentRecord = new ConsentRecord(
            consentType: ConsentType::FULL,
            grantedAt: new DateTimeImmutable(),
            granted: $consentGranted,
        );

        if (!$consentGranted) {
            throw new \InvalidArgumentException(
                'Patient consent is required before registration can proceed.',
            );
        }

        return new self(
            medicalRecordNumber: $mrn,
            fullName: $fullName,
            dateOfBirth: $dateOfBirth,
            gender: $gender,
            nationalId: $nationalId,
            contactInfo: $contactInfo,
            emergencyContact: $emergencyContact,
            consentRecord: $consentRecord,
            registeredAt: new DateTimeImmutable(),
        );
    }
}
```

### Supporting Enums and Value Objects

```php
<?php

declare(strict_types=1);

namespace App\Patient\Domain;

use DateTimeImmutable;

enum Gender: string
{
    case MALE   = 'male';
    case FEMALE = 'female';
}

enum ConsentType: string
{
    case FULL            = 'full';
    case DATA_COLLECTION = 'data_collection';
    case DATA_SHARING    = 'data_sharing';
}

class ConsentRecord
{
    public function __construct(
        public readonly ConsentType $consentType,
        public readonly DateTimeImmutable $grantedAt,
        public readonly bool $granted,
        public readonly ?DateTimeImmutable $revokedAt = null,
        public readonly int $version = 1,
    ) {}

    public function revoke(DateTimeImmutable $revokedAt): self
    {
        if ($this->revokedAt !== null) {
            throw new \DomainException('Consent is already revoked.');
        }

        return new self(
            consentType: $this->consentType,
            grantedAt: $this->grantedAt,
            granted: false,
            revokedAt: $revokedAt,
            version: $this->version + 1,
        );
    }
}
```

These value objects and entities form the domain layer. They have **zero framework dependencies** — no PDO, no HTTP, no annotations. They are pure PHP objects that enforce business rules through their constructors and named factory methods.

</section>

<section lang="id">

## Memodelkan Domain: Value Object dan Entity

Data kesehatan bukanlah sekumpulan string. Setiap informasi memiliki aturan. Nomor rekam medis mengikuti format spesifik. Nomor telepon memiliki pola yang valid. Alamat email harus benar secara struktural. Memodelkan ini sebagai **value object**, tipe yang immutable dan memvalidasi diri sendiri, menangkap kesalahan pada waktu konstruksi, bukan di dalam method service.

### Value Object `MedicalRecordNumber`

Nomor rekam medis adalah identifier utama untuk pasien. Nomor ini tidak pernah dialokasikan ulang, tidak pernah dihapus, dan harus mengikuti format institusi. Sebuah value object menegakkan aturan-aturan ini:

```php
<?php

declare(strict_types=1);

namespace App\Patient\Domain;

use InvalidArgumentException;

class MedicalRecordNumber
{
    private function __construct(
        public readonly string $value,
    ) {}

    public static function fromString(string $value): self
    {
        $value = trim($value);

        if ($value === '') {
            throw new InvalidArgumentException(
                'Nomor rekam medis tidak boleh kosong.',
            );
        }

        if (strlen($value) > 30) {
            throw new InvalidArgumentException(
                'Nomor rekam medis tidak boleh melebihi 30 karakter.',
            );
        }

        if (!preg_match('/^RM-\d{8}-\d{4}$/', $value)) {
            throw new InvalidArgumentException(
                sprintf(
                    'Nomor rekam medis harus sesuai format RM-YYYYMMDD-NNNN, diterima: %s.',
                    $value,
                ),
            );
        }

        return new self($value);
    }

    public static function generate(\DateTimeImmutable $date, int $sequence): self
    {
        $value = sprintf('RM-%s-%04d', $date->format('Ymd'), $sequence);

        return new self($value);
    }

    public function equals(self $other): bool
    {
        return $this->value === $other->value;
    }

    public function toString(): string
    {
        return $this->value;
    }
}
```

Dengan memodelkan nomor rekam medis sebagai value object, Anda menjamin bahwa setiap `MedicalRecordNumber` di sistem Anda valid. Anda tidak perlu memvalidasinya lagi karena sistem tipe menegakkannya.

### Value Object `Phone`

```php
<?php

declare(strict_types=1);

namespace App\Patient\Domain;

use InvalidArgumentException;

class Phone
{
    private function __construct(
        public readonly string $value,
    ) {}

    public static function fromString(string $value): self
    {
        $value = trim($value);

        $digitsOnly = preg_replace('/[^0-9+]/', '', $value);

        if (strlen($digitsOnly) < 8 || strlen($digitsOnly) > 15) {
            throw new InvalidArgumentException(
                sprintf('Nomor telepon harus memiliki 8-15 digit, diterima %d.', strlen($digitsOnly)),
            );
        }

        return new self($digitsOnly);
    }

    public function equals(self $other): bool
    {
        return $this->value === $other->value;
    }

    public function toString(): string
    {
        return $this->value;
    }
}
```

### Value Object `Email`

```php
<?php

declare(strict_types=1);

namespace App\Patient\Domain;

use InvalidArgumentException;

class Email
{
    private function __construct(
        public readonly string $value,
    ) {}

    public static function fromString(string $value): self
    {
        $value = trim($value);

        if ($value === '') {
            throw new InvalidArgumentException('Email tidak boleh kosong.');
        }

        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException(
                sprintf('Format email tidak valid: %s.', $value),
            );
        }

        return new self(strtolower($value));
    }

    public function equals(self $other): bool
    {
        return $this->value === $other->value;
    }

    public function toString(): string
    {
        return $this->value;
    }
}
```

### Value Object `ContactInfo`

```php
<?php

declare(strict_types=1);

namespace App\Patient\Domain;

class ContactInfo
{
    public function __construct(
        public readonly Phone $phone,
        public readonly ?Email $email,
        public readonly string $street,
        public readonly string $city,
        public readonly string $postalCode,
    ) {}
}
```

### Value Object `EmergencyContact`

```php
<?php

declare(strict_types=1);

namespace App\Patient\Domain;

class EmergencyContact
{
    public function __construct(
        public readonly string $name,
        public readonly string $relationship,
        public readonly Phone $phone,
    ) {
        if (trim($name) === '') {
            throw new \InvalidArgumentException('Nama kontak darurat wajib diisi.');
        }

        if (trim($relationship) === '') {
            throw new \InvalidArgumentException('Hubungan kontak darurat wajib diisi.');
        }
    }
}
```

### Entity `Patient`

```php
<?php

declare(strict_types=1);

namespace App\Patient\Domain;

use DateTimeImmutable;

class Patient
{
    private function __construct(
        public readonly MedicalRecordNumber $medicalRecordNumber,
        public readonly string $fullName,
        public readonly DateTimeImmutable $dateOfBirth,
        public readonly Gender $gender,
        public readonly ?string $nationalId,
        public readonly ContactInfo $contactInfo,
        public readonly ?EmergencyContact $emergencyContact,
        public readonly ConsentRecord $consentRecord,
        public readonly DateTimeImmutable $registeredAt,
    ) {}

    public static function register(
        MedicalRecordNumber $mrn,
        string $fullName,
        DateTimeImmutable $dateOfBirth,
        Gender $gender,
        ?string $nationalId,
        ContactInfo $contactInfo,
        ?EmergencyContact $emergencyContact,
        bool $consentGranted,
    ): self {
        $fullName = trim($fullName);

        if ($fullName === '') {
            throw new \InvalidArgumentException('Nama lengkap pasien wajib diisi.');
        }

        if ($dateOfBirth > new DateTimeImmutable('today')) {
            throw new \InvalidArgumentException('Tanggal lahir tidak boleh di masa depan.');
        }

        if ($nationalId !== null) {
            $nationalId = trim($nationalId);
            if (!preg_match('/^\d{16}$/', $nationalId)) {
                throw new \InvalidArgumentException(
                    sprintf('NIK harus tepat 16 digit, diterima: %s.', $nationalId),
                );
            }
        }

        $consentRecord = new ConsentRecord(
            consentType: ConsentType::FULL,
            grantedAt: new DateTimeImmutable(),
            granted: $consentGranted,
        );

        if (!$consentGranted) {
            throw new \InvalidArgumentException(
                'Persetujuan pasien diperlukan sebelum pendaftaran dapat dilanjutkan.',
            );
        }

        return new self(
            medicalRecordNumber: $mrn,
            fullName: $fullName,
            dateOfBirth: $dateOfBirth,
            gender: $gender,
            nationalId: $nationalId,
            contactInfo: $contactInfo,
            emergencyContact: $emergencyContact,
            consentRecord: $consentRecord,
            registeredAt: new DateTimeImmutable(),
        );
    }
}
```

### Enum dan Value Object Pendukung

```php
<?php

declare(strict_types=1);

namespace App\Patient\Domain;

use DateTimeImmutable;

enum Gender: string
{
    case MALE   = 'male';
    case FEMALE = 'female';
}

enum ConsentType: string
{
    case FULL            = 'full';
    case DATA_COLLECTION = 'data_collection';
    case DATA_SHARING    = 'data_sharing';
}

class ConsentRecord
{
    public function __construct(
        public readonly ConsentType $consentType,
        public readonly DateTimeImmutable $grantedAt,
        public readonly bool $granted,
        public readonly ?DateTimeImmutable $revokedAt = null,
        public readonly int $version = 1,
    ) {}

    public function revoke(DateTimeImmutable $revokedAt): self
    {
        if ($this->revokedAt !== null) {
            throw new \DomainException('Persetujuan sudah dicabut.');
        }

        return new self(
            consentType: $this->consentType,
            grantedAt: $this->grantedAt,
            granted: false,
            revokedAt: $revokedAt,
            version: $this->version + 1,
        );
    }
}
```

Value object dan entity ini membentuk lapisan domain. Mereka memiliki **nol dependensi framework**: tidak ada PDO, tidak ada HTTP, tidak ada anotasi. Mereka adalah objek PHP murni yang menegakkan aturan bisnis melalui konstruktor dan factory method bernama.

</section>

---

<section lang="en">

## Before: A Transaction-Script Style Registration Handler

Before applying SE principles, a typical patient registration handler often looks like this — a procedural script that mixes validation, business logic, and database calls in one function:

```php
<?php

declare(strict_types=1);

class RegistrationController
{
    private \PDO $db;

    public function register(array $request): array
    {
        $errors = [];

        $name = trim($request['name'] ?? '');
        if ($name === '') {
            $errors[] = 'Name is required.';
        }

        $dob = $request['dob'] ?? '';
        if ($dob === '') {
            $errors[] = 'Date of birth is required.';
        } elseif ($dob > date('Y-m-d')) {
            $errors[] = 'Date of birth cannot be in the future.';
        }

        $phone = preg_replace('/[^0-9+]/', '', $request['phone'] ?? '');
        if (strlen($phone) < 8) {
            $errors[] = 'Phone number is invalid.';
        }

        $email = strtolower(trim($request['email'] ?? ''));
        if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Email is invalid.';
        }

        $nik = trim($request['nik'] ?? '');
        if ($nik !== '' && !preg_match('/^\d{16}$/', $nik)) {
            $errors[] = 'NIK must be 16 digits.';
        }

        if (empty($request['consent'])) {
            $errors[] = 'Patient consent is required.';
        }

        $existing = $this->db->prepare(
            'SELECT id FROM patients WHERE phone = ? OR (nik IS NOT NULL AND nik = ?)',
        );
        $existing->execute([$phone, $nik !== '' ? $nik : null]);
        if ($existing->fetch()) {
            $errors[] = 'Duplicate patient detected.';
        }

        if (!empty($errors)) {
            return ['success' => false, 'errors' => $errors];
        }

        $mrn = 'RM-' . date('Ymd') . '-' . sprintf('%04d', $this->getNextSequence());

        $stmt = $this->db->prepare(
            'INSERT INTO patients (mrn, name, dob, gender, nik, phone, email, address, city, postal_code, consent_granted)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        );
        $stmt->execute([
            $mrn, $name, $dob, $request['gender'], $nik,
            $phone, $email, $request['address'], $request['city'],
            $request['postal_code'], 1,
        ]);

        return [
            'success' => true,
            'medical_record_number' => $mrn,
            'patient_id' => $this->db->lastInsertId(),
        ];
    }

    private function getNextSequence(): int
    {
        $stmt = $this->db->query(
            "SELECT COUNT(*) + 1 FROM patients WHERE mrn LIKE 'RM-" . date('Ymd') . "-%'",
        );

        return (int) $stmt->fetchColumn();
    }
}
```

**What is wrong with this approach?**

1. **Mixed responsibilities**: Validation, duplicate checks, MRN generation, and persistence are tangled together. You cannot test any piece independently.
2. **Stringly-typed data**: The medical record number is a raw string — no guarantee it is valid downstream. Phone and email are also raw strings.
3. **No domain layer**: Business rules (consent requirement, NIK validation, duplicate prevention) are interleaved with HTTP and database concerns.
4. **Untestable without a database**: Every test must hit a real PDO connection. You cannot test the validation logic in isolation.
5. **SQL injection risk**: The `getNextSequence` method concatenates a date string into SQL.
6. **No audit trail**: You cannot tell who registered the patient, when the consent was recorded, or whether the consent was later revoked.

This script works for a small clinic today, but it will collapse under the weight of real healthcare requirements.

</section>

<section lang="id">

## Sebelum: Handler Pendaftaran Gaya Transaction-Script

Sebelum menerapkan prinsip SE, handler pendaftaran pasien tipikal sering terlihat seperti skrip prosedural berikut yang mencampur validasi, logika bisnis, dan pemanggilan database dalam satu fungsi:

```php
<?php

declare(strict_types=1);

class RegistrationController
{
    private \PDO $db;

    public function register(array $request): array
    {
        $errors = [];

        $name = trim($request['name'] ?? '');
        if ($name === '') {
            $errors[] = 'Nama wajib diisi.';
        }

        $dob = $request['dob'] ?? '';
        if ($dob === '') {
            $errors[] = 'Tanggal lahir wajib diisi.';
        } elseif ($dob > date('Y-m-d')) {
            $errors[] = 'Tanggal lahir tidak boleh di masa depan.';
        }

        $phone = preg_replace('/[^0-9+]/', '', $request['phone'] ?? '');
        if (strlen($phone) < 8) {
            $errors[] = 'Nomor telepon tidak valid.';
        }

        $email = strtolower(trim($request['email'] ?? ''));
        if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Email tidak valid.';
        }

        $nik = trim($request['nik'] ?? '');
        if ($nik !== '' && !preg_match('/^\d{16}$/', $nik)) {
            $errors[] = 'NIK harus 16 digit.';
        }

        if (empty($request['consent'])) {
            $errors[] = 'Persetujuan pasien diperlukan.';
        }

        $existing = $this->db->prepare(
            'SELECT id FROM patients WHERE phone = ? OR (nik IS NOT NULL AND nik = ?)',
        );
        $existing->execute([$phone, $nik !== '' ? $nik : null]);
        if ($existing->fetch()) {
            $errors[] = 'Pasien duplikat terdeteksi.';
        }

        if (!empty($errors)) {
            return ['success' => false, 'errors' => $errors];
        }

        $mrn = 'RM-' . date('Ymd') . '-' . sprintf('%04d', $this->getNextSequence());

        $stmt = $this->db->prepare(
            'INSERT INTO patients (mrn, name, dob, gender, nik, phone, email, address, city, postal_code, consent_granted)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        );
        $stmt->execute([
            $mrn, $name, $dob, $request['gender'], $nik,
            $phone, $email, $request['address'], $request['city'],
            $request['postal_code'], 1,
        ]);

        return [
            'success' => true,
            'medical_record_number' => $mrn,
            'patient_id' => $this->db->lastInsertId(),
        ];
    }

    private function getNextSequence(): int
    {
        $stmt = $this->db->query(
            "SELECT COUNT(*) + 1 FROM patients WHERE mrn LIKE 'RM-" . date('Ymd') . "-%'",
        );

        return (int) $stmt->fetchColumn();
    }
}
```

**Apa yang salah dengan pendekatan ini?**

1. **Tanggung jawab tercampur**: Validasi, pemeriksaan duplikat, pembuatan MRN, dan persistensi tercampur menjadi satu. Anda tidak dapat menguji bagian mana pun secara independen.
2. **Data bertipe string**: Nomor rekam medis adalah string mentah: tidak ada jaminan valid di hilir. Telepon dan email juga string mentah.
3. **Tidak ada lapisan domain**: Aturan bisnis (persyaratan persetujuan, validasi NIK, pencegahan duplikat) bercampur dengan masalah HTTP dan database.
4. **Tidak dapat diuji tanpa database**: Setiap pengujian harus menggunakan koneksi PDO nyata. Anda tidak dapat menguji logika validasi secara terisolasi.
5. **Risiko SQL injection**: Method `getNextSequence` menggabungkan string tanggal ke dalam SQL.
6. **Tidak ada jejak audit**: Anda tidak dapat mengetahui siapa yang mendaftarkan pasien, kapan persetujuan dicatat, atau apakah persetujuan kemudian dicabut.

Skrip ini bekerja untuk klinik kecil hari ini, tetapi akan runtuh di bawah beban persyaratan kesehatan yang sebenarnya.

</section>

---

<section lang="en">

## After: A Cleaner, Testable Registration Service

Now let us refactor this into a proper domain service. The `PatientRegistrationService` depends on interfaces — not a database — and delegates validation to the value objects we already built.

### The Registration Result DTO

```php
<?php

declare(strict_types=1);

namespace App\Patient\Application;

use App\Patient\Domain\MedicalRecordNumber;

class RegistrationResult
{
    private function __construct(
        public readonly bool $success,
        public readonly ?MedicalRecordNumber $medicalRecordNumber = null,
        public readonly array $errors = [],
        public readonly array $warnings = [],
    ) {}

    public static function success(MedicalRecordNumber $mrn, array $warnings = []): self
    {
        return new self(success: true, medicalRecordNumber: $mrn, warnings: $warnings);
    }

    public static function failure(array $errors): self
    {
        return new self(success: false, errors: $errors);
    }
}
```

### The Repository Interfaces

```php
<?php

declare(strict_types=1);

namespace App\Patient\Domain;

interface PatientRepositoryInterface
{
    public function existsByPhone(Phone $phone): bool;

    public function existsByNationalId(string $nationalId): bool;

    public function existsByNameAndDob(string $fullName, \DateTimeImmutable $dateOfBirth): bool;

    public function getNextSequenceForDate(\DateTimeImmutable $date): int;

    public function save(Patient $patient): void;
}

interface AuditLogInterface
{
    public function record(string $eventType, array $data): void;
}
```

### The Registration DTO (Input)

```php
<?php

declare(strict_types=1);

namespace App\Patient\Application;

use DateTimeImmutable;

class RegisterPatientRequest
{
    public function __construct(
        public readonly string $fullName,
        public readonly DateTimeImmutable $dateOfBirth,
        public readonly string $gender,
        public readonly ?string $nationalId,
        public readonly string $phone,
        public readonly ?string $email,
        public readonly string $street,
        public readonly string $city,
        public readonly string $postalCode,
        public readonly ?string $emergencyContactName,
        public readonly ?string $emergencyContactRelation,
        public readonly ?string $emergencyContactPhone,
        public readonly bool $consentGranted,
    ) {}
}
```

### The Domain Service

```php
<?php

declare(strict_types=1);

namespace App\Patient\Application;

use App\Patient\Domain\ContactInfo;
use App\Patient\Domain\Email;
use App\Patient\Domain\EmergencyContact;
use App\Patient\Domain\Gender;
use App\Patient\Domain\MedicalRecordNumber;
use App\Patient\Domain\Patient;
use App\Patient\Domain\PatientRepositoryInterface;
use App\Patient\Domain\AuditLogInterface;
use App\Patient\Domain\Phone;
use DateTimeImmutable;
use InvalidArgumentException;

class PatientRegistrationService
{
    private const DUPLICATE_NAME_DOB_WARNING = 'A patient with the same name and date of birth already exists. Please verify this is not a duplicate registration.';

    public function __construct(
        private readonly PatientRepositoryInterface $patientRepo,
        private readonly AuditLogInterface $auditLog,
    ) {}

    public function register(RegisterPatientRequest $request): RegistrationResult
    {
        $errors = [];
        $warnings = [];

        try {
            $phone = Phone::fromString($request->phone);
        } catch (InvalidArgumentException $e) {
            $errors[] = $e->getMessage();

            if (empty($errors)) {
                return RegistrationResult::failure($errors);
            }
        }

        try {
            $email = $request->email !== null && $request->email !== ''
                ? Email::fromString($request->email)
                : null;
        } catch (InvalidArgumentException $e) {
            $errors[] = $e->getMessage();
        }

        try {
            $gender = Gender::from($request->gender);
        } catch (\ValueError) {
            $errors[] = sprintf(
                'Invalid gender. Accepted values: male, female. Got: %s.',
                $request->gender,
            );
        }

        if (!empty($errors)) {
            return RegistrationResult::failure($errors);
        }

        $contactInfo = new ContactInfo(
            phone: $phone,
            email: $email,
            street: trim($request->street),
            city: trim($request->city),
            postalCode: trim($request->postalCode),
        );

        $emergencyContact = null;
        if ($request->emergencyContactName !== null && $request->emergencyContactName !== '') {
            try {
                $emergencyPhone = Phone::fromString($request->emergencyContactPhone ?? '');
                $emergencyContact = new EmergencyContact(
                    name: $request->emergencyContactName,
                    relationship: $request->emergencyContactRelation ?? '',
                    phone: $emergencyPhone,
                );
            } catch (InvalidArgumentException $e) {
                $errors[] = 'Emergency contact: ' . $e->getMessage();
            }
        }

        if ($this->patientRepo->existsByPhone($phone)) {
            $errors[] = 'A patient with this phone number is already registered.';
        }

        if ($request->nationalId !== null && $request->nationalId !== '') {
            if ($this->patientRepo->existsByNationalId($request->nationalId)) {
                $errors[] = 'A patient with this NIK is already registered.';
            }
        }

        $nameDobMatch = $this->patientRepo->existsByNameAndDob(
            $request->fullName,
            $request->dateOfBirth,
        );
        if ($nameDobMatch) {
            $warnings[] = self::DUPLICATE_NAME_DOB_WARNING;
        }

        if (!empty($errors)) {
            return RegistrationResult::failure($errors);
        }

        $today = new DateTimeImmutable('today');
        $sequence = $this->patientRepo->getNextSequenceForDate($today);

        try {
            $mrn = MedicalRecordNumber::generate($today, $sequence);
        } catch (InvalidArgumentException $e) {
            return RegistrationResult::failure(['Failed to generate medical record number: ' . $e->getMessage()]);
        }

        try {
            $patient = Patient::register(
                mrn: $mrn,
                fullName: $request->fullName,
                dateOfBirth: $request->dateOfBirth,
                gender: $gender,
                nationalId: $request->nationalId !== '' ? $request->nationalId : null,
                contactInfo: $contactInfo,
                emergencyContact: $emergencyContact,
                consentGranted: $request->consentGranted,
            );
        } catch (InvalidArgumentException $e) {
            return RegistrationResult::failure([$e->getMessage()]);
        }

        $this->patientRepo->save($patient);

        $this->auditLog->record('patient_registered', [
            'medical_record_number' => $mrn->toString(),
            'full_name' => $request->fullName,
            'registered_at' => $patient->registeredAt->format('Y-m-d H:i:s'),
        ]);

        return RegistrationResult::success($mrn, $warnings);
    }
}
```

### What Changed?

| Before (Transaction Script) | After (Domain Service) |
|---|---|
| Phone validated inline with regex | Phone validated once by `Phone` value object — never again |
| Email validated inline with `filter_var` | Email validated once by `Email` value object |
| MRN generated as raw string concatenation | MRN generated by `MedicalRecordNumber::generate()` with format enforcement |
| Duplicate check queries database directly | Duplicate check calls repository interface — swappable for testing |
| No audit trail | Every registration recorded via `AuditLogInterface` |
| Consent stored as integer `1` | Consent modeled as `ConsentRecord` value object with revoke support |
| Untestable without database | All business logic testable with in-memory repositories |

The domain service is **framework-agnostic**. It depends only on PHP interfaces. You can plug in MySQL today and PostgreSQL tomorrow without changing a single line of business logic.

</section>

<section lang="id">

## Setelah: Layanan Pendaftaran yang Lebih Bersih dan Dapat Diuji

Sekarang mari kita *refactor* ini menjadi domain service yang tepat. `PatientRegistrationService` bergantung pada interface, bukan database, dan mendelegasikan validasi ke value object yang sudah kita bangun.

### DTO RegistrationResult

```php
<?php

declare(strict_types=1);

namespace App\Patient\Application;

use App\Patient\Domain\MedicalRecordNumber;

class RegistrationResult
{
    private function __construct(
        public readonly bool $success,
        public readonly ?MedicalRecordNumber $medicalRecordNumber = null,
        public readonly array $errors = [],
        public readonly array $warnings = [],
    ) {}

    public static function success(MedicalRecordNumber $mrn, array $warnings = []): self
    {
        return new self(success: true, medicalRecordNumber: $mrn, warnings: $warnings);
    }

    public static function failure(array $errors): self
    {
        return new self(success: false, errors: $errors);
    }
}
```

### Interface Repository

```php
<?php

declare(strict_types=1);

namespace App\Patient\Domain;

interface PatientRepositoryInterface
{
    public function existsByPhone(Phone $phone): bool;

    public function existsByNationalId(string $nationalId): bool;

    public function existsByNameAndDob(string $fullName, \DateTimeImmutable $dateOfBirth): bool;

    public function getNextSequenceForDate(\DateTimeImmutable $date): int;

    public function save(Patient $patient): void;
}

interface AuditLogInterface
{
    public function record(string $eventType, array $data): void;
}
```

### DTO RegisterPatientRequest (Input)

```php
<?php

declare(strict_types=1);

namespace App\Patient\Application;

use DateTimeImmutable;

class RegisterPatientRequest
{
    public function __construct(
        public readonly string $fullName,
        public readonly DateTimeImmutable $dateOfBirth,
        public readonly string $gender,
        public readonly ?string $nationalId,
        public readonly string $phone,
        public readonly ?string $email,
        public readonly string $street,
        public readonly string $city,
        public readonly string $postalCode,
        public readonly ?string $emergencyContactName,
        public readonly ?string $emergencyContactRelation,
        public readonly ?string $emergencyContactPhone,
        public readonly bool $consentGranted,
    ) {}
}
```

### Domain Service

```php
<?php

declare(strict_types=1);

namespace App\Patient\Application;

use App\Patient\Domain\ContactInfo;
use App\Patient\Domain\Email;
use App\Patient\Domain\EmergencyContact;
use App\Patient\Domain\Gender;
use App\Patient\Domain\MedicalRecordNumber;
use App\Patient\Domain\Patient;
use App\Patient\Domain\PatientRepositoryInterface;
use App\Patient\Domain\AuditLogInterface;
use App\Patient\Domain\Phone;
use DateTimeImmutable;
use InvalidArgumentException;

class PatientRegistrationService
{
    private const DUPLICATE_NAME_DOB_WARNING = 'Pasien dengan nama dan tanggal lahir yang sama sudah ada. Harap verifikasi ini bukan pendaftaran duplikat.';

    public function __construct(
        private readonly PatientRepositoryInterface $patientRepo,
        private readonly AuditLogInterface $auditLog,
    ) {}

    public function register(RegisterPatientRequest $request): RegistrationResult
    {
        $errors = [];
        $warnings = [];

        try {
            $phone = Phone::fromString($request->phone);
        } catch (InvalidArgumentException $e) {
            $errors[] = $e->getMessage();
        }

        try {
            $email = $request->email !== null && $request->email !== ''
                ? Email::fromString($request->email)
                : null;
        } catch (InvalidArgumentException $e) {
            $errors[] = $e->getMessage();
        }

        try {
            $gender = Gender::from($request->gender);
        } catch (\ValueError) {
            $errors[] = sprintf(
                'Jenis kelamin tidak valid. Nilai yang diterima: male, female. Diterima: %s.',
                $request->gender,
            );
        }

        if (!empty($errors)) {
            return RegistrationResult::failure($errors);
        }

        $contactInfo = new ContactInfo(
            phone: $phone,
            email: $email,
            street: trim($request->street),
            city: trim($request->city),
            postalCode: trim($request->postalCode),
        );

        $emergencyContact = null;
        if ($request->emergencyContactName !== null && $request->emergencyContactName !== '') {
            try {
                $emergencyPhone = Phone::fromString($request->emergencyContactPhone ?? '');
                $emergencyContact = new EmergencyContact(
                    name: $request->emergencyContactName,
                    relationship: $request->emergencyContactRelation ?? '',
                    phone: $emergencyPhone,
                );
            } catch (InvalidArgumentException $e) {
                $errors[] = 'Kontak darurat: ' . $e->getMessage();
            }
        }

        if ($this->patientRepo->existsByPhone($phone)) {
            $errors[] = 'Pasien dengan nomor telepon ini sudah terdaftar.';
        }

        if ($request->nationalId !== null && $request->nationalId !== '') {
            if ($this->patientRepo->existsByNationalId($request->nationalId)) {
                $errors[] = 'Pasien dengan NIK ini sudah terdaftar.';
            }
        }

        $nameDobMatch = $this->patientRepo->existsByNameAndDob(
            $request->fullName,
            $request->dateOfBirth,
        );
        if ($nameDobMatch) {
            $warnings[] = self::DUPLICATE_NAME_DOB_WARNING;
        }

        if (!empty($errors)) {
            return RegistrationResult::failure($errors);
        }

        $today = new DateTimeImmutable('today');
        $sequence = $this->patientRepo->getNextSequenceForDate($today);

        try {
            $mrn = MedicalRecordNumber::generate($today, $sequence);
        } catch (InvalidArgumentException $e) {
            return RegistrationResult::failure(['Gagal membuat nomor rekam medis: ' . $e->getMessage()]);
        }

        try {
            $patient = Patient::register(
                mrn: $mrn,
                fullName: $request->fullName,
                dateOfBirth: $request->dateOfBirth,
                gender: $gender,
                nationalId: $request->nationalId !== '' ? $request->nationalId : null,
                contactInfo: $contactInfo,
                emergencyContact: $emergencyContact,
                consentGranted: $request->consentGranted,
            );
        } catch (InvalidArgumentException $e) {
            return RegistrationResult::failure([$e->getMessage()]);
        }

        $this->patientRepo->save($patient);

        $this->auditLog->record('patient_registered', [
            'medical_record_number' => $mrn->toString(),
            'full_name' => $request->fullName,
            'registered_at' => $patient->registeredAt->format('Y-m-d H:i:s'),
        ]);

        return RegistrationResult::success($mrn, $warnings);
    }
}
```

### Apa yang Berubah?

| Sebelum (Transaction Script) | Setelah (Domain Service) |
|---|---|
| Telepon divalidasi inline dengan regex | Telepon divalidasi sekali oleh value object `Phone`, tidak pernah lagi |
| Email divalidasi inline dengan `filter_var` | Email divalidasi sekali oleh value object `Email` |
| MRN dibuat sebagai penggabungan string mentah | MRN dibuat oleh `MedicalRecordNumber::generate()` dengan penegakan format |
| Pemeriksaan duplikat query database langsung | Pemeriksaan duplikat memanggil interface repository, dapat ditukar untuk pengujian |
| Tidak ada jejak audit | Setiap pendaftaran dicatat melalui `AuditLogInterface` |
| Persetujuan disimpan sebagai integer `1` | Persetujuan dimodelkan sebagai value object `ConsentRecord` dengan dukungan pencabutan |
| Tidak dapat diuji tanpa database | Semua logika bisnis dapat diuji dengan repository in-memory |

Domain service ini **agnostik framework**. Ia hanya bergantung pada interface PHP. Anda dapat menggunakan MySQL hari ini dan PostgreSQL besok tanpa mengubah satu baris pun logika bisnis.

</section>

---

<section lang="en">

## Guarding Invariants: Validating Patient Data and Duplicate Checks

Healthcare systems have stricter validation requirements than most domains. A duplicate patient record is not just a data quality issue — it can lead to fragmented medical histories, missed allergies, and incorrect treatments. Let us look at the specific invariants guarded by our service.

### Duplicate Detection Strategy

Our service checks three layers of duplication:

| Check | Method | Rationale |
|---|---|---|
| **Phone number** | Exact match on normalised digits | Phone numbers are quasi-unique identifiers in many Indonesian clinics. |
| **National ID (NIK)** | Exact match on 16-digit string | NIK is a national unique identifier. Two patients cannot share a NIK. |
| **Name + Date of Birth** | Exact match on both fields | Same name + same DOB is a strong signal of duplicate. We emit a **warning**, not an error, because genuine coincidences happen (twins, common names). |

A warning is not a blocker — the staff member can override it. But the system should never silently create a duplicate.

### Validation Layers

```
HTTP Input → RegisterPatientRequest (syntactic: all fields present)
           → Value Objects (semantic: Phone format, Email format, NIK format)
           → Patient::register() (domain invariants: name non-empty, DOB not future, consent required)
           → PatientRegistrationService (contextual: duplicate check, MRN generation)
           → Repository (persistence)
```

Each layer catches a different class of error:

- **Syntactic errors** (missing fields) → caught by the controller before the DTO is built
- **Semantic errors** (invalid phone format) → caught by value objects at construction time
- **Domain invariants** (consent missing) → caught by `Patient::register()`
- **Contextual rules** (duplicate patient) → caught by the service using repository queries
- **Persistence errors** (database unavailable) → caught by the repository implementation

This layered approach means each class has a single responsibility. Your value objects do not query the database. Your service does not validate phone formats. Your repository implements only persistence.

</section>

<section lang="id">

## Menjaga Invarian: Memvalidasi Data Pasien dan Pemeriksaan Duplikat

Sistem kesehatan memiliki persyaratan validasi yang lebih ketat daripada kebanyakan domain. Catatan pasien duplikat bukan hanya masalah kualitas data: ini dapat menyebabkan riwayat medis terfragmentasi, alergi yang terlewat, dan perawatan yang salah. Mari kita lihat invarian spesifik yang dijaga oleh layanan kita.

### Strategi Deteksi Duplikat

Layanan kita memeriksa tiga lapisan duplikasi:

| Pemeriksaan | Metode | Alasan |
|---|---|---|
| **Nomor telepon** | Pencocokan tepat pada digit yang dinormalisasi | Nomor telepon adalah identifier quasi-unik di banyak klinik Indonesia. |
| **NIK** | Pencocokan tepat pada string 16 digit | NIK adalah identifier unik nasional. Dua pasien tidak dapat berbagi NIK. |
| **Nama + Tanggal Lahir** | Pencocokan tepat pada kedua field | Nama sama + TTL sama adalah sinyal kuat duplikat. Kami mengeluarkan **peringatan**, bukan error, karena kebetulan asli terjadi (kembar, nama umum). |

Peringatan bukanlah pemblokir: staf dapat mengabaikannya. Tetapi sistem tidak boleh diam-diam membuat duplikat.

### Lapisan Validasi

```
Input HTTP → RegisterPatientRequest (sintaktik: semua field ada)
           → Value Object (semantik: format Phone, format Email, format NIK)
           → Patient::register() (invarian domain: nama tidak kosong, TTL bukan masa depan, persetujuan diperlukan)
           → PatientRegistrationService (kontekstual: pemeriksaan duplikat, pembuatan MRN)
           → Repository (persistensi)
```

Setiap lapisan menangkap kelas kesalahan yang berbeda:

- **Kesalahan sintaktik** (field hilang) → ditangkap oleh controller sebelum DTO dibangun
- **Kesalahan semantik** (format telepon tidak valid) → ditangkap oleh value object pada waktu konstruksi
- **Invarian domain** (persetujuan hilang) → ditangkap oleh `Patient::register()`
- **Aturan kontekstual** (pasien duplikat) → ditangkap oleh service menggunakan query repository
- **Kesalahan persistensi** (database tidak tersedia) → ditangkap oleh implementasi repository

Pendekatan berlapis ini berarti setiap kelas memiliki tanggung jawab tunggal. Value object Anda tidak melakukan query database. Service Anda tidak memvalidasi format telepon. Repository Anda hanya mengimplementasikan persistensi.

</section>

---

<section lang="en">

## Privacy & Consent Basics for Health Data

Privacy is not an afterthought in healthcare software — it is a legal and ethical obligation. While this tutorial is not legal advice, understanding the principles helps you build systems that protect patients from day one.

### Core Privacy Principles

| Principle | What It Means | Code Implication |
|---|---|---|
| **Data minimisation** | Collect only what is clinically necessary | `RegisterPatientRequest` should not include fields like "hobby" or "social media profile" |
| **Purpose limitation** | Use data only for the purpose it was collected | Do not reuse registration data for marketing without separate consent |
| **Consent management** | Patients control their data | Our `ConsentRecord` supports granular types (collection, sharing) and revocation |
| **Right to access** | Patients can request a copy of their data | The system must export all data linked to a medical record number |
| **Right to erasure** | Patients can request deletion (subject to legal retention requirements) | Implement soft-delete with retention period; medical records often have mandatory retention (5-10 years in Indonesia) |
| **Audit trail** | Every access and modification is logged | Our `AuditLogInterface` records registration events; extend it to record data access |
| **Encryption at rest** | Data stored in the database must be encrypted | Use MySQL InnoDB tablespace encryption or application-level encryption for sensitive fields |

### Indonesia's Regulatory Landscape

In Indonesia, healthcare data protection is governed by:
- **UU No. 17 Tahun 2023 tentang Kesehatan** — establishes patient data confidentiality requirements
- **UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (PDP)** — Indonesia's general data protection law
- **Permenkes No. 24 Tahun 2022** — electronic medical record regulations under SATUSEHAT

Key takeaways for developers:
1. Health data is classified as "specific personal data" under PDP Law — requiring higher protection standards
2. Data controllers must appoint a Data Protection Officer (DPO)
3. Data breaches must be reported within 3×24 hours
4. Consent must be explicit, informed, and recorded (our `ConsentRecord` models this)
5. Patients have the right to access, correct, and delete their data

### What NOT to Do

```php
// NEVER log or expose patient data in error messages
error_log("Patient {$patient->fullName} with NIK {$patient->nationalId} registration failed");

// NEVER include sensitive data in URLs
header("Location: /patients?mrn={$mrn->toString()}&nik={$request->nationalId}");

// NEVER store plaintext passwords or PINs — even for clinic staff
$stmt->execute([$username, $password]); // this should be password_hash()

// NEVER share patient data with third parties without explicit consent
$analytics->track('patient_registered', [
    'name' => $request->fullName,     // NO
    'mrn'  => $mrn->toString(),       // NO
    'city' => $request->city,         // OK if anonymised and aggregated
]);
```

### Practical Privacy Checklist

- [ ] All patient-identifiable fields are stored in encrypted database columns or tablespaces
- [ ] Access to patient data is logged with `who`, `when`, `what`, and `why`
- [ ] Consent is recorded before any data is persisted
- [ ] Data export and deletion requests have documented procedures
- [ ] Error messages and logs never contain patient identifiers
- [ ] Third-party integrations (labs, pharmacies) use de-identified data or have explicit patient consent

</section>

<section lang="id">

## Dasar-Dasar Privasi & Persetujuan untuk Data Kesehatan

Privasi bukanlah pemikiran belakangan dalam perangkat lunak kesehatan: ini adalah kewajiban hukum dan etika. Meskipun tutorial ini bukan nasihat hukum, memahami prinsip-prinsipnya membantu Anda membangun sistem yang melindungi pasien sejak hari pertama.

### Prinsip Privasi Inti

| Prinsip | Artinya | Implikasi Kode |
|---|---|---|
| **Minimalisasi data** | Kumpulkan hanya yang diperlukan secara klinis | `RegisterPatientRequest` tidak boleh menyertakan field seperti "hobi" atau "profil media sosial" |
| **Pembatasan tujuan** | Gunakan data hanya untuk tujuan pengumpulannya | Jangan gunakan ulang data pendaftaran untuk pemasaran tanpa persetujuan terpisah |
| **Manajemen persetujuan** | Pasien mengontrol data mereka | `ConsentRecord` kami mendukung tipe granular (pengumpulan, berbagi) dan pencabutan |
| **Hak akses** | Pasien dapat meminta salinan data mereka | Sistem harus mengekspor semua data yang terkait dengan nomor rekam medis |
| **Hak penghapusan** | Pasien dapat meminta penghapusan (tunduk pada persyaratan retensi hukum) | Implementasikan soft-delete dengan periode retensi; rekam medis sering memiliki retensi wajib (5-10 tahun di Indonesia) |
| **Jejak audit** | Setiap akses dan modifikasi dicatat | `AuditLogInterface` kami mencatat kejadian pendaftaran; perluas untuk mencatat akses data |
| **Enkripsi saat disimpan** | Data yang disimpan di database harus dienkripsi | Gunakan enkripsi tablespace MySQL InnoDB atau enkripsi level aplikasi untuk field sensitif |

### Lanskap Regulasi Indonesia

Di Indonesia, perlindungan data kesehatan diatur oleh:
- **UU No. 17 Tahun 2023 tentang Kesehatan**: menetapkan persyaratan kerahasiaan data pasien
- **UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (PDP)**: undang-undang perlindungan data umum Indonesia
- **Permenkes No. 24 Tahun 2022**: regulasi rekam medis elektronik di bawah SATUSEHAT

Poin penting untuk pengembang:
1. Data kesehatan diklasifikasikan sebagai "data pribadi spesifik" di bawah UU PDP, yang membutuhkan standar perlindungan lebih tinggi
2. Pengendali data harus menunjuk Pejabat Pelindungan Data (DPO)
3. Pelanggaran data harus dilaporkan dalam 3×24 jam
4. Persetujuan harus eksplisit, terinformasi, dan dicatat (`ConsentRecord` kami memodelkan ini)
5. Pasien memiliki hak untuk mengakses, memperbaiki, dan menghapus data mereka

### Yang TIDAK BOLEH Dilakukan

```php
// JANGAN PERNAH mencatat atau mengekspos data pasien dalam pesan error
error_log("Pendaftaran pasien {$patient->fullName} dengan NIK {$patient->nationalId} gagal");

// JANGAN PERNAH menyertakan data sensitif dalam URL
header("Location: /patients?mrn={$mrn->toString()}&nik={$request->nationalId}");

// JANGAN PERNAH menyimpan password atau PIN plaintext — bahkan untuk staf klinik
$stmt->execute([$username, $password]); // ini seharusnya password_hash()

// JANGAN PERNAH membagikan data pasien ke pihak ketiga tanpa persetujuan eksplisit
$analytics->track('patient_registered', [
    'name' => $request->fullName,     // JANGAN
    'mrn'  => $mrn->toString(),       // JANGAN
    'city' => $request->city,         // BOLEH jika dianonimkan dan diagregasi
]);
```

### Daftar Periksa Privasi Praktis

- [ ] Semua field yang dapat diidentifikasi pasien disimpan dalam kolom atau tablespace database terenkripsi
- [ ] Akses ke data pasien dicatat dengan `siapa`, `kapan`, `apa`, dan `mengapa`
- [ ] Persetujuan dicatat sebelum data apa pun disimpan
- [ ] Permintaan ekspor dan penghapusan data memiliki prosedur terdokumentasi
- [ ] Pesan error dan log tidak pernah mengandung identifier pasien
- [ ] Integrasi pihak ketiga (lab, apotek) menggunakan data yang di-de-identifikasi atau memiliki persetujuan pasien eksplisit

</section>

---

<section lang="en">

## Putting It Together: A Slim/Laravel-Style Controller Example

Now let us see how the domain service integrates into a web application. This controller is thin — it only translates HTTP to the domain layer and back. No business logic lives here.

```php
<?php

declare(strict_types=1);

namespace App\Patient\Infrastructure\Http;

use App\Patient\Application\PatientRegistrationService;
use App\Patient\Application\RegisterPatientRequest;
use DateTimeImmutable;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class PatientRegistrationController
{
    public function __construct(
        private readonly PatientRegistrationService $registrationService,
    ) {}

    public function register(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $body = $request->getParsedBody();

        $requiredFields = ['full_name', 'date_of_birth', 'gender', 'phone', 'street', 'city', 'postal_code', 'consent_granted'];
        $missingFields = [];

        foreach ($requiredFields as $field) {
            if (empty($body[$field]) && $body[$field] !== '0') {
                $missingFields[] = $field;
            }
        }

        if (!empty($missingFields)) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'errors'  => array_map(
                    fn(string $field): string => sprintf('Field "%s" is required.', $field),
                    $missingFields,
                ),
            ], JSON_UNESCAPED_UNICODE));

            return $response->withStatus(422)->withHeader('Content-Type', 'application/json');
        }

        $registerRequest = new RegisterPatientRequest(
            fullName: $body['full_name'],
            dateOfBirth: new DateTimeImmutable($body['date_of_birth']),
            gender: $body['gender'],
            nationalId: $body['nik'] ?? null,
            phone: $body['phone'],
            email: $body['email'] ?? null,
            street: $body['street'],
            city: $body['city'],
            postalCode: $body['postal_code'],
            emergencyContactName: $body['emergency_contact_name'] ?? null,
            emergencyContactRelation: $body['emergency_contact_relation'] ?? null,
            emergencyContactPhone: $body['emergency_contact_phone'] ?? null,
            consentGranted: (bool) ($body['consent_granted'] ?? false),
        );

        $result = $this->registrationService->register($registerRequest);

        if (!$result->success) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'errors'  => $result->errors,
            ], JSON_UNESCAPED_UNICODE));

            return $response->withStatus(422)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode([
            'success'               => true,
            'medical_record_number' => $result->medicalRecordNumber->toString(),
            'warnings'              => $result->warnings,
        ], JSON_UNESCAPED_UNICODE));

        return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
    }
}
```

**The controller's only job** is to extract fields from the HTTP request, build a `RegisterPatientRequest` DTO, call the service, and map the result back to an HTTP response. Notice:
- No validation logic (delegated to value objects and the `Patient::register()` factory)
- No duplicate checking (delegated to `PatientRegistrationService`)
- No MRN generation (delegated to `MedicalRecordNumber::generate()`)
- No database queries (delegated to repository implementations)

If you switch to Laravel, the controller changes — `$request->input('full_name')` instead of `$body['full_name']`. But the `PatientRegistrationService` and all domain code remain identical.

</section>

<section lang="id">

## Menyatukan Semua: Contoh Controller Ala Slim/Laravel

Sekarang mari kita lihat bagaimana domain service terintegrasi ke dalam aplikasi web. Controller ini tipis: ia hanya menerjemahkan HTTP ke lapisan domain dan kembali. Tidak ada logika bisnis yang tinggal di sini.

```php
<?php

declare(strict_types=1);

namespace App\Patient\Infrastructure\Http;

use App\Patient\Application\PatientRegistrationService;
use App\Patient\Application\RegisterPatientRequest;
use DateTimeImmutable;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class PatientRegistrationController
{
    public function __construct(
        private readonly PatientRegistrationService $registrationService,
    ) {}

    public function register(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $body = $request->getParsedBody();

        $requiredFields = ['full_name', 'date_of_birth', 'gender', 'phone', 'street', 'city', 'postal_code', 'consent_granted'];
        $missingFields = [];

        foreach ($requiredFields as $field) {
            if (empty($body[$field]) && $body[$field] !== '0') {
                $missingFields[] = $field;
            }
        }

        if (!empty($missingFields)) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'errors'  => array_map(
                    fn(string $field): string => sprintf('Field "%s" wajib diisi.', $field),
                    $missingFields,
                ),
            ], JSON_UNESCAPED_UNICODE));

            return $response->withStatus(422)->withHeader('Content-Type', 'application/json');
        }

        $registerRequest = new RegisterPatientRequest(
            fullName: $body['full_name'],
            dateOfBirth: new DateTimeImmutable($body['date_of_birth']),
            gender: $body['gender'],
            nationalId: $body['nik'] ?? null,
            phone: $body['phone'],
            email: $body['email'] ?? null,
            street: $body['street'],
            city: $body['city'],
            postalCode: $body['postal_code'],
            emergencyContactName: $body['emergency_contact_name'] ?? null,
            emergencyContactRelation: $body['emergency_contact_relation'] ?? null,
            emergencyContactPhone: $body['emergency_contact_phone'] ?? null,
            consentGranted: (bool) ($body['consent_granted'] ?? false),
        );

        $result = $this->registrationService->register($registerRequest);

        if (!$result->success) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'errors'  => $result->errors,
            ], JSON_UNESCAPED_UNICODE));

            return $response->withStatus(422)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode([
            'success'               => true,
            'medical_record_number' => $result->medicalRecordNumber->toString(),
            'warnings'              => $result->warnings,
        ], JSON_UNESCAPED_UNICODE));

        return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
    }
}
```

**Satu-satunya tugas controller** adalah mengekstrak field dari permintaan HTTP, membangun DTO `RegisterPatientRequest`, memanggil service, dan memetakan hasilnya kembali ke respons HTTP. Perhatikan:
- Tidak ada logika validasi (didelegasikan ke value object dan factory `Patient::register()`)
- Tidak ada pemeriksaan duplikat (didelegasikan ke `PatientRegistrationService`)
- Tidak ada pembuatan MRN (didelegasikan ke `MedicalRecordNumber::generate()`)
- Tidak ada query database (didelegasikan ke implementasi repository)

Jika Anda beralih ke Laravel, controller berubah: `$request->input('full_name')` alih-alih `$body['full_name']`. Tetapi `PatientRegistrationService` dan semua kode domain tetap identik.

</section>

---

<section lang="en">

## Test-Driving the Registration Flow with PHPUnit

The real benefit of the layered architecture becomes clear when you write tests. Every business rule is testable in isolation, without a database connection. Here is a complete PHPUnit test suite using in-memory repositories.

### PHPUnit Tests

```php
<?php

declare(strict_types=1);

namespace App\Tests\Patient\Application;

use App\Patient\Application\PatientRegistrationService;
use App\Patient\Application\RegisterPatientRequest;
use App\Patient\Application\RegistrationResult;
use App\Patient\Domain\AuditLogInterface;
use App\Patient\Domain\PatientRepositoryInterface;
use App\Patient\Domain\Patient;
use App\Patient\Domain\Phone;
use DateTimeImmutable;
use PHPUnit\Framework\TestCase;

class PatientRegistrationServiceTest extends TestCase
{
    private PatientRegistrationService $service;
    private InMemoryPatientRepository $patientRepo;
    private InMemoryAuditLog $auditLog;

    protected function setUp(): void
    {
        $this->patientRepo = new InMemoryPatientRepository();
        $this->auditLog    = new InMemoryAuditLog();
        $this->service     = new PatientRegistrationService(
            $this->patientRepo,
            $this->auditLog,
        );
    }

    private function validRequest(): RegisterPatientRequest
    {
        return new RegisterPatientRequest(
            fullName: 'Siti Aminah',
            dateOfBirth: new DateTimeImmutable('1990-05-15'),
            gender: 'female',
            nationalId: '3573015505900001',
            phone: '+6281234567890',
            email: 'siti.aminah@email.com',
            street: 'Jl. Mawar No. 12',
            city: 'Malang',
            postalCode: '65141',
            emergencyContactName: 'Budi Santoso',
            emergencyContactRelation: 'Suami',
            emergencyContactPhone: '+6281234567891',
            consentGranted: true,
        );
    }

    /* ---------- Happy Path ---------- */

    public function testSuccessfulPatientRegistration(): void
    {
        $request = $this->validRequest();
        $result  = $this->service->register($request);

        $this->assertTrue($result->success);
        $this->assertNotNull($result->medicalRecordNumber);
        $this->assertStringStartsWith('RM-', $result->medicalRecordNumber->toString());
        $this->assertEmpty($result->errors);
    }

    public function testRegistrationGeneratesCorrectMRNFormat(): void
    {
        $request = $this->validRequest();
        $result  = $this->service->register($request);

        $this->assertTrue($result->success);
        $this->assertMatchesRegularExpression(
            '/^RM-\d{8}-\d{4}$/',
            $result->medicalRecordNumber->toString(),
        );
    }

    public function testRegistrationRecordsAuditLog(): void
    {
        $request = $this->validRequest();
        $this->service->register($request);

        $logs = iterator_to_array($this->auditLog->all());
        $this->assertCount(1, $logs);
        $this->assertEquals('patient_registered', $logs[0]['event_type']);
        $this->assertArrayHasKey('medical_record_number', $logs[0]['data']);
    }

    public function testRegistrationWithoutEmailSucceeds(): void
    {
        $request = new RegisterPatientRequest(
            fullName: 'Ahmad Dhani',
            dateOfBirth: new DateTimeImmutable('1985-03-20'),
            gender: 'male',
            nationalId: null,
            phone: '+6281234567892',
            email: null,
            street: 'Jl. Melati No. 5',
            city: 'Surabaya',
            postalCode: '60111',
            emergencyContactName: null,
            emergencyContactRelation: null,
            emergencyContactPhone: null,
            consentGranted: true,
        );

        $result = $this->service->register($request);

        $this->assertTrue($result->success);
        $this->assertNotNull($result->medicalRecordNumber);
    }

    /* ---------- Validation Failures ---------- */

    public function testRegistrationFailsWhenConsentIsNotGranted(): void
    {
        $request = new RegisterPatientRequest(
            fullName: 'Siti Aminah',
            dateOfBirth: new DateTimeImmutable('1990-05-15'),
            gender: 'female',
            nationalId: null,
            phone: '+6281234567890',
            email: null,
            street: 'Jl. Mawar No. 12',
            city: 'Malang',
            postalCode: '65141',
            emergencyContactName: null,
            emergencyContactRelation: null,
            emergencyContactPhone: null,
            consentGranted: false,
        );

        $result = $this->service->register($request);

        $this->assertFalse($result->success);
        $this->assertStringContainsString('consent', strtolower($result->errors[0]));
    }

    public function testRegistrationFailsWhenPhoneIsInvalid(): void
    {
        $request = new RegisterPatientRequest(
            fullName: 'Siti Aminah',
            dateOfBirth: new DateTimeImmutable('1990-05-15'),
            gender: 'female',
            nationalId: null,
            phone: '123',
            email: null,
            street: 'Jl. Mawar No. 12',
            city: 'Malang',
            postalCode: '65141',
            emergencyContactName: null,
            emergencyContactRelation: null,
            emergencyContactPhone: null,
            consentGranted: true,
        );

        $result = $this->service->register($request);

        $this->assertFalse($result->success);
        $this->assertStringContainsString('8-15', $result->errors[0]);
    }

    public function testRegistrationFailsWhenEmailIsInvalid(): void
    {
        $request = new RegisterPatientRequest(
            fullName: 'Siti Aminah',
            dateOfBirth: new DateTimeImmutable('1990-05-15'),
            gender: 'female',
            nationalId: null,
            phone: '+6281234567890',
            email: 'not-an-email',
            street: 'Jl. Mawar No. 12',
            city: 'Malang',
            postalCode: '65141',
            emergencyContactName: null,
            emergencyContactRelation: null,
            emergencyContactPhone: null,
            consentGranted: true,
        );

        $result = $this->service->register($request);

        $this->assertFalse($result->success);
        $this->assertStringContainsString('email', strtolower($result->errors[0]));
    }

    public function testRegistrationFailsWhenGenderIsInvalid(): void
    {
        $request = new RegisterPatientRequest(
            fullName: 'Siti Aminah',
            dateOfBirth: new DateTimeImmutable('1990-05-15'),
            gender: 'unknown',
            nationalId: null,
            phone: '+6281234567890',
            email: null,
            street: 'Jl. Mawar No. 12',
            city: 'Malang',
            postalCode: '65141',
            emergencyContactName: null,
            emergencyContactRelation: null,
            emergencyContactPhone: null,
            consentGranted: true,
        );

        $result = $this->service->register($request);

        $this->assertFalse($result->success);
        $this->assertStringContainsString('gender', strtolower($result->errors[0]));
    }

    public function testRegistrationFailsWhenNameIsEmpty(): void
    {
        $request = new RegisterPatientRequest(
            fullName: '',
            dateOfBirth: new DateTimeImmutable('1990-05-15'),
            gender: 'female',
            nationalId: null,
            phone: '+6281234567890',
            email: null,
            street: 'Jl. Mawar No. 12',
            city: 'Malang',
            postalCode: '65141',
            emergencyContactName: null,
            emergencyContactRelation: null,
            emergencyContactPhone: null,
            consentGranted: true,
        );

        $result = $this->service->register($request);

        $this->assertFalse($result->success);
        $this->assertStringContainsString('name', strtolower($result->errors[0]));
    }

    public function testRegistrationFailsWhenDateOfBirthIsInFuture(): void
    {
        $request = new RegisterPatientRequest(
            fullName: 'Siti Aminah',
            dateOfBirth: new DateTimeImmutable('2099-05-15'),
            gender: 'female',
            nationalId: null,
            phone: '+6281234567890',
            email: null,
            street: 'Jl. Mawar No. 12',
            city: 'Malang',
            postalCode: '65141',
            emergencyContactName: null,
            emergencyContactRelation: null,
            emergencyContactPhone: null,
            consentGranted: true,
        );

        $result = $this->service->register($request);

        $this->assertFalse($result->success);
        $this->assertStringContainsString('future', strtolower($result->errors[0]));
    }

    public function testRegistrationFailsWhenNIKIsInvalid(): void
    {
        $request = new RegisterPatientRequest(
            fullName: 'Siti Aminah',
            dateOfBirth: new DateTimeImmutable('1990-05-15'),
            gender: 'female',
            nationalId: '12345',
            phone: '+6281234567890',
            email: null,
            street: 'Jl. Mawar No. 12',
            city: 'Malang',
            postalCode: '65141',
            emergencyContactName: null,
            emergencyContactRelation: null,
            emergencyContactPhone: null,
            consentGranted: true,
        );

        $result = $this->service->register($request);

        $this->assertFalse($result->success);
        $this->assertStringContainsString('16', $result->errors[0]);
    }

    /* ---------- Duplicate Detection ---------- */

    public function testRegistrationFailsWhenDuplicatePhone(): void
    {
        $firstRequest = $this->validRequest();
        $this->service->register($firstRequest);

        $secondRequest = $this->validRequest();
        $result = $this->service->register($secondRequest);

        $this->assertFalse($result->success);
        $this->assertStringContainsString('phone', strtolower($result->errors[0]));
    }

    public function testRegistrationFailsWhenDuplicateNIK(): void
    {
        $firstRequest = $this->validRequest();
        $this->service->register($firstRequest);

        $secondRequest = new RegisterPatientRequest(
            fullName: 'Ahmad Dhani',
            dateOfBirth: new DateTimeImmutable('1985-03-20'),
            gender: 'male',
            nationalId: '3573015505900001',
            phone: '+6289876543210',
            email: null,
            street: 'Jl. Anggrek No. 7',
            city: 'Surabaya',
            postalCode: '60111',
            emergencyContactName: null,
            emergencyContactRelation: null,
            emergencyContactPhone: null,
            consentGranted: true,
        );

        $result = $this->service->register($secondRequest);

        $this->assertFalse($result->success);
        $this->assertStringContainsString('nik', strtolower($result->errors[0]));
    }

    public function testRegistrationWarnsWhenSameNameAndDOB(): void
    {
        $firstRequest = $this->validRequest();
        $this->service->register($firstRequest);

        $secondRequest = new RegisterPatientRequest(
            fullName: 'Siti Aminah',
            dateOfBirth: new DateTimeImmutable('1990-05-15'),
            gender: 'female',
            nationalId: '3573015505900002',
            phone: '+6289999999999',
            email: null,
            street: 'Jl. Mawar No. 12',
            city: 'Malang',
            postalCode: '65141',
            emergencyContactName: null,
            emergencyContactRelation: null,
            emergencyContactPhone: null,
            consentGranted: true,
        );

        $result = $this->service->register($secondRequest);

        $this->assertTrue($result->success);
        $this->assertCount(1, $result->warnings);
        $this->assertStringContainsString('name', strtolower($result->warnings[0]));
    }

    public function testRegistrationSucceedsWithMultipleWarnings(): void
    {
        $firstRequest = $this->validRequest();
        $this->service->register($firstRequest);

        $secondRequest = new RegisterPatientRequest(
            fullName: 'Siti Aminah',
            dateOfBirth: new DateTimeImmutable('1990-05-15'),
            gender: 'female',
            nationalId: null,
            phone: '+6289999999998',
            email: null,
            street: 'Jl. Mawar No. 12',
            city: 'Malang',
            postalCode: '65141',
            emergencyContactName: null,
            emergencyContactRelation: null,
            emergencyContactPhone: null,
            consentGranted: true,
        );

        $result = $this->service->register($secondRequest);

        $this->assertTrue($result->success);
        $this->assertCount(1, $result->warnings);
        $this->assertNotNull($result->medicalRecordNumber);
    }
}
```

### In-Memory Repositories for Testing

```php
<?php

declare(strict_types=1);

namespace App\Tests\Patient\Application;

use App\Patient\Domain\PatientRepositoryInterface;
use App\Patient\Domain\Patient;
use App\Patient\Domain\Phone;

class InMemoryPatientRepository implements PatientRepositoryInterface
{
    private array $patients = [];
    private int $sequence = 0;

    public function existsByPhone(Phone $phone): bool
    {
        foreach ($this->patients as $patient) {
            if ($patient['phone'] === $phone->toString()) {
                return true;
            }
        }

        return false;
    }

    public function existsByNationalId(string $nationalId): bool
    {
        foreach ($this->patients as $patient) {
            if ($patient['national_id'] === $nationalId) {
                return true;
            }
        }

        return false;
    }

    public function existsByNameAndDob(string $fullName, \DateTimeImmutable $dateOfBirth): bool
    {
        foreach ($this->patients as $patient) {
            if (
                strtolower($patient['full_name']) === strtolower($fullName)
                && $patient['date_of_birth'] === $dateOfBirth->format('Y-m-d')
            ) {
                return true;
            }
        }

        return false;
    }

    public function getNextSequenceForDate(\DateTimeImmutable $date): int
    {
        $prefix = 'RM-' . $date->format('Ymd') . '-';
        $count = 0;

        foreach ($this->patients as $patient) {
            if (str_starts_with($patient['mrn'], $prefix)) {
                $count++;
            }
        }

        return $count + 1;
    }

    public function save(Patient $patient): void
    {
        $this->patients[] = [
            'mrn'          => $patient->medicalRecordNumber->toString(),
            'full_name'    => $patient->fullName,
            'date_of_birth' => $patient->dateOfBirth->format('Y-m-d'),
            'gender'       => $patient->gender->value,
            'national_id'  => $patient->nationalId,
            'phone'        => $patient->contactInfo->phone->toString(),
            'email'        => $patient->contactInfo->email?->toString(),
            'street'       => $patient->contactInfo->street,
            'city'         => $patient->contactInfo->city,
            'postal_code'  => $patient->contactInfo->postalCode,
        ];
    }
}

class InMemoryAuditLog implements \App\Patient\Domain\AuditLogInterface
{
    private array $logs = [];

    public function record(string $eventType, array $data): void
    {
        $this->logs[] = [
            'event_type' => $eventType,
            'data'       => $data,
            'timestamp'  => new \DateTimeImmutable(),
        ];
    }

    public function all(): \Generator
    {
        foreach ($this->logs as $log) {
            yield $log;
        }
    }
}
```

### Running the Tests

```bash
./vendor/bin/phpunit tests/Patient/Application/PatientRegistrationServiceTest.php
```

Expected output:

```
PHPUnit 11.x.x by Sebastian Bergmann and contributors.

..............                                                14 / 14 (100%)

OK (14 tests, 30 assertions)
```

The entire test suite runs in milliseconds — no database setup, no fixtures, no transaction rollbacks. Every business rule is verified through clean, readable assertions.

</section>

<section lang="id">

## Menguji Alur Pendaftaran dengan PHPUnit

Manfaat sebenarnya dari arsitektur berlapis menjadi jelas ketika Anda menulis pengujian. Setiap aturan bisnis dapat diuji secara terisolasi, tanpa koneksi database. Berikut adalah rangkaian pengujian PHPUnit lengkap menggunakan repository in-memory.

### Pengujian PHPUnit

```php
<?php

declare(strict_types=1);

namespace App\Tests\Patient\Application;

use App\Patient\Application\PatientRegistrationService;
use App\Patient\Application\RegisterPatientRequest;
use App\Patient\Application\RegistrationResult;
use App\Patient\Domain\AuditLogInterface;
use App\Patient\Domain\PatientRepositoryInterface;
use App\Patient\Domain\Patient;
use App\Patient\Domain\Phone;
use DateTimeImmutable;
use PHPUnit\Framework\TestCase;

class PatientRegistrationServiceTest extends TestCase
{
    private PatientRegistrationService $service;
    private InMemoryPatientRepository $patientRepo;
    private InMemoryAuditLog $auditLog;

    protected function setUp(): void
    {
        $this->patientRepo = new InMemoryPatientRepository();
        $this->auditLog    = new InMemoryAuditLog();
        $this->service     = new PatientRegistrationService(
            $this->patientRepo,
            $this->auditLog,
        );
    }

    private function validRequest(): RegisterPatientRequest
    {
        return new RegisterPatientRequest(
            fullName: 'Siti Aminah',
            dateOfBirth: new DateTimeImmutable('1990-05-15'),
            gender: 'female',
            nationalId: '3573015505900001',
            phone: '+6281234567890',
            email: 'siti.aminah@email.com',
            street: 'Jl. Mawar No. 12',
            city: 'Malang',
            postalCode: '65141',
            emergencyContactName: 'Budi Santoso',
            emergencyContactRelation: 'Suami',
            emergencyContactPhone: '+6281234567891',
            consentGranted: true,
        );
    }

    /* ---------- Happy Path ---------- */

    public function testSuccessfulPatientRegistration(): void
    {
        $request = $this->validRequest();
        $result  = $this->service->register($request);

        $this->assertTrue($result->success);
        $this->assertNotNull($result->medicalRecordNumber);
        $this->assertStringStartsWith('RM-', $result->medicalRecordNumber->toString());
        $this->assertEmpty($result->errors);
    }

    public function testRegistrationGeneratesCorrectMRNFormat(): void
    {
        $request = $this->validRequest();
        $result  = $this->service->register($request);

        $this->assertTrue($result->success);
        $this->assertMatchesRegularExpression(
            '/^RM-\d{8}-\d{4}$/',
            $result->medicalRecordNumber->toString(),
        );
    }

    public function testRegistrationRecordsAuditLog(): void
    {
        $request = $this->validRequest();
        $this->service->register($request);

        $logs = iterator_to_array($this->auditLog->all());
        $this->assertCount(1, $logs);
        $this->assertEquals('patient_registered', $logs[0]['event_type']);
        $this->assertArrayHasKey('medical_record_number', $logs[0]['data']);
    }

    public function testRegistrationWithoutEmailSucceeds(): void
    {
        $request = new RegisterPatientRequest(
            fullName: 'Ahmad Dhani',
            dateOfBirth: new DateTimeImmutable('1985-03-20'),
            gender: 'male',
            nationalId: null,
            phone: '+6281234567892',
            email: null,
            street: 'Jl. Melati No. 5',
            city: 'Surabaya',
            postalCode: '60111',
            emergencyContactName: null,
            emergencyContactRelation: null,
            emergencyContactPhone: null,
            consentGranted: true,
        );

        $result = $this->service->register($request);

        $this->assertTrue($result->success);
        $this->assertNotNull($result->medicalRecordNumber);
    }

    /* ---------- Kegagalan Validasi ---------- */

    public function testRegistrationFailsWhenConsentIsNotGranted(): void
    {
        $request = new RegisterPatientRequest(
            fullName: 'Siti Aminah',
            dateOfBirth: new DateTimeImmutable('1990-05-15'),
            gender: 'female',
            nationalId: null,
            phone: '+6281234567890',
            email: null,
            street: 'Jl. Mawar No. 12',
            city: 'Malang',
            postalCode: '65141',
            emergencyContactName: null,
            emergencyContactRelation: null,
            emergencyContactPhone: null,
            consentGranted: false,
        );

        $result = $this->service->register($request);

        $this->assertFalse($result->success);
        $this->assertStringContainsString('persetujuan', strtolower($result->errors[0]));
    }

    public function testRegistrationFailsWhenPhoneIsInvalid(): void
    {
        $request = new RegisterPatientRequest(
            fullName: 'Siti Aminah',
            dateOfBirth: new DateTimeImmutable('1990-05-15'),
            gender: 'female',
            nationalId: null,
            phone: '123',
            email: null,
            street: 'Jl. Mawar No. 12',
            city: 'Malang',
            postalCode: '65141',
            emergencyContactName: null,
            emergencyContactRelation: null,
            emergencyContactPhone: null,
            consentGranted: true,
        );

        $result = $this->service->register($request);

        $this->assertFalse($result->success);
        $this->assertStringContainsString('8-15', $result->errors[0]);
    }

    public function testRegistrationFailsWhenEmailIsInvalid(): void
    {
        $request = new RegisterPatientRequest(
            fullName: 'Siti Aminah',
            dateOfBirth: new DateTimeImmutable('1990-05-15'),
            gender: 'female',
            nationalId: null,
            phone: '+6281234567890',
            email: 'bukan-email',
            street: 'Jl. Mawar No. 12',
            city: 'Malang',
            postalCode: '65141',
            emergencyContactName: null,
            emergencyContactRelation: null,
            emergencyContactPhone: null,
            consentGranted: true,
        );

        $result = $this->service->register($request);

        $this->assertFalse($result->success);
        $this->assertStringContainsString('email', strtolower($result->errors[0]));
    }

    public function testRegistrationFailsWhenGenderIsInvalid(): void
    {
        $request = new RegisterPatientRequest(
            fullName: 'Siti Aminah',
            dateOfBirth: new DateTimeImmutable('1990-05-15'),
            gender: 'unknown',
            nationalId: null,
            phone: '+6281234567890',
            email: null,
            street: 'Jl. Mawar No. 12',
            city: 'Malang',
            postalCode: '65141',
            emergencyContactName: null,
            emergencyContactRelation: null,
            emergencyContactPhone: null,
            consentGranted: true,
        );

        $result = $this->service->register($request);

        $this->assertFalse($result->success);
        $this->assertStringContainsString('gender', strtolower($result->errors[0]));
    }

    public function testRegistrationFailsWhenNameIsEmpty(): void
    {
        $request = new RegisterPatientRequest(
            fullName: '',
            dateOfBirth: new DateTimeImmutable('1990-05-15'),
            gender: 'female',
            nationalId: null,
            phone: '+6281234567890',
            email: null,
            street: 'Jl. Mawar No. 12',
            city: 'Malang',
            postalCode: '65141',
            emergencyContactName: null,
            emergencyContactRelation: null,
            emergencyContactPhone: null,
            consentGranted: true,
        );

        $result = $this->service->register($request);

        $this->assertFalse($result->success);
        $this->assertStringContainsString('nama', strtolower($result->errors[0]));
    }

    public function testRegistrationFailsWhenDateOfBirthIsInFuture(): void
    {
        $request = new RegisterPatientRequest(
            fullName: 'Siti Aminah',
            dateOfBirth: new DateTimeImmutable('2099-05-15'),
            gender: 'female',
            nationalId: null,
            phone: '+6281234567890',
            email: null,
            street: 'Jl. Mawar No. 12',
            city: 'Malang',
            postalCode: '65141',
            emergencyContactName: null,
            emergencyContactRelation: null,
            emergencyContactPhone: null,
            consentGranted: true,
        );

        $result = $this->service->register($request);

        $this->assertFalse($result->success);
        $this->assertStringContainsString('depan', strtolower($result->errors[0]));
    }

    public function testRegistrationFailsWhenNIKIsInvalid(): void
    {
        $request = new RegisterPatientRequest(
            fullName: 'Siti Aminah',
            dateOfBirth: new DateTimeImmutable('1990-05-15'),
            gender: 'female',
            nationalId: '12345',
            phone: '+6281234567890',
            email: null,
            street: 'Jl. Mawar No. 12',
            city: 'Malang',
            postalCode: '65141',
            emergencyContactName: null,
            emergencyContactRelation: null,
            emergencyContactPhone: null,
            consentGranted: true,
        );

        $result = $this->service->register($request);

        $this->assertFalse($result->success);
        $this->assertStringContainsString('16', $result->errors[0]);
    }

    /* ---------- Deteksi Duplikat ---------- */

    public function testRegistrationFailsWhenDuplicatePhone(): void
    {
        $firstRequest = $this->validRequest();
        $this->service->register($firstRequest);

        $secondRequest = $this->validRequest();
        $result = $this->service->register($secondRequest);

        $this->assertFalse($result->success);
        $this->assertStringContainsString('telepon', strtolower($result->errors[0]));
    }

    public function testRegistrationFailsWhenDuplicateNIK(): void
    {
        $firstRequest = $this->validRequest();
        $this->service->register($firstRequest);

        $secondRequest = new RegisterPatientRequest(
            fullName: 'Ahmad Dhani',
            dateOfBirth: new DateTimeImmutable('1985-03-20'),
            gender: 'male',
            nationalId: '3573015505900001',
            phone: '+6289876543210',
            email: null,
            street: 'Jl. Anggrek No. 7',
            city: 'Surabaya',
            postalCode: '60111',
            emergencyContactName: null,
            emergencyContactRelation: null,
            emergencyContactPhone: null,
            consentGranted: true,
        );

        $result = $this->service->register($secondRequest);

        $this->assertFalse($result->success);
        $this->assertStringContainsString('nik', strtolower($result->errors[0]));
    }

    public function testRegistrationWarnsWhenSameNameAndDOB(): void
    {
        $firstRequest = $this->validRequest();
        $this->service->register($firstRequest);

        $secondRequest = new RegisterPatientRequest(
            fullName: 'Siti Aminah',
            dateOfBirth: new DateTimeImmutable('1990-05-15'),
            gender: 'female',
            nationalId: '3573015505900002',
            phone: '+6289999999999',
            email: null,
            street: 'Jl. Mawar No. 12',
            city: 'Malang',
            postalCode: '65141',
            emergencyContactName: null,
            emergencyContactRelation: null,
            emergencyContactPhone: null,
            consentGranted: true,
        );

        $result = $this->service->register($secondRequest);

        $this->assertTrue($result->success);
        $this->assertCount(1, $result->warnings);
        $this->assertStringContainsString('nama', strtolower($result->warnings[0]));
    }

    public function testRegistrationSucceedsWithMultipleWarnings(): void
    {
        $firstRequest = $this->validRequest();
        $this->service->register($firstRequest);

        $secondRequest = new RegisterPatientRequest(
            fullName: 'Siti Aminah',
            dateOfBirth: new DateTimeImmutable('1990-05-15'),
            gender: 'female',
            nationalId: null,
            phone: '+6289999999998',
            email: null,
            street: 'Jl. Mawar No. 12',
            city: 'Malang',
            postalCode: '65141',
            emergencyContactName: null,
            emergencyContactRelation: null,
            emergencyContactPhone: null,
            consentGranted: true,
        );

        $result = $this->service->register($secondRequest);

        $this->assertTrue($result->success);
        $this->assertCount(1, $result->warnings);
        $this->assertNotNull($result->medicalRecordNumber);
    }
}
```

### Repository In-Memory untuk Pengujian

```php
<?php

declare(strict_types=1);

namespace App\Tests\Patient\Application;

use App\Patient\Domain\PatientRepositoryInterface;
use App\Patient\Domain\Patient;
use App\Patient\Domain\Phone;

class InMemoryPatientRepository implements PatientRepositoryInterface
{
    private array $patients = [];
    private int $sequence = 0;

    public function existsByPhone(Phone $phone): bool
    {
        foreach ($this->patients as $patient) {
            if ($patient['phone'] === $phone->toString()) {
                return true;
            }
        }

        return false;
    }

    public function existsByNationalId(string $nationalId): bool
    {
        foreach ($this->patients as $patient) {
            if ($patient['national_id'] === $nationalId) {
                return true;
            }
        }

        return false;
    }

    public function existsByNameAndDob(string $fullName, \DateTimeImmutable $dateOfBirth): bool
    {
        foreach ($this->patients as $patient) {
            if (
                strtolower($patient['full_name']) === strtolower($fullName)
                && $patient['date_of_birth'] === $dateOfBirth->format('Y-m-d')
            ) {
                return true;
            }
        }

        return false;
    }

    public function getNextSequenceForDate(\DateTimeImmutable $date): int
    {
        $prefix = 'RM-' . $date->format('Ymd') . '-';
        $count = 0;

        foreach ($this->patients as $patient) {
            if (str_starts_with($patient['mrn'], $prefix)) {
                $count++;
            }
        }

        return $count + 1;
    }

    public function save(Patient $patient): void
    {
        $this->patients[] = [
            'mrn'          => $patient->medicalRecordNumber->toString(),
            'full_name'    => $patient->fullName,
            'date_of_birth' => $patient->dateOfBirth->format('Y-m-d'),
            'gender'       => $patient->gender->value,
            'national_id'  => $patient->nationalId,
            'phone'        => $patient->contactInfo->phone->toString(),
            'email'        => $patient->contactInfo->email?->toString(),
            'street'       => $patient->contactInfo->street,
            'city'         => $patient->contactInfo->city,
            'postal_code'  => $patient->contactInfo->postalCode,
        ];
    }
}

class InMemoryAuditLog implements \App\Patient\Domain\AuditLogInterface
{
    private array $logs = [];

    public function record(string $eventType, array $data): void
    {
        $this->logs[] = [
            'event_type' => $eventType,
            'data'       => $data,
            'timestamp'  => new \DateTimeImmutable(),
        ];
    }

    public function all(): \Generator
    {
        foreach ($this->logs as $log) {
            yield $log;
        }
    }
}
```

### Menjalankan Pengujian

```bash
./vendor/bin/phpunit tests/Patient/Application/PatientRegistrationServiceTest.php
```

Output yang diharapkan:

```
PHPUnit 11.x.x oleh Sebastian Bergmann dan kontributor.

..............                                                14 / 14 (100%)

OK (14 pengujian, 30 asersi)
```

Seluruh rangkaian pengujian berjalan dalam milidetik: tidak ada setup database, tidak ada fixture, tidak ada rollback transaksi. Setiap aturan bisnis diverifikasi melalui asersi yang bersih dan mudah dibaca.

</section>

---

<section lang="en">

## What You Learned

1. **Healthcare is a distinct software domain** with its own constraints — medical record integrity, duplicate prevention, consent management, regulatory compliance, and data privacy. Generic CRUD patterns are insufficient.

2. **Value objects catch errors at construction time.** `MedicalRecordNumber`, `Phone`, `Email`, and `ConsentRecord` validate themselves. Once constructed, they are guaranteed valid. No defensive checks needed downstream.

3. **Entities enforce domain invariants.** `Patient::register()` validates that the name is non-empty, the date of birth is not in the future, the NIK is 16 digits, and consent is granted — all before the object exists.

4. **Separate validation into layers.** Syntactic validation (missing fields) in the controller. Semantic validation (phone format, email format) in value objects. Domain invariant validation (consent, DOB) in entities. Contextual validation (duplicate check) in the service.

5. **Duplicate detection needs nuance.** Phone and NIK duplicates are hard errors. Name + DOB duplicates are warnings (not all same-name-same-DOB pairs are duplicates). The system should flag but let the staff decide.

6. **Consent is a first-class domain concept.** Model it as a value object with types (collection, storage, sharing), timestamps, versions, and revocation support. Consent is not a boolean flag — it has a lifecycle.

7. **Domain services work with interfaces, not databases.** `PatientRegistrationService` depends on `PatientRepositoryInterface` and `AuditLogInterface`. In tests, swap in-memory implementations. In production, swap PDO or Eloquent. The business logic never changes.

8. **Privacy is built in, not bolted on.** Never log patient identifiers. Never put them in URLs. Encrypt at rest. Audit every access. Minimise data collection to what is clinically necessary. These are not "nice to have" — they are legal obligations in Indonesia under the PDP Law and Health Law.

> "Healthcare software is not about screens and databases. It is about protecting people at their most vulnerable. Every line of code is a promise that their data will not be lost, leaked, or misused."

## Practice Exercise

Now it is your turn. Extend the patient registration system with the following features:

### Exercise 1: Consent Revocation

Add a `revokeConsent` method to the `PatientRegistrationService`. Requirements:

1. Accept a `MedicalRecordNumber` and a `DateTimeImmutable` for the revocation timestamp.
2. Retrieve the patient by MRN. If not found, return a failure result.
3. Call `consentRecord->revoke()` and create a new `ConsentRecord` with `granted: false`.
4. Save the updated patient and record an audit log event `consent_revoked`.
5. Return a `RegistrationResult`.

### Exercise 2: Patient Lookup by NIK

Add a `findByNationalId` method. Requirements:

1. Accept a 16-digit NIK string.
2. Validate the NIK format using a value object or inline check.
3. Query the repository. If found, return the patient details (MRN, name, DOB) as an array.
4. If not found, return `null`.
5. The method must not expose internal database IDs in its return value.

### Expected Behaviour

**Consent Revocation:**
```
Request:  revokeConsent('RM-20260706-0001')
Result:   success, consent revoked = true

Request:  revokeConsent('RM-20260706-0001')  // second attempt
Result:   failure, errors = ['Consent is already revoked.']
```

**Patient Lookup:**
```
Request:  findByNationalId('3573015505900001')
Result:   ['mrn' => 'RM-20260706-0001', 'name' => 'Siti Aminah', 'dob' => '1990-05-15']

Request:  findByNationalId('0000000000000000')
Result:   null
```

### Starter Code

```php
<?php

declare(strict_types=1);

namespace App\Patient\Application;

use App\Patient\Domain\MedicalRecordNumber;
use DateTimeImmutable;

class PatientRegistrationServiceExtended extends PatientRegistrationService
{
    /**
     * Revoke patient consent for data handling.
     */
    public function revokeConsent(string $mrn, ?DateTimeImmutable $revokedAt = null): RegistrationResult
    {
        $errors = [];

        try {
            $medicalRecordNumber = MedicalRecordNumber::fromString($mrn);
        } catch (\InvalidArgumentException $e) {
            return RegistrationResult::failure([$e->getMessage()]);
        }

        // TODO: Retrieve patient by MRN
        // TODO: Check if consent is already revoked
        // TODO: Revoke consent and save
        // TODO: Record audit log

        if (!empty($errors)) {
            return RegistrationResult::failure($errors);
        }

        return RegistrationResult::success($medicalRecordNumber);
    }

    /**
     * Find a patient by their national ID number (NIK).
     */
    public function findByNationalId(string $nik): ?array
    {
        // TODO: Validate NIK format
        // TODO: Query repository
        // TODO: Return patient details or null

        return null;
    }
}
```

## What to Read Next

- **[Domain-Driven Design Fundamentals with PHP](/blog/domain-driven-design-fundamentals-php)** — Apply DDD patterns like entities, value objects, aggregates, and repositories to your healthcare domain model.
- **[Microservices Architecture Fundamentals with PHP](/blog/microservices-architecture-fundamentals)** — Learn when to extract Patient, Appointment, and Billing modules into separate services.
- **[Blackbox and Whitebox Test](/blog/blackbox-and-whitebox-test)** — Master testing strategies for complex validation logic and duplicate detection rules.
- **[Test-Driven Development (TDD) with PHP](/blog/test-driven-development)** — Build your patient registration service with confidence using the Red-Green-Refactor cycle.
- **[Clean Code Principles with PHP](/blog/clean-code-principles)** — Keep your registration service readable as privacy regulations and clinical requirements evolve.
- **[Design Patterns with PHP](/blog/design-patterns-with-php)** — Apply Strategy (consent types), Observer (registration events), and Repository patterns to your healthcare system.
- **[Software Engineering for Fintech: Secure Payment Flow with PHP](/blog/software-engineering-for-fintech-payment-flow-php)** — See how similar SE principles apply to another regulated domain (fintech).
- **[SATUSEHAT Integration Guide](https://satusehat.kemkes.go.id/)** — Indonesia's national health data exchange platform. Learn FHIR and HL7 standards for healthcare interoperability.

</section>

<section lang="id">

## Apa yang Telah Dipelajari

1. **Kesehatan adalah domain perangkat lunak yang berbeda** dengan batasannya sendiri: integritas rekam medis, pencegahan duplikat, manajemen persetujuan, kepatuhan regulasi, dan privasi data. Pola CRUD generik tidak cukup.

2. **Value object menangkap kesalahan pada waktu konstruksi.** `MedicalRecordNumber`, `Phone`, `Email`, dan `ConsentRecord` memvalidasi diri sendiri. Setelah dibangun, mereka dijamin valid. Tidak perlu pemeriksaan defensif di hilir.

3. **Entity menegakkan invarian domain.** `Patient::register()` memvalidasi bahwa nama tidak kosong, tanggal lahir bukan di masa depan, NIK 16 digit, dan persetujuan diberikan, semuanya sebelum objek ada.

4. **Pisahkan validasi ke dalam lapisan.** Validasi sintaktik (field hilang) di controller. Validasi semantik (format telepon, format email) di value object. Validasi invarian domain (persetujuan, TTL) di entity. Validasi kontekstual (pemeriksaan duplikat) di service.

5. **Deteksi duplikat membutuhkan nuansa.** Duplikat telepon dan NIK adalah error keras. Duplikat Nama + TTL adalah peringatan (tidak semua pasangan nama-sama-TTL-adalah duplikat). Sistem harus menandai tetapi membiarkan staf memutuskan.

6. **Persetujuan adalah konsep domain kelas satu.** Modelkan sebagai value object dengan tipe (pengumpulan, penyimpanan, berbagi), timestamp, versi, dan dukungan pencabutan. Persetujuan bukan flag boolean, ia memiliki siklus hidup.

7. **Domain service bekerja dengan interface, bukan database.** `PatientRegistrationService` bergantung pada `PatientRepositoryInterface` dan `AuditLogInterface`. Dalam pengujian, tukar implementasi in-memory. Di produksi, tukar PDO atau Eloquent. Logika bisnis tidak pernah berubah.

8. **Privasi dibangun dari awal, bukan ditambahkan belakangan.** Jangan pernah mencatat identifier pasien. Jangan pernah menaruhnya di URL. Enkripsi saat disimpan. Audit setiap akses. Minimalisasi pengumpulan data sesuai kebutuhan klinis. Ini bukan "baik untuk dimiliki": ini adalah kewajiban hukum di Indonesia di bawah UU PDP dan UU Kesehatan.

> "Perangkat lunak kesehatan bukan tentang layar dan database. Ini tentang melindungi orang pada saat mereka paling rentan. Setiap baris kode adalah janji bahwa data mereka tidak akan hilang, bocor, atau disalahgunakan."

## Latihan Praktik

Sekarang giliran Anda. Perluas sistem pendaftaran pasien dengan fitur-fitur berikut:

### Latihan 1: Pencabutan Persetujuan

Tambahkan method `revokeConsent` ke `PatientRegistrationService`. Persyaratan:

1. Terima `MedicalRecordNumber` dan `DateTimeImmutable` untuk timestamp pencabutan.
2. Ambil pasien berdasarkan MRN. Jika tidak ditemukan, kembalikan hasil gagal.
3. Panggil `consentRecord->revoke()` dan buat `ConsentRecord` baru dengan `granted: false`.
4. Simpan pasien yang diperbarui dan catat kejadian audit log `consent_revoked`.
5. Kembalikan `RegistrationResult`.

### Latihan 2: Pencarian Pasien berdasarkan NIK

Tambahkan method `findByNationalId`. Persyaratan:

1. Terima string NIK 16 digit.
2. Validasi format NIK menggunakan value object atau pemeriksaan inline.
3. Query repository. Jika ditemukan, kembalikan detail pasien (MRN, nama, TTL) sebagai array.
4. Jika tidak ditemukan, kembalikan `null`.
5. Method tidak boleh mengekspos ID database internal dalam nilai kembaliannya.

### Perilaku yang Diharapkan

**Pencabutan Persetujuan:**
```
Permintaan:  revokeConsent('RM-20260706-0001')
Hasil:       sukses, consent revoked = true

Permintaan:  revokeConsent('RM-20260706-0001')  // percobaan kedua
Hasil:       gagal, errors = ['Persetujuan sudah dicabut.']
```

**Pencarian Pasien:**
```
Permintaan:  findByNationalId('3573015505900001')
Hasil:       ['mrn' => 'RM-20260706-0001', 'name' => 'Siti Aminah', 'dob' => '1990-05-15']

Permintaan:  findByNationalId('0000000000000000')
Hasil:       null
```

### Kode Awal

```php
<?php

declare(strict_types=1);

namespace App\Patient\Application;

use App\Patient\Domain\MedicalRecordNumber;
use DateTimeImmutable;

class PatientRegistrationServiceExtended extends PatientRegistrationService
{
    /**
     * Cabut persetujuan pasien untuk penanganan data.
     */
    public function revokeConsent(string $mrn, ?DateTimeImmutable $revokedAt = null): RegistrationResult
    {
        $errors = [];

        try {
            $medicalRecordNumber = MedicalRecordNumber::fromString($mrn);
        } catch (\InvalidArgumentException $e) {
            return RegistrationResult::failure([$e->getMessage()]);
        }

        // TODO: Ambil pasien berdasarkan MRN
        // TODO: Periksa apakah persetujuan sudah dicabut
        // TODO: Cabut persetujuan dan simpan
        // TODO: Catat audit log

        if (!empty($errors)) {
            return RegistrationResult::failure($errors);
        }

        return RegistrationResult::success($medicalRecordNumber);
    }

    /**
     * Cari pasien berdasarkan nomor NIK.
     */
    public function findByNationalId(string $nik): ?array
    {
        // TODO: Validasi format NIK
        // TODO: Query repository
        // TODO: Kembalikan detail pasien atau null

        return null;
    }
}
```

## Bacaan Selanjutnya

- **[Dasar-Dasar Domain-Driven Design dengan PHP](/blog/domain-driven-design-fundamentals-php)**: Terapkan pola DDD seperti entity, value object, aggregate, dan repository ke model domain kesehatan Anda.
- **[Dasar-Dasar Arsitektur Microservices dengan PHP](/blog/microservices-architecture-fundamentals)**: Pelajari kapan harus mengekstrak modul Patient, Appointment, dan Billing menjadi layanan terpisah.
- **[Blackbox dan Whitebox Test](/blog/blackbox-and-whitebox-test)**: Kuasai strategi pengujian untuk logika validasi kompleks dan aturan deteksi duplikat.
- **[Test-Driven Development (TDD) dengan PHP](/blog/test-driven-development)**: Bangun layanan pendaftaran pasien Anda dengan percaya diri menggunakan siklus Red-Green-Refactor.
- **[Prinsip Clean Code dengan PHP](/blog/clean-code-principles)**: Jaga layanan pendaftaran Anda tetap terbaca seiring berkembangnya regulasi privasi dan persyaratan klinis.
- **[Design Patterns dengan PHP](/blog/design-patterns-with-php)**: Terapkan pola Strategy (tipe persetujuan), Observer (kejadian pendaftaran), dan Repository ke sistem kesehatan Anda.
- **[Rekayasa Perangkat Lunak untuk Fintech: Alur Pembayaran Aman dengan PHP](/blog/software-engineering-for-fintech-payment-flow-php)**: Lihat bagaimana prinsip SE yang sama diterapkan ke domain teregulasi lainnya (fintech).
- **[Panduan Integrasi SATUSEHAT](https://satusehat.kemkes.go.id/)**: Platform pertukaran data kesehatan nasional Indonesia. Pelajari standar FHIR dan HL7 untuk interoperabilitas kesehatan.

</section>
