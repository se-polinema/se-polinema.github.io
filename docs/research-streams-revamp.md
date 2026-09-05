# Research Areas Revamp: Portfolio-Backed Streams

Gathered from each researcher's Google Scholar profile and the local
`src/content/publications/` collection (80 entries), cross-checked against the
self-declared `researchInterests` in `src/content/researchers/*.md`. Purpose:
replace the current three streams in `src/data/research.json`, which were
largely aspirational, with a structure that reflects what the lab's six
researchers actually publish.

## Current state and the problem

`src/data/research.json` defines three streams:

| Stream | Topics |
|---|---|
| `se-methodologies-architecture` | Microservices, Clean Code, MVC/MVVM, TDD, DDD, Design Patterns |
| `domain-specific-se-applications` | EdTech, Fintech, Healthcare Software, Startup Tools, Industrial Automation |
| `emerging-technologies-se` | Code Quality Analysis, Bug Prediction, AI Test Generation, Requirements Automation, Documentation Automation, LLM-Assisted Coding |

Five of the six researchers carry the identical pair
(`domain-specific-se-applications`, `emerging-technologies-se`), and only one
researcher (Dian Hanifudin Subhi) is assigned to
`se-methodologies-architecture`. On the researcher directory this reads as
near-random badge assignment rather than a real specialization signal, and
none of the flat topic lists (Microservices, TDD, DDD, Bug Prediction,
Requirements Automation) are backed by a single publication in the corpus
below. What the lab actually produces is dominated by applied AI/NLP work,
decision-support and recommendation systems, and educational or
institutional software, with a smaller but real thread of SE methodology
work (architecture, testing, automated assessment).

## Per-researcher dossier

Each dossier lists Google Scholar metrics (fetched live), the researcher's
self-declared interests, representative publications pulled from the local
collection, and the SE-context research areas the evidence supports.

### Imam Fahrur Rozi

- Google Scholar: 631 citations, h-index 11, i10-index 12. Listed interests: Programming, Software, Data Mining, Text Processing.
- Declared interests (profile): Indonesian-language sentiment analysis, fake news detection, OCR and document analysis.
- Representative publications:
  - "Implementasi opinion mining (analisis sentimen) untuk ekstraksi data opini publik pada perguruan tinggi" (2012, 198 citations)
  - "Pengembangan sistem penunjang keputusan penentuan UKT mahasiswa dengan menggunakan metode MOORA" (2017, 83 citations)
  - "Fake news detection using sentiment analysis approach in Indonesian language" (2023)
  - "Enhancing Aspect-Based Sentiment Analysis for Radio Station Public Opinion" (2024, preprocessing and class-imbalance handling)
  - "Comparison of feature extraction in SVM-based sentiment analysis system" (2025)
- Also produced 4 books on data structures, algorithms, and Java programming fundamentals (2020-2025), indicating a CS-education pedagogy thread alongside the research output.
- SE-context research areas: applied NLP for information systems (sentiment analysis, misinformation detection), OCR/document processing pipelines, and a supporting decision-support paper. His book output ties him into programming/CS education materials.

### Ridwan Rismanto

- Google Scholar: 189 citations, h-index 8, i10-index 5. Listed interest label: Computer Science.
- Declared interests (profile): concept-map-based learning evaluation, supervisor recommendation systems, OCR for document digitization.
- Representative publications:
  - "Research supervisor recommendation system based on topic conformity" (2020, 27 citations)
  - "Evaluating the kit-build concept mapping process using sub-map scoring" (2024, Research & Practice in Technology Enhanced Learning)
  - "The evaluation of concept map recomposition order and its effect on learning outcomes" (2026, same venue)
  - "Optimalisasi image thresholding pada optical character recognition pada sistem digitalisasi dan pencarian dokumen" (2020, 10 citations)
- Sustained multi-year collaboration with Hiroshima University on kit-build concept mapping is his strongest, most distinctive research line.
- SE-context research areas: educational software systems and learning analytics (concept-mapping tools, evaluation pipelines), recommender systems for academic supervision, OCR-based document digitization.

### Elok Nur Hamdana

