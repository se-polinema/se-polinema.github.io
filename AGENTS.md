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
