<template lang="pug">
.flex-list.sites-table
  .list-item.header.card
    div(style='flex: 4') Site
    div Count
  .list-item.card(
    v-for='(item, index) in list',
    :key='index',
    :title='`${item.siteName}: Total ${item._total} time${item._total > 1 ? "s" : ""}`'
  )
    .key(style='flex: 4')
      .siteName
        strong {{ item.siteName }}
      .siteUrl
        router-link(
          :to='{ name: "by-site", query: { siteUrl: item.siteUrl } }'
        ) details
        | &nbsp;|&nbsp;
        e-link.siteLink(:href='item.siteUrl') {{ item.siteUrl }}
    .val.flex-center {{ item._total }}
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps(['list'])
</script>

<style scoped lang="sass">
.siteUrl
  font-size: 0.75rem
  .siteLink
    font-size: inherit
</style>