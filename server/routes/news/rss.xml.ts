// RSS 2.0 feed for /news/.

import type { Article } from '~/types/api'

const xmlEscape = (s: string) =>
  s.replace(/&/g, '&amp;')
   .replace(/</g, '&lt;')
   .replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;')
   .replace(/'/g, '&apos;')

const stripHtml = (s: string) =>
  s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

export default defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig()
  const site = 'https://foldingathome.org'

  const articles = await $fetch<Article[]>(
    `${cfg.public.apiUrl}/article?status=published&limit=50`,
  )

  const items = articles.map(a => {
    const url = `${site}/news/${a.slug}`
    const date = a.published || a.created || new Date().toISOString()
    const title = (a.title || a.slug).trim()
    const description = (a.excerpt?.trim()) || stripHtml(a.body || '').slice(0, 500)
    const author = a.author || ''
    return `    <item>
      <title>${xmlEscape(title)}</title>
      <link>${xmlEscape(url)}</link>
      <guid isPermaLink="true">${xmlEscape(url)}</guid>
      <pubDate>${new Date(date).toUTCString()}</pubDate>
      ${author ? `<dc:creator>${xmlEscape(author)}</dc:creator>` : ''}
      <description>${xmlEscape(description)}</description>
    </item>`
  }).join('\n')

  const updated = articles[0]
    ? new Date(articles[0].published || articles[0].created || Date.now()).toUTCString()
    : new Date().toUTCString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Folding@home — News</title>
    <link>${site}/news</link>
    <description>News and updates from the Folding@home project.</description>
    <language>en-US</language>
    <lastBuildDate>${updated}</lastBuildDate>
    <atom:link href="${site}/news/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`

  setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
  return xml
})
