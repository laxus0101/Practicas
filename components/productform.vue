<template>
  <div class="bg-gray-100 pb-4">
    <div class="max-w-xl mx-auto mt-8">
      <h1 class="text-2xl font-bold mb-4">Formulario de Comidas 2</h1>
      <form @submit.prevent="addToOrder">
        <div class="mb-4">
          <label for="foodSelect" class="block text-gray-700 font-medium mb-2">Selecciona una comida:</label>
          <select v-model="selectedFood" id="foodSelect" class="block w-full border border-gray-300 rounded-md p-2">
            <option v-for="food in foods" :key="food.name" :value="food">
              {{ food.name }} - ${{ food.price.toFixed(2) }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label for="quantity" class="block text-gray-700 font-medium mb-2">Cantidad:</label>
          <input type="number" v-model.number="quantity" id="quantity" class="block w-full border border-gray-300 rounded-md p-2" min="1">
        </div>

        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Agregar al Pedido</button>
      </form>

      <h2 class="text-xl font-semibold mt-8 mb-4">Resumen del Pedido</h2>
      <ul class="space-y-2">
        <li v-for="(item, index) in cart.order" :key="index" class="bg-white p-3 rounded-md shadow">
          {{ item.name }} - {{ item.quantity }} x ${{ item.price.toFixed(2) }} = ${{ (item.price * item.quantity).toFixed(2) }} MXN
        </li>
      </ul>

      <p class="mt-4 text-lg">Total: ${{ cart.total.toFixed(2) }} MXN</p>
      <button class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-4" @click="confirmOrder">Confirmar Pedido</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCarStore } from '@/stores/usecarestore'

// Definimos las comidas disponibles
const foods = [
  { name: 'Pizza', price: 10 },
  { name: 'Hamburguesa', price: 15 },
  { name: 'Tacos', price: 8 },
  { name: 'Sushi', price: 12 },
  { name: 'Ensalada', price: 5 },
  { name: 'Papas Fritas', price: 7 },
  { name: 'Hot Dog', price: 9 },
  { name: 'Sandwich', price: 6 },
  { name: 'Burrito', price: 14 },
  { name: 'Nachos', price: 11 }
]

// Variables locales
const selectedFood = ref(foods[0])
const quantity = ref(1)

// Obtenemos el store del carrito de Pinia
const cart = useCarStore()

// Agregar el ítem al carrito
function addToOrder() {
  const foodItem = {
    name: selectedFood.value.name,
    price: selectedFood.value.price,
    quantity: quantity.value
  }
  cart.addproducts(foodItem)
  quantity.value = 1 // Reiniciamos la cantidad a 1 después de agregar
}

// Confirmar el pedido
function confirmOrder() {
  cart.confirmorder()
}
</script>

<style scoped>
/* Puedes agregar estilos adicionales si es necesario */
</style>
