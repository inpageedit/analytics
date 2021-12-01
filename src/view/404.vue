<template lang="pug">
.page-404
  error-page(title='404', desc='Page not found')
  .align-center
    router-link.button(to='/') ← Take me home
</template>

<script setup lang="ts">
import { defineComponent, onMounted } from 'vue'
import ErrorPage from '../components/ErrorPage.vue'
import { setTitle } from '../utils'

const components = defineComponent({ ErrorPage })
onMounted(() => {
  setTitle('Not found')
})
</script>

<style scoped lang="sass"></style>
