// Auto-generate a "Contents" list from a page body's h2/h3 headings.
//
// A body opts in by containing a `<nav data-toc></nav>` marker (see
// pages/[...slug].vue). renderWithToc() then:
//   1. gives every h2/h3 an id — keeping any explicit id (so cross-page
//      anchors like /guides/v8-5#managing-teams stay stable), slugifying the
//      heading text otherwise, so authors never hand-maintain ids or the list;
//   2. builds a nested Contents list (h3s nested under their h2) and drops it
//      in place of the marker.
// Bodies without the marker are returned untouched.

const slugify = (s: string): string =>
  s.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '')

const HEADING = /<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi
const textOf = (inner: string): string =>
  inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
const idOf = (attrs: string): string | undefined =>
  attrs.match(/\bid="([^"]+)"/)?.[1]

// Ensure every heading has an id, without disturbing existing ones.
const injectIds = (html: string): string =>
  html.replace(HEADING, (m, lvl, attrs, inner) => {
    if (idOf(attrs)) return m
    const id = slugify(textOf(inner))
    return id ? `<h${lvl}${attrs} id="${id}">${inner}</h${lvl}>` : m
  })

const buildToc = (html: string): string => {
  const parts = ['<h2 id="contents">Contents</h2>', '<ul>']
  let inSub = false
  let count = 0
  let m: RegExpExecArray | null
  HEADING.lastIndex = 0
  while ((m = HEADING.exec(html))) {
    const level = +m[1]
    const id = idOf(m[2])!
    if (id === 'contents') continue // skip the ToC heading itself
    const link = `<a href="#${id}">${textOf(m[3])}</a>`
    if (level === 3) {
      if (!inSub) { parts.push('<ul>'); inSub = true }
      parts.push(`<li>${link}</li>`)
    } else {
      if (inSub) { parts.push('</ul>'); inSub = false }
      if (count > 0) parts.push('</li>')
      parts.push(`<li>${link}`)
    }
    count++
  }
  if (!count) return ''
  if (inSub) parts.push('</ul>')
  parts.push('</li>', '</ul>')
  return parts.join('\n')
}

export const renderWithToc = (html: string): string => {
  if (!/\bdata-toc\b/.test(html)) return html
  const withIds = injectIds(html)
  return withIds.replace(
    /<nav\b[^>]*\bdata-toc\b[^>]*>\s*<\/nav>/i,
    () => buildToc(withIds),
  )
}
