<template>
  <!-- Tab strip / Inner page header: fixed-height outer prevents layout collapse during transition -->
  <div
    class="flex flex-shrink-0 overflow-hidden"
    style="height: 35px; background: var(--color-vscode-tabbar)"
  >
    <Transition name="tabmode" mode="out-in">
      <!-- Home: full file-tab strip -->
      <div
        v-if="currentPage === 'home'"
        key="home"
        class="flex w-full items-end overflow-x-auto"
        role="tablist"
        aria-label="Open files"
      >
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="handleTab(tab)"
          role="tab"
          :aria-selected="isActiveTab(tab)"
          class="flex items-center gap-2 px-4 py-2 text-[12px] font-mono flex-shrink-0 border-t-2 transition-colors duration-150 whitespace-nowrap h-full"
          :class="
            isActiveTab(tab)
              ? 'bg-white dark:bg-gray-900 text-primary dark:text-blue-300 border-t-accent'
              : 'bg-transparent text-[color:var(--color-vscode-chrome-fg-muted)] hover:text-[color:var(--color-vscode-chrome-fg)] hover:bg-[color:var(--color-vscode-chrome-border)] border-transparent'
          "
        >
          <span
            class="w-1.5 h-1.5 rounded-full flex-shrink-0"
            :class="dotColor(tab.ext)"
          />
          {{ tab.label }}
        </button>
      </div>

      <!-- Inner pages: single homepage-style tab -->
      <div v-else key="inner" class="flex w-full items-end min-w-0">
        <a
          v-if="innerTab"
          :href="isDetailPage ? undefined : withBase(innerTab.href)"
          role="tab"
          aria-selected="true"
          class="flex items-center gap-2 pl-4 pr-1 py-2 text-[12px] font-mono min-w-0 border-t-2 border-t-accent whitespace-nowrap h-full bg-white dark:bg-gray-900 text-primary dark:text-blue-300"
          @click.prevent="isDetailPage ? null : undefined"
        >
          <span
            class="w-1.5 h-1.5 rounded-full flex-shrink-0"
            :class="dotColor(innerTab.ext)"
          />
          <span class="truncate flex-1 min-w-0">{{ innerTab.label }}</span>
        </a>
        <!--
          Sibling button, not a child of the <a> above: an <a> containing
          a nested interactive close control is invalid HTML (interactive
          content can't nest). "Closing" this tab navigates up to the
          parent list page, same as VS Code closing a file back to the
          explorer. Only rendered when there's somewhere to go back to.
        -->
        <button
          v-if="innerTab"
          type="button"
          class="flex items-center justify-center w-6 h-full flex-shrink-0 text-[13px] leading-none text-[color:var(--color-vscode-chrome-fg-muted)] hover:text-[color:var(--color-vscode-chrome-fg)] hover:bg-[color:var(--color-vscode-chrome-border)] transition-colors bg-white dark:bg-gray-900"
          :title="`Close ${innerTab.label}`"
          :aria-label="`Close ${innerTab.label}`"
          @click="closeTab"
        >
          ×
        </button>
      </div>
    </Transition>
  </div>

  <!-- Breadcrumb bar -->
  <div
    class="flex items-center justify-between px-4 flex-shrink-0 select-none overflow-hidden"
    style="
      height: 26px;
      background: var(--color-vscode-tabbar-breadcrumb);
      border-bottom: 1px solid var(--color-vscode-chrome-border);
    "
  >
    <Transition name="breadcrumb" mode="out-in">
      <div
        :key="currentBreadcrumb.path.join('/')"
        class="flex items-center gap-0.5 text-[11px] font-mono min-w-0 whitespace-nowrap"
      >
        <span
          v-for="(part, i) in currentBreadcrumb.path"
          :key="i"
          class="flex items-center gap-0.5 min-w-0"
        >
          <span v-if="i > 0" class="text-[color:var(--color-vscode-chrome-fg-muted)] mx-1 flex-shrink-0">›</span>
          <a
            v-if="isDetailPage && i === currentBreadcrumb.path.length - 2 && parentHref"
            :href="withBase(parentHref)"
            class="text-[color:var(--color-vscode-chrome-fg-muted)] hover:text-[color:var(--color-vscode-chrome-fg)] transition-colors truncate max-w-[200px] inline-block"
          >
            {{ part }}
          </a>
          <span
            v-else
            class="truncate max-w-[260px] inline-block align-bottom"
            :class="
              i === currentBreadcrumb.path.length - 1
                ? 'text-[color:var(--color-vscode-chrome-fg)]'
                : 'text-[color:var(--color-vscode-chrome-fg-muted)]'
            "
          >
            {{ part }}
          </span>
        </span>
      </div>
    </Transition>
    <div class="flex items-center gap-4 text-[11px] font-mono text-[color:var(--color-vscode-chrome-fg-muted)] flex-shrink-0">
      <span>Ln {{ cursorLine }}, Col 1</span>
      <span>{{ currentBreadcrumb.lang }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useVSCodeLayout } from "../../composables/useVSCodeLayout";
import { withBase, stripBase } from "../../lib/paths";

const props = defineProps<{ initialPath?: string }>();

const { activeSection, currentPage, cursorLine, initObserver, scrollTo, restoreRouteState } =
  useVSCodeLayout(props.initialPath);

// Seeded synchronously from the server-known path (same value SSR and
// client) so a detail page's SSR/first-paint tab already reads
// "slug.ext" instead of the base page label; mirrors the split logic the
// onMounted handler below re-confirms client-side.
function splitDetailPath(pathname: string): { isDetailPage: boolean; slug: string } {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length <= 1) return { isDetailPage: false, slug: "" };
  return { isDetailPage: true, slug: parts[parts.length - 1] ?? "" };
}

