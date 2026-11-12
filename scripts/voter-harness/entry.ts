// Mounts the real LiveVoter on a plain page for `npm run check:voter`; Supabase calls are replaced by mock-session.ts.
import { createApp } from 'vue'
import LiveVoter from '../../src/components/live/LiveVoter.vue'
import { caseName } from './mock-session'

if (caseName !== 'code') history.replaceState(null, '', `${location.pathname}?case=${caseName}&code=ABCDEF`)
createApp(LiveVoter).mount('#app')

// Measure after the component settled.
setTimeout(() => {
  const w = window.innerWidth
  const wide: string[] = []
  document.querySelectorAll<HTMLElement>('#app *').forEach((el) => {
    const r = el.getBoundingClientRect()
    if (r.width && r.right > w + 0.5) wide.push(`${el.tagName.toLowerCase()}.${el.className}`.slice(0, 60))
  })
  const small: string[] = []
  document.querySelectorAll<HTMLElement>('#app button, #app input, #app textarea').forEach((el) => {
    const r = el.getBoundingClientRect()
    if (r.height && r.height < 44) small.push(`${el.tagName.toLowerCase()}.${el.className} ${Math.round(r.height)}px`)
  })
  const bar = document.querySelector<HTMLElement>('.lv-sendbar')
  const out = {
    case: caseName,
    width: w,
    overflowX: document.documentElement.scrollWidth > w,
    wide: [...new Set(wide)],
    small,
    sendbarVisible: bar ? bar.getBoundingClientRect().bottom <= window.innerHeight + 1 : null,
    hasContent: !!document.querySelector('.lv-card'),
    fontSmall: [...document.querySelectorAll<HTMLElement>('#app textarea, #app input')].some((e) => parseFloat(getComputedStyle(e).fontSize) < 16),
  }
  document.getElementById('out')!.textContent = JSON.stringify(out)
}, 600)
