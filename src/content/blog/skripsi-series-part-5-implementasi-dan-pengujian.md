---
title: "Skripsi Mini Series Part 5: Implementation and Testing (Implementasi dan Pengujian)"
titleId: "Seri Mini Skripsi Bagian 5: Implementasi dan Pengujian"
date: 2026-07-14
updated: 2026-07-15
category: tutorial
author: SE Lab
lang: en
featured: false
excerpt: "Part 5 of the Skripsi Mini Series. Learn how to write Chapter 5: Implementation and Testing: setting up the environment, implementing the database, writing the PHP code for the Action Pattern implementation, documenting prototype iterations, and running Black Box and unit tests."
excerptId: "Bagian 5 dari Seri Mini Skripsi. Pelajari cara menulis BAB V (Implementasi dan Pengujian): menyiapkan environment, mengimplementasikan database, menulis kode PHP untuk implementasi Action Pattern, mendokumentasikan iterasi prototipe, serta menjalankan pengujian Black Box dan unit test."
stream: se-methodologies-architecture
tags:
  - Thesis
  - Research Methodology
  - Laravel
  - Software Engineering
tagsId:
  - Skripsi
  - Metodologi Penelitian
  - Laravel
  - Rekayasa Perangkat Lunak
series: skripsi-mini-series
seriesOrder: 5
---

<section lang="en">

## 1. What is Chapter 5: Implementation and Testing (BAB V: Implementasi dan Pengujian)?

**Chapter 5** is where the design from Chapter 4 becomes running code, and where the test plan from Chapter 4, Section 4.4 gets executed. It has five subsections:

| Subsection | Purpose |
|---|---|
| **5.1 Implementation Environment** | Software and hardware environment used |
| **5.2 Database Implementation** | Database schema/migrations |
| **5.3 Interface Implementation** | Views/templates implementing the wireframes |
| **5.4 Core Algorithm Implementation** | The core logic we actually build: the Action Pattern `TodoController` and its Action classes, plus a log of how the prototype evolved |
| **5.5 Testing Implementation** | Running the metric-measurement tools, and executing the Black Box and UAT scenarios planned in Chapter 4 |

**SE angle:** this is also where you practise real engineering discipline: version control, small commits, and continuous testing rather than a single "big bang" implementation at the end.

</section>

<section lang="id">

## 1. Apa Itu BAB V: Implementasi dan Pengujian?

**BAB V** adalah tempat desain (BAB IV) menjadi kode yang berjalan, dan tempat rencana pengujian (BAB IV bagian 4.4) dieksekusi. Bab ini memiliki lima subbab:

| Subbab | Tujuan |
|---|---|
| **5.1 Lingkungan Implementasi** | Lingkungan software dan hardware yang digunakan |
| **5.2 Implementasi Basis Data** | Skema/migration database |
| **5.3 Implementasi Antarmuka** | View/template yang mengimplementasikan wireframe |
| **5.4 Implementasi Algoritma Inti** | Logika inti yang benar-benar dibangun oleh penelitian ini: `TodoController` Action Pattern dan kelas Action-nya, ditambah log bagaimana prototipe berevolusi |
| **5.5 Implementasi Pengujian** | Menjalankan tool pengukuran metrik, dan mengeksekusi skenario Black Box dan UAT yang direncanakan di BAB IV |

**Sudut pandang SE:** di sinilah Anda juga melatih disiplin rekayasa yang sesungguhnya: version control, commit kecil, dan pengujian berkelanjutan alih-alih implementasi "big bang" tunggal di akhir.

</section>

---

<section lang="en">

## 2. Why Getting Implementation and Testing Right Matters

### What is it?
This chapter is evidence that your design from Chapter 4 actually works: every design decision must show up as running, tested code.

### Why does it matter?
- **It is where your evaluation becomes real data.** Cyclomatic complexity, coupling, LOC, and coverage cannot be measured against a diagram. They require compiled, runnable code, and the tools that measure them must actually be run, not just named in Chapter 3.
- **Continuous testing prevents a week-16 crisis.** Running your test suite after every feature, not once at the end, catches regressions while they're cheap to fix.
- **Version control is your safety net, and your Prototyping evidence.** Chapter 3 chose Prototyping, a methodology built around iterative refinement. Your commit history is what proves the "build, evaluate, refine" loop actually happened, not just that a final version exists.
- **A precondition without a test is a self-claim.** Chapter 4 declared "User is authenticated" and scoped `Todo` by `user_id`. That claim only becomes real evidence once a test actually tries to violate it and confirms the violation is blocked.

### When do you use it?
Build incrementally, feature by feature, immediately following Chapter 4's completed design, not all at once in the final weeks (see the timeline in Part 3).

