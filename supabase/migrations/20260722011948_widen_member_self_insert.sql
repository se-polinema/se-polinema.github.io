-- ============================================================
-- Allow current students, not just alumni, to self-submit a se.members row.
--
-- members_insert_self (013_alumni_self_service.sql) hardcoded
-- `AND status = 'alumni'`, so a signed-in student had no way to add
-- themselves to the /members directory — only an admin could create a
-- student row. The admin form, the /members directory, and /profile
-- already fully support status='student' end-to-end; the only gap was
-- this policy blocking self-service. Widen it to allow either status.
-- Everything else about the policy is unchanged: still requires
-- auth.uid() = user_id and approved = false, so self-submissions of
-- either status still land unapproved pending admin review.
-- ============================================================

DROP POLICY "members_insert_self" ON se.members;

CREATE POLICY "members_insert_self" ON se.members
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND approved = false
    AND status IN ('student', 'alumni')
  );
