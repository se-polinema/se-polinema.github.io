function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function isHeading(tagName: string): boolean {
  return tagName === 'h2' || tagName === 'h3'
}

function getTextContent(node: any): string {
  if (node.type === 'text') return node.value || ''
  if (node.type === 'element' && node.children) {
    return node.children.map((c: any) => getTextContent(c)).join('')
  }
  return ''
}

function walk(node: any, fn: (node: any) => void) {
  if (!node) return
  fn(node)
  if (node.children) {
    for (const child of node.children) {
      walk(child, fn)
    }
  }
}

export function rehypeHeadingIds() {
  const seen = new Map<string, number>()

  return (tree: any) => {
    seen.clear()

    walk(tree, (node: any) => {
      if (node.type !== 'element') return
      if (!isHeading(node.tagName)) return

      const text = getTextContent(node).trim()
      if (!text) return

      let slug = slugify(text)
      const count = seen.get(slug) ?? 0
      if (count > 0) {
        seen.set(slug, count + 1)
        slug = `${slug}-${count}`
      } else {
        seen.set(slug, 1)
      }

      node.properties = node.properties || {}
      node.properties.id = slug
    })
  }
}
