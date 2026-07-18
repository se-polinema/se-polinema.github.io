<template>
  <section>
    <div
      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 pb-3 border-b border-primary/10 dark:border-gray-700"
      :class="collapsible ? 'cursor-pointer' : ''"
      @click="collapsible && (expanded = !expanded)"
    >
      <div>
        <h2 class="font-serif text-lg font-semibold text-primary dark:text-gray-100">{{ event.title }}</h2>
        <p class="text-xs font-mono text-neutral-400 dark:text-gray-500 mt-0.5">
          {{ registeredCount }} {{ t.events.admin.registeredCount }}
          &nbsp;·&nbsp;
          {{ checkedInCount }} {{ t.events.admin.checkedInCount }}
          <template v-if="collapsible">
            &nbsp;·&nbsp;{{ expanded ? t.events.admin.hideAction : t.events.admin.showAction }}
          </template>
        </p>
      </div>
      <div class="flex items-center gap-3" @click.stop>
        <button
          @click="$emit('toggle-registration')"
          class="text-xs font-mono px-2 py-1 border transition-colors"
          :class="event.registration_open
            ? 'text-green-700 dark:text-green-400 border-green-300 dark:border-green-700'
            : 'text-neutral-400 dark:text-gray-500 border-primary/20 dark:border-gray-600'"
          :title="t.events.admin.toggleRegistration"
        >
          {{ event.registration_open ? t.events.admin.registrationOpenLabel : t.events.admin.registrationClosedLabel }}
        </button>
        <div class="text-right">
          <div class="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-0.5">{{ t.events.admin.checkInCode }}</div>
          <div class="flex items-center gap-2">
            <code class="text-sm font-mono font-bold text-accent-700 dark:text-accent-400 bg-accent/10 px-2 py-0.5">{{ event.check_in_code }}</code>
            <button
              @click="$emit('copy-code')"
              class="text-xs font-mono text-primary/40 dark:text-gray-500 hover:text-primary dark:hover:text-gray-100 transition-colors"
            >
              {{ copied ? t.events.admin.codeCopied : t.events.admin.copyCode }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <template v-if="expanded">
      <div v-if="participants.length === 0" class="py-6">
        <p class="text-sm font-mono text-neutral-400 dark:text-gray-500">{{ t.events.admin.noParticipants }}</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-primary/10 dark:border-gray-700">
              <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.events.admin.nameCol }}</th>
              <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.events.admin.emailCol }}</th>
              <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.events.admin.statusCol }}</th>
              <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2">{{ t.events.admin.registeredAt }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-primary/5 dark:divide-gray-700">
            <tr v-for="p in participants" :key="p.id">
              <td class="py-2.5 pr-4 font-medium text-primary dark:text-gray-100">{{ p.profiles?.full_name ?? '—' }}</td>
              <td class="py-2.5 pr-4 font-mono text-xs text-neutral-500 dark:text-gray-400">{{ p.profiles?.email ?? '—' }}</td>
              <td class="py-2.5 pr-4">
                <span
                  class="inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
                  :class="p.status === 'checked_in'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-neutral-100 dark:bg-gray-700 text-neutral-500 dark:text-gray-400'"
                >
                  {{ p.status === 'checked_in' ? t.events.admin.statusCheckedIn : t.events.admin.statusRegistered }}
                </span>
              </td>
              <td class="py-2.5 font-mono text-xs text-neutral-400 dark:text-gray-500">
                {{ formatDate(p.registered_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '../composables/useI18n'

interface EventRow {
  slug: string
  title: string
  registration_open: boolean
  check_in_code: string
}

interface Participant {
  id: string
  event_slug: string
  user_id: string
  profiles: { full_name: string | null; email: string | null } | null
  status: string
  registered_at: string
  checked_in_at: string | null
}

const props = defineProps<{
  event: EventRow
  participants: Participant[]
  collapsible?: boolean
  copied?: boolean
}>()

defineEmits<{
  'toggle-registration': []
  'copy-code': []
}>()

const { t } = useI18n()

// Upcoming events (collapsible=false) always render expanded, matching the
// prior behavior exactly. Past events (collapsible=true) start collapsed —
// each section owns its own expand state rather than the parent tracking a
// Set of expanded slugs.
const expanded = ref(!props.collapsible)

const registeredCount = computed(() => props.participants.length)
const checkedInCount = computed(() => props.participants.filter((p) => p.status === 'checked_in').length)

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}
</script>
