<template>
  <div>
    <div class="flex justify-center mt-6" >
      <ClientOnly>
        <ApexChart
          width ="600"
          type="line"
          :options="chartOptions"
          :series="chartSeries"
        />
      </ClientOnly>
    </div>

    <div class="mt-5 flex justify-items-center justify-around">
      <div>
        <label for="year">Seleccionar Año:</label>
        <select v-model="selectedYear" @change="applyFilters">
          <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>

      <div>
        <label for="months">Seleccionar Meses:</label>
        <select v-model="selectedMonths" @change="applyFilters">
          <option v-for="month in availableMonths" :key="month" :value="month"> {{ month }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ApexChart from 'vue3-apexcharts'
import jsonData from './jsonpogen/junioAV.json'

// Opciones del gráfico
const chartOptions = ref({
  chart: {
    id: 'entradas por fecha'
  },
  xaxis: {
    categories: [],
    labels: {
      formatter: (val) => new Date(val).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })
    }
  },
  stroke: {
    curve: 'smooth'
  },
  dataLabels: {
    enabled: false
  }
})

// Series de datos
const chartSeries = ref([{
  name: 'Entradas',
  data: []
}])

// Filtros de año y mes
const selectedYear = ref(new Date().getFullYear()) // Año seleccionado por defecto, el actual
const selectedMonths = ref([]) // Meses seleccionados
const availableYears = ref([]) // Años disponibles basados en los datos
const availableMonths = ref(['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'])

// Datos agrupados y procesados
const allData = ref([])

// Función para cargar y procesar los datos JSON
const processData = () => {
  const groupedData = jsonData.datos.reduce((acc, item) => {
    const date = new Date(item.fecha)
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // Meses en JS son 0-11

    const timestamp = date.getTime()
    const entradas = parseInt(item.entradas, 10)

    // Agrupamos las entradas por año, mes y fecha (timestamp)
    if (!acc[year]) acc[year] = {}
    if (!acc[year][month]) acc[year][month] = []
    acc[year][month].push({ x: timestamp, y: entradas })

    return acc
  }, {})

  // Actualizamos los años disponibles basados en los datos
  availableYears.value = Object.keys(groupedData).map(year => parseInt(year, 10))

  allData.value = groupedData

  // Aplicamos los filtros por defecto
  applyFilters()
}

// Función para aplicar los filtros y actualizar el gráfico
const applyFilters = () => {
  if (!allData.value[selectedYear.value]) return

  const filteredData = []

  selectedMonths.value.forEach(month => {
    if (allData.value[selectedYear.value][month]) {
      filteredData.push(...allData.value[selectedYear.value][month])
    }
  })

  // Ordenar los datos filtrados por fecha
  filteredData.sort((a, b) => a.x - b.x)

  // Actualizar las categorías (fechas) y series (entradas) con los datos filtrados
  chartOptions.value.xaxis.categories = filteredData.map(item => item.x)
  chartSeries.value[0].data = filteredData
}

// Cargar los datos JSON al montar el componente
onMounted(processData)
</script>