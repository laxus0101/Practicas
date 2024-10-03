<template>
  <div class="" >
    <ClientOnly>
      <ApexChart With="100" type="pie" :options="chartOptions" :series="series"></ApexChart>
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ApexChart from 'vue3-apexcharts';

const series = ref([44, 55, 13, 43, 22])
const chartOptions = ref({
  chart: {
    //width: 380,
    type: 'pie'
  },
  labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        //width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
})
</script>