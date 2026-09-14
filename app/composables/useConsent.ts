// Cookie-consent state, shared by the GTM plugin and the CookieConsent banner.
// The choice is stored in a cookie scoped (in production) to
// `.foldingathome.org` so a single accept/reject carries across every
// subdomain that reuses this setup.

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

export const CONSENT_COOKIE = 'fah_consent'

export const useConsent = () => {
  const { consentCookieDomain } = useRuntimeConfig().public
  const choice = useCookie<'granted' | 'denied' | null>(CONSENT_COOKIE, {
    domain: consentCookieDomain || undefined,
    maxAge: 60 * 60 * 24 * 180, // 180 days
    sameSite: 'lax',
    path: '/',
  })

  // Record the choice and, on the client, push a Consent Mode v2 update so
  // GTM/GA start (or stay stopped) without a page reload.
  const apply = (granted: boolean) => {
    choice.value = granted ? 'granted' : 'denied'
    if (import.meta.client && typeof window.gtag === 'function')
      window.gtag('consent', 'update', {
        analytics_storage: granted ? 'granted' : 'denied',
      })
  }

  return { choice, apply }
}
