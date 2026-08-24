---
title: "LLM-Assisted Documentation Automation for PHP Projects"
titleId: "Otomatisasi Dokumentasi Berbantuan LLM untuk Proyek PHP"
date: 2026-07-04
updated: 2026-07-04
category: tutorial
author: SE Lab
lang: en
featured: false
stream: emerging-technologies-se
tags:
  - AI
  - Software Documentation
  - PHP
tagsId:
  - AI
  - Dokumentasi Perangkat Lunak
  - PHP
excerpt: "Learn how to use LLMs to generate, maintain, and validate API documentation, README files, inline comments, and changelogs for PHP/Laravel projects. Covers Scribe, PHPDoc, MkDocs, and custom LLM pipelines with a human-in-the-loop review workflow, and shows where LLMs fail and hallucinate."
excerptId: "Pelajari cara menggunakan LLM untuk menghasilkan, memelihara, dan memvalidasi dokumentasi API, file README, komentar inline, dan changelog untuk proyek PHP/Laravel. Mencakup Scribe, PHPDoc, MkDocs, dan pipeline LLM kustom dengan alur kerja tinjauan human-in-the-loop, serta menunjukkan di mana LLM gagal dan berhalusinasi."
---

<section lang="en">

## Why Documentation Automation?

Documentation is consistently one of the most neglected activities in software development. Students write hundreds of lines of code but skip the README. Researchers build functional prototypes but ship zero API docs. Production teams deploy endpoints that nobody outside the team can discover or consume. The result is a knowledge debt that compounds every sprint.

**LLM-assisted documentation automation** uses large language models, like those powering GitHub Copilot, ChatGPT, or local models via Ollama, to draft, update, and validate documentation alongside the code itself. When done responsibly, it transforms documentation from a separate, dreaded task into something that lives adjacent to the code, always reachable and always at least a first draft.

### Where LLMs Help

| Use Case | LLM Strength |
|---|---|
| Generating endpoint descriptions from route definitions | High: structural patterns are easy to infer |
| Drafting PHPDoc blocks from method signatures | High: signatures carry type information |
| Bootstrapping README files from project structure | High: composer.json, routes, and folders tell a story |
| Writing changelog entries from commit messages | Medium: commit context is shallow |
| Explaining complex business logic in comments | Medium: domain nuance often lost |
| Validating that docs match current code | Low: requires execution, not prediction |
| Ensuring regulatory compliance | Very Low: LLMs cannot verify facts |

### Where LLMs Fail

- **Hallucinated API endpoints.** The LLM may describe endpoints that do not exist because it pattern-matched them from training data.
- **Stale descriptions.** If you generate docs once and never update them, the LLM has no mechanism to detect drift.
- **Confident nonsense.** LLMs write plausible-sounding but incorrect explanations of business rules when they lack domain context.
- **Inconsistent terminology.** Without a glossary or explicit constraint, an LLM may call the same entity "User," "Account," and "Customer" in different sections.

The antidote to all four failures is the same: **a human-in-the-loop review workflow.** The LLM drafts. You verify, correct, and commit. Documentation automation is not documentation abdication.

### Connection to SE Lab Research

