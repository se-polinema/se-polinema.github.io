-- ============================================================
-- Normalize cohort_year for the five seeded alumni (008/009/011) from
-- their placeholder value to a real enrollment year.
--
-- cohort_year is meant to be the academic enrollment year ("Angkatan" —
-- see cohortLabel in src/i18n/*.json and the Period display in
-- MemberProfilePage.vue), but every seeded alumnus was transcribed with
-- cohort_year = exit_year = 2026, i.e. the graduation year copied into
-- both fields. That collapses the /alumni directory's cohort grouping
-- (MemberDirectoryPage.vue) into a single meaningless "Angkatan 2026"
-- bucket and renders "Period: 2026 – 2026" on each profile.
--
-- All five are 2026 graduates of the D-IV (Sarjana Terapan, 4-year)
-- program, so their enrollment year is 2022 (2026 - 4). exit_year is
-- untouched.
--
-- The GitHub issue template's Cohort Year description ("The year they
-- joined the lab") is being reworded alongside this fix
-- (.github/ISSUE_TEMPLATE/add-alumni.yml) to make the enrollment-year
-- meaning explicit and avoid the same placeholder mistake recurring.
-- ============================================================

UPDATE se.members
SET cohort_year = 2022
WHERE name IN (
  'Rizky Pratama Yudha',
  'Solikhin',
  'Elvaretta Salsabilla',
  'Ikhwandi',
  'Rafif Ramadhani Wibowo'
)
AND status = 'alumni';
