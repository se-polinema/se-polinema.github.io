<template>
  <div
    v-if="consent === 'pending' && mounted"
    ref="bannerRef"
    role="dialog"
    aria-modal="false"
    :aria-label="t.cookieConsent.bannerLabel"
    class="fixed bottom-0 left-0 right-0 z-[9999] border-t border-neutral-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg"
  >
    <div class="section-container py-4 md:py-5">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p class="text-xs md:text-sm text-neutral-600 dark:text-gray-300 leading-relaxed flex-1">
          {{ t.cookieConsent.message }}
          <a
            :href="withBase('/privacy')"
            class="text-primary dark:text-gray-200 hover:text-accent-700 dark:hover:text-accent-400 underline underline-offset-2 transition-colors"
          >{{ t.cookieConsent.learnMore }}</a>
        </p>
        <div class="flex items-center gap-2 flex-shrink-0">
          <button
            @click="handleAccept"
            ref="acceptBtn"
            class="px-4 py-1.5 text-xs font-mono font-semibold bg-primary text-white hover:bg-primary/90 dark:hover:bg-primary/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
          >
            {{ t.cookieConsent.accept }}
          </button>
          <button
            @click="handleDismiss"
            class="px-4 py-1.5 text-xs font-mono text-neutral-500 dark:text-gray-400 hover:text-primary dark:hover:text-gray-200 transition-colors underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
          >
            {{ t.cookieConsent.dismiss }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import { withBase } from '../lib/paths'
import { useConsent } from '../composables/useConsent'

const { t } = useI18n()
const { consent, grant, deny } = useConsent()

const mounted = ref(false)
const bannerRef = ref<HTMLElement | null>(null)
const acceptBtn = ref<HTMLButtonElement | null>(null)

onMounted(() => {
  mounted.value = true
  acceptBtn.value?.focus()

  function handleKeydown(e: KeyboardEvent) {
    if (!bannerRef.value) return
    if (e.key === 'Escape') {
      handleDismiss()
    }
  }

  document.addEventListener('keydown', handleKeydown)
})

function handleAccept() {
  grant()
}

function handleDismiss() {
  deny()
}
</script>
