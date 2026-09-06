// Test script for .ics (iCalendar) generation
// Run with: node scripts/test-ics.mjs

const assert = {
  ok(cond, msg) {
    if (!cond) {
      console.error(`FAIL: ${msg}`)
      process.exitCode = 1
    } else {
      console.log(`  OK: ${msg}`)
    }
  },
  equal(a, b, msg) {
    if (a !== b) {
      console.error(`FAIL: ${msg}: expected "${b}", got "${a}"`)
      process.exitCode = 1
    } else {
      console.log(`  OK: ${msg}`)
    }
  },
  contains(text, substr, msg) {
    if (!text.includes(substr)) {
      console.error(`FAIL: ${msg}: "${substr}" not found`)
      process.exitCode = 1
    } else {
      console.log(`  OK: ${msg}`)
    }
  },
}

function toIcsDate(date) {
  const y = String(date.getUTCFullYear())
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}${m}${d}`
}

function toIcsDateTime(date) {
  const y = String(date.getUTCFullYear())
  const M = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  const h = String(date.getUTCHours()).padStart(2, '0')
  const m = String(date.getUTCMinutes()).padStart(2, '0')
  const s = String(date.getUTCSeconds()).padStart(2, '0')
  return `${y}${M}${d}T${h}${m}${s}Z`
}

function nextDay(date) {
  const d = new Date(date)
  d.setUTCDate(d.getUTCDate() + 1)
  return d
}

function escapeText(text) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '')
}

function generateIcs(event, baseUrl = 'https://se.polinema.ac.id') {
  const eventStart = event.eventDate
  const eventEnd = event.eventEndDate ?? eventStart
  const dtStart = toIcsDate(eventStart)
  const dtEnd = toIcsDate(nextDay(eventEnd))

  const descriptionParts = []
  if (event.excerpt) descriptionParts.push(event.excerpt)
  if (event.excerptId) descriptionParts.push(event.excerptId)

  const summary = event.title
  const description = descriptionParts.join('\n\n')
  const uid = `${event.slug}@se.polinema.ac.id`
  const url = `${baseUrl}/events/${event.slug}`

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SE Lab//Events Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${toIcsDateTime(new Date())}`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:${escapeText(summary)}`,
  ]

  if (description) lines.push(`DESCRIPTION:${escapeText(description)}`)
  if (event.location) lines.push(`LOCATION:${escapeText(event.location)}`)

  lines.push(
    `URL:${url}`,
    'ORGANIZER;CN=Software Engineering Laboratory:mailto:imam.rozi@polinema.ac.id',
    'END:VEVENT',
    'END:VCALENDAR',
  )

  return lines.join('\r\n') + '\r\n'
}

console.log('Testing .ics generation...\n')

// Test 1: Basic single-day event
console.log('1. Single-day event:')
const singleDay = generateIcs({
  slug: 'test-event',
  title: 'Test Event Title',
  excerpt: 'A test event excerpt.',
  eventDate: new Date('2026-07-15'),
})
assert.contains(singleDay, 'BEGIN:VCALENDAR', 'contains BEGIN:VCALENDAR')
assert.contains(singleDay, 'VERSION:2.0', 'contains VERSION:2.0')
assert.contains(singleDay, 'METHOD:PUBLISH', 'contains METHOD:PUBLISH')
assert.contains(singleDay, 'BEGIN:VEVENT', 'contains BEGIN:VEVENT')
assert.contains(singleDay, 'END:VEVENT', 'contains END:VEVENT')
assert.contains(singleDay, 'END:VCALENDAR', 'contains END:VCALENDAR')
assert.contains(singleDay, 'UID:test-event@se.polinema.ac.id', 'contains correct UID')
assert.contains(singleDay, 'DTSTART;VALUE=DATE:20260715', 'contains correct DTSTART')
assert.contains(singleDay, 'DTEND;VALUE=DATE:20260716', 'contains correct DTEND (next day)')
assert.contains(singleDay, 'SUMMARY:Test Event Title', 'contains SUMMARY')
assert.contains(singleDay, 'DESCRIPTION:A test event excerpt.', 'contains DESCRIPTION')
assert.contains(singleDay, 'URL:https://se.polinema.ac.id/events/test-event', 'contains URL')
assert.contains(singleDay, 'ORGANIZER;CN=Software Engineering Laboratory', 'contains ORGANIZER')

// Test 2: Multi-day event
console.log('\n2. Multi-day event:')
const multiDay = generateIcs({
  slug: 'workshop',
  title: 'Three Day Workshop',
  excerpt: 'A multi-day workshop.',
  eventDate: new Date('2026-08-10'),
  eventEndDate: new Date('2026-08-12'),
})
assert.contains(multiDay, 'DTSTART;VALUE=DATE:20260810', 'DTSTART is correct')
assert.contains(multiDay, 'DTEND;VALUE=DATE:20260813', 'DTEND is day after endDate')

// Test 3: Event with location
console.log('\n3. Event with location:')
const withLoc = generateIcs({
  slug: 'seminar',
  title: 'Seminar',
  eventDate: new Date('2026-09-01'),
  location: 'Room 301, JTI Polinema',
})
assert.contains(withLoc, 'LOCATION:Room 301\\, JTI Polinema', 'LOCATION is present with escaped comma')

// Test 4: Bilingual event with both excerpt and excerptId
console.log('\n4. Bilingual event:')
const bilingual = generateIcs({
  slug: 'bilingual-event',
  title: 'AI Testing Seminar',
  eventDate: new Date('2026-10-20'),
  excerpt: 'Exploring AI in software testing.',
  excerptId: 'Mengeksplorasi AI dalam pengujian perangkat lunak.',
})
assert.contains(bilingual, 'DESCRIPTION:Exploring AI in software testing.\\n\\nMengeksplorasi AI dalam pengujian perangkat lunak.', 'DESCRIPTION contains both languages')

// Test 5: Special character escaping
console.log('\n5. Special character escaping:')
const special = generateIcs({
  slug: 'special-event',
  title: 'Test; with\\ special, chars',
  eventDate: new Date('2026-11-05'),
})
assert.contains(special, 'SUMMARY:Test\\; with\\\\ special\\, chars', 'SUMMARY escapes special chars correctly')

// Test 6: Line endings use CRLF
console.log('\n6. Line endings:')
const lines = singleDay.split('\r\n')
assert.ok(lines.length > 5, 'contains multiple lines with CRLF')
assert.equal(lines[0], 'BEGIN:VCALENDAR', 'first line is BEGIN:VCALENDAR')
assert.equal(lines[lines.length - 1], '', 'ends with trailing CRLF')

// Test 7: DTSTAMP is present and in correct RFC 5545 UTC datetime format
console.log('\n7. DTSTAMP:')
assert.contains(singleDay, 'DTSTAMP:', 'contains DTSTAMP')
const stampMatch = singleDay.match(/DTSTAMP:(\d{8}T\d{6}Z)/)
assert.ok(stampMatch !== null, 'DTSTAMP has YYYYMMDDTHHMMSSZ format')
assert.ok(/^\d{8}T\d{6}Z$/.test(stampMatch[1]), 'DTSTAMP matches RFC 5545 DATE-TIME UTC pattern')

console.log('\nAll tests completed.')
if (process.exitCode) {
  console.error('\nSome tests FAILED.')
} else {
  console.log('\nAll tests PASSED.')
}
