---
title: "Software Engineering for Industrial Automation: IoT Dashboard with PHP"
titleId: "Rekayasa Perangkat Lunak untuk Otomasi Industri: Dasbor IoT dengan PHP"
date: 2026-07-08
updated: 2026-07-08
category: tutorial
author: SE Lab
lang: en
featured: false
stream: domain-specific-se-applications
tags:
  - Industrial Automation
  - PHP
  - IoT
  - MQTT
  - InfluxDB
tagsId:
  - Otomasi Industri
  - PHP
  - IoT
  - MQTT
  - InfluxDB
excerpt: "Learn how software engineering principles apply to industrial IoT systems. This tutorial walks through building a sensor-data dashboard in PHP with MQTT ingestion, InfluxDB time-series storage, threshold-based alerts, and a RESTful dashboard API."
excerptId: "Pelajari bagaimana prinsip-prinsip rekayasa perangkat lunak diterapkan pada sistem IoT industri. Tutorial ini membahas pembangunan dasbor data sensor dalam PHP dengan ingesti MQTT, penyimpanan time-series InfluxDB, peringatan berbasis ambang, dan API dasbor RESTful."
---

<section lang="en">

## Why Industrial Automation Needs Software Engineers

**Industrial automation is not just PLC programming and SCADA screens.** Behind every factory floor sensor, vibration monitor, and temperature probe sits a data pipeline that must be reliable, queryable, and secure. Software engineers build that pipeline.

Consider the difference between a generic web dashboard and an industrial IoT monitoring system:

| Aspect | Generic Web Dashboard | Industrial IoT Dashboard |
|---|---|---|
| **Data volume** | Hundreds of rows per day | Thousands of readings per minute from dozens of sensors |
| **Storage model** | Relational (OLTP) — rows with foreign keys | Time-series (TSDB) — timestamp-indexed measurements |
| **Data integrity** | Transactions, rollbacks | At-least-once delivery, duplicate tolerance, gap detection |
| **Latency tolerance** | Seconds to minutes | Sub-second for safety-critical alerts |
| **Ingestion** | HTTP POST from a web form | MQTT publish from constrained edge devices |
| **Retention** | Indefinite (users expect history) | Downsampled rollups: raw for 7 days, 1-min aggregates for 90 days, hourly for 1 year |
| **Alerting** | Optional email notifications | Threshold-based alerts with escalation policies — missed alerts can mean equipment damage or injury |
| **Connectivity** | Assumes stable broadband | Edge devices may be on 2G, LoRaWAN, or intermittent Wi-Fi — graceful degradation is mandatory |

These constraints mean that **generic web development patterns fail under industrial workloads.** You cannot `SELECT * FROM sensor_readings` when the table has 500 million rows. You cannot poll for alerts every 60 seconds when a motor over-temperature event needs sub-second reaction. And you cannot store sensor data in MySQL and expect reasonable query performance past the first few million rows.

</section>

<section lang="id">

## Mengapa Otomasi Industri Membutuhkan Insinyur Perangkat Lunak

**Otomasi industri bukan hanya pemrograman PLC dan layar SCADA.** Di balik setiap sensor lantai pabrik, monitor getaran, dan probe suhu terdapat pipeline data yang harus andal, dapat di-query, dan aman. Insinyur perangkat lunak membangun pipeline itu.

Pertimbangkan perbedaan antara dasbor web generik dan sistem pemantauan IoT industri:

| Aspek | Dasbor Web Generik | Dasbor IoT Industri |
|---|---|---|
| **Volume data** | Ratusan baris per hari | Ribuan pembacaan per menit dari puluhan sensor |
| **Model penyimpanan** | Relasional (OLTP) — baris dengan foreign key | Time-series (TSDB) — pengukuran terindeks timestamp |
| **Integritas data** | Transaksi, rollback | Pengiriman at-least-once, toleransi duplikat, deteksi celah |
| **Toleransi latensi** | Detik hingga menit | Sub-detik untuk peringatan keselamatan kritis |
| **Ingesti** | HTTP POST dari form web | MQTT publish dari perangkat edge terbatas |
| **Retensi** | Tanpa batas (pengguna mengharapkan riwayat) | Agregasi downsampled: mentah 7 hari, agregat 1-menit 90 hari, per jam 1 tahun |
| **Peringatan** | Notifikasi email opsional | Peringatan berbasis ambang dengan kebijakan eskalasi — peringatan terlewat dapat berarti kerusakan peralatan atau cedera |
| **Konektivitas** | Mengasumsikan broadband stabil | Perangkat edge mungkin di 2G, LoRaWAN, atau Wi-Fi intermiten — degradasi anggun adalah wajib |

Batasan ini berarti bahwa **pola pengembangan web generik gagal di bawah beban kerja industri.** Anda tidak dapat `SELECT * FROM sensor_readings` ketika tabel memiliki 500 juta baris. Anda tidak dapat polling peringatan setiap 60 detik ketika kejadian suhu berlebih motor membutuhkan reaksi sub-detik. Dan Anda tidak dapat menyimpan data sensor di MySQL dan mengharapkan performa query yang wajar setelah beberapa juta baris pertama.

</section>

---

<section lang="en">

## System Architecture

A production-grade industrial IoT monitoring system follows a layered architecture. Each layer has a specific responsibility and failure mode.

<figure class="my-10 text-center" role="figure">

```mermaid
graph TB
    subgraph SL["SENSOR LAYER"]
        S1["Temp Sensor"] ~~~ S2["Vibration Sensor"] ~~~ S3["Pressure Sensor"] ~~~ S4["Flow Meter"]
    end
    SL --> EG["EDGE GATEWAY<br/>(Modbus/OPC-UA → MQTT bridge)"]
    EG --> MB["MQTT BROKER<br/>(Mosquitto / EMQX)"]
    MB --> PI["PHP INGESTION<br/>(MQTT subscriber + validation)"]
    PI --> TS["TIME-SERIES DB<br/>(InfluxDB / TimescaleDB)"]
    TS --> DA["Dashboard API (REST)"]
    TS --> AE["Alert Engine (Threshold/SSE)"]
    DA ~~~ PL["PRESENTATION & ACTION LAYER"]
```

<figcaption class="mt-3 text-sm text-neutral-500">
  <span lang="en">Figure: Industrial IoT monitoring system architecture — from sensor to dashboard.</span>
  <span lang="id">Gambar: Arsitektur sistem pemantauan IoT industri — dari sensor ke dasbor.</span>
</figcaption>
</figure>

### Data Flow (Write Path)

```
Sensor → Modbus/OPC-UA → Edge Gateway → MQTT Publish
                                            │
                  ┌─────────────────────────┘
                  ▼
         MQTT Broker (topic: factory/line1/temperature)
                  │
                  ▼
         PHP Subscriber (validate → transform → enrich)
                  │
                  ▼
         InfluxDB Write (measurement: sensor_readings, tags: {sensor_id, unit}, fields: {value})
```

### Data Flow (Read Path)

```
Dashboard Client → GET /api/dashboard/sensors/{sensor_id}/readings?range=1h
                                  │
                                  ▼
                       DashboardService (query builder)
                                  │
                                  ▼
                       InfluxDB Flux Query (aggregate, filter, downsample)
                                  │
                                  ▼
                       JSON Response → Chart (Chart.js / ECharts)
```

Every arrow in these diagrams represents an integration point that can fail. The PHP ingestion service must handle broker disconnects, malformed payloads, and InfluxDB write timeouts without losing data or crashing.

</section>

<section lang="id">

## Arsitektur Sistem

Sistem pemantauan IoT industri tingkat produksi mengikuti arsitektur berlapis. Setiap lapisan memiliki tanggung jawab dan mode kegagalan spesifik.

<figure class="my-10 text-center" role="figure">

```mermaid
graph TB
    subgraph SL["LAPISAN SENSOR"]
        S1["Sensor Suhu"] ~~~ S2["Sensor Getaran"] ~~~ S3["Sensor Tekanan"] ~~~ S4["Pengukur Aliran"]
    end
    SL --> EG["GATEWAY EDGE<br/>(Jembatan Modbus/OPC-UA → MQTT)"]
    EG --> MB["BROKER MQTT<br/>(Mosquitto / EMQX)"]
    MB --> PI["INGESTI PHP<br/>(Subscriber MQTT + validasi)"]
    PI --> TS["DATABASE TIME-SERIES<br/>(InfluxDB / TimescaleDB)"]
    TS --> DA["API Dasbor (REST)"]
    TS --> AE["Mesin Peringatan (Ambang/SSE)"]
    DA ~~~ PL["LAPISAN PRESENTASI & TINDAKAN"]
```

<figcaption class="mt-3 text-sm text-neutral-500">
  <span lang="en">Figure: Industrial IoT monitoring system architecture — from sensor to dashboard.</span>
  <span lang="id">Gambar: Arsitektur sistem pemantauan IoT industri — dari sensor ke dasbor.</span>
</figcaption>
</figure>

### Alur Data (Jalur Tulis)

```
Sensor → Modbus/OPC-UA → Gateway Edge → Publikasi MQTT
                                            │
                  ┌─────────────────────────┘
                  ▼
         Broker MQTT (topik: pabrik/line1/suhu)
                  │
                  ▼
         Subscriber PHP (validasi → transformasi → perkaya)
                  │
                  ▼
         InfluxDB Write (measurement: sensor_readings, tags: {sensor_id, unit}, fields: {value})
```

### Alur Data (Jalur Baca)

```
Klien Dasbor → GET /api/dashboard/sensors/{sensor_id}/readings?range=1j
                                  │
                                  ▼
                       DashboardService (pembangun query)
                                  │
                                  ▼
                       InfluxDB Flux Query (agregasi, filter, downsample)
                                  │
                                  ▼
                       Respons JSON → Grafik (Chart.js / ECharts)
```

Setiap panah dalam diagram ini mewakili titik integrasi yang dapat gagal. Layanan ingesti PHP harus menangani pemutusan broker, payload yang salah format, dan timeout penulisan InfluxDB tanpa kehilangan data atau crash.

</section>

---

<section lang="en">

## Setting Up the Stack

Before writing code, you need a running MQTT broker and InfluxDB instance. This tutorial assumes Docker for reproducibility.

### 1. Start Mosquitto MQTT Broker

```bash
docker run -d --name mosquitto \
  -p 1883:1883 \
  -p 9001:9001 \
  eclipse-mosquitto:2
```

### 2. Start InfluxDB v2

```bash
docker run -d --name influxdb \
  -p 8086:8086 \
  -e DOCKER_INFLUXDB_INIT_MODE=setup \
  -e DOCKER_INFLUXDB_INIT_USERNAME=admin \
  -e DOCKER_INFLUXDB_INIT_PASSWORD=admin1234 \
  -e DOCKER_INFLUXDB_INIT_ORG=se-polinema \
  -e DOCKER_INFLUXDB_INIT_BUCKET=sensor_data \
  -e DOCKER_INFLUXDB_INIT_ADMIN_TOKEN=my-super-secret-token \
  influxdb:2
```

### 3. Install PHP Dependencies

```bash
composer require php-mqtt/client guzzlehttp/guzzle
```

- `php-mqtt/client` — MQTT subscriber for ingesting sensor data
- `guzzlehttp/guzzle` — HTTP client for InfluxDB REST API

### 4. Create InfluxDB Bucket via API

```bash
curl -X POST "http://localhost:8086/api/v2/buckets" \
  -H "Authorization: Token my-super-secret-token" \
  -H "Content-Type: application/json" \
  -d '{"orgID": "<your-org-id>", "name": "sensor_data", "retentionRules": [{"type": "expire", "everySeconds": 7776000}]}'
```

This creates a bucket with a 90-day retention policy — raw sensor data older than 90 days is automatically dropped. Downsampled aggregates should live in a separate bucket with longer retention.

</section>

<section lang="id">

## Menyiapkan Stack

Sebelum menulis kode, Anda memerlukan broker MQTT dan instance InfluxDB yang berjalan. Tutorial ini mengasumsikan Docker untuk reprodusibilitas.

### 1. Jalankan Broker MQTT Mosquitto

```bash
docker run -d --name mosquitto \
  -p 1883:1883 \
  -p 9001:9001 \
  eclipse-mosquitto:2
```

### 2. Jalankan InfluxDB v2

```bash
docker run -d --name influxdb \
  -p 8086:8086 \
  -e DOCKER_INFLUXDB_INIT_MODE=setup \
  -e DOCKER_INFLUXDB_INIT_USERNAME=admin \
  -e DOCKER_INFLUXDB_INIT_PASSWORD=admin1234 \
  -e DOCKER_INFLUXDB_INIT_ORG=se-polinema \
  -e DOCKER_INFLUXDB_INIT_BUCKET=sensor_data \
  -e DOCKER_INFLUXDB_INIT_ADMIN_TOKEN=my-super-secret-token \
  influxdb:2
```

### 3. Instal Dependensi PHP

```bash
composer require php-mqtt/client guzzlehttp/guzzle
```

- `php-mqtt/client` — Subscriber MQTT untuk ingesti data sensor
- `guzzlehttp/guzzle` — Klien HTTP untuk REST API InfluxDB

