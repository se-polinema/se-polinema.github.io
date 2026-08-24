---
title: "AI-Powered Requirements Automation with PHP"
titleId: "Otomatisasi Kebutuhan Perangkat Lunak Berbasis AI dengan PHP"
date: 2026-07-04
updated: 2026-07-04
category: tutorial
author: SE Lab
lang: en
featured: false
stream: emerging-technologies-se
tags:
  - AI
  - Requirements Engineering
  - PHP
tagsId:
  - AI
  - Rekayasa Kebutuhan
  - PHP
excerpt: "Learn how to use LLMs and AI-assisted workflows to turn vague stakeholder requests into structured user stories, SRS snippets, and acceptance criteria. Covers prompt engineering for requirements, a complete PHP helper to call LLM APIs, traceability mapping, and the limitations of AI-generated requirements, including hallucinations and bias."
excerptId: "Pelajari cara menggunakan LLM dan alur kerja berbantuan AI untuk mengubah permintaan pemangku kepentingan yang samar menjadi user story terstruktur, potongan SRS, dan kriteria penerimaan. Mencakup prompt engineering untuk kebutuhan, helper PHP lengkap untuk memanggil LLM API, pemetaan ketertelusuran, dan keterbatasan kebutuhan yang dihasilkan AI, termasuk halusinasi dan bias."
---

<section lang="en">

## The Cost of Unclear Requirements

Requirements engineering is where most software projects win or lose. The Standish Group's CHAOS reports have consistently shown that incomplete or ambiguous requirements are among the top three causes of project failure, right alongside poor stakeholder involvement and scope creep. Students at Politeknik Negeri Malang experience this every semester: a project brief says "build a student portal," and three weeks later the team has built completely different things because nobody defined what "portal" means.

Traditional requirements engineering relies on interviews, workshops, and manual documentation. It is labor-intensive, error-prone, and often skips the essential step of writing verifiable acceptance criteria. The gap between what stakeholders say and what developers build is filled with assumptions, and assumptions are the root of rework.

**AI-powered requirements automation** uses large language models (LLMs) and natural-language processing (NLP) tools to bridge this gap. By feeding the LLM stakeholder language (meeting notes, feature requests, or user interviews), we can generate structured, verifiable requirements artifacts: user stories, software requirements specification (SRS) snippets, and testable acceptance criteria.

This is not about replacing the business analyst or the product owner. It is about giving them a first draft that is already structured, already consistent, and already phrased in a way that developers and testers can act on. The human remains in the loop to validate, refine, and sign off.

### Connection to SE Lab Research

