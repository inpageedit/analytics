<template lang="pug">
.feats-chart
  v-chart(style='height: 400px', :option='option', autoresize)
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue'
import { getFeatName } from '../utils'

const props = defineProps<{ data: any }>()
const option = ref({})

function setChart() {
  const featList = props.data
  const seriesData = featList
    .sort((a: { count: number }, b: { count: number }) => b.count - a.count)
    .map(({ count, featureID }: { count: number; featureID: string }) => ({
      value: count,
      name: getFeatName(featureID),
    }))
  option.value = {
    title: {
      text: `Features usage`,
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '5%',
      left: 'center',
    },
    series: [
      {
        name: '使用次数',
        type: 'pie',
        radius: ['25%', '60%'],
        center: ['50%', '60%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2,
        },
        data: seriesData,
      },
    ],
  }
}

onMounted(() => {
  setChart()
})
</script>

<style scoped lang="sass"></style>
