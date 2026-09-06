<template>
  <div class="border-t border-primary/10 dark:border-gray-600 pt-2.5 mt-auto">
    <div class="font-mono text-[9px] uppercase tracking-widest text-primary/35 dark:text-gray-500 mb-2">
      {{ t.researcherContact.heading }}
    </div>

    <div v-if="submitted" class="p-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-[11px] text-green-800 dark:text-green-200 leading-relaxed">
      <div class="font-semibold mb-0.5">{{ t.researcherContact.formSuccessTitle }}</div>
      <p class="mb-1.5">{{ t.researcherContact.formSuccessMessage }}</p>
      <a
        :href="mailtoHref"
        class="inline-block px-2.5 py-1 text-[11px] font-mono bg-primary text-white hover:bg-accent hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-900"
      >
        {{ t.researcherContact.formOpenEmail }}
      </a>
    </div>

    <form
      v-else
      class="space-y-2.5"
      novalidate
      @submit.prevent="handleSubmit"
    >
      <div>
        <label
          for="rcf-name"
          class="block text-[10px] font-mono uppercase tracking-wide text-primary/45 dark:text-gray-400 mb-0.5"
        >
          {{ t.researcherContact.formName }}
          <span class="text-red-400" aria-hidden="true">*</span>
        </label>
        <input
          id="rcf-name"
          v-model="form.name"
          type="text"
          :placeholder="t.researcherContact.formNamePlaceholder"
          autocomplete="name"
          :aria-invalid="!!errors.name"
          :aria-describedby="errors.name ? 'rcf-error-name' : undefined"
          :class="inputClass('name')"
          @input="clearError('name')"
        />
        <p v-if="errors.name" id="rcf-error-name" class="mt-0.5 text-[10px] text-red-600 dark:text-red-400" role="alert">{{ errors.name }}</p>
      </div>

      <div>
        <label
          for="rcf-email"
          class="block text-[10px] font-mono uppercase tracking-wide text-primary/45 dark:text-gray-400 mb-0.5"
        >
          {{ t.researcherContact.formEmail }}
          <span class="text-red-400" aria-hidden="true">*</span>
        </label>
        <input
          id="rcf-email"
          v-model="form.email"
          type="email"
          :placeholder="t.researcherContact.formEmailPlaceholder"
          autocomplete="email"
          :aria-invalid="!!errors.email"
          :aria-describedby="errors.email ? 'rcf-error-email' : undefined"
          :class="inputClass('email')"
          @input="clearError('email')"
        />
        <p v-if="errors.email" id="rcf-error-email" class="mt-0.5 text-[10px] text-red-600 dark:text-red-400" role="alert">{{ errors.email }}</p>
      </div>

      <div>
        <label
          for="rcf-affiliation"
          class="block text-[10px] font-mono uppercase tracking-wide text-primary/45 dark:text-gray-400 mb-0.5"
        >
          {{ t.researcherContact.formAffiliation }}
        </label>
        <input
          id="rcf-affiliation"
          v-model="form.affiliation"
          type="text"
          :placeholder="t.researcherContact.formAffiliationPlaceholder"
          autocomplete="organization"
          :class="inputClass('affiliation')"
        />
      </div>

      <div>
        <label
          for="rcf-topic"
          class="block text-[10px] font-mono uppercase tracking-wide text-primary/45 dark:text-gray-400 mb-0.5"
        >
          {{ t.researcherContact.formTopic }}
          <span class="text-red-400" aria-hidden="true">*</span>
        </label>
        <select
          id="rcf-topic"
          v-model="form.topic"
          :aria-invalid="!!errors.topic"
          :aria-describedby="errors.topic ? 'rcf-error-topic' : undefined"
          :class="inputClass('topic')"
          @change="clearError('topic')"
        >
          <option value="" disabled>{{ lang === 'en' ? '-- Select a topic --' : '-- Pilih topik --' }}</option>
          <option value="thesisSupervision">{{ t.researcherContact.topicThesisSupervision }}</option>
          <option value="researchCollaboration">{{ t.researcherContact.topicResearchCollaboration }}</option>
          <option value="publicationQuestion">{{ t.researcherContact.topicPublicationQuestion }}</option>
          <option value="other">{{ t.researcherContact.topicOther }}</option>
        </select>
        <p v-if="errors.topic" id="rcf-error-topic" class="mt-0.5 text-[10px] text-red-600 dark:text-red-400" role="alert">{{ errors.topic }}</p>
      </div>

      <div>
        <label
          for="rcf-message"
          class="block text-[10px] font-mono uppercase tracking-wide text-primary/45 dark:text-gray-400 mb-0.5"
        >
          {{ t.researcherContact.formMessage }}
          <span class="text-red-400" aria-hidden="true">*</span>
        </label>
        <textarea
          id="rcf-message"
          v-model="form.message"
          rows="4"
          :placeholder="t.researcherContact.formMessagePlaceholder"
          :aria-invalid="!!errors.message"
          :aria-describedby="errors.message ? 'rcf-error-message' : undefined"
          :class="inputClass('message')"
          @input="clearError('message')"
        />
        <p v-if="errors.message" id="rcf-error-message" class="mt-0.5 text-[10px] text-red-600 dark:text-red-400" role="alert">{{ errors.message }}</p>
      </div>

      <div class="flex items-start gap-1.5">
        <input
          id="rcf-consent"
          v-model="form.consent"
          type="checkbox"
          class="mt-1 w-3 h-3 accent-accent flex-shrink-0"
          :aria-invalid="!!errors.consent"
          :aria-describedby="errors.consent ? 'rcf-error-consent' : undefined"
        />
        <label for="rcf-consent" class="text-[9px] leading-relaxed text-neutral-500 dark:text-gray-400">
          {{ t.researcherContact.formPrivacyConsent }}
          <a
            :href="withBase('/privacy')"
            target="_blank"
            class="underline underline-offset-2 hover:text-primary dark:hover:text-gray-200 transition-colors"
          >{{ lang === 'en' ? 'Privacy Policy' : 'Kebijakan Privasi' }}</a>.
        </label>
      </div>
      <p v-if="errors.consent" id="rcf-error-consent" class="text-[10px] text-red-600 dark:text-red-400" role="alert">{{ errors.consent }}</p>

      <div>
        <button
          type="submit"
          class="w-full px-3 py-1.5 text-[11px] font-mono font-semibold bg-primary text-white hover:bg-accent hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-900"
        >
          {{ t.researcherContact.formSubmit }}
        </button>
      </div>

      <p class="text-[9px] leading-relaxed text-neutral-400 dark:text-gray-500">
        {{ t.newsletter.privacyNote }}
        <a
          :href="withBase('/privacy')"
          target="_blank"
          class="underline underline-offset-2 hover:text-primary dark:hover:text-gray-200 transition-colors"
        >{{ t.privacy.navLabel }}</a>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from '../composables/useI18n'
