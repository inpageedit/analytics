<template lang="pug">
.chart-date-container
  v-chart.chart-date(:option='option', :loading='loading', autoresize)
  //- .align-center
  //-   a.button(:diabled='loading', @click='loading ? null : initChart()') {{ loading ? "LOADING..." : "REFRESH" }}
</template>

<script setup lang="ts">
import { defineComponent, defineProps, onMounted, ref } from 'vue'
import { API_BASE } from '../config'
import axios from 'axios'

// const components = defineComponent()
// const props = defineProps()
const option = ref({})
const loading = ref(false)

async function initChart() {
  loading.value = true
  axios
    .get(`${API_BASE}/query/date`, {
      params: {
        from: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toDateString(),
        to: Date.now(),
        prop: 'date|count',
      },
    })
    .then(
      ({ data }) => {
        loading.value = false
        const query = data.body.query
        const dateList = query.map(({ date }) => date)
        const countList = query.map(({ count }) => count)

        option.value = {
          // title: [
          //   {
          //     text: 'Daily Usage',
          //     subtext: `from {bold|${new Date(
          //       data.query.fromTime
          //     ).toLocaleString()}} to {bold|${new Date(
          //       data.query.toTime
          //     ).toLocaleString()}}`,
          //     subtextStyle: {
          //       rich: {
          //         bold: {
          //           fontWeight: '600',
          //         },
          //       },
          //     },
          //   },
          // ],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
            },
          },
          // dataZoom: [
          //   {
          //     type: 'slider',
          //     realtime: true,
          //   },
          //   {
          //     type: 'inside',
          //     realtime: true,
          //   },
          // ],
          xAxis: [
            {
              data: dateList,
            },
          ],
          yAxis: [{}],
          series: [
            {
              type: 'line',
              name: '使用次数',
              showSymbol: false,
              data: countList,
              markPoint: {
                data: [
                  { type: 'max', name: '最大值' },
                  // { type: 'min', name: '最小值' },
                ],
              },
              markLine: {
                data: [{ type: 'average', name: '平均值' }],
              },
            },
          ],
        }
      },
      (err) => {}
    )
}
onMounted(() => {
  initChart()
})
</script>

<style scoped lang="sass">
.chart-date
  height: 280px
</style>