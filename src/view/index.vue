<template lang="pug">
h1 Home
section
  .greeting hello, world
  .tips In progress
section.charts
  h2 Charts
  chart-date
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