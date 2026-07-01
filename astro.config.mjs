import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { rehypeHeadingIds } from './src/utils/rehype-heading-ids'
import { remarkPlantuml } from './src/utils/remark-plantuml'

export default defineConfig({
  site: 'https://se-polinema.github.io',
  base: '/',
  integrations: [
    vue(),
    sitemap({
      filter: (page) => !page.includes('/404'),
      customPages: ['https://se-polinema.github.io/rss.xml', 'https://se-polinema.github.io/publications.xml'],
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
    rehypePlugins: [rehypeHeadingIds],
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
