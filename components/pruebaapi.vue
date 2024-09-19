<template>
  <div>
    <h1 class="text-center mt-5" >Productos</h1>
    <div v-if="error" class="text-red-500">Error al cargar los productos: {{ error.message }}</div>
    <div v-else-if="pending" class="text-blue-500">Cargando productos...</div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-6">
      <div v-for="product in products" :key="product.id" class="border rounded-lg p-4 shadow-md hover:shadow-lg">
        <img :src="product.image" :alt="product.title" class="w-full h-48 object-cover mb-4" />
        <h2 class="text-lg font-semibold mb-2">{{ product.title }}</h2>
        <p class="text-gray-700 mb-2">Precio: ${{ product.price }}</p>
        <p class="text-gray-600">{{ product.category }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: products, pending, error } = await useFetch('https://fakestoreapi.com/products');


</script>

