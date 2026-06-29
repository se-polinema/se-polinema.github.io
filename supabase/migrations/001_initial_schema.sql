-- ============================================================
-- SE Lab Event Registration Schema
-- ============================================================

CREATE SCHEMA IF NOT EXISTS se;

-- ── Profiles ─────────────────────────────────────────────────
CREATE TABLE se.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE se.profiles IS 'Auth user role mapping for SE Lab';

CREATE OR REPLACE FUNCTION se.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = se AS $$
BEGIN
  INSERT INTO se.profiles (id) VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION se.handle_new_user();

-- ── Events ───────────────────────────────────────────────────
CREATE TABLE se.events (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  registration_open BOOLEAN NOT NULL DEFAULT true,
  check_in_code TEXT NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE se.events IS 'Event registration config; slug matches blog content collection id';
COMMENT ON COLUMN se.events.check_in_code IS 'Code shared by admin for attendee self check-in';

-- ── Participants ──────────────────────────────────────────────
CREATE TABLE se.participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_slug TEXT NOT NULL REFERENCES se.events(slug) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  identifier TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'checked_in')),
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  checked_in_at TIMESTAMPTZ,
  UNIQUE (event_slug, email)
);

COMMENT ON TABLE se.participants IS 'Event registrations and check-ins';
COMMENT ON COLUMN se.participants.identifier IS 'NIM (student) or NIP (staff)';

-- ── Helper: get current user role ────────────────────────────
CREATE OR REPLACE FUNCTION se.get_user_role()
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER SET search_path = se AS $$
  SELECT role FROM se.profiles WHERE id = auth.uid()
$$;

-- ── SECURITY DEFINER: check-in validation ────────────────────
CREATE OR REPLACE FUNCTION se.check_in_participant(
  p_event_slug TEXT,
  p_email TEXT,
  p_check_in_code TEXT
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = se AS $$
DECLARE
  v_event se.events;
  v_participant se.participants;
BEGIN
  SELECT * INTO v_event FROM se.events WHERE slug = p_event_slug;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'event_not_found');
  END IF;

  IF v_event.check_in_code <> p_check_in_code THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_code');
  END IF;

  SELECT * INTO v_participant FROM se.participants
    WHERE event_slug = p_event_slug AND lower(email) = lower(p_email);
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_found');
  END IF;

  IF v_participant.status = 'checked_in' THEN
    RETURN jsonb_build_object('success', true, 'already_checked_in', true);
  END IF;

  UPDATE se.participants
    SET status = 'checked_in', checked_in_at = now()
    WHERE event_slug = p_event_slug AND lower(email) = lower(p_email);

  RETURN jsonb_build_object('success', true, 'already_checked_in', false);
END;
$$;

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE se.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE se.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE se.participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON se.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "events_select_all" ON se.events
  FOR SELECT USING (true);

CREATE POLICY "events_write_admin" ON se.events
  FOR ALL USING (se.get_user_role() = 'admin');

CREATE POLICY "participants_insert_anyone" ON se.participants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "participants_select_admin" ON se.participants
  FOR SELECT USING (se.get_user_role() = 'admin');

CREATE POLICY "participants_update_admin" ON se.participants
  FOR UPDATE USING (se.get_user_role() = 'admin');

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX participants_event_slug_idx ON se.participants(event_slug);
CREATE INDEX participants_email_idx ON se.participants(lower(email));
CREATE INDEX participants_status_idx ON se.participants(status);
