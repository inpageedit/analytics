<template lang="pug">
.bread-crumb
  router-link.button(to='/') ← Take me home
  | &nbsp;|&nbsp;
  a.is-active(style='--color: #252525') {{ site.siteName || 'site name' }}

h1(v-if='loading') Loading site data
h1(v-else) {{ site.siteName }}

.info.tips
  .title Tips
  p 🚧 In development 🚧

.loading(v-if='loading') Loading...
.by-site(v-else)
  h2 Features usage
  .card
    feat-chart(:data='site.features')

  h2 Information
  .card
    .flex-list
      .list-item
        .key Site name
        .val {{ site.siteName }}
      .list-item
        .key Site URL
        .val
          e-link(:href='site.siteUrl') {{ site.siteUrl }}
      .list-item
        .key Total usage
        .val {{ site._total }}

  h2 Users
  .card
    .flex-list
      .list-item.header.card
        .val(style='flex: 0; padding: 0 1rem') #
        .key User
        .val Count
      .list-item.card(
        v-for='(user, index) in users.sort((a, b) => b.count - a.count)'
      )
        .val(style='flex: 0; padding: 0 1rem') {{ index + 1 }}
        .key
          .userName {{ user.userName }}
          .links
            router-link(
              :to='{ name: "by-user", query: { siteUrl: site.siteUrl, userName: user.userName } }'
            ) details
            | &nbsp;|&nbsp;
            e-link(:href='`${site.siteUrl}User:${user.userName}`') profile
        .val {{ user.count }}
</template>

<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import FeatChart from '../components/ChartFeatsUsage.vue'
import { useRoute } from 'vue-router'
import { API_BASE } from '../config'
import { setTitle } from '../utils'

// const components = defineComponent()
// const props = defineProps()
const site = ref<{
  siteName: string
  siteUrl: string
  _total: number
  features: any[]
}>({
  siteName: '',
  siteUrl: '',
  _total: 0,
  features: [],
})
const users = ref<{ userName: string; count: number }[]>([])
const loading = ref<boolean>(true)
const route = useRoute()

function initSite() {
  loading.value = true
  axios
    .get(`${API_BASE}/query/site`, {
      params: {
        siteUrl: route.query.siteUrl,
        prop: '_total|siteUrl|siteName|features',
      },
    })
    .then(({ data }) => {
      loading.value = false
      const [query] = data.body.query
      site.value = query
      setTitle(query.siteName, 'wiki')
      initUsers()
    })
    .finally(() => {})
}

function initUsers() {
  axios
    .get(`${API_BASE}/query/site/users`, {
      params: {
        siteUrl: route.query.siteUrl,
        limit: 100,
        sort: '!count',
        prop: 'userName|count',
      },
    })
    .then(({ data }) => {
      const { query } = data.body
      users.value = query
    })
    .finally(() => {})


onMounted(() => {
  setTitle('wiki data')
  initSite()
})
</script>

<style scoped lang="sass"></style>
