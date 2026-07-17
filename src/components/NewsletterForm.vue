<template>
  <section :class="compact ? '' : 'py-20 md:py-32 bg-white dark:bg-gray-900'">
    <div :class="compact ? '' : 'section-container'">
      <template v-if="!compact">
        <div class="relative overflow-hidden mb-0">
          <span class="absolute -top-4 right-0 font-mono text-[8rem] font-bold text-primary/[0.04] leading-none select-none pointer-events-none" aria-hidden="true">07</span>
          <div class="section-label">{{ t.newsletter.heading }}</div>
        </div>
        <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-gray-100 leading-tight mb-6">
          {{ t.newsletter.pageHeading }}
        </h2>
        <p class="text-neutral-600 dark:text-gray-400 mb-10 max-w-2xl leading-relaxed">
          {{ t.newsletter.pageDescription }}
        </p>
      </template>

      <div v-if="state === 'success'" :class="compact ? 'text-white' : ''">
        <div v-if="minimal">
          <p class="text-xs text-green-300 font-mono">✓ {{ t.newsletter.successTitle }}</p>
        </div>
        <div v-else class="flex items-start gap-3 mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5" :class="compact ? 'text-green-300' : 'text-green-600 dark:text-green-400'">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 13.01 9 10.01"/>
          </svg>
          <div>
            <p class="font-mono text-sm font-semibold">{{ t.newsletter.successTitle }}</p>
            <p class="text-sm mt-1" :class="compact ? 'text-white/70' : 'text-neutral-600 dark:text-gray-400'">
              {{ t.newsletter.successMessage }}
            </p>
          </div>
        </div>
      </div>

      <form
        v-else
        @submit.prevent="handleSubmit"
        :action="formspreeUrl"
        method="POST"
        :class="minimal ? '' : (compact ? 'space-y-2' : 'space-y-4')"
      >
        <div v-if="errorMessage" :class="['px-3 py-2 text-xs font-mono', compact ? 'bg-red-900/30 border border-red-500/30 text-red-200' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400']">
          {{ errorMessage }}
        </div>

        <div :class="minimal ? 'flex items-stretch gap-1' : ''">
          <label v-if="!minimal" :for="emailId" class="block text-[10px] font-mono uppercase tracking-wider" :class="[compact ? 'text-white/50 mb-1' : 'text-neutral-400 dark:text-gray-500 mb-1.5']">
            {{ t.newsletter.emailLabel }} <span class="text-red-400" aria-hidden="true">*</span>
          </label>
          <input
            :id="emailId"
            v-model="form.email"
            type="email"
            name="email"
            required
            autocomplete="email"
            :placeholder="t.newsletter.emailPlaceholder"
            :class="[
              'text-xs font-mono border focus:outline-none focus:border-accent dark:focus:border-accent transition-colors',
              minimal
                ? 'flex-1 bg-[color:var(--color-vscode-chrome-border)] border-[color:var(--color-vscode-chrome-border)] text-[color:var(--color-vscode-chrome-fg)] placeholder:text-[color:var(--color-vscode-chrome-fg-muted)] px-2 py-1'
                : compact
                  ? 'w-full text-sm bg-white/10 border-white/20 text-white placeholder-white/40 px-2.5 py-1.5'
                  : 'w-full text-sm bg-white dark:bg-gray-900 border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 px-3 py-2'
            ]"
          />

          <button
            v-if="minimal"
            type="submit"
            :disabled="submitting"
            class="inline-flex items-center gap-1 font-mono font-semibold bg-accent text-white hover:opacity-90 px-2.5 py-1 text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <svg v-if="submitting" class="animate-spin" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            {{ submitting ? t.newsletter.subscribing : t.newsletter.subscribeBtn }}
          </button>
        </div>

        <input type="hidden" name="_language" :value="lang" />

        <template v-if="showInterests && !minimal">
          <fieldset>
            <legend class="block text-[10px] font-mono uppercase tracking-wider" :class="[compact ? 'text-white/50 mb-1' : 'text-neutral-400 dark:text-gray-500 mb-2']">
              {{ t.newsletter.interestsLabel }}
            </legend>
            <div :class="compact ? 'flex flex-wrap gap-x-3 gap-y-1' : 'flex flex-wrap gap-3'">
              <label
                v-for="interest in interestOptions"
                :key="interest.value"
                class="flex items-center gap-1.5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  :name="'interest_' + interest.value"
                  :value="interest.value"
                  v-model="form.interests"
                  class="w-3.5 h-3.5 accent-accent"
                />
                <span class="text-xs font-mono" :class="compact ? 'text-white/60' : 'text-neutral-500 dark:text-gray-400'">
                  {{ interest.label }}
                </span>
              </label>
            </div>
          </fieldset>
        </template>

        <template v-if="!minimal">
          <div :class="compact ? 'flex items-center gap-2' : 'flex items-center gap-3 pt-1'">
            <button
              type="submit"
              :disabled="submitting"
              :class="[
                'inline-flex items-center gap-1.5 font-mono font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                compact
                  ? 'bg-white text-primary hover:bg-white/90 px-3.5 py-1.5 text-xs'
                  : 'text-white bg-accent hover:bg-accent/90 px-5 py-2.5 text-sm'
              ]"
            >
              <svg v-if="submitting" class="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
              {{ submitting ? t.newsletter.subscribing : t.newsletter.subscribeBtn }}
            </button>

            <a
              v-if="compact"
              href="/newsletter"
              class="text-[11px] font-mono text-white/50 hover:text-white/80 transition-colors underline"
            >
              {{ t.newsletter.pageHeading }}
            </a>
          </div>

          <p class="text-[10px] leading-relaxed" :class="compact ? 'text-white/40' : 'text-neutral-400 dark:text-gray-500'">
            {{ t.newsletter.privacyNote }}
            <a
              href="/privacy"
              class="underline underline-offset-2 hover:text-accent-700 dark:hover:text-accent-400 transition-colors"
            >{{ t.privacy.navLabel }}</a>
          </p>
        </template>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18n } from '../composables/useI18n'

