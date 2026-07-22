-- ============================================================
-- Extend se.projects to losslessly hold the older static content-
-- collection projects schema (src/content.config.ts projectsCollection),
-- so the 5 curated entries in src/content/projects/*.md can also be
-- synced into the Showcase (see scripts/sync-static-projects.mjs) without
-- dropping any of their richness: multi-image galleries, status,
-- research-stream tagging, researcher/contributor attribution, and
-- featured/private flags. /projects itself (the static page) is
-- untouched by this — both systems coexist permanently, this is an
-- additive copy, not a migration-and-remove.
--
-- techStack[] from the old schema reuses the EXISTING `tags` column
-- (same concept — technology/topic tags) rather than adding a redundant
-- column. `repo` (old, bare "owner/name") maps to `repo_url` (new, full
-- URL) in the sync script, not a schema change.
-- ============================================================

ALTER TABLE se.projects
  ADD COLUMN status       TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','completed','prototype','under-development')),
  ADD COLUMN stream       TEXT,
  ADD COLUMN researchers  TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN contributors TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN featured     BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN private      BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN video_url    TEXT,
  ADD COLUMN slug         TEXT;

-- Only synced/admin-curated rows get a slug (self-service rows keep it
-- NULL). A plain (non-partial) UNIQUE constraint — not a partial unique
-- index like members_user_id_key's — because PostgREST/supabase-js's
-- upsert(..., {onConflict: 'slug'}) (used by sync-static-projects.mjs)
-- generates a bare `ON CONFLICT (slug)` with no WHERE predicate, which
-- Postgres can only resolve against a full unique constraint/index, not
-- a partial one (confirmed live: a partial index here raises 42P10 "no
-- unique or exclusion constraint matching the ON CONFLICT specification").
-- Standard SQL NULL-distinct semantics mean this still allows unlimited
-- self-service rows with slug = NULL — only real duplicate slugs conflict.
ALTER TABLE se.projects ADD CONSTRAINT projects_slug_key UNIQUE (slug);

-- image (singular) -> images (array): curated entries need galleries;
-- self-service stays a single-image UX client-side, just stored as a
-- one-element array. Safe add/backfill/drop — this table has no real
-- production data yet (feature shipped this session).
ALTER TABLE se.projects ADD COLUMN images TEXT[] NOT NULL DEFAULT '{}';
UPDATE se.projects SET images = ARRAY[image] WHERE image IS NOT NULL AND image <> '';
ALTER TABLE se.projects DROP COLUMN image;

-- Self-insert must not be able to fabricate curatorial fields (claim
-- featured/private status, forge researcher/contributor attribution, or
-- set a non-default status/stream/slug/video_url for themselves). Unlike
-- se.members' graduate_member (an UPDATE, where OLD/NEW diffing isn't
-- expressible in RLS), this is INSERT — a WITH CHECK can validate the
-- whole new row, so no SECURITY DEFINER RPC is needed. Every clause below
-- equals the column DEFAULT, so submit-project (which never sends these
-- keys) passes by omission unchanged.
ALTER POLICY "projects_insert_self" ON se.projects
  WITH CHECK (
    auth.uid() = user_id
    AND approved = false
    AND featured = false
    AND private = false
    AND status = 'active'
    AND stream IS NULL
    AND researchers = '{}'
    AND contributors = '{}'
    AND video_url IS NULL
    AND slug IS NULL
  );

COMMENT ON COLUMN se.projects.tags IS 'Technology/topic tags. Also holds the old content-collection techStack[] for synced curated entries.';
COMMENT ON COLUMN se.projects.slug IS 'Set only for entries synced from src/content/projects/*.md (sync-static-projects.mjs onConflict key) or manually by an admin. NULL for self-service rows. NOT wired to routing — /showcase/detail?id= stays the only scheme.';
COMMENT ON COLUMN se.projects.images IS 'Gallery. images[0] is the cover shown on the directory card.';
COMMENT ON COLUMN se.projects.researchers IS 'Researcher content-collection slug ids (see src/content/researchers/), resolved client-side via /api/researchers.json — not a DB foreign key.';
