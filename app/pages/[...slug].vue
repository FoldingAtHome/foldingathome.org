<script setup lang="ts">
import { SECTION_OVERRIDES, groupsFromOverride, type Group } from '~/utils/sections'
import { renderWithToc } from '~/utils/toc'

// Page bodies + metadata loaded from content/pages/ at build time. Each
// page is its own dir with index.html (body) and meta.json (title, dates).
// import.meta.glob keys are repo-root-relative.
const bodies = import.meta.glob('../../content/pages/**/index.html', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>
const metas = import.meta.glob('../../content/pages/**/meta.json', {
  import: 'default', eager: true,
}) as Record<string, { title: string; created?: string; updated?: string }>

const route = useRoute()
// Drop empty trailing segments so `/science/` doesn't lookup `science/`.
const segments = (Array.isArray(route.params.slug)
  ? route.params.slug
  : [String(route.params.slug)]).filter(Boolean)
const slug = segments.join('/')
const sectionRoot = segments[0] || ''

// Aliases — section roots without their own content render a child's page.
const PAGE_ALIASES: Record<string, string> = { science: 'diseases' }
const fetchSlug = PAGE_ALIASES[slug] ?? slug

const body = bodies[`../../content/pages/${fetchSlug}/index.html`]
const meta = metas[`../../content/pages/${fetchSlug}/meta.json`]
if (!body || !meta)
  throw createError({ statusCode: 404, statusMessage: 'Not found' })

// Give headings ids and expand any `<nav data-toc></nav>` marker into a
// Contents list. Bodies without the marker pass through unchanged.
const rendered = renderWithToc(body)

const sidebarGroups = computed<Group[]>(() => {
  const override = SECTION_OVERRIDES[sectionRoot]
  return override?.length ? groupsFromOverride(override) : []
})

const showSidebar = computed(() => sidebarGroups.value.some(g => g.items.length > 0))

useHead({ title: meta.title })
</script>

<template lang="pug">
.layout(:class="{ 'has-sidebar': showSidebar }")
  SectionSidebar(v-if="showSidebar" :groups="sidebarGroups" :current-path="slug")
  article.page
    header
      h1 {{ meta.title || slug }}
    .body(v-html="rendered")
</template>

<style lang="stylus" scoped>
.layout
  max-width container-max
  margin 0 auto
  padding 3rem 1.5rem

.layout.has-sidebar
  display grid
  grid-template-columns 240px 1fr
  gap 3rem

.page
  min-width 0

  .body
    line-height 1.7

  .body :deep(img), .body :deep(video)
    max-width 100%
    height auto
    border 1px solid #888
    background #fff

  .body :deep(h2)
    margin-top 2rem
    margin-bottom 0.75rem

  .body :deep(a)
    color primary

  // Image figures with captions (converted from WP [caption] shortcodes).
  .body :deep(figure)
    margin 1.5rem 0
    text-align center

  .body :deep(figure.alignleft)
    float left
    margin 0.5rem 1.5rem 1rem 0
    max-width 50%

  .body :deep(figure.alignright)
    float right
    margin 0.5rem 0 1rem 1.5rem
    max-width 50%

  .body :deep(figure.aligncenter)
    margin-left auto
    margin-right auto

  .body :deep(figure.size-large)
    max-width 680px

  .body :deep(figure img)
    display block
    max-width 100%
    height auto
    margin 0 auto

  // Buttons converted from [vc_btn] shortcodes
  .body :deep(.btn)
    display inline-block
    margin 0.75rem 0.5rem 0.75rem 0
    padding 0.6rem 1.25rem
    background primary
    color text-light
    font-family font-headings
    font-weight 700
    font-size 0.9rem
    text-transform uppercase
    letter-spacing 0.05em
    text-decoration none

  .body :deep(.btn:hover)
    background secondary
    color text-light
    text-decoration none

  // ---- Papers & Results list. One <section> per year, descending.
  .body :deep(.papers-list)
    margin 2rem 0

  .body :deep(.papers-year)
    margin 0 0 2rem
    padding 1rem 1.25rem 1.25rem
    background box-bg
    border-left 4px solid primary
    border-radius 2px

  .body :deep(.papers-year__title)
    font-family font-headings
    font-weight 700
    font-size 1.5rem
    margin 0 0 0.75rem
    padding-bottom 0.4rem
    border-bottom 1px solid rgba(0, 0, 0, 0.08)

  .body :deep(ul.papers)
    list-style none
    padding 0
    margin 0

  .body :deep(ul.papers li)
    display flex
    align-items baseline
    gap 1rem
    padding 0.4rem 0.5rem
    line-height 1.45

  .body :deep(ul.papers li:nth-child(even))
    background rgba(0, 0, 0, 0.025)
    border-radius 2px

  .body :deep(.papers__title)
    flex 1 1 auto
    min-width 0
    overflow hidden
    text-overflow ellipsis
    white-space nowrap

  .body :deep(.papers__lab)
    flex 0 0 auto
    min-width 8rem
    color rgba(0, 0, 0, 0.55)
    font-size 0.85rem
    white-space nowrap

  .body :deep(.papers-header)
    display flex
    align-items baseline
    gap 1rem
    padding 0.25rem 0.5rem
    margin-bottom 0.25rem
    border-bottom 1px solid rgba(0, 0, 0, 0.12)
    font-size 0.75rem
    text-transform uppercase
    letter-spacing 0.06em
    color rgba(0, 0, 0, 0.55)

  .body :deep(.papers-header__title)
    flex 1 1 auto
    min-width 0

  .body :deep(.papers-header__lab)
    flex 0 0 auto
    min-width 8rem

  .body :deep(ul.papers a.papers__title)
    color primary
    text-decoration none

  .body :deep(ul.papers a.papers__title:hover)
    text-decoration underline

  // Card-component overrides for prose inside cards.
  .body :deep(.card)
    color inherit
  .body :deep(.card img)
    border 0
  .body :deep(.card-thumb img)
    width 100%
    height 100%
    object-fit cover
  .body :deep(.card a),
  .body :deep(a.card)
    color inherit
  .body :deep(.card a:hover),
  .body :deep(a.card:hover)
    text-decoration none

  // ---- Project Timeline: two-column vertical timeline.
  .body :deep(ul.timeline)
    list-style none
    padding 0
    margin 2.5rem 0
    position relative
    width 100%
    overflow hidden

  .body :deep(ul.timeline::before)
    content ''
    position absolute
    top 0
    bottom 0
    left 50%
    margin-left -1px
    width 2px
    background rgba(151, 151, 151, 0.5)
    z-index 0

  .body :deep(.timeline__item)
    position relative
    width 50%
    float left
    clear left
    margin-bottom 50px
    box-sizing border-box

  .body :deep(.timeline__item-right)
    float right
    clear right
    margin-top 50px
    margin-bottom 0

  .body :deep(.timeline__content)
    position relative
    width 90%
    background box-bg
    padding 3.25rem 1.5rem 1.5rem
    box-sizing border-box
    filter drop-shadow(0 2px 4px rgba(0, 0, 0, 0.18))

  .body :deep(.timeline__item-right .timeline__content)
    margin-left 10%

  .body :deep(.timeline__item-left .timeline__content)
    margin-left 0

  .body :deep(.timeline__item-right .timeline__content::before)
    content ''
    position absolute
    top 36px
    left -21px
    width 0
    height 0
    border-top 22px solid transparent
    border-bottom 22px solid transparent
    border-right 22px solid box-bg

  .body :deep(.timeline__item-left .timeline__content::before)
    content ''
    position absolute
    top 36px
    right -21px
    width 0
    height 0
    border-top 22px solid transparent
    border-bottom 22px solid transparent
    border-left 22px solid box-bg

  .body :deep(.timeline__badge)
    position absolute
    top 50px
    width 22px
    height 22px
    border-radius 50%
    background #fff
    border 5px solid primary
    box-sizing border-box
    z-index 2

  .body :deep(.timeline__item-left .timeline__badge)
    right -11px

  .body :deep(.timeline__item-right .timeline__badge)
    left -11px

  .body :deep(.timeline__updated)
    position absolute
    top 0.75rem
    right 1rem
    font-family font-headings
    font-weight 700
    font-size 1rem
    color primary
    letter-spacing 0.04em

  .body :deep(.timeline__image)
    display block
    width 100%
    height auto
    margin 0 0 0.75rem
    border-radius 2px

  .body :deep(.timeline__title)
    margin 0 0 0.5rem
    font-size 1.15rem
    line-height 1.3

  .body :deep(.timeline__title a)
    color primary
    text-decoration none

  .body :deep(.timeline__title a:hover)
    text-decoration underline

  .body :deep(.timeline__summary)
    margin 0
    font-size 0.95rem
    line-height 1.5

  .body :deep(.timeline__readmore)
    display inline-block
    margin-top 0.5rem
    font-weight 700
    color primary
    text-decoration none

  .body :deep(.timeline__readmore:hover)
    text-decoration underline

  @media (max-width: 720px)
    .body :deep(ul.timeline::before)
      left 1rem
      margin-left 0

    .body :deep(.timeline__item),
    .body :deep(.timeline__item-left),
    .body :deep(.timeline__item-right)
      width 100%
      float none
      clear both
      margin-left 0
      margin-top 0
      margin-bottom 2rem
      padding 0

    .body :deep(.timeline__item-left .timeline__content),
    .body :deep(.timeline__item-right .timeline__content)
      width auto
      margin-left 2.5rem

    .body :deep(.timeline__item-left .timeline__content::before),
    .body :deep(.timeline__item-right .timeline__content::before)
      top 28px
      right auto
      left -21px
      border-left 0
      border-right 22px solid box-bg

    .body :deep(.timeline__item-left .timeline__badge),
    .body :deep(.timeline__item-right .timeline__badge)
      left 5px
      right auto

@media (max-width: 720px)
  .layout.has-sidebar
    grid-template-columns 1fr
    gap 1.5rem
</style>
