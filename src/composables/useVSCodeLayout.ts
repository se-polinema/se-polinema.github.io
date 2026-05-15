import { ref } from 'vue'

const sidebarOpen = ref(true)
const activeSection = ref('hero')
const currentPage = ref('home') // 'home' | 'news' | 'publications' | 'researchers'
let initialized = false
let observerInit = false

export function useVSCodeLayout() {
  if (typeof window !== 'undefined' && !initialized) {
    initialized = true
    sidebarOpen.value = window.innerWidth >= 1024

    const path = window.location.pathname
    if (path.startsWith('/blog')) currentPage.value = 'news'
    else if (path.startsWith('/publications')) currentPage.value = 'publications'
    else if (path.startsWith('/researchers')) currentPage.value = 'researchers'
    else currentPage.value = 'home'
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function initObserver(root: HTMLElement) {
    if (observerInit) return
    observerInit = true
    const sections = root.querySelectorAll('section[id]')
    if (!sections.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (!visible.length) return
        const top = visible.reduce((a, b) =>
          a.intersectionRatio > b.intersectionRatio ? a : b
        )
        activeSection.value = top.target.id
      },
      { root, threshold: [0, 0.25, 0.5, 0.75, 1] }
    )
    sections.forEach((el) => io.observe(el))
  }

  function scrollTo(id: string) {
    const editor = document.getElementById('editor')
    const target = document.getElementById(id)
    if (editor && target) {
      editor.scrollTo({ top: target.offsetTop, behavior: 'smooth' })
    }
  }

  return { sidebarOpen, activeSection, currentPage, toggleSidebar, initObserver, scrollTo }
}
