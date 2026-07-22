/**
 * sync-static-projects.mjs
 *
 * Reads src/content/projects/*.md (the static, curated researcher-works
 * showcase at /projects — see src/content.config.ts's projectsCollection)
 * and upserts a corresponding se.projects row for each, so the same
 * curated entries also appear in the self-service Showcase at /showcase.
 * /projects itself is never touched by this script — this is an additive
 * copy, not a migration.
 *
 * Keyed on `slug` (the markdown filename), matching se.projects' partial
 * unique index (supabase/migrations/20260722082908_projects_extend.sql).
 * Uses insert-only upsert (ignoreDuplicates: true), same as
 * sync-events.mjs — re-runs never touch an already-synced row, so if a
 * curated entry is later hand-edited in Supabase (e.g. an admin tweaks
 * its tagline) or in the markdown, this script won't clobber either side.
 * A newly added *.md file syncs automatically on the next run.
 *
 * Field mapping: description/descriptionId -> description_en/id,
 * techStack[] -> tags (same concept, reuses the existing column),
 * repo ("owner/name") -> repo_url (prefixed with https://github.com/),
 * demoUrl/videoUrl -> demo_url/video_url, status/stream/researchers/
 * contributors/featured/private map 1:1. tagline_en/id are left null —
 * the old schema has no tagline concept. The rich bilingual Markdown
 * body (sim-ta.md, polinema-snap-link.md) is deliberately NOT synced —
 * se.projects has no body column, only the short frontmatter description
 * travels; the long-form write-up stays exclusive to /projects.
 *
 * Images: local files referenced under public/images/projects/ are
 * uploaded to the project-images Storage bucket at
 * migrated/{slug}/{n}.{ext} (organized, doesn't collide with the
 * self-service {uid}/{uuid}/ or admin admin/{uuid}/ path conventions).
 * A referenced file that doesn't exist on disk (pakai.md's
 * pakai-dashboard.png, as of writing) is skipped with a warning rather
 * than failing the whole sync.
 *
 * Required env vars (set as GitHub Actions secrets, never in client bundles):
 *   PUBLIC_SUPABASE_URL       — Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY — service role key (bypasses RLS for writes)
 *
 * Run:
 *   PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/sync-static-projects.mjs
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { resolve, dirname, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECTS_DIR = resolve(__dirname, '../src/content/projects')
const IMAGES_DIR = resolve(__dirname, '../public/images/projects')
const BUCKET = 'project-images'

// migrate-member-photos.mjs hardcodes contentType: 'image/jpeg', which is
// wrong here — public/images/projects/ has PNG and SVG files too. Derive
// it from the extension instead.
const CONTENT_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
}

const url = process.env.PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Missing required env vars: PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(url, key, {
  db: { schema: 'se' },
  auth: { persistSession: false },
})

const entries = readdirSync(PROJECTS_DIR)
  .filter((f) => f.endsWith('.md'))
  .map((f) => ({
    slug: f.replace(/\.md$/, ''),
    data: matter(readFileSync(resolve(PROJECTS_DIR, f), 'utf8')).data,
  }))

if (entries.length === 0) {
  console.log('No static projects found — nothing to sync.')
  process.exit(0)
}

const { data: existingRows, error: selectError } = await supabase
  .from('projects')
  .select('slug')
  .not('slug', 'is', null)

if (selectError) {
  console.error('Failed to query existing projects:', selectError.message)
  process.exit(1)
}

const existingSlugs = new Set((existingRows ?? []).map((r) => r.slug))
const toSync = entries.filter((e) => !existingSlugs.has(e.slug))

if (toSync.length === 0) {
  console.log('All static projects already synced — nothing to do.')
  process.exit(0)
}

console.log(`Syncing ${toSync.length} new static project(s):`, toSync.map((e) => e.slug).join(', '))

const rows = []

for (const entry of toSync) {
  const { slug, data } = entry
  const uploadedUrls = []

  for (const [i, localRef] of (data.images ?? []).entries()) {
    const filename = basename(localRef)
    const localPath = resolve(IMAGES_DIR, filename)

    if (!existsSync(localPath)) {
      console.warn(`  [${slug}] skipping missing image: ${localRef}`)
      continue
    }

    const ext = extname(filename).toLowerCase()
    const storagePath = `migrated/${slug}/${i}${ext}`
    const fileBytes = readFileSync(localPath)

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, fileBytes, {
        upsert: true,
        contentType: CONTENT_TYPES[ext] ?? 'application/octet-stream',
      })

    if (uploadError) {
      console.error(`  [${slug}] upload failed for ${filename}:`, uploadError.message)
      continue
    }

    const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
    uploadedUrls.push(publicUrlData.publicUrl)
  }

  rows.push({
    slug,
    title: data.title,
    description_en: data.description ?? null,
    description_id: data.descriptionId ?? null,
    tagline_en: null,
    tagline_id: null,
    tags: data.techStack ?? [],
    status: data.status ?? 'active',
    stream: data.stream ?? null,
    researchers: data.researchers ?? [],
    contributors: data.contributors ?? [],
    featured: data.featured ?? false,
    private: data.private ?? false,
    repo_url: data.repo ? `https://github.com/${data.repo}` : null,
    demo_url: data.demoUrl ?? null,
    video_url: data.videoUrl ?? null,
    images: uploadedUrls,
    user_id: null,
    approved: true,
  })
}

// ignoreDuplicates: true — insert new rows only; an already-synced entry
// is never touched by a later run, matching sync-events.mjs's convention.
const { error: upsertError } = await supabase
  .from('projects')
  .upsert(rows, { onConflict: 'slug', ignoreDuplicates: true })

if (upsertError) {
  console.error('Sync failed:', upsertError.message)
  process.exit(1)
}

console.log(`Done. Synced ${rows.length} project(s).`)
