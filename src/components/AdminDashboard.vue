<template>
  <div class="px-8 py-5">
    <!-- Sign-in -->
    <div v-if="authState === 'unauthenticated'" class="max-w-sm">
      <h1 class="font-serif text-2xl font-bold text-primary dark:text-gray-100 mb-6">
        {{ t.events.admin.heading }}
      </h1>
      <GitHubSignInButton />
    </div>

    <!-- Loading -->
    <div v-else-if="authState === 'loading'" class="py-20 text-center">
      <p class="text-sm font-mono text-neutral-400 dark:text-gray-500">{{ t.events.admin.loading }}</p>
    </div>

    <!-- Unauthorized -->
    <div v-else-if="authState === 'unauthorized'" class="py-10">
      <p class="text-sm font-mono text-red-600 dark:text-red-400 mb-4">{{ t.events.admin.unauthorized }}</p>
      <button @click="handleSignOut" class="text-xs font-mono text-primary/40 dark:text-gray-500 hover:text-primary dark:hover:text-gray-100 transition-colors">
        {{ t.events.admin.signOut }}
      </button>
    </div>

    <!-- Dashboard -->
    <div v-else-if="authState === 'admin'">
      <div class="flex items-center justify-between mb-8">
        <h1 class="font-serif text-2xl font-bold text-primary dark:text-gray-100">
          {{ t.events.admin.heading }}
        </h1>
        <button
          @click="handleSignOut"
          class="text-xs font-mono text-primary/40 dark:text-gray-500 hover:text-primary dark:hover:text-gray-100 transition-colors"
        >
          {{ t.events.admin.signOut }}
        </button>
      </div>

      <!-- Overview -->
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="border border-primary/10 dark:border-gray-700 p-4">
          <div class="font-serif text-3xl font-bold text-primary dark:text-gray-100">{{ pendingApprovalsCount }}</div>
          <div class="text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mt-1">{{ t.events.admin.pendingApprovalsStat }}</div>
        </div>
        <div class="border border-primary/10 dark:border-gray-700 p-4">
          <div class="font-serif text-3xl font-bold text-primary dark:text-gray-100">{{ registeredThisWeekCount }}</div>
          <div class="text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mt-1">{{ t.events.admin.registeredThisWeekStat }}</div>
        </div>
        <div class="border border-primary/10 dark:border-gray-700 p-4">
          <div class="font-serif text-3xl font-bold text-primary dark:text-gray-100">{{ upcomingEvents.length }}</div>
          <div class="text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mt-1">{{ t.events.admin.upcomingEventsStat }}</div>
        </div>
      </div>

      <!-- Needs Review -->
      <div v-if="pendingMembers.length > 0" class="mb-8 p-4 border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20">
        <h2 class="text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-3">
          {{ t.events.admin.needsReviewHeading }} ({{ pendingMembers.length }})
        </h2>
        <ul class="space-y-2">
          <li v-for="m in pendingMembers" :key="m.id" class="flex items-center justify-between gap-3 text-sm">
            <span class="text-primary dark:text-gray-100">
              {{ m.name }}
              <span class="text-xs font-mono text-neutral-400 dark:text-gray-500 ml-2">{{ formatDate(m.created_at) }}</span>
            </span>
            <button
              @click="reviewMember(m)"
              class="text-xs font-mono font-semibold text-accent-700 dark:text-accent-400 hover:text-accent transition-colors flex-shrink-0"
            >
              {{ t.events.admin.reviewAction }} →
            </button>
          </li>
        </ul>
      </div>

      <!-- Tab bar -->
      <div class="flex items-center gap-1 mb-8 border-b border-primary/10 dark:border-gray-700">
        <button
          @click="adminTab = 'events'"
          class="px-4 py-2 text-sm font-mono border-b-2 -mb-px transition-colors"
          :class="adminTab === 'events'
            ? 'border-accent text-primary dark:text-gray-100'
            : 'border-transparent text-neutral-400 dark:text-gray-500 hover:text-primary dark:hover:text-gray-300'"
        >
          {{ t.membersAdmin.eventsTabLabel }}
        </button>
        <button
          @click="adminTab = 'members'"
          class="px-4 py-2 text-sm font-mono border-b-2 -mb-px transition-colors"
          :class="adminTab === 'members'
            ? 'border-accent text-primary dark:text-gray-100'
            : 'border-transparent text-neutral-400 dark:text-gray-500 hover:text-primary dark:hover:text-gray-300'"
        >
          {{ t.membersAdmin.tabLabel }}
        </button>
        <button
          @click="adminTab = 'projects'"
          class="px-4 py-2 text-sm font-mono border-b-2 -mb-px transition-colors"
          :class="adminTab === 'projects'
            ? 'border-accent text-primary dark:text-gray-100'
            : 'border-transparent text-neutral-400 dark:text-gray-500 hover:text-primary dark:hover:text-gray-300'"
        >
          {{ t.showcaseAdmin.tabLabel }}
        </button>
        <button
          @click="adminTab = 'announcements'"
          class="px-4 py-2 text-sm font-mono border-b-2 -mb-px transition-colors"
          :class="adminTab === 'announcements'
            ? 'border-accent text-primary dark:text-gray-100'
            : 'border-transparent text-neutral-400 dark:text-gray-500 hover:text-primary dark:hover:text-gray-300'"
        >
          {{ t.announcementsAdmin.tabLabel }}
        </button>
        <button
          @click="adminTab = 'staff'"
          class="px-4 py-2 text-sm font-mono border-b-2 -mb-px transition-colors"
          :class="adminTab === 'staff'
            ? 'border-accent text-primary dark:text-gray-100'
            : 'border-transparent text-neutral-400 dark:text-gray-500 hover:text-primary dark:hover:text-gray-300'"
        >
          {{ t.staffAdmin.tabLabel }}
        </button>
        <button
          @click="adminTab = 'subscribers'"
          class="px-4 py-2 text-sm font-mono border-b-2 -mb-px transition-colors"
          :class="adminTab === 'subscribers'
            ? 'border-accent text-primary dark:text-gray-100'
            : 'border-transparent text-neutral-400 dark:text-gray-500 hover:text-primary dark:hover:text-gray-300'"
        >
          {{ t.subscribersAdmin.tabLabel }}
        </button>
        <button
          @click="adminTab = 'feedback'"
          class="px-4 py-2 text-sm font-mono border-b-2 -mb-px transition-colors"
          :class="adminTab === 'feedback'
            ? 'border-accent text-primary dark:text-gray-100'
            : 'border-transparent text-neutral-400 dark:text-gray-500 hover:text-primary dark:hover:text-gray-300'"
        >
          {{ t.feedbackAdmin.tabLabel }}
        </button>
      </div>

      <!-- EVENTS TAB -->
      <template v-if="adminTab === 'events'">
      <div v-if="loadingData" class="py-10 text-center">
        <p class="text-sm font-mono text-neutral-400 dark:text-gray-500">{{ t.events.admin.loading }}</p>
      </div>

      <div v-else class="space-y-12">
        <AdminEventSection
          v-for="event in upcomingEvents"
          :key="event.slug"
          :event="event"
          :participants="participantsByEvent[event.slug] ?? []"
          :copied="copiedCode === event.check_in_code"
          @toggle-registration="toggleRegistration(event)"
          @copy-code="copyCode(event.check_in_code)"
          @update-capacity="updateCapacity(event, $event)"
        />

        <div v-if="pastEvents.length > 0">
          <h2 class="font-mono text-xs uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-4 pb-2 border-b border-primary/10 dark:border-gray-700">
            {{ t.events.admin.pastEventsHeading }} ({{ pastEvents.length }})
          </h2>
          <div class="space-y-8">
            <AdminEventSection
              v-for="event in pastEvents"
              :key="event.slug"
              :event="event"
              :participants="participantsByEvent[event.slug] ?? []"
              collapsible
              :copied="copiedCode === event.check_in_code"
              @toggle-registration="toggleRegistration(event)"
              @copy-code="copyCode(event.check_in_code)"
              @update-capacity="updateCapacity(event, $event)"
            />
          </div>
        </div>

        <div v-if="events.length === 0" class="py-10 text-center">
          <p class="text-sm font-mono text-neutral-400 dark:text-gray-500">{{ t.events.admin.noParticipants }}</p>
        </div>
      </div>
      </template>

      <!-- MEMBERS TAB -->
      <template v-else-if="adminTab === 'members'">
        <div v-if="loadingData" class="py-10 text-center">
          <p class="text-sm font-mono text-neutral-400 dark:text-gray-500">{{ t.events.admin.loading }}</p>
        </div>

        <div v-else>
          <div v-if="memberActionError" class="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-mono">
            {{ memberActionError }}
          </div>

          <div class="flex items-center gap-2 mb-6">
            <button
              v-for="f in memberFilterOptions"
              :key="f"
              @click="memberFilter = f"
              class="px-3 py-1 text-xs font-mono uppercase tracking-wider border transition-colors"
              :class="memberFilter === f
                ? 'bg-primary text-white border-primary'
                : 'text-primary/60 dark:text-gray-400 border-primary/20 dark:border-gray-600 hover:border-primary/40'"
            >
              {{ f === 'all' ? t.membersAdmin.filterAll : f === 'student' ? t.membersAdmin.statusStudent : f === 'alumni' ? t.membersAdmin.statusAlumni : t.membersAdmin.filterPending }}
            </button>
            <button
              @click="openAddMemberForm"
              class="ml-auto inline-flex items-center gap-2 px-4 py-1.5 text-xs font-mono font-semibold text-white bg-accent hover:bg-accent/90 transition-colors"
            >
              {{ t.membersAdmin.addNew }}
            </button>
          </div>

          <form
            v-if="showMemberForm"
            @submit.prevent="handleSaveMember"
            class="mb-8 p-5 border border-primary/10 dark:border-gray-700 space-y-4"
          >
            <h2 class="font-serif text-lg font-semibold text-primary dark:text-gray-100">
              {{ editingMemberId ? t.membersAdmin.editEntry : t.membersAdmin.addNew }}
            </h2>

            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.statusLabel }}</label>
                <select v-model="memberForm.status" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors">
                  <option value="student">{{ t.membersAdmin.statusStudent }}</option>
                  <option value="alumni">{{ t.membersAdmin.statusAlumni }}</option>
                </select>
              </div>
              <div class="flex items-end pb-2">
                <label class="inline-flex items-center gap-2 text-sm font-mono text-primary dark:text-gray-100">
                  <input v-model="memberForm.approved" type="checkbox" class="h-4 w-4" />
                  {{ t.membersAdmin.approvedFieldLabel }}
                </label>
              </div>
              <div>
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.nameLabel }}</label>
                <input v-model="memberForm.name" required class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.photoLabel }}</label>
                <ImageUpload v-model="memberForm.photo" bucket="member-photos" :upload-path-prefix="editingMemberId ? `admin/${editingMemberId}` : adminUploadPrefix" />
              </div>
              <div>
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.cohortYearLabel }}</label>
                <input v-model.number="memberForm.cohort_year" type="number" required class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
              </div>
              <div v-if="memberForm.status === 'alumni'">
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.exitYearLabel }}</label>
                <input v-model.number="memberForm.exit_year" type="number" required class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
              </div>
              <div>
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.roleIdLabel }}</label>
                <input v-model="memberForm.role_id" required class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
              </div>
              <div>
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.roleEnLabel }}</label>
                <input v-model="memberForm.role_en" required class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
              </div>
              <template v-if="memberForm.status === 'alumni'">
                <div>
                  <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.currentPositionIdLabel }}</label>
                  <input v-model="memberForm.current_role_id" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
                </div>
                <div>
                  <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.currentPositionEnLabel }}</label>
                  <input v-model="memberForm.current_role_en" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
                </div>
                <div>
                  <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.currentAffiliationIdLabel }}</label>
                  <input v-model="memberForm.current_organization_id" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
                </div>
                <div>
                  <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.currentAffiliationEnLabel }}</label>
                  <input v-model="memberForm.current_organization_en" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
                </div>
              </template>
              <div>
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.linkedinLabel }}</label>
                <input v-model="memberForm.linkedin_url" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
              </div>
              <div>
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.profileUrlLabel }}</label>
                <input v-model="memberForm.profile_url" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
              </div>
              <div>
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.githubLabel }}</label>
                <input v-model="memberForm.github_url" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.streamsLabel }}</label>
                <div class="flex flex-wrap gap-3">
                  <label
                    v-for="stream in research"
                    :key="stream.id"
                    class="inline-flex items-center gap-1.5 text-xs font-mono text-primary dark:text-gray-100"
                  >
                    <input type="checkbox" :value="stream.id" v-model="memberForm.streams" class="h-3.5 w-3.5" />
                    {{ stream.name.en }} / {{ stream.name.id }}
                  </label>
                </div>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.researchTopicsLabel }}</label>
                <textarea v-model="memberForm.research_topics" rows="5" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.careerUpdateLabel }}</label>
                <textarea v-model="memberForm.career_update" rows="5" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
              </div>
            </div>

            <div class="flex items-center gap-3">
              <button
                type="submit"
                :disabled="savingMember"
                class="inline-flex items-center gap-2 px-5 py-2 text-sm font-mono font-semibold text-white bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ savingMember ? t.membersAdmin.savingLabel : t.membersAdmin.saveLabel }}
              </button>
              <button
                type="button"
                @click="closeMemberForm"
                class="text-xs font-mono text-primary/40 dark:text-gray-500 hover:text-primary dark:hover:text-gray-100 transition-colors"
              >
                {{ t.membersAdmin.cancelLabel }}
              </button>
            </div>
          </form>

          <div v-if="filteredMembers.length === 0" class="py-10 text-center">
            <p class="text-sm font-mono text-neutral-400 dark:text-gray-500">{{ t.membersAdmin.noEntries }}</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-primary/10 dark:border-gray-700">
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.membersAdmin.nameLabel }}</th>
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.membersAdmin.statusLabel }}</th>
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.membersAdmin.cohortYearLabel }}</th>
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-primary/5 dark:divide-gray-700">
                <tr v-for="m in filteredMembers" :key="m.id">
                  <td class="py-2.5 pr-4 font-medium text-primary dark:text-gray-100">{{ m.name }}</td>
                  <td class="py-2.5 pr-4">
                    <span
                      class="inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
                      :class="m.status === 'alumni'
                        ? 'bg-accent/10 text-accent-700 dark:text-accent-400'
                        : 'bg-primary/10 text-primary dark:text-gray-300'"
                    >
                      {{ m.status === 'alumni' ? t.membersAdmin.statusAlumni : t.membersAdmin.statusStudent }}
                    </span>
                    <span
                      v-if="!m.approved"
                      class="inline-flex items-center px-2 py-0.5 ml-1.5 text-[10px] font-mono uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    >
                      {{ t.membersAdmin.pendingBadge }}
                    </span>
                  </td>
                  <td class="py-2.5 pr-4 font-mono text-xs text-neutral-400 dark:text-gray-500">{{ m.cohort_year }}</td>
                  <td class="py-2.5 text-right space-x-3">
                    <button v-if="!m.approved" @click="approveMember(m)" class="text-xs font-mono text-accent-700 dark:text-accent-400 hover:text-accent transition-colors">
                      {{ t.membersAdmin.approveAction }}
                    </button>
                    <button @click="editMember(m)" class="text-xs font-mono text-primary/60 dark:text-gray-400 hover:text-primary dark:hover:text-gray-100 transition-colors">
                      {{ t.membersAdmin.editAction }}
                    </button>
                    <button @click="deleteMember(m)" class="text-xs font-mono text-red-500/70 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                      {{ t.membersAdmin.deleteAction }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <!-- PROJECTS TAB (Showcase) -->
      <template v-else-if="adminTab === 'projects'">
        <div v-if="loadingData" class="py-10 text-center">
          <p class="text-sm font-mono text-neutral-400 dark:text-gray-500">{{ t.events.admin.loading }}</p>
        </div>

        <div v-else>
          <div v-if="projectActionError" class="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-mono">
            {{ projectActionError }}
          </div>

          <div class="flex items-center gap-2 mb-6">
            <button
              v-for="f in projectFilterOptions"
              :key="f"
              @click="projectFilter = f"
              class="px-3 py-1 text-xs font-mono uppercase tracking-wider border transition-colors"
              :class="projectFilter === f
                ? 'bg-primary text-white border-primary'
                : 'text-primary/60 dark:text-gray-400 border-primary/20 dark:border-gray-600 hover:border-primary/40'"
            >
              {{ f === 'all' ? t.showcaseAdmin.filterAll : t.showcaseAdmin.filterPending }}
            </button>
            <button
              @click="openAddProjectForm"
              class="ml-auto inline-flex items-center gap-2 px-4 py-1.5 text-xs font-mono font-semibold text-white bg-accent hover:bg-accent/90 transition-colors"
            >
              {{ t.showcaseAdmin.addNew }}
            </button>
          </div>

          <form
            v-if="showProjectForm"
            @submit.prevent="handleSaveProject"
            class="mb-8 p-5 border border-primary/10 dark:border-gray-700 space-y-4"
          >
            <h2 class="font-serif text-lg font-semibold text-primary dark:text-gray-100">
              {{ editingProjectId ? t.showcaseAdmin.editEntry : t.showcaseAdmin.addNew }}
            </h2>

            <div class="grid sm:grid-cols-2 gap-4">
              <div class="flex items-end pb-2">
                <label class="inline-flex items-center gap-2 text-sm font-mono text-primary dark:text-gray-100">
                  <input v-model="projectForm.approved" type="checkbox" class="h-4 w-4" />
                  {{ t.showcaseAdmin.approvedFieldLabel }}
                </label>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.titleLabel }}</label>
                <input v-model="projectForm.title" required class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
              </div>

              <div class="sm:col-span-2 flex items-center gap-2">
                <button
                  v-for="m in (['ai', 'manual'] as const)"
                  :key="m"
                  type="button"
                  @click="projectFormMode = m"
                  class="px-3 py-1 text-xs font-mono uppercase tracking-wider border transition-colors"
                  :class="projectFormMode === m
                    ? 'bg-primary text-white border-primary'
                    : 'text-primary/60 dark:text-gray-400 border-primary/20 dark:border-gray-600 hover:border-primary/40'"
                >
                  {{ m === 'ai' ? t.showcaseAdmin.aiAssistMode : t.showcaseAdmin.manualMode }}
                </button>
              </div>

              <div v-if="projectFormMode === 'ai'" class="sm:col-span-2">
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.briefLabel }}</label>
                <p class="text-xs text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.briefHint }}</p>
                <textarea v-model="projectBrief" rows="3" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
                <button
                  type="button"
                  @click="handleSuggestProject"
                  :disabled="suggestingProject || !projectForm.title.trim() || !projectBrief.trim()"
                  class="mt-2 inline-flex items-center gap-2 px-4 py-1.5 text-xs font-mono font-semibold text-accent-700 dark:text-accent-400 border border-accent/40 hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {{ suggestingProject ? t.showcaseAdmin.suggestingLabel : t.showcaseAdmin.generateBtn }}
                </button>
                <p v-if="projectSuggestError" class="mt-2 text-xs font-mono text-red-600 dark:text-red-400">{{ projectSuggestError }}</p>
              </div>

              <div class="sm:col-span-2">
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.imageLabel }}</label>
                <ImageUpload v-model="projectCoverImage" bucket="project-images" :upload-path-prefix="editingProjectId ? `admin/${editingProjectId}` : adminProjectUploadPrefix" />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.additionalImagesLabel }}</label>
                <p class="text-xs text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.additionalImagesHint }}</p>
                <textarea v-model="projectAdditionalImagesInput" rows="2" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
              </div>

              <template v-if="projectFormMode === 'manual' || projectHasGenerated">
                <div>
                  <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.taglineEnLabel }}</label>
                  <input v-model="projectForm.tagline_en" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
                </div>
                <div>
                  <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.taglineIdLabel }}</label>
                  <input v-model="projectForm.tagline_id" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.descriptionEnLabel }}</label>
                  <textarea v-model="projectForm.description_en" rows="4" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.descriptionIdLabel }}</label>
                  <textarea v-model="projectForm.description_id" rows="4" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.tagsLabel }}</label>
                  <input v-model="projectTagsInput" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
                </div>
              </template>

              <div>
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.repoUrlLabel }}</label>
                <input v-model="projectForm.repo_url" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
              </div>
              <div>
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.demoUrlLabel }}</label>
                <input v-model="projectForm.demo_url" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
              </div>
              <div>
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.videoUrlLabel }}</label>
                <input v-model="projectForm.video_url" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
              </div>
              <div>
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.slugLabel }}</label>
                <p class="text-xs text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.slugHint }}</p>
                <input v-model="projectForm.slug" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
              </div>
              <div>
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.statusLabel }}</label>
                <select v-model="projectForm.status" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors">
                  <option value="active">{{ t.showcaseAdmin.statusActive }}</option>
                  <option value="completed">{{ t.showcaseAdmin.statusCompleted }}</option>
                  <option value="prototype">{{ t.showcaseAdmin.statusPrototype }}</option>
                  <option value="under-development">{{ t.showcaseAdmin.statusUnderDevelopment }}</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.streamLabel }}</label>
                <select v-model="projectForm.stream" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors">
                  <option value="">—</option>
                  <option v-for="s in research" :key="s.id" :value="s.id">{{ s.name.en }} / {{ s.name.id }}</option>
                </select>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.researchersLabel }}</label>
                <div class="flex flex-wrap gap-3">
                  <label
                    v-for="r in researcherOptions"
                    :key="r.id"
                    class="inline-flex items-center gap-1.5 text-xs font-mono text-primary dark:text-gray-100"
                  >
                    <input type="checkbox" :value="r.id" v-model="projectForm.researchers" class="h-3.5 w-3.5" />
                    {{ r.name }}
                  </label>
                </div>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.contributorsLabel }}</label>
                <p class="text-xs text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.contributorsHint }}</p>
                <input v-model="projectContributorsInput" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
              </div>
              <div class="flex items-end pb-2">
                <label class="inline-flex items-center gap-2 text-sm font-mono text-primary dark:text-gray-100">
                  <input v-model="projectForm.featured" type="checkbox" class="h-4 w-4" />
                  {{ t.showcaseAdmin.featuredLabel }}
                </label>
              </div>
              <div class="flex items-end pb-2">
                <label class="inline-flex items-center gap-2 text-sm font-mono text-primary dark:text-gray-100">
                  <input v-model="projectForm.private" type="checkbox" class="h-4 w-4" />
                  {{ t.showcaseAdmin.privateLabel }}
                </label>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <button
                type="submit"
                :disabled="savingProject"
                class="inline-flex items-center gap-2 px-5 py-2 text-sm font-mono font-semibold text-white bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ savingProject ? t.showcaseAdmin.savingLabel : t.showcaseAdmin.saveLabel }}
              </button>
              <button
                type="button"
                @click="closeProjectForm"
                class="text-xs font-mono text-primary/40 dark:text-gray-500 hover:text-primary dark:hover:text-gray-100 transition-colors"
              >
                {{ t.showcaseAdmin.cancelLabel }}
              </button>
            </div>
          </form>

          <div v-if="filteredProjects.length === 0" class="py-10 text-center">
            <p class="text-sm font-mono text-neutral-400 dark:text-gray-500">{{ t.showcaseAdmin.noEntries }}</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-primary/10 dark:border-gray-700">
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.showcaseAdmin.titleLabel }}</th>
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4"></th>
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-primary/5 dark:divide-gray-700">
                <tr v-for="p in filteredProjects" :key="p.id">
                  <td class="py-2.5 pr-4 font-medium text-primary dark:text-gray-100">{{ p.title }}</td>
                  <td class="py-2.5 pr-4">
                    <span
                      v-if="!p.approved"
                      class="inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    >
                      {{ t.showcaseAdmin.pendingBadge }}
                    </span>
                  </td>
                  <td class="py-2.5 text-right space-x-3">
                    <button v-if="!p.approved" @click="approveProject(p)" class="text-xs font-mono text-accent-700 dark:text-accent-400 hover:text-accent transition-colors">
                      {{ t.showcaseAdmin.approveAction }}
                    </button>
                    <button @click="editProject(p)" class="text-xs font-mono text-primary/60 dark:text-gray-400 hover:text-primary dark:hover:text-gray-100 transition-colors">
                      {{ t.showcaseAdmin.editAction }}
                    </button>
                    <button @click="deleteProject(p)" class="text-xs font-mono text-red-500/70 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                      {{ t.showcaseAdmin.deleteAction }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <!-- ANNOUNCEMENTS TAB -->
      <template v-else-if="adminTab === 'announcements'">
        <div v-if="loadingData" class="py-10 text-center">
          <p class="text-sm font-mono text-neutral-400 dark:text-gray-500">{{ t.events.admin.loading }}</p>
        </div>

        <div v-else>
          <div v-if="announcementActionError" class="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-mono">
            {{ announcementActionError }}
          </div>

          <div class="flex items-center gap-2 mb-6">
            <button
              @click="openAddAnnouncementForm"
              class="ml-auto inline-flex items-center gap-2 px-4 py-1.5 text-xs font-mono font-semibold text-white bg-accent hover:bg-accent/90 transition-colors"
            >
              {{ t.announcementsAdmin.addNew }}
            </button>
          </div>

          <form
            v-if="showAnnouncementForm"
            @submit.prevent="handleSaveAnnouncement"
            class="mb-8 p-5 border border-primary/10 dark:border-gray-700 space-y-4"
          >
            <h2 class="font-serif text-lg font-semibold text-primary dark:text-gray-100">
              {{ editingAnnouncementId ? t.announcementsAdmin.editEntry : t.announcementsAdmin.addNew }}
            </h2>

            <div class="grid sm:grid-cols-2 gap-4">
              <div class="flex items-end pb-2">
                <label class="inline-flex items-center gap-2 text-sm font-mono text-primary dark:text-gray-100">
                  <input v-model="announcementForm.active" type="checkbox" class="h-4 w-4" />
                  {{ t.announcementsAdmin.activeLabel }}
                </label>
              </div>
              <div>
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.announcementsAdmin.typeLabel }}</label>
                <select v-model="announcementForm.type" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors">
                  <option value="info">{{ t.announcementsAdmin.typeInfo }}</option>
                  <option value="warning">{{ t.announcementsAdmin.typeWarning }}</option>
                  <option value="success">{{ t.announcementsAdmin.typeSuccess }}</option>
                </select>
              </div>

              <div class="sm:col-span-2 flex items-center gap-2">
                <button
                  v-for="m in (['ai', 'manual'] as const)"
                  :key="m"
                  type="button"
                  @click="announcementFormMode = m"
                  class="px-3 py-1 text-xs font-mono uppercase tracking-wider border transition-colors"
                  :class="announcementFormMode === m
                    ? 'bg-primary text-white border-primary'
                    : 'text-primary/60 dark:text-gray-400 border-primary/20 dark:border-gray-600 hover:border-primary/40'"
                >
                  {{ m === 'ai' ? t.announcementsAdmin.aiAssistMode : t.announcementsAdmin.manualMode }}
                </button>
              </div>

              <div v-if="announcementFormMode === 'ai'" class="sm:col-span-2">
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.announcementsAdmin.briefLabel }}</label>
                <p class="text-xs text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.announcementsAdmin.briefHint }}</p>
                <textarea v-model="announcementBrief" rows="2" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
                <button
                  type="button"
                  @click="handleSuggestAnnouncement"
                  :disabled="suggestingAnnouncement || !announcementBrief.trim()"
                  class="mt-2 inline-flex items-center gap-2 px-4 py-1.5 text-xs font-mono font-semibold text-accent-700 dark:text-accent-400 border border-accent/40 hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {{ suggestingAnnouncement ? t.announcementsAdmin.suggestingLabel : t.announcementsAdmin.generateBtn }}
                </button>
                <p v-if="announcementSuggestError" class="mt-2 text-xs font-mono text-red-600 dark:text-red-400">{{ announcementSuggestError }}</p>
              </div>

              <template v-if="announcementFormMode === 'manual' || announcementHasGenerated">
                <div class="sm:col-span-2">
                  <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.announcementsAdmin.messageEnLabel }}</label>
                  <textarea v-model="announcementForm.message" required rows="2" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.announcementsAdmin.messageIdLabel }}</label>
                  <textarea v-model="announcementForm.message_id" rows="2" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
                </div>
              </template>

              <div>
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.announcementsAdmin.linkUrlEnLabel }}</label>
                <input v-model="announcementForm.link" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
              </div>
              <div>
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.announcementsAdmin.linkUrlIdLabel }}</label>
                <input v-model="announcementForm.link_id" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
              </div>
              <div>
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.announcementsAdmin.linkTextEnLabel }}</label>
                <input v-model="announcementForm.link_text" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
              </div>
              <div>
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.announcementsAdmin.linkTextIdLabel }}</label>
                <input v-model="announcementForm.link_text_id" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
              </div>

              <div>
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.announcementsAdmin.startDateLabel }}</label>
                <p class="text-xs text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.announcementsAdmin.startDateHint }}</p>
                <input v-model="announcementForm.start_date" type="datetime-local" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
              </div>
              <div>
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.announcementsAdmin.endDateLabel }}</label>
                <p class="text-xs text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.announcementsAdmin.endDateHint }}</p>
                <input v-model="announcementForm.end_date" type="datetime-local" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
              </div>

              <div class="flex items-end pb-2">
                <label class="inline-flex items-center gap-2 text-sm font-mono text-primary dark:text-gray-100">
                  <input v-model="announcementForm.dismissible" type="checkbox" class="h-4 w-4" />
                  {{ t.announcementsAdmin.dismissibleLabel }}
                </label>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <button
                type="submit"
                :disabled="savingAnnouncement"
                class="inline-flex items-center gap-2 px-5 py-2 text-sm font-mono font-semibold text-white bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ savingAnnouncement ? t.announcementsAdmin.savingLabel : t.announcementsAdmin.saveLabel }}
              </button>
              <button
                type="button"
                @click="closeAnnouncementForm"
                class="text-xs font-mono text-primary/40 dark:text-gray-500 hover:text-primary dark:hover:text-gray-100 transition-colors"
              >
                {{ t.announcementsAdmin.cancelLabel }}
              </button>
            </div>
          </form>

          <div v-if="announcements.length === 0" class="py-10 text-center">
            <p class="text-sm font-mono text-neutral-400 dark:text-gray-500">{{ t.announcementsAdmin.noEntries }}</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-primary/10 dark:border-gray-700">
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.announcementsAdmin.messageEnLabel }}</th>
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4"></th>
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-primary/5 dark:divide-gray-700">
                <tr v-for="a in announcements" :key="a.id">
                  <td class="py-2.5 pr-4 font-medium text-primary dark:text-gray-100 max-w-md truncate">{{ a.message }}</td>
                  <td class="py-2.5 pr-4">
                    <span
                      v-if="isAnnouncementExpired(a)"
                      class="inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-neutral-200 text-neutral-600 dark:bg-gray-700 dark:text-gray-400"
                    >
                      {{ t.announcementsAdmin.expiredBadge }}
                    </span>
                    <span
                      v-else-if="a.active"
                      class="inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    >
                      {{ t.announcementsAdmin.activeBadge }}
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-neutral-200 text-neutral-600 dark:bg-gray-700 dark:text-gray-400"
                    >
                      {{ t.announcementsAdmin.inactiveBadge }}
                    </span>
                  </td>
                  <td class="py-2.5 text-right space-x-3">
                    <button @click="editAnnouncement(a)" class="text-xs font-mono text-primary/60 dark:text-gray-400 hover:text-primary dark:hover:text-gray-100 transition-colors">
                      {{ t.announcementsAdmin.editAction }}
                    </button>
                    <button @click="deleteAnnouncement(a)" class="text-xs font-mono text-red-500/70 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                      {{ t.announcementsAdmin.deleteAction }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <!-- STAFF TAB -->
      <template v-else-if="adminTab === 'staff'">
        <div v-if="loadingData" class="py-10 text-center">
          <p class="text-sm font-mono text-neutral-400 dark:text-gray-500">{{ t.events.admin.loading }}</p>
        </div>

        <div v-else>
          <div v-if="staffActionError" class="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-mono">
            {{ staffActionError }}
          </div>

          <form @submit.prevent="handleGrantAdmin" class="mb-8 p-5 border border-primary/10 dark:border-gray-700 space-y-3">
            <h2 class="font-serif text-lg font-semibold text-primary dark:text-gray-100">{{ t.staffAdmin.grantHeading }}</h2>
            <p class="text-xs text-neutral-400 dark:text-gray-500">{{ t.staffAdmin.grantDescription }}</p>
            <div class="flex items-end gap-3">
              <div class="flex-1">
                <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.staffAdmin.emailLabel }}</label>
                <input
                  v-model="grantIdentifier"
                  type="text"
                  required
                  class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors"
                />
              </div>
              <button
                type="submit"
                :disabled="grantingAdmin"
                class="inline-flex items-center gap-2 px-5 py-2 text-sm font-mono font-semibold text-white bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ grantingAdmin ? t.staffAdmin.grantingLabel : t.staffAdmin.grantAction }}
              </button>
            </div>
          </form>

          <h2 class="font-serif text-lg font-semibold text-primary dark:text-gray-100 mb-3">{{ t.staffAdmin.currentAdminsHeading }}</h2>

          <div v-if="admins.length === 0" class="py-6">
            <p class="text-sm font-mono text-neutral-400 dark:text-gray-500">{{ t.staffAdmin.noAdmins }}</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-primary/10 dark:border-gray-700">
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.staffAdmin.nameCol }}</th>
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.staffAdmin.emailCol }}</th>
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.staffAdmin.githubCol }}</th>
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.staffAdmin.grantedCol }}</th>
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-primary/5 dark:divide-gray-700">
                <tr v-for="a in admins" :key="a.id">
                  <td class="py-2.5 pr-4 font-medium text-primary dark:text-gray-100">
                    {{ a.full_name ?? '—' }}
                    <span v-if="a.id === user?.id" class="ml-1.5 text-[10px] font-mono text-neutral-400 dark:text-gray-500">({{ t.staffAdmin.youLabel }})</span>
                  </td>
                  <td class="py-2.5 pr-4 font-mono text-xs text-neutral-500 dark:text-gray-400">{{ a.email ?? '—' }}</td>
                  <td class="py-2.5 pr-4 font-mono text-xs text-neutral-500 dark:text-gray-400">
                    <a
                      v-if="a.github_username"
                      :href="`https://github.com/${a.github_username}`"
                      target="_blank"
                      rel="noopener"
                      class="text-accent hover:text-accent/80 transition-colors"
                    >@{{ a.github_username }}</a>
                    <span v-else>—</span>
                  </td>
                  <td class="py-2.5 pr-4 font-mono text-xs text-neutral-400 dark:text-gray-500">
                    {{ a.role_updated_at ? formatDate(a.role_updated_at) : t.staffAdmin.autoAssigned }}
                  </td>
                  <td class="py-2.5 text-right">
                    <button
                      v-if="a.id !== user?.id"
                      @click="revokeAdmin(a)"
                      class="text-xs font-mono text-red-500/70 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      {{ t.staffAdmin.revokeAction }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <!-- SUBSCRIBERS TAB -->
      <template v-else-if="adminTab === 'subscribers'">
        <div v-if="loadingData" class="py-10 text-center">
          <p class="text-sm font-mono text-neutral-400 dark:text-gray-500">{{ t.events.admin.loading }}</p>
        </div>

        <div v-else>
          <div v-if="subscriberActionError" class="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-mono">
            {{ subscriberActionError }}
          </div>

          <div v-if="subscribers.length === 0" class="py-10 text-center">
            <p class="text-sm font-mono text-neutral-400 dark:text-gray-500">{{ t.subscribersAdmin.noEntries }}</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-primary/10 dark:border-gray-700">
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.subscribersAdmin.emailCol }}</th>
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.subscribersAdmin.languageCol }}</th>
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.subscribersAdmin.interestsCol }}</th>
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2 pr-4">{{ t.subscribersAdmin.subscribedCol }}</th>
                  <th class="text-left text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 pb-2"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-primary/5 dark:divide-gray-700">
                <tr v-for="s in subscribers" :key="s.id">
                  <td class="py-2.5 pr-4 font-medium text-primary dark:text-gray-100">{{ s.email }}</td>
                  <td class="py-2.5 pr-4 font-mono text-xs text-neutral-500 dark:text-gray-400 uppercase">{{ s.language }}</td>
                  <td class="py-2.5 pr-4 font-mono text-xs text-neutral-500 dark:text-gray-400">{{ s.interests.length > 0 ? s.interests.join(', ') : '—' }}</td>
                  <td class="py-2.5 pr-4 font-mono text-xs text-neutral-400 dark:text-gray-500">{{ formatDate(s.created_at) }}</td>
                  <td class="py-2.5 text-right">
                    <button
                      @click="deleteSubscriber(s)"
                      class="text-xs font-mono text-red-500/70 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      {{ t.subscribersAdmin.deleteAction }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <!-- FEEDBACK TAB -->
      <template v-else>
        <AdminFeedbackSection />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useConfirmDialog } from '../composables/useConfirmDialog'
