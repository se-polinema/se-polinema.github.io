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
by specific topic (rolling up to areas) instead of by area alone. Topic-level
tagging differentiates researchers who share an area rather than repeating
the same one or two badges across the whole team.

### Revision note: leading with Software Engineering, not with technique

An earlier draft of this structure organized areas around AI/data-science
techniques first (an "AI-Driven Text & Data Intelligence" area, an
"Intelligent Decision & Recommendation Systems" area). That undersold the
lab's identity as a Software Engineering lab: the areas read like a data
science group's portfolio rather than an SE group's.

This revision reorganizes the same evidence around Software Engineering
knowledge areas instead, following the structure used by Universitas
Brawijaya FILKOM's RPL (Software Engineering) Laboratory
(https://filkom.ub.ac.id/lab-rpl/penelitian-dan-publikasi/), which groups
research by SE process, quality, architecture, and a standalone Software
Engineering Education category rather than by application domain or AI
method. The flagship area is now process/architecture/quality, and the
lab's dominant AI/NLP publication cluster is reframed as **engineering** of
AI-based software systems (SE4AI: system architecture, data pipelines, and
evaluation methodology for ML-driven applications) rather than as AI
research for its own sake. No new research was done for this revision; every
researcher and publication below is the same one already documented in the
per-researcher dossiers above.

Two categories from the UB FILKOM reference are deliberately **not**
adopted: Service-Oriented Computing and Embedded/Real-Time Software Systems.
Neither has any publication backing anywhere in the 80-entry corpus, and
importing them would reintroduce the exact problem this revamp exists to
fix (aspirational categories with zero researchers behind them).

### Area 1: Software Engineering Process, Architecture & Quality (flagship)

Tagline: Architecture, testing, process methodology, and AI-assisted
automation for building and assessing software systems.

Topics: Software Architecture & Distributed Systems, Software Testing &
Quality Assurance, Software Process & Methodology, AI-Assisted SE
Automation.

Researchers: Dian Hanifudin Subhi (Software Architecture & Distributed
Systems, via Clean Architecture and distributed publish-subscribe work;
AI-Assisted SE Automation, via the LAIBA automated web-programming
assessment platform and GNN-based flowchart grading), Elok Nur Hamdana
(Software Testing & Quality Assurance, via JMeter performance testing;
Software Process & Methodology, via her Extreme Programming case study),
Ariadi Retno Tri Hayati Ririd (Software Testing & Quality Assurance, via her
2009 ISO 9126 software-quality-model paper, the lab's earliest and only
direct quality-model work).

### Area 2: Requirements & Decision-Support Systems Engineering

Tagline: Software that operationalizes institutional decision-making and
requirements analysis through decision-support and recommendation logic.

Topics: Multi-Criteria Decision Support Engineering (AHP, WASPAS, ELECTRE,
MOORA, PROMETHEE), Recommender Systems Engineering, Requirements-Driven
Institutional Software.

Researchers: Elok Nur Hamdana (Multi-Criteria Decision Support Engineering,
her most prolific line of work), Ridwan Rismanto (Requirements-Driven
Institutional Software, via his academic-supervisor recommendation system),
Moch. Zawaruddin Abdullah (Recommender Systems Engineering, via SIM-TA's
supervisor-matching engine), Ariadi Retno Tri Hayati Ririd (Multi-Criteria
Decision Support Engineering).

### Area 3: Engineering of AI-Based & Intelligent Software Systems

Tagline: System architecture, data pipelines, and evaluation methodology for
software that embeds NLP, conversational, and predictive AI components.

Topics: NLP & Text-Processing Systems (sentiment analysis, OCR, document
processing, summarization), Conversational AI Systems (chatbots),
Predictive & Forecasting Software.

Researchers: Imam Fahrur Rozi (NLP & Text-Processing Systems, via sentiment
analysis, fake-news detection, and OCR/document analysis), Moch. Zawaruddin
Abdullah (NLP & Text-Processing Systems, via multi-document summarization;
Predictive & Forecasting Software, via ML-based stock-market prediction),
Dian Hanifudin Subhi (Conversational AI Systems, via his chatbot-based
server-monitoring system), Ariadi Retno Tri Hayati Ririd (Predictive &
Forecasting Software, via Holt-Winters car-sales forecasting).

### Area 4: Software Engineering Education & Learning Technology

Tagline: Tools, evaluation methods, and teaching materials for software
engineering and programming education.

Topics: Automated Programming Assessment, Concept-Mapping & Learning
Evaluation Tools, CS/Programming Education Materials.

Researchers: Dian Hanifudin Subhi (Automated Programming Assessment, via
LAIBA and GNN-based flowchart grading, both used in his own teaching),
Ridwan Rismanto (Concept-Mapping & Learning Evaluation Tools, his strongest
and most sustained research line, via a multi-year collaboration with
Hiroshima University on kit-build concept mapping), Imam Fahrur Rozi
(CS/Programming Education Materials, via four published textbooks on data
structures, algorithms, and Java programming).

### Area 5: Software Engineering for Community & Institutional Systems

Tagline: Applied software delivery for scholarly infrastructure,
public-sector, and community organizations.

Topics: Scholarly & Academic Infrastructure, Community & Public-Sector
Software, Computer Vision & Domain-Specific Applications.

Researchers: Moch. Zawaruddin Abdullah (Scholarly & Academic Infrastructure,
via SIM-TA's thesis-management system and the Open Journal System metadata
extractor plugin), Elok Nur Hamdana (Community & Public-Sector Software, via
her applied delivery work for institutional and community systems), Ariadi
Retno Tri Hayati Ririd (Computer Vision & Domain-Specific Applications, via
micro-expression facial detection, game AI, and UMKM web systems).

### Researcher-to-topic mapping table

| Researcher | Area 1: Process, Architecture & Quality | Area 2: Requirements & Decision-Support | Area 3: AI-Based Software Systems | Area 4: SE Education | Area 5: Community & Institutional Systems |
|---|---|---|---|---|---|
| Imam Fahrur Rozi | | | NLP & Text-Processing Systems | CS/Programming Education Materials | |
| Ridwan Rismanto | | Requirements-Driven Institutional Software | | Concept-Mapping & Learning Evaluation Tools | |
| Elok Nur Hamdana | Software Testing & Quality Assurance; Software Process & Methodology | Multi-Criteria Decision Support Engineering | | | Community & Public-Sector Software |
| Dian Hanifudin Subhi | Software Architecture & Distributed Systems; AI-Assisted SE Automation | | Conversational AI Systems | Automated Programming Assessment | |
| Moch. Zawaruddin Abdullah | | Recommender Systems Engineering | NLP & Text-Processing Systems; Predictive & Forecasting Software | | Scholarly & Academic Infrastructure |
| Ariadi Retno Tri Hayati Ririd | Software Testing & Quality Assurance | Multi-Criteria Decision Support Engineering | Predictive & Forecasting Software | | Computer Vision & Domain-Specific Applications |

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
  (AI-Assisted SE Automation) rather than left as a generic aspirational
  label.
- `domain-specific-se-applications`'s topics (Fintech, Healthcare Software,
  Startup Tools, Industrial Automation) do not match the lab's actual domain
  work, which is concentrated in education, scholarly/academic
  infrastructure, and community/public-sector systems instead.
