# Issue #5: No admin UI to manage who has admin access

**Priority:** Medium
**Area:** Admin / auth
**Status:** Done

## Resolution

Implemented as designed, plus two pre-existing issues discovered and fixed
along the way (both directly in this feature's critical path; see
`supabase/migrations/015_admin_role_management.sql`'s header comment for
detail):

1. **Security fix**: `profiles_update_own` had no `WITH CHECK` clause, so
   Postgres silently reused its `USING` expression, meaning any
   authenticated user could self-promote to admin via a direct client call,
   bypassing the `@polinema.ac.id` gate entirely. Fixed with a
   `BEFORE UPDATE` trigger that reverts any role change on one's own row
   (blocking both self-promotion and accidental self-demotion by an
   existing admin) and blocks non-admins from changing anyone's role.
2. **Regression fix**: `handle_new_user()` had stopped populating
   `profiles.email` in an earlier migration, which would have made
   grant-by-email infeasible. Restored, plus a one-time backfill from
   `auth.users` for existing profiles left `NULL`.

A lightweight audit trail (`role_updated_at`, `role_updated_by`) was added
per the "worth deciding deliberately" note in the original proposal.

## Problem

Admin role is assigned entirely automatically: the `handle_new_user()`
trigger (`supabase/migrations/012_oauth_profile_metadata.sql`) grants
`role = 'admin'` to any signup whose email domain is
`@polinema.ac.id`, and `role = 'user'` otherwise. There is no dashboard
view of who currently has admin access, and no way to grant admin to a
legitimate staff member, alum-turned-collaborator, or external partner
whose email isn't `@polinema.ac.id`, without editing the `se.profiles`
table directly in the Supabase dashboard/SQL editor.

## Proposed Solution

Add a small "Staff" section to `AdminDashboard.vue` (a third tab, or a
section under the existing Members tab) that:
- Lists `se.profiles` rows with `role = 'admin'` (already fully readable
  by admin via the existing `profiles_select_admin` RLS policy, so no new
  backend work needed for viewing).
- Lets an existing admin promote another user to admin by email (an
  `UPDATE se.profiles SET role = 'admin' WHERE email = ...`). This DOES
  need a new RLS policy: `se.profiles` currently has no admin-UPDATE
  policy (only `profiles_update_own`), so this is the one piece of this
  proposal that isn't purely additive frontend work.

Worth deciding deliberately: should self-demotion be blocked (an admin
accidentally revoking their own access)? Should there be an audit trail
of who granted whom?

## Files likely involved

- `supabase/migrations/` (new migration: admin-UPDATE policy on `se.profiles`)
- `src/components/AdminDashboard.vue` (new Staff section)
