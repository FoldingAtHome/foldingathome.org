// GA4 page_view on client-side (SPA) route changes, via GTM.
//
// gtag('event',...) does NOT route to GA4 through a GTM "Google Tag", so we
// push a custom `spa_pageview` event to the dataLayer and let GTM turn it into
// a GA4 page_view (Custom Event trigger -> GA4 Event tag). `last` starts at the
// hydrated route so the initial view (sent by the Google Tag on load) isn't
// double-counted. We wait a paint frame after nextTick so Nuxt's head has
// flushed the new <title> before we read it — at nextTick it's still stale.
declare global {
  interface Window { dataLayer?: Record<string, unknown>[] }
}

export default defineNuxtPlugin(() => {
  const { gtmId } = useRuntimeConfig().public
  if (!gtmId) return

  const router = useRouter()
  let last = router.currentRoute.value.fullPath

  router.afterEach(async to => {
    if (to.fullPath === last) return
    last = to.fullPath
    await nextTick()
    await new Promise(requestAnimationFrame)
    window.dataLayer?.push({
      event: 'spa_pageview',
      page_location: location.href,
      page_title: document.title,
    })
  })
})
