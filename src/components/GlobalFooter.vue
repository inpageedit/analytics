<template lang="pug">
footer.global-footer
  .top.flex
    section.flex-1
      h4 Discovery
      ul
        li
          router-link(to='/about') About us
        li
          e-link(href='https://ipe.js.org') What is InPageEdit
    section.flex-1
      h4 Follow us
      ul
        li InPageEdit Tech. org.
          ul
            li
              e-link(href='https://github.com/Dragon-Fish') 机智的小鱼君
            li
              e-link(href='https://github.com/AlPha5130') MysticNebula
        li Team Social Admin
          ul
            li
              e-link(href='https://zh.moegirl.org.cn/User:星海子') 星海子@萌娘百科
            li
              e-link(
                href='https://minecraft.fandom.com/zh/wiki/User:Dianliang233'
              ) Dianliang@Minecraft_Wiki

    section.flex-1
      h4 Social media
      ul
        li
          strong QQ group:
          |
          e-link(href='https://jq.qq.com/?_wv=1027&k=39Zoc3uk') 1026023666

    section.flex-1
      h4 Friend links
      div Come to GitHub issues to exchange friend links~
      ul
        li
          e-link(href='https://ipe.js.org') InPageEdit Documentation

  .bottom.align-center
    .copyright
      | Copyright &copy; {{ COPY_YEAR }}
      | &nbsp;
      e-link(:href='GITHUB_URL') InPageEdit Technology
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
    background-color: #6a70d7
    padding-top: 2rem
    padding-bottom: 2rem
    gap: 1.5rem

  .bottom
    padding: 1rem
    background-color: #5955c6

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

@media screen and (max-width: 800px)
  .top
    flex-direction: column
</style>