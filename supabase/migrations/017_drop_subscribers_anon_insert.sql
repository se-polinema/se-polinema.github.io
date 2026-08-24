-- ============================================================
-- Issue #10 (form abuse protection): newsletter signups now go
-- exclusively through the subscribe-newsletter Edge Function, which
-- verifies a Cloudflare Turnstile token before inserting with the
-- service-role key (bypasses RLS entirely, same as any SECURITY DEFINER
-- write elsewhere in this schema). The old fully-open
-- "subscribers_insert_anon" policy (WITH CHECK (true)) is dropped so
-- Turnstile is actually enforced rather than trivially bypassable via a
-- direct .from('subscribers').insert() call from the browser.
--
-- subscribers_select_admin / subscribers_delete_admin are untouched;
-- this only removes the anon INSERT path.
-- ============================================================

DROP POLICY IF EXISTS "subscribers_insert_anon" ON se.subscribers;
