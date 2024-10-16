import { defineStore } from 'pinia';

export const useDateFormatStore = defineStore({
    id: 'dateFormatStore',
    state: () => ({
    Rangofechas:[]
    }),
    actions: {
    setDateFormat(StartDate,EndDate) {
        //this.Rangofechas = [StartDate,EndDate]
        this.Rangofechas=[StartDate,EndDate]
    },
    clearDateFormat() {
        this.Rangofechas = []
        }
    },
    persist: {
    storage: persistedState.localStorage, // Guarda en localStorage
    }
});
