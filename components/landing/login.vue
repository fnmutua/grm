<template>
  <UCard :ui="{ body: { base: 'grid grid-cols-1 sm:grid-cols-1', justify: 'center' }, style: { width: '10%' },  shadow: 'shadow' }">
    <!-- Form Section -->
    <div class="space-y-4">
      <UFormGroup label="Email" name="text">
        <UInput id="formattedInput" v-model="form.username"  class="mr-2"  />
        
      </UFormGroup>


      <UFormGroup  v-if="!showPassword" label="Password" name="password">
        <div class="flex items-center">
          <UInput v-model="form.password" type="password" class="mr-2" />
          <UIcon name="i-heroicons-eye" class="text-gray-500 cursor-pointer" @click="togglePassword" />
        </div>
      </UFormGroup>

      
      <UFormGroup  v-if="showPassword" label="Password" name="password">
        <div class="flex items-center">
        <UInput v-model="form.password" type="text"   class="mr-2"   />
        <UIcon name="i-heroicons-eye-slash" class="text-gray-500 cursor-pointer" @click="togglePassword" />
      </div>

      </UFormGroup>
 

      <div @keyup="handleSubmit">
        <UButton :loading="loading" label="Sign In" type="button" color="green" block @click="handleSubmit" />
      </div>


     </div>
  </UCard>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

const form = ref({
  username: '',
  password: ''
});
const toast = useToast()
const loading = ref(false);
const showPassword = ref(false);

async function handleSubmit() {
  try {
    loading.value = true;
    const response = await axios.post('/api/login', {
      username: form.value.username,
      password: form.value.password
    });
    console.log(response)

    if(response.data.code =='0000') {
      console.log(response.data.message)
      toast.add({ title:response.data.message })


    }
    else {
      console.log(response.data.message)
      toast.add({ title: response.data.message, color:"red" })

    }
  } catch (error) {
    console.error('Error during login:', error.message);
    // Handle error, maybe show an error message to the user
  } finally {
    loading.value = false;
  }
}

async function togglePassword() {
  showPassword.value=!showPassword.value
 }


</script>

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