- Google Scholar: 226 citations, h-index 8, i10-index 5. Listed interest label: Sistem Informasi (Information Systems).
- Declared interests (profile): multi-criteria decision support systems, Twitter sentiment analysis, thesis-topic recommendation systems.
- Representative publications:
  - "Pengembangan Aplikasi Analisis Sentimen Twitter Menggunakan Metode Naive Bayes Classifier" (2018, 38 citations)
  - "Performance testing sistem ujian online menggunakan JMeter pada lingkungan virtual" (2023, 33 citations)
  - "Sistem pendukung keputusan prioritas calon penerima Program Indonesia Pintar" (2018, 20 citations)
  - "Metode Extreme Programming pada Aplikasi Jayanti untuk Rekomendasi Mahasiswa Berprestasi Non Akademik" (2024)
  - "Penerapan Metode ELECTRE untuk Optimalisasi Sistem Rekomendasi dalam Pemilihan Topik Skripsi" (2025)
- The most prolific researcher in the local collection (over 20 tagged publications), spanning MCDM methods (WASPAS, ELECTRE, MOORA, PROMETHEE, AHP), sentiment analysis, and applied software delivery for community/institutional systems.
- SE-context research areas: multi-criteria decision support as a software feature, recommender systems, and a genuine software-engineering-practice thread (JMeter performance testing, an Extreme Programming case study) that is thin elsewhere in the lab.

### Dian Hanifudin Subhi

- Google Scholar: 64 citations, h-index 4, i10-index 1. Listed interest label: Cloud Computing.
- Declared interests (profile): adaptive publish-subscribe models, automated web-programming assessment.
- Representative publications:
  - "Implementasi sentimen analisis komentar channel video pelayanan pemerintah di Youtube menggunakan algoritma Naive Bayes" (2019, 40 citations, his highest)
  - "A Scalable Simulation Testbed for O-RAN" (2023, international collaboration with Eun-Sung Jung)
  - "Implementasi Clean Architecture pada Sistem Manajemen Tiket Penanganan Insiden" (2025)
  - "Evaluasi Penilaian Otomatis Pemrograman Web Laravel pada Platform LAIBA" (2025, automated assessment)
  - "Semantic Automated Assessment Of Student Flowcharts Via Graph Neural Networks And Symbolic Execution" (2026)
  - "Usability Evaluation of Railway Component Supply Chain Management Information System Using System Usability Scale" (2024)
- Of the six researchers, his portfolio is the clearest match for the existing `se-methodologies-architecture` label (Clean Architecture, distributed pub-sub systems, usability evaluation), but his most recent and most novel work (2025-2026) is specifically automated programming assessment, an AI4SE direction distinct from architecture patterns.
- SE-context research areas: software architecture and quality practice, and a growing AI4SE line (automated code/flowchart assessment) that deserves its own visibility rather than being folded into a generic "emerging technologies" label.

### Moch. Zawaruddin Abdullah

- Google Scholar: 213 citations, h-index 6, i10-index 3. Listed interests: text mining, NLP, information systems, data science, AI.
- Declared interests (profile): multi-document summarization, machine-learning-based stock prediction, journal systems and scholarly metadata.
- Representative publications:
  - "Rancang Bangun Sistem Informasi Akuntansi Berbasis Website menggunakan Framework Laravel" (2020, 94 citations, his highest)
  - "Sentence Extraction Based on Sentence Distribution and Part of Speech Tagging for Multi-Document Summarization" (2018, TELKOMNIKA)
  - "Google trends and technical indicator based machine learning for stock market prediction" (2023)
  - "The Development of Meta data Extractor Plugin for Open Journal System" (2024)
- Also built SIM-TA (a thesis-management information system with a Python-based supervisor-recommendation engine) and Polinema SnapLink (a campus URL shortener), both deployed institutional software rather than papers.
- SE-context research areas: NLP/text summarization, ML-based forecasting, and a distinctive thread of scholarly/academic infrastructure engineering (OJS tooling, thesis-management systems) that no other researcher covers.

### Ariadi Retno Tri Hayati Ririd

