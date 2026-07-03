import satori, { init } from 'satori'
import type { Font as FontOptions, FontWeight } from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const WIDTH = 1200
const HEIGHT = 630

const BLUE_DARK = '#003380'
const BLUE_PRIMARY = '#004EA2'
const GOLD = '#F5A100'
const WHITE = '#FFFFFF'

type OgContentType = 'publication' | 'project' | 'blog'

interface OgPublicationData {
  title: string
  year: number
  type: string
  venue: string
  authors: string[]
  language: 'en' | 'id'
}

interface OgProjectData {
  title: string
  titleId?: string
  status: 'active' | 'completed' | 'prototype'
  stream?: string
  streamName?: string
}

interface OgBlogData {
  title: string
  titleId?: string
  category: string
  author: string
  readingTime: number
  lang: 'en' | 'id'
}

type OgData = OgPublicationData | OgProjectData | OgBlogData

interface SatoriNode {
  type: string
  props: Record<string, any>
  key: string | number | null
}

function h(type: string, props: Record<string, any> | null, ...children: any[]): SatoriNode {
  const flat = children.flat(Infinity).filter((c) => c != null && c !== false && c !== true)
  const p = { ...(props || {}) }
  if (flat.length > 0) {
    p.children = flat
  }
  return { type, props: p, key: null }
}

let yogaInitialized = false

async function ensureYoga() {
  if (yogaInitialized) return
  const wasm = await readFile(join(process.cwd(), 'node_modules/yoga-wasm-web/dist/yoga.wasm'))
  await init(wasm)
  yogaInitialized = true
}

const FONT_BASE = join(process.cwd(), 'node_modules/@fontsource')
const FONT_FILES: { path: string; name: string; weight: FontWeight; style: 'normal' | 'italic' }[] = [
  { path: 'inter/files/inter-latin-400-normal.woff', name: 'Inter', weight: 400, style: 'normal' },
  { path: 'inter/files/inter-latin-600-normal.woff', name: 'Inter', weight: 600, style: 'normal' },
  { path: 'inter/files/inter-latin-700-normal.woff', name: 'Inter', weight: 700, style: 'normal' },
  { path: 'dm-serif-display/files/dm-serif-display-latin-400-normal.woff', name: 'DM Serif Display', weight: 400, style: 'normal' },
  { path: 'dm-serif-display/files/dm-serif-display-latin-400-italic.woff', name: 'DM Serif Display', weight: 400, style: 'italic' },
]

let _fontCache: FontOptions[] | null = null

async function loadFonts(): Promise<FontOptions[]> {
  if (_fontCache) return _fontCache

  const fonts: FontOptions[] = []
  for (const f of FONT_FILES) {
    const buf = await readFile(join(FONT_BASE, f.path))
    fonts.push({ data: buf, name: f.name, weight: f.weight, style: f.style })
  }

  _fontCache = fonts
  return fonts
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen - 1) + '\u2026'
}

function typeLabel(type: string): string {
  const map: Record<string, string> = {
    journal: 'Journal',
    conference: 'Conference',
    'book-chapter': 'Book Chapter',
    proceeding: 'Proceeding',
    preprint: 'Preprint',
  }
  return map[type] ?? type
}

function statusLabelEn(status: string): string {
  const map: Record<string, string> = {
    active: 'Active',
    completed: 'Completed',
    prototype: 'Prototype',
  }
  return map[status] ?? status
}

function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    announcement: 'Announcement',
    news: 'News',
    event: 'Event',
    tutorial: 'Tutorial',
  }
  return map[cat] ?? cat
}

