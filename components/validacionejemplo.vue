<script setup>
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: ''
})

const rules = {
  name: { required },
  email: { required, email }
}

// Instanciar Vuelidate
const validations = useVuelidate(rules, form)

const submitForm = () => {
  validations.value.$touch() // Activa las validaciones
  if (!validations.value.$invalid) {
    alert('Formulario válido')
  } else {
    alert('Formulario inválido')
  }
}
</script>

<template>
  <div id="formprueba">
    <form @submit.prevent="submitForm">
      <div>
        <label for="name">Name:</label>
        <input v-model="form.name" type="text" id="name" />
        <span v-if="validations.name.$error">Name is required.</span>
      </div>
      <div>
        <label for="email">Email:</label>
        <input v-model="form.email" type="email" id="email" />
        <span v-if="validations.email.$error">Enter a valid email address.</span>
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>


<style>
#formprueba{
    display: flex;
    justify-content: center;
    margin-top: 2%;
    margin-bottom: 2%
}
</style>