import { withBase } from '../lib/paths'
import { decodeEmail } from '../utils/email'

const props = withDefaults(defineProps<{
  researcherName: string
  researcherEmailEncoded: string
  researcherStreams?: string[]
}>(), {
  researcherStreams: () => [],
})

const { lang, t } = useI18n()

function getDefaultTopic(): string {
  if (props.researcherStreams.includes('se-methodologies-architecture')) {
    return 'thesisSupervision'
  }
  if (props.researcherStreams.includes('domain-specific-se-applications')) {
    return 'researchCollaboration'
  }
  return ''
}

const form = reactive({
  name: '',
  email: '',
  affiliation: '',
  topic: getDefaultTopic(),
  message: '',
  consent: false,
})

const errors = reactive<Record<string, string>>({})
const submitted = ref(false)
const mailtoHref = ref('')

function clearError(field: string) {
  delete errors[field]
}

function inputClass(field: string) {
  const base = 'w-full px-2.5 py-1.5 text-[11px] border bg-white dark:bg-gray-800 text-primary dark:text-gray-100 placeholder:text-neutral-400 dark:placeholder:text-gray-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-900'
  const errorBorder = 'border-red-500 dark:border-red-400'
  const normalBorder = 'border-neutral-300 dark:border-gray-600'
  return `${base} ${errors[field] ? errorBorder : normalBorder}`
}

function validate(): boolean {
  errors.name = ''
  errors.email = ''
  errors.topic = ''
  errors.message = ''
  errors.consent = ''

  let valid = true

  if (!form.name.trim()) {
    errors.name = t.value.researcherContact.formValidationName
    valid = false
  }
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = t.value.researcherContact.formValidationEmail
    valid = false
  }
  if (!form.topic) {
    errors.topic = t.value.researcherContact.formValidationTopic
    valid = false
  }
  if (!form.message.trim()) {
    errors.message = t.value.researcherContact.formValidationMessage
    valid = false
  }
  if (!form.consent) {
    errors.consent = t.value.researcherContact.formValidationConsent
    valid = false
  }

  return valid
}

const topicLabels: Record<string, string> = {
  thesisSupervision: 'Thesis Supervision',
  researchCollaboration: 'Research Collaboration',
  publicationQuestion: 'Publication Question',
  other: 'Other',
}

function handleSubmit() {
  if (!validate()) return

  const topicLabel = topicLabels[form.topic] || form.topic
  const affiliationLine = form.affiliation.trim() ? `Affiliation: ${form.affiliation.trim()}\n` : ''
  const body = encodeURIComponent(
    `${form.message.trim()}\n\n---\nName: ${form.name.trim()}\nEmail: ${form.email.trim()}\n${affiliationLine}Topic: ${topicLabel}`
  )
  const subject = encodeURIComponent(`[SE Lab Inquiry] ${topicLabel} — ${props.researcherName}`)
  mailtoHref.value = `mailto:${decodeEmail(props.researcherEmailEncoded)}?subject=${subject}&body=${body}`
  submitted.value = true

  window.location.href = mailtoHref.value
}
</script>
