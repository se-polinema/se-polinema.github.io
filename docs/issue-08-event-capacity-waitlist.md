# Issue #8: Events have no capacity/waitlist concept

**Priority:** Low-Medium
**Area:** Events
**Status:** Done

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

## Resolution

Implemented largely as proposed, plus one architectural change beyond the
original scope: capacity enforcement had to move off the client entirely
to actually be enforceable.

- `supabase/migrations/016_event_capacity_waitlist.sql`: adds nullable
  `capacity INT` to `se.events` (null = uncapped, no behavior change for
  existing events); adds `'waitlisted'` to the `se.participants.status`
  CHECK constraint.
- **Atomic RPC instead of a client-side check-then-insert.** A naive
  "count participants, then insert if under capacity" done as two
  separate Supabase calls has a TOCTOU race: two concurrent registrations
  could both observe "1 seat left" and both succeed, overshooting
  capacity. Added `se.register_participant(p_event_slug)`, a
  `SECURITY DEFINER` function that locks the event row
  (`SELECT ... FOR UPDATE`) for the duration of the check-then-insert,
  serializing concurrent registrations for the same event — the same
  pattern the schema already uses for `se.check_in_self()`.
- Because the RPC is the only place capacity is actually checked, the old
  `participants_insert_self` direct-insert RLS policy was dropped in the
  same migration (confirmed via grep that `EventRegistrationForm.vue` was
  the only call site ever inserting into `se.participants`) — otherwise
  capacity would have been a UI nicety, trivially bypassed by inserting
  directly.
- `EventRegistrationForm.vue`: all three registration call sites
  (existing signed-in user, sign-up-and-register, sign-in-and-register)
  now call the RPC instead of `.insert()`; added a `waitlisted` UI state
  with a clear "you're on the waitlist, check your account page for
  updates" message (deliberately not promising email notifications,
  since issue #1 is still skipped this round).
- `AccountPage.vue`: registration status badge now has a third
  `waitlisted` state (amber), alongside existing `checked_in`/registered.
- `AdminEventSection.vue` / `AdminDashboard.vue`: admin can set/clear a
  numeric capacity inline per event (blank = uncapped); header shows
  "X / Y registered" when capacity is set, plus a waitlisted count when
  > 0; participant table's status badge also gained the `waitlisted`
  state.
- New i18n keys added to both `en.json`/`id.json`:
  `events.registration.waitlistedTitle`/`waitlistedMessage`,
  `account.statusWaitlisted`, `events.admin.statusWaitlisted`/
  `waitlistedCount`/`capacityLabel`/`capacityUnlimited`.