### 4. Buat Bucket InfluxDB via API

```bash
curl -X POST "http://localhost:8086/api/v2/buckets" \
  -H "Authorization: Token my-super-secret-token" \
  -H "Content-Type: application/json" \
  -d '{"orgID": "<id-org-anda>", "name": "sensor_data", "retentionRules": [{"type": "expire", "everySeconds": 7776000}]}'
```

Ini membuat bucket dengan kebijakan retensi 90 hari — data sensor mentah yang lebih tua dari 90 hari secara otomatis dihapus. Agregat yang di-downsample harus tinggal di bucket terpisah dengan retensi lebih panjang.

</section>

---

<section lang="en">

## Project Structure

A modular monolith keeps bounded contexts separate — MQTT ingestion, time-series storage, and the dashboard API are three distinct modules that share nothing except the InfluxDB connection configuration.

```
src/
├── IoT/
│   ├── Domain/
│   │   ├── SensorReading.php        # Value object: sensor_id, metric, value, unit, timestamp
│   │   ├── AlertRule.php            # Value object: metric, operator, threshold, severity
│   │   ├── AlertEvent.php           # DTO: triggered alert with context
│   │   └── DashboardQuery.php       # DTO: aggregated query parameters
│   ├── Application/
│   │   ├── MQTTIngestionService.php       # Subscribes to MQTT, validates, writes to InfluxDB
│   │   ├── InfluxDBRepository.php         # Reads/writes to InfluxDB via HTTP API
│   │   ├── DashboardService.php           # Query builder for dashboard API
│   │   └── AlertService.php               # Threshold evaluation and alert triggering
│   └── Infrastructure/
│       ├── InfluxDBClient.php             # Guzzle wrapper for InfluxDB HTTP API
│       └── MQTTSubscriber.php             # php-mqtt/client wrapper with reconnect logic
└── config/
    └── influxdb.php                 # InfluxDB connection config (org, bucket, token, url)
```

This structure follows the **ports and adapters** pattern. The domain layer knows nothing about MQTT or HTTP — it only expresses industrial IoT concepts. The infrastructure layer handles the gritty details of network I/O.

</section>

<section lang="id">

## Struktur Proyek

Monolit modular menjaga bounded context tetap terpisah — ingesti MQTT, penyimpanan time-series, dan API dasbor adalah tiga modul berbeda yang tidak berbagi apa pun kecuali konfigurasi koneksi InfluxDB.

```
src/
├── IoT/
│   ├── Domain/
│   │   ├── SensorReading.php        # Value object: sensor_id, metric, value, unit, timestamp
│   │   ├── AlertRule.php            # Value object: metric, operator, threshold, severity
│   │   ├── AlertEvent.php           # DTO: peringatan terpicu dengan konteks
│   │   └── DashboardQuery.php       # DTO: parameter query teragregasi
│   ├── Application/
│   │   ├── MQTTIngestionService.php       # Subscribe ke MQTT, validasi, tulis ke InfluxDB
│   │   ├── InfluxDBRepository.php         # Baca/tulis ke InfluxDB via HTTP API
│   │   ├── DashboardService.php           # Pembangun query untuk API dasbor
│   │   └── AlertService.php               # Evaluasi ambang dan pemicuan peringatan
│   └── Infrastructure/
│       ├── InfluxDBClient.php             # Wrapper Guzzle untuk HTTP API InfluxDB
│       └── MQTTSubscriber.php             # Wrapper php-mqtt/client dengan logika reconnect
└── config/
    └── influxdb.php                 # Konfigurasi koneksi InfluxDB (org, bucket, token, url)
```

Struktur ini mengikuti pola **ports and adapters**. Lapisan domain tidak tahu apa pun tentang MQTT atau HTTP — ia hanya mengekspresikan konsep IoT industri. Lapisan infrastruktur menangani detail rumit dari I/O jaringan.

</section>

---

<section lang="en">

## Domain Layer: Value Objects and DTOs

### SensorReading — The Core Domain Object

A sensor reading is an immutable measurement captured at a point in time. It is the atomic unit of industrial data.

```php
<?php

declare(strict_types=1);

namespace App\IoT\Domain;

use DateTimeImmutable;

final readonly class SensorReading
{
    public function __construct(
        public string $sensorId,
        public string $metric,
        public float $value,
        public string $unit,
        public DateTimeImmutable $timestamp,
    ) {}

    public static function fromMQTTPayload(array $payload): self
    {
        return new self(
            sensorId: (string) $payload['sensor_id'],
            metric: (string) $payload['metric'],
            value: (float) $payload['value'],
            unit: (string) $payload['unit'],
            timestamp: isset($payload['timestamp'])
                ? new DateTimeImmutable($payload['timestamp'])
                : new DateTimeImmutable(),
        );
    }

    public function toInfluxDBLineProtocol(): string
    {
        $ts = $this->timestamp->getTimestamp() * 1_000_000_000;

        return sprintf(
            'sensor_readings,sensor_id=%s,metric=%s,unit=%s value=%.4f %d',
            $this->escapeTag($this->sensorId),
            $this->escapeTag($this->metric),
            $this->escapeTag($this->unit),
            $this->value,
            $ts,
        );
    }

    private function escapeTag(string $value): string
    {
        return str_replace([' ', ',', '='], ['\\ ', '\\,', '\\='], $value);
    }
}
```

**Design decisions:**
- `fromMQTTPayload` is the single factory method — all validation happens here, not in the constructor.
- `toInfluxDBLineProtocol` produces InfluxDB line protocol format directly. This avoids intermediate serialization and lets the infrastructure layer batch-write efficiently.
- `escapeTag` prevents injection in InfluxDB tag values — spaces, commas, and equals signs must be escaped per the line protocol spec.

### AlertRule — Defining Monitoring Thresholds

```php
<?php

declare(strict_types=1);

namespace App\IoT\Domain;

enum AlertOperator: string
{
    case GREATER_THAN = '>';
    case LESS_THAN = '<';
    case GREATER_THAN_OR_EQUAL = '>=';
    case LESS_THAN_OR_EQUAL = '<=';
    case EQUALS = '=';
}

enum AlertSeverity: string
{
    case INFO = 'info';
    case WARNING = 'warning';
    case CRITICAL = 'critical';
}

final readonly class AlertRule
{
    public function __construct(
        public string $id,
        public string $sensorId,
        public string $metric,
        public AlertOperator $operator,
        public float $threshold,
        public AlertSeverity $severity,
        public string $message,
    ) {}

    public function evaluate(SensorReading $reading): ?AlertEvent
    {
        if ($reading->sensorId !== $this->sensorId || $reading->metric !== $this->metric) {
            return null;
        }

        $triggered = match ($this->operator) {
            AlertOperator::GREATER_THAN => $reading->value > $this->threshold,
            AlertOperator::LESS_THAN => $reading->value < $this->threshold,
            AlertOperator::GREATER_THAN_OR_EQUAL => $reading->value >= $this->threshold,
            AlertOperator::LESS_THAN_OR_EQUAL => $reading->value <= $this->threshold,
            AlertOperator::EQUALS => abs($reading->value - $this->threshold) < PHP_FLOAT_EPSILON,
        };

        if (!$triggered) {
            return null;
        }

        return new AlertEvent(
            ruleId: $this->id,
            sensorId: $reading->sensorId,
            metric: $reading->metric,
            value: $reading->value,
            threshold: $this->threshold,
            severity: $this->severity,
            message: $this->message,
            timestamp: new \DateTimeImmutable(),
        );
    }
}
```

### AlertEvent — The Result of a Triggered Rule

```php
<?php

declare(strict_types=1);

namespace App\IoT\Domain;

use DateTimeImmutable;

final readonly class AlertEvent
{
    public function __construct(
        public string $ruleId,
        public string $sensorId,
        public string $metric,
        public float $value,
        public float $threshold,
        public AlertSeverity $severity,
        public string $message,
        public DateTimeImmutable $timestamp,
    ) {}
}
```

### DashboardQuery — Parameter Object for API Queries

```php
<?php

declare(strict_types=1);

namespace App\IoT\Domain;

final readonly class DashboardQuery
{
    public function __construct(
        public string $sensorId,
        public ?string $metric = null,
        public string $range = '1h',
        public string $aggregation = 'mean',
        public string $window = '1m',
        public int $limit = 100,
    ) {}

    public static function fromArray(array $params): self
    {
        return new self(
            sensorId: (string) $params['sensor_id'],
            metric: $params['metric'] ?? null,
            range: (string) ($params['range'] ?? '1h'),
            aggregation: (string) ($params['aggregation'] ?? 'mean'),
            window: (string) ($params['window'] ?? '1m'),
            limit: (int) ($params['limit'] ?? 100),
        );
    }
}
```

</section>

<section lang="id">

## Lapisan Domain: Value Object dan DTO

### SensorReading — Objek Domain Inti

Pembacaan sensor adalah pengukuran immutable yang ditangkap pada suatu titik waktu. Ini adalah unit atomik dari data industri.

```php
<?php

declare(strict_types=1);

namespace App\IoT\Domain;

use DateTimeImmutable;

final readonly class SensorReading
{
    public function __construct(
        public string $sensorId,
        public string $metric,
        public float $value,
        public string $unit,
        public DateTimeImmutable $timestamp,
    ) {}

    public static function fromMQTTPayload(array $payload): self
    {
        return new self(
            sensorId: (string) $payload['sensor_id'],
            metric: (string) $payload['metric'],
            value: (float) $payload['value'],
            unit: (string) $payload['unit'],
            timestamp: isset($payload['timestamp'])
                ? new DateTimeImmutable($payload['timestamp'])
                : new DateTimeImmutable(),
        );
    }

    public function toInfluxDBLineProtocol(): string
    {
        $ts = $this->timestamp->getTimestamp() * 1_000_000_000;

        return sprintf(
            'sensor_readings,sensor_id=%s,metric=%s,unit=%s value=%.4f %d',
            $this->escapeTag($this->sensorId),
            $this->escapeTag($this->metric),
            $this->escapeTag($this->unit),
            $this->value,
            $ts,
        );
    }

    private function escapeTag(string $value): string
    {
        return str_replace([' ', ',', '='], ['\\ ', '\\,', '\\='], $value);
    }
}
```

**Keputusan desain:**
- `fromMQTTPayload` adalah satu-satunya factory method — semua validasi terjadi di sini, bukan di constructor.
- `toInfluxDBLineProtocol` menghasilkan format line protocol InfluxDB secara langsung. Ini menghindari serialisasi perantara dan memungkinkan lapisan infrastruktur menulis batch secara efisien.
- `escapeTag` mencegah injeksi pada nilai tag InfluxDB — spasi, koma, dan tanda sama dengan harus di-escape sesuai spesifikasi line protocol.

### AlertRule — Mendefinisikan Ambang Pemantauan

```php
<?php

declare(strict_types=1);

namespace App\IoT\Domain;

enum AlertOperator: string
{
    case GREATER_THAN = '>';
    case LESS_THAN = '<';
    case GREATER_THAN_OR_EQUAL = '>=';
    case LESS_THAN_OR_EQUAL = '<=';
    case EQUALS = '=';
}

enum AlertSeverity: string
{
    case INFO = 'info';
    case WARNING = 'warning';
    case CRITICAL = 'critical';
}

final readonly class AlertRule
{
    public function __construct(
        public string $id,
        public string $sensorId,
        public string $metric,
        public AlertOperator $operator,
        public float $threshold,
        public AlertSeverity $severity,
        public string $message,
    ) {}

    public function evaluate(SensorReading $reading): ?AlertEvent
    {
        if ($reading->sensorId !== $this->sensorId || $reading->metric !== $this->metric) {
            return null;
        }

        $triggered = match ($this->operator) {
            AlertOperator::GREATER_THAN => $reading->value > $this->threshold,
            AlertOperator::LESS_THAN => $reading->value < $this->threshold,
            AlertOperator::GREATER_THAN_OR_EQUAL => $reading->value >= $this->threshold,
            AlertOperator::LESS_THAN_OR_EQUAL => $reading->value <= $this->threshold,
            AlertOperator::EQUALS => abs($reading->value - $this->threshold) < PHP_FLOAT_EPSILON,
        };

        if (!$triggered) {
            return null;
        }

        return new AlertEvent(
            ruleId: $this->id,
            sensorId: $reading->sensorId,
            metric: $reading->metric,
            value: $reading->value,
            threshold: $this->threshold,
            severity: $this->severity,
            message: $this->message,
            timestamp: new \DateTimeImmutable(),
        );
    }
}
```

### AlertEvent — Hasil dari Aturan yang Terpicu

```php
<?php

declare(strict_types=1);

namespace App\IoT\Domain;

use DateTimeImmutable;

final readonly class AlertEvent
{
    public function __construct(
        public string $ruleId,
        public string $sensorId,
        public string $metric,
        public float $value,
        public float $threshold,
        public AlertSeverity $severity,
        public string $message,
        public DateTimeImmutable $timestamp,
    ) {}
}
```

### DashboardQuery — Parameter Object untuk Query API

