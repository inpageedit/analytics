<template lang="pug">
.sites-container.card
  v-chart.chart-sites(
    :option='option',
    :loading='loading',
    autoresize,
    :onClick='handleClick'
  )
  p.align-center
    a.button(:diabled='loading', @click='loading ? null : loadData(0)') {{ loading ? "LOADING..." : "REFRESH" }}
  table-sites(:list='query', :class='{ "loading-cover": loading }')
</template>

<script setup lang="ts">
import axios from 'axios'
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { API_BASE } from '../config'
import TableSites from './TableSites.vue'

const router = useRouter()
const components = defineComponent({ TableSites })
// const props = defineProps()
const loading = ref(false)
const query = ref<any[]>([])
const option = ref({})

async function loadData(offset: number) {
  loading.value = true
  const { data } = await axios.get(`${API_BASE}/query/sites`, {
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
        // left: 'center',
        text: `Top ${totalList.length} wikis`,
        subtext: `Data as of ${new Date().toLocaleString()}`,
      },
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
        },
        dataView: {
          readOnly: true,
        },
        saveAsImage: {},
      },
    },
    dataZoom: [
      {
        type: 'slider',
        realtime: true,
        // startValue: 0,
        // endValue: 9,
      },
      {
        type: 'inside',
        realtime: true,
      },
    ],
    xAxis: {
      type: 'category',
      // name: 'Site name',
      data: siteNameList,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        type: 'bar',
        name: '使用次数',
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

function handleClick(e: any) {
  console.log(e)
  router.push({
    name: 'by-site',
    query: {
      siteUrl: query.value[e.dataIndex].siteUrl,
    },
  })
}

onMounted(() => {
  loadData(0)
})
</script>

<style scoped lang="sass">
.chart-sites
  height: 400px
</style>