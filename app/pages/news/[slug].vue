<script setup lang="ts">
import type { Article } from '~/types/api'

const route = useRoute()
const slug = String(route.params.slug)

const { data: article } = await useAsyncData(`news-${slug}`, () =>
  apiFetch<Article>(`/article/${encodeURIComponent(slug)}`))

if (!article.value)
  throw createError({ statusCode: 404, statusMessage: 'Not found' })
</script>

<template lang="pug">
article.post(v-if="article")
  header
    h1 {{ article.title || article.slug }}
    time(:datetime="article.published || article.created") {{ new Date(article.published || article.created).toLocaleDateString() }}
    p.byline(v-if="article.author") by {{ article.author }}
  .body(v-if="article.body" v-html="article.body")
</template>

<style lang="stylus" scoped>
.post
  max-width 720px
  margin 0 auto
  padding 3rem 1.5rem

  time
    display block
    opacity 0.7
    font-size 0.875rem
    margin-bottom 0.25rem

  .byline
    margin 0 0 1rem
    font-style italic
    opacity 0.8

  .body
    line-height 1.7
</style>
