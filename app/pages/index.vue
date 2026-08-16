<script setup lang="ts">
import type { ArticleListItem } from '~/types/api'

// When true, the headline panel slides off-screen left and a small reveal
// tab appears so the visitor can bring it back. Lets people see the
// protein viewer unobstructed.
const heroCollapsed = ref(false)

// The WebGL protein viewer is heavy enough that several users reported
// page lag and battery drain on first load. Default to a static poster
// image with a play button; only mount LazyHeroProteinViewer (and pull
// its three.js bundle) when the user opts in.
const heroPlaying = ref(false)

const { data: stats } = await useFahStats(24)
const { data: articles } = await useAsyncData('home-latest', () =>
  apiFetch<ArticleListItem[]>('/article?status=published&limit=3'))

// Brand-friendly number formatting for the hero stats strip. We want
// punchy, not pedantic: 3M+, 231K, 16,000.
const fmtBig = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000)     return Math.round(n / 1_000) + 'K'
  return String(n)
}
const fmtInt = (n: number) => Math.round(n).toLocaleString('en-US')
</script>

<template lang="pug">
//- ---------- HERO ----------
//- Default state: static poster image + play button. Clicking play
//- swaps to LazyHeroProteinViewer — the component (and three.js) is
//- only fetched then, avoiding load on phones / weak hardware / users
//- who never engage with it. The viewer shows its own "Loading…" until
//- the topology JSON arrives.
section.hero
  .hero-viewer.hero-viewer-fallback
  template(v-if="!heroPlaying")
    .hero-poster
      img(
        src="/images/landing/protein-hero-1440.jpg"
        srcset="/images/landing/protein-hero-768.jpg 768w, /images/landing/protein-hero-1440.jpg 1440w, /images/landing/protein-hero-2502.jpg 2502w"
        sizes="100vw"
        alt="Space-filling rendering of a folded protein"
        loading="eager"
      )
    button.hero-play(
      @click="heroPlaying = heroCollapsed = true"
      type="button"
      aria-label="Open the interactive 3D protein viewer"
      title="Open the interactive 3D protein viewer"
    )
      svg(viewBox="0 0 32 32" aria-hidden="true")
        circle(cx="16" cy="16" r="13" fill="none" stroke="currentColor" stroke-width="0.5")
        ellipse(cx="16" cy="16" rx="13" ry="6.5" fill="none" stroke="currentColor" stroke-width="0.7" opacity="0.55")
        ellipse(cx="16" cy="16" rx="6.5" ry="13" fill="none" stroke="currentColor" stroke-width="0.7" opacity="0.55")
        text(x="16" y="16" text-anchor="middle" dominant-baseline="middle" font-size="9" font-weight="700" fill="currentColor") 3D
  LazyHeroProteinViewer.hero-viewer(v-else)
  .hero-overlay
    .hero-inner(:class="{ collapsed: heroCollapsed }")
      button.hero-close(
        type="button"
        aria-label="Hide headline"
        @click="heroCollapsed = true"
      ) ×
      h1.hero-title You have the power
        br
        | to help #[span.accent cure disease.]
      p.hero-sub Folding@home turns your computer's idle power into a global supercomputer for biomedical research. Free. Safe. Easy.
      .hero-cta
        NuxtLink.btn.btn-primary(to="/download") Start folding
        a.btn.btn-ghost(href="#how") How it works
  button.hero-reopen(
    v-if="heroCollapsed"
    type="button"
    aria-label="Show headline"
    @click="heroCollapsed = false"
  ) ›

//- ---------- LIVE STATS STRIP ----------
section.stats
  .inner
    .stat
      .num {{ fmtBig(stats?.contributors || 0) }}+
      .label Lifetime contributors
    .stat
      .num {{ fmtBig(stats?.teams || 0) }}
      .label Teams folding together
    .stat
      .num {{ fmtInt(stats?.computeDays || 0) }}
      .label Device-days of compute donated in the last 24h

