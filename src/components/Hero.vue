<template>
  <section
    id="hero"
    class="relative flex flex-col justify-center bg-neutral-50 dark:bg-gray-900 overflow-hidden"
    style="min-height: min(100vh, 640px)"
  >
    <!-- Graph-paper grid background -->
    <div
      class="absolute inset-0"
      style="
        background-image:
          linear-gradient(rgba(0, 78, 162, 0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 78, 162, 0.04) 1px, transparent 1px);
        background-size: 32px 32px;
      "
    />

    <div
      class="section-container relative z-10 pt-12 pb-12 lg:pt-16 lg:pb-16 flex flex-col justify-center"
      style="min-height: 100%"
    >
      <div
        class="max-w-5xl grid lg:grid-cols-[minmax(0,1fr)_21rem] gap-12 lg:gap-16 items-center"
      >
        <!-- Left: Main content -->
        <div>
          <div class="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6">
            <div class="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                class="inline-block w-7 h-7 flex-shrink-0 bg-[#051C38] dark:bg-gray-100"
                :style="`-webkit-mask-image: url('${withBase('/images/logo-se-hexagon.png')}'); -webkit-mask-size: contain; -webkit-mask-repeat: no-repeat; -webkit-mask-position: center; mask-image: url('${withBase('/images/logo-se-hexagon.png')}'); mask-size: contain; mask-repeat: no-repeat; mask-position: center;`"
              ></span>
              <span class="font-serif text-lg font-semibold text-primary dark:text-gray-100 tracking-tight">SE Laboratory</span>
            </div>
            <div class="flex items-center gap-2 border-l border-primary/15 dark:border-gray-600 pl-6">
              <img
                :src="withBase('/images/logo-polinema.png')"
                alt="Politeknik Negeri Malang"
                class="h-6 w-auto opacity-70"
              />
              <span
                class="text-xs font-mono uppercase tracking-[0.2em] text-primary/50 dark:text-gray-400"
                >{{ t.hero.subtitle }}</span
              >
            </div>
          </div>

          <h1
            class="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary dark:text-gray-100 leading-[1.05] mb-6"
          >
            {{ t.hero.title }}
          </h1>

          <p
            class="text-lg sm:text-xl text-primary/60 dark:text-gray-400 leading-relaxed max-w-xl mb-8"
          >
            {{ t.hero.tagline }}
          </p>

          <div class="flex flex-wrap gap-3 mb-10">
            <a
              href="#research"
              @click.prevent="scrollTo('research')"
              class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary text-white hover:bg-accent hover:text-primary transition-colors"
            >
              {{ t.hero.cta }}
              <span aria-hidden="true">→</span>
            </a>
            <a
              :href="withBase('/members?filter=researchers')"
              class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-primary dark:text-blue-300 border border-primary/20 dark:border-gray-500 hover:border-primary/50 dark:hover:border-gray-400 transition-colors"
            >
              {{ t.hero.researchersCta }}
            </a>
            <a
              :href="withBase('/publications')"
              class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-primary/70 dark:text-gray-300 hover:text-primary dark:hover:text-blue-200 border border-transparent hover:border-primary/20 dark:hover:border-gray-500 transition-colors"
            >
              {{ t.hero.publicationsCta }}
            </a>
          </div>

          <!-- Stats: mobile only; desktop sees them in the terminal -->
          <div class="grid grid-cols-3 gap-4 max-w-xs lg:hidden">
            <div class="border-t border-primary/10 dark:border-gray-600 pt-4">
              <div class="font-serif text-3xl font-bold text-accent-700 dark:text-accent-400">{{ researchers }}</div>
              <div class="text-xs text-primary/50 dark:text-gray-400 mt-1">
                {{ t.hero.statTeam }}
              </div>
            </div>
            <div class="border-t border-primary/10 dark:border-gray-600 pt-4">
              <div class="font-serif text-3xl font-bold text-accent-700 dark:text-accent-400">{{ focusAreas }}</div>
              <div class="text-xs text-primary/50 dark:text-gray-400 mt-1">
                {{ t.hero.statFocus }}
              </div>
            </div>
            <div class="border-t border-primary/10 dark:border-gray-600 pt-4">
              <div class="font-serif text-3xl font-bold text-accent-700 dark:text-accent-400">{{ publications }}</div>
              <div class="text-xs text-primary/50 dark:text-gray-400 mt-1">
                {{ t.hero.statProjects }}
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Terminal block (desktop only) -->
        <aside class="hidden lg:block self-center">
          <div class="bg-[#0E1E3D] font-mono overflow-hidden shadow-2xl">
            <!-- Title bar -->
            <div
              class="flex items-center gap-1.5 px-4 py-2.5 bg-[#162032] border-b border-white/10"
            >
              <span class="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
              <span class="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
              <span class="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
              <span class="ml-3 text-white/30 text-xs tracking-wider"
                >~/se-lab</span
              >
            </div>
            <!-- Terminal content -->
            <div class="p-5 space-y-3 text-xs leading-relaxed">
              <p>
                <span class="text-accent">$</span>
                <span class="text-white/50 ml-2">ls research/</span>
              </p>
              <div class="pl-2 space-y-1 text-white/65">
                <p>├─ se-methodologies-architecture/</p>
                <p>├─ domain-specific-applications/</p>
                <p>└─ emerging-technologies/</p>
              </div>
              <p class="pt-1">
                <span class="text-accent">$</span>
                <span class="text-white/50 ml-2">cat stats.json</span>
              </p>
              <div class="pl-2 text-white/65 space-y-0.5">
                <p><span class="text-accent/80">{</span></p>
                <p class="pl-4">
                  <span class="text-[#9CDCFE]">"researchers"</span
                  ><span class="text-white/40">: </span
                  ><span class="text-[#98C379]">{{ researchers }}</span
                  ><span class="text-white/40">,</span>
                </p>
                <p class="pl-4">
                  <span class="text-[#9CDCFE]">"focus_areas"</span
                  ><span class="text-white/40">: </span
                  ><span class="text-[#98C379]">{{ focusAreas }}</span
                  ><span class="text-white/40">,</span>
                </p>
                <p class="pl-4">
                  <span class="text-[#9CDCFE]">"publications"</span
                  ><span class="text-white/40">: </span
                  ><span class="text-[#98C379]">{{ publications }}</span>
                </p>
                <p><span class="text-accent/80">}</span></p>
              </div>
              <p class="text-accent animate-pulse select-none">▌</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from "../composables/useI18n";
import { withBase } from "../lib/paths";

defineProps<{
  researchers: number;
  focusAreas: number;
  publications: number;
}>();

const { t } = useI18n();

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}
</script>
