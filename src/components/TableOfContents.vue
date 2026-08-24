<template>
  <div>
    <!-- Desktop: borderless panel that blends into the article surface -->
    <aside
      class="hidden lg:flex flex-col sticky top-0 max-h-screen flex-shrink-0 bg-white dark:bg-gray-900 border-l border-neutral-200 dark:border-gray-800"
      style="width: 240px;"
      aria-label="Table of Contents"
    >
      <nav v-if="visibleHeadings.length" class="flex flex-col flex-1 overflow-hidden min-h-0">
        <!-- Panel header -->
        <div class="flex items-center px-4 h-9 flex-shrink-0 border-b border-neutral-100 dark:border-gray-800">
          <span class="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 dark:text-white/40 select-none">
            Outline
          </span>
        </div>

        <!-- Scrollable symbol outline -->
        <ul
          class="flex-1 overflow-y-auto py-2 toc-scrollbar"
          role="list"
        >
          <li v-for="group in headingGroups" :key="group.parent.id">
            <a
              :href="'#' + group.parent.id"
              class="flex items-center gap-1.5 w-full text-left pl-2 pr-3 py-[5px] text-[12px] font-mono leading-tight truncate transition-colors duration-100 border-l-2"
              :class="group.parent.id === activeId
                ? 'bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white border-[#F5A100]'
                : 'text-neutral-600 dark:text-white/50 hover:text-neutral-900 dark:hover:text-white/80 hover:bg-neutral-50 dark:hover:bg-white/[0.04] border-transparent'"
              @click.prevent="scrollToHeading(group.parent)"
            >
              <svg
                width="8" height="8" viewBox="0 0 10 10" fill="none"
                class="flex-shrink-0"
                :class="group.hasChildren ? 'text-neutral-400 dark:text-white/30' : 'text-transparent'"
              >
                <path d="M2.5 3.5l2.5 3 2.5-3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg width="11" height="11" viewBox="0 0 12 12" class="flex-shrink-0" aria-hidden="true">
                <polygon points="6,1 10.5,3.5 10.5,8.5 6,11 1.5,8.5 1.5,3.5" fill="#EE9D28" fill-opacity="0.85"/>
              </svg>
              <span class="truncate">{{ group.parent.text }}</span>
            </a>

            <ul v-if="group.children.length" class="relative" role="list">
              <span class="absolute left-[12px] top-0 bottom-0 w-px bg-neutral-200 dark:bg-white/10" aria-hidden="true" />
              <li v-for="child in group.children" :key="child.id">
                <a
                  :href="'#' + child.id"
                  class="flex items-center gap-1.5 w-full text-left pl-8 pr-3 py-[5px] text-[12px] font-mono leading-tight truncate transition-colors duration-100 border-l-2"
                  :class="child.id === activeId
                    ? 'bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white border-[#F5A100]'
                    : 'text-neutral-600 dark:text-white/50 hover:text-neutral-900 dark:hover:text-white/80 hover:bg-neutral-50 dark:hover:bg-white/[0.04] border-transparent'"
                  @click.prevent="scrollToHeading(child)"
                >
                  <svg width="8" height="8" viewBox="0 0 12 12" class="flex-shrink-0" aria-hidden="true">
                    <polygon points="6,1 11,6 6,11 1,6" fill="#B180D7" fill-opacity="0.85"/>
                  </svg>
                  <span class="truncate">{{ child.text }}</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Mobile: fixed bottom-right button + sheet -->
    <div class="lg:hidden">
      <button
        v-if="visibleHeadings.length"
        @click="mobileOpen = !mobileOpen"
        class="fixed right-3 bottom-6 z-40 flex items-center gap-1.5 px-3 py-2 rounded-full shadow-lg border transition-colors"
        :class="mobileOpen
          ? 'border-[#F5A100] text-[#002D6B]'
          : 'bg-white dark:bg-gray-800 border-neutral-200 dark:border-gray-600 text-neutral-600 dark:text-gray-300'"
        :style="mobileOpen ? { background: '#F5A100' } : {}"
        :aria-expanded="mobileOpen"
        :aria-label="mobileOpen ? 'Close outline' : 'Open outline'"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        <span class="text-[11px] font-mono uppercase">Outline</span>
      </button>

      <Transition name="toc-sheet">
        <div
          v-if="mobileOpen && visibleHeadings.length"
          class="fixed inset-0 z-30 flex items-end lg:hidden"
          @click.self="mobileOpen = false"
        >
          <div class="absolute inset-0 bg-black/30" />
          <nav
            class="relative w-full max-h-[65vh] flex flex-col overflow-hidden rounded-t-xl shadow-xl bg-white dark:bg-gray-900"
          >
            <!-- Sheet header -->
            <div class="flex items-center justify-between px-5 h-10 flex-shrink-0 border-b border-neutral-100 dark:border-gray-800">
              <span class="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 dark:text-white/40 select-none">
                Outline
              </span>
              <button
                @click="mobileOpen = false"
                class="text-neutral-400 dark:text-white/35 hover:text-neutral-700 dark:hover:text-white/70 transition-colors"
                aria-label="Close outline"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <!-- Scrollable symbol outline -->
            <ul
              class="flex-1 overflow-y-auto py-2 toc-scrollbar"
              role="list"
            >
              <li v-for="group in headingGroups" :key="group.parent.id">
                <a
                  :href="'#' + group.parent.id"
                  class="flex items-center gap-2 w-full text-left pl-3 pr-4 py-[6px] text-[13px] font-mono leading-tight transition-colors duration-100 border-l-2"
                  :class="group.parent.id === activeId
                    ? 'bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white border-[#F5A100]'
                    : 'text-neutral-600 dark:text-white/50 hover:text-neutral-900 dark:hover:text-white/80 hover:bg-neutral-50 dark:hover:bg-white/[0.04] border-transparent'"
                  @click.prevent="scrollToHeading(group.parent); mobileOpen = false"
                >
                  <svg
                    width="9" height="9" viewBox="0 0 10 10" fill="none"
                    class="flex-shrink-0"
                    :class="group.hasChildren ? 'text-neutral-400 dark:text-white/30' : 'text-transparent'"
                  >
                    <path d="M2.5 3.5l2.5 3 2.5-3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg width="12" height="12" viewBox="0 0 12 12" class="flex-shrink-0" aria-hidden="true">
                    <polygon points="6,1 10.5,3.5 10.5,8.5 6,11 1.5,8.5 1.5,3.5" fill="#EE9D28" fill-opacity="0.85"/>
                  </svg>
                  <span class="truncate">{{ group.parent.text }}</span>
                </a>

                <ul v-if="group.children.length" class="relative" role="list">
                  <span class="absolute left-[16px] top-0 bottom-0 w-px bg-neutral-200 dark:bg-white/10" aria-hidden="true" />
                  <li v-for="child in group.children" :key="child.id">
                    <a
                      :href="'#' + child.id"
                      class="flex items-center gap-2 w-full text-left pl-10 pr-4 py-[6px] text-[13px] font-mono leading-tight transition-colors duration-100 border-l-2"
                      :class="child.id === activeId
                        ? 'bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white border-[#F5A100]'
                        : 'text-neutral-600 dark:text-white/50 hover:text-neutral-900 dark:hover:text-white/80 hover:bg-neutral-50 dark:hover:bg-white/[0.04] border-transparent'"
                      @click.prevent="scrollToHeading(child); mobileOpen = false"
                    >
                      <svg width="9" height="9" viewBox="0 0 12 12" class="flex-shrink-0" aria-hidden="true">
                        <polygon points="6,1 11,6 6,11 1,6" fill="#B180D7" fill-opacity="0.85"/>
                      </svg>
                      <span class="truncate">{{ child.text }}</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useI18n } from '../composables/useI18n'

