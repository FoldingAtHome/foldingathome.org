<template lang="pug">
.cookie-consent(v-if="visible" role="dialog" aria-label="Cookie consent")
  p.message
    | We use cookies for anonymous analytics to see how the site is used.
    |  See our #[a(href="/about/privacy") privacy policy].
  .actions
    button.reject(type="button" @click="choose(false)") Reject
    button.accept(type="button" @click="choose(true)") Accept
</template>

<script>
export default {
  name: 'CookieConsent',
  setup() {
    const { gtmId } = useRuntimeConfig().public
    const { choice, apply } = useConsent()
    return { gtmId, choice, apply }
  },
  data() {
    // No banner unless analytics is actually configured — otherwise we'd be
    // asking consent for nothing.
    return { visible: !!this.gtmId && this.choice == null }
  },
  methods: {
    choose(granted) {
      this.apply(granted)
      this.visible = false
    },
  },
}
</script>

<style lang="stylus" scoped>
.cookie-consent
  position fixed
  left 1rem
  right 1rem
  bottom 1rem
  z-index 1000
  max-width container-max
  margin 0 auto
  display flex
  flex-wrap wrap
  align-items center
  justify-content space-between
  gap 1rem
  padding 1rem 1.5rem
  background dark-bg
  color text-light
  border-radius 6px
  box-shadow 0 4px 20px rgba(0, 0, 0, 0.3)

  .message
    margin 0
    font-size 0.9rem
    flex 1 1 320px

  .message a
    color primary

  .actions
    display flex
    gap 0.75rem

  button
    font-family font-body
    font-weight 700
    font-size 0.9rem
    padding 0.5rem 1.25rem
    border-radius 4px
    border 0
    cursor pointer

  .reject
    background transparent
    color text-light
    border 1px solid text-light

  .accept
    background primary
    color text-light
</style>
