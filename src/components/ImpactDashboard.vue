<template>
  <section class="impact-dashboard w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
    <header class="mb-10">
      <h1 class="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
        {{ tr('heading') }}
      </h1>
      <p class="font-sans text-white/55 text-sm md:text-base max-w-2xl">
        {{ tr('description') }}
      </p>
      <p v-if="stats.lastUpdated" class="font-mono text-[11px] uppercase tracking-wider text-white/25 mt-3">
        {{ tr('lastUpdated') }}: {{ new Date(stats.lastUpdated).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
      </p>
    </header>

    <!-- Summary Stat Cards -->
    <dl class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-12">
      <div v-for="card in statCards" :key="card.key" class="stat-card">
        <dd class="font-serif text-3xl md:text-4xl font-bold leading-none" :style="{ color: card.color }">
          {{ card.value }}
        </dd>
        <dt class="font-mono text-[10px] md:text-[11px] uppercase tracking-widest text-white/35 mt-1.5">
          {{ card.label }}
        </dt>
      </div>
    </dl>

    <!-- Publication Trend Chart -->
    <div class="mb-12">
      <h2 class="font-serif text-xl font-bold text-white mb-5">{{ tr('pubTrend') }}</h2>
      <div class="chart-container">
        <svg
          :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
          class="w-full h-auto"
          role="img"
          :aria-label="tr('pubTrendAriaLabel')"
        >
          <line
            v-for="i in yTicks"
            :key="'grid-' + i"
            :x1="yLabelWidth"
            :x2="chartWidth - 12"
            :y1="yPos(i)"
            :y2="yPos(i)"
            stroke="rgba(255,255,255,0.06)"
            stroke-width="1"
          />
          <text
            v-for="i in yTicks"
            :key="'ylabel-' + i"
            :x="yLabelWidth - 6"
            :y="yPos(i) + 4"
            text-anchor="end"
            class="chart-label"
            fill="rgba(255,255,255,0.3)"
            font-size="10"
            font-family="monospace"
          >{{ Math.round(i) }}</text>

          <g v-for="(entry, idx) in trendEntries" :key="entry.year">
            <rect
              :x="barX(idx)"
              :y="yPos(entry.count)"
              :width="barWidth"
              :height="Math.max(0, chartHeight - yLabelMargin - bottomMargin - yPos(entry.count))"
              :fill="barColor"
              rx="1"
              class="trend-bar"
              @mouseenter="hoveredBar = idx"
              @mouseleave="hoveredBar = null"
            >
              <title>{{ entry.year }}: {{ entry.count }} {{ tr('publications') }}</title>
            </rect>
            <g v-if="hoveredBar === idx">
              <rect
                :x="barX(idx) - 14"
                :y="yPos(entry.count) - 24"
                width="48"
                height="18"
                rx="2"
                fill="#1E2D42"
                stroke="rgba(255,255,255,0.15)"
                stroke-width="1"
              />
              <text
                :x="barX(idx) + barWidth / 2"
                :y="yPos(entry.count) - 11"
                text-anchor="middle"
                fill="white"
                font-size="10"
                font-family="monospace"
                class="tooltip-text"
              >{{ entry.count }}</text>
            </g>
          </g>

          <text
            v-for="(entry, idx) in trendEntries"
            :key="'xlabel-' + entry.year"
            :x="barX(idx) + barWidth / 2"
            :y="chartHeight - 4"
            text-anchor="middle"
            class="chart-label"
            fill="rgba(255,255,255,0.3)"
            font-size="10"
            font-family="monospace"
          >{{ entry.year }}</text>
        </svg>
      </div>
    </div>

    <!-- Data Tables Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Publications by Type -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-serif text-lg font-bold text-white">{{ tr('pubByType') }}</h2>
        </div>
        <table class="data-table" role="grid">
          <thead>
            <tr>
              <th @click="sortTable('byType', 'label')" @keydown.enter="sortTable('byType', 'label')" tabindex="0" role="columnheader" :aria-sort="sortState.byType.key === 'label' ? sortState.byType.dir : 'none'">
                {{ tr('typeLabel') }}
                <span class="sort-arrow">{{ sortIcon('byType', 'label') }}</span>
              </th>
              <th @click="sortTable('byType', 'count')" @keydown.enter="sortTable('byType', 'count')" tabindex="0" role="columnheader" :aria-sort="sortState.byType.key === 'count' ? sortState.byType.dir : 'none'">
                {{ tr('countLabel') }}
                <span class="sort-arrow">{{ sortIcon('byType', 'count') }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in sortedByType" :key="item.label">
              <td>{{ typeLabel(item.label) }}</td>
              <td class="font-mono">{{ item.count }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Publications by Stream -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-serif text-lg font-bold text-white">{{ tr('pubByStream') }}</h2>
        </div>
        <table class="data-table" role="grid">
          <thead>
            <tr>
              <th @click="sortTable('byStream', 'label')" @keydown.enter="sortTable('byStream', 'label')" tabindex="0" role="columnheader" :aria-sort="sortState.byStream.key === 'label' ? sortState.byStream.dir : 'none'">
                {{ tr('streamLabel') }}
                <span class="sort-arrow">{{ sortIcon('byStream', 'label') }}</span>
              </th>
              <th @click="sortTable('byStream', 'count')" @keydown.enter="sortTable('byStream', 'count')" tabindex="0" role="columnheader" :aria-sort="sortState.byStream.key === 'count' ? sortState.byStream.dir : 'none'">
                {{ tr('countLabel') }}
                <span class="sort-arrow">{{ sortIcon('byStream', 'count') }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in sortedByStream" :key="item.label">
              <td>{{ item.label }}</td>
              <td class="font-mono">{{ item.count }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Researcher Productivity -->
      <div class="md:col-span-2">
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-serif text-lg font-bold text-white">{{ tr('researcherProductivity') }}</h2>
        </div>
        <table class="data-table" role="grid">
          <thead>
            <tr>
              <th @click="sortTable('byResearcher', 'name')" @keydown.enter="sortTable('byResearcher', 'name')" tabindex="0" role="columnheader" :aria-sort="sortState.byResearcher.key === 'name' ? sortState.byResearcher.dir : 'none'">
                {{ tr('researcherLabel') }}
                <span class="sort-arrow">{{ sortIcon('byResearcher', 'name') }}</span>
              </th>
              <th @click="sortTable('byResearcher', 'publicationCount')" @keydown.enter="sortTable('byResearcher', 'publicationCount')" tabindex="0" role="columnheader" :aria-sort="sortState.byResearcher.key === 'publicationCount' ? sortState.byResearcher.dir : 'none'">
                {{ tr('publications') }}
                <span class="sort-arrow">{{ sortIcon('byResearcher', 'publicationCount') }}</span>
              </th>
              <th @click="sortTable('byResearcher', 'primaryStreamEn')" @keydown.enter="sortTable('byResearcher', 'primaryStreamEn')" tabindex="0" role="columnheader" :aria-sort="sortState.byResearcher.key === 'primaryStreamEn' ? sortState.byResearcher.dir : 'none'">
                {{ tr('primaryStream') }}
                <span class="sort-arrow">{{ sortIcon('byResearcher', 'primaryStreamEn') }}</span>
              </th>
              <th class="hidden sm:table-cell">{{ tr('profile') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in sortedResearchers" :key="r.id">
              <td>{{ r.name }}</td>
              <td class="font-mono">{{ r.publicationCount }}</td>
              <td class="text-white/60 text-sm">{{ primaryStreamLabel(r) }}</td>
              <td class="hidden sm:table-cell">
                <a :href="`/researchers/${r.id}`" class="text-[#6AB0F5] hover:underline text-sm font-mono">
                  {{ tr('viewProfile') }}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from '../composables/useI18n'
import en from '../i18n/en.json'
import id from '../i18n/id.json'

interface ResearcherStat {
  id: string
  name: string
  publicationCount: number
  primaryStream: string | null
  primaryStreamEn: string | null
  primaryStreamId: string | null
}

interface ImpactStats {
  researchers: number
  publications: number
  projects: number
  books: number
  focusAreas: number
  lastUpdated: string | null
  tutorials: number
  events: number
  achievements: number
  publicationsByYear: Record<number, number>
  publicationsByType: Record<string, number>
  publicationsByStream: Record<string, number>
  researcherStats: ResearcherStat[]
  streamNames: Record<string, { en: string; id: string }>
}

const props = defineProps<{
  stats: ImpactStats
}>()

const { lang } = useI18n()

const translations = { en: (en as Record<string, unknown>).impact as Record<string, string>, id: (id as Record<string, unknown>).impact as Record<string, string> }

function tr(key: string): string {
  const dict = translations[lang.value] ?? translations.en
  return dict?.[key] ?? key
}

const defaultStats: Record<string, string> = {
  researchers: 'Researchers',
  publications: 'Publications',
  projects: 'Projects',
  books: 'Books',
  tutorials: 'Tutorials',
  events: 'Events',
  achievements: 'Achievements',
  focusAreas: 'Focus Areas',
}

const statsDict = computed(() => {
  const raw = (lang.value === 'id' ? id : en) as unknown as Record<string, Record<string, string>>
  return raw.stats ?? defaultStats
})

const hoveredBar = ref<number | null>(null)

const statCards = computed(() => [
  { key: 'researchers',   label: statsDict.value.researchers  ?? defaultStats.researchers,   value: props.stats.researchers,   color: '#F5A100' },
  { key: 'publications',  label: statsDict.value.publications ?? defaultStats.publications,  value: props.stats.publications,  color: '#6AB0F5' },
  { key: 'projects',      label: statsDict.value.projects     ?? defaultStats.projects,      value: props.stats.projects,      color: '#98C379' },
  { key: 'books',         label: statsDict.value.books        ?? defaultStats.books,         value: props.stats.books,         color: '#CE9178' },
  { key: 'tutorials',     label: tr('tutorials')              ?? 'Tutorials',                value: props.stats.tutorials,     color: '#C586C0' },
  { key: 'events',        label: tr('events')                 ?? 'Events',                   value: props.stats.events,        color: '#D4D4D4' },
  { key: 'achievements',  label: tr('achievements')           ?? 'Achievements',             value: props.stats.achievements,  color: '#DCDCAA' },
  { key: 'focusAreas',    label: tr('focusAreas')             ?? 'Focus Areas',              value: props.stats.focusAreas,    color: '#F44747' },
])

type TableKey = 'byType' | 'byStream' | 'byResearcher'

const sortState = reactive<Record<TableKey, { key: string; dir: 'asc' | 'desc' }>>({
  byType:       { key: 'count', dir: 'desc' },
  byStream:     { key: 'count', dir: 'desc' },
  byResearcher: { key: 'publicationCount', dir: 'desc' },
})

function sortTable(table: TableKey, key: string) {
  if (sortState[table].key === key) {
    sortState[table].dir = sortState[table].dir === 'asc' ? 'desc' : 'asc'
  } else {
    sortState[table].key = key
    sortState[table].dir = key === 'name' || key === 'label' ? 'asc' : 'desc'
  }
}

function sortIcon(table: TableKey, key: string): string {
  if (sortState[table].key !== key) return ''
  return sortState[table].dir === 'asc' ? ' \u25B2' : ' \u25BC'
}

const typeEntries = computed(() =>
  Object.entries(props.stats.publicationsByType).map(([type, count]) => ({ label: type, count }))
)
const sortedByType = computed(() => {
  const key = sortState.byType.key as 'label' | 'count'
  return [...typeEntries.value].sort((a, b) => {
    const mult = sortState.byType.dir === 'asc' ? 1 : -1
    if (key === 'count') return (a.count - b.count) * mult
    return a.label.localeCompare(b.label) * mult
  })
})

const streamEntries = computed(() =>
  Object.entries(props.stats.publicationsByStream).map(([label, count]) => ({ label, count }))
)
const sortedByStream = computed(() => {
  const key = sortState.byStream.key as 'label' | 'count'
  return [...streamEntries.value].sort((a, b) => {
    const mult = sortState.byStream.dir === 'asc' ? 1 : -1
    if (key === 'count') return (a.count - b.count) * mult
    return a.label.localeCompare(b.label) * mult
  })
})

const sortedResearchers = computed(() => {
  const key = sortState.byResearcher.key as 'name' | 'publicationCount' | 'primaryStreamEn'
  return [...props.stats.researcherStats].sort((a, b) => {
    const mult = sortState.byResearcher.dir === 'asc' ? 1 : -1
    if (key === 'publicationCount') return (a.publicationCount - b.publicationCount) * mult
    if (key === 'primaryStreamEn') {
      const aVal = a.primaryStreamEn ?? ''
      const bVal = b.primaryStreamEn ?? ''
      return aVal.localeCompare(bVal) * mult
    }
    return a.name.localeCompare(b.name) * mult
  })
})

function typeLabel(type: string): string {
  const map: Record<string, string> = {
    journal: tr('typeJournal') || 'Journal',
    conference: tr('typeConference') || 'Conference',
    'book-chapter': tr('typeBookChapter') || 'Book Chapter',
    proceeding: tr('typeProceeding') || 'Proceeding',
    preprint: tr('typePreprint') || 'Preprint',
  }
  return map[type] ?? type
}

function primaryStreamLabel(r: ResearcherStat): string {
  if (lang.value === 'id' && r.primaryStreamId) return r.primaryStreamId
  return r.primaryStreamEn ?? '-'
}

// Chart dimensions
const chartHeight = 180
const yLabelWidth = 28
const yLabelMargin = 20
const bottomMargin = 18
const barColor = '#6AB0F5'

const trendEntries = computed(() => {
  const entries = Object.entries(props.stats.publicationsByYear)
    .map(([year, count]) => ({ year: Number(year), count }))
    .sort((a, b) => a.year - b.year)
  return entries.length ? entries : [{ year: new Date().getFullYear(), count: 0 }]
})

const chartWidth = computed(() => Math.max(400, trendEntries.value.length * 50 + yLabelWidth + 20))
const barWidth = computed(() => Math.max(6, (chartWidth.value - yLabelWidth - 12) / trendEntries.value.length - 6))

const maxCount = computed(() => {
  const max = Math.max(1, ...trendEntries.value.map((e) => e.count))
  return Math.ceil(max * 1.2)
})

const yTicks = computed(() => {
  const max = maxCount.value
  const tickCount = 4
  const raw = max / (tickCount - 1)
  const roundTo = raw <= 1 ? 1 : raw <= 5 ? 5 : 10
  const step = Math.max(1, Math.ceil(raw / roundTo) * roundTo)
  return Array.from({ length: tickCount }, (_, i) => i * step)
})

function yPos(val: number): number {
  const max = yTicks.value[yTicks.value.length - 1] || 1
  return yLabelMargin + (chartHeight - yLabelMargin - bottomMargin) * (1 - val / max)
}

function barX(idx: number): number {
  return yLabelWidth + idx * ((chartWidth.value - yLabelWidth - 12) / trendEntries.value.length) + 3
}
</script>

<style scoped>
.impact-dashboard {
  min-height: calc(100vh - 200px);
}

.stat-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  padding: 16px 14px;
  text-align: center;
  transition: border-color 0.2s, background 0.2s;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.chart-container {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 16px 8px 8px;
  overflow-x: auto;
}

.chart-label {
  user-select: none;
  pointer-events: none;
}

.trend-bar {
  transition: opacity 0.15s;
  cursor: pointer;
}

.trend-bar:hover {
  opacity: 0.8;
}

.tooltip-text {
  pointer-events: none;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table thead {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.data-table th {
  padding: 8px 10px;
  text-align: left;
  font-family: monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.35);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.data-table th:hover {
  color: rgba(255, 255, 255, 0.65);
}

.data-table td {
  padding: 8px 10px;
  color: rgba(255, 255, 255, 0.75);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.data-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.03);
}

.sort-arrow {
  font-size: 9px;
  margin-left: 2px;
}

@media (max-width: 640px) {
  .stat-card {
    padding: 12px 10px;
  }

  .data-table td,
  .data-table th {
    padding: 6px 8px;
    font-size: 12px;
  }

  .data-table th {
    font-size: 9px;
  }
}
</style>
