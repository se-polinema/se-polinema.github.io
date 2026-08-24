# Issue #9: No "subscribe to all events" calendar feed

**Priority:** Low
**Area:** Events
**Status:** Done

## Problem

`generateIcs()` (`src/lib/ics.ts`, a top call-graph hub, 6 edges per the
graphify structural analysis) only powers single-event `.ics` downloads via
`src/pages/events/[slug].ics.ts`, a one-off file per event. There's no
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

## Resolution

Implemented close to as proposed, with one filter change from the original
write-up:

- `src/lib/ics.ts`: extracted the per-event `BEGIN:VEVENT`…`END:VEVENT`
  body into a private `buildVevent()` helper (reusing the existing
  `escapeText`/`toIcsDate`/`toIcsDateTime`/`nextDay` helpers unchanged),
  and factored the shared `VCALENDAR` header lines into `CALENDAR_HEADER`.
  `generateIcs()` (single-event) now just wraps one `buildVevent()` call,
  with byte-identical output before/after verified via a stashed
  before/after build diff. Added exported `generateIcsFeed(events, baseUrl)` that wraps
  N `buildVevent()` calls in a single `VCALENDAR`.
- New `src/pages/events.ics.ts` (mirrors the `rss.xml.ts` pattern:
  `prerender = true`, `GET: APIRoute`): filters `category === 'event'`
  (not `managed === true`), deliberately matching
  `events/[slug].ics.ts`'s filter rather than `events.json.ts`'s, since the
  feed is "every event that has a per-event `.ics`, combined" and
  `managed` is about Supabase registration sync, a separate concern.
  Events are sorted ascending by `eventDate ?? date`. No date filtering
  (past events stay in the feed; calendar clients handle that fine, and
  it avoids build-time "now" nondeterminism in feed membership). Served as
  `text/calendar` without `Content-Disposition: attachment`, since it's a
  subscribe-by-URL feed rather than a one-off download.
- `astro.config.mjs`: added `events.ics` to the sitemap `customPages` list
  for discoverability.
- No "Subscribe to calendar" UI link was added; endpoint only, per the
  original proposal's scope.
