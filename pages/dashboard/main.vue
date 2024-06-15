<template>
  <LandingContainer>
    <div class="flex min-h-screen pt-10">
      <div class="flex-1 flex flex-col">
        <main class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total Grievances" value="89,935" change="10.2" icon="i-heroicons-megaphone"
              changeType="increase" class="bg-white dark:bg-transparent border" />
            <StatCard title="Open Grievances" value="23,283.5" icon="i-heroicons-hand-thumb-up" change="3.1"
              changeType="increase" class="bg-white dark:bg-transparent border" />
            <StatCard title="Resolved Grievances" value="46,827" icon="i-heroicons-phone-arrow-down-left" change="2.56"
              changeType="decrease" class="bg-white dark:bg-transparent border" />
            <StatCard title="Escalated Grievances" value="124,854" icon="i-heroicons-hand-thumb-down" change="7.2"
              changeType="increase" class="bg-white dark:bg-transparent border" />
          </div>

          <UDivider label="**" class=" pt-4" />
   <UTabs :items="items" class="w-full dark:bg-transparent pt-4">
    <template #item="{ item }">
      <UCard class="bg-white dark:bg-transparent border h-96">
        <div  >
          <div v-if="item.label === 'Maps'" class=" h-96">
             <MapboxMap
             style="position: absolute; top: 10px; bottom: 10px; left: 10px; right: 10px; width:98.5%"
                :options="{
                style: 'mapbox://styles/mapbox/light-v11',
                center: [37.137343, 1.137451],
                zoom: 5
              }"
            />
          </div>
          <div v-if="item.label === 'Tables'" class="flex flex-col h-full">
            <p>Tables Here</p>
          </div>
          <div v-if="item.label === 'Charts'"  >
             <Bar
                id="my-chart-id"
                :options="chartOptions"
                :data="chartData"
                height="45hv"
                style="position: absolute;  height:65.5%"

          
              />
          </div>
        </div>
      </UCard>
    </template>
  </UTabs>
 


        </main>
      </div>
    </div>
  </LandingContainer>
</template>


<script setup>
definePageMeta({
  layout: "landing",
});

import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartData = {
        labels: [ 'January', 'February', 'March' ],
        datasets: [ { data: [40, 20, 12] } ]
      }

const       chartOptions = {
        responsive: true
      }



const items = [{
  label: 'Maps',
  icon: 'i-heroicons-information-circle',
  content: 'This is the content shown for Tab1'
}, {
  label: 'Charts',
  disabled: false,
  icon: 'i-heroicons-information-circle',
  content: 'And, this is the content for Tab2'
}, {
  label: 'Tables',
  icon: 'i-heroicons-information-circle',
  content: 'Finally, this is the content for Tab3'
}]


</script>

<style scoped>
/* Custom styles can be added here if needed */
</style>