```php
<?php

declare(strict_types=1);

namespace App\IoT\Domain;

final readonly class DashboardQuery
{
    public function __construct(
        public string $sensorId,
        public ?string $metric = null,
        public string $range = '1h',
        public string $aggregation = 'mean',
        public string $window = '1m',
        public int $limit = 100,
    ) {}

    public static function fromArray(array $params): self
    {
        return new self(
            sensorId: (string) $params['sensor_id'],
            metric: $params['metric'] ?? null,
            range: (string) ($params['range'] ?? '1h'),
            aggregation: (string) ($params['aggregation'] ?? 'mean'),
            window: (string) ($params['window'] ?? '1m'),
            limit: (int) ($params['limit'] ?? 100),
        );
    }
}
```

</section>

---

<section lang="en">

## Infrastructure Layer: Talking to InfluxDB and MQTT

### InfluxDB HTTP Client

InfluxDB v2 exposes a REST API for both reads (Flux queries) and writes (line protocol). This client wraps Guzzle with sensible defaults for time-series workloads.

```php
<?php

declare(strict_types=1);

namespace App\IoT\Infrastructure;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use RuntimeException;

final class InfluxDBClient
{
    private Client $http;
    private string $org;

    public function __construct(
        private string $url,
        private string $token,
        string $org,
        private string $bucket,
    ) {
        $this->http = new Client([
            'base_uri' => $this->url,
            'timeout' => 10,
            'connect_timeout' => 3,
            'headers' => [
                'Authorization' => "Token {$this->token}",
                'Content-Type' => 'text/plain; charset=utf-8',
            ],
        ]);
        $this->org = $org;
    }

    /**
     * Write line protocol data to InfluxDB.
     * Accepts a newline-separated string of line protocol records.
     */
    public function write(string $lineProtocol): void
    {
        try {
            $this->http->post('/api/v2/write', [
                'query' => [
                    'org' => $this->org,
                    'bucket' => $this->bucket,
                    'precision' => 'ns',
                ],
                'body' => $lineProtocol,
            ]);
        } catch (GuzzleException $e) {
            throw new RuntimeException(
                'InfluxDB write failed: ' . $e->getMessage(),
                previous: $e,
            );
        }
    }

    /**
     * Execute a Flux query and return parsed results.
     */
    public function query(string $fluxQuery): array
    {
        try {
            $response = $this->http->post('/api/v2/query', [
                'headers' => [
                    'Content-Type' => 'application/vnd.flux',
                    'Accept' => 'application/csv',
                ],
                'query' => ['org' => $this->org],
                'body' => $fluxQuery,
            ]);

            return $this->parseCSVResponse((string) $response->getBody());
        } catch (GuzzleException $e) {
            throw new RuntimeException(
                'InfluxDB query failed: ' . $e->getMessage(),
                previous: $e,
            );
        }
    }

    /**
     * Check connectivity and bucket existence.
     */
    public function healthCheck(): bool
    {
        try {
            $response = $this->http->get('/health');
            $body = json_decode((string) $response->getBody(), true);

            return ($body['status'] ?? '') === 'pass';
        } catch (GuzzleException) {
            return false;
        }
    }

    /**
     * Parse InfluxDB CSV-annotated response into associative array.
     */
    private function parseCSVResponse(string $csv): array
    {
        $lines = explode("\n", trim($csv));
        $results = [];

        if (count($lines) < 2) {
            return $results;
        }

        // First line: annotation headers (#group, #datatype, #default)
        // Skip annotation lines that start with #
        $dataLines = array_filter($lines, fn(string $line): bool => !str_starts_with($line, '#'));
        $dataLines = array_values($dataLines);

        if (empty($dataLines)) {
            return $results;
        }

        $headers = str_getcsv(array_shift($dataLines));

        foreach ($dataLines as $line) {
            $row = str_getcsv($line);
            if (count($row) < count($headers)) {
                continue;
            }
            $results[] = array_combine($headers, $row);
        }

        return $results;
    }
}
```

### MQTT Subscriber with Reconnect Logic

```php
<?php

declare(strict_types=1);

namespace App\IoT\Infrastructure;

use PhpMqtt\Client\MqttClient;
use PhpMqtt\Client\ConnectionSettings;
use Psr\Log\LoggerInterface;
use Psr\Log\NullLogger;

final class MQTTSubscriber
{
    private MqttClient $client;
    private int $reconnectDelay = 5;

    public function __construct(
        private string $brokerHost,
        private int $brokerPort,
        private string $clientId,
        private ?LoggerInterface $logger = null,
    ) {
        $this->logger = $logger ?? new NullLogger();
    }

    /**
     * Subscribe to a topic and process incoming messages.
     * Automatically reconnects on connection loss.
     *
     * @param callable(SensorReading): void $onMessage
     */
    public function subscribe(string $topic, callable $onMessage): void
    {
        $settings = (new ConnectionSettings())
            ->setKeepAliveInterval(60)
            ->setConnectTimeout(10)
            ->setReconnectAutomatically(true)
            ->setMaxReconnectAttempts(10)
            ->setDelayBetweenReconnectAttempts($this->reconnectDelay * 1000);

        $this->client = new MqttClient(
            $this->brokerHost,
            $this->brokerPort,
            $this->clientId,
        );

        $this->client->registerLoopEventHandler(function () {
            $this->logger?->info('MQTT subscriber loop running', [
                'client_id' => $this->clientId,
            ]);
        });

        $this->logger?->info('Connecting to MQTT broker', [
            'host' => $this->brokerHost,
            'port' => $this->brokerPort,
        ]);

        $this->client->connect($settings, true);

        $this->logger?->info('Subscribing to topic', ['topic' => $topic]);
        $this->client->subscribe($topic, function (string $topic, string $message) use ($onMessage): void {
            $payload = json_decode($message, true);

            if (!is_array($payload)) {
                $this->logger?->warning('Received invalid JSON payload', [
                    'topic' => $topic,
                    'message' => $message,
                ]);
                return;
            }

            try {
                $reading = \App\IoT\Domain\SensorReading::fromMQTTPayload($payload);
                $onMessage($reading);
            } catch (\Throwable $e) {
                $this->logger?->error('Failed to process sensor reading', [
                    'topic' => $topic,
                    'error' => $e->getMessage(),
                ]);
            }
        }, 0);

        $this->client->loop(true);
    }

    public function disconnect(): void
    {
        if (isset($this->client)) {
            $this->client->disconnect();
        }
    }
}
```

> **Note:** The `php-mqtt/client` package provides a clean abstraction over the MQTT protocol. In production, you may want to run the subscriber as a long-lived PHP process using Swoole, RoadRunner, or a systemd service with supervisor for automatic restarts.

</section>

<section lang="id">

## Lapisan Infrastruktur: Berbicara dengan InfluxDB dan MQTT

### Klien HTTP InfluxDB

InfluxDB v2 mengekspos REST API untuk pembacaan (query Flux) dan penulisan (line protocol). Klien ini membungkus Guzzle dengan default yang masuk akal untuk beban kerja time-series.

```php
<?php

declare(strict_types=1);

namespace App\IoT\Infrastructure;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use RuntimeException;

final class InfluxDBClient
{
    private Client $http;
    private string $org;

    public function __construct(
        private string $url,
        private string $token,
        string $org,
        private string $bucket,
    ) {
        $this->http = new Client([
            'base_uri' => $this->url,
            'timeout' => 10,
            'connect_timeout' => 3,
            'headers' => [
                'Authorization' => "Token {$this->token}",
                'Content-Type' => 'text/plain; charset=utf-8',
            ],
        ]);
        $this->org = $org;
    }

    /**
     * Tulis data line protocol ke InfluxDB.
     * Menerima string line protocol yang dipisahkan newline.
     */
    public function write(string $lineProtocol): void
    {
        try {
            $this->http->post('/api/v2/write', [
                'query' => [
                    'org' => $this->org,
                    'bucket' => $this->bucket,
                    'precision' => 'ns',
                ],
                'body' => $lineProtocol,
            ]);
        } catch (GuzzleException $e) {
            throw new RuntimeException(
                'Penulisan InfluxDB gagal: ' . $e->getMessage(),
                previous: $e,
            );
        }
    }

    /**
     * Jalankan query Flux dan kembalikan hasil yang di-parse.
     */
    public function query(string $fluxQuery): array
    {
        try {
            $response = $this->http->post('/api/v2/query', [
                'headers' => [
                    'Content-Type' => 'application/vnd.flux',
                    'Accept' => 'application/csv',
                ],
                'query' => ['org' => $this->org],
                'body' => $fluxQuery,
            ]);

            return $this->parseCSVResponse((string) $response->getBody());
        } catch (GuzzleException $e) {
            throw new RuntimeException(
                'Query InfluxDB gagal: ' . $e->getMessage(),
                previous: $e,
            );
        }
    }

    /**
     * Periksa konektivitas dan keberadaan bucket.
     */
    public function healthCheck(): bool
    {
        try {
            $response = $this->http->get('/health');
            $body = json_decode((string) $response->getBody(), true);

            return ($body['status'] ?? '') === 'pass';
        } catch (GuzzleException) {
            return false;
        }
    }

    /**
     * Parse respons CSV InfluxDB menjadi array asosiatif.
     */
    private function parseCSVResponse(string $csv): array
    {
        $lines = explode("\n", trim($csv));
        $results = [];

        if (count($lines) < 2) {
            return $results;
        }

        $dataLines = array_filter($lines, fn(string $line): bool => !str_starts_with($line, '#'));
        $dataLines = array_values($dataLines);

        if (empty($dataLines)) {
            return $results;
        }

        $headers = str_getcsv(array_shift($dataLines));

        foreach ($dataLines as $line) {
            $row = str_getcsv($line);
            if (count($row) < count($headers)) {
                continue;
            }
            $results[] = array_combine($headers, $row);
        }

        return $results;
    }
}
```

### Subscriber MQTT dengan Logika Reconnect

```php
<?php

declare(strict_types=1);

namespace App\IoT\Infrastructure;

use PhpMqtt\Client\MqttClient;
use PhpMqtt\Client\ConnectionSettings;
use Psr\Log\LoggerInterface;
use Psr\Log\NullLogger;

final class MQTTSubscriber
{
    private MqttClient $client;
    private int $reconnectDelay = 5;

    public function __construct(
        private string $brokerHost,
        private int $brokerPort,
        private string $clientId,
        private ?LoggerInterface $logger = null,
    ) {
        $this->logger = $logger ?? new NullLogger();
    }

    /**
     * Subscribe ke topik dan proses pesan masuk.
     * Otomatis reconnect saat koneksi terputus.
     *
     * @param callable(SensorReading): void $onMessage
     */
    public function subscribe(string $topic, callable $onMessage): void
    {
        $settings = (new ConnectionSettings())
            ->setKeepAliveInterval(60)
            ->setConnectTimeout(10)
            ->setReconnectAutomatically(true)
            ->setMaxReconnectAttempts(10)
            ->setDelayBetweenReconnectAttempts($this->reconnectDelay * 1000);

        $this->client = new MqttClient(
            $this->brokerHost,
            $this->brokerPort,
            $this->clientId,
        );

        $this->client->registerLoopEventHandler(function () {
            $this->logger?->info('Loop subscriber MQTT berjalan', [
                'client_id' => $this->clientId,
            ]);
        });

        $this->logger?->info('Menghubungkan ke broker MQTT', [
            'host' => $this->brokerHost,
            'port' => $this->brokerPort,
        ]);

        $this->client->connect($settings, true);

        $this->logger?->info('Subscribe ke topik', ['topic' => $topic]);
        $this->client->subscribe($topic, function (string $topic, string $message) use ($onMessage): void {
            $payload = json_decode($message, true);

            if (!is_array($payload)) {
                $this->logger?->warning('Menerima payload JSON tidak valid', [
                    'topic' => $topic,
                    'message' => $message,
                ]);
                return;
            }

            try {
                $reading = \App\IoT\Domain\SensorReading::fromMQTTPayload($payload);
                $onMessage($reading);
            } catch (\Throwable $e) {
                $this->logger?->error('Gagal memproses pembacaan sensor', [
                    'topic' => $topic,
                    'error' => $e->getMessage(),
                ]);
            }
        }, 0);

        $this->client->loop(true);
    }

    public function disconnect(): void
    {
        if (isset($this->client)) {
            $this->client->disconnect();
        }
    }
}
```

> **Catatan:** Paket `php-mqtt/client` menyediakan abstraksi bersih di atas protokol MQTT. Dalam produksi, Anda mungkin ingin menjalankan subscriber sebagai proses PHP long-lived menggunakan Swoole, RoadRunner, atau service systemd dengan supervisor untuk restart otomatis.

</section>

---

<section lang="en">

## Application Layer: Wiring Everything Together

### InfluxDBRepository — Mediating Between Domain and Infrastructure

