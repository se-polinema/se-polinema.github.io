<template>
  <footer class="bg-brand-navy text-white py-16 md:py-20">
    <div class="section-container">
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div class="sm:col-span-2 lg:col-span-2">
          <div class="flex items-center gap-3 mb-4">
            <img src="/images/logo-jti.png" alt="JTI Polinema" class="h-6 w-auto brightness-0 invert opacity-70" />
            <span class="font-serif text-lg font-semibold">Software Engineering Lab</span>
          </div>
          <p class="text-sm text-white/60 leading-relaxed max-w-md">
            {{ t.footer.tagline }}
          </p>
        </div>

        <div>
          <h4 class="font-mono text-xs uppercase tracking-wider text-white/40 mb-4">{{ t.footer.links }}</h4>
          <ul class="space-y-2">
            <li><a href="/blog" class="text-sm text-white/60 hover:text-white transition-colors">{{ t.nav.news }}</a></li>
            <li><a href="/researchers" class="text-sm text-white/60 hover:text-white transition-colors">{{ t.nav.researchers }}</a></li>
            <li><a href="/publications" class="text-sm text-white/60 hover:text-white transition-colors">{{ t.nav.publications }}</a></li>
            <li><a href="/#research" class="text-sm text-white/60 hover:text-white transition-colors">{{ t.nav.research }}</a></li>
            <li><a href="/#contact" class="text-sm text-white/60 hover:text-white transition-colors">{{ t.nav.contact }}</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-mono text-xs uppercase tracking-wider text-white/40 mb-4">{{ t.footer.resources }}</h4>
          <ul class="space-y-2">
            <li><a href="https://polinema.ac.id" target="_blank" rel="noopener" class="text-sm text-white/60 hover:text-white transition-colors">Polinema</a></li>
            <li><a href="https://jti.polinema.ac.id" target="_blank" rel="noopener" class="text-sm text-white/60 hover:text-white transition-colors">JTI Polinema</a></li>
            <li><a href="https://github.com/se-polinema" target="_blank" rel="noopener" class="text-sm text-white/60 hover:text-white transition-colors">GitHub</a></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p class="text-xs text-white/40">
          &copy; {{ new Date().getFullYear() }} {{ t.footer.copyright }}
        </p>
        <p class="text-xs text-white/30">
          {{ t.contact.affiliation }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
</script>
