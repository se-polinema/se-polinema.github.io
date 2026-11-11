-- ============================================================
-- Generic live polls: any deck declares its questions; the presenter (se
-- admin) upserts them when starting a session. Replaces the fixed Monev seed.
--
-- * questions.deck / sessions.deck tag which deck a row belongs to.
-- * question keys become '<deck>.<key>' so decks cannot collide.
-- * admins may write questions (RLS + grants); everyone can still read them.
-- * submit_suggestion no longer hardcodes the 'saran' key: the active
--   question just has to be of kind 'text'.
-- ============================================================

ALTER TABLE monev.questions ADD COLUMN IF NOT EXISTS deck TEXT;
ALTER TABLE monev.sessions ADD COLUMN IF NOT EXISTS deck TEXT;
ALTER TABLE monev.suggestions ADD COLUMN IF NOT EXISTS question_key TEXT;

-- Relax the key format (inline CHECK has an auto-generated name, so look it up).
DO $$
DECLARE
  c TEXT;
BEGIN
  FOR c IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'monev.questions'::regclass AND contype = 'c'
      AND pg_get_constraintdef(oid) LIKE '%key ~%'
  LOOP
    EXECUTE format('ALTER TABLE monev.questions DROP CONSTRAINT %I', c);
  END LOOP;
END $$;
ALTER TABLE monev.questions
  ADD CONSTRAINT questions_key_format CHECK (key ~ '^[a-z0-9_.-]{2,64}$');

-- Admins manage questions.
CREATE POLICY questions_insert_admin ON monev.questions FOR INSERT WITH CHECK (monev.is_admin());
CREATE POLICY questions_update_admin ON monev.questions FOR UPDATE
  USING (monev.is_admin()) WITH CHECK (monev.is_admin());
CREATE POLICY questions_delete_admin ON monev.questions FOR DELETE USING (monev.is_admin());
GRANT INSERT, UPDATE, DELETE ON monev.questions TO authenticated;

-- Drop the 9 unprefixed Monev seed rows, but only those nobody has voted on.
-- (The Monev deck now ships its own prefixed questions.)
DELETE FROM monev.questions q
WHERE q.deck IS NULL
  AND NOT EXISTS (SELECT 1 FROM monev.votes v WHERE v.question_key = q.key);

-- Suggestions: any active question of kind 'text' accepts them.
CREATE OR REPLACE FUNCTION monev.submit_suggestion(
  p_session UUID, p_voter UUID, p_body TEXT
) RETURNS INT LANGUAGE plpgsql SECURITY DEFINER SET search_path = monev, pg_temp AS $$
DECLARE
  s monev.sessions;
  q monev.questions;
  b TEXT := btrim(p_body);
  mine INT;
BEGIN
  SELECT * INTO s FROM monev.sessions WHERE id = p_session;
  IF NOT FOUND OR NOT s.is_open THEN RAISE EXCEPTION 'session_closed'; END IF;
  IF s.active_question IS NULL OR NOT s.voting_open THEN RAISE EXCEPTION 'voting_closed'; END IF;
  SELECT * INTO q FROM monev.questions WHERE key = s.active_question;
  IF NOT FOUND OR q.kind <> 'text' THEN RAISE EXCEPTION 'voting_closed'; END IF;
  IF b IS NULL OR char_length(b) NOT BETWEEN 1 AND 1000 THEN RAISE EXCEPTION 'invalid_body'; END IF;
  SELECT count(*) INTO mine FROM monev.suggestions WHERE session_id = p_session AND voter_id = p_voter;
  IF mine >= 5 THEN RAISE EXCEPTION 'too_many'; END IF;
  IF (SELECT count(*) FROM monev.suggestions WHERE session_id = p_session) >= 1000 THEN
    RAISE EXCEPTION 'too_many';
  END IF;
  INSERT INTO monev.suggestions (session_id, voter_id, body, question_key)
  VALUES (p_session, p_voter, b, s.active_question);
  RETURN mine + 1;
END $$;

NOTIFY pgrst, 'reload schema';
