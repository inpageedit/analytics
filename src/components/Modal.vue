<template lang="pug">
.modalContainer
  .modalArea(v-if='show')
    .modalBackdrop(@click='closeModal')
    .modalWindow
      a.plain.closeBtn(roll='button', @click='closeModal')
        icon
          Times
      section.modalContent
        div
          slot
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Times } from '@vicons/fa'

export default defineComponent({
  components: { Times },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  methods: {
    showModal() {
      this.$emit('update:show', true)
    },
    closeModal() {
      this.$emit('update:show', false)
    },
  },
  watch: {
    show() {
      if (this.show) {
        document.body.classList.add('modal-is-opening', 'lock-scroll')
      } else {
        document.body.classList.remove('modal-is-opening', 'lock-scroll')
      }
    },
  },
  mounted() {
    document.addEventListener('keydown', ({ code }) => {
      if (code === 'Escape') this.closeModal()
    })
  },
})
</script>

<style lang="sass">
.modalContainer
  .modalArea
    z-index: 120
    overflow: auto
    display: flex

  .modalArea,
  .modalBackdrop
    position: fixed
    top: 0px
    left: 0px
    width: 100vw
    height: 100vh

  .modalBackdrop
    background-color: rgba(0, 0, 0, 0.32)
    z-index: -1

  .modalWindow
    -webkit-box-flex: 0
    -webkit-flex: none
    display: flex
    flex: none
    margin: auto
    padding: 2.5rem
    position: relative
    width: 640px
    max-width: 100%
    z-index: 1

  .modalContent
    -moz-box-flex: 1
    flex-grow: 1
    border-radius: 8px
    background: #fff
    padding: 1rem
    overflow: hidden
    word-break: break-all

  .closeBtn
    position: absolute
    right: 3.5rem
    top: 3.5rem
    font-size: 1.5rem
    color: #aaa
    cursor: pointer
    z-index: 10
    &:hover
      color: #888
</style>
