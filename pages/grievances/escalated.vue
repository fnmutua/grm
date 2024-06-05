<template>
  <div class="grid lg:grid-cols-11 place-items-left pt-5 pb-8 md:pt-8 ">
      <!-- Left Column -->
      <div class="lg:col-span-2">
        <AdminSideNav></AdminSideNav>
      </div> 

      <!-- Right Column -->
      <main class="lg:col-span-8 pt-16 pb-8 md:pt-8 pl-4">
  

        <UCard
            class="w-full"
            :ui="{
              base: '',
              ring: '',
              divide: 'divide-y divide-gray-200 dark:divide-gray-700',
              header: { padding: 'px-4 py-5' },
              body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
              footer: { padding: 'p-4' }
            }"
          >

          <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700 items-center space-x-2">
            <UInput v-model="q" placeholder="Filter..." />
            <UButton   v-if="total>0"
              icon="i-heroicons-cloud-arrow-down"
              size="sm"
              color="primary"
              variant="link"
              label="Download"
              :trailing="false"
              @click="downloadXLSX"
            />
            <UButton   v-if="total>0"
              icon="i-heroicons-arrow-path"
              size="sm"
              color="primary"
              variant="link"
              label="Refresh"
              :trailing="false"
              @click="onChange(0)"
            />

        
            <UDropdown v-if="ShowMultipleActions" :items="actions" :popper="{ placement: 'bottom-start' }">
                <UButton color="white" label="Actions" trailing-icon="i-heroicons-chevron-down-20-solid" />
            </UDropdown>
      
          </div>
        
          <UTable
            v-model:sort="sort"
            @select="select"
            v-model="selected"
            :rows="filteredRows"
            :columns="columns"
            :loading="pending"
            class="w-full"
            :ui="{ td: { base: 'max-w-[0] truncate' }, default: { checkbox: { color: 'gray' } } }"
          
          >
          <template #actions-data="{ row }">
            <UDropdown v-if="!ShowMultipleActions" :items="actions" :popper="{ placement: 'bottom-start' }">
                <UButton color="white" label="Actions" trailing-icon="i-heroicons-chevron-down-20-solid" />
            </UDropdown>
          </template>
        </UTable>

        <div>
      
          <UModal v-model="isOpen">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
              <template #header>
                <p>Feedback </p>
              </template>

              <div>
              <UFormGroup label="Comments to complainant" required>
                <UTextarea v-model="comments" color="primary" variant="outline" placeholder="Provide your detailed response to the complainant on how the grievance was resolved" />
              </UFormGroup>
            </div>

              <template #footer>
                <div class="flex justify-between">
              <UButton label="Cancel"   @click="isOpen = false"  variant="outline" color="gray" />
              <UButton label="Submit"  @click="markResolved"  />
            </div>       
          </template>
            </UCard>
          </UModal>
        </div>


          


          <template #footer>
            <div class="flex flex-wrap justify-between items-center">
              <div class="flex items-center gap-1.5">
                <span   v-if="total>0" class="text-sm leading-5">Rows per page:</span>
                <USelect 
                  v-model="pageCount"
                  :options="[3, 5, 10, 20, 30, 40]"
                  @change="onPageCountChange"
                  @click="onPageChange"
                  class="me-2 w-20"
                  size="xs"
                  v-if="total>0"
                />
              </div>

              <div class="flex items-center gap-1.5">
                <span class="text-sm leading-5" v-if="total>0">
                    Showing
                    <span class="font-medium">{{ pageFrom }}</span>
                    to
                    <span class="font-medium">{{ pageTo }}</span>
                    of
                    <span class="font-medium">{{ total }}</span>
                    results
                </span>

                <UPagination  
                  v-if="total>0"
                  v-model="page"
                  :page-count="pageCount"
                  :total="total"
                  @click="onPageChange"
                  :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'Prev', color: 'gray' }"
                  :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Next', color: 'gray' }"

                  :ui="{
                    wrapper: 'flex items-center gap-1',
                    rounded: '!rounded-full min-w-[32px] justify-center',
                    default: {
                      activeButton: {
                        variant: 'outline'
                      }
                    }
                  }"
                />
              </div>
            </div>
          </template>

        </UCard>
      
    

    
      </main>
  </div>
</template>

<script setup>
 
definePageMeta({
  layout: "landing",
  middleware: 'auth',
});

 

import axios from 'axios';
import { ref, computed } from 'vue';

