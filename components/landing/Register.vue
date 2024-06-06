<template>
  <UCard :ui="{ body: { base: 'grid grid-cols-1 sm:grid-cols-1', justify: 'center' }, style: { width: '10%' },  shadow: 'shadow' }">
    <!-- Form Section -->

    <UForm :validate="validate" :state="form" class="grid grid-cols-1 sm:grid-cols-2 gap-4" @submit="onSubmit">
    <div class="sm:col-span-1 space-y-4">
      <UFormGroup label="Your Name " name="Name">
        <UInput v-model="form.name" placeholder="John Mpenda Pesa" variant="outline" />
      </UFormGroup>
  
    
      <UFormGroup label="Telephone" name="Telephone" required>
        <UInput v-model="form.phone" type="text" placeholder="0700 000 000" required />
      </UFormGroup>

      <UFormGroup label="Gender" name="Gender" required>
        <USelect v-model="form.gender" :options="Gender" placeholder="Select" required />
      </UFormGroup>

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
     
    </div>

    <div class="sm:col-span-1 space-y-4">
      <UFormGroup label="County" name="County" required>
        <USelect v-model="form.county" :options="counties" placeholder="Select" @change="getSubCounties" required>
        </USelect>
      </UFormGroup>

      <UFormGroup label="Subcounty" name="Subcounty" required>
        <USelect v-model="form.subcounty" :options="subcounties" placeholder="Select" @change="getWards" required :disabled="subcounty_disabled" />
      </UFormGroup>

      <UFormGroup label="Ward" name="Ward" required>
        <USelect v-model="form.ward" :options="wards" placeholder="Select" @change="getSettlements" required  :disabled="ward_disabled"/>
      </UFormGroup>

      <UFormGroup label="Settlement" name="Settlement" required>
        <USelect v-model="form.settlement" :options="settlements" placeholder="Select" required  :disabled="settlements_disabled"/>
      </UFormGroup>

  

      <UButton  :loading="loading"  label="Register" type="submit" color="green" style="margin-right: 10px;" >

      <template #trailing>
        <UIcon name=" i-heroicons-cloud-arrow-up-solid" class="w-5 h-5" />
      </template>
    </UButton>

      <!-- <UButton label="Clear" color="red" @click="handleClear"  /> -->

      <UButton  label="Clear"   color="red" @click="handleClear" >
      <template #trailing>
        <UIcon name=" i-heroicons-x-circle-16-solid" class="w-5 h-5" />
      </template>
    </UButton>
     </div>
  </UForm>


    <!-- <div class="space-y-4">
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
        <UButton :loading="loading" label="Register" type="button" color="green" block @click="handleSubmit" />
      </div>


     </div> -->
  </UCard>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

 

const form = reactive({
  username: '',
  password: '',
  name: '',
  phone: '',
  gender: '',
  county: '',
  subcounty: '',
  ward: '',
  settlement: '',
 
})

const toast = useToast()
const loading = ref(false);
const showPassword = ref(false);

