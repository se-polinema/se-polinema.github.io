<template>
  <section class="mt-12 pt-8 border-t border-neutral-200 dark:border-gray-700">
    <div class="flex items-start gap-3">
      <div class="flex-1">
        <h2 class="font-serif text-lg font-semibold text-primary dark:text-gray-100 mb-1">
          {{ t.pageFeedback.question }}
        </h2>

        <template v-if="state === 'thanked'">
          <div class="flex items-start gap-3 mb-1">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5 text-green-600 dark:text-green-400">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 13.01 9 10.01"/>
            </svg>
            <div>
              <p class="font-mono text-sm font-semibold text-primary dark:text-gray-100">{{ t.pageFeedback.thankYou }}</p>
              <p class="text-sm mt-0.5 text-neutral-600 dark:text-gray-400">{{ t.pageFeedback.thankYouDetail }}</p>
            </div>
          </div>
        </template>

        <template v-else-if="state === 'queued'">
          <p class="text-sm text-neutral-600 dark:text-gray-400">{{ t.pageFeedback.queued }}</p>
        </template>

        <template v-else>
          <div class="flex items-center gap-3 mt-3">
            <button
              type="button"
              @click="selectVote('helpful')"
              :disabled="submitting"
              class="inline-flex items-center gap-2 px-4 py-2 text-sm font-mono border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :class="vote === 'helpful'
                ? 'bg-primary text-white border-primary'
                : 'text-primary/60 dark:text-gray-400 border-primary/20 dark:border-gray-600 hover:border-primary/40 hover:text-primary dark:hover:text-gray-200'"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>
              </svg>
              {{ t.pageFeedback.helpful }}
            </button>
            <button
              type="button"
              @click="selectVote('not_helpful')"
              :disabled="submitting"
              class="inline-flex items-center gap-2 px-4 py-2 text-sm font-mono border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :class="vote === 'not_helpful'
                ? 'bg-primary text-white border-primary'
                : 'text-primary/60 dark:text-gray-400 border-primary/20 dark:border-gray-600 hover:border-primary/40 hover:text-primary dark:hover:text-gray-200'"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/>
              </svg>
              {{ t.pageFeedback.notHelpful }}
            </button>
          </div>

          <div v-if="vote" class="mt-4 space-y-3">
            <div>
              <label :for="commentId" class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">
                {{ vote === 'helpful' ? t.pageFeedback.commentHelpfulLabel : t.pageFeedback.commentLabel }}
              </label>
              <textarea
                :id="commentId"
                v-model="comment"
                :maxlength="500"
                :rows="3"
                :placeholder="t.pageFeedback.commentPlaceholder"
                class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors"
              />
            </div>

            <TurnstileWidget
              ref="turnstileRef"
              size="normal"
              appearance="always"
              @verify="turnstileToken = $event"
              @expire="turnstileToken = ''"
            />

            <p v-if="errorMessage" class="px-3 py-2 text-xs font-mono bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
              {{ errorMessage }}
            </p>

            <button
              type="button"
              @click="submit"
              :disabled="submitting || !turnstileToken"
              class="inline-flex items-center gap-2 px-5 py-2 text-sm font-mono font-semibold text-white bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg v-if="submitting" class="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
              {{ submitting ? t.pageFeedback.submitting : t.pageFeedback.submit }}
            </button>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import { stripBase } from '../lib/paths'
import TurnstileWidget from './TurnstileWidget.vue'

const props = defineProps<{
  pageType: 'tutorial' | 'publication' | 'blog'
  slug: string
  contentLang: 'en' | 'id'
}>()

const { t } = useI18n()

const SESSION_ID_KEY = 'se-feedback-session-id'
const VOTED_PREFIX = 'se-feedback-voted:'
const QUEUE_KEY = 'se-feedback-queue'

type State = 'idle' | 'thanked' | 'queued'

const state = ref<State>('idle')
const vote = ref<'helpful' | 'not_helpful' | null>(null)
const comment = ref('')
const submitting = ref(false)
const errorMessage = ref('')
const turnstileToken = ref('')
const turnstileRef = ref<InstanceType<typeof TurnstileWidget> | null>(null)

