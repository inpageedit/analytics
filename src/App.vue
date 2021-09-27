<template lang="pug">
#app-container
  global-header

  main.flex-1
    article
      router-view

  global-footer

  search-modal
</template>

<script setup lang="ts">
import { defineComponent, defineProps, ref } from 'vue'
// import { useI18n } from 'vue-i18n'
import GlobalHeader from './components/GobalHeader.vue'
import GlobalFooter from './components/GlobalFooter.vue'
import SearchModal from './components/SearchModal.vue'

// const { t, locale } = useI18n()
const components = defineComponent({ GlobalHeader, GlobalFooter, SearchModal })
// const props = defineProps()
</script>

<style scoped lang="sass">
main
  background-color: var(--theme-background-color)

article
  margin-top: 50px
  margin-left: 5%
  margin-right: 5%
  padding: 2rem 0 3rem 0
</style>