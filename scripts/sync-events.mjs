/**
 * sync-events.mjs
 *
 * Reads src/content/blog/*.md and upserts a se.events row for every entry
 * with `category: event` and `managed: true`. Keyed on the filename slug,
 * which matches the Astro content id and the /events/<slug>/ route.
 *
 * Uses insert-only upsert (ignoreDuplicates: true) so re-runs never clobber
 * an existing event's auto-generated check_in_code or registration_open flag.
 *
 * Required env vars (set as GitHub Actions secrets, never in client bundles):
 *   PUBLIC_SUPABASE_URL: Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY: service role key (bypasses RLS for writes)
 *
 * Run:
 *   PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/sync-events.mjs
 */

import { readdirSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = resolve(__dirname, '../src/content/blog')

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

const events = readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith('.md'))
  .map((f) => ({
    slug: f.replace(/\.md$/, ''),
    data: matter(readFileSync(resolve(BLOG_DIR, f), 'utf8')).data,
  }))
  .filter((e) => e.data.category === 'event' && e.data.managed === true)
  .map((e) => ({ slug: e.slug, title: e.data.title }))

if (events.length === 0) {
  console.log('No managed events found, nothing to sync.')
  process.exit(0)
}

console.log(`Found ${events.length} managed event(s) to sync:`, events.map((e) => e.slug).join(', '))

// ignoreDuplicates: true, insert new rows only; existing rows are left untouched
// so check_in_code and registration_open are never overwritten by a re-run.
const { error } = await supabase
  .from('events')
  .upsert(events, { onConflict: 'slug', ignoreDuplicates: true })

if (error) {
  console.error('Sync failed:', error.message)
  process.exit(1)
}

console.log('Done.')
