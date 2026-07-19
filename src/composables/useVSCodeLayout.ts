import { ref, reactive } from 'vue'

type SidebarView = 'explorer' | 'blog' | 'events' | 'github' | 'researchers' | 'publications' | 'decks' | 'achievements' | 'members'

const sidebarOpen = ref(false)
const activeSection = ref('hero')
const currentPage = ref('home')
const panelOpen = ref(false)
const activePanelTab = ref<'contact' | 'output' | 'quickLinks' | 'newsletter'>('contact')
const activeSidebarView = ref<SidebarView>('explorer')
const layoutInitialized = ref(false)
const activeFilters = reactive<{
  category: string | null
  year: number | null
  type: string | null
  tag: string | null
  stream: string | null
}>({ category: null, year: null, type: null, tag: null, stream: null })

let observerInit = false
let panelStateRestored = false

// Pure path → {page, view} resolver, shared by the server-side initialPath
// seed (useVSCodeLayout below) and the client-side restoreRouteState().
// Keeping this pure (no reads of `window`/reactive state) lets it run
// identically during Astro SSR and in the browser.
export function resolveRoute(pathname: string): { page: string; view: SidebarView } {
  if (pathname.startsWith('/events')) return { page: 'events', view: 'events' }
  if (pathname.startsWith('/blog')) return { page: 'blog', view: 'blog' }
  if (pathname.startsWith('/publications')) return { page: 'publications', view: 'publications' }
  if (pathname.startsWith('/researchers')) return { page: 'researchers', view: 'researchers' }
  if (pathname.startsWith('/projects')) return { page: 'projects', view: 'explorer' }
  if (pathname.startsWith('/books')) return { page: 'books', view: 'explorer' }
  if (pathname.startsWith('/decks')) return { page: 'decks', view: 'decks' }
  if (pathname.startsWith('/achievements')) return { page: 'achievements', view: 'achievements' }
  if (pathname.startsWith('/impact')) return { page: 'impact', view: 'explorer' }
  if (pathname.startsWith('/learning-paths')) return { page: 'learning-paths', view: 'explorer' }
  if (pathname.startsWith('/tools')) return { page: 'tools', view: 'explorer' }
  if (pathname.startsWith('/alumni')) return { page: 'alumni', view: 'members' }
  if (pathname.startsWith('/members') || pathname.startsWith('/profile')) return { page: 'members', view: 'members' }
  if (pathname.startsWith('/research/')) return { page: 'research', view: 'explorer' }
  if (pathname.startsWith('/contact')) return { page: 'contact', view: 'explorer' }
  if (pathname.startsWith('/faq')) return { page: 'faq', view: 'explorer' }
  if (pathname.startsWith('/glossary')) return { page: 'glossary', view: 'explorer' }
  if (pathname.startsWith('/join')) return { page: 'join', view: 'explorer' }
  if (pathname.startsWith('/login')) return { page: 'login', view: 'explorer' }
  if (pathname.startsWith('/newsletter')) return { page: 'newsletter', view: 'explorer' }
  if (pathname.startsWith('/partners')) return { page: 'partners', view: 'explorer' }
  if (pathname.startsWith('/privacy')) return { page: 'privacy', view: 'explorer' }
  if (pathname.startsWith('/register')) return { page: 'register', view: 'explorer' }
  if (pathname.startsWith('/resources')) return { page: 'resources', view: 'explorer' }
  if (pathname.startsWith('/admin')) return { page: 'admin', view: 'explorer' }
  if (pathname.startsWith('/checkin')) return { page: 'checkin', view: 'explorer' }
  return { page: 'home', view: 'explorer' }
}

