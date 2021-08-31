<template lang="pug">
h1 Home
section
  .tips 🚧 In progress 🚧
section.charts
  h2 By Date
  p.align-center Based on data from the past 60 days
  chart-date
  h2 By Site
  chart-sites
</template>

<script setup lang="ts">
import { defineComponent, defineProps, ref } from 'vue'

import ChartDate from '../components/ChartDate.vue'
import ChartSites from '../components/ChartSites.vue'
const components = defineComponent({ ChartDate })
// const props = defineProps()
</script>

<style scoped lang="sass"></style>