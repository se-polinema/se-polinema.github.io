<template>
  <div class="cmdk-palette" role="search">
    <div class="cmdk-input-wrap">
      <span class="cmdk-prompt" aria-hidden="true">&gt;</span>
      <input
        ref="inputEl"
        v-model="query"
        type="text"
        class="cmdk-input"
        placeholder="Type a command..."
        aria-label="Type a command"
        autocomplete="off"
        spellcheck="false"
        @keydown="onKeydown"
      />
    </div>

    <div class="cmdk-results" role="listbox" aria-label="Commands">
      <template v-if="groupedCommands.length === 0">
        <div class="cmdk-empty" role="status">No matching commands</div>
      </template>

      <template v-for="group in groupedCommands" :key="group.label">
        <div class="cmdk-group-label" role="presentation">{{ group.label }}</div>
        <button
          v-for="(cmd, i) in group.items"
          :key="cmd.id"
          :ref="(el) => { if (el) resultRefs[group.label + ':' + i] = el as HTMLElement }"
          class="cmdk-item"
          :class="{ 'item-active': activeGroup === group.label && activeIndex === i }"
          role="option"
          :aria-selected="activeGroup === group.label && activeIndex === i"
          :tabindex="-1"
          @click="run(cmd)"
          @mouseenter="setActive(group.label, i)"
        >
          {{ cmd.title }}
        </button>
      </template>
    </div>

    <div class="cmdk-footer">
      <span><kbd aria-hidden="true">↑↓</kbd> Navigate</span>
      <span><kbd aria-hidden="true">↵</kbd> Run</span>
      <span><kbd aria-hidden="true">esc</kbd> Close</span>
      <span><kbd aria-hidden="true">Ctrl+K</kbd> Search</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// Content-only: the Teleport/Transition/backdrop shell, global keyboard
// shortcuts, and focus trap all live in QuickInputOverlays.vue, which
// mounts this component (via v-if) only while its "command" mode is
// active. Mounting fresh each time means state (query, activeIndex, ...)
// naturally starts clean without needing an explicit show()/reset step.
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { useI18n } from '../../composables/useI18n'
import { usePalette, PALETTES } from '../../composables/usePalette'
import { useVSCodeLayout } from '../../composables/useVSCodeLayout'

const props = defineProps<{ prefillQuery?: string }>()
const emit = defineEmits<{ close: [] }>()

const { theme, setTheme } = useTheme()
const { setLang } = useI18n()
const { setPalette } = usePalette()
const { togglePanel, openPanel, setView } = useVSCodeLayout()

interface Command {
  id: string
  title: string
  keywords: string
  section: string
  run: () => void
}

interface CommandGroup {
  label: string
  items: Command[]
}

const query = ref(props.prefillQuery ?? '')
const inputEl = ref<HTMLInputElement | null>(null)
const resultRefs: Record<string, HTMLElement> = {}
const activeGroup = ref('')
const activeIndex = ref(-1)

const goToPages: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'Publications', href: '/publications' },
  { label: 'Researchers', href: '/researchers' },
  { label: 'Events', href: '/events' },
  { label: 'Blog', href: '/blog' },
  { label: 'Members', href: '/members' },
  { label: 'Alumni', href: '/alumni' },
  { label: 'Projects', href: '/projects' },
  { label: 'Showcase', href: '/showcase' },
  { label: 'Books', href: '/books' },
  { label: 'Decks', href: '/decks' },
  { label: 'Achievements', href: '/achievements' },
]

const sidebarViews: { view: Parameters<typeof setView>[0]; label: string }[] = [
  { view: 'explorer', label: 'Explorer' },
  { view: 'blog', label: 'Blog' },
  { view: 'events', label: 'Events' },
  { view: 'github', label: 'Source Control' },
  { view: 'researchers', label: 'Researchers' },
  { view: 'publications', label: 'Publications' },
  { view: 'decks', label: 'Decks' },
  { view: 'achievements', label: 'Achievements' },
  { view: 'members', label: 'Members' },
]

const panelTabs: { id: 'contact' | 'output' | 'quickLinks' | 'newsletter'; label: string }[] = [
  { id: 'contact', label: 'Contact' },
  { id: 'output', label: 'Output' },
  { id: 'quickLinks', label: 'Quick Links' },
  { id: 'newsletter', label: 'Newsletter' },
]

const commands = computed<Command[]>(() => [
  {
    id: 'theme-toggle',
    title: 'Preferences: Toggle Theme',
    keywords: 'dark light mode terang gelap',
    section: 'Preferences',
    run: () => setTheme(theme.value === 'dark' ? 'light' : 'dark'),
  },
  {
    id: 'theme-light',
    title: 'Preferences: Color Theme — Light',
    keywords: 'terang',
    section: 'Preferences',
    run: () => setTheme('light'),
  },
  {
    id: 'theme-dark',
    title: 'Preferences: Color Theme — Dark',
    keywords: 'gelap',
    section: 'Preferences',
    run: () => setTheme('dark'),
  },
  {
    id: 'lang-en',
    title: 'Preferences: Display Language — English',
    keywords: 'inggris bahasa',
    section: 'Preferences',
    run: () => setLang('en'),
  },
  {
    id: 'lang-id',
    title: 'Preferences: Display Language — Bahasa Indonesia',
    keywords: 'indonesian bahasa',
    section: 'Preferences',
    run: () => setLang('id'),
  },
  ...PALETTES.map((p) => ({
    id: `palette-${p}`,
    title: `Preferences: Color Palette — ${p}`,
    keywords: 'colour color scheme',
    section: 'Preferences',
    run: () => setPalette(p),
  })),
  {
    id: 'panel-toggle',
    title: 'View: Toggle Bottom Panel',
    keywords: 'terminal output panel',
    section: 'View',
    run: () => togglePanel(),
  },
  ...panelTabs.map((t) => ({
    id: `panel-open-${t.id}`,
    title: `View: Open Panel — ${t.label}`,
    keywords: '',
    section: 'View',
    run: () => openPanel(t.id),
  })),
  ...sidebarViews.map((v) => ({
    id: `view-${v.view}`,
    title: `View: Focus ${v.label}`,
    keywords: '',
    section: 'View',
    run: () => setView(v.view),
  })),
  {
    id: 'search-files',
    title: 'Go to File...',
    keywords: 'search find',
    section: 'Go to',
    run: () => window.dispatchEvent(new CustomEvent('se-lab-open-search')),
  },
  ...goToPages.map((p) => ({
    id: `goto-${p.href}`,
    title: `Go to: ${p.label}`,
    keywords: '',
    section: 'Go to',
    run: () => {
      window.location.href = p.href
    },
  })),
])

