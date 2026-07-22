<template>
  <div ref="containerEl" />
</template>

<script setup lang="ts">
// Thin wrapper around Cloudflare Turnstile's explicit-render API. Shared by
// NewsletterForm/MemberSubmissionForm (verified server-side by the
// subscribe-newsletter/submit-member Edge Functions) — see
// docs/issue-10-form-abuse-protection.md.
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  size?: 'normal' | 'compact'
  // 'interaction-only' keeps the widget invisible unless Cloudflare flags
  // something — used by NewsletterForm's cramped "minimal" footer variant,
  // where a normal always-visible widget doesn't fit.
  appearance?: 'always' | 'interaction-only'
}>(), {
  size: 'normal',
  appearance: 'always',
})

const emit = defineEmits<{
  verify: [token: string]
  expire: []
  error: []
}>()

const containerEl = ref<HTMLElement | null>(null)
let widgetId: string | undefined

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
let scriptLoadingPromise: Promise<void> | null = null

// Module-level singleton so multiple widget instances on one page (e.g.
// NewsletterForm rendered in both Footer.vue and BottomPanel.vue) share a
// single script load instead of racing to inject it twice.
function loadTurnstileScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if ((window as any).turnstile) return Promise.resolve()
  if (scriptLoadingPromise) return scriptLoadingPromise

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Turnstile script'))
    document.head.appendChild(script)
  })

  return scriptLoadingPromise
}

onMounted(async () => {
  const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined
  // No-ops without a configured site key (mirrors src/lib/supabase.ts's
  // placeholder-fallback philosophy) — local dev without Turnstile
  // provisioned just never emits a token, so gated submit buttons stay
  // disabled rather than throwing.
  if (!siteKey || !containerEl.value) return

  try {
    await loadTurnstileScript()
  } catch (err) {
    console.error(err)
    emit('error')
    return
  }

  const turnstile = (window as any).turnstile
  if (!turnstile || !containerEl.value) return

  widgetId = turnstile.render(containerEl.value, {
    sitekey: siteKey,
    size: props.size,
    appearance: props.appearance,
    callback: (token: string) => emit('verify', token),
    'expired-callback': () => emit('expire'),
    'error-callback': () => emit('error'),
  })
})

onBeforeUnmount(() => {
  const turnstile = (window as any).turnstile
  if (widgetId && turnstile) {
    turnstile.remove(widgetId)
  }
})

function reset() {
  const turnstile = (window as any).turnstile
  if (widgetId && turnstile) {
    turnstile.reset(widgetId)
  }
}

defineExpose({ reset })
</script>
