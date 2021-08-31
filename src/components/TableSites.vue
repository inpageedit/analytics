<template lang="pug">
.flex-list.sites-table
  .list-item(
    :style='{ "font-size": "1.4rem", padding: "0 1rem", "font-weight": 600 }'
  )
    div(style='flex: 4') Site
    div Count
  hr(style='border: none; border-bottom: 2px solid #eee')
  .list-item.card(
    v-for='(item, index) in list',
    :key='index',
    :title='`${item.siteName}: Total ${item._total} time${item._total > 1 ? "s" : ""}`'
  )
    .key(style='flex: 4')
      .siteName
        strong {{ item.siteName }}
      .siteUrl
        e-link.siteLink(:href='item.siteUrl') {{ item.siteUrl }}
    .val.flex-center {{ item._total }}
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps(['list'])
</script>

<style scoped lang="sass">
.siteLink
  font-size: 0.75rem
</style>