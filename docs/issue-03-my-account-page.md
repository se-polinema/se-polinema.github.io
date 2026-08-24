# Issue #3: No "My Account" page for signed-in users

**Priority:** High
**Area:** Self-service
**Status:** Done

## Problem

A signed-in non-admin user (event attendee or alumni submitter) has no
central place to see their event registrations or alumni-submission
status. Verified: no `/account` or similarly-named page exists anywhere
under `src/pages/`. Today that information is scattered; a user has to
remember which specific event page they registered through, or separately
revisit `/alumni/submit` to check submission status.

## Proposed Solution

New `/account` page, gated the same way `AlumniSubmissionForm.vue` already
gates on `useAuth()`: signed-out → sign-in prompt; signed-in → two
sections:

1. **My Event Registrations**: query `se.participants` filtered to
   `user_id = auth.uid()` (already permitted by the existing
   `participants_select_own` RLS policy, no new backend work needed),
   joined with event titles, showing registered/checked-in status per
   event.
2. **My Alumni Submission**: query `se.members` filtered to
   `user_id = auth.uid()` (already permitted by `members_select_own` RLS
   from the alumni self-service migration), showing pending/approved
   status, or a CTA to submit if none exists.

Both underlying RLS policies already exist and already scope correctly to
"own rows only"; this is a pure frontend addition, no migration needed.

Also link to `/account` from the status-bar identity chip
(`AccountStatusItem.vue`), which currently displays the signed-in user's
name as plain text with no link anywhere; otherwise `/account` would be
an orphan page nobody can discover, the same mistake already caught and
fixed for `/alumni/submit` earlier in this project.

## Files likely involved

- New: `src/pages/account/index.astro`, `src/components/AccountPage.vue`
- `src/components/vscode/AccountStatusItem.vue` (make the identity chip a link)
- `src/i18n/en.json`, `src/i18n/id.json` (new strings)
