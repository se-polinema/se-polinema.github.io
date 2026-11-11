<template>
  <div class="live lv-voter">
    <!-- no code yet: manual entry -->
    <div v-if="!code" class="lv-card">
      <h1 class="lv-title">{{ t.live.voter.title }}</h1>
      <p class="lv-muted">{{ t.live.voter.enterCode }}</p>
      <form class="lv-join-form" @submit.prevent="goCode">
        <input v-model="typed" class="lv-input lv-code-input" maxlength="8" :placeholder="t.live.voter.codePlaceholder" autocapitalize="characters" autocomplete="off" />
        <button class="lv-btn is-primary" type="submit">{{ t.live.voter.join }}</button>
      </form>
    </div>

    <div v-else-if="loading" class="lv-card lv-center lv-muted">{{ t.events.admin.loading }}</div>

    <div v-else-if="!session" class="lv-card">
      <h1 class="lv-title">{{ t.live.voter.notFound }}</h1>
      <p class="lv-muted">{{ t.live.voter.notFoundHint }}</p>
      <a class="lv-btn" :href="backHref">{{ t.live.voter.back }}</a>
    </div>

    <template v-else>
      <header class="lv-vhead">
        <b>{{ session.title }}</b>
        <small>{{ t.live.voter.code }} {{ session.code }}</small>
      </header>

      <div v-if="!session.is_open" class="lv-card lv-center">
        <h2 class="lv-title">{{ t.live.voter.ended }}</h2>
        <p class="lv-muted">{{ t.live.voter.endedHint }}</p>
      </div>

      <div v-else-if="!question" class="lv-card lv-center">
        <div class="lv-pulse"></div>
        <h2 class="lv-title">{{ t.live.voter.waiting }}</h2>
        <p class="lv-muted">{{ t.live.voter.waitingHint }}</p>
      </div>

      <!-- free text -->
      <div v-else-if="question.kind === 'text'" class="lv-card">
        <span v-if="question.area" class="lv-chip">{{ question.area }}</span>
        <h2 class="lv-title">{{ question.prompt }}</h2>
        <p class="lv-muted">{{ t.live.voter.suggestionHint }}</p>
        <textarea v-model="draft" class="lv-input" rows="6" maxlength="1000" :placeholder="t.live.voter.suggestionPlaceholder" :disabled="!session.voting_open"></textarea>
        <p class="lv-muted">{{ draft.length }}/1000 · {{ fmtN(t.live.voter.sentFromDevice, mySug) }}</p>
        <button v-if="session.voting_open" class="lv-btn is-primary is-big" :disabled="busy" @click="sendSuggestion">{{ t.live.voter.suggestionSend }}</button>
        <p v-else class="lv-muted">{{ t.live.voter.suggestionClosed }}</p>
        <p :class="flashOk ? 'lv-muted' : 'lv-error'">{{ flash }}</p>
      </div>

      <!-- choice -->
      <div v-else class="lv-card">
        <span v-if="question.area" class="lv-chip">{{ question.area }}</span>
        <h2 class="lv-title">{{ question.prompt }}</h2>
        <p class="lv-muted">{{ maxChoices > 1 ? fmtN(t.live.voter.pickMax, maxChoices) : t.live.voter.pickOne }}</p>

        <div class="lv-vopts">
          <template v-if="session.reveal && results">
            <div v-for="o in question.options" :key="o.key" class="lv-vopt is-res" :class="{ 'is-mine': mine.includes(o.key) }">
              <i :style="{ width: pct(o.key) + '%' }"></i>
              <span>{{ o.label }} <em v-if="mine.includes(o.key)">{{ t.live.voter.yourChoice }}</em></span>
              <b>{{ Math.round(pct(o.key)) }}%</b>
            </div>
            <p class="lv-muted">{{ fmtN(t.live.voter.voters, results.n) }}</p>
          </template>
          <template v-else>
            <button v-for="o in question.options" :key="o.key" class="lv-vopt" :class="{ 'is-on': chosen.includes(o.key) }" :disabled="!session.voting_open" @click="toggle(o.key)">
              <span class="lv-box">{{ chosen.includes(o.key) ? '✓' : '' }}</span>
              <span>{{ o.label }}<small v-if="o.note" class="lv-vnote">{{ o.note }}</small></span>
            </button>
          </template>
        </div>

        <div v-if="question.allow_other && !(session.reveal && results)" class="lv-other-box">
          <label>{{ t.live.voter.otherLabel }}</label>
          <textarea v-model="otherText" class="lv-input" rows="3" maxlength="300" :placeholder="t.live.voter.otherPlaceholder" :disabled="!session.voting_open"></textarea>
        </div>

        <button v-if="session.voting_open && !session.reveal" class="lv-btn is-primary is-big" :disabled="busy || (!chosen.length && !otherText.trim()) || !changed" @click="send">
          {{ sent ? t.live.voter.change : t.live.voter.submit }}
        </button>
        <p :class="flash ? 'lv-error' : 'lv-muted'">{{ flash || status }}</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from '../../composables/useI18n'
import { withBase } from '../../lib/paths'
import {
  castVote,
  errCode,
  findSession,
  getQuestion,
  getResults,
  getSession,
  mySuggestionCount,
  myOther,
  myVote,
  submitSuggestion,
  watchSession,
} from '../../lib/live/session'
import type { QuestionRow, Results, Session } from '../../lib/live/types'
import '../../styles/live.css'

const { t } = useI18n()

