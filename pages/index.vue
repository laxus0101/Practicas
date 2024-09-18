<template>

    <div class="centrado">
      <h2 >menu pdf pendiente</h2>
    </div>
    <div class="centrado">
        <pdfviewer/>
      </div>
</template>

<script setup>
import pdfviewer from '~/components/pdfviewer.vue';

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