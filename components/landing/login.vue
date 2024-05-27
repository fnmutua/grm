<script setup lang="ts">
import axios from 'axios';
import { ref,computed } from 'vue';


import type { FormError, FormSubmitEvent } from '#ui/types'

const form = reactive({
  reference: undefined,
  phone: undefined
})

 

 

  const loading = ref(false);
const showAcceptButton = ref(false);

 

 
async function handleSubmit() {
  showAcceptButton.value = false;
  console.log(form);

 
}
 

</script>

<template>
 <UCard :ui="{ body: { base: 'grid grid-cols-1 sm:grid-cols-1', justify: 'center' }, style: { width: '10%' },  shadow: 'shadow' }">
    <!-- Form Section -->
    <div class="space-y-4">
        <UFormGroup label="Email" name="text">
            <UInput id="formattedInput"  v-model="form.reference"  />
        </UFormGroup>
        <UFormGroup label="Password" name="password">
            <UInput v-model="form.phone" type="password" p  />
        </UFormGroup>
        <div @keyup="handleSubmit">
            <UButton :loading="loading"  label="Sign In" type="button" color="green" block @click="handleSubmit" />
        </div>
    </div>
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
