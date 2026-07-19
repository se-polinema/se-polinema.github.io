# Issue #1: No email notifications in self-service workflows

**Priority:** High
**Area:** Alumni self-service, event registration
**Status:** Proposed

## Problem

Neither the alumni self-service submission flow nor event
registration/check-in sends any email. A user who submits an alumni
profile via `/alumni/submit` gets no confirmation, and when an admin later
approves (or never reviews) it, the submitter is never told — they have to
remember to revisit the page to check. Same for event registration: no
confirmation email, no reminder.

Verified: no `send`/`email`/`resend`/`sendgrid` usage anywhere in
`src/components/AlumniSubmissionForm.vue`,
`src/components/EventRegistrationForm.vue`, or the admin approval path in
`src/components/AdminDashboard.vue`.

## Proposed Solution

Add a transactional email step at the two decision points:
1. On alumni submission insert — confirmation email ("we received your
   submission").
2. On admin `approveMember()` (`AdminDashboard.vue`) — "you're approved,
   here's your profile link" email.
3. On event registration insert — confirmation with event details.

Simplest implementation: a Supabase Database Webhook (or a small Edge
Function) triggered on the relevant table INSERT/UPDATE, calling a
transactional email provider (Resend has a generous free tier and a simple
API). Avoids touching the static-site build entirely — this is pure
backend/Supabase-side wiring.

## Files likely involved

- New: a Supabase Edge Function or webhook config (not yet present in this
  repo — `supabase/` currently has migrations only, no `functions/`)
- `supabase/migrations/` (new migration if a DB webhook trigger is used)
