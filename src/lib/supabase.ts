import { createClient } from '@supabase/supabase-js'

// Fallbacks keep createClient happy at SSG build time when env vars aren't set.
// Operations against the placeholder URL fail gracefully at runtime.
const url = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(url, key)
