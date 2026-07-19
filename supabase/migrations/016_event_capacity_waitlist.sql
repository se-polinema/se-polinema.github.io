-- ============================================================
-- Event capacity + waitlist.
--
-- se.events previously had no seat-limit concept at all —
-- registration_open was fully open/closed with nothing in between.
-- capacity is nullable (NULL = uncapped, preserves every existing event's
-- current behavior unchanged).
--
-- Capacity is only meaningfully enforced through a single atomic RPC
-- (register_participant), not a plain client-side INSERT: checking the
-- current registered count and then inserting are two separate steps, and
-- if done as separate client round-trips two concurrent registrations
-- could both see "1 seat left" and both succeed, overshooting capacity.
-- The RPC locks the event row (SELECT ... FOR UPDATE) for the duration of
-- the check-then-insert, serializing concurrent registrations for the same
-- event. The old direct-insert policy (participants_insert_self) is
-- dropped so this is actually enforced rather than an easily-bypassed UI
-- nicety — confirmed EventRegistrationForm.vue is the only place that ever
-- inserted into se.participants, so nothing else depends on that policy.
-- ============================================================

ALTER TABLE se.events ADD COLUMN capacity INT;
COMMENT ON COLUMN se.events.capacity IS 'Max registered (non-waitlisted) participants; NULL = uncapped';

ALTER TABLE se.participants DROP CONSTRAINT IF EXISTS participants_status_check;
ALTER TABLE se.participants ADD CONSTRAINT participants_status_check
  CHECK (status IN ('registered', 'checked_in', 'waitlisted'));

DROP POLICY IF EXISTS "participants_insert_self" ON se.participants;

CREATE OR REPLACE FUNCTION se.register_participant(
  p_event_slug TEXT
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = se AS $$
DECLARE
  v_uid              UUID := auth.uid();
  v_event            se.events;
  v_registered_count INT;
  v_status           TEXT;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_authenticated');
  END IF;

  -- Locks the event row so a concurrent call for the same event blocks
  -- here until this transaction commits/rolls back, serializing the
  -- capacity check against simultaneous registrations.
  SELECT * INTO v_event FROM se.events WHERE slug = p_event_slug FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'event_not_found');
  END IF;

  IF NOT v_event.registration_open THEN
    RETURN jsonb_build_object('success', false, 'error', 'registration_closed');
  END IF;

  IF EXISTS (
    SELECT 1 FROM se.participants WHERE event_slug = p_event_slug AND user_id = v_uid
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'already_registered');
  END IF;

  IF v_event.capacity IS NOT NULL THEN
    SELECT count(*) INTO v_registered_count
      FROM se.participants
      WHERE event_slug = p_event_slug AND status <> 'waitlisted';
    v_status := CASE WHEN v_registered_count < v_event.capacity THEN 'registered' ELSE 'waitlisted' END;
  ELSE
    v_status := 'registered';
  END IF;

  INSERT INTO se.participants (event_slug, user_id, status)
  VALUES (p_event_slug, v_uid, v_status);

  RETURN jsonb_build_object('success', true, 'status', v_status);
END;
$$;
