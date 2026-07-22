// Shared "Suggest with AI" invoke helper for the Showcase feature — used by
// both AdminDashboard.vue's Projects tab and ShowcaseSubmissionForm.vue, so
// the edge-function-invoke + error-recovery logic exists in exactly one
// place instead of being duplicated per caller.

export interface ProjectSuggestion {
  tagline_en: string
  tagline_id: string
  description_en: string
  description_id: string
  tags: string[]
}

export interface SuggestProjectResult {
  suggestion: ProjectSuggestion | null
  error: string | null
}

export async function suggestProjectContent(params: {
  title: string
  brief: string
  repo_url?: string
}): Promise<SuggestProjectResult> {
  const { supabase } = await import('./supabase')

  const { data, error } = await supabase.functions.invoke('suggest-project-content', {
    body: {
      title: params.title,
      brief: params.brief,
      repo_url: params.repo_url || null,
    },
  })

  if (error) {
    // functions.invoke() surfaces non-2xx responses as a generic SDK error
    // without parsing the JSON body — recover the actual server message
    // (suggest-project-content returns { error: <code> }) from the raw
    // Response on error.context, same recovery pattern as submit-member.
    let serverMessage: string | null = null
    try {
      const body = await (error as { context?: Response }).context?.json()
      serverMessage = body?.error ?? null
    } catch {
      // ignore — fall through to the generic error below
    }
    return { suggestion: null, error: serverMessage || 'ai_failed' }
  }

  return { suggestion: (data?.suggestion as ProjectSuggestion) ?? null, error: null }
}
