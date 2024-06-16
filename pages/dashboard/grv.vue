 

<template>
  <div class="grid grid-cols-1 md:grid-cols-12 gap-4 py-10">
     

    <!-- Side Navigation for medium and larger screens -->
    <div  class="col-span-2 md:block">
      <AdminSideNav2></AdminSideNav2>
    </div>

    <!-- Main Content -->
    <div class="col-span-1 md:col-span-10 p-4">
      <MapboxMap
      map-id="{ID}"
      style="  width: 80%;"
      :options="{
        style: isDark?'mapbox://styles/agspatial/clqcfzcoa00bt01nwhmf465f7': 'mapbox://styles/mapbox/light-v11', // style URL

        center: [39.075219, 0.26921], // starting position
        zoom: 5 // starting zoom
      }"
    />
           
    </div>
  </div>
   

     
</template>


 <script setup>
 definePageMeta({
   layout: "landing",
 });
 import { ref, computed, watch } from 'vue';

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

