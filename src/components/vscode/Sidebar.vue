<template>
  <!-- Backdrop: mobile-only, dims the content behind the sidebar when it's
       acting as an overlay drawer; tapping it closes the drawer. Sits
       below the sidebar (z-40) and the Activity Bar (z-30, stays usable)
       but above the editor content (z-0/20). -->
  <div
    v-if="isMobile && sidebarOpen"
    class="fixed inset-0 z-20 bg-black/50"
    aria-hidden="true"
    @click="closeMobileSidebar"
  />

  <!-- Sidebar panel: in-flow split panel on desktop; an overlay drawer
       (fixed, floating over the content column) on mobile -->
  <aside
    class="flex-shrink-0 flex flex-col overflow-hidden"
    :class="[
      sidebarOpen ? 'w-64' : layoutInitialized ? 'w-0' : 'w-0 lg:w-64',
      isResizing ? '' : 'transition-[width] duration-200',
      isMobile && layoutInitialized
        ? 'fixed top-7 bottom-6 left-12 z-40 shadow-2xl max-w-[85vw]'
        : 'relative z-20',
    ]"
    :style="sidebarOpen && layoutInitialized ? { width: sidebarWidth + 'px' } : {}"
    style="background: var(--color-vscode-sidebar);"
    aria-label="Explorer Sidebar"
  >
    <!-- Header -->
    <div
      class="flex items-center px-4 h-9 flex-shrink-0"
      style="border-bottom: 1px solid var(--color-vscode-chrome-border);"
    >
      <span class="text-[10px] font-mono uppercase tracking-[0.2em] text-[color:var(--color-vscode-chrome-fg-muted)] select-none">
        {{ activeSidebarView === 'github' ? 'Source Control'
          : activeSidebarView === 'researchers' ? 'Researchers'
          : activeSidebarView === 'publications' ? 'Publications'
          : activeSidebarView === 'decks' ? 'Decks'
          : activeSidebarView === 'blog' ? 'Blog'
          : activeSidebarView === 'events' ? 'Events'
          : activeSidebarView === 'achievements' ? 'Achievements'
          : activeSidebarView === 'members' ? 'Members'
          : 'Explorer' }}
      </span>
    </div>

    <!-- Panel area: transitions between views -->
    <Transition name="panel" mode="out-in">

    <!-- GitHub / Source Control panel -->
    <nav v-if="activeSidebarView === 'github'" key="github" class="flex-1 overflow-y-auto p-4 space-y-5">
      <div class="space-y-1">
        <div class="text-[12px] font-mono text-[color:var(--color-vscode-chrome-fg)] font-medium">se-polinema</div>
        <div class="text-[11px] font-mono text-[color:var(--color-vscode-chrome-fg-muted)] leading-relaxed">
          Software Engineering Laboratory, Politeknik Negeri Malang
        </div>
      </div>
      <div class="space-y-1">
        <a
          href="https://github.com/se-polinema"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-2 text-[11px] font-mono text-[color:var(--color-vscode-chrome-fg-muted)] hover:text-[color:var(--color-vscode-chrome-fg)] transition-colors py-1"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          View on GitHub
        </a>
        <a
          href="https://github.com/se-polinema/se-polinema.github.io"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-2 text-[11px] font-mono text-[color:var(--color-vscode-chrome-fg-muted)] hover:text-[color:var(--color-vscode-chrome-fg)] transition-colors py-1"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          Star this repo
        </a>
        <a
          href="https://github.com/se-polinema/se-polinema.github.io/releases"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-2 text-[11px] font-mono text-[color:var(--color-vscode-chrome-fg-muted)] hover:text-[color:var(--color-vscode-chrome-fg)] transition-colors py-1"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 8 12 12 14 14"/>
          </svg>
          Releases
        </a>
      </div>
    </nav>

    <!-- Explorer panel (home) -->
    <div v-else-if="activeSidebarView === 'explorer'" key="explorer" class="flex flex-col flex-1 overflow-hidden min-h-0">
      <!-- Folder heading -->
      <div class="flex items-center gap-1.5 px-3 py-1.5 select-none flex-shrink-0">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" class="text-[color:var(--color-vscode-chrome-fg-muted)] flex-shrink-0">
          <path d="M2 3l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="text-[11px] font-mono uppercase tracking-wider text-[color:var(--color-vscode-chrome-fg-muted)]">SE-LAB</span>
      </div>

      <!-- File tree -->
      <nav class="flex-1 overflow-y-auto pb-4" aria-label="Site navigation">
        <template v-for="item in fileTree" :key="item.id">
          <!-- Folder -->
          <div
            v-if="item.type === 'folder'"
            class="flex items-center gap-2 py-[3px] text-[color:var(--color-vscode-chrome-fg-muted)] select-none"
            :style="{ paddingLeft: `${item.indent * 12 + 8}px` }"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" class="flex-shrink-0">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
            </svg>
            <span class="text-[12px] font-mono truncate">{{ item.name }}</span>
          </div>

          <!-- File -->
          <button
            v-else
            @click="navigate(item)"
            class="w-full flex items-center gap-2 py-[3px] text-left transition-colors duration-100 text-[12px] font-mono"
            :style="{ paddingLeft: `${item.indent * 12 + 8}px` }"
            :class="isActive(item)
              ? 'text-[color:var(--color-vscode-chrome-fg)] bg-[color:var(--color-vscode-chrome-border)]'
              : 'text-[color:var(--color-vscode-chrome-fg-muted)] hover:text-[color:var(--color-vscode-chrome-fg)] hover:bg-[color:var(--color-vscode-chrome-border)]'"
            :aria-current="isActive(item) ? 'page' : undefined"
          >
            <span class="w-2 h-2 rounded-full flex-shrink-0" :class="dotColor(item.ext)" />
            <span class="truncate flex-1">{{ item.name }}</span>
            <span
              v-if="isActive(item)"
              class="w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0"
              style="background: var(--color-accent)"
            />
          </button>
        </template>
      </nav>
    </div>

    <!-- Researchers panel -->
    <nav v-else-if="activeSidebarView === 'researchers'" key="researchers" class="flex-1 overflow-y-auto pb-4" aria-label="Researchers">
      <a
        v-for="r in researcherList"
        :key="r.id"
        :href="`/researchers/${r.id}`"
        class="flex items-center gap-2 py-[5px] px-4 text-[12px] font-mono transition-colors duration-100"
        :class="currentPath.endsWith(r.id)
          ? 'bg-[color:var(--color-vscode-chrome-border)] text-[color:var(--color-vscode-chrome-fg)]'
          : 'text-[color:var(--color-vscode-chrome-fg-muted)] hover:text-[color:var(--color-vscode-chrome-fg)] hover:bg-[color:var(--color-vscode-chrome-border)]'"
      >
        <span class="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-blue-400" />
        <span class="truncate">{{ r.name }}</span>
      </a>
    </nav>

    <!-- Publications filter panel -->
    <nav v-else-if="activeSidebarView === 'publications'" key="publications" class="flex-1 overflow-y-auto pb-4 px-4 pt-3 space-y-5" aria-label="Publication filters">
      <div>
        <div class="filter-header">Year</div>
        <div class="flex flex-wrap gap-1 mt-2">
          <button
            v-for="year in pubYears"
            :key="year"
            @click="toggleFilter('year', year)"
            class="filter-chip"
            :class="activeFilters.year === year ? 'chip-active' : 'chip-inactive'"
          >
            {{ year }}
          </button>
        </div>
      </div>
      <div>
        <div class="filter-header">Type</div>
        <div class="flex flex-wrap gap-1 mt-2">
          <button
            v-for="type in pubTypes"
            :key="type"
            @click="toggleFilter('type', type)"
            class="filter-chip"
            :class="activeFilters.type === type ? 'chip-active' : 'chip-inactive'"
          >
            {{ type }}
          </button>
        </div>
      </div>
      <div v-if="pubStreams.length > 0">
        <div class="filter-header">{{ t.publications.filterStream }}</div>
        <div class="flex flex-wrap gap-1 mt-2">
          <button
            v-for="stream in pubStreams"
            :key="stream.id"
            @click="toggleFilter('stream', stream.id)"
            class="filter-chip"
            :class="activeFilters.stream === stream.id ? 'chip-active' : 'chip-inactive'"
          >
            {{ lang === 'id' ? stream.nameId : stream.nameEn }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Blog / News filter panel -->
    <nav v-else-if="activeSidebarView === 'blog'" key="blog" class="flex-1 overflow-y-auto pb-4 px-4 pt-3 space-y-5" aria-label="Blog filters">
      <div>
        <div class="filter-header">Category</div>
        <div class="flex flex-wrap gap-1 mt-2">
          <button
            v-for="cat in blogCategories"
            :key="cat"
            @click="toggleFilter('category', cat)"
            class="filter-chip"
            :class="activeFilters.category === cat ? 'chip-active' : 'chip-inactive'"
          >
            {{ cat }}
          </button>
        </div>
      </div>
      <div v-if="blogTags.length > 0">
        <div class="filter-header">{{ t.blog.tags }}</div>
        <div class="flex flex-wrap gap-1 mt-2">
          <button
            v-for="tag in blogTags"
            :key="tag"
            @click="toggleFilter('tag', tag)"
            class="filter-chip"
            :class="activeFilters.tag === tag ? 'chip-active' : 'chip-inactive'"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Events sidebar -->
    <nav v-else-if="activeSidebarView === 'events'" key="events" class="flex-1 overflow-y-auto pb-4 px-4 pt-3" aria-label="Events">
      <div class="filter-header">Events</div>
      <div class="mt-3 text-[11px] font-mono text-[color:var(--color-vscode-chrome-fg-muted)] space-y-2">
        <a href="/events" class="flex items-center gap-2 text-[color:var(--color-vscode-chrome-fg-muted)] hover:text-[color:var(--color-vscode-chrome-fg)] transition-colors py-1">
          <span class="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-purple-400" />
          Upcoming Events
        </a>
        <a href="/events" class="flex items-center gap-2 text-[color:var(--color-vscode-chrome-fg-muted)] hover:text-[color:var(--color-vscode-chrome-fg)] transition-colors py-1">
          <span class="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[color:var(--color-vscode-chrome-fg-muted)]" />
          Past Events
        </a>
      </div>
    </nav>

    <!-- Members sidebar -->
    <nav v-else-if="activeSidebarView === 'members'" key="members" class="flex-1 overflow-y-auto pb-4 px-4 pt-3" aria-label="Members">
      <div class="filter-header">Members</div>
      <div class="mt-3 text-[11px] font-mono text-[color:var(--color-vscode-chrome-fg-muted)] space-y-2">
        <a
          href="/members"
          class="flex items-center gap-2 py-1 transition-colors"
          :class="currentPage === 'members' ? 'text-[color:var(--color-vscode-chrome-fg)]' : 'text-[color:var(--color-vscode-chrome-fg-muted)] hover:text-[color:var(--color-vscode-chrome-fg)]'"
        >
          <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="currentPage === 'members' ? 'bg-accent' : 'bg-[color:var(--color-vscode-chrome-fg-muted)]'" />
          Student Members
        </a>
        <a
          href="/alumni"
          class="flex items-center gap-2 py-1 transition-colors"
          :class="currentPage === 'alumni' ? 'text-[color:var(--color-vscode-chrome-fg)]' : 'text-[color:var(--color-vscode-chrome-fg-muted)] hover:text-[color:var(--color-vscode-chrome-fg)]'"
        >
          <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="currentPage === 'alumni' ? 'bg-accent' : 'bg-[color:var(--color-vscode-chrome-fg-muted)]'" />
          Alumni
        </a>
      </div>
    </nav>

    <!-- Decks panel -->
    <nav v-else-if="activeSidebarView === 'decks'" key="decks" class="flex-1 overflow-y-auto pb-4 px-4 pt-3 space-y-5" aria-label="Decks filters">
      <div>
        <div class="filter-header">Member</div>
        <div class="flex flex-wrap gap-1 mt-2">
          <a
            v-for="m in deckMembers"
            :key="m.id"
            :href="`/decks`"
            class="filter-chip chip-inactive"
          >{{ m.name }}</a>
        </div>
      </div>
      <div>
        <div class="filter-header">Type</div>
        <div class="flex flex-wrap gap-1 mt-2">
          <span
            v-for="t in deckTypes"
            :key="t"
            class="filter-chip chip-inactive"
          >{{ t }}</span>
        </div>
      </div>
    </nav>

    <!-- Achievements filter panel -->
    <nav v-else-if="activeSidebarView === 'achievements'" key="achievements" class="flex-1 overflow-y-auto pb-4 px-4 pt-3" aria-label="Achievement filters">
      <div class="filter-header">Type</div>
      <div class="flex flex-wrap gap-1 mt-2">
        <button
          v-for="type in achievementTypes"
          :key="type"
          @click="toggleAchievementFilter(type)"
          class="filter-chip"
          :class="activeAchievementType === type ? 'chip-active' : 'chip-inactive'"
        >
          {{ type }}
        </button>
      </div>
    </nav>

    </Transition>

    <!-- Resize handle: flush with the inner right edge. Desktop only:
         a fixed-max-width overlay drawer isn't a resizable surface on
         mobile the way the in-flow split panel is on desktop. -->
    <div
      v-if="sidebarOpen && !isMobile"
      class="sidebar-resize-handle"
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize sidebar"
      :aria-valuenow="sidebarWidth"
      aria-valuemin="180"
      aria-valuemax="480"
      tabindex="0"
      @pointerdown="onResizePointerDown"
      @keydown="onResizeKeydown"
    />
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useVSCodeLayout } from '../../composables/useVSCodeLayout'
import { useI18n } from '../../composables/useI18n'
import { useDragResize } from '../../composables/useDragResize'

