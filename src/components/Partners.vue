<template>
  <section id="partners" class="py-20 md:py-32 bg-neutral-50 dark:bg-gray-800">
    <div class="section-container">
      <div class="section-label">{{ t.partners.label }}</div>
      <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-gray-100 leading-tight mb-16">
        {{ t.partners.heading }}
      </h2>

      <!-- Logo grid -->
      <template v-if="partners.length > 0">
        <!-- NOTE: placeholder data, replace with real partner logos in public/images/partners/ -->
        <ul class="flex flex-wrap gap-8 items-center">
          <li v-for="partner in partners" :key="partner.name">
            <a
              v-if="partner.url"
              :href="partner.url"
              target="_blank"
              rel="noopener"
              class="block grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
              :title="`${t.partners.visit} ${partner.name}`"
            >
              <img
                :src="partner.logoUrl"
                :alt="partner.name"
                class="h-10 w-auto object-contain"
                loading="lazy"
              />
            </a>
            <div v-else class="grayscale opacity-60">
              <img
                :src="partner.logoUrl"
                :alt="partner.name"
                class="h-10 w-auto object-contain"
                loading="lazy"
              />
            </div>
          </li>
        </ul>
      </template>

      <!-- Empty state -->
      <template v-else>
        <div class="text-center py-20 border border-dashed border-primary/10 dark:border-gray-600">
          <div class="font-mono text-5xl text-primary/10 mb-4 select-none">&infin;</div>
          <p class="text-neutral-400 dark:text-gray-500 text-sm max-w-sm mx-auto">{{ t.partners.empty }}</p>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import rawPartners from '../data/partners.json'

const { t } = useI18n()

interface Partner {
  name: string
  logoUrl: string
  url?: string
  _placeholder?: boolean
}

const partners = rawPartners as Partner[]
</script>
