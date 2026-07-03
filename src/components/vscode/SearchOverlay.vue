<template>
  <Teleport to="body">
    <Transition name="overlay-fade">
      <div
        v-if="open"
        class="search-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        @click.self="close"
      >
        <div class="search-palette" role="search">
          <div class="search-input-wrap">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="search-icon"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref="inputEl"
              v-model="query"
              type="text"
              class="search-input"
              :placeholder="t.search.placeholder"
              :aria-label="t.search.placeholder"
              autocomplete="off"
              spellcheck="false"
              @keydown="onKeydown"
            />
          </div>

          <div v-if="query.length > 0" class="search-results" role="listbox" :aria-label="t.search.allResults">
            <template v-if="groupedResults.length === 0">
              <div class="search-empty" role="status">{{ t.search.noResults }}</div>
            </template>

            <template v-for="group in groupedResults" :key="group.label">
              <div class="search-group-label" role="presentation">{{ group.label }}</div>
              <button
                v-for="(item, i) in group.items"
                :key="item.id"
                :ref="(el) => { if (el) resultRefs[group.label + ':' + i] = el as HTMLElement }"
                class="search-result-item"
                :class="{ 'result-active': activeGroup === group.label && activeIndex === i }"
                role="option"
                :aria-selected="activeGroup === group.label && activeIndex === i"
                :tabindex="-1"
                @click="navigateTo(item.href)"
                @mouseenter="setActive(group.label, i)"
              >
                <span class="result-icon" :class="typeIconClass(item.type)" aria-hidden="true">
                  <svg v-if="item.type === 'researcher'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                  <svg v-else-if="item.type === 'publication'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                  </svg>
                  <svg v-else-if="item.type === 'project'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                  </svg>
                  <svg v-else-if="item.type === 'event'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </span>
                <div class="result-body">
                  <span class="result-title">{{ displayTitle(item) }}</span>
                  <span class="result-excerpt">{{ displayExcerpt(item) }}</span>
                </div>
              </button>
            </template>
          </div>

          <div v-else class="search-hint">
            <span>{{ t.search.placeholder }}</span>
          </div>

          <div class="search-footer">
            <span>
              <kbd aria-hidden="true">↑↓</kbd> {{ t.search.navigate }}
            </span>
            <span>
              <kbd aria-hidden="true">↵</kbd> {{ t.search.openSearch }}
            </span>
            <span>
              <kbd aria-hidden="true">esc</kbd> {{ t.search.close }}
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../../composables/useI18n'

const { t, lang } = useI18n()

interface SearchItem {
  id: string
  type: 'researcher' | 'publication' | 'blog' | 'project' | 'event'
  title: string
  titleId: string
  excerpt: string
  excerptId: string
  href: string
  searchText: string
}

interface ResultGroup {
  label: string
  items: SearchItem[]
}

const open = ref(false)
const query = ref('')
const debouncedQuery = ref('')
const searchIndex = ref<SearchItem[]>([])
const indexLoaded = ref(false)
const inputEl = ref<HTMLInputElement | null>(null)
const resultRefs: Record<string, HTMLElement> = {}
const activeGroup = ref('')
const activeIndex = ref(-1)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function displayTitle(item: SearchItem): string {
  return lang.value === 'id' && item.titleId ? item.titleId : item.title
}

function displayExcerpt(item: SearchItem): string {
  return lang.value === 'id' && item.excerptId ? item.excerptId : item.excerpt
}

function typeIconClass(type: string): string {
  return 'icon-' + type
}

const normalizedQuery = computed(() => {
  return debouncedQuery.value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim()
})

const groupedResults = computed<ResultGroup[]>(() => {
  const q = normalizedQuery.value
  if (!q || q.length < 1) return []

  const tokens = q.split(/\s+/).filter(Boolean)

  function matches(item: SearchItem): boolean {
    return tokens.every(t => item.searchText.includes(t))
  }

  const matched = searchIndex.value.filter(matches).slice(0, 30)

  const groups: ResultGroup[] = []
  const typeOrder: Record<string, string> = {
    researcher: t.value.search.groupResearchers,
    publication: t.value.search.groupPublications,
    project: t.value.search.groupProjects,
    blog: t.value.search.groupBlog,
    event: t.value.search.groupEvents,
  }

  for (const type of ['researcher', 'publication', 'project', 'blog', 'event'] as const) {
    const items = matched.filter(m => m.type === type)
    if (items.length > 0) {
      groups.push({ label: typeOrder[type], items })
    }
  }

  return groups
})

