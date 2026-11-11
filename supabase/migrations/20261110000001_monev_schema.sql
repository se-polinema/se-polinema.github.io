-- ============================================================
-- Monev PBL live voting. A sibling schema to `se`, in the same
-- Supabase project. Presenter = se admin (se.get_user_role()).
-- Participants are anonymous: a random device token (voter_id)
-- identifies one ballot per question. Raw votes are never
-- readable by anon; results come from SECURITY DEFINER RPCs and
-- only after the presenter reveals them.
--
-- Remember to add "monev" to the API exposed schemas
-- (supabase/config.toml [api] schemas, and Settings > API on the
-- hosted project) so PostgREST and Realtime can reach it.
-- ============================================================

CREATE SCHEMA IF NOT EXISTS monev;
GRANT USAGE ON SCHEMA monev TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION monev.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT COALESCE(se.get_user_role() = 'admin', false)
$$;

-- ── Tables ─────────────────────────────────────────────────
CREATE TABLE monev.questions (
  key TEXT PRIMARY KEY CHECK (key ~ '^[a-z0-9_]{2,32}$'),
  kind TEXT NOT NULL CHECK (kind IN ('single', 'multi', 'text')),
  prompt TEXT NOT NULL,
  max_choices INT NOT NULL DEFAULT 1 CHECK (max_choices BETWEEN 1 AND 6),
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  ord INT NOT NULL DEFAULT 0
);