import { useAuth } from '../composables/useAuth'
import { supabase } from '../lib/supabase'
import { withBase } from '../lib/paths'
import ImageUpload from './ImageUpload.vue'
import AdminEventSection from './AdminEventSection.vue'
import AdminFeedbackSection from './AdminFeedbackSection.vue'
import GitHubSignInButton from './GitHubSignInButton.vue'
import research from '../data/research.json'
import { suggestProjectContent } from '../lib/suggestProject'
import { suggestAnnouncementContent } from '../lib/suggestAnnouncement'

const { t } = useI18n()
const { confirm, confirmUnsaved } = useConfirmDialog()
const { user, ready, signOut } = useAuth()

type AuthState = 'loading' | 'unauthenticated' | 'unauthorized' | 'admin'

const authState = ref<AuthState>('loading')
const loadingData = ref(false)
const copiedCode = ref('')

interface EventRow {
  slug: string
  title: string
  registration_open: boolean
  check_in_code: string
  capacity: number | null
}

interface Participant {
  id: string
  event_slug: string
  user_id: string
  profiles: { full_name: string | null; email: string | null } | null
  status: string
  registered_at: string
  checked_in_at: string | null
}

interface EventDateInfo {
  slug: string
  eventDate: string
  eventEndDate: string | null
}

