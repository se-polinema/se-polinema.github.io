-- ============================================================
-- Per-user usage log for the AI "suggest" Edge Functions
-- (suggest-project-content, suggest-announcement-content).
--
-- Each call is a paid external LLM request and sign-up is open, so the
-- functions count a caller's recent rows here to enforce an hourly cap.
-- Written and read only by the functions via the service role:
-- RLS is on with NO policies, and the default anon/authenticated grants
-- that this schema hands out to new tables are revoked explicitly.
-- ============================================================

CREATE TABLE se.ai_suggestion_log (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fn         TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Serves both the hourly count and the cleanup of old rows.
CREATE INDEX ai_suggestion_log_user_created_idx
  ON se.ai_suggestion_log (user_id, created_at DESC);

ALTER TABLE se.ai_suggestion_log ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON se.ai_suggestion_log FROM anon, authenticated;
GRANT ALL ON se.ai_suggestion_log TO service_role;
