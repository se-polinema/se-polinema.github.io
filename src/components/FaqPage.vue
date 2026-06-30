<template>
  <div class="px-8 py-5">
    <div class="section-label mb-2">{{ t.faq.label }}</div>
    <h1 class="font-serif text-2xl md:text-3xl font-bold text-primary dark:text-gray-100 leading-tight mb-2">
      {{ t.faq.heading }}
    </h1>
    <p class="text-neutral-500 dark:text-gray-400 text-sm leading-relaxed max-w-2xl mb-8">
      {{ t.faq.description }}
    </p>

    <div v-for="category in data.categories" :key="category.id" class="mb-10">
      <h2 class="font-serif text-lg md:text-xl font-semibold text-primary dark:text-gray-100 mb-4 pb-2 border-b border-primary/10 dark:border-gray-700">
        {{ lang === 'id' ? category.label.id : category.label.en }}
      </h2>

      <dl class="flex flex-col gap-px">
        <div
          v-for="(q, qi) in category.questions"
          :key="q.key"
          class="border border-primary/10 dark:border-gray-600 bg-white dark:bg-gray-800"
        >
          <dt>
            <button
              :id="`faq-btn-${category.id}-${qi}`"
              :aria-expanded="expanded === `${category.id}-${qi}`"
              :aria-controls="`faq-panel-${category.id}-${qi}`"
              class="w-full flex items-center justify-between gap-3 px-5 py-4 text-left text-sm md:text-base font-medium text-primary dark:text-gray-100 hover:bg-neutral-50 dark:hover:bg-gray-700/50 transition-colors"
              @click="toggle(category.id, qi)"
            >
              <span class="flex-1 min-w-0">{{ lang === 'id' ? q.id.question : q.en.question }}</span>
              <svg
                class="w-5 h-5 shrink-0 text-primary/40 dark:text-gray-500 transition-transform duration-200"
                :class="expanded === `${category.id}-${qi}` ? 'rotate-180' : ''"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </button>
          </dt>
          <dd
            :id="`faq-panel-${category.id}-${qi}`"
            role="region"
            :aria-labelledby="`faq-btn-${category.id}-${qi}`"
            :hidden="expanded !== `${category.id}-${qi}`"
            class="px-5 pb-4"
          >
            <div class="text-sm text-neutral-500 dark:text-gray-400 leading-relaxed prose prose-sm prose-neutral dark:prose-invert max-w-none">
              <p>{{ lang === 'id' ? q.id.answer : q.en.answer }}</p>
            </div>
          </dd>
        </div>
      </dl>
    </div>

    <div class="border-t border-primary/10 dark:border-gray-700 pt-6 mt-4">
      <p class="text-sm text-neutral-500 dark:text-gray-400">
        {{ t.faq.notFoundText }}
        <a href="/contact" class="text-primary dark:text-gray-200 hover:text-accent dark:hover:text-yellow-300 underline underline-offset-2 transition-colors">{{ t.faq.notFoundLink }}</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '../composables/useI18n'

interface FaqQuestion {
  key: string
  en: { question: string; answer: string }
  id: { question: string; answer: string }
}

interface FaqCategory {
  id: string
  label: { en: string; id: string }
  questions: FaqQuestion[]
}

interface FaqData {
  categories: FaqCategory[]
}

defineProps<{
  data: FaqData
}>()

const { lang, t } = useI18n()
const expanded = ref<string | null>(null)

function toggle(catId: string, qi: number) {
  const key = `${catId}-${qi}`
  expanded.value = expanded.value === key ? null : key
}
</script>
