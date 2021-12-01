<template lang="pug">
h1 Leaderboard

section
  h2 Top wikis
  chart-sites
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { setTitle } from '../utils'

import ChartSites from '../components/ChartSites.vue'

onMounted(() => {
  setTitle('Leaderboard')
})
</script>

<style scoped lang="sass"></style>
