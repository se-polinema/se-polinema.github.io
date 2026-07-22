<template>
  <div class="flex items-center gap-4">
    <div class="relative h-20 w-16 shrink-0 bg-primary/5 dark:bg-gray-700 border border-neutral-200 dark:border-gray-600 overflow-hidden flex items-center justify-center">
      <img v-if="modelValue" :src="modelValue" alt="" class="h-full w-full object-cover object-top" />
      <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-primary/30 dark:text-gray-500">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
      </svg>
      <div v-if="uploading" class="absolute inset-0 bg-white/70 dark:bg-gray-900/70 flex items-center justify-center">
        <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-semibold text-primary dark:text-gray-100 bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 hover:border-accent dark:hover:border-accent transition-colors cursor-pointer w-fit">
        {{ uploading ? t.memberPhotoUpload.uploadingLabel : (modelValue ? t.memberPhotoUpload.changeLabel : t.memberPhotoUpload.uploadLabel) }}
        <input type="file" accept="image/jpeg,image/png,image/webp" class="hidden" :disabled="uploading" @change="handleFileChange" />
      </label>
      <button
        v-if="modelValue"
        type="button"
        @click="emit('update:modelValue', null)"
        class="text-xs font-mono text-red-500/70 hover:text-red-600 dark:hover:text-red-400 transition-colors w-fit"
      >
        {{ t.memberPhotoUpload.removeLabel }}
      </button>
      <p v-if="errorMessage" class="text-xs font-mono text-red-600 dark:text-red-400 max-w-xs">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '../composables/useI18n'
import { supabase } from '../lib/supabase'
import { resizeImageForUpload, ImageResizeError } from '../utils/resizeImage'

const props = defineProps<{
  modelValue: string | null
  uploadPathPrefix: string
  bucket: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const { t } = useI18n()

const uploading = ref(false)
const errorMessage = ref('')

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploading.value = true
  errorMessage.value = ''

  try {
    const blob = await resizeImageForUpload(file)
    const path = `${props.uploadPathPrefix}/photo.jpg`

    const { error: uploadError } = await supabase.storage
      .from(props.bucket)
      .upload(path, blob, { upsert: true, contentType: 'image/jpeg' })

    if (uploadError) {
      errorMessage.value = uploadError.message || t.value.memberPhotoUpload.genericError
      return
    }

    const { data } = supabase.storage.from(props.bucket).getPublicUrl(path)
    // Cache-bust: the object path is stable (upsert overwrites the same key
    // on re-upload), so append a timestamp to avoid a stale cached image.
    emit('update:modelValue', `${data.publicUrl}?t=${Date.now()}`)
  } catch (err) {
    errorMessage.value = err instanceof ImageResizeError ? err.message : t.value.memberPhotoUpload.genericError
  } finally {
    uploading.value = false
    input.value = ''
  }
}
</script>
