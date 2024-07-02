<template>
  <div class="grid lg:grid-cols-12 place-items-left pt-5 pb-8 md:pt-8 ">
    <!-- Left Column -->
    <div class="lg:col-span-2">
      <AdminSideNav2></AdminSideNav2>
    </div>

    <div class="lg:col-span-9 pt-16 pb-8 md:pt-8 pl-4 pr-5">
      <!-- Right Column -->
      <UCard>
        <template #header>
          <UButton icon="i-heroicons-chevron-double-left" size="sm" color="primary" variant="ghost" label="Back"
            @click="goBack" style="margin-right: 14;" :trailing="true" />
          Grievance Details: {{ grievance.code }} | {{ grievance.settlement }}
        </template>


        <div v-show="loading">
          <p> Loading...</p>
        </div>

        <div v-show="!showGrievance && !loading">
          <p> No grievances match the provided information</p>
        </div>



        <ol v-show="showGrievance" class="relative border-s border-gray-200 dark:border-gray-700">
          <li v-for="(grievance, index) in grievance_details" :key="index" class="mb-10 ms-6">
            <span
              class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
              <UIcon v-if="grievance.status === 'Accepted'" name="i-heroicons-clipboard-document-check" />
              <UIcon v-else-if="grievance.status === 'Escalated'" name="i-heroicons-arrow-up-right" />
              <UIcon v-else-if="grievance.status === 'Resolved'" name="i-heroicons-check-badge" />
              <UIcon v-else name="i-heroicons-bell-alert" />
            </span>
            <h3 class="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              Grievance {{ grievance.action }}
              <span v-if="grievance.latest"
                class="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">Latest</span>
            </h3>
            <time class="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              {{ grievance.date }}
            </time>
            <p v-if="grievance.resolution" class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
              {{ grievance.resolution }}
            </p>
            <p v-if="grievance.description" class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
              {{ grievance.description }}
            </p>
            <p v-if="grievance.complaint" class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
              {{ grievance.complaint }}
            </p>
            <a href="#"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700">
              <UIcon class="px-4" name="i-heroicons-cloud-arrow-down" />
              <span v-if="grievance.status === 'Accepted'">GRC committee Minutes</span>
              <span v-else>Documentation</span>
            </a>
          </li>
        </ol>




        <UButton :loading="loading" v-if="showSubmit" label="Submit" :onClick="uploadFile" color="green"
          style="margin-right: 10px; margin-top:10px">
          <template #trailing>
            <UIcon name=" i-heroicons-cloud-arrow-up-solid" />
          </template>
        </UButton>



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
import { useRouter } from 'vue-router'
const toast = useToast()

const router = useRouter()
const route = useRoute()
const showSubmit = ref(false)

const form = reactive({
  id: ''
})
const loading = ref(true)
const showGrievance = ref(false)
const showAcceptButton = ref(false)
const grievance = ref({});
const parsedHistory = ref([]);


function formatDate(dateString) {
  // Create a Date object from the dateString
  const date = new Date(dateString);

  console.log('date', dateString)
  // Define the options for formatting the date
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  };

  // Format the date to the specified locale and options
  return date.toLocaleString('en-US', options);
}



onMounted(async () => {
  console.log("get params", route.params.id)
  const grm_id = route.params.id
  form.id = grm_id
  await handleSubmit()
});


const uploads = ref([])
async function handleFileChange(files) {
  let fileObj = files
  console.log(fileObj[0])
  uploads.value.push(fileObj[0]);
  console.log('files.value', uploads.value[0])
  showSubmit.value = true

}


const goBack = async (row) => {

  router.back()


}


function maskPhoneNumber(number) {
  // Convert number to string
  let numberStr = number.toString();

  // Check if the string has at least 9 characters
  if (numberStr.length >= 9) {
    // Replace characters between the third and ninth position with asterisks

    let maskedStr = numberStr.substring(0, 6) + '***' + numberStr.substring(9);
    console.log('maskedStr', maskedStr)
    return maskedStr;
  } else {
    // Return the original number if it's less than 9 characters
    return numberStr;
  }
}

const grievances = [
  {
    status: "Accepted",
    date: "June 25th 2024",
    resolution: "Resolution text here",
    type: "Grievance Resolution Accepted by complainant",
    latest: true,
  },
  {
    status: "Escalated",
    date: "March 25th 2025",
    description: "Complainant not satisfied by SEC GRC. Escalated issue",
    type: "Grievance Escalated to the County GRC committee",
  },
  {
    status: "Created",
    date: "March 25th 2025",
    complaint: "Complaint text here",
    type: "Grievance Received",
  },
]

let grievance_details = []

async function handleSubmit() {
  grievance_details = []
  try {
    const response = await axios.post('/api/grievances/one', form);
    const responseData = response.data.data;
    console.log('responseData', responseData);

    if (responseData) {
      loading.value = false;
      showGrievance.value = true;
      // mask phone number 

      if (responseData.timeline && responseData.timeline.length > 0) {
        console.log(responseData.timeline, responseData.timeline.length);

        responseData.timeline.forEach(historyItem => {
          let event = JSON.parse(historyItem);
          console.log('---', event);
          let obj = {
            date: formatDate(event.date),
            old_date:event.date,
            complaint: responseData.complaint,
            resolution: responseData.resolution,
            remarks: responseData.status,
            status: event.status,
            code: responseData.code,
            action: event.action,
            actor: event.actor,
            mode: event.mode
          };
          console.log('obj-->', obj);

          // Check if the obj already exists in grievance_details
          let isDuplicate = grievance_details.some(detail =>
            detail.status === obj.status &&
            detail.code === obj.code

          );

          if (!isDuplicate) {
            grievance_details.push(obj);
          }
        });
        grievance_details.sort((a, b) => new Date(b.old_date) - new Date(a.old_date));


        console.log('event', grievance_details);
      }


      // Sort the parsed history items by date
      // parsedHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
      console.log('parsedHistory.value', parsedHistory.value);
      



    }
  } catch (error) {
    loading.value = false;
    console.error('Error submitting form:', error.message);
  }
}


async function uploadFile() {

  console.log("Submit.......")
  loading.value = true

  const formData = new FormData()



  // Retrieve file from file input

  if (uploads.value.length > 0) {
    console.log("Has uplaods....", uploads.value[0])
    formData.append('file', uploads.value[0])
    formData.append('fileName', uploads.value[0].name)
    console.log('grievance.code', grievance.value.code)
    formData.append('grievanceCode', grievance.value.code)

  } else {
    showSubmit.value = false
  }




  // Log each entry in the FormData object
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  const response = await axios.post('/api/grievances/documentation', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })


  if (response.data.success) {
    uploads.value = []
    showSubmit.value = false
    toast.add({ title: 'Documentation uploaded successfully!' })

    loading.value = false




  } else {
    toast.add({ title: response.data.message, color: "red" })
    loading.value = false


  }

  console.log(response)

}

</script>

<style scoped>
.el-table th {
  color: black;
}
</style>