### Where does it fit?
Chapter 5's code is the direct object measured in Chapter 6: every number Chapter 6 reports must trace back to a specific file, class, tool run, or test run in Chapter 5.

### How do you create one?
1. Document your environment precisely (so anyone can reproduce your measurements).
2. Implement the database schema, including any columns a stated precondition requires.
3. Build the views.
4. Implement the Action Pattern logic feature by feature, committing each separately, and keep a short log of meaningful iterations rather than every commit.
5. Run the metric-measurement tools defined in Chapter 3, Section 3.5, and record their raw output.
6. Run the Black Box and UAT scenarios from Chapter 4, Section 4.4 against the implementation, including the scenario that tests the precondition itself.

</section>

<section lang="id">

## 2. Mengapa Menulis Implementasi dan Pengujian dengan Benar Itu Penting?

### Apa itu?
Bab ini adalah bukti bahwa desain Anda (BAB IV) benar-benar berfungsi: setiap keputusan desain harus muncul sebagai kode yang berjalan dan teruji.

### Mengapa penting?
- **Di sinilah evaluasi Anda menjadi data nyata.** *Cyclomatic complexity*, *coupling*, LOC, dan *coverage* tidak dapat diukur terhadap diagram; membutuhkan kode yang ter-compile dan dapat dijalankan, dan tool yang mengukurnya harus benar-benar dijalankan, bukan hanya disebutkan di BAB III.
- **Pengujian berkelanjutan mencegah krisis minggu ke-16.** Menjalankan test suite Anda setelah setiap fitur, bukan sekali di akhir, menangkap regresi selagi murah untuk diperbaiki.
- **Version control adalah pelindung utama Anda, sekaligus bukti Prototyping Anda.** Karena BAB III memilih Prototyping, metodologi yang dibangun di sekitar penyempurnaan iteratif, riwayat commit Anda membuktikan bahwa loop "bangun, evaluasi, sempurnakan" benar-benar terjadi, bukan hanya bahwa versi akhir ada.
- **Prasyarat tanpa test adalah klaim sepihak.** BAB IV menyatakan "User terautentikasi" dan membatasi `Todo` dengan `user_id`; klaim itu baru menjadi bukti nyata setelah sebuah test benar-benar mencoba melanggarnya dan mengonfirmasi bahwa itu diblokir.

### Kapan digunakan?
Bangun secara bertahap, fitur demi fitur, segera setelah desain BAB IV selesai, bukan sekaligus di minggu-minggu akhir (lihat linimasa di Bagian 3).

### Di mana tempatnya?
Kode BAB V adalah objek langsung yang diukur di BAB VI: setiap angka yang dilaporkan di sana harus tertelusur ke file, kelas, hasil eksekusi tool, atau hasil eksekusi test spesifik di sini.

### Bagaimana membuatnya?
1. Dokumentasikan *environment* Anda secara presisi (agar siapa pun dapat mereproduksi pengukuran Anda).
2. Implementasikan skema database, termasuk kolom apa pun yang dibutuhkan prasyarat yang dinyatakan.
3. Bangun view.
4. Implementasikan logika Action Pattern fitur demi fitur, commit masing-masing secara terpisah, dan simpan log singkat berisi iterasi yang bermakna, bukan setiap commit.
5. Jalankan tool pengukuran metrik yang didefinisikan di BAB III bagian 3.5, dan catat output mentahnya.
6. Jalankan skenario Black Box dan UAT dari BAB IV bagian 4.4 terhadap implementasi, termasuk skenario yang menguji prasyaratnya sendiri.

</section>

---

<section lang="en">

## 3. 5.1 Implementation Environment (Lingkungan Implementasi)

| Category | Item |
|---|---|
| **Software** | PHP 8.3, Laravel 11, MySQL 8, Composer 2, PHPUnit 11, PHPMD 2.x |
| **Hardware** | Any development machine capable of running the above (document your actual specs for reproducibility) |

## 4. 5.2 Database Implementation (Implementasi Basis Data)

The `user_id` column directly implements the authentication precondition stated in Chapter 4, Section 4.1: it turns "User is authenticated" from a design assertion into an enforceable constraint.

```php
// database/migrations/xxxx_xx_xx_create_todos_table.php
Schema::create('todos', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('title');
    $table->text('description')->nullable();
    $table->boolean('is_completed')->default(false);
    $table->timestamps();
});
```

## 5. 5.3 Interface Implementation (Implementasi Antarmuka)

The Blade view implements the wireframe from Chapter 4, Section 4.3: a single `index.blade.php` with a form, filter tabs, a todo list partial, and a confirmation dialog before delete requests are submitted.

