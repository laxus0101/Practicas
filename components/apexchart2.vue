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
import { ref, onMounted } from 'vue'
import ApexChart from 'vue3-apexcharts'
import jsonData from './jsonpogen/junioAV.json'

// Opciones del gráfico, por ahora vacías
const chartOptions = ref({
  chart: {
    id: 'entradas-line-chart'
  },
  xaxis: {
    categories: [], // vacio para las fechas del json
    labels: {
      format: 'dd/MM/yyyy'
    }
  }
})

// Series de datos para del json
const chartSeries = ref([])

// Función para cargar y procesar los datos JSON
const fetchData = async () => {
  try {

    // Fetch del archivo JSON
    const response = await fetch('jsonpogen/junioAV.json')
    const jsonData = await response.json()

    // Extraer fechas y entradas del campo `datos`
    const fechas = jsonData.datos.map(item => item.fecha)
    const entradas = jsonData.datos.map(item => parseInt(item.entradas))

    // Actualizar las categorías del gráfico (fechas)
    chartOptions.value.xaxis.categories = fechas

    // Actualizar las series del gráfico (entradas)
    chartSeries.value = [{
      name: 'Entradas',
      data: entradas
    }]
  } catch (error) {
    console.error('Error cargando los datos del JSON:', error)
  }
}

// Cargar los datos JSON al montar el componente
onMounted(fetchData)
</script>


