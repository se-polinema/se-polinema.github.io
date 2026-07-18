/**
 * migrate-member-photos.mjs
 *
 * One-time (but safe to re-run) migration: uploads any se.members photo that
 * still points at the old committed-static-file convention
 * (`/images/members/<file>`, see supabase/migrations/009_add_alumni_solikhin.sql
 * and 011_add_alumni_batch.sql) into the `member-photos` Supabase Storage
 * bucket (supabase/migrations/014_member_photos_storage.sql), then updates
 * that row's `photo` column to the new Storage public URL.
 *
 * Self-limiting by construction: only rows still matching the legacy
 * `/images/members/%` path are touched, so once every such row has been
 * migrated this becomes a permanent no-op — safe to leave wired into CI
 * indefinitely, no manual removal needed after the first successful run.
 *
 * Required env vars (set as GitHub Actions secrets, never in client bundles):
 *   PUBLIC_SUPABASE_URL       — Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY — service role key (bypasses RLS for writes)
 *
 * Run:
 *   PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/migrate-member-photos.mjs
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MEMBERS_IMAGES_DIR = resolve(__dirname, '../public/images/members')
const LEGACY_PREFIX = '/images/members/'
const BUCKET = 'member-photos'

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

const { data: rows, error: selectError } = await supabase
  .from('members')
  .select('id, photo')
  .like('photo', `${LEGACY_PREFIX}%`)

if (selectError) {
  console.error('Failed to query members:', selectError.message)
  process.exit(1)
}

if (!rows || rows.length === 0) {
  console.log('No legacy-path member photos found — nothing to migrate.')
  process.exit(0)
}

console.log(`Found ${rows.length} member photo(s) still on the legacy static path.`)

let failures = 0

for (const row of rows) {
  const filename = row.photo.slice(LEGACY_PREFIX.length)
  const localPath = resolve(MEMBERS_IMAGES_DIR, filename)

  if (!existsSync(localPath)) {
    console.error(`Skipping ${row.id}: local file not found at public/images/members/${filename}`)
    failures++
    continue
  }

  const fileBytes = readFileSync(localPath)
  const storagePath = `admin/${filename}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBytes, { upsert: true, contentType: 'image/jpeg' })

  if (uploadError) {
    console.error(`Upload failed for ${filename}:`, uploadError.message)
    failures++
    continue
  }

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)

  const { error: updateError } = await supabase
    .from('members')
    .update({ photo: publicUrlData.publicUrl })
    .eq('id', row.id)

  if (updateError) {
    console.error(`DB update failed for ${filename}:`, updateError.message)
    failures++
    continue
  }

  console.log(`Migrated ${filename} -> ${publicUrlData.publicUrl}`)
}

if (failures > 0) {
  console.error(`Done with ${failures} failure(s).`)
  process.exit(1)
}

console.log('Done.')
