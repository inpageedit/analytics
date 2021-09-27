<template lang="pug">
h1 Search
search-box
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import SearchBox from '../components/SearchBox.vue'

const components = defineComponent({ SearchBox })
</script>

<style scoped lang="sass"></style>