- Google Scholar: 31 citations, h-index 4, i10-index 1. Listed interest label: Data Mining.
- Declared interests (profile): image identification and micro-expression analysis, time-series forecasting, finite state machines in games.
- Representative publications:
  - "Analisa Pengembangan Model Kualitas Berstruktur Hirarki Dengan Kustomisasi ISO 9126 Untuk Evaluasi Aplikasi Perangkat Lunak B2B" (2009), her oldest paper and the only direct software-quality-model work in the entire lab corpus
  - "Micro expression: comparison of speed and marking accuracy in facial component detection" (2018)
  - "Parameter Optimization Of Holt-Winters Exponential Smoothing Using Golden Section Method for Predicting Indonesian Car Sales" (2021)
  - "Implementasi Fsm (Finite State Machine) Pada Game Perjuangan Pangeran Diponegoro" (2018)
  - "Sentiment Analysis of Visitor Reviews on Google Maps at Kampung Coklat Tourism" (2025)
- Highest publication count of the six but the lowest per-paper citation impact; work spans computer vision, forecasting, game AI, and clustering, plus several UMKM/community web applications.
- SE-context research areas: computational intelligence for domain applications (computer vision, forecasting, game AI), with a mostly dormant but historically significant software-quality-evaluation thread from her 2009 paper.

## Proposed structure: Research Areas, not Streams

**Terminology.** Retire "stream" as the user-facing label. Display **"Research
Areas"** in English and **"Bidang Riset"** in Indonesian. Keep the internal
`streams` field name and IDs as-is in `research.json`, the researcher schema,
and `se.members.streams`, so this is a display-only rename, not a data
migration.

**Structure.** Move from a flat `topics: string[]` per stream to two tiers:
each Area has a set of evidence-based **Topics**, and researchers are tagged
by specific topic (rolling up to areas) instead of by area alone. This is
what fixes the "everyone has the same two badges" problem: topic-level
tagging differentiates researchers who share an area (e.g., Elok and Imam
both touch AI-Driven Text Intelligence, but Elok's topics lean
decision-support and Imam's lean text/document processing).

### Area 1: AI-Driven Text & Data Intelligence

Tagline: Natural language processing, sentiment analysis, and predictive
modeling applied to real-world Indonesian-language and institutional data.

Topics: Sentiment Analysis & Opinion Mining, NLP & Text Processing (OCR,
summarization, typo correction), Conversational AI & Chatbots, Predictive
Modeling & Forecasting.

Researchers: Imam Fahrur Rozi (Sentiment Analysis, NLP & Text Processing),
Elok Nur Hamdana (Sentiment Analysis), Moch. Zawaruddin Abdullah (NLP & Text
Processing, Predictive Modeling), Dian Hanifudin Subhi (Sentiment Analysis,
Conversational AI), Ariadi Retno Tri Hayati Ririd (Predictive Modeling,
Sentiment Analysis).

### Area 2: Intelligent Decision & Recommendation Systems

Tagline: Multi-criteria decision methods and recommender systems built for
academic and institutional decision-making.

Topics: Multi-Criteria Decision Support (AHP, WASPAS, ELECTRE, MOORA,
PROMETHEE), Recommender Systems, Academic & Learning Recommendation.

Researchers: Elok Nur Hamdana (Multi-Criteria Decision Support), Ridwan
Rismanto (Academic & Learning Recommendation), Moch. Zawaruddin Abdullah
(Recommender Systems, via SIM-TA's supervisor-matching engine), Ariadi Retno
Tri Hayati Ririd (Multi-Criteria Decision Support).

### Area 3: Software Engineering Practice, Quality & Automation

Tagline: Architecture, testing, and AI-assisted automation for building and
assessing software systems.

Topics: Software Architecture & Distributed Systems, Software Quality &
Usability Testing, AI-Assisted Assessment & Automation (AI4SE).

Researchers: Dian Hanifudin Subhi (all three topics; strongest fit in the
lab), Elok Nur Hamdana (Software Quality & Usability Testing, via JMeter
testing and the Extreme Programming case study), Ariadi Retno Tri Hayati
Ririd (Software Quality & Usability Testing, historical ISO 9126 paper).

### Area 4: Domain-Specific & Educational Software Systems

Tagline: Purpose-built systems for education, scholarly infrastructure, and
community/public-sector use.

Topics: Educational Technology & Learning Analytics, Scholarly & Academic
Information Systems, Community & Public-Sector Software, Computer Vision &
Domain-Specific Applications.

Researchers: Ridwan Rismanto (Educational Technology & Learning Analytics),
Moch. Zawaruddin Abdullah (Scholarly & Academic Information Systems, via
SIM-TA and the OJS metadata plugin), Elok Nur Hamdana (Community &
Public-Sector Software), Ariadi Retno Tri Hayati Ririd (Computer Vision &
Domain-Specific Applications, plus UMKM web systems).

### Researcher-to-topic mapping table

| Researcher | Area 1 | Area 2 | Area 3 | Area 4 |
|---|---|---|---|---|
| Imam Fahrur Rozi | Sentiment Analysis; NLP & Text Processing | | | |
| Ridwan Rismanto | | Academic & Learning Recommendation | | Educational Technology & Learning Analytics |
| Elok Nur Hamdana | Sentiment Analysis | Multi-Criteria Decision Support | Software Quality & Usability Testing | Community & Public-Sector Software |
| Dian Hanifudin Subhi | Sentiment Analysis; Conversational AI | | Software Architecture & Distributed Systems; Software Quality & Usability Testing; AI-Assisted Assessment & Automation | |
| Moch. Zawaruddin Abdullah | NLP & Text Processing; Predictive Modeling | Recommender Systems | | Scholarly & Academic Information Systems |
| Ariadi Retno Tri Hayati Ririd | Predictive Modeling; Sentiment Analysis | Multi-Criteria Decision Support | Software Quality & Usability Testing | Computer Vision & Domain-Specific Applications |

## Gap analysis vs. the current 3-stream model

- `se-methodologies-architecture`'s current topics (Microservices, MVC/MVVM,
  TDD, DDD, Design Patterns) have zero publication backing across all 80
  entries in the corpus. The one researcher assigned to it, Dian Hanifudin
  Subhi, is a match on architecture and testing broadly, but not on any of
  the specific listed topics.
- `emerging-technologies-se`'s topics (Bug Prediction, Requirements
  Automation, Documentation Automation, LLM-Assisted Coding) are also
  unbacked. The one topic with real evidence, AI-assisted test/assessment
  generation, is backed by exactly one researcher's 2025-2026 work (Dian's
  LAIBA and flowchart-GNN papers) and deserves to be named precisely
  (AI-Assisted Assessment & Automation) rather than left as a generic
  aspirational label.
