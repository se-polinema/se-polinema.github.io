import { onMounted, ref } from 'vue'
import { supabase } from '../lib/supabase'

export type GateState = 'loading' | 'unauthenticated' | 'unauthorized' | 'ready' | 'error'

/**
 * Client-side admin gate (same check as PresentationGate.vue): signed in AND se.profiles.role = 'admin'.
 * This only gates the UI. Real enforcement for live voting is RLS / monev.is_admin() in the database.
 */
export function useAdminGate() {
  const state = ref<GateState>('loading')

  async function check() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        state.value = 'unauthenticated'
        return
      }
      const { data: profile } = await supabase.schema('se').from('profiles').select('role').eq('id', user.id).single()
      state.value = profile?.role === 'admin' ? 'ready' : 'unauthorized'
    } catch (err) {
      console.error('[useAdminGate]', err)
      state.value = 'error'
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    state.value = 'unauthenticated'
  }

  onMounted(check)
  return { state, signOut }
}
