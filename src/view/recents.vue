<template lang="pug">
h1 Recent Activities

section.card
  .align-center(style='margin: 1rem 0')
    a.button.disabled(@click='loading ? null : getList(0)') {{ loading ? "LOADING..." : "REFRESH" }}
  .align-center(v-if='list.length < 1') NO DATA
  .flex-list(v-if='list.length > 0', :class='{ "loading-cover": loading }')
    .list-item.header.card
      .val user@site
      .val feature
      .val time
      .val IPE version
    .list-item.card(v-for='(item, index) in list', :key='index')
      .key
        .userName {{ item.userName }}@{{ item.siteName }}
        .links
          router-link(
            :to='{ name: "by-user", query: { siteUrl: item.siteUrl, userName: item.userName } }'
          ) details
          | &nbsp;|&nbsp;
          e-link(:href='`${item.siteUrl}User:${item.userName}`') profile
      .val {{ getFeatName(item.featureID) }}
      .val {{ new Date(item.date).toLocaleString() }}
      .val {{ item.ipeVersion }}
</template>

<script setup lang="ts">
import axios from 'axios'
import { defineComponent, defineProps, onMounted, ref } from 'vue'
import { API_BASE } from '../config'
import { getFeatName, setTitle } from '../utils'

// const components = defineComponent()
// const props = defineProps()
const list = ref<any[]>([])
const loading = ref<boolean>(false)

async function getList(offset = 0, limit = 25) {
  loading.value = true
  const { data } = await axios.get(`${API_BASE}/query/recents`, {
    params: {
      offset,
      limit,
      prop: '*',
    },
  })
  loading.value = false
  const query = data.body.query
  list.value = query
}

onMounted(() => {
  setTitle('Recent Activities')
  getList(0)
})
</script>

<style scoped lang="sass"></style>