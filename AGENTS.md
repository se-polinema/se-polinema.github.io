# AGENTS.md: SE Polinema Development Guide

## Overview

Static site built with [Astro](https://astro.build) + Vue 3 + Tailwind CSS v4.
Hosted on GitHub Pages at `se.polinema.ac.id`.

## Writing Style

Do not use em-dashes (—) in content: blog posts, docs, researcher bios, i18n
strings, or any prose. Use a comma, period, colon, or restructure the sentence
instead. (This rule doesn't apply to UI-symbol uses like a table's empty-cell
placeholder or a CSS class name that happens to contain the character.)

## Deployment & Base-Path Convention

Two environments deploy from one GitHub Pages site: production from `main`
at `/`, beta from `develop` at `/beta/` (see README.md's "Release Flow"
section for the branch/PR sequence and `.github/workflows/deploy.yml` for the
build). The beta build sets `BASE_PATH=/beta/`, read by `astro.config.mjs`.

Because of this, **never hardcode a root-absolute path** in `src/`
(`href="/members"`, `fetch('/api/...')`, `src="/images/..."`, string
concatenation like `'/blog/' + slug`, or a ternary branch producing one).
Import from `src/lib/paths.ts` instead:

- `withBase(path)`: prefixes a base-free path. Use for hrefs, `src`
  attributes, `fetch()` URLs, and redirects. Safe on external URLs (passes
  them through unchanged), so wrap even fields that might sometimes be
  external.
- `stripBase(pathname)`: inverse, for comparing against
  `window.location.pathname` (active-nav state, route resolution).

Store paths base-free in data/constants and call `withBase()` once, at the
render or navigation edge, not at the point of definition. Content collection
frontmatter (e.g. a researcher's `photo` field) stays base-free; wrap it at
whatever component renders it as an `<img src>`. Markdown/raw-HTML content
embedding root-absolute asset paths is handled separately by the
`rehypeBasePaths` plugin in `astro.config.mjs`, not by editing content files.

## Getting Started

```bash
npm install        # install dependencies
npm run dev        # start dev server (astro dev)
npm run build      # build + typecheck (astro check && astro build)
npm run preview    # preview production build (astro preview)
```

## Knowledge Graph (graphify)

`graphify-out/GRAPH_REPORT.md` and `graphify-out/graph.json` contain a
knowledge graph of `src/` (modules, pages, components, and their
relationships).

- Before planning any requirement, issue, or refactor, read
  `graphify-out/GRAPH_REPORT.md` first to locate affected files and hubs.
- For targeted questions, run: `graphify query "<question>"`.
- After significant structural changes, regenerate with the `/graphify`
  skill and commit the updated `graph.json` + `GRAPH_REPORT.md`.

## Sync Scripts

### Publication Sync (`npm run sync:publications`, scheduled + manual)

Fetches Google Scholar publications *and* author-level metrics (h-index,
i10-index, total/5-year citations, per-publication citation counts) for all
researchers in a single pass, and writes new publications as Markdown files
under `src/content/publications/`. Runs on a bi-monthly schedule via
`.github/workflows/update-publications.yml` (opens a PR with any changes);
can also be run manually.

```bash
node scripts/update-publications.mjs
```

- Reads all researchers from `src/content/researchers/*.md`
- Extracts Google Scholar user IDs from `googleScholarUrl`
- For each researcher, calls `node-scholarly`'s `searchAuthorId()` once:
  this single call returns both the publication list (up to 100 per
  researcher) and author-level metrics, so nothing is fetched twice
- Deduplicates new publications against existing ones (by normalized title + year)
- Generates Markdown frontmatter with `title`, `year`, `type`, `venue`, `authors`,
  `url`, `doi` (if available), `googleScholarUrl`, `citedByCount` (if available),
  `researchers[]`, `featured`, `language`
- Writes `src/data/_sync-meta.json` with `lastUpdated` timestamp and publication counts
- Writes `src/data/_scholar-metrics.json` with h-index/i10-index/citation data
  (same shape as below); falls back gracefully per-researcher if Google Scholar
  blocks a request (stores zero values + an `_error` field, never crashes the sync)
- Rate-limited: 5-second delay between researcher fetches, 15s timeout, 2 retries

**`_scholar-metrics.json` shape:**

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

### Metrics refresh workflow

1. Run `node scripts/update-publications.mjs`, which syncs new publications
   *and* scholar metrics from Google Scholar in one pass
2. Commit both updated data files (`_sync-meta.json`, `_scholar-metrics.json`)
   and any new publication `.md` files (the scheduled workflow does this
   automatically via PR)
3. The Astro build reads these files at build time; there are no runtime
   calls to Scholar

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
Insert-only: never clobbers existing check-in codes.

## Page Feedback & Comments

Blog posts, tutorials, and publication pages carry two reader-facing features:

- **Feedback widget** (`src/components/PageFeedback.vue`): a bilingual
  "Was this page helpful?" thumbs-up/down plus optional comment. It is
  Turnstile-gated and writes a row to `se.page_feedback` via the
  `page-feedback` Edge Function (`supabase/functions/page-feedback/index.ts`),
  the only insert path (there is intentionally no anon INSERT policy so the
  client anon key cannot write directly and bypass Turnstile). Admins read,
  filter, and CSV-export votes in the admin dashboard's "Feedback" tab
  (`src/components/AdminFeedbackSection.vue`).
- **Comments** (`src/components/PageComments.vue`): a Giscus iframe backed by
  GitHub Discussions. Moderation happens in GitHub, not in Supabase or the
  admin dashboard.

**Environment variables** (safe to expose; add to repo secrets for CI):

- `PUBLIC_GISCUS_REPO_ID` and `PUBLIC_GISCUS_CATEGORY_ID`, obtained from
  [giscus.app](https://giscus.app) after installing the Giscus app on
  `se-polinema/se-polinema.github.io` and creating a "Page Comments" category.
  The `PageComments.vue` term is base-free (`comments/blog/{slug}/{lang}`), so
  production and beta share one discussion per page/language.

No new Supabase secrets or npm scripts were introduced; the feedback write
reuses the existing `TURNSTILE_SECRET_KEY` Edge Function secret and the
`PUBLIC_SUPABASE_*` keys.

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
