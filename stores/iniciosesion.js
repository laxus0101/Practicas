import { defineStore } from 'pinia'

export const useMyIniciosesionStore = defineStore({
  id: 'myIniciosesionStore',
  state: () => ({
    correo: "",
  }),
  actions: {
    guardarcorreo(correo){
      this.correo = correo
    },
    clearemail(){
      this.correo = ""
    }
  },
  persist: {
    storage: persistedState.localStorage,
  }
})
