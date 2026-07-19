-- ============================================================
-- Admin role management: let an admin grant/view admin access from the
-- dashboard instead of editing se.profiles directly in the SQL editor.
--
-- Bundles two pre-existing issues discovered while building this, both
-- directly in this feature's critical path:
--
-- 1. SECURITY FIX: "profiles_update_own" (003_auth_registration.sql) was
--    declared with only a USING clause and no WITH CHECK. Postgres reuses
--    USING as the check when WITH CHECK is omitted, so that policy has
--    never restricted which COLUMNS a self-update can touch — any
--    authenticated user could call
--    `.from('profiles').update({ role: 'admin' }).eq('id', session.user.id)`
--    and successfully self-promote, bypassing the @polinema.ac.id gate
--    entirely. Fixed below with a trigger that reverts any role change on
--    one's own row (also blocks accidental self-demotion by an existing
--    admin, and non-admins changing anyone's role) rather than a
--    column-level RLS check, which Postgres RLS can't express directly.
--
-- 2. REGRESSION FIX: handle_new_user() (redefined in
--    012_oauth_profile_metadata.sql) stopped populating profiles.email
--    (an earlier version in 005_normalize_participants.sql did). Grant-by-
--    email needs it, so it's restored here, plus a one-time backfill from
--    auth.users for existing profiles left NULL by that regression.
-- ============================================================

-- ── Fix 2: restore email population, backfill existing rows ───
CREATE OR REPLACE FUNCTION se.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = se AS $$
BEGIN
  INSERT INTO se.profiles (id, role, full_name, email)
  VALUES (
    NEW.id,
    CASE
      WHEN split_part(NEW.email, '@', 2) = 'polinema.ac.id' THEN 'admin'
      ELSE 'user'
    END,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'user_name'
    ),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

UPDATE se.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;

-- ── Lightweight audit trail for role changes ───────────────────
ALTER TABLE se.profiles ADD COLUMN IF NOT EXISTS role_updated_at TIMESTAMPTZ;
ALTER TABLE se.profiles ADD COLUMN IF NOT EXISTS role_updated_by UUID REFERENCES se.profiles(id) ON DELETE SET NULL;

-- ── Fix 1: guard against self-promotion / self-demotion ────────
CREATE OR REPLACE FUNCTION se.guard_profile_role_change()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NEW.id = auth.uid() OR se.get_user_role() <> 'admin' THEN
      -- Nobody may change their own role (blocks self-promotion AND
      -- accidental self-demotion by an existing admin); non-admins may
      -- never change anyone else's role either — defense in depth
      -- alongside the row-visibility restriction in profiles_update_admin
      -- below.
      NEW.role := OLD.role;
    ELSE
      NEW.role_updated_at := now();
      NEW.role_updated_by := auth.uid();
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_guard_role_change
  BEFORE UPDATE ON se.profiles
  FOR EACH ROW EXECUTE FUNCTION se.guard_profile_role_change();

-- Lets admin reach (UPDATE) rows other than their own — profiles_update_own
-- only ever permitted touching your own row. Combined with the trigger
-- above, this is what actually lets an admin grant role='admin' to someone
-- else, while the trigger stops it being used on their own row.
CREATE POLICY "profiles_update_admin" ON se.profiles
  FOR UPDATE USING (se.get_user_role() = 'admin');
