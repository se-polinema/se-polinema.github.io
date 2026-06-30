<template>
  <div class="max-w-sm mx-auto">
    <div class="border border-primary/10 dark:border-gray-700 bg-neutral-50 dark:bg-gray-800/50 p-6">
      <h1 class="font-serif text-2xl font-bold text-primary dark:text-gray-100 mb-6">
        {{ props.mode === 'login' ? t.events.auth.loginHeading : t.events.auth.registerHeading }}
      </h1>

      <div v-if="errorMessage" class="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-mono mb-4">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="props.mode === 'register'">
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">
            {{ t.events.auth.nameLabel }} <span class="text-red-400">*</span>
          </label>
          <input
            v-model="form.fullName"
            type="text"
            required
            :placeholder="t.events.auth.namePlaceholder"
            class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">
            {{ t.events.auth.emailLabel }} <span class="text-red-400">*</span>
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            :placeholder="t.events.auth.emailPlaceholder"
            class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">
            {{ t.events.auth.passwordLabel }} <span class="text-red-400">*</span>
          </label>
          <input
            v-model="form.password"
            type="password"
            required
            :placeholder="t.events.auth.passwordPlaceholder"
            class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors"
          />
        </div>

        <div class="pt-2">
          <button
            type="submit"
            :disabled="submitting"
            class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono font-semibold text-white bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg v-if="submitting" class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            <template v-if="props.mode === 'login'">
              {{ submitting ? t.events.auth.submittingLogin : t.events.auth.loginBtn }}
            </template>
            <template v-else>
              {{ submitting ? t.events.auth.submittingRegister : t.events.auth.registerBtn }}
            </template>
          </button>
        </div>
      </form>
    </div>

    <p class="mt-4 text-center text-sm text-neutral-500 dark:text-gray-400">
      <template v-if="props.mode === 'login'">
        {{ t.events.auth.noAccount }}
        <a :href="`/register${redirectParam}`" class="text-accent hover:text-accent/80 font-mono transition-colors">
          {{ t.events.auth.signUpLink }}
        </a>
      </template>
      <template v-else>
        {{ t.events.auth.hasAccount }}
        <a :href="`/login${redirectParam}`" class="text-accent hover:text-accent/80 font-mono transition-colors">
          {{ t.events.auth.signInLink }}
        </a>
      </template>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from '../composables/useI18n'
import { supabase } from '../lib/supabase'

const props = defineProps<{
  mode: 'login' | 'register'
}>()

const { t } = useI18n()

const submitting = ref(false)
const errorMessage = ref('')

const form = reactive({
  fullName: '',
  email: '',
  password: '',
})

const redirectParam = typeof window !== 'undefined'
  ? (() => {
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect')
      return redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''
    })()
  : ''

async function handleSubmit() {
  submitting.value = true
  errorMessage.value = ''

  try {
    if (props.mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })

      if (error) {
        errorMessage.value = error.message || t.value.events.auth.loginError
        submitting.value = false
        return
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })

      if (error || !data.user) {
        errorMessage.value = error?.message || t.value.events.auth.registerError
        submitting.value = false
        return
      }

      const { error: profileError } = await supabase
        .schema('se')
        .from('profiles')
        .update({ full_name: form.fullName.trim() })
        .eq('id', data.user.id)

      if (profileError) {
        errorMessage.value = t.value.events.auth.genericError
        submitting.value = false
        return
      }
    }

    const redirect = new URLSearchParams(window.location.search).get('redirect')
    window.location.href = redirect || '/'
  } catch {
    errorMessage.value = t.value.events.auth.genericError
    submitting.value = false
  }
}
</script>