The Software Engineering Lab at Politeknik Negeri Malang lists **Requirements Automation** as one of its five core topics under the [Emerging Technologies in Software Engineering](https://se.polinema.ac.id/research/emerging-technologies-se/) research stream. This tutorial connects that research direction to practical, runnable tools you can use today.

### What You Will Build

By the end of this tutorial you will have:

- A PHP script that sends a feature description to an LLM API (OpenAI-compatible) and receives structured user stories back.
- A second script that validates and formats those stories into a traceability matrix.
- A clear understanding of when LLMs help with requirements, and when they hurt.

</section>

<section lang="id">

## Harga dari Kebutuhan yang Tidak Jelas

Rekayasa kebutuhan adalah tempat sebagian besar proyek perangkat lunak menang atau kalah. Laporan CHAOS dari Standish Group secara konsisten menunjukkan bahwa kebutuhan yang tidak lengkap atau ambigu termasuk di antara tiga penyebab utama kegagalan proyek, sejajar dengan keterlibatan pemangku kepentingan yang buruk dan perluasan cakupan. Mahasiswa di Politeknik Negeri Malang mengalami ini setiap semester: ringkasan proyek mengatakan "bangun portal mahasiswa," dan tiga minggu kemudian tim telah membangun hal yang sama sekali berbeda karena tidak ada yang mendefinisikan apa arti "portal."

Rekayasa kebutuhan tradisional bergantung pada wawancara, lokakarya, dan dokumentasi manual. Ini padat karya, rentan kesalahan, dan sering kali melewatkan langkah penting menulis kriteria penerimaan yang dapat diverifikasi. Kesenjangan antara apa yang dikatakan pemangku kepentingan dan apa yang dibangun pengembang diisi dengan asumsi. Asumsi adalah akar dari pengerjaan ulang.

**Otomatisasi kebutuhan berbasis AI** menggunakan model bahasa besar (LLM) dan alat pemrosesan bahasa alami (NLP) untuk menjembatani kesenjangan ini. Dengan memberikan bahasa pemangku kepentingan (catatan rapat, permintaan fitur, atau wawancara pengguna) ke LLM, kita dapat menghasilkan artefak kebutuhan yang terstruktur dan dapat diverifikasi: *user story*, potongan spesifikasi kebutuhan perangkat lunak (SRS), dan kriteria penerimaan yang dapat diuji.

Ini bukan tentang menggantikan *business analyst* atau *product owner*. Ini tentang memberi mereka draf pertama yang sudah terstruktur, sudah konsisten, dan sudah diformulasikan dengan cara yang dapat ditindaklanjuti oleh pengembang dan penguji. Manusia tetap dalam lingkaran untuk memvalidasi, menyempurnakan, dan menyetujui.

### Koneksi dengan Riset SE Lab

Software Engineering Lab di Politeknik Negeri Malang menempatkan **Requirements Automation** sebagai salah satu dari lima topik inti dalam alur riset [Emerging Technologies in Software Engineering](https://se.polinema.ac.id/research/emerging-technologies-se/). Tutorial ini menghubungkan arah riset tersebut ke alat praktis yang dapat dijalankan hari ini.

### Apa yang Akan Anda Bangun

Pada akhir tutorial ini Anda akan memiliki:

- Skrip PHP yang mengirim deskripsi fitur ke LLM API (kompatibel dengan OpenAI) dan menerima *user story* terstruktur sebagai balasannya.
- Skrip kedua yang memvalidasi dan memformat *story* tersebut menjadi matriks ketertelusuran.
- Pemahaman yang jelas tentang kapan LLM membantu dengan kebutuhan, dan kapan mereka merugikan.

</section>

---

<section lang="en">

## From Stakeholder Language to Structured Requirements

Before we automate anything, we need to understand the target output. What does "structured requirement" actually mean? There are three common formats taught in software engineering curricula and used in industry.

### User Stories

A user story captures a feature from the perspective of an end user, following the Connextra template:

> As a **[role]**, I want **[goal]** so that **[benefit]**.

**Example (unstructured stakeholder input):**

> "Students should be able to search for courses by semester and filter by lecturer. Also, they need to see how many seats are available."

**AI-generated user story:**

> As a **student**, I want **to search for courses by semester and filter by lecturer name** so that **I can find relevant classes quickly and plan my enrolment before seats fill up**.
>
> As a **student**, I want **to see the number of remaining seats for each course** so that **I can prioritise courses with limited availability**.

### Acceptance Criteria (Given-When-Then)

Acceptance criteria translate a user story into concrete, testable conditions using the Gherkin format:

> **Given** [precondition], **When** [action], **Then** [expected outcome].

**Example:**

> **Given** I am logged in as a student
> **When** I search for courses with semester "4" and lecturer "Dr. Sari"
> **Then** I see only courses matching semester 4 taught by Dr. Sari
> **And** each result displays the course code, title, schedule, and available seats.

### Software Requirements Specification (SRS) Snippets

An SRS snippet provides a functional requirement with an identifier, priority, and verifiable description, often following IEEE 830 structure.

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| FR-001 | The system shall allow students to filter courses by semester. | High | Test with semester values 1–8; verify correct course list. |
| FR-002 | The system shall display available seats per course, updated in real time. | Medium | Enrol a student and verify seat count decrements within 5 seconds. |

The key insight is that these three formats are **complementary**. The user story provides the why, the acceptance criteria provide the how-to-test, and the SRS snippet provides the traceable identifier. A good requirements automation pipeline produces all three from the same stakeholder input.

### Manual vs. AI-Assisted Workflow

| Aspect | Manual | AI-Assisted |
|---|---|---|
| Speed | Hours per feature | Minutes per feature (first draft) |
| Consistency | Varies by analyst | Uniform format |
| Completeness | Analysts forget edge cases | LLMs suggest edge cases from training data |
| Domain accuracy | High (human context) | Medium (needs verification) |
| Stakeholder buy-in | Interviews build trust | Automation can feel impersonal |
| Cost | Analyst salary | API costs (cents per request) |
| Audit trail | Manual traceability matrix | Auto-generated traceability |

The AI-assisted column is not unequivocally better, but it is faster for the first draft, which is the hardest and most time-consuming part.

</section>

<section lang="id">

## Dari Bahasa Pemangku Kepentingan ke Kebutuhan Terstruktur

Sebelum kita mengotomatiskan apa pun, kita perlu memahami output target. Apa sebenarnya arti "kebutuhan terstruktur"? Ada tiga format umum yang diajarkan dalam kurikulum rekayasa perangkat lunak dan digunakan dalam industri.

### User Story

*User story* menangkap fitur dari perspektif pengguna akhir, mengikuti template Connextra:

> Sebagai **[peran]**, saya ingin **[tujuan]** sehingga **[manfaat]**.

**Contoh (masukan pemangku kepentingan tidak terstruktur):**

> "Mahasiswa harus bisa mencari mata kuliah berdasarkan semester dan memfilter berdasarkan dosen. Juga, mereka perlu melihat berapa kursi yang tersedia."

**User story yang dihasilkan AI:**

> Sebagai **mahasiswa**, saya ingin **mencari mata kuliah berdasarkan semester dan memfilter berdasarkan nama dosen** sehingga **saya dapat menemukan kelas yang relevan dengan cepat dan merencanakan pendaftaran sebelum kursi habis**.
>
> Sebagai **mahasiswa**, saya ingin **melihat jumlah kursi yang tersisa untuk setiap mata kuliah** sehingga **saya dapat memprioritaskan mata kuliah dengan ketersediaan terbatas**.

### Kriteria Penerimaan (Given-When-Then)

Kriteria penerimaan menerjemahkan *user story* menjadi kondisi konkret yang dapat diuji menggunakan format Gherkin:

> **Given** [prasyarat], **When** [aksi], **Then** [hasil yang diharapkan].

**Contoh:**

> **Given** saya login sebagai mahasiswa
> **When** saya mencari mata kuliah dengan semester "4" dan dosen "Dr. Sari"
> **Then** saya hanya melihat mata kuliah yang cocok dengan semester 4 yang diajar oleh Dr. Sari
> **And** setiap hasil menampilkan kode mata kuliah, judul, jadwal, dan kursi tersedia.

### Potongan Spesifikasi Kebutuhan Perangkat Lunak (SRS)

Potongan SRS menyediakan kebutuhan fungsional dengan pengenal, prioritas, dan deskripsi yang dapat diverifikasi, sering mengikuti struktur IEEE 830.

| ID | Kebutuhan | Prioritas | Verifikasi |
|---|---|---|---|
| FR-001 | Sistem harus memungkinkan mahasiswa memfilter mata kuliah berdasarkan semester. | Tinggi | Uji dengan nilai semester 1–8; verifikasi daftar mata kuliah yang benar. |
| FR-002 | Sistem harus menampilkan kursi tersedia per mata kuliah, diperbarui secara real time. | Sedang | Daftarkan mahasiswa dan verifikasi jumlah kursi berkurang dalam 5 detik. |

Wawasan kuncinya adalah bahwa ketiga format ini **saling melengkapi**. *User story* memberikan *why*-nya, kriteria penerimaan memberikan cara mengujinya, dan potongan SRS memberikan pengenal yang dapat dilacak. *Pipeline* otomatisasi kebutuhan yang baik menghasilkan ketiganya dari masukan pemangku kepentingan yang sama.

### Alur Kerja Manual vs. Berbantuan AI

| Aspek | Manual | Berbantuan AI |
|---|---|---|
| Kecepatan | Jam per fitur | Menit per fitur (draf pertama) |
| Konsistensi | Bervariasi per analis | Format seragam |
| Kelengkapan | Analis melupakan *edge case* | LLM menyarankan *edge case* dari data pelatihan |
| Akurasi domain | Tinggi (konteks manusia) | Sedang (perlu verifikasi) |
| Keterlibatan pemangku kepentingan | Wawancara membangun kepercayaan | Otomatisasi bisa terasa impersonal |
| Biaya | Gaji analis | Biaya API (sen per permintaan) |
| Jejak audit | Matriks ketertelusuran manual | Ketertelusuran yang dihasilkan otomatis |

Kolom berbantuan AI tidak sepenuhnya lebih baik, tetapi lebih cepat untuk draf pertama, yang merupakan bagian tersulit dan paling memakan waktu.

</section>

---

<section lang="en">

## AI Tools for Requirements Automation

The tools landscape for requirements automation falls into three tiers. Choose based on your privacy requirements, budget, and infrastructure.

### Tier 1: Cloud LLM APIs (Easiest)

| Provider | Model | API Compatibility | Cost |
|---|---|---|---|
| OpenAI | GPT-4o, GPT-4o-mini | Native | \$2.50–\$15.00 / 1M tokens |
| Anthropic | Claude 3.5 Sonnet | OpenAI-compatible (via proxy) | \$3.00–\$15.00 / 1M tokens |
| Google | Gemini 1.5 Flash | Gemini API | \$0.075–\$0.30 / 1M tokens |
| Groq | Llama 3.1 70B | OpenAI-compatible | Free tier available |
| DeepSeek | DeepSeek-V3 | OpenAI-compatible | \$0.27–\$1.10 / 1M tokens |

For most student projects, **GPT-4o-mini** or **DeepSeek-V3** are the best cost-to-quality ratio. For research-grade requirements, **Claude 3.5 Sonnet** consistently produces the best-structured SRS output.

### Tier 2: Local LLMs (Privacy-First)

When you cannot send stakeholder data to a cloud API (e.g., internal Polinema projects, industry collaborations with NDAs), run a local model:

| Tool | Model | Hardware Requirement |
|---|---|---|
| **Ollama** | Llama 3.1 8B, Mistral 7B | 16 GB RAM, no GPU required |
| **LM Studio** | Phi-3, Qwen 2.5 | 8 GB RAM |
| **llama.cpp** | Any GGUF model | 8 GB RAM+ |

```bash
# Install Ollama and pull a model
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.1:8b

# Test the local API (OpenAI-compatible endpoint)
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.1:8b",
    "messages": [{"role": "user", "content": "Generate a user story for a course search feature."}]
  }'
```

Local models are free and private but produce lower-quality requirements than cloud models. For the exercises in this tutorial, use a cloud API first, then try the same prompts on a local model to compare.

### Tier 3: Specialised NLP Libraries (Programmatic)

For specific tasks like entity extraction from requirements documents, you may not need an LLM at all:

| Library | Language | Use Case |
|---|---|---|
| **PHP-ML** | PHP | Text classification, clustering |
| **Stanford CoreNLP** (via REST) | Java (PHP client) | Named entity recognition, constituency parsing |
| **spaCy** (via REST or CLI) | Python | Dependency parsing, NER, rule-based matching |

These are useful for post-processing LLM output: for example, extracting all `<Actor>` mentions from generated user stories or detecting inconsistent terminology across requirements.

</section>

<section lang="id">

## Alat AI untuk Otomatisasi Kebutuhan

Lanskap alat untuk otomatisasi kebutuhan terbagi dalam tiga tingkatan. Pilih berdasarkan kebutuhan privasi, anggaran, dan infrastruktur Anda.

### Tingkat 1: Cloud LLM API (Termudah)

| Penyedia | Model | Kompatibilitas API | Biaya |
|---|---|---|---|
| OpenAI | GPT-4o, GPT-4o-mini | Native | \$2.50–\$15.00 / 1M token |
| Anthropic | Claude 3.5 Sonnet | Kompatibel OpenAI (via proxy) | \$3.00–\$15.00 / 1M token |
| Google | Gemini 1.5 Flash | Gemini API | \$0.075–\$0.30 / 1M token |
| Groq | Llama 3.1 70B | Kompatibel OpenAI | Tersedia tier gratis |
| DeepSeek | DeepSeek-V3 | Kompatibel OpenAI | \$0.27–\$1.10 / 1M token |

Untuk sebagian besar proyek mahasiswa, **GPT-4o-mini** atau **DeepSeek-V3** adalah rasio biaya-ke-kualitas terbaik. Untuk kebutuhan tingkat riset, **Claude 3.5 Sonnet** secara konsisten menghasilkan output SRS dengan struktur terbaik.

### Tingkat 2: LLM Lokal (Privasi Utama)

Ketika Anda tidak dapat mengirim data pemangku kepentingan ke API cloud (mis., proyek internal Polinema, kolaborasi industri dengan NDA), jalankan model lokal:

| Alat | Model | Kebutuhan Perangkat Keras |
|---|---|---|
| **Ollama** | Llama 3.1 8B, Mistral 7B | 16 GB RAM, tidak perlu GPU |
| **LM Studio** | Phi-3, Qwen 2.5 | 8 GB RAM |
| **llama.cpp** | Model GGUF apa pun | 8 GB RAM+ |

```bash
# Instal Ollama dan tarik model
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.1:8b

# Uji API lokal (endpoint kompatibel OpenAI)
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.1:8b",
    "messages": [{"role": "user", "content": "Buat user story untuk fitur pencarian mata kuliah."}]
  }'
```

Model lokal gratis dan privat tetapi menghasilkan kebutuhan dengan kualitas lebih rendah daripada model cloud. Untuk latihan dalam tutorial ini, gunakan API cloud terlebih dahulu, lalu coba *prompt* yang sama pada model lokal untuk membandingkan.

### Tingkat 3: Library NLP Khusus (Programatik)

Untuk tugas spesifik seperti ekstraksi entitas dari dokumen kebutuhan, Anda mungkin tidak memerlukan LLM sama sekali:

| Library | Bahasa | Kasus Penggunaan |
|---|---|---|
| **PHP-ML** | PHP | Klasifikasi teks, *clustering* |
| **Stanford CoreNLP** (via REST) | Java (klien PHP) | Pengenalan entitas bernama, *constituency parsing* |
| **spaCy** (via REST atau CLI) | Python | *Dependency parsing*, NER, *rule-based matching* |

Ini berguna untuk pasca-pemrosesan output LLM, misalnya, mengekstrak semua penyebutan `<Actor>` dari *user story* yang dihasilkan atau mendeteksi terminologi yang tidak konsisten di seluruh kebutuhan.

</section>

---

<section lang="en">

## Prompt Engineering for Requirements

The quality of LLM-generated requirements depends almost entirely on the quality of your prompt. A vague prompt produces vague output. A well-structured prompt with explicit format constraints, examples, and a role assignment produces output that needs minimal editing.

### Anatomy of a Good Requirements Prompt

A strong prompt has five components:

1. **Role assignment**: Tell the model who it is.
2. **Context**: Provide domain-specific background.
3. **Task description**: What to produce and in what format.
4. **Output constraints**: Structure, length, identifiers.
5. **Examples (few-shot)**: Show one ideal output so the model copies the pattern.

```text
You are a senior business analyst at a software engineering firm. You specialise
in converting stakeholder feature requests into IEEE 830-compliant software
requirements specifications (SRS) for PHP/Laravel web applications.

## Context
The system is a university course enrolment portal built with Laravel 11 and
MySQL. Students browse courses, check seat availability, enrol in courses, and
view their schedules. Lecturers manage course listings and view enrolment reports.

## Task
Read the stakeholder feature request below and produce:

1. One or more user stories in the format:
   "As a [role], I want [feature] so that [benefit]"

2. Acceptance criteria in Gherkin Given-When-Then format.

3. A table of functional requirements with columns: ID (FR-XXX), Requirement,
   Priority (High/Medium/Low), Verification Method.

## Output Format
Return JSON with keys: "user_stories", "acceptance_criteria", "functional_requirements".

## Stakeholder Feature Request
{FEATURE_DESCRIPTION}
```

The `{FEATURE_DESCRIPTION}` placeholder is where you inject the raw stakeholder text. The `Return JSON` constraint is critical: structured output makes downstream processing in PHP trivial.

### PHP Helper to Call an LLM API

Below is a reusable PHP script that sends a prompt to any OpenAI-compatible API and returns the parsed JSON response. Save it as `generate-requirements.php`.

```php
<?php
// generate-requirements.php: Send a feature description to an LLM API
// and receive structured requirements (user stories, acceptance criteria, SRS).

function generateRequirements(string $featureDescription, string $apiKey): array
{
    $prompt = <<<PROMPT
You are a senior business analyst at a software engineering firm.
Convert the following stakeholder feature request into structured requirements.

## Output (JSON only, no markdown)
{
  "user_stories": [
    "As a [role], I want [feature] so that [benefit]"
  ],
  "acceptance_criteria": [
    "Given [precondition], When [action], Then [outcome]"
  ],
  "functional_requirements": [
    { "id": "FR-001", "requirement": "...", "priority": "High|Medium|Low", "verification": "..." }
  ]
}

## Stakeholder Feature Request
{$featureDescription}
PROMPT;

    $ch = curl_init('https://api.openai.com/v1/chat/completions');

    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $apiKey,
        ],
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode([
            'model'    => 'gpt-4o-mini',
            'messages' => [['role' => 'user', 'content' => $prompt]],
            'temperature' => 0.3,  // Low temperature for consistent, factual output
        ]),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 60,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        throw new RuntimeException('cURL error: ' . curl_error($ch));
    }

    curl_close($ch);

    if ($httpCode !== 200) {
        throw new RuntimeException("API returned HTTP {$httpCode}: {$response}");
    }

    $body = json_decode($response, true);
    $content = $body['choices'][0]['message']['content'] ?? '';

    // Strip markdown code fences if the model wrapped JSON in ```json ... ```
    $content = preg_replace('/^```(?:json)?\s*\n?/', '', $content);
    $content = preg_replace('/\n?```\s*$/', '', $content);

    $structured = json_decode(trim($content), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new RuntimeException('Failed to parse LLM response as JSON: ' . json_last_error_msg());
    }

    return $structured;
}

// --- Usage ---
if (php_sapi_name() === 'cli') {
    $apiKey = getenv('OPENAI_API_KEY');
    if (!$apiKey) {
        fwrite(STDERR, "Error: Set the OPENAI_API_KEY environment variable.\n");
        exit(1);
    }

    $feature = $argv[1] ?? 'Students should be able to register for courses online.';

    try {
        $requirements = generateRequirements($feature, $apiKey);

        echo json_encode($requirements, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
        echo "\nGenerated " . count($requirements['user_stories'] ?? [])
           . " user stories, "
           . count($requirements['acceptance_criteria'] ?? [])
           . " acceptance criteria, "
           . count($requirements['functional_requirements'] ?? [])
           . " functional requirements.\n";

    } catch (RuntimeException $e) {
        fwrite(STDERR, "Error: " . $e->getMessage() . "\n");
        exit(1);
    }
}
```

### Key Design Decisions

- **`temperature: 0.3`**: Lower temperature means more deterministic, less creative output. Requirements should be precise, not poetic.
- **`gpt-4o-mini`**: Cost-effective for ~5,000-token prompts. For mission-critical SRS, swap to `gpt-4o`.
- **JSON-only output**: We explicitly ask for JSON and strip markdown fences, making the response parseable by `json_decode()`.
- **Environment variable for API key**: Never hardcode secrets.

### Running It

```bash
export OPENAI_API_KEY="sk-your-key-here"
php generate-requirements.php "Students should be able to search for courses by semester and filter by lecturer name. They also need to see how many seats are available per course."
```

Example output:

```json
{
  "user_stories": [
    "As a student, I want to search for courses by semester so that I can find classes relevant to my academic level.",
    "As a student, I want to filter search results by lecturer name so that I can quickly find courses taught by a specific instructor.",
    "As a student, I want to see the number of available seats per course so that I can prioritise which courses to enrol in before they fill up."
  ],
  "acceptance_criteria": [
    "Given I am on the course search page, When I select semester '4' from the dropdown, Then only courses offered in semester 4 are displayed.",
    "Given I have filtered courses by semester, When I type 'Dr. Sari' in the lecturer filter, Then only courses taught by Dr. Sari are shown.",
    "Given I am viewing search results, When the page loads, Then each course card displays the remaining seat count."
  ],
  "functional_requirements": [
    {
      "id": "FR-001",
      "requirement": "The system shall provide a semester dropdown filter with values 1 through 8 on the course search page.",
      "priority": "High",
      "verification": "Manually select each semester; verify correct courses are returned for each."
    },
    {
      "id": "FR-002",
      "requirement": "The system shall provide a text input to filter search results by lecturer name using a case-insensitive partial match.",
      "priority": "Medium",
      "verification": "Enter partial names ('Sari', 'sari'); verify matching courses appear."
    },
    {
      "id": "FR-003",
      "requirement": "The system shall display the count of remaining seats (total capacity minus enrolled students) for each course in the search results view.",
      "priority": "High",
      "verification": "Compare displayed count against database query; verify it decrements after enrolment."
    }
  ]
}
```

Each output is a draft. You, the human, decide whether the priorities are correct, whether edge cases are covered, and whether the terminology matches your domain glossary.

</section>

<section lang="id">

## Prompt Engineering untuk Kebutuhan

Kualitas kebutuhan yang dihasilkan LLM hampir sepenuhnya bergantung pada kualitas *prompt* Anda. *Prompt* yang samar menghasilkan output yang samar. *Prompt* yang terstruktur dengan baik dengan batasan format eksplisit, contoh, dan penetapan peran menghasilkan output yang membutuhkan pengeditan minimal.

### Anatomi Prompt Kebutuhan yang Baik

*Prompt* yang kuat memiliki lima komponen:

1. **Penetapan peran**: beri tahu model siapa dia.
2. **Konteks**: berikan latar belakang spesifik domain.
3. **Deskripsi tugas**: apa yang harus dihasilkan dan dalam format apa.
4. **Batasan output**: struktur, panjang, pengenal.
5. **Contoh (few-shot)**: tunjukkan satu output ideal sehingga model menyalin polanya.

```text
Anda adalah business analyst senior di sebuah firma rekayasa perangkat lunak.
Anda mengkhususkan diri dalam mengonversi permintaan fitur pemangku kepentingan
menjadi spesifikasi kebutuhan perangkat lunak (SRS) yang sesuai dengan IEEE 830
untuk aplikasi web PHP/Laravel.

## Konteks
Sistem adalah portal pendaftaran mata kuliah universitas yang dibangun dengan
Laravel 11 dan MySQL. Mahasiswa menelusuri mata kuliah, memeriksa ketersediaan
kursi, mendaftar mata kuliah, dan melihat jadwal mereka. Dosen mengelola daftar
mata kuliah dan melihat laporan pendaftaran.

## Tugas
Baca permintaan fitur pemangku kepentingan di bawah ini dan hasilkan:

1. Satu atau lebih user story dalam format:
   "Sebagai [peran], saya ingin [fitur] sehingga [manfaat]"

2. Kriteria penerimaan dalam format Gherkin Given-When-Then.

3. Tabel kebutuhan fungsional dengan kolom: ID (FR-XXX), Kebutuhan,
   Prioritas (Tinggi/Sedang/Rendah), Metode Verifikasi.

## Format Output
Kembalikan JSON dengan kunci: "user_stories", "acceptance_criteria", "functional_requirements".

## Permintaan Fitur Pemangku Kepentingan
{DESKRIPSI_FITUR}
```

### PHP Helper untuk Memanggil LLM API

Berikut adalah skrip PHP yang dapat digunakan kembali yang mengirim *prompt* ke API yang kompatibel dengan OpenAI dan mengembalikan respons JSON yang telah di-parsing. Simpan sebagai `generate-requirements.php`.

```php
<?php
// generate-requirements.php: Kirim deskripsi fitur ke LLM API
// dan terima kebutuhan terstruktur (user story, kriteria penerimaan, SRS).

function generateRequirements(string $featureDescription, string $apiKey): array
{
    $prompt = <<<PROMPT
Anda adalah business analyst senior di sebuah firma rekayasa perangkat lunak.
Konversikan permintaan fitur pemangku kepentingan berikut menjadi kebutuhan terstruktur.

## Output (hanya JSON, tanpa markdown)
{
  "user_stories": [
    "Sebagai [peran], saya ingin [fitur] sehingga [manfaat]"
  ],
  "acceptance_criteria": [
    "Given [prasyarat], When [aksi], Then [hasil]"
  ],
  "functional_requirements": [
    { "id": "FR-001", "requirement": "...", "priority": "Tinggi|Sedang|Rendah", "verification": "..." }
  ]
}

## Permintaan Fitur Pemangku Kepentingan
{$featureDescription}
PROMPT;

    $ch = curl_init('https://api.openai.com/v1/chat/completions');

    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $apiKey,
        ],
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode([
            'model'    => 'gpt-4o-mini',
            'messages' => [['role' => 'user', 'content' => $prompt]],
            'temperature' => 0.3,
        ]),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 60,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        throw new RuntimeException('cURL error: ' . curl_error($ch));
    }

    curl_close($ch);

    if ($httpCode !== 200) {
        throw new RuntimeException("API mengembalikan HTTP {$httpCode}: {$response}");
    }

    $body = json_decode($response, true);
    $content = $body['choices'][0]['message']['content'] ?? '';

    $content = preg_replace('/^```(?:json)?\s*\n?/', '', $content);
    $content = preg_replace('/\n?```\s*$/', '', $content);

    $structured = json_decode(trim($content), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new RuntimeException('Gagal memparsing respons LLM sebagai JSON: ' . json_last_error_msg());
    }

    return $structured;
}

