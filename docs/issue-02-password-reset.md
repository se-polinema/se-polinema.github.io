# Issue #2: No password-reset flow

**Priority:** High
**Area:** Auth
**Status:** Proposed

## Problem

None of the site's sign-in forms have a "forgot password" link, and no
component calls `supabase.auth.resetPasswordForEmail`. Verified via grep
across `AuthForm.vue`, `AdminDashboard.vue`, `CheckInForm.vue`,
`EventRegistrationForm.vue` — zero matches for "forgot"/"reset password".

Anyone who signs up with email/password (as opposed to GitHub OAuth) and
forgets their password has no self-service recovery path — they're
permanently locked out of that account.

## Proposed Solution

- Add a "Forgot password?" link on `AuthForm.vue`'s login mode, opening a
  small form that calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: '/reset-password' })`.
- New page `/reset-password` + component: reads the recovery session
  Supabase sets up via the emailed link, lets the user set a new password
  via `supabase.auth.updateUser({ password })`.
- Same flow could be reused by `AdminDashboard.vue`'s and `CheckInForm.vue`'s
  own sign-in forms (or funnel them to the same `/login` flow instead of
  each maintaining a separate one — see also the standing duplication
  already partially addressed for `AdminDashboard.vue`'s auth state in an
  earlier round).

## Files likely involved

- `src/components/AuthForm.vue` (add the "forgot password" trigger)
- New: `src/pages/reset-password.astro` + `src/components/ResetPasswordForm.vue`
- `src/i18n/en.json`, `src/i18n/id.json` (new strings)
