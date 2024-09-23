<template>
  <div>
    <ClientOnly>
      <ApexChart
      width ="600"
      type="line"
      :options="chartOptions"
      :series="chartSeries"
    />
    </ClientOnly>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ApexChart from 'vue3-apexcharts'
import jsonData from './jsonpogen/junioAV.json'

// Opciones del gráfico, por ahora vacías
const chartOptions = ref({
  chart: {
    id: 'entradas por fecha'
  },
  xaxis: {
    categories: [], // vacio para las fechas del json
    labels: {
      datetimeFormatter: {
        year: 'yyyy',
        month: 'MMM \'yy',
      }
    },
    range: 12
  },
  stroke: {
    curve: 'smooth'
  },
  dataLabels: {
    enabled: false
  }
})

// Series de datos para del json
const chartSeries = ref([{
  name: 'Entradas',
  data: []
}]);

// Función para cargar y procesar los datos JSON
const processData = () => {
  const groupedData = jsonData.datos.reduce((acc, item) => {
    //const date = item.fecha;
    const date2 = new Date(item.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
    const entradas = parseInt(item.entradas, 10);
    acc[date2] = (acc[date2] || 0) + entradas;
    return acc;
  }, {});

  chartOptions.value.xaxis.categories = Object.keys(groupedData);
  chartSeries.value[0].data = Object.values(groupedData);
};

// Cargar los datos JSON al montar el componente
processData();
</script>


