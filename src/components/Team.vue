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
          class="group bg-white dark:bg-gray-800 border border-neutral-100 dark:border-gray-700 hover:border-primary/15 dark:hover:border-gray-500 hover:shadow-sm transition-all duration-300 p-6 text-center"
        >
          <!-- Photo (small circular avatar, links to profile) -->
          <a
            :href="withBase(`/researchers/${member.id}`)"
            class="block mx-auto mb-4 w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-1 ring-neutral-200 dark:ring-gray-600 group-hover:ring-primary/30 transition-colors"
          >
            <img
              :src="member.image?.src ?? withBase(member.photo)"
              :srcset="member.image?.srcset"
              :sizes="member.image?.sizes"
              :width="member.image?.width"
              :height="member.image?.height"
              :alt="member.name"
              class="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              :style="{ objectPosition: member.photoPosition }"
              loading="lazy"
              decoding="async"
            />
          </a>

          <!-- Card content -->
          <div>
            <h3 class="font-serif text-lg font-semibold text-primary dark:text-gray-100">
              {{ member.name }}
            </h3>
            <p class="text-xs font-mono uppercase tracking-wider text-primary/40 dark:text-gray-500 mt-0.5 mb-4">
              {{ lang === 'id' ? member.title.id : member.title.en }}
            </p>
            <div class="flex flex-wrap justify-center gap-1.5 mb-4">
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
              :href="withBase(`/researchers/${member.id}`)"
              class="inline-flex items-center gap-1.5 text-xs font-medium text-primary/50 dark:text-gray-400 hover:text-accent-700 dark:hover:text-accent-400 transition-colors"
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
import { withBase } from '../lib/paths'

defineProps<{
  researchers: Array<{
    id: string
    name: string
    photo: string
    photoPosition: string
    image: {
      src: string
      srcset: string
      sizes: string
      width: number
      height: number
    } | null
    title: { id: string; en: string }
    shortBio: { id: string; en: string }
    expertise: string[]
  }>
}>()

const { lang, t } = useI18n()
</script>
