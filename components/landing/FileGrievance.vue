<script setup lang="ts">
import axios from 'axios';
  
import { object, string, type InferType } from 'yup'
 
type Schema = InferType<typeof schema>


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
  name: undefined,
  phone: undefined,
  gender: undefined,
  county: undefined,
  subcounty: undefined,
  ward: undefined,
  settlement: undefined,
  complaint: undefined,
  gbv:false
})
 

async function getCounties() {
 
  try {
    const response = await axios.post('https://ussd.ags.co.ke/admin', form);
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



const counties = ['Mombasa', 'Kwale', 'Kilifi']
const subcounties = ['sub001', 'sub002', 'sub003']
const wards = ['w001', 'w002', 'w003']
const settlements = ['001', '002', '0003']
const Gender = ['Male', 'Female' ]
const YesNo = ['Yes', 'No' ]

 
 

function convertPhoneNumber(phoneNumber: string | undefined) {
  const trimmedPhoneNumber = phoneNumber.replace(/\s+/g, '').trim();


  if (trimmedPhoneNumber.startsWith('0')) {
    return '254' + trimmedPhoneNumber.slice(1);
  }
  return trimmedPhoneNumber;
}


async function handleSubmit() {
 

  form.phone = convertPhoneNumber(form.phone)
   
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
  
  <UForm :schema="schema" :state="form" class="grid grid-cols-1 sm:grid-cols-2 gap-4" @submit="handleSubmit">
    <div class="sm:col-span-1  space-y-4">
      <UFormGroup label="Your Name (Optional)" name="Name">
          <UInput v-model="form.name" placeholder="John Mpenda Pesa" variant="outline"     />
        </UFormGroup>

        <UFormGroup label="Telephone" name="Telephone"  required  >
          <UInput v-model="form.phone" type="text" placeholder="0700 000 000"  required />
        </UFormGroup>

        <UFormGroup label="Gender" name="Gender"  required  >
           <USelect v-model="form.gender" :options="Gender"    placeholder="Select" required />
        </UFormGroup>
         
        <UFormGroup label="Is this related to Gender-Based Violence(GBV)?" required  >
           <USelect v-model="form.gbv" :options="YesNo"    placeholder="Select"  required/>
        </UFormGroup>

 
    </div>
    
    <div class="sm:col-span-1  space-y-4">
      <UFormGroup label="County" name="County" required>
      <USelect v-model="form.county" :options="counties"  placeholder="Select" required>
       </USelect>
    </UFormGroup>


        <UFormGroup label="Subcounty" name="Subcounty" required>
           <USelect v-model="form.subcounty" :options="subcounties"   placeholder="Select"  required />
        </UFormGroup>


        <UFormGroup label="Ward" name="Ward" required>
           <USelect v-model="form.ward" :options="wards"   placeholder="Select" required />
        </UFormGroup>


        <UFormGroup label="Settlement" name="Settlement" required>
           <USelect v-model="form.settlement" :options="settlements"    placeholder="Select"  required/>
        </UFormGroup>
    </div>



    <div class="sm:col-span-2  space-y-4">
      <UFormGroup label="Grievance" name="Grievance" required>
          <UTextarea  v-model="form.complaint" placeholder="Provide a detailed description of your complaint" required />
        </UFormGroup>

        <UFormGroup label="Do you have any supporting documentation?" name="documentation">
          <UInput type="file" size="sm" icon="i-heroicons-folder" />
        </UFormGroup>

        <UButton label="Submit" type="submit" color="green" block @click="handleSubmit" />


    </div>
  </UForm>
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
