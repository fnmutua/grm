<template>
  <NuxtLoadingIndicator />
     <LandingContainer>
    
    <UTabs :items="items" class="w-full py-11" v-model=selectedTab @change="onChange" >
 
      <template #default="{ item, index, selected }">
        <div class="flex items-center gap-2 relative truncate">
          <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />
          <span class="truncate">{{ item.label }}</span>
          <span v-if="selected" class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
          <UBadge :color="item.color" :ui="{ rounded: 'rounded-full' }">{{item.count}}</UBadge>
        </div>
      </template>
    </UTabs>
   
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
    </div>
   
    <UTable
       v-model:sort="sort"
      :rows="filteredRows"
      :columns="columns"
      :loading="pending"
       class="w-full"
      :ui="{ td: { base: 'max-w-[0] truncate' }, default: { checkbox: { color: 'gray' } } }"
    
    >
  </UTable>

    
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
    
    <LandingPageHead>
      <template v-slot:desc>Fill in all the required fields.</template>
    </LandingPageHead>
    
  </LandingContainer>

 

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

const selectedTab = ref(0);
const pageCount = ref(5)
const q = ref('')
const pending = ref(false)

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
 
} ]

const page = ref(1)
const total = ref(0)
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
const pageTo = computed(() => Math.min(page.value * pageCount.value, total.value))

 

onMounted(async () => {
 await onChange(0)
});


async function onChange(index) {
  q.value=''
  const item = items.value[index].label;
  let status;
  pending.value=true 

  if (item === 'Pending') {
    status = 'Open';
    count[status] = 0;
  } else if (item === 'Resolved') {
    status = 'Resolved';
    count[status] = 0;
  } else {
    status = 'Escalated';
    count[status] = 0;
  }

  try {
    const response = await axios.post('/api/grievances/list', {
      status: status,
      page: page.value,  // Add page parameter
      pageCount: pageCount.value  // Add pageCount parameter
    });

    if (response.data.code === '0000') {
      //count[status] = response.data.data.length;
      items.value[selectedTab.value].count = response.data.total ? response.data.total :0;
      total.value =response.data.total; // Update total value
      grievances.value = response.data.data;

      console.log('totalCount',response.data)
      const extractedGrievances = response.data.data.map(grievance => ({
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
  const fileName = 'grievances_'+items.value[selectedTab.value].label
  const exportType = exportFromJSON.types.csv
  if (data) exportFromJSON({ data, fileName, exportType })
}


</script>
