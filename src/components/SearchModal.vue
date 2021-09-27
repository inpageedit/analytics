<template lang="pug">
Modal.search-modal(v-model:show='searchModalShow')
  h3 Search your site or yourself
  search-form
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import { searchModalShow } from './states'
import Modal from './Modal.vue'
import SearchForm from './SearchForm.vue'
const components = defineComponent({ Modal, SearchForm })
</script>

<style lang="sass">
.search-modal
  h3
    margin-top: 0
  .modalWindow
    .modalContent
      background-color: #fafafa
      border-radius: 0.5rem
      padding: 1rem
    .closeBtn
      display: none
</style>