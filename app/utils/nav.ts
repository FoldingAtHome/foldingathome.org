// Top-nav definition. Single source of truth for both:
//   - the header dropdowns (rendered by SiteHeader.vue), and
//   - the per-section sidebar order (consumed by sections.ts).
// When a section has dropdown children here, its sidebar will follow this
// order. Adding an item once propagates to both places.

export type NavItem = { label: string; href: string; external?: boolean }
export type NavSection = {
  label: string
  href: string
  children?: NavItem[]
  /**
   * True when the section's own URL just renders one of its children's
   * content (e.g. /science shows the Diseases page). The sidebar omits the
   * section-root entry in that case so the same page isn't listed twice.
   */
  alias?: boolean
}

export const TOP_NAV: NavSection[] = [
  { label: 'Download', href: '/download' },

  { label: 'Science', href: '/science', alias: true, children: [
    { label: 'Diseases',          href: '/diseases' },
    { label: 'Protein Folding',   href: '/science/folding' },
    { label: 'Data',              href: '/data' },
    { label: 'Papers & Results',  href: '/science/papers' },
    { label: 'Project Timeline',  href: '/science/timeline' },
  ] },

  { label: 'Support', href: '/support', children: [
    { label: 'User Guides', href: '/guides' },
    { label: 'FAQ',         href: '/faq' },
    { label: 'Forum',       href: 'http://foldingforum.org', external: true },
    { label: 'Discord',     href: 'https://discord.com/invite/foldingathome', external: true },
  ] },

  { label: 'Donate', href: '/donate', children: [
    { label: 'USD via Folding@home Foundation',    href: 'https://www.every.org/foldinghome-foundation', external: true },
    { label: 'Crypto via Folding@home Foundation', href: 'http://every.org/foldinghome-foundation/donate/crypto', external: true },
    { label: 'DAF via Folding@home Foundation',    href: 'https://www.dafdirect.org/DAFDirect/daflink?_dafdirect_settings=MjY0MjQ1MDQzXzIxMTFfZDdiZj', external: true },
    { label: 'Merchandise Store',                  href: 'https://foldingathome.creator-spring.com/', external: true },
    { label: 'Funding FAQ',                        href: '/donate/funding-faq' },
  ] },

  { label: 'Statistics', href: '/statistics', children: [
    { label: 'Donor',   href: 'https://stats.foldingathome.org/donor',  external: true },
    { label: 'Team',    href: 'https://stats.foldingathome.org/team',   external: true },
    { label: 'Client',  href: 'https://stats.foldingathome.org/os',      external: true },
    { label: 'Project', href: 'https://stats.foldingathome.org/project', external: true },
  ] },
  { label: 'News',       href: '/news' },

  { label: 'About', href: '/about', children: [
    { label: 'Consortium',    href: '/about/consortium' },
    { label: 'Greg Bowman',     href: '/about/gregory-bowman' },
    { label: 'Joseph Coffland', href: '/about/joseph-coffland' },
    { label: 'Volunteers',      href: '/about/volunteers' },
    { label: 'Open source',   href: '/about/open-source' },
    { label: 'Privacy',       href: '/about/privacy' },
    { label: 'Contact',       href: '/about/contact' },
  ] },
]
