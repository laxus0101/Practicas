<template>
  <div>
    <div class="my-3 grid grid-cols-4 grid-rows-1 gap-2 ml-2 ">

        <div class="col-start-1 space-x-2 ">
          <button @click="selectedView = 'days'"
                  class="px-2 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 disabled:hover:bg-blue-500 transition-colors"
          >Días</button>
          <button @click="selectedView = 'months'"
                  class="px-2 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 disabled:hover:bg-blue-500 transition-colors"
          >Meses</button>
          <button @click="borrardatos()"
                  class="px-2 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 disabled:hover:bg-blue-500 transition-colors"
          >borrar ultima busqueda</button>
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
            :enable-time-picker="false"
            :month-change-on-scroll="false"
            :week-numbers="{ type: 'iso' }"
            class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @update:model-value="filterDataByDate"
          />
        </div>

        <div class="col-start-4 ">
          <VueDatePicker
            v-model="datew"
            placeholder="Select Week"
            week-picker
            :enable-time-picker="false"
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


    <div class="flex justify-center pt-8">
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
import { ref, watch,computed} from 'vue';
import ApexChart from 'vue3-apexcharts';
import dayjs from 'dayjs';
import jsonData from './jsonpogen/junioAV.json';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import isBetween from 'dayjs/plugin/isBetween';
import { useDateFormatStore } from '~/stores/datestore';


const dateFormatStore = useDateFormatStore();


// Activar el plugin isBetween
dayjs.extend(isBetween);

const selectedView = ref('months');


//para seleccionar el formato seun se pida
const formatDate = (date) => {

    if (selectedView.value === 'days') {
      return dayjs(date).format('YYYY-MM-DD');
    } else if (selectedView.value === 'weekss') {
      return dayjs(date).format('YYYY-WW');
    } else if (selectedView.value === 'months') {
    return dayjs(date).format('YYYY-MM');

    }
};



