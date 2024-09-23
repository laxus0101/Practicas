<!-- components/ChartComponent.vue -->
<template>
  <div>
    <ApexChart
      width ="600"
      type="line"
      :options="chartOptions"
      :series="chartSeries"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ApexChart from 'vue3-apexcharts'

// Definimos las opciones y series del gráfico
const chartOptions = ref({
  chart: {
    id: 'basic-line'
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997]
  }
})

const chartSeries = ref([
  {
    name: 'Ventas',
    data: [30, 40, 35, 50, 49, 60, 70]
  }
])
</script>

