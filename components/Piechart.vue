<template>
    <div class="flex justify-center pt-8">
      <ClientOnly>
        <ApexChart
          type="pie"
          :options="piechartOptions"
          :series="piechartSeries"
        />
      </ClientOnly>
    </div>
</template>

<script setup>
import { ref,} from 'vue';
import ApexChart from 'vue3-apexcharts';
import dayjs from 'dayjs';
import jsonData from './jsonpogen/junioAV.json';
import '@vuepic/vue-datepicker/dist/main.css';




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



