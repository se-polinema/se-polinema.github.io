-- ============================================================
-- SE Lab Members (current student members + alumni)
--
-- One table covering both statuses since they share the same shape and
-- differ only by status: a 'student' is a currently active lab member, an
-- 'alumni' has exited (exit_year set) and typically has a post-lab
-- current_role/current_organization. Submissions arrive via the "[Alumni]"
-- GitHub Issue Form (.github/ISSUE_TEMPLATE/add-alumni.yml) and are
-- transcribed here by an admin through /admin's Members tab.
-- ============================================================

CREATE TABLE se.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  photo TEXT,
  status TEXT NOT NULL CHECK (status IN ('student', 'alumni')),
  cohort_year INT NOT NULL,
  exit_year INT,
  role_id TEXT NOT NULL,
  role_en TEXT NOT NULL,
  current_role_id TEXT,
  current_role_en TEXT,
  current_organization_id TEXT,
  current_organization_en TEXT,
  linkedin_url TEXT,
  profile_url TEXT,
  streams TEXT[] DEFAULT '{}',
  research_topics TEXT,
  career_update TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT members_alumni_has_exit_year
    CHECK (status = 'student' OR exit_year IS NOT NULL)
);

COMMENT ON TABLE se.members IS 'Unified directory of current student members and alumni; status distinguishes the two. Public read, admin-curated writes.';
COMMENT ON COLUMN se.members.status IS 'student = currently active lab member; alumni = has exited';
COMMENT ON COLUMN se.members.exit_year IS 'Required once status = alumni; NULL while a student';
COMMENT ON COLUMN se.members.current_role_id IS 'Optional: an alumnus''s post-lab job, or a student''s concurrent internship/role';
COMMENT ON COLUMN se.members.streams IS 'Research stream ids the member was/is affiliated with, matches src/content/streams';

ALTER TABLE se.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members_select_public" ON se.members
  FOR SELECT USING (true);

CREATE POLICY "members_insert_admin" ON se.members
  FOR INSERT WITH CHECK (se.get_user_role() = 'admin');

CREATE POLICY "members_update_admin" ON se.members
  FOR UPDATE USING (se.get_user_role() = 'admin');

CREATE POLICY "members_delete_admin" ON se.members
  FOR DELETE USING (se.get_user_role() = 'admin');

-- authenticated gets SELECT/INSERT/UPDATE via 002_grants.sql's schema-wide
-- default privileges; DELETE is not covered by that default, so grant it
-- explicitly for admin deletes to work.
GRANT DELETE ON se.members TO authenticated;

CREATE INDEX members_status_cohort_idx ON se.members (status, cohort_year);

CREATE OR REPLACE FUNCTION se.members_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER members_set_updated_at
  BEFORE UPDATE ON se.members
  FOR EACH ROW EXECUTE FUNCTION se.members_set_updated_at();

-- ============================================================
-- Seed: issue #267 (github.com/se-polinema/se-polinema.github.io/issues/267)
-- Role = Student (their role while in the lab) but Exit Year is filled in
-- and Current Role/Organization describe a post-lab job, so this is an
-- alumni entry, not a current student.
--
-- Note: submitted streams include "web-engineering", which is not one of
-- the site's three canonical stream ids (se-methodologies-architecture,
-- domain-specific-se-applications, emerging-technologies-se). Seeded
-- as-submitted since `streams` isn't rendered/FK-constrained yet; correct
-- via the admin edit form if desired.
-- ============================================================

INSERT INTO se.members (
  name, status, cohort_year, exit_year, role_id, role_en,
  current_role_id, current_role_en, current_organization_id, current_organization_en,
  linkedin_url, profile_url, streams, research_topics, career_update
) VALUES (
  'Rizky Pratama Yudha', 'alumni', 2026, 2026, 'Mahasiswa', 'Student',
  'Software Engineer', 'Software Engineer', 'Politeknik Negeri Malang', 'State Polytechnic of Malang',
  'https://linkedin.com/in/rizkypy', 'https://rizkypratamayudha.github.io/',
  ARRAY['web-engineering', 'se-methodologies-architecture'],
  'Implementation of Micro Frontend Architecture with Module Federation and Evaluation Using Experimental Method on E-Ranger Super Apps',
  'Fullstack Developer Intern at PT Amerta Indah Otsuka, Architected and implemented a scalable front-end using a microfrontend approach with module federation, allowing multiple teams to deploy independently and reducing build times by 60%'
);
