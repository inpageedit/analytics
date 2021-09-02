<template lang="pug">
h1 Home
section
  .info.tips 🚧 Under construction 🚧
section.charts
  h2 Daily Chart
  chart-date
  h2 Top wikis
  chart-sites
</template>

<script setup lang="ts">
import { defineComponent, defineProps, onMounted, ref } from 'vue'
import { setTitle } from '../utils'

import ChartDate from '../components/ChartDate.vue'
import ChartSites from '../components/ChartSites.vue'
const components = defineComponent({ ChartDate, ChartSites })
// const props = defineProps()

onMounted(() => {
  setTitle()
})
</script>

<style scoped lang="sass">
</style>