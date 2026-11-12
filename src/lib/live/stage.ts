import type { Deck, SlideCtx } from './types'

/** Markup of one slide on the 1920x1080 stage: header, body and footer. Shared by the presenter and `npm run check:fit`. */
export function slideHtml(deck: Deck, idx: number, ctx: SlideCtx): string {
  const sl = deck.slides[idx]
  const body = sl.render(ctx)
  const foot = `<footer><span>${sl.src ? 'Sumber: ' + sl.src : deck.title}</span><span>${sl.appendix ? 'Lampiran · ' : ''}${idx + 1}/${deck.slides.length}</span></footer>`
  return `<section class="lv-sl ${sl.bare ? 'is-bare' : ''} ${sl.appendix ? 'is-appx' : ''}">${
    sl.bare ? '' : `<header><h1>${sl.title}</h1></header>`
  }<div class="lv-body">${body}</div>${foot}</section>`
}
