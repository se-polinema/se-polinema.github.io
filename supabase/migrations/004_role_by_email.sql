-- Assign admin role to users with Polinema researcher email.
-- Users registering with @polinema.ac.id email automatically get the admin role.

CREATE OR REPLACE FUNCTION se.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = se AS $$
BEGIN
  INSERT INTO se.profiles (id, role)
  VALUES (
    NEW.id,
    CASE
      WHEN split_part(NEW.email, '@', 2) = 'polinema.ac.id' THEN 'admin'
      ELSE 'user'
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
