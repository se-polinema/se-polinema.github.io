-- ============================================================
-- Seed: issue #268 (github.com/se-polinema/se-polinema.github.io/issues/268)
-- Role = Student (their role while in the lab) but Exit Year is filled in
-- and Current Position/Affiliation describe a post-lab job, so this is an
-- alumni entry, not a current student (same shape as the issue #267 seed
-- in 008_members.sql).
--
-- Note: submitted streams ("Software Engineering & Application
-- Development", "Information Systems & Educational Technology") are
-- descriptive category names, not the site's canonical stream ids
-- (se-methodologies-architecture, domain-specific-se-applications,
-- emerging-technologies-se). Both map to domain-specific-se-applications:
-- his research (PWA-based monitoring apps, educational software
-- evaluation) is applied, domain-specific work, not core methodology/
-- architecture or emerging tech.
--
-- Photo: sourced from the issue's attached image (2000x3000 JPEG),
-- resized/compressed to public/images/members/solikhin.jpg (683x1025,
-- ~62KB) to match the site's existing photo convention.
--
-- Current Position/Affiliation: the raw submission left these as the
-- template's generic placeholder values ("Software Engineer" at
-- "Politeknik Negeri Malang"), a common submitter mistake (see the
-- template wording fix in .github/ISSUE_TEMPLATE/add-alumni.yml and the
-- matching correction for the issue #267/Rizky seed in migration 010).
-- His own career_update ("Full Stack Developer Intern at PT. Amerta Indah
-- Otsuka") states his real current position, used here instead.
-- ============================================================

INSERT INTO se.members (
  name, photo, status, cohort_year, exit_year, role_id, role_en,
  current_role_id, current_role_en, current_organization_id, current_organization_en,
  linkedin_url, profile_url, streams, research_topics, career_update
) VALUES (
  'Solikhin', '/images/members/solikhin.jpg', 'alumni', 2026, 2026, 'Mahasiswa', 'Student',
  'Magang Full Stack Developer', 'Full Stack Developer Intern', 'PT. Amerta Indah Otsuka', 'PT. Amerta Indah Otsuka',
  'https://www.linkedin.com/in/solikhinkhin/', 'https://solikhin0433.github.io/',
  ARRAY['domain-specific-se-applications'],
  'Progressive Web App (PWA) Based Student Memorization Monitoring Application Incorporating the VARK Learning Method and Parental Participation (Case Study: TPQ Musholla Al-Ikhlas, Kav. Depag, Malang); Progressive Web Application (PWA) for Education and Monitoring Systems; VARK Learning Style Integration in Digital Learning Platforms; Single Page Application (SPA) Architecture using Angular and Express.js; Educational Software Evaluation using User Acceptance Testing (UAT) and N-Gain Analysis',
  'Full Stack Developer Intern at PT. Amerta Indah Otsuka'
);
