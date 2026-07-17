<template>
  <div class="relative">
    <!-- Scroll track -->
    <div
      ref="trackRef"
      class="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth"
      style="-webkit-overflow-scrolling: touch; scrollbar-width: none;"
    >
      <slot />
    </div>

    <!-- Prev/Next buttons (hidden when not needed) -->
    <div v-if="showButtons" class="flex items-center gap-2 mt-4">
      <button
        @click="scroll(-1)"
        :disabled="atStart"
        class="w-9 h-9 flex items-center justify-center rounded border transition-colors"
        :class="atStart
          ? 'border-neutral-100 dark:border-gray-700 text-neutral-300 dark:text-gray-600 cursor-not-allowed'
          : 'border-primary/20 dark:border-gray-600 text-primary dark:text-gray-300 hover:border-accent dark:hover:border-yellow-400 hover:text-accent dark:hover:text-yellow-400'"
        :aria-label="t.carousel.prev"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button
        @click="scroll(1)"
        :disabled="atEnd"
        class="w-9 h-9 flex items-center justify-center rounded border transition-colors"
        :class="atEnd
          ? 'border-neutral-100 dark:border-gray-700 text-neutral-300 dark:text-gray-600 cursor-not-allowed'
          : 'border-primary/20 dark:border-gray-600 text-primary dark:text-gray-300 hover:border-accent dark:hover:border-yellow-400 hover:text-accent dark:hover:text-yellow-400'"
        :aria-label="t.carousel.next"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../composables/useI18n'

const props = withDefaults(defineProps<{
  /** Auto-advance the carousel when it's not being interacted with. Off by default. */
  autoplay?: boolean
  /** Milliseconds between auto-advance ticks. */
  intervalMs?: number
}>(), {
  autoplay: false,
  intervalMs: 4500,
})

const { t } = useI18n()
const trackRef = ref<HTMLElement | null>(null)
const showButtons = ref(false)
const atStart = ref(true)
const atEnd = ref(false)

const CARD_WIDTH = 320 + 20 // card width + gap

function updateState() {
  const el = trackRef.value
  if (!el) return
  showButtons.value = el.scrollWidth > el.clientWidth + 4
  atStart.value = el.scrollLeft <= 4
  atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
}

function scroll(dir: 1 | -1) {
  trackRef.value?.scrollBy({ left: dir * CARD_WIDTH, behavior: 'smooth' })
}

let autoplayTimer: ReturnType<typeof setInterval> | null = null

function tick() {
  const el = trackRef.value
  if (!el || !showButtons.value) return
  if (atEnd.value) {
    el.scrollTo({ left: 0, behavior: 'smooth' })
  } else {
    scroll(1)
  }
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function startAutoplay() {
  if (!props.autoplay || !showButtons.value || prefersReducedMotion()) return
  stopAutoplay()
  autoplayTimer = setInterval(tick, props.intervalMs)
}

function stopAutoplay() {
  if (autoplayTimer !== null) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

onMounted(() => {
  const el = trackRef.value
  if (!el) return
  updateState()
  el.addEventListener('scroll', updateState, { passive: true })
  const ro = new ResizeObserver(updateState)
  ro.observe(el)

  // Pause autoplay on hover, keyboard focus, or an in-flight drag/swipe —
  // the standard accessible-carousel pattern — and resume once the user
  // steps away. pointerenter/pointerleave don't bubble for child elements,
  // so moving between cards inside the track doesn't spuriously toggle this.
  el.addEventListener('pointerenter', stopAutoplay)
  el.addEventListener('pointerleave', startAutoplay)
  el.addEventListener('focusin', stopAutoplay)
  el.addEventListener('focusout', startAutoplay)
  el.addEventListener('pointerdown', stopAutoplay)
  el.addEventListener('pointerup', startAutoplay)

  startAutoplay()

  onUnmounted(() => {
    el.removeEventListener('scroll', updateState)
    ro.disconnect()
    el.removeEventListener('pointerenter', stopAutoplay)
    el.removeEventListener('pointerleave', startAutoplay)
    el.removeEventListener('focusin', stopAutoplay)
    el.removeEventListener('focusout', startAutoplay)
    el.removeEventListener('pointerdown', stopAutoplay)
    el.removeEventListener('pointerup', startAutoplay)
    stopAutoplay()
  })
})
</script>

<style scoped>
div::-webkit-scrollbar { display: none; }
</style>