const normalizedQuery = computed(() => query.value.toLowerCase().replace(/^>\s*/, '').trim())

const groupedCommands = computed<CommandGroup[]>(() => {
  const tokens = normalizedQuery.value.split(/\s+/).filter(Boolean)

  function matches(c: Command): boolean {
    if (tokens.length === 0) return true
    const haystack = (c.title + ' ' + c.keywords).toLowerCase()
    return tokens.every((t) => haystack.includes(t))
  }

  const filtered = commands.value.filter(matches)

  const sections = ['Preferences', 'View', 'Go to']
  const groups: CommandGroup[] = []
  for (const section of sections) {
    const items = filtered.filter((c) => c.section === section)
    if (items.length > 0) groups.push({ label: section, items })
  }
  return groups
})

// Keeps the first result highlighted whenever the filtered set changes, so
// Enter runs the top match immediately without requiring an explicit
// arrow-down first, matching real command palettes' default behavior.
function syncActiveToFirst() {
  const flat = getFlatResults()
  const stillValid = flat.some((f) => f.group === activeGroup.value && f.index === activeIndex.value)
  if (!stillValid) {
    if (flat.length > 0) setActive(flat[0].group, flat[0].index)
    else {
      activeGroup.value = ''
      activeIndex.value = -1
    }
  }
}

watch(groupedCommands, syncActiveToFirst, { immediate: true })

function getFlatResults(): { group: string; index: number }[] {
  const flat: { group: string; index: number }[] = []
  for (const group of groupedCommands.value) {
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

function run(cmd: Command) {
  emit('close')
  cmd.run()
}

function onKeydown(e: KeyboardEvent) {
  const flat = getFlatResults()

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (flat.length === 0) return
    const currentIdx = flat.findIndex((f) => f.group === activeGroup.value && f.index === activeIndex.value)
    const next = currentIdx + 1 >= flat.length ? 0 : currentIdx + 1
    setActive(flat[next].group, flat[next].index)
    nextTick(scrollToActive)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (flat.length === 0) return
    const currentIdx = flat.findIndex((f) => f.group === activeGroup.value && f.index === activeIndex.value)
    const prev = currentIdx <= 0 ? flat.length - 1 : currentIdx - 1
    setActive(flat[prev].group, flat[prev].index)
    nextTick(scrollToActive)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (flat.length === 0) return
    const currentIdx = flat.findIndex((f) => f.group === activeGroup.value && f.index === activeIndex.value)
    if (currentIdx >= 0) {
      const item = flat[currentIdx]
      const group = groupedCommands.value.find((g) => g.label === item.group)
      if (group) run(group.items[item.index])
    }
  }
}

onMounted(() => {
  syncActiveToFirst()
  nextTick(() => {
    inputEl.value?.focus()
  })
})
</script>

<style scoped>
.cmdk-palette {
  width: 560px;
  max-width: 92vw;
  max-height: 64vh;
  display: flex;
  flex-direction: column;
  background: var(--color-vscode-overlay-bg);
  border: 1px solid var(--color-vscode-overlay-border);
  border-radius: 8px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.cmdk-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--color-vscode-overlay-border);
}

.cmdk-prompt {
  flex-shrink: 0;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-accent);
}

.cmdk-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 13px;
  color: var(--color-vscode-overlay-fg);
  caret-color: var(--color-accent);
}

.cmdk-input::placeholder {
  color: var(--color-vscode-overlay-fg-muted);
}

.cmdk-results {
  flex: 1;
  overflow-y: auto;
  padding: 6px 0;
  max-height: 400px;
}

.cmdk-group-label {
  padding: 6px 14px 2px;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-vscode-overlay-fg-muted);
  user-select: none;
}

.cmdk-item {
  display: block;
  width: 100%;
  padding: 6px 14px;
  text-align: left;
  cursor: pointer;
  transition: background 0.08s;
  border: none;
  background: transparent;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 12.5px;
  color: var(--color-vscode-overlay-fg);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cmdk-item:hover,
.item-active {
  background: var(--color-vscode-overlay-hover);
}

.cmdk-empty {
  padding: 24px 14px;
  text-align: center;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 12px;
  color: var(--color-vscode-overlay-fg-muted);
}

.cmdk-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 6px 14px;
  border-top: 1px solid var(--color-vscode-overlay-border);
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 10px;
  color: var(--color-vscode-overlay-fg-muted);
}

.cmdk-footer kbd {
  display: inline-block;
  padding: 1px 5px;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 10px;
  background: var(--color-vscode-overlay-hover);
  border: 1px solid var(--color-vscode-overlay-border);
  border-radius: 3px;
}

.cmdk-results::-webkit-scrollbar {
  width: 4px;
}

.cmdk-results::-webkit-scrollbar-thumb {
  background: var(--color-vscode-overlay-border);
  border-radius: 2px;
}
</style>
