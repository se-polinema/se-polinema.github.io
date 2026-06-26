import { ref, reactive } from 'vue'

type SidebarView = 'explorer' | 'blog' | 'github' | 'researchers' | 'publications' | 'decks'

const sidebarOpen = ref(false)
const activeSection = ref('hero')
const currentPage = ref('home')
const panelOpen = ref(false)
const activePanelTab = ref<'contact' | 'output' | 'problems'>('contact')
const activeSidebarView = ref<SidebarView>('explorer')
const layoutInitialized = ref(false)
const activeFilters = reactive<{
  category: string | null
  year: number | null
  type: string | null
}>({ category: null, year: null, type: null })

let initialized = false
let observerInit = false

export function useVSCodeLayout() {
  if (typeof window !== 'undefined' && !initialized) {
    initialized = true
    sidebarOpen.value = window.innerWidth >= 1024
    layoutInitialized.value = true

    const path = window.location.pathname
    if (path.startsWith('/blog')) {
      currentPage.value = 'news'
      activeSidebarView.value = 'blog'
    } else if (path.startsWith('/publications')) {
      currentPage.value = 'publications'
      activeSidebarView.value = 'publications'
    } else if (path.startsWith('/researchers')) {
      currentPage.value = 'researchers'
      activeSidebarView.value = 'researchers'
    } else if (path.startsWith('/projects')) {
      currentPage.value = 'projects'
      activeSidebarView.value = 'explorer'
    } else if (path.startsWith('/books')) {
      currentPage.value = 'books'
      activeSidebarView.value = 'explorer'
    } else if (path.startsWith('/decks')) {
      currentPage.value = 'decks'
      activeSidebarView.value = 'decks'
    } else {
      currentPage.value = 'home'
      activeSidebarView.value = 'explorer'
    }

    panelOpen.value = window.innerWidth >= 1024
    const savedPanelOpen = localStorage.getItem('se-lab-panel-open')
    if (savedPanelOpen !== null) panelOpen.value = savedPanelOpen === 'true'
    const savedPanelTab = localStorage.getItem('se-lab-panel-tab')
    if (savedPanelTab) activePanelTab.value = savedPanelTab as 'contact' | 'output' | 'problems'
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function togglePanel() {
    panelOpen.value = !panelOpen.value
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('se-lab-panel-open', String(panelOpen.value))
    }
  }

  function openPanel(tab: 'contact' | 'output' | 'problems') {
    activePanelTab.value = tab
    panelOpen.value = true
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('se-lab-panel-tab', tab)
      localStorage.setItem('se-lab-panel-open', 'true')
    }
  }

  // Map views that belong to a dedicated page so setView can navigate when needed
  const viewNav: Partial<Record<SidebarView, { href: string; page: string }>> = {
    blog:         { href: '/blog',         page: 'news'         },
    researchers:  { href: '/researchers',  page: 'researchers'  },
    publications: { href: '/publications', page: 'publications' },
    decks:        { href: '/decks',        page: 'decks'        },
  }

  // Clicking the active icon toggles the sidebar.
  // Clicking a different icon: navigate if on wrong page, otherwise switch view and open.
  function setView(view: SidebarView) {
    if (activeSidebarView.value === view) {
      sidebarOpen.value = !sidebarOpen.value
      return
    }
    const nav = viewNav[view]
    if (nav && currentPage.value !== nav.page) {
      window.location.href = nav.href
      return
    }
    activeSidebarView.value = view
    sidebarOpen.value = true
  }

  function initObserver(root: HTMLElement) {
    if (observerInit) return
    observerInit = true

    function updateActive() {
      const sections = Array.from(root.querySelectorAll('section[id]')) as HTMLElement[]
      if (!sections.length) return
      const scrollTop = root.scrollTop
      let current = sections[0]
      for (const s of sections) {
        if (s.offsetTop - 100 <= scrollTop) current = s
      }
      activeSection.value = current.id
    }

    root.addEventListener('scroll', updateActive, { passive: true })
    updateActive()
  }

  function scrollTo(id: string) {
    const editor = document.getElementById('editor')
    const target = document.getElementById(id)
    if (editor && target) {
      editor.scrollTo({ top: target.offsetTop, behavior: 'smooth' })
    }
  }

  return {
    sidebarOpen,
    activeSection,
    currentPage,
    layoutInitialized,
    panelOpen,
    activePanelTab,
    activeSidebarView,
    activeFilters,
    toggleSidebar,
    togglePanel,
    openPanel,
    setView,
    initObserver,
    scrollTo,
  }
}
