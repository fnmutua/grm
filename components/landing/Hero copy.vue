<template>
  <main class="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
    <div class="text-center w-full max-w-4xl px-2 sm:px-4 md:px-8">

      <div class="invisible md:visible">
        <img 
        src="~/assets/img/logo.svg" 
        alt="Logo" 
        class="  mx-auto mb-4 w-32 h-32 md:w-64 md:h-64" 
      /> <!-- Adjust the path as needed -->
        </div>
            
      <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold lg:tracking-tight">
        Grievance Reporting System
      </h1>
      <p class="text-sm sm:text-base md:text-lg mt-4 text-slate-600 mx-auto">
        Do you have any grievances with the implementation of DRiVE project activities? Use this platform to let us know.
      </p>
      <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <LandingLink to="/report">File a Grievance</LandingLink>
        <LandingLink size="lg" styleName="outline" to="/login">Login</LandingLink>
      </div>
    </div>
  </main>
</template>






<script setup>

import axios from 'axios';
import { ref, onMounted } from 'vue';
 

 
onMounted(async () => {

await getAllSummary();}
)

const lastUpdate =ref()
const received =ref()
const resolved =ref()
const resolution_rate =ref()

function formatDate(dateString) {
  const date = new Date(dateString);

  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

  return date.toLocaleString('en-US', options);
}


async function getAllSummary() {
  console.log('@hero.....')

  try {
     const response = await axios.post('/api/summary/time', {});

    console.log(response.data.data)
    lastUpdate.value=formatDate(response.data.data.lastUpdate)
    received.value=(response.data.data.received)
    resolved.value=(response.data.data.resolved)

    resolution_rate.value=response.data.data.resolution_rate.toFixed(0)
 
    if (response.data.code === '0000') {
        
       
    }  
  } catch (error) {
    console.error('Error during login:', error.message);
    return null
    // Handle error, maybe show an error message to the user
  }
}

</script>


<style>

body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background-color: #fff;
}

.logo {
  display: flex;
  align-items: center;
}

.logo span {
  font-family: Arial, sans-serif;
  font-size: 100px;
  font-weight: bold;
  color: #d32f2f;
}

.logo .p {
  position: relative;
  margin-right: 10px;
}

.logo .flag {
  display: flex;
  flex-direction: column;
  height: 100px;
  width: 20px;
}

.flag-top {
  background-color: #000;
  height: 33.33%;
  width: 100%;
}

.flag-middle {
  background-color: #fff;
  height: 33.33%;
  width: 100%;
}

.flag-bottom {
  background-color: #388e3c;
  height: 33.33%;
  width: 100%;
}

</style>