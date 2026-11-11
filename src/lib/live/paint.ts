import { esc, pc } from './format'
import type { Question, Results } from './types'

/** Render a poll's options into `el`. Without `res`/`revealed` it shows plain choices; revealed adds result bars. */
export function paintOptions(el: HTMLElement, q: Question, res: Results | null, revealed: boolean) {
  const n = res?.n ?? 0
  const top = revealed && res ? Math.max(0, ...q.options.map((o) => res.counts[o.key] ?? 0)) : 0
  el.innerHTML =
    q.options
      .map((o, i) => {
        const c = res?.counts[o.key] ?? 0
        const p = n ? (c / n) * 100 : 0
        const win = revealed && c > 0 && c === top
        return `<div class="lv-opt ${revealed ? 'is-rev' : ''} ${win ? 'is-win' : ''}">
          ${revealed ? `<i class="lv-fill" style="width:${p}%"></i>` : ''}
          <span class="lv-letter">${String.fromCharCode(65 + i)}</span>
          <span class="lv-otext"><b>${esc(o.label)}</b>${o.note ? `<small>${esc(o.note)}</small>` : ''}</span>
          ${revealed ? `<span class="lv-ores"><b>${pc(p)}</b><small>${c} suara</small></span>` : ''}
        </div>`
      })
      .join('') +
    (revealed && q.other ? paintOthers(res) : '') +
    (revealed
      ? `<p class="lv-note">${n} pemilih. Persentase dari jumlah pemilih${q.max > 1 ? '; satu pemilih boleh memilih lebih dari satu' : ''}.</p>`
      : '')
}

/** The optional "Lainnya" answers, shown on the projected slide only after reveal. */
function paintOthers(res: Results | null): string {
  const texts = res?.others ?? []
  const count = res?.n_other ?? texts.length
  if (!count) return '<p class="lv-note">Belum ada usulan lain.</p>'
  return `<div class="lv-others"><h4>Usulan lain dari dosen (${count})</h4>${texts
    .slice(0, 4)
    .map((t) => `<div class="lv-sug">${esc(t)}</div>`)
    .join('')}${texts.length > 4 ? `<p class="lv-note">dan ${texts.length - 4} lainnya (ada di berkas CSV)</p>` : ''}</div>`
}

/** Escaped list of free-text suggestions for the projected slide. */
export function paintSuggestions(el: HTMLElement, rows: { body: string }[]) {
  el.innerHTML = rows.length
    ? rows.map((r) => `<div class="lv-sug">${esc(r.body)}</div>`).join('')
    : '<p class="lv-note">Belum ada saran.</p>'
}
