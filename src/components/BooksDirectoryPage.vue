<template>
  <div class="px-8 py-5">
    <!-- Heading -->
    <div class="section-label mb-2">{{ t.books.label }}</div>
    <h1 class="font-serif text-2xl md:text-3xl font-bold text-primary leading-tight mb-2">
      {{ t.books.archiveHeading }}
    </h1>
    <p class="text-neutral-500 text-sm leading-relaxed max-w-2xl mb-8">
      {{ t.books.archiveDescription }}
    </p>

    <!-- Filter bar -->
    <div class="flex items-center gap-4 mb-6">
      <select
        v-model="selectedMember"
        class="text-sm border border-primary/15 text-primary bg-white px-3 py-1.5 rounded-none focus:outline-none focus:border-primary/40"
      >
        <option value="">{{ t.books.allMembers }}</option>
        <option v-for="m in members" :key="m.id" :value="m.id">{{ m.name }}</option>
      </select>
    </div>

    <!-- Result count -->
    <div class="mb-6 text-sm text-neutral-500">
      {{ filtered.length }}
      {{ filtered.length === 1 ? t.books.resultSingle : t.books.resultPlural }}
    </div>

    <!-- Grid -->
    <template v-if="filtered.length > 0">
      <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <li
          v-for="book in filtered"
          :key="book.title"
          class="border border-primary/10 bg-white p-5 flex flex-col gap-3 hover:border-primary/20 transition-colors"
        >
          <div class="font-serif text-[1rem] font-semibold text-primary leading-snug">
            {{ book.title }}
          </div>
          <p v-if="book.description" class="text-sm text-neutral-500 leading-relaxed flex-1">
            {{ book.description }}
          </p>
          <div v-if="book.playstoreUrl" class="mt-1">
            <a
              :href="book.playstoreUrl"
              target="_blank"
              rel="noopener"
              class="text-[13px] text-primary hover:text-accent transition-colors"
            >Buy on Google Play Books →</a>
          </div>
          <div class="flex items-center gap-1.5 mt-auto pt-1 border-t border-primary/5">
            <span class="text-[12px] text-neutral-400">{{ t.books.by }}</span>
            <a
              :href="`/researchers/${book.researcherId}`"
              class="text-[12px] text-primary/70 hover:text-accent transition-colors"
            >{{ book.researcherName }}</a>
          </div>
        </li>
      </ul>
    </template>

    <!-- Empty state -->
    <template v-else>
      <div class="text-center py-20 border border-dashed border-primary/10">
        <div class="font-mono text-5xl text-primary/10 mb-4 select-none">&#9634;</div>
        <p class="text-neutral-400 text-sm max-w-sm mx-auto">{{ t.books.empty }}</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '../composables/useI18n'

interface MemberBook {
  title: string
  playstoreUrl?: string
  description?: string
  researcherId: string
  researcherName: string
}

const props = defineProps<{
  books: MemberBook[]
  members: { id: string; name: string }[]
}>()

const { t } = useI18n()
const selectedMember = ref('')

const filtered = computed(() =>
  selectedMember.value
    ? props.books.filter((b) => b.researcherId === selectedMember.value)
    : props.books,
)
</script>
