<script setup>
 
 import axios from 'axios';
 import { ref } from 'vue';

 const formData = ref({
      reference: '',
      phone: ''
    });

 const showGrievance=ref(false)
 const grievance=ref({})
 const loading=ref(false)
 const showAcceptButton=ref(false)

async function handleSubmit() {
  showAcceptButton.value=false
       console.log(formData.value)
       loading.value=true
      try {
        const response = await axios.post('https://ussd.ags.co.ke/verify', formData.value);
        const responseData = response.data;
        if(responseData) {
          grievance.value =responseData.grievance
          showGrievance.value=true
          loading.value=false
          console.log('responseData.grievance.Resolution',responseData.grievance)
          if(responseData.grievance.resolution !="Pending"){
            showAcceptButton.value=true
          }
            console.log('showAcceptButton',showAcceptButton.value)
        }
        console.log('Form submitted successfully:', responseData);
        // Do something with the response data if needed
      } catch (error) {
        showGrievance.value=false

        console.error('Error submitting form:', error.message);
        // Handle the error
      }
    }
 
 
</script>
<template>
  <div class="flex justify-center items-center h-full">
    <form method="POST" class="needs-validation flex flex-wrap gap-4" novalidate ref="form">
      <input type="checkbox" class="hidden" style="display: none" name="botcheck" />
      <div class="flex flex-col w-full sm:w-auto">
        <input type="text" placeholder="Reference" required
          class="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
          name="reference" v-model="formData.reference" />
        <div class="empty-feedback invalid-feedback text-red-400 text-sm mt-1">
          Please provide a reference.
        </div>
      </div>
      <div class="flex flex-col w-full sm:w-auto">
        <input id="phone" type="tel" placeholder="Phone" required
          class="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
          name="phone" v-model="formData.phone" />
        <div class="empty-feedback text-red-400 text-sm mt-1">
          Please provide your phone number.
        </div>
        <div class="invalid-feedback text-red-400 text-sm mt-1">
          Please provide a valid phone number.
        </div>
      </div>
      <UButton  icon="i-heroicons-magnifying-glass-circle"   type="button" @click="handleSubmit"  color="green" 
        class="self-end  text-white font-bold py-4 px-4 rounded">
        Check Status
      </UButton>  
 
      <div id="result" class="mt-3 text-center w-full"></div>
    </form>



  </div>

  
  <UCard v-show="showGrievance">
    <template #header>
      <v-card-title><strong> Grievance Status</strong> </v-card-title>
    </template>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>

    <v-card-text>
      <p><strong>Name:</strong> {{ grievance.name }}</p>
      <p><strong>Phone:</strong> {{ grievance.phone }}</p>
      <p><strong>County:</strong> {{ grievance.county }}</p>
      <p><strong>Subcounty:</strong> {{ grievance.subcounty }}</p>
      <p><strong>Complaint:</strong> {{ grievance.complaint }}</p>
      <p><strong>Status:</strong> {{ grievance.status }}</p>
      <p><strong>Resolution:</strong> {{ grievance.resolution }}</p>
    </v-card-text>
    <template #footer>
      <v-card-footer class="d-flex justify-end">
        <UButtonGroup size="sm" orientation="horizontal">
    <UButton v-show="showAcceptButton" icon="i-heroicons-check-badge-16-solid" label="Accept" color="green" />
    <UButton icon= "i-heroicons-arrow-uturn-left-20-solid"  label="Withdraw"  color="gray" />
    <UButton icon="i-heroicons-arrow-right"  label="Escalate"  color="red" />
  </UButtonGroup>
      </v-card-footer>
    </template>

  </UCard>

  <UCard v-show="!showGrievance">
    <template #header>
      <v-card-title> <strong> Status </strong> </v-card-title>
    </template>
    <v-card-text>
      <p>No grievance for the given information  </p>
     
    </v-card-text>
  </UCard>

 
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
