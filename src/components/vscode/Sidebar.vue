<template>
  <!-- Mobile backdrop (covers content area to the right of ActivityBar) -->
  <Transition name="fade">
    <div
      v-if="sidebarOpen"
      class="lg:hidden fixed inset-y-0 z-30 bg-black/60"
      style="left: 48px; right: 0;"
      @click="toggleSidebar"
      aria-hidden="true"
    />
  </Transition>

  <!-- Sidebar panel: slides in from left of content area on mobile, in-flow on desktop -->
  <aside
    class="flex-shrink-0 flex flex-col overflow-hidden transition-[width,transform] duration-200
           fixed top-0 bottom-0 left-[48px] z-40 w-64
           lg:relative lg:top-auto lg:bottom-auto lg:left-auto lg:z-auto"
    :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0'"
    style="background: #003A84;"
    aria-label="Explorer Sidebar"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between px-4 h-9 flex-shrink-0"
      style="border-bottom: 1px solid rgba(255,255,255,0.08);"
    >
      <span class="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 select-none">
        {{ activeSidebarView === 'github' ? 'Source Control'
         : activeSidebarView === 'researchers' ? 'Researchers'
         : activeSidebarView === 'publications' ? 'Publications'
         : activeSidebarView === 'blog' ? 'News'
         : 'Explorer' }}
      </span>
      <button
        @click="toggleSidebar"
        class="lg:hidden text-white/40 hover:text-white/80 transition-colors p-1"
        aria-label="Close sidebar"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Panel area: transitions between views -->
    <Transition name="panel" mode="out-in">

    <!-- GitHub / Source Control panel -->
    <nav v-if="activeSidebarView === 'github'" key="github" class="flex-1 overflow-y-auto p-4 space-y-5">
      <div class="space-y-1">
        <div class="text-[12px] font-mono text-white/80 font-medium">se-polinema</div>
        <div class="text-[11px] font-mono text-white/45 leading-relaxed">
          Software Engineering Laboratory — Politeknik Negeri Malang
        </div>
      </div>
      <div class="space-y-1">
        <a
          href="https://github.com/se-polinema"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-2 text-[11px] font-mono text-white/55 hover:text-white/85 transition-colors py-1"
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
          class="flex items-center gap-2 text-[11px] font-mono text-white/55 hover:text-white/85 transition-colors py-1"
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
          class="flex items-center gap-2 text-[11px] font-mono text-white/55 hover:text-white/85 transition-colors py-1"
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
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" class="text-white/30 flex-shrink-0">
          <path d="M2 3l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="text-[11px] font-mono uppercase tracking-wider text-white/40">SE-LAB</span>
      </div>

      <!-- File tree -->
      <nav class="flex-1 overflow-y-auto pb-4" aria-label="Site navigation">
        <template v-for="item in fileTree" :key="item.id">
          <!-- Folder -->
          <div
            v-if="item.type === 'folder'"
            class="flex items-center gap-2 py-[3px] text-white/30 select-none"
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
              ? 'bg-white/10 text-white'
              : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'"
            :aria-current="isActive(item) ? 'page' : undefined"
          >
            <span class="w-2 h-2 rounded-full flex-shrink-0" :class="dotColor(item.ext)" />
            <span class="truncate flex-1">{{ item.name }}</span>
            <span
              v-if="isActive(item)"
              class="w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0"
              style="background: #F5A100"
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
          ? 'bg-white/10 text-white'
          : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'"
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
    </nav>

    <!-- Blog / News filter panel -->
    <nav v-else-if="activeSidebarView === 'blog'" key="blog" class="flex-1 overflow-y-auto pb-4 px-4 pt-3" aria-label="Blog filters">
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
    </nav>

    </Transition>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVSCodeLayout } from '../../composables/useVSCodeLayout'

const {
  sidebarOpen, activeSection, currentPage,
  panelOpen, activePanelTab, activeSidebarView, activeFilters,
  toggleSidebar, openPanel, initObserver, scrollTo,
} = useVSCodeLayout()

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
  { id: 'researchers-dir', name: 'researchers/',     ext: '',     type: 'folder', sectionId: '',             pageId: '',             indent: 2, href: '' },
  { id: 'team',            name: 'team.md',          ext: 'md',   type: 'file',   sectionId: 'team',         pageId: 'researchers',  indent: 3, href: '/researchers' },
  { id: 'pubs',            name: 'publications.bib', ext: 'bib',  type: 'file',   sectionId: 'publications', pageId: 'publications', indent: 2, href: '/publications' },
  { id: 'news',            name: 'news.md',          ext: 'md',   type: 'file',   sectionId: 'news',         pageId: 'news',         indent: 2, href: '/blog' },
  { id: 'contact',         name: 'contact.json',     ext: 'json', type: 'file',   sectionId: '',             pageId: '',             indent: 1, href: '' },
]

// Panel data (lazily fetched)
const researcherList = ref<{ id: string; name: string }[]>([])
const pubYears = ref<number[]>([])
const pubTypes = ref<string[]>([])
const blogCategories = ref<string[]>([])
const currentPath = ref('')

function isActive(item: FileItem): boolean {
  if (item.id === 'contact') {
    return panelOpen.value && activePanelTab.value === 'contact'
  }
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
  }
  return map[ext] ?? 'bg-white/30'
}

function navigate(item: FileItem) {
  if (item.id === 'contact') {
    openPanel('contact')
    if (window.innerWidth < 1024) toggleSidebar()
    return
  }
  if (currentPage.value === 'home' && item.sectionId) {
    scrollTo(item.sectionId)
    if (window.innerWidth < 1024) toggleSidebar()
    return
  }
  if (item.href) window.location.href = item.href
}

function toggleFilter(key: 'year' | 'type' | 'category', value: number | string) {
  if (activeFilters[key] === value) (activeFilters as Record<string, unknown>)[key] = null
  else (activeFilters as Record<string, unknown>)[key] = value
}

onMounted(async () => {
  const editor = document.getElementById('editor')
  if (editor) initObserver(editor)

  currentPath.value = window.location.pathname

  if (currentPage.value === 'researchers') {
    researcherList.value = await fetch('/api/researchers.json').then(r => r.json())
  } else if (currentPage.value === 'publications') {
    const meta = await fetch('/api/publications-meta.json').then(r => r.json())
    pubYears.value = meta.years
    pubTypes.value = meta.types
  } else if (currentPage.value === 'news') {
    const meta = await fetch('/api/posts-meta.json').then(r => r.json())
    blogCategories.value = meta.categories
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.panel-enter-active,
.panel-leave-active {
  transition: opacity 0.12s ease;
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
}

.filter-header {
  font-size: 10px;
  font-family: monospace;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.30);
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
  background: #F5A100;
  color: #002D6B;
  font-weight: 600;
}

.chip-inactive {
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.55);
}

.chip-inactive:hover {
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.85);
}
</style>
