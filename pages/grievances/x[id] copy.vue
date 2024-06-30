<template>
  <div class="grid lg:grid-cols-12 place-items-left pt-5 pb-8 md:pt-8 ">
        <!-- Left Column -->
        <div class="lg:col-span-2">
          <AdminSideNav2></AdminSideNav2>
        </div> 
    
        <div class="lg:col-span-9 pt-16 pb-8 md:pt-8 pl-4 pr-5">
          


        <!-- Right Column -->
        <UCard  >
          <template #header>
             <UButton
              icon="i-heroicons-chevron-double-left"
              size="sm"
              color="primary"
              variant="ghost"
              label="Back"
              @click="goBack"
              style="margin-right: 14;"
              :trailing="true"
            />
            <strong>Grievance Details</strong>
          </template>

          <div v-show="showGrievance">
            <p><strong>Reference:</strong> {{ grievance.code }}</p>
            <p><strong>Settlement:</strong> {{ grievance.settlement }}</p>
            <p><strong>Complaint:</strong> {{ grievance.complaint }}</p>
            <p><strong>Status:</strong> {{ grievance.status }}</p>
            <p><strong>Resolution:</strong> {{ grievance.resolution }}</p>
          </div>
          <div v-show="loading">
           <p> Loading...</p>
          </div>

          <div v-show="!showGrievance && !loading">
           <p> No grievances match the provided information</p>
          </div>
          <UDivider label="***" style="margin-top: 10px;margin-bottom: 10px;" />

          <UFormGroup label="Do you wish to upload supporting documentation?" name="documentation">
            <UInput  type="file" size="sm" icon="i-heroicons-folder" @change="handleFileChange" />
          </UFormGroup> 
    

          <UButton  :loading="loading"  v-if="showSubmit"  label="Submit" :onClick="uploadFile" color="green" style="margin-right: 10px; margin-top:10px" >
          <template #trailing>
            <UIcon name=" i-heroicons-cloud-arrow-up-solid"  />
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
const showSubmit=ref(false)
 
const form = reactive({
  id: '' 
})
const loading = ref(true)
 const showGrievance= ref(false)
const showAcceptButton= ref(false)
const grievance = ref({});


onMounted(async () => {
  console.log("get params", route.params.id)
  const grm_id= route.params.id
  form.id =grm_id
  await handleSubmit()
});


const uploads =ref([])
async function  handleFileChange(files){
         let fileObj = files
        console.log(fileObj[0])
        uploads.value.push(fileObj[0]);
  console.log('files.value',uploads.value[0])
  showSubmit.value=true

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
        console.log('maskedStr',maskedStr)
        return maskedStr;
    } else {
        // Return the original number if it's less than 9 characters
        return numberStr;
    }
}

async function handleSubmit() {
 
 try {
   const response = await axios.post('/api/grievances/one', form);
   const responseData = response.data.data;
   console.log('responseData', responseData);

   if (responseData) {
       loading.value = false;
       showGrievance.value = true;
       grievance.value=responseData
     // mask phone number 
       grievance.value.phone = (grievance.value.phone )
 
   }
  } catch (error) {
    loading.value = false;
   console.error('Error submitting form:', error.message);
 }
}

  
async function uploadFile() {
  
  console.log("Submit.......")
  loading.value=true
  
     const formData = new FormData()
  
  
   
   // Retrieve file from file input
 
   if ( uploads.value.length>0 ) {
     console.log("Has uplaods....",uploads.value[0]  )
     formData.append('file', uploads.value[0]  )
     formData.append('fileName',uploads.value[0].name)
     console.log( 'grievance.code', grievance.value.code)
     formData.append('grievanceCode', grievance.value.code)
 
   }else {
     showSubmit.value=false
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
   
 
 if(response.data.success){
   uploads.value=[]
   showSubmit.value=false
     toast.add({ title: 'Documentation uploaded successfully!' })
    
     loading.value=false
 
 
  
 
   } else {
     toast.add({ title: response.data.message, color:"red" })
     loading.value=false
 
 
   }
   
 console.log(response)
  
 }   
  
  </script>
  
  <style scoped>
  .el-table th {
    color: black;
  }
  </style>