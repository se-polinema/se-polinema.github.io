-- Add a GitHub profile URL to se.members, alongside the existing
-- linkedin_url / profile_url external-link columns. Alumni now sign in
-- with GitHub (AuthForm.vue / GitHubSignInButton.vue), so their handle is
-- readily available to prefill from at self-submission time
-- (user_metadata.user_name, see 012_oauth_profile_metadata.sql) — this
-- column is where that gets stored. Optional/nullable: existing
-- admin-transcribed rows simply won't have one.

ALTER TABLE se.members ADD COLUMN github_url TEXT;

COMMENT ON COLUMN se.members.github_url IS 'Optional GitHub profile URL; prefilled from the GitHub OAuth handle on self-submission, editable.';
