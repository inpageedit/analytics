<template lang="pug">
a.external-link(:href='href', target='_blank', rel='nofollow')
  slot
  sup ↗
</template>

<script setup lang="ts">
import { defineComponent, defineProps, ref } from 'vue'

// const components = defineComponent()
const props =
  defineProps<{
    href: string
  }>()
</script>

<style scoped lang="sass"></style>