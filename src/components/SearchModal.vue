<template lang="pug">
Modal.search-modal(v-model:show='searchModalShow')
  h3 Search your site or yourself
  search-form
  .close-container.align-center
    a.plain.pointer(@click='searchModalShow = false')
      icon
        //- times-circle
        times-circle-regular
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import { searchModalShow } from './states'
import { TimesCircleRegular } from '@vicons/fa'
import Modal from './Modal.vue'
import SearchForm from './SearchForm.vue'

import { useRouter } from 'vue-router'
const router = useRouter()

const components = defineComponent({
  Modal,
  SearchForm,
  TimesCircleRegular,
})

router.afterEach(() => {
  searchModalShow.value = false
})
</script>

<style lang="sass">
.search-modal
  h3
    margin-top: 0
  .modalWindow
    .modalContent
      background-color: #fafafa
    .closeBtn
      display: none
  .close-container
    margin-top: 1rem
    a
      font-size: 2rem
      --color: #aaa
      &:hover
        --color: #888
</style>