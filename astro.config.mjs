import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import rehypeRaw from 'rehype-raw'
import { rehypeHeadingIds } from './src/utils/rehype-heading-ids'
import { rehypeGlossary } from './src/utils/rehype-glossary'
import { remarkPlantuml } from './src/utils/remark-plantuml'
import { remarkMermaid } from './src/utils/remark-mermaid'

export default defineConfig({
  site: 'https://se.polinema.ac.id',
  base: '/',
  integrations: [
    vue(),
    sitemap({
      filter: (page) => {
        const excluded = ['/404', '/admin/', '/login/', '/register/', '/checkin/', '/alumni/submit/', '/account/']
        return !excluded.some((path) => page.includes(path))
      },
      customPages: ['https://se.polinema.ac.id/rss.xml', 'https://se.polinema.ac.id/publications.xml', 'https://se.polinema.ac.id/resources'],
    }),
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
    rehypePlugins: [rehypeRaw, rehypeHeadingIds, rehypeGlossary],
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
