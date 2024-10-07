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
      <ClientOnly>
        <ApexChart
          width="600"
          type="line"
          :options="chartOptions"
          :series="chartSeries"
        />
      </ClientOnly>
    </div>

    <div class="flex justify-center mt-6">
      <ClientOnly>
        <ApexChart
          type="pie"
          :options="piechartOptions"
          :series="piechartSeries"
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
      formatter: (val) => dayjs(val).format('DD MMM YYYY') // Mostrar meses en el eje X
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
const selectedPlazaIdId = ref('all');
const date = ref(null);

const selectedView = ref('months');

const processData = () => {
  const allDates = new Set();
  //para seleccionar el formato seun se pida
  const formatDate = (date) => {
    if (selectedView.value === 'days') {
      return dayjs(date).format('YYYY-MM-DD');
    } else if (selectedView.value === 'weeks') {
      return dayjs(date).format('YYYY-WW'); // Agrupar por semana
    }
    return dayjs(date).format('YYYY-MM'); // Agrupar por mes
  };


  // Si se selecciona "todas las plazas"
  if (selectedPlazaIdId.value === "all") {
    // Paso 1: Recopilar todas las fechas en las que hay entradas para cualquier plaza
    availablePlazas.forEach(plazaId => {
      jsonData.datos
        .filter(item => item.plaza_id == plazaId)
        .forEach(item => {
          //*
          const monthString = dayjs(item.fecha).format('YYYY-MM'); // Agrupar por mes
          allDates.add(monthString); // Agregar todas las fechas de todas las plazas
          //*/
          /*
          const dateString = formatDate(item.fecha);
          allDates.add(dateString); // Agregar todas las fechas de todas las plazas
          */
        });
    });

    const sortedDates = Array.from(allDates).sort(); // Ordenar las fechas

    // Paso 2: Crear las series de datos para cada plaza
    const seriesData = availablePlazas.map(plazaId => {
      const groupedData = jsonData.datos.reduce((acc, item) => {
        if (item.plaza_id == plazaId) {

          const monthString = dayjs(item.fecha).format('YYYY-MM');

          //const dateString = dayjs(item.fecha);

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
    const filteredData = jsonData.datos.filter(item => item.plaza_id == selectedPlazaIdId.value);

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
      name: `Plaza ${selectedPlazaIdId.value}`,
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


  if (selectedPlazaIdId.value === "all") {
    const seriesData = availablePlazas.map(plazaId => {
      const filteredData = jsonData.datos.filter(item => {
        const itemDate = dayjs(item.fecha);
        return itemDate.isBetween(startDate, endDate, null, '[]') && item.plaza_id == plazaId;
      });

      const groupedData = filteredData.reduce((acc, item) => {
        const monthString = dayjs(item.fecha).format('YYYY-MM'); // Agrupar por mes
        //const dateString = dayjs(item.fecha);
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

    return itemDate.isBetween(startDate, endDate, null, '[]') && item.plaza_id == selectedPlazaIdId.value;
    });

    const groupedData = filteredData.reduce((acc, item) => {
    const monthString = dayjs(item.fecha).format('YYYY-MM'); // Agrupar por mes
    //const dateString = dayjs(item.fecha).format('YYYY-MM'); // Agrupar por mes
    const entradas = parseInt(item.entradas, 10);
    acc[monthString] = (acc[monthString] || 0) + entradas;
    return acc;
    }, {});

    chartSeries.value = [{
      name: `Plaza ${selectedPlazaIdId.value}`,
      data: Object.values(groupedData)
    }];
    chartOptions.value.xaxis.categories = Object.keys(groupedData);

  }

};


// Cargar los datos JSON al montar el componente
processData();

// Monitorea cambios en selectedPlazaIdId
watch(selectedPlazaIdId, () => {
  filterDataByDate(); // Llama a la función para filtrar según la plaza seleccionada
});



//GRAFICA DE PIE


const piefilteredData = computed(() => {
  let data = jsonData.datos;

  // Filtrar por rango de fechas
  if (date.value && date.value.length === 2) {
    const [startDate, endDate] = date.value;
    data = data.filter(d => dayjs(d.fecha).isBetween(startDate, endDate, null, '[]'));
  }

  // Filtrar por plaza (si se selecciona una específica)
  if (selectedPlazaIdId.value !== 'all') {
    data = data.filter(d => d.plaza_id === parseInt(selectedPlazaIdId.value));
  }

  return data;
});

// Generar los datos para la gráfica de pie
const piechartSeries = computed(() => {
  const plazaData = {};

  // Agrupar entradas por plaza
  piefilteredData.value.forEach((cur) => {
    if (plazaData[cur.plaza_id]) {
      plazaData[cur.plaza_id] += parseInt(cur.entradas);
    } else {
      plazaData[cur.plaza_id] =parseInt(cur.entradas);

      /*
      {
        entradas:parseInt(cur.entradas),
        nombrePlaza: cur.plaza_id
      };
      */

    }
  });

  // Devolver las entradas como serie
  return Object.values(plazaData)//.map(plaza => plaza.entradas);
});

/*
const piechartLabels = computed(() => {
  return Object.values(plazaData).map(plaza => plaza.nombrePlaza);
});
*/

// Configuración de opciones para la gráfica
const piechartOptions = ref({
  chart: {
    type: 'pie',
  },
  labels:[] //piechartLabels.value //
});


</script>