//- ---------- WHY IT MATTERS ----------
section.why
  .inner
    h2.section-title We're fighting real diseases.
    .cards
      //- Card thumbnails load the API's scaled web rendition; plain <img>
      //- is enough for these small thumbnails.
      NuxtLink.card(to="/diseases/cancer")
        .thumb: img(:src="assetUrl('15df6a3f-91dd-4207-9349-9af8a6c893d0')" alt="" loading="lazy" width="800" height="600")
        h3 Cancer
        p Our work on BRCA1 revealed new therapeutic strategies to combat breast cancer.
      NuxtLink.card(to="/diseases/infectious-diseases/covid-19")
        .thumb: img(:src="assetUrl('1e444ae3-51de-435a-95e7-b8bef1bb829c')" alt="" loading="lazy" width="800" height="600")
        h3 COVID-19
        p During COVID-19 we hit 2.43 exaflops, the first computing system in history to cross that threshold, and helped identify a potential new antiviral in animal testing.
      NuxtLink.card(to="/diseases/neurological-diseases/alzheimers-disease")
        .thumb: img(:src="assetUrl('26645c95-0c27-49d5-a742-18334f098694')" alt="" loading="lazy" width="800" height="600")
        h3 Alzheimer's
        p Our work on ApoE is uncovering the mechanism of the most common cause of dementia.
      NuxtLink.card(to="/diseases/infectious-diseases/ebola-virus")
        .thumb: img(:src="assetUrl('d5f1961c-5b7e-454f-91d9-9bfff5c89551')" alt="" loading="lazy" width="800" height="600")
        h3 Ebola
        p We've found new ways to thwart Ebola by identifying transient "cryptic-pockets" in the virus protein that other methods had missed.

//- ---------- HOW IT WORKS ----------
section.how(id="how")
  .inner
    h2.section-title It takes about a minute.
    .steps
      .step
        .step-num 01
        h3 Download
        p Pick your platform — Windows, macOS, or Linux. One click.
      .step
        .step-num 02
        h3 Install
        p Run the installer. No account required to start. Open source.
      .step
        .step-num 03
        h3 Fold
        p Your computer downloads a small piece of a real research simulation, runs it in the background, and returns the result. You earn points. Repeat.
    .how-cta
      NuxtLink.btn.btn-primary(to="/download") Get the installer

//- ---------- THE SCIENCE ----------
section.science
  .inner
    h2.section-title Real science. Real progress.
    .milestones
      .ms
        .ms-num 2.43
        .ms-unit
          NuxtLink(to="/news/citizen-scientists-create-an-exascale-computer-to-combat-covid-19") exaflops
        .ms-text World's first exaflop computing system, April 2020 — bigger than the top 500 supercomputers combined.
      .ms
        .ms-num 500+
        .ms-unit
          NuxtLink(to="/science/papers") papers
        .ms-text Peer-reviewed publications produced by Folding@home since launch in October 2000.
      .ms
        .ms-num 25+
        .ms-unit
          NuxtLink(to="/science/timeline") years
        .ms-text One of the longest-running distributed computing projects on Earth — and still going.
    p.science-foot Led by Dr. #[NuxtLink(to="/about/gregory-bowman") Greg Bowman] and the #[NuxtLink(to="/about/consortium") Folding@home Consortium] — a network of academic labs across the globe.

//- ---------- FOR THE TECH CROWD ----------
section.tech
  .inner
    .copy
      h2.section-title Already a power user?
      p
        | Bring your GPU. #[a(href="https://stats.foldingathome.org/teams" rel="noopener") Join a team] or #[a(href="https://app.foldingathome.org/" rel="noopener") start one]. Climb the #[a(href="https://stats.foldingathome.org/donor" rel="noopener") leaderboard]. Folding@home has supported competitive teams since 2000, with full #[NuxtLink(to="/statistics") stats], project transparency, and an #[a(href="https://github.com/FoldingAtHome" rel="noopener") open client].
      ul.links
        li
          NuxtLink(to="/statistics") Live stats
        li
          a(href="https://discord.com/invite/foldingathome" rel="noopener") Discord
        li
          a(href="https://foldingforum.org" rel="noopener") Forum
        li
          a(href="https://github.com/FoldingAtHome" rel="noopener") GitHub
        li(v-if="articles?.length")
          NuxtLink(to="/news") Latest research updates

//- ---------- FINAL CTA ----------
//- Single link to /download (where the picker, guides, and support
//- channels all live), instead of duplicating the picker here.
section.final-cta
  .inner
    h2.section-title Your computer can do this today.
    p.final-sub Free. Open source. Backed by 25 years of peer-reviewed research.
    NuxtLink.btn.btn-light(to="/download") Get the installer
</template>

<style lang="stylus" scoped>
:global(html), :global(body)
  overflow-x hidden

section
  width 100%
  overflow hidden

.inner
  width 100%
  max-width container-max
  margin 0 auto
  padding 0 2rem
  box-sizing border-box

.section-title
  font-family font-headings
  font-weight 700
  text-transform uppercase
  font-size clamp(1.75rem, 3.5vw, 2.75rem)
  line-height 1.05
  margin 0 0 1.5rem
  text-align center

.btn
  display inline-block
  padding 0.9rem 2rem
  font-family font-headings
  font-weight 700
  text-transform uppercase
  letter-spacing 0.05em
  font-size 1rem
  text-decoration none
  border 0
  border-radius 2px
  cursor pointer
  transition background 0.15s, color 0.15s

