<template>
  <div class="grid lg:grid-cols-6 place-items-left pt-16 pb-8 md:pt-8 mt-20">
    <!-- Left Column -->
    <div class="lg:col-span-1">
      <AdminSideNav></AdminSideNav>
    </div>
  
   
    <!-- Right Column -->
    <main class="lg:col-span-4 pt-16 pb-8 md:pt-8 pl-4">
 
      <UBreadcrumb
        divider="/"
        :links="links"
      />

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
    <div class="flex items-center px-3 py-3.5 border-b border-gray-200 dark:border-gray-700 space-x-2">
  <UInput v-model="q" placeholder="Filter..." />
  <UButton v-if="total > 0"
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
      :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No Data.' }"

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
    
   

  
</main>
  </div>
</template>

<script setup>
 
definePageMeta({
  layout: "landing",
  middleware: 'auth',
});

 
const route = useRoute();

const links = route.path.split('/').slice(1).map((segment, index) => {
  // Construct link label (adapt based on your naming convention)
  const label = segment.charAt(0).toUpperCase() + segment.slice(1);

  // Build the link object (adjust to your routing structure)
  const link = {
    label,
    to: `/${route.path.split('/').slice(1, index + 1).join('/')}`,
  };

  return link;
});

console.log(links)

import axios from 'axios';
import { ref, computed } from 'vue';

import exportFromJSON from 'export-from-json'


const sort = ref({ column: 'code', direction: 'asc' })

const toast = useToast()

const selectedTab = ref(0);
const pageCount = ref(10)
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
 
} ]

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



</script>
