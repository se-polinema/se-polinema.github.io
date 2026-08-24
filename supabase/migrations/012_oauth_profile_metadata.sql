-- Backfill full_name for GitHub OAuth signups.
--
-- handle_new_user() (004_role_by_email.sql) only ever set id + role, relying
-- on AuthForm.vue / EventRegistrationForm.vue to separately UPDATE full_name
-- after an email/password signUp. GitHub OAuth signups (signInWithOAuth) skip
-- that client-side update entirely, so their profiles.full_name would be left
-- NULL. Supabase populates raw_user_meta_data from the GitHub OAuth response
-- with a "full_name", "name", and "user_name" (GitHub handle) claim: use the
-- first one present. Email/password signups have no such metadata, so this is
-- a no-op for them and the existing client-side UPDATE still applies.

CREATE OR REPLACE FUNCTION se.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = se AS $$
BEGIN
  INSERT INTO se.profiles (id, role, full_name)
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
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
