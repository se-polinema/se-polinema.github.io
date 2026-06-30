-- Replace email-based registration with auth-based registration.
-- Registrations are now linked to auth.users via a user_id column.

-- Add user_id to participants (nullable to preserve existing data)
ALTER TABLE se.participants ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Drop old email-based uniqueness; switch to user-based uniqueness.
-- UNIQUE allows multiple NULL user_id rows for legacy participants.
ALTER TABLE se.participants DROP CONSTRAINT IF EXISTS participants_event_slug_email_key;
ALTER TABLE se.participants ADD CONSTRAINT participants_event_slug_user_id_key UNIQUE (event_slug, user_id);

-- Add profile fields collected during sign-up (mandatory)
ALTER TABLE se.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE se.profiles ADD COLUMN IF NOT EXISTS identifier TEXT;
ALTER TABLE se.profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- Replace the open insert policy with an authenticated-only policy.
DROP POLICY IF EXISTS "participants_insert_anyone" ON se.participants;
CREATE POLICY "participants_insert_authenticated" ON se.participants
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Allow authenticated users to see their own registration rows.
CREATE POLICY "participants_select_own" ON se.participants
  FOR SELECT USING (auth.uid() = user_id);

-- Allow authenticated users to update their own profile.
CREATE POLICY "profiles_update_own" ON se.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Grant UPDATE on profiles to authenticated.
GRANT UPDATE ON se.profiles TO authenticated;
