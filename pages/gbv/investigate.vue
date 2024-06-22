
<template>
  <div class="grid grid-cols-1 md:grid-cols-12 gap-4 py-10">
     

    <!-- Side Navigation for medium and larger screens -->
    <div  class="col-span-2 md:block">
      <AdminSideNav2></AdminSideNav2>
    </div>

    <!-- Main Content -->
    <div class="col-span-1 md:col-span-10 p-4">
      <UCard>
        <div class="lg:hidden">
            <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700 items-center space-x-2"  >
 
            <UInput
              v-model="keyword"
              name="q"
              placeholder="Search..."
               autocomplete="off"
               @keyup.enter="onSearch" 
              :ui="{ icon: { trailing: { pointer: '' } } }"
               
            >
              <template #trailing>
                <UButton
                  v-show="keyword"
                  color="green"
                  variant="link"
                  icon="i-heroicons-magnifying-glass-20-solid"
                  :padded="false"
                  @click="onSearch()"
                />

                <UButton
              icon="i-heroicons-x-mark"
              size="sm"
              color="red"
              v-show="keyword"
              variant="link"
              @click="onSearchClear()"
            /> 
              </template>
            </UInput>
            


            <UButton v-if="total > 0" icon="i-heroicons-cloud-arrow-down" size="sm" color="primary" variant="link"
            :trailing="false" @click="downloadXLSX" />
            <UButton v-if="total > 0" icon="i-heroicons-arrow-path" size="sm" color="primary" variant="link" 
              :trailing="false" @click="onChange(0)" />
            <UDropdown v-if="ShowMultipleActions" :items="actions" :popper="{ placement: 'bottom-start' }">
              <UButton color="primary"  variant="outline"   size="sm"  trailing-icon="i-heroicons-chevron-down-20-solid" />
            </UDropdown>
          </div>

        </div>

        <div class="hidden md:block">
          <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700 items-center space-x-2"  >
 
            <UInput
              v-model="keyword"
              name="q"
              placeholder="Search..."
               autocomplete="off"
               @keyup.enter="onSearch" 
              :ui="{ icon: { trailing: { pointer: '' } } }"
            >
              <template #trailing>
                <UButton
                  v-show="keyword"
                  color="green"
                  variant="link"
                  icon="i-heroicons-magnifying-glass-20-solid"
                  :padded="false"
                  @click="onSearch()"
                />

                <UButton
              icon="i-heroicons-x-mark"
              size="sm"
              color="red"
              v-show="keyword"
              variant="link"
              @click="onSearchClear()"
            /> 
              </template>
            </UInput>
            
          


            <UButton v-if="total > 0" icon="i-heroicons-cloud-arrow-down" size="sm" color="primary" variant="link"
              label="Download" :trailing="false" @click="downloadXLSX" />
            <UButton v-if="total > 0" icon="i-heroicons-arrow-path" size="sm" color="primary" variant="link" label="Refresh"
              :trailing="false" @click="onChange(0)" />
            <UDropdown v-if="ShowMultipleActions" :items="actions" :popper="{ placement: 'bottom-start' }">
              <UButton color="white" label="Actions" trailing-icon="i-heroicons-chevron-down-20-solid" />
            </UDropdown>
          </div>
 
        </div>

        


      <UTable
              v-model="selected"
               :rows="filteredRows"
              :columns="columns"
              :loading="pending"
              sort-asc-icon="i-heroicons-arrow-up"
              sort-desc-icon="i-heroicons-arrow-down"
               :ui="{ td: { base: 'max-w-[0] truncate  text-transform: normal-case  ' }, default: { checkbox: { color: 'gray' } } }"
              @select="select">
          
            <template #actions-data="{ row }">
              <UDropdown :items="items(row)">
            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-vertical" />
              </UDropdown>
            </template>

            
          </UTable>
         
 <template #footer>
          <div class="flex flex-wrap justify-between items-center">
            <div class="flex items-center gap-1.5">
              <span v-if="total > 0" class="text-sm leading-5">Rows per page:</span>
              <USelect v-model="pageCount" :options="[3, 5, 10, 20, 30, 40]" @change="onPageCountChange"
                @click="onPageChange" class="me-2 w-20" size="xs" v-if="total > 0" />
            </div>

               
              

              <UPagination v-if="total > 0" v-model="page" :page-count="pageCount" :total="total" @click="onPageChange"
                :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', color: 'gray' }"
                :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true,  color: 'gray' }"
                :ui="{
                  wrapper: 'flex items-center gap-1',
                  rounded: '!rounded-full min-w-[32px] justify-center',
                  default: {
                    activeButton: {
                      variant: 'outline'
                    }
                  }
                }" />
           
          </div>
        </template>
      </UCard>
      
            
          
    </div>
  </div>