const events = ref<EventRow[]>([])
const participantsByEvent = ref<Record<string, Participant[]>>({})
const eventDates = ref<Record<string, EventDateInfo>>({})

type MemberStatus = 'student' | 'alumni'

interface MemberRow {
  id: string
  name: string
  photo: string | null
  status: MemberStatus
  cohort_year: number
  exit_year: number | null
  role_id: string
  role_en: string
  current_role_id: string | null
  current_role_en: string | null
  current_organization_id: string | null
  current_organization_en: string | null
  linkedin_url: string | null
  profile_url: string | null
  github_url: string | null
  streams: string[] | null
  research_topics: string | null
  career_update: string | null
  user_id: string | null
  approved: boolean
  created_at: string
}

const adminTab = ref<'events' | 'members' | 'projects' | 'announcements' | 'staff' | 'subscribers' | 'feedback'>('events')
const members = ref<MemberRow[]>([])
const memberFilterOptions = ['all', 'student', 'alumni', 'pending'] as const
const memberFilter = ref<typeof memberFilterOptions[number]>('all')
const showMemberForm = ref(false)
const adminUploadPrefix = ref(`admin/new-${crypto.randomUUID()}`)
const editingMemberId = ref<string | null>(null)
const savingMember = ref(false)
const memberActionError = ref('')
let memberFormSnapshot = ''

