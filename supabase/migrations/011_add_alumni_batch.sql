-- ============================================================
-- Seed: batch of 3 alumni submissions found pending on GitHub Issues
-- (issues #269, #270, #271 — https://github.com/se-polinema/se-polinema.github.io/issues/{269,270,271}).
--
-- None of the three submitted a "Research Streams" value. All three map
-- to domain-specific-se-applications: each is a concrete applied/domain
-- system (an academic-service chatbot, a project-monitoring system, a
-- waste-forecasting system for an ecovillage) rather than core SE
-- methodology/architecture or emerging-tech research.
--
-- #270 and #271 used the current "Current Position"/"Current Affiliation"
-- template fields; #269 predates that rename and used the old "Current
-- Role"/"Current Organization" labels (same underlying columns).
--
-- Current Position/Affiliation corrections (career_update used as source
-- of truth where the submitted value was imprecise or blank, matching the
-- correction pattern established in 010_fix_rizky_current_position.sql):
--   - #270 Ikhwandi: submitted "Software engineer"; career_update says
--     "ex Software Engineer intern at Perum Jasa Tirta 1" — used the more
--     precise "Software Engineer Intern" as current_role. Affiliation
--     ("Perum Jasa Tirta 1") was correctly filled in as submitted.
--   - #271 Rafif: submitted affiliation was "-" (blank); career_update
--     ("Fullstack Developer Intern at PT Amerta Indah Otsuka") used for
--     both current_role and current_organization instead.
--   - #269 Elvaretta: submitted role/organization already matched her
--     career_update exactly — used as submitted, no correction needed.
--
-- Photos: #269 and #270 had attached images, resized/compressed to
-- public/images/members/{elvaretta-salsabilla,ikhwandi}.jpg (683px wide,
-- ~683x910 and ~683x385 respectively — #270's source photo was landscape,
-- unlike prior submissions; the site's object-cover/object-top display
-- convention handles this without pre-cropping). #271 had no photo
-- attached — photo column left NULL.
-- ============================================================

INSERT INTO se.members (
  name, photo, status, cohort_year, exit_year, role_id, role_en,
  current_role_id, current_role_en, current_organization_id, current_organization_en,
  linkedin_url, profile_url, streams, research_topics, career_update
) VALUES
(
  'Elvaretta Salsabilla', '/images/members/elvaretta-salsabilla.jpg', 'alumni', 2026, 2026, 'Mahasiswa', 'Student',
  'Front-End Developer', 'Front-End Developer', 'Elux Space', 'Elux Space',
  'https://www.linkedin.com/in/elvaretta-salsabilla-544b9726b', NULL,
  ARRAY['domain-specific-se-applications'],
  'Implemented Naive Bayes, TF-IDF, and Cosine Similarity in a hybrid academic service chatbot (AEGIS 2.0), including intent classification with Naive Bayes Classifier into 13 categories, Indonesian text preprocessing, and system testing (Black Box, 10-Fold CV, Precision/Recall/F1, MOS). Backend built with Python Flask integrated with a Laravel frontend via REST API.',
  'Currently working as a Front-End Developer at Elux Space (contract-based), building and maintaining web interfaces using Webflow.'
),
(
  'Ikhwandi', '/images/members/ikhwandi.jpg', 'alumni', 2026, 2026, 'Mahasiswa', 'Student',
  'Software Engineer Intern', 'Software Engineer Intern', 'Perum Jasa Tirta 1', 'Perum Jasa Tirta 1',
  'https://www.linkedin.com/in/ikhwandi-270656251', 'https://ikhwandi.engineer',
  ARRAY['domain-specific-se-applications'],
  'End-to-end monitoring system from planning to project closure; Integration of Greedy Algorithm for weight distribution of the 4-mode S Curve; CurveSyncService — automatic synchronization of realizations post-approval',
  'ex Software Engineer intern at Perum Jasa Tirta 1'
),
(
  'Rafif Ramadhani Wibowo', NULL, 'alumni', 2026, 2026, 'Mahasiswa', 'Student',
  'Fullstack Developer Intern', 'Fullstack Developer Intern', 'PT Amerta Indah Otsuka', 'PT Amerta Indah Otsuka',
  'https://www.linkedin.com/in/rafifrw-291358252', 'https://rafifrw1.github.io/portofolio/',
  ARRAY['domain-specific-se-applications'],
  'Implementation of Waste Volume and Maggot Harvest Forecasting in an Ecovillage System',
  'Fullstack Developer Intern at PT Amerta Indah Otsuka'
);
