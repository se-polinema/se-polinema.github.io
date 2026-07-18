import { ref } from 'vue'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

// Reactive Supabase auth session, shared across every independently-mounted
// Vue island — mirrors the module-singleton pattern used by usePalette.ts /
// useTheme.ts / useVSCodeLayout.ts (module-scope ref + a one-time browser-only
// init guarded by a plain module-level flag, since Astro components mount
// their own instance of the composable but must all observe the same state).
//
// Unlike those composables there's nothing to read from localStorage — the
// session lives in Supabase's own storage — so init just seeds from
// getSession() and then keeps in sync via onAuthStateChange for the lifetime
// of the page (sign-in redirects always trigger a full page load, so a single
// subscription per page load is sufficient).
const user = ref<User | null>(null)
const ready = ref(false)

let initialized = false

function init() {
  if (typeof window === 'undefined' || initialized) return
  initialized = true

  supabase.auth.getSession().then(({ data }) => {
    user.value = data.session?.user ?? null
    ready.value = true
  })

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null
  })
}

export function useAuth() {
  init()

  async function signOut() {
    await supabase.auth.signOut()
  }

  return { user, ready, signOut }
}
