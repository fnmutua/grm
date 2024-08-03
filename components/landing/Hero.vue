<template>
  <main class="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
    <!-- <div class="invisible md:visible"> -->
      <div  >
        <img src="~/assets/img/logo.svg" alt="Logo" class="mx-auto  w-64 h-48 md:w-64 md:h-48" />
    </div>



    <div class="  items-center justify-center place-items-center pt-2 pb-8 md:pt-2">
      <h1 class="text-5xl lg:text-6xl xl:text-7xl font-bold lg:tracking-tight ">
        Grievance Reporting System
      </h1>
      <p class="text-lg mt-4 text-slate-600   justify-center">
        Do you have any grievances with the implementation of DRiVE project activities? Use this platform to let us
        know.
      </p>
      <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <LandingLink target="_blank" to="/report">File a Grievance</LandingLink>
         <LandingLink
          size="lg"
          styleName="outline"
          rel="noopener"
           target="_blank"
          to="/login"
          >Login</LandingLink
        > 
      </div>
    </div>
  </main>
</template>

<script setup>

import axios from 'axios';
import { ref, computed, watch, onMounted } from 'vue';



onMounted(async () => {

  await getAllSummary();
}
)

const lastUpdate = ref()
const received = ref()
const resolved = ref()
const resolution_rate = ref()

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
    lastUpdate.value = formatDate(response.data.data.lastUpdate)
    received.value = (response.data.data.received)
    resolved.value = (response.data.data.resolved)

    resolution_rate.value = response.data.data.resolution_rate.toFixed(0)

    if (response.data.code === '0000') {


    }
  } catch (error) {
    console.error('Error during login:', error.message);
    return null
    // Handle error, maybe show an error message to the user
  }
}

 
async function login() {
  console.log("Logging off")
  //  signOut({ callbackUrl: '/login' })
 //  signOut({ callbackUrl: 'http://localhost/login' })
 
    navigateTo('/login', { external: true })
} 

</script>