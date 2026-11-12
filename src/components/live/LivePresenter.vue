<template>
  <div class="live lv-root">
    <!-- Admin gate -->
    <div v-if="gate.state.value !== 'ready'" class="lv-gate">
      <div v-if="gate.state.value === 'loading'" class="lv-muted">{{ t.live.presenter.loading }}</div>

      <div v-else-if="gate.state.value === 'unauthenticated'" class="lv-gate-card">
        <div class="lv-eyebrow">SE Lab · Live</div>
        <h1 class="lv-gate-title">{{ t.live.presenter.signInTitle }}</h1>
        <GitHubSignInButton />
      </div>

      <div v-else-if="gate.state.value === 'unauthorized'" class="lv-gate-card lv-center">
        <p class="lv-error">{{ t.live.presenter.adminOnly }}</p>
        <button class="lv-link" @click="gate.signOut">{{ t.live.presenter.signOut }}</button>
      </div>

      <div v-else class="lv-gate-card lv-center">
        <p class="lv-error">{{ t.events.presentation.bootError }}</p>
        <button class="lv-link" @click="reload">{{ t.live.presenter.reload }}</button>
      </div>
    </div>

    <!-- Session picker -->
    <div v-else-if="!session" class="lv-gate">
      <div class="lv-gate-card">
        <div class="lv-eyebrow">SE Lab · Live</div>
        <h1 class="lv-gate-title">{{ deck.title }}</h1>
        <button class="lv-btn is-primary" :disabled="starting" @click="startNew">{{ t.live.presenter.newSession }}</button>
        <template v-if="past.length">
          <h2 class="lv-gate-sub">{{ t.live.presenter.resume }}</h2>
          <div v-for="s in past" :key="s.id" class="lv-row">
            <button class="lv-btn" :disabled="starting" @click="resumeSession(s)">
              {{ s.code }} · {{ new Date(s.created_at ?? '').toLocaleString() }}
              <span v-if="!s.deck">({{ t.live.presenter.legacy }})</span>
              <span v-if="!s.is_open">({{ t.live.presenter.sessionEnded }})</span>
            </button>
            <button class="lv-btn is-danger" :disabled="starting" :title="t.live.presenter.delete" @click="removeSession(s)">
              {{ t.live.presenter.delete }}
            </button>
          </div>
          <button v-if="endedCount" class="lv-link" :disabled="starting" @click="removeEnded">
            {{ fmtN(t.live.presenter.deleteAllEnded, endedCount) }}
          </button>
        </template>
        <p v-if="startError" class="lv-error">{{ startError }}</p>
        <button class="lv-link" @click="gate.signOut">{{ t.live.presenter.signOut }}</button>
      </div>
    </div>

    <!-- Stage -->
    <template v-else>
      <LiveStage>
        <div ref="stageEl" v-html="stageHtml" @click="onStageClick"></div>
      </LiveStage>

      <div class="lv-bar" :class="{ 'is-hidden': barHidden }">
        <button :title="t.live.presenter.prev" @click="goto(idx - 1)">◀</button>
        <span class="lv-pos">{{ idx + 1 }}/{{ deck.slides.length }}</span>
        <button :title="t.live.presenter.next" @click="goto(idx + 1)">▶</button>
        <template v-if="currentQuestion">
          <span class="lv-sep"></span>
          <button :class="{ 'is-on': session.voting_open }" @click="toggleVote">
            {{ session.voting_open ? t.live.presenter.votingOpen : t.live.presenter.votingClosed }}
          </button>
          <button :class="{ 'is-on': session.reveal }" @click="toggleReveal">
            {{ session.reveal ? t.live.presenter.revealed : t.live.presenter.reveal }}
          </button>
          <span class="lv-pos">{{ fmtN(currentQuestion.kind === 'text' ? t.live.presenter.suggestions : t.live.presenter.votes, liveN) }}<template v-if="liveOther"> · {{ fmtN(t.live.presenter.others, liveOther) }}</template></span>
        </template>
        <span class="lv-sep"></span>
        <button @click="downloadCsv">{{ t.live.presenter.csv }}</button>
        <button @click="endSession">{{ t.live.presenter.end }}</button>
        <span class="lv-pos lv-code-chip">{{ session.code }}</span>
        <button :title="t.live.presenter.copyLink" @click="copyLink()">{{ t.live.presenter.copyLink }}</button>
        <button :title="t.live.presenter.hide" @click="barHidden = true">✕</button>
      </div>
      <div class="lv-toast" :class="{ 'is-on': !!toast }">{{ toast }}</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useAdminGate } from '../../composables/useAdminGate'