```php
<?php

declare(strict_types=1);

namespace App\IoT\Application;

use App\IoT\Domain\SensorReading;
use App\IoT\Domain\DashboardQuery;
use App\IoT\Infrastructure\InfluxDBClient;

final class InfluxDBRepository
{
    public function __construct(
        private InfluxDBClient $client,
    ) {}

    /**
     * Write a single sensor reading to InfluxDB.
     */
    public function storeReading(SensorReading $reading): void
    {
        $this->client->write($reading->toInfluxDBLineProtocol() . "\n");
    }

    /**
     * Batch-write multiple readings for efficiency.
     */
    public function storeReadings(array $readings): void
    {
        $lines = array_map(
            fn(SensorReading $r): string => $r->toInfluxDBLineProtocol(),
            $readings,
        );

        $this->client->write(implode("\n", $lines) . "\n");
    }

    /**
     * Query aggregated sensor data for dashboard display.
     */
    public function queryDashboard(DashboardQuery $query): array
    {
        $metricFilter = $query->metric !== null
            ? sprintf('|> filter(fn: (r) => r["metric"] == "%s")', $query->metric)
            : '';

        $fluxQuery = <<<FLUX
from(bucket: "sensor_data")
  |> range(start: -{$query->range})
  |> filter(fn: (r) => r["_measurement"] == "sensor_readings")
  |> filter(fn: (r) => r["sensor_id"] == "{$query->sensorId}")
  {$metricFilter}
  |> filter(fn: (r) => r["_field"] == "value")
  |> aggregateWindow(every: {$query->window}, fn: {$query->aggregation}, createEmpty: true)
  |> yield(name: "{$query->aggregation}")
FLUX;

        return $this->client->query($fluxQuery);
    }

    /**
     * Query the most recent reading for each metric of a sensor.
     */
    public function latestReadings(string $sensorId): array
    {
        $fluxQuery = <<<FLUX
from(bucket: "sensor_data")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "sensor_readings")
  |> filter(fn: (r) => r["sensor_id"] == "{$sensorId}")
  |> filter(fn: (r) => r["_field"] == "value")
  |> last()
  |> group(columns: ["metric"])
FLUX;

        return $this->client->query($fluxQuery);
    }
}
```

### MQTTIngestionService — The Ingestion Orchestrator

```php
<?php

declare(strict_types=1);

namespace App\IoT\Application;

use App\IoT\Domain\SensorReading;
use App\IoT\Infrastructure\MQTTSubscriber;
use Psr\Log\LoggerInterface;
use Psr\Log\NullLogger;

final class MQTTIngestionService
{
    /** @var SensorReading[] */
    private array $buffer = [];
    private int $batchSize;

    public function __construct(
        private MQTTSubscriber $subscriber,
        private InfluxDBRepository $repository,
        private AlertService $alertService,
        ?int $batchSize = null,
        private ?LoggerInterface $logger = null,
    ) {
        $this->batchSize = $batchSize ?? 100;
        $this->logger = $logger ?? new NullLogger();
    }

    /**
     * Start the MQTT ingestion loop.
     * Subscribes to a wildcard topic and processes all sensor messages.
     */
    public function start(string $topic): void
    {
        $this->logger?->info('Starting MQTT ingestion service', [
            'topic' => $topic,
            'batch_size' => $this->batchSize,
        ]);

        $this->subscriber->subscribe($topic, function (SensorReading $reading): void {
            $this->handleReading($reading);
        });
    }

    /**
     * Process a single sensor reading: buffer, validate, store, alert.
     */
    private function handleReading(SensorReading $reading): void
    {
        $this->logger?->debug('Received sensor reading', [
            'sensor_id' => $reading->sensorId,
            'metric' => $reading->metric,
            'value' => $reading->value,
            'unit' => $reading->unit,
        ]);

        $this->buffer[] = $reading;

        if (count($this->buffer) >= $this->batchSize) {
            $this->flush();
        }

        $alertEvent = $this->alertService->evaluate($reading);
        if ($alertEvent !== null) {
            $this->logger?->warning('Alert triggered', [
                'rule_id' => $alertEvent->ruleId,
                'severity' => $alertEvent->severity->value,
                'message' => $alertEvent->message,
                'value' => $alertEvent->value,
                'threshold' => $alertEvent->threshold,
            ]);

            $this->alertService->dispatch($alertEvent);
        }
    }

    /**
     * Flush buffered readings to InfluxDB in a single batch write.
     */
    public function flush(): void
    {
        if (empty($this->buffer)) {
            return;
        }

        $count = count($this->buffer);

        try {
            $this->repository->storeReadings($this->buffer);
            $this->logger?->info('Flushed sensor readings to InfluxDB', [
                'count' => $count,
            ]);
        } catch (\Throwable $e) {
            $this->logger?->error('Failed to flush readings — data may be lost', [
                'count' => $count,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        } finally {
            $this->buffer = [];
        }
    }
}
```

**Key design decisions in the ingestion service:**
- **Batching** — Individual HTTP writes to InfluxDB are expensive. Accumulate readings in memory and flush every N records (default 100). This reduces HTTP round-trips by 100x.
- **Alert evaluation is inline** — After every reading, the alert service checks registered rules. This keeps latency low and avoids a separate polling loop.
- **Buffer is lost on crash** — If the PHP process dies before `flush()`, buffered readings are lost. This is acceptable for most monitoring use cases, but for regulatory data, write to a persistent queue (Redis Streams, Kafka) before ingesting.

### AlertService — Evaluating Rules and Dispatching Alerts

```php
<?php

declare(strict_types=1);

namespace App\IoT\Application;

use App\IoT\Domain\AlertRule;
use App\IoT\Domain\AlertEvent;
use App\IoT\Domain\SensorReading;
use Psr\Log\LoggerInterface;
use Psr\Log\NullLogger;

final class AlertService
{
    /** @var AlertRule[] */
    private array $rules = [];

    /** @var callable[] */
    private array $handlers = [];

    public function __construct(
        private ?LoggerInterface $logger = null,
    ) {
        $this->logger = $logger ?? new NullLogger();
    }

    /**
     * Register an alert rule.
     */
    public function registerRule(AlertRule $rule): void
    {
        $this->rules[] = $rule;
        $this->logger?->info('Alert rule registered', [
            'rule_id' => $rule->id,
            'sensor_id' => $rule->sensorId,
            'metric' => $rule->metric,
            'threshold' => $rule->threshold,
            'severity' => $rule->severity->value,
        ]);
    }

    /**
     * Register an alert handler (email, webhook, SMS, etc.).
     *
     * @param callable(AlertEvent): void $handler
     */
    public function registerHandler(callable $handler): void
    {
        $this->handlers[] = $handler;
    }

    /**
     * Evaluate all registered rules against a sensor reading.
     * Returns the first triggered alert, or null if no rule fires.
     */
    public function evaluate(SensorReading $reading): ?AlertEvent
    {
        foreach ($this->rules as $rule) {
            $event = $rule->evaluate($reading);
            if ($event !== null) {
                return $event;
            }
        }

        return null;
    }

    /**
     * Dispatch an alert event to all registered handlers.
     */
    public function dispatch(AlertEvent $event): void
    {
        foreach ($this->handlers as $handler) {
            try {
                $handler($event);
            } catch (\Throwable $e) {
                $this->logger?->error('Alert handler failed', [
                    'rule_id' => $event->ruleId,
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }
}
```

### DashboardService — Building Dashboard API Responses

```php
<?php

declare(strict_types=1);

namespace App\IoT\Application;

use App\IoT\Domain\DashboardQuery;

final class DashboardService
{
    public function __construct(
        private InfluxDBRepository $repository,
    ) {}

    /**
     * Get aggregated sensor readings for a time-range chart.
     */
    public function getSensorReadings(DashboardQuery $query): array
    {
        $raw = $this->repository->queryDashboard($query);

        return $this->formatChartData($raw);
    }

    /**
     * Get latest sensor values for a live dashboard widget.
     */
    public function getSensorStatus(string $sensorId): array
    {
        $raw = $this->repository->latestReadings($sensorId);

        return array_map(function (array $row): array {
            return [
                'metric' => $row['metric'] ?? 'unknown',
                'value' => (float) ($row['_value'] ?? 0),
                'unit' => $row['unit'] ?? '',
                'timestamp' => $row['_time'] ?? '',
            ];
        }, $raw);
    }

    /**
     * Get all active alerts for display on the dashboard.
     */
    public function getActiveAlerts(): array
    {
        // In a real system, active alerts would be stored in Redis or a relational DB.
        // This is a placeholder that queries recent critical readings from InfluxDB.
        $query = new DashboardQuery(
            sensorId: '.*', // In real code, query all sensors
            range: '10m',
        );

        return $this->repository->queryDashboard($query);
    }

    /**
     * Format raw InfluxDB CSV data into chart-friendly JSON.
     */
    private function formatChartData(array $raw): array
    {
        $labels = [];
        $values = [];

        foreach ($raw as $row) {
            $labels[] = $row['_time'] ?? '';
            $values[] = (float) ($row['_value'] ?? 0);
        }

        return [
            'labels' => $labels,
            'values' => $values,
            'count' => count($raw),
        ];
    }
}
```

</section>

<section lang="id">

## Lapisan Aplikasi: Menyatukan Semuanya

### InfluxDBRepository — Menjembatani Domain dan Infrastruktur

```php
<?php

declare(strict_types=1);

namespace App\IoT\Application;

use App\IoT\Domain\SensorReading;
use App\IoT\Domain\DashboardQuery;
use App\IoT\Infrastructure\InfluxDBClient;

final class InfluxDBRepository
{
    public function __construct(
        private InfluxDBClient $client,
    ) {}

    /**
     * Tulis satu pembacaan sensor ke InfluxDB.
     */
    public function storeReading(SensorReading $reading): void
    {
        $this->client->write($reading->toInfluxDBLineProtocol() . "\n");
    }

    /**
     * Tulis batch beberapa pembacaan untuk efisiensi.
     */
    public function storeReadings(array $readings): void
    {
        $lines = array_map(
            fn(SensorReading $r): string => $r->toInfluxDBLineProtocol(),
            $readings,
        );

        $this->client->write(implode("\n", $lines) . "\n");
    }

    /**
     * Query data sensor teragregasi untuk tampilan dasbor.
     */
    public function queryDashboard(DashboardQuery $query): array
    {
        $metricFilter = $query->metric !== null
            ? sprintf('|> filter(fn: (r) => r["metric"] == "%s")', $query->metric)
            : '';

        $fluxQuery = <<<FLUX
from(bucket: "sensor_data")
  |> range(start: -{$query->range})
  |> filter(fn: (r) => r["_measurement"] == "sensor_readings")
  |> filter(fn: (r) => r["sensor_id"] == "{$query->sensorId}")
  {$metricFilter}
  |> filter(fn: (r) => r["_field"] == "value")
  |> aggregateWindow(every: {$query->window}, fn: {$query->aggregation}, createEmpty: true)
  |> yield(name: "{$query->aggregation}")
FLUX;

        return $this->client->query($fluxQuery);
    }

    /**
     * Query pembacaan terbaru untuk setiap metrik dari sebuah sensor.
     */
    public function latestReadings(string $sensorId): array
    {
        $fluxQuery = <<<FLUX
from(bucket: "sensor_data")
  |> range(start: -1j)
  |> filter(fn: (r) => r["_measurement"] == "sensor_readings")
  |> filter(fn: (r) => r["sensor_id"] == "{$sensorId}")
  |> filter(fn: (r) => r["_field"] == "value")
  |> last()
  |> group(columns: ["metric"])
FLUX;

        return $this->client->query($fluxQuery);
    }
}
```

### MQTTIngestionService — Orkestrator Ingesti

```php
<?php

declare(strict_types=1);

namespace App\IoT\Application;

use App\IoT\Domain\SensorReading;
use App\IoT\Infrastructure\MQTTSubscriber;
use Psr\Log\LoggerInterface;
use Psr\Log\NullLogger;

final class MQTTIngestionService
{
    /** @var SensorReading[] */
    private array $buffer = [];
    private int $batchSize;

    public function __construct(
        private MQTTSubscriber $subscriber,
        private InfluxDBRepository $repository,
        private AlertService $alertService,
        ?int $batchSize = null,
        private ?LoggerInterface $logger = null,
    ) {
        $this->batchSize = $batchSize ?? 100;
        $this->logger = $logger ?? new NullLogger();
    }

    /**
     * Mulai loop ingesti MQTT.
     * Subscribe ke topik wildcard dan proses semua pesan sensor.
     */
    public function start(string $topic): void
    {
        $this->logger?->info('Memulai layanan ingesti MQTT', [
            'topic' => $topic,
            'batch_size' => $this->batchSize,
        ]);

        $this->subscriber->subscribe($topic, function (SensorReading $reading): void {
            $this->handleReading($reading);
        });
    }

    /**
     * Proses satu pembacaan sensor: buffer, validasi, simpan, peringatan.
     */
    private function handleReading(SensorReading $reading): void
    {
        $this->logger?->debug('Menerima pembacaan sensor', [
            'sensor_id' => $reading->sensorId,
            'metric' => $reading->metric,
            'value' => $reading->value,
            'unit' => $reading->unit,
        ]);

        $this->buffer[] = $reading;

        if (count($this->buffer) >= $this->batchSize) {
            $this->flush();
        }

        $alertEvent = $this->alertService->evaluate($reading);
        if ($alertEvent !== null) {
            $this->logger?->warning('Peringatan terpicu', [
                'rule_id' => $alertEvent->ruleId,
                'severity' => $alertEvent->severity->value,
                'message' => $alertEvent->message,
                'value' => $alertEvent->value,
                'threshold' => $alertEvent->threshold,
            ]);

            $this->alertService->dispatch($alertEvent);
        }
    }

    /**
     * Kirim pembacaan yang di-buffer ke InfluxDB dalam satu batch write.
     */
    public function flush(): void
    {
        if (empty($this->buffer)) {
            return;
        }

        $count = count($this->buffer);

        try {
            $this->repository->storeReadings($this->buffer);
            $this->logger?->info('Mengirim pembacaan sensor ke InfluxDB', [
                'count' => $count,
            ]);
        } catch (\Throwable $e) {
            $this->logger?->error('Gagal mengirim pembacaan — data mungkin hilang', [
                'count' => $count,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        } finally {
            $this->buffer = [];
        }
    }
}
```