The Software Engineering Lab at Politeknik Negeri Malang lists **Documentation Automation** as one of the five core topics under the [Emerging Technologies in Software Engineering](https://se.polinema.ac.id/research/emerging-technologies-se/) research stream. Related research areas include requirements traceability, doc-to-code consistency, and automated commit summarisation, all of which this tutorial connects to practical tooling.

</section>

<section lang="id">

## Mengapa Otomatisasi Dokumentasi?

Dokumentasi secara konsisten merupakan salah satu aktivitas yang paling terabaikan dalam pengembangan perangkat lunak. Mahasiswa menulis ratusan baris kode tetapi melewatkan README. Peneliti membangun prototipe fungsional tetapi tidak menyertakan dokumentasi API. Tim produksi men-deploy endpoint yang tidak dapat ditemukan atau dikonsumsi oleh siapa pun di luar tim. Hasilnya adalah utang pengetahuan yang bertambah setiap sprint.

**Otomatisasi dokumentasi berbantuan LLM** menggunakan model bahasa besar (seperti yang mendukung GitHub Copilot, ChatGPT, atau model lokal melalui Ollama) untuk menyusun, memperbarui, dan memvalidasi dokumentasi bersamaan dengan kode itu sendiri. Ketika dilakukan secara bertanggung jawab, ini mengubah dokumentasi dari tugas terpisah yang ditakuti menjadi sesuatu yang hidup berdampingan dengan kode, selalu dapat dijangkau dan selalu setidaknya berupa draf pertama.

### Di Mana LLM Membantu

| Kasus Penggunaan | Kekuatan LLM |
|---|---|
| Menghasilkan deskripsi endpoint dari definisi rute | Tinggi: pola struktural mudah disimpulkan |
| Menyusun blok PHPDoc dari tanda tangan metode | Tinggi: tanda tangan membawa informasi tipe |
| Mem-bootstrap file README dari struktur proyek | Tinggi: composer.json, rute, dan folder menceritakan sebuah kisah |
| Menulis entri changelog dari pesan commit | Sedang: konteks commit dangkal |
| Menjelaskan logika bisnis yang kompleks dalam komentar | Sedang: nuansa domain sering hilang |
| Memvalidasi bahwa dokumen cocok dengan kode saat ini | Rendah: memerlukan eksekusi, bukan prediksi |
| Memastikan kepatuhan regulasi | Sangat Rendah: LLM tidak dapat memverifikasi fakta |

### Di Mana LLM Gagal

- **Endpoint API yang dihalusinasi.** LLM mungkin mendeskripsikan endpoint yang tidak ada karena mencocokkan pola dari data pelatihan.
- **Deskripsi usang.** Jika Anda menghasilkan dokumentasi sekali dan tidak pernah memperbaruinya, LLM tidak memiliki mekanisme untuk mendeteksi penyimpangan.
- **Omong kosong yang meyakinkan.** LLM menulis penjelasan yang terdengar masuk akal tetapi salah tentang aturan bisnis ketika mereka kekurangan konteks domain.
- **Terminologi tidak konsisten.** Tanpa glosarium atau batasan eksplisit, LLM mungkin menyebut entitas yang sama sebagai "User", "Account", dan "Customer" di bagian yang berbeda.

Penangkal keempat kegagalan itu sama: **alur kerja tinjauan human-in-the-loop.** LLM membuat draf. Anda memverifikasi, mengoreksi, dan meng-commit. Otomatisasi dokumentasi bukanlah pengabaian dokumentasi.

### Koneksi dengan Riset SE Lab

Software Engineering Lab di Politeknik Negeri Malang menempatkan **Documentation Automation** sebagai salah satu dari lima topik inti dalam alur riset [Emerging Technologies in Software Engineering](https://se.polinema.ac.id/research/emerging-technologies-se/). Area riset terkait mencakup ketertelusuran kebutuhan, konsistensi *doc-to-code*, dan peringkasan commit otomatis, yang semuanya dihubungkan oleh tutorial ini ke perangkat praktis.

</section>

---

<section lang="en">

## Tooling Landscape

Documentation automation spans a spectrum from framework-native annotation processors to general-purpose LLM pipelines. Understanding the trade-offs helps you pick the right tool for each job.

### Annotation-Based Generators (Structured)

These tools extract documentation from **code annotations and type hints.** They are deterministic: given the same code, they always produce the same output. They cannot hallucinate endpoints, but they also cannot write a human-friendly paragraph without you.

| Tool | Works With | Strength | Limitation |
|---|---|---|---|
| **Scribe** | Laravel | Generates OpenAPI docs from controller annotations and Form Requests. Excellent for API references. | Only describes what annotations exist. Cannot explain *why* an endpoint exists. |
| **PHPDoc / phpDocumentor** | Any PHP | Standard for class/function documentation. IDEs use it for autocompletion. | Manual effort to write. No automation. |
| **Schema.org / JSON-LD generators** | Framework-agnostic | Structured data for SEO. | Niche: only useful for web-facing content. |
| **OpenAPI/Swagger generators** | REST APIs | Machine-readable spec. Many tools consume it. | Annotations are verbose. |

### LLM-Based Generators (Unstructured)

These tools produce **natural-language documentation** by reasoning about code structure. They can explain purpose, write prose, and adapt tone, but they can also hallucinate.

| Tool | Approach | PHP Support | Cost |
|---|---|---|---|
| **GitHub Copilot Chat** | In-IDE: `/docs` and `/explain` commands | Excellent | \$10/month (free for students) |
| **Mintlify** | IDE extension: select code, generate docs | Good | Freemium |
| **ReadMe AI** | Cloud-hosted: upload OpenAPI spec, get prose docs | Platform-agnostic | Paid |
| **Cursor / Windsurf** | Full-context AI editor with doc generation | Excellent | Freemium |
| **Continue + Ollama** | Fully local, no internet required | Good | Free |
| **Custom Python/PHP script** | Pipe code through OpenAI/Anthropic API | Complete control | API costs |

### Static Site Generators for Documentation

After you generate the content, you need to publish it. These tools host and present your documentation:

| Tool | Use Case |
|---|---|
| **MkDocs** (with Material theme) | Project documentation sites. Markdown-based, with search and navigation. |
| **Docusaurus** | React-based docs. Strong community. Used by Laravel itself. |
| **VitePress** | Vue-based. Lightweight. |
| **Jekyll / Hugo** | General-purpose SSGs. GitHub Pages compatible. |

### Which Tool for Which Task?

| Task | Best Tool |
|---|---|
| Generate API reference from Laravel controllers | **Scribe** (annotations) + **LLM** (descriptions) |
| Draft a README for a new project | **Copilot Chat / ChatGPT** |
| Document a complex business rule | **You** (write the explanation) + **LLM** (polish phrasing) |
| Keep changelogs up to date | **Custom script** (extract commits) + **LLM** (summarise) |
| Build a documentation website | **MkDocs** (Material theme) |
| Validate that docs match code | **Manual review** (no LLM can do this reliably) |

### A Practical Stack

For a typical PHP/Laravel project at Politeknik Negeri Malang, a reasonable starting stack is:

1. **Scribe** for API endpoint docs (generates from route annotations).
2. **Copilot Chat** or **local Ollama** for drafting endpoint descriptions, README prose, and PHPDoc blocks.
3. **MkDocs** (Material) for a documentation site accessible to teammates and lecturers.
4. **GitHub Actions** or Husky hooks for automated changelog generation on release.

</section>

<section lang="id">

## Lanskap Perkakas

Otomatisasi dokumentasi mencakup spektrum dari pemroses anotasi native framework hingga pipeline LLM tujuan umum. Memahami trade-off membantu Anda memilih alat yang tepat untuk setiap pekerjaan.

### Generator Berbasis Anotasi (Terstruktur)

Alat-alat ini mengekstrak dokumentasi dari **anotasi kode dan petunjuk tipe.** Mereka deterministik: diberikan kode yang sama, mereka selalu menghasilkan output yang sama. Mereka tidak dapat menghalusinasi endpoint, tetapi mereka juga tidak dapat menulis paragraf yang ramah-manusia tanpa Anda.

| Alat | Bekerja Dengan | Kekuatan | Keterbatasan |
|---|---|---|---|
| **Scribe** | Laravel | Menghasilkan dokumentasi OpenAPI dari anotasi controller dan Form Request. Sangat baik untuk referensi API. | Hanya mendeskripsikan apa yang ada dalam anotasi. Tidak dapat menjelaskan *mengapa* sebuah endpoint ada. |
| **PHPDoc / phpDocumentor** | PHP apa pun | Standar untuk dokumentasi kelas/fungsi. IDE menggunakannya untuk autocompletion. | Upaya manual untuk menulis. Tidak ada otomatisasi. |
| **Generator Schema.org / JSON-LD** | Framework-agnostic | Data terstruktur untuk SEO. | *Niche*: hanya berguna untuk konten yang menghadap web. |
| **Generator OpenAPI/Swagger** | REST API | Spesifikasi yang dapat dibaca mesin. Banyak alat mengonsumsinya. | Anotasi bersifat verbose. |

### Generator Berbasis LLM (Tidak Terstruktur)

Alat-alat ini menghasilkan **dokumentasi bahasa alami** dengan bernalar tentang struktur kode. Mereka dapat menjelaskan tujuan, menulis prosa, dan menyesuaikan nada, tetapi mereka juga dapat berhalusinasi.

| Alat | Pendekatan | Dukungan PHP | Biaya |
|---|---|---|---|
| **GitHub Copilot Chat** | Di IDE: perintah `/docs` dan `/explain` | Sangat baik | \$10/bulan (gratis untuk mahasiswa) |
| **Mintlify** | Ekstensi IDE: pilih kode, hasilkan dokumen | Baik | Freemium |
| **ReadMe AI** | *Cloud-hosted*: unggah spesifikasi OpenAPI, dapatkan dokumen prosa | Platform-agnostic | Berbayar |
| **Cursor / Windsurf** | Editor AI konteks penuh dengan generasi dokumen | Sangat baik | Freemium |
| **Continue + Ollama** | Sepenuhnya lokal, tanpa internet | Baik | Gratis |
| **Skrip Python/PHP kustom** | Mengirim kode melalui API OpenAI/Anthropic | Kontrol penuh | Biaya API |

### Static Site Generator untuk Dokumentasi

Setelah Anda menghasilkan konten, Anda perlu mempublikasikannya. Alat-alat ini menghosting dan menyajikan dokumentasi Anda:

| Alat | Kasus Penggunaan |
|---|---|
| **MkDocs** (dengan tema Material) | Situs dokumentasi proyek. Berbasis Markdown, dengan pencarian dan navigasi. |
| **Docusaurus** | Dokumentasi berbasis React. Komunitas kuat. Digunakan oleh Laravel sendiri. |
| **VitePress** | Berbasis Vue. Ringan. |
| **Jekyll / Hugo** | SSG tujuan umum. Kompatibel dengan GitHub Pages. |

### Alat Mana untuk Tugas Mana?

| Tugas | Alat Terbaik |
|---|---|
| Menghasilkan referensi API dari controller Laravel | **Scribe** (anotasi) + **LLM** (deskripsi) |
| Menyusun README untuk proyek baru | **Copilot Chat / ChatGPT** |
| Mendokumentasikan aturan bisnis yang kompleks | **Anda** (tulis penjelasan) + **LLM** (poles frasa) |
| Menjaga changelog tetap terkini | **Skrip kustom** (ekstrak commit) + **LLM** (ringkas) |
| Membangun situs web dokumentasi | **MkDocs** (tema Material) |
| Memvalidasi bahwa dokumen cocok dengan kode | **Tinjauan manual** (tidak ada LLM yang dapat melakukannya dengan andal) |

### Stack Praktis

Untuk proyek PHP/Laravel tipikal di Politeknik Negeri Malang, stack awal yang masuk akal adalah:

1. **Scribe** untuk dokumentasi endpoint API (menghasilkan dari anotasi rute).
2. **Copilot Chat** atau **Ollama lokal** untuk menyusun deskripsi endpoint, prosa README, dan blok PHPDoc.
3. **MkDocs** (Material) untuk situs dokumentasi yang dapat diakses oleh rekan tim dan dosen.
4. **GitHub Actions** atau Husky hooks untuk generasi changelog otomatis saat rilis.

</section>

---

<section lang="en">

## Generating API Documentation from Laravel Code

This is where documentation automation delivers its highest return on time invested. Laravel controllers declare routes, request validation, and responses: all structured data an LLM can consume. The workflow combines **Scribe** (deterministic, annotation-based) with an **LLM** (for natural-language descriptions).

### Step 1: Install Scribe

```bash
composer require --dev knuckleshtf/scribe
php artisan vendor:publish --tag=scribe-config
```

Scribe reads your route definitions, controller docblocks, and Form Request validation rules to generate a complete OpenAPI 3.0 spec and an HTML documentation site.

### Step 2: Annotate Your Controller (the Deterministic Part)

Scribe extracts metadata from structured annotations. You write these once, and Scribe produces an accurate API reference every build.

**`app/Http/Controllers/Api/CourseController.php`**:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use App\Models\Course;
use Illuminate\Http\JsonResponse;

/**
 * @group Course Management
 *
 * Endpoints for managing academic courses: creating new courses,
 * retrieving course details, updating course metadata, and
 * deleting courses that are no longer offered.
 *
 * @authenticated
 */
class CourseController extends Controller
{
    /**
     * List all active courses
     *
     * Returns a paginated list of courses available in the current semester.
     * Results are ordered alphabetically by course code.
     *
     * @queryParam semester string Filter courses by semester code (e.g. "2025-1"). Example: "2025-1"
     * @queryParam program string Filter by study program code (e.g. "D4-TI"). Example: "D4-TI"
     * @queryParam page int Page number for pagination. Example: 1
     *
     * @response {
     *   "data": [
     *     {
     *       "id": 1,
     *       "code": "TI4001",
     *       "name": "Software Engineering",
     *       "credits": 3,
     *       "semester": "2025-1",
     *       "program": "D4-TI"
     *     }
     *   ],
     *   "meta": { "current_page": 1, "last_page": 3 }
     * }
     */
    public function index(): JsonResponse
    {
        $courses = Course::query()
            ->when(request('semester'), fn ($q, $v) => $q->where('semester', $v))
            ->when(request('program'), fn ($q, $v) => $q->where('program', $v))
            ->orderBy('code')
            ->paginate(20);

        return response()->json($courses);
    }

    /**
     * Create a new course
     *
     * Registers a new course in the system. The course code must be unique
     * across all semesters and programs.
     *
     * @bodyParam code string required Unique course code (e.g. "TI4001"). Example: "TI4001"
     * @bodyParam name string required Full course name. Example: "Software Engineering"
     * @bodyParam credits int required Number of credit hours (1–6). Example: 3
     * @bodyParam semester string required Semester code (format "YYYY-N"). Example: "2025-1"
     * @bodyParam program string required Study program code. Example: "D4-TI"
     *
     * @response 201 {
     *   "data": {
     *     "id": 42,
     *     "code": "TI4001",
     *     "name": "Software Engineering",
     *     "credits": 3,
     *     "semester": "2025-1",
     *     "program": "D4-TI"
     *   }
     * }
     */
    public function store(StoreCourseRequest $request): JsonResponse
    {
        $course = Course::create($request->validated());

        return response()->json(['data' => $course], 201);
    }

    /**
     * Retrieve a course by ID
     *
     * Returns full details for a single course, including the list of
     * enrolled students and assigned lecturers.
     *
     * @urlParam id int required The course ID. Example: 1
     *
     * @response {
     *   "data": {
     *     "id": 1,
     *     "code": "TI4001",
     *     "name": "Software Engineering",
     *     "credits": 3,
     *     "semester": "2025-1",
     *     "program": "D4-TI",
     *     "lecturers": [
     *       { "id": 1, "name": "Dr. Ardian Prima Atmaja" }
     *     ],
     *     "students_count": 32
     *   }
     * }
     */
    public function show(Course $course): JsonResponse
    {
        $course->load('lecturers');

        return response()->json([
            'data' => array_merge($course->toArray(), [
                'students_count' => $course->students()->count(),
            ]),
        ]);
    }

    /**
     * Update a course
     *
     * Modifies an existing course. You may update one or more fields:
     * only the provided fields will be modified.
     *
     * @urlParam id int required The course ID.
     * @bodyParam name string Updated course name. Example: "Advanced Software Engineering"
     * @bodyParam credits int Updated credit hours. Example: 4
     *
     * @response {
     *   "data": {
     *     "id": 1,
     *     "code": "TI4001",
     *     "name": "Advanced Software Engineering",
     *     "credits": 4
     *   }
     * }
     */
    public function update(UpdateCourseRequest $request, Course $course): JsonResponse
    {
        $course->update($request->validated());

        return response()->json(['data' => $course]);
    }

    /**
     * Delete a course
     *
     * Soft-deletes a course. The course will be archived and can be restored
     * within 30 days. Courses with active enrolments cannot be deleted.
     *
     * @urlParam id int required The course ID.
     *
     * @response 204 "Course archived successfully"
     * @response 409 "Cannot delete course with active enrolments"
     */
    public function destroy(Course $course): JsonResponse
    {
        if ($course->enrolments()->active()->exists()) {
            return response()->json([
                'message' => 'Cannot delete course with active enrolments',
            ], 409);
        }

        $course->delete();

        return response()->json(null, 204);
    }
}
```

### Step 3: Generate the Scribe Documentation

```bash
php artisan scribe:generate
```

Scribe produces an `index.html` in `public/docs/` with every endpoint, its parameters, example responses, and a "Try It" console. This is your **deterministic, always-accurate skeleton.**

But notice what is missing: the *why* behind each endpoint, the business rules ("courses with active enrolments cannot be deleted"), the relationships between endpoints, and the onboarding prose that helps a new developer understand the API in five minutes instead of fifty.

This is where the LLM enters.

### Step 4: Use an LLM to Enrich Descriptions

Take the controller you wrote above and paste it into Copilot Chat, ChatGPT, or your local Ollama instance. Use this prompt:

> "You are a senior API documentation writer. Below is a Laravel course management controller. For each endpoint, write a comprehensive description that explains:
> 1. What the endpoint does and when to use it.
> 2. All query/body parameters with their constraints and default values.
> 3. All possible response codes and what they mean.
> 4. Any business rules (e.g. 'cannot delete a course with active enrolments').
> 5. An example request and response.
>
> Format the output as Scribe-compatible PHPDoc annotations."

**Example LLM output for the `store` endpoint:**

```php
/**
 * Create a new course
 *
 * Registers a new course offering in the academic system. Use this endpoint
 * when adding courses to the semester catalogue. The course code must follow
 * the department naming convention (PREFIX-NNNN) and must not conflict with
 * any existing active course.
 *
 * **Business rules:**
 * - Course code must be unique across all semesters for the same program.
 * - Credits must be between 1 and 6 inclusive.
 * - Semester format is "YYYY-N" where N is 1 (odd) or 2 (even).
 *
 * @bodyParam code string required Unique course code matching pattern
 *   /^[A-Z]{2,4}\d{4}$/. Example: "TI4001"
 * @bodyParam name string required Full official course name as it appears
 *   in the academic catalogue. Example: "Software Engineering"
 * @bodyParam credits int required Credit hours (SKS). Must be 1–6.
 *   Example: 3
 * @bodyParam semester string required Academic semester in "YYYY-N" format.
 *   Example: "2025-1"
 * @bodyParam program string required Study program code. Must match an
 *   existing program in the system. Example: "D4-TI"
 *
 * @response 201 scenario="Course created" {
 *   "data": {
 *     "id": 42,
 *     "code": "TI4001",
 *     "name": "Software Engineering",
 *     "credits": 3,
 *     "semester": "2025-1",
 *     "program": "D4-TI"
 *   }
 * }
 * @response 422 scenario="Validation failed" {
 *   "message": "The code has already been taken.",
 *   "errors": { "code": ["The code has already been taken."] }
 * }
 */
```

Notice what the LLM added:
- A **business rules** section explaining constraints that code alone does not express.
- **Parameter constraints** (regex pattern for course code, valid SKS range, semester format).
- A **422 response example** showing what validation failure looks like.
- **Scenario labels** that help readers distinguish success from failure responses.

### Step 5: Review the LLM Output Before Committing

Before you paste the LLM's text into your controller, apply this checklist:

1. **Does every parameter actually exist in the code?** If the LLM added a `@bodyParam prerequisities` but your `StoreCourseRequest` has no such field, delete it.
2. **Are constraint values correct?** Your validation rules say `max_credits:6`. Does the LLM say 1–6, or did it guess 1–12?
3. **Are example values realistic?** "John Doe" is fine for a name. But an example course code should match your institution's actual naming scheme.
4. **Does the response structure match reality?** Run the endpoint and compare the JSON output with what the LLM wrote.
5. **Is the business logic correctly described?** If your code checks `semester.is_active` but the LLM's description does not mention the active-semester constraint, you must add it.

**Bad LLM habit to watch for:** The LLM may invent a `PATCH` endpoint that does not exist because it knows REST conventions and assumes you follow them completely. If your controller only has `PUT`, delete the hallucinated `PATCH` block.

### Step 6: Integrate into CI/CD

Add Scribe generation to your deployment pipeline so the docs never go stale:

**`.github/workflows/docs.yml`**:

```yaml
name: Generate API Docs
on:
  push:
    branches: [main]
jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
      - run: composer install --no-interaction
      - run: php artisan scribe:generate
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public/docs
```

Now every push to `main` regenerates the API reference and deploys it to GitHub Pages.

</section>

<section lang="id">

## Menghasilkan Dokumentasi API dari Kode Laravel

Di sinilah otomatisasi dokumentasi memberikan pengembalian tertinggi atas waktu yang diinvestasikan. Controller Laravel mendeklarasikan rute, validasi request, dan respons, semua data terstruktur yang dapat dikonsumsi LLM. Alur kerja ini menggabungkan **Scribe** (deterministik, berbasis anotasi) dengan **LLM** (untuk deskripsi bahasa alami).

### Langkah 1: Instal Scribe

```bash
composer require --dev knuckleshtf/scribe
php artisan vendor:publish --tag=scribe-config
```

Scribe membaca definisi rute Anda, docblock controller, dan aturan validasi Form Request untuk menghasilkan spesifikasi OpenAPI 3.0 lengkap dan situs dokumentasi HTML.

### Langkah 2: Anotasi Controller Anda (Bagian Deterministis)

Scribe mengekstrak metadata dari anotasi terstruktur. Anda menulis ini sekali, dan Scribe menghasilkan referensi API yang akurat di setiap build.

**`app/Http/Controllers/Api/CourseController.php`**:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use App\Models\Course;
use Illuminate\Http\JsonResponse;

/**
 * @group Manajemen Mata Kuliah
 *
 * Endpoint untuk mengelola mata kuliah akademik: membuat mata kuliah baru,
 * mengambil detail mata kuliah, memperbarui metadata mata kuliah, dan
 * menghapus mata kuliah yang tidak lagi ditawarkan.
 *
 * @authenticated
 */
class CourseController extends Controller
{
    /**
     * Daftar semua mata kuliah aktif
     *
     * Mengembalikan daftar mata kuliah yang tersedia di semester berjalan
     * secara terpaginasikan. Hasil diurutkan berdasarkan kode mata kuliah.
     *
     * @queryParam semester string Filter berdasarkan kode semester (mis. "2025-1"). Example: "2025-1"
     * @queryParam program string Filter berdasarkan kode program studi (mis. "D4-TI"). Example: "D4-TI"
     * @queryParam page int Nomor halaman untuk paginasi. Example: 1
     *
     * @response {
     *   "data": [
     *     {
     *       "id": 1,
     *       "code": "TI4001",
     *       "name": "Rekayasa Perangkat Lunak",
     *       "credits": 3,
     *       "semester": "2025-1",
     *       "program": "D4-TI"
     *     }
     *   ],
     *   "meta": { "current_page": 1, "last_page": 3 }
     * }
     */
    public function index(): JsonResponse
    {
        $courses = Course::query()
            ->when(request('semester'), fn ($q, $v) => $q->where('semester', $v))
            ->when(request('program'), fn ($q, $v) => $q->where('program', $v))
            ->orderBy('code')
            ->paginate(20);

        return response()->json($courses);
    }

    /**
     * Membuat mata kuliah baru
     *
     * Mendaftarkan mata kuliah baru dalam sistem. Kode mata kuliah harus unik
     * di semua semester dan program.
     *
     * @bodyParam code string required Kode mata kuliah unik (mis. "TI4001"). Example: "TI4001"
     * @bodyParam name string required Nama lengkap mata kuliah. Example: "Rekayasa Perangkat Lunak"
     * @bodyParam credits int required Jumlah SKS (1–6). Example: 3
     * @bodyParam semester string required Kode semester (format "YYYY-N"). Example: "2025-1"
     * @bodyParam program string required Kode program studi. Example: "D4-TI"
     *
     * @response 201 {
     *   "data": {
     *     "id": 42,
     *     "code": "TI4001",
     *     "name": "Rekayasa Perangkat Lunak",
     *     "credits": 3,
     *     "semester": "2025-1",
     *     "program": "D4-TI"
     *   }
     * }
     */
    public function store(StoreCourseRequest $request): JsonResponse
    {
        $course = Course::create($request->validated());

        return response()->json(['data' => $course], 201);
    }

    /**
     * Mengambil mata kuliah berdasarkan ID
     *
     * Mengembalikan detail lengkap untuk satu mata kuliah, termasuk daftar
     * mahasiswa yang terdaftar dan dosen yang ditugaskan.
     *
     * @urlParam id int required ID mata kuliah. Example: 1
     *
     * @response {
     *   "data": {
     *     "id": 1,
     *     "code": "TI4001",
     *     "name": "Rekayasa Perangkat Lunak",
     *     "credits": 3,
     *     "semester": "2025-1",
     *     "program": "D4-TI",
     *     "lecturers": [
     *       { "id": 1, "name": "Dr. Ardian Prima Atmaja" }
     *     ],
     *     "students_count": 32
     *   }
     * }
     */
    public function show(Course $course): JsonResponse
    {
        $course->load('lecturers');

        return response()->json([
            'data' => array_merge($course->toArray(), [
                'students_count' => $course->students()->count(),
            ]),
        ]);
    }

    /**
     * Memperbarui mata kuliah
     *
     * Memodifikasi mata kuliah yang sudah ada. Anda dapat memperbarui satu
     * atau beberapa field: hanya field yang diberikan yang akan dimodifikasi.
     *
     * @urlParam id int required ID mata kuliah.
     * @bodyParam name string Nama mata kuliah yang diperbarui. Example: "Rekayasa Perangkat Lunak Lanjut"
     * @bodyParam credits int SKS yang diperbarui. Example: 4
     *
     * @response {
     *   "data": {
     *     "id": 1,
     *     "code": "TI4001",
     *     "name": "Rekayasa Perangkat Lunak Lanjut",
     *     "credits": 4
     *   }
     * }
     */
    public function update(UpdateCourseRequest $request, Course $course): JsonResponse
    {
        $course->update($request->validated());

        return response()->json(['data' => $course]);
    }

    /**
     * Menghapus mata kuliah
     *
     * Soft-delete mata kuliah. Mata kuliah akan diarsipkan dan dapat
     * dipulihkan dalam 30 hari. Mata kuliah dengan pendaftaran aktif
     * tidak dapat dihapus.
     *
     * @urlParam id int required ID mata kuliah.
     *
     * @response 204 "Mata kuliah berhasil diarsipkan"
     * @response 409 "Tidak dapat menghapus mata kuliah dengan pendaftaran aktif"
     */
    public function destroy(Course $course): JsonResponse
    {
        if ($course->enrolments()->active()->exists()) {
            return response()->json([
                'message' => 'Tidak dapat menghapus mata kuliah dengan pendaftaran aktif',
            ], 409);
        }

        $course->delete();

        return response()->json(null, 204);
    }
}
```

### Langkah 3: Hasilkan Dokumentasi Scribe

```bash
php artisan scribe:generate
```

Scribe menghasilkan `index.html` di `public/docs/` dengan setiap endpoint, parameternya, contoh respons, dan konsol "Try It". Ini adalah **kerangka deterministik Anda, selalu akurat.**

Tetapi perhatikan apa yang hilang: *mengapa* di balik setiap endpoint, aturan bisnis ("mata kuliah dengan pendaftaran aktif tidak dapat dihapus"), hubungan antar endpoint, dan prosa orientasi yang membantu developer baru memahami API dalam lima menit, bukan lima puluh.

Di sinilah LLM masuk.

### Langkah 4: Gunakan LLM untuk Memperkaya Deskripsi

Ambil controller yang Anda tulis di atas dan tempelkan ke Copilot Chat, ChatGPT, atau instance Ollama lokal Anda. Gunakan prompt ini:

> "Anda adalah penulis dokumentasi API senior. Di bawah ini adalah controller manajemen mata kuliah Laravel. Untuk setiap endpoint, tulis deskripsi komprehensif yang menjelaskan:
> 1. Apa yang dilakukan endpoint dan kapan menggunakannya.
> 2. Semua parameter query/body dengan batasannya dan nilai default.
> 3. Semua kode respons yang mungkin dan artinya.
> 4. Aturan bisnis apa pun (mis. 'tidak dapat menghapus mata kuliah dengan pendaftaran aktif').
> 5. Contoh request dan response.
>
> Format output sebagai anotasi PHPDoc yang kompatibel dengan Scribe."

**Contoh output LLM untuk endpoint `store`:**

```php
/**
 * Membuat mata kuliah baru
 *
 * Mendaftarkan penawaran mata kuliah baru dalam sistem akademik. Gunakan
 * endpoint ini ketika menambahkan mata kuliah ke katalog semester. Kode
 * mata kuliah harus mengikuti konvensi penamaan departemen (PREFIX-NNNN)
 * dan tidak boleh bentrok dengan mata kuliah aktif yang sudah ada.
 *
 * **Aturan bisnis:**
 * - Kode mata kuliah harus unik di semua semester untuk program yang sama.
 * - SKS harus antara 1 dan 6 inklusif.
 * - Format semester adalah "YYYY-N" di mana N adalah 1 (ganjil) atau 2 (genap).
 *
 * @bodyParam code string required Kode mata kuliah unik yang cocok dengan
 *   pola /^[A-Z]{2,4}\d{4}$/. Example: "TI4001"
 * @bodyParam name string required Nama resmi lengkap mata kuliah seperti
 *   yang muncul di katalog akademik. Example: "Rekayasa Perangkat Lunak"
 * @bodyParam credits int required Jumlah SKS. Harus 1–6. Example: 3
 * @bodyParam semester string required Semester akademik dalam format
 *   "YYYY-N". Example: "2025-1"
 * @bodyParam program string required Kode program studi. Harus cocok dengan
 *   program yang ada di sistem. Example: "D4-TI"
 *
 * @response 201 scenario="Mata kuliah dibuat" {
 *   "data": {
 *     "id": 42,
 *     "code": "TI4001",
 *     "name": "Rekayasa Perangkat Lunak",
 *     "credits": 3,
 *     "semester": "2025-1",
 *     "program": "D4-TI"
 *   }
 * }
 * @response 422 scenario="Validasi gagal" {
 *   "message": "Kode mata kuliah sudah digunakan.",
 *   "errors": { "code": ["Kode mata kuliah sudah digunakan."] }
 * }
 */
```

Perhatikan apa yang ditambahkan LLM:
- Bagian **aturan bisnis** yang menjelaskan batasan yang tidak diungkapkan oleh kode saja.
- **Batasan parameter** (pola regex untuk kode mata kuliah, rentang SKS yang valid, format semester).
- **Contoh respons 422** yang menunjukkan seperti apa kegagalan validasi.
- **Label skenario** yang membantu pembaca membedakan respons sukses dari kegagalan.

### Langkah 5: Tinjau Output LLM Sebelum Commit

Sebelum Anda menempelkan teks LLM ke controller Anda, terapkan daftar periksa ini:

1. **Apakah setiap parameter benar-benar ada dalam kode?** Jika LLM menambahkan `@bodyParam prerequisites` tetapi `StoreCourseRequest` Anda tidak memiliki field seperti itu, hapus.
2. **Apakah nilai batasan benar?** Aturan validasi Anda mengatakan `max_credits:6`. Apakah LLM mengatakan 1–6 atau ia menebak 1–12?
3. **Apakah nilai contoh realistis?** "John Doe" baik-baik saja untuk nama. Tetapi contoh kode mata kuliah harus cocok dengan skema penamaan aktual institusi Anda.
4. **Apakah struktur respons cocok dengan kenyataan?** Jalankan endpoint dan bandingkan output JSON dengan apa yang ditulis LLM.
5. **Apakah logika bisnis dijelaskan dengan benar?** Jika kode Anda memeriksa `semester.is_active` tetapi deskripsi LLM tidak menyebutkan batasan semester-aktif, Anda harus menambahkannya.

**Kebiasaan buruk LLM yang perlu diwaspadai:** LLM mungkin menciptakan endpoint `PATCH` yang tidak ada karena ia tahu konvensi REST dan mengasumsikan Anda mengikutinya sepenuhnya. Jika controller Anda hanya memiliki `PUT`, hapus blok `PATCH` yang dihalusinasi.

### Langkah 6: Integrasikan ke CI/CD

Tambahkan generasi Scribe ke pipeline deployment Anda agar dokumentasi tidak pernah usang:

**`.github/workflows/docs.yml`**:

```yaml
name: Generate API Docs
on:
  push:
    branches: [main]
jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
      - run: composer install --no-interaction
      - run: php artisan scribe:generate
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public/docs
```

Sekarang setiap push ke `main` meregenerasi referensi API dan men-deploy-nya ke GitHub Pages.

</section>

---

<section lang="en">

## Writing and Maintaining README Files

A README is the first thing visitors see in your repository. A good README answers four questions in under 60 seconds:

1. **What does this project do?** (one sentence)
2. **How do I run it?** (prerequisites + installation + start command)
3. **How do I use it?** (basic usage example)
4. **How do I contribute?** (development setup + contribution guide link)

### Template-Driven README Generation

The most reliable approach is to maintain a README template, then use an LLM to fill in project-specific content. The template ensures consistent structure across all lab projects; the LLM fills the sections that change per project.

**Template (`docs/README.template.md`):**

```markdown
# {{PROJECT_NAME}}

{{ONE_LINE_DESCRIPTION}}

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites
- PHP {{PHP_VERSION}}
- Composer 2.x
- {{DATABASE}} {{DB_VERSION}}
- Node.js {{NODE_VERSION}} (for frontend assets)

## Installation
```bash
git clone {{REPO_URL}}
cd {{PROJECT_NAME}}
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm install && npm run build
```

## Usage

{{USAGE_SECTION}}

## API Documentation

{{API_DOCS_SECTION}}

## Project Structure
```
{{PROJECT_TREE}}
```

## Development

{{DEV_SECTION}}

## Contributing

{{CONTRIBUTING_SECTION}}

## License

{{LICENSE_SECTION}}
```

The LLM fills `{{PLACEHOLDER}}` values. The template guarantees that no README is missing a required section; the LLM guarantees that the content in each section is project-specific.

### Example: LLM-Generated README Sections

**Prompt:**
> "Below is a `composer.json`, the project root directory tree, and the main route file for a Laravel-based student attendance system. Fill in the README sections for USAGE, API_DOCS, PROJECT_TREE, and DEV_SECTION."

**LLM output (cleaned after review):**

**`USAGE_SECTION`:**
```markdown
The system exposes a web interface for lecturers to take attendance and a
REST API for the mobile app. After installation, visit `http://localhost:8000`
and log in with:

- **Admin:** admin@polinema.ac.id / password
- **Lecturer:** lecturer@polinema.ac.id / password
- **Student:** Register via the mobile app

#### Taking Attendance
1. Log in as a lecturer.
2. Select a course from your dashboard.
3. Click "Start Attendance" to generate a 6-digit check-in code valid for 10 minutes.
4. Students enter the code in the mobile app to mark their presence.
```

**`DEV_SECTION`:**
```markdown
```bash
# Start the development server
php artisan serve

# Run Laravel Vite for frontend hot-reload
npm run dev

# Run tests
php artisan test

# Format code
vendor/bin/pint

# Static analysis
vendor/bin/phpstan analyse
```

#### Seeding Test Data
```bash
php artisan db:seed --class=DemoDataSeeder
```
Creates 3 courses, 5 lecturers, and 50 students with sample attendance records.
```

### Keeping Examples Runnable and Versioned

The most common README failure is an installation command that no longer works. Your `composer install && npm install && php artisan migrate` works today, but what about after you add a Redis dependency? The LLM will not know about it unless you provide the updated context.

**Mitigation strategies:**

1. **Test your README commands in CI.** Add a GitHub Actions job that clones a fresh copy and runs every command in the README's installation section. If any command fails, the build fails.
2. **Version-lock your README templates.** Store them in the repo (`docs/README.template.md`) and review changes in PRs.
3. **Re-generate only changed sections.** Do not regenerate the entire README from scratch every time. Instead, prompt the LLM with "Update the Installation section to include the new Redis requirement."

### When an LLM-Generated README Is Good Enough

An LLM-generated README is sufficient when:
- The project is a course assignment with a single developer.
- The project is a prototype with a short expected lifespan.
- The project follows extremely standard Laravel conventions (the LLM's training data is rich here).

An LLM-generated README needs substantial human editing when:
- The project has unusual system dependencies (specific PHP extensions, legacy database versions, proprietary packages).
- The project is security-sensitive and the README's commands could mislead users into insecure configurations.
- The project is a research output where precise methodology descriptions matter for reproducibility.

</section>

<section lang="id">

## Menulis dan Memelihara File README

README adalah hal pertama yang dilihat pengunjung di repositori Anda. README yang baik menjawab empat pertanyaan dalam waktu kurang dari 60 detik:

1. **Apa yang dilakukan proyek ini?** (satu kalimat)
2. **Bagaimana cara menjalankannya?** (prasyarat + instalasi + perintah mulai)
3. **Bagaimana cara menggunakannya?** (contoh penggunaan dasar)
4. **Bagaimana cara berkontribusi?** (setup pengembangan + tautan panduan kontribusi)

### Generasi README Berbasis Template

Pendekatan paling andal adalah memelihara template README, lalu menggunakan LLM untuk mengisi konten spesifik proyek. Template memastikan struktur yang konsisten di semua proyek lab; LLM mengisi bagian yang berubah per proyek.

**Template (`docs/README.template.md`):**

```markdown
# {{PROJECT_NAME}}

{{ONE_LINE_DESCRIPTION}}

## Daftar Isi
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Penggunaan](#penggunaan)
- [Dokumentasi API](#dokumentasi-api)
- [Struktur Proyek](#struktur-proyek)
- [Pengembangan](#pengembangan)
- [Berkontribusi](#berkontribusi)
- [Lisensi](#lisensi)

## Prasyarat
- PHP {{PHP_VERSION}}
- Composer 2.x
- {{DATABASE}} {{DB_VERSION}}
- Node.js {{NODE_VERSION}} (untuk aset frontend)

## Instalasi
```bash
git clone {{REPO_URL}}
cd {{PROJECT_NAME}}
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm install && npm run build
```

## Penggunaan

{{USAGE_SECTION}}

## Dokumentasi API

{{API_DOCS_SECTION}}

## Struktur Proyek
```
{{PROJECT_TREE}}
```

## Pengembangan

{{DEV_SECTION}}

## Berkontribusi

{{CONTRIBUTING_SECTION}}

## Lisensi

{{LICENSE_SECTION}}
```

LLM mengisi nilai `{{PLACEHOLDER}}`. Template menjamin tidak ada README yang kehilangan bagian yang diperlukan; LLM menjamin bahwa konten di setiap bagian bersifat spesifik untuk proyek tersebut.

### Menjaga Contoh Tetap Dapat Dijalankan dan Terversi

Kegagalan README paling umum adalah perintah instalasi yang tidak lagi berfungsi. `composer install && npm install && php artisan migrate` Anda berfungsi hari ini, tetapi bagaimana setelah Anda menambahkan dependensi Redis? LLM tidak akan mengetahuinya kecuali Anda memberikan konteks yang diperbarui.

**Strategi mitigasi:**

1. **Uji perintah README Anda di CI.** Tambahkan job GitHub Actions yang mengkloning salinan baru dan menjalankan setiap perintah di bagian instalasi README. Jika ada perintah yang gagal, build gagal.
2. **Version-lock template README Anda.** Simpan di repo (`docs/README.template.md`) dan tinjau perubahan di PR.
3. **Regenerasi hanya bagian yang berubah.** Jangan meregenerasi seluruh README dari awal setiap kali. Sebaliknya, beri prompt LLM dengan "Perbarui bagian Instalasi untuk menyertakan persyaratan Redis yang baru."

### Kapan README yang Dihasilkan LLM Cukup Baik

README yang dihasilkan LLM cukup ketika:
- Proyek adalah tugas kuliah dengan satu pengembang.
- Proyek adalah prototipe dengan masa pakai yang singkat.
- Proyek mengikuti konvensi Laravel yang sangat standar (data pelatihan LLM kaya di sini).

README yang dihasilkan LLM membutuhkan pengeditan manusia yang substansial ketika:
- Proyek memiliki dependensi sistem yang tidak biasa (ekstensi PHP spesifik, versi database legacy, paket proprietary).
- Proyek sensitif terhadap keamanan dan perintah README dapat menyesatkan pengguna ke konfigurasi yang tidak aman.
- Proyek adalah output riset di mana deskripsi metodologi yang tepat penting untuk reproduksibilitas.

</section>

---

<section lang="en">

## Inline Comments, Commit Summaries, and Changelogs

Documentation is not only the files in a `/docs` directory. It lives in PHPDoc blocks above methods, in commit messages that explain *why* a change was made, and in changelogs that communicate what each release contains.

### Generating PHPDoc Blocks with LLMs

PHPDoc blocks serve two audiences: the IDE (autocompletion, type inference) and the developer (what does this method do?). LLMs can generate both parts simultaneously.

**Write your method, then prompt the LLM:**

> "Generate a PHPDoc block for this method. Include a one-line description, all @params with type and description, @return with type and description, and @throws for any exceptions."

**LLM output:**

```php
/**
 * Enrol a student in a course after validating prerequisites.
 *
 * Checks that the student has completed all prerequisite courses,
 * that the course has available capacity, and that the enrolment
 * window for the semester is still open.
 *
 * @param  int  $studentId  The authenticated student's ID
 * @param  int  $courseId   The target course ID
 * @param  string|null  $enrolmentCode  Unique enrolment code from the registration system (nullable for manual enrolment)
 * @return Enrolment  The newly created enrolment record
 *
 * @throws PrerequisiteNotMetException  If the student has not completed all required prerequisites
 * @throws CourseFullException  If the course has reached maximum capacity
 * @throws EnrolmentClosedException  If the semester enrolment window has already closed
 * @throws AlreadyEnrolledException  If the student is already enrolled in this course
 */
public function enrol(int $studentId, int $courseId, ?string $enrolmentCode = null): Enrolment
{
    // ...
}
```

The PHPDoc block adds zero runtime behaviour, but it saves the next developer (which may be you in six months) from reading the implementation to understand what the method does and what can go wrong.

### Commit Message Summarisation

Commit messages suffer from two opposing problems: they are either too vague ("fix bug") or too detailed (a 40-line prose explaining a one-line change). LLMs can summarise `git diff` output into conventional-commit format.

**Script: `scripts/gen-commit-msg.sh`:**

```bash
#!/bin/bash
# Generates a commit message from staged changes using an LLM.
# Usage: git add -A && scripts/gen-commit-msg.sh

DIFF=$(git diff --cached)
if [ -z "$DIFF" ]; then
  echo "No staged changes."
  exit 1
fi

PROMPT="You are an expert commit message writer. Below is a git diff.
Write a single commit message in conventional commit format:
  type(scope): short description
  - type: feat, fix, docs, refactor, test, chore
  - scope: optional
  - description: imperative mood, <=72 chars
Return ONLY the commit message. No explanation.

$DIFF"

# Replace with your LLM endpoint (OpenAI, Ollama, etc.)
RESPONSE=$(curl -s https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d "$(jq -n --arg content "$PROMPT" '{
    model: "gpt-4o-mini",
    messages: [{role: "user", content: $content}],
    temperature: 0.3
  }')")

echo "$RESPONSE" | jq -r '.choices[0].message.content'
```

Run it:

```bash
$ git add -A && bash scripts/gen-commit-msg.sh
feat(enrolment): add prerequisite validation before course enrolment
```

**Review the message before committing.** The LLM may misclassify a `fix` as a `feat` or invent a scope that does not exist. Always read and edit.

### Generating CHANGELOG Entries

A CHANGELOG answers the question: "What changed between version X and version Y?" It is the product-facing sibling of commit messages. You can generate a CHANGELOG draft by feeding the LLM all commits between two tags:

**Script: `scripts/gen-changelog.sh`:**

```bash
#!/bin/bash
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "initial")
COMMITS=$(git log ${LAST_TAG}..HEAD --oneline --no-merges)

PROMPT="You are a release manager. Below are commits since the last release ($LAST_TAG).
Group them into sections: Added, Changed, Fixed, Removed.
Write one bullet point per logical change. Merge related commits.
Return the CHANGELOG in Markdown.

Commits:
$COMMITS"

echo "$PROMPT" | curl -s https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d "$(jq -n --arg content "$PROMPT" '{
    model: "gpt-4o-mini",
    messages: [{role: "user", content: $content}],
    temperature: 0.3
  }')" | jq -r '.choices[0].message.content'
```

### Warning: Do Not Automate Commit Messages Blindly

**Never hook commit message generation into a pre-commit or post-commit hook.** Commit messages are a permanent part of your project's history. An LLM-generated message that misrepresents a change is worse than a vague human-written message. Always generate, review, and manually edit before committing.

### Docstring Conventions for LLM-Friendly Code

LLMs produce better documentation when your code follows consistent conventions:

1. **Use typed properties and return types.** `public function enrol(int $studentId, int $courseId): Enrolment` gives the LLM more context than `public function enrol($studentId, $courseId)`.
2. **Name things precisely.** `calculateDiscountForGoldMember()` trumps `doStuff()`. The LLM infers documentation from names.
3. **Keep methods small.** A method with 3 parameters and 10 lines of code is easy for an LLM to document. A method with 8 parameters and 200 lines will produce a vague or hallucinated docblock.
4. **Use enums for discrete values.** `enum MemberLevel { case Gold; case Silver; }` gives the LLM a finite set to document. A `string $level` leaves it guessing.

</section>

<section lang="id">

## Komentar Inline, Ringkasan Commit, dan Changelog

Dokumentasi bukan hanya file di direktori `/docs`. Ia hidup di blok PHPDoc di atas metode, di pesan commit yang menjelaskan *mengapa* perubahan dibuat, dan di changelog yang mengomunikasikan apa yang terkandung dalam setiap rilis.

### Menghasilkan Blok PHPDoc dengan LLM

Blok PHPDoc melayani dua audiens: IDE (autocompletion, inferensi tipe) dan pengembang (apa yang dilakukan metode ini?). LLM dapat menghasilkan keduanya secara bersamaan.

**Tulis metode Anda, lalu beri prompt LLM:**

> "Buatkan blok PHPDoc untuk metode ini. Sertakan deskripsi satu baris, semua @params dengan tipe dan deskripsi, @return dengan tipe dan deskripsi, dan @throws untuk setiap exception."

**Output LLM:**

```php
/**
 * Mendaftarkan mahasiswa ke mata kuliah setelah memvalidasi prasyarat.
 *
 * Memeriksa bahwa mahasiswa telah menyelesaikan semua mata kuliah prasyarat,
 * bahwa mata kuliah memiliki kapasitas tersedia, dan bahwa jendela
 * pendaftaran untuk semester masih terbuka.
 *
 * @param  int  $studentId  ID mahasiswa yang terautentikasi
 * @param  int  $courseId   ID mata kuliah target
 * @param  string|null  $enrolmentCode  Kode pendaftaran unik dari sistem registrasi (nullable untuk pendaftaran manual)
 * @return Enrolment  Catatan pendaftaran yang baru dibuat
 *
 * @throws PrerequisiteNotMetException  Jika mahasiswa belum menyelesaikan semua prasyarat yang diperlukan
 * @throws CourseFullException  Jika mata kuliah telah mencapai kapasitas maksimum
 * @throws EnrolmentClosedException  Jika jendela pendaftaran semester telah ditutup
 * @throws AlreadyEnrolledException  Jika mahasiswa sudah terdaftar di mata kuliah ini
 */
public function enrol(int $studentId, int $courseId, ?string $enrolmentCode = null): Enrolment
{
    // ...
}
```

Blok PHPDoc tidak menambahkan perilaku runtime apa pun, tetapi ia menyelamatkan pengembang berikutnya (yang mungkin adalah Anda dalam enam bulan) dari membaca implementasi untuk memahami apa yang dilakukan metode dan apa yang bisa salah.

### Peringkasan Pesan Commit

Pesan commit menderita dua masalah yang berlawanan: terlalu kabur ("perbaiki bug") atau terlalu detail (prosa 40 baris menjelaskan perubahan satu baris). LLM dapat meringkas output `git diff` ke dalam format conventional-commit.

**Skrip: `scripts/gen-commit-msg.sh`:**

```bash
#!/bin/bash
# Menghasilkan pesan commit dari perubahan staged menggunakan LLM.
# Penggunaan: git add -A && scripts/gen-commit-msg.sh

DIFF=$(git diff --cached)
if [ -z "$DIFF" ]; then
  echo "Tidak ada perubahan staged."
  exit 1
fi

PROMPT="Anda adalah penulis pesan commit ahli. Di bawah ini adalah git diff.
Tulis satu pesan commit dalam format conventional commit:
  type(scope): deskripsi singkat
  - type: feat, fix, docs, refactor, test, chore
  - scope: opsional
  - deskripsi: mood imperatif, <=72 karakter
Kembalikan HANYA pesan commit. Tidak ada penjelasan.

$DIFF"

# Ganti dengan endpoint LLM Anda (OpenAI, Ollama, dll.)
RESPONSE=$(curl -s https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d "$(jq -n --arg content "$PROMPT" '{
    model: "gpt-4o-mini",
    messages: [{role: "user", content: $content}],
    temperature: 0.3
  }')")

echo "$RESPONSE" | jq -r '.choices[0].message.content'
```

Jalankan:

```bash
$ git add -A && bash scripts/gen-commit-msg.sh
feat(enrolment): tambahkan validasi prasyarat sebelum pendaftaran mata kuliah
```

**Tinjau pesan sebelum commit.** LLM mungkin salah mengklasifikasikan `fix` sebagai `feat` atau menciptakan scope yang tidak ada. Selalu baca dan edit.

### Menghasilkan Entri CHANGELOG

CHANGELOG menjawab pertanyaan: "Apa yang berubah antara versi X dan versi Y?" Ini adalah saudara kandung pesan commit yang menghadap produk. Anda dapat menghasilkan draf CHANGELOG dengan memberi LLM semua commit antara dua tag:

**Skrip: `scripts/gen-changelog.sh`:**

```bash
#!/bin/bash
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "initial")
COMMITS=$(git log ${LAST_TAG}..HEAD --oneline --no-merges)

PROMPT="Anda adalah release manager. Di bawah ini adalah commit sejak rilis terakhir ($LAST_TAG).
Kelompokkan ke dalam bagian: Added, Changed, Fixed, Removed.
Tulis satu bullet point per perubahan logis. Gabungkan commit terkait.
Kembalikan CHANGELOG dalam Markdown.

Commit:
$COMMITS"

echo "$PROMPT" | curl -s https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d "$(jq -n --arg content "$PROMPT" '{
    model: "gpt-4o-mini",
    messages: [{role: "user", content: $content}],
    temperature: 0.3
  }')" | jq -r '.choices[0].message.content'
```

### Peringatan: Jangan Otomatisasi Pesan Commit Secara Buta

**Jangan pernah mengaitkan generasi pesan commit ke dalam pre-commit atau post-commit hook.** Pesan commit adalah bagian permanen dari riwayat proyek Anda. Pesan yang dihasilkan LLM dan salah merepresentasikan perubahan lebih buruk daripada pesan samar yang ditulis manusia. Selalu hasilkan, tinjau, dan edit secara manual sebelum commit.

### Konvensi Docstring untuk Kode Ramah-LLM

LLM menghasilkan dokumentasi yang lebih baik ketika kode Anda mengikuti konvensi yang konsisten:

1. **Gunakan properti bertipe dan tipe pengembalian.** `public function enrol(int $studentId, int $courseId): Enrolment` memberi LLM lebih banyak konteks daripada `public function enrol($studentId, $courseId)`.
2. **Beri nama dengan tepat.** `calculateDiscountForGoldMember()` mengalahkan `doStuff()`. LLM menyimpulkan dokumentasi dari nama.
3. **Jaga metode tetap kecil.** Metode dengan 3 parameter dan 10 baris kode mudah didokumentasikan oleh LLM. Metode dengan 8 parameter dan 200 baris akan menghasilkan docblock yang samar atau dihalusinasi.
4. **Gunakan enum untuk nilai diskrit.** `enum MemberLevel { case Gold; case Silver; }` memberi LLM himpunan terbatas untuk didokumentasikan. `string $level` membuatnya menebak-nebak.

</section>

---

<section lang="en">

## Review and Validation Workflow

The single most important rule of LLM-assisted documentation is: **you are the reviewer, not the LLM.** The LLM drafts. You inspect, correct, and approve. Nothing goes into production without human eyes on it.

### The Review Checklist

For every LLM-generated documentation artifact, apply this checklist before committing:

| Check | Question | Common LLM Failure |
|---|---|---|
| **Accuracy** | Are the described features, parameters, and behaviours actually present in the code? | Hallucinated endpoints, non-existent parameters, wrong response codes |
| **Completeness** | Does the documentation cover all public methods, all endpoints, all configuration options? | Omitted edge-case behaviour, skipped error responses |
| **Currency** | Does the documentation reflect the current state of the code (not a stale version)? | LLMs have a knowledge cutoff date and do not know what you changed yesterday |
| **Consistency** | Does the terminology match the rest of the project? Same terms for same concepts everywhere? | Inconsistent naming (User vs Account vs Customer) |
| **Clarity** | Can a new developer understand the documentation without reading the code? | Overly generic descriptions that add no value |
| **Executability** | Do the installation commands, code examples, and API calls actually work? | Commands missing flags, wrong dependency versions |
| **Security** | Does the documentation expose secrets, suggest insecure configurations, or omit security warnings? | Hardcoded API keys in examples, missing "⚠️ production" warnings |

### Hallucination Detection Techniques

LLM hallucinations in documentation are hard to spot because the text *looks* authoritative. Use these techniques to catch them:

1. **Diff against reality.** Run the commands the LLM wrote. If `php artisan some:command` returns "Command not found," the LLM hallucinated.
2. **Cross-reference with code.** For every described endpoint, search for the corresponding route. For every described parameter, find the matching validation rule.
3. **Ask the LLM to cite its sources.** Prompt: "For each claim in this documentation, indicate which file and line number supports it." The LLM will either cite real code (good) or fabricate file paths (caught).
4. **Review with a teammate.** A fresh pair of eyes catches hallucinations that you, having worked with the code all day, gloss over.

### Keeping Docs in Sync with Code

Static documentation rots. Here are three strategies to combat rot:

**Strategy 1: Docs-As-Code**

Store documentation in the same repository as the code. When a PR changes code, the same PR must update the relevant documentation. This makes doc updates visible in code review.

```
project/
├── src/           # application code
├── docs/          # documentation (MkDocs source)
│   ├── api.md
│   ├── setup.md
│   └── ...
├── tests/
└── README.md
```

**Strategy 2: Automated Drift Detection**

Write a CI script that compares documented endpoints against actual routes. If the number of routes changes, the build warns.

**`.github/workflows/doc-drift.yml`**:

```yaml
name: Documentation Drift Check
on: [pull_request]
jobs:
  drift:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: composer install --no-interaction
      - name: Count documented endpoints
        run: grep -c '@response' app/Http/Controllers/Api/*.php > /tmp/documented.txt
      - name: Count actual routes
        run: php artisan route:list --json | jq '. | length' > /tmp/actual.txt
      - name: Compare
        run: |
          DOCUMENTED=$(cat /tmp/documented.txt)
          ACTUAL=$(cat /tmp/actual.txt)
          if [ "$DOCUMENTED" -lt "$ACTUAL" ]; then
            echo "::warning:: $((ACTUAL - DOCUMENTED)) undocumented routes. Update API docs."
          fi
```

**Strategy 3: Scheduled Re-Generation**

Run Scribe + LLM enrichment on a schedule (e.g., weekly) to refresh documentation automatically. The generated output goes to a PR that a human reviews and merges. This prevents slow, invisible drift over months.

### The Human-in-the-Loop Contract

This is the non-negotiable contract of LLM-assisted documentation:

```
LLM's responsibility: Produce a complete, structured first draft in <10 seconds.
Your responsibility:      Verify every claim, correct every error, and approve every word
                           before it reaches another human being.
```

If you skip the second half, you have not automated documentation: you have automated misinformation.

</section>

<section lang="id">

## Alur Kerja Tinjauan dan Validasi

Aturan paling penting dari dokumentasi berbantuan LLM adalah: **Anda adalah peninjau, bukan LLM.** LLM membuat draf. Anda memeriksa, mengoreksi, dan menyetujui. Tidak ada yang masuk ke produksi tanpa mata manusia melihatnya.

### Daftar Periksa Tinjauan

Untuk setiap artefak dokumentasi yang dihasilkan LLM, terapkan daftar periksa ini sebelum commit:

| Pemeriksaan | Pertanyaan | Kegagalan Umum LLM |
|---|---|---|
| **Akurasi** | Apakah fitur, parameter, dan perilaku yang dijelaskan benar-benar ada dalam kode? | Endpoint yang dihalusinasi, parameter yang tidak ada, kode respons yang salah |
| **Kelengkapan** | Apakah dokumentasi mencakup semua metode publik, semua endpoint, semua opsi konfigurasi? | Perilaku edge case yang dihilangkan, respons error yang dilewati |
| **Kekinian** | Apakah dokumentasi mencerminkan status kode saat ini (bukan versi usang)? | LLM memiliki tanggal batas pengetahuan dan tidak tahu apa yang Anda ubah kemarin |
| **Konsistensi** | Apakah terminologi cocok dengan proyek lainnya? Istilah yang sama untuk konsep yang sama di mana-mana? | Penamaan tidak konsisten (User vs Account vs Customer) |
| **Kejelasan** | Dapatkah pengembang baru memahami dokumentasi tanpa membaca kode? | Deskripsi terlalu generik yang tidak menambah nilai |
| **Eksekutabilitas** | Apakah perintah instalasi, contoh kode, dan panggilan API benar-benar berfungsi? | Perintah kehilangan flag, versi dependensi salah |
| **Keamanan** | Apakah dokumentasi mengekspos rahasia, menyarankan konfigurasi tidak aman, atau menghilangkan peringatan keamanan? | Kunci API hardcoded dalam contoh, peringatan "⚠️ production" hilang |

### Teknik Deteksi Halusinasi

Halusinasi LLM dalam dokumentasi sulit dikenali karena teksnya *terlihat* otoritatif. Gunakan teknik ini untuk menangkapnya:

1. **Diff terhadap kenyataan.** Jalankan perintah yang ditulis LLM. Jika `php artisan some:command` mengembalikan "Command not found", LLM berhalusinasi.
2. **Referensi silang dengan kode.** Untuk setiap endpoint yang dijelaskan, cari rute yang sesuai. Untuk setiap parameter yang dijelaskan, temukan aturan validasi yang cocok.
3. **Minta LLM mengutip sumbernya.** Prompt: "Untuk setiap klaim dalam dokumentasi ini, tunjukkan file dan nomor baris mana yang mendukungnya." LLM akan mengutip kode nyata (baik) atau membuat jalur file palsu (tertangkap).
4. **Tinjau dengan rekan tim.** Sepasang mata segar menangkap halusinasi yang Anda, setelah bekerja dengan kode sepanjang hari, lewatkan begitu saja.

### Menjaga Dokumen Sinkron dengan Kode

Dokumentasi statis membusuk. Berikut adalah tiga strategi untuk melawan pembusukan:

**Strategi 1: Docs-As-Code**

Simpan dokumentasi di repositori yang sama dengan kode. Ketika PR mengubah kode, PR yang sama harus memperbarui dokumentasi yang relevan. Ini membuat pembaruan dokumen terlihat dalam code review.

```
project/
├── src/           # kode aplikasi
├── docs/          # dokumentasi (sumber MkDocs)
│   ├── api.md
│   ├── setup.md
│   └── ...
├── tests/
└── README.md
```

**Strategi 2: Deteksi Drift Otomatis**

Tulis skrip CI yang membandingkan endpoint yang didokumentasikan dengan rute aktual. Jika jumlah rute berubah, build memperingatkan.

**`.github/workflows/doc-drift.yml`**:

```yaml
name: Pemeriksaan Drift Dokumentasi
on: [pull_request]
jobs:
  drift:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: composer install --no-interaction
      - name: Hitung endpoint yang didokumentasikan
        run: grep -c '@response' app/Http/Controllers/Api/*.php > /tmp/documented.txt
      - name: Hitung rute aktual
        run: php artisan route:list --json | jq '. | length' > /tmp/actual.txt
      - name: Bandingkan
        run: |
          DOCUMENTED=$(cat /tmp/documented.txt)
          ACTUAL=$(cat /tmp/actual.txt)
          if [ "$DOCUMENTED" -lt "$ACTUAL" ]; then
            echo "::warning:: $((ACTUAL - DOCUMENTED)) rute tidak terdokumentasi. Perbarui dokumen API."
          fi
```

**Strategi 3: Regenerasi Terjadwal**

Jalankan Scribe + pengayaan LLM sesuai jadwal (mis. mingguan) untuk menyegarkan dokumentasi secara otomatis. Output yang dihasilkan masuk ke PR yang ditinjau dan digabungkan oleh manusia. Ini mencegah drift lambat dan tak terlihat selama berbulan-bulan.

### Kontrak Human-in-the-Loop

Ini adalah kontrak yang tidak dapat dinegosiasikan dari dokumentasi berbantuan LLM:

```
Tanggung jawab LLM: Menghasilkan draf pertama yang lengkap dan terstruktur dalam <10 detik.
Tanggung jawab Anda:   Memverifikasi setiap klaim, mengoreksi setiap kesalahan, dan menyetujui
                        setiap kata sebelum mencapai manusia lain.
```

Jika Anda melewatkan bagian kedua, Anda tidak mengotomatisasi dokumentasi, melainkan mengotomatisasi misinformasi.

</section>

---

<section lang="en">

## Hands-On Exercise: Document a Course Registration API

You will now apply everything you have learned. The task is to document a simplified Laravel course registration API. You will use Scribe for the skeleton and an LLM for the prose.

### The Controller

Create `app/Http/Controllers/Api/RegistrationController.php`:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrolment;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegistrationController extends Controller
{
    /**
     * List all courses available for registration
     *
     * Returns courses that are active and have available capacity.
     * Courses where the student is already enrolled are excluded.
     */
    public function availableCourses(Request $request): JsonResponse
    {
        $student = Student::findOrFail($request->user()->student_id);

        $alreadyEnrolled = Enrolment::where('student_id', $student->id)
            ->pluck('course_id');

        $courses = Course::query()
            ->where('semester', '2025-1')
            ->where('status', 'active')
            ->where('capacity', '>', 0)
            ->whereNotIn('id', $alreadyEnrolled)
            ->with('lecturer:id,name')
            ->get()
            ->map(fn ($c) => [
                'id'          => $c->id,
                'code'        => $c->code,
                'name'        => $c->name,
                'credits'     => $c->credits,
                'lecturer'    => $c->lecturer->name,
                'schedule'    => $c->schedule,
                'capacity'    => $c->capacity,
                'enrolled'    => $c->enrolments()->count(),
                'available'   => $c->capacity - $c->enrolments()->count(),
            ]);

        return response()->json(['data' => $courses]);
    }

    /**
     * Register a student in a course
     *
     * Validates prerequisites, capacity, and schedule conflicts
     * before creating the enrolment record.
     */
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
        ]);

        $student = Student::findOrFail($request->user()->student_id);
        $course = Course::findOrFail($request->input('course_id'));

        if (Enrolment::where('student_id', $student->id)->where('course_id', $course->id)->exists()) {
            return response()->json(['message' => 'Already enrolled in this course.'], 409);
        }

        if ($course->capacity <= $course->enrolments()->count()) {
            return response()->json(['message' => 'Course is full.'], 422);
        }

        $prerequisites = $course->prerequisites()->pluck('prerequisite_id');
        $completed = $student->completedCourses()->pluck('course_id');
        $missing = $prerequisites->diff($completed);

        if ($missing->isNotEmpty()) {
            $missingCourses = Course::whereIn('id', $missing)->pluck('name');
            return response()->json([
                'message' => 'Prerequisites not met.',
                'missing_prerequisites' => $missingCourses,
            ], 422);
        }

        $enrolment = Enrolment::create([
            'student_id' => $student->id,
            'course_id'  => $course->id,
            'semester'   => '2025-1',
            'status'     => 'enrolled',
        ]);

        return response()->json(['data' => $enrolment], 201);
    }
}
```

### Your Task

**Step 1: Generate Scribe Docs**

Install Scribe if you have not already:
```bash
composer require --dev knuckleshtf/scribe
```

Generate the documentation skeleton:
```bash
php artisan scribe:generate
```

Open `public/docs/index.html` in your browser. Observe what Scribe captured and what it missed.

**Step 2: Enrich with LLM**

Copy the `RegistrationController` code into your LLM tool (Copilot Chat, ChatGPT, Ollama, etc.). Use this prompt:

> "Below is a Laravel course registration controller with two endpoints: `availableCourses` and `register`. For each endpoint, write enriched Scribe-compatible PHPDoc annotations that include:
> 1. A one-sentence summary.
> 2. A paragraph explaining the business logic.
> 3. All `@queryParam`/`@bodyParam` with types, requirements, constraints, and examples.
> 4. All possible `@response` codes (200, 201, 401, 409, 422) with example bodies.
> 5. A `@authenticated` tag for the class block.
>
> Pay special attention to the register endpoint, which handles four distinct failure modes that must be documented."

**Step 3: Apply the Review Checklist**

Before accepting the LLM's output, verify:

- [ ] Every `@response` code actually exists in the controller.
- [ ] The `409` conflict response for duplicate enrolment is described.
- [ ] The `422` response for missing prerequisites includes the `missing_prerequisites` field.
- [ ] The `availableCourses` response includes the computed `available` field.
- [ ] No hallucinated parameters (e.g., `@bodyParam grade`) are present.
- [ ] All example values use realistic Polinema course codes and names.

**Step 4: Detect Drift**

After you have enriched the documentation, intentionally add a new endpoint to the controller without documenting it:

```php
public function drop(Request $request): JsonResponse
{
    // Drop a course registration
}
```

Then run the drift check (or count manually):
```bash
grep -c '@response' app/Http/Controllers/Api/RegistrationController.php
php artisan route:list --json | jq '. | length'
```

How many undocumented routes did you catch?

**Step 5: Reflect**

Write down your answers to these questions:
1. Which part of the documentation did the LLM get right on the first try?
2. Which part required manual correction?
3. How long did it take you to review and fix the LLM output versus writing the documentation from scratch?
4. Would you trust an LLM-generated CHANGELOG for a production release without human review? Why or why not?

Discuss your experience with a classmate. Compare which LLM tool you used and how the outputs differed.

</section>

<section lang="id">

## Latihan Praktik: Dokumentasikan API Pendaftaran Mata Kuliah

Anda sekarang akan menerapkan semua yang telah dipelajari. Tugasnya adalah mendokumentasikan API pendaftaran mata kuliah Laravel yang disederhanakan. Anda akan menggunakan Scribe untuk kerangka dan LLM untuk prosa.

### Controller

Buat `app/Http/Controllers/Api/RegistrationController.php`:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrolment;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegistrationController extends Controller
{
    /**
     * Daftar semua mata kuliah yang tersedia untuk pendaftaran
     *
     * Mengembalikan mata kuliah yang aktif dan memiliki kapasitas tersedia.
     * Mata kuliah di mana mahasiswa sudah terdaftar dikecualikan.
     */
    public function availableCourses(Request $request): JsonResponse
    {
        $student = Student::findOrFail($request->user()->student_id);

        $alreadyEnrolled = Enrolment::where('student_id', $student->id)
            ->pluck('course_id');

        $courses = Course::query()
            ->where('semester', '2025-1')
            ->where('status', 'active')
            ->where('capacity', '>', 0)
            ->whereNotIn('id', $alreadyEnrolled)
            ->with('lecturer:id,name')
            ->get()
            ->map(fn ($c) => [
                'id'          => $c->id,
                'code'        => $c->code,
                'name'        => $c->name,
                'credits'     => $c->credits,
                'lecturer'    => $c->lecturer->name,
                'schedule'    => $c->schedule,
                'capacity'    => $c->capacity,
                'enrolled'    => $c->enrolments()->count(),
                'available'   => $c->capacity - $c->enrolments()->count(),
            ]);

        return response()->json(['data' => $courses]);
    }

    /**
     * Mendaftarkan mahasiswa ke mata kuliah
     *
     * Memvalidasi prasyarat, kapasitas, dan konflik jadwal
     * sebelum membuat catatan pendaftaran.
     */
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
        ]);

        $student = Student::findOrFail($request->user()->student_id);
        $course = Course::findOrFail($request->input('course_id'));

        if (Enrolment::where('student_id', $student->id)->where('course_id', $course->id)->exists()) {
            return response()->json(['message' => 'Sudah terdaftar di mata kuliah ini.'], 409);
        }

        if ($course->capacity <= $course->enrolments()->count()) {
            return response()->json(['message' => 'Mata kuliah penuh.'], 422);
        }

        $prerequisites = $course->prerequisites()->pluck('prerequisite_id');
        $completed = $student->completedCourses()->pluck('course_id');
        $missing = $prerequisites->diff($completed);

        if ($missing->isNotEmpty()) {
            $missingCourses = Course::whereIn('id', $missing)->pluck('name');
            return response()->json([
                'message' => 'Prasyarat tidak terpenuhi.',
                'missing_prerequisites' => $missingCourses,
            ], 422);
        }

        $enrolment = Enrolment::create([
            'student_id' => $student->id,
            'course_id'  => $course->id,
            'semester'   => '2025-1',
            'status'     => 'enrolled',
        ]);

        return response()->json(['data' => $enrolment], 201);
    }
}
```

