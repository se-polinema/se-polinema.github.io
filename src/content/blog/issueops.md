---
title: "Managing This Website with IssueOps"
titleId: "Mengelola Situs Ini dengan IssueOps"
date: 2026-06-24
category: news
author: SE Lab
lang: en
featured: true
excerpt: "Learn how the SE Laboratory uses IssueOps — a workflow where GitHub issues trigger AI-assisted planning and automated building — to manage this website without leaving GitHub."
excerptId: "Pelajari bagaimana SE Laboratory menggunakan IssueOps — alur kerja di mana GitHub issue memicu perencanaan berbantuan AI dan pembangunan otomatis — untuk mengelola situs web ini tanpa meninggalkan GitHub."
---

<section lang="en">

## Think of It Like a Restaurant Kitchen

Imagine you walk into a restaurant. Instead of shouting your order to the chef, you write it down on a slip of paper. The chef reads the slip, plans the dish, prepares it, and plates it. When it is ready, the chef asks you to review the dish before it goes to the table.

**IssueOps works the same way.** Instead of a kitchen, we use GitHub Issues. Instead of a chef, we use an AI agent called OpenCode. Instead of food, we produce website changes — new pages, bug fixes, or content updates. The "kitchen" is a GitHub Actions workflow that runs automatically whenever the right command appears in an issue comment.

</section>

<section lang="id">

## Bayangkan Seperti Dapur Restoran

Bayangkan Anda masuk ke sebuah restoran. Alih-alih meneriakkan pesanan ke koki, Anda menuliskannya di secarik kertas. Koki membaca catatan itu, merencanakan hidangan, menyiapkannya, dan menyajikannya. Setelah siap, koki meminta Anda meninjau hidangan sebelum diantar ke meja.

**IssueOps bekerja dengan cara yang sama.** Alih-alih dapur, kami menggunakan GitHub Issues. Alih-alih koki, kami menggunakan agen AI bernama OpenCode. Alih-alih makanan, kami menghasilkan perubahan situs web — halaman baru, perbaikan bug, atau pembaruan konten. "Dapur"-nya adalah workflow GitHub Actions yang berjalan otomatis setiap kali perintah yang tepat muncul di komentar issue.

</section>

<figure class="my-10 text-center" role="figure">
  <img src="/blog/issueops-flow.svg" alt="IssueOps workflow diagram" class="mx-auto rounded-lg border border-neutral-200 shadow-sm" style="max-width: 100%;" />
  <figcaption class="mt-3 text-sm text-neutral-500">
    <span lang="en">Figure: The end-to-end IssueOps workflow in the SE Laboratory repository</span>
    <span lang="id">Gambar: Alur kerja IssueOps dari awal hingga akhir di repositori SE Laboratory</span>
  </figcaption>
</figure>

<section lang="en">

## Step by Step: How It Works Here

Here is what happens every time someone wants to change something on this website:

1.  **Open an issue.** A contributor opens a GitHub Issue describing what they want — a new blog post, a layout fix, or a feature idea.

2.  **Plan with `/plan`.** Any authorized member can comment `/plan` on the issue. You can also add extra context after the command, such as `/plan focus on the layout only`. This triggers a GitHub Actions job that verifies authorization — first by checking organization membership through an authenticated GitHub API, falling back to a repository-level allowlist — then runs OpenCode in **planning mode**. OpenCode reads the issue, analyzes the codebase, and replies with a concrete implementation plan — including which files to change, how to validate, and open questions.

3.  **Approve with `/build`.** If the plan looks good, an authorized member comments `/build` (optionally with extra context like `/build use Astro Islands for interactivity`). The workflow validates authorization, then switches OpenCode to implementation mode. It creates a new branch, writes the actual code, runs `npm run build` to verify everything compiles, captures a screenshot of updated features (stored as a workflow artifact, never committed to the repository), and opens a pull request linked to the issue. If the build fails, a new error issue is automatically created to track the failure.

4.  **Review and merge.** The pull request appears with a build summary. The maintainer reviews the changes, and if everything looks correct, merges the PR. The change goes live on the next deployment. Merged OpenCode branches are automatically cleaned up after one week.

The entire process happens **inside GitHub**. There is no need to clone the repository, run a local development server, or even open a code editor. Everything from planning to deployment is handled through issue comments and automation.

</section>

<section lang="id">

## Langkah demi Langkah: Cara Kerjanya di Sini

Inilah yang terjadi setiap kali seseorang ingin mengubah sesuatu di situs web ini:

1.  **Buka issue.** Seorang kontributor membuka GitHub Issue yang menjelaskan apa yang diinginkan — postingan blog baru, perbaikan tata letak, atau ide fitur.

