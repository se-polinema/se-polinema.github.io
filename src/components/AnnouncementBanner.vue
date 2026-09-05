<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div
        v-if="isVisible && mounted"
        class="vscode-dialog-overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="bannerMessage"
        @click.self="config?.dismissible !== false ? handleDismiss() : undefined"
      >
        <div ref="panelEl" class="vscode-dialog-panel" tabindex="-1" @keydown="onKeydown">
          <div class="vscode-dialog-icon" :class="iconClass">
            <svg v-if="config?.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <svg v-else-if="config?.type === 'warning'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>

          <p class="vscode-dialog-message">{{ bannerMessage }}</p>

          <div class="vscode-dialog-actions">
            <button
              v-if="config?.dismissible !== false"
              ref="closeBtn"
              class="vscode-dialog-btn vscode-dialog-btn-ghost"
              :aria-label="t.announcement.closeLabel"
              @click="handleDismiss"
            >
              {{ t.announcement.closeLabel }}
            </button>
            <a
              v-if="bannerLink && bannerLinkText"
              :href="withBase(bannerLink)"
              class="vscode-dialog-btn vscode-dialog-btn-primary"
            >
              {{ bannerLinkText }}
              <span aria-hidden="true">&rsaquo;</span>
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { withBase } from '../lib/paths'
import { useI18n } from '../composables/useI18n'
import '../styles/vscode-dialog.css'

interface AnnouncementConfig {
  enabled: boolean
  dismissible?: boolean
  type: string
  startDate?: string
  endDate?: string
  message: string
  messageId: string
  link?: string
  linkId?: string
  linkText?: string
  linkTextId?: string
  // Row id + updated_at, used only to key the localStorage dismiss hash so
  // an edited announcement re-surfaces to viewers who dismissed the prior
  // version. Absent when there's no live row (never rendered in that case).
  dismissId?: string
}

interface AnnouncementRow {
  id: string
  type: string
  message: string
  message_id: string | null
  link: string | null
  link_id: string | null
  link_text: string | null
  link_text_id: string | null
  dismissible: boolean
  active: boolean
  start_date: string | null
  end_date: string | null
  updated_at: string
}

// Fetched live from Supabase (se.announcements) rather than passed in as a
// build-time prop: this is what makes the banner an admin-can-push-live
// feature instead of one that needs a commit + redeploy. See
// AdminDashboard.vue's Announcements tab for the write side and the
// 20260724001207_announcements.sql migration for the RLS shape (public
// reads active, non-expired rows only).
const { lang, t } = useI18n()

const STORAGE_PREFIX = 'se-lab-ann-'

const mounted = ref(false)
const locallyDismissed = ref(false)
const panelEl = ref<HTMLElement | null>(null)
const closeBtn = ref<HTMLButtonElement | null>(null)
const config = ref<AnnouncementConfig | null>(null)

let channel: { unsubscribe: () => void } | null = null
let expiryTimer: ReturnType<typeof setTimeout> | null = null

function clearExpiryTimer() {
  if (expiryTimer !== null) {
    clearTimeout(expiryTimer)
    expiryTimer = null
  }
}

function rowToConfig(row: AnnouncementRow): AnnouncementConfig {
  return {
    enabled: true,
    dismissible: row.dismissible,
    type: row.type,
    startDate: row.start_date ?? '',
    endDate: row.end_date ?? '',
    message: row.message,
    messageId: row.message_id ?? '',
    link: row.link ?? '',
    linkId: row.link_id ?? '',
    linkText: row.link_text ?? '',
    linkTextId: row.link_text_id ?? '',
    dismissId: `${row.id}:${row.updated_at}`,
  }
}

// Re-derives locallyDismissed from localStorage for whatever row is
// current, rather than the caller guessing: a Realtime event can fire for
// a row that has nothing to do with what's currently dismissed, so this
// must never be reset unconditionally (that would re-pop an already-
// dismissed banner just because some unrelated row changed).
function syncDismissedState() {
  locallyDismissed.value = false
  try {
    const key = dismissKey.value
    if (key && localStorage.getItem(key) === 'true') {
      locallyDismissed.value = true
    }
  } catch {}
}

