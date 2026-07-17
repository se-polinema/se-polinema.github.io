<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div
        v-if="isVisible && mounted"
        class="vscode-dialog-overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="bannerMessage"
        @click.self="config.dismissible !== false ? handleDismiss() : undefined"
      >
        <div ref="panelEl" class="vscode-dialog-panel" tabindex="-1" @keydown="onKeydown">
          <div class="vscode-dialog-icon" :class="iconClass">
            <svg v-if="config.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <svg v-else-if="config.type === 'warning'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
              v-if="config.dismissible !== false"
              ref="closeBtn"
              class="vscode-dialog-btn vscode-dialog-btn-ghost"
              :aria-label="t.announcement.closeLabel"
              @click="handleDismiss"
            >
              {{ t.announcement.closeLabel }}
            </button>
            <a
              v-if="bannerLink && bannerLinkText"
              :href="bannerLink"
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
import { ref, computed, onMounted, watch } from 'vue'
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
}

const props = defineProps<{
  config: AnnouncementConfig
}>()

const { lang, t } = useI18n()

const STORAGE_PREFIX = 'se-lab-ann-'

const mounted = ref(false)
const locallyDismissed = ref(false)
const panelEl = ref<HTMLElement | null>(null)
const closeBtn = ref<HTMLButtonElement | null>(null)

const iconClass = computed(() => {
  if (props.config.type === 'success') return 'vscode-dialog-icon-success'
  if (props.config.type === 'warning') return 'vscode-dialog-icon-warning'
  return 'vscode-dialog-icon-info'
})

function hashConfig(config: AnnouncementConfig): string {
  const content = (config.message || '') + (config.messageId || '')
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return `${STORAGE_PREFIX}${Math.abs(hash)}`
}

function isInDateRange(config: AnnouncementConfig): boolean {
  if (!config.startDate && !config.endDate) return true
  const now = new Date()
  if (config.startDate && new Date(config.startDate) > now) return false
  if (config.endDate) {
    const end = new Date(config.endDate)
    end.setHours(23, 59, 59, 999)
    if (end < now) return false
  }
  return true
}

const dismissKey = computed(() => hashConfig(props.config))

const isVisible = computed(() => {
  if (!props.config.enabled) return false
  if (!props.config.message) return false
  if (!isInDateRange(props.config)) return false
  if (props.config.dismissible !== false && locallyDismissed.value) return false
  return true
})

const bannerMessage = computed(() =>
  lang.value === 'id' && props.config.messageId
    ? props.config.messageId
    : props.config.message,
)

const bannerLink = computed(() =>
  lang.value === 'id' && props.config.linkId
    ? props.config.linkId
    : props.config.link || '',
)

const bannerLinkText = computed(() =>
  lang.value === 'id' && props.config.linkTextId
    ? props.config.linkTextId
    : props.config.linkText || '',
)

onMounted(() => {
  mounted.value = true

  try {
    const key = dismissKey.value
    const stored = localStorage.getItem(key)
    if (stored === 'true') {
      locallyDismissed.value = true
    }
  } catch {}

  if (isVisible.value) {
    if (closeBtn.value) {
      closeBtn.value.focus()
    } else {
      panelEl.value?.focus()
    }
  }
})

watch(lang, () => {
  if (isVisible.value) {
    if (closeBtn.value) {
      closeBtn.value.focus()
    } else {
      panelEl.value?.focus()
    }
  }
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.config.dismissible !== false) {
    e.preventDefault()
    handleDismiss()
  }
}

function handleDismiss() {
  locallyDismissed.value = true
  try {
    localStorage.setItem(dismissKey.value, 'true')
  } catch {}

  const skipLink = document.querySelector('.skip-to-content') as HTMLElement | null
  if (skipLink) {
    skipLink.focus()
  }
}
</script>