const initialDetail = props.initialPath ? splitDetailPath(stripBase(props.initialPath)) : { isDetailPage: false, slug: "" };
const isDetailPage = ref(initialDetail.isDetailPage);
const slug = ref(initialDetail.slug);

const tabs = [
  { id: "hero", label: "index.html", ext: "html", pageId: "home", href: "/" },
  {
    id: "about",
    label: "about.md",
    ext: "md",
    pageId: "about",
    href: "/about",
  },
  {
    id: "research",
    label: "research.json",
    ext: "json",
    pageId: "home",
    href: "/#research",
  },
  {
    id: "projects",
    label: "projects.json",
    ext: "json",
    pageId: "projects",
    href: "/projects",
  },
  {
    id: "books",
    label: "books.md",
    ext: "md",
    pageId: "books",
    href: "/books",
  },
  {
    id: "team",
    label: "members.md",
    ext: "md",
    pageId: "members",
    href: "/members",
  },
  {
    id: "publications",
    label: "publications.bib",
    ext: "bib",
    pageId: "publications",
    href: "/publications",
  },
  { id: "events", label: "upcoming.ics", ext: "ics", pageId: "events", href: "/events" },
  { id: "blog", label: "blog.md", ext: "md", pageId: "blog", href: "/blog" },
];

