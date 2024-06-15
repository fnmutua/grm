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
          <div class="w-full h-96 pt-4  text-green9 font-medium text-sm">
                      <SplitterGroup id="splitter-group-1" direction="horizontal">
                        <SplitterPanel id="splitter-group-1-panel-1" :min-size="20"
                          class="bg-white dark:bg-transparent border rounded-xl flex items-center justify-center">
                          Panel A
                        </SplitterPanel>
                        <SplitterResizeHandle id="splitter-group-1-resize-handle-1" class="w-2" />
                        <SplitterPanel id="splitter-group-1-panel-2" :min-size="20">
                          <SplitterGroup id="splitter-group-2" direction="vertical">
                            <SplitterPanel id="splitter-group-2-panel-1" :min-size="20"
                              class="bg-white dark:bg-transparent border rounded-xl flex items-center justify-center">
                              Panel B
                            </SplitterPanel>
                            <SplitterResizeHandle id="splitter-group-2-resize-handle-1" class="h-2" />
                            <SplitterPanel id="splitter-group-2-panel-2" :min-size="20"
                              class="bg-white dark:bg-transparent border rounded-xl flex items-center justify-center">
                              Panel C
                            </SplitterPanel>
                          </SplitterGroup>
                        </SplitterPanel>
                      </SplitterGroup>
                    </div>
            



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
  labels: ['January', 'February', 'March'],
  datasets: [{ data: [40, 20, 12] }]
}

const chartOptions = {
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
