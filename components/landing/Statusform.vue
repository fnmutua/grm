<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
 

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


 
async function handleSubmit() {
 
  try {
    const response = await axios.post('https://ussd.ags.co.ke/id', form);
    const responseData = response.data.data;
    console.log('responseData', responseData);

    if (responseData) {
        loading.value = false;
        showGrievance.value = true;
        grievance.value=responseData

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

         <!--  <template #footer>
            <UButtonGroup size="sm" orientation="horizontal"  v-show="showGrievance">
              <UButton v-show="showAcceptButton" icon="i-heroicons-check-badge-16-solid" label="Accept" color="green" />
              <UButton icon="i-heroicons-arrow-uturn-left-20-solid" label="Withdraw" color="gray" />
              <UButton icon="i-heroicons-arrow-right" label="Escalate" color="red" />
            </UButtonGroup>
          </template> -->
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
