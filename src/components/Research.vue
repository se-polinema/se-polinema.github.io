<template>
  <section id="research" class="py-20 md:py-32 bg-white dark:bg-gray-900">
    <div class="section-container">
      <div class="relative overflow-hidden mb-16">
        <span class="absolute -top-4 right-0 font-mono text-[8rem] font-bold text-primary/[0.04] leading-none select-none pointer-events-none" aria-hidden="true">01</span>
        <div class="section-label">{{ t.research.label }}</div>
        <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-gray-100 leading-tight">
          {{ t.research.heading }}
        </h2>
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <a
          v-for="(area, index) in research"
          :key="area.id"
          :href="withBase(`/research/${area.id}`)"
          class="group bg-neutral-50 dark:bg-gray-800 border border-neutral-100 dark:border-gray-700 hover:border-accent/30 transition-all duration-300 p-6 relative overflow-hidden block"
          :class="{ 'sm:col-span-2 sm:max-w-[calc(50%-0.5rem)]': index === research.length - 1 && research.length % 2 !== 0 }"
        >
          <!-- Accent sweep line -->
          <div class="absolute top-0 left-0 right-0 h-0.5 bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

          <div class="flex items-start gap-4">
            <span class="font-mono text-5xl font-bold text-primary/[0.08] leading-none shrink-0 tabular-nums select-none mt-1">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <div class="min-w-0 flex-1">
              <h3 class="font-serif text-lg md:text-xl font-semibold text-primary dark:text-gray-100 mb-2 group-hover:text-primary/80 dark:group-hover:text-gray-300 transition-colors">
                {{ lang === 'id' ? area.name.id : area.name.en }}
              </h3>
              <p class="text-sm text-neutral-500 dark:text-gray-400 leading-relaxed mb-3">
                {{ lang === 'id' ? area.tagline.id : area.tagline.en }}
              </p>
              <div class="rt-topics">
                <div v-for="topic in area.topics" :key="topic.id" class="rt-topic-branch">
                  <div class="rt-topic-node">
                    <span class="rt-topic-name">{{ lang === 'id' ? topic.name.id : topic.name.en }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>

      <div class="mt-8 text-center">
        <a
          :href="withBase('/research')"
          class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-primary dark:text-blue-300 border border-primary/20 dark:border-gray-500 hover:border-primary/50 dark:hover:border-gray-400 transition-colors"
        >
          {{ t.research.viewAllCta }}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import { withBase } from '../lib/paths'
import researchData from '../data/research.json'

const { lang, t } = useI18n()
const research = researchData
</script>

<style scoped>
/* Parent-child tree for each area's topics, matching ResearchAreaTree.astro's
   connector-line technique (border-left trunk + ::before stub per child) so
   the homepage teaser and the full /research pages read as one visual system. */
.rt-topics {
  --rt-line: color-mix(in srgb, var(--color-primary, #29156a) 15%, transparent);
  margin: 0.25rem 0 0 0.1rem;
  padding-left: 1.25rem;
  border-left: 2px solid var(--rt-line);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

:global(.dark) .rt-topics {
  --rt-line: rgba(255, 255, 255, 0.14);
}

.rt-topic-branch {
  position: relative;
}

.rt-topic-branch::before {
  content: '';
  position: absolute;
  left: -1.25rem;
  top: 0.7rem;
  width: 1.25rem;
  height: 2px;
  background: var(--rt-line);
}

.rt-topic-node {
  display: inline-flex;
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--rt-line);
  border-radius: 0.25rem;
  background: color-mix(in srgb, var(--color-primary, #29156a) 2%, transparent);
}

:global(.dark) .rt-topic-node {
  background: rgba(255, 255, 255, 0.02);
}

.rt-topic-name {
  font-family: var(--font-mono, monospace);
  font-size: 0.72rem;
  color: rgb(64 64 64);
}

:global(.dark) .rt-topic-name {
  color: rgb(209 213 219);
}
</style>