// Opciones del gráfico de linea
const chartOptions = ref({
  chart: {
    id: 'linechart',
    zoom: {
      enabled: true, // Permitir zoom
      type: 'x',
      autoScaleYaxis: true,
    }
  },
  xaxis: {
    categories: [], // Se llenarán con los meses
    labels: {
      //formatter: (value) => formatDate(value)
      },
    paging:true,
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


const date = ref(dateFormatStore.Rangofechas)

const borrardatos = () => {
  dateFormatStore.clearDateFormat()
  date.value = [];
  processData()
}

const dateStartpinia = dateFormatStore.Rangofechas[0]
const dateEndpinia = dateFormatStore.Rangofechas[1]


const processData = () => {
  const allDates = new Set();

  // Si se selecciona "todas las plazas"
  if (selectedPlazaIdId.value === "all") {

    if(dateStartpinia || dateEndpinia){

      const seriesData = availablePlazas.map(plazaId => {
        const filteredData = jsonData.datos.filter(item => {
          const itemDate = dayjs(item.fecha);
          return itemDate.isBetween(dateStartpinia,dateEndpinia, null, '[]') && item.plaza_id == plazaId;
        });

        filteredData.forEach(item => {
        const monthString = formatDate(item.fecha);
          allDates.add(monthString);
        });

        const sortedDates = Array.from(allDates).sort();

        const groupedData = filteredData.reduce((acc, item) => {
            const monthString = formatDate(item.fecha);
            const entradas = parseInt(item.entradas, 10);
            acc[monthString] = (acc[monthString] || 0) + entradas;
            return acc;
        }, {});

          // Asegurarse de que todas las fechas tengan datos, y rellenar con 0 si faltan
        const dataForSeries = sortedDates.map(date => groupedData[date] || 0);


        return {
          name: `Plaza ${plazaId}`,
          data: dataForSeries
        };
      }
      );

      chartSeries.value = seriesData;

      chartOptions.value = {...chartOptions.value, ...{
        xaxis: {
          categories : Array.from(allDates).sort()
        }
      }
      }

    }
    else{

      availablePlazas.forEach(plazaId => {
        jsonData.datos.filter(item => item.plaza_id == plazaId).forEach(item => {
          const monthString = formatDate(item.fecha);
          allDates.add(monthString);// Agregar todas las fechas de todas las plazas
          });
      });

      const sortedDates = Array.from(allDates).sort()
      const limitedDates = sortedDates.slice(0, 20);

        //Crear las series de datos para cada plaza
      const seriesData = availablePlazas.map(plazaId => {
        const groupedData = jsonData.datos.reduce((acc, item) => {
      if (item.plaza_id == plazaId) {

        const monthString = formatDate(item.fecha);
        const entradas = parseInt(item.entradas, 10);
        acc[monthString] = (acc[monthString] || 0) + entradas;
      }
      return acc;
        },
      {});

        // Asegurarse de que todas las fechas tengan datos, y rellenar con 0 si faltan
      const dataForSeries = limitedDates.map(date => groupedData[date] || 0);

        return {
          name: `Plaza ${plazaId}`,
          data: dataForSeries
          };
        });

      chartSeries.value = seriesData;

      chartOptions.value = {...chartOptions.value, ...{
        xaxis: {
          categories : limitedDates

        }
      }}

    }

    }
  else{
    // Caso para una plaza específica
    const filteredData = jsonData.datos.filter(item => item.plaza_id == selectedPlazaIdId.value);

    const groupedData = filteredData.reduce((acc, item) => {
      const monthString = formatDate(item.fecha);
      const entradas = parseInt(item.entradas, 10);
      acc[monthString] = (acc[monthString] || 0) + entradas;
      return acc;
    }, {});

    // Asegurarse de que todas las fechas tengan datos, y rellenar con 0 si faltan
    const allDates = Array.from(new Set(jsonData.datos.map(item => formatDate(item.fecha)))).sort();
    const limitedDates = allDates.slice(0, 20);


    const dataForSeries = limitedDates.map(date => groupedData[date] || 0);
    chartSeries.value = [{
      name: `Plaza ${selectedPlazaIdId.value}`,
      data: dataForSeries
    }];

    //chartOptions.value.xaxis.categories = allDates;
    chartOptions.value = {...chartOptions.value, ...{
      xaxis: {
        categories : limitedDates
      }
    }}
  }

};


// Función para filtrar los datos por rango de fechas
const filterDataByDate = () => {

  if (!date.value || date.value.length !== 2) {
    processData(); // Si no hay rango de fechas, mostrar todos los datos
    return;
  }

  const [startDate, endDate] = date.value;

  dateFormatStore.setDateFormat(startDate,endDate);

  //console.log(dateFormatStore.Rangofechas)

  let allDates = new Set();

  if (selectedPlazaIdId.value === "all") {

    const seriesData = availablePlazas.map(plazaId => {
      const filteredData = jsonData.datos.filter(item => {
        const itemDate = dayjs(item.fecha);
        return itemDate.isBetween(startDate,endDate, null, '[]') && item.plaza_id == plazaId;
      });

      filteredData.forEach(item => {
      const monthString = formatDate(item.fecha);
        allDates.add(monthString);
      });

      const sortedDates = Array.from(allDates).sort();

      const groupedData = filteredData.reduce((acc, item) => {
          const monthString = formatDate(item.fecha);
          const entradas = parseInt(item.entradas, 10);
          acc[monthString] = (acc[monthString] || 0) + entradas;
          return acc;
      }, {});

        // Asegurarse de que todas las fechas tengan datos, y rellenar con 0 si faltan
      const dataForSeries = sortedDates.map(date => groupedData[date] || 0);

      return {
        name: `Plaza ${plazaId}`,
        data: dataForSeries
      };
    }
    );

    chartSeries.value = seriesData;

    //chartOptions.value.xaxis.categories = Array.from(allDates).sort();
    chartOptions.value = {...chartOptions.value, ...{
      xaxis: {
        categories : Array.from(allDates).sort()
      }
    }}

  }
  else {

    const filteredData = jsonData.datos.filter(item => {
      const itemDate = dayjs(item.fecha);
      return itemDate.isBetween(startDate, endDate, null, '[]') && item.plaza_id == selectedPlazaIdId.value;
    });

    filteredData.forEach(item => {
      const monthString = formatDate(item.fecha);
      allDates.add(monthString);
    });

    const sortedDates = Array.from(allDates).sort();

    const groupedData = filteredData.reduce((acc, item) => {
      const monthString = formatDate(item.fecha); // Agrupar por mes
      const entradas = parseInt(item.entradas, 10);
      acc[monthString] = (acc[monthString] || 0) + entradas;
      return acc;
    }, {});

    const dataForSeries = sortedDates.map(date => groupedData[date] || 0);

    // Asignar los datos de la serie al gráfico
    chartSeries.value = [{
      name: `Plaza ${selectedPlazaIdId.value}`,
      data: dataForSeries
    }];

    //chartOptions.value.xaxis.categories = sortedDates;
    chartOptions.value = {...chartOptions.value, ...{
      xaxis: {
        categories : Array.from(allDates).sort()
      }
    }}

  }
};
// Cargar los datos JSON al montar el componente
processData();


// Monitorea cambios en selectedPlazaIdId
watch([selectedPlazaIdId,selectedView,date], () => {
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
      plazaData[cur.plaza_id] = parseInt(cur.entradas);
    }
  });


  // Devolver las entradas como serie
  return Object.values(plazaData);
});

// Generar los labels para la gráfica de pie
const piechartLabels = computed(() => {
  const plazaLabels = {};

  // Agrupar los nombres de las plazas
  piefilteredData.value.forEach((cur) => {
    plazaLabels[cur.plaza_id] = `Plaza ${cur.plaza_id}`; // Crea una etiqueta para cada plaza
  });

  return Object.values(plazaLabels); // Retorna los labels como array
});


// Configuración de opciones para la gráfica
const piechartOptions = ref({
  chart: {
    type: 'pie',
  },
  labels: piechartLabels.value
});
</script>