async function onSubmit() {
  try {

    let select_county = counties.value.filter(obj => obj.value == form.county )
  let select_subcounty = subcounties.value.filter(obj => obj.value == form.subcounty )
  let select_ward = wards.value.filter(obj => obj.value == form.ward )
  let select_settlement = settlements.value.filter(obj => obj.value == form.settlement )



    loading.value = true;
    const response = await axios.post('/api/register', {
      username: form.username,
      password: form.password,
      gender: form.gender,
      phone: form.phone,
      county: select_county[0].label,
      subcounty: select_subcounty[0].label,
      ward: select_ward[0].label,
      settlement: select_settlement[0].label,
      settlement_id: form.settlement,
    });
    console.log(response)

    if(response.data.code =='0000') {
      console.log(response.data.message)
      toast.add({ title:response.data.message })
      router.push({ path: "/login" })


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

const router = useRouter()

async function xonSubmit() {
  

  let select_county = counties.value.filter(obj => obj.value == form.county )
  let select_subcounty = subcounties.value.filter(obj => obj.value == form.subcounty )
  let select_ward = wards.value.filter(obj => obj.value == form.ward )
  let select_settlement = settlements.value.filter(obj => obj.value == form.settlement )


 
 console.log("Submit.......")
 loading.value=true
    form.phone = convertPhoneNumber(form.phone)

    const formData = new FormData()

  //formData.append('name', form.name)
  formData.append('name',  form.name === '' ? 'Anonymous' :  form.name);
  formData.append('username', form.username)
  formData.append('password', form.password)
  formData.append('phone', form.phone)
  formData.append('gender', form.gender)
  formData.append('gbv', form.gbv)
  formData.append('county', select_county[0].label )
  formData.append('subcounty', select_subcounty[0].label)
  formData.append('ward', select_ward[0].label)
  formData.append('settlement', select_settlement[0].label)
  formData.append('settlement_id', form.settlement)
    
    // Log each entry in the FormData object
    for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
  // Perform file upload and form submission
 //uploadFile(formData)

 const response = await axios.post('/api/admin/register', formData)

 

if(response.data.success){
    toast.add({ title: 'Registered successfully!' })
    loading.value=false

  router.push({ path: "/login" })


  } else {
    toast.add({ title: 'User registration failed!', color:"red" })
    loading.value=false


  }
  
console.log(response)
 
}

async function togglePassword() {
  showPassword.value=!showPassword.value
 }


 const counties = ref([])

async function getCounties() {
  let formData = { model: "county" };
  try {
    const response = await axios.post('https://ussd.ags.co.ke/admin', formData);
    console.log(response)
    const responseData = response.data.data;
    if (responseData) {
      // Assuming responseData is an array of objects with 'name' property
      const countyOptions = responseData.map(county => ({
        label: county.name, // Change 'name' to the actual property name from response data
        value: county.code // Change 'id' to the actual property name from response data
      }));

      countyOptions.sort((a, b) => a.value - b.value);

      console.log("County Options:", countyOptions);

      // Assuming you have a 'counties' variable defined as ref or reactive
      counties.value = countyOptions;
    }
  } catch (error) {
    console.error('Error fetching counties:', error.message);
  }
}


onMounted(getCounties);
 
const subcounty_disabled=ref(true)
const ward_disabled=ref(true)
const settlements_disabled=ref(true)


const subcounties = ref([])

async function getSubCounties(parent) {
  subcounties.value=[]
  wards.value=[]
  settlements.value=[]

  let formData = { model: "subcounty", field: "county_id", filter_value:parseInt(parent) };
  try {
    const response = await axios.post('https://ussd.ags.co.ke/admin', formData);
 
    const responseData = response.data.data;
    if (responseData) {
      // Assuming responseData is an array of objects with 'name' property
      const adminOptions = responseData.map(admin => ({
        label: admin.name, // Change 'name' to the actual property name from response data
        value: admin.code // Change 'id' to the actual property name from response data
      }));

      adminOptions.sort((a, b) => a.value - b.value);

      console.log("admin Options:", adminOptions);
      subcounty_disabled.value=false

      // Assuming you have a 'counties' variable defined as ref or reactive
      subcounties.value = adminOptions;
    }
  } catch (error) {
    console.error('Error fetching counties:', error.message);
  }
}


const wards = ref([])

async function getWards(parent) {
  wards.value=[]
  settlements.value=[]

  let formData = { model: "ward", field: "subcounty_id", filter_value:parseInt(parent) };
  try {
    const response = await axios.post('https://ussd.ags.co.ke/admin', formData);
 
    const responseData = response.data.data;
    if (responseData) {
      // Assuming responseData is an array of objects with 'name' property
      const adminOptions = responseData.map(admin => ({
        label: admin.name, // Change 'name' to the actual property name from response data
        value: admin.code // Change 'id' to the actual property name from response data
      }));

      adminOptions.sort((a, b) => a.value - b.value);

      console.log("admin Options:", adminOptions);
      ward_disabled.value=false
      // Assuming you have a 'counties' variable defined as ref or reactive
      wards.value = adminOptions;
    }
  } catch (error) {
    console.error('Error fetching counties:', error.message);
  }
}

const settlements = ref([])
 
async function getSettlements(parent) {
 
  settlements.value=[]

  let formData = { model: "settlement", field: "ward_id", filter_value:parseInt(parent) };
  try {
    const response = await axios.post('https://ussd.ags.co.ke/admin', formData);
 
    const responseData = response.data.data;
    if (responseData) {
      // Assuming responseData is an array of objects with 'name' property
      const adminOptions = responseData.map(admin => ({
        label: admin.name, // Change 'name' to the actual property name from response data
        value: admin.code // Change 'id' to the actual property name from response data
      }));

      adminOptions.sort((a, b) => a.value - b.value);

      console.log("admin Options:", adminOptions);
      settlements_disabled.value=false

      // Assuming you have a 'counties' variable defined as ref or reactive
      settlements.value = adminOptions;
    }
  } catch (error) {
    console.error('Error fetching counties:', error.message);
  }
}


 const Gender = ['Male', 'Female' ]
 
 
 

function convertPhoneNumber(phoneNumber: string | undefined) {
  const trimmedPhoneNumber = phoneNumber.replace(/\s+/g, '').trim();


  if (trimmedPhoneNumber.startsWith('0')) {
    return '254' + trimmedPhoneNumber.slice(1);
  }
  return trimmedPhoneNumber;
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