## 6. 5.4 Core Algorithm Implementation (Implementasi Algoritma Inti)

This section is where Chapter 4's Class Diagrams become real code. What follows first is the implementation this project actually builds, tests, and measures, matching every class and method the Class Diagram promised.

### Action Pattern (Implemented and Measured)

```php
class TodoController extends Controller
{
    public function index(Request $request, FilterTodosAction $action)
    {
        $status = $request->query('status', 'all');
        $todos = $action->execute(auth()->id(), $status);

        return view('todos.index', compact('todos'));
    }

    public function store(Request $request, CreateTodoAction $action)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $action->execute($validated, auth()->id());

        return redirect()->route('todos.index')->with('success', 'Todo created.');
    }

    public function update(Request $request, Todo $todo, UpdateTodoAction $action)
    {
        abort_unless($todo->user_id === auth()->id(), 403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $action->execute($todo, $validated);

        return redirect()->route('todos.index')->with('success', 'Todo updated.');
    }

    public function toggle(Todo $todo, ToggleTodoAction $action)
    {
        abort_unless($todo->user_id === auth()->id(), 403);

        $action->execute($todo);

        return redirect()->route('todos.index')->with('success', 'Todo status updated.');
    }

    public function destroy(Todo $todo, DeleteTodoAction $action)
    {
        abort_unless($todo->user_id === auth()->id(), 403);

        $action->execute($todo);

        return redirect()->route('todos.index')->with('success', 'Todo deleted.');
    }
}

class CreateTodoAction
{
    public function execute(array $data, int $userId): Todo
    {
        return Todo::create([
            'user_id' => $userId,
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'is_completed' => false,
        ]);
    }
}

class ToggleTodoAction
{
    public function execute(Todo $todo): Todo
    {
        $todo->update(['is_completed' => ! $todo->is_completed]);

        return $todo;
    }
}

class DeleteTodoAction
{
    public function execute(Todo $todo): void
    {
        $todo->delete();
    }
}

class FilterTodosAction
{
    public function execute(int $userId, string $status): Collection
    {
        return Todo::where('user_id', $userId)
            ->when($status === 'active', fn ($query) => $query->where('is_completed', false))
            ->when($status === 'completed', fn ($query) => $query->where('is_completed', true))
            ->get();
    }
}
```

`UpdateTodoAction` itself is omitted here, since its `execute()` method follows the identical validate-then-persist shape as `CreateTodoAction`; it simply updates an existing `Todo` instead of creating a new one. This mirrors the "same shape, not redrawn" note Chapter 4 already made for the Edit branch of the Activity Diagram.

The controller now only orchestrates HTTP concerns (validation, authorization, redirect); business logic is isolated in the Action classes, each testable in complete isolation from the HTTP layer. The `abort_unless` checks are the concrete, testable form of Chapter 4's authentication precondition: without them, any authenticated user could toggle or delete any other user's todo, and the precondition would be nothing but a comment.

### Fat Controller (Illustrative Snippet Only, Not Part of the Measured Codebase)

This short illustration of the conceptual alternative is discussed in Chapter 2 and Chapter 4. It is never built as a full application, tested, or measured; it exists only to make the contrast in "A First Look at the Difference" below concrete rather than abstract.

```php
class TodoController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $todo = new Todo();
        $todo->user_id = auth()->id();
        $todo->title = $validated['title'];
        $todo->description = $validated['description'] ?? null;
        $todo->is_completed = false;
        $todo->save();

        return redirect()->route('todos.index')->with('success', 'Todo created.');
    }
}
```

Validation, model construction, and persistence would all live directly inside this controller method, which is what makes such a method hard to unit test without booting the full HTTP request lifecycle.

### A First Look at the Difference (before formal measurement)

| Aspect | Fat Controller (illustrative) | Action Pattern (implemented) |
|---|---|---|
| Where does `Todo::create` logic live? | Inside `TodoController::store()` | Inside `CreateTodoAction::execute()` |
| Can business logic be tested without an HTTP request? | No, would require mocking `Request`/routing | Yes, call `execute()` directly with an array and a user ID |
| How many classes does `store()`'s logic touch? | 1 (`TodoController` would do it all) | 2 (`TodoController` delegates, `CreateTodoAction` executes) |

Only the Action Pattern column reflects code that is actually built and measured. Chapter 6 formalises this contrast with real numbers, checked against literature thresholds rather than against the illustrative column directly.

### Prototype Iteration Log

