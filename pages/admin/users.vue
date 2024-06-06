<template>
  <div class="grid lg:grid-cols-12 place-items-left pt-5 pb-8 md:pt-8 ">
    <!-- Left Column -->
    <div class="lg:col-span-2">
      <AdminSideNav></AdminSideNav>
    </div>

    <!-- Right Column -->
    <main class="lg:col-span-9 pt-16 pb-8 md:pt-8 pl-4 pr-5">
      <UCard class="w-full" :ui="{
        base: '',
        ring: '',
        divide: 'divide-y divide-gray-200 dark:divide-gray-700',
        header: { padding: 'px-4 py-5' },
        body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
        footer: { padding: 'p-4' }
      }">

        <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700 items-center space-x-2">
          <UInput v-model="q" placeholder="Filter..." />
          <UButton v-if="total > 0" icon="i-heroicons-cloud-arrow-down" size="sm" color="primary" variant="link"
            label="Download" :trailing="false" @click="downloadXLSX" />
          <UButton v-if="total > 0" icon="i-heroicons-arrow-path" size="sm" color="primary" variant="link"
            label="Refresh" :trailing="false" @click="onChange(0)" />


          <UDropdown v-if="ShowMultipleActions" :items="actions" :popper="{ placement: 'bottom-start' }">
            <UButton color="white" label="Actions" trailing-icon="i-heroicons-chevron-down-20-solid" />
          </UDropdown>

        </div>

        <div>


        </div>
        <template #footer>
          <div class="flex flex-wrap justify-between items-center">
            <div class="flex items-center gap-1.5">
              <span v-if="total > 0" class="text-sm leading-5">Rows per page:</span>
              <USelect v-model="pageCount" :options="[3, 5, 10, 20, 30, 40]" @change="onPageCountChange"
                @click="onPageChange" class="me-2 w-20" size="xs" v-if="total > 0" />
            </div>

            <div class="flex items-center gap-1.5">
              <span class="text-sm leading-5" v-if="total > 0">
                Showing
                <span class="font-medium">{{ pageFrom }}</span>
                to
                <span class="font-medium">{{ pageTo }}</span>
                of
                <span class="font-medium">{{ total }}</span>
                results
              </span>

              <UPagination v-if="total > 0" v-model="page" :page-count="pageCount" :total="total" @click="onPageChange"
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
                }" />
            </div>
          </div>
        </template>


        <div style="width: 100%; margin-top:50px">
          <UTable v-model="selected" :rows="filteredRows" :columns="columns" :loading="pending" class="w-full"
            :ui="{ td: { base: 'max-w-[0] truncate' }, default: { checkbox: { color: 'green' } } }">
            <template #name-data="{ row }">
              <span :class="[selected.find(row => row.id === row.id) && 'text-primary-500 dark:text-primary-400']">{{
                row.code }}</span>
            </template>
            <template #completed-data="{ row }">
              <UBadge size="xs"
                :label="row.acceptance === 'Pending' ? 'Pending' : (row.acceptance === 'Accepted' ? 'Accepted' : 'Rejected')"
                :color="row.acceptance === 'Pending' ? 'orange' : (row.acceptance === 'Accepted' ? 'emerald' : 'red')"
                variant="subtle" />
            </template>


            <template #actions-data="{ row }">
              <UDropdown :items="items(row)">
                <UButton variant="ghost" icon="i-heroicons-ellipsis-vertical " />
              </UDropdown>
            </template>
          </UTable>
        </div>


        <UModal v-model="showDetailsModal">
          <div class="p-4">
            <el-descriptions class="margin-top" title="Grievance Details" :column="2" :size="size" border>
              <template #extra>
                <UIcon name="i-heroicons-x-mark" @click="showDetailsModal = false" />
              </template>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <UIcon name="i-heroicons-qr-code" />
                    Code
                  </div>
                </template>
                {{ grv_details.code }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :style="iconStyle">
                      <iphone />
                    </el-icon>
                    Status
                  </div>
                </template>
                {{ grv_details.status }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :style="iconStyle">
                      <iphone />
                    </el-icon>
                    Complaint
                  </div>
                </template>
                {{ grv_details.complaint }}
              </el-descriptions-item>

              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :style="iconStyle">
                      <iphone />
                    </el-icon>
                    Outcome
                  </div>
                </template>
                {{ grv_details.acceptance }}
              </el-descriptions-item>

              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :style="iconStyle">
                      <iphone />
                    </el-icon>
                    Resolution
                  </div>
                </template>
                {{ grv_details.resolution }}

              </el-descriptions-item>
            </el-descriptions>
          </div>
        </UModal>

      </UCard>

      <UModal v-model="isOpenRights">
        <UCard :ui="{
          base: 'h-full flex flex-col',
          rounded: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          body: {
            base: 'grow'
          }
        }">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Rights Allocation
              </h3>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                @click="isOpenRights = false" />
            </div>
          </template>
          <div>

            <p>
              You are allocating <span class="highlight">{{ selected_users }}</span> the selected roles below:
            </p>
            <UDivider label="***" />

          </div>
          <div class="checkbox-container" style="margin-top: 20px">
            <UCheckbox v-for="(role, index) in roles" :key="index" v-model="checkedRoles" :value="role">
              <template #label>
                <span>{{ role }}</span>
              </template>
            </UCheckbox>
          </div>

          <template #footer>
            <div class="flex justify-end items-center gap-2">
              <UButton @click="isOpenRights = false" variant="outline" color="gray">Cancel</UButton>
              <UButton @click="EditRights" variant="outline" color="green">Submit</UButton>
            </div>
          </template>

        </UCard>
      </UModal>


    </main>
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
const ShowMultipleActions = ref(false)

const isOpenRights = ref(false)
const roles = ['Admin', 'User', 'Settlement GRC', 'County GRC', 'National GRC', 'GBV']
const checkedRoles = ref([])


const filteredRows = computed(() => {
  if (!q.value) {
    return users.value
  }
  return users.value.filter((user) => {
    return Object.values(user).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
})

console.log('filteredRows', filteredRows)



const users = ref([])
const columns = [{
  key: 'id',
  label: 'Id',
  sortable: true
},
{
  key: 'jina',
  label: 'Name',
  sortable: true
},

{
  key: 'gender',
  label: 'Gender',
  sortable: true,
},

{
  key: 'phone',
  label: 'Phone',
  sortable: true,
},



{
  key: 'settlement',
  label: 'Settlement',
  sortable: true
},
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
  let status = 'Resolved';
  pending.value = true

  try {
    const response = await axios.post('/api/admin/users', {
      page: page.value,  // Add page parameter
      pageCount: pageCount.value  // Add pageCount parameter
    });

    if (response.data.code === '0000') {
      //count[status] = response.data.data.length;
      total.value = response.data.total; // Update total value
      users.value = response.data.data;

      console.log('totalCount', response.data)
      const extractedUsers = response.data.data.map(user => ({
        id: user._id,
        jina: user.name,
        county: user.county,
        settlement: user.settlement,
        gender: user.gender,
        phone: user.phone,
      }));
      pending.value = false
      users.value = extractedUsers;
      console.log('users.value', users.value)
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
  const fileName = 'users'
  const exportType = exportFromJSON.types.csv
  if (data) exportFromJSON({ data, fileName, exportType })
}

//// Grievnace Actions ////////////
//--------------------------------------------///


const selected = ref([])
const selected_ids = ref([])
const selected_rows = ref([])



/// Send notification SMS/email later............
const sendNotification = async (msg) => {
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

const selected_users = ref()
const allocateRights = async () => {

  console.log('AllocateRights', selected.value)
  selected_users.value = selected.value.map(person => person.jina).reduce((acc, curr, index, array) => {
    if (index === 0) {
      return curr;
    } else if (index === array.length - 1) {
      return `${acc} and ${curr}`;
    } else {
      return `${acc}, ${curr}`;
    }
  }, '');

  console.log('selected_users.value ', selected_users.value)


  isOpenRights.value = true
}




const EditRights = async () => {
  
  const allocated_roles = []

  // Loop through objectsArray and append roles property
  selected_ids.value.forEach(obj => {
    let obj_role = {}
    obj_role.id = obj
    obj_role.roles = checkedRoles.value
    allocated_roles.push(obj_role)

  });


 
  try {
    const response = await axios.post('/api/admin/rights', {
      ids: selected_ids.value,
      roles: checkedRoles.value,  
    });

    console.log(response)

    if (response.data.success) {
      toast.add({ title: 'Rights allocation is successfull', color: "primary" });
    } else {
      toast.add({ title: 'Rights allocation  failed', color: "red" });

    }
    isOpen.value = false


   } catch (error) {
    console.error('Error during allocation:', error.message);
     // Handle error, maybe show an error message to the user
  }

}


const askForDocuments = async () => {
  //downloadLoading.value = true
  console.log('askForDocuments....', selected_rows.value)

  // Assuming 'array' is your array and 'func' is your function
  for (let i = 0; i < selected_rows.value.length; i++) {
    // func(array[i]);
    console.log(selected_rows.value[i])
    let msg = 'please provide supporting documentation for grievance ' + selected_rows.value[i] + '.'
    sendNotification(msg)

  }

  selected_rows.value = []
  toast.add({ title: 'Notifications sent successfully', color: "primary" });


  //sendNotification('please provide supporting documentation')


}

const markResolved = async () => {
  //downloadLoading.value = true
  console.log('markResolved....', comments.value)


  try {
    const response = await axios.post('/api/grievances/update', {
      ids: selected_ids.value,
      field: 'status',  // Add page parameter
      field_value: 'Resolved', // Add pageCount parameter,
      resolution: comments.value,
    });

    console.log(response.data.data[0].code)

    // let msg = 'your grievance '+response.data.data[0].code+ ' is currently under review.'
    for (let i = 0; i < selected_rows.value.length; i++) {
      // func(array[i]);
      console.log(selected_rows.value[i])
      let msg = 'your grievance ' + selected_rows.value[i] + ' is now resolved.'
      sendNotification(msg)
    }

    if (response.data.success) {
      toast.add({ title: 'Resolution is successfull', color: "primary" });
    } else {
      toast.add({ title: 'Resolution failed', color: "red" });

    }
    isOpen.value = false


    selected_rows.value = []
  } catch (error) {
    console.error('Error during login:', error.message);
    selected_rows.value = []
    // Handle error, maybe show an error message to the user
  }

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
    if (response.data.success) {
      toast.add({ title: response.data.message, color: "primary" });
    } else {
      toast.add({ title: response.data.message, color: "red" });

    }

    selected_rows.value = []

  } catch (error) {
    console.error('Error during login:', error.message);
    toast.add({ title: error.message, color: "red" });

    // Handle error, maybe show an error message to the user
  }


}

const actions = [
  [
    {
      label: 'Allocate Rights',
      icon: 'i-heroicons-document-arrow-up',
      click: () => {
        allocateRights()
      }
    },
    {
      label: 'Suspend Accounts',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => {
        onInvestigate()
      }
    },
  ],
  [{
    label: 'Reset Passwords',
    icon: 'i-heroicons-check-badge',
    click: () => {
      // markResolved()
      isOpen.value = true
    }

  },], [{
    label: 'Delete Users',
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

  if (newValue.length > 0) {
    ShowMultipleActions.value = true

    selected_ids.value = newValue.map(obj => obj.id);
    selected_rows.value = newValue.map(obj => obj.code);

    console.log('Selected items changed:', selected_ids.value);

  }
  else {
    ShowMultipleActions.value = false

  }
});

// Open Modal 
const isOpen = ref(false)


/////////////-----------
const grv_details = ref()
const getDetails = async (row) => {
  //downloadLoading.value = true
  console.log('getDetails....', row)
  showDetailsModal.value = true
  grv_details.value = row

}


const items = (row) => [
  [{
    label: 'Details',
    icon: 'i-heroicons-pencil-square-20-solid',

    click: () => {
      // markResolved()
      getDetails(row)
    }

  }]
]

const showDetailsModal = ref(false)


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