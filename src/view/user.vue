<template lang="pug">
.bread-crumb
  router-link.button(to='/') ← Take me home
  | &nbsp;|&nbsp;
  router-link(
    :to='{ name: "by-site", query: { siteUrl: $route.query.siteUrl } }'
  ) {{ user.siteName || "site name" }}
  | &nbsp;|&nbsp;
  a.is-active(style='--color: #252525') {{ user.userName || "user name" }}

h1(v-if='loading') Loading user data
h1(v-if='noData') User not found
h1(v-if='!loading && !noData') {{ user.userName }}@{{ user.siteName }}

.info.tips
  .title Tips
  p 🚧 In development 🚧

section.noData(v-if='noData')
  .card
    .align-center NO USER DATA

section.userInfo(v-if='!loading && !noData')
  h2 Features usage
  .card
    feat-chart(:data='user.features')
  h2 Information
  .card
    .flex-list
      .list-item
        .key User name
        .val {{ user.userName }}
      .list-item
        .key Site name
        .val {{ user.siteName }}
      .list-item
        .key Profile URL
        .val
          e-link(:href='`${user.siteUrl}User:${user.userName}`') {{ `${user.siteUrl}User:${user.userName}` }}
      .list-item
        .key Total usage
        .val {{ user._total }}
</template>

<script setup lang="ts">
import axios from 'axios'
import { defineComponent, defineProps, onMounted, ref } from 'vue'
import FeatChart from '../components/ChartFeatsUsage.vue'
import { useRoute } from 'vue-router'
import { API_BASE } from '../config'
import { getFeatName, setTitle } from '../utils'
const route = useRoute()

// const components = defineComponent()
// const props = defineProps()
const user = ref({} as any)
const noData = ref(false)
const loading = ref<boolean>(true)

async function getUser(userName: string, siteUrl: string) {
  loading.value = true
  noData.value = false
  setTitle('user data')

  const { data } = await axios.get(`${API_BASE}/query/user`, {
    params: {
      siteUrl,
      userName,
      prop: '*',
    },
  })
  loading.value = false
  const query = data.body.query[0]

  if (!query) {
    noData.value = true
    return
  }

  query.features = query.features.sort(
    (a: { count: number }, b: { count: number }) => b.count - a.count
  )

  user.value = query
  setTitle(`${query.userName}@${query.siteName}`, 'user data')
}

onMounted(() => {
  setTitle('user data')
  getUser(route.query.userName as string, route.query.siteUrl as string)
})
</script>

<style scoped lang="sass"></style>