**Keputusan desain kunci dalam layanan ingesti:**
- **Batching** — Penulisan HTTP individual ke InfluxDB mahal. Akumulasi pembacaan di memori dan kirim setiap N record (default 100). Ini mengurangi round-trip HTTP hingga 100x.
- **Evaluasi peringatan dilakukan inline** — Setelah setiap pembacaan, layanan peringatan memeriksa aturan terdaftar. Ini menjaga latensi tetap rendah dan menghindari loop polling terpisah.
- **Buffer hilang saat crash** — Jika proses PHP mati sebelum `flush()`, pembacaan yang di-buffer hilang. Ini dapat diterima untuk sebagian besar kasus pemantauan, tetapi untuk data regulasi, tulis ke antrean persisten (Redis Streams, Kafka) sebelum ingesti.

### AlertService — Mengevaluasi Aturan dan Mengirim Peringatan

```php
<?php

declare(strict_types=1);

namespace App\IoT\Application;

use App\IoT\Domain\AlertRule;
use App\IoT\Domain\AlertEvent;
use App\IoT\Domain\SensorReading;
use Psr\Log\LoggerInterface;
use Psr\Log\NullLogger;

final class AlertService
{
    /** @var AlertRule[] */
    private array $rules = [];

    /** @var callable[] */
    private array $handlers = [];

    public function __construct(
        private ?LoggerInterface $logger = null,
    ) {
        $this->logger = $logger ?? new NullLogger();
    }

    /**
     * Daftarkan aturan peringatan.
     */
    public function registerRule(AlertRule $rule): void
    {
        $this->rules[] = $rule;
        $this->logger?->info('Aturan peringatan terdaftar', [
            'rule_id' => $rule->id,
            'sensor_id' => $rule->sensorId,
            'metric' => $rule->metric,
            'threshold' => $rule->threshold,
            'severity' => $rule->severity->value,
        ]);
    }

    /**
     * Daftarkan handler peringatan (email, webhook, SMS, dll.).
     *
     * @param callable(AlertEvent): void $handler
     */
    public function registerHandler(callable $handler): void
    {
        $this->handlers[] = $handler;
    }

    /**
     * Evaluasi semua aturan terdaftar terhadap pembacaan sensor.
     * Mengembalikan peringatan pertama yang terpicu, atau null jika tidak ada aturan yang menyala.
     */
    public function evaluate(SensorReading $reading): ?AlertEvent
    {
        foreach ($this->rules as $rule) {
            $event = $rule->evaluate($reading);
            if ($event !== null) {
                return $event;
            }
        }

        return null;
    }

    /**
     * Kirim kejadian peringatan ke semua handler terdaftar.
     */
    public function dispatch(AlertEvent $event): void
    {
        foreach ($this->handlers as $handler) {
            try {
                $handler($event);
            } catch (\Throwable $e) {
                $this->logger?->error('Handler peringatan gagal', [
                    'rule_id' => $event->ruleId,
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }
}
```

### DashboardService — Membangun Respons API Dasbor

```php
<?php

declare(strict_types=1);

namespace App\IoT\Application;

use App\IoT\Domain\DashboardQuery;

final class DashboardService
{
    public function __construct(
        private InfluxDBRepository $repository,
    ) {}

    /**
     * Dapatkan pembacaan sensor teragregasi untuk grafik rentang waktu.
     */
    public function getSensorReadings(DashboardQuery $query): array
    {
        $raw = $this->repository->queryDashboard($query);

        return $this->formatChartData($raw);
    }

    /**
     * Dapatkan nilai sensor terbaru untuk widget dasbor langsung.
     */
    public function getSensorStatus(string $sensorId): array
    {
        $raw = $this->repository->latestReadings($sensorId);

        return array_map(function (array $row): array {
            return [
                'metric' => $row['metric'] ?? 'tidak diketahui',
                'value' => (float) ($row['_value'] ?? 0),
                'unit' => $row['unit'] ?? '',
                'timestamp' => $row['_time'] ?? '',
            ];
        }, $raw);
    }

    /**
     * Dapatkan semua peringatan aktif untuk ditampilkan di dasbor.
     */
    public function getActiveAlerts(): array
    {
        $query = new DashboardQuery(
            sensorId: '.*',
            range: '10m',
        );

        return $this->repository->queryDashboard($query);
    }

    /**
     * Format data CSV InfluxDB mentah menjadi JSON ramah grafik.
     */
    private function formatChartData(array $raw): array
    {
        $labels = [];
        $values = [];

        foreach ($raw as $row) {
            $labels[] = $row['_time'] ?? '';
            $values[] = (float) ($row['_value'] ?? 0);
        }

        return [
            'labels' => $labels,
            'values' => $values,
            'count' => count($raw),
        ];
    }
}
```

</section>

---

<section lang="en">

## Building the Dashboard API Endpoint

The dashboard API exposes sensor data to frontend charts. Here is a minimal PHP router that ties everything together.

```php
<?php

declare(strict_types=1);

namespace App\IoT\UI;

use App\IoT\Domain\DashboardQuery;
use App\IoT\Application\DashboardService;
use App\IoT\Application\MQTTIngestionService;
use App\IoT\Application\InfluxDBRepository;
use App\IoT\Application\AlertService;

/**
 * Minimal dashboard API router.
 * In production, use a framework (Laravel, Slim) or the PSR-7/PSR-15 stack.
 */
final class DashboardController
{
    public function __construct(
        private DashboardService $dashboardService,
        private MQTTIngestionService $ingestionService,
        private AlertService $alertService,
    ) {}

    /**
     * GET /api/dashboard/sensors/{sensorId}/readings
     *
     * Query parameters:
     *   - metric   (string, optional)  — filter by metric name
     *   - range    (string, default 1h) — time range (1h, 6h, 24h, 7d)
     *   - window   (string, default 1m) — aggregation window
     *   - aggregation (string, default mean) — mean, median, max, min, sum
     *
     * Response:
     * {
     *   "sensor_id": "temp-001",
     *   "metric": "temperature",
     *   "range": "1h",
     *   "data": { "labels": [...], "values": [...] },
     *   "count": 60
     * }
     */
    public function readings(string $sensorId, array $params): array
    {
        $params['sensor_id'] = $sensorId;
        $query = DashboardQuery::fromArray($params);

        $data = $this->dashboardService->getSensorReadings($query);

        return [
            'sensor_id' => $sensorId,
            'metric' => $params['metric'] ?? 'all',
            'range' => $query->range,
            'data' => $data,
            'count' => $data['count'],
        ];
    }

    /**
     * GET /api/dashboard/sensors/{sensorId}/status
     *
     * Response:
     * {
     *   "sensor_id": "temp-001",
     *   "latest": [
     *     { "metric": "temperature", "value": 72.5, "unit": "celsius", "timestamp": "..." },
     *     { "metric": "humidity", "value": 45.2, "unit": "percent", "timestamp": "..." }
     *   ]
     * }
     */
    public function status(string $sensorId): array
    {
        $latest = $this->dashboardService->getSensorStatus($sensorId);

        return [
            'sensor_id' => $sensorId,
            'latest' => $latest,
        ];
    }

    /**
     * GET /api/dashboard/alerts
     *
     * Response:
     * {
     *   "alerts": [
     *     { "rule_id": "...", "severity": "critical", "message": "...", "timestamp": "..." }
     *   ],
     *   "count": 2
     * }
     */
    public function alerts(): array
    {
        $alerts = $this->dashboardService->getActiveAlerts();

        return [
            'alerts' => $alerts,
            'count' => count($alerts),
        ];
    }
}
```

### Wiring It All Together: Entry Point

```php
<?php

declare(strict_types=1);

use App\IoT\Infrastructure\InfluxDBClient;
use App\IoT\Infrastructure\MQTTSubscriber;
use App\IoT\Application\InfluxDBRepository;
use App\IoT\Application\MQTTIngestionService;
use App\IoT\Application\DashboardService;
use App\IoT\Application\AlertService;
use App\IoT\Domain\AlertRule;
use App\IoT\Domain\AlertOperator;
use App\IoT\Domain\AlertSeverity;
use App\IoT\Domain\AlertEvent;
use App\IoT\UI\DashboardController;

require_once __DIR__ . '/vendor/autoload.php';

// --- Infrastructure wiring ---

$influxDB = new InfluxDBClient(
    url: 'http://localhost:8086',
    token: 'my-super-secret-token',
    org: 'se-polinema',
    bucket: 'sensor_data',
);

$subscriber = new MQTTSubscriber(
    brokerHost: 'localhost',
    brokerPort: 1883,
    clientId: 'se-polinema-ingestion-' . getmypid(),
);

// --- Application wiring ---

$repository = new InfluxDBRepository($influxDB);
$alertService = new AlertService();

// Register alert rules
$alertService->registerRule(new AlertRule(
    id: 'temp-critical',
    sensorId: 'temp-001',
    metric: 'temperature',
    operator: AlertOperator::GREATER_THAN,
    threshold: 80.0,
    severity: AlertSeverity::CRITICAL,
    message: 'Motor temperature exceeds safe operating limit!',
));

$alertService->registerRule(new AlertRule(
    id: 'vib-warning',
    sensorId: 'vib-002',
    metric: 'vibration',
    operator: AlertOperator::GREATER_THAN_OR_EQUAL,
    threshold: 7.5,
    severity: AlertSeverity::WARNING,
    message: 'Vibration level approaching maintenance threshold.',
));

// Register alert handler — log to stdout
$alertService->registerHandler(function (AlertEvent $event): void {
    echo sprintf(
        "[ALERT %s] [%s] %s | value=%.2f threshold=%.2f\n",
        strtoupper($event->severity->value),
        $event->timestamp->format('Y-m-d H:i:s'),
        $event->message,
        $event->value,
        $event->threshold,
    );
});

$ingestionService = new MQTTIngestionService(
    subscriber: $subscriber,
    repository: $repository,
    alertService: $alertService,
    batchSize: 100,
);

$dashboardService = new DashboardService($repository);
$dashboard = new DashboardController($dashboardService, $ingestionService, $alertService);

// --- Run: Choose one mode ---

$mode = $argv[1] ?? 'ingest';

if ($mode === 'ingest') {
    // Start MQTT ingestion — runs indefinitely
    echo "Starting MQTT ingestion...\n";
    $ingestionService->start('factory/+/+');
}

if ($mode === 'server') {
    // Minimal built-in server for dashboard API
    // Run: php entrypoint.php server
    echo "Starting dashboard API server on http://localhost:8080\n";
    echo "Endpoints:\n";
    echo "  GET /api/dashboard/sensors/{id}/readings\n";
    echo "  GET /api/dashboard/sensors/{id}/status\n";
    echo "  GET /api/dashboard/alerts\n";
}
```

### Simulating Sensor Data for Testing

Use `mosquitto_pub` to send test data to the broker:

```bash
# Publish a temperature reading
mosquitto_pub -h localhost -t 'factory/line1/temperature' -m \
  '{"sensor_id":"temp-001","metric":"temperature","value":75.3,"unit":"celsius","timestamp":"2026-07-08T10:30:00+07:00"}'

# Publish a vibration reading
mosquitto_pub -h localhost -t 'factory/line2/vibration' -m \
  '{"sensor_id":"vib-002","metric":"vibration","value":4.2,"unit":"mm/s","timestamp":"2026-07-08T10:30:05+07:00"}'

# Publish a reading that triggers the critical alert (temperature > 80)
mosquitto_pub -h localhost -t 'factory/line1/temperature' -m \
  '{"sensor_id":"temp-001","metric":"temperature","value":85.7,"unit":"celsius","timestamp":"2026-07-08T10:30:10+07:00"}'
```

When you run the ingestion service and publish these messages, you should see:
```
Starting MQTT ingestion...
[ALERT CRITICAL] [2026-07-08 10:30:10] Motor temperature exceeds safe operating limit! | value=85.70 threshold=80.00
```

</section>

<section lang="id">

## Membangun Endpoint API Dasbor

API dasbor mengekspos data sensor ke grafik frontend. Berikut adalah router PHP minimal yang menyatukan semuanya.

