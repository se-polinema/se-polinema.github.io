-- ============================================================
-- Self-service alumni submission.
--
-- Previously, alumni entries arrived via a GitHub Issue Form and were
-- manually transcribed by an admin through /admin's Members tab (see
-- 008_members.sql's header comment). This replaces that pipeline with an
-- in-app flow: a signed-in user submits their own alumni profile via
-- /alumni/submit, but it stays hidden from the public /alumni listing
-- until an admin approves it.
--
-- Modeled directly on se.participants' existing "user owns a row via
-- user_id, admin sees/manages all rows" pattern (001_initial_schema.sql /
-- 005_normalize_participants.sql), reusing the same se.get_user_role()
-- admin-check helper used by every other admin-gated policy in this schema.
--
-- Design notes (from review):
--  - ON DELETE SET NULL (not CASCADE like participants): a member row is
--    public directory content that should outlive the submitter's auth
--    account, unlike a participant row which has no standalone value.
--  - The partial unique index only prevents a signed-in user from
--    submitting more than once; it does NOT catch the case where an admin
--    already transcribed this same person from the old GitHub Issue flow
--    (that row has user_id NULL). Documented, not solved here: the submit
--    page asks users who are already listed to contact an admin instead.
--  - Rejection is deliberately unmodeled: an admin declines a submission by
--    deleting the row (existing members_delete_admin capability). A
--    declined user's next visit to the submit page looks identical to
--    "never submitted"; accepted for this scope.
--  - Fails safe: the INSERT CHECK requires approved = false and
--    status = 'alumni' explicitly. Combined with the column DEFAULT of
--    approved = true, a client that omits `approved` (or sends the wrong
--    value) is rejected outright, never silently published.
-- ============================================================

ALTER TABLE se.members ADD COLUMN user_id UUID REFERENCES se.profiles(id) ON DELETE SET NULL;
ALTER TABLE se.members ADD COLUMN approved BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN se.members.user_id IS 'Set when this row was self-submitted by a signed-in user; NULL for admin-transcribed legacy entries';
COMMENT ON COLUMN se.members.approved IS 'Public visibility gate. Existing/admin-added rows default true; self-submissions insert as false until an admin approves';

-- One self-submission per signed-in user. See header note on the
-- admin-transcribed-duplicate gap this does not cover.
CREATE UNIQUE INDEX members_user_id_key ON se.members (user_id) WHERE user_id IS NOT NULL;

-- Replace the fully-public SELECT policy: public only sees approved rows;
-- the submitting user can see their own row regardless of approval state
-- (so the submit page can show a "pending review" status); admin sees all.
DROP POLICY "members_select_public" ON se.members;

CREATE POLICY "members_select_approved" ON se.members
  FOR SELECT USING (approved = true);

CREATE POLICY "members_select_own" ON se.members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "members_select_admin" ON se.members
  FOR SELECT USING (se.get_user_role() = 'admin');

-- Additive: members_insert_admin / members_update_admin / members_delete_admin
-- from 008_members.sql are untouched. Approving a submission is just an
-- UPDATE ... SET approved = true, already covered by members_update_admin;
-- no new policy needed for the admin side of approval.
CREATE POLICY "members_insert_self" ON se.members
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND approved = false
    AND status = 'alumni'
  );
