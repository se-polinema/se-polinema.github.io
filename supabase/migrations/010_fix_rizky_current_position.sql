-- ============================================================
-- Correct Rizky Pratama Yudha's current position/affiliation
-- (seeded in 008_members.sql, issue #267).
--
-- The raw submission left Current Position/Affiliation as the template's
-- generic placeholder values ("Software Engineer" at "Politeknik Negeri
-- Malang"), the same common submitter mistake later spotted again on the
-- issue #268 seed (see 009_add_alumni_solikhin.sql and the template
-- wording fix in .github/ISSUE_TEMPLATE/add-alumni.yml, which relabels
-- these fields "Current Position"/"Current Affiliation" with an explicit
-- warning against defaulting to Politeknik Negeri Malang).
--
-- His own career_update ("Fullstack Developer Intern at PT Amerta Indah
-- Otsuka...") states his real current position, used here instead.
-- ============================================================

UPDATE se.members
SET
  current_role_id = 'Magang Fullstack Developer',
  current_role_en = 'Fullstack Developer Intern',
  current_organization_id = 'PT Amerta Indah Otsuka',
  current_organization_en = 'PT Amerta Indah Otsuka'
WHERE name = 'Rizky Pratama Yudha';
