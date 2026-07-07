# AGENTS.md — SE Polinema Development Guide

## Overview

Static site built with [Astro](https://astro.build) + Vue 3 + Tailwind CSS v4.
Hosted on GitHub Pages at `se.polinema.ac.id`.

## Getting Started

```bash
npm install        # install dependencies
npm run dev        # start dev server (astro dev)
npm run build      # build + typecheck (astro check && astro build)
npm run preview    # preview production build (astro preview)
```

## Sync Scripts

### Publication Sync (`npm run sync:publications` — manual)

Fetches Google Scholar publications for all researchers and writes new entries as
Markdown files under `src/content/publications/`.

```bash
node scripts/update-publications.mjs
```

- Reads all researchers from `src/content/researchers/*.md`
- Extracts Google Scholar user IDs from `googleScholarUrl`
- Fetches up to 100 publications per researcher via `node-scholarly`
- Deduplicates against existing publications (by normalized title + year)
- Generates Markdown frontmatter with `title`, `year`, `type`, `venue`, `authors`,
  `url`, `doi` (if available), `googleScholarUrl`, `citedByCount` (if available),
  `researchers[]`, `featured`, `language`
- Writes `src/data/_sync-meta.json` with `lastUpdated` timestamp and counts
- Rate-limited: 5-second delay between researcher fetches, 15s timeout, 2 retries

### Scholar Metrics Sync

Fetches h-index, i10-index, total citations per researcher and per-publication
citation counts from Google Scholar.

```bash
node scripts/sync-scholar-metrics.mjs
```

**What it does:**
- For each researcher, fetches author profile metrics (h-index, i10-index, cited-by,
  5-year variants) and the top 20 most-cited publications with citation counts
- Writes all metrics to `src/data/_scholar-metrics.json` with a `lastUpdated` timestamp
- Falls back gracefully if Google Scholar blocks (stores zero values and error metadata,
  never crashes the build)

**Output file:** `src/data/_scholar-metrics.json`

```json
{
  "lastUpdated": "2025-01-01T00:00:00.000Z",
  "labMetrics": {
    "totalCitations": 500,
    "totalCitations5y": 200,
    "totalCitedPublications": 100,
    "totalPublicationCitations": 1200,
    "avgCitationsPerPublication": 12.0
  },
  "researcherMetrics": [
    {
      "researcher": "imam-fahrur-rozi",
      "name": "Imam Fahrur Rozi",
      "scholarId": "WwrDWnEAAAAJ",
      "citedby": 150,
      "hindex": 8,
      "i10index": 5
    }
  ],
  "publicationCitations": {
    "normalized-title-2024": {
      "title": "Example Publication",
      "year": 2024,
      "citedByCount": 15
    }
  },
  "mostCitedPublications": [
    { "key": "...", "title": "...", "year": 2024, "citedByCount": 50 }
  ]
}
```

**Rate limits:** 8-second delay between researcher fetches, 30s timeout, 3 retries.
Adjust `REQUEST_DELAY_MS` and `PUBLICATION_LIMIT` in the script if needed.

### Metrics refresh workflow

1. Run `node scripts/update-publications.mjs` to sync new publications from Scholar
2. Run `node scripts/sync-scholar-metrics.mjs` to fetch latest citation counts
3. Commit both updated data files (`_sync-meta.json`, `_scholar-metrics.json`)
   and any new publication `.md` files
4. The Astro build reads these files at build time — no runtime calls to Scholar

The site gracefully handles missing metrics data:
- `_scholar-metrics.json` is optional (not required for build)
- Researcher profile pages show scholar metrics only when data is available
- Impact dashboard defaults to zero citations when metrics file is absent

## Events Sync

Syncs blog posts with `category: event` and `managed: true` to Supabase.

```bash
npm run sync:events
```

Requires `SUPABASE_SERVICE_ROLE_KEY` environment variable.
Insert-only — never clobbers existing check-in codes.

## Adding a Research Tool / Artifact

To list a new lab-developed software tool, framework, library, dataset, or prototype on the Research Software & Tools catalog (`/tools`):

1. Open `src/data/tools.json`
2. Add a new JSON object with the following fields:

```json
{
  "title": "Tool Name in English",
  "titleId": "Nama Alat dalam Bahasa Indonesia",
  "description": "English description of the tool.",
  "descriptionId": "Deskripsi bahasa Indonesia dari alat tersebut.",
  "stream": "se-methodologies-architecture",
  "type": "tool",
  "status": "active",
  "repoUrl": "https://github.com/se-polinema/example",
  "demoUrl": "https://example.se.polinema.ac.id",
  "docsUrl": "https://se.polinema.ac.id/docs",
  "license": "MIT",
  "techStack": ["TypeScript", "Node.js", "PostgreSQL"],
  "researchers": ["imam-fahrur-rozi", "dian-hanifudin-subhi"],
  "publicationSlug": "2024-publication-slug-from-publications"
}
```

**Field reference:**

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | English name of the artifact |
| `titleId` | Yes | Indonesian name |
| `description` | Yes | English description (1–3 sentences) |
| `descriptionId` | Yes | Indonesian description |
| `stream` | Yes | Research stream ID from `src/data/research.json` |
| `type` | Yes | One of: `tool`, `dataset`, `framework`, `prototype`, `library` |
| `status` | Yes | One of: `active`, `archived`, `experimental` |
| `repoUrl` | No | Link to the source code repository |
| `demoUrl` | No | Link to a live demo |
| `docsUrl` | No | Link to documentation |
| `license` | No | SPDX license identifier (e.g. `MIT`, `Apache-2.0`, `CC-BY-4.0`) |
| `techStack` | Yes | Array of technologies used (empty array `[]` allowed) |
| `researchers` | Yes | Array of researcher slugs from `src/content/researchers/*.md` |
| `publicationSlug` | No | Slug of the related publication file (without `.md`) |

The page is bilingual and auto-detects user language preference.
All text fields must include both English (`title`, `description`) and Indonesian (`titleId`, `descriptionId`) values.

## Project Structure

```
src/
├── content/           # Astro content collections (md files)
│   ├── blog/
│   ├── researchers/
│   ├── publications/
│   ├── projects/
│   ├── presentations/
│   └── alumni/
├── data/              # JSON data files (research streams, FAQ, etc.)
│   ├── _sync-meta.json       # Publication sync metadata
│   └── _scholar-metrics.json # Citation metrics (generated)
├── i18n/              # en.json, id.json bilingual dictionaries
├── components/        # Vue + Astro components
├── composables/       # Vue composables (useI18n, useTheme, etc.)
├── lib/               # Server-side modules (labStats, citation, etc.)
├── pages/             # Astro route pages
├── layouts/           # Astro layout templates
├── styles/            # Global CSS
└── content.config.ts  # Content collection schemas
```