### Tugas Anda

**Langkah 1: Hasilkan Dokumen Scribe**

Instal Scribe jika Anda belum:
```bash
composer require --dev knuckleshtf/scribe
```

Hasilkan kerangka dokumentasi:
```bash
php artisan scribe:generate
```

Buka `public/docs/index.html` di browser Anda. Amati apa yang ditangkap Scribe dan apa yang dilewatkannya.

**Langkah 2: Perkaya dengan LLM**

Salin kode `RegistrationController` ke alat LLM Anda (Copilot Chat, ChatGPT, Ollama, dll.). Gunakan prompt ini:

> "Di bawah ini adalah controller pendaftaran mata kuliah Laravel dengan dua endpoint: `availableCourses` dan `register`. Untuk setiap endpoint, tulis anotasi PHPDoc yang kompatibel dengan Scribe yang diperkaya yang mencakup:
> 1. Ringkasan satu kalimat.
> 2. Paragraf yang menjelaskan logika bisnis.
> 3. Semua `@queryParam`/`@bodyParam` dengan tipe, persyaratan, batasan, dan contoh.
> 4. Semua kode `@response` yang mungkin (200, 201, 401, 409, 422) dengan contoh body.
> 5. Tag `@authenticated` untuk blok kelas.
>
> Berikan perhatian khusus pada endpoint register: ia menangani empat mode kegagalan berbeda yang harus didokumentasikan."