interface AdminProfile {
  id: string
  email: string | null
  full_name: string | null
  github_username: string | null
  role: string
  role_updated_at: string | null
}

const admins = ref<AdminProfile[]>([])
const grantIdentifier = ref('')
const grantingAdmin = ref(false)
const staffActionError = ref('')

interface Subscriber {
  id: string
  email: string
  language: string
  interests: string[]
  created_at: string
  confirmed_at: string | null
}

const subscribers = ref<Subscriber[]>([])
const subscriberActionError = ref('')

interface ProjectRow {
  id: string
  title: string
  tagline_en: string | null
  tagline_id: string | null
  description_en: string | null
  description_id: string | null
  tags: string[] | null
  repo_url: string | null
  demo_url: string | null
  images: string[] | null
  status: string
  stream: string | null
  researchers: string[] | null
  contributors: string[] | null
  featured: boolean
  private: boolean
  video_url: string | null
  slug: string | null
  user_id: string | null
  approved: boolean
  created_at: string
}

interface AnnouncementRow {
  id: string
  type: string
  message: string
  message_id: string | null
  link: string | null
  link_id: string | null
  link_text: string | null
  link_text_id: string | null
  dismissible: boolean
  active: boolean
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}

const announcements = ref<AnnouncementRow[]>([])
const showAnnouncementForm = ref(false)
const editingAnnouncementId = ref<string | null>(null)
const savingAnnouncement = ref(false)
const announcementActionError = ref('')
let announcementFormSnapshot = ''