// --- Penggunaan ---
if (php_sapi_name() === 'cli') {
    $apiKey = getenv('OPENAI_API_KEY');
    if (!$apiKey) {
        fwrite(STDERR, "Error: Setel variabel lingkungan OPENAI_API_KEY.\n");
        exit(1);
    }

    $feature = $argv[1] ?? 'Mahasiswa harus bisa mendaftar mata kuliah secara online.';

    try {
        $requirements = generateRequirements($feature, $apiKey);

        echo json_encode($requirements, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
        echo "\nDihasilkan " . count($requirements['user_stories'] ?? [])
           . " user story, "
           . count($requirements['acceptance_criteria'] ?? [])
           . " kriteria penerimaan, "
           . count($requirements['functional_requirements'] ?? [])
           . " kebutuhan fungsional.\n";

    } catch (RuntimeException $e) {
        fwrite(STDERR, "Error: " . $e->getMessage() . "\n");
        exit(1);
    }
}
```

### Keputusan Desain Kunci

- **`temperature: 0.3`**: suhu lebih rendah berarti output lebih deterministik, kurang kreatif. Kebutuhan harus presisi, bukan puitis.
- **`gpt-4o-mini`**: hemat biaya untuk *prompt* ~5.000 token. Untuk SRS misi-kritis, ganti ke `gpt-4o`.
- **Output JSON saja**: kami secara eksplisit meminta JSON dan menghapus markdown fences, membuat respons dapat di-parsing oleh `json_decode()`.
- **Variabel lingkungan untuk API key**: jangan pernah *hardcode* rahasia.

### Menjalankannya

```bash
export OPENAI_API_KEY="sk-your-key-here"
php generate-requirements.php "Mahasiswa harus bisa mencari mata kuliah berdasarkan semester dan memfilter berdasarkan nama dosen. Mereka juga perlu melihat berapa kursi yang tersedia per mata kuliah."
```

Setiap output adalah draf. Anda, sebagai manusia, memutuskan apakah prioritasnya benar, apakah *edge case* tercakup, dan apakah terminologinya cocok dengan glosarium domain Anda.

</section>

---

<section lang="en">

## A Hands-On PHP Exercise

Let us build a small pipeline: stakeholder text in, traceability matrix out. You will need PHP 8.1+ with the `curl` extension and an OpenAI-compatible API key.

### Step 1: Generate Requirements

Use the `generateRequirements()` function from the previous section. Run it against a real feature description.

Create a file `feature.txt`:

```text
The library system needs a way for students to borrow and return books.
Students should be able to search the catalogue by title, author, or ISBN.
Each book has a maximum loan period of 14 days. When a book is overdue,
the system should calculate a fine of Rp 1,000 per day. Students cannot
borrow more than 3 books at a time. Librarians can add new books to the
catalogue and mark books as lost or damaged.
```

Run the script:

```bash
php generate-requirements.php "$(cat feature.txt)" > requirements.json
```

### Step 2: Validate and Build a Traceability Matrix

Now we validate the output and build a traceability matrix that links each functional requirement to its user story and acceptance criteria. Create `validate-and-trace.php`:

```php
<?php
// validate-and-trace.php: Validate LLM-generated requirements
// and produce a traceability matrix in CSV or Markdown.

function validateRequirements(array $data): array
{
    $warnings = [];

    if (empty($data['user_stories'])) {
        $warnings[] = 'No user stories generated.';
    }

    if (empty($data['acceptance_criteria'])) {
        $warnings[] = 'No acceptance criteria generated.';
    }

    if (empty($data['functional_requirements'])) {
        $warnings[] = 'No functional requirements generated.';
    }

    foreach ($data['functional_requirements'] as $i => $fr) {
        if (empty($fr['id'])) {
            $warnings[] = "FR at index {$i} is missing an ID.";
        }
        if (empty($fr['requirement'])) {
            $warnings[] = ($fr['id'] ?? "Index {$i}") . " is missing the requirement text.";
        }
        if (!in_array($fr['priority'] ?? '', ['High', 'Medium', 'Low'])) {
            $warnings[] = ($fr['id'] ?? "Index {$i}") . " has an invalid priority: '{$fr['priority']}'.";
        }
    }

    // Check for duplicate IDs
    $ids = array_column($data['functional_requirements'], 'id');
    $dupes = array_diff_assoc($ids, array_unique($ids));
    foreach ($dupes as $i => $id) {
        $warnings[] = "Duplicate requirement ID: {$id}.";
    }

    return $warnings;
}

function buildTraceabilityMatrix(array $data): string
{
    $rows = [];
    $rows[] = '| FR ID | Requirement | User Story | Acceptance Criteria | Priority |';
    $rows[] = '|---|---|---|---|---|';

    $numFRs = count($data['functional_requirements']);
    $numUSs = count($data['user_stories']);
    $numACs = count($data['acceptance_criteria']);

    foreach ($data['functional_requirements'] as $i => $fr) {
        // Map FR to the closest user story and acceptance criteria by index
        $usIdx = min($i, $numUSs - 1);
        $acIdx = min($i, $numACs - 1);

        $us = $data['user_stories'][$usIdx] ?? 'N/A';
        $ac = $data['acceptance_criteria'][$acIdx] ?? 'N/A';

        $rows[] = sprintf(
            '| %s | %s | %s | %s | %s |',
            $fr['id'] ?? 'FR-???',
            $fr['requirement'] ?? 'N/A',
            $us,
            $ac,
            $fr['priority'] ?? 'N/A'
        );
    }

    return implode("\n", $rows);
}

// --- CLI entry point ---
if (php_sapi_name() === 'cli') {
    $inputFile = $argv[1] ?? 'requirements.json';

    if (!file_exists($inputFile)) {
        fwrite(STDERR, "Error: File not found: {$inputFile}\n");
        exit(1);
    }

    $data = json_decode(file_get_contents($inputFile), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        fwrite(STDERR, "Error: Invalid JSON in {$inputFile}\n");
        exit(1);
    }

    $warnings = validateRequirements($data);

    if ($warnings) {
        echo "--- Validation Warnings ---\n";
        foreach ($warnings as $w) {
            echo "⚠  {$w}\n";
        }
        echo "\n";
    } else {
        echo "--- Validation Passed ---\n\n";
    }

    echo buildTraceabilityMatrix($data) . "\n";
}
```

### Step 3: Run the Full Pipeline

```bash
# Generate requirements
php generate-requirements.php "$(cat feature.txt)" > requirements.json

# Validate and build traceability matrix
php validate-and-trace.php requirements.json > traceability.md
```

Example traceability matrix output (Markdown table):

| FR ID | Requirement | User Story | Acceptance Criteria | Priority |
|---|---|---|---|---|
| FR-001 | The system shall allow students to search the catalogue by title, author, or ISBN. | As a student, I want to search the catalogue... | Given I am on the search page, When I enter an ISBN... | High |
| FR-002 | The system shall enforce a maximum loan period of 14 days per book. | As a librarian, I want the system to track loan periods... | Given a book is loaned, When 14 days elapse... | High |
| FR-003 | The system shall calculate a fine of Rp 1,000 per day for overdue books. | As a librarian, I want the system to calculate fines... | Given a book is 3 days overdue, When I view the fine... | Medium |
| FR-004 | The system shall prevent students from borrowing more than 3 books simultaneously. | As a student, I want clear borrowing limits... | Given a student has 3 active loans, When they attempt to borrow... | High |
| FR-005 | The system shall allow librarians to add new books and mark books as lost or damaged. | As a librarian, I want to manage the catalogue... | Given I am logged in as a librarian, When I add a new book... | Medium |

### Exercise for the Reader

Modify `generate-requirements.php` to:
1. Accept a `--model` flag to switch between `gpt-4o` and `gpt-4o-mini`.
2. Add a `--local` flag that points to `http://localhost:11434/v1` (Ollama endpoint).
3. Save all generated requirements to a SQLite database with a `created_at` timestamp.

</section>

<section lang="id">

## Latihan PHP Praktis

Mari kita bangun *pipeline* kecil: teks pemangku kepentingan masuk, matriks ketertelusuran keluar. Anda memerlukan PHP 8.1+ dengan ekstensi `curl` dan kunci API yang kompatibel dengan OpenAI.

### Langkah 1: Hasilkan Kebutuhan

Gunakan fungsi `generateRequirements()` dari bagian sebelumnya. Jalankan terhadap deskripsi fitur nyata.

Buat file `feature.txt`:

```text
Sistem perpustakaan membutuhkan cara bagi mahasiswa untuk meminjam dan
mengembalikan buku. Mahasiswa harus dapat mencari katalog berdasarkan judul,
pengarang, atau ISBN. Setiap buku memiliki periode pinjaman maksimum 14 hari.
Ketika buku terlambat, sistem harus menghitung denda Rp 1.000 per hari.
Mahasiswa tidak dapat meminjam lebih dari 3 buku sekaligus. Pustakawan dapat
menambahkan buku baru ke katalog dan menandai buku sebagai hilang atau rusak.
```

Jalankan skrip:

```bash
php generate-requirements.php "$(cat feature.txt)" > requirements.json
```

### Langkah 2: Validasi dan Bangun Matriks Ketertelusuran

Sekarang kita memvalidasi output dan membangun matriks ketertelusuran yang menghubungkan setiap kebutuhan fungsional ke *user story* dan kriteria penerimaannya. Buat `validate-and-trace.php`:

```php
<?php
// validate-and-trace.php: Validasi kebutuhan yang dihasilkan LLM
// dan hasilkan matriks ketertelusuran dalam CSV atau Markdown.

function validateRequirements(array $data): array
{
    $warnings = [];

    if (empty($data['user_stories'])) {
        $warnings[] = 'Tidak ada user story yang dihasilkan.';
    }

    if (empty($data['acceptance_criteria'])) {
        $warnings[] = 'Tidak ada kriteria penerimaan yang dihasilkan.';
    }

    if (empty($data['functional_requirements'])) {
        $warnings[] = 'Tidak ada kebutuhan fungsional yang dihasilkan.';
    }

    foreach ($data['functional_requirements'] as $i => $fr) {
        if (empty($fr['id'])) {
            $warnings[] = "FR pada indeks {$i} tidak memiliki ID.";
        }
        if (empty($fr['requirement'])) {
            $warnings[] = ($fr['id'] ?? "Indeks {$i}") . " tidak memiliki teks kebutuhan.";
        }
        if (!in_array($fr['priority'] ?? '', ['High', 'Medium', 'Low'])) {
            $warnings[] = ($fr['id'] ?? "Indeks {$i}") . " memiliki prioritas tidak valid: '{$fr['priority']}'.";
        }
    }

    $ids = array_column($data['functional_requirements'], 'id');
    $dupes = array_diff_assoc($ids, array_unique($ids));
    foreach ($dupes as $i => $id) {
        $warnings[] = "ID kebutuhan duplikat: {$id}.";
    }

    return $warnings;
}

function buildTraceabilityMatrix(array $data): string
{
    $rows = [];
    $rows[] = '| FR ID | Kebutuhan | User Story | Kriteria Penerimaan | Prioritas |';
    $rows[] = '|---|---|---|---|---|';

    $numFRs = count($data['functional_requirements']);
    $numUSs = count($data['user_stories']);
    $numACs = count($data['acceptance_criteria']);

    foreach ($data['functional_requirements'] as $i => $fr) {
        $usIdx = min($i, $numUSs - 1);
        $acIdx = min($i, $numACs - 1);

        $us = $data['user_stories'][$usIdx] ?? 'N/A';
        $ac = $data['acceptance_criteria'][$acIdx] ?? 'N/A';

        $rows[] = sprintf(
            '| %s | %s | %s | %s | %s |',
            $fr['id'] ?? 'FR-???',
            $fr['requirement'] ?? 'N/A',
            $us,
            $ac,
            $fr['priority'] ?? 'N/A'
        );
    }

    return implode("\n", $rows);
}

// --- CLI entry point ---
if (php_sapi_name() === 'cli') {
    $inputFile = $argv[1] ?? 'requirements.json';

    if (!file_exists($inputFile)) {
        fwrite(STDERR, "Error: File tidak ditemukan: {$inputFile}\n");
        exit(1);
    }

    $data = json_decode(file_get_contents($inputFile), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        fwrite(STDERR, "Error: JSON tidak valid di {$inputFile}\n");
        exit(1);
    }

    $warnings = validateRequirements($data);

    if ($warnings) {
        echo "--- Peringatan Validasi ---\n";
        foreach ($warnings as $w) {
            echo "⚠  {$w}\n";
        }
        echo "\n";
    } else {
        echo "--- Validasi Lulus ---\n\n";
    }

    echo buildTraceabilityMatrix($data) . "\n";
}
```

### Langkah 3: Jalankan Pipeline Lengkap

```bash
# Hasilkan kebutuhan
php generate-requirements.php "$(cat feature.txt)" > requirements.json

# Validasi dan bangun matriks ketertelusuran
php validate-and-trace.php requirements.json > traceability.md
```

Contoh keluaran matriks ketertelusuran (tabel Markdown):

| FR ID | Kebutuhan | User Story | Kriteria Penerimaan | Prioritas |
|---|---|---|---|---|
| FR-001 | Sistem harus memungkinkan mahasiswa mencari katalog berdasarkan judul, pengarang, atau ISBN. | Sebagai mahasiswa, saya ingin mencari katalog... | **Given** saya berada di halaman pencarian, **When** saya memasukkan ISBN... | High |
| FR-002 | Sistem harus menegakkan periode pinjaman maksimum 14 hari per buku. | Sebagai pustakawan, saya ingin sistem melacak periode pinjaman... | **Given** sebuah buku dipinjam, **When** 14 hari berlalu... | High |
| FR-003 | Sistem harus menghitung denda Rp 1.000 per hari untuk buku yang terlambat. | Sebagai pustakawan, saya ingin sistem menghitung denda... | **Given** sebuah buku terlambat 3 hari, **When** saya melihat dendanya... | Medium |
| FR-004 | Sistem harus mencegah mahasiswa meminjam lebih dari 3 buku sekaligus. | Sebagai mahasiswa, saya ingin batas peminjaman yang jelas... | **Given** seorang mahasiswa memiliki 3 pinjaman aktif, **When** mereka mencoba meminjam... | High |
| FR-005 | Sistem harus memungkinkan pustakawan menambahkan buku baru dan menandai buku sebagai hilang atau rusak. | Sebagai pustakawan, saya ingin mengelola katalog... | **Given** saya masuk sebagai pustakawan, **When** saya menambahkan buku baru... | Medium |

### Latihan untuk Pembaca

Modifikasi `generate-requirements.php` untuk:
1. Menerima *flag* `--model` untuk beralih antara `gpt-4o` dan `gpt-4o-mini`.
2. Menambahkan *flag* `--local` yang mengarah ke `http://localhost:11434/v1` (*endpoint* Ollama).
3. Menyimpan semua kebutuhan yang dihasilkan ke *database* SQLite dengan *timestamp* `created_at`.

</section>

---

<section lang="en">

## Traceability and Verification

Generating requirements is only half the battle. The real value comes from **traceability**: the ability to link each requirement to the code that implements it and the tests that verify it.

### Why Traceability Matters

- **Change impact analysis.** When a stakeholder changes a requirement, traceability tells you exactly which modules and tests are affected.
- **Coverage auditing.** You can prove that every functional requirement has at least one corresponding test.
- **Regulatory compliance.** Standards like ISO 26262 (automotive) and DO-178C (aerospace) mandate requirements-to-test traceability.
- **Student project grading.** An assessor can trace from a stakeholder need through a user story to code and tests.

### Building a Traceability Matrix

In the previous exercise, we built a basic matrix that linked FRs to user stories and acceptance criteria. In a real Laravel project, you can extend this with database-backed traceability. Create a migration:

```php
// database/migrations/xxxx_create_requirements_table.php
Schema::create('requirements', function (Blueprint $table) {
    $table->id();
    $table->string('fr_id')->unique();        // e.g., FR-001
    $table->text('description');
    $table->enum('priority', ['High', 'Medium', 'Low']);
    $table->string('source');                  // 'manual' or 'ai-generated'
    $table->foreignId('user_story_id')->nullable()->constrained('user_stories');
    $table->timestamps();
});

Schema::create('requirement_test_links', function (Blueprint $table) {
    $table->id();
    $table->foreignId('requirement_id')->constrained('requirements');
    $table->string('test_class');              // e.g., CourseSearchTest
    $table->string('test_method');             // e.g., test_filter_by_semester
    $table->timestamp('last_verified_at')->nullable();
    $table->timestamps();
});
```

And a Laravel Artisan command that imports AI-generated requirements:

```php
// app/Console/Commands/ImportRequirements.php
class ImportRequirements extends Command
{
    protected $signature = 'requirements:import {file : Path to requirements JSON}';

    public function handle()
    {
        $data = json_decode(file_get_contents($this->argument('file')), true);

        foreach ($data['functional_requirements'] as $fr) {
            \App\Models\Requirement::updateOrCreate(
                ['fr_id' => $fr['id']],
                [
                    'description' => $fr['requirement'],
                    'priority'    => $fr['priority'],
                    'source'      => 'ai-generated',
                ]
            );
        }

        $this->info('Imported ' . count($data['functional_requirements']) . ' requirements.');
    }
}
```

Run it:

```bash
php artisan requirements:import requirements.json
```

### Linking Tests to Requirements

PHPUnit supports the `@covers` annotation, but you can also use custom attributes:

```php
#[Requirement('FR-001')]
#[Requirement('FR-003')]
public function test_course_search_by_semester(): void
{
    // Test that the semester filter returns correct courses
}
```

A CI script can parse these attributes, query the database, and verify:
1. Every FR has at least one test linked.
2. Every test links to at least one FR.
3. No FR has gone more than 30 days without a test verification.

```php
// Verify test coverage for all requirements
$uncovered = Requirement::doesntHave('testLinks')->get();
foreach ($uncovered as $req) {
    echo "No test covers {$req->fr_id}: {$req->description}\n";
}
```

This closes the loop: requirements → code → tests → verification report.

</section>

<section lang="id">

## Ketertelusuran dan Verifikasi

Menghasilkan kebutuhan hanyalah setengah dari pertempuran. Nilai sesungguhnya datang dari **ketertelusuran**: kemampuan untuk menghubungkan setiap kebutuhan ke kode yang mengimplementasikannya dan pengujian yang memverifikasinya.

### Mengapa Ketertelusuran Penting

- **Analisis dampak perubahan.** Ketika pemangku kepentingan mengubah kebutuhan, ketertelusuran memberi tahu Anda modul dan pengujian mana yang terpengaruh.
- **Audit cakupan.** Anda dapat membuktikan bahwa setiap kebutuhan fungsional memiliki setidaknya satu pengujian yang sesuai.
- **Kepatuhan regulasi.** Standar seperti ISO 26262 (otomotif) dan DO-178C (kedirgantaraan) mewajibkan ketertelusuran kebutuhan-ke-pengujian.
- **Penilaian proyek mahasiswa.** Penilai dapat menelusuri dari kebutuhan pemangku kepentingan melalui *user story* ke kode dan pengujian.

### Membangun Matriks Ketertelusuran

Dalam latihan sebelumnya, kita membangun matriks dasar yang menghubungkan FR ke *user story* dan kriteria penerimaan. Dalam proyek Laravel nyata, Anda dapat memperluas ini dengan ketertelusuran berbasis *database*. Buat migrasi:

```php
// database/migrations/xxxx_create_requirements_table.php
Schema::create('requirements', function (Blueprint $table) {
    $table->id();
    $table->string('fr_id')->unique();        // mis., FR-001
    $table->text('description');
    $table->enum('priority', ['High', 'Medium', 'Low']);
    $table->string('source');                  // 'manual' atau 'ai-generated'
    $table->foreignId('user_story_id')->nullable()->constrained('user_stories');
    $table->timestamps();
});

Schema::create('requirement_test_links', function (Blueprint $table) {
    $table->id();
    $table->foreignId('requirement_id')->constrained('requirements');
    $table->string('test_class');              // mis., CourseSearchTest
    $table->string('test_method');             // mis., test_filter_by_semester
    $table->timestamp('last_verified_at')->nullable();
    $table->timestamps();
});
```

Berikut perintah Artisan Laravel yang mengimpor kebutuhan hasil AI:

```php
// app/Console/Commands/ImportRequirements.php
class ImportRequirements extends Command
{
    protected $signature = 'requirements:import {file : Path ke JSON kebutuhan}';

    public function handle()
    {
        $data = json_decode(file_get_contents($this->argument('file')), true);

        foreach ($data['functional_requirements'] as $fr) {
            \App\Models\Requirement::updateOrCreate(
                ['fr_id' => $fr['id']],
                [
                    'description' => $fr['requirement'],
                    'priority'    => $fr['priority'],
                    'source'      => 'ai-generated',
                ]
            );
        }

        $this->info('Diimpor ' . count($data['functional_requirements']) . ' kebutuhan.');
    }
}
```

Jalankan:

```bash
php artisan requirements:import requirements.json
```

### Menghubungkan Pengujian dengan Kebutuhan

PHPUnit mendukung anotasi `@covers`, tetapi Anda juga dapat menggunakan atribut kustom:

```php
#[Requirement('FR-001')]
#[Requirement('FR-003')]
public function test_course_search_by_semester(): void
{
    // Uji bahwa filter semester mengembalikan mata kuliah yang benar
}
```

Skrip CI dapat mengurai atribut ini, melakukan *query* pada *database*, dan memverifikasi:
1. Setiap FR memiliki setidaknya satu pengujian yang tertaut.
2. Setiap pengujian tertaut ke setidaknya satu FR.
3. Tidak ada FR yang lebih dari 30 hari tanpa verifikasi pengujian.

```php
// Verifikasi cakupan pengujian untuk semua kebutuhan
$uncovered = Requirement::doesntHave('testLinks')->get();
foreach ($uncovered as $req) {
    echo "Tidak ada pengujian yang mencakup {$req->fr_id}: {$req->description}\n";
}
```

Ini menutup loop: kebutuhan → kode → pengujian → laporan verifikasi.

</section>

---

<section lang="en">

## Limitations and Best Practices

AI-powered requirements automation is powerful but far from infallible. Understanding the failure modes is essential to using it responsibly.

### Hallucination

LLMs sometimes invent requirements that sound plausible but have no basis in the stakeholder input. A model might add "the system shall send an email notification" to every feature, even when nobody asked for it.

**Mitigation:** Always compare the generated output against the original stakeholder text. Remove any requirement you cannot trace back to the source. Use the validation script from the exercise: it catches missing or malformed FRs but cannot catch hallucinated content; human review is the only defence.

### Bias in Training Data

LLMs are trained on publicly available code and documentation, which over-represents certain domains (e-commerce, SaaS dashboards, social media) and under-represents others (healthcare, education, government). When given an EdTech feature description, the model may impose e-commerce patterns ("add to cart" thinking applied to course enrolment).

**Mitigation:** Provide domain-specific context in the prompt. If your system is a university portal, tell the model explicitly: "This is a higher-education context. Use terminology such as enrolment, semester, credit hours, and academic calendar."

### Missing Non-Functional Requirements

LLMs excel at functional requirements (what the system does) but struggle with non-functional requirements (how well it does it). Generated output rarely includes:

- Performance: "The search page shall return results within 2 seconds."
- Security: "Only authenticated students may view seat availability."
- Accessibility: "The course search page shall meet WCAG 2.1 AA."
- Availability: "The enrolment system shall be available 99.9% of business hours."

**Mitigation:** After generating functional requirements, run a second prompt: "Review these requirements and add non-functional requirements covering performance, security, accessibility, and availability."

### Stakeholder Drift

When you automate requirements generation, there is a risk that stakeholders disengage from the process. They may assume the AI "handled it" and skip the review step. This leads to requirements that look good on paper but do not match the real need.

**Mitigation:** Treat AI-generated requirements as a discussion starter, not a deliverable. Schedule a 30-minute review session where the stakeholder reads each requirement aloud and confirms or corrects it. The AI's job is to reduce the time from blank page to draft, not to eliminate the human conversation.

### Best Practices Summary

| Practice | Rationale |
|---|---|
| Always review AI output before committing | Hallucinations are guaranteed at some point |
| Use low temperature (0.1–0.3) | Reduces creativity; requirements need precision |
| Ask for JSON output with explicit schema | Enables automated validation and tooling |
| Keep stakeholder language in the prompt | The model needs the raw, unprocessed input |
| Supplement with non-functional requirements manually | LLMs underrepresent NFRs |
| Version-control generated requirements | Track changes just like you track code |
| Treat AI as a junior analyst | It drafts; you approve |
| Never send sensitive stakeholder data to cloud APIs without permission | Use local models or anonymise input |

</section>

<section lang="id">

## Keterbatasan dan Praktik Terbaik

Otomatisasi kebutuhan berbasis AI sangat kuat tetapi jauh dari sempurna. Memahami mode kegagalan sangat penting untuk menggunakannya secara bertanggung jawab.

### Halusinasi

LLM terkadang menciptakan kebutuhan yang terdengar masuk akal tetapi tidak memiliki dasar dalam masukan pemangku kepentingan. Model mungkin menambahkan "sistem harus mengirim notifikasi email" ke setiap fitur, bahkan ketika tidak ada yang memintanya.

**Mitigasi:** Selalu bandingkan output yang dihasilkan dengan teks pemangku kepentingan asli. Hapus kebutuhan apa pun yang tidak dapat Anda lacak kembali ke sumbernya. Gunakan skrip validasi dari latihan: skrip ini menangkap FR yang hilang atau cacat, tetapi tidak dapat menangkap konten hasil halusinasi; tinjauan manusia adalah satu-satunya pertahanan.

### Bias dalam Data Pelatihan

LLM dilatih pada kode dan dokumentasi yang tersedia secara publik, yang terlalu merepresentasikan domain tertentu (e-commerce, dashboard SaaS, media sosial) dan kurang merepresentasikan yang lain (kesehatan, pendidikan, pemerintahan). Ketika diberikan deskripsi fitur EdTech, model mungkin menerapkan pola e-commerce (pemikiran "tambahkan ke keranjang" diterapkan pada pendaftaran mata kuliah).

**Mitigasi:** Berikan konteks spesifik domain dalam *prompt*. Jika sistem Anda adalah portal universitas, beri tahu model secara eksplisit: "Ini adalah konteks pendidikan tinggi. Gunakan terminologi seperti pendaftaran, semester, SKS, dan kalender akademik."

### Kebutuhan Non-Fungsional yang Hilang

LLM unggul dalam kebutuhan fungsional (apa yang dilakukan sistem) tetapi kesulitan dengan kebutuhan non-fungsional (seberapa baik ia melakukannya). Output yang dihasilkan jarang mencakup:

- Kinerja: "Halaman pencarian harus mengembalikan hasil dalam waktu 2 detik."
- Keamanan: "Hanya mahasiswa terautentikasi yang dapat melihat ketersediaan kursi."
- Aksesibilitas: "Halaman pencarian mata kuliah harus memenuhi WCAG 2.1 AA."
- Ketersediaan: "Sistem pendaftaran harus tersedia 99,9% jam kerja."

**Mitigasi:** Setelah menghasilkan kebutuhan fungsional, jalankan *prompt* kedua: "Tinjau kebutuhan ini dan tambahkan kebutuhan non-fungsional yang mencakup kinerja, keamanan, aksesibilitas, dan ketersediaan."

### Penyimpangan Pemangku Kepentingan

Ketika Anda mengotomatiskan pembuatan kebutuhan, ada risiko bahwa pemangku kepentingan melepaskan diri dari proses. Mereka mungkin menganggap AI "menanganinya" dan melewatkan langkah tinjauan. Ini mengarah pada kebutuhan yang terlihat bagus di atas kertas tetapi tidak cocok dengan kebutuhan nyata.

**Mitigasi:** Perlakukan kebutuhan yang dihasilkan AI sebagai pembuka diskusi, bukan sebagai hasil akhir. Jadwalkan sesi tinjauan 30 menit di mana pemangku kepentingan membaca setiap kebutuhan dengan keras dan mengonfirmasi atau mengoreksinya. Tugas AI adalah mengurangi waktu dari halaman kosong ke draf, bukan menghilangkan percakapan manusia.

### Ringkasan Praktik Terbaik

| Praktik | Alasan |
|---|---|
| Selalu tinjau output AI sebelum *commit* | Halusinasi dijamin terjadi pada suatu saat |
| Gunakan suhu rendah (0.1–0.3) | Mengurangi kreativitas; kebutuhan perlu presisi |
| Minta output JSON dengan skema eksplisit | Memungkinkan validasi dan perkakas otomatis |
| Simpan bahasa pemangku kepentingan dalam *prompt* | Model membutuhkan masukan mentah yang belum diproses |
| Tambahkan kebutuhan non-fungsional secara manual | LLM kurang merepresentasikan NFR |
| *Version-control* kebutuhan yang dihasilkan | Lacak perubahan seperti Anda melacak kode |
| Perlakukan AI sebagai analis junior | AI membuat draf; Anda menyetujui |
| Jangan kirim data pemangku kepentingan sensitif ke API cloud tanpa izin | Gunakan model lokal atau anonimkan masukan |

</section>

---

<section lang="en">

## Conclusion and Further Reading

AI-powered requirements automation is not a replacement for the discipline of requirements engineering: it is an accelerator. By offloading the mechanical work of formatting, structuring, and drafting to an LLM, you free up your analysts (and yourself) for the work that only humans can do: understanding the stakeholder's real problem, negotiating priorities, and making trade-off decisions.

### What We Covered

- The transformation from unstructured stakeholder language to user stories, acceptance criteria, and SRS snippets.
- A tiered view of AI tools (from cloud APIs to local models to NLP libraries) with concrete setup instructions.
- Prompt engineering principles for requirements, including role assignment, context injection, and output format constraints.
- A complete two-script PHP pipeline: `generate-requirements.php` (LLM call) and `validate-and-trace.php` (validation + traceability matrix).
- Database-backed traceability with Laravel migrations and Artisan commands.
- The failure modes: hallucination, bias, missing NFRs, and stakeholder disengagement, with mitigations for each.

### Next Steps

This tutorial is part of a broader AI-assisted SE pipeline. To continue:

1. **Generate tests from your requirements**: Feed the acceptance criteria from this tutorial into the workflow described in [AI-Assisted Unit Test Generation with PHP](/blog/ai-assisted-unit-test-generation).
2. **Document your architecture**: Use the structured output from your requirements analysis to seed the documentation pipeline in [LLM-Assisted Documentation Automation for PHP Projects](/blog/llm-assisted-documentation-automation-php).
3. **Explore the research**: Visit the [Emerging Technologies in SE research stream](https://se.polinema.ac.id/research/emerging-technologies-se/) to see how Politeknik Negeri Malang's SE Lab is advancing requirements automation, NLP for SE, and AI-assisted traceability.

The pipeline (requirements → tests → documentation) is now within reach of any PHP developer with an API key and a structured prompt. The machines can draft. The human must verify. That is the deal.

</section>

<section lang="id">

## Kesimpulan dan Bacaan Lebih Lanjut

Otomatisasi kebutuhan berbasis AI bukanlah pengganti disiplin rekayasa kebutuhan, melainkan akselerator. Dengan memindahkan pekerjaan mekanis memformat, menstrukturkan, dan menyusun draf ke LLM, Anda membebaskan analis Anda (dan diri Anda sendiri) untuk pekerjaan yang hanya dapat dilakukan manusia: memahami masalah nyata pemangku kepentingan, menegosiasikan prioritas, dan membuat keputusan *trade-off*.

### Apa yang Kami Bahas

- Transformasi dari bahasa pemangku kepentingan tidak terstruktur menjadi *user story*, kriteria penerimaan, dan potongan SRS.
- Pandangan bertingkat tentang alat AI, dari API cloud hingga model lokal hingga *library* NLP, dengan instruksi pengaturan konkret.
- Prinsip *prompt engineering* untuk kebutuhan, termasuk penetapan peran, injeksi konteks, dan batasan format output.
- *Pipeline* PHP dua skrip yang lengkap: `generate-requirements.php` (panggilan LLM) dan `validate-and-trace.php` (validasi + matriks ketertelusuran).
- Ketertelusuran berbasis *database* dengan migrasi Laravel dan perintah Artisan.
- Mode kegagalan: halusinasi, bias, NFR yang hilang, dan pelepasan pemangku kepentingan, dengan mitigasi untuk masing-masing.

### Langkah Selanjutnya

Tutorial ini adalah bagian dari pipeline SE berbantuan AI yang lebih luas. Untuk melanjutkan:

1. **Hasilkan pengujian dari kebutuhan Anda**: masukkan kriteria penerimaan dari tutorial ini ke dalam alur kerja yang dijelaskan di [Pembuatan Unit Test Berbantuan AI dengan PHP](/blog/ai-assisted-unit-test-generation).
2. **Dokumentasikan arsitektur Anda**: gunakan output terstruktur dari analisis kebutuhan Anda untuk memulai *pipeline* dokumentasi di [Otomatisasi Dokumentasi Berbantuan LLM untuk Proyek PHP](/blog/llm-assisted-documentation-automation-php).
3. **Jelajahi riset**: kunjungi [alur riset Emerging Technologies in SE](https://se.polinema.ac.id/research/emerging-technologies-se/) untuk melihat bagaimana SE Lab Politeknik Negeri Malang memajukan otomatisasi kebutuhan, NLP untuk SE, dan ketertelusuran berbantuan AI.

*Pipeline* (kebutuhan → pengujian → dokumentasi) sekarang dalam jangkauan setiap pengembang PHP dengan kunci API dan *prompt* terstruktur. Mesin dapat membuat draf. Manusia harus memverifikasi. Itulah kesepakatannya.

</section>
