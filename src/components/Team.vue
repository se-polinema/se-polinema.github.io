<template>
  <section id="team" class="py-20 md:py-32 bg-neutral-50 dark:bg-gray-800">
    <div class="section-container">
      <div class="relative overflow-hidden mb-16">
        <span class="absolute -top-4 right-0 font-mono text-[8rem] font-bold text-primary/[0.04] leading-none select-none pointer-events-none" aria-hidden="true">03</span>
        <div class="section-label">{{ t.team.label }}</div>
        <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-gray-100 leading-tight">
          {{ t.team.heading }}
        </h2>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="member in researchers"
          :key="member.id"
          class="group bg-white dark:bg-gray-800 border border-neutral-100 dark:border-gray-700 hover:border-primary/15 dark:hover:border-gray-500 hover:shadow-sm transition-all duration-300 overflow-hidden"
        >
          <!-- Photo (square, links to profile) -->
          <a :href="`/researchers/${member.id}`" class="block relative aspect-square bg-neutral-100 dark:bg-gray-700 overflow-hidden">
            <img
              :src="member.photo"
              :alt="member.name"
              class="w-full h-full object-cover grayscale transition duration-500 group-hover:grayscale-0"
              :style="{ objectPosition: member.photoPosition }"
              loading="lazy"
            />
            <!-- Accent sweep line on hover -->
            <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </a>

          <!-- Card content -->
          <div class="p-5">
            <h3 class="font-serif text-lg font-semibold text-primary dark:text-gray-100">
              {{ member.name }}
            </h3>
            <p class="text-xs font-mono uppercase tracking-wider text-primary/40 dark:text-gray-500 mt-0.5 mb-4">
              {{ lang === 'id' ? member.title.id : member.title.en }}
            </p>
            <div class="flex flex-wrap gap-1.5 mb-4">
              <span
                v-for="item in member.expertise.slice(0, 3)"
                :key="item"
                class="text-[10px] font-mono uppercase tracking-wide text-primary/60 dark:text-gray-400 bg-primary/5 dark:bg-gray-700 px-2 py-0.5"
              >
                {{ item }}
              </span>
              <span v-if="member.expertise.length > 3" class="text-[10px] font-mono text-primary/30 dark:text-gray-600 px-1 py-0.5">
                +{{ member.expertise.length - 3 }}
              </span>
            </div>
            <a
              :href="`/researchers/${member.id}`"
              class="inline-flex items-center gap-1.5 text-xs font-medium text-primary/50 dark:text-gray-400 hover:text-accent dark:hover:text-yellow-300 transition-colors"
            >
              {{ t.team.viewProfile }} →
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

defineProps<{
  researchers: Array<{
    id: string
    name: string
    photo: string
    photoPosition: string
    title: { id: string; en: string }
    shortBio: { id: string; en: string }
    expertise: string[]
  }>
}>()

const { lang, t } = useI18n()
</script>
