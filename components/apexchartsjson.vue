<template>
  <div>
    <!-- Selector de fecha -->
    <VueDatePicker
      v-model="selectedDate"
      range
      multi-calendars
      :month-change-on-scroll="false"
      class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <!-- Selector de plaza -->
    <select v-model="selectedPlaza">
      <option value="all">Todas las plazas</option>
      <option v-for="plaza in plazas" :key="plaza" :value="plaza">
        Plaza {{ plaza }}
      </option>
    </select>

    <!-- Piechart -->

      <ClientOnly>
        <ApexChart
          type="pie"
          :options="chartOptions"
          :series="chartSeries"
        />
      </ClientOnly>

  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import ApexChart from 'vue3-apexcharts';
import dayjs from 'dayjs';
import jsonData from './jsonpogen/junioAV.json';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const selectedDate = ref(null);
const selectedPlaza = ref('all');

// Lista de plazas disponibles (extraída del JSON)
const plazas = computed(() => [...new Set(jsonData.datos.map(d => d.plaza_id))]);

// Filtrar los datos según los filtros aplicados (fecha y plaza)
const filteredData = computed(() => {
  let data = jsonData.datos;

  // Filtrar por rango de fechas
  if (selectedDate.value && selectedDate.value.length === 2) {
    const [startDate, endDate] = selectedDate.value;
    data = data.filter(d => dayjs(d.fecha).isBetween(startDate, endDate, null, '[]'));
  }

  // Filtrar por plaza (si se selecciona una específica)
  if (selectedPlaza.value !== 'all') {
    data = data.filter(d => d.plaza_id === parseInt(selectedPlaza.value));
  }

  return data;
});

// Generar los datos para la gráfica de pie
const chartSeries = computed(() => {
  const plazaData = {};

  // Agrupar entradas por plaza
  filteredData.value.forEach((cur) => {
    if (plazaData[cur.plaza_id]) {
      plazaData[cur.plaza_id] += parseInt(cur.entradas);
    } else {
      plazaData[cur.plaza_id] = parseInt(cur.entradas);
    }
  });

  // Devolver las entradas como serie
  return Object.values(plazaData);
});

// Configuración de opciones para la gráfica
const chartOptions = ref({
  chart: {
    type: 'pie',
  },
  labels: [], // Las etiquetas se actualizarán con los nombres de plazas
});

// Actualizar etiquetas cuando los datos cambien
watch(filteredData, (newData) => {
  const plazaLabels = [...new Set(newData.map(d => `Plaza ${d.plaza_id}`))];
  chartOptions.value.labels = plazaLabels; // Actualizar las etiquetas para las plazas
});
</script>

<style scoped>
/* Opcional, puedes agregar estilos aquí */
</style>
