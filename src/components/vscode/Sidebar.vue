<template>
  <!-- Mobile backdrop -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="lg:hidden fixed inset-0 z-40 bg-black/60"
        @click="toggleSidebar"
        aria-hidden="true"
      />
    </Transition>
  </Teleport>

  <!-- Sidebar panel: fixed on mobile, in-flow on desktop -->
  <aside
    class="flex-shrink-0 flex flex-col overflow-hidden transition-[width,transform] duration-200 fixed inset-y-0 left-0 z-50 lg:relative lg:inset-auto lg:z-auto w-64"
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
        Explorer
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

    <!-- Folder heading -->
    <div class="flex items-center gap-1.5 px-3 py-1.5 select-none">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" class="text-white/30 flex-shrink-0">
        <path d="M2 3l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="text-[11px] font-mono uppercase tracking-wider text-white/40">SE-LAB</span>
    </div>

    <!-- File tree -->
    <nav class="flex-1 overflow-y-auto pb-4" aria-label="Site navigation">
      <template v-for="item in fileTree" :key="item.id">
        <!-- Folder row (non-interactive) -->
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

        <!-- File row (interactive) -->
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
  </aside>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useVSCodeLayout } from '../../composables/useVSCodeLayout'

const { sidebarOpen, activeSection, currentPage, toggleSidebar, initObserver, scrollTo } = useVSCodeLayout()

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
  { id: 'index',           name: 'index.html',       ext: 'html', type: 'file',   sectionId: 'hero',          pageId: 'home',          indent: 1, href: '/' },
  { id: 'src',             name: 'src/',              ext: '',     type: 'folder', sectionId: '',              pageId: '',              indent: 1, href: '' },
  { id: 'about',           name: 'about.md',          ext: 'md',   type: 'file',   sectionId: 'about',         pageId: 'home',          indent: 2, href: '/#about' },
  { id: 'research',        name: 'research.json',     ext: 'json', type: 'file',   sectionId: 'research',      pageId: 'home',          indent: 2, href: '/#research' },
  { id: 'researchers-dir', name: 'researchers/',      ext: '',     type: 'folder', sectionId: '',              pageId: '',              indent: 2, href: '' },
  { id: 'team',            name: 'team.md',           ext: 'md',   type: 'file',   sectionId: 'team',          pageId: 'researchers',   indent: 3, href: '/researchers' },
  { id: 'pubs',            name: 'publications.bib',  ext: 'bib',  type: 'file',   sectionId: 'publications',  pageId: 'publications',  indent: 2, href: '/publications' },
  { id: 'news',            name: 'news.md',           ext: 'md',   type: 'file',   sectionId: 'news',          pageId: 'news',          indent: 2, href: '/blog' },
  { id: 'contact',         name: 'contact.json',      ext: 'json', type: 'file',   sectionId: 'contact',       pageId: 'home',          indent: 1, href: '/#contact' },
]

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
  }
  return map[ext] ?? 'bg-white/30'
}

function navigate(item: FileItem) {
  if (currentPage.value === 'home' && item.sectionId) {
    scrollTo(item.sectionId)
    if (window.innerWidth < 1024) toggleSidebar()
    return
  }
  if (item.href) window.location.href = item.href
}

onMounted(() => {
  const editor = document.getElementById('editor')
  if (editor) initObserver(editor)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
