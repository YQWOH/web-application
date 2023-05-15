import { defineStore } from "pinia";

export const useWeatherStore = defineStore({
  id: "weather",
  state: () => ({
    apiKey: [
      { name: "mapbox",  apiKey:"pk.eyJ1Ijoic3RldmVud29oIiwiYSI6ImNsaG40YWJ0YjFodzIzc3Fvb2IxMGQ2bHgifQ.GKkU_RjN9_tXt2w6TyfYjw" },
      { name: "openWeather", apiKey: "93f812e5cc21d11b651379417f452fb5" }
    ]
    // items: [
    //     { id: 1, name: "Do coding homework", completed: true },
    //     { id: 2, name: "Do coding assignment", completed: false },
    // ]
  }),
  getters: {
    getAPIKeyByName(state) {
      return (name) => state.apiKey.find((key) => key.name === name)
    },
    // uncompleted() {
    //   return this.items.filter(obj => !obj.completed)
    // }
  },
  actions: {
    addItem(item) {
      if(item) {
          let obj = { id: this.items.length+1, name: item, completed: false }
          this.items.push(obj);
      }
    },
    removeItem(id){
      this.items =  this.items.filter((obj) => { 
        return obj.id !== id
      });
    }
  }
})