Chapter 3 chose Prototyping specifically because it iterates: build, evaluate, refine, repeat. Writing a full diagram-and-code narrative for every iteration would bloat this chapter far past what a **mini thesis** (mini skripsi) needs. Instead, keep a **compact log of meaningful milestones**, each tied to a concrete trigger and a git reference, and let the repository itself carry the detailed evidence (see the tagged-release packaging guidance in Part 7). This is the same principle Chapter 4 already applied to diagrams: document what is meaningful, not everything.

| Iteration | What Changed | Trigger | Git Reference |
|---|---|---|---|
| Prototype v1 | Initial CRUD logic via Action Pattern, no user scoping | Baseline implementation from the Chapter 4 design | `v0.1-prototype` |
| Prototype v2 | Added `user_id` to `Todo` and `abort_unless` ownership checks to the controller | Design review found the authentication precondition (Chapter 4, Section 4.1) had no enforced consequence: a self-claim gap | `v0.2-prototype` |
| Prototype v3 (final) | Added the delete-confirmation flow (dialog, then confirm/cancel) | Activity Diagram review found Delete had no genuine decision logic distinguishing it from Create | `v0.3-final` (this is the version measured in Chapter 6) |

Notice each row exists because an **evaluation** surfaced a real gap, not because of cosmetic polish; that is what makes this evidence of Prototyping rather than a changelog. A student following this template should expect two to four rows, not one per commit and not one for every minor styling change.

</section>

<section lang="id">

## 3. 5.1 Lingkungan Implementasi

| Kategori | Item |
|---|---|
| **Software** | PHP 8.3, Laravel 11, MySQL 8, Composer 2, PHPUnit 11, PHPMD 2.x |
| **Hardware** | Mesin pengembangan apa pun yang mampu menjalankan hal di atas (dokumentasikan spesifikasi aktual Anda demi reproduksibilitas) |

## 4. 5.2 Implementasi Basis Data

Kolom `user_id` adalah implementasi langsung dari prasyarat autentikasi yang dinyatakan di BAB IV bagian 4.1: inilah yang mengubah "User terautentikasi" dari klaim desain menjadi batasan yang dapat ditegakkan.

```php
// database/migrations/xxxx_xx_xx_create_todos_table.php
Schema::create('todos', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('title');
    $table->text('description')->nullable();
    $table->boolean('is_completed')->default(false);
    $table->timestamps();
});
```

## 5. 5.3 Implementasi Antarmuka

View Blade mengimplementasikan wireframe dari BAB IV bagian 4.3: satu `index.blade.php` dengan form, tab filter, partial daftar todo, dan dialog konfirmasi sebelum request hapus dikirim.

## 6. 5.4 Implementasi Algoritma Inti

Ini adalah bagian tempat Class Diagram BAB IV menjadi nyata. Pertama, implementasi yang benar-benar dibangun, diuji, dan diukur oleh penelitian ini, mencocokkan setiap kelas dan method yang dijanjikan Class Diagram.

### Action Pattern (Diimplementasikan dan Diukur)

```php
class TodoController extends Controller
{
    public function index(Request $request, FilterTodosAction $action)
    {
        $status = $request->query('status', 'all');
        $todos = $action->execute(auth()->id(), $status);

        return view('todos.index', compact('todos'));
    }

    public function store(Request $request, CreateTodoAction $action)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $action->execute($validated, auth()->id());

        return redirect()->route('todos.index')->with('success', 'Todo created.');
    }

    public function update(Request $request, Todo $todo, UpdateTodoAction $action)
    {
        abort_unless($todo->user_id === auth()->id(), 403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $action->execute($todo, $validated);

        return redirect()->route('todos.index')->with('success', 'Todo updated.');
    }

    public function toggle(Todo $todo, ToggleTodoAction $action)
    {
        abort_unless($todo->user_id === auth()->id(), 403);

        $action->execute($todo);

        return redirect()->route('todos.index')->with('success', 'Todo status updated.');
    }

    public function destroy(Todo $todo, DeleteTodoAction $action)
    {
        abort_unless($todo->user_id === auth()->id(), 403);

        $action->execute($todo);

        return redirect()->route('todos.index')->with('success', 'Todo deleted.');
    }
}

class CreateTodoAction
{
    public function execute(array $data, int $userId): Todo
    {
        return Todo::create([
            'user_id' => $userId,
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'is_completed' => false,
        ]);
    }
}

class ToggleTodoAction
{
    public function execute(Todo $todo): Todo
    {
        $todo->update(['is_completed' => ! $todo->is_completed]);

        return $todo;
    }
}

class DeleteTodoAction
{
    public function execute(Todo $todo): void
    {
        $todo->delete();
    }
}

class FilterTodosAction
{
    public function execute(int $userId, string $status): Collection
    {
        return Todo::where('user_id', $userId)
            ->when($status === 'active', fn ($query) => $query->where('is_completed', false))
            ->when($status === 'completed', fn ($query) => $query->where('is_completed', true))
            ->get();
    }
}
```

