# Issue #10: No spam/abuse protection on public forms

**Priority:** Low (hardening, not urgent at current traffic)
**Area:** Trust & safety
**Status:** Done (pending deploy — see Resolution)

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

## Resolution

Implemented with Cloudflare Turnstile, verified server-side — a
client-only widget can't be verified against anything on a pure static
site, so this is the project's first Supabase Edge Function.

- `supabase/functions/subscribe-newsletter/index.ts` (new): verifies the
  Turnstile token, then inserts into `se.subscribers` with the
  service-role key. `017_drop_subscribers_anon_insert.sql` drops the old
  `subscribers_insert_anon` policy (`WITH CHECK (true)`) so this function
  is the only insert path — otherwise Turnstile would be a bypassable UI
  nicety.
- `supabase/functions/submit-alumni/index.ts` (new): verifies the token,
  then inserts into `se.members` using the *caller's own JWT* (not the
  service role) so the existing `members_insert_self` RLS policy keeps
  doing the real identity enforcement — this function only adds the
  captcha gate in front of the same insert the client used to perform
  directly. No RLS change needed for `se.members`.
- `EventRegistrationForm.vue` uses neither function — it authenticates via
  Supabase Auth (`signUp`/`signInWithPassword`), which has native
  Turnstile support (`options.captchaToken` on the client call +
  `security_captcha_*` Management API config, wired into
  `deploy-supabase.yml`). The already-authenticated "quick register"
  button is deliberately not gated — reaching it requires a session that
  already passed a captcha check at signup/sign-in.
- New shared `src/components/TurnstileWidget.vue` wraps Cloudflare's
  explicit-render API, with a `compact`/`interaction-only` mode for
  `NewsletterForm`'s cramped footer variant.
- `.github/workflows/deploy-supabase.yml`: new steps deploy the two
  functions, set `TURNSTILE_SECRET_KEY` as an Edge Function secret, and
  PATCH the project's auth config to enable Turnstile for GoTrue.
  `.github/workflows/deploy.yml` passes `PUBLIC_TURNSTILE_SITE_KEY`
  through to the Astro build.
- **Pending, outside what I can execute**: creating the Turnstile site in
  Cloudflare and adding `PUBLIC_TURNSTILE_SITE_KEY`/`TURNSTILE_SECRET_KEY`
  as GitHub repo secrets. The Management API field names used to enable
  GoTrue's captcha (`security_captcha_enabled`/`_provider`/`_secret`) are
  my best understanding of that API surface, not verified against a live
  call — worth a quick check on first deploy.
- No rate-limiting added beyond Turnstile — not needed once Turnstile is
  real.
