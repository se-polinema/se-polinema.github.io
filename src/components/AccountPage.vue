<template>
  <div class="max-w-2xl">
    <!-- Loading -->
    <div v-if="!ready || loading" class="py-4">
      <div class="h-4 bg-primary/5 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
    </div>

    <!-- Signed out -->
    <div v-else-if="!user" class="border border-primary/10 dark:border-gray-700 bg-neutral-50 dark:bg-gray-800/50 p-6">
      <p class="text-sm text-neutral-600 dark:text-gray-300 mb-4">{{ t.account.signInPrompt }}</p>
      <p v-if="oauthError" class="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-mono">
        {{ oauthError }}
      </p>
      <GitHubSignInButton :redirect-to="redirectTo" />
      <a
        :href="`/login?redirect=${encodeURIComponent('/account')}`"
        class="block mt-3 text-sm font-mono text-accent hover:text-accent/80 transition-colors"
      >
        {{ t.memberSubmit.backToLogin }}
      </a>
    </div>

    <!-- Signed in -->
    <template v-else>
      <div class="mb-8 border border-primary/10 dark:border-gray-700 bg-neutral-50 dark:bg-gray-800/50 p-6">
        <p class="text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1">{{ t.account.signedInAs }}</p>
        <p class="text-lg font-serif font-semibold text-primary dark:text-gray-100">{{ displayName }}</p>
        <p class="text-sm text-neutral-500 dark:text-gray-400">{{ user.email }}</p>
      </div>

      <section class="mb-8">
        <h2 class="font-serif text-lg font-semibold text-primary dark:text-gray-100 mb-3">{{ t.account.registrationsHeading }}</h2>
        <p v-if="registrations.length === 0" class="text-sm text-neutral-500 dark:text-gray-400">
          {{ t.account.noRegistrations }}
        </p>
        <ul v-else class="divide-y divide-primary/10 dark:divide-gray-700 border border-primary/10 dark:border-gray-700">
          <li v-for="r in registrations" :key="r.event_slug" class="flex items-center justify-between gap-3 px-4 py-3">
            <div class="min-w-0">
              <a
                :href="`/events/${r.event_slug}`"
                class="text-sm font-medium text-primary dark:text-gray-100 hover:text-accent-700 dark:hover:text-accent-400 transition-colors"
              >
                {{ r.events?.title ?? r.event_slug }}
              </a>
              <p class="text-xs font-mono text-neutral-400 dark:text-gray-500 mt-0.5">{{ formatDate(r.registered_at) }}</p>
            </div>
            <span
              class="inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider flex-shrink-0"
              :class="r.status === 'checked_in'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : r.status === 'waitlisted'
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                  : 'bg-neutral-100 dark:bg-gray-700 text-neutral-500 dark:text-gray-400'"
            >
              {{ r.status === 'checked_in' ? t.events.admin.statusCheckedIn : r.status === 'waitlisted' ? t.account.statusWaitlisted : t.events.admin.statusRegistered }}
            </span>
          </li>
        </ul>
      </section>

      <section v-if="memberStatus !== 'none'" class="mb-8">
        <h2 class="font-serif text-lg font-semibold text-primary dark:text-gray-100 mb-3">{{ t.account.memberHeading }}</h2>
        <div
          v-if="memberStatus === 'pending'"
          class="border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-neutral-700 dark:text-gray-300"
        >
          {{ t.memberSubmit.pendingMessage }}
        </div>
        <div
          v-else-if="memberStatus === 'approved'"
          class="border border-primary/10 dark:border-gray-700 p-4 text-sm text-neutral-700 dark:text-gray-300"
        >
          {{ t.memberSubmit.approvedMessage }}
          <a :href="`/profile?id=${memberId}`" class="text-accent hover:text-accent/80 transition-colors font-mono">{{ t.memberSubmit.viewProfileLink }} →</a>

          <!-- Graduation: turns an approved student row into alumni. Alumni
               are graduated members, not a separate signup (see
               20260722023755_member_graduation.sql). -->
          <div v-if="memberRowStatus === 'student'" class="mt-4 pt-4 border-t border-primary/10 dark:border-gray-700">
            <p v-if="graduated" class="text-sm text-green-700 dark:text-green-400">{{ t.account.graduatedMessage }}</p>
            <template v-else>
              <button
                v-if="!showGraduateForm"
                @click="showGraduateForm = true"
                class="text-sm font-mono text-accent hover:text-accent/80 transition-colors"
              >
                {{ t.account.graduateBtn }}
              </button>
              <div v-else class="space-y-3">
                <p class="text-sm text-neutral-600 dark:text-gray-300">{{ t.account.graduatePrompt }}</p>
                <div v-if="graduateError" class="px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs font-mono">
                  {{ graduateError }}
                </div>
                <div class="flex items-end gap-3">
                  <div>
                    <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1">{{ t.membersAdmin.exitYearLabel }}</label>
                    <input
                      v-model.number="graduateExitYear"
                      type="number"
                      class="w-28 px-3 py-1.5 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors"
                    />
                  </div>
                  <button
                    @click="handleGraduate"
                    :disabled="graduating"
                    class="px-4 py-2 text-sm font-mono font-semibold text-white bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ graduating ? t.account.graduatingLabel : t.account.graduateConfirmBtn }}
                  </button>
                  <button
                    @click="showGraduateForm = false"
                    class="text-sm font-mono text-primary/50 dark:text-gray-400 hover:text-primary dark:hover:text-gray-100 transition-colors"
                  >
                    {{ t.membersAdmin.cancelLabel }}
                  </button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </section>

      <button
        @click="handleSignOut"
        class="text-sm font-mono text-primary/50 dark:text-gray-400 hover:text-primary dark:hover:text-gray-100 transition-colors"
      >
        {{ t.account.signOut }}
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useAuth } from '../composables/useAuth'
import GitHubSignInButton from './GitHubSignInButton.vue'
import { readOAuthError } from '../lib/oauthError'

