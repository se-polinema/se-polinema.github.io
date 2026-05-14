<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="scrolled ? 'bg-white/95 backdrop-blur-sm shadow-[0_1px_0_rgba(41,21,106,0.08)]' : 'bg-transparent'"
  >
    <div class="section-container">
      <nav class="flex items-center justify-between h-16 md:h-20">
        <a href="#" class="flex items-center gap-3 group" @click.prevent="scrollTo('hero')">
          <img
            src="/images/logo-polinema.png"
            alt="Polinema"
            class="h-8 md:h-10 w-auto"
          />
          <div class="hidden sm:block">
            <div class="font-serif text-sm md:text-base font-semibold text-brand-navy leading-tight">
              Software Engineering Lab
            </div>
            <div class="text-[10px] md:text-xs text-brand-navy/50 leading-tight">
              JTI Polinema
            </div>
          </div>
        </a>

        <div class="hidden lg:flex items-center gap-8">
          <a
            v-for="item in navItems"
            :key="item.id"
            :href="'#' + item.id"
            class="text-sm text-brand-navy/70 hover:text-brand-navy transition-colors font-medium"
            @click.prevent="scrollTo(item.id)"
          >
            {{ t[item.label] }}
          </a>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="toggleLang"
            class="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-brand-navy/60 hover:text-brand-navy transition-colors px-2 py-1"
            :aria-label="lang === 'en' ? 'Switch to Indonesian' : 'Beralih ke Inggris'"
          >
            <span :class="{ 'text-brand-navy font-semibold': lang === 'en' }">EN</span>
            <span class="text-brand-navy/30">/</span>
            <span :class="{ 'text-brand-navy font-semibold': lang === 'id' }">ID</span>
          </button>

          <button
            @click="mobileOpen = !mobileOpen"
            class="lg:hidden flex flex-col gap-1.5 p-2"
            :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
          >
            <span
              class="block w-5 h-px bg-brand-navy transition-all duration-300"
              :class="mobileOpen ? 'rotate-45 translate-y-[5px]' : ''"
            />
            <span
              class="block w-5 h-px bg-brand-navy transition-all duration-300"
              :class="mobileOpen ? 'opacity-0' : ''"
            />
            <span
              class="block w-5 h-px bg-brand-navy transition-all duration-300"
              :class="mobileOpen ? '-rotate-45 -translate-y-[5px]' : ''"
            />
          </button>
        </div>
      </nav>
    </div>

    <Transition name="drawer">
      <div
        v-if="mobileOpen"
        class="lg:hidden fixed inset-0 top-16 bg-white z-40"
      >
        <nav class="flex flex-col p-6 gap-1">
          <a
            v-for="item in navItems"
            :key="item.id"
            :href="'#' + item.id"
            class="text-lg text-brand-navy/70 hover:text-brand-navy transition-colors font-medium py-3 border-b border-brand-navy/5"
            @click.prevent="scrollTo(item.id); mobileOpen = false"
          >
            {{ t[item.label] }}
          </a>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../composables/useI18n'

const { lang, t, toggleLang } = useI18n()
const scrolled = ref(false)
const mobileOpen = ref(false)

const navItems = [
  { id: 'about', label: 'nav.about' },
  { id: 'research', label: 'nav.research' },
  { id: 'team', label: 'nav.team' },
  { id: 'news', label: 'nav.news' },
  { id: 'projects', label: 'nav.projects' },
  { id: 'contact', label: 'nav.contact' },
]

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
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