import { useI18n } from '../../composables/useI18n'
import { getDeck } from '../../decks'
import { withBase } from '../../lib/paths'
import { paintOptions, paintSuggestions } from '../../lib/live/paint'
import {
  createSession,
  deleteSessions,
  exportCsv,
  getResults,
  listSessions,
  listSuggestions,
  patchSession,
  qid,
  syncQuestions,
} from '../../lib/live/session'
import type { Results, Session } from '../../lib/live/types'
import GitHubSignInButton from '../GitHubSignInButton.vue'
import LiveStage from './LiveStage.vue'
import '../../styles/live.css'

const props = defineProps<{ slug: string }>()
const deck = getDeck(props.slug)!
const { t } = useI18n()
const gate = useAdminGate()

const session = ref<Session | null>(null)
const past = ref<Session[]>([])
const idx = ref(0)
const liveN = ref(0)
const liveOther = ref(0)
const qrUrl = ref('')
const joinUrl = ref('')
const toast = ref('')
const barHidden = ref(false)
const starting = ref(false)
const startError = ref('')
const stageEl = ref<HTMLElement | null>(null)

const slide = computed(() => deck.slides[idx.value])
const currentQuestion = computed(() => deck.questions.find((q) => q.key === slide.value.question) ?? null)
const code = computed(() => session.value?.code ?? '')

// Depends only on slide, code and QR (not on session state), so poll updates never wipe painted results.
const stageHtml = computed(() => {
  if (!code.value) return ''
  const sl = slide.value
  const body = sl.render({ qr: qrUrl.value, joinUrl: joinUrl.value, code: code.value })
  const foot = `<footer><span>${sl.src ? 'Sumber: ' + sl.src : deck.title}</span><span>${sl.appendix ? 'Lampiran · ' : ''}${idx.value + 1}/${deck.slides.length}</span></footer>`
  return `<section class="lv-sl ${sl.bare ? 'is-bare' : ''} ${sl.appendix ? 'is-appx' : ''}">${
    sl.bare ? '' : `<header><h1>${sl.title}</h1></header>`
  }<div class="lv-body">${body}</div>${foot}</section>`
})

const fmtN = (s: string, n: number) => s.replace('{n}', String(n))
const reload = () => location.reload()
const say = (m: string) => {
  toast.value = m
  setTimeout(() => (toast.value = ''), 2500)
}

// Copy the vote link. Clipboard API first; a hidden textarea covers http pages and older browsers.
async function copyLink(btn?: HTMLElement | null) {
  const url = joinUrl.value
  if (!url) return
  let ok = false
  try {
    await navigator.clipboard.writeText(url)
    ok = true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = url
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    ta.remove()
  }
  say(ok ? t.value.live.presenter.linkCopied : url)
  if (ok && btn) {
    const old = btn.textContent
    btn.textContent = t.value.live.presenter.copied
    btn.classList.add('is-done')
    setTimeout(() => {
      btn.textContent = old
      btn.classList.remove('is-done')
    }, 1800)
  }
}

// The slide HTML is injected with v-html, so the copy button is handled by delegation.
function onStageClick(e: MouseEvent) {
  const btn = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-copy-link]')
  if (btn) copyLink(btn)
}

// ---- session lifecycle -------------------------------------------------------
watch(
  () => gate.state.value,
  async (s) => {
    if (s === 'ready') past.value = await listSessions(deck.slug)
  },
)

async function startNew() {
  starting.value = true
  startError.value = ''
  try {
    await begin(await createSession(deck), 0)
  } catch (e) {
    console.error('[LivePresenter] createSession', e)
    startError.value = t.value.live.presenter.startError
  } finally {
    starting.value = false
  }
}

// Resuming re-saves the deck's questions first, so an older session picks up current prompts and "Lainnya".
async function resumeSession(s: Session) {
  starting.value = true
  startError.value = ''
  try {
    await syncQuestions(deck)
    await begin(s, Math.min(s.current_slide ?? 0, deck.slides.length - 1))
  } catch (e) {
    console.error('[LivePresenter] resume', e)
    startError.value = t.value.live.presenter.startError
  } finally {
    starting.value = false
  }
}

const endedCount = computed(() => past.value.filter((s) => !s.is_open).length)

async function removeSession(s: Session) {
  if (!confirm(t.value.live.presenter.deleteConfirm.replace('{code}', s.code))) return
  await removeByIds([s.id])
}

async function removeEnded() {
  const ids = past.value.filter((s) => !s.is_open).map((s) => s.id)
  if (!confirm(fmtN(t.value.live.presenter.deleteAllConfirm, ids.length))) return
  await removeByIds(ids)
}

async function removeByIds(ids: string[]) {
  starting.value = true
  startError.value = ''
  try {
    await deleteSessions(ids)
    past.value = past.value.filter((x) => !ids.includes(x.id))
  } catch (e) {
    console.error('[LivePresenter] delete', e)
    startError.value = t.value.live.presenter.deleteFailed
  } finally {
    starting.value = false
  }
}

