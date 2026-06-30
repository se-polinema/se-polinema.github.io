-- ============================================================
-- SE Lab Newsletter Subscribers
-- ============================================================

CREATE TABLE se.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'id')),
  interests TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMPTZ,
  UNIQUE (email)
);

COMMENT ON TABLE se.subscribers IS 'Newsletter subscribers for SE Lab updates';
COMMENT ON COLUMN se.subscribers.interests IS 'Array of interest categories: tutorials, events, publications, announcements';
COMMENT ON COLUMN se.subscribers.confirmed_at IS 'Set when subscriber confirms via double opt-in';

ALTER TABLE se.subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscribers_insert_anon" ON se.subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "subscribers_select_admin" ON se.subscribers
  FOR SELECT USING (se.get_user_role() = 'admin');

CREATE POLICY "subscribers_delete_admin" ON se.subscribers
  FOR DELETE USING (se.get_user_role() = 'admin');

CREATE INDEX subscribers_email_idx ON se.subscribers (lower(email));
CREATE INDEX subscribers_language_idx ON se.subscribers (language);
CREATE INDEX subscribers_created_at_idx ON se.subscribers (created_at);