2.  **Rencanakan dengan `/plan`.** Setiap anggota yang berwenang dapat mengomentari `/plan` di issue tersebut. Anda juga dapat menambahkan konteks tambahan setelah perintah, seperti `/plan fokus pada tata letak saja`. Ini memicu job GitHub Actions yang memverifikasi otorisasi — pertama dengan memeriksa keanggotaan organisasi melalui API GitHub terautentikasi, dan fallback ke daftar izin tingkat repositori — lalu menjalankan OpenCode dalam **mode perencanaan**. OpenCode membaca issue, menganalisis codebase, dan membalas dengan rencana implementasi yang konkret — termasuk file mana yang akan diubah, cara memvalidasi, dan pertanyaan terbuka.

3.  **Setujui dengan `/build`.** Jika rencana terlihat baik, anggota yang berwenang mengomentari `/build` (opsional dengan konteks tambahan seperti `/build gunakan Astro Islands untuk interaktivitas`). Workflow memvalidasi otorisasi, lalu mengalihkan OpenCode ke mode implementasi. Ia membuat branch baru, menulis kode aktual, menjalankan `npm run build` untuk memverifikasi semuanya terkompilasi, menangkap tangkapan layar fitur yang diperbarui (disimpan sebagai artefak workflow, tidak pernah dikomit ke repositori), dan membuka pull request yang terhubung ke issue. Jika build gagal, issue error baru akan otomatis dibuat untuk melacak kegagalan tersebut.

4.  **Tinjau dan gabung.** Pull request muncul dengan ringkasan build. Maintainer meninjau perubahan, dan jika semuanya terlihat benar, menggabungkan PR. Perubahan akan tayang pada deployment berikutnya. Branch OpenCode yang telah digabung akan otomatis dibersihkan setelah satu minggu.

Seluruh proses terjadi **di dalam GitHub**. Tidak perlu meng-clone repositori, menjalankan server pengembangan lokal, atau bahkan membuka editor kode. Semuanya dari perencanaan hingga deployment ditangani melalui komentar issue dan otomatisasi.

</section>

<section lang="en">

## Why This Matters for Beginners

If you are new to software engineering or open source, IssueOps lowers the barrier to entry in several ways:

**No local setup required.** You do not need Node.js, a code editor, or a terminal. You only need a GitHub account and a web browser.

**Transparent planning.** Before any code is written, the AI explains exactly what it will do. You can read the plan, suggest changes, and learn from the reasoning before anything gets built.

**Built-in quality checks.** The workflow runs `npm run build` on every change. This acts as a safety net — if the AI makes a mistake, the build fails and the PR shows the error before anyone reviews it.

**Learn by reading.** Every pull request is a recorded case study. You can browse past PRs to see how a feature was planned, implemented, and verified — all in one place.

</section>

<section lang="id">

## Mengapa Ini Penting untuk Pemula

Jika Anda baru dalam rekayasa perangkat lunak atau open source, IssueOps menurunkan hambatan masuk dalam beberapa cara:

**Tidak perlu setup lokal.** Anda tidak memerlukan Node.js, editor kode, atau terminal. Anda hanya perlu akun GitHub dan browser web.

**Perencanaan yang transparan.** Sebelum kode ditulis, AI menjelaskan secara persis apa yang akan dilakukan. Anda dapat membaca rencana, menyarankan perubahan, dan belajar dari penalarannya sebelum apa pun dibangun.

**Pemeriksaan kualitas bawaan.** Workflow menjalankan `npm run build` pada setiap perubahan. Ini bertindak sebagai jaring pengaman — jika AI membuat kesalahan, build gagal dan PR menampilkan error sebelum ada yang meninjaunya.

**Belajar dengan membaca.** Setiap pull request adalah studi kasus yang terekam. Anda dapat menjelajahi PR sebelumnya untuk melihat bagaimana fitur direncanakan, diimplementasikan, dan diverifikasi — semuanya di satu tempat.

</section>

<section lang="en">

## Adapting IssueOps to Your Own Project

You do not need to be an AI expert to set up IssueOps. The workflow used in this repository is defined in a single file: `.github/workflows/opencode.yml`. Here is how you can adapt it:

1.  **Copy the workflow file.** The `opencode.yml` file contains three jobs — `check-auth`, `plan`, and `build`. Copy it to your own repository under `.github/workflows/`. Also copy `cleanup-merged-branches.yml` for automatic branch cleanup.

2.  **Configure authorization.** Update the `check-auth` job to use your own GitHub organization or team. By default, it checks membership in the `se-polinema` organization through an authenticated API (requires a token with `read:org` scope), with a fallback to a repository-level allowlist file (`.github/opencode-allowlist.txt`). Add authorized users to the allowlist as a simpler alternative.

3.  **Set up secrets.** Add your API key (`OPENCODE_GO_API_KEY`) to your repository secrets. This authenticates the OpenCode CLI with the AI provider.

4.  **Adjust the build command.** If your project uses a different build tool (like `yarn build`, `pip install`, or `cargo build`), update the build job accordingly.

5.  **Start small.** Open your first issue, comment `/plan`, and watch the AI propose a plan. Review it carefully before approving with `/build`.

