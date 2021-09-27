<template lang="pug">
h1 Search your site or yourself
search-form
</template>

<script setup lang="ts">
import { defineComponent, onMounted } from 'vue'
import SearchForm from '../components/SearchForm.vue'
import { setTitle } from '../utils'

const components = defineComponent({ SearchForm })

onMounted(() => {
  setTitle('Search')
})
</script>

<style scoped lang="sass"></style>