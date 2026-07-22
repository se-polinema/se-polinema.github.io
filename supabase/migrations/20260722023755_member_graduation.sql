-- ============================================================
-- Model the member -> alumni lifecycle instead of duplicating
-- self-registration for each status.
--
-- Self-registration is now student-only again: a person self-registers
-- once as a current member, then *graduates* into an alumni later. This
-- reverses the status IN ('student', 'alumni') widening from
-- 20260722011948_widen_member_self_insert.sql, which let a crafted
-- request self-insert an alumni row directly (no such thing as
-- "signing up as an alumnus" in the real lifecycle). Admins can still
-- insert an alumni row directly via members_insert_admin, for legacy
-- alumni who were never in the system as students.
--
-- Graduation is exposed as a narrowly-scoped SECURITY DEFINER function
-- rather than a general members_update_self RLS policy: RLS policies
-- can't restrict *which columns* an UPDATE touches (no OLD/NEW diffing),
-- so a broad self-UPDATE grant would also let a member flip their own
-- approved/user_id/cohort_year/etc. This function only ever flips the
-- caller's own approved student row to alumni + sets exit_year.
-- ============================================================

DROP POLICY "members_insert_self" ON se.members;

CREATE POLICY "members_insert_self" ON se.members
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND approved = false
    AND status = 'student'
  );

CREATE OR REPLACE FUNCTION se.graduate_member(p_exit_year int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = se, public
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  IF p_exit_year IS NULL OR p_exit_year < 1900 OR p_exit_year > 2100 THEN
    RAISE EXCEPTION 'invalid exit_year';
  END IF;

  UPDATE se.members
    SET status = 'alumni', exit_year = p_exit_year
    WHERE user_id = v_uid AND status = 'student' AND approved = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'no eligible member row to graduate';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION se.graduate_member(int) TO authenticated;