</template>

<script setup>
 
definePageMeta({
  layout: "landing",
  middleware: 'auth',
});

 

import axios from 'axios';
import { ref, computed, watch } from 'vue';

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
},
{
  key: 'resolution',
  label: 'Resolution',
  sortable: true,
 
},
// {
//   key: 'acceptance',
//   label: 'Accepted',
//   sortable: true,
 
// },

// {
//   key: 'completed',
//   label: 'Outcome',

// },

// {
//   key: 'expand',
//   label: 'Details',

// },
{
  key: 'actions'
}
]

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
  q.value = ''
  let status = 'Investigate';
  pending.value = true

  try {
    const response = await axios.post('/api/grievances/list', {
      status: status,
      gbv:'Yes',
      page: page.value,  // Add page parameter
      pageCount: pageCount.value  // Add pageCount parameter
    });

    if (response.data.code === '0000') {
      //count[status] = response.data.data.length;
      total.value = response.data.total; // Update total value
      grievances.value = response.data.data;

      console.log('totalCount', response.data)
      const extractedGrievances = response.data.data.map(grievance => ({
        id: grievance._id,
        code: grievance.code,
        county: grievance.county,
        settlement: grievance.settlement,
        status: grievance.status,
        complaint: grievance.complaint,
        acceptance: grievance.acceptance,
        resolution: grievance.resolution,
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

const keyword=ref()

async function onSearchClear() {
  keyword.value=null
  await onChange()
  page.value=1

}

async function onSearch() {
  console.log('keyword',keyword)
  let status = 'Investigate';
  pending.value = true

  try {
    const response = await axios.post('/api/grievances/search', {
      keyword:keyword.value,
      status: status,
      gbv:'Yes',
      page: page.value,  // Add page parameter
      pageCount: pageCount.value  // Add pageCount parameter
    });

    if (response.data.code === '0000') {
      //count[status] = response.data.data.length;
      total.value = response.data.total; // Update total value
      grievances.value = response.data.data;
     
      console.log('Search Count', response.data)
      const extractedGrievances = response.data.data.map(grievance => ({
        id: grievance._id,
        code: grievance.code,
        county: grievance.county,
        settlement: grievance.settlement,
        status: grievance.status,
        complaint: grievance.complaint,
        acceptance: grievance.acceptance,
        resolution: grievance.resolution,
      }));
      pending.value = false
      grievances.value = extractedGrievances;
    } else {
      console.log(response.data.message);
      toast.add({ title: response.data.message, color: "red" });
    }
  } catch (error) {
    console.error('Error during login:', error.message);
   }
}


const onPageCountChange = async () => {
  // Call onChange function to fetch grievances with updated page count
  //await onChange(selectedTab.value);

  if(keyword){
    await onSearch(selectedTab.value);
  }else {
    await onChange(selectedTab.value);

  }

};


const onPageChange = async () => {
  // Call onChange function to fetch grievances with updated page count
   if(keyword){
    await onSearch(selectedTab.value);
  }else {
    await onChange(selectedTab.value);

  }
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
      field_value: 'Investigate', // Add pageCount parameter
      resolution:null
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

// Watch for changes in the selected items
watch(selected, (newValue, oldValue) => {
  // newValue contains the updated selected items array
  // oldValue contains the previous selected items array
  console.log('Selected items changed:', newValue);
  
  if(newValue.length >0){
    ShowMultipleActions.value = true 
    selected_ids.value = newValue.map(obj => obj.id);
    selected_rows.value = newValue.map(obj => obj.code);
    console.log('Selected items changed:', selected_ids.value );
  } 
  else {
    ShowMultipleActions.value = false 

  }
});

// Open Modal 
const isOpen =ref(false)

 
/////////////-----------
const grv_details = ref()
const getDetails = async (row) => {
  //downloadLoading.value = true
 console.log('getDetails....', row)
 showDetailsModal.value=true
 grv_details.value=row

 await navigateTo('/grievances/'+row.id)

 
}


const items = (row) => [
  [{
    label: 'Details',
    icon: 'i-heroicons-pencil-square-20-solid',

    click: () => {
      // markResolved()
      getDetails(row)
    }

  },
  {
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: () => {
      deleteGrv()
    }
  },

]
]

const showDetailsModal = ref(false)
 

</script>

<style scoped>
.el-table th {
  color: black;
}
</style>