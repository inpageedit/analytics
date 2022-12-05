<template lang="pug">
#app-container
  n-progress
  global-header

  main.flex-1
    article
      router-view

  global-footer

  search-modal
</template>

<script setup lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
// import { useI18n } from 'vue-i18n'
import GlobalHeader from './components/GobalHeader.vue'
import GlobalFooter from './components/GlobalFooter.vue'
import SearchModal from './components/SearchModal.vue'
import NProgress from './components/NProgress.vue'

// const { t, locale } = useI18n()
const components = defineComponent({
  GlobalHeader,
  GlobalFooter,
  SearchModal,
  NProgress,
})

/**
 * 伟人纪念日限时灰度滤镜
 */
onMounted(() => {
  const start = new Date('2022-12-06T00:00:00+0800').getTime()
  const end = new Date('2022-12-06T23:59:59+0800').getTime()
  const now = Date.now()

  if (now > start && now < end) {
    document.documentElement.style.filter = 'grayscale(1)'
  }
})
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
