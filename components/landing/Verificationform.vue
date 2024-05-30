<script setup lang="ts">
import axios from 'axios';
import { ref,computed } from 'vue';


import type { FormError, FormSubmitEvent } from '#ui/types'

const form = reactive({
  reference: undefined,
  phone: undefined
})

const validate = (form: any): FormError[] => {
  const errors = []
  if (!form.reference) errors.push({ path: 'reference', message: 'Required' })
  if (!form.phone) errors.push({ path: 'phone', message: 'Required' })
  return errors
}



const formData = ref({
  reference: '',
  phone: ''
});

const showGrievance = ref(false);
const grievance = ref({});
const loading = ref(false);
const showAcceptButton = ref(false);

// Validation states
const errors = ref({
  reference: '',
  phone: ''
});

 


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

function convertPhoneNumber(phoneNumber) {
  const trimmedPhoneNumber = phoneNumber.replace(/\s+/g, '').trim();


  if (trimmedPhoneNumber.startsWith('0')) {
    return '254' + trimmedPhoneNumber.slice(1);
  }
  return trimmedPhoneNumber;
}

const missingGrievance = ref('')

async function handleSubmit() {
  showAcceptButton.value = false;
  console.log(form);

  form.phone = convertPhoneNumber(form.phone)
  form.reference = formattedValue
 

  loading.value = true;
  try {
    const response = await axios.post('https://ussd.ags.co.ke/verify', form);
    const responseData = response.data;
    if (responseData) {
      grievance.value = responseData.grievance;

      grievance.value.phone = await maskPhoneNumber(grievance.value.phone )

      console.log('grievance.phone',grievance.value.telephone)
      showGrievance.value = true;
      loading.value = false;
      console.log('responseData.grievance.Resolution', responseData.grievance);
      if (responseData.grievance.resolution != "Pending") {
        showAcceptButton.value = true;
      }
      console.log('showAcceptButton', showAcceptButton.value);
    } 
   } catch (error) {
    showGrievance.value = false;
    loading.value = false;
    missingGrievance.value="No grievances match the provided information"

    console.error('Error submitting form:', error.message);
  }
}




////////////////////////Formatting Code input //////////////////////////
//---------------------------------------------------------------------
 
// Define a ref for the raw input value
const value = ref('');

// Define a computed property for the formatted value
const formattedValue = computed({
  get() {
    return value.value;
  },
  set(newValue) {
    value.value = formatValue(newValue);
  }
});

// Function to format the input value
function formatValue(value) {
  // Remove all non-alphanumeric characters except the initial 'GRM'
  let cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  // Ensure the prefix 'GRM' is present
  if (!cleaned.startsWith('GRM')) {
    cleaned = 'GRM' + cleaned.substring(3);
  }

  // Limit to 12 characters (GRM + 8 digits)
  cleaned = cleaned.slice(0, 12);

  // Add the dashes back in
  let formatted = cleaned.slice(0, 3);
  if (cleaned.length > 3) {
    formatted += '-' + cleaned.slice(3, 7);
  }
  if (cleaned.length > 7) {
    formatted += '-' + cleaned.slice(7, 11);
  }

  return formatted;
}

// Function to handle input events
function onInput(event) {
  formattedValue.value = event.target.value;
}
//---------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////



</script>

<template>
  <div class="w-full flex flex-col gap-y-4">
    <UCard :ui="{ body: { base: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' } }">
      <!-- Form Section -->
      <div class="col-span-1 space-y-4">
  

        <UFormGroup label="Grievance Code " name="text">
          <UInput id="formattedInput"  v-model="formattedValue"  @input="onInput" placeholder="GRM-XXXX-XXXX" />
        </UFormGroup>



        <UFormGroup label="Telephone" name="password">
          <UInput v-model="form.phone" type="text" placeholder="0700 000 000" />
        </UFormGroup>

        <!-- <UButton label="Check Status" type="button" color="green" block @click="handleSubmit" /> -->
        <div @keyup="handleSubmit">
            <UButton :loading="loading"  label="Submit" type="button" color="green" block @click="handleSubmit" />
          </div>
      </div>

      <!-- Divider -->
      <UDivider label="..." orientation="vertical"  size="2xs"/>

      <!-- Status Section -->
      <div class="col-span-1 sm:col-span-2 lg:col-span-2 space-y-4">
       

        <UCard >
          <UProgress v-show="loading" animation="carousel" />

          <template #header>
            <strong>Grievance Status</strong>
          </template>



          <div v-show="showGrievance">
            <p><strong>Name:</strong> {{ grievance.name }}</p>
          <p><strong>Phone:</strong> {{ grievance.phone }}</p>
          <p><strong>County:</strong> {{ grievance.county }}</p>
          <p><strong>Subcounty:</strong> {{ grievance.subcounty }}</p>
          <p><strong>Complaint:</strong> {{ grievance.complaint }}</p>
          <p><strong>Status:</strong> {{ grievance.status }}</p>
          <p><strong>Resolution:</strong> {{ grievance.resolution }}</p>
          </div>
          <div v-show="!showGrievance">
            <p> {{missingGrievance}}</p>
            <!-- <USkeleton class="h-4 w-[200px]" /> -->


          </div>


          <template #footer  >
            <UButtonGroup size="sm" orientation="horizontal" v-show="showGrievance" >
              <UButton v-show="showAcceptButton" icon="i-heroicons-check-badge-16-solid" label="Accept" color="green" />
              <UButton icon="i-heroicons-arrow-uturn-left-20-solid" label="Withdraw" color="gray" />
              <UButton icon="i-heroicons-arrow-right" label="Escalate" color="red" />
            </UButtonGroup>
          </template>
        </UCard>
      </div>
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
