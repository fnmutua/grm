<script setup>
definePageMeta({
  layout: "landing",
});
</script>

<template>
    <NuxtLoadingIndicator />

  <LandingContainer>
    <LandingSectionhead >
      <template v-slot:title>Register</template>
      <template v-slot:desc>Fill in all required details.</template>
    </LandingSectionhead>
 
      <div>
        <LandingRegister />
      </div>
   </LandingContainer>
</template>