- A first attempt at fixing the above (the earlier 4-area draft) overcorrected
  in the other direction: it led with AI/data-science technique labels
  ("AI-Driven Text & Data Intelligence", "Intelligent Decision &
  Recommendation Systems"), which is accurate to the publication record but
  reads as a data science group's structure, not a Software Engineering
  lab's. The 5-area structure above keeps the same evidence but puts SE
  process, architecture, and quality first, reframes the AI/NLP cluster as
  software-engineering-of-AI-systems rather than AI research, and gives
  software engineering education its own visible area, matching how peer SE
  labs (e.g. UB FILKOM's RPL lab) present their research identity.

## Recommended follow-up (not done in this pass)

1. Replace the contents of `src/data/research.json` with the five areas
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
   that lists all five areas with tagline, topic chips, and linked
   researchers, giving the areas a landing page they currently lack.
6. Re-run `src/lib/labStats.ts` and any stream-derived counts once the new
   topics are in place, since per-topic tagging will change how researchers
   are counted per area.

## Trends & Future Directions

Beyond describing where the lab's research already sits, it is worth naming
where it could grow next. The two tiers below are deliberately kept apart:
the first only names directions the portfolio is already moving toward
(citing a specific publication sequence as evidence), the second names
directions that fit current field momentum but have no publication behind
them yet in this lab. Collapsing that distinction is exactly the mistake the
first draft of this revamp made by presenting unbacked categories as if they
were real specializations, so this section is explicit about which is which.

### Evidenced trajectories: already in motion

**Area 1 -> Automated Software Engineering (AI4SE).** Dian Hanifudin Subhi's
two most recent papers form an accelerating, two-year research program
rather than two unrelated projects: "Evaluasi Penilaian Otomatis Pemrograman
Web Laravel pada Platform LAIBA" (2025) built an automated grading platform
for a web-programming course, and "Semantic Automated Assessment Of Student
Flowcharts Via Graph Neural Networks And Symbolic Execution" (2026) applied a
materially more sophisticated technique (GNN plus symbolic execution) to the
same problem class. That trajectory now lines up closely with where the
field is moving: AI4SE has grown into a named, tracked research program (the
JetBrains 2025 AI4SE retrospective), a dedicated LLM4SE workshop runs at
STAF 2026, and ICSE 2026 is running its first AI-SQE workshop specifically
on using AI/LLMs as evaluators of software artifacts ("judgment, metrics,
benchmarks"), which is close to a direct description of what LAIBA and the
GNN-flowchart work already do. This is the strongest candidate for
eventually becoming a named flagship direction in its own right, the same
way Software Engineering Education was promoted out of a topic into its own
area in the prior revision once the evidence justified it.

**Area 4 -> LLM-based automated feedback for SE education.** Ridwan
Rismanto's multi-year concept-mapping evaluation research (with Hiroshima
University) and Dian's automated assessment tooling are both, at their core,
learning-evaluation systems. The 2026 literature on SE education is
converging on pairing automated evaluation with generative feedback rather
than a bare pass/fail signal: work on autonomous LLM-generated feedback for
introductory SE course exercises, LLM-based automated grading in programming
education, and ACM's own framing that SE education must adapt for an
LLM-saturated environment. Extending LAIBA or a concept-mapping tool with
generated, explanatory feedback would be a believable near-term step, not a
speculative leap.

### Aspirational directions: plausible, not yet backed

**Area 3 -> MLOps / engineering discipline for the lab's AI-based systems.**
Imam's, Zawaruddin's, and Ariadi's NLP and forecasting work (sentiment
analysis, summarization, stock-market prediction) is built on classical ML
methods (Naive Bayes, SVM) evaluated as one-off research results. The
field's 2025-2026 center of gravity for ML-based software has moved toward
operational maturity: versioning, drift monitoring, reproducibility, and
governance of AI-assisted software evolution (an emerging sub-field, AI4RSE,
names this concern directly for research-software contexts, which fits this
lab's academic setting). No publication in the corpus currently addresses
deployment, monitoring, or maintenance of these models, so this is a
plausible next step given field direction, not a trend the lab is already
riding.

**Area 2 -> AI-augmented or explainable decision support.** The MCDM
publication record (AHP, WASPAS, ELECTRE, MOORA, PROMETHEE) is
methodologically classical and has shown no movement toward LLM-augmented
requirements elicitation or explainable decision support in any of the
dated publications reviewed. Worth naming as a stretch goal if the team
wants to modernize this line, but it should not be presented as an emerging
trend already underway.

**Area 5 has no clear trend vector.** Scholarly infrastructure and
community/public-sector delivery work (SIM-TA, the OJS plugin, UMKM systems)
reads as a steady applied-delivery area rather than one with a visible
research-trend arc; there is no obvious "what's next" to name here beyond
continuing to build and publish on deployed systems as they mature.

Sources for the field-trend claims above:
- [The Impact and Achievements of AI4SE in 2025 (JetBrains)](https://blog.jetbrains.com/research/2026/03/ai4se-in-2025/)
- [LLM4SE 2026, STAF 2026](https://conf.researchr.org/home/staf-2026/llm4se-2026)
- [AI-SQE 2026, ICSE 2026](https://conf.researchr.org/home/icse-2026/ai-sqe-2026)
- [Advancing research software engineering with AI: a research framework, Automated Software Engineering (Springer)](https://link.springer.com/article/10.1007/s10515-026-00621-0)
- [Autonomous LLM-generated Feedback for Student Exercises in Introductory Software Engineering Courses](https://arxiv.org/pdf/2604.20803)
- [A comparative analytical study of LLM-based automated grading in programming education (ScienceDirect)](https://www.sciencedirect.com/science/article/pii/S2590291126007096)
- [Software Engineering Education Must Adapt and Evolve for an LLM Environment (ACM)](https://dl.acm.org/doi/10.1145/3626252.3630927)