const props = defineProps<{ initialPath?: string }>()

const {
  sidebarOpen, activeSection, currentPage, layoutInitialized,
  activeSidebarView, activeFilters, sidebarWidth, isMobile,
  initObserver, scrollTo, restoreRouteState,
  setSidebarWidth, persistSidebarWidth,
} = useVSCodeLayout(props.initialPath)

const { t, lang } = useI18n()

const {
  dragging: isResizing,
  onPointerDown: onResizePointerDown,
  onKeydown: onResizeKeydown,
} = useDragResize(() => sidebarWidth.value, {
  axis: 'x',
  min: 180,
  max: () => 480,
  onChange: setSidebarWidth,
  onCommit: persistSidebarWidth,
})

function closeMobileSidebar() {
  sidebarOpen.value = false
}

interface FileItem {
  id: string
  name: string
  ext: string
  type: 'file' | 'folder'
  sectionId: string
  pageId: string
  indent: number
  href: string
}

const fileTree: FileItem[] = [
  { id: 'index',           name: 'index.html',      ext: 'html', type: 'file',   sectionId: 'hero',         pageId: 'home',         indent: 1, href: '/' },
  { id: 'src',             name: 'src/',             ext: '',     type: 'folder', sectionId: '',             pageId: '',             indent: 1, href: '' },
  { id: 'about',           name: 'about.md',         ext: 'md',   type: 'file',   sectionId: 'about',        pageId: 'home',         indent: 2, href: '/#about' },
  { id: 'research',        name: 'research.json',    ext: 'json', type: 'file',   sectionId: 'research',     pageId: 'home',         indent: 2, href: '/#research' },
  { id: 'projects',        name: 'projects.json',    ext: 'json', type: 'file',   sectionId: 'projects',     pageId: 'projects',     indent: 2, href: '/projects' },
  { id: 'showcase',        name: 'showcase.json',    ext: 'json', type: 'file',   sectionId: '',             pageId: 'showcase',     indent: 2, href: '/showcase' },
  { id: 'books',           name: 'books.md',         ext: 'md',   type: 'file',   sectionId: 'books',        pageId: 'books',        indent: 2, href: '/books' },
  { id: 'researchers-dir', name: 'researchers/',     ext: '',     type: 'folder', sectionId: '',             pageId: '',             indent: 2, href: '' },
  { id: 'members',         name: 'members.md',       ext: 'md',   type: 'file',   sectionId: 'team',         pageId: 'researchers',  indent: 3, href: '/researchers' },
  { id: 'pubs',            name: 'publications.bib', ext: 'bib',  type: 'file',   sectionId: 'publications', pageId: 'publications', indent: 2, href: '/publications' },
  { id: 'events-dir',     name: 'events/',         ext: '',     type: 'folder', sectionId: '',             pageId: '',             indent: 2, href: '' },
  { id: 'upcoming',       name: 'upcoming.ics',     ext: 'ics',  type: 'file',   sectionId: 'events',       pageId: 'events',       indent: 3, href: '/events' },
  { id: 'achievements',   name: 'achievements.json', ext: 'json', type: 'file',   sectionId: 'achievements', pageId: 'achievements', indent: 2, href: '/achievements' },
  { id: 'impact',         name: 'impact.json',       ext: 'json', type: 'file',   sectionId: '',             pageId: 'impact',       indent: 2, href: '/impact' },
  { id: 'learning-paths', name: 'learning-paths.astro', ext: 'astro', type: 'file', sectionId: '',           pageId: 'learning-paths', indent: 2, href: '/learning-paths' },
  { id: 'tools',         name: 'tools.json',        ext: 'json',  type: 'file',   sectionId: '',             pageId: 'tools',          indent: 2, href: '/tools' },
  { id: 'blog',            name: 'blog.md',          ext: 'md',   type: 'file',   sectionId: 'blog',         pageId: 'blog',         indent: 2, href: '/blog' },
]

