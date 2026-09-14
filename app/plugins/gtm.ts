// Google Tag Manager + Google Consent Mode v2.
//
// Runs on server and client so the tags ship in the initial HTML. Consent is
// denied by default; the CookieConsent banner flips analytics_storage to
// granted on opt-in. Disabled entirely when gtmId is unset.
//
// The consent default reads the `fah_consent` cookie *inline in the browser*,
// before GTM fires. Prerendered pages bake a static default, so we can't set it
// from a server-side cookie read — reading it client-side here is what keeps a
// returning/consented visitor `granted` from the very first hit on every load.
export default defineNuxtPlugin(() => {
  const { gtmId } = useRuntimeConfig().public
  if (!gtmId) return

  useHead({
    script: [
      { // Must run first: init dataLayer/gtag and set consent defaults.
        key: 'consent-default',
        tagPriority: 0,
        innerHTML:
          `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}` +
          `gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',` +
          `ad_personalization:'denied',` +
          `analytics_storage:document.cookie.indexOf('fah_consent=granted')>-1?'granted':'denied',` +
          `wait_for_update:500});`,
      },
      { // GTM loader.
        key: 'gtm',
        tagPriority: 1,
        innerHTML:
          `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),` +
          `event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),` +
          `dl=l!='dataLayer'?'&l='+l:'';j.async=true;` +
          `j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;` +
          `f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer','${gtmId}');`,
      },
    ],
    noscript: [
      {
        key: 'gtm-noscript',
        tagPosition: 'bodyOpen',
        innerHTML:
          `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" ` +
          `height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
      },
    ],
  })
})
