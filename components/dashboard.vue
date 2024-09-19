<template>
  <aside class="h-screen bg-gray-800 text-white"> <!-- w-64 -->
    <div class="p-4 text-2xl font-bold">
      Dashboard
    </div>
    <nav class="mt-10">
      <ul>
        <li>
          <NuxtLink to="#" class="block py-2.5 px-4 rounded hover:bg-gray-700">
            Productos en linea
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/perfil" class="block py-2.5 px-4 rounded hover:bg-gray-700">
            Profile
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="#" class="block py-2.5 px-4 rounded hover:bg-gray-700">
            Settings
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="#" class="block py-2.5 px-4 rounded hover:bg-gray-700">
            Logout
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { useMyIniciosesionStore } from '~/stores/iniciosesion';

const borrar = useMyIniciosesionStore()



</script>
