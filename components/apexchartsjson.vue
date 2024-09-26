<template>
  <div>
    <ClientOnly>
      <ApexChart
        width="600"
        type="line"
        :options="chartOptions"
        :series="chartSeries"
      />
    </ClientOnly>

    <!-- Controles de paginación -->
    <div class="mt-3 flex justify-between " >
      <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ApexChart from 'vue3-apexcharts'
import jsonData from './jsonpogen/junioAV.json'

// Opciones del gráfico
const chartOptions = ref({
  chart: {
    id: 'entradas-por-mes'
  },
  xaxis: {
    type: 'datetime',
    categories: [],
    labels: {
      formatter: function (val) {
        return new Date(val).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
      }
    }
  }
})

// Series de datos
const chartSeries = ref([{
  name: 'Entradas',
  data: []
}]);

// Paginación
const itemsPerPage = 50; // Número de datos a mostrar por página
const currentPage = ref(1); // Página actual
const totalPages = ref(0);  // Total de páginas

// Datos agrupados y procesados
const allData = ref([]); // Almacenará todos los datos procesados

// Función para cargar y procesar los datos JSON
const processData = () => {
  const groupedData = jsonData.datos.reduce((acc, item) => {
    const date = new Date(item.fecha).getTime(); // Convertimos la fecha a timestamp
    const entradas = parseInt(item.entradas, 10);
    acc[date] = (acc[date] || 0) + entradas;
    return acc;
  }, {});

  allData.value = Object.keys(groupedData).map((date, index) => ({
    x: Number(date),   // Usamos la fecha en formato numérico
    y: Object.values(groupedData)[index] // El valor de las entradas
  }));

  // Calculamos el total de páginas
  totalPages.value = Math.ceil(allData.value.length / itemsPerPage);

  // Mostrar la primera página
  updateChartSeries();
};

// Función para actualizar el gráfico en base a la página actual
const updateChartSeries = () => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  // Actualizamos las categorías (fechas) y series (entradas) para la página actual
  chartOptions.value.xaxis.categories = allData.value.slice(start, end).map(item => item.x);
  chartSeries.value[0].data = allData.value.slice(start, end);
};

// Funciones de control de paginación
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    updateChartSeries();
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    updateChartSeries();
  }
};

// Cargar los datos JSON al montar el componente
processData();
</script>
