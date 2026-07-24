-- ============================================================
-- Admin-managed announcements, delivered live to all viewers.
--
-- Replaces the previous build-time src/data/announcement.json +
-- latest-"announcement"-category-blog-post fallback (resolved in
-- Default.astro at build time, so publishing urgent info required a
-- commit + CI redeploy). This table is the single source of truth:
-- an admin flips `active` here and every viewer sees it on their next
-- fetch, with no rebuild — and, via Realtime, even an already-open tab
-- picks it up live.
--
-- Public read is gated to active, non-expired rows only; every write is
-- admin-only, mirroring the se.members / se.projects RLS shape via the
-- shared se.get_user_role() admin-check helper.
-- ============================================================

CREATE TABLE se.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success')),
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000),
  message_id TEXT,
  link TEXT,
  link_id TEXT,
  link_text TEXT,
  link_text_id TEXT,
  dismissible BOOLEAN NOT NULL DEFAULT true,
  active BOOLEAN NOT NULL DEFAULT false,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE se.announcements IS 'Admin-authored site-wide banner, delivered live to all viewers via client fetch + Realtime. Public read of active, non-expired rows only; every write is admin-only.';
COMMENT ON COLUMN se.announcements.message IS 'English body text. Required.';
COMMENT ON COLUMN se.announcements.message_id IS 'Indonesian body text. Falls back to message when empty, same as the rest of this codebase''s bilingual fields.';
COMMENT ON COLUMN se.announcements.active IS 'Admin master switch. A row must be active AND currently within [start_date, end_date] to be shown.';
COMMENT ON COLUMN se.announcements.end_date IS 'Expiration instant. Once passed, the banner stops appearing for viewers even if active is still true — enforced both by the public SELECT policy and, for already-open tabs, client-side via a timer (see AnnouncementBanner.vue).';
COMMENT ON COLUMN se.announcements.start_date IS 'Optional "show from" instant. NULL means visible immediately once active.';

ALTER TABLE se.announcements ENABLE ROW LEVEL SECURITY;

-- Public visibility gate: active, and not yet expired. start_date is
-- deliberately NOT checked here (a "show from" row that hasn't started
-- yet is still safe to expose the client-side isInDateRange() check hides
-- it) — the columns most sensitive to leaking early are messaging that's
-- already meant to go out, not scheduling metadata.
CREATE POLICY "announcements_select_active" ON se.announcements
  FOR SELECT USING (active = true AND (end_date IS NULL OR end_date > now()));

CREATE POLICY "announcements_select_admin" ON se.announcements
  FOR SELECT USING (se.get_user_role() = 'admin');

CREATE POLICY "announcements_insert_admin" ON se.announcements
  FOR INSERT WITH CHECK (se.get_user_role() = 'admin');

CREATE POLICY "announcements_update_admin" ON se.announcements
  FOR UPDATE USING (se.get_user_role() = 'admin');

CREATE POLICY "announcements_delete_admin" ON se.announcements
  FOR DELETE USING (se.get_user_role() = 'admin');

-- authenticated gets SELECT/INSERT/UPDATE via 002_grants.sql's schema-wide
-- default privileges; DELETE is not covered by that default (see
-- 008_members.sql / 20260722031833_projects.sql's identical grant for the
-- same reason).
GRANT DELETE ON se.announcements TO authenticated;

CREATE INDEX announcements_active_created_idx ON se.announcements (active, created_at DESC);

CREATE OR REPLACE FUNCTION se.announcements_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER announcements_set_updated_at
  BEFORE UPDATE ON se.announcements
  FOR EACH ROW EXECUTE FUNCTION se.announcements_set_updated_at();

-- Realtime: lets an already-open tab pop the banner the instant an admin
-- activates/edits/deactivates a row, without waiting for the viewer's
-- next navigation. Respects RLS — anon subscribers only ever receive
-- change events for rows the active-select policy would let them read.
ALTER TABLE se.announcements REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE se.announcements;
