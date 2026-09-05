<template>
  <section id="contact" class="py-20 md:py-32 bg-white dark:bg-gray-900">
    <div class="section-container">
      <div class="relative overflow-hidden mb-0">
        <span class="absolute -top-4 right-0 font-mono text-[8rem] font-bold text-primary/[0.04] leading-none select-none pointer-events-none" aria-hidden="true">06</span>
        <div class="section-label">{{ t.contact.label }}</div>
      </div>
      <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-gray-100 leading-tight mb-16">
        {{ t.contact.heading }}
      </h2>

      <div class="grid md:grid-cols-2 gap-12 md:gap-24 mb-20">
        <div>
          <div class="space-y-8">
            <div>
              <div class="text-xs font-mono uppercase tracking-wider text-primary/40 dark:text-gray-500 mb-2">{{ t.contact.affiliation }}</div>
              <address class="text-neutral-600 dark:text-gray-300 not-italic leading-relaxed">
                {{ t.contact.address }}
              </address>
            </div>

            <div>
              <ObfuscatedEmail
                :encoded="LAB_EMAIL_ENCODED"
                class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary text-white hover:bg-accent hover:text-primary transition-colors"
              />
            </div>
          </div>
        </div>

        <div>
          <div class="aspect-[4/3] bg-neutral-100 dark:bg-gray-700 border border-neutral-200 dark:border-gray-600 overflow-hidden">
            <div v-if="consent === 'granted'" class="w-full h-full">
              <iframe
                :title="t.contact.mapTitle"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.439999999999!2d112.619!3d-7.953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd629c75e1c4a9d%3A0xeec7c27e9563527!2sPoliteknik%20Negeri%20Malang!5e0!3m2!1sen!2sid!4v1680000000000"
                width="100%"
                height="100%"
                style="border:0"
                loading="lazy"
                allowfullscreen
                referrerpolicy="no-referrer-when-downgrade"
              />
            </div>
            <div v-else class="w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-neutral-400 dark:text-gray-500">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <p class="text-sm text-neutral-500 dark:text-gray-400 max-w-xs">
                {{ lang === 'en' ? 'Google Maps is embedded on this page. Click below to load the map.' : 'Google Maps tersemat di halaman ini. Klik di bawah untuk memuat peta.' }}
              </p>
              <button
                @click="grant"
                class="px-4 py-1.5 text-xs font-mono font-semibold bg-primary text-white hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {{ lang === 'en' ? 'Load Map' : 'Muat Peta' }}
              </button>
              <a
                :href="withBase('/privacy')"
                class="text-[11px] text-neutral-400 dark:text-gray-500 hover:text-primary dark:hover:text-gray-300 underline underline-offset-2 transition-colors"
              >
                {{ lang === 'en' ? 'Privacy Policy' : 'Kebijakan Privasi' }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-neutral-200 dark:border-gray-700 pt-16">
        <h3 class="font-serif text-2xl md:text-3xl font-bold text-primary dark:text-gray-100 mb-8">
          {{ lang === 'en' ? 'Send us a message' : 'Kirimkan pesan' }}
        </h3>

        <form
          v-if="!submitted"
          class="grid gap-6 max-w-2xl"
          novalidate
          @submit.prevent="handleSubmit"
        >
          <div v-if="mailtoHref" class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-sm text-green-800 dark:text-green-200">
            {{ t.contact.formSuccess }}
            <a
              :href="mailtoHref"
              class="underline font-medium hover:no-underline ml-1"
            >
              {{ lang === 'en' ? 'Open email client' : 'Buka klien email' }}
            </a>
          </div>

          <div>
            <label for="contact-name" class="block text-sm font-medium text-primary dark:text-gray-300 mb-1.5">
              {{ t.contact.formName }}
            </label>
            <input
              id="contact-name"
              v-model="form.name"
              type="text"
              :placeholder="t.contact.formNamePlaceholder"
              :class="inputClass('name')"
              @input="clearError('name')"
            />
            <p v-if="errors.name" class="mt-1 text-xs text-red-600 dark:text-red-400">{{ errors.name }}</p>
          </div>

          <div>
            <label for="contact-email" class="block text-sm font-medium text-primary dark:text-gray-300 mb-1.5">
              {{ t.contact.formEmail }}
            </label>
            <input
              id="contact-email"
              v-model="form.email"
              type="email"
              :placeholder="t.contact.formEmailPlaceholder"
              :class="inputClass('email')"
              @input="clearError('email')"
            />
            <p v-if="errors.email" class="mt-1 text-xs text-red-600 dark:text-red-400">{{ errors.email }}</p>
          </div>

          <div>
            <label for="contact-subject" class="block text-sm font-medium text-primary dark:text-gray-300 mb-1.5">
              {{ t.contact.formSubject }}
            </label>
            <input
              id="contact-subject"
              v-model="form.subject"
              type="text"
              :placeholder="t.contact.formSubjectPlaceholder"
              :class="inputClass('subject')"
              @input="clearError('subject')"
            />
            <p v-if="errors.subject" class="mt-1 text-xs text-red-600 dark:text-red-400">{{ errors.subject }}</p>
          </div>

          <div>
            <label for="contact-message" class="block text-sm font-medium text-primary dark:text-gray-300 mb-1.5">
              {{ t.contact.formMessage }}
            </label>
            <textarea
              id="contact-message"
              v-model="form.message"
              rows="5"
              :placeholder="t.contact.formMessagePlaceholder"
              :class="inputClass('message')"
              @input="clearError('message')"
            />
            <p v-if="errors.message" class="mt-1 text-xs text-red-600 dark:text-red-400">{{ errors.message }}</p>
          </div>

          <div>
            <button
              type="submit"
              class="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-primary text-white hover:bg-accent hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
            >
              {{ t.contact.formSubmit }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from '../composables/useI18n'
import { withBase } from '../lib/paths'
import { useConsent } from '../composables/useConsent'
import { decodeEmail, LAB_EMAIL_ENCODED } from '../utils/email'
import ObfuscatedEmail from './ObfuscatedEmail.vue'

const { lang, t } = useI18n()
const { consent, grant } = useConsent()

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const errors = reactive<Record<string, string>>({})
const submitted = ref(false)
const mailtoHref = ref('')

function clearError(field: string) {
  delete errors[field]
}

function inputClass(field: string) {
  const base = 'w-full px-4 py-2.5 text-sm border rounded bg-white dark:bg-gray-800 text-primary dark:text-gray-100 placeholder:text-neutral-400 dark:placeholder:text-gray-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-900'
  const errorBorder = 'border-red-500 dark:border-red-400'
  const normalBorder = 'border-neutral-300 dark:border-gray-600'
  return `${base} ${errors[field] ? errorBorder : normalBorder}`
}

function validate(): boolean {
  errors.name = ''
  errors.email = ''
  errors.subject = ''
  errors.message = ''

  let valid = true

  if (!form.name.trim()) {
    errors.name = t.value.contact.formValidationName
    valid = false
  }
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = t.value.contact.formValidationEmail
    valid = false
  }
  if (!form.subject.trim()) {
    errors.subject = t.value.contact.formValidationSubject
    valid = false
  }
  if (!form.message.trim()) {
    errors.message = t.value.contact.formValidationMessage
    valid = false
  }

  return valid
}

function handleSubmit() {
  if (!validate()) return

  const body = encodeURIComponent(
    `${form.message}\n\n---\nFrom: ${form.name} <${form.email}>`
  )
  mailtoHref.value = `mailto:${decodeEmail(LAB_EMAIL_ENCODED)}?subject=${encodeURIComponent(form.subject)}&body=${body}`
  submitted.value = true

  window.location.href = mailtoHref.value
}
</script>