The same pattern works for documentation sites, personal blogs, open source libraries, and internal tools. Any project that accepts code changes through GitHub can benefit from IssueOps.

</section>

<section lang="id">

## Mengadaptasi IssueOps ke Proyek Anda Sendiri

Anda tidak perlu menjadi ahli AI untuk menyiapkan IssueOps. Workflow yang digunakan di repositori ini didefinisikan dalam satu file: `.github/workflows/opencode.yml`. Berikut cara mengadaptasinya:

1.  **Salin file workflow.** File `opencode.yml` berisi tiga job — `check-auth`, `plan`, dan `build`. Salin ke repositori Anda sendiri di bawah `.github/workflows/`. Salin juga `cleanup-merged-branches.yml` untuk pembersihan branch otomatis.

2.  **Konfigurasi otorisasi.** Perbarui job `check-auth` untuk menggunakan organisasi atau tim GitHub Anda sendiri. Secara default, ini memeriksa keanggotaan di organisasi `se-polinema` melalui API terautentikasi (memerlukan token dengan scope `read:org`), dengan fallback ke file daftar izin tingkat repositori (`.github/opencode-allowlist.txt`). Tambahkan pengguna berwenang ke daftar izin sebagai alternatif yang lebih sederhana.

3.  **Atur secrets.** Tambahkan kunci API Anda (`OPENCODE_GO_API_KEY`) ke repository secrets Anda. Ini mengautentikasi OpenCode CLI dengan penyedia AI.

4.  **Sesuaikan perintah build.** Jika proyek Anda menggunakan alat build yang berbeda (seperti `yarn build`, `pip install`, atau `cargo build`), perbarui job build sesuai kebutuhan.

5.  **Mulai dari yang kecil.** Buka issue pertama Anda, komentari `/plan`, dan lihat AI mengusulkan rencana. Tinjau dengan cermat sebelum menyetujui dengan `/build`.

Pola yang sama berlaku untuk situs dokumentasi, blog pribadi, pustaka open source, dan alat internal. Proyek apa pun yang menerima perubahan kode melalui GitHub dapat memanfaatkan IssueOps.

</section>

<section lang="en">

## Join the Software Engineering Laboratory

The SE Laboratory at Politeknik Negeri Malang is a place where students, researchers, and industry partners work together on real software engineering projects. IssueOps is just one example of how we experiment with modern development practices.

**For students:** Join us to gain hands-on experience with production-grade tools and workflows. You will work on real projects, contribute to open source, and build a portfolio that stands out.

**For industry partners:** Collaborate with us on research projects, sponsor student work, or propose joint initiatives. Our lab bridges academic knowledge with practical industry needs.

**How to get involved:**

- Browse our [research focus areas](/) and [publications](/publications).
- Open an issue on our [GitHub repository](https://github.com/se-polinema/se-polinema.github.io) to start a conversation.
- Reach out via email at the contact shown on our [homepage](/).

We believe that tools like IssueOps make software development more accessible, collaborative, and fun. Come build with us.

</section>

<section lang="id">

## Bergabung dengan Software Engineering Laboratory

SE Laboratory di Politeknik Negeri Malang adalah tempat di mana mahasiswa, peneliti, dan mitra industri bekerja sama dalam proyek rekayasa perangkat lunak nyata. IssueOps hanyalah salah satu contoh bagaimana kami bereksperimen dengan praktik pengembangan modern.

**Untuk mahasiswa:** Bergabunglah dengan kami untuk mendapatkan pengalaman langsung dengan alat dan alur kerja tingkat produksi. Anda akan mengerjakan proyek nyata, berkontribusi pada open source, dan membangun portofolio yang menonjol.

**Untuk mitra industri:** Berkolaborasilah dengan kami dalam proyek penelitian, dukung pekerjaan mahasiswa, atau usulkan inisiatif bersama. Lab kami menjembatani pengetahuan akademik dengan kebutuhan industri praktis.

**Cara untuk terlibat:**

- Jelajahi [bidang fokus riset](/) dan [publikasi](/publications) kami.
- Buka issue di [repositori GitHub](https://github.com/se-polinema/se-polinema.github.io) kami untuk memulai percakapan.
- Hubungi kami melalui email yang ditampilkan di [beranda](/).

Kami percaya bahwa alat seperti IssueOps membuat pengembangan perangkat lunak lebih mudah diakses, kolaboratif, dan menyenangkan. Mari membangun bersama kami.

</section>

<figure class="my-10 text-center" role="figure">
  <img src="/blog/issueops-collab.svg" alt="Collaboration illustration" class="mx-auto rounded-lg border border-neutral-200 shadow-sm" style="max-width: 100%;" />
  <figcaption class="mt-3 text-sm text-neutral-500">
    <span lang="en">Students and industry partners collaborating through the SE Laboratory</span>
    <span lang="id">Mahasiswa dan mitra industri berkolaborasi melalui SE Laboratory</span>
  </figcaption>
</figure>
