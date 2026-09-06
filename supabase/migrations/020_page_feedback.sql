-- ============================================================
-- SE Lab Page Feedback ("Was this page helpful?")
-- ============================================================
-- Anonymous per-page thumbs-up/down votes for blog posts, tutorials, and
-- publications. Written via the turnstile-gated page-feedback Edge
-- Function (see supabase/functions/page-feedback/index.ts), never via a
-- direct anon insert: the only insert path is the service-role function,
-- mirroring subscribe-newsletter. Duplicate votes are prevented by a
-- unique constraint on (page_path, visitor_hash), where visitor_hash is a
-- session-scoped hash derived in the browser (PageFeedback.vue).

CREATE TABLE se.page_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  page_type TEXT NOT NULL CHECK (page_type IN ('tutorial', 'publication', 'blog')),
  slug TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'en' CHECK (lang IN ('en', 'id')),
  vote TEXT NOT NULL CHECK (vote IN ('helpful', 'not_helpful')),
  comment TEXT CHECK (comment IS NULL OR char_length(comment) <= 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  visitor_hash TEXT NOT NULL,
  UNIQUE (page_path, visitor_hash)
);

COMMENT ON TABLE se.page_feedback IS 'Anonymous per-page helpful/not-helpful votes plus optional comments';
COMMENT ON COLUMN se.page_feedback.page_path IS 'Base-free page path (e.g. /blog/<slug>), shared across prod and beta';
COMMENT ON COLUMN se.page_feedback.page_type IS 'tutorial | publication | blog';
COMMENT ON COLUMN se.page_feedback.visitor_hash IS 'Session-scoped hash to prevent duplicate votes per page per session';

ALTER TABLE se.page_feedback ENABLE ROW LEVEL SECURITY;

-- Anonymous inserts are handled by the page-feedback Edge Function with the
-- service-role key; there is intentionally no anon INSERT policy here so the
-- client-side anon key cannot write directly and bypass Turnstile.
-- (Leave this comment as documentation of the decision; the write path is
-- the function, not PostgREST.)

CREATE POLICY "page_feedback_select_admin" ON se.page_feedback
  FOR SELECT USING (se.get_user_role() = 'admin');

CREATE INDEX page_feedback_created_at_idx ON se.page_feedback (created_at DESC);
CREATE INDEX page_feedback_page_type_idx ON se.page_feedback (page_type);
CREATE INDEX page_feedback_page_path_idx ON se.page_feedback (page_path);
CREATE INDEX page_feedback_lang_idx ON se.page_feedback (lang);