const innerPageTabMap: Record<string, { label: string; ext: string; href: string }> = {
  about:        { label: "about.md",         ext: "md",   href: "/about" },
  events:       { label: "upcoming.ics",     ext: "ics",  href: "/events" },
  blog:         { label: "blog.md",          ext: "md",   href: "/blog" },
  publications: { label: "publications.bib", ext: "bib",  href: "/publications" },
  projects:     { label: "projects.json",    ext: "json", href: "/projects" },
  showcase:     { label: "showcase.json",    ext: "json", href: "/showcase" },
  books:        { label: "books.md",         ext: "md",   href: "/books" },
  decks:        { label: "decks.md",         ext: "md",   href: "/decks" },
  'learning-paths': { label: "learning-paths.astro", ext: "astro", href: "/learning-paths" },
  tools:        { label: "tools.json",         ext: "json", href: "/tools" },
  members:      { label: "members.json",       ext: "json", href: "/members" },
  research:     { label: "index.json",         ext: "json", href: "/research" },
  contact:      { label: "contact.astro",      ext: "astro", href: "/contact" },
  faq:          { label: "faq.md",             ext: "md",   href: "/faq" },
  glossary:     { label: "glossary.json",      ext: "json", href: "/glossary" },
  join:         { label: "join.astro",         ext: "astro", href: "/join" },
  login:        { label: "login.astro",        ext: "astro", href: "/login" },
  newsletter:   { label: "newsletter.astro",   ext: "astro", href: "/newsletter" },
  partners:     { label: "partners.json",      ext: "json", href: "/partners" },
  privacy:      { label: "privacy.md",         ext: "md",   href: "/privacy" },
  register:     { label: "register.astro",     ext: "astro", href: "/register" },
  resources:    { label: "resources.json",     ext: "json", href: "/resources" },
  admin:        { label: "admin.astro",        ext: "astro", href: "/admin" },
  checkin:      { label: "checkin.astro",      ext: "astro", href: "/checkin" },
};

const pageParentHrefMap: Record<string, string> = {
  events:       "/events",
  blog:         "/blog",
  publications: "/publications",
  projects:     "/projects",
  showcase:     "/showcase",
  books:        "/books",
  decks:        "/decks",
  members:      "/members",
};

const innerTab = computed(() => {
  const base = innerPageTabMap[currentPage.value];
  if (!base) return null;
  if (isDetailPage.value && slug.value) {
    return { label: `${slug.value}.${base.ext}`, ext: base.ext, href: base.href };
  }
  return base;
});

const parentHref = computed(() => {
  return pageParentHrefMap[currentPage.value] ?? "";
});

// "Closing" the current tab navigates up to where it came from: a detail
// page (e.g. /publications/foo) closes back to its list page; a
// dedicated list/section page (e.g. /publications) closes back to home,
// same relationship as closing a file back to the folder that contains it.
function closeTab() {
  if (isDetailPage.value && parentHref.value) {
    window.location.href = withBase(parentHref.value);
  } else {
    window.location.href = withBase("/");
  }
}

const breadcrumbMap: Record<string, { path: string[]; lang: string }> = {
  hero: { path: ["se-lab", "index.html"], lang: "HTML" },
  research: { path: ["se-lab", "src", "research.json"], lang: "JSON" },
  projects: { path: ["se-lab", "src", "projects", "index.json"], lang: "JSON" },
  books: { path: ["se-lab", "src", "books", "index.md"], lang: "Markdown" },
  decks: { path: ["se-lab", "src", "decks", "index.md"], lang: "Markdown" },
  team: { path: ["se-lab", "src", "members", "members.md"], lang: "Markdown" },
  publications: { path: ["se-lab", "src", "publications", "index.bib"], lang: "BibTeX" },
  events: { path: ["se-lab", "src", "events", "upcoming.ics"], lang: "Calendar" },
  blog: { path: ["se-lab", "src", "blog", "index.md"], lang: "Markdown" },
};

