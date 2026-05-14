# Software Engineering Laboratory — Landing Page Plan

## Overview

Landing page for **Software Engineering Laboratory** under **Jurusan Teknologi Informasi, Politeknik Negeri Malang**.

## Technology Stack

| Layer | Choice |
|-------|--------|
| Framework | Astro |
| UI | Vue 3 |
| Styling | Tailwind CSS (mobile-first) |
| Blog | Astro Content Collections (markdown) |
| i18n | JSON-based (ID + EN), composable |
| Deployment | GitHub Pages via Actions |

## Design Philosophy: "Editorial Academic"

A purpose-built academic design — content-forward, typography-driven, restrained.

### Anti-patterns (explicitly avoided)
- Glassmorphism / frosted cards
- Purple-pink gradients on hero
- Floating particles / confetti
- Generic wave SVG dividers
- Oversized emoji icons
- Overdramatic box shadows
- Centered-everything layouts

### Typography

| Role | Font | Rationale |
|------|------|-----------|
| Headings | Serif (Merriweather) | Academic credibility |
| Body | Sans-serif (Inter) | Readability |
| Code/Labels | Mono (JetBrains Mono) | Technical SE context |

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| Polinema Navy | `#29156A` | 7% — headings, nav, footer |
| JTI Yellow | `#FFB100` | 2% — hover states, active indicators |
| JTI Red | `#FF5248` | 1% — key CTAs, stats |
| Neutrals | White / off-white / light gray | 90% — backgrounds |

### Brand Assets

- Polinema logo: `wikimedia.org/.../Logo_Politeknik_Negeri_Malang.png`
- JTI logo: `jti.polinema.ac.id/.../ti5.png`
- Address: Jl. Soekarno Hatta No.9, Lowokwaru, Malang 65141

## Page Sections

| # | Section | Status | Description |
|---|---------|--------|-------------|
| 1 | Header | Real | Sticky nav, logo, links, lang toggle, mobile drawer |
| 2 | Hero | Real | Lab name, JTI badge, bilingual tagline, stats bar |
| 3 | About | Real | Lab overview, JTI affiliation, vision |
| 4 | Research | Real | 7 focus areas in journal TOC numbered style |
| 5 | Team | Real | 6 researcher cards (faculty directory style) |
| 6 | News | Real | Latest 3 posts from blog content collection |
| 7 | Projects | Placeholder | Card grid, empty state |
| 8 | Publications | Placeholder | List layout, empty state |
| 9 | Gallery | Placeholder | Grid, empty state |
| 10 | Partners | Placeholder | Logo carousel placeholder |
| 11 | Contact | Real | Address, email, map embed, social links |
| 12 | Footer | Real | Links, copyright, Polinema badge |

## Research Focus Areas (SE domains, no security)

1. Web Engineering
2. Mobile Development
3. UI/UX Design
4. Software Quality & Testing
5. Data Science
6. Artificial Intelligence
7. Cloud Computing & DevOps

## Team

1. Imam Fahrur Rozi
2. Ridwan Rismanto
3. Elok Hamdana
4. Dian Hanifudin Subhi
5. Moch. Zawaruddin Abdullah
6. Ariadi Retno Tri Hayati Ririd

## i18n Strategy

- Source files: `src/i18n/id.json`, `src/i18n/en.json`
- Composable: `useI18n.ts` — detects language, provides reactive locale
- Toggle: Header language switch, stored in localStorage
- Blog posts: Each post has `lang` frontmatter, filterable

## Blog Architecture

- Astro Content Collections (`src/content/blog/`)
- Posts in markdown with bilingual frontmatter
- Landing: 3 latest posts in News.vue
- `/blog` — full listing with category + language filter, pagination
- `/blog/[slug]` — individual post page

## Project Structure

```
se-polinema.github.io/
├── public/
│   └── images/
│       ├── logo-polinema.png
│       ├── logo-jti.png
│       └── team/
├── src/
│   ├── components/
│   │   ├── Header.vue
│   │   ├── Hero.vue
│   │   ├── About.vue
│   │   ├── Research.vue
│   │   ├── Team.vue
│   │   ├── News.vue
│   │   ├── Contact.vue
│   │   ├── Footer.vue
│   │   ├── Projects.vue
│   │   ├── Publications.vue
│   │   ├── Gallery.vue
│   │   └── Partners.vue
│   ├── composables/
│   │   └── useI18n.ts
│   ├── content/
│   │   └── blog/
│   │       ├── config.ts
│   │       └── welcome.md
│   ├── data/
│   │   ├── team.json
│   │   └── research.json
│   ├── i18n/
│   │   ├── id.json
│   │   └── en.json
│   ├── layouts/
│   │   └── Default.astro
│   ├── pages/
│   │   ├── index.astro
│   │   └── blog/
│   │       ├── index.astro
│   │       └── [slug].astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
└── .github/
    └── workflows/
        └── deploy.yml
```

## Mobile-First Breakpoints

```
sm:  640px   — small tablets
md:  768px   — tablets
lg:  1024px  — desktop
xl:  1280px  — large desktop
```

## Design Principles

1. **Asymmetric editorial grid** — not everything centered
2. **Thin horizontal rules** for section dividers, not waves or gradients
3. **Serif headings, sans-serif body** — institutional gravitas
4. **Color restraint** — 90% neutral, 7% navy, 2% yellow, 1% red
5. **Faculty directory style** team cards — rectangular photos, thin navy borders
6. **Journal TOC style** research listing — numbered, text-forward

---

*Plan date: 14 May 2026*
*Build phase begins: 14 May 2026*
