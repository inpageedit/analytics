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
import { defineComponent, defineProps, onMounted, ref } from 'vue'
import { setTitle } from '../utils'

import ChartDate from '../components/ChartDate.vue'
import ChartSites from '../components/ChartSites.vue'
const components = defineComponent({ ChartDate })
// const props = defineProps()

onMounted(() => {
  setTitle()
})
</script>

<style scoped lang="sass"></style>