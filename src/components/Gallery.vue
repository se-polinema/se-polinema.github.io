<template>
  <section id="gallery" class="py-20 md:py-32 bg-white dark:bg-gray-900">
    <div class="section-container">
      <div class="section-label">{{ t.gallery.label }}</div>
      <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-gray-100 leading-tight mb-16">
        {{ t.gallery.heading }}
      </h2>

      <!-- Photo grid -->
      <template v-if="gallery.length > 0">
        <!-- NOTE: placeholder data — replace with real event photos in public/images/gallery/ -->
        <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <li
            v-for="item in gallery"
            :key="item.image"
            class="relative group overflow-hidden"
          >
            <img
              :src="item.image"
              :alt="caption(item)"
              class="w-full h-56 object-cover object-center transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div
              class="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end"
            >
              <p class="text-white text-[13px] leading-snug p-4">{{ caption(item) }}</p>
            </div>
          </li>
        </ul>
      </template>

      <!-- Empty state -->
      <template v-else>
        <div class="text-center py-20 border border-dashed border-primary/10 dark:border-gray-600">
          <div class="font-mono text-5xl text-primary/10 mb-4 select-none">&#9632;</div>
          <p class="text-neutral-400 dark:text-gray-500 text-sm max-w-sm mx-auto">{{ t.gallery.empty }}</p>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import rawGallery from '../data/gallery.json'

const { lang, t } = useI18n()

interface GalleryItem {
  image: string
  caption: { id: string; en: string }
  _placeholder?: boolean
}

const gallery = rawGallery as GalleryItem[]

function caption(item: GalleryItem): string {
  return lang.value === 'id' ? item.caption.id : item.caption.en
}
</script>
