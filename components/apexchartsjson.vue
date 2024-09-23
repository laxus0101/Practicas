<template>
  <div class="p-6">
    <div v-if="isClient">
      <div class="mb-6 flex flex-col items-center">
        <label for="month" class="mb-2 text-lg font-semibold">Selecciona un mes:</label>
        <input
          type="month"
          id="month"
          v-model="selectedMonth"
          @change="filterDataByMonth"
          class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="w-full flex justify-center">
        <VueApexCharts width="500" type="bar" :options="chartOptions" :series="series" />
      </div>
    </div>
    <div v-else class="text-center">
      <h1 class="text-xl font-bold">Cargando gráfico...</h1>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from "vue";
import dayjs from "dayjs"; // Para manejar las fechas

// Verificar si estamos en el cliente
const isClient = process.client;

// Cargar VueApexCharts solo en el cliente
const VueApexCharts = isClient ? defineAsyncComponent(() => import("vue3-apexcharts")) : null;

// Variables para el gráfico y los datos
const chartOptions = ref({
  chart: {
    id: "entradas-chart",
  },
  xaxis: {
    categories: [], // Fechas
  },
  title: {
    text: "Entradas por Fecha",
    align: "center",
  },
});
const series = ref([{ name: "Entradas", data: [] }]);

// Variables para los datos crudos y mes seleccionado
const rawData = ref([]); // Guardar los datos originales
const selectedMonth = ref(""); // Mes seleccionado para el filtro

// Cargar los datos al montar el componente
onMounted(async () => {
  try {
    // Cargar el archivo JSON
    const response = await fetch("/json-pogen/agosto AV.json");
    const jsonData = await response.json();

    // Guardar los datos originales
    rawData.value = jsonData.datos.map(dato => ({
      fecha: dato.fecha,
      entradas: parseInt(dato.entradas),
    }));

    // Mostrar todos los datos al inicio
    updateChart(rawData.value);
  } catch (error) {
    console.error("Error al cargar el JSON:", error);
  }
});

// Función para actualizar el gráfico con los datos filtrados
function updateChart(data) {
  const fechas = data.map(dato => dato.fecha);
  const entradas = data.map(dato => dato.entradas);

  // Actualizar las categorías (fechas) y las series (entradas)
  chartOptions.value.xaxis.categories = fechas;
  series.value[0].data = entradas;
}

// Función para filtrar los datos por mes
function filterDataByMonth() {
  if (selectedMonth.value) {
    const filteredData = rawData.value.filter(dato => {
      return dayjs(dato.fecha).format("YYYY-MM") === selectedMonth.value;
    });
    updateChart(filteredData);
  } else {
    // Si no hay un mes seleccionado, mostrar todos los datos
    updateChart(rawData.value);
  }
}
</script>
