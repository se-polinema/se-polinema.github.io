<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 dark:bg-gray-900"
    :class="mobileOpen ? 'bg-white dark:bg-gray-900 border-b border-primary/10 dark:border-gray-700' : scrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-[0_1px_0_rgba(0,78,162,0.08)] dark:shadow-[0_1px_0_rgba(255,255,255,0.05)]' : 'bg-transparent'"
  >
    <div class="section-container">
      <nav class="flex items-center justify-between h-16 md:h-20">
        <a href="#" class="flex items-center gap-3 group" @click.prevent="scrollTo('hero')">
          <img
            src="/images/logo-polinema.png"
            alt="Polinema"
            class="h-8 md:h-10 w-auto shrink-0"
          />
          <div class="font-mono font-bold text-sm leading-none px-2.5 py-1.5 rounded bg-[#1E2D4E] text-white shrink-0 select-none">
            <span class="text-[#F5A100]">{</span>SE<span class="text-[#F5A100]">}</span>
          </div>
          <div>
            <div class="font-serif text-sm md:text-base font-semibold text-primary dark:text-gray-100 leading-tight">
              SE Lab
            </div>
            <div class="text-[10px] md:text-xs text-primary/50 dark:text-gray-400 leading-tight">
              JTI Polinema
            </div>
          </div>
        </a>

        <div class="hidden lg:flex items-center gap-8">
          <a
            v-for="item in navItems"
            :key="item.id"
            :href="item.href"
            class="text-sm text-primary/70 dark:text-gray-300 hover:text-accent dark:hover:text-yellow-300 transition-colors font-medium"
            @click="handleNavClick($event, item)"
          >
            {{ item.label }}
          </a>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="toggleLang"
            class="hidden lg:flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-primary/60 dark:text-gray-400 hover:text-primary dark:hover:text-gray-100 transition-colors min-w-[44px] min-h-[44px] px-2 py-1 justify-center"
            :aria-label="lang === 'en' ? 'Switch to Indonesian' : 'Beralih ke Inggris'"
          >
            <span :class="{ 'text-accent font-semibold': lang === 'en' }" :class="lang === 'en' ? 'text-accent dark:text-yellow-300 font-semibold' : ''">EN</span>
            <span class="text-primary/30 dark:text-gray-600">/</span>
            <span :class="{ 'text-accent font-semibold': lang === 'id' }" :class="lang === 'id' ? 'text-accent dark:text-yellow-300 font-semibold' : ''">ID</span>
          </button>

          <button
            @click="mobileOpen = !mobileOpen"
            class="lg:hidden flex flex-col gap-1.5 min-w-[44px] min-h-[44px] items-center justify-center"
            :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
          >
            <span
              class="block w-5 h-px bg-primary dark:bg-gray-300 transition-all duration-300"
              :class="mobileOpen ? 'rotate-45 translate-y-[5px]' : ''"
            />
            <span
              class="block w-5 h-px bg-primary dark:bg-gray-300 transition-all duration-300"
              :class="mobileOpen ? 'opacity-0' : ''"
            />
            <span
              class="block w-5 h-px bg-primary dark:bg-gray-300 transition-all duration-300"
              :class="mobileOpen ? '-rotate-45 -translate-y-[5px]' : ''"
            />
          </button>
        </div>
      </nav>
    </div>

    <Transition name="drawer">
      <div
        v-if="mobileOpen"
        class="lg:hidden fixed inset-0 top-16 md:top-20 z-40 overflow-y-auto bg-primary"
      >
        <nav class="flex flex-col px-6 pt-4 pb-8 gap-1">
          <a
            v-for="item in navItems"
            :key="item.id"
            :href="item.href"
            class="text-xl font-medium py-4 border-b transition-colors"
            style="color: #ffffff; border-color: rgba(255,255,255,0.12);"
            @click="handleNavClick($event, item); mobileOpen = false"
          >
            {{ item.label }}
          </a>
          <button
            @click="toggleLang"
            class="flex items-center gap-2 text-sm font-mono uppercase tracking-wider mt-6 py-2 transition-colors"
            style="color: rgba(255,255,255,0.5);"
            :aria-label="lang === 'en' ? 'Switch to Indonesian' : 'Beralih ke Inggris'"
          >
            <span :style="lang === 'en' ? 'color:#ffffff;font-weight:600' : ''">EN</span>
            <span style="color: rgba(255,255,255,0.25);">/</span>
            <span :style="lang === 'id' ? 'color:#ffffff;font-weight:600' : ''">ID</span>
          </button>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../composables/useI18n'

const { lang, t, toggleLang } = useI18n()
const scrolled = ref(false)
const mobileOpen = ref(false)

const navItems = computed(() => [
  { id: 'about', href: '/#about', label: t.value.nav.about },
  { id: 'research', href: '/#research', label: t.value.nav.research },
  { id: 'researchers', href: '/researchers', label: t.value.nav.researchers },
  { id: 'projects', href: '/projects', label: t.value.nav.projects },
  { id: 'books', href: '/books', label: t.value.nav.books },
  { id: 'decks', href: '/decks', label: t.value.nav.decks },
  { id: 'publications', href: '/publications', label: t.value.nav.publications },
  { id: 'blog', href: '/blog', label: t.value.nav.blog },
  { id: 'join', href: '/#join', label: t.value.nav.join },
  { id: 'contact', href: '/#contact', label: t.value.nav.contact },
])

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

function handleNavClick(event: MouseEvent, item: { href: string; id: string }) {
  if (item.href.startsWith('/#') && window.location.pathname === '/') {
    event.preventDefault()
    scrollTo(item.id)
  }
}

function onScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
