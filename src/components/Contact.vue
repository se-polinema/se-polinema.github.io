<template>
  <section id="contact" class="py-20 md:py-32 bg-white">
    <div class="section-container">
      <div class="relative overflow-hidden mb-0">
        <span class="absolute -top-4 right-0 font-mono text-[8rem] font-bold text-primary/[0.04] leading-none select-none pointer-events-none" aria-hidden="true">06</span>
        <div class="section-label">{{ t.contact.label }}</div>
      </div>
      <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight mb-16">
        {{ t.contact.heading }}
      </h2>

      <div class="grid md:grid-cols-2 gap-12 md:gap-24">
        <div>
          <div class="space-y-8">
            <div>
              <div class="text-xs font-mono uppercase tracking-wider text-primary/40 mb-2">{{ t.contact.affiliation }}</div>
              <address class="text-neutral-600 not-italic leading-relaxed">
                {{ t.contact.address }}
              </address>
            </div>

            <div>
              <a
                href="mailto:imam.fahrur@polinema.ac.id"
                class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary text-white hover:bg-accent hover:text-primary transition-colors"
              >
                {{ t.contact.email }}
              </a>
            </div>
          </div>
        </div>

        <div>
          <div class="aspect-[4/3] bg-neutral-100 border border-neutral-200 overflow-hidden">
            <iframe
              title="Google Maps - Politeknik Negeri Malang"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.439999999999!2d112.619!3d-7.953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd629c75e1c4a9d%3A0xeec7c27e9563527!2sPoliteknik%20Negeri%20Malang!5e0!3m2!1sen!2sid!4v1680000000000"
              width="100%"
              height="100%"
              style="border:0"
              loading="lazy"
              allowfullscreen
              referrerpolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
</script>
