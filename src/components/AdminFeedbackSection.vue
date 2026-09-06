<template>
  <div>
    <div v-if="errorMessage" class="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-mono">
      {{ errorMessage }}
    </div>

    <div class="flex flex-wrap items-end gap-3 mb-6">
      <div>
        <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.feedbackAdmin.filterPageType }}</label>
        <select v-model="filterPageType" class="px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors">
          <option value="all">{{ t.feedbackAdmin.filterAll }}</option>
          <option value="tutorial">tutorial</option>
          <option value="publication">publication</option>
          <option value="blog">blog</option>
        </select>
      </div>
      <div>
        <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.feedbackAdmin.filterLang }}</label>
        <select v-model="filterLang" class="px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors">
          <option value="all">{{ t.feedbackAdmin.filterAll }}</option>
          <option value="en">en</option>
          <option value="id">id</option>
        </select>
      </div>
      <div>
        <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.feedbackAdmin.filterVote }}</label>
        <select v-model="filterVote" class="px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors">
          <option value="all">{{ t.feedbackAdmin.filterAll }}</option>
          <option value="helpful">{{ t.feedbackAdmin.voteHelpful }}</option>
          <option value="not_helpful">{{ t.feedbackAdmin.voteNotHelpful }}</option>
        </select>
      </div>
      <button
        @click="exportCsv"
        class="ml-auto inline-flex items-center gap-2 px-4 py-1.5 text-xs font-mono font-semibold text-white bg-accent hover:bg-accent/90 transition-colors"
      >
        {{ t.feedbackAdmin.exportCsv }}
      </button>
    </div>

    <div v-if="loading" class="py-10 text-center">
      <p class="text-sm font-mono text-neutral-400 dark:text-gray-500">{{ t.events.admin.loading }}</p>
    </div>

    <div v-else-if="filtered.length === 0" class="py-10 text-center">
      <p class="text-sm font-mono text-neutral-400 dark:text-gray-500">{{ t.feedbackAdmin.noEntries }}</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-primary/10 dark:border-gray-700">
            <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.feedbackAdmin.pageTypeCol }}</th>
            <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.feedbackAdmin.slugCol }}</th>
            <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.feedbackAdmin.langCol }}</th>
            <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.feedbackAdmin.voteCol }}</th>
            <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.feedbackAdmin.commentCol }}</th>
            <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2">{{ t.feedbackAdmin.createdCol }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-primary/5 dark:divide-gray-700">
          <tr v-for="f in filtered" :key="f.id">
            <td class="py-2.5 pr-4 font-mono text-xs text-neutral-500 dark:text-gray-400">{{ f.page_type }}</td>
            <td class="py-2.5 pr-4 font-medium text-primary dark:text-gray-100">{{ f.slug }}</td>
            <td class="py-2.5 pr-4 font-mono text-xs text-neutral-500 dark:text-gray-400 uppercase">{{ f.lang }}</td>
            <td class="py-2.5 pr-4">
              <span
                class="inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
                :class="f.vote === 'helpful'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'"
              >
                {{ f.vote === 'helpful' ? t.feedbackAdmin.voteHelpful : t.feedbackAdmin.voteNotHelpful }}
              </span>
            </td>
            <td class="py-2.5 pr-4 text-neutral-600 dark:text-gray-300 max-w-md">
              <span v-if="f.comment">{{ f.comment }}</span>
              <span v-else class="text-neutral-400 dark:text-gray-500">—</span>
            </td>
            <td class="py-2.5 font-mono text-xs text-neutral-400 dark:text-gray-500">{{ formatDate(f.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import { supabase } from '../lib/supabase'

const { t } = useI18n()

interface FeedbackRow {
  id: string
  page_path: string
  page_type: string
  slug: string
  lang: string
  vote: string
  comment: string | null
  created_at: string
  visitor_hash: string
}

const rows = ref<FeedbackRow[]>([])
const loading = ref(true)
const errorMessage = ref('')

const filterPageType = ref('all')
const filterLang = ref('all')
const filterVote = ref('all')

const filtered = computed(() =>
  rows.value.filter((r) => {
    if (filterPageType.value !== 'all' && r.page_type !== filterPageType.value) return false
    if (filterLang.value !== 'all' && r.lang !== filterLang.value) return false
    if (filterVote.value !== 'all' && r.vote !== filterVote.value) return false
    return true
  })
)

async function load() {
  loading.value = true
  errorMessage.value = ''
  const { data, error } = await supabase
    .schema('se')
    .from('page_feedback')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500)

  loading.value = false

  if (error) {
    errorMessage.value = error.message
    return
  }
  rows.value = data ?? []
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function csvEscape(value: string): string {
  return `"${value.replace(/"/g, '""')}"`
}

function exportCsv() {
  const header = ['page_type', 'slug', 'page_path', 'lang', 'vote', 'comment', 'created_at']
  const lines = [header.join(',')]
  for (const r of filtered.value) {
    lines.push([
      r.page_type,
      r.slug,
      r.page_path,
      r.lang,
      r.vote,
      r.comment ?? '',
      r.created_at,
    ].map((v) => csvEscape(String(v))).join(','))
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `page-feedback-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

onMounted(load)
</script>
