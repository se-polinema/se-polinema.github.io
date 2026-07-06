<template>
  <div class="project-gallery w-full">
    <!-- Main image / placeholder -->
    <div class="relative border border-primary/10 dark:border-gray-700 rounded-xl overflow-hidden bg-neutral-100 dark:bg-gray-800 aspect-video">
      <img
        :src="currentImage"
        :alt="alt"
        class="w-full h-full object-cover"
        loading="lazy"
      />

      <!-- Navigation arrows (only if multiple images) -->
      <template v-if="images.length > 1">
        <button
          @click="prev"
          class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 border border-primary/10 dark:border-gray-600 flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm"
          :aria-label="t.projects.previousImage"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary dark:text-gray-200"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button
          @click="next"
          class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 border border-primary/10 dark:border-gray-600 flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm"
          :aria-label="t.projects.nextImage"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary dark:text-gray-200"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        <!-- Dot indicators -->
        <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          <button
            v-for="(img, i) in images"
            :key="i"
            @click="currentIndex = i"
            class="w-2.5 h-2.5 rounded-full transition-all border border-primary/20 dark:border-gray-500"
            :class="i === currentIndex ? 'bg-primary dark:bg-blue-500 border-primary dark:border-blue-500 scale-110' : 'bg-white/80 dark:bg-gray-700/80'"
            :aria-label="`${t.projects.images} ${i + 1}`"
          />
        </div>
      </template>
    </div>

    <!-- Thumbnail strip (only if multiple images) -->
    <div v-if="images.length > 1" class="flex gap-2 mt-3 overflow-x-auto pb-1">
      <button
        v-for="(img, i) in images"
        :key="i"
        @click="currentIndex = i"
        class="shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-colors"
        :class="i === currentIndex ? 'border-primary dark:border-blue-500' : 'border-primary/10 dark:border-gray-700 opacity-70 hover:opacity-100'"
      >
        <img :src="img" :alt="`${alt} ${i + 1}`" class="w-full h-full object-cover" loading="lazy" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '../composables/useI18n'

const props = defineProps<{
  images: string[]
  placeholder: string
  alt: string
}>()

const { t } = useI18n()
const currentIndex = ref(0)

const currentImage = computed(() =>
  props.images.length > 0 ? props.images[currentIndex.value] : props.placeholder,
)

function prev() {
  if (props.images.length > 0) {
    currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
  }
}

function next() {
  if (props.images.length > 0) {
    currentIndex.value = (currentIndex.value + 1) % props.images.length
  }
}
</script>
