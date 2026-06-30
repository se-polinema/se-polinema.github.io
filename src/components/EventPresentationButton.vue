<template>
  <!-- nothing rendered until mounted (avoids SSG hydration mismatch) -->
  <div v-if="ready">
    <!-- Before the event: admins get a clickable preview link; public sees muted text -->
    <template v-if="status === 'before'">
      <a
        v-if="isAdmin"
        :href="`/present/${presentationSlug}`"
        class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono font-semibold text-white bg-accent hover:bg-accent/90 transition-colors no-underline"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
        {{ t.events.presentation.openPresentation }}
        <span class="opacity-60 font-normal text-xs">· {{ t.events.presentation.previewHint }}</span>
      </a>
      <div v-else class="inline-flex items-center gap-2 px-4 py-2 text-sm font-mono text-neutral-400 dark:text-gray-500 border border-neutral-200 dark:border-gray-700">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        {{ t.events.presentation.startsSoon }}
      </div>
    </template>

    <!-- Live: prominent accent button for everyone -->
    <a
      v-else-if="status === 'live'"
      :href="`/present/${presentationSlug}`"
      class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono font-semibold text-white bg-accent hover:bg-accent/90 transition-colors no-underline"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
      {{ t.events.presentation.openPresentation }}
    </a>

    <!-- Past: muted secondary link -->
    <a
      v-else-if="status === 'after'"
      :href="`/present/${presentationSlug}`"
      class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono text-primary dark:text-gray-100 border border-primary/20 dark:border-gray-600 hover:bg-primary/5 dark:hover:bg-gray-700 transition-colors no-underline"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><polyline points="8 21 12 17 16 21"/>
      </svg>
      {{ t.events.presentation.viewSlides }}
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import { supabase } from '../lib/supabase'

const props = defineProps<{
  presentationSlug: string
  eventDate: string      // ISO date string, day granularity (YYYY-MM-DD)
  eventEndDate?: string  // ISO date string or undefined
}>()

const { t } = useI18n()

type Status = 'before' | 'live' | 'after'

const ready = ref(false)
const status = ref<Status>('before')
const isAdmin = ref(false)

onMounted(async () => {
  // Date-only comparison: today (local) vs eventDate..eventEndDate (inclusive).
  const today = new Date()
  const todayNum = dateNum(today)

  const start = dateNum(new Date(props.eventDate))
  const end = props.eventEndDate ? dateNum(new Date(props.eventEndDate)) : start

  if (todayNum < start) {
    status.value = 'before'
  } else if (todayNum > end) {
    status.value = 'after'
  } else {
    status.value = 'live'
  }

  // Only bother checking auth when it matters (before the event starts)
  if (status.value === 'before') {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .schema('se')
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      isAdmin.value = profile?.role === 'admin'
    }
  }

  ready.value = true
})

/** Comparable integer YYYYMMDD from a Date. */
function dateNum(d: Date): number {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
}
</script>