import exportFromJSON from 'export-from-json'


const sort = ref({ column: 'code', direction: 'asc' })

const toast = useToast()
const comments = ref(null)

const selectedTab = ref(0);
const pageCount = ref(10)
const q = ref('')
const pending = ref(false)
const ShowMultipleActions =ref(false)
const filteredRows = computed(() => {
  if (!q.value) {
    return grievances.value
  }
  return grievances.value.filter((grv) => {
    return Object.values(grv).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
})

console.log('filteredRows',filteredRows)



const grievances =ref([])
 const columns = [  {
  key: 'code',
  label: 'Code',
  sortable: true
}, {
  key: 'settlement',
  label: 'Settlement',
  sortable: true
}, 
  {
  key: 'status',
  label: 'Status',
  sortable: true
},
{
  key: 'complaint',
  label: 'Complaint',
  sortable: true,
 
}  ]

const page = ref(1)
const total = ref(0)
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
const pageTo = computed(() => Math.min(page.value * pageCount.value, total.value))

 

onMounted(async () => {
 await onChange(0)
});

onMounted(async () => {
 await onChange(0)
});


async function onChange(index) {
  q.value=''
   let status = 'Escalated';
  pending.value=true 
 
  try {
    const response = await axios.post('/api/grievances/list', {
      status: status,
      page: page.value,  // Add page parameter
      pageCount: pageCount.value  // Add pageCount parameter
    });

    if (response.data.code === '0000') {
      //count[status] = response.data.data.length;
       total.value =response.data.total; // Update total value
      grievances.value = response.data.data;

      console.log('totalCount',response.data)
      const extractedGrievances = response.data.data.map(grievance => ({
        id: grievance._id,
        code: grievance.code,
        county: grievance.county,
        settlement: grievance.settlement,
        status: grievance.status,
        complaint: grievance.complaint
      }));
      pending.value = false
      grievances.value = extractedGrievances;
    } else {
      console.log(response.data.message);
      toast.add({ title: response.data.message, color: "red" });
    }
  } catch (error) {
    console.error('Error during login:', error.message);
    // Handle error, maybe show an error message to the user
  }
}

const onPageCountChange = async () => {
  // Call onChange function to fetch grievances with updated page count
  await onChange(selectedTab.value);
};


const onPageChange = async () => {
  // Call onChange function to fetch grievances with updated page count
  await onChange(selectedTab.value);
};

 

const downloadXLSX = () => {
  //downloadLoading.value = true
  const data = filteredRows.value
  const fileName = 'open_grievances' 
  const exportType = exportFromJSON.types.csv
  if (data) exportFromJSON({ data, fileName, exportType })
}

//// Grievnace Actions ////////////
//--------------------------------------------///

 
const selected = ref([])
const selected_ids = ref([])
const selected_rows = ref([])


function select(row) {
  console.log('row', row);
  const index = selected.value.findIndex((item) => item.id === row.id);
  if (index === -1) {
    selected.value.push(row);
  } else {
    selected.value.splice(index, 1);
  }

  console.log('Investiagte....',selected.value )
  selected_ids.value = selected.value.map(obj => obj.id);
  selected_rows.value = selected.value.map(obj => obj.code);

  
  console.log('selected_ids....',selected_ids.value )

  if(selected_ids.value.length>0){
    ShowMultipleActions.value=true
  }else {
    ShowMultipleActions.value=false
  }
 
}

/// Send notification SMS/email later............
const sendNotification = async (msg)=> { 
  try {
    const response = await axios.post('/api/grievances/notification', {
      ids: selected_ids.value,
      message: msg,  // Add page parameter
    
    });

    console.log(response)
  } catch (error) {
    console.error('Error during notification:', error.message);
    // Handle error, maybe show an error message to the user
  }

}


const onInvestigate= async () => {
 try {
    const response = await axios.post('/api/grievances/update', {
      ids: selected_ids.value,
      field: 'status',  // Add page parameter
      field_value: 'Investigate' // Add pageCount parameter
    });

   // console.log(response.data.data[0].code)
   // let msg = 'your grievance '+response.data.data[0].code+ ' is currently under review.'

    for (let i = 0; i < selected_rows.value.length; i++) {
      // func(array[i]);
      console.log(selected_rows.value[i])
      let msg = 'your grievance ' + selected_rows.value[i] +' is currently under review.'
        sendNotification(msg)
        
    }
    selected_rows.value=[]

    
    if(response.data.success){
      toast.add({ title: 'Status updated successfuly', color: "primary" });
    }
    else {
      toast.add({ title: 'Status update failed', color: "red" });

    }

  } catch (error) {
    console.error('Error during login:', error.message);
    // Handle error, maybe show an error message to the user
    selected_rows.value=[]
  }


}

const askForDocuments= async () => {
  //downloadLoading.value = true
 console.log('askForDocuments....',selected_rows.value)

 // Assuming 'array' is your array and 'func' is your function
for (let i = 0; i < selected_rows.value.length; i++) {
   // func(array[i]);
   console.log(selected_rows.value[i])
   let msg = 'please provide supporting documentation for grievance ' + selected_rows.value[i] +'.'
    sendNotification(msg)
 
}

selected_rows.value=[]
toast.add({ title: 'Notifications sent successfully', color: "primary" });
 

 //sendNotification('please provide supporting documentation')


}

const markResolved= async () => {
  //downloadLoading.value = true
 console.log('markResolved....', comments.value)


 try {
    const response = await axios.post('/api/grievances/update', {
      ids: selected_ids.value,
      field: 'status',  // Add page parameter
      field_value: 'Resolved', // Add pageCount parameter,
      resolution:comments.value,
    });

    console.log(response.data.data[0].code)

   // let msg = 'your grievance '+response.data.data[0].code+ ' is currently under review.'
    for (let i = 0; i < selected_rows.value.length; i++) {
      // func(array[i]);
      console.log(selected_rows.value[i])
      let msg = 'your grievance ' + selected_rows.value[i] +' is now resolved.'
        sendNotification(msg)
    }

    if(response.data.success){
      toast.add({ title: 'Resolution is successfull', color: "primary" });
    }else {
      toast.add({ title: 'Resolution failed', color: "red" });

    }
    isOpen.value=false


    selected_rows.value=[]
  } catch (error) {
    console.error('Error during login:', error.message);
    selected_rows.value=[]
    // Handle error, maybe show an error message to the user
  }  

}

const escalate = async () => {
  //downloadLoading.value = true
 console.log('escalate....')
 
 try {
    const response = await axios.post('/api/grievances/update', {
      ids: selected_ids.value,
      field: 'status',  // Add page parameter
      field_value: 'Escalated' // Add pageCount parameter
    });
 
    for (let i = 0; i < selected_rows.value.length; i++) {
      // func(array[i]);
      console.log(selected_rows.value[i])
      let msg = 'your grievance ' + selected_rows.value[i] +' has been escalated to the next level of resolution.'
        sendNotification(msg)
    }

    if(response.data.success){
      toast.add({ title: 'Escalation is succesfull', color: "primary" });
    }else {
      toast.add({ title: 'Escalation failed', color: "red" });

    }



    selected_rows.value=[]

  } catch (error) {
    console.error('Error during login:', error.message);
    // Handle error, maybe show an error message to the user
  }
  selected_rows.value=[]

}

const deleteGrv = async () => {
  //downloadLoading.value = true
 console.log('deleteGrv....')
 
 try {
    const response = await axios.post('/api/grievances/delete', {
      ids: selected_ids.value,
      field: 'status',  // Add page parameter
      field_value: 'Escalate' // Add pageCount parameter
    });
 
    console.log(response)
    if(response.data.success){
      toast.add({ title: response.data.message, color: "primary" });
    }else {
      toast.add({ title: response.data.message, color: "red" });

    }

    selected_rows.value=[]

  } catch (error) {
    console.error('Error during login:', error.message);
    toast.add({ title: error.message, color: "red" });

    // Handle error, maybe show an error message to the user
  }


}
 
const actions = [
   [{
    label: 'Investigate',
    icon: 'i-heroicons-pencil-square-20-solid',
     click: () => {
       onInvestigate()
    }
  }, 
  {
    label: 'Ask for Documents',
    icon: 'i-heroicons-document-arrow-up',
     click: () => {
       askForDocuments()
    }
  }, 
], 
  [{
    label: 'Mark as Resolved',
    icon: 'i-heroicons-check-badge',
      click: () => {
      // markResolved()
       isOpen.value=true
    }

  }, {
    label: 'Escalate',
    icon: 'i-heroicons-arrow-up-right',
     click: () => {
       escalate()
    }
  }, ], [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: () => {
       deleteGrv()
    }
   }]
]

// Open Modal 
const isOpen =ref(false)

</script>
