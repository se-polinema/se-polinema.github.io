# Issue #10: No spam/abuse protection on public forms

**Priority:** Low (hardening, not urgent at current traffic)
**Area:** Trust & safety
**Status:** Proposed

## Problem

The public alumni self-service submission (`AlumniSubmissionForm.vue`),
newsletter signup (`NewsletterForm.vue`), and event registration
(`EventRegistrationForm.vue`) are all open, RLS-permitted form submissions
with no CAPTCHA and no rate-limiting. Verified: no
`captcha`/`recaptcha`/`turnstile`/`rate-limit` reference anywhere in
`src/components/*.vue`.

## Proposed Solution

Not urgent given current traffic scale, but worth planning before it
becomes a problem:
- Cloudflare Turnstile (free, privacy-respecting) on the three public
  forms above.
- Alternatively/additionally, a simple per-IP rate limit at the Supabase
  Edge Function layer if one gets introduced for issue #1's email
  notifications anyway.

## Files likely involved

- `src/components/AlumniSubmissionForm.vue`, `NewsletterForm.vue`,
  `EventRegistrationForm.vue`
