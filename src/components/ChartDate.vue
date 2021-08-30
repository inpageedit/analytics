<template lang="pug">
v-chart.chart-date(:option='option', :loading='loading')
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
        from: Date.now() - 7 * 24 * 60 * 60 * 1000,
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
              left: 'center',
              text: 'Date Chart',
            },
          ],
          tooltip: {
            trigger: 'axis',
          },
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
                  { type: 'min', name: '最小值' },
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
  height: 400px
</style>