<template>
    <div v-for="city in savedCities" :key="city.id">
      <CityCard :city="city" @click="goToCityView(city)" />
    </div>
  
    <p v-if="savedCities.length === 0">
      No locations added. To start tracking a location, search in
      the field above.
    </p>
  </template>
  
  <script>
  import axios from "axios";
  // import { ref } from "vue";
  import { useRouter } from "vue-router";
  import CityCard from "./CityCard.vue";
  import { useWeatherStore } from "../stores/weather.js";
  import { mapState } from "pinia";

  export default {
    components: { CityCard },
    data() {
      return {
        savedCities: [],
        router: useRouter(),
        openWeatherAPIKey: ""
      };
    },
    async mounted() {
      this.openWeatherAPIKey = this.getAPIKeyByName("openWeather").apiKey;
      console.log("this.openWeatherAPIKey: ", this.openWeatherAPIKey);
      await this.getCities();
    },
    methods: {
      async getCities() {
        if (localStorage.getItem("savedCities")) {
          this.savedCities = JSON.parse(localStorage.getItem("savedCities"));
          const requests = [];
          this.savedCities.forEach((city) => {
            requests.push(
              axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=${this.openWeatherAPIKey}&units=imperial`
              )
            );
          });
        
          const weatherData = await Promise.all(requests);
        
          weatherData.forEach((value, index) => {
            this.savedCities[index].weather = value.data;
          });
          console.log("this.savedCities: ", this.savedCities);
        }
      },
      goToCityView(city) {
        this.router.push({
          name: "cityView",
          params: { state: city.state, city: city.city },
          query: {
            id: city.id,
            lat: city.coords.lat,
            lng: city.coords.lng,
          },
        });
      }
    },
    computed: {
      ...mapState(useWeatherStore, ["getAPIKeyByName"]),
      ...mapState(useWeatherStore, ["apiKey"]),
    },
  }
</script>