<template>
  <div>
    <div class="my-3 grid grid-cols-5 grid-rows-1 gap-4 ">

        <div class="col-start-4 centers" >

          <select id="plaza-select" v-model="selectedPlazaId" @change="filterDataByDate">
            <option value="all">Todas las plazas</option>
            <option v-for="plaza in availablePlazas" :key="plaza" :value="plaza">
              Plaza {{ plaza }}
            </option>
          </select>
        </div>


        <div class="col-start-5 ">

          <VueDatePicker
            v-model="date"
            range multi-calendars
            :month-change-on-scroll="false"
            class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @update:model-value="filterDataByDate"
          />
        </div>

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
import { ref, watch } from 'vue';
import ApexChart from 'vue3-apexcharts';
import dayjs from 'dayjs';
import jsonData from './jsonpogen/junioAV.json';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import isBetween from 'dayjs/plugin/isBetween';

// Activar el plugin isBetween
dayjs.extend(isBetween);

// Opciones del gráfico de linea
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

// Series de datos de grafico de linea
const chartSeries = ref([{
  name: 'Entradas',
  data: []
}]);



const availablePlazas = [...new Set(jsonData.datos.map(item => item.plaza_id))];
const selectedPlazaId = ref('all');
const date = ref(null);


const processData = () => {
  const allDates = new Set();

  // Si se selecciona "todas las plazas"
  if (selectedPlazaId.value === "all") {
    // Paso 1: Recopilar todas las fechas en las que hay entradas para cualquier plaza
    availablePlazas.forEach(plazaId => {
      jsonData.datos
        .filter(item => item.plaza_id == plazaId)
        .forEach(item => {
          const monthString = dayjs(item.fecha).format('YYYY-MM'); // Agrupar por mes
          allDates.add(monthString); // Agregar todas las fechas de todas las plazas
        });
    });

    const sortedDates = Array.from(allDates).sort(); // Ordenar las fechas

    // Paso 2: Crear las series de datos para cada plaza
    const seriesData = availablePlazas.map(plazaId => {
      const groupedData = jsonData.datos.reduce((acc, item) => {
        if (item.plaza_id == plazaId) {
          const monthString = dayjs(item.fecha).format('YYYY-MM');
          const entradas = parseInt(item.entradas, 10);
          acc[monthString] = (acc[monthString] || 0) + entradas;
        }
        return acc;
      }, {});

      // Asegurarse de que todas las fechas tengan datos, y rellenar con 0 si faltan
      const dataForSeries = sortedDates.map(date => groupedData[date] || 0);

      return {
        name: `Plaza ${plazaId}`,
        data: dataForSeries
      };
    });

    chartSeries.value = seriesData;
    chartOptions.value.xaxis.categories = sortedDates; // Usar la lista ordenada de fechas

  } else {
    // Caso para una plaza específica
    const filteredData = jsonData.datos.filter(item => item.plaza_id == selectedPlazaId.value);

    const groupedData = filteredData.reduce((acc, item) => {
      const monthString = dayjs(item.fecha).format('YYYY-MM'); // Agrupar por mes
      const entradas = parseInt(item.entradas, 10);
      acc[monthString] = (acc[monthString] || 0) + entradas;
      return acc;
    }, {});

    // Asegurarse de que todas las fechas tengan datos, y rellenar con 0 si faltan
    const allDates = Array.from(new Set(jsonData.datos.map(item => dayjs(item.fecha).format('YYYY-MM')))).sort();
    const dataForSeries = allDates.map(date => groupedData[date] || 0);

    chartSeries.value = [{
      name: `Plaza ${selectedPlazaId.value}`,
      data: dataForSeries
    }];
    chartOptions.value.xaxis.categories = allDates;


  }
};


// Función para filtrar los datos por rango de fechas
const filterDataByDate = () => {
  if (!date.value) {
    processData();
    return;
  }

  const [startDate, endDate] = date.value; // Obtener rango de fechas


  if (selectedPlazaId.value === "all") {
    const seriesData = availablePlazas.map(plazaId => {
      const filteredData = jsonData.datos.filter(item => {
        const itemDate = dayjs(item.fecha);
        return itemDate.isBetween(startDate, endDate, null, '[]') && item.plaza_id == plazaId;
      });

      const groupedData = filteredData.reduce((acc, item) => {
        const monthString = dayjs(item.fecha).format('YYYY-MM'); // Agrupar por mes
        const entradas = parseInt(item.entradas, 10);
        acc[monthString] = (acc[monthString] || 0) + entradas;
        return acc;
      }, {});

      return {
        name: `Plaza ${plazaId}`,
        data: Object.values(groupedData)
      };
    });

    chartSeries.value = seriesData;
    chartOptions.value.xaxis.categories = Object.keys(seriesData[0]?.data || {}); // Usar las categorías de la primera plaza como referencia

  }
  else {

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

    chartSeries.value = [{
      name: `Plaza ${selectedPlazaId.value}`,
      data: Object.values(groupedData)
    }];
    chartOptions.value.xaxis.categories = Object.keys(groupedData);

  }

};

// Cargar los datos JSON al montar el componente
processData();

// Monitorea cambios en selectedPlazaId
watch(selectedPlazaId, () => {
  filterDataByDate(); // Llama a la función para filtrar según la plaza seleccionada
});
</script>
