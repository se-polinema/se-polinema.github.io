# Issue #8: Events have no capacity/waitlist concept

**Priority:** Low-Medium
**Area:** Events
**Status:** Proposed

## Problem

`se.events` (`supabase/migrations/001_initial_schema.sql`) has
`registration_open BOOLEAN` as the only capacity-related control — fully
open or fully closed, with no seat limit. Verified: no
`capacity`/`max_participants`/`waitlist` column anywhere in
`supabase/migrations/*.sql`. Fine for uncapped events; breaks down the
moment a popular event needs a hard attendance limit (e.g. a room with
fixed seating).

## Proposed Solution

- Add `capacity INT` (nullable — null means uncapped, preserves current
  behavior for every existing event) to `se.events`.
- `EventRegistrationForm.vue`'s registration insert path checks the
  current participant count against `capacity` before inserting; over
  capacity either blocks with a "this event is full" message, or inserts
  with a new `waitlisted` participant status if a waitlist is wanted.
- Admin dashboard's per-event section shows "12 / 30 registered" instead
  of just a raw count when `capacity` is set.

## Files likely involved

- `supabase/migrations/` (new migration: `capacity` column, optional
  `waitlisted` status value)
- `src/components/EventRegistrationForm.vue`
- `src/components/AdminEventSection.vue`