const { lang } = useI18n()

interface Heading {
  id: string
  text: string
  level: number
  el: HTMLElement
}

interface HeadingGroup {
  parent: Heading
  hasChildren: boolean
  children: Heading[]
}

const visibleHeadings = ref<Heading[]>([])
const activeId = ref('')
const mobileOpen = ref(false)

// Display-only grouping of the flat heading list into a VSCode-outline-style
// tree (H2 = top-level "class" symbol, H3 = nested "method" symbol). Purely
// a rendering concern: extraction, observing, and scrolling all continue to
// operate on the flat `visibleHeadings` list untouched.
const headingGroups = computed<HeadingGroup[]>(() => {
  const groups: HeadingGroup[] = []
  let current: HeadingGroup | null = null
  for (const h of visibleHeadings.value) {
    if (h.level !== 3 || !current) {
      current = { parent: h, hasChildren: false, children: [] }
      groups.push(current)
    } else {
      current.hasChildren = true
      current.children.push(h)
    }
  }
  return groups
})

let observer: IntersectionObserver | null = null
let langObserver: MutationObserver | null = null

function getVisibleHeadingLang(el: HTMLElement): string | null {
  let current: HTMLElement | null = el
  while (current) {
    const langAttr = current.getAttribute('lang')
    if (langAttr === 'en' || langAttr === 'id') return langAttr
    current = current.parentElement
  }
  return null
}

