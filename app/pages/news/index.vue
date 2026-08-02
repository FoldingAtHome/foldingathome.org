<script setup lang="ts">
import type { ArticleListItem } from '~/types/api'

const { data: articles } = await useAsyncData('news-list', () =>
  apiFetch<ArticleListItem[]>('/article?status=published&limit=200'))

const formatDate = (iso?: string | null) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

useHead({
  link: [{ rel: 'alternate', type: 'application/rss+xml', title: 'Folding@home News', href: '/news/rss.xml' }],
})
</script>

<template lang="pug">
section.news
  .inner
    .head-row
      h1 News
      a.feed(href="/news/rss.xml" target="_blank" rel="alternate" type="application/rss+xml") RSS
    p.empty(v-if="!articles?.length") No articles yet.
    .articles(v-else)
      article.entry(v-for="a in articles" :key="a.id")
        header.head
          h2
            NuxtLink(:to="`/news/${a.slug}`") {{ a.title || a.slug }}
          .meta
            time(:datetime="a.published || a.created") {{ formatDate(a.published || a.created) }}
            span.author(v-if="a.author") &nbsp;by {{ a.author }}
        NuxtLink.thumb(v-if="a.hero" :to="`/news/${a.slug}`")
          img(:src="assetUrl(a.hero)" alt="")
        .summary
          p(v-if="a.excerpt") {{ a.excerpt }}
          NuxtLink.read-more(:to="`/news/${a.slug}`") Read more
</template>

<style lang="stylus" scoped>
.news
  background body-bg

.inner
  max-width 1100px
  margin 0 auto
  padding 3rem 1.5rem

  .head-row
    display flex
    align-items baseline
    justify-content space-between
    margin 0 0 1.5rem
    gap 1rem

  > .head-row h1
    font-size 2.25rem
    text-transform uppercase
    margin 0

  .feed
    font-family font-headings
    font-weight 700
    font-size 0.85rem
    text-transform uppercase
    letter-spacing 0.05em
    color primary
    text-decoration none

  .feed:hover
    text-decoration underline

.articles
  display grid
  grid-template-columns repeat(2, 1fr)
  gap 1.5rem

.entry
  background #fff
  border 1px solid box-bg
  padding 1.25rem
  display flex
  flex-direction column

.head
  h2
    margin 0 0 0.4rem
    font-size 1.15rem
    line-height 1.3

  h2 a
    color text-color
    text-decoration none

  h2 a:hover
    color primary

  .meta
    font-size 0.8rem
    opacity 0.75
    margin-bottom 0.75rem

  .meta time
    font-family font-headings
    font-weight 700
    text-transform uppercase
    letter-spacing 0.05em

  .meta .author
    font-style italic

.thumb
  display block
  margin 0 0 0.75rem

  img
    display block
    width 100%
    max-width 260px
    max-height 200px
    height auto

.summary p
  margin 0 0 0.75rem
  line-height 1.5
  font-size 0.9rem

.read-more
  align-self flex-start
  padding 0.45rem 1rem
  background primary
  color text-light
  font-family font-headings
  font-weight 700
  font-size 0.8rem
  text-transform uppercase
  letter-spacing 0.05em
  text-decoration none

.read-more:hover
  background secondary
  text-decoration none
  color text-light

.empty
  opacity 0.7

@media (max-width: 720px)
  .articles
    grid-template-columns 1fr
</style>