```php
<?php

declare(strict_types=1);

namespace App\IoT\UI;

use App\IoT\Domain\DashboardQuery;
use App\IoT\Application\DashboardService;
use App\IoT\Application\MQTTIngestionService;
use App\IoT\Application\InfluxDBRepository;
use App\IoT\Application\AlertService;

/**
 * Router API dasbor minimal.
 * Dalam produksi, gunakan framework (Laravel, Slim) atau stack PSR-7/PSR-15.
 */
final class DashboardController
{
    public function __construct(
        private DashboardService $dashboardService,
        private MQTTIngestionService $ingestionService,
        private AlertService $alertService,
    ) {}

    /**
     * GET /api/dashboard/sensors/{sensorId}/readings
     *
     * Parameter query:
     *   - metric      (string, opsional) — filter berdasarkan nama metrik
     *   - range       (string, default 1j) — rentang waktu (1j, 6j, 24j, 7h)
     *   - window      (string, default 1m) — jendela agregasi
     *   - aggregation (string, default mean) — mean, median, max, min, sum
     *
     * Respons:
     * {
     *   "sensor_id": "temp-001",
     *   "metric": "suhu",
     *   "range": "1j",
     *   "data": { "labels": [...], "values": [...] },
     *   "count": 60
     * }
     */
    public function readings(string $sensorId, array $params): array
    {
        $params['sensor_id'] = $sensorId;
        $query = DashboardQuery::fromArray($params);

        $data = $this->dashboardService->getSensorReadings($query);

        return [
            'sensor_id' => $sensorId,
            'metric' => $params['metric'] ?? 'semua',
            'range' => $query->range,
            'data' => $data,
            'count' => $data['count'],
        ];
    }

    /**
     * GET /api/dashboard/sensors/{sensorId}/status
     *
     * Respons:
     * {
     *   "sensor_id": "temp-001",
     *   "latest": [
     *     { "metric": "suhu", "value": 72.5, "unit": "celsius", "timestamp": "..." },
     *     { "metric": "kelembaban", "value": 45.2, "unit": "persen", "timestamp": "..." }
     *   ]
     * }
     */
    public function status(string $sensorId): array
    {
        $latest = $this->dashboardService->getSensorStatus($sensorId);

        return [
            'sensor_id' => $sensorId,
            'latest' => $latest,
        ];
    }

    /**
     * GET /api/dashboard/alerts
     *
     * Respons:
     * {
     *   "alerts": [
     *     { "rule_id": "...", "severity": "kritis", "message": "...", "timestamp": "..." }
     *   ],
     *   "count": 2
     * }
     */
    public function alerts(): array
    {
        $alerts = $this->dashboardService->getActiveAlerts();

        return [
            'alerts' => $alerts,
            'count' => count($alerts),
        ];
    }
}
```

### Menyatukan Semuanya: Entry Point

```php
<?php

declare(strict_types=1);

use App\IoT\Infrastructure\InfluxDBClient;
use App\IoT\Infrastructure\MQTTSubscriber;
use App\IoT\Application\InfluxDBRepository;
use App\IoT\Application\MQTTIngestionService;
use App\IoT\Application\DashboardService;
use App\IoT\Application\AlertService;
use App\IoT\Domain\AlertRule;
use App\IoT\Domain\AlertOperator;
use App\IoT\Domain\AlertSeverity;
use App\IoT\Domain\AlertEvent;
use App\IoT\UI\DashboardController;

require_once __DIR__ . '/vendor/autoload.php';

// --- Wiring infrastruktur ---

$influxDB = new InfluxDBClient(
    url: 'http://localhost:8086',
    token: 'my-super-secret-token',
    org: 'se-polinema',
    bucket: 'sensor_data',
);

$subscriber = new MQTTSubscriber(
    brokerHost: 'localhost',
    brokerPort: 1883,
    clientId: 'se-polinema-ingestion-' . getmypid(),
);

// --- Wiring aplikasi ---

$repository = new InfluxDBRepository($influxDB);
$alertService = new AlertService();

// Daftarkan aturan peringatan
$alertService->registerRule(new AlertRule(
    id: 'temp-critical',
    sensorId: 'temp-001',
    metric: 'suhu',
    operator: AlertOperator::GREATER_THAN,
    threshold: 80.0,
    severity: AlertSeverity::CRITICAL,
    message: 'Suhu motor melebihi batas operasi aman!',
));

$alertService->registerRule(new AlertRule(
    id: 'vib-warning',
    sensorId: 'vib-002',
    metric: 'getaran',
    operator: AlertOperator::GREATER_THAN_OR_EQUAL,
    threshold: 7.5,
    severity: AlertSeverity::WARNING,
    message: 'Level getaran mendekati ambang pemeliharaan.',
));

// Daftarkan handler peringatan — log ke stdout
$alertService->registerHandler(function (AlertEvent $event): void {
    echo sprintf(
        "[PERINGATAN %s] [%s] %s | nilai=%.2f ambang=%.2f\n",
        strtoupper($event->severity->value),
        $event->timestamp->format('Y-m-d H:i:s'),
        $event->message,
        $event->value,
        $event->threshold,
    );
});

$ingestionService = new MQTTIngestionService(
    subscriber: $subscriber,
    repository: $repository,
    alertService: $alertService,
    batchSize: 100,
);

$dashboardService = new DashboardService($repository);
$dashboard = new DashboardController($dashboardService, $ingestionService, $alertService);

// --- Jalankan: Pilih satu mode ---

$mode = $argv[1] ?? 'ingest';

if ($mode === 'ingest') {
    echo "Memulai ingesti MQTT...\n";
    $ingestionService->start('pabrik/+/+');
}

if ($mode === 'server') {
    echo "Memulai server API dasbor di http://localhost:8080\n";
    echo "Endpoint:\n";
    echo "  GET /api/dashboard/sensors/{id}/readings\n";
    echo "  GET /api/dashboard/sensors/{id}/status\n";
    echo "  GET /api/dashboard/alerts\n";
}
```

### Mensimulasikan Data Sensor untuk Pengujian

Gunakan `mosquitto_pub` untuk mengirim data uji ke broker:

```bash
# Publikasikan pembacaan suhu
mosquitto_pub -h localhost -t 'pabrik/line1/suhu' -m \
  '{"sensor_id":"temp-001","metric":"suhu","value":75.3,"unit":"celsius","timestamp":"2026-07-08T10:30:00+07:00"}'

# Publikasikan pembacaan getaran
mosquitto_pub -h localhost -t 'pabrik/line2/getaran' -m \
  '{"sensor_id":"vib-002","metric":"getaran","value":4.2,"unit":"mm/s","timestamp":"2026-07-08T10:30:05+07:00"}'

# Publikasikan pembacaan yang memicu peringatan kritis (suhu > 80)
mosquitto_pub -h localhost -t 'pabrik/line1/suhu' -m \
  '{"sensor_id":"temp-001","metric":"suhu","value":85.7,"unit":"celsius","timestamp":"2026-07-08T10:30:10+07:00"}'
```

Ketika Anda menjalankan layanan ingesti dan mempublikasikan pesan-pesan ini, Anda akan melihat:
```
Memulai ingesti MQTT...
[PERINGATAN CRITICAL] [2026-07-08 10:30:10] Suhu motor melebihi batas operasi aman! | nilai=85.70 ambang=80.00
```

</section>

---

<section lang="en">

## Real-Time Dashboard Updates

For real-time dashboard updates, you have two paths. Both are lighter than WebSockets and well-suited to time-series data display.

### Option 1: Short Polling (Simpler)

The dashboard frontend polls the `/api/dashboard/sensors/{id}/status` endpoint every few seconds.

```javascript
// dashboard.js — Minimal polling client
class SensorPollingClient {
    constructor(baseUrl, intervalMs = 5000) {
        this.baseUrl = baseUrl;
        this.intervalMs = intervalMs;
        this.timer = null;
    }

    start(sensorId, onUpdate) {
        const fetchStatus = async () => {
            try {
                const response = await fetch(
                    `${this.baseUrl}/api/dashboard/sensors/${sensorId}/status`
                );
                const data = await response.json();
                onUpdate(data);
            } catch (error) {
                console.error('Dashboard polling failed:', error);
            }
        };

        fetchStatus(); // immediate first fetch
        this.timer = setInterval(fetchStatus, this.intervalMs);
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}

// Usage
const client = new SensorPollingClient('http://localhost:8080', 3000);
client.start('temp-001', (data) => {
    console.log('Sensor update:', data);
    // Update chart widgets here
});
```

### Option 2: Server-Sent Events (Efficient)

SSE is a one-way stream from server to client — ideal for pushing time-series data. The server keeps a persistent HTTP connection and writes events as lines.

```php
<?php

declare(strict_types=1);

namespace App\IoT\UI;

/**
 * SSE stream controller for real-time sensor data.
 */
final class SSEController
{
    public function __construct(
        private \App\IoT\Application\DashboardService $dashboardService,
    ) {}

    /**
     * GET /api/dashboard/sensors/{sensorId}/stream
     *
     * Opens an SSE connection that pushes the latest sensor readings
     * every N seconds until the client disconnects.
     */
    public function stream(string $sensorId, int $intervalSeconds = 5): never
    {
        header('Content-Type: text/event-stream');
        header('Cache-Control: no-cache');
        header('Connection: keep-alive');
        header('X-Accel-Buffering: no'); // disable nginx buffering

        while (true) {
            if (connection_aborted()) {
                break;
            }

            $status = $this->dashboardService->getSensorStatus($sensorId);
            $data = json_encode($status);

            echo "event: sensor_update\n";
            echo "data: {$data}\n\n";

            if (ob_get_level() > 0) {
                ob_flush();
            }
            flush();

            sleep($intervalSeconds);
        }
    }
}
```

```javascript
// SSE client — browser-native, no library needed
const eventSource = new EventSource(
    'http://localhost:8080/api/dashboard/sensors/temp-001/stream'
);

eventSource.addEventListener('sensor_update', (event) => {
    const data = JSON.parse(event.data);
    console.log('SSE update:', data);
    // Update chart widgets here
});

eventSource.addEventListener('error', () => {
    console.warn('SSE connection lost. Reconnecting...');
    // EventSource auto-reconnects by default
});
```

| Approach | Latency | Server Load | Complexity | Best For |
|---|---|---|---|---|
| **Short Polling** | 1-5 seconds | Higher (new TCP per poll) | Low | Prototypes, low-frequency sensors |
| **SSE** | Sub-second | Lower (persistent TCP) | Medium | Live dashboards, alert streams |

**Recommendation:** Start with short polling during development. Switch to SSE when you hit more than 10 concurrent dashboard clients or need sub-second alert delivery.

</section>

<section lang="id">

## Pembaruan Dasbor Real-Time

Untuk pembaruan dasbor real-time, Anda memiliki dua jalur. Keduanya lebih ringan daripada WebSockets dan cocok untuk tampilan data time-series.

### Opsi 1: Short Polling (Lebih Sederhana)

Frontend dasbor melakukan polling endpoint `/api/dashboard/sensors/{id}/status` setiap beberapa detik.

```javascript
// dashboard.js — Klien polling minimal
class SensorPollingClient {
    constructor(baseUrl, intervalMs = 5000) {
        this.baseUrl = baseUrl;
        this.intervalMs = intervalMs;
        this.timer = null;
    }

    start(sensorId, onUpdate) {
        const fetchStatus = async () => {
            try {
                const response = await fetch(
                    `${this.baseUrl}/api/dashboard/sensors/${sensorId}/status`
                );
                const data = await response.json();
                onUpdate(data);
            } catch (error) {
                console.error('Polling dasbor gagal:', error);
            }
        };

        fetchStatus(); // pengambilan pertama langsung
        this.timer = setInterval(fetchStatus, this.intervalMs);
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}

// Penggunaan
const client = new SensorPollingClient('http://localhost:8080', 3000);
client.start('temp-001', (data) => {
    console.log('Pembaruan sensor:', data);
    // Perbarui widget grafik di sini
});
```

### Opsi 2: Server-Sent Events (Efisien)

SSE adalah aliran satu arah dari server ke klien — ideal untuk mendorong data time-series. Server menjaga koneksi HTTP persisten dan menulis kejadian sebagai baris.

```php
<?php

declare(strict_types=1);

namespace App\IoT\UI;

/**
 * Kontroler aliran SSE untuk data sensor real-time.
 */
final class SSEController
{
    public function __construct(
        private \App\IoT\Application\DashboardService $dashboardService,
    ) {}

    /**
     * GET /api/dashboard/sensors/{sensorId}/stream
     *
     * Membuka koneksi SSE yang mendorong pembacaan sensor terbaru
     * setiap N detik hingga klien memutuskan.
     */
    public function stream(string $sensorId, int $intervalSeconds = 5): never
    {
        header('Content-Type: text/event-stream');
        header('Cache-Control: no-cache');
        header('Connection: keep-alive');
        header('X-Accel-Buffering: no'); // nonaktifkan buffering nginx

        while (true) {
            if (connection_aborted()) {
                break;
            }

            $status = $this->dashboardService->getSensorStatus($sensorId);
            $data = json_encode($status);

            echo "event: sensor_update\n";
            echo "data: {$data}\n\n";

            if (ob_get_level() > 0) {
                ob_flush();
            }
            flush();

            sleep($intervalSeconds);
        }
    }
}
```