// Panel data (lazily fetched)
const researcherList = ref<{ id: string; name: string }[]>([])
const pubYears = ref<number[]>([])
const pubTypes = ref<string[]>([])
const pubStreams = ref<{ id: string; nameEn: string; nameId: string }[]>([])
const blogCategories = ref<string[]>([])
const blogTagsByLang = ref<{ en: string[]; id: string[] }>({ en: [], id: [] })
const blogTags = computed(() => blogTagsByLang.value[lang.value] ?? blogTagsByLang.value.en ?? [])
const deckMembers = ref<{ id: string; name: string }[]>([])
const deckTypes = ref<string[]>([])
const achievementTypes = ref(['Grant', 'Award', 'Certification', 'Milestone'])
const activeAchievementType = ref<string | null>(null)
const currentPath = ref('')

function isActive(item: FileItem): boolean {
  if (currentPage.value === 'home') {
    return !!item.sectionId && activeSection.value === item.sectionId
  }
  return !!item.pageId && currentPage.value === item.pageId
}

function dotColor(ext: string): string {
  const map: Record<string, string> = {
    html: 'bg-orange-400',
    md:   'bg-blue-400',
    json: 'bg-yellow-400',
    bib:  'bg-green-400',
    ics:  'bg-purple-400',
    astro: 'bg-orange-500',
  }
  return map[ext] ?? 'bg-[color:var(--color-vscode-chrome-fg-muted)]'
}

