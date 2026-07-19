# Issue #4: Search doesn't cover the alumni/member directory

**Priority:** Medium-High
**Area:** Discovery / search
**Status:** Done

## Problem

`src/pages/api/search-index.json.ts` is built entirely from
`getCollection('blog')`-style static content collections. Verified: zero
reference to `members` or `alumni` in that file. Since the alumni/member
directory is runtime Supabase data (not a build-time content collection),
searching the site for an alumnus's name returns nothing, even though
their profile page exists and is public.

## Proposed Solution

Two options:
1. **Build-time**: at build, fetch approved `se.members` rows (public
   anon-key read, same as the live pages already do) and fold `{ name,
   id, status }` entries into the search index JSON alongside blog/
   researchers/etc.
2. **Runtime**: have `SearchOverlay.vue` issue a live Supabase query for
   member/alumni name matches in parallel with the static index lookup,
   merging results.

Option 1 is more consistent with how every other search-index source in
this codebase already works (`researchers.json.ts`,
`publications-meta.json.ts`, etc. are all build-time JSON), but "approved
alumni changed after the last deploy" would be stale until the next build
— acceptable given deploys already happen on every push and the current
DB migration/data-change convention already has this same staleness
characteristic (e.g. new alumni approvals don't appear anywhere on the
static-rendered pages until redeploy either, since the pages are pure
client-side Supabase fetches, so no true regression here).

## Files likely involved

- `src/pages/api/search-index.json.ts` (or a new sibling endpoint)
- `src/components/vscode/SearchOverlay.vue` (consumes the index)