function getFlatResults(): { group: string; index: number }[] {
  const flat: { group: string; index: number }[] = []
  for (const group of groupedResults.value) {
    for (let i = 0; i < group.items.length; i++) {
      flat.push({ group: group.label, index: i })
    }
  }
  return flat
}

function setActive(group: string, index: number) {
  activeGroup.value = group
  activeIndex.value = index
}

function scrollToActive() {
  const key = activeGroup.value + ':' + activeIndex.value
  const el = resultRefs[key]
  if (el) {
    el.scrollIntoView({ block: 'nearest' })
  }
}

function onKeydown(e: KeyboardEvent) {
  const flat = getFlatResults()

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (flat.length === 0) return
    const currentIdx = flat.findIndex(f => f.group === activeGroup.value && f.index === activeIndex.value)
    const next = currentIdx + 1 >= flat.length ? 0 : currentIdx + 1
    setActive(flat[next].group, flat[next].index)
    nextTick(scrollToActive)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (flat.length === 0) return
    const currentIdx = flat.findIndex(f => f.group === activeGroup.value && f.index === activeIndex.value)
    const prev = currentIdx <= 0 ? flat.length - 1 : currentIdx - 1
    setActive(flat[prev].group, flat[prev].index)
    nextTick(scrollToActive)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (flat.length === 0) return
    const currentIdx = flat.findIndex(f => f.group === activeGroup.value && f.index === activeIndex.value)
    if (currentIdx >= 0) {
      const item = flat[currentIdx]
      const group = groupedResults.value.find(g => g.label === item.group)
      if (group) navigateTo(group.items[item.index].href)
    }
  } else if (e.key === 'Escape') {
    e.preventDefault()
    close()
  }
}

function navigateTo(href: string) {
  close()
  window.location.href = href
}

async function loadIndex() {
  if (indexLoaded.value) return
  try {
    const res = await fetch('/api/search-index.json')
    searchIndex.value = await res.json()
    indexLoaded.value = true
  } catch {
    searchIndex.value = []
    indexLoaded.value = true
  }
}

function show() {
  open.value = true
  query.value = ''
  activeGroup.value = ''
  activeIndex.value = -1
  loadIndex()
  nextTick(() => {
    inputEl.value?.focus()
  })
}

function close() {
  open.value = false
}

watch(query, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedQuery.value = val
    activeGroup.value = ''
    activeIndex.value = -1
  }, 150)
})

function onGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    show()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
  window.addEventListener('se-lab-open-search', show)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
  window.removeEventListener('se-lab-open-search', show)
})

defineExpose({ show, close, open })
</script>

<style scoped>
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  padding-top: 14vh;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
}

.search-palette {
  width: 540px;
  max-width: 92vw;
  max-height: 64vh;
  display: flex;
  flex-direction: column;
  background: #1A1F2E;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.search-icon {
  color: rgba(255, 255, 255, 0.35);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 13px;
  color: #E0E4EF;
  caret-color: #F5A100;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.search-results {
  flex: 1;
  overflow-y: auto;
  padding: 6px 0;
  max-height: 400px;
}

.search-group-label {
  padding: 6px 14px 2px;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.3);
  user-select: none;
}

.search-result-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  padding: 6px 14px;
  text-align: left;
  cursor: pointer;
  transition: background 0.08s;
  border: none;
  background: transparent;
}

.search-result-item:hover,
.result-active {
  background: rgba(255, 255, 255, 0.07);
}

.result-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
  border-radius: 3px;
}

.icon-researcher {
  color: #60A5FA;
}

.icon-publication {
  color: #34D399;
}

.icon-blog {
  color: #F5A100;
}

.icon-project {
  color: #60A5FA;
}

.icon-event {
  color: #C084FC;
}

.result-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.result-title {
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 12.5px;
  color: #E0E4EF;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-active .result-title {
  color: #FFFFFF;
}

.result-excerpt {
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-active .result-excerpt {
  color: rgba(255, 255, 255, 0.6);
}

.search-empty {
  padding: 24px 14px;
  text-align: center;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
}

.search-hint {
  padding: 24px 14px;
  text-align: center;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.25);
}

.search-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 6px 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.25);
}

.search-footer kbd {
  display: inline-block;
  padding: 1px 5px;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 3px;
}

.overlay-fade-enter-active {
  transition: opacity 0.12s ease;
}

.overlay-fade-leave-active {
  transition: opacity 0.1s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

.overlay-fade-enter-to,
.overlay-fade-leave-from {
  opacity: 1;
}

.search-results::-webkit-scrollbar {
  width: 4px;
}

.search-results::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 2px;
}
</style>
