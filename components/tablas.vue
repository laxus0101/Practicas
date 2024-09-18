<template>
    <div>
    <DataTable :data="tableData" :columns="columns" :options="options"></DataTable>
    </div>


</template>
  
<script setup>
  import { ref, onMounted } from 'vue'
  import DataTable from 'datatables.net-vue3'
  import Select from 'datatables.net-select'


  import 'datatables.net-dt/css/jquery.dataTables.css'




  DataTable.use(Select)


  // Definir las columnas
  const columns = ref([
  { title: 'Name', data: 'name' },
  { title: 'Position', data: 'position' },
  { title: 'Office', data: 'office' },
  { title: 'Age', data: 'age' },
  { title: 'Start date', data: 'startDate' },
  { title: 'Salary', data: 'salary' },
  ])

  // datos
  const tableData = ref([
    { name: 'Tiger Nixon', position: 'System Architect', office: 'Edinburgh', age: 61, startDate: '2011/04/25', salary: '$320,800' },
    { name: 'Garrett Winters', position: 'Accountant', office: 'Tokyo', age: 63, startDate: '2011/07/25', salary: '$170,750' },
    { name: 'Ashton Cox', position: 'Junior Technical Author', office: 'San Francisco', age: 66, startDate: '2009/01/12', salary: '$86,000' },
    { name: 'Cedric Kelly', position: 'Senior Javascript Developer', office: 'Edinburgh', age: 22, startDate: '2012/03/29', salary: '$433,060' },

  ])

  // Opciones para DataTables
  const options = ref({
    select: true,
    paging:true,
    responsive: true,
  })

</script>
  