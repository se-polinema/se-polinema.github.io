<template>
  <section id="research" class="py-20 md:py-32 bg-neutral-50">
    <div class="section-container">
      <div class="section-label">{{ t.research.label }}</div>
      <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy leading-tight mb-16">
        {{ t.research.heading }}
      </h2>

      <div class="grid md:grid-cols-2 gap-x-12 lg:gap-x-24 gap-y-8">
        <div
          v-for="(area, index) in research"
          :key="area.id"
          class="group border-t border-brand-navy/10 pt-6 hover:border-brand-yellow/40 transition-colors duration-300"
        >
          <div class="flex items-start gap-4">
            <span class="font-mono text-sm text-brand-navy/25 tabular-nums min-w-[2ch] pt-0.5">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <div>
              <h3 class="font-serif text-lg md:text-xl font-semibold text-brand-navy mb-2 group-hover:text-brand-navy/80 transition-colors">
                {{ lang === 'id' ? area.name.id : area.name.en }}
              </h3>
              <p class="text-sm text-neutral-500 leading-relaxed max-w-md">
                {{ lang === 'id' ? area.description.id : area.description.en }}
              </p>
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
