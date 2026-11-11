-- ============================================================
-- Optional "Lainnya" (other) answer on choice polls: a voter may add a
-- free-text alternative alongside, or instead of, the listed options.
--
-- * questions.allow_other turns it on per poll (set by the deck).
-- * votes.other_text holds the text (max 300 chars). One per voter per poll,
--   replaced when the voter changes their vote, like the choices.
-- * cast_vote gets an optional p_other; a vote needs choices or other text.
-- * get_results returns n_other to everyone once revealed, and the texts
--   themselves (others) to admins only. Raw rows stay unreadable to anon.
-- ============================================================

ALTER TABLE monev.questions ADD COLUMN IF NOT EXISTS allow_other BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE monev.votes ADD COLUMN IF NOT EXISTS other_text TEXT;

-- votes.choices used to require at least one item; relax to "choices or other text".
DO $$
DECLARE
  c TEXT;
BEGIN
  FOR c IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'monev.votes'::regclass AND contype = 'c'
      AND pg_get_constraintdef(oid) LIKE '%cardinality(choices)%'
  LOOP
    EXECUTE format('ALTER TABLE monev.votes DROP CONSTRAINT %I', c);
  END LOOP;
END $$;
ALTER TABLE monev.votes
  ADD CONSTRAINT votes_other_len CHECK (other_text IS NULL OR char_length(other_text) BETWEEN 1 AND 300),
  ADD CONSTRAINT votes_choices_or_other CHECK (
    cardinality(choices) <= 6 AND (cardinality(choices) > 0 OR other_text IS NOT NULL)
  );

-- Replace cast_vote (new optional parameter means a new signature).
DROP FUNCTION IF EXISTS monev.cast_vote(UUID, UUID, TEXT, TEXT[]);
CREATE OR REPLACE FUNCTION monev.cast_vote(
  p_session UUID, p_voter UUID, p_question TEXT, p_choices TEXT[], p_other TEXT DEFAULT NULL
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = monev, pg_temp AS $$
DECLARE
  s monev.sessions;
  q monev.questions;
  c TEXT[];
  o TEXT := NULLIF(btrim(COALESCE(p_other, '')), '');
BEGIN
  SELECT * INTO s FROM monev.sessions WHERE id = p_session;
  IF NOT FOUND OR NOT s.is_open THEN RAISE EXCEPTION 'session_closed'; END IF;
  IF s.active_question IS DISTINCT FROM p_question OR NOT s.voting_open THEN
    RAISE EXCEPTION 'voting_closed';
  END IF;
  SELECT * INTO q FROM monev.questions WHERE key = p_question;
  IF NOT FOUND OR q.kind NOT IN ('single', 'multi') THEN RAISE EXCEPTION 'invalid_question'; END IF;
  IF o IS NOT NULL AND NOT q.allow_other THEN RAISE EXCEPTION 'invalid_choices'; END IF;
  IF o IS NOT NULL AND char_length(o) > 300 THEN RAISE EXCEPTION 'invalid_body'; END IF;

  SELECT COALESCE(array_agg(DISTINCT x ORDER BY x), '{}') INTO c FROM unnest(COALESCE(p_choices, '{}')) AS x;
  IF cardinality(c) > q.max_choices OR (cardinality(c) = 0 AND o IS NULL) THEN
    RAISE EXCEPTION 'invalid_choices';
  END IF;
  IF EXISTS (
    SELECT 1 FROM unnest(c) AS x
    WHERE x NOT IN (SELECT opt->>'key' FROM jsonb_array_elements(q.options) AS opt)
  ) THEN RAISE EXCEPTION 'invalid_choices'; END IF;

  INSERT INTO monev.votes (session_id, question_key, voter_id, choices, other_text)
  VALUES (p_session, p_question, p_voter, c, o)
  ON CONFLICT (session_id, question_key, voter_id)
  DO UPDATE SET choices = EXCLUDED.choices, other_text = EXCLUDED.other_text, updated_at = now();
END $$;

-- The voter's own saved "other" text, so a reload restores it.
CREATE OR REPLACE FUNCTION monev.my_other(p_session UUID, p_voter UUID, p_question TEXT)
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER SET search_path = monev, pg_temp AS $$
  SELECT other_text FROM monev.votes
  WHERE session_id = p_session AND voter_id = p_voter AND question_key = p_question
$$;

-- Results: counts as before, plus n_other (everyone, once revealed) and others (admin only).
CREATE OR REPLACE FUNCTION monev.get_results(p_session UUID, p_question TEXT)
RETURNS JSONB LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = monev, pg_temp AS $$
DECLARE
  s monev.sessions;
  n INT;
  n_other INT;
  counts JSONB;
  others JSONB := '[]'::jsonb;
BEGIN
  SELECT * INTO s FROM monev.sessions WHERE id = p_session;
  IF NOT FOUND THEN RAISE EXCEPTION 'session_not_found'; END IF;
  IF NOT (monev.is_admin() OR (s.reveal AND s.active_question = p_question)) THEN
    RAISE EXCEPTION 'not_revealed';
  END IF;
  SELECT count(*), count(other_text) INTO n, n_other
  FROM monev.votes WHERE session_id = p_session AND question_key = p_question;
  SELECT COALESCE(jsonb_object_agg(k, cnt), '{}'::jsonb) INTO counts FROM (
    SELECT x AS k, count(*) AS cnt
    FROM monev.votes v, unnest(v.choices) AS x
    WHERE v.session_id = p_session AND v.question_key = p_question
    GROUP BY x
  ) t;
  IF monev.is_admin() THEN
    SELECT COALESCE(jsonb_agg(other_text ORDER BY updated_at), '[]'::jsonb) INTO others
    FROM monev.votes
    WHERE session_id = p_session AND question_key = p_question AND other_text IS NOT NULL;
  END IF;
  RETURN jsonb_build_object('n', n, 'n_other', n_other, 'counts', counts, 'others', others);
END $$;

REVOKE ALL ON FUNCTION monev.cast_vote(UUID, UUID, TEXT, TEXT[], TEXT), monev.my_other(UUID, UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION monev.cast_vote(UUID, UUID, TEXT, TEXT[], TEXT), monev.my_other(UUID, UUID, TEXT)
  TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
