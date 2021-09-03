<template lang="pug">
h1 Leaderboard

section
  h2 Top wikis
  chart-sites
</template>

<script setup lang="ts">
import { defineComponent, defineProps, onMounted, ref } from 'vue'
import { setTitle } from '../utils'

// const components = defineComponent()
// const props = defineProps()
import ChartSites from '../components/ChartSites.vue'

onMounted(() => {
  setTitle('Leaderboard')
})
</script>

<style scoped lang="sass"></style>