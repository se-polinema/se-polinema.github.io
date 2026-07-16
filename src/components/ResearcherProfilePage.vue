<template>
  <div class="px-8 py-4">
    <section class="grid lg:grid-cols-[22rem_minmax(0,1fr)] gap-8 lg:gap-12 mb-8 items-start">

      <!-- ── Sidebar ── -->
      <aside class="lg:sticky lg:top-4">
        <div class="flex gap-5">

          <!-- Left sub-col: photo + affiliation + contact + external profiles -->
          <div class="w-36 shrink-0 space-y-3 text-[13px] text-neutral-600 dark:text-gray-300">
            <div class="relative aspect-[4/5] w-full bg-neutral-50 dark:bg-gray-800 border border-neutral-200 dark:border-gray-600 overflow-hidden">
              <img
                :src="researcher.photo"
                :alt="researcher.name"
                class="h-full w-full object-cover grayscale contrast-110 transition duration-300 hover:grayscale-0"
                :style="{ objectPosition: researcher.photoPosition }"
                loading="lazy"
              />
            </div>
            <div>
              <div class="font-mono text-[10px] uppercase tracking-widest text-primary/35 dark:text-gray-500 mb-0.5">{{ t.team.affiliation }}</div>
              <div class="leading-snug">Software Engineering Laboratory<br />Jurusan Teknologi Informasi<br />Politeknik Negeri Malang</div>
            </div>
            <div>
              <div class="font-mono text-[10px] uppercase tracking-widest text-primary/35 dark:text-gray-500 mb-0.5">{{ t.team.contact }}</div>
              <a :href="`mailto:${researcher.email}`" class="text-primary dark:text-blue-300 hover:text-accent-700 dark:hover:text-accent-400 transition-colors break-all">{{ researcher.email }}</a>
            </div>
            <div>
              <div class="font-mono text-[10px] uppercase tracking-widest text-primary/35 dark:text-gray-500 mb-0.5">{{ t.team.externalProfiles }}</div>
              <ul class="space-y-0.5">
                <li><a :href="researcher.googleScholarUrl" target="_blank" rel="noopener" class="text-primary dark:text-blue-300 hover:text-accent-700 dark:hover:text-accent-400 transition-colors">Google Scholar</a></li>
                <li v-if="researcher.institutionalUrl"><a :href="researcher.institutionalUrl" target="_blank" rel="noopener" class="text-primary dark:text-blue-300 hover:text-accent-700 dark:hover:text-accent-400 transition-colors">{{ t.team.institutionalPage }}</a></li>
                <li v-if="researcher.orcidUrl"><a :href="researcher.orcidUrl" target="_blank" rel="noopener" class="text-primary dark:text-blue-300 hover:text-accent-700 dark:hover:text-accent-400 transition-colors">ORCID</a></li>
                <li v-if="researcher.scopusUrl"><a :href="researcher.scopusUrl" target="_blank" rel="noopener" class="text-primary dark:text-blue-300 hover:text-accent-700 dark:hover:text-accent-400 transition-colors">Scopus</a></li>
              </ul>
            </div>
          </div>

          <!-- Right sub-col: stats + research interests + expertise pills -->
          <div class="flex-1 min-w-0 flex flex-col justify-between gap-3">
            <!-- Stats: grid, full width -->
            <div class="grid grid-cols-3 gap-1">
              <div class="border border-primary/10 dark:border-gray-600 p-2 text-center">
                <div class="font-serif text-lg font-bold text-primary dark:text-gray-100 tabular-nums leading-none">{{ publications.length }}</div>
                <div class="font-mono text-[8px] uppercase tracking-wide text-primary/35 dark:text-gray-500 mt-1 leading-tight">{{ t.team.worksLabel }}</div>
              </div>
              <div class="border border-primary/10 dark:border-gray-600 p-2 text-center">
                <div class="font-serif text-lg font-bold text-primary dark:text-gray-100 tabular-nums leading-none">{{ researcher.expertise.length }}</div>
                <div class="font-mono text-[8px] uppercase tracking-wide text-primary/35 dark:text-gray-500 mt-1 leading-tight">Areas</div>
              </div>
              <div class="border border-primary/10 dark:border-gray-600 p-2 text-center">
                <div class="font-serif text-lg font-bold text-primary dark:text-gray-100 tabular-nums leading-none">{{ externalProfileCount }}</div>
                <div class="font-mono text-[8px] uppercase tracking-wide text-primary/35 dark:text-gray-500 mt-1 leading-tight">Profiles</div>
              </div>
            </div>

            <!-- Scholar Metrics -->
            <div v-if="researcher.scholarMetrics" class="grid grid-cols-3 gap-1">
              <div class="border border-primary/10 dark:border-gray-600 p-2 text-center">
                <div class="font-serif text-lg font-bold text-primary dark:text-gray-100 tabular-nums leading-none">{{ researcher.scholarMetrics.hindex }}</div>
                <div class="font-mono text-[8px] uppercase tracking-wide text-primary/35 dark:text-gray-500 mt-1 leading-tight">{{ t.team.hindexLabel }}</div>
              </div>
              <div class="border border-primary/10 dark:border-gray-600 p-2 text-center">
                <div class="font-serif text-lg font-bold text-primary dark:text-gray-100 tabular-nums leading-none">{{ researcher.scholarMetrics.i10index }}</div>
                <div class="font-mono text-[8px] uppercase tracking-wide text-primary/35 dark:text-gray-500 mt-1 leading-tight">{{ t.team.i10indexLabel }}</div>
              </div>
              <div class="border border-primary/10 dark:border-gray-600 p-2 text-center">
                <div class="font-serif text-lg font-bold text-primary dark:text-gray-100 tabular-nums leading-none">{{ researcher.scholarMetrics.citedby }}</div>
                <div class="font-mono text-[8px] uppercase tracking-wide text-primary/35 dark:text-gray-500 mt-1 leading-tight">{{ t.team.citedByLabel }}</div>
              </div>
            </div>

            <!-- Research interests list -->
            <div>
              <div class="font-mono text-[9px] uppercase tracking-widest text-primary/35 dark:text-gray-500 mb-1.5">{{ t.team.researchInterests }}</div>
              <ul class="space-y-1">
                <li v-for="item in interests" :key="item" class="text-[12px] text-neutral-600 dark:text-gray-300 leading-snug">{{ item }}</li>
              </ul>
            </div>

            <!-- Research Themes (lab stream mapping) -->
            <div v-if="researcher.streams?.length" class="border-t border-primary/10 dark:border-gray-600 pt-2.5">
              <div class="font-mono text-[9px] uppercase tracking-widest text-primary/35 dark:text-gray-500 mb-1.5">{{ t.team.researchThemes }}</div>
              <div class="flex flex-col gap-1">
                <span
                  v-for="streamId in researcher.streams"
                  :key="streamId"
                  class="text-[11px] font-mono px-1.5 py-1 rounded bg-primary/[0.06] dark:bg-gray-700 text-primary/70 dark:text-gray-300 border border-primary/10 dark:border-gray-600 leading-snug"
                >
                  {{ getStreamName(streamId) }}
                </span>
              </div>
            </div>

            <!-- Expertise pills -->
            <div class="border-t border-primary/10 dark:border-gray-600 pt-2.5 flex flex-wrap gap-1">
              <span
                v-for="item in researcher.expertise"
                :key="item"
                class="font-mono text-[9px] uppercase tracking-wide text-primary/55 dark:text-gray-400 bg-neutral-50 dark:bg-gray-800 border border-primary/10 dark:border-gray-600 px-1.5 py-0.5 leading-none"
              >{{ item }}</span>
            </div>

            <!-- Contact Form -->
            <ResearcherContactForm
              :researcher-name="researcher.name"
              :researcher-email="researcher.email"
              :researcher-streams="researcher.streams || []"
            />
          </div>

        </div>
      </aside>

      <!-- ── Main content ── -->
      <div>
        <!-- Header -->
        <div class="profile-hd border-b border-primary/10 dark:border-gray-600 pb-4 mb-5">
          <h1>{{ researcher.name }}</h1>
          <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-primary/45 dark:text-gray-500 mt-1 mb-2">
            {{ lang === 'id' ? researcher.title.id : researcher.title.en }}
          </p>
          <p class="text-neutral-600 dark:text-gray-300 leading-relaxed text-sm max-w-2xl">
            {{ lang === 'id' ? researcher.shortBio.id : researcher.shortBio.en }}
          </p>
        </div>

        <!-- Sections -->
        <div class="profile-body">
          <!-- Biography -->
          <section class="mb-7">
            <h2>{{ t.team.biographyHeading }}</h2>
            <p class="text-neutral-600 dark:text-gray-300 leading-relaxed text-sm">{{ lang === 'id' ? researcher.profileBody.id : researcher.profileBody.en }}</p>
          </section>

          <!-- Books -->
          <section class="mb-7">
            <h2>{{ t.team.booksHeading }}</h2>
            <template v-if="props.researcher.books?.length">
              <ul class="space-y-4">
                <li v-for="book in props.researcher.books" :key="book.title" class="flex flex-col sm:flex-row gap-4">
                  <div
                    v-if="book.coverImage"
                    class="w-28 shrink-0 aspect-[3/4] bg-neutral-100 dark:bg-gray-700 overflow-hidden border border-primary/10 dark:border-gray-600"
                  >
                    <img
                      :src="book.coverImage"
                      :alt="`Cover of ${book.title}`"
                      class="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                  <div class="min-w-0">
                    <div class="font-serif text-[1rem] font-semibold text-primary dark:text-gray-100 leading-snug">{{ lang === 'id' && book.titleId ? book.titleId : book.title }}</div>
                    <p v-if="book.description || book.descriptionId" class="text-sm text-neutral-500 dark:text-gray-400 mt-1 leading-relaxed max-w-xl">{{ lang === 'id' && book.descriptionId ? book.descriptionId : book.description }}</p>
                    <div v-if="book.url" class="mt-1.5">
                      <a :href="book.url" target="_blank" rel="noopener" class="text-[13px] text-primary dark:text-blue-300 hover:text-accent-700 dark:hover:text-accent-400 transition-colors">{{ t.books.viewBookSite }} ↗</a>
                    </div>
                    <div v-if="book.playstoreUrl" class="mt-1.5">
                      <a :href="book.playstoreUrl" target="_blank" rel="noopener" class="text-[13px] text-primary dark:text-blue-300 hover:text-accent-700 dark:hover:text-accent-400 transition-colors">Buy on Google Play Books →</a>
                    </div>
                  </div>
                </li>
              </ul>
            </template>
            <p v-else class="text-neutral-500 dark:text-gray-400 text-sm">{{ t.team.booksEmpty }}</p>
          </section>

          <!-- Projects -->
          <section class="mb-7">
            <h2>{{ t.team.projectsHeading }}</h2>
            <template v-if="props.researcher.projects?.length">
              <ul class="space-y-3">
                <li v-for="project in props.researcher.projects" :key="project.repo">
                  <a
                    :href="`https://github.com/${project.repo}`"
                    target="_blank" rel="noopener"
                    class="font-mono text-[13px] text-primary dark:text-blue-300 hover:text-accent-700 dark:hover:text-accent-400 transition-colors"
                  >{{ lang === 'id' && project.nameId ? project.nameId : (project.name ?? project.repo) }}</a>
                  <p v-if="project.description || project.descriptionId" class="text-sm text-neutral-500 dark:text-gray-400 mt-1 leading-relaxed max-w-xl">{{ lang === 'id' && project.descriptionId ? project.descriptionId : project.description }}</p>
                </li>
              </ul>
            </template>
            <p v-else class="text-neutral-500 dark:text-gray-400 text-sm">{{ t.team.projectsEmpty }}</p>
          </section>

          <!-- Expertise / Research Interests -->
          <section class="mb-7">
            <h2>{{ t.team.expertiseHeading }}</h2>
            <div class="font-mono text-[10px] uppercase tracking-widest text-primary/35 dark:text-gray-500 mb-2">{{ t.team.researchInterests }}</div>
            <ul class="space-y-1 text-neutral-600 dark:text-gray-300 text-sm">
              <li v-for="item in interests" :key="item">{{ item }}</li>
            </ul>
          </section>

          <!-- Publications -->
          <section>
            <div class="flex items-baseline justify-between gap-4 mb-3">
              <h2>{{ t.team.publicationsHeading }}</h2>
              <a href="/publications" class="text-[13px] text-primary/55 dark:text-gray-400 hover:text-primary dark:hover:text-gray-100 transition-colors whitespace-nowrap">{{ t.team.viewPublicationArchive }}</a>
            </div>
            <div class="space-y-6">
              <div v-for="group in groupedEntries" :key="group.year">
                <div class="font-mono text-[10px] uppercase tracking-[0.22em] text-primary/35 dark:text-gray-500 mb-3">{{ group.year }}</div>
                <div class="space-y-4">
                  <article v-for="publication in group.items" :key="publication.id" class="border-t border-primary/10 dark:border-gray-600 pt-4">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-mono text-[10px] uppercase tracking-widest text-primary/35 dark:text-gray-500">{{ publication.type }}</span>
                      <span v-if="publication.citedByCount > 0" class="font-mono text-[10px] text-primary/45 dark:text-gray-400">{{ t.team.citedLabel.replace('{n}', String(publication.citedByCount)) }}</span>
                    </div>
                    <h3 class="font-serif text-[1rem] font-semibold text-primary dark:text-gray-100 leading-snug">
                      <a :href="`/publications/${publication.id}`" class="hover:underline decoration-primary/20 underline-offset-4">{{ publication.title }}</a>
                    </h3>
                    <p class="mt-1 text-[13px] text-neutral-600 dark:text-gray-300">{{ publication.authors.join(', ') }}</p>
                    <p class="mt-0.5 text-[13px] text-neutral-400 dark:text-gray-500 italic">{{ publication.venue }}</p>
                    <a v-if="publication.url" :href="publication.url" target="_blank" rel="noopener" class="inline-block mt-1.5 text-[13px] text-primary/60 dark:text-gray-400 hover:text-primary dark:hover:text-gray-100 transition-colors">{{ t.publications.viewPublication }} →</a>
                  </article>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'
