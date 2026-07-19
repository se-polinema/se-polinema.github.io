export interface IcsEventData {
  slug: string
  title: string
  titleId?: string
  excerpt?: string
  excerptId?: string
  eventDate: Date
  eventEndDate?: Date
  location?: string
  eventLang?: 'en' | 'id'
}

function escapeText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '')
}

function toIcsDate(date: Date): string {
  const y = String(date.getUTCFullYear())
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}${m}${d}`
}

function toIcsDateTime(date: Date): string {
  const y = String(date.getUTCFullYear())
  const M = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  const h = String(date.getUTCHours()).padStart(2, '0')
  const m = String(date.getUTCMinutes()).padStart(2, '0')
  const s = String(date.getUTCSeconds()).padStart(2, '0')
  return `${y}${M}${d}T${h}${m}${s}Z`
}

function nextDay(date: Date): Date {
  const d = new Date(date)
  d.setUTCDate(d.getUTCDate() + 1)
  return d
}

// Shared VCALENDAR header, used by both the single-event download
// (generateIcs) and the all-events subscription feed (generateIcsFeed) so
// the two stay in sync.
const CALENDAR_HEADER = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//SE Lab//Events Calendar//EN',
  'CALSCALE:GREGORIAN',
  'METHOD:PUBLISH',
]

function buildVevent(event: IcsEventData, baseUrl: string): string[] {
  const eventStart = event.eventDate
  const eventEnd = event.eventEndDate ?? eventStart
  const dtStart = toIcsDate(eventStart)
  const dtEnd = toIcsDate(nextDay(eventEnd))

  const descriptionParts: string[] = []

  if (event.excerpt) {
    descriptionParts.push(event.excerpt)
  }
  if (event.excerptId) {
    descriptionParts.push(event.excerptId)
  }

  const summary = event.title
  const description = descriptionParts.join('\n\n')
  const uid = `${event.slug}@se.polinema.ac.id`
  const url = `${baseUrl}/events/${event.slug}`

  const lines: string[] = [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${toIcsDateTime(new Date())}`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:${escapeText(summary)}`,
  ]

  if (description) {
    lines.push(`DESCRIPTION:${escapeText(description)}`)
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeText(event.location)}`)
  }

  lines.push(
    `URL:${url}`,
    `ORGANIZER;CN=Software Engineering Laboratory:mailto:imam.fahrur@polinema.ac.id`,
    'END:VEVENT',
  )

  return lines
}

export function generateIcs(event: IcsEventData, baseUrl = 'https://se.polinema.ac.id'): string {
  const lines: string[] = [
    ...CALENDAR_HEADER,
    ...buildVevent(event, baseUrl),
    'END:VCALENDAR',
  ]

  return lines.join('\r\n') + '\r\n'
}

// Combines every event into a single feed document (one VCALENDAR wrapping
// N VEVENTs) — used by the /events.ics subscription endpoint. Individual
// VEVENT bodies are byte-identical to what generateIcs() would produce for
// the same event.
export function generateIcsFeed(events: IcsEventData[], baseUrl = 'https://se.polinema.ac.id'): string {
  const lines: string[] = [
    ...CALENDAR_HEADER,
    ...events.flatMap((event) => buildVevent(event, baseUrl)),
    'END:VCALENDAR',
  ]

  return lines.join('\r\n') + '\r\n'
}
