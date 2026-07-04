<template>
  <div class="share-buttons border-t border-neutral-200 dark:border-gray-700 pt-6">
    <h2 class="font-serif text-lg font-semibold text-primary dark:text-gray-100 mb-3">
      {{ t.share.title }}
    </h2>

    <div class="flex flex-wrap items-center gap-2">
      <!-- Native share (mobile) -->
      <button
        v-if="hasNativeShare"
        class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-neutral-300 dark:border-gray-600 text-neutral-600 dark:text-gray-400 hover:bg-neutral-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
        :aria-label="t.share.title"
        @click="nativeShare"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        <span>{{ t.share.title }}</span>
      </button>

      <!-- Individual network buttons (desktop fallback or all) -->
      <template v-if="!hasNativeShare">
        <button
          v-for="network in networks"
          :key="network.key"
          class="inline-flex items-center justify-center w-9 h-9 border border-neutral-300 dark:border-gray-600 text-neutral-600 dark:text-gray-400 hover:bg-neutral-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          :aria-label="network.label"
          :title="network.label"
          @click="openShareUrl(network.url)"
        >
          <svg v-if="network.key === 'x'" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <svg v-else-if="network.key === 'facebook'" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
          </svg>
          <svg v-else-if="network.key === 'linkedin'" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/>
          </svg>
          <svg v-else-if="network.key === 'whatsapp'" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <svg v-else-if="network.key === 'telegram'" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M21.935 2.197c-.604-.265-1.115-.303-1.67-.13L2.34 8.78c-.644.22-.78.51-.736.786.048.305.304.535.64.69l3.697 2.166 5.47-3.011c.315-.173.594-.068.38.165l-4.5 4.687-.143 4.743c.065.447.379.582.725.412.317-.156.478-.334.675-.53l1.98-1.778 3.642 2.988c.689.473 1.173.37 1.402-.127l3.772-14.878c.195-.782-.143-1.236-.775-1.124zM22.592 4.102l-3.77 14.87c-.144.518-.476.643-.877.37l-4.415-3.627-2.873 2.577c-.227.204-.377.284-.593.284-.088 0-.18-.02-.275-.061-.297-.127-.39-.44-.449-.783l.174-5.787 8.18-8.528c.186-.194.046-.28-.185-.137l-10.082 5.54-4.28-2.507c-.322-.148-.503-.396-.518-.663-.016-.289.110-.543.52-.683l17.944-6.67c.397-.135.733-.072.882.064.147.135.197.385.084.845z"/>
          </svg>
        </button>
      </template>

      <!-- Copy link -->
      <button
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-neutral-300 dark:border-gray-600 text-neutral-600 dark:text-gray-400 hover:bg-neutral-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
        :aria-label="t.share.copyLink"
        @click="copyLink"
      >
        <svg v-if="!copied" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
        </svg>
        <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>{{ copied ? t.share.linkCopied : t.share.copyLink }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '../composables/useI18n'

const props = withDefaults(defineProps<{
  url: string
  title: string
  description?: string
  lang?: 'en' | 'id'
}>(), {
  lang: 'en',
})

const { t } = useI18n()

const copied = ref(false)
const hasNativeShare = ref(typeof navigator !== 'undefined' && !!navigator.share)

const encodedUrl = computed(() => encodeURIComponent(props.url))
const encodedTitle = computed(() => encodeURIComponent(props.title))
const encodedDescription = computed(() => encodeURIComponent(props.description ?? props.title))

const networks = computed(() => [
  {
    key: 'x',
    label: t.value.share.shareOnX,
    url: `https://twitter.com/intent/tweet?url=${encodedUrl.value}&text=${encodedTitle.value}`,
  },
  {
    key: 'facebook',
    label: t.value.share.shareOnFacebook,
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl.value}`,
  },
  {
    key: 'linkedin',
    label: t.value.share.shareOnLinkedIn,
    url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl.value}`,
  },
  {
    key: 'whatsapp',
    label: t.value.share.shareOnWhatsApp,
    url: `https://wa.me/?text=${encodedTitle.value}%20${encodedUrl.value}`,
  },
  {
    key: 'telegram',
    label: t.value.share.shareOnTelegram,
    url: `https://t.me/share/url?url=${encodedUrl.value}&text=${encodedTitle.value}`,
  },
])

function openShareUrl(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

async function nativeShare() {
  try {
    await navigator.share({
      title: props.title,
      text: props.description ?? props.title,
      url: props.url,
    })
  } catch {
    // user cancelled or not supported
  }
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.url)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = props.url
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<style scoped>
.share-buttons button {
  transition: background-color 0.15s, color 0.15s, border-color 0.15s;
}

@media (prefers-reduced-motion: reduce) {
  .share-buttons button {
    transition: none;
  }
}
</style>
