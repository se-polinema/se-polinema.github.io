<template>
  <div
    class="hidden lg:flex items-end flex-shrink-0 overflow-x-auto"
    style="background: #1E2D4E; min-height: 35px;"
    role="tablist"
    aria-label="Open files"
  >
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="handleTab(tab)"
      role="tab"
      :aria-selected="isActiveTab(tab)"
      class="flex items-center gap-2 px-4 py-2 text-[12px] font-mono flex-shrink-0 border-t-2 transition-colors duration-100"
      :class="isActiveTab(tab)
        ? 'bg-white text-primary border-t-[#F5A100]'
        : 'bg-transparent text-white/40 hover:text-white/70 hover:bg-white/5 border-transparent'"
    >
      <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="dotColor(tab.ext)" />
      {{ tab.label }}
      <span class="text-[10px] opacity-40 ml-0.5" aria-hidden="true">×</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useVSCodeLayout } from '../../composables/useVSCodeLayout'

const { activeSection, currentPage, initObserver, scrollTo } = useVSCodeLayout()

const tabs = [
  { id: 'hero',         label: 'index.html',      ext: 'html', pageId: 'home',          href: '/' },
  { id: 'about',        label: 'about.md',         ext: 'md',   pageId: 'home',          href: '/#about' },
  { id: 'research',     label: 'research.json',    ext: 'json', pageId: 'home',          href: '/#research' },
  { id: 'team',         label: 'team.md',          ext: 'md',   pageId: 'researchers',   href: '/researchers' },
  { id: 'publications', label: 'publications.bib', ext: 'bib',  pageId: 'publications',  href: '/publications' },
  { id: 'news',         label: 'news.md',          ext: 'md',   pageId: 'news',          href: '/blog' },
  { id: 'contact',      label: 'contact.json',     ext: 'json', pageId: 'home',          href: '/#contact' },
]

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
})
</script>
