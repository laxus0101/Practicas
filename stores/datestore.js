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