- `domain-specific-se-applications`'s topics (Fintech, Healthcare Software,
  Startup Tools, Industrial Automation) do not match the lab's actual domain
  work, which is concentrated in education, scholarly/academic
  infrastructure, and community/public-sector systems instead.
- The dominant real cluster, applied AI/NLP (sentiment analysis, NLP, ML
  forecasting), touching five of six researchers, had no dedicated stream at
  all under the old model; it was scattered across `domain-specific-se-applications`
  and `emerging-technologies-se` by default.

## Recommended follow-up (not done in this pass)

1. Replace the contents of `src/data/research.json` with the four areas
   above (id, `name: {en, id}`, `tagline: {en, id}`, and a `topics` array
   per area).
2. Add a `topics: string[]` field to each researcher's `streams` entry (or a
   parallel `topics` field) in `src/content/researchers/*.md`, populated per
   the mapping table.
3. Update `se.members.streams` usage in Supabase similarly once student/alumni
   topic tagging is needed.
4. Rename the user-facing label from "Research Streams"/"Streams" to
   "Research Areas" / "Bidang Riset" wherever it appears in UI copy
   (`Research.vue`, `ResearcherProfilePage.vue`, `MemberProfilePage.vue`,
   `Sidebar.vue`, `TabBar.vue`), without renaming the underlying `streams`
   identifiers or routes.
5. Add a `/research` index page (only `/research/[streamId]` exists today)
   that lists all four areas with tagline, topic chips, and linked
   researchers, giving the areas a landing page they currently lack.
6. Re-run `src/lib/labStats.ts` and any stream-derived counts once the new
   topics are in place, since per-topic tagging will change how researchers
   are counted per area.
