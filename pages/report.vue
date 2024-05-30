<script setup>
definePageMeta({
  layout: "landing",
 });
</script>

<template>
  <LandingContainer>
    <LandingPageHead>
      <template v-slot:desc>Fill in all the required fields.</template>
    </LandingPageHead>
   
      <div>
        <LandingFileGrievance />
      </div>
   </LandingContainer>
</template>
