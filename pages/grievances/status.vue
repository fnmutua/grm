<script setup>
definePageMeta({
  layout: "landing",
});
</script>

<template>
    <NuxtLoadingIndicator />

  <LandingContainer>
    <LandingSectionhead >
      <template v-slot:title>Grievance Status</template>
      <template v-slot:desc>Enter the grievance code and phone number to check the status.</template>
    </LandingSectionhead>

      
      <div>
        <LandingVerificationform />
      </div>
   </LandingContainer>
</template>
