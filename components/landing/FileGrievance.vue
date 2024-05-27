<script setup lang="ts">
import axios from 'axios';
import { onMounted, reactive, ref  } from 'vue';

import { object, string, type InferType } from 'yup'
import type { FormError, FormSubmitEvent } from '#ui/types'

type Schema = InferType<typeof schema>
  const toast = useToast()
  const router = useRouter()


const disableSubmit =ref(true)
 
 const schema = object({
   phone: string()
      .min(8, 'Must be at least 8 characters')
      .required('Required'),
  county: string()
      .required('Required'),
  subcounty: string()
      .required('Required'),
  ward: string()
      .required('Required'),
  settlement: string()
      .required('Required'),
  gbv: string()
      .required('Required'),


  complaint: string()
      .min(25, 'Must be at least 25 characters')
      .required('Required'),
   name: string()
    .test('is-full-name', 'Must include at least two names', value => {
      return value && value.trim().split(/\s+/).length >= 2;
    })
    .required('Required')
});

const form = reactive({
  name: '',
  phone: '',
  gender: '',
  county: '',
  subcounty: '',
  ward: '',
  settlement: '',
  complaint: '',
  gbv:'',
  file:undefined
})
 
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
const YesNo = ['Yes', 'No' ]

 
 

function convertPhoneNumber(phoneNumber: string | undefined) {
  const trimmedPhoneNumber = phoneNumber.replace(/\s+/g, '').trim();


  if (trimmedPhoneNumber.startsWith('0')) {
    return '254' + trimmedPhoneNumber.slice(1);
  }
  return trimmedPhoneNumber;
}
 

async function handleClear() {
  console.log("clear.......")

  form.name =''
  form.phone=''
  form.gender=''
  form.county=''
  form.subcounty=''
  form.ward=''
  form.settlement=''
  form.complaint=''
  form.gbv=false,
  form.file=undefined
  
}


const validate = (state: any): FormError[] => {
  const errors = []
  if (!form.phone) errors.push({ path: 'phone', message: 'Required' })
  if (!form.gender) errors.push({ path: 'gender', message: 'Required' })
  if (!form.county) errors.push({ path: 'county', message: 'Required' })
  if (!form.subcounty) errors.push({ path: 'subcounty', message: 'Required' })
  if (!form.ward) errors.push({ path: 'ward', message: 'Required' })
  if (!form.settlement) errors.push({ path: 'settlement', message: 'Required' })
  if (!form.gbv) errors.push({ path: 'gbv', message: 'Required' })
  return errors
}

const loading = ref(false)
async function onSubmit() {
  

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

  formData.append('phone', form.phone)
  formData.append('gender', form.gender)
  formData.append('gbv', form.gbv)
  formData.append('county', select_county[0].label )
  formData.append('subcounty', select_subcounty[0].label)
  formData.append('ward', select_ward[0].label)
  formData.append('settlement', select_settlement[0].label)
  formData.append('settlement_id', form.settlement)
  formData.append('complaint', form.complaint)
  
  
  // Retrieve file from file input
 
  if (form.file  ) {
    console.log("Has uplaods....",form.file  )
    formData.append('file', form.file )
  }
 


    // Log each entry in the FormData object
    for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
  // Perform file upload and form submission
 //uploadFile(formData)

 const response = await axios.post('https://ussd.ags.co.ke/grv/add', formData, {
//  const response = await axios.post(' http://localhost/grv/add', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  } 
})

if(response.data.success){
    toast.add({ title: 'Grievance reported successfully!' })
    loading.value=false

    router.push({ path: "/" })


  } else {
    toast.add({ title: 'Grievance reporting failed!', color:"red" })
    loading.value=false


  }
  
console.log(response)
 
}
// Handle file input change event
 

async function  handleFileChange(files:File[]){
         let fileObj = await files
       // console.log(fileObj[0])
        form.file = fileObj[0];
     }


     async function xonSubmit (event: FormSubmitEvent<any>) {
  // Do something with data
  console.log(event.data)
}
</script>
<template>
 

  <UCard>
   
    <UForm :validate="validate" :state="form" class="grid grid-cols-1 sm:grid-cols-2 gap-4" @submit="onSubmit">
    <div class="sm:col-span-1 space-y-4">
      <UFormGroup label="Your Name (Optional)" name="Name">
        <UInput v-model="form.name" placeholder="John Mpenda Pesa" variant="outline" />
      </UFormGroup>

      <UFormGroup label="Telephone" name="Telephone" required>
        <UInput v-model="form.phone" type="text" placeholder="0700 000 000" required />
      </UFormGroup>

      <UFormGroup label="Gender" name="Gender" required>
        <USelect v-model="form.gender" :options="Gender" placeholder="Select" required />
      </UFormGroup>

      <UFormGroup label="Is this related to Gender-Based Violence(GBV)?" required>
        <USelect v-model="form.gbv" :options="YesNo" placeholder="Select" required />
      </UFormGroup>
    
      <UFormGroup label="Grievance" name="Grievance"  >
        <UTextarea  v-model="form.complaint" placeholder="Provide a detailed description of your complaint" required />
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

      <UFormGroup label="Do you have any supporting documentation?" name="documentation">
        <UInput type="file" size="sm" icon="i-heroicons-folder" @change="handleFileChange" />
      </UFormGroup> 

      <UButton  :loading="loading"  label="Submit" type="submit" color="green" style="margin-right: 10px;" >

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


<style>
.notification-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999; /* Ensure it's above other content */
  display: flex;
  justify-content: center;
  padding-top: 20px; /* Adjust as needed */
}

.notification {
  width: 400px; /* Adjust width as needed */
}
</style>

<style scoped>
.button-group {
  display: flex;
  gap: 10px; /* Adjust the gap as needed */
}

.button-group > * {
  flex: 2;
}
</style>