`UpdateTodoAction` sendiri tidak ditampilkan di sini: method `execute()`-nya mengikuti bentuk validasi-lalu-simpan yang identik dengan `CreateTodoAction`, hanya memperbarui `Todo` yang sudah ada alih-alih membuat yang baru, persis catatan "bentuk sama, tidak digambar ulang" yang sudah dibuat BAB IV untuk cabang Edit pada Activity Diagram.

Controller sekarang hanya mengoordinasikan urusan HTTP (validasi, otorisasi, redirect); business logic terisolasi di kelas Action, masing-masing dapat diuji sepenuhnya terisolasi dari lapisan HTTP. Pengecekan `abort_unless` adalah bentuk konkret dan dapat diuji dari prasyarat autentikasi BAB IV: tanpanya, user terautentikasi mana pun dapat mengubah status atau menghapus todo milik user lain, dan prasyarat itu tidak lebih dari sekadar komentar.

### Fat Controller (Cuplikan Ilustratif Saja, Bukan Bagian dari Codebase yang Diukur)

Berikut adalah ilustrasi singkat alternatif konseptual yang dibahas di BAB II dan BAB IV. Kode ini tidak pernah dibangun sebagai aplikasi lengkap, tidak pernah diuji, dan tidak pernah diukur; kode ini hanya ada agar kontras pada bagian "Sekilas Perbedaan" di bawah menjadi konkret, bukan abstrak.

```php
class TodoController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $todo = new Todo();
        $todo->user_id = auth()->id();
        $todo->title = $validated['title'];
        $todo->description = $validated['description'] ?? null;
        $todo->is_completed = false;
        $todo->save();

        return redirect()->route('todos.index')->with('success', 'Todo created.');
    }
}
```

Validasi, konstruksi model, dan persistensi semuanya akan berada langsung di dalam method controller ini, yang membuatnya sulit diuji secara terisolasi (*unit test*) tanpa menjalankan seluruh siklus HTTP request.

### Sekilas Perbedaan (sebelum pengukuran formal)

| Aspek | Fat Controller (ilustratif) | Action Pattern (diimplementasikan) |
|---|---|---|
| Di mana logika `Todo::create` berada? | Di dalam `TodoController::store()` | Di dalam `CreateTodoAction::execute()` |
| Bisakah business logic diuji tanpa HTTP request? | Tidak, akan membutuhkan mocking `Request`/routing | Ya, panggil `execute()` langsung dengan array dan ID user |
| Berapa kelas yang disentuh logika `store()`? | 1 (`TodoController` akan melakukan semuanya) | 2 (`TodoController` mendelegasikan, `CreateTodoAction` mengeksekusi) |

Hanya kolom Action Pattern yang mencerminkan kode yang benar-benar dibangun dan diukur. BAB VI memformalkan kontras ini dengan angka nyata, diperiksa terhadap ambang batas literatur, bukan terhadap kolom ilustratif secara langsung.

### Log Iterasi Prototipe

BAB III memilih Prototyping secara spesifik karena bersifat iteratif: bangun, evaluasi, sempurnakan, ulangi. Menulis narasi diagram-dan-kode lengkap untuk setiap iterasi akan membuat bab ini menggembung jauh melebihi kebutuhan mini-skripsi; sebagai gantinya, simpan **log ringkas berisi milestone yang bermakna**, masing-masing dikaitkan dengan pemicu konkret dan referensi git, dan biarkan repository itu sendiri membawa bukti detailnya (lihat panduan pengemasan release bertag di Bagian 7). Ini adalah prinsip yang sama yang sudah diterapkan BAB IV pada diagram: dokumentasikan yang bermakna, bukan semuanya.

| Iterasi | Apa yang Berubah | Pemicu | Referensi Git |
|---|---|---|---|
| Prototipe v1 | Logika CRUD awal melalui Action Pattern, tanpa pembatasan user | Implementasi baseline dari desain BAB IV | `v0.1-prototype` |
| Prototipe v2 | Menambahkan `user_id` pada `Todo` dan pengecekan kepemilikan `abort_unless` pada controller | Tinjauan desain menemukan prasyarat autentikasi (BAB IV bagian 4.1) tidak memiliki konsekuensi yang ditegakkan: celah klaim sepihak | `v0.2-prototype` |
| Prototipe v3 (final) | Menambahkan alur konfirmasi hapus (dialog, lalu konfirmasi/batal) | Tinjauan Activity Diagram menemukan Hapus tidak memiliki logika keputusan sesungguhnya yang membedakannya dari Buat | `v0.3-final` (versi ini yang diukur di BAB VI) |

