<script setup>
import datepicker from '~/components/datepicker.vue';
import Exportarjson from '~/components/exportarjson.vue';
import Spin from '~/components/spin.vue';
import Tablas from '~/components/tablas.vue';
import canvashtml from '~/components/canvashtml.vue';
import papaparse from '~/components/papaparse.vue';
</script>

<template>

    <div style="display: flex; justify-content: center; margin: 3%; background-color: lightslategrey; ">
        <h1>DATES</h1>
    </div>

    <div class="separar">
        <datepicker/>
    </div>

    <div style="display: flex; justify-content: center; margin: 3%; background-color: lightslategrey; ">
        <h1>TABLAS</h1>
    </div>

    <div class="separar">
        <Tablas/>
    </div>

    <div style="display: flex; justify-content: center; margin: 3%; background-color: lightslategrey; ">
        <h1>spinner</h1>
    </div>

    <div class="separar">
        <Spin/>
    </div>

    <div style="display: flex; justify-content: center; margin: 3%; background-color: lightslategrey; ">
        <h1>Exportar JSON</h1>
    </div>

    <div id="separar">
        <Exportarjson/>
    </div>

    <div style="display: flex; justify-content: center; margin: 3%; background-color: lightslategrey; ">
        <h1>Html canvas</h1>
    </div>

    <div class="separar">
        <canvashtml/>
    </div>

    <div style="display: flex; justify-content: center; margin: 3%; background-color: lightslategrey; ">
        <h1>siguiente</h1>
    </div>

    <div>
        <papaparse/>
    </div>


</template>

<style>
.separar{
    display: flex;
    justify-content: center;

}

</style>