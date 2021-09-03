<template lang="pug">
h1 About us

h2 Lorem ipsum
.card
  p Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  p Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  p Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
  p Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

h2 Q&A
.card
  .flex-list
    .list-item
      .key When does InPageEdit Analytics V5 start recording?
      .val Analytics V5 API started on <strong>Wed, 25 Aug 2021 21:36:21 (UTC)</strong>. And the new endpoint has been used since InPageEdit <code>14.2.1</code>
    .list-item
      .key Why can't I find my wiki/user data?
      .val
        em Firstly, please make sure:
        ol 
          li You are using InPageEdit version above <code>14.2.1</code>
          li Your username or site name does not contain sensitive words.
        p Secondly, the situation may also be caused by network jam.
    .list-item
      .key Can I apply to erase my data?
      .val Yes, you can. Please file issues on GitHub.

h2 Technology used
.card
  h3 Frontend
  .flex-list
    .list-item
      .key Chart generator
      .val
        e-link(href='https://echarts.apache.org/') ECharts
    .list-item
      .key JavaScript framework
      .val
        e-link(href='https://v3.vuejs.org/') Vue 3
    .list-item
      .key Packaging tool
      .val
        e-link(href='https://vitejs.dev/') Vite
    .list-item
      .key Icons set
      .val
        e-link(href='fontawesome.com/') Font Awesome

  h3 Backend
  .flex-list
    .list-item
      .key PaaS
      .val
        e-link(href='https://vercel.com/') Vercel
    .list-item
      .key Serverless functions
      .val
        e-link(
          href='https://vercel.com/docs/serverless-functions/supported-languages#node.js'
        ) Vercel
        |
        | Node.js Serverless Function
    .list-item
      .key Database
      .val
        e-link(href='https://cloud.mongodb.com/') MongoDB Atlas
</template>

<script setup lang="ts">
import { defineComponent, defineProps, onMounted, ref } from 'vue'
import { setTitle } from '../utils'

// const components = defineComponent()
// const props = defineProps()

onMounted(() => {
  setTitle('About')
})
</script>

<style scoped lang="sass"></style>