const code = ref('')
const typed = ref('')
const loading = ref(true)
const session = ref<Session | null>(null)
const question = ref<QuestionRow | null>(null)
const results = ref<Results | null>(null)
const sel = ref<Record<string, string[]>>({})
const sentMap = ref<Record<string, string[] | null>>({})
const otherMap = ref<Record<string, string>>({})
const sentOtherMap = ref<Record<string, string>>({})
const draft = ref('')
const mySug = ref(0)
const flash = ref('')
const flashOk = ref(false)
const busy = ref(false)
const backHref = withBase('/vote/')

let sig = ''
let unwatch: (() => void) | undefined
let poll: number | undefined

const qkey = computed(() => question.value?.key ?? '')
const maxChoices = computed(() => (question.value?.kind === 'single' ? 1 : question.value?.max_choices ?? 1))
const chosen = computed(() => sel.value[qkey.value] ?? [])
const sent = computed(() => sentMap.value[qkey.value] ?? null)
const mine = computed(() => sent.value ?? [])
const otherText = computed({
  get: () => otherMap.value[qkey.value] ?? '',
  set: (v: string) => (otherMap.value = { ...otherMap.value, [qkey.value]: v }),
})
const changed = computed(
  () =>
    !sent.value ||
    [...sent.value].sort().join() !== [...chosen.value].sort().join() ||
    (sentOtherMap.value[qkey.value] ?? '') !== otherText.value.trim(),
)
const status = computed(() => {
  const s = session.value
  if (!s) return ''
  if (s.reveal) return t.value.live.voter.resultsShown
  if (!s.voting_open) return t.value.live.voter.closed
  return sent.value ? t.value.live.voter.sent : ''
})

const fmtN = (s: string, n: number) => s.replace('{n}', String(n))
const pct = (k: string) => (results.value?.n ? ((results.value.counts[k] ?? 0) / results.value.n) * 100 : 0)

function goCode() {
  const v = typed.value.trim().toUpperCase()
  if (v) location.href = `${backHref}?code=${encodeURIComponent(v)}`
}

async function apply(next: Session) {
  session.value = next
  const s = [next.is_open, next.active_question, next.voting_open, next.reveal].join('|')
  if (s === sig) return
  sig = s
  flash.value = ''
  question.value = next.active_question ? await getQuestion(next.active_question) : null
  const q = question.value
  if (q) {
    if (q.kind === 'text') mySug.value = await mySuggestionCount(next.id)
    else if (sentMap.value[q.key] === undefined) {
      const m = await myVote(next.id, q.key)
      sentMap.value = { ...sentMap.value, [q.key]: m }
      if (m) {
        sel.value = { ...sel.value, [q.key]: [...m] }
        const o = await myOther(next.id, q.key)
        sentOtherMap.value = { ...sentOtherMap.value, [q.key]: o }
        if (o && otherMap.value[q.key] === undefined) otherMap.value = { ...otherMap.value, [q.key]: o }
      }
    }
  }
  results.value = null
  if (q && q.kind !== 'text' && next.reveal) {
    try {
      results.value = await getResults(next.id, q.key)
    } catch {
      /* shown as plain choices */
    }
  }
}

function toggle(k: string) {
  const cur = chosen.value
  let next: string[]
  if (cur.includes(k)) next = cur.filter((x) => x !== k)
  else if (maxChoices.value === 1) next = [k]
  else if (cur.length < maxChoices.value) next = [...cur, k]
  else {
    flash.value = fmtN(t.value.live.voter.maxReached, maxChoices.value)
    return
  }
  flash.value = ''
  sel.value = { ...sel.value, [qkey.value]: next }
}

async function send() {
  if (!session.value || !question.value) return
  busy.value = true
  flash.value = ''
  try {
    const other = otherText.value.trim()
    await castVote(session.value.id, qkey.value, chosen.value, other)
    sentMap.value = { ...sentMap.value, [qkey.value]: [...chosen.value] }
    sentOtherMap.value = { ...sentOtherMap.value, [qkey.value]: other }
  } catch (e) {
    flash.value = t.value.live.errors[errCode(e)]
  } finally {
    busy.value = false
  }
}

async function sendSuggestion() {
  if (!session.value) return
  const body = draft.value.trim()
  flashOk.value = false
  if (!body) {
    flash.value = t.value.live.voter.suggestionEmpty
    return
  }
  busy.value = true
  try {
    mySug.value = await submitSuggestion(session.value.id, body)
    draft.value = ''
    flashOk.value = true
    flash.value = t.value.live.voter.suggestionSent
  } catch (e) {
    flash.value = t.value.live.errors[errCode(e)]
  } finally {
    busy.value = false
  }
}

async function sync() {
  if (!session.value) return
  try {
    const s = await getSession(session.value.id)
    // A deleted (or ended, hence hidden) session no longer exists for a voter: show the ended card.
    apply(s ?? { ...session.value, is_open: false, voting_open: false })
  } catch {
    /* transient network error: keep the current state and retry on the next tick */
  }
}

onMounted(async () => {
  code.value = (new URLSearchParams(location.search).get('code') ?? '').trim().toUpperCase()
  if (!code.value) {
    loading.value = false
    return
  }
  const s = await findSession(code.value)
  loading.value = false
  if (!s) return
  await apply(s)
  unwatch = watchSession(s.id, apply)
  poll = window.setInterval(sync, 4000) // fallback if the realtime socket drops
  document.addEventListener('visibilitychange', onVisible)
})

const onVisible = () => {
  if (!document.hidden) sync()
}

onBeforeUnmount(() => {
  unwatch?.()
  clearInterval(poll)
  document.removeEventListener('visibilitychange', onVisible)
})
</script>