Perhatikan bahwa setiap baris ada karena sebuah **evaluasi** mengungkap kesenjangan nyata, bukan karena polesan kosmetik; itulah yang menjadikannya bukti Prototyping, bukan sekadar changelog. Mahasiswa yang mengikuti template ini seharusnya menyiapkan dua hingga empat baris, bukan satu per commit dan bukan satu untuk setiap perubahan kecil pada gaya.

</section>

---

<section lang="en">

## 7. 5.5 Testing Implementation (Implementasi Pengujian)

### Method

The implementation is validated with Black Box scenarios (Chapter 4, Section 4.4), plus unit tests targeting the isolated Action classes directly, including a test that confirms the authentication precondition is actually enforced, not just declared. Metric measurement uses the tools named in Chapter 3, Section 3.5, run directly against the codebase.

### Running the Metric-Measurement Tools

Chapter 3 promised specific tools for the maintainability metrics; here they are actually invoked, not just named. Run these from the project root:

```bash
# Cyclomatic complexity and coupling (BAB III, Section 3.5)
vendor/bin/phpmd app/Actions text codesize,design

# Test coverage (BAB III, Section 3.5)
vendor/bin/phpunit --coverage-text
```

Record the raw output of both commands. The numbers Chapter 6 reports must trace back to an actual run of these tools, not an estimate.

### Black Box Testing Implementation (excerpt)

| ID | Scenario | Actual Result | Status |
|---|---|---|---|
| BB-01 | Create todo with valid title | Todo appears in list | Pass |
| BB-02 | Create todo with empty title | Validation error shown | Pass |
| BB-03 | Edit an existing todo's title | Updated title reflected in list | Pass |
| BB-04 | Toggle a todo's completion twice | Shown completed, then active again | Pass |
| BB-05 | Delete a todo and confirm | Todo removed from list | Pass |
| BB-06 | Delete a todo, then cancel the confirmation | Todo remains unchanged | Pass |
| BB-07 | Filter by "Active" | Only incomplete todos shown | Pass |
| BB-08 | Filter by "Completed" | Only completed todos shown | Pass |
| BB-09 | Attempt to access another user's todo directly | Access denied (403) | Pass |

### Example Unit Tests (Action, isolated)

```php
public function test_create_todo_action_creates_a_todo(): void
{
    $action = new CreateTodoAction();

    $todo = $action->execute(['title' => 'Write BAB V', 'description' => null], userId: 1);

    $this->assertDatabaseHas('todos', ['title' => 'Write BAB V', 'user_id' => 1]);
    $this->assertFalse($todo->is_completed);
}

public function test_create_todo_action_scopes_the_todo_to_the_given_user(): void
{
    $action = new CreateTodoAction();

    $todo = $action->execute(['title' => 'Another todo', 'description' => null], userId: 7);

    $this->assertSame(7, $todo->user_id);
}

public function test_toggle_todo_action_flips_completion_both_ways(): void
{
    $action = new ToggleTodoAction();
    $todo = Todo::factory()->create(['is_completed' => false]);

    $action->execute($todo);
    $this->assertTrue($todo->fresh()->is_completed);

    $action->execute($todo);
    $this->assertFalse($todo->fresh()->is_completed);
}
```

Notice these tests need no `Request`, no route, and no controller. That is a direct consequence of the Action Pattern's isolation, and it is exactly the testability claim made in this project's **Research Questions (Rumusan Masalah)**. The second test is what actually verifies Chapter 4's precondition. Without this test, "User is authenticated" and "todos are scoped to their owner" would remain design claims with no supporting evidence, the same self-claim problem Chapter 4, Section 2 warns against for NFRs.

</section>

<section lang="id">

## 7. 5.5 Implementasi Pengujian

### Metode

Implementasi divalidasi dengan skenario Black Box (BAB IV bagian 4.4), ditambah *unit test* yang menargetkan kelas Action terisolasi secara langsung, termasuk test yang mengonfirmasi prasyarat autentikasi benar-benar ditegakkan, bukan hanya dinyatakan. Pengukuran metrik menggunakan tool yang disebutkan di BAB III bagian 3.5, dijalankan langsung terhadap codebase.

### Menjalankan Tool Pengukuran Metrik

BAB III menjanjikan tool spesifik untuk metrik *maintainability*; di sini tool tersebut benar-benar dijalankan, bukan hanya disebutkan. Jalankan ini dari root proyek:

```bash
# Cyclomatic complexity dan coupling (BAB III, bagian 3.5)
vendor/bin/phpmd app/Actions text codesize,design

# Test coverage (BAB III, bagian 3.5)
vendor/bin/phpunit --coverage-text
```

