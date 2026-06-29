<template>
  <div class="px-8 py-5">
    <!-- Sign-in form -->
    <div v-if="authState === 'unauthenticated'" class="max-w-sm">
      <h1 class="font-serif text-2xl font-bold text-primary dark:text-gray-100 mb-6">
        {{ t.events.admin.heading }}
      </h1>
      <form @submit.prevent="handleSignIn" class="space-y-4">
        <div v-if="signInError" class="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-mono">
          {{ signInError }}
        </div>
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">
            {{ t.events.admin.emailLabel }}
          </label>
          <input
            v-model="signInForm.email"
            type="email"
            required
            class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors"
          />
        </div>
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">
            {{ t.events.admin.passwordLabel }}
          </label>
          <input
            v-model="signInForm.password"
            type="password"
            required
            class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors"
          />
        </div>
        <button
          type="submit"
          :disabled="signingIn"
          class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono font-semibold text-white bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg v-if="signingIn" class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
          </svg>
          {{ signingIn ? t.events.admin.signingIn : t.events.admin.signIn }}
        </button>
      </form>
    </div>

    <!-- Loading -->
    <div v-else-if="authState === 'loading'" class="py-20 text-center">
      <p class="text-sm font-mono text-neutral-400 dark:text-gray-500">{{ t.events.admin.loading }}</p>
    </div>

    <!-- Unauthorized -->
    <div v-else-if="authState === 'unauthorized'" class="py-10">
      <p class="text-sm font-mono text-red-600 dark:text-red-400 mb-4">{{ t.events.admin.unauthorized }}</p>
      <button @click="handleSignOut" class="text-xs font-mono text-primary/40 dark:text-gray-500 hover:text-primary dark:hover:text-gray-100 transition-colors">
        {{ t.events.admin.signOut }}
      </button>
    </div>

    <!-- Dashboard -->
    <div v-else-if="authState === 'admin'">
      <div class="flex items-center justify-between mb-8">
        <h1 class="font-serif text-2xl font-bold text-primary dark:text-gray-100">
          {{ t.events.admin.heading }}
        </h1>
        <button
          @click="handleSignOut"
          class="text-xs font-mono text-primary/40 dark:text-gray-500 hover:text-primary dark:hover:text-gray-100 transition-colors"
        >
          {{ t.events.admin.signOut }}
        </button>
      </div>

      <div v-if="loadingData" class="py-10 text-center">
        <p class="text-sm font-mono text-neutral-400 dark:text-gray-500">{{ t.events.admin.loading }}</p>
      </div>

      <div v-else class="space-y-12">
        <section v-for="event in events" :key="event.slug">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 pb-3 border-b border-primary/10 dark:border-gray-700">
            <div>
              <h2 class="font-serif text-lg font-semibold text-primary dark:text-gray-100">{{ event.title }}</h2>
              <p class="text-xs font-mono text-neutral-400 dark:text-gray-500 mt-0.5">
                {{ participantCounts(event.slug).registered }} {{ t.events.admin.registeredCount }}
                &nbsp;·&nbsp;
                {{ participantCounts(event.slug).checkedIn }} {{ t.events.admin.checkedInCount }}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-right">
                <div class="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-0.5">{{ t.events.admin.checkInCode }}</div>
                <div class="flex items-center gap-2">
                  <code class="text-sm font-mono font-bold text-accent bg-accent/10 px-2 py-0.5">{{ event.check_in_code }}</code>
                  <button
                    @click="copyCode(event.check_in_code)"
                    class="text-xs font-mono text-primary/40 dark:text-gray-500 hover:text-primary dark:hover:text-gray-100 transition-colors"
                  >
                    {{ copiedSlug === event.slug ? t.events.admin.codeCopied : t.events.admin.copyCode }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="participantsByEvent[event.slug]?.length === 0" class="py-6">
            <p class="text-sm font-mono text-neutral-400 dark:text-gray-500">{{ t.events.admin.noParticipants }}</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-primary/10 dark:border-gray-700">
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.events.admin.nameCol }}</th>
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.events.admin.emailCol }}</th>
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.events.admin.identifierCol }}</th>
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.events.admin.statusCol }}</th>
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2">{{ t.events.admin.registeredAt }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-primary/5 dark:divide-gray-700">
                <tr v-for="p in participantsByEvent[event.slug]" :key="p.id">
                  <td class="py-2.5 pr-4 font-medium text-primary dark:text-gray-100">{{ p.name }}</td>
                  <td class="py-2.5 pr-4 font-mono text-xs text-neutral-500 dark:text-gray-400">{{ p.email }}</td>
                  <td class="py-2.5 pr-4 font-mono text-xs text-neutral-500 dark:text-gray-400">{{ p.identifier ?? '—' }}</td>
                  <td class="py-2.5 pr-4">
                    <span
                      class="inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
                      :class="p.status === 'checked_in'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-neutral-100 dark:bg-gray-700 text-neutral-500 dark:text-gray-400'"
                    >
                      {{ p.status === 'checked_in' ? t.events.admin.statusCheckedIn : t.events.admin.statusRegistered }}
                    </span>
                  </td>
                  <td class="py-2.5 font-mono text-xs text-neutral-400 dark:text-gray-500">
                    {{ formatDate(p.registered_at) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div v-if="events.length === 0" class="py-10 text-center">
          <p class="text-sm font-mono text-neutral-400 dark:text-gray-500">{{ t.events.admin.noParticipants }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from '../composables/useI18n'
import { supabase } from '../lib/supabase'

const { t } = useI18n()

type AuthState = 'loading' | 'unauthenticated' | 'unauthorized' | 'admin'

const authState = ref<AuthState>('loading')
const signingIn = ref(false)
const signInError = ref('')
const loadingData = ref(false)
const copiedSlug = ref('')

const signInForm = reactive({ email: '', password: '' })

interface EventRow {
  slug: string
  title: string
  registration_open: boolean
  check_in_code: string
}

interface Participant {
  id: string
  event_slug: string
  name: string
  email: string
  identifier: string | null
  phone: string | null
  status: string
  registered_at: string
  checked_in_at: string | null
}

const events = ref<EventRow[]>([])
const participantsByEvent = ref<Record<string, Participant[]>>({})

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    authState.value = 'unauthenticated'
    return
  }
  await loadAfterAuth(user.id)
})