.btn:hover
  text-decoration none

.btn-primary
  background primary
  color text-light

.btn-primary:hover
  background text-light
  color primary

.btn-ghost
  background rgba(0, 0, 0, 0.3)
  backdrop-filter blur(10px)
  -webkit-backdrop-filter blur(10px)
  color text-light
  border 2px solid rgba(255, 255, 255, 0.65)
  padding 0.78rem 1.88rem

// Inverse of .btn-primary — used on orange backgrounds (.final-cta).
.btn-light
  background text-light
  color primary

.btn-light:hover
  background rgba(255, 255, 255, 0.88)
  color primary

.btn-ghost:hover
  background text-light
  color dark-bg
  backdrop-filter none
  -webkit-backdrop-filter none

//- ---------- HERO ----------
.hero
  position relative
  height 92vh
  min-height 600px
  background dark-bg
  color text-light

  .hero-viewer, .hero-viewer-fallback
    position absolute
    inset 0
    z-index 0

  .hero-viewer-fallback
    background radial-gradient(ellipse at center, lighten(dark-bg, 10%) 0%, dark-bg 70%)

  // Poster image stacked above the fallback gradient but below the
  // headline overlay. Replaced by the WebGL canvas when the user
  // clicks play.
  .hero-poster
    position absolute
    inset 0
    z-index 0
    overflow hidden

  .hero-poster img
    width 100%
    height 100%
    object-fit cover
    object-position center
    display block
    opacity 0.85

  .hero-play
    position absolute
    top 1.25rem
    right 1.25rem
    z-index 2
    display grid
    place-items center
    background transparent
    border 0
    padding 0
    color text-light
    cursor pointer
    pointer-events auto

    svg
      transition transform 0.15s ease-in-out
      width 64px
      height 64px

      &:hover
        transform scale(1.1)

  .hero-overlay
    position relative
    z-index 1
    height 100%
    display flex
    align-items center
    // Let mouse pass through to the protein canvas everywhere except on the
    // actual hero content (re-enabled on .hero-inner below). Without this
    // the overlay would intercept drag-to-rotate.
    pointer-events none
    user-select none

  // Frosted dark panel sized to the headline + buttons (with vertical
  // padding so the text breathes). Backdrop blur softens whatever moves
  // behind it without fully obscuring the protein.
  .hero-inner
    position relative
    max-width 60rem
    padding 2.25rem 2.5rem
    pointer-events auto
    background linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)
    backdrop-filter blur(2px)
    -webkit-backdrop-filter blur(2px)
    border-radius 4px
    transition transform 350ms ease, opacity 280ms ease

  .hero-inner.collapsed
    transform translateX(-110%)
    opacity 0
    pointer-events none

  .hero-close
    position absolute
    top 0.5rem
    right 0.65rem
    width 32px
    height 32px
    display grid
    place-items center
    background transparent
    border 0
    color text-light
    font-size 1.5rem
    line-height 1
    cursor pointer
    opacity 0.65
    transition opacity 0.15s

  .hero-close:hover
    opacity 1

  .hero-reopen
    position absolute
    top 50%
    left 0
    transform translateY(-50%)
    z-index 2
    width 36px
    height 64px
    display grid
    place-items center
    background rgba(0, 0, 0, 0.55)
    backdrop-filter blur(5px)
    -webkit-backdrop-filter blur(5px)
    border 0
    color text-light
    font-size 1.6rem
    line-height 1
    cursor pointer
    border-radius 0 4px 4px 0
    transition background 0.15s

  .hero-reopen:hover
    background rgba(0, 0, 0, 0.75)

  .hero-title
    font-family font-headings
    font-weight 700
    text-transform uppercase
    font-size clamp(2.25rem, 6vw, 4.75rem)
    line-height 0.98
    margin 0 0 1.25rem

  .hero-title .accent
    color primary

  .hero-sub
    font-size clamp(1.05rem, 1.5vw, 1.35rem)
    line-height 1.45
    margin 0 0 2rem
    max-width 38rem
    // Prevent the trailing "Easy." from being orphaned on its own line
    // at large widths. `pretty` keeps earlier lines as-is and just avoids
    // the last-line widow.
    text-wrap pretty

  .hero-cta
    display flex
    gap 1rem
    flex-wrap wrap

//- ---------- STATS STRIP ----------
.stats
  background primary
  color text-light

  .inner
    display grid
    grid-template-columns repeat(3, 1fr)
    gap 1rem
    padding 2.5rem 2rem
    text-align center

  .num
    font-family font-headings
    font-weight 700
    font-size clamp(2rem, 4.5vw, 3.5rem)
    line-height 1
    margin-bottom 0.35rem

  .label
    font-size 0.95rem
    line-height 1.3
    opacity 0.92
    text-transform uppercase
    letter-spacing 0.05em

