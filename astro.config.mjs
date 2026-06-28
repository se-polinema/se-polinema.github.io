import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { rehypeHeadingIds } from './src/utils/rehype-heading-ids'

export default defineConfig({
  site: 'https://se-polinema.github.io',
  base: '/',
  integrations: [
    vue(),
    sitemap({
      filter: (page) => !page.includes('/404'),
      customPages: ['https://se-polinema.github.io/rss.xml'],
    }),
  ],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'dark-plus',
    },
    rehypePlugins: [rehypeHeadingIds],
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
