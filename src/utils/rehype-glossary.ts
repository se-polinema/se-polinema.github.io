import glossaryData from '../data/glossary.json'

interface GlossaryTerm {
  term: string
  termId: string
  definition: string
  definitionId: string
  slug: string
  stream?: string
  relatedTerms?: string[]
}

const terms: GlossaryTerm[] = glossaryData as GlossaryTerm[]

const SKIP_TAGS = new Set(['a', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'script', 'style', 'img', 'svg', 'button', 'input', 'select', 'textarea'])

function walk(node: any, parents: any[], fn: (node: any, parents: any[]) => void) {
  if (!node) return
  fn(node, parents)
  if (node.children) {
    const childParents = node.type === 'element' ? [...parents, node] : parents
    for (const child of node.children) {
      walk(child, childParents, fn)
    }
  }
}

export function rehypeGlossary() {
  return (tree: any) => {
    const seenTerms = new Set<string>()

    walk(tree, [], (node: any, parents: any[]) => {
      if (node.type !== 'text') return
      const text = node.value as string
      if (!text || text.trim().length === 0) return

      for (const parent of parents) {
        if (parent.tagName && SKIP_TAGS.has(parent.tagName)) return
      }

      let bestMatch: { term: GlossaryTerm; index: number; length: number } | null = null

      for (const term of terms) {
        if (seenTerms.has(term.slug)) continue
        const escaped = term.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const match = text.match(new RegExp(`\\b${escaped}\\b(?!['"\\w])`))
        if (!match || match.index === undefined) continue
        if (!bestMatch || match.index < bestMatch.index) {
          bestMatch = { term, index: match.index, length: match[0].length }
        }
      }

      if (!bestMatch) return

      seenTerms.add(bestMatch.term.slug)

      const parent = parents[parents.length - 1]
      if (!parent || !parent.children) return

      const idx = parent.children.indexOf(node)
      if (idx === -1) return

      const before = text.slice(0, bestMatch.index)
      const matched = text.slice(bestMatch.index, bestMatch.index + bestMatch.length)
      const after = text.slice(bestMatch.index + bestMatch.length)

      const fragments: any[] = []
      if (before) fragments.push({ type: 'text', value: before })
      fragments.push({
        type: 'element',
        tagName: 'a',
        properties: {
          href: `/glossary#${bestMatch.term.slug}`,
          class: 'glossary-link',
          title: `${bestMatch.term.term}: ${bestMatch.term.definition.slice(0, 120)}...`,
          'data-glossary-slug': bestMatch.term.slug,
        },
        children: [{ type: 'text', value: matched }],
      })
      if (after) fragments.push({ type: 'text', value: after })

      parent.children.splice(idx, 1, ...fragments)
    })
  }
}