**Langkah 3: Terapkan Daftar Periksa Tinjauan**

Sebelum menerima output LLM, verifikasi:

- [ ] Setiap kode `@response` benar-benar ada di controller.
- [ ] Respons konflik `409` untuk pendaftaran duplikat dijelaskan.
- [ ] Respons `422` untuk prasyarat yang hilang menyertakan field `missing_prerequisites`.
- [ ] Respons `availableCourses` menyertakan field `available` yang dihitung.
- [ ] Tidak ada parameter yang dihalusinasi (mis. `@bodyParam grade`) yang ada.
- [ ] Semua nilai contoh menggunakan kode dan nama mata kuliah Polinema yang realistis.

**Langkah 4: Deteksi Drift**

Setelah Anda memperkaya dokumentasi, secara sengaja tambahkan endpoint baru ke controller tanpa mendokumentasikannya:

```php
public function drop(Request $request): JsonResponse
{
    // Batalkan pendaftaran mata kuliah
}
```

Kemudian jalankan pemeriksaan drift (atau hitung secara manual):
```bash
grep -c '@response' app/Http/Controllers/Api/RegistrationController.php
php artisan route:list --json | jq '. | length'
```

Berapa banyak rute tidak terdokumentasi yang Anda tangkap?

**Langkah 5: Refleksikan**