```javascript
// Klien SSE — native browser, tidak perlu library
const eventSource = new EventSource(
    'http://localhost:8080/api/dashboard/sensors/temp-001/stream'
);

eventSource.addEventListener('sensor_update', (event) => {
    const data = JSON.parse(event.data);
    console.log('Pembaruan SSE:', data);
    // Perbarui widget grafik di sini
});

eventSource.addEventListener('error', () => {
    console.warn('Koneksi SSE terputus. Menghubungkan ulang...');
    // EventSource otomatis reconnect secara default
});
```

| Pendekatan | Latensi | Beban Server | Kompleksitas | Terbaik Untuk |
|---|---|---|---|---|
| **Short Polling** | 1-5 detik | Lebih tinggi (TCP baru per poll) | Rendah | Prototipe, sensor frekuensi rendah |
| **SSE** | Sub-detik | Lebih rendah (TCP persisten) | Sedang | Dasbor langsung, aliran peringatan |

**Rekomendasi:** Mulai dengan short polling selama pengembangan. Beralih ke SSE ketika Anda mencapai lebih dari 10 klien dasbor bersamaan atau membutuhkan pengiriman peringatan sub-detik.

</section>

---

<section lang="en">

## Production Considerations

The code above is a teaching aid — production IoT systems require additional hardening.

### 1. Buffering and Write Durability

In-memory buffers are fast but volatile. For production, use a persistent write-ahead log:

```
MQTT Message → Redis Stream (XADD) → PHP Consumer (XREADGROUP) → InfluxDB
```

This ensures that even if the PHP consumer crashes mid-batch, the messages are still in Redis and can be replayed by another consumer in the consumer group.

### 2. Retry with Exponential Backoff

Network failures to InfluxDB are inevitable. Wrap writes with retry logic:

```php
private function writeWithRetry(string $lineProtocol, int $maxRetries = 3): void
{
    $attempt = 0;
    $delay = 1; // seconds

    while ($attempt < $maxRetries) {
        try {
            $this->client->write($lineProtocol);
            return;
        } catch (\RuntimeException $e) {
            $attempt++;
            if ($attempt >= $maxRetries) {
                throw $e;
            }
            sleep($delay);
            $delay *= 2; // exponential backoff: 1s, 2s, 4s
        }
    }
}
```

### 3. Authentication and Security

- **MQTT:** Enable TLS and username/password authentication. Never expose the broker on a public IP without authentication.
- **InfluxDB:** Use API tokens with the least privilege — the ingestion client only needs write access to the `sensor_data` bucket; the dashboard client only needs read access.
- **Dashboard API:** Add JWT-based authentication. Industrial data may reveal production rates, equipment health, and factory floor layout — all sensitive information.

### 4. Data Retention and Downsampling

InfluxDB retention policies automate data lifecycle management:

| Bucket | Retention | Resolution | Purpose |
|---|---|---|---|
| `sensor_data_raw` | 7 days | Raw (ms) | Real-time dashboards, alert evaluation |
| `sensor_data_1m` | 90 days | 1-minute aggregates | Trend analysis, weekly reports |
| `sensor_data_1h` | 1 year | 1-hour aggregates | Monthly reports, capacity planning |

Use InfluxDB **tasks** (scheduled Flux queries) to downsample from raw buckets to aggregate buckets automatically. This ensures query performance stays fast even as data volume grows into the hundreds of millions of data points.

### 5. Monitoring the Monitor

Your ingestion pipeline itself needs monitoring. Track these metrics:

- MQTT messages received per second
- InfluxDB write latency (p50, p95, p99)
- Batch flush frequency and size
- Alert evaluation rate
- Consumer group lag (if using Redis Streams)

Export these to a separate monitoring bucket and visualise them in a system-health dashboard. A silent ingestion failure is worse than a noisy one — if your alerting system itself is broken, you need to know immediately.

</section>

<section lang="id">

## Pertimbangan Produksi

Kode di atas adalah alat bantu pengajaran — sistem IoT produksi memerlukan pengerasan tambahan.

### 1. Buffering dan Durabilitas Penulisan

Buffer dalam memori cepat tetapi volatil. Untuk produksi, gunakan write-ahead log persisten:

```
Pesan MQTT → Redis Stream (XADD) → Konsumen PHP (XREADGROUP) → InfluxDB
```

Ini memastikan bahwa bahkan jika konsumen PHP crash di tengah batch, pesan masih ada di Redis dan dapat diputar ulang oleh konsumen lain dalam grup konsumen.

### 2. Retry dengan Exponential Backoff

Kegagalan jaringan ke InfluxDB tidak dapat dihindari. Bungkus penulisan dengan logika retry:

```php
private function writeWithRetry(string $lineProtocol, int $maxRetries = 3): void
{
    $attempt = 0;
    $delay = 1; // detik

    while ($attempt < $maxRetries) {
        try {
            $this->client->write($lineProtocol);
            return;
        } catch (\RuntimeException $e) {
            $attempt++;
            if ($attempt >= $maxRetries) {
                throw $e;
            }
            sleep($delay);
            $delay *= 2; // exponential backoff: 1d, 2d, 4d
        }
    }
}
```

### 3. Autentikasi dan Keamanan

- **MQTT:** Aktifkan TLS dan autentikasi username/password. Jangan pernah mengekspos broker di IP publik tanpa autentikasi.
- **InfluxDB:** Gunakan token API dengan hak istimewa minimal — klien ingesti hanya memerlukan akses tulis ke bucket `sensor_data`; klien dasbor hanya memerlukan akses baca.
- **API Dasbor:** Tambahkan autentikasi berbasis JWT. Data industri dapat mengungkapkan tingkat produksi, kesehatan peralatan, dan tata letak lantai pabrik — semua informasi sensitif.

### 4. Retensi Data dan Downsampling

Kebijakan retensi InfluxDB mengotomatiskan manajemen siklus hidup data:

| Bucket | Retensi | Resolusi | Tujuan |
|---|---|---|---|
| `sensor_data_raw` | 7 hari | Mentah (ms) | Dasbor real-time, evaluasi peringatan |
| `sensor_data_1m` | 90 hari | Agregat 1-menit | Analisis tren, laporan mingguan |
| `sensor_data_1h` | 1 tahun | Agregat 1-jam | Laporan bulanan, perencanaan kapasitas |

Gunakan **tasks** InfluxDB (query Flux terjadwal) untuk men-downsample dari bucket mentah ke bucket agregat secara otomatis. Ini memastikan performa query tetap cepat meskipun volume data tumbuh menjadi ratusan juta titik data.

### 5. Memantau Pemantau

Pipeline ingesti Anda sendiri memerlukan pemantauan. Lacak metrik ini:

- Pesan MQTT diterima per detik
- Latensi penulisan InfluxDB (p50, p95, p99)
- Frekuensi dan ukuran batch flush
- Tingkat evaluasi peringatan
- Lag grup konsumen (jika menggunakan Redis Streams)

Ekspor ini ke bucket pemantauan terpisah dan visualisasikan di dasbor kesehatan sistem. Kegagalan ingesti yang diam lebih buruk daripada yang berisik — jika sistem peringatan Anda sendiri rusak, Anda perlu mengetahuinya segera.

</section>

---

<section lang="en">

## Common Mistakes

| Scenario | What Not to Do | What to Do Instead |
|---|---|---|
| **Storing sensor data in MySQL** | `INSERT INTO sensor_readings` for every MQTT message | Use a time-series database (InfluxDB, TimescaleDB) designed for sequential writes and time-range queries |
| **Polling MQTT** | A cron job that runs `mosquitto_sub` every minute | Run a persistent subscriber process — MQTT is push-based |
| **Individual HTTP writes** | One InfluxDB API call per sensor reading | Batch up to 100–500 readings per write call |
| **Synchronous alert dispatch** | Blocking the ingestion pipeline while sending email/SMS | Fire-and-forget: push alert events to a queue (Redis, SQS) and handle dispatch asynchronously |
| **No timestamp validation** | Trusting the sensor's clock | Validate timestamps are within a reasonable skew (e.g., ±5 minutes from server time). Reject future timestamps. |
| **Storing raw data forever** | 10-second-resolution data retained for 5 years | Implement retention policies and downsample tasks |
| **No dead-letter queue** | Silently dropping malformed MQTT messages | Log invalid payloads to a `dlq` bucket or file for later inspection |
| **Hardcoded thresholds** | `if ($temp > 80)` in the ingestion loop | Use the `AlertRule` value object and register rules dynamically — thresholds change with seasons and equipment age |

</section>

<section lang="id">

## Kesalahan Umum

| Skenario | Yang Tidak Boleh Dilakukan | Yang Harus Dilakukan Sebagai Gantinya |
|---|---|---|
| **Menyimpan data sensor di MySQL** | `INSERT INTO sensor_readings` untuk setiap pesan MQTT | Gunakan database time-series (InfluxDB, TimescaleDB) yang dirancang untuk penulisan sekuensial dan query rentang waktu |
| **Polling MQTT** | Cron job yang menjalankan `mosquitto_sub` setiap menit | Jalankan proses subscriber persisten — MQTT berbasis push |
| **Penulisan HTTP individual** | Satu panggilan API InfluxDB per pembacaan sensor | Batch hingga 100–500 pembacaan per panggilan tulis |
| **Pengiriman peringatan sinkron** | Memblokir pipeline ingesti saat mengirim email/SMS | Fire-and-forget: dorong kejadian peringatan ke antrean (Redis, SQS) dan tangani pengiriman secara asinkron |
| **Tidak ada validasi timestamp** | Mempercayai jam sensor | Validasi timestamp berada dalam skew yang wajar (misal: ±5 menit dari waktu server). Tolak timestamp masa depan. |
| **Menyimpan data mentah selamanya** | Data resolusi 10 detik disimpan selama 5 tahun | Terapkan kebijakan retensi dan tugas downsample |
| **Tidak ada dead-letter queue** | Secara diam-diam menjatuhkan pesan MQTT yang salah format | Catat payload tidak valid ke bucket atau file `dlq` untuk inspeksi nanti |
| **Ambang hardcoded** | `if ($suhu > 80)` di dalam loop ingesti | Gunakan value object `AlertRule` dan daftarkan aturan secara dinamis — ambang berubah seiring musim dan usia peralatan |

</section>

---

<section lang="en">

## Summary

1. **Industrial IoT is a data-intensive domain** where write throughput and time-range query performance are the primary concerns — far more so than CRUD or relational integrity.
2. **The architecture follows a clear pipeline:** sensors → edge gateway → MQTT broker → PHP ingestion → time-series database → dashboard API. Each layer solves a specific problem and fails in specific ways.
3. **MQTT is the lingua franca of IoT.** It is push-based, lightweight, and designed for constrained devices. Your PHP backend must be a persistent subscriber, not a polling cron job.
4. **Time-series databases are non-negotiable** for sensor data. InfluxDB line protocol is simple, batchable, and wires straight into ingestion code. Use retention policies and downsampling tasks to manage storage growth.
5. **Batch writes to InfluxDB** — individual HTTP calls are 100x slower than batched line protocol. Buffer readings in memory and flush every 100–500 records.
6. **Alert evaluation must be inline and fast.** Check thresholds against every incoming reading before the write — not in a separate polling loop. Use the `AlertRule`/`AlertOperator`/`AlertSeverity` domain model to keep rules configurable.
7. **SSE beats WebSockets for dashboard updates.** One-way server-to-client stream, browser-native EventSource API, automatic reconnection. Start with polling, graduate to SSE.
8. **Production hardening requires:** persistent write-ahead buffer (Redis Streams), retry with exponential backoff, least-privilege API tokens, TLS on all connections, and a monitoring dashboard for the ingestion pipeline itself.

> "In industrial automation, the code you write doesn't just move data — it protects equipment worth millions and the people operating it. Every skipped reading, every missed alert, and every second of dashboard lag has a real-world cost. Engineer accordingly."

## What to Read Next