Catat output mentah dari kedua perintah; angka yang dilaporkan BAB VI harus tertelusur ke hasil run yang sesungguhnya dari perintah ini, bukan estimasi.

### Implementasi Black Box Testing (kutipan)

| ID | Skenario | Hasil Aktual | Status |
|---|---|---|---|
| BB-01 | Membuat todo dengan judul valid | Todo muncul di daftar | Lulus |
| BB-02 | Membuat todo dengan judul kosong | Error validasi ditampilkan | Lulus |
| BB-03 | Mengedit judul todo yang ada | Judul terbaru tercermin di daftar | Lulus |
| BB-04 | Toggle status selesai todo dua kali | Ditampilkan selesai, lalu aktif lagi | Lulus |
| BB-05 | Menghapus todo dan konfirmasi | Todo terhapus dari daftar | Lulus |
| BB-06 | Menghapus todo, lalu batalkan konfirmasi | Todo tetap tidak berubah | Lulus |
| BB-07 | Filter berdasarkan "Aktif" | Hanya todo belum selesai ditampilkan | Lulus |
| BB-08 | Filter berdasarkan "Selesai" | Hanya todo selesai ditampilkan | Lulus |
| BB-09 | Mencoba mengakses todo milik user lain secara langsung | Akses ditolak (403) | Lulus |

### Contoh *Unit Test* (Action, terisolasi)

```php
public function test_create_todo_action_creates_a_todo(): void
{
    $action = new CreateTodoAction();

    $todo = $action->execute(['title' => 'Write BAB V', 'description' => null], userId: 1);

    $this->assertDatabaseHas('todos', ['title' => 'Write BAB V', 'user_id' => 1]);
    $this->assertFalse($todo->is_completed);
}

public function test_create_todo_action_scopes_the_todo_to_the_given_user(): void
{
    $action = new CreateTodoAction();

    $todo = $action->execute(['title' => 'Another todo', 'description' => null], userId: 7);

    $this->assertSame(7, $todo->user_id);
}

public function test_toggle_todo_action_flips_completion_both_ways(): void
{
    $action = new ToggleTodoAction();
    $todo = Todo::factory()->create(['is_completed' => false]);

    $action->execute($todo);
    $this->assertTrue($todo->fresh()->is_completed);

    $action->execute($todo);
    $this->assertFalse($todo->fresh()->is_completed);
}
```

Perhatikan bahwa test ini tidak membutuhkan `Request`, rute, atau controller: konsekuensi langsung dari isolasi Action Pattern, yang persis merupakan klaim *testability* dari Rumusan Masalah penelitian ini. Test kedua adalah yang benar-benar memverifikasi prasyarat BAB IV; tanpanya, "User terautentikasi" dan "todo dibatasi ke pemiliknya" hanya akan menjadi klaim desain tanpa bukti pendukung, masalah klaim sepihak yang sama yang diperingatkan BAB IV bagian 2 untuk NFR.

</section>

---

<section lang="en">

## 8. Common Mistakes in Chapter 5