import researchData from '../data/research.json'
import ResearcherContactForm from './ResearcherContactForm.vue'

type Localized = { id: string; en: string }
type Publication = { id: string; title: string; year: number; authors: string[]; venue: string; type: string; url: string; citedByCount: number }

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
    projects?: Array<{ name?: string; nameId?: string; repo: string; description?: string; descriptionId?: string }>
    books?: Array<{ title: string; titleId?: string; url?: string; playstoreUrl?: string; coverImage?: string; description?: string; descriptionId?: string; year?: number; publisher?: string; isbn?: string }>
    streams?: string[]
    scholarMetrics?: {
      hindex: number
      i10index: number
      citedby: number
      citedby5y: number
    } | null
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

function getStreamName(id: string) {
  const stream = researchData.find(r => r.id === id)
  return stream ? (lang.value === 'id' ? stream.name.id : stream.name.en) : id
}
</script>

<style scoped>
/* Override global 2.5rem — profile name should be prominent but not page-title scale */
:deep(.profile-hd h1:not([class])) {
  font-size: 1.625rem;
  margin-bottom: 0;
}

/* Global h2 carries margin-top: 1.75rem which double-stacks with section mb — zero it out */
:deep(.profile-body h2:not([class])) {
  margin-top: 0;
  margin-bottom: 0.25rem;
  font-size: 1.125rem;
}
</style>
