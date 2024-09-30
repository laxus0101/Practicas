<template>
  <div>
    <div class="my-3">
      <center>
        <div>
          <label for="plaza-select">Selecciona plaza:</label>
          <select id="plaza-select" v-model="selectedPlazaId" @change="filterDataByDate">
            <option v-for="plaza in availablePlazas" :key="plaza" :value="plaza">
              Plaza {{ plaza }}
            </option>
          </select>
        </div>

        <!-- Filtro para seleccionar fecha o rango de fechas
        :range="{ partialRange: false }"
        -->
        <div class="mt-4">
          <label for="datepicker">Selecciona fecha o rango de fechas:</label>
          <VueDatePicker
            v-model="date"
            range multi-calendars
            :month-change-on-scroll="false"
            class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @update:model-value="filterDataByDate"
          />
        </div>
      </center>
    </div>

    <div class="flex justify-center mt-6">
      <ClientOnly>
        <ApexChart
          width="600"
          type="line"
          :options="chartOptions"
          :series="chartSeries"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import ApexChart from 'vue3-apexcharts';
import dayjs from 'dayjs';
import jsonData from './jsonpogen/junioAV.json';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import isBetween from 'dayjs/plugin/isBetween';

// Activar el plugin isBetween
dayjs.extend(isBetween);

// Opciones del gráfico
const chartOptions = ref({
  chart: {
    id: 'entradas-por-fecha',
    zoom: {
      enabled: true, // Permitir zoom
      type: 'x',
      autoScaleYaxis: true,
    }
  },
  xaxis: {
    categories: [], // Se llenarán con los meses
    labels: {
      formatter: (val) => dayjs(val).format('MMM YYYY') // Mostrar meses en el eje X
    }
  },
  stroke: {
    curve: 'smooth'
  },
  dataLabels: {
    enabled: false
  }
});

// Series de datos
const chartSeries = ref([{
  name: 'Entradas',
  data: []
}]);

const availablePlazas = [...new Set(jsonData.datos.map(item => item.plaza_id))];
const selectedPlazaId = ref(availablePlazas[0]);
const date = ref(null);

// Función para procesar los datos
const processData = () => {
  const groupedData = jsonData.datos.reduce((acc, item) => {
    if (item.plaza_id == selectedPlazaId.value) {
      const monthString = dayjs(item.fecha).format('YYYY-MM'); // Agrupar por mes (YYYY-MM)
      const entradas = parseInt(item.entradas, 10);
      acc[monthString] = (acc[monthString] || 0) + entradas;
    }
    return acc;
  }, {});

  // Actualizar las categorías (meses) y los datos (entradas)
  chartOptions.value.xaxis.categories = Object.keys(groupedData);
  chartSeries.value[0].data = Object.values(groupedData);
  chartSeries.value[0].name = `Entradas Plaza ${selectedPlazaId.value}`;
};

// Función para filtrar los datos por rango de fechas
const filterDataByDate = () => {
  if (!date.value) {
    processData();
    return;
  }

  const [startDate, endDate] = date.value; // Obtener rango de fechas
  const filteredData = jsonData.datos.filter(item => {
    const itemDate = dayjs(item.fecha);
    return itemDate.isBetween(startDate, endDate, null, '[]') && item.plaza_id == selectedPlazaId.value;
  });

  const groupedData = filteredData.reduce((acc, item) => {
    const monthString = dayjs(item.fecha).format('YYYY-MM'); // Agrupar por mes
    const entradas = parseInt(item.entradas, 10);
    acc[monthString] = (acc[monthString] || 0) + entradas;
    return acc;
  }, {});

  chartOptions.value.xaxis.categories = Object.keys(groupedData);
  chartSeries.value[0].data = Object.values(groupedData);
};

// Cargar los datos JSON al montar el componente
processData();

// Monitorea cambios en selectedPlazaId
watch(selectedPlazaId, () => {
  filterDataByDate(); // Llama a la función para filtrar según la plaza seleccionada
});
</script>
