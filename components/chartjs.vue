<template>
  <div>
    <div class="my-3 grid grid-cols-4 grid-rows-1 gap-2 ">

        <div class="col-start-1 space-x-2 ">
          <button @click="selectedView = 'days'" class="btn border-4 ">Días</button>
          <button @click="selectedView = 'weeks'" class="btn border-4">Semanas</button>
          <button @click="selectedView = 'months'" class="btn border-4">Meses</button>
        </div>

        <div class="col-start-2 centers" >

          <select id="plaza-select" v-model="selectedPlazaIdId" @change="filterDataByDate">
            <option value="all">Todas las plazas</option>
            <option v-for="plaza in availablePlazas" :key="plaza" :value="plaza">
              Plaza {{ plaza }}
            </option>
          </select>
        </div>


        <div class="col-start-3 ">

          <VueDatePicker
            v-model="date"
            range multi-calendars
            placeholder="Select Range"
            :month-change-on-scroll="false"
            :week-numbers="{ type: 'iso' }"
            class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @update:model-value="filterDataByDate"
          />
        </div>

        <div class="col-start-4 ">
          <VueDatePicker
            v-model="date"
            placeholder="Select Week"
            week-picker
            :month-change-on-scroll="false"
            :week-numbers="{ type: 'iso' }"
            class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @update:model-value="filterDataByDate"
          />
        </div>
    </div>


    <div class="flex justify-center mt-6">
      <div>
        <ClientOnly>
          <canvas ref="lineChart"></canvas>
        </ClientOnly>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, watch,onMounted } from 'vue';
import dayjs from 'dayjs';
import jsonData from './jsonpogen/junioAV.json';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import isBetween from 'dayjs/plugin/isBetween';
import { Chart } from 'chart.js';


// Referencia al elemento canvas
const lineChart = ref(null);

const renderChart = () => {
  const ctx = lineChart.value.getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Data 1',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          data: [65, 59, 80, 81, 56, 55, 40],
        },
        {
          label: 'Data 2',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          data: [28, 48, 40, 19, 86, 27, 90],
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

// Renderiza la gráfica cuando el componente está montado
onMounted(() => {
  renderChart();
});
</script>

<style scoped>
canvas {
  max-width: 100%;
}
</style>