function collectHeadings(): Heading[] {
  const container = document.querySelector('.bilingual-post') || document.body
  const headingEls = container.querySelectorAll('h2, h3')

  const headings: Heading[] = []
  headingEls.forEach((el) => {
    const id = el.getAttribute('id')
    if (!id) return
    headings.push({
      id,
      text: el.textContent?.trim() || '',
      level: el.tagName === 'H3' ? 3 : 2,
      el: el as HTMLElement,
    })
  })
  return headings
}

function filterVisibleHeadings(): Heading[] {
  const all = collectHeadings()
  const currentLang = lang.value

  return all.filter((h) => {
    const hLang = getVisibleHeadingLang(h.el)
    if (!hLang) return true
    return hLang === currentLang
  })
}

function getOffsetFromEditor(el: HTMLElement): number {
  const editor = document.getElementById('editor')
  if (!editor) return 0
  const editorRect = editor.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  return elRect.top - editorRect.top + editor.scrollTop
}

function setupObserver() {
  const editor = document.getElementById('editor')
  if (!editor) return

  if (observer) observer.disconnect()

  const headings = visibleHeadings.value
  if (!headings.length) return

  observer = new IntersectionObserver(
    (entries) => {
      let closest: string | null = null
      let closestTop = Infinity
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const top = entry.boundingClientRect.top
          if (top < closestTop) {
            closestTop = top
            closest = entry.target.id
          }
        }
      }
      if (closest) activeId.value = closest
    },
    {
      root: editor,
      rootMargin: '-80px 0px -70% 0px',
      threshold: 0,
    }
  )

  headings.forEach((h) => observer!.observe(h.el))
}

function scrollUpdateActive() {
  const editor = document.getElementById('editor')
  if (!editor || !visibleHeadings.value.length) return

  const scrollTop = editor.scrollTop

  for (let i = visibleHeadings.value.length - 1; i >= 0; i--) {
    const offset = getOffsetFromEditor(visibleHeadings.value[i].el)
    if (offset - 100 <= scrollTop) {
      activeId.value = visibleHeadings.value[i].id
      return
    }
  }
  activeId.value = visibleHeadings.value[0]?.id || ''
}

function updateHeadings() {
  visibleHeadings.value = filterVisibleHeadings()
  setupObserver()
  scrollUpdateActive()
}

function scrollToHeading(heading: Heading) {
  const editor = document.getElementById('editor')
  if (!editor) return

  const offset = getOffsetFromEditor(heading.el)
  editor.scrollTo({ top: offset - 60, behavior: 'smooth' })

  activeId.value = heading.id

  try {
    const url = new URL(window.location.href)
    url.hash = heading.id
    window.history.replaceState(null, '', url.toString())
  } catch {}
}

let scrollTimer: ReturnType<typeof setTimeout> | null = null
function onEditorScroll() {
  if (scrollTimer) return
  scrollTimer = setTimeout(() => {
    scrollTimer = null
    scrollUpdateActive()
  }, 50)
}

onMounted(async () => {
  await nextTick()
  updateHeadings()

  const editor = document.getElementById('editor')
  if (editor) {
    editor.addEventListener('scroll', onEditorScroll, { passive: true })
  }

  langObserver = new MutationObserver(() => {
    updateHeadings()
  })
  langObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang'],
  })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  if (langObserver) langObserver.disconnect()
  const editor = document.getElementById('editor')
  if (editor && scrollTimer) {
    editor.removeEventListener('scroll', onEditorScroll)
  }
})

watch(lang, () => {
  updateHeadings()
})
</script>

<style scoped>
.toc-sheet-enter-active,
.toc-sheet-leave-active {
  transition: opacity 0.2s ease;
}
.toc-sheet-enter-active nav,
.toc-sheet-leave-active nav {
  transition: transform 0.25s ease;
}
.toc-sheet-enter-from,
.toc-sheet-leave-to {
  opacity: 0;
}
.toc-sheet-enter-from nav {
  transform: translateY(100%);
}
.toc-sheet-leave-to nav {
  transform: translateY(100%);
}

.toc-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.toc-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 2px;
}
:global(.dark) .toc-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
}
.toc-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
</style>