const props = withDefaults(defineProps<{
  compact?: boolean
  minimal?: boolean
  showInterests?: boolean
  formspreeUrl?: string
}>(), {
  compact: false,
  minimal: false,
  showInterests: true,
  formspreeUrl: '',
})

const { t, lang } = useI18n()

type State = 'idle' | 'success'

const state = ref<State>('idle')
const submitting = ref(false)
const errorMessage = ref('')

const emailId = computed(() => props.compact ? 'newsletter-email-footer' : 'newsletter-email-page')

const form = reactive({
  email: '',
  interests: [] as string[],
})

const interestOptions = computed(() => [
  { value: 'tutorials', label: t.value.newsletter.interestTutorials },
  { value: 'events', label: t.value.newsletter.interestEvents },
  { value: 'publications', label: t.value.newsletter.interestPublications },
  { value: 'announcements', label: t.value.newsletter.interestAnnouncements },
])

async function handleSubmit() {
  errorMessage.value = ''

  if (!form.email.trim()) {
    return
  }

  submitting.value = true

  let error: { code?: string } | null = null

  try {
    const { supabase } = await import('../lib/supabase')
    const result = await supabase
      .schema('se')
      .from('subscribers')
      .insert({
        email: form.email.trim().toLowerCase(),
        language: lang.value,
        interests: form.interests.length > 0 ? form.interests : [],
      })

    error = result.error
  } catch {
    error = {}
  } finally {
    submitting.value = false
  }

  if (error) {
    if (error.code === '23505') {
      errorMessage.value = t.value.newsletter.errorDuplicate
    } else {
      errorMessage.value = t.value.newsletter.errorGeneric
    }
    return
  }

  state.value = 'success'
}
</script>
