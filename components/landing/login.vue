<template>
  <div class="flex items-center justify-center ">  
   

    

<div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
    <form class="space-y-6" action="#">
        <div>
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
            <input   id="formattedInput" 
            v-model="form.username"   type="email" name="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required />
        </div>
 

        <div  >
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
             <div   v-if="showPassword" class="flex">
            <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
              <UIcon name="i-heroicons-eye" class="text-gray-500 cursor-pointer" @click="togglePassword" />
            </span>
            <input type="text"  v-model="form.password"  class="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="••••••••" required>
          </div>


          <div v-if="!showPassword" class="flex">
            <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
              <UIcon name="i-heroicons-eye-slash" class="text-gray-500 cursor-pointer" @click="togglePassword" />
            </span>
            <input type="password"  v-model="form.password"  class="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="••••••••">
          </div>

         

        </div>
      


        <!-- <div class="flex items-start">
            <div class="flex items-start">
                <div class="flex items-center h-5">
                    <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"   />
                </div>
                <label for="remember" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
            </div>
            <a href="#" class="ms-auto text-sm text-blue-700 hover:underline dark:text-blue-500">Lost Password?</a>
        </div> -->


        <!-- <button @click="handleSubmit" class="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Login to your account</button> -->
        <UButton @click="handleSubmit" class="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 flex justify-center items-center">
    Login to your account
</UButton>

        <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
            Not registered? <a href="#" class="text-green-700 hover:underline dark:text-green-500">Create account</a>
        </div>
    </form>
</div>

  </div>
</template>
<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
const {   signIn, signOut   } = useAuth()

const { redirectedFrom } = useRoute();

     
 
onMounted(async () => {
  console.log("Mount Signout")
 // await signOut()
 })

const form = ref({
  username: '',
  password: ''
});
const toast = useToast()
const loading = ref(false);
const showPassword = ref(false);

 
 
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


 


 


const handleSubmit = async () => {

  console.log('handlesubmit....')
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
          callbackUrl: redirectedFrom ? redirectedFrom.fullPath : '/dashboard/main',
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
