<template>
<div id="contenedorprincials">

<div class="centrar">
  <DataTable :data="data1" :columns="columns1" :options="options1"></DataTable>
</div>

<!-- Botones de exportación -->
<div class="centrar">
  <button @click="exportData('json')" class="bg-blue-500 text-white p-2 rounded">Exportar como JSON</button>
</div>
<div class="centrar">
  <button @click="exportData('csv')" class="bg-green-500 text-white p-2 rounded">Exportar como CSV</button>
</div>

<!-- Input para cargar un archivo CSV -->
<div class="centrar mt-4">
  <input type="file" ref="fileInput" @change="handleFileUpload" />
</div>



<div v-if="showtable && csvData.length > 0" class="flex flex-col items-center mt-4 space-y-4">
  <h3 class="text-center">Datos cargados desde el archivo CSV:</h3>
  <div class="w-auto">
    <DataTable :data="csvData" :columns="csvColumns" :options="csvOptions"></DataTable>
  </div>

  <div class="centrar">
  <button @click="quitardatos" class="bg-red-500 text-white p-2 rounded">Quitar tabla</button>

</div>

</div>

</div>

</template>


<script setup>
import exportFromJSON from 'export-from-json'
import Papa from 'papaparse'
import { ref } from 'vue'
import DataTable from 'datatables.net-vue3'
import Select from 'datatables.net-select'

// Activa el uso de Select en DataTables
DataTable.use(Select)


const columns1 = ref([
  { title: "Id", data: "id" },
  { title: "Name", data: "name" },
  { title: "Price", data: "price" }
])

const data1 = ref([
  { id: 1, name: 'Producto 1', price: 100 },
  { id: 2, name: 'Producto 2', price: 200 },
  { id: 3, name: 'Producto 3', price: 300 }
])

const options1 = ref({
  select: true,
  responsive: true,
})




// Función para exportar datos en diferentes formatos (JSON o CSV)
const exportData = (fileType) => {
  const fileName = 'productos'
  
  // Verificamos si el formato es 'csv' o 'json'
  const exportType = fileType === 'csv' ? 'csv' : 'json'

  // Exportamos los datos
  exportFromJSON({
    data: data1.value,  // Usamos data1.value ya que es reactivo
    fileName,
    exportType,
  })
}


const csvData = ref([])
const csvColumns = ref([])     // Almacena las columnas del CSV
const csvOptions = ref({
  responsive: true,
  select: true,
})

const showtable =ref(1)

// Función para manejar la carga de un archivo CSV
const handleFileUpload = (event) => {
  const file = event.target.files[0]


  if (file) {
    Papa.parse(file, {
      header: true,  // Procesar el CSV con encabezados
      complete: (result) => {
        csvData.value = result.data  // Guardar los datos del CSV
        // Configurar las columnas para la tabla DataTables.net
        csvColumns.value = Object.keys(result.data[0]).map(key => ({
          title: key.charAt(0).toUpperCase() + key.slice(1),
          data: key
        }))
        showtable.value =1
      },
      error: (error) => {
        console.error('Error leyendo el archivo CSV:', error)
      }
    })
  }
}

const fileInput = ref(null)

// Función para ocultar la tabla y limpiar la selección del archivo
const quitardatos = () => {
  showtable.value = 0  // Ocultar la tabla
  csvData.value = []  // Limpiar los datos del CSV
  csvColumns.value = []  // Limpiar las columnas
  // Limpiar el campo de selección de archivo sin usar jQuery
  if (fileInput.value) {
    fileInput.value.value = ""  // Limpiar el valor del archivo seleccionado
  }
}


</script>

<style>
.centrar {
  display: flex;
  justify-content: center;
  margin: 2%;
}
#contenedorprincial {
  display: flex;
  flex-direction: column;
}
</style>