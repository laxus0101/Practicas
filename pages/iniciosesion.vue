<template>

  <div class="flex flex-col items-center justify-center 
  bg-gray-50 dark:bg-gray-900 pt-2">
      <NuxtLink to="/" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          Iniciar Sesion    
      </NuxtLink>
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8 mb-4">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  
              </h1>
              <form class="space-y-4 md:space-y-6" @submit.prevent="submitForm">
                  <div>
                      <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input v-model="form.email" type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com">
                      <span v-if="isTouched.email & validations.email.$error">Enter a valid email address. </span>
                  </div>
                  <div>
                      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input v-model="form.password" type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                      <span v-if="isTouched.password & validations.password.$error">password is required.</span>
                  </div>
<!--                   <div>
                      <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                      <input type="password" name="confirm-password" id="confirm-password" 
                      placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="">
                  </div> -->
                  <div class="flex items-start">
                      <div class="flex items-center h-5">
                        <input id="terms" aria-describedby="terms" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="">
                      </div>
                      <div class="ml-3 text-sm">
                        <label for="terms" class="font-light text-gray-500 dark:text-gray-300">I accept the <a class="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                      </div>
                  </div>
                  <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Iniciar sesion</button>
                  <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                      Already have an account? <a href="#" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a>
                  </p>
              </form>
          </div>
      </div>
      <div class="bg-gray-50 dark:bg-gray-900 p-3"></div>
  </div>

</template>

<script setup>
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { reactive } from 'vue'

import { useMyIniciosesionStore } from '~/stores/iniciosesion';

const form = reactive({
  password: '',
  email: ''
})

const isTouched = {
  email: ref(false),
  password: ref(false)
};

const rules = {
  password: { required },
  email: { required, email }
}



// Instanciar Vuelidate
const validations = useVuelidate(rules, form)

watch(validations, (newValidations) => {
  newValidations.$touch();
});

const storeemail = useMyIniciosesionStore()

const submitForm = () => {
  //los marca como tocados
  isTouched.email.value = true;
  isTouched.password.value = true;
  
  validations.value.$touch() // Activa las validaciones
  if (!validations.value.$invalid) {
    //guarda on pinia el correo
    storeemail.guardarcorreo(form.email)
    //limpia los campos
    form.email = '';
    form.password = '';
    //forzar reset de validaciones
    validations.value.$reset();
    alert('Formulario válido')
  } else {
    alert('Formulario inválido')
  }
}
</script>