function navigate(item: FileItem) {
  if (currentPage.value === 'home' && item.sectionId) {
    scrollTo(item.sectionId)
    return
  }
  if (item.href) window.location.href = item.href
}

function toggleFilter(key: 'year' | 'type' | 'category' | 'tag' | 'stream', value: number | string) {
  if (activeFilters[key] === value) (activeFilters as Record<string, unknown>)[key] = null
  else (activeFilters as Record<string, unknown>)[key] = value
}

function toggleAchievementFilter(type: string) {
  if (activeAchievementType.value === type) activeAchievementType.value = null
  else activeAchievementType.value = type
}

onMounted(async () => {
  restoreRouteState()

  const editor = document.getElementById('editor')
  if (editor) initObserver(editor)

  currentPath.value = window.location.pathname

  if (currentPage.value === 'researchers') {
    researcherList.value = await fetch('/api/researchers.json').then(r => r.json())
  } else if (currentPage.value === 'publications') {
    const meta = await fetch('/api/publications-meta.json').then(r => r.json())
    pubYears.value = meta.years
    pubTypes.value = meta.types
    pubStreams.value = meta.streams ?? []
  } else if (currentPage.value === 'blog') {
    const meta = await fetch('/api/posts-meta.json').then(r => r.json())
    blogCategories.value = meta.categories
    blogTagsByLang.value = meta.tags || { en: [], id: [] }
  } else if (currentPage.value === 'decks') {
    const meta = await fetch('/api/decks-meta.json').then(r => r.json())
    deckMembers.value = meta.members
    deckTypes.value = meta.types
  }
})
</script>

<style scoped>
.panel-enter-active,
.panel-leave-active {
  transition: opacity 0.12s ease;
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
}

.sidebar-resize-handle {
  /* Flush with the inner edge (not overflowing outside it): the aside
     clips overflow, which would silently eat pointer events on any
     sliver positioned outside its own bounds. */
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  cursor: col-resize;
  z-index: 25;
  touch-action: none;
}
.sidebar-resize-handle:hover,
.sidebar-resize-handle:focus-visible {
  background: var(--color-accent);
  opacity: 0.5;
  outline: none;
}

.filter-header {
  font-size: 10px;
  font-family: monospace;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-vscode-chrome-fg-muted);
}

.filter-chip {
  font-size: 11px;
  font-family: monospace;
  padding: 2px 8px;
  border-radius: 3px;
  transition: background 0.1s, color 0.1s;
  cursor: pointer;
}

.chip-active {
  background: var(--color-accent);
  color: var(--color-accent-950);
  font-weight: 600;
}

.chip-inactive {
  background: var(--color-vscode-chrome-border);
  color: var(--color-vscode-chrome-fg-muted);
}

.chip-inactive:hover {
  background: var(--color-vscode-chrome-border);
  color: var(--color-vscode-chrome-fg);
}
</style>
