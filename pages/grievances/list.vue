<template>
  <NuxtLoadingIndicator />

  <LandingContainer>
    <LandingSectionhead >
      <template v-slot:title>Grievances</template>
      <template v-slot:desc>...</template>
    </LandingSectionhead>

    <UTabs :items="items" class="w-full" v-model=selectedTab @change="onChange" >
      <template #default="{ item, index, selected }">
        <div class="flex items-center gap-2 relative truncate">
          <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />
          <span class="truncate">{{ item.label }}</span>
          <span v-if="selected" class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
          <UBadge :color="item.color" :ui="{ rounded: 'rounded-full' }">{{ item.count }}</UBadge>
        </div>
      </template>
    </UTabs>
    <div v-show="selectedTab === 0">
    <table class="min-w-full">
      <thead>
        <tr>
          <!-- Iterate over the keys of the first grievance object to generate table headers -->
          <th v-for="(value, key) in grievances[0]"  :sortable=true :key="key" class="px-4 py-2">{{ key }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(grievance, index) in grievances" :key="index">
          <!-- Iterate over the keys of each grievance object to generate table cells -->
          <td v-for="(value, key) in grievance" :key="key" class="border px-4 py-2">{{ value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
    
  </LandingContainer>
</template>

<script setup>
definePageMeta({
  layout: "landing",
});
import axios from 'axios';
import { ref } from 'vue';
const toast = useToast()

const selectedTab = ref(0);

const items = [{
  label: 'Pending',
  icon: 'i-heroicons-bell-snooze',
  count: '15',
  color: 'green' 
}, {
  label: 'Resolved',
  disabled: false,
  icon: 'i-heroicons-check-badge',
  count: '58',
  color: 'orange',
 }, {
  label: 'Escalated',
  icon: 'i-heroicons-arrow-up-right',
  count: '5',
  color: 'red',
 }];

 const grievances =ref([])
const pendingGrievances = [
  { id: 1, title: 'Grievance 1', status: 'Pending' },
  { id: 2, title: 'Grievance 2', status: 'Pending' },
  { id: 3, title: 'Grievance 3', status: 'Pending' },
  // Add more grievance data as needed
];

async function onChange (index) {
  const item = items[index].label
  let status 

  console.log('items[index]',items[index])
  if(item == 'Pending') {
    status='Open'
  }
  else if(item == 'Resolved')
  {
    status='Resolved'
  }else {
    status='Escalated'  
  }

 
  try {
 
    const response = await axios.post('/api/grievances/list', {
      status: status 
    });
    console.log(response)

    if(response.data.code =='0000') {
      console.log(response.data.data)
      //toast.add({ title:response.data.message })

      grievances.value=response.data.data
      // Extracting specific properties from each object in the response
      const extractedGrievances = response.data.data.map(grievance => ({
        code: grievance.code,
        county: grievance.county,
        settlement: grievance.settlement,
        complaint: grievance.complaint
      }));

        // Assigning the extracted properties to the grievances array
        grievances.value = extractedGrievances;


    }
    else {
      console.log(response.data.message)
      toast.add({ title: response.data.message, color:"red" })

    }
  } catch (error) {
    console.error('Error during login:', error.message);
    // Handle error, maybe show an error message to the user
  }  


  //alert(`${item.label} was clicked!`)
}




</script>
