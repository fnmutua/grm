<template>
  <div class="flex items-center justify-center ">  
    <UCard :ui="{ body: { base: 'space-y-4' }, style: { width: '90%', maxWidth: '400px' }, shadow: 'shadow' }">
      <!-- Form Section -->
      <div class="space-y-4 p-4">
        <UFormGroup label="Email" name="text">
          <UInput 
            id="formattedInput" 
            v-model="form.username"  
            class="mr-2"  
            :state="!errors.username ? 'valid' : 'invalid'"
          />
          <div v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</div>
        </UFormGroup>

        <UFormGroup v-if="!showPassword" label="Password" name="password">
          <div class="flex items-center">
            <UInput 
              v-model="form.password" 
              type="password" 
              class="mr-2"
              :state="!errors.password ? 'valid' : 'invalid'"
            />
            <UIcon name="i-heroicons-eye" class="text-gray-500 cursor-pointer" @click="togglePassword" />
          </div>
          <div v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</div>
        </UFormGroup>

        <UFormGroup v-if="showPassword" label="Password" name="password">
          <div class="flex items-center">
            <UInput 
              v-model="form.password" 
              type="text" 
              class="mr-2"
              :state="!errors.password ? 'valid' : 'invalid'"
            />
            <UIcon name="i-heroicons-eye-slash" class="text-gray-500 cursor-pointer" @click="togglePassword" />
          </div>
          <div v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</div>
        </UFormGroup>

        <div @keyup="handleSubmit">
          <UButton :loading="loading" label="Sign In" type="button" color="green" block @click="handleSubmit" />
        </div>
      </div>
    </UCard>
  </div>
</template>
<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

const { redirectedFrom } = useRoute();

definePageMeta({
  layout: "landing",
});
 


const form = ref({
  username: '',
  password: ''
});
const toast = useToast()
const loading = ref(false);
const showPassword = ref(false);

const router = useRouter()

 
//const { logout , login} = useAuth();

const errors = reactive({
      username: null,
      password: null
    });

const validate = () => {
      errors.username = !form.value.username ? 'Email is required' : null;
      errors.password = !form.value.password ? 'Password is required' : null;
      
      return !errors.username && !errors.password;
    };


const { signIn } = useAuth()



const mySignInHandler = async ({ username, password }: { username: string, password: string }) => {
  const { error, url } = await signIn('credentials', { username, password, redirect: false })
  if (error) {
    // Do your custom error handling here
    alert('You have made a terrible mistake while entering your credentials')
  } else {
    // No error, continue with the sign in, e.g., by following the returned redirect:
    return navigateTo(url, { external: true })
  }
}


const handleSubmit = async () => {
  if (validate()) {
    loading.value = true;
    const credentials = {
      username: form.value.username,
      password: form.value.password
    };

    try {
     const response =  await signIn(
        credentials,
        {
          callbackUrl: redirectedFrom ? redirectedFrom.fullPath : '/dashboard/grv',
        },
      );
      console.log(response)
    } catch (error) {

      console.log('Error during sign-in:', error);
      toast.add({ title: 'Invalid credentials', color:"red" })
      loading.value = false;

      
      // Optionally handle the error, e.g., show an error message to the user
    } finally {
      loading.value = false;
    }
  }
};

 

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
