<template>
  <div class="px-8 py-5">
    <div class="section-label mb-2">{{ t.privacy.label }}</div>
    <h1 class="font-serif text-2xl md:text-3xl font-bold text-primary dark:text-gray-100 leading-tight mb-2">
      {{ t.privacy.heading }}
    </h1>
    <p class="text-xs text-neutral-400 dark:text-gray-500 font-mono mb-8">
      {{ t.privacy.lastUpdated }}
    </p>

    <div class="prose prose-neutral dark:prose-invert max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-gray-300 space-y-6">
      <p>{{ t.privacy.intro }}</p>

      <section>
        <h2 class="font-serif text-lg md:text-xl font-semibold text-primary dark:text-gray-100 mt-8 mb-3 pb-2 border-b border-primary/10 dark:border-gray-700">
          {{ t.privacy.dataCollectedHeading }}
        </h2>
        <p>{{ t.privacy.dataCollectedIntro }}</p>
        <ul class="list-disc pl-5 space-y-1">
          <li v-html="t.privacy.dataNewsletterItem"></li>
          <li v-html="t.privacy.dataEventsItem"></li>
          <li v-html="t.privacy.dataContactItem"></li>
          <li v-html="t.privacy.dataAutoItem"></li>
        </ul>
      </section>

      <section>
        <h2 class="font-serif text-lg md:text-xl font-semibold text-primary dark:text-gray-100 mt-8 mb-3 pb-2 border-b border-primary/10 dark:border-gray-700">
          {{ t.privacy.purposeHeading }}
        </h2>
        <p v-html="t.privacy.purpose1"></p>
        <p v-html="t.privacy.purpose2"></p>
      </section>

      <section>
        <h2 class="font-serif text-lg md:text-xl font-semibold text-primary dark:text-gray-100 mt-8 mb-3 pb-2 border-b border-primary/10 dark:border-gray-700">
          {{ t.privacy.storageHeading }}
        </h2>
        <p v-html="t.privacy.storageText"></p>
      </section>

      <section>
        <h2 class="font-serif text-lg md:text-xl font-semibold text-primary dark:text-gray-100 mt-8 mb-3 pb-2 border-b border-primary/10 dark:border-gray-700">
          {{ t.privacy.retentionHeading }}
        </h2>
        <p>{{ t.privacy.retentionText }}</p>
      </section>

      <section>
        <h2 class="font-serif text-lg md:text-xl font-semibold text-primary dark:text-gray-100 mt-8 mb-3 pb-2 border-b border-primary/10 dark:border-gray-700">
          {{ t.privacy.thirdPartyHeading }}
        </h2>
        <p>{{ t.privacy.thirdPartyIntro }}</p>
        <ul class="list-disc pl-5 space-y-1">
          <li v-html="t.privacy.thirdPartyGoogleMaps"></li>
          <li v-html="t.privacy.thirdPartyGoogleFonts"></li>
          <li v-html="t.privacy.thirdPartyGitHub"></li>
          <li v-html="t.privacy.thirdPartySupabase"></li>
        </ul>
      </section>

      <section>
        <h2 class="font-serif text-lg md:text-xl font-semibold text-primary dark:text-gray-100 mt-8 mb-3 pb-2 border-b border-primary/10 dark:border-gray-700">
          {{ t.privacy.rightsHeading }}
        </h2>
        <p>{{ t.privacy.rightsIntro }}</p>
        <ul class="list-disc pl-5 space-y-1">
          <li>{{ t.privacy.rightAccess }}</li>
          <li>{{ t.privacy.rightCorrection }}</li>
          <li>{{ t.privacy.rightDeletion }}</li>
          <li>{{ t.privacy.rightWithdraw }}</li>
          <li>{{ t.privacy.rightComplaint }}</li>
        </ul>
        <p class="mt-2">{{ t.privacy.rightsExercise }}</p>
      </section>

      <section>
        <h2 class="font-serif text-lg md:text-xl font-semibold text-primary dark:text-gray-100 mt-8 mb-3 pb-2 border-b border-primary/10 dark:border-gray-700">
          {{ t.privacy.cookiesHeading }}
        </h2>
        <p>{{ t.privacy.cookiesIntro }}</p>
        <ul class="list-disc pl-5 space-y-1">
          <li v-html="t.privacy.cookiesLang"></li>
          <li v-html="t.privacy.cookiesTheme"></li>
          <li v-html="t.privacy.cookiesConsent"></li>
          <li v-html="t.privacy.cookiesAuth"></li>
        </ul>
        <p class="mt-2">{{ t.privacy.cookiesNoTracking }}</p>
      </section>

      <section>
        <h2 class="font-serif text-lg md:text-xl font-semibold text-primary dark:text-gray-100 mt-8 mb-3 pb-2 border-b border-primary/10 dark:border-gray-700">
          {{ t.privacy.contactHeading }}
        </h2>
        <p>{{ t.privacy.contactText }}</p>
        <p class="mt-2">
          <ObfuscatedEmail :encoded="LAB_EMAIL_ENCODED" class="text-primary dark:text-gray-200 hover:text-accent-700 dark:hover:text-accent-400 underline underline-offset-2 transition-colors" />
        </p>
        <p class="text-xs text-neutral-400 dark:text-gray-500 mt-1">{{ t.privacy.contactAffiliation }}</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import { LAB_EMAIL_ENCODED } from '../utils/email'
import ObfuscatedEmail from './ObfuscatedEmail.vue'

const { t } = useI18n()
</script>
