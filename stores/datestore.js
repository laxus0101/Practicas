import { defineStore } from "pinia";

export const usedatepciker = defineStore({
    id: 'daterange',
    state: () => ({
    dateformat: "",
    }),
    actions: {
    datesaved(dateformat){
        this.dateformat = dateformat
    }
    },
    persist: {
    storage: persistedState.localStorage,
    }
})

