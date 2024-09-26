<template>

    <div class="centrado">
      <h2 >menu pdf pendiente</h2>
      <h2 >Prueba2</h2>
      <h3>prueba 3</h3>
    </div>
    <div class="centrado">
        <pdfviewer/>
    </div>

    <div class="flex justify-center" ><datepicker1/></div>

</template>

<script setup>
import pdfviewer from '~/components/pdfviewer.vue';
import datepicker1 from '~/components/datepicker1.vue';

  useHead({
    titleTemplate:'%s pagina principal'
  })
</script>
<style>
.centrado{
  display: flex;
  justify-content: center;
}
</style>