async function fetchActive() {
  clearExpiryTimer()

  try {
    const { supabase } = await import('../lib/supabase')
    const { data } = await supabase
      .schema('se')
      .from('announcements')
      .select('*')
      .eq('active', true)
      .or(`end_date.is.null,end_date.gt.${new Date().toISOString()}`)
      .order('created_at', { ascending: false })

    const rows = (data ?? []) as AnnouncementRow[]
    const row = rows.find((r) => isInDateRange(rowToConfig(r))) ?? null
    config.value = row ? rowToConfig(row) : null
    syncDismissedState()

    // Realtime only fires on row *changes*: it will never fire purely
    // because the clock crosses end_date. Without this timer, a tab left
    // open past expiration would keep showing an announcement the RLS
    // policy (and every other viewer) has already stopped serving.
    if (row?.end_date) {
      const msUntilExpiry = new Date(row.end_date).getTime() - Date.now()
      if (msUntilExpiry > 0) {
        expiryTimer = setTimeout(() => {
          fetchActive()
        }, msUntilExpiry)
      }
    }
  } catch {
    // Supabase unreachable (offline, misconfigured env); fail closed,
    // same as the rest of this component's defensive try/catch blocks.
    config.value = null
  }
}

const iconClass = computed(() => {
  if (config.value?.type === 'success') return 'vscode-dialog-icon-success'
  if (config.value?.type === 'warning') return 'vscode-dialog-icon-warning'
  return 'vscode-dialog-icon-info'
})

function hashConfig(content: string): string {
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return `${STORAGE_PREFIX}${Math.abs(hash)}`
}

function isInDateRange(row: AnnouncementConfig): boolean {
  if (!row.startDate && !row.endDate) return true
  const now = new Date()
  if (row.startDate && new Date(row.startDate) > now) return false
  if (row.endDate) {
    const end = new Date(row.endDate)
    if (end < now) return false
  }
  return true
}

// Dismissal is keyed by row id + updated_at (not just the message text) so
// editing a live announcement re-surfaces it even to viewers who dismissed
// the previous version.
const dismissKey = computed(() => {
  if (!config.value?.dismissId) return ''
  return hashConfig(config.value.dismissId)
})

const isVisible = computed(() => {
  if (!config.value) return false
  if (!config.value.enabled) return false
  if (!config.value.message) return false
  if (!isInDateRange(config.value)) return false
  if (config.value.dismissible !== false && locallyDismissed.value) return false
  return true
})

const bannerMessage = computed(() =>
  lang.value === 'id' && config.value?.messageId
    ? config.value.messageId
    : config.value?.message ?? '',
)

const bannerLink = computed(() =>
  lang.value === 'id' && config.value?.linkId
    ? config.value.linkId
    : config.value?.link || '',
)

const bannerLinkText = computed(() =>
  lang.value === 'id' && config.value?.linkTextId
    ? config.value.linkTextId
    : config.value?.linkText || '',
)

function focusPanel() {
  if (closeBtn.value) {
    closeBtn.value.focus()
  } else {
    panelEl.value?.focus()
  }
}

onMounted(async () => {
  mounted.value = true

  await fetchActive()
  if (isVisible.value) focusPanel()

  try {
    const { supabase } = await import('../lib/supabase')
    channel = supabase
      .channel('se-announcements')
      .on(
        'postgres_changes',
        { event: '*', schema: 'se', table: 'announcements' },
        () => fetchActive(),
      )
      .subscribe()
  } catch {
    // Realtime unavailable: the banner still works via the initial fetch,
    // it just won't update live in an already-open tab.
  }
})

onUnmounted(() => {
  clearExpiryTimer()
  channel?.unsubscribe()
})

watch(lang, () => {
  if (isVisible.value) focusPanel()
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && config.value?.dismissible !== false) {
    e.preventDefault()
    handleDismiss()
  }
}

function handleDismiss() {
  locallyDismissed.value = true
  try {
    if (dismissKey.value) localStorage.setItem(dismissKey.value, 'true')
  } catch {}

  const skipLink = document.querySelector('.skip-to-content') as HTMLElement | null
  if (skipLink) {
    skipLink.focus()
  }
}
</script>
