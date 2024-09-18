<template>
    <div class="spinner-container">
      <AtomSpinner :animation-duration=1000 color="#FF4500" :size="100"></AtomSpinner>
    </div>
  </template>
  
  <script>
  import { AtomSpinner } from 'epic-spinners'
  
  export default {
    components: {
      AtomSpinner
    }
  }
  </script>
  
  <style>
  .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
  }
  </style>
  