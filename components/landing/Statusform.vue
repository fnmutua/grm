<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
const toast = useToast()


const route = useRoute()
const loading = ref(true)
const showGrievance= ref(false)
const showAcceptButton= ref(false)
const grievance = ref({});



const form = reactive({
  id: '' 
})
onMounted(async () => {
  console.log("get params", route.params.id)
  const grm_id= route.params.id
  form.id =grm_id
  await handleSubmit()
});


// When accessing /posts/1, route.params.id will be 1

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
        grievance.value.phone = await maskPhoneNumber(grievance.value.phone )



      console.log('responseData.data.Resolution', responseData);
      if (responseData.resolution != "Pending") {
        showAcceptButton.value = true;
      }
      console.log('showAcceptButton', showAcceptButton.value);
    }
    console.log('Form submitted successfully:', responseData);
  } catch (error) {
     loading.value = false;
    console.error('Error submitting form:', error.message);
  }
}

/// Up,laod File 
const uploads =ref([])
const showSubmit =ref(false)
async function  handleFileChange(files:File[]){
         let fileObj = await files
        console.log(fileObj[0])
        uploads.value.push(fileObj[0]);
  console.log('files.value',uploads.value[0])
  showSubmit.value=true

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

<template>
  <div class="w-full flex flex-col gap-y-4">
    <UCard  >
        <UCard  >
          <template #header>
            <strong>Grievance Status</strong>
          </template>

          <div v-show="showGrievance">
            <p><strong>Reference:</strong> {{ grievance.code }}</p>
            <p><strong>County:</strong> {{ grievance.county }}</p>
            <p><strong>SubCounty:</strong> {{ grievance.subcounty }}</p>
            <p><strong>Ward:</strong> {{ grievance.ward }}</p>
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
          <UDivider label="***" />

          <UFormGroup label="Do you wish to upload supporting documentation?" name="documentation">
            <UInput  type="file" size="sm" icon="i-heroicons-folder" @change="handleFileChange" />
          </UFormGroup> 
    

          <UButton  :loading="loading"  v-if="showSubmit"  label="Submit" :onClick="uploadFile" color="green" style="margin-right: 10px; margin-top:10px" >
          <template #trailing>
            <UIcon name=" i-heroicons-cloud-arrow-up-solid"  />
          </template>
        </UButton>

        </UCard>
 
    </UCard>
  </div>
</template>



<style>
.invalid-feedback,
.empty-feedback {
  display: none;
}

.was-validated :placeholder-shown:invalid ~ .empty-feedback {
  display: block;
}

.was-validated :not(:placeholder-shown):invalid ~ .invalid-feedback {
  display: block;
}

.is-invalid,
.was-validated :invalid {
  border-color: #dc3545;
}
</style>
