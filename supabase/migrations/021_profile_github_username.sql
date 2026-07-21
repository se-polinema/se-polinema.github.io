-- ============================================================
-- Capture the GitHub handle as its own column on se.profiles.
--
-- Auth is now GitHub-only site-wide, but se.profiles never stored the
-- GitHub username (user_name claim) as a first-class column — it was
-- only ever folded into full_name as a last-resort COALESCE fallback
-- (se.handle_new_user(), when a GitHub account has no public display
-- name set), and only readable for the CURRENTLY signed-in user's own
-- session (user_metadata), never queryable for anyone else. This left
-- the admin dashboard's "Grant Admin" flow with no reliable way to
-- identify a colleague by their GitHub account — only by exact email
-- match, which an admin may not confidently know.
-- ============================================================

ALTER TABLE se.profiles ADD COLUMN github_username TEXT;

COMMENT ON COLUMN se.profiles.github_username IS 'GitHub OAuth handle (raw_user_meta_data->>''user_name''), captured independently of the full_name COALESCE fallback in handle_new_user().';

CREATE OR REPLACE FUNCTION se.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = se AS $$
BEGIN
  INSERT INTO se.profiles (id, role, full_name, email, github_username)
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
    NEW.email,
    NEW.raw_user_meta_data->>'user_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- One-time backfill for existing rows, same pattern as the email backfill
-- in 015_admin_role_management.sql.
UPDATE se.profiles p
SET github_username = u.raw_user_meta_data->>'user_name'
FROM auth.users u
WHERE p.id = u.id AND p.github_username IS NULL;
