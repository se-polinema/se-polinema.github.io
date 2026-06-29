<template>
  <div class="hidden" />
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useI18n } from '../composables/useI18n'

const { t, lang } = useI18n()

const wrapperClass = 'code-block-wrapper'
const btnClass = 'copy-code-btn'
const labelClass = 'copy-code-label'

const buttons: HTMLButtonElement[] = []

function handleCopy(btn: HTMLButtonElement, pre: HTMLPreElement) {
  const code = pre.querySelector('code')?.textContent ?? pre.textContent ?? ''
  if (!code) return
  navigator.clipboard.writeText(code).then(() => {
    btn.classList.add('copied')
    const label = btn.querySelector(`.${labelClass}`)
    if (label) label.textContent = t.value.blog.codeCopied
    const ariaLabel = btn.getAttribute('aria-label')
    btn.setAttribute('data-prev-label', ariaLabel ?? '')
    btn.setAttribute('aria-label', t.value.blog.codeCopied)
    setTimeout(() => {
      btn.classList.remove('copied')
      if (label) label.textContent = t.value.blog.copyCode
      btn.setAttribute('aria-label', btn.getAttribute('data-prev-label') ?? t.value.blog.copyCode)
    }, 2000)
  }).catch(() => {
    const textarea = document.createElement('textarea')
    textarea.value = code
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    btn.classList.add('copied')
    const label = btn.querySelector(`.${labelClass}`)
    if (label) label.textContent = t.value.blog.codeCopied
    setTimeout(() => {
      btn.classList.remove('copied')
      if (label) label.textContent = t.value.blog.copyCode
    }, 2000)
  })
}

function createCopyButton(pre: HTMLPreElement) {
  const parent = pre.parentNode
  if (!parent || pre.closest(`.${wrapperClass}`)) return

  const wrapper = document.createElement('div')
  wrapper.className = `${wrapperClass} group/code`

  parent.insertBefore(wrapper, pre)
  wrapper.appendChild(pre)

  const btn = document.createElement('button')
  btn.className = btnClass
  btn.setAttribute('aria-label', t.value.blog.copyCode)
  btn.setAttribute('data-prev-label', t.value.blog.copyCode)
  btn.innerHTML = `<svg class="copy-code-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg><span class="${labelClass}">${t.value.blog.copyCode}</span>`

  btn.addEventListener('click', () => handleCopy(btn, pre))
  wrapper.appendChild(btn)
  buttons.push(btn)
}

onMounted(() => {
  const container = document.querySelector('.bilingual-post')
  if (!container) return
  container.querySelectorAll('pre').forEach((pre) => createCopyButton(pre as HTMLPreElement))
})

watch(lang, () => {
  buttons.forEach((btn) => {
    if (btn.classList.contains('copied')) return
    const label = btn.querySelector(`.${labelClass}`)
    if (label) label.textContent = t.value.blog.copyCode
    btn.setAttribute('aria-label', t.value.blog.copyCode)
    btn.setAttribute('data-prev-label', t.value.blog.copyCode)
  })
})
</script>
