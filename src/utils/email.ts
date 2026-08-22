// Base64 so no plaintext address appears in static HTML, Astro island props,
// or bundled JS. Regenerate with:
//   node -e "console.log(Buffer.from('imam.fahrur@polinema.ac.id').toString('base64'))"
export const LAB_EMAIL_ENCODED = 'aW1hbS5mYWhydXJAcG9saW5lbWEuYWMuaWQ='

export function decodeEmail(encoded: string): string {
  try {
    return atob(encoded)
  } catch {
    return ''
  }
}

export function encodeEmail(email: string): string {
  return btoa(email)
}
