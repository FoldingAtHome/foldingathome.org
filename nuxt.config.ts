import { fileURLToPath } from 'node:url'
import { readFileSync, existsSync } from 'node:fs'

const tokens = readFileSync(
  fileURLToPath(new URL('./app/assets/styles/tokens.styl', import.meta.url)),
  'utf8',
)

// .env.local (gitignored) overrides values from .env / hardcoded defaults.
// Use it to point dev at api3.foldingathome.org or any other instance:
//   NUXT_PUBLIC_API_URL=https://api3.foldingathome.org
const envLocal = fileURLToPath(new URL('./.env.local', import.meta.url))
if (existsSync(envLocal))
  for (const line of readFileSync(envLocal, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"\n]*)"?\s*$/)
    if (m) process.env[m[1]] = m[2]
  }

const apiUrl = process.env.NUXT_PUBLIC_API_URL || 'https://api.foldingathome.org'

// Build-time: rewrite legacy `/assets/<uuid>` references in static page
// bodies to the API's web rendition.  Done here (not in the committed HTML)
// so the API hostname stays config-driven.
const rewriteContentAssets = () => ({
  name: 'rewrite-content-asset-urls',
  enforce: 'pre' as const,
  load(this: { addWatchFile(id: string): void }, id: string) {
    const [file, query] = id.split('?')
    if (!query?.includes('raw') || !/[\\/]content[\\/]pages[\\/].*\.html$/.test(file))
      return
    this.addWatchFile(file) // else edits to content HTML don't hot-reload in dev
    const html = readFileSync(file, 'utf8')
      .replace(/\/assets\/([a-f0-9-]{36})/gi, (_m, uuid) => `${apiUrl}/asset/${uuid}/web`)
    return `export default ${JSON.stringify(html)}`
  },
})

export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  ssr: true,

  modules: ['@nuxt/image'],

  runtimeConfig: {
    public: {
      apiUrl,
      // Google Tag Manager. Empty = disabled (no scripts injected). Set per
      // deployment; the same id can be reused across *.foldingathome.org so
      // all subdomains report into one GA4 property.
      gtmId: process.env.NUXT_PUBLIC_GTM_ID || '',
      // Domain for the consent cookie. Set to `.foldingathome.org` in
      // production so one accept/reject choice is shared across subdomains.
      // Leave empty in dev (host-only cookie, works on localhost).
      consentCookieDomain: process.env.NUXT_PUBLIC_CONSENT_COOKIE_DOMAIN || '',
    },
  },

  // Hybrid rendering: filesystem-backed pages are prerendered at build
  // time; API-backed routes (news, RSS, sitemap, asset binaries) render
  // on demand. CloudFlare caches the dynamic responses downstream.
  routeRules: {
    '/news':           { prerender: false },
    '/news/**':        { prerender: false },
    '/news/rss.xml':   { prerender: false },
    '/sitemap.xml':    { prerender: false },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: false,
      routes: ['/'],
    },
  },

  css: ['~/assets/styles/global.styl'],

  image: { provider: 'ipx' },

  site: { url: 'https://foldingathome.org', name: 'Folding@home' },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Raleway:wght@400;700&display=swap',
        },
      ],
    },
  },


  vite: {
    plugins: [rewriteContentAssets()],
    css: {
      preprocessorOptions: {
        stylus: { additionalData: tokens + '\n' },
      },
    },
  },
})