const pageBreadcrumbMap: Record<string, { path: string[]; lang: string }> = {
  about:        { path: ["se-lab", "src", "about.md"],                     lang: "Markdown" },
  events:       { path: ["se-lab", "src", "events", "upcoming.ics"],       lang: "Calendar" },
  blog:         { path: ["se-lab", "src", "blog", "index.md"],             lang: "Markdown" },
  publications: { path: ["se-lab", "src", "publications", "index.bib"],    lang: "BibTeX" },
  projects:     { path: ["se-lab", "src", "projects", "index.json"],       lang: "JSON" },
  showcase:     { path: ["se-lab", "src", "showcase", "index.json"],       lang: "JSON" },
  books:        { path: ["se-lab", "src", "books", "index.md"],            lang: "Markdown" },
  decks:        { path: ["se-lab", "src", "decks", "index.md"],            lang: "Markdown" },
  'learning-paths': { path: ["se-lab", "src", "learning-paths.astro"],     lang: "Astro" },
  tools:        { path: ["se-lab", "src", "tools", "index.json"],           lang: "JSON" },
  members:      { path: ["se-lab", "src", "members", "members.json"],     lang: "JSON" },
  research:     { path: ["se-lab", "src", "research", "index.json"],       lang: "JSON" },
  contact:      { path: ["se-lab", "src", "contact.astro"],                lang: "Astro" },
  faq:          { path: ["se-lab", "src", "faq.md"],                       lang: "Markdown" },
  glossary:     { path: ["se-lab", "src", "glossary.json"],                lang: "JSON" },
  join:         { path: ["se-lab", "src", "join.astro"],                   lang: "Astro" },
  login:        { path: ["se-lab", "src", "login.astro"],                  lang: "Astro" },
  newsletter:   { path: ["se-lab", "src", "newsletter.astro"],             lang: "Astro" },
  partners:     { path: ["se-lab", "src", "partners.json"],                lang: "JSON" },
  privacy:      { path: ["se-lab", "src", "privacy.md"],                   lang: "Markdown" },
  register:     { path: ["se-lab", "src", "register.astro"],               lang: "Astro" },
  resources:    { path: ["se-lab", "src", "resources.json"],               lang: "JSON" },
  admin:        { path: ["se-lab", "src", "admin.astro"],                  lang: "Astro" },
  checkin:      { path: ["se-lab", "src", "checkin.astro"],                lang: "Astro" },
};

const currentBreadcrumb = computed(() => {
  if (currentPage.value !== "home") {
    const base = pageBreadcrumbMap[currentPage.value] ?? breadcrumbMap.hero;
    if (isDetailPage.value && slug.value) {
      const tabInfo = innerPageTabMap[currentPage.value];
      const fileExt = tabInfo ? `.${tabInfo.ext}` : ".md";
      const newPath = [...base.path];
      newPath[newPath.length - 1] = `${slug.value}${fileExt}`;
      return {
        path: newPath,
        lang: base.lang,
      };
    }
    return base;
  }
  return breadcrumbMap[activeSection.value] ?? breadcrumbMap.hero;
});

function isActiveTab(tab: (typeof tabs)[0]): boolean {
  if (currentPage.value === "home") return activeSection.value === tab.id;
  return currentPage.value === tab.pageId;
}

function handleTab(tab: (typeof tabs)[0]) {
  if (currentPage.value === "home") {
    scrollTo(tab.id);
  } else {
    window.location.href = withBase(tab.href);
  }
}

function dotColor(ext: string): string {
  const map: Record<string, string> = {
    html: "bg-orange-400",
    md: "bg-blue-400",
    json: "bg-yellow-400",
    bib: "bg-green-400",
    ics: "bg-purple-400",
    astro: "bg-orange-500",
  };
  return map[ext] ?? "bg-[color:var(--color-vscode-chrome-fg-muted)]";
}

onMounted(() => {
  restoreRouteState();

  const editor = document.getElementById("editor");
  if (editor) initObserver(editor);

  // Re-confirms the initialPath seed above from window.location: a
  // no-op when initialPath was provided (same value), and the sole source
  // of truth when it wasn't.
  const detail = splitDetailPath(stripBase(window.location.pathname));
  isDetailPage.value = detail.isDetailPage;
  slug.value = detail.slug;
});
</script>

<style scoped>
.tabmode-enter-active,
.tabmode-leave-active {
  transition: opacity 0.12s ease;
}
.tabmode-enter-from,
.tabmode-leave-to {
  opacity: 0;
}

.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: opacity 0.1s ease;
}
.breadcrumb-enter-from,
.breadcrumb-leave-to {
  opacity: 0;
}
</style>
