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
          <UBadge :color="item.color" :ui="{ rounded: 'rounded-full' }">{{item.count}}</UBadge>
        </div>
      </template>
    </UTabs>
    <div >
    
    <UTable :columns="columns" :rows="grievances" />


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

const items = ref([{
  label: 'Pending',
  icon: 'i-heroicons-bell-snooze',
  count: undefined,
  color: 'green' 
}, {
  label: 'Resolved',
  disabled: false,
  icon: 'i-heroicons-check-badge',
  count: undefined,
  color: 'orange',
 }, {
  label: 'Escalated',
  icon: 'i-heroicons-arrow-up-right',
  count: undefined,
  color: 'red',
 }]);

 const grievances =ref([])
 const count =ref({})
 

async function onChange (index) {
  const item = items.value[index].label
  let status 

 // count.value=undefined
 // console.log('items[index]',items[index])
  if(item == 'Pending') {
    status='Open'
    count[status]=0
  }
  else if(item == 'Resolved')
  {
    status='Resolved'
    count[status]=0
  }else {
    status='Escalated'  
    count[status]=0
 
  }

 
  try {
 
    const response = await axios.post('/api/grievances/list', {
      status: status 
    });
    console.log(response)

    if(response.data.code =='0000') {
     // console.log(response.data.data.length)
     //console.log(selectedTab.value)
     console.log(items[selectedTab.value])
      count[status]=response.data.data.length
     items.value[selectedTab.value].count = response.data.data.length
      
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

const columns = [  {
  key: 'code',
  label: 'Code',
  sortable: true
}, {
  key: 'settlement',
  label: 'Settlement',
  sortable: true
}, {
  key: 'complaint',
  label: 'Complaint',
  sortable: true,
 
} ]


</script>
