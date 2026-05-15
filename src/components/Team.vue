<template>
  <section id="team" class="py-20 md:py-32 bg-white">
    <div class="section-container">
      <div class="section-label">{{ t.team.label }}</div>
      <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy leading-tight mb-16">
        {{ t.team.heading }}
      </h2>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="member in researchers"
          :key="member.id"
          class="group border border-neutral-200 bg-neutral-50 p-5 hover:border-brand-navy/20 transition-colors"
        >
          <div class="flex items-start gap-4 mb-4">
            <div class="relative h-20 w-16 shrink-0 bg-white border border-neutral-200 overflow-hidden">
              <img :src="member.photo" :alt="member.name" class="h-full w-full object-cover grayscale contrast-110 transition duration-300 group-hover:grayscale-0" :style="{ objectPosition: member.photoPosition }" loading="lazy" />
            </div>

            <div>
              <h3 class="font-serif text-base md:text-lg font-semibold text-brand-navy">
                {{ member.name }}
              </h3>
              <p class="text-sm text-brand-navy/50 mt-0.5">
                {{ lang === 'id' ? member.title.id : member.title.en }}
              </p>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <span v-for="item in member.expertise.slice(0, 3)" :key="item" class="text-[11px] font-mono uppercase tracking-wide text-brand-navy/60 bg-white border border-brand-navy/10 px-2 py-1">
              {{ item }}
            </span>
          </div>

          <p class="mt-4 text-sm text-neutral-600 leading-relaxed line-clamp-3">
            {{ lang === 'id' ? member.shortBio.id : member.shortBio.en }}
          </p>

          <a :href="`/researchers/${member.id}`" class="inline-flex items-center gap-2 mt-5 text-sm font-medium text-brand-navy hover:text-brand-yellow transition-colors">
            {{ t.team.viewProfile }}
            <span aria-hidden="true">&rarr;</span>
          </a>
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
