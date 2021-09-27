<template lang="pug">
header.global-header.flex-center(
  :class='{ "not-at-top": notAtTop, "is-hide": isHide }'
)
  .item
    a.plain.pointer.side-nav-toggler(
      @click='sideNavShow = !sideNavShow',
      :class='{ "is-active": sideNavShow }'
    )
      icon
        bars
  .item.global-site-logo-container
    router-link.plain.global-site-logo(to='/', title='InPageEdit Analytics')
      img(:src='Logo', alt='InPageEdit Analytics')
      .desc Analytics(beta)

  .flex-1.flex.nav-links(style='gap: 1rem')
    .item
      router-link(to='/leaderboard') Tops
    .item
      router-link(to='/recents') Activities
    .item
      router-link(to='/about') About

  .item.searchbox-container
    .search-input(@click='searchModalShow = true', role='button')
      icon.icon
        search-icon
      span.text Search...

  .item
    e-link.no-icon(:href='GITHUB_URL')
      icon
        github

global-side-nav
</template>

<script setup lang="ts">
import { defineComponent, defineProps, onMounted, ref, watch } from 'vue'
import { GITHUB_URL } from '../config'
import Logo from '../assets/logo/InPageEdit.png'
import { Github, Bars, Search as SearchIcon } from '@vicons/fa'
import GlobalSideNav from './GlobalSideNav.vue'
import { sideNavShow, searchModalShow } from './states'

const components = defineComponent({ Github, Bars, GlobalSideNav, SearchIcon })
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

watch(notAtTop, () => {
  if (notAtTop.value) {
    document.body.classList.remove('is-at-top')
  } else {
    document.body.classList.add('is-at-top')
  }
})
</script>

<style scoped lang="sass">
.global-header
  height: 50px
  width: 100%
  padding: 0 1rem
  position: fixed
  gap: 1rem
  font-size: 1.25rem
  z-index: 100
  background-color: #fff
  transition: box-shadow 0.4s ease
  box-shadow: 0 1px 0 #eee

  a
    --color: #222

  // &.not-at-top
  //   box-shadow: 0 0 12px #eee

  .side-nav-toggler
    --color: #888
    display: inline-block
    width: 40px
    height: 40px
    line-height: 45px
    text-align: center
    border-radius: 50%

    &:hover,
    &.is-active
      background-color: rgba(0, 0, 0, 0.05)

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

  .searchbox-container
    .search-input
      color: rgba(0, 0, 0, 0.4)
      font-size: 1.2rem
      padding: 0.25rem 2rem 0.25rem 0.5rem
      background-color: rgba(0, 0, 0, 0.05)
      border-radius: 1em
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1)
      transition: all 0.24s ease
      cursor: pointer
      &:hover
        color: rgba(0, 0, 0, 0.6)
        background-color: rgba(0, 0, 0, 0.1)
        box-shadow: 0 0 0 2px #0065ff
      .icon
        font-size: 1rem
        margin-right: 0.2rem

@media screen and (max-width: 800px)
  .global-header
    .nav-links > .item
      display: none
    .searchbox-container
      .search-input
        padding: 0
        width: 1.6rem
        height: 1.6rem
        border-radius: 50%
        text-align: center
        line-height: 1.6
        .icon
          margin: 0
        .text
          display: none
</style>