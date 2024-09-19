<template>
  <div class="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500">
    <div v-if="store.correo" class="max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-14 ">
      <div class="sm:flex sm:items-center px-6 py-4">
        <img class="block mx-auto sm:mx-0 sm:shrink-0 h-16 w-16 rounded-full"
            src="https://via.placeholder.com/150"
            alt="User avatar">
        <div class="mt-4 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <p class="text-xl leading-tight">Emmanuel Gaona</p>
          <p class="text-sm leading-tight text-gray-600"> {{userEmail}}</p>
          <div class="mt-4">
            <p class="text-gray-600">Desarrollador apasionado por la tecnología, amante de Vue.js y Nuxt. Siempre en busca de nuevos desafíos.</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-14 ">
      <h3 class="text-center">no hay correo registrado</h3>
      <h2 class="text-center">Favor de iniciar sesion</h2>
    </div>
  </div>

</template>

<script setup>
import { computed } from 'vue';
import { useMyIniciosesionStore } from '~/stores/iniciosesion';
const store = useMyIniciosesionStore();
const userEmail = computed(() => store.correo);
</script>