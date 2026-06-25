<template>
  <section id="stats" class="py-10 md:py-14" style="background: #0D1B2E;">
    <div class="section-container">
      <dl class="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
        <div
          v-for="stat in statItems"
          :key="stat.label"
          class="flex flex-col items-center justify-center gap-1 py-8 px-4 bg-[#0D1B2E]"
        >
          <dd class="font-serif text-4xl md:text-5xl font-bold leading-none" :style="{ color: stat.color }">
            {{ stat.value }}
          </dd>
          <dt class="font-mono text-[11px] uppercase tracking-widest text-white/40 mt-1">
            {{ stat.label }}
          </dt>
        </div>
      </dl>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'

const props = defineProps<{
  researchers: number
  publications: number
  projects: number
  books: number
}>()

const { t } = useI18n()

const statItems = computed(() => [
  { label: t.value.stats.researchers,  value: props.researchers,  color: '#F5A100' },
  { label: t.value.stats.publications, value: props.publications, color: '#6AB0F5' },
  { label: t.value.stats.projects,     value: props.projects,     color: '#98C379' },
  { label: t.value.stats.books,        value: props.books,        color: '#CE9178' },
])
</script>
