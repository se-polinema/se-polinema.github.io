<template>
  <section id="research" class="py-20 md:py-32 bg-white">
    <div class="section-container">
      <div class="relative overflow-hidden mb-16">
        <span class="absolute -top-4 right-0 font-mono text-[8rem] font-bold text-primary/[0.04] leading-none select-none pointer-events-none" aria-hidden="true">02</span>
        <div class="section-label">{{ t.research.label }}</div>
        <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight">
          {{ t.research.heading }}
        </h2>
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <div
          v-for="(area, index) in research"
          :key="area.id"
          class="group bg-neutral-50 border border-neutral-100 hover:border-accent/30 transition-all duration-300 p-6 relative overflow-hidden"
          :class="{ 'sm:col-span-2 sm:max-w-[calc(50%-0.5rem)]': index === research.length - 1 && research.length % 2 !== 0 }"
        >
          <!-- Accent sweep line -->
          <div class="absolute top-0 left-0 right-0 h-0.5 bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

          <div class="flex items-start gap-4">
            <span class="font-mono text-5xl font-bold text-primary/[0.08] leading-none shrink-0 tabular-nums select-none mt-1">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <div>
              <h3 class="font-serif text-lg md:text-xl font-semibold text-primary mb-2 group-hover:text-primary/80 transition-colors">
                {{ lang === 'id' ? area.name.id : area.name.en }}
              </h3>
              <p class="text-sm text-neutral-500 leading-relaxed mb-3">
                {{ lang === 'id' ? area.tagline.id : area.tagline.en }}
              </p>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="topic in area.topics"
                  :key="topic"
                  class="inline-block text-xs font-mono px-2 py-0.5 rounded bg-primary/[0.06] text-primary/60 border border-primary/10"
                >
                  {{ topic }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import researchData from '../data/research.json'

const { lang, t } = useI18n()
const research = researchData
</script>
