<template lang="pug">
.top-container
  .title-container.flex-center
    .align-center(style='width: 100%')
      h1
        .top InPageEdit
        .bottom Analytics (beta)
      .search-container
        .search-placeholder Search your site or yourself
        .search-trigger(@click='searchModalShow = true', role='button')
.bottom-container
  section
    .mainpage-card(style='min-height: 280px')
      chart-date
  section
    .flex.gap-1.align-center
      .mainpage-card.flex-1
        h3 Total Usage
        .count {{ usage.total || "-" }}
        router-link(to='/recents')
          | Recent Activities
          icon
            arrow-right
      .mainpage-card.flex-1
        h3 Sites
        .count {{ usage.sites || "-" }}
        router-link(to='/leaderboard')
          | All Sites
          icon
            arrow-right
      .mainpage-card.flex-1
        h3 Users
        .count {{ usage.users || "-" }}
        a.plain(
          href='javascript:;',
          :style='{ cursor: "not-allowed", "text-decoration": "line-through", "--color": "gray" }'
        )
          | Yourself
          icon
            arrow-right
</template>

<script setup lang="ts">
import { defineComponent, defineProps, onMounted, ref } from 'vue'
import { ArrowRight } from '@vicons/fa'
import { setTitle } from '../utils'

import ChartDate from '../components/ChartDate.vue'
import axios from 'axios'
import { API_BASE } from '../config'
import { searchModalShow } from '../components/states'
const components = defineComponent({ ChartDate, ArrowRight })
const usage = ref({
  total: 0,
  sites: 0,
  users: 0,
})

function initMeta() {
  axios.get(`${API_BASE}/query/meta`).then(
    ({ data }) => {
      if (data.body) usage.value = data.body
    },
    (err) => {
      console.warn('Failed to get meta data', err)
    }
  )
}

onMounted(() => {
  setTitle()
  initMeta()
})
</script>

<style lang="sass">
[data-route="index"]
  article
    margin: 0
    padding: 0

  .global-header
    transition: all 0.24s ease

  .global-header:not(.not-at-top)
    box-shadow: none
    background-color: transparent
    a
      --color: #fff
    .global-site-logo,
    .searchbox-container
      display: none
    .nav-links > *
      display: none

  .top-container
    background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
    // padding-top: 50px
    height: calc(100vh - 140px - 2rem)
    min-height: 450px

    .title-container
      height: calc(100vh - 280px - 2rem)
      text-align: center

    h1
      margin: 0
      padding: 0
      width: 100%
      color: #fff
      .top
        font-size: 3rem
      .bottom
        font-size: 1rem

    .search-container
      margin-top: 2rem
      position: relative
      .search-placeholder
        position: absolute
        left: 50%
        top: 50%
        transform: translateX(-50%) translateY(-50%)
        font-size: 1.6rem
        line-height: 1
        color: rgba(0, 0, 0, 0.2)
        z-index: 1
        pointer-events: none
      .search-trigger
        display: inline-block
        min-width: 50%
        max-width: 500px
        height: 1.4em
        background-color: #fff
        border-radius: 2em
        box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.25)
        font-size: 2rem
        cursor: pointer

  .bottom-container
    margin: calc(-140px - 2rem) 5% 3rem 5%
    // background-color: var(--theme-background-color)
    section
      margin: 1rem 0

      h3
        font-size: 1rem
        font-weight: 400
        padding: 0
        margin: 0.4rem 0 0.4rem 0
      .count
        font-size: 2rem
        font-weight: 600
        margin: 0.4rem
      a .xicon
        margin-left: 0.5em
        font-size: 0.85em

  .mainpage-card
    padding: 1rem
    border-radius: 1rem
    background-color: #fff
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.04)

@media screen and (max-width: 800px)
  [data-route="index"]
    .top-container
      .search-container
        .search-trigger
          min-width: 80%
    .bottom-container
      section > .flex
        flex-direction: column
</style>