const { t } = useI18n()
const { user, ready, signOut } = useAuth()

// Supabase redirects failed OAuth attempts back here with an error param.
// Seeded empty for SSR, filled in onMounted (post-hydration reactive
// update, not subject to Vue's production hydration-patch suppression).
const oauthError = ref('')
onMounted(() => {
  oauthError.value = readOAuthError()
})

interface Registration {
  event_slug: string
  status: string
  registered_at: string
  checked_in_at: string | null
  events: { title: string } | null
}

const loading = ref(true)
const registrations = ref<Registration[]>([])
const memberStatus = ref<'none' | 'pending' | 'approved'>('none')
const memberId = ref<string | null>(null)
const memberRowStatus = ref<'student' | 'alumni' | null>(null)

const showGraduateForm = ref(false)
const graduateExitYear = ref(new Date().getFullYear())
const graduating = ref(false)
const graduateError = ref('')
const graduated = ref(false)

const redirectTo = typeof window !== 'undefined' ? window.location.href : undefined

const displayName = computed(() => {
  const meta = user.value?.user_metadata as Record<string, string> | undefined
  return meta?.name || meta?.user_name || meta?.full_name || user.value?.email?.split('@')[0] || ''
})

watch(
  () => [ready.value, user.value] as const,
  async ([isReady, currentUser]) => {
    if (!isReady) return

    if (!currentUser) {
      loading.value = false
      return
    }

    loading.value = true
    const { supabase } = await import('../lib/supabase')

    const [{ data: participantsData }, { data: memberData }] = await Promise.all([
      supabase
        .schema('se')
        .from('participants')
        .select('event_slug, status, registered_at, checked_in_at, events(title)')
        .eq('user_id', currentUser.id)
        .order('registered_at', { ascending: false }),
      supabase
        .schema('se')
        .from('members')
        .select('id, approved, status')
        .eq('user_id', currentUser.id)
        .maybeSingle(),
    ])

    registrations.value = (participantsData as unknown as Registration[]) ?? []

    if (memberData) {
      memberId.value = memberData.id
      memberRowStatus.value = memberData.status
      memberStatus.value = memberData.approved ? 'approved' : 'pending'
    } else {
      memberStatus.value = 'none'
    }

    loading.value = false
  },
  { immediate: true }
)

async function handleGraduate() {
  graduating.value = true
  graduateError.value = ''

  const { supabase } = await import('../lib/supabase')
  const { error } = await supabase
    .schema('se')
    .rpc('graduate_member', { p_exit_year: graduateExitYear.value })

  graduating.value = false

  if (error) {
    graduateError.value = error.message || t.value.memberSubmit.genericError
    return
  }

  memberRowStatus.value = 'alumni'
  showGraduateForm.value = false
  graduated.value = true
}

async function handleSignOut() {
  await signOut()
  window.location.reload()
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}
</script>