// Transient: describes the announcement for the AI-suggest call, not
// saved to the row itself. Same AI-Assist/Manual mode pattern as the
// Projects tab: AI Assist (default) hides the message fields behind a
// brief box + Generate until a successful generation reveals them; Manual
// skips straight to the fields.
const announcementBrief = ref('')
const suggestingAnnouncement = ref(false)
const announcementSuggestError = ref('')
const announcementFormMode = ref<'ai' | 'manual'>('ai')
const announcementHasGenerated = ref(false)

const projects = ref<ProjectRow[]>([])
const projectFilterOptions = ['all', 'pending'] as const
const projectFilter = ref<typeof projectFilterOptions[number]>('all')
const showProjectForm = ref(false)
const adminProjectUploadPrefix = ref(`admin/new-${crypto.randomUUID()}`)
const editingProjectId = ref<string | null>(null)
const savingProject = ref(false)
const projectActionError = ref('')
let projectFormSnapshot = ''

// Transient: describes the project for the AI-suggest call, not saved to
// the row itself.
const projectBrief = ref('')
const suggestingProject = ref(false)
const projectSuggestError = ref('')

// AI Assist (default) shows the brief box; the tagline/description/tags
// fields stay hidden until a successful generation reveals them. Manual
// skips the brief box and shows those fields immediately. See the
// identical pattern + rationale in ShowcaseSubmissionForm.vue.
const projectFormMode = ref<'ai' | 'manual'>('ai')
const projectHasGenerated = ref(false)

// Researcher slug -> display name, for the curatorial "researchers"
// checkbox list: same client-side resolution already used by
// Sidebar.vue for the researchers sidebar panel.
const researcherOptions = ref<{ id: string; name: string }[]>([])

onMounted(async () => {
  try {
    researcherOptions.value = await (await fetch(withBase('/api/researchers.json'))).json()
  } catch {
    researcherOptions.value = []
  }
})

function emptyMemberForm() {
  return {
    status: 'student' as MemberStatus,
    name: '',
    photo: null as string | null,
    cohort_year: new Date().getFullYear(),
    exit_year: null as number | null,
    role_id: '',
    role_en: '',
    current_role_id: '',
    current_role_en: '',
    current_organization_id: '',
    current_organization_en: '',
    linkedin_url: '',
    profile_url: '',
    github_url: '',
    streams: [] as string[],
    research_topics: '',
    career_update: '',
    approved: true,
  }
}

const memberForm = reactive(emptyMemberForm())

