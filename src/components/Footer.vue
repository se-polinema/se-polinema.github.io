<template>
  <footer class="bg-primary text-white py-8 md:py-10">
    <div class="section-container">
      <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-8">
        <div class="lg:w-60 flex-shrink-0">
          <div class="mb-2">
            <div class="font-mono text-[10px] tracking-[0.2em] text-white/30 mb-1">{ SE Lab }</div>
            <span class="font-serif text-lg font-semibold">Software Engineering Lab</span>
          </div>
          <p class="text-xs text-white/60 leading-relaxed">
            {{ t.footer.tagline }}
          </p>
        </div>

        <div class="flex-1">
          <h4 class="font-mono text-[10px] uppercase tracking-wider text-white/40 mb-2.5">{{ t.footer.links }}</h4>
          <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-1">
            <a
              v-for="link in allLinks"
              :key="link.href"
              :href="link.external ? link.href : withBase(link.href)"
              :target="link.external ? '_blank' : undefined"
              :rel="link.external ? 'noopener' : undefined"
              class="text-xs text-white/60 hover:text-white transition-colors py-0.5"
            >{{ link.label }}</a>
          </div>
        </div>

        <div class="lg:w-72 flex-shrink-0">
          <h4 class="font-mono text-[10px] uppercase tracking-wider text-white/40 mb-2.5">{{ t.footer.newsletter }}</h4>
          <NewsletterForm compact :showInterests="false" />
        </div>
      </div>

      <div class="border-t border-white/10 pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p class="text-[11px] text-white/40">
          &copy; {{ new Date().getFullYear() }} {{ t.footer.copyright }}
        </p>
        <p class="text-[11px] text-white/30">
          {{ t.contact.affiliation }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'
import NewsletterForm from './NewsletterForm.vue'
import { withBase } from '../lib/paths'

const { t } = useI18n()

interface LinkItem {
  href: string
  label: string
  external: boolean
}

const allLinks = computed<LinkItem[]>(() => [
  { href: '/events', label: t.value.nav.events, external: false },
  { href: '/faq', label: t.value.nav.faq, external: false },
  { href: '/blog', label: t.value.nav.blog, external: false },
  { href: '/members', label: t.value.nav.members, external: false },
  { href: '/books', label: t.value.nav.books, external: false },
  { href: '/decks', label: t.value.nav.decks, external: false },
  { href: '/glossary', label: t.value.nav.glossary, external: false },
  { href: '/resources', label: t.value.nav.resources, external: false },
  { href: '/tools', label: t.value.nav.tools, external: false },
  { href: '/publications', label: t.value.nav.publications, external: false },
  { href: '/achievements', label: t.value.achievements?.navLabel || 'Achievements', external: false },
  { href: '/impact', label: t.value.nav.impact, external: false },
  { href: '/#research', label: t.value.nav.research, external: false },
  { href: '/contact', label: t.value.nav.contact, external: false },
  { href: '/privacy', label: t.value.privacy.navLabel, external: false },
  { href: 'https://polinema.ac.id', label: 'Polinema', external: true },
  { href: 'https://jti.polinema.ac.id', label: 'JTI Polinema', external: true },
  { href: 'https://github.com/se-polinema', label: 'GitHub', external: true },
  { href: '/newsletter', label: t.value.footer.newsletter, external: false },
])
</script>
