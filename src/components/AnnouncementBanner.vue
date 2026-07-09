<template>
  <div
    v-if="isVisible && mounted"
    ref="bannerRef"
    role="banner"
    :aria-label="bannerMessage"
    :class="[
      'fixed top-0 left-0 right-0 z-[10000] border-b backdrop-blur-sm shadow-md transition-all duration-300',
      typeClasses[config.type] || typeClasses.info,
    ]"
  >
    <div class="section-container py-2.5 md:py-3">
      <div class="flex items-start gap-3">
        <p class="text-xs md:text-sm leading-relaxed flex-1 min-w-0 pt-0.5">
          <span>{{ bannerMessage }}</span>
          <a
            v-if="bannerLink && bannerLinkText"
            :href="bannerLink"
            class="ml-1.5 font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity inline-flex items-center gap-0.5"
          >
            {{ bannerLinkText }}
            <span aria-hidden="true" class="text-[10px]">&rsaquo;</span>
          </a>
        </p>
        <button
          v-if="config.dismissible !== false"
          @click="handleDismiss"
          ref="closeBtn"
          :aria-label="t.announcement.closeLabel"
          class="flex-shrink-0 p-1 -mr-1 opacity-60 hover:opacity-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-1"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from '../composables/useI18n'

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
const bannerRef = ref<HTMLElement | null>(null)
const closeBtn = ref<HTMLButtonElement | null>(null)

const typeClasses: Record<string, string> = {
  info: 'bg-primary/95 text-white border-primary/30',
  warning: 'bg-accent/95 text-white border-accent/30',
  success: 'bg-green-700/95 text-white border-green-700/30',
}

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

  if (isVisible.value && closeBtn.value) {
    closeBtn.value.focus()
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!bannerRef.value) return
    if (e.key === 'Escape') {
      handleDismiss()
    }
  }

  document.addEventListener('keydown', handleKeydown)
})

watch(lang, () => {
  if (isVisible.value && closeBtn.value) {
    closeBtn.value.focus()
  }
})

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
