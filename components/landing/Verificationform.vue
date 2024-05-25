<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';


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

const validateForm = () => {
  let valid = true;
  errors.value.reference = '';
  errors.value.phone = '';

  if (!formData.value.reference) {
    errors.value.reference = 'Please provide a reference.';
    valid = false;
  }

  const phoneRegex = /^[0-9]{10}$/;
  if (!formData.value.phone) {
    errors.value.phone = 'Please provide your phone number.';
    valid = false;
  } else if (!phoneRegex.test(formData.value.phone)) {
    errors.value.phone = 'Please provide a valid phone number.';
    valid = false;
  }

  return valid;
};

function convertPhoneNumber(phoneNumber) {
  const trimmedPhoneNumber = phoneNumber.replace(/\s+/g, '').trim();


  if (trimmedPhoneNumber.startsWith('0')) {
    return '254' + trimmedPhoneNumber.slice(1);
  }
  return trimmedPhoneNumber;
}


async function handleSubmit() {
  showAcceptButton.value = false;
  console.log(form);

  form.phone = convertPhoneNumber(form.phone)
  // if (!validateForm()) {
  //   return;
  // }

  loading.value = true;
  try {
    const response = await axios.post('https://ussd.ags.co.ke/verify', form);
    const responseData = response.data;
    if (responseData) {
      grievance.value = responseData.grievance;
      showGrievance.value = true;
      loading.value = false;
      console.log('responseData.grievance.Resolution', responseData.grievance);
      if (responseData.grievance.resolution != "Pending") {
        showAcceptButton.value = true;
      }
      console.log('showAcceptButton', showAcceptButton.value);
    }
    console.log('Form submitted successfully:', responseData);
  } catch (error) {
    showGrievance.value = false;
    loading.value = false;
    console.error('Error submitting form:', error.message);
  }
}
</script>

<template>
  <div class="w-full flex flex-col gap-y-4">
    <UCard :ui="{ body: { base: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' } }">
      <!-- Form Section -->
      <div class="col-span-1 space-y-4">
        <UFormGroup label="Grievance Reference Code" name="text">
          <UInput v-model="form.reference" placeholder="GRM-2024-XXXX" />
        </UFormGroup>

        <UFormGroup label="Telephone" name="password">
          <UInput v-model="form.phone" type="text" placeholder="0700 000 000" />
        </UFormGroup>

        <UButton label="Check Status" type="button" color="green" block @click="handleSubmit" />
      </div>

      <!-- Divider -->
      <UDivider label="Status" orientation="vertical"  size="2xs"/>

      <!-- Status Section -->
      <div class="col-span-1 sm:col-span-2 lg:col-span-2 space-y-4">
        <UCard v-show="!showGrievance">
          <template #header>
            <strong>Grievance Status</strong>
          </template>
          <p>No grievance for the given information</p>
        </UCard>

        <UCard v-show="showGrievance">
          <template #header>
            <strong>Grievance Status</strong>
          </template>
          <p><strong>Name:</strong> {{ grievance.name }}</p>
          <p><strong>Phone:</strong> {{ grievance.phone }}</p>
          <p><strong>County:</strong> {{ grievance.county }}</p>
          <p><strong>Subcounty:</strong> {{ grievance.subcounty }}</p>
          <p><strong>Complaint:</strong> {{ grievance.complaint }}</p>
          <p><strong>Status:</strong> {{ grievance.status }}</p>
          <p><strong>Resolution:</strong> {{ grievance.resolution }}</p>
          <template #footer>
            <UButtonGroup size="sm" orientation="horizontal">
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
