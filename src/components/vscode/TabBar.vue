<template>
  <!-- Tab strip / Inner page header — fixed-height outer prevents layout collapse during transition -->
  <div
    class="flex flex-shrink-0 overflow-hidden"
    style="height: 35px; background: #1E2D4E;"
  >
    <Transition name="tabmode" mode="out-in">
      <!-- Home: file tabs -->
      <div
        v-if="currentPage === 'home'"
        key="home"
        class="flex w-full items-end overflow-x-auto"
        role="tablist"
        aria-label="Open files"
      >
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="handleTab(tab)"
          role="tab"
          :aria-selected="isActiveTab(tab)"
          class="flex items-center gap-2 px-4 py-2 text-[12px] font-mono flex-shrink-0 border-t-2 transition-colors duration-150 whitespace-nowrap h-full"
          :class="isActiveTab(tab)
            ? 'bg-white text-primary border-t-[#F5A100]'
            : 'bg-transparent text-white/40 hover:text-white/70 hover:bg-white/5 border-transparent'"
        >
          <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="dotColor(tab.ext)" />
          {{ tab.label }}
          <span class="text-[10px] opacity-40 ml-0.5" aria-hidden="true">×</span>
        </button>
      </div>

      <!-- Inner pages: icon + label + optional back -->
      <div
        v-else
        key="inner"
        class="flex w-full items-center px-4 gap-3"
      >
        <template v-if="isDetailPage">
          <a
            :href="backHref"
            class="flex items-center gap-1 text-[11px] font-mono text-white/50 hover:text-white/85 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </a>
          <span class="w-px h-3.5 bg-white/15" />
        </template>

        <div class="flex items-center gap-2">
          <svg v-if="currentPage === 'researchers'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color: #F5A100; flex-shrink: 0;">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87"/>
            <path d="M16 3.13a4 4 0 010 7.75"/>
          </svg>
          <svg v-else-if="currentPage === 'publications'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color: #F5A100; flex-shrink: 0;">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color: #F5A100; flex-shrink: 0;">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span class="text-[11px] font-mono text-white/65 tracking-wider uppercase">{{ innerPageLabel }}</span>
        </div>
      </div>
    </Transition>
  </div>

  <!-- Breadcrumb bar -->
  <div
    class="flex items-center justify-between px-4 flex-shrink-0 select-none"
    style="height: 26px; background: #162032; border-bottom: 1px solid rgba(255,255,255,0.05);"
  >
    <Transition name="breadcrumb" mode="out-in">
      <div :key="currentBreadcrumb.path.join('/')" class="flex items-center gap-0.5 text-[11px] font-mono">
        <span
          v-for="(part, i) in currentBreadcrumb.path"
          :key="i"
          class="flex items-center gap-0.5"
        >
          <span v-if="i > 0" class="text-white/35 mx-1">›</span>
          <span :class="i === currentBreadcrumb.path.length - 1 ? 'text-white/80' : 'text-white/45'">
            {{ part }}
          </span>
        </span>
      </div>
    </Transition>
    <div class="flex items-center gap-4 text-[11px] font-mono text-white/45">
      <span>Ln 1, Col 1</span>
      <span>{{ currentBreadcrumb.lang }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useVSCodeLayout } from '../../composables/useVSCodeLayout'

const { activeSection, currentPage, initObserver, scrollTo } = useVSCodeLayout()

const isDetailPage = ref(false)
const backHref = ref('')

const tabs = [
  { id: 'hero',         label: 'index.html',      ext: 'html', pageId: 'home',         href: '/' },
  { id: 'about',        label: 'about.md',         ext: 'md',   pageId: 'home',         href: '/#about' },
  { id: 'research',     label: 'research.json',    ext: 'json', pageId: 'home',         href: '/#research' },
  { id: 'projects',     label: 'projects.json',    ext: 'json', pageId: 'projects',     href: '/projects' },
  { id: 'books',        label: 'books.md',         ext: 'md',   pageId: 'books',        href: '/books' },
  { id: 'team',         label: 'team.md',          ext: 'md',   pageId: 'researchers',  href: '/researchers' },
  { id: 'publications', label: 'publications.bib', ext: 'bib',  pageId: 'publications', href: '/publications' },
  { id: 'news',         label: 'news.md',          ext: 'md',   pageId: 'news',         href: '/blog' },
]

const breadcrumbMap: Record<string, { path: string[]; lang: string }> = {
  hero:         { path: ['se-lab', 'index.html'],                    lang: 'HTML'     },
  about:        { path: ['se-lab', 'src', 'about.md'],               lang: 'Markdown' },
  research:     { path: ['se-lab', 'src', 'research.json'],          lang: 'JSON'     },
  projects:     { path: ['se-lab', 'src', 'projects.json'],          lang: 'JSON'     },
  books:        { path: ['se-lab', 'src', 'books.md'],               lang: 'Markdown' },
  team:         { path: ['se-lab', 'src', 'researchers', 'team.md'], lang: 'Markdown' },
  publications: { path: ['se-lab', 'src', 'publications.bib'],       lang: 'BibTeX'   },
  news:         { path: ['se-lab', 'src', 'news.md'],                lang: 'Markdown' },
}

const pageBreadcrumbMap: Record<string, { path: string[]; lang: string }> = {
  news:         { path: ['se-lab', 'src', 'news.md'],                lang: 'Markdown' },
  publications: { path: ['se-lab', 'src', 'publications.bib'],       lang: 'BibTeX'   },
  researchers:  { path: ['se-lab', 'src', 'researchers', 'team.md'], lang: 'Markdown' },
  projects:     { path: ['se-lab', 'src', 'projects.json'],          lang: 'JSON'     },
  books:        { path: ['se-lab', 'src', 'books.md'],               lang: 'Markdown' },
}

const innerPageLabel = computed(() => {
  if (currentPage.value === 'researchers') return 'Researchers'
  if (currentPage.value === 'publications') return 'Publications'
  if (currentPage.value === 'news') return 'News'
  if (currentPage.value === 'projects') return 'Projects'
  if (currentPage.value === 'books') return 'Books'
  return ''
})

const currentBreadcrumb = computed(() => {
  if (currentPage.value !== 'home') {
    return pageBreadcrumbMap[currentPage.value] ?? breadcrumbMap.hero
  }
  return breadcrumbMap[activeSection.value] ?? breadcrumbMap.hero
})

function isActiveTab(tab: typeof tabs[0]): boolean {
  if (currentPage.value === 'home') return activeSection.value === tab.id
  return currentPage.value === tab.pageId
}

function handleTab(tab: typeof tabs[0]) {
  if (currentPage.value === 'home') {
    scrollTo(tab.id)
  } else {
    window.location.href = tab.href
  }
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

onMounted(() => {
  const editor = document.getElementById('editor')
  if (editor) initObserver(editor)

  const parts = window.location.pathname.split('/').filter(Boolean)
  isDetailPage.value = parts.length > 1
  backHref.value = '/' + (parts[0] ?? '')
})
</script>

<style scoped>
.tabmode-enter-active,
.tabmode-leave-active {
  transition: opacity 0.12s ease;
}
.tabmode-enter-from,
.tabmode-leave-to {
  opacity: 0;
}

.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: opacity 0.1s ease;
}
.breadcrumb-enter-from,
.breadcrumb-leave-to {
  opacity: 0;
}
</style>
