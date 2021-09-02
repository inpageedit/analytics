<template lang="pug">
footer.global-footer
  .top.flex
    section.flex-1
      h4 Discovery
      ul
        li
          router-link(to='/about') About
    section.flex-1
      h4 Follow us
      ul
        li InPageEdit Tech. Org.
          ul
            li
              | 机智的小鱼君: 
              e-link(href='https://community.fandom.com/wiki/User:机智的小鱼君') Fandom
              | 、
              e-link(href='https://zh.moegirl.org.cn/User:机智的小鱼君') 萌娘百科
            li
              | MysticNebula: 
              e-link(href='https://community.fandom.com/wiki/User:MysticNebula70') Fandom
        li Team Social Admin
          ul
            li
              e-link(href='https://zh.moegirl.org.cn/User:星海子') 星海子@萌娘百科
            li
              e-link(href='https://minecraft.fandom.com/zh/wiki/User:Dianliang233') Dianliang@Minecraft_Wiki
    //- section.flex-1
    //-   h4 社交媒体
    //-     p Placeholder
    section.flex-1
      h4 Links
      div Come to GitHub issues to exchange friend links~
      ul
        li
          e-link(href='https://ipe.js.org') InPageEdit Documentation

  .bottom.align-center
    .copyright
      | &copy; Copyright ({{ COPY_YEAR }})
      | &nbsp;
      e-link(:href='GITHUB_URL') InPageEdit Technology org.
      | &nbsp;
      em v{{ F_VERSION }}
</template>

<script setup lang="ts">
import { defineComponent, defineProps, ref } from 'vue'
import { COPY_YEAR, GITHUB_URL, GITHUB_OWNER, F_VERSION } from '../config'

// const components = defineComponent()
// const props = defineProps()
</script>

<style scoped lang="sass">
.global-footer
  > div
    padding: 0 5%
    color: var(--theme-accent-link-color)

  .top
    background-color: #56a7e7
    padding-top: 2rem
    padding-bottom: 2rem
    gap: 1.5rem

  .bottom
    padding: 1rem
    background-color: var(--theme-accent-color)

  h4
    position: relative
    margin: 1rem 0 0.5rem 0
    padding-bottom: 0.2rem
    border-bottom: 2px solid
    font-size: 1.1rem

  ul
    padding-left: 1rem
    margin: 0.2rem 0

    a
      display: inline
      font-weight: 400

a
  --color: #eee
  font-weight: 600
</style>