async function begin(s: Session, at: number) {
  joinUrl.value = `${location.origin}${withBase('/vote/')}?code=${s.code}`
  const QR = (await import('qrcode')).default
  qrUrl.value = await QR.toDataURL(joinUrl.value, { margin: 1, width: 640, color: { dark: '#004EA2', light: '#ffffff' } })
  session.value = s
  window.addEventListener('keydown', onKey)
  poll = window.setInterval(refresh, 2000)
  await goto(at)
}

async function push(patch: Partial<Session>) {
  if (!session.value) return
  session.value = { ...session.value, ...patch }
  try {
    await patchSession(session.value.id, patch)
  } catch (e) {
    console.error('[LivePresenter] patch', e)
    say(t.value.live.presenter.saveFailed)
  }
}

// ---- navigation --------------------------------------------------------------
async function goto(i: number) {
  idx.value = Math.max(0, Math.min(deck.slides.length - 1, i))
  await nextTick()
  afterRender()
  const q = currentQuestion.value
  await push({
    current_slide: idx.value,
    active_question: q ? qid(deck.slug, q.key) : null,
    voting_open: Boolean(q),
    reveal: false,
  })
  refresh()
}

/** Paint the plain (pre-vote) state into freshly rendered slide HTML; recap slides fetch everything. */
async function afterRender() {
  liveN.value = 0
  liveOther.value = 0
  const q = currentQuestion.value
  const el = stageEl.value
  if (!el) return
  if (q && q.kind !== 'text') {
    const target = el.querySelector<HTMLElement>('.lv-opts')
    if (target) paintOptions(target, q, null, false)
  }
  if (slide.value.recap && deck.paintRecap && session.value) {
    const all: Record<string, Results> = {}
    await Promise.all(
      deck.questions
        .filter((x) => x.kind !== 'text')
        .map(async (x) => {
          try {
            all[x.key] = await getResults(session.value!.id, qid(deck.slug, x.key))
          } catch {
            /* no votes yet */
          }
        }),
    )
    const target = stageEl.value?.querySelector<HTMLElement>('[data-recap]')
    if (target && slide.value.recap) deck.paintRecap(target, all)
  }
}

let poll: number | undefined
async function refresh() {
  const s = session.value
  const q = currentQuestion.value
  const el = stageEl.value
  if (!s || !q || !el) return
  try {
    const id = qid(deck.slug, q.key)
    if (q.kind === 'text') {
      const rows = await listSuggestions(s.id, id)
      liveN.value = rows.length
      const target = el.querySelector<HTMLElement>('[data-suggestions]')
      if (target) (s.reveal ? paintSuggestions(target, rows) : (target.innerHTML = ''))
    } else {
      const res = await getResults(s.id, id)
      liveN.value = res.n
      liveOther.value = res.n_other ?? 0
      const target = el.querySelector<HTMLElement>('.lv-opts')
      if (target) paintOptions(target, q, res, s.reveal)
    }
  } catch {
    /* transient: next tick retries */
  }
  el.querySelectorAll('[data-live]').forEach((n) => {
    n.textContent = fmtN(q.kind === 'text' ? t.value.live.presenter.suggestions : t.value.live.presenter.votes, liveN.value)
  })
}

const toggleVote = () => currentQuestion.value && push({ voting_open: !session.value!.voting_open })
async function toggleReveal() {
  if (!currentQuestion.value || !session.value) return
  await push(session.value.reveal ? { reveal: false } : { reveal: true, voting_open: false })
  await refresh()
}

async function downloadCsv() {
  if (!session.value) return
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([await exportCsv(session.value.id)], { type: 'text/csv' }))
  a.download = `live-${deck.slug}-${session.value.code}.csv`
  a.click()
  say(t.value.live.presenter.csvDone)
}

async function endSession() {
  if (!confirm(t.value.live.presenter.endConfirm)) return
  await push({ is_open: false, voting_open: false })
  say(t.value.live.presenter.ended)
}

function onKey(e: KeyboardEvent) {
  const tag = (e.target as HTMLElement).tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA') return
  if (['ArrowRight', 'PageDown', ' '].includes(e.key)) (e.preventDefault(), goto(idx.value + 1))
  else if (['ArrowLeft', 'PageUp'].includes(e.key)) (e.preventDefault(), goto(idx.value - 1))
  else if (e.key === 'v') toggleVote()
  else if (e.key === 'r') toggleReveal()
  else if (e.key === 'h') barHidden.value = !barHidden.value
  else if (e.key === 'f') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()
}

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  clearInterval(poll)
})
</script>
