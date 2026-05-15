<template>
  <section id="about" class="py-20 md:py-32 bg-white">
    <div class="section-container">
      <div class="section-label">{{ t.about.label }}</div>

      <div class="grid md:grid-cols-[3fr_2fr] gap-12 md:gap-20">
        <div>
          <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy leading-tight mb-8">
            {{ t.about.heading }}
          </h2>
          <p class="text-neutral-600 leading-relaxed mb-5">
            {{ t.about.p1 }}
          </p>
          <p class="text-neutral-600 leading-relaxed">
            {{ t.about.p2 }}
          </p>
        </div>

        <div class="relative">
          <div class="md:sticky md:top-24">
            <blockquote class="relative">
              <span class="font-serif text-7xl md:text-8xl text-brand-navy/15 absolute -top-6 -left-2 leading-none select-none" aria-hidden="true">&ldquo;</span>
              <div class="section-label relative z-10 pt-4">{{ t.about.vision.label }}</div>
              <p class="font-serif text-lg md:text-xl text-brand-navy/80 leading-relaxed italic relative z-10">
                {{ t.about.vision.text }}
              </p>
            </blockquote>

            <div class="mt-8 p-5 bg-neutral-50 border border-neutral-100">
              <div class="text-xs font-mono uppercase tracking-wider text-brand-navy/40 mb-2">Politeknik Negeri Malang</div>
              <div class="text-sm text-neutral-600 leading-relaxed">
                {{ t.about.institution }}
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

const { t } = useI18n()
</script>
