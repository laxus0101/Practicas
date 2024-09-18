<template>
    <div id="contenedorprincial">

      <div class="centrar" >
        <DataTable :data="data1" :columns="columns1" :options="options1"></DataTable>
      </div>
      <div class="centrar" >
        <button @click="exportData('json')">Exportar como JSON</button>
      </div>
    </div>

</template>
  
<script setup>
  import exportFromJSON from 'export-from-json'
  import { ref, onMounted } from 'vue'
  import DataTable from 'datatables.net-vue3'
  import Select from 'datatables.net-select'



  DataTable.use(Select)

  const columns1 = ref([
    {title:"Id", data:"id"},
    {title:"Name", data:"name"},
    {title:"Price", data:"price"},

  ])
  
  const data1 = ref([
    { id: 1, name: 'Producto 1', price: 100 },
    { id: 2, name: 'Producto 2', price: 200 },
    { id: 3, name: 'Producto 3', price: 300 },
  ])


  const options1 = ref({
    select: true, 
    responsive: true,
  })
  
  const exportData = (fileType) => {
    const fileName = 'productos'
    exportFromJSON({ data1, fileName, exportType: fileType })
  }
</script>

<style>
.centrar{
    display: flex;
    justify-content: center;
    margin: 2%  ;
}
#contenerdorprincipal{
    display: flex;
    flex-direction: column;
}
</style>
  