const seLogo = h('div', { style: { display: 'flex', alignItems: 'center', marginBottom: 32 } },
  h('div', {
    style: {
      width: 52, height: 52, background: GOLD, borderRadius: 12,
      display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 14,
    },
  },
    h('span', { style: { fontFamily: 'DM Serif Display', fontSize: 26, fontWeight: 700, color: WHITE, letterSpacing: '-0.02em' } }, '{SE}')
  ),
  h('div', { style: { display: 'flex', flexDirection: 'column' } },
    h('span', { style: { fontFamily: 'DM Serif Display', fontSize: 26, fontWeight: 700, color: WHITE, lineHeight: 1.1 } }, 'Software Engineering Laboratory'),
    h('span', { style: { fontFamily: 'Inter', fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,0.7)', marginTop: 2 } }, 'JTI Polinema'),
  ),
)

const innerBorder = h('div', {
  style: {
    position: 'absolute', inset: 16,
    border: '2px solid rgba(255,255,255,0.12)', borderRadius: 24,
  },
})

function bottomBar(rightLabel: string) {
  return h('div', {
    style: {
      position: 'absolute', bottom: 40, left: 40, right: 40,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderTop: `1px solid ${GOLD}`, paddingTop: 16,
    },
  },
    h('span', { style: { fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.6)' } }, 'se.polinema.ac.id'),
    h('span', { style: { fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.6)' } }, rightLabel),
  )
}

function badge(text: string, opts?: { gold?: boolean }) {
  const c = opts?.gold ? GOLD : WHITE
  const bg = opts?.gold ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.12)'
  const borderColor = opts?.gold ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.2)'
  return h('span', {
    style: {
      fontFamily: 'Inter', fontSize: 18, fontWeight: 600,
      color: c, background: bg, padding: '6px 18px', borderRadius: 20,
      border: `1px solid ${borderColor}`,
    },
  }, text)
}

function publicationOgElement(data: OgPublicationData, lang: 'en' | 'id') {
  const authorsText = data.authors.length > 0
    ? truncate(data.authors.join(', '), 160)
    : ''
  const authorsLabel = lang === 'id' ? 'Penulis' : 'Authors'

  const children: any[] = [
    innerBorder,
    seLogo,
    h('div', { style: { display: 'flex', marginBottom: 20 } },
      badge(typeLabel(data.type), { gold: true }),
    ),
    h('div', {
      style: {
        display: 'flex', flexDirection: 'column',
        fontFamily: 'DM Serif Display', fontSize: 42, fontWeight: 700,
        color: WHITE, lineHeight: 1.15, maxHeight: 140, overflow: 'hidden', marginBottom: 24,
      },
    }, truncate(data.title, 120)),
    h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px 24px', marginBottom: 18 } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
        h('span', { style: { fontFamily: 'Inter', fontSize: 20, fontWeight: 700, color: GOLD } }, String(data.year)),
        h('span', { style: { fontFamily: 'Inter', fontSize: 18, fontWeight: 400, color: 'rgba(255,255,255,0.75)' } }, data.venue),
      ),
    ),
  ]

  if (authorsText) {
    children.push(
      h('div', { style: { display: 'flex', alignItems: 'baseline', gap: 8 } },
        h('span', { style: { fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.5)' } }, `${authorsLabel}:`),
        h('span', { style: { fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.65)' } }, authorsText),
      ),
    )
  }

  children.push(bottomBar(lang === 'id' ? 'Publikasi' : 'Publication'))

  return h('div', {
    style: {
      width: WIDTH, height: HEIGHT,
      background: `linear-gradient(180deg, ${BLUE_PRIMARY} 0%, ${BLUE_DARK} 100%)`,
      display: 'flex', flexDirection: 'column', padding: 40, position: 'relative',
    },
  }, ...children)
}

function projectOgElement(data: OgProjectData) {
  const displayTitle = data.titleId ?? data.title
  const statusLabel = statusLabelEn(data.status)
  const streamText = data.streamName ?? data.stream ?? null

  const children: any[] = [
    innerBorder,
    seLogo,
    h('div', { style: { display: 'flex', gap: 12, marginBottom: 20 } },
      badge('Project', { gold: true }),
      badge(statusLabel),
    ),
    h('div', {
      style: {
        display: 'flex', flexDirection: 'column',
        fontFamily: 'DM Serif Display', fontSize: 44, fontWeight: 700,
        color: WHITE, lineHeight: 1.15, maxHeight: 160, overflow: 'hidden', marginBottom: 24,
      },
    }, truncate(displayTitle, 110)),
  ]

  if (streamText) {
    children.push(
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 } },
        h('span', { style: { fontFamily: 'Inter', fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.5)' } }, 'Stream:'),
        h('span', { style: { fontFamily: 'Inter', fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.8)' } }, streamText),
      ),
    )
  }

  children.push(bottomBar('Research Project'))

  return h('div', {
    style: {
      width: WIDTH, height: HEIGHT,
      background: `linear-gradient(180deg, ${BLUE_PRIMARY} 0%, ${BLUE_DARK} 100%)`,
      display: 'flex', flexDirection: 'column', padding: 40, position: 'relative',
    },
  }, ...children)
}

function blogOgElement(data: OgBlogData) {
  const displayTitle = data.lang === 'id' && data.titleId ? data.titleId : data.title
  const readingLabel = data.lang === 'id' ? 'menit baca' : 'min read'
  const categoryLabelText = categoryLabel(data.category)

  return h('div', {
    style: {
      width: WIDTH, height: HEIGHT,
      background: `linear-gradient(180deg, ${BLUE_PRIMARY} 0%, ${BLUE_DARK} 100%)`,
      display: 'flex', flexDirection: 'column', padding: 40, position: 'relative',
    },
  },
    innerBorder,
    seLogo,
    h('div', { style: { display: 'flex', gap: 12, marginBottom: 20 } },
      badge(categoryLabelText, { gold: true }),
    ),
    h('div', {
      style: {
        display: 'flex', flexDirection: 'column',
        fontFamily: 'DM Serif Display', fontSize: 44, fontWeight: 700,
        color: WHITE, lineHeight: 1.15, maxHeight: 210, overflow: 'hidden', marginBottom: 24,
      },
    }, truncate(displayTitle, 140)),
    h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px 24px' } },
      h('span', { style: { fontFamily: 'Inter', fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.8)' } }, data.author),
      h('span', { style: { fontFamily: 'Inter', fontSize: 18, fontWeight: 400, color: 'rgba(255,255,255,0.6)' } }, `${data.readingTime} ${readingLabel}`),
    ),
    bottomBar(data.lang === 'id' ? 'Tutorial' : 'Tutorial'),
  )
}

function getElement(type: OgContentType, data: OgData, lang: 'en' | 'id'): SatoriNode {
  switch (type) {
    case 'publication':
      return publicationOgElement(data as OgPublicationData, lang)
    case 'project':
      return projectOgElement(data as OgProjectData)
    case 'blog':
      return blogOgElement(data as OgBlogData)
  }
}

export async function generateOgImage(
  type: OgContentType,
  data: OgData,
  lang: 'en' | 'id',
): Promise<Buffer> {
  await ensureYoga()
  const fonts = await loadFonts()

  const element = getElement(type, data, lang)

  const svg = await satori(element as any, {
    width: WIDTH,
    height: HEIGHT,
    fonts,
  })

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: WIDTH },
  })
  return resvg.render().asPng()
}
