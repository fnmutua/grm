 

<template>
  <div class="grid grid-cols-1 md:grid-cols-12 gap-4 py-10">
     

    <!-- Side Navigation for medium and larger screens -->
    <div  class="col-span-2 md:block">
      <AdminSideNav2></AdminSideNav2>
    </div>

    <!-- Main Content -->
    <div class="col-span-1 md:col-span-10 p-4">
      <MapboxMap
      map-id="map2"
      style="  width: 80%;"
      :options="{
        style: isDark?'mapbox://styles/agspatial/clqcfzcoa00bt01nwhmf465f7': 'mapbox://styles/mapbox/light-v11', // style URL
        center: [39.075219, 0.26921], // starting position
        zoom: 5 // starting zoom
      }"
   >
        

      <MapboxDefaultMarker
        marker-id="customHTMLMarker"
        :lnglat="{ lng: 37, lat: 1 }"
        :options="{
          draggable: true
        }"
      />
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
import {  useMapboxMarkerRef, useMapboxPopup, useMapboxPopupRef, useMapboxRef} from "#imports"

import axios from 'axios';
  

 const isDarkMode = ref(false);
 const colorMode = useColorMode()

 const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

    // Watch the computed property `isDark`
    watch(isDark, (newValue, oldValue) => {
      console.log('isDark changed from', oldValue, 'to', newValue);
      // Perform any additional actions you need when `isDark` changes
    });  


   const source = {
    type: 'geojson',
    data: {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        // These coordinates outline Maine.
        'coordinates': [
          [
            [-67.13734, 45.13745],
            [-66.96466, 44.8097],
            [-68.03252, 44.3252],
            [-69.06, 43.98],
            [-70.11617, 43.68405],
            [-70.64573, 43.09008],
            [-70.75102, 43.08003],
            [-70.79761, 43.21973],
            [-70.98176, 43.36789],
            [-70.94416, 43.46633],
            [-71.08482, 45.30524],
            [-70.66002, 45.46022],
            [-70.30495, 45.91479],
            [-70.00014, 46.69317],
            [-69.23708, 47.44777],
            [-68.90478, 47.18479],
            [-68.2343, 47.35462],
            [-67.79035, 47.06624],
            [-67.79141, 45.70258],
            [-67.13734, 45.13745]
          ]
        ]
      }
    }
  }
    
const filter_fields =ref([])
const filter_values =ref([])
const geojson =ref([])


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


geojson.value = await convertToGeoJSON (await getMap())
 async function getMap() {

  try {
    const response = await axios.post('/api/summary/map', {
      filter_fields:filter_fields.value,filter_values:filter_values.value
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

let geoJSON2 = {
    "type": "Feature",
    "properties": {
        "status": "Investigate",
        "grievance_code": "GRM-2024-001"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [
            36.9130700074862,
            -1.304657930535846
        ]
    }
}


console.log('geojson.value',geojson.value  )
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

