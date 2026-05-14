<template>
  <section id="team" class="py-20 md:py-32 bg-white">
    <div class="section-container">
      <div class="section-label">{{ t.team.label }}</div>
      <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy leading-tight mb-16">
        {{ t.team.heading }}
      </h2>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="member in team"
          :key="member.id"
          class="group"
        >
          <div class="relative aspect-[3/4] bg-neutral-100 border border-neutral-200 mb-4 overflow-hidden">
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="font-serif text-5xl md:text-6xl text-neutral-300 select-none" aria-hidden="true">
                {{ member.name.charAt(0) }}
              </span>
            </div>
          </div>

          <h3 class="font-serif text-base md:text-lg font-semibold text-brand-navy">
            {{ member.name }}
          </h3>
          <p class="text-sm text-brand-navy/50 mt-0.5">
            {{ lang === 'id' ? member.role.id : member.role.en }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import teamData from '../data/team.json'

const { lang, t } = useI18n()
const team = teamData
</script>
