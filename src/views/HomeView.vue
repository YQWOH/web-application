<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input
        type="text"
        v-model="searchQuery"
        @input="getSearchResults"
        placeholder="Search for a city or state"
        class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]"
      />
    
      <ul
        class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]"
        v-if="mapboxSearchResults"
      >
        <p v-if="searchError"> 
          Sorry, something went wrong, please try again.
        </p>
        <p v-if="!serverError && mapboxSearchResults.length === 0"> 
          No results match your query, try a different term.
        </p>
        <template v-else>
          <li
            v-for="searchResult in mapboxSearchResults"
            :key="searchResult.id"
            class="py-2 cursor-pointer"
            @click="previewCity(searchResult)"
          >
            {{ searchResult.place_name }}
          </li>
        </template>
      </ul>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList />
        <template #fallback>
          <CityCardSkeleton />
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script>
// import { ref } from "vue"
import axios from "axios"
import { useRouter } from "vue-router";
import CityList from "../components/CityList.vue";
import CityCardSkeleton from "../components/CityCardSkeleton.vue";
import { useWeatherStore } from "../stores/weather.js";
// import { storeToRefs } from 'pinia's
import { mapState } from "pinia"

export default {
  components: { CityList, CityCardSkeleton },
  data() {
    return {
      router: useRouter(),
      mapboxAPIKey: "",
      // mapboxAPIKey: "pk.eyJ1Ijoic3RldmVud29oIiwiYSI6ImNsaG40YWJ0YjFodzIzc3Fvb2IxMGQ2bHgifQ.GKkU_RjN9_tXt2w6TyfYjw",
      searchQuery: "",
      queryTimeout: null,
      mapboxSearchResults: null,
      searchError: null
    };
  },
  mounted() {
    this.mapboxAPIKey = this.getAPIKeyByName("mapbox").apiKey;
    console.log("this.mapboxAPIKey: ", this.mapboxAPIKey);
  },
  methods: {
    previewCity (searchResult) {
      console.log(searchResult);
      const [city, state] = searchResult.place_name.split(",");
      this.router.push({
        name: 'cityView',
        params: { state: state.replaceAll(" ", ""), city: city }, 
        query: {
            lat: searchResult.geometry.coordinates[1],
            lng: searchResult.geometry.coordinates[0],
            preview: true
        }
      })
    },
    getSearchResults() {
      clearTimeout(this.queryTimeout)
      this.queryTimeout = setTimeout(async () => {
        if (this.searchQuery !== "") {
          try{
            const result = await axios.get(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.searchQuery}.json?access_token=${this.mapboxAPIKey}&types=place`
            );
            this.mapboxSearchResults = result.data.features;
          } catch {
            this.searchError = true;
          }
          return;
        }
        this.mapboxSearchResults = null;
      }, 300)
    }
  },
  computed: {
        ...mapState(useWeatherStore, ["getAPIKeyByName"]),
        ...mapState(useWeatherStore, ["apiKey"]),
  },
}
</script>

