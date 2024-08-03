<template>
  <main class="grid lg:grid-cols-2 place-items-center pt-16 pb-8 md:pt-8">
    <div class="p-24 md:order-1 hidden md:block">
      <!-- <img
        class="rounded-full transition-transform transform hover:scale-125"
        src="~/assets/img/grm1.png"
        alt="Starship starts the engine"
        loading="eager"
        format="avif"
        width="512"
        height="512"
      /> -->
      <LandingStatistic :Received="received" :Resolved="resolved" :ResolutionRate="resolution_rate" :lastUpdate="lastUpdate"></LandingStatistic>
    </div>

    <div>
      <h1 class="text-5xl lg:text-6xl xl:text-7xl font-bold lg:tracking-tight">
        Grievance Reporting System
      </h1>
      <p class="text-lg mt-4 text-slate-600 max-w-xl">
        Do you have any grievances with the implementation of DRiVE project activities? Use this platform to let us know.
      </p>
      <div class="mt-6 flex flex-col sm:flex-row gap-3">
        <LandingLink
          to="/report"
           >File a Grievance</LandingLink
        >
         <LandingLink
          size="lg"
          styleName="outline"
          to="/grievances/status"

          >Check Status</LandingLink
        >
      </div>
    </div>
  </main>
</template>

<script setup>

import axios from 'axios';
import { ref, computed, watch,onMounted } from 'vue';
 

 
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