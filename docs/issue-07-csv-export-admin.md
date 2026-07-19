# Issue #7: No CSV export anywhere in admin

**Priority:** Medium
**Area:** Admin
**Status:** Proposed

## Problem

Every admin table (event participants, members, and — once issue #6 is
built — subscribers) is view-only. There's no way to export a participant
list for attendance sheets/name badges, or the member directory for
reporting, without manually copying rows out of the browser or querying
Supabase directly.

## Proposed Solution

A small shared `downloadCsv(rows, filename)` utility (pure client-side:
build a CSV string from the already-loaded array, trigger a Blob download
— no new backend/RLS work, since the data is already loaded into
`AdminDashboard.vue`'s reactive state for display). Add an "Export CSV"
button next to each relevant table: per-event participant list, the
member/alumni table, and subscribers once issue #6 exists.

## Files likely involved

- New: `src/utils/downloadCsv.ts`
- `src/components/AdminDashboard.vue`, `src/components/AdminEventSection.vue`
  (export buttons)
