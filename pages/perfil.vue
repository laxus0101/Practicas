<template>
  <div>
    {{userEmail}}
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMyIniciosesionStore } from '~/stores/iniciosesion';
const store = useMyIniciosesionStore();
const userEmail = computed(() => store.correo);
</script>

<style>

</style>