-- ============================================================
-- Normalize participants: remove legacy identity columns,
-- make user_id NOT NULL, FK to se.profiles for PostgREST embedding.
-- Add email to profiles. Replace email-based check-in with
-- session-based check_in_self.
-- ============================================================

-- ── Add email to profiles ─────────────────────────────────────
ALTER TABLE se.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- ── Update handle_new_user to capture full_name and email ─────
-- Preserves the @polinema.ac.id admin auto-assign from migration 004.
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
    NEW.raw_user_meta_data->>'name',
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- ── Strip legacy identity columns from participants ───────────
-- These are now authoritative on se.profiles.
ALTER TABLE se.participants
  DROP COLUMN IF EXISTS name,
  DROP COLUMN IF EXISTS email,
  DROP COLUMN IF EXISTS identifier,
  DROP COLUMN IF EXISTS phone;

-- ── Make user_id NOT NULL ─────────────────────────────────────
-- (Added nullable by 003; no production data yet.)
ALTER TABLE se.participants ALTER COLUMN user_id SET NOT NULL;

-- ── Re-target FK to se.profiles instead of auth.users ─────────
-- This lets PostgREST embed profiles(full_name, email) via foreign key.
ALTER TABLE se.participants DROP CONSTRAINT IF EXISTS participants_user_id_fkey;
ALTER TABLE se.participants
  ADD CONSTRAINT participants_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES se.profiles(id) ON DELETE CASCADE;

-- ── Tighten the uniqueness constraint ────────────────────────
ALTER TABLE se.participants DROP CONSTRAINT IF EXISTS participants_event_slug_user_id_key;
ALTER TABLE se.participants ADD CONSTRAINT participants_event_slug_user_id_key
  UNIQUE (event_slug, user_id);

-- ── Fix RLS: insert only self ─────────────────────────────────
DROP POLICY IF EXISTS "participants_insert_anyone" ON se.participants;
DROP POLICY IF EXISTS "participants_insert_authenticated" ON se.participants;
CREATE POLICY "participants_insert_self" ON se.participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ── Allow admins to read all profiles (for dashboard) ─────────
DROP POLICY IF EXISTS "profiles_select_admin" ON se.profiles;
CREATE POLICY "profiles_select_admin" ON se.profiles
  FOR SELECT USING (se.get_user_role() = 'admin');

-- ── Replace email-based check-in with session-based check-in ──
DROP FUNCTION IF EXISTS se.check_in_participant(TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION se.check_in_self(
  p_event_slug    TEXT,
  p_check_in_code TEXT
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = se AS $$
DECLARE
  v_event       se.events;
  v_participant se.participants;
  v_uid         UUID := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_authenticated');
  END IF;

  SELECT * INTO v_event FROM se.events WHERE slug = p_event_slug;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'event_not_found');
  END IF;

  IF v_event.check_in_code <> p_check_in_code THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_code');
  END IF;

  SELECT * INTO v_participant FROM se.participants
    WHERE event_slug = p_event_slug AND user_id = v_uid;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_registered');
  END IF;

  IF v_participant.status = 'checked_in' THEN
    RETURN jsonb_build_object('success', true, 'already_checked_in', true);
  END IF;

  UPDATE se.participants
    SET status = 'checked_in', checked_in_at = now()
    WHERE id = v_participant.id;

  RETURN jsonb_build_object('success', true, 'already_checked_in', false);
END;
$$;