const filteredMembers = computed(() => {
  if (memberFilter.value === 'all') return members.value
  if (memberFilter.value === 'pending') return members.value.filter((m) => !m.approved)
  return members.value.filter((m) => m.status === memberFilter.value)
})

const pendingMembers = computed(() => members.value.filter((m) => !m.approved))
const pendingApprovalsCount = computed(() => pendingMembers.value.length)

// Jumps straight to reviewing a specific pending submission's full edit
// form from the Needs Review callout, instead of making the admin find it
// again after switching tabs/filters manually.
function reviewMember(m: MemberRow) {
  adminTab.value = 'members'
  memberFilter.value = 'pending'
  editMember(m)
}

function resetMemberForm() {
  Object.assign(memberForm, emptyMemberForm())
  editingMemberId.value = null
}

function snapshotMemberForm() {
  memberFormSnapshot = JSON.stringify(memberForm)
}

function isMemberFormDirty(): boolean {
  return JSON.stringify(memberForm) !== memberFormSnapshot
}

function openAddMemberForm() {
  resetMemberForm()
  adminUploadPrefix.value = `admin/new-${crypto.randomUUID()}`
  memberActionError.value = ''
  showMemberForm.value = true
  snapshotMemberForm()
}

// The actual, unconditional close: used after a successful save, and as
// the "discard" outcome of the unsaved-changes dialog. Does not itself
// check for unsaved changes; closeMemberForm() below is the guarded
// entry point used by the Cancel button.
function forceCloseMemberForm() {
  showMemberForm.value = false
  resetMemberForm()
}

async function closeMemberForm() {
  if (!isMemberFormDirty()) {
    forceCloseMemberForm()
    return
  }

  const result = await confirmUnsaved({
    title: t.value.confirmDialog.unsavedTitle,
    message: t.value.confirmDialog.unsavedMessage,
    saveLabel: t.value.confirmDialog.saveLabel,
    discardLabel: t.value.confirmDialog.dontSaveLabel,
    cancelLabel: t.value.confirmDialog.cancelLabel,
  })

  if (result === 'save') {
    await handleSaveMember()
  } else if (result === 'discard') {
    forceCloseMemberForm()
  }
  // 'cancel' → leave the form open, do nothing.
}

function editMember(m: MemberRow) {
  editingMemberId.value = m.id
  Object.assign(memberForm, {
    status: m.status,
    name: m.name,
    photo: m.photo,
    cohort_year: m.cohort_year,
    exit_year: m.exit_year,
    role_id: m.role_id,
    role_en: m.role_en,
    current_role_id: m.current_role_id ?? '',
    current_role_en: m.current_role_en ?? '',
    current_organization_id: m.current_organization_id ?? '',
    current_organization_en: m.current_organization_en ?? '',
    linkedin_url: m.linkedin_url ?? '',
    profile_url: m.profile_url ?? '',
    github_url: m.github_url ?? '',
    streams: m.streams ?? [],
    research_topics: m.research_topics ?? '',
    career_update: m.career_update ?? '',
    approved: m.approved,
  })
  memberActionError.value = ''
  showMemberForm.value = true
  snapshotMemberForm()
}

async function loadMembers() {
  const { data } = await supabase
    .schema('se')
    .from('members')
    .select('*')
    .order('cohort_year', { ascending: false })

  members.value = data ?? []
}

async function handleSaveMember() {
  savingMember.value = true
  memberActionError.value = ''

  const payload = {
    status: memberForm.status,
    name: memberForm.name.trim(),
    photo: memberForm.photo || null,
    cohort_year: memberForm.cohort_year,
    exit_year: memberForm.status === 'alumni' ? memberForm.exit_year : null,
    role_id: memberForm.role_id.trim(),
    role_en: memberForm.role_en.trim(),
    current_role_id: memberForm.current_role_id.trim() || null,
    current_role_en: memberForm.current_role_en.trim() || null,
    current_organization_id: memberForm.current_organization_id.trim() || null,
    current_organization_en: memberForm.current_organization_en.trim() || null,
    linkedin_url: memberForm.linkedin_url.trim() || null,
    profile_url: memberForm.profile_url.trim() || null,
    github_url: memberForm.github_url.trim() || null,
    streams: memberForm.streams,
    research_topics: memberForm.research_topics.trim() || null,
    career_update: memberForm.career_update.trim() || null,
    approved: memberForm.approved,
  }

  const { error } = editingMemberId.value
    ? await supabase.schema('se').from('members').update(payload).eq('id', editingMemberId.value)
    : await supabase.schema('se').from('members').insert(payload)

  savingMember.value = false

  if (error) {
    memberActionError.value = error.message
    return
  }

  forceCloseMemberForm()
  await loadMembers()
}

async function approveMember(m: MemberRow) {
  const { error } = await supabase.schema('se').from('members').update({ approved: true }).eq('id', m.id)
  if (error) {
    memberActionError.value = error.message
    return
  }
  await loadMembers()
}

async function deleteMember(m: MemberRow) {
  const ok = await confirm({
    title: t.value.confirmDialog.deleteTitle,
    message: t.value.confirmDialog.deleteMessage,
    confirmLabel: t.value.confirmDialog.deleteConfirmLabel,
    cancelLabel: t.value.confirmDialog.cancelLabel,
    variant: 'danger',
  })
  if (!ok) return

  const { error } = await supabase.schema('se').from('members').delete().eq('id', m.id)
  if (error) {
    memberActionError.value = error.message
    return
  }
  await loadMembers()
}

function emptyProjectForm() {
  return {
    title: '',
    tagline_en: '',
    tagline_id: '',
    description_en: '',
    description_id: '',
    tags: [] as string[],
    repo_url: '',
    demo_url: '',
    images: [] as string[],
    status: 'active' as 'active' | 'completed' | 'prototype' | 'under-development',
    stream: '',
    researchers: [] as string[],
    contributors: [] as string[],
    featured: false,
    private: false,
    video_url: '',
    slug: '',
    approved: true,
  }
}

const projectForm = reactive(emptyProjectForm())

// Comma-separated text UX over the underlying tags array: mirrors how
// memberForm.streams is a checkbox list bound directly to an array, except
// tags are freeform so a plain delimited text input is the natural editor.
const projectTagsInput = computed({
  get: () => projectForm.tags.join(', '),
  set: (val: string) => {
    projectForm.tags = val.split(',').map((s) => s.trim()).filter(Boolean)
  },
})

const projectContributorsInput = computed({
  get: () => projectForm.contributors.join(', '),
  set: (val: string) => {
    projectForm.contributors = val.split(',').map((s) => s.trim()).filter(Boolean)
  },
})

// ImageUpload writes a single {prefix}/photo.jpg: bind it to images[0]
// (the cover shown on the directory card) while preserving whatever
// gallery images[1..] already holds.
const projectCoverImage = computed({
  get: () => projectForm.images[0] ?? null,
  set: (val: string | null) => {
    const rest = projectForm.images.slice(1)
    projectForm.images = val ? [val, ...rest] : rest
  },
})

// Plain "one URL per line" textarea for the rest of the gallery: a rare
// admin action, not worth a multi-upload repeater component.
const projectAdditionalImagesInput = computed({
  get: () => projectForm.images.slice(1).join('\n'),
  set: (val: string) => {
    const extra = val.split('\n').map((s) => s.trim()).filter(Boolean)
    const cover = projectForm.images[0]
    projectForm.images = cover ? [cover, ...extra] : extra
  },
})

const filteredProjects = computed(() => {
  if (projectFilter.value === 'pending') return projects.value.filter((p) => !p.approved)
  return projects.value
})

function resetProjectForm() {
  Object.assign(projectForm, emptyProjectForm())
  editingProjectId.value = null
  projectBrief.value = ''
  projectSuggestError.value = ''
  projectFormMode.value = 'ai'
  projectHasGenerated.value = false
}

function snapshotProjectForm() {
  projectFormSnapshot = JSON.stringify(projectForm)
}

function isProjectFormDirty(): boolean {
  return JSON.stringify(projectForm) !== projectFormSnapshot
}

function openAddProjectForm() {
  resetProjectForm()
  adminProjectUploadPrefix.value = `admin/new-${crypto.randomUUID()}`
  projectActionError.value = ''
  showProjectForm.value = true
  snapshotProjectForm()
}

function forceCloseProjectForm() {
  showProjectForm.value = false
  resetProjectForm()
}

async function closeProjectForm() {
  if (!isProjectFormDirty()) {
    forceCloseProjectForm()
    return
  }

  const result = await confirmUnsaved({
    title: t.value.confirmDialog.unsavedTitle,
    message: t.value.confirmDialog.unsavedMessage,
    saveLabel: t.value.confirmDialog.saveLabel,
    discardLabel: t.value.confirmDialog.dontSaveLabel,
    cancelLabel: t.value.confirmDialog.cancelLabel,
  })

  if (result === 'save') {
    await handleSaveProject()
  } else if (result === 'discard') {
    forceCloseProjectForm()
  }
  // 'cancel' → leave the form open, do nothing.
}