| Mistake | Why It Is Wrong | Correct Approach |
|---|---|---|
| **Building the Fat Controller illustration as a full, working, separate application** | Doubles implementation effort for no additional evidence; **Scope and Limitations (Batasan Masalah)** (Chapter 1) explicitly scoped this out. | Keep the illustration to a short, clearly labelled snippet, as in Section 6. |
| **Not labelling which code is measured and which is illustrative** | An examiner reading Chapter 5 cannot tell what the actual research artefact is. | Label every code block explicitly, as done throughout this chapter. |
| **Implementing fewer classes or methods than the Class Diagram promised** | Leaves an unexplained gap between design and implementation an examiner will notice immediately. | Match every class/method, or explicitly note why one is omitted (e.g. `UpdateTodoAction` following `CreateTodoAction`'s shape), as in Section 6. |
| **Naming a metric tool in Chapter 3 but never actually running it in Chapter 5** | The numbers Chapter 6 reports become unverifiable claims, not measurements. | Show the actual commands and record their raw output, as in Section 7. |
| **Choosing Prototyping in Chapter 3 but documenting only the final version in Chapter 5** | Undermines the methodology you claimed to follow; there is no evidence of "build, evaluate, refine." | Keep a compact Iteration Log tied to real triggers and git references, as in Section 6, not a full narrative per version. |
| **Stating a precondition in Chapter 4 but never writing a test that could fail it** | A precondition with no test that could violate it is a claim, not a verified property of the system. | Write at least one scenario that deliberately tries to break the precondition (e.g. BB-09) and confirms it is blocked. |
| **Writing tests only after all features are "done"** | Bugs found late are more expensive to fix, and late testing pressure often means scenarios get skipped. | Test continuously, as designed in Chapter 4, Section 4.4, feature by feature. |
| **Skipping environment documentation** | Without exact versions, no one (including future-you) can reproduce your measurements. | Record exact tool versions in Section 5.1; this becomes essential for Chapter 6 credibility. |

</section>

<section lang="id">

## 8. Kesalahan Umum dalam BAB V

| Kesalahan | Mengapa Salah | Pendekatan yang Benar |
|---|---|---|
| **Membangun ilustrasi Fat Controller sebagai aplikasi terpisah yang lengkap dan berfungsi** | Menggandakan upaya implementasi tanpa bukti tambahan; Batasan Masalah (BAB I) secara eksplisit mengecualikan ini. | Jaga ilustrasi tetap berupa cuplikan singkat yang diberi label jelas, seperti di Bagian 6. |
| **Tidak memberi label kode mana yang diukur dan mana yang ilustratif** | Penguji yang membaca BAB V tidak dapat mengenali artefak penelitian yang sebenarnya. | Beri label eksplisit pada setiap blok kode, seperti dilakukan di sepanjang bab ini. |
| **Mengimplementasikan lebih sedikit kelas atau method daripada yang dijanjikan Class Diagram** | Meninggalkan kesenjangan yang tidak terjelaskan antara desain dan implementasi yang akan langsung diperhatikan penguji. | Cocokkan setiap kelas/method, atau nyatakan secara eksplisit mengapa satu dihilangkan (mis. `UpdateTodoAction` mengikuti bentuk `CreateTodoAction`), seperti di Bagian 6. |
| **Menyebutkan tool metrik di BAB III namun tidak pernah benar-benar menjalankannya di BAB V** | Angka yang dilaporkan BAB VI menjadi klaim yang tidak dapat diverifikasi, bukan pengukuran. | Tampilkan perintah yang sesungguhnya dan catat output mentahnya, seperti di Bagian 7. |
| **Memilih Prototyping di BAB III namun hanya mendokumentasikan versi akhir di BAB V** | Merusak metodologi yang Anda klaim ikuti; tidak ada bukti "bangun, evaluasi, sempurnakan." | Simpan Log Iterasi ringkas yang dikaitkan dengan pemicu nyata dan referensi git, seperti di Bagian 6, bukan narasi lengkap per versi. |
| **Menyatakan prasyarat di BAB IV namun tidak pernah menulis test yang bisa membuatnya gagal** | Prasyarat tanpa test yang bisa melanggarnya adalah klaim, bukan properti sistem yang terverifikasi. | Tulis setidaknya satu skenario yang sengaja mencoba melanggar prasyarat (mis. BB-09) dan mengonfirmasi itu diblokir. |
| **Menulis test hanya setelah semua fitur "selesai"** | Bug yang ditemukan terlambat lebih mahal diperbaiki, dan tekanan pengujian terlambat sering berarti skenario terlewat. | Uji secara berkelanjutan, sesuai rancangan BAB IV bagian 4.4, fitur demi fitur. |
| **Melewatkan dokumentasi *environment*** | Tanpa versi yang persis, tidak ada yang bisa (termasuk diri Anda di masa depan) mereproduksi pengukuran Anda. | Catat versi tool yang persis di bagian 5.1; ini penting untuk kredibilitas BAB VI. |

</section>

---

<section lang="en">

## 9. What Comes Next?

The Action Pattern implementation is now built, tested, and functionally validated, including the authentication precondition itself, with a compact iteration log giving real evidence that Prototyping was actually followed. Part 6 covers **Chapter 6: Results and Discussion (BAB VI: Hasil dan Pembahasan)**: running the metric-measurement tools for real, presenting the results against literature thresholds, and, most importantly, discussing what the numbers actually mean by tying every result back to the Research Questions from Part 1.

</section>

<section lang="id">

## 9. Apa yang Akan Datang Selanjutnya?

Implementasi Action Pattern kini terbangun, teruji, dan tervalidasi secara fungsional, termasuk prasyarat autentikasi itu sendiri, dengan log iterasi ringkas yang memberi bukti nyata bahwa Prototyping benar-benar diikuti. Bagian 6 membahas **BAB VI (Hasil dan Pembahasan)**: menjalankan tool pengukuran metrik secara nyata, menyajikan hasil terhadap ambang batas literatur, dan, yang terpenting, membahas apa arti angka-angka tersebut sesungguhnya, mengaitkan setiap hasil kembali ke Rumusan Masalah dari Bagian 1.

</section>
