import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import rehypeRaw from 'rehype-raw'
import { rehypeHeadingIds } from './src/utils/rehype-heading-ids'
import { rehypeGlossary } from './src/utils/rehype-glossary'
import { rehypeBasePaths } from './src/utils/rehype-base-paths'
import { remarkPlantuml } from './src/utils/remark-plantuml'
import { remarkMermaid } from './src/utils/remark-mermaid'

// BASE_PATH selects the deploy target: unset (or '/') for production at the
// site root, '/beta/' for the beta build served from the develop branch.
const base = process.env.BASE_PATH ?? '/'
const isBeta = base !== '/'
const site = 'https://se.polinema.ac.id' + (isBeta ? base.replace(/\/$/, '') : '')

export default defineConfig({
  site,
  base,
  integrations: [
    vue(),
    // Sitemap/customPages are production-only; beta is unlisted (see robots meta in Default.astro).
    ...(isBeta
      ? []
      : [
          sitemap({
            filter: (page) => {
              const excluded = ['/404', '/admin/', '/login/', '/register/', '/checkin/', '/alumni/submit/', '/members/submit/', '/showcase/submit/', '/account/']
              if (/\/researchers\/[^/]+\/slides\/?$/.test(page)) return false
              return !excluded.some((path) => page.includes(path))
            },
            customPages: ['https://se.polinema.ac.id/rss.xml', 'https://se.polinema.ac.id/publications.xml', 'https://se.polinema.ac.id/resources', 'https://se.polinema.ac.id/events.ics'],
          }),
        ]),
  ],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'dark-plus',
    },
    remarkPlugins: [
      [remarkPlantuml, { cacheDir: 'src/content/diagrams-cache' }],
      [remarkMermaid, { cacheDir: 'src/content/diagrams-cache' }],
    ],
    rehypePlugins: [rehypeRaw, rehypeHeadingIds, rehypeGlossary, [rehypeBasePaths, { base }]],
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
