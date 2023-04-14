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
        from: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toString(),
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
          title: [
            {
              // text: 'Daily Usage',
              subtext: `{bold|${new Date(
                data.body.fromTime
              ).toLocaleString()}} - {bold|${new Date(
                data.body.toTime
              ).toLocaleString()}}`,
              subtextStyle: {
                rich: {
                  bold: {
                    fontWeight: '700',
                  },
                },
              },
            },
          ],
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
              name: 'Use count',
              showSymbol: false,
              data: countList,
              markPoint: {
                data: [{ type: 'max', name: 'Max' }],
              },
              markLine: {
                data: [{ type: 'average', name: 'Average' }],
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
