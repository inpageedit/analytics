<template lang="pug">
.bread-crumb
  router-link.button(to='/') ← Take me home

p.info.tips 🚧 In development 🚧

h1(v-if='loading') Loading data for {{ $route.query.siteUrl }}
h1(v-else) <strong>{{ site.siteName }}</strong>

.loading(v-if='loading') 加载中……
.by-site(v-else)
  h2 Chart
  .card
    .flex-center(
      :style='{ height: "400px", backgroundColor: "#fafafa", fontSize: "2rem", userSelect: "none" }'
    )
      .position-center CHART PLACEHOLDER

  h2 Stats
  .card
    ul
      li
        strong URL:
        |
        e-link(:href='site.siteUrl') {{ site.siteUrl }}
      li
        strong Total:
        |
        | {{ site._total }}
  details
    pre {{ site }}
</template>

<script setup lang="ts">
import axios from 'axios'
import { defineComponent, defineProps, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { API_BASE } from '../config'
import { setTitle } from '../utils'

// const components = defineComponent()
// const props = defineProps()
const site = ref({})
const loading = ref<boolean>(false)
const route = useRoute()

function initSite() {
  loading.value = true
  axios
    .get(`${API_BASE}/query/wiki`, {
      params: { siteUrl: route.query.siteUrl, prop: '_total|siteUrl|siteName' },
    })
    .then(({ data }) => {
      loading.value = false
      const query = data.body.query[0]
      site.value = query
      setTitle(query.siteName, 'wiki data')
    })
    .finally(() => {})
}

onMounted(() => {
  setTitle('wiki data')
  initSite()
})
</script>

<style scoped lang="sass">
</style>