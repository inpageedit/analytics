<template lang="pug">
.sites-container
  v-chart.chart-sites(:option='option', :loading='loading')
  .flex-list
    .list-item(v-for='item in query')
      .key {{ item.siteName }}
      .val {{ item._total }}
</template>

<script setup lang="ts">
import axios from 'axios'
import { defineComponent, defineProps, onMounted, ref } from 'vue'
import { API_BASE } from '../config'

// const components = defineComponent()
// const props = defineProps()
const loading = ref(false)
const query = ref([])
const option = ref({})

async function loadData(offset: number) {
  loading.value = true
  const { data } = await axios.get(`${API_BASE}/query/wiki`, {
    params: {
      limit: 100,
      offset,
      sort: '!_total',
      prop: 'siteName|siteUrl|_total',
    },
  })
  loading.value = false
  query.value = data.body.query
  setOption(data.body.query)
}

function setOption(query: any) {
  const totalList = query.map(({ _total }) => _total)
  const siteNameList = query.map(({ siteName }) => siteName)

  option.value = {
    title: [
      {
        left: 'center',
        text: 'Wiki Chart',
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: siteNameList,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        type: 'bar',
        data: totalList,
        barMaxHeight: 400,
        barMinHeight: 10,
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
      },
    ],
  }
}

onMounted(() => {
  loadData(0)
})
</script>

<style scoped lang="sass">
.chart-sites
  height: 400px
</style>