const commentId = computed(() => `feedback-comment-${props.pageType}-${props.slug}`)

interface FeedbackPayload {
  page_path: string
  page_type: 'tutorial' | 'publication' | 'blog'
  slug: string
  lang: 'en' | 'id'
  vote: 'helpful' | 'not_helpful'
  comment?: string | null
  visitor_hash: string
  turnstileToken: string
}

// Session-only random id, per browser tab session (sessionStorage). Deriving
// the visitor_hash from this id plus the page path keeps votes anonymous yet
// unique per page per session, and stable across reloads of the same tab.
function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  try {
    let id = sessionStorage.getItem(SESSION_ID_KEY)
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem(SESSION_ID_KEY, id)
    }
    return id
  } catch {
    return ''
  }
}

async function deriveVisitorHash(pagePath: string): Promise<string> {
  const sessionId = getSessionId()
  const raw = `${sessionId}:${pagePath}`
  try {
    if (crypto?.subtle) {
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw))
      return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    }
  } catch {
    // crypto.subtle may be unavailable in insecure (non-HTTPS) contexts.
  }
  // Fallback: a non-cryptographic hash so the widget still works offline/dev.
  let h = 0
  for (let i = 0; i < raw.length; i++) {
    h = (h * 31 + raw.charCodeAt(i)) >>> 0
  }
  return `h${h.toString(16)}`
}

function pagePath(): string {
  if (typeof window === 'undefined') return `/${props.pageType}/${props.slug}`
  return stripBase(window.location.pathname) || `/${props.pageType}/${props.slug}`
}

function votedKey(): string {
  return `${VOTED_PREFIX}${pagePath()}`
}

function isAlreadyVoted(): boolean {
  try {
    return sessionStorage.getItem(votedKey()) === '1'
  } catch {
    return false
  }
}

function markVoted() {
  try {
    sessionStorage.setItem(votedKey(), '1')
  } catch {}
}

type QueueItem = FeedbackPayload & { queuedAt: number }

function readQueue(): QueueItem[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    return raw ? (JSON.parse(raw) as QueueItem[]) : []
  } catch {
    return []
  }
}

function writeQueue(items: QueueItem[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(items))
  } catch {}
}

function selectVote(v: 'helpful' | 'not_helpful') {
  vote.value = v
}

async function submit() {
  if (!vote.value || !turnstileToken.value || submitting.value) return
  submitting.value = true
  errorMessage.value = ''

  const payload: FeedbackPayload = {
    page_path: pagePath(),
    page_type: props.pageType,
    slug: props.slug,
    lang: props.contentLang,
    vote: vote.value,
    comment: comment.value.trim() || null,
    visitor_hash: await deriveVisitorHash(pagePath()),
    turnstileToken: turnstileToken.value,
  }

  try {
    const { supabase } = await import('../lib/supabase')
    const { error } = await supabase.functions.invoke('page-feedback', { body: payload })

    if (!error) {
      markVoted()
      state.value = 'thanked'
      return
    }

    // A 409 duplicate means the visitor already voted this page this session
    // (or offline queue + a prior sync); treat it as success.
    let code: string | null = null
    try {
      const body = await (error as { context?: Response }).context?.json()
      code = body?.error ?? null
    } catch {
      code = null
    }
    if (code === 'duplicate') {
      markVoted()
      state.value = 'thanked'
      return
    }

    throw new Error(code ?? 'insert_failed')
  } catch {
    // Supabase unreachable or offline: queue the vote (sans the spent
    // turnstile token; the enqueue path re-verifies via the widget on retry)
    // and retry on the next page load.
    const { turnstileToken: _tok, ...rest } = payload
    const queue = readQueue()
    queue.push({ ...rest, queuedAt: Date.now() })
    writeQueue(queue)
    state.value = 'queued'
  } finally {
    submitting.value = false
  }
}

// On mount: if this visitor already voted this page this session (same tab),
// show the thank-you state immediately so a reload doesn't let them vote twice.
onMounted(() => {
  if (isAlreadyVoted()) {
    state.value = 'thanked'
  }
})
</script>
