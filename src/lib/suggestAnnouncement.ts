// "Suggest with AI" invoke helper for the Announcements admin tab — mirrors
// src/lib/suggestProject.ts exactly (same edge-function-invoke +
// error-recovery shape), scoped to announcement banner copy instead of
// project copy.

export interface AnnouncementSuggestion {
  message_en: string
  message_id: string
}

export interface SuggestAnnouncementResult {
  suggestion: AnnouncementSuggestion | null
  error: string | null
}

export async function suggestAnnouncementContent(params: {
  brief: string
}): Promise<SuggestAnnouncementResult> {
  const { supabase } = await import('./supabase')

  const { data, error } = await supabase.functions.invoke('suggest-announcement-content', {
    body: {
      brief: params.brief,
    },
  })

  if (error) {
    // functions.invoke() surfaces non-2xx responses as a generic SDK error
    // without parsing the JSON body — recover the actual server message
    // (suggest-announcement-content returns { error: <code> }) from the raw
    // Response on error.context, same recovery pattern as suggestProject.ts.
    let serverMessage: string | null = null
    try {
      const body = await (error as { context?: Response }).context?.json()
      serverMessage = body?.error ?? null
    } catch {
      // ignore — fall through to the generic error below
    }
    return { suggestion: null, error: serverMessage || 'ai_failed' }
  }

  return { suggestion: (data?.suggestion as AnnouncementSuggestion) ?? null, error: null }
}