- **[Domain-Driven Design Fundamentals with PHP](/blog/domain-driven-design-fundamentals-php)** — Learn how bounded contexts separate MQTT ingestion, dashboard querying, and alert management cleanly.
- **[Test-Driven Development (TDD) with PHP](/blog/test-driven-development)** — Build your ingestion pipeline and alert rules with confidence using the Red-Green-Refactor cycle.
- **[Clean Code Principles with PHP](/blog/clean-code-principles)** — Keep your sensor data pipeline readable as the number of metrics, sensors, and alert rules grows.
- **[Design Patterns with PHP](/blog/design-patterns-with-php)** — Apply Observer (alert handlers), Strategy (aggregation functions), and Pipeline (data processing stages) patterns.
- **[Microservices Architecture Fundamentals with PHP](/blog/microservices-architecture-fundamentals)** — Understand when to extract MQTT ingestion, dashboard API, and alert dispatch into separate services.
- **[CI/CD with GitHub Actions for PHP](/blog/ci-cd-github-actions-php)** — Automate deployment of your ingestion service and dashboard API with container-based CI/CD.
- **[InfluxDB v2 Documentation](https://docs.influxdata.com/influxdb/v2/)** — Official docs for line protocol, Flux query language, tasks, and retention policies.
- **[MQTT Specification (v5.0)](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html)** — The OASIS standard. Essential reading for understanding QoS levels, retained messages, and session persistence.

</section>

<section lang="id">

## Ringkasan

1. **IoT industri adalah domain intensif data** di mana throughput penulisan dan performa query rentang waktu adalah perhatian utama — jauh lebih penting daripada CRUD atau integritas relasional.
2. **Arsitektur mengikuti pipeline yang jelas:** sensor → gateway edge → broker MQTT → ingesti PHP → database time-series → API dasbor. Setiap lapisan memecahkan masalah spesifik dan gagal dengan cara spesifik.
3. **MQTT adalah lingua franca IoT.** Ini berbasis push, ringan, dan dirancang untuk perangkat terbatas. Backend PHP Anda harus menjadi subscriber persisten, bukan cron job polling.
4. **Database time-series tidak dapat dinegosiasikan** untuk data sensor. Line protocol InfluxDB sederhana, dapat di-batch, dan terhubung langsung ke kode ingesti. Gunakan kebijakan retensi dan tugas downsample untuk mengelola pertumbuhan penyimpanan.
5. **Batch write ke InfluxDB** — panggilan HTTP individual 100x lebih lambat daripada line protocol yang di-batch. Buffer pembacaan di memori dan kirim setiap 100–500 record.
6. **Evaluasi peringatan harus inline dan cepat.** Periksa ambang terhadap setiap pembacaan masuk sebelum penulisan — bukan di loop polling terpisah. Gunakan model domain `AlertRule`/`AlertOperator`/`AlertSeverity` untuk menjaga aturan tetap dapat dikonfigurasi.
7. **SSE mengalahkan WebSockets untuk pembaruan dasbor.** Aliran satu arah server-ke-klien, API EventSource native browser, koneksi ulang otomatis. Mulai dengan polling, naik ke SSE.
8. **Pengerasan produksi memerlukan:** buffer write-ahead persisten (Redis Streams), retry dengan exponential backoff, token API hak istimewa minimal, TLS pada semua koneksi, dan dasbor pemantauan untuk pipeline ingesti itu sendiri.

> "Dalam otomasi industri, kode yang Anda tulis tidak hanya memindahkan data — ia melindungi peralatan bernilai jutaan dan orang yang mengoperasikannya. Setiap pembacaan yang terlewat, setiap peringatan yang terlewat, dan setiap detik lag dasbor memiliki biaya dunia nyata. Rekayasalah sesuai dengan itu."

## Bacaan Selanjutnya

- **[Dasar-Dasar Domain-Driven Design dengan PHP](/blog/domain-driven-design-fundamentals-php)** — Pelajari bagaimana bounded context memisahkan ingesti MQTT, query dasbor, dan manajemen peringatan dengan bersih.
- **[Test-Driven Development (TDD) dengan PHP](/blog/test-driven-development)** — Bangun pipeline ingesti dan aturan peringatan Anda dengan percaya diri menggunakan siklus Red-Green-Refactor.
- **[Prinsip Clean Code dengan PHP](/blog/clean-code-principles)** — Jaga pipeline data sensor Anda tetap terbaca seiring bertambahnya jumlah metrik, sensor, dan aturan peringatan.
- **[Design Patterns dengan PHP](/blog/design-patterns-with-php)** — Terapkan pola Observer (handler peringatan), Strategy (fungsi agregasi), dan Pipeline (tahap pemrosesan data).
- **[Dasar-Dasar Arsitektur Microservices dengan PHP](/blog/microservices-architecture-fundamentals)** — Pahami kapan harus mengekstrak ingesti MQTT, API dasbor, dan pengiriman peringatan ke layanan terpisah.
- **[CI/CD dengan GitHub Actions untuk PHP](/blog/ci-cd-github-actions-php)** — Otomatiskan deployment layanan ingesti dan API dasbor Anda dengan CI/CD berbasis kontainer.
- **[Dokumentasi InfluxDB v2](https://docs.influxdata.com/influxdb/v2/)** — Dokumentasi resmi untuk line protocol, bahasa query Flux, tasks, dan kebijakan retensi.
- **[Spesifikasi MQTT (v5.0)](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html)** — Standar OASIS. Bacaan penting untuk memahami level QoS, retained messages, dan persistensi sesi.

</section>

---

<section lang="en">

## Practice Exercise: Extend the Dashboard with Threshold-Based Alerts

Now it is your turn. Extend the system with the following features:

### Task 1: Add a Cooldown Period to Alerts

The current `AlertService` fires an alert on **every** reading that exceeds the threshold. In a real factory, a temperature spike generates tens of readings per second — you do not want to dispatch an alert for every single one.

**Requirements:**
- Add a `cooldownSeconds` property to `AlertRule`
- Modify `AlertService::evaluate()` to skip alerting if the same rule triggered within the cooldown window
- Store the last trigger timestamp per rule in memory (use a `private array $lastTriggered` map)

```php
// Starter code
$alertService->registerRule(new AlertRule(
    id: 'temp-critical-v2',
    sensorId: 'temp-001',
    metric: 'temperature',
    operator: AlertOperator::GREATER_THAN,
    threshold: 80.0,
    severity: AlertSeverity::CRITICAL,
    message: 'Motor overheat detected!',
    cooldownSeconds: 60, // only fire once per minute
));
```

**Expected behavior:**
```
Reading 1: temp=81.5 → ALERT FIRED
Reading 2: temp=82.0 (10s later) → SKIPPED (cooldown)
Reading 3: temp=83.1 (70s later) → ALERT FIRED
```

### Task 2: Add Data Export Endpoint

Add a CSV/JSON export endpoint to `DashboardController`:

```
GET /api/dashboard/sensors/{sensorId}/export?from=2026-07-01T00:00:00Z&to=2026-07-08T00:00:00Z&format=csv
```

**Requirements:**
- Accept `from` and `to` ISO 8601 timestamps
- Accept `format` parameter — `csv` or `json`
- For CSV: return a CSV download with columns: `timestamp, sensor_id, metric, value, unit`
- For JSON: return an array of reading objects
- Stream the response for large datasets instead of building the entire payload in memory

```php
// Starter contract
public function export(string $sensorId, DateTimeImmutable $from, DateTimeImmutable $to, string $format = 'csv'): void
{
    // Your implementation here
    // Tip: Use InfluxDB's range(start: ..., stop: ...) in the Flux query
    // Tip: For CSV, set Content-Type: text/csv and Content-Disposition: attachment
}
```

### Task 3: Multi-Sensor Dashboard Summary

The current dashboard shows data for one sensor at a time. Build a summary endpoint that aggregates across all sensors:

```
GET /api/dashboard/summary
```

**Response format:**
```json
{
  "sensors": [
    {
      "sensor_id": "temp-001",
      "latest": { "metric": "temperature", "value": 72.5, "unit": "celsius", "timestamp": "..." },
      "active_alerts": 0,
      "status": "normal"
    },
    {
      "sensor_id": "vib-002",
      "latest": { "metric": "vibration", "value": 8.2, "unit": "mm/s", "timestamp": "..." },
      "active_alerts": 1,
      "status": "warning"
    }
  ],
  "total_sensors": 12,
  "sensors_in_alert": 2
}
```

**Requirements:**
- Query all unique sensor IDs from InfluxDB (use `schema.measurements()` or a separate registry table)
- For each sensor, fetch the latest reading and check if any alert rules are currently violated
- Return a consolidated status: `normal`, `warning`, or `critical`

**Tip:** Use a Flux query like this to get distinct sensor IDs:

```
import "influxdata/influxdb/schema"
schema.measurementTagValues(
    bucket: "sensor_data",
    measurement: "sensor_readings",
    tag: "sensor_id",
)
```

### What You Should Learn from This Exercise

- **Rate limiting for alerts** prevents operator fatigue — too many alerts train people to ignore them.
- **Data export** is a compliance requirement in many industries — auditors need raw data, not just charts.
- **Multi-sensor aggregation** is what separates a dashboard from a single-sensor debug view. Real factory floors have hundreds of sensors.
- The domain objects (`AlertRule`, `SensorReading`, `DashboardQuery`) make these extensions straightforward — you are adding behaviour to well-defined models, not hacking SQL strings together.

</section>

<section lang="id">

## Latihan Praktik: Perluas Dasbor dengan Peringatan Berbasis Ambang

Sekarang giliran Anda. Perluas sistem dengan fitur-fitur berikut:

### Tugas 1: Tambahkan Periode Cooldown ke Peringatan

`AlertService` saat ini memicu peringatan pada **setiap** pembacaan yang melebihi ambang. Di pabrik nyata, lonjakan suhu menghasilkan puluhan pembacaan per detik — Anda tidak ingin mengirim peringatan untuk setiap satu.

**Persyaratan:**
- Tambahkan properti `cooldownSeconds` ke `AlertRule`
- Modifikasi `AlertService::evaluate()` untuk melewati peringatan jika aturan yang sama terpicu dalam jendela cooldown
- Simpan timestamp pemicu terakhir per aturan di memori (gunakan peta `private array $lastTriggered`)

```php
// Kode awal
$alertService->registerRule(new AlertRule(
    id: 'temp-critical-v2',
    sensorId: 'temp-001',
    metric: 'suhu',
    operator: AlertOperator::GREATER_THAN,
    threshold: 80.0,
    severity: AlertSeverity::CRITICAL,
    message: 'Overheat motor terdeteksi!',
    cooldownSeconds: 60, // hanya picu sekali per menit
));
```

**Perilaku yang diharapkan:**
```
Pembacaan 1: suhu=81.5 → PERINGATAN DIPICU
Pembacaan 2: suhu=82.0 (10d kemudian) → DILEWATI (cooldown)
Pembacaan 3: suhu=83.1 (70d kemudian) → PERINGATAN DIPICU
```

### Tugas 2: Tambahkan Endpoint Ekspor Data

Tambahkan endpoint ekspor CSV/JSON ke `DashboardController`:

```
GET /api/dashboard/sensors/{sensorId}/export?from=2026-07-01T00:00:00Z&to=2026-07-08T00:00:00Z&format=csv
```

**Persyaratan:**
- Terima timestamp ISO 8601 `from` dan `to`
- Terima parameter `format` — `csv` atau `json`
- Untuk CSV: kembalikan unduhan CSV dengan kolom: `timestamp, sensor_id, metric, value, unit`
- Untuk JSON: kembalikan array objek pembacaan
- Stream respons untuk dataset besar alih-alih membangun seluruh payload di memori

```php
// Kontrak awal
public function export(string $sensorId, DateTimeImmutable $from, DateTimeImmutable $to, string $format = 'csv'): void
{
    // Implementasi Anda di sini
    // Tip: Gunakan range(start: ..., stop: ...) InfluxDB dalam query Flux
    // Tip: Untuk CSV, atur Content-Type: text/csv dan Content-Disposition: attachment
}
```

### Tugas 3: Ringkasan Dasbor Multi-Sensor

Dasbor saat ini menampilkan data untuk satu sensor pada satu waktu. Bangun endpoint ringkasan yang mengagregasi di semua sensor:

```
GET /api/dashboard/summary
```

**Format respons:**
```json
{
  "sensors": [
    {
      "sensor_id": "temp-001",
      "latest": { "metric": "suhu", "value": 72.5, "unit": "celsius", "timestamp": "..." },
      "active_alerts": 0,
      "status": "normal"
    },
    {
      "sensor_id": "vib-002",
      "latest": { "metric": "getaran", "value": 8.2, "unit": "mm/s", "timestamp": "..." },
      "active_alerts": 1,
      "status": "warning"
    }
  ],
  "total_sensors": 12,
  "sensors_in_alert": 2
}
```

**Persyaratan:**
- Query semua ID sensor unik dari InfluxDB (gunakan `schema.measurements()` atau tabel registri terpisah)
- Untuk setiap sensor, ambil pembacaan terbaru dan periksa apakah ada aturan peringatan yang saat ini dilanggar
- Kembalikan status terkonsolidasi: `normal`, `warning`, atau `critical`

**Tip:** Gunakan query Flux seperti ini untuk mendapatkan ID sensor yang berbeda:

```
import "influxdata/influxdb/schema"
schema.measurementTagValues(
    bucket: "sensor_data",
    measurement: "sensor_readings",
    tag: "sensor_id",
)
```

### Yang Harus Anda Pelajari dari Latihan Ini

- **Rate limiting untuk peringatan** mencegah kelelahan operator — terlalu banyak peringatan melatih orang untuk mengabaikannya.
- **Ekspor data** adalah persyaratan kepatuhan di banyak industri — auditor membutuhkan data mentah, bukan hanya grafik.
- **Agregasi multi-sensor** adalah yang membedakan dasbor dari tampilan debug sensor tunggal. Lantai pabrik nyata memiliki ratusan sensor.
- Objek domain (`AlertRule`, `SensorReading`, `DashboardQuery`) membuat perluasan ini langsung — Anda menambahkan perilaku ke model yang terdefinisi dengan baik, bukan meretas string SQL bersama-sama.

</section>