function editProject(p: ProjectRow) {
  editingProjectId.value = p.id
  Object.assign(projectForm, {
    title: p.title,
    tagline_en: p.tagline_en ?? '',
    tagline_id: p.tagline_id ?? '',
    description_en: p.description_en ?? '',
    description_id: p.description_id ?? '',
    tags: p.tags ?? [],
    repo_url: p.repo_url ?? '',
    demo_url: p.demo_url ?? '',
    images: p.images ?? [],
    status: (p.status ?? 'active') as typeof projectForm.status,
    stream: p.stream ?? '',
    researchers: p.researchers ?? [],
    contributors: p.contributors ?? [],
    featured: p.featured ?? false,
    private: p.private ?? false,
    video_url: p.video_url ?? '',
    slug: p.slug ?? '',
    approved: p.approved,
  })
  projectBrief.value = ''
  projectActionError.value = ''
  projectSuggestError.value = ''
  // Existing rows already have their fields set: show them immediately
  // rather than hiding them behind a re-generate.
  projectFormMode.value = 'manual'
  showProjectForm.value = true
  snapshotProjectForm()
}

async function loadProjects() {
  const { data } = await supabase
    .schema('se')
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  projects.value = data ?? []
}

async function handleSuggestProject() {
  suggestingProject.value = true
  projectSuggestError.value = ''

  const { suggestion } = await suggestProjectContent({
    title: projectForm.title,
    brief: projectBrief.value,
    repo_url: projectForm.repo_url,
  })

  suggestingProject.value = false

  if (!suggestion) {
    projectSuggestError.value = t.value.showcaseAdmin.suggestError
    return
  }

  projectForm.tagline_en = suggestion.tagline_en
  projectForm.tagline_id = suggestion.tagline_id
  projectForm.description_en = suggestion.description_en
  projectForm.description_id = suggestion.description_id
  projectForm.tags = suggestion.tags
  projectHasGenerated.value = true
}

async function handleSaveProject() {
  savingProject.value = true
  projectActionError.value = ''

  const payload = {
    title: projectForm.title.trim(),
    tagline_en: projectForm.tagline_en.trim() || null,
    tagline_id: projectForm.tagline_id.trim() || null,
    description_en: projectForm.description_en.trim() || null,
    description_id: projectForm.description_id.trim() || null,
    tags: projectForm.tags,
    repo_url: projectForm.repo_url.trim() || null,
    demo_url: projectForm.demo_url.trim() || null,
    images: projectForm.images,
    status: projectForm.status,
    stream: projectForm.stream || null,
    researchers: projectForm.researchers,
    contributors: projectForm.contributors,
    featured: projectForm.featured,
    private: projectForm.private,
    video_url: projectForm.video_url.trim() || null,
    slug: projectForm.slug.trim() || null,
    approved: projectForm.approved,
  }

  const { error } = editingProjectId.value
    ? await supabase.schema('se').from('projects').update(payload).eq('id', editingProjectId.value)
    : await supabase.schema('se').from('projects').insert(payload)

  savingProject.value = false

  if (error) {
    projectActionError.value = error.message
    return
  }

  forceCloseProjectForm()
  await loadProjects()
}

async function approveProject(p: ProjectRow) {
  const { error } = await supabase.schema('se').from('projects').update({ approved: true }).eq('id', p.id)
  if (error) {
    projectActionError.value = error.message
    return
  }
  await loadProjects()
}

async function deleteProject(p: ProjectRow) {
  const ok = await confirm({
    title: t.value.confirmDialog.deleteTitle,
    message: t.value.confirmDialog.deleteMessage,
    confirmLabel: t.value.confirmDialog.deleteConfirmLabel,
    cancelLabel: t.value.confirmDialog.cancelLabel,
    variant: 'danger',
  })
  if (!ok) return

  const { error } = await supabase.schema('se').from('projects').delete().eq('id', p.id)
  if (error) {
    projectActionError.value = error.message
    return
  }
  await loadProjects()
}

// datetime-local inputs work in the browser's local timezone and have no
// concept of UTC; Postgres timestamptz columns want ISO 8601. Converting at
// the form boundary (not deeper) keeps every other read/write plain ISO.
function isoToDatetimeLocal(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function datetimeLocalToIso(local: string): string | null {
  if (!local) return null
  const d = new Date(local)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

function emptyAnnouncementForm() {
  return {
    type: 'info' as 'info' | 'warning' | 'success',
    message: '',
    message_id: '',
    link: '',
    link_id: '',
    link_text: '',
    link_text_id: '',
    dismissible: true,
    active: false,
    start_date: '',
    end_date: '',
  }
}

const announcementForm = reactive(emptyAnnouncementForm())

// An expired row still has active = true until an admin turns it off: the
// badge should reflect what viewers actually see (RLS + the banner's own
// expiry check both hide it), not the raw column value.
function isAnnouncementExpired(a: AnnouncementRow): boolean {
  return !!a.end_date && new Date(a.end_date) < new Date()
}

function resetAnnouncementForm() {
  Object.assign(announcementForm, emptyAnnouncementForm())
  editingAnnouncementId.value = null
  announcementBrief.value = ''
  announcementSuggestError.value = ''
  announcementFormMode.value = 'ai'
  announcementHasGenerated.value = false
}

async function handleSuggestAnnouncement() {
  suggestingAnnouncement.value = true
  announcementSuggestError.value = ''

  const { suggestion } = await suggestAnnouncementContent({
    brief: announcementBrief.value,
  })

  suggestingAnnouncement.value = false

  if (!suggestion) {
    announcementSuggestError.value = t.value.announcementsAdmin.suggestError
    return
  }

  announcementForm.message = suggestion.message_en
  announcementForm.message_id = suggestion.message_id
  announcementHasGenerated.value = true
}

function snapshotAnnouncementForm() {
  announcementFormSnapshot = JSON.stringify(announcementForm)
}

function isAnnouncementFormDirty(): boolean {
  return JSON.stringify(announcementForm) !== announcementFormSnapshot
}

function openAddAnnouncementForm() {
  resetAnnouncementForm()
  announcementActionError.value = ''
  showAnnouncementForm.value = true
  snapshotAnnouncementForm()
}

function forceCloseAnnouncementForm() {
  showAnnouncementForm.value = false
  resetAnnouncementForm()
}

async function closeAnnouncementForm() {
  if (!isAnnouncementFormDirty()) {
    forceCloseAnnouncementForm()
    return
  }

  const result = await confirmUnsaved({
    title: t.value.confirmDialog.unsavedTitle,
    message: t.value.confirmDialog.unsavedMessage,
    saveLabel: t.value.confirmDialog.saveLabel,
    discardLabel: t.value.confirmDialog.dontSaveLabel,
    cancelLabel: t.value.confirmDialog.cancelLabel,
  })

  if (result === 'save') {
    await handleSaveAnnouncement()
  } else if (result === 'discard') {
    forceCloseAnnouncementForm()
  }
  // 'cancel' → leave the form open, do nothing.
}

function editAnnouncement(a: AnnouncementRow) {
  editingAnnouncementId.value = a.id
  Object.assign(announcementForm, {
    type: a.type as 'info' | 'warning' | 'success',
    message: a.message,
    message_id: a.message_id ?? '',
    link: a.link ?? '',
    link_id: a.link_id ?? '',
    link_text: a.link_text ?? '',
    link_text_id: a.link_text_id ?? '',
    dismissible: a.dismissible,
    active: a.active,
    start_date: isoToDatetimeLocal(a.start_date),
    end_date: isoToDatetimeLocal(a.end_date),
  })
  announcementBrief.value = ''
  announcementActionError.value = ''
  announcementSuggestError.value = ''
  // Existing rows already have their message set: show it immediately
  // rather than hiding it behind a re-generate, same as editProject().
  announcementFormMode.value = 'manual'
  showAnnouncementForm.value = true
  snapshotAnnouncementForm()
}

async function loadAnnouncements() {
  const { data } = await supabase
    .schema('se')
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  announcements.value = data ?? []
}

async function handleSaveAnnouncement() {
  // The message fields are gated behind AI-Assist/Manual mode, so unlike
  // the always-rendered title field on the Projects form, the browser's
  // native `required` validation can't catch a blank message here: an
  // admin who stays in AI mode without generating (or without switching to
  // Manual) could otherwise hit a raw NOT NULL/CHECK constraint error from
  // Postgres. Guard explicitly so the failure is a clear message instead.
  if (!announcementForm.message.trim()) {
    announcementActionError.value = t.value.announcementsAdmin.messageRequiredError
    return
  }

  savingAnnouncement.value = true
  announcementActionError.value = ''

  const payload = {
    type: announcementForm.type,
    message: announcementForm.message.trim(),
    message_id: announcementForm.message_id.trim() || null,
    link: announcementForm.link.trim() || null,
    link_id: announcementForm.link_id.trim() || null,
    link_text: announcementForm.link_text.trim() || null,
    link_text_id: announcementForm.link_text_id.trim() || null,
    dismissible: announcementForm.dismissible,
    active: announcementForm.active,
    start_date: datetimeLocalToIso(announcementForm.start_date),
    end_date: datetimeLocalToIso(announcementForm.end_date),
  }

  const { error } = editingAnnouncementId.value
    ? await supabase.schema('se').from('announcements').update(payload).eq('id', editingAnnouncementId.value)
    : await supabase.schema('se').from('announcements').insert(payload)

  savingAnnouncement.value = false

  if (error) {
    announcementActionError.value = error.message
    return
  }

  forceCloseAnnouncementForm()
  await loadAnnouncements()
}

async function deleteAnnouncement(a: AnnouncementRow) {
  const ok = await confirm({
    title: t.value.confirmDialog.deleteTitle,
    message: t.value.confirmDialog.deleteMessage,
    confirmLabel: t.value.confirmDialog.deleteConfirmLabel,
    cancelLabel: t.value.confirmDialog.cancelLabel,
    variant: 'danger',
  })
  if (!ok) return

  const { error } = await supabase.schema('se').from('announcements').delete().eq('id', a.id)
  if (error) {
    announcementActionError.value = error.message
    return
  }
  await loadAnnouncements()
}

// Reactive session from the shared useAuth() composable, instead of a
// one-time getUser() + hand-rolled state machine: covers initial load,
// sign-in, and sign-out through this single watcher, and keeps this page's
// session in sync with the status bar's AccountStatusItem for free.
watch(
  () => [ready.value, user.value] as const,
  async ([isReady, currentUser]) => {
    if (!isReady) return

    if (!currentUser) {
      authState.value = 'unauthenticated'
      events.value = []
      participantsByEvent.value = {}
      members.value = []
      projects.value = []
      return
    }

    authState.value = 'loading'
    const { data: profile } = await supabase
      .schema('se')
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      authState.value = 'unauthorized'
      return
    }

    authState.value = 'admin'
    await loadData()
  },
  { immediate: true }
)

async function loadData() {
  loadingData.value = true

  const { data: eventsData } = await supabase
    .schema('se')
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })

  events.value = eventsData ?? []

  const { data: participantsData } = await supabase
    .schema('se')
    .from('participants')
    .select('id, event_slug, user_id, status, registered_at, checked_in_at, profiles(full_name, email)')
    .order('registered_at', { ascending: false })

  const byEvent: Record<string, Participant[]> = {}
  for (const ev of events.value) {
    byEvent[ev.slug] = []
  }
  for (const p of (participantsData ?? [])) {
    if (!byEvent[p.event_slug]) byEvent[p.event_slug] = []
    byEvent[p.event_slug].push(p)
  }
  participantsByEvent.value = byEvent

  await loadMembers()
  await loadProjects()
  await loadAnnouncements()
  await loadEventDates()
  await loadAdmins()
  await loadSubscribers()

  loadingData.value = false
}