//- ---------- WHY ----------
.why
  background body-bg
  padding 4.5rem 0

  .cards
    display grid
    grid-template-columns repeat(4, 1fr)
    gap 1.5rem

  .card
    display block
    background #fff
    border-top 4px solid primary
    color inherit
    text-decoration none
    transition transform 0.15s, box-shadow 0.15s

  .card:hover
    transform translateY(-2px)
    box-shadow 0 6px 18px rgba(0, 0, 0, 0.08)

  .card:hover h3
    text-decoration underline

  .card .thumb
    width 100%
    aspect-ratio 4 / 3
    overflow hidden
    background body-bg

  .card .thumb img
    width 100%
    height 100%
    object-fit cover
    display block

  .card h3
    font-family font-headings
    text-transform uppercase
    margin 1.25rem 1.5rem 0.5rem
    font-size 1.25rem
    color primary

  .card p
    margin 0 1.5rem 1.5rem
    line-height 1.5
    font-size 0.97rem

  .card p a
    color primary
    text-decoration underline

//- ---------- HOW ----------
.how
  background #fff
  padding 5rem 0

  .steps
    display grid
    grid-template-columns repeat(3, 1fr)
    gap 2.5rem
    margin-bottom 2.5rem

  .step
    position relative
    padding-top 0.5rem
    text-align center

  .step-num
    font-family font-headings
    font-weight 700
    font-size 4.5rem
    line-height 1
    color primary
    opacity 0.85
    margin-bottom 0.5rem

  .step h3
    font-family font-headings
    text-transform uppercase
    margin 0 0 0.5rem
    font-size 1.5rem

  .step p
    margin 0
    line-height 1.55
    font-size 1.05rem

  .how-cta
    text-align center

//- ---------- SCIENCE ----------
.science
  background dark-bg
  color text-light
  padding 5rem 0

  .milestones
    display grid
    grid-template-columns repeat(3, 1fr)
    gap 2rem
    margin 2rem 0

  .ms
    text-align center
    padding 1rem

  .ms-num
    font-family font-headings
    font-weight 700
    font-size clamp(2.5rem, 5vw, 4rem)
    color primary
    line-height 1

  .ms-unit
    font-family font-headings
    text-transform uppercase
    letter-spacing 0.08em
    font-size 0.9rem
    color text-light
    opacity 0.7
    margin 0.25rem 0 0.75rem

  // Inherit the muted label color rather than going brand-orange (which
  // would compete with the .ms-num above). Underline-on-hover from the
  // global a:hover rule still signals clickability.
  .ms-unit a
    color inherit

  .ms-text
    font-size 0.95rem
    line-height 1.5
    opacity 0.9

  .science-foot
    text-align center
    margin-top 2rem
    opacity 0.85

  .science-foot a
    color primary

//- ---------- TECH ----------
.tech
  background body-bg
  padding 4rem 0

  .copy
    max-width 60rem
    margin 0 auto
    text-align center

  .links
    list-style none
    padding 0
    margin 1rem 0 0
    display flex
    flex-wrap wrap
    justify-content center
    gap 1.5rem
    font-family font-headings
    text-transform uppercase
    font-size 0.95rem
    letter-spacing 0.05em

  .links a
    color primary

//- ---------- FINAL CTA ----------
.final-cta
  background primary
  padding 5rem 0
  text-align center

  // No `color` here — the picker inside needs its own dark text. Title
  // and sub get text-light explicitly.
  .section-title
    color text-light

  .final-sub
    font-size 1.15rem
    margin 0 0 2rem
    color text-light
    opacity 0.95

//- ---------- RESPONSIVE ----------
@media (max-width: 900px)
  // .hero-inner is the panel; its margin pushes .hero-overlay (and the
  // surrounding hero) tall enough to give the panel breathing room without
  // making it edge-to-edge.
  .hero
    height auto
    min-height 0
    padding 0

  .hero .hero-inner
    margin 4rem 1rem

  .stats .inner
    grid-template-columns 1fr
    gap 1.75rem

  .how .steps
    grid-template-columns 1fr
    gap 1.75rem

  .science .milestones
    grid-template-columns 1fr
    gap 1.5rem

// Disease cards drop to 2x2 below 1100px so each card has room to breathe
// (4-up at 1024 was visually cramped — ~250px per card couldn't hold the
// image plus the heading and copy).
@media (max-width: 1100px)
  .why .cards
    grid-template-columns repeat(2, 1fr)

@media (max-width: 560px)
  .why .cards
    grid-template-columns 1fr
</style>
