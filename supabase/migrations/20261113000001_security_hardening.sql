-- Security hardening from the 2026-11 site review.
--
-- 1. Event check-in codes were readable by anyone with the public anon key
--    (table-wide SELECT on se.events + a USING (true) RLS policy), so a
--    registered user could self check-in without attending. Drop the column
--    from anon/authenticated SELECT and give admins an RPC instead.
-- 2. Users could edit their own profiles.email / github_username, which the
--    admin dashboard uses to look people up before granting admin.
-- 3. members/projects self-insert RLS policies let a signed-in user POST
--    straight to PostgREST and skip the Turnstile check in the submit-*
--    Edge Functions. Those functions now insert with the service role, so the
--    policies go away (admin insert policies are untouched).
-- 4. Public profile links must be http(s): they are rendered as <a href>.

-- ── 1. check_in_code ────────────────────────────────────────────
REVOKE SELECT ON se.events FROM anon, authenticated;
GRANT SELECT (slug, title, registration_open, created_at, capacity)
  ON se.events TO anon, authenticated;

CREATE OR REPLACE FUNCTION se.get_event_check_in_codes()
RETURNS TABLE (slug TEXT, check_in_code TEXT)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = se AS $$
  SELECT e.slug, e.check_in_code
  FROM se.events e
  WHERE se.get_user_role() = 'admin'
$$;

REVOKE ALL ON FUNCTION se.get_event_check_in_codes() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION se.get_event_check_in_codes() TO authenticated;

-- ── 2. profile identity columns ─────────────────────────────────
CREATE OR REPLACE FUNCTION se.guard_profile_role_change()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  -- email / github_username mirror auth.users and are only written by the
  -- signup trigger; no client update may change them.
  IF auth.uid() IS NOT NULL THEN
    NEW.email := OLD.email;
    NEW.github_username := OLD.github_username;
  END IF;

  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NEW.id = auth.uid() OR se.get_user_role() <> 'admin' THEN
      NEW.role := OLD.role;
    ELSE
      NEW.role_updated_at := now();
      NEW.role_updated_by := auth.uid();
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- ── 3. Turnstile bypass ─────────────────────────────────────────
DROP POLICY IF EXISTS "members_insert_self" ON se.members;
DROP POLICY IF EXISTS "projects_insert_self" ON se.projects;

-- ── 4. http(s)-only links (NOT VALID: existing rows are not re-checked) ──
ALTER TABLE se.members
  ADD CONSTRAINT members_linkedin_url_http CHECK (linkedin_url IS NULL OR linkedin_url ~* '^https?://') NOT VALID,
  ADD CONSTRAINT members_profile_url_http  CHECK (profile_url  IS NULL OR profile_url  ~* '^https?://') NOT VALID,
  ADD CONSTRAINT members_github_url_http   CHECK (github_url   IS NULL OR github_url   ~* '^https?://') NOT VALID;

ALTER TABLE se.projects
  ADD CONSTRAINT projects_repo_url_http CHECK (repo_url IS NULL OR repo_url ~* '^https?://') NOT VALID,
  ADD CONSTRAINT projects_demo_url_http CHECK (demo_url IS NULL OR demo_url ~* '^https?://') NOT VALID;
