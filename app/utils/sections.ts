// Sidebar configuration for top-level sections whose related links aren't
// derivable from the CMS slug tree (external services, peer sections, or
// curated subsets).
//
// Where a section also has a top-nav dropdown (Science, Support, Donate,
// About), the sidebar derives from TOP_NAV so the two stay in sync — one
// edit in utils/nav.ts updates both. Sections without nav children
// (Statistics, Diseases, Data, Download) keep their hand-curated overrides.

import { TOP_NAV, type NavItem, type NavSection } from './nav'

export type Item = {
  to?: string
  href?: string
  label: string
  external?: boolean
  /** Optional nested children. Rendered recursively by SidebarItem.vue. */
  items?: Item[]
}
export type Group = { title?: string; items: Item[] }

const navItemToSidebar = (n: NavItem): Item =>
  n.external ? { href: n.href, label: n.label, external: true }
             : { to: n.href, label: n.label }

// Build a flat sidebar override from a top-nav section: section-root link
// first (unless the section is an alias for one of its children — in which
// case both would point at the same content), then the dropdown children
// in declared order.
const fromNav = (label: string): Item[] => {
  const section = TOP_NAV.find(s => s.label === label) as NavSection | undefined
  if (!section?.children) return []
  const items = section.children.map(navItemToSidebar)
  if (section.alias) return items
  return [{ to: section.href, label: section.label }, ...items]
}

// Disease-category sub-items, nested under the "Diseases" entry in the
// Science sidebar so users can drill into a specific disease without
// leaving the section.
const cancerItems: Item[] = [
  { to: '/diseases/cancer',                label: 'Cancer', items: [
    { to: '/diseases/cancer/breast-cancer',  label: 'Breast Cancer' },
    { to: '/diseases/cancer/epigenetics',    label: 'Epigenetics' },
    { to: '/diseases/cancer/kidney-cancer',  label: 'Kidney Cancer' },
    { to: '/diseases/cancer/p53',            label: 'p53' },
  ] },
]
const infectiousItems: Item[] = [
  { to: '/diseases/infectious-diseases', label: 'Infectious diseases', items: [
    { to: '/diseases/infectious-diseases/chagas-disease-african-trypanosomiasis', label: 'Chagas Disease' },
    { to: '/diseases/infectious-diseases/covid-19',                               label: 'COVID-19' },
    { to: '/diseases/infectious-diseases/dengue-fever',                           label: 'Dengue Fever' },
    { to: '/diseases/infectious-diseases/ebola-virus',                            label: 'Ebola Virus' },
    { to: '/diseases/infectious-diseases/hepatitis-c',                            label: 'Hepatitis C' },
    { to: '/diseases/infectious-diseases/zika-virus',                             label: 'Zika Virus' },
  ] },
]
const neurologicalItems: Item[] = [
  { to: '/diseases/neurological-diseases', label: 'Neurological diseases', items: [
    { to: '/diseases/neurological-diseases/alzheimers-disease',  label: 'Alzheimer’s Disease' },
    { to: '/diseases/neurological-diseases/huntingtons-disease', label: 'Huntington’s Disease' },
    { to: '/diseases/neurological-diseases/parkinsons-disease',  label: 'Parkinson’s Disease' },
  ] },
]

// Support sidebar — same nesting treatment as Science. User Guides expands
// to the available guide versions (newest first); FAQ expands to the
// individual FAQ topics. Forum + Discord are external siblings.
const supportGroups: Group[] = [
  { title: 'Support', items: [
    { to: '/support', label: 'Support' },
    { to: '/guides',  label: 'User Guides', items: [
      { to: '/guides/v8-5', label: 'v8.5 Client Guide' },
      { to: '/guides/v8-4', label: 'v8.4 Client Guide' },
      { to: '/guides/v8-3', label: 'v8.3 Client Guide' },
      { to: '/guides/v8-1', label: 'v8.1 Client Guide' },
    ] },
    { to: '/faq', label: 'FAQ', items: [
      { to: '/faq/how-it-works',    label: 'How it works' },
      { to: '/faq/getting-started', label: 'Getting started' },
      { to: '/faq/running',         label: 'Running Folding@home' },
      { to: '/faq/troubleshooting', label: 'Troubleshooting' },
      { to: '/faq/stats',           label: 'Points, stats & passkey' },
      { to: '/faq/rules',           label: 'Rules & safety' },
      { to: '/faq/donation',        label: 'Donations' },
    ] },
    { href: 'http://foldingforum.org',                  label: 'Forum',   external: true },
    { href: 'https://discord.com/invite/foldingathome', label: 'Discord', external: true },
  ] },
]

// Science sidebar: single group, five top-level entries matching the
// header dropdown. The Diseases entry nests the three disease categories,
// each of which nests the individual disease pages — three levels total.
const scienceGroups: Group[] = [
  { title: 'Science', items: [
    { to: '/diseases', label: 'Diseases', items: [
      ...cancerItems, ...infectiousItems, ...neurologicalItems,
    ] },
    { to: '/science/folding',     label: 'Protein Folding' },
    { to: '/data',                label: 'Data' },
    { to: '/science/papers',      label: 'Papers & Results' },
    { to: '/science/timeline',    label: 'Project Timeline' },
  ] },
]

const statisticsGroups: Group[] = [
  { title: 'Statistics', items: [
    { href: 'https://stats.foldingathome.org/donor',   label: 'Donor Statistics',   external: true },
    { href: 'https://stats.foldingathome.org/teams',   label: 'Team Statistics',    external: true },
    { href: 'https://stats.foldingathome.org/os',      label: 'Client Statistics',  external: true },
    { href: 'https://stats.foldingathome.org/project', label: 'Project Statistics', external: true },
  ] },
  { title: 'Links', items: [
    { href: 'https://apps.foldingathome.org/psummary.html',              label: 'Project Summary',                  external: true },
    { href: 'https://apps.foldingathome.org/serverstats',                label: 'Server Status',                    external: true },
    { href: 'https://apps.foldingathome.org/daily_user_summary.txt.bz2', label: 'Donor list (txt)',                 external: true },
    { href: 'https://apps.foldingathome.org/daily_team_summary.txt.bz2', label: 'Team list (txt)',                  external: true },
    { href: 'https://apps.foldingathome.org/psummary.json',              label: 'Project Summary (JSON)',           external: true },
  ] },
]

export const SECTION_OVERRIDES: Record<string, Item[] | Group[]> = {
  // Sections whose sidebar mirrors the top-nav dropdown 1:1.
  donate: fromNav('Donate'),
  about:  fromNav('About'),

  // Support is the umbrella for Guides and FAQ — single shared sidebar.
  // Download / Beta / Alpha live in the Support section too.
  support:  supportGroups,
  guides:   supportGroups,
  faq:      supportGroups,
  download: supportGroups,
  beta:     supportGroups,
  alpha:    supportGroups,

  // Science is the umbrella for Diseases and Data — single shared sidebar.
  science:  scienceGroups,
  diseases: scienceGroups,
  data:     scienceGroups,

  // Sections with bespoke groupings (no dropdown).
  statistics: statisticsGroups,
}

// Normalize an override (flat Item[] or Group[]) into Group[] form.
export const groupsFromOverride = (override: Item[] | Group[]): Group[] => {
  if (!override.length) return []
  if ((override[0] as Group).items) return override as Group[]
  const flat = override as Item[]
  return [{ title: flat[0]?.label, items: flat }]
}