CREATE TABLE monev.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE CHECK (code ~ '^[A-Z0-9]{4,8}$'),
  title TEXT NOT NULL DEFAULT 'Monev PBL',
  is_open BOOLEAN NOT NULL DEFAULT true,
  current_slide INT NOT NULL DEFAULT 0,
  active_question TEXT REFERENCES monev.questions(key) ON DELETE SET NULL,
  voting_open BOOLEAN NOT NULL DEFAULT false,
  reveal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE monev.votes (
  session_id UUID NOT NULL REFERENCES monev.sessions(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL REFERENCES monev.questions(key) ON DELETE CASCADE,
  voter_id UUID NOT NULL,
  choices TEXT[] NOT NULL CHECK (cardinality(choices) BETWEEN 1 AND 6),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (session_id, question_key, voter_id)
);

CREATE TABLE monev.suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES monev.sessions(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 1000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX suggestions_session_idx ON monev.suggestions (session_id, created_at);

CREATE OR REPLACE FUNCTION monev.sessions_touch()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER sessions_touch BEFORE UPDATE ON monev.sessions
  FOR EACH ROW EXECUTE FUNCTION monev.sessions_touch();

-- ── RLS ────────────────────────────────────────────────────
ALTER TABLE monev.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE monev.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE monev.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE monev.suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY questions_select ON monev.questions FOR SELECT USING (true);

CREATE POLICY sessions_select ON monev.sessions FOR SELECT
  USING (is_open OR monev.is_admin());
CREATE POLICY sessions_insert_admin ON monev.sessions FOR INSERT
  WITH CHECK (monev.is_admin());
CREATE POLICY sessions_update_admin ON monev.sessions FOR UPDATE
  USING (monev.is_admin()) WITH CHECK (monev.is_admin());
CREATE POLICY sessions_delete_admin ON monev.sessions FOR DELETE
  USING (monev.is_admin());

CREATE POLICY votes_select_admin ON monev.votes FOR SELECT USING (monev.is_admin());
CREATE POLICY votes_delete_admin ON monev.votes FOR DELETE USING (monev.is_admin());
CREATE POLICY suggestions_select_admin ON monev.suggestions FOR SELECT USING (monev.is_admin());
CREATE POLICY suggestions_delete_admin ON monev.suggestions FOR DELETE USING (monev.is_admin());

-- ── Grants (this schema gets no default privileges) ────────
GRANT SELECT ON monev.questions, monev.sessions TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON monev.sessions TO authenticated;
GRANT SELECT, DELETE ON monev.votes, monev.suggestions TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA monev TO service_role;

-- ── RPC: cast / change a vote ──────────────────────────────
CREATE OR REPLACE FUNCTION monev.cast_vote(
  p_session UUID, p_voter UUID, p_question TEXT, p_choices TEXT[]
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = monev, pg_temp AS $$
DECLARE
  s monev.sessions;
  q monev.questions;
  c TEXT[];
BEGIN
  SELECT * INTO s FROM monev.sessions WHERE id = p_session;
  IF NOT FOUND OR NOT s.is_open THEN RAISE EXCEPTION 'session_closed'; END IF;
  IF s.active_question IS DISTINCT FROM p_question OR NOT s.voting_open THEN
    RAISE EXCEPTION 'voting_closed';
  END IF;
  SELECT * INTO q FROM monev.questions WHERE key = p_question;
  IF NOT FOUND OR q.kind NOT IN ('single', 'multi') THEN RAISE EXCEPTION 'invalid_question'; END IF;
  SELECT array_agg(DISTINCT x ORDER BY x) INTO c FROM unnest(p_choices) AS x;
  IF c IS NULL OR cardinality(c) > q.max_choices THEN RAISE EXCEPTION 'invalid_choices'; END IF;
  IF EXISTS (
    SELECT 1 FROM unnest(c) AS x
    WHERE x NOT IN (SELECT o->>'key' FROM jsonb_array_elements(q.options) AS o)
  ) THEN RAISE EXCEPTION 'invalid_choices'; END IF;

  INSERT INTO monev.votes (session_id, question_key, voter_id, choices)
  VALUES (p_session, p_question, p_voter, c)
  ON CONFLICT (session_id, question_key, voter_id)
  DO UPDATE SET choices = EXCLUDED.choices, updated_at = now();
END $$;

-- ── RPC: free-text suggestion (max 5 per device, 1000 per session) ──
CREATE OR REPLACE FUNCTION monev.submit_suggestion(
  p_session UUID, p_voter UUID, p_body TEXT
) RETURNS INT LANGUAGE plpgsql SECURITY DEFINER SET search_path = monev, pg_temp AS $$
DECLARE
  s monev.sessions;
  b TEXT := btrim(p_body);
  mine INT;
BEGIN
  SELECT * INTO s FROM monev.sessions WHERE id = p_session;
  IF NOT FOUND OR NOT s.is_open THEN RAISE EXCEPTION 'session_closed'; END IF;
  IF s.active_question IS DISTINCT FROM 'saran' OR NOT s.voting_open THEN
    RAISE EXCEPTION 'voting_closed';
  END IF;
  IF b IS NULL OR char_length(b) NOT BETWEEN 1 AND 1000 THEN RAISE EXCEPTION 'invalid_body'; END IF;
  SELECT count(*) INTO mine FROM monev.suggestions WHERE session_id = p_session AND voter_id = p_voter;
  IF mine >= 5 THEN RAISE EXCEPTION 'too_many'; END IF;
  IF (SELECT count(*) FROM monev.suggestions WHERE session_id = p_session) >= 1000 THEN
    RAISE EXCEPTION 'too_many';
  END IF;
  INSERT INTO monev.suggestions (session_id, voter_id, body) VALUES (p_session, p_voter, b);
  RETURN mine + 1;
END $$;

-- ── RPC: my own ballot (so a reload restores the selection) ──
CREATE OR REPLACE FUNCTION monev.my_vote(p_session UUID, p_voter UUID, p_question TEXT)
RETURNS TEXT[] LANGUAGE sql STABLE SECURITY DEFINER SET search_path = monev, pg_temp AS $$
  SELECT choices FROM monev.votes
  WHERE session_id = p_session AND voter_id = p_voter AND question_key = p_question
$$;

CREATE OR REPLACE FUNCTION monev.my_suggestion_count(p_session UUID, p_voter UUID)
RETURNS INT LANGUAGE sql STABLE SECURITY DEFINER SET search_path = monev, pg_temp AS $$
  SELECT count(*)::int FROM monev.suggestions WHERE session_id = p_session AND voter_id = p_voter
$$;

-- ── RPC: aggregated results. Admin always; others only once revealed ──
CREATE OR REPLACE FUNCTION monev.get_results(p_session UUID, p_question TEXT)
RETURNS JSONB LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = monev, pg_temp AS $$
DECLARE
  s monev.sessions;
  n INT;
  counts JSONB;
BEGIN
  SELECT * INTO s FROM monev.sessions WHERE id = p_session;
  IF NOT FOUND THEN RAISE EXCEPTION 'session_not_found'; END IF;
  IF NOT (monev.is_admin() OR (s.reveal AND s.active_question = p_question)) THEN
    RAISE EXCEPTION 'not_revealed';
  END IF;
  SELECT count(*) INTO n FROM monev.votes WHERE session_id = p_session AND question_key = p_question;
  SELECT COALESCE(jsonb_object_agg(k, cnt), '{}'::jsonb) INTO counts FROM (
    SELECT x AS k, count(*) AS cnt
    FROM monev.votes v, unnest(v.choices) AS x
    WHERE v.session_id = p_session AND v.question_key = p_question
    GROUP BY x
  ) t;
  RETURN jsonb_build_object('n', n, 'counts', counts);
END $$;

REVOKE ALL ON FUNCTION monev.cast_vote, monev.submit_suggestion, monev.my_vote,
  monev.my_suggestion_count, monev.get_results FROM PUBLIC;
GRANT EXECUTE ON FUNCTION monev.cast_vote, monev.submit_suggestion, monev.my_vote,
  monev.my_suggestion_count, monev.get_results TO anon, authenticated;
GRANT EXECUTE ON FUNCTION monev.is_admin TO anon, authenticated;

-- ── Realtime: participants follow the session row ──────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'monev' AND tablename = 'sessions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE monev.sessions;
  END IF;
END $$;
