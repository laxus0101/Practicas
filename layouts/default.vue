<template>


<div class="flex min-h-screen">
  <div class="w-2/12">
    <div class="fixed w-2/12 h-screen flex-col">
      <dashboard />
    </div>
  </div>
  <div class="w-10/12 flex flex-col">
    <Navbar />
    <NuxtPage />
  </div>
</div>
<div class="flex">
  <div class="w-2/12"></div>
  <div id="footer" class="w-10/12 text-center bg-slate-800">
    &copy; Emmanuel Gaona - {{ currentyear }}
  </div>
</div>




</template>

<script setup>

  import { useDayjs } from '#imports';
  import Navbar from '~/components/navbar.vue';
  import dashboard from '~/components/dashboard.vue';
  const dayjs = useDayjs()

  const currentyear = dayjs().format('YYYY')

</script>

<style>
#footer{
  display: flex;
  justify-content: center;
}
</style>