async function loadAfterAuth(userId: string) {
  authState.value = 'loading'
  const { data: profile } = await supabase
    .schema('se')
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (!profile || profile.role !== 'admin') {
    authState.value = 'unauthorized'
    return
  }

  authState.value = 'admin'
  await loadData()
}

async function loadData() {
  loadingData.value = true

  const { data: eventsData } = await supabase
    .schema('se')
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })

  events.value = eventsData ?? []

  const { data: participantsData } = await supabase
    .schema('se')
    .from('participants')
    .select('*')
    .order('registered_at', { ascending: false })

  const byEvent: Record<string, Participant[]> = {}
  for (const ev of events.value) {
    byEvent[ev.slug] = []
  }
  for (const p of (participantsData ?? [])) {
    if (!byEvent[p.event_slug]) byEvent[p.event_slug] = []
    byEvent[p.event_slug].push(p)
  }
  participantsByEvent.value = byEvent

  loadingData.value = false
}

async function handleSignIn() {
  signingIn.value = true
  signInError.value = ''

  const { data, error } = await supabase.auth.signInWithPassword({
    email: signInForm.email,
    password: signInForm.password,
  })

  signingIn.value = false

  if (error || !data.user) {
    signInError.value = error?.message ?? 'Sign in failed'
    return
  }

  await loadAfterAuth(data.user.id)
}

async function handleSignOut() {
  await supabase.auth.signOut()
  authState.value = 'unauthenticated'
  events.value = []
  participantsByEvent.value = {}
}

async function copyCode(code: string) {
  await navigator.clipboard.writeText(code)
  copiedSlug.value = code
  setTimeout(() => { copiedSlug.value = '' }, 2000)
}

function participantCounts(slug: string) {
  const ps = participantsByEvent.value[slug] ?? []
  return {
    registered: ps.length,
    checkedIn: ps.filter(p => p.status === 'checked_in').length,
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}
</script>