Tulis jawaban Anda untuk pertanyaan-pertanyaan ini:
1. Bagian dokumentasi mana yang LLM lakukan dengan benar pada percobaan pertama?
2. Bagian mana yang memerlukan koreksi manual?
3. Berapa lama waktu yang dibutuhkan untuk meninjau dan memperbaiki output LLM versus menulis dokumentasi dari awal?
4. Apakah Anda akan mempercayai CHANGELOG yang dihasilkan LLM untuk rilis produksi tanpa tinjauan manusia? Mengapa atau mengapa tidak?

Diskusikan pengalaman Anda dengan teman sekelas. Bandingkan alat LLM mana yang Anda gunakan dan bagaimana outputnya berbeda.

</section>

---

<section lang="en">

## Further Reading

### SE Lab Resources

- **[Emerging Technologies in Software Engineering](https://se.polinema.ac.id/research/emerging-technologies-se/)**: The research stream that this tutorial belongs to. Explore the other four topics: Code Quality Analysis, Bug Prediction, AI Test Generation, and Requirements Automation.
- **[AI-Assisted Unit Test Generation with PHP](https://se.polinema.ac.id/blog/ai-assisted-unit-test-generation/)**: A companion tutorial on using LLMs to generate PHPUnit tests. Many of the review and validation principles apply to both test generation and documentation.
- **[Microservices Architecture Fundamentals](https://se.polinema.ac.id/blog/microservices-architecture-fundamentals/)**: A tutorial that demonstrates how documentation becomes a critical concern in distributed systems where each service has its own API.

### Official Documentation & Tools

- **[Scribe Documentation](https://scribe.knuckles.wtf/)**: Official guide for the Laravel API documentation generator used in this tutorial.
- **[PHPDoc Reference](https://docs.phpdoc.org/)**: Complete reference for PHPDoc tags and conventions.
- **[MkDocs Material](https://squidfunk.github.io/mkdocs-material/)**: Documentation site theme with search, navigation, and dark mode.
- **[Conventional Commits](https://www.conventionalcommits.org/)**: Specification for structured commit messages that machines (and LLMs) can parse.

### Research Papers & Articles

- **Requirements Traceability and Doc-to-Code Consistency**: Active research area within the SE Lab's Emerging Technologies stream. Automated traceability links between requirements documents, code, and tests reduce the risk of stale documentation.
- **Commit Summarisation with LLMs**: Several recent papers (2023–2025) evaluate LLMs for generating pull request descriptions, commit messages, and release notes. The SE Lab maintains a collection of relevant publications at the [research page](https://se.polinema.ac.id/research/).

### Related Tutorials

- **[Domain-Driven Design Fundamentals with PHP](https://se.polinema.ac.id/blog/domain-driven-design-fundamentals-php/)**: A tutorial that connects to documentation automation through the concept of Ubiquitous Language: when code mirrors domain language, documentation becomes an extension of the model, not a separate artifact.
- **[Clean Code Principles](https://se.polinema.ac.id/blog/clean-code-principles/)**: Clean code is its own form of documentation. Well-named methods and classes reduce the burden on external documentation, and make LLM-generated documentation more accurate by providing richer context.

</section>

<section lang="id">

## Bacaan Lebih Lanjut

### Sumber Daya SE Lab

- **[Emerging Technologies in Software Engineering](https://se.polinema.ac.id/research/emerging-technologies-se/)**: Alur riset tempat tutorial ini bernaung. Jelajahi empat topik lainnya: Analisis Kualitas Kode, Prediksi Bug, Generasi Test AI, dan Otomatisasi Kebutuhan.
- **[Pembuatan Unit Test Berbantuan AI dengan PHP](https://se.polinema.ac.id/blog/ai-assisted-unit-test-generation/)**: Tutorial pendamping tentang penggunaan LLM untuk menghasilkan pengujian PHPUnit. Banyak prinsip tinjauan dan validasi berlaku untuk generasi pengujian dan dokumentasi.
- **[Dasar-Dasar Arsitektur Microservices](https://se.polinema.ac.id/blog/microservices-architecture-fundamentals/)**: Tutorial yang mendemonstrasikan bagaimana dokumentasi menjadi perhatian kritis dalam sistem terdistribusi di mana setiap layanan memiliki API-nya sendiri.

### Dokumentasi & Alat Resmi

- **[Dokumentasi Scribe](https://scribe.knuckles.wtf/)**: Panduan resmi untuk generator dokumentasi API Laravel yang digunakan dalam tutorial ini.
- **[Referensi PHPDoc](https://docs.phpdoc.org/)**: Referensi lengkap untuk tag dan konvensi PHPDoc.
- **[MkDocs Material](https://squidfunk.github.io/mkdocs-material/)**: Tema situs dokumentasi dengan pencarian, navigasi, dan mode gelap.
- **[Conventional Commits](https://www.conventionalcommits.org/)**: Spesifikasi untuk pesan commit terstruktur yang dapat di-parse oleh mesin (dan LLM).

### Makalah & Artikel Riset

- **Ketertelusuran Kebutuhan dan Konsistensi Doc-to-Code**: Area riset aktif dalam alur Emerging Technologies SE Lab. Tautan ketertelusuran otomatis antara dokumen kebutuhan, kode, dan pengujian mengurangi risiko dokumentasi usang.
- **Peringkasan Commit dengan LLM**: Beberapa makalah terbaru (2023–2025) mengevaluasi LLM untuk menghasilkan deskripsi pull request, pesan commit, dan catatan rilis. SE Lab memelihara koleksi publikasi yang relevan di [halaman riset](https://se.polinema.ac.id/research/).

### Tutorial Terkait

- **[Dasar-Dasar Domain-Driven Design dengan PHP](https://se.polinema.ac.id/blog/domain-driven-design-fundamentals-php/)**: Tutorial yang terhubung ke otomatisasi dokumentasi melalui konsep Ubiquitous Language: ketika kode mencerminkan bahasa domain, dokumentasi menjadi perpanjangan dari model, bukan artefak terpisah.
- **[Prinsip Clean Code](https://se.polinema.ac.id/blog/clean-code-principles/)**: Clean code adalah bentuk dokumentasi tersendiri. Metode dan kelas yang dinamai dengan baik mengurangi beban pada dokumentasi eksternal, dan membuat dokumentasi yang dihasilkan LLM lebih akurat dengan menyediakan konteks yang lebih kaya.

</section>
