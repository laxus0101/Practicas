import { defineStore } from "pinia";

export const usedatepciker = defineStore({
    id: 'daterange',
    state: () => ({
    date: "",
    }),
    actions: {
    datesaved(date){
        this.date = date
    }
    },
    persist: {
    storage: persistedState.localStorage,
    }
})

//buscar como usar pinia correctamente, agregar una grafica de pie y agregar opcion para filtrar por mes