export function useVSCodeLayout(initialPath?: string) {
  // Seeds currentPage/activeSidebarView from a server-known path (passed as
  // Astro.url.pathname down through an `initialPath` prop). Runs
  // unconditionally (including during SSR, where `window` doesn't exist)
  // so the very first render — server and client alike — already reflects
  // the real route, instead of the 'home'/'explorer' defaults. Because
  // every island on a page passes the same initialPath, this stays
  // consistent across the shared singleton regardless of mount order.
  if (initialPath) {
    const resolved = resolveRoute(initialPath)
    currentPage.value = resolved.page
    activeSidebarView.value = resolved.view
  }

  // sidebarOpen/layoutInitialized/panelOpen's width-based defaults are
  // deliberately NOT set here in useVSCodeLayout() itself (they used to be,
  // synchronously, on first call — that desynced the very first client
  // render, including the hydration pass itself, from SSR's false/false
  // defaults, producing real "check-only" Vue hydration mismatches on
  // Sidebar's width class, BottomPanel's height style, and StatusBar's
  // panel-toggle title/class). Deferred to restorePanelState() below
  // instead, same post-hydration timing discipline as panelOpen's
  // localStorage restore already used.

  // Restores persisted panel/sidebar state. Must be called post-hydration
  // (e.g. from a component's onMounted) so the initial client render matches
  // the server render before we mutate reactive state from window.innerWidth
  // or localStorage.
  function restorePanelState() {
    if (typeof window === 'undefined' || panelStateRestored) return
    panelStateRestored = true

    sidebarOpen.value = window.innerWidth >= 1024
    layoutInitialized.value = true

    const savedPanelOpen = localStorage.getItem('se-lab-panel-open')
    if (savedPanelOpen !== null) {
      panelOpen.value = savedPanelOpen === 'true'
    } else {
      // No stored preference yet (first-ever visit) — fall back to the
      // same width-based default the sync init block used to apply.
      panelOpen.value = window.innerWidth >= 1024
    }

    const savedPanelTab = localStorage.getItem('se-lab-panel-tab')
    if (savedPanelTab) {
      const validTabs = ['contact', 'output', 'quickLinks', 'newsletter']
      if (validTabs.includes(savedPanelTab)) {
        activePanelTab.value = savedPanelTab as 'contact' | 'output' | 'quickLinks' | 'newsletter'
      }
    }
  }

  // Resolves the current route into `currentPage`/`activeSidebarView`. Must
  // be called post-hydration (e.g. from a component's onMounted) for the
  // same reason as restorePanelState() above — mutating these during
  // setup() desyncs the first client render from the SSR-rendered defaults
  // ('home' / 'explorer') and can strand active-state UI (file tree,
  // activity bar icon, tab bar) on the SSR default.
  //
  // Deliberately NOT guarded behind a "restore once ever" flag like
  // restorePanelState() — unlike the one-time localStorage restore, route
  // state should always reflect window.location.pathname, so this always
  // recomputes from scratch. Safe and cheap to call from multiple islands
  // on every mount: they'll all independently arrive at the same value.
  function restoreRouteState() {
    if (typeof window === 'undefined') return

    const resolved = resolveRoute(window.location.pathname)
    currentPage.value = resolved.page
    activeSidebarView.value = resolved.view
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

  function openPanel(tab: 'contact' | 'output' | 'quickLinks' | 'newsletter') {
    activePanelTab.value = tab
    panelOpen.value = true
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('se-lab-panel-tab', tab)
      localStorage.setItem('se-lab-panel-open', 'true')
    }
  }

  // Map views that belong to a dedicated page so setView can navigate when needed.
  const viewNav: Partial<Record<SidebarView, { href: string; page: string }>> = {
    explorer:     { href: '/',             page: 'home'         },
    blog:         { href: '/blog',         page: 'blog'         },
    events:       { href: '/events',       page: 'events'       },
    researchers:  { href: '/researchers',  page: 'researchers'  },
    publications: { href: '/publications', page: 'publications' },
    decks:        { href: '/decks',        page: 'decks'        },
    achievements: { href: '/achievements', page: 'achievements' },
    members:      { href: '/members',      page: 'members'      },
  }

  // Activity Bar icons are direct navigation controls for routed sections.
  // If already on the target page, focus the matching sidebar view.
  function setView(view: SidebarView) {
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
    restorePanelState,
    restoreRouteState,
    setView,
    initObserver,
    scrollTo,
  }
}
