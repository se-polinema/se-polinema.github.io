# Issue #6: Newsletter subscribers have no admin UI

**Priority:** Medium
**Area:** Admin
**Status:** Proposed

## Problem

`se.subscribers` (`supabase/migrations/007_subscribers.sql`) has
admin-only RLS policies (`subscribers_select_admin`,
`subscribers_delete_admin`) — the backend already supports an admin
viewing/pruning the list. Verified: `AdminDashboard.vue` has zero
reference to `subscribers` anywhere. The data is being collected (via
`NewsletterForm.vue`) but nobody can actually view, export, or clean up
the list from the dashboard — it's only reachable via direct SQL.

## Proposed Solution

Add a "Subscribers" tab (or section) to `AdminDashboard.vue`: a simple
table listing email + subscribed-at date, a delete action per row (already
covered by the existing `subscribers_delete_admin` policy — no new backend
work needed), and ideally a CSV export button (see issue #7, same
underlying need).

## Files likely involved

- `src/components/AdminDashboard.vue` (new Subscribers tab)
- `src/i18n/en.json`, `src/i18n/id.json` (new strings)
