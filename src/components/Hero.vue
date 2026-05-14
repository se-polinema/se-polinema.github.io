<template>
  <section id="hero" class="relative min-h-screen flex flex-col justify-center bg-neutral-50 overflow-hidden">
    <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle, #29156A 1px, transparent 1px); background-size: 24px 24px;" />

    <div class="section-container relative z-10 pt-24 pb-16 flex flex-col justify-center min-h-screen">
      <div class="max-w-3xl">
        <div class="flex items-center gap-3 mb-6">
          <img src="/images/logo-jti.png" alt="JTI Polinema" class="h-8 w-auto opacity-80" />
          <span class="text-xs font-mono uppercase tracking-[0.2em] text-brand-navy/50">{{ t.hero.subtitle }}</span>
        </div>

        <h1 class="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-brand-navy leading-[1.1] mb-6">
          {{ t.hero.title }}
        </h1>

        <p class="text-lg sm:text-xl md:text-2xl text-brand-navy/70 leading-relaxed max-w-2xl mb-8">
          {{ t.hero.tagline }}
        </p>

        <p v-if="lang === 'id'" class="text-base sm:text-lg text-brand-navy/50 mb-10 max-w-2xl">
          Membangun masa depan perangkat lunak, bersama.
        </p>

        <a
          href="#research"
          @click.prevent="scrollTo('research')"
          class="inline-flex items-center gap-2 text-sm font-medium text-brand-navy hover:text-brand-yellow transition-colors group"
        >
          <span class="w-8 h-px bg-brand-navy/30 group-hover:bg-brand-yellow group-hover:w-12 transition-all" />
          {{ t.hero.cta }}
        </a>
      </div>

      <div class="mt-auto pt-20 md:pt-32">
        <div class="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl">
          <div class="border-t border-brand-navy/10 pt-4">
            <div class="font-serif text-3xl md:text-4xl font-bold text-brand-navy">6</div>
            <div class="text-xs md:text-sm text-brand-navy/50 mt-1">{{ t.hero.statTeam }}</div>
          </div>
          <div class="border-t border-brand-navy/10 pt-4">
            <div class="font-serif text-3xl md:text-4xl font-bold text-brand-navy">7</div>
            <div class="text-xs md:text-sm text-brand-navy/50 mt-1">{{ t.hero.statFocus }}</div>
          </div>
          <div class="border-t border-brand-navy/10 pt-4">
            <div class="font-serif text-3xl md:text-4xl font-bold text-brand-navy">20+</div>
            <div class="text-xs md:text-sm text-brand-navy/50 mt-1">{{ t.hero.statProjects }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

const { lang, t } = useI18n()

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>
