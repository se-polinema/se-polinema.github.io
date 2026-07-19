# Issue #9: No "subscribe to all events" calendar feed

**Priority:** Low
**Area:** Events
**Status:** Proposed

## Problem

`generateIcs()` (`src/lib/ics.ts` — a top call-graph hub, 6 edges per the
graphify structural analysis) only powers single-event `.ics` downloads via
`src/pages/events/[slug].ics.ts` — a one-off file per event. There's no
live feed URL (e.g. `/events.ics`) that someone could add once to Google
Calendar/Outlook as a subscription and have it auto-update as new events
are announced.

## Proposed Solution

New `src/pages/events.ics.ts` that reads every managed upcoming event (same
`getCollection('blog')` + `category === 'event' && managed === true` filter
already used by `scripts/sync-events.mjs` and `src/pages/api/events.json.ts`)
and emits a single multi-`VEVENT` `.ics` file via the existing
`generateIcs()`-adjacent helpers in `src/lib/ics.ts` (likely needs a small
"generate multiple events into one calendar" variant alongside the existing
single-event function, reusing `toIcsDate`/`toIcsDateTime`/`escapeText`).

## Files likely involved

- `src/lib/ics.ts` (new multi-event variant)
- New: `src/pages/events.ics.ts`
