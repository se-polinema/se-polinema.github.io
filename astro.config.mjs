import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { rehypeHeadingIds } from './src/utils/rehype-heading-ids'
import { rehypeGlossary } from './src/utils/rehype-glossary'
import { remarkPlantuml } from './src/utils/remark-plantuml'

export default defineConfig({
  site: 'https://se.polinema.ac.id',
  base: '/',
  integrations: [
    vue(),
    sitemap({
      filter: (page) => !page.includes('/404'),
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
    ],
    rehypePlugins: [rehypeHeadingIds, rehypeGlossary],
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
