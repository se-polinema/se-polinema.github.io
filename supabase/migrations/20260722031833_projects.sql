-- ============================================================
-- Showcase: self-service Projects/Products.
--
-- Same self-submit + admin-approval shape as se.members
-- (013_alumni_self_service.sql): a signed-in user submits their own
-- project, it stays hidden from the public showcase until an admin
-- approves it, reusing the same se.get_user_role() admin-check helper
-- used by every other admin-gated policy in this schema.
--
-- Deliberate deviation from se.members: NO unique-per-user constraint.
-- A member is a single identity (you *are* a member, capped at one row),
-- but a project is an artifact a person contributes: one person can
-- reasonably submit several. So unlike members_user_id_key, there is no
-- partial unique index here.
--
-- Only `title` is required; every other field is nullable so a partial
-- self-submission (the user hasn't run "Suggest with AI" yet, or edited
-- some fields away) or an admin transcription is always insertable.
-- Fails safe the same way members does: the self-insert CHECK requires
-- approved = false explicitly, so a client that omits/misstates it is
-- rejected outright, never silently published (column DEFAULT is true,
-- for admin inserts).
-- ============================================================

CREATE TABLE se.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  tagline_en TEXT,
  tagline_id TEXT,
  description_en TEXT,
  description_id TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  repo_url TEXT,
  demo_url TEXT,
  image TEXT,
  user_id UUID REFERENCES se.profiles(id) ON DELETE SET NULL,
  approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE se.projects IS 'Self-service showcase of member projects/products. Public read of approved rows, self-insert pending admin approval, admin-curated writes otherwise.';
COMMENT ON COLUMN se.projects.user_id IS 'Set when this row was self-submitted by a signed-in user; NULL for admin-added entries. Unlike se.members, one user may own multiple rows.';
COMMENT ON COLUMN se.projects.approved IS 'Public visibility gate. Admin-added rows default true; self-submissions insert as false until an admin approves.';
COMMENT ON COLUMN se.projects.tags IS 'Freeform short topic/technology tags, e.g. drafted by the AI-suggest edge function or entered manually.';

ALTER TABLE se.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_select_approved" ON se.projects
  FOR SELECT USING (approved = true);

CREATE POLICY "projects_select_own" ON se.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "projects_select_admin" ON se.projects
  FOR SELECT USING (se.get_user_role() = 'admin');

CREATE POLICY "projects_insert_self" ON se.projects
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND approved = false
  );

CREATE POLICY "projects_insert_admin" ON se.projects
  FOR INSERT WITH CHECK (se.get_user_role() = 'admin');

CREATE POLICY "projects_update_admin" ON se.projects
  FOR UPDATE USING (se.get_user_role() = 'admin');

CREATE POLICY "projects_delete_admin" ON se.projects
  FOR DELETE USING (se.get_user_role() = 'admin');

-- authenticated gets SELECT/INSERT/UPDATE via 002_grants.sql's schema-wide
-- default privileges; DELETE is not covered by that default (see
-- 008_members.sql's identical grant for the same reason).
GRANT DELETE ON se.projects TO authenticated;

CREATE INDEX projects_approved_created_idx ON se.projects (approved, created_at DESC);

CREATE OR REPLACE FUNCTION se.projects_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER projects_set_updated_at
  BEFORE UPDATE ON se.projects
  FOR EACH ROW EXECUTE FUNCTION se.projects_set_updated_at();

-- ============================================================
-- Storage bucket for project cover images. Mirrors
-- 014_member_photos_storage.sql's bucket + policy shape exactly, except
-- the path convention accounts for one user owning multiple projects:
-- self-service uploads live under {auth.uid()}/{project-uuid}/photo.jpg
-- (a fresh client-generated uuid per project, since members' fixed
-- {auth.uid()}/photo.jpg only works for a one-row-per-user table).
-- storage.foldername(name)[1] is still just {auth.uid()}, so the same
-- RLS shape applies unchanged. Admin uploads live under
-- admin/{fresh-uuid}/photo.jpg, same as members' admin/{id}.jpg pattern.
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('project-images', 'project-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "project_images_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "project_images_insert_own_or_admin" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-images'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR se.get_user_role() = 'admin')
  );

CREATE POLICY "project_images_update_own_or_admin" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'project-images'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR se.get_user_role() = 'admin')
  );

CREATE POLICY "project_images_delete_own_or_admin" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'project-images'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR se.get_user_role() = 'admin')
  );
