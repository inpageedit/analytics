<template lang="pug">
header.global-header.flex-center(
  :class='{ "not-at-top": notAtTop, "is-hide": isHide }'
)
  .item
    router-link.plain.global-site-logo(to='/', title='InPageEdit Analytics')
      img(:src='Logo', alt='InPageEdit Analytics')
      .desc Analytics

  .item
    router-link(to='/') Home
</template>

<script setup lang="ts">
import { defineComponent, defineProps, onMounted, ref } from 'vue'

import Logo from '../assets/logo/InPageEdit.png'

// const components = defineComponent()
// const props = defineProps()
const notAtTop = ref(document.documentElement.scrollTop > 50)
const isHide = ref(false)

onMounted(() => {
  let oldTop = document.documentElement.scrollTop
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop
    if (scrollTop > 50) {
      notAtTop.value = true
    } else {
      notAtTop.value = false
    }
    if (oldTop < scrollTop && notAtTop.value) {
      isHide.value = true
    } else {
      isHide.value = false
    }
    oldTop = scrollTop
  })
})
</script>

<style scoped lang="sass">
.global-header
  height: 50px
  width: 100%
  padding: 0 5%
  position: fixed
  gap: 1rem
  font-size: 1.25rem
  z-index: 100
  background-color: #fff
  transition: box-shadow 0.4s ease

  a
    --color: #222

  &.not-at-top
    box-shadow: 0 0 12px #eee

  .global-site-logo
    .desc
      font-size: 0.6rem
      font-weight: 600
      color: #222
      text-align: right

    img
      display: block
      height: 1.8rem
      width: auto
</style>