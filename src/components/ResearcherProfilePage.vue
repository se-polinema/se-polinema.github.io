<template>
  <main class="min-h-screen pt-24 pb-20 bg-white">
    <div class="section-container">
      <a href="/researchers" class="inline-flex items-center gap-2 text-sm text-primary/60 hover:text-primary transition-colors mb-8">
        &larr; {{ t.team.backToResearchers }}
      </a>

      <section class="grid lg:grid-cols-[12rem_minmax(0,1fr)] gap-10 lg:gap-16 mb-20 items-start">
        <aside class="flex items-start gap-5 lg:block">
          <div class="relative aspect-[4/5] w-28 shrink-0 bg-neutral-50 border border-neutral-200 overflow-hidden lg:max-w-[10rem] lg:w-auto">
            <img :src="researcher.photo" :alt="researcher.name" class="h-full w-full object-cover grayscale contrast-110 transition duration-300 hover:grayscale-0" :style="{ objectPosition: researcher.photoPosition }" loading="lazy" />
          </div>
          <div class="space-y-4 text-sm text-neutral-600 min-w-0 flex-1 lg:mt-5 lg:max-w-[12rem]">
            <div>
              <div class="text-xs font-mono uppercase tracking-wider text-primary/40 mb-1">{{ t.team.affiliation }}</div>
              <div>Software Engineering Laboratory<br />Jurusan Teknologi Informasi<br />Politeknik Negeri Malang</div>
            </div>
            <div>
              <div class="text-xs font-mono uppercase tracking-wider text-primary/40 mb-1">{{ t.team.contact }}</div>
              <a :href="`mailto:${researcher.email}`" class="text-primary hover:text-accent transition-colors">{{ researcher.email }}</a>
            </div>
            <div>
              <div class="text-xs font-mono uppercase tracking-wider text-primary/40 mb-1">{{ t.team.externalProfiles }}</div>
              <ul class="space-y-1">
                <li><a :href="researcher.googleScholarUrl" target="_blank" rel="noopener" class="text-primary hover:text-accent transition-colors">Google Scholar</a></li>
                <li v-if="researcher.institutionalUrl"><a :href="researcher.institutionalUrl" target="_blank" rel="noopener" class="text-primary hover:text-accent transition-colors">{{ t.team.institutionalPage }}</a></li>
                <li v-if="researcher.orcidUrl"><a :href="researcher.orcidUrl" target="_blank" rel="noopener" class="text-primary hover:text-accent transition-colors">ORCID</a></li>
                <li v-if="researcher.scopusUrl"><a :href="researcher.scopusUrl" target="_blank" rel="noopener" class="text-primary hover:text-accent transition-colors">Scopus</a></li>
              </ul>
            </div>
          </div>
        </aside>

        <div>
          <div class="section-label">{{ t.team.profileLabel }}</div>
          <div class="border-b border-primary/10 pb-8 mb-8">
            <h1 class="font-serif text-4xl md:text-5xl font-bold text-primary leading-tight mb-3">{{ researcher.name }}</h1>
            <p class="text-primary/60 text-lg mb-6">{{ lang === 'id' ? researcher.title.id : researcher.title.en }}</p>
            <p class="text-neutral-600 leading-relaxed text-lg max-w-3xl">{{ lang === 'id' ? researcher.shortBio.id : researcher.shortBio.en }}</p>
          </div>

          <div class="grid sm:grid-cols-3 gap-4 mb-10">
            <div class="border-t border-primary/10 pt-4">
              <div class="font-serif text-3xl font-bold text-primary">{{ publications.length }}</div>
              <div class="text-xs font-mono uppercase tracking-wider text-primary/45 mt-1">{{ t.team.selectedWorks }}</div>
            </div>
            <div class="border-t border-primary/10 pt-4">
              <div class="font-serif text-3xl font-bold text-primary">{{ researcher.expertise.length }}</div>
              <div class="text-xs font-mono uppercase tracking-wider text-primary/45 mt-1">{{ t.team.researchThemes }}</div>
            </div>
            <div class="border-t border-primary/10 pt-4">
              <div class="font-serif text-3xl font-bold text-primary">{{ externalProfileCount }}</div>
              <div class="text-xs font-mono uppercase tracking-wider text-primary/45 mt-1">{{ t.team.externalProfiles }}</div>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 mb-10">
            <span v-for="item in researcher.expertise" :key="item" class="text-xs font-mono uppercase tracking-wide text-primary/60 bg-neutral-50 border border-primary/10 px-3 py-1.5">{{ item }}</span>
          </div>

          <section class="mb-14">
            <div class="flex items-end justify-between gap-4 mb-5">
              <h2 class="font-serif text-2xl md:text-3xl font-bold text-primary">{{ t.team.publicationsHeading }}</h2>
              <a href="/publications" class="text-sm text-primary/60 hover:text-primary transition-colors">{{ t.team.viewPublicationArchive }}</a>
            </div>
            <div class="space-y-10">
              <section v-for="group in groupedEntries" :key="group.year">
                <div class="font-mono text-xs uppercase tracking-[0.2em] text-primary/40 mb-4">{{ group.year }}</div>
                <div class="space-y-5">
                  <article v-for="publication in group.items" :key="publication.id" class="border-t border-primary/10 pt-5">
                    <div class="font-mono text-xs uppercase tracking-wider text-primary/40 mb-2">{{ publication.type }}</div>
                    <h3 class="font-serif text-lg font-semibold text-primary leading-snug">
                      <a :href="publication.url" target="_blank" rel="noopener" class="hover:underline decoration-primary/20 underline-offset-4">{{ publication.title }}</a>
                    </h3>
                    <p class="mt-2 text-sm text-neutral-600">{{ publication.authors.join(', ') }}</p>
                    <p class="mt-1 text-sm text-neutral-500">{{ publication.venue }}</p>
                  </article>
                </div>
              </section>
            </div>
          </section>

          <section class="mb-14">
            <h2 class="font-serif text-2xl md:text-3xl font-bold text-primary mb-5">{{ t.team.expertiseHeading }}</h2>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <div class="text-xs font-mono uppercase tracking-wider text-primary/40 mb-3">{{ t.team.researchInterests }}</div>
                <ul class="space-y-2 text-neutral-600">
                  <li v-for="item in interests" :key="item">{{ item }}</li>
                </ul>
              </div>
            </div>
          </section>

          <section class="mb-14">
            <h2 class="font-serif text-2xl md:text-3xl font-bold text-primary mb-5">{{ t.team.biographyHeading }}</h2>
            <div class="space-y-4 text-neutral-600 leading-relaxed">
              <p>{{ lang === 'id' ? researcher.profileBody.id : researcher.profileBody.en }}</p>
            </div>
          </section>

          <section class="mb-14">
            <h2 class="font-serif text-2xl md:text-3xl font-bold text-primary mb-5">{{ t.team.booksHeading }}</h2>
            <p class="text-neutral-500 leading-relaxed">{{ t.team.booksEmpty }}</p>
          </section>

          <section>
            <h2 class="font-serif text-2xl md:text-3xl font-bold text-primary mb-5">{{ t.team.projectsHeading }}</h2>
            <p class="text-neutral-500 leading-relaxed">{{ t.team.projectsEmpty }}</p>
          </section>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'

type Localized = { id: string; en: string }
type Publication = { id: string; title: string; year: number; authors: string[]; venue: string; type: string; url: string }

const props = defineProps<{
  researcher: {
    name: string
    photo: string
    photoPosition: string
    title: Localized
    shortBio: Localized
    profileBody: Localized
    expertise: string[]
    researchInterests: { id: string[]; en: string[] }
    email: string
    googleScholarUrl: string
    institutionalUrl?: string
    orcidUrl?: string
    scopusUrl?: string
  }
  publications: Publication[]
}>()

const { lang, t } = useI18n()

const externalProfileCount = computed(() => [
  props.researcher.googleScholarUrl,
  props.researcher.institutionalUrl,
  props.researcher.orcidUrl,
  props.researcher.scopusUrl,
].filter(Boolean).length)

const groupedEntries = computed(() => {
  const groups = props.publications.reduce<Record<string, Publication[]>>((acc, publication) => {
    const year = String(publication.year)
    if (!acc[year]) acc[year] = []
    acc[year].push(publication)
    return acc
  }, {})

  return Object.entries(groups)
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([year, items]) => ({ year, items }))
})

const interests = computed(() => lang.value === 'id' ? props.researcher.researchInterests.id : props.researcher.researchInterests.en)
</script>
