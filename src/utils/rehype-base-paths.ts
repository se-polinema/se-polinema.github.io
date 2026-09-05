// Content collections (blog posts, etc.) occasionally embed raw HTML with
// root-absolute asset paths (e.g. `<img src="/blog/diagram.svg">`) rather
// than going through a component that calls withBase() itself. This plugin
// rewrites those attributes post-render so beta (BASE_PATH=/beta/) gets the
// correct prefix without editing the content files.
//
// `base` is passed in explicitly from astro.config.mjs rather than imported
// from src/lib/paths.ts: this plugin is wired into the markdown pipeline via
// the Astro config module graph, which loads outside the per-page Vite
// transform that statically replaces import.meta.env.BASE_URL, so reading
// that env var here would silently always see '/'.
const REWRITE_ATTRS: Record<string, string[]> = {
  img: ['src'],
  a: ['href'],
  source: ['src'],
  video: ['src', 'poster'],
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

export function rehypeBasePaths(options: { base?: string } = {}) {
  const base = options.base ?? '/'
  return (tree: any) => {
    if (base === '/') return
    walk(tree, (node: any) => {
      if (node.type !== 'element' || !node.properties) return
      const attrs = REWRITE_ATTRS[node.tagName]
      if (!attrs) return
      for (const attr of attrs) {
        const value = node.properties[attr]
        if (typeof value === 'string' && value.startsWith('/') && !value.startsWith(base)) {
          node.properties[attr] = base + value.slice(1)
        }
      }
    })
  }
}
