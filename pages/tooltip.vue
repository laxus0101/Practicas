<template>
    <Popper1/>

    <apexchartsjson/>

</template>

<script setup>
import Popper1 from '~/components/popper1.vue';
import apexchartsjson from '~/components/apexchartsjson.vue';

useHead({
    titleTemplate:'%s tooltip'
  })

</script>