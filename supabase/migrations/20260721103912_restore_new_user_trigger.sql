-- ============================================================
-- Restore se.handle_new_user() firing on new auth.users signups.
--
-- 001_initial_schema.sql originally created a trigger named
-- "on_auth_user_created" AFTER INSERT ON auth.users calling
-- se.handle_new_user(). This Supabase project is shared with another
-- application (schema "dosen4"), and at some point that app's own
-- migration re-created a trigger with the SAME name
-- "on_auth_user_created" pointing at dosen4.handle_new_user() instead
-- — Postgres allows only one trigger per name per table, so this
-- silently replaced (not supplemented) the SE Lab trigger. Confirmed
-- live: `on_auth_user_created` currently calls dosen4.handle_new_user(),
-- and se.profiles has had zero rows created for any new signup since
-- whenever that happened (discovered via a GitHub-OAuth admin account
-- with no se.profiles row at all, despite an @polinema.ac.id email that
-- should have auto-granted admin).
--
-- Fix: create a SEPARATELY NAMED trigger. Postgres fires every trigger
-- registered for an event, regardless of name, so this restores
-- se.handle_new_user() running on every signup without touching or
-- risking dosen4's own trigger in any way.
-- ============================================================

CREATE TRIGGER se_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION se.handle_new_user();