async function loadEventDates() {
  try {
    const res = await fetch(withBase('/api/events.json'))
    const data: EventDateInfo[] = await res.json()
    const map: Record<string, EventDateInfo> = {}
    for (const d of data) map[d.slug] = d
    eventDates.value = map
  } catch {
    // Missing/unreachable events.json shouldn't break the dashboard, just
    // means no event defaults to "past" (isEventPast() below treats an
    // unknown slug as not-past, so it stays visible rather than hidden).
    eventDates.value = {}
  }
}

async function loadAdmins() {
  const { data } = await supabase
    .schema('se')
    .from('profiles')
    .select('id, email, full_name, github_username, role, role_updated_at')
    .eq('role', 'admin')
    .order('email')

  admins.value = data ?? []
}

async function handleGrantAdmin() {
  grantingAdmin.value = true
  staffActionError.value = ''

  // Accepts an email, a bare GitHub username, an @-prefixed handle, or a
  // pasted GitHub profile URL. GitHub is now the only sign-in method, so
  // an admin may only know a colleague's handle, not their email.
  const identifier = grantIdentifier.value
    .trim()
    .replace(/^https?:\/\/(www\.)?github\.com\//i, '')
    .replace(/^@/, '')

  const lookup = identifier.includes('@')
    ? supabase.schema('se').from('profiles').select('id').eq('email', identifier.toLowerCase())
    : supabase.schema('se').from('profiles').select('id').ilike('github_username', identifier)

  const { data: found, error: lookupError } = await lookup.maybeSingle()

  if (lookupError || !found) {
    grantingAdmin.value = false
    staffActionError.value = t.value.staffAdmin.notFoundError
    return
  }

  const { error } = await supabase.schema('se').from('profiles').update({ role: 'admin' }).eq('id', found.id)

  grantingAdmin.value = false

  if (error) {
    staffActionError.value = error.message
    return
  }

  grantIdentifier.value = ''
  await loadAdmins()
}

async function revokeAdmin(a: AdminProfile) {
  const ok = await confirm({
    title: t.value.confirmDialog.deleteTitle,
    message: t.value.staffAdmin.revokeConfirm,
    confirmLabel: t.value.staffAdmin.revokeAction,
    cancelLabel: t.value.confirmDialog.cancelLabel,
    variant: 'danger',
  })
  if (!ok) return

  const { error } = await supabase.schema('se').from('profiles').update({ role: 'user' }).eq('id', a.id)
  if (error) {
    staffActionError.value = error.message
    return
  }
  await loadAdmins()
}

async function loadSubscribers() {
  const { data } = await supabase
    .schema('se')
    .from('subscribers')
    .select('*')
    .order('created_at', { ascending: false })

  subscribers.value = data ?? []
}

async function deleteSubscriber(s: Subscriber) {
  const ok = await confirm({
    title: t.value.confirmDialog.deleteTitle,
    message: t.value.subscribersAdmin.deleteConfirm,
    confirmLabel: t.value.confirmDialog.deleteConfirmLabel,
    cancelLabel: t.value.confirmDialog.cancelLabel,
    variant: 'danger',
  })
  if (!ok) return

  const { error } = await supabase.schema('se').from('subscribers').delete().eq('id', s.id)
  if (error) {
    subscriberActionError.value = error.message
    return
  }
  await loadSubscribers()
}

async function handleSignOut() {
  await signOut()
  // The watch() above reactively resets authState/events/participants/members
  // once user becomes null, no need to duplicate that here.
}

async function copyCode(code: string) {
  await navigator.clipboard.writeText(code)
  copiedCode.value = code
  setTimeout(() => { copiedCode.value = '' }, 2000)
}

function toggleRegistration(event: EventRow) {
  const nextValue = !event.registration_open
  supabase.schema('se').from('events').update({ registration_open: nextValue }).eq('slug', event.slug)
    .then(({ error }) => {
      if (!error) event.registration_open = nextValue
    })
}

function updateCapacity(event: EventRow, capacity: number | null) {
  supabase.schema('se').from('events').update({ capacity }).eq('slug', event.slug)
    .then(({ error }) => {
      if (!error) event.capacity = capacity
    })
}

function resolvedEventDate(slug: string): { start: Date; end: Date } | null {
  const info = eventDates.value[slug]
  if (!info) return null
  const start = new Date(info.eventDate)
  const end = info.eventEndDate ? new Date(info.eventEndDate) : start
  return { start, end }
}

// Day-granular, mirrors EventsPage.vue's public-facing past/upcoming split.
// A slug missing from eventDates (fetch failure, or an event not present in
// the managed blog collection) is treated as NOT past, so it stays visible
// rather than silently hidden.
function isEventPast(slug: string): boolean {
  const resolved = resolvedEventDate(slug)
  if (!resolved) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return resolved.end < today
}

function eventDateSortKey(slug: string): number | null {
  const resolved = resolvedEventDate(slug)
  return resolved ? resolved.start.getTime() : null
}

const upcomingEvents = computed(() =>
  events.value
    .filter((e) => !isEventPast(e.slug))
    .sort((a, b) => {
      const ka = eventDateSortKey(a.slug)
      const kb = eventDateSortKey(b.slug)
      if (ka === null && kb === null) return 0
      if (ka === null) return 1
      if (kb === null) return -1
      return ka - kb // soonest first
    })
)

const pastEvents = computed(() =>
  events.value
    .filter((e) => isEventPast(e.slug))
    .sort((a, b) => {
      const ka = eventDateSortKey(a.slug)
      const kb = eventDateSortKey(b.slug)
      if (ka === null && kb === null) return 0
      if (ka === null) return 1
      if (kb === null) return -1
      return kb - ka // most recent first
    })
)

const registeredThisWeekCount = computed(() => {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  let count = 0
  for (const list of Object.values(participantsByEvent.value)) {
    count += list.filter((p) => new Date(p.registered_at) >= weekAgo).length
  }
  return count
})

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}
</script>
