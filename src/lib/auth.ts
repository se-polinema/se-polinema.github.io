export const POLINEMA_RESEARCHER_DOMAIN = 'polinema.ac.id'

export function isPolinemaResearcherEmail(email: string): boolean {
  const parts = email.split('@')
  if (parts.length !== 2) return false
  return parts[1].toLowerCase() === POLINEMA_RESEARCHER_DOMAIN
}

export function getRoleFromEmail(email: string): 'admin' | 'user' {
  return isPolinemaResearcherEmail(email) ? 'admin' : 'user'
}
