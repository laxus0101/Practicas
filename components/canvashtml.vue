<template>
    <div class="flex flex-col items-center justify-center h-screen space-y-4">
      <div ref="capture" class="p-4 bg-gray-200 rounded shadow-md w-64 text-center">
        <h2 class="text-lg font-semibold">Tarjeta de información</h2>
        <p>Este es un ejemplo de contenido que será capturado.</p>
      </div>
      <button @click="captureElement" class="bg-blue-500 text-white p-2 rounded">
        Capturar Tarjeta
      </button>
      <div v-if="imageUrl" class="mt-4 ">
        <h3>Imagen generada:</h3>
        <img :src="imageUrl" alt="Captura de pantalla" />

        <button @click="removeelement" class="bg-red-500 text-white p-2 rounded mt-2 ">
        Quitar Imagen
      </button>
      </div>
    </div>
  </template>


<script setup>
import { ref } from 'vue'
import html2canvas from 'html2canvas'

const imageUrl = ref(null)
const capture = ref(null)

const captureElement = () => {

  html2canvas(capture.value).then(canvas => {
    // Convertimos el canvas a una URL de imagen
    imageUrl.value = canvas.toDataURL('image/png')
  })
}


const removeelement = () => {
    imageUrl.value = null
}
</script>


