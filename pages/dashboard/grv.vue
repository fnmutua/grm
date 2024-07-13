<template>
  <div class="grid grid-cols-1 md:grid-cols-12 gap-4 py-4">


    <!-- Side Navigation for medium and larger screens -->
    <div class="col-span-2 md:block">
      <AdminSideNav2></AdminSideNav2>
    </div>

    <!-- Main Content -->
    <div class="col-span-1 md:col-span-10 pt-94">
      
       <MapboxMap
        map-id="map2"
        style="width:80%; width:80%;"  
        :options="{
          style: isDark ? 'mapbox://styles/agspatial/clqcfzcoa00bt01nwhmf465f7' : 'mapbox://styles/mapbox/light-v11', // style URL
          center: [39.075219, 0.26921], // starting position
          zoom: 5 // starting zoom
        }"
        @load="onMapLoad"
      >

        <MapboxLayer :layer="{
          id: 'geojson-layer',
          type: 'circle',
          source: 'geojson-source',
          paint: {
            'circle-radius': 6,
            'circle-color': '#B42222'
          }
        }" />

        <MapboxGeolocateControl position="top-left" />
        <MapboxNavigationControl />

      </MapboxMap>

    </div>
  </div>



</template>


<script setup>
definePageMeta({
  // layout: "landing",
});

import { ref, computed, watch } from 'vue';
import { useMapboxMarkerRef, useMapboxPopup, useMapboxPopupRef, useMapboxRef } from "#imports"

import axios from 'axios';


const isDarkMode = ref(false);
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

// Watch the computed property `isDark`
watch(isDark, (newValue, oldValue) => {
  console.log('isDark changed from', oldValue, 'to', newValue);
  // Perform any additional actions you need when `isDark` changes
});


 

const filter_fields = ref([])
const filter_values = ref([])
const geojson = ref([])


async function convertToGeoJSON(grievances) {
  return {
    type: "FeatureCollection",
    features: grievances.map(grievance => ({
      type: "Feature",
      properties: {
        status: grievance.status,
        grievance_code: grievance.grievance_code
      },
      geometry: grievance.geometry
    }))
  };
}


geojson.value = await convertToGeoJSON(await getMap())
async function getMap() {

  try {
    const response = await axios.post('/api/summary/map', {
      filter_fields: filter_fields.value, filter_values: filter_values.value
    });

    if (response.data.code === '0000') {
      //count[status] = response.data.data.length;
      console.log('Map', response.data.result.grievances)

      let res = response.data.result.grievances

      return res;

    }
  } catch (error) {
    console.error('Error during login:', error.message);
    return null
    // Handle error, maybe show an error message to the user
  }
}
 

console.log('geojson.value', geojson.value)


function onMapLoad(map) {
  // Add the GeoJSON source to the map
  map.addSource('geojson-source', {
    type: 'geojson',
    data: geojson.value
  });

  // Add the GeoJSON layer to the map
  map.addLayer({
    id: 'geojson-layer',
    type: 'circle',
    source: 'geojson-source',
    paint: {
      'circle-radius': 6,
      'circle-color': '#B42222'
    }
  });
}

</script>

<style scoped>
.el-table th {
  color: black;
}
</style>

<style scoped>
.checkbox-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  /* Adjust the gap between columns as needed */
}

.italic {
  font-style: italic;
}

.highlight {
  font-weight: bold;
  color: green;
  margin-bottom: 20px;
}
</style>
