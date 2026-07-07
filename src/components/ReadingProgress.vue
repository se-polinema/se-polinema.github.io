<template>
  <div
    class="sticky top-0 z-20 w-full bg-neutral-200/80 dark:bg-gray-700/80"
    style="height: 3px;"
  >
    <div
      class="h-full transition-[width] duration-150 ease-out"
      :class="progress > 0 ? 'bg-[#F5A100]' : 'bg-transparent'"
      :style="{ width: `${progress}%` }"
      role="progressbar"
      :aria-valuenow="Math.round(progress)"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="ariaLabel"
    ></div>
  </div>
  <span class="sr-only" aria-live="polite">{{ ariaLabel }}</span>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const progress = ref(0)

let rafId: number | null = null
let scrollEl: HTMLElement | null = null
let resizeObserver: ResizeObserver | null = null

function getScrollMetrics(): { scrollTop: number; maxScroll: number } {
  if (scrollEl) {
    return {
      scrollTop: scrollEl.scrollTop,
      maxScroll: scrollEl.scrollHeight - scrollEl.clientHeight,
    }
  }
  return {
    scrollTop: window.scrollY || document.documentElement.scrollTop,
    maxScroll: document.documentElement.scrollHeight - window.innerHeight,
  }
}

function updateProgress() {
  const { scrollTop, maxScroll } = getScrollMetrics()
  if (maxScroll <= 0) {
    progress.value = 0
    return
  }
  progress.value = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100))
}

function onScroll() {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = null
    updateProgress()
  })
}

const ariaLabel = computed(() => {
  return t.value.readingProgress.label.replace('{percent}', String(Math.round(progress.value)))
})

onMounted(() => {
  scrollEl = document.getElementById('editor')
  const target = scrollEl || window
  target.addEventListener('scroll', onScroll, { passive: true })

  if (scrollEl) {
    resizeObserver = new ResizeObserver(() => updateProgress())
    resizeObserver.observe(scrollEl)
  }

  updateProgress()
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  const target = scrollEl || window
  target.removeEventListener('scroll', onScroll)
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>
