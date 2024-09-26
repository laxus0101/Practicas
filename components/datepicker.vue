<!-- <template>
    <div>
      <label for="date">Select a date:</label>
      <Datepicker
        v-model="selectedDate"
        id="date"
        format="DD/MM/YYYY"
        placeholder="Select date"
      />
      <p>Selected Date: {{ selectedDate }}</p>
    </div>
</template> -->

<script setup>
import { ref } from 'vue'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const selectedDate = ref(null)
</script>



<template>
    <div>
        <label for="date">Select a date:</label>
        <Datepickerss
        v-model="selectedDate"
        placeholder="select date"
        />
        <p>Selected Date: {{ selectedDate }}</p>
    </div>
</template>
