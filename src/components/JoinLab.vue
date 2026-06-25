<template>
  <section id="join" class="py-20 md:py-32 bg-neutral-50">
    <div class="section-container">
      <div class="section-label">{{ t.join.label }}</div>
      <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight mb-6">
        {{ t.join.heading }}
      </h2>
      <p class="text-neutral-600 text-base leading-relaxed max-w-2xl mb-14">
        {{ t.join.intro }}
      </p>

      <!-- Opportunity cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div
          v-for="card in cards"
          :key="card.title"
          class="border border-primary/10 bg-white p-6 flex flex-col gap-3 hover:border-primary/20 transition-colors"
        >
          <div class="font-mono text-[11px] uppercase tracking-widest text-accent">{{ card.icon }}</div>
          <h3 class="font-serif text-lg font-semibold text-primary leading-snug">{{ card.title }}</h3>
          <p class="text-sm text-neutral-500 leading-relaxed flex-1">{{ card.desc }}</p>
        </div>
      </div>

      <!-- CTAs -->
      <div class="flex flex-wrap gap-4">
        <a
          :href="`mailto:${t.contact.email}`"
          class="inline-flex items-center gap-2 px-6 py-3 font-mono text-[13px] font-medium text-primary transition-colors"
          style="background: #F5A100;"
        >
          {{ t.join.emailCta }} ↗
        </a>
        <a
          href="/researchers"
          class="inline-flex items-center gap-2 px-6 py-3 font-mono text-[13px] font-medium text-primary/70 hover:text-primary transition-colors border border-primary/20 hover:border-primary/40 bg-white"
        >
          {{ t.join.browseCta }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const cards = computed(() => [
  { icon: '01', title: t.value.join.thesisTitle, desc: t.value.join.thesisDesc },
  { icon: '02', title: t.value.join.internTitle,  desc: t.value.join.internDesc  },
  { icon: '03', title: t.value.join.collabTitle,  desc: t.value.join.collabDesc  },
])
</script>
