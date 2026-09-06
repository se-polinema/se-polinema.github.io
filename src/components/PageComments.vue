<template>
  <section class="mt-12 pt-8 border-t border-neutral-200 dark:border-gray-700">
    <h2 class="font-serif text-xl font-bold text-primary dark:text-gray-100 mb-4">
      {{ t.pageComments.heading }}
    </h2>

    <div ref="containerEl" class="giscus" />

    <p v-if="!enabled" class="text-sm text-neutral-500 dark:text-gray-400">
      {{ t.pageComments.signIn }}
    </p>
  </section>
</template>

<script setup lang="ts">
// Giscus comments via its script-tag embed (no npm dependency), backed by
// GitHub Discussions. The term is base-free so production and beta share one
// discussion per page/language. The non-configurable pieces (repo, ids,
// category, term, lang) live in the `data-*` attributes on the script tag;
// theme is applied reactively by posting Giscus's `setConfig` message
// whenever the site theme changes.
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useTheme } from '../composables/useTheme'

const props = defineProps<{
  slug: string
  contentLang: 'en' | 'id'
}>()

const { t } = useI18n()
const { theme } = useTheme()

const containerEl = ref<HTMLElement | null>(null)

const repo = 'se-polinema/se-polinema.github.io'
const repoId = import.meta.env.PUBLIC_GISCUS_REPO_ID as string | undefined
const category = 'Page Comments'
const categoryId = import.meta.env.PUBLIC_GISCUS_CATEGORY_ID as string | undefined

const term = computed(() => `comments/blog/${props.slug}/${props.contentLang}`)
const enabled = computed(() => Boolean(repoId && categoryId))

let scriptEl: HTMLScriptElement | null = null
let loaded = false

function giscusTheme(): string {
  return theme.value === 'dark' ? 'dark' : 'light'
}

function postTheme() {
  if (!containerEl.value) return
  const iframe = containerEl.value.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  if (!iframe?.contentWindow) return
  iframe.contentWindow.postMessage(
    { giscus: { setConfig: { theme: giscusTheme() } } },
    'https://giscus.app'
  )
}

function load() {
  if (!enabled.value || !containerEl.value || scriptEl) return

  // When not configured, containerEl is empty and v-if hides it anyway via
  // the "sign in" hint; nothing to do.
  scriptEl = document.createElement('script')
  scriptEl.src = 'https://giscus.app/client.js'
  scriptEl.async = true
  scriptEl.crossOrigin = 'anonymous'
  scriptEl.setAttribute('data-repo', repo)
  scriptEl.setAttribute('data-repo-id', repoId ?? '')
  scriptEl.setAttribute('data-category', category)
  scriptEl.setAttribute('data-category-id', categoryId ?? '')
  scriptEl.setAttribute('data-mapping', 'specific')
  scriptEl.setAttribute('data-term', term.value)
  scriptEl.setAttribute('data-reactions-enabled', '1')
  scriptEl.setAttribute('data-emit-metadata', '0')
  scriptEl.setAttribute('data-input-position', 'top')
  scriptEl.setAttribute('data-theme', giscusTheme())
  scriptEl.setAttribute('data-lang', props.contentLang)
  scriptEl.setAttribute('data-loading', 'lazy')

  scriptEl.addEventListener('load', () => {
    loaded = true
  })

  containerEl.value.appendChild(scriptEl)
}

onMounted(load)

watch(theme, () => {
  if (!loaded) return
  postTheme()
})

onBeforeUnmount(() => {
  if (scriptEl) {
    scriptEl.remove()
    scriptEl = null
  }
})
</script>
