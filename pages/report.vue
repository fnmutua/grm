<script setup>
definePageMeta({
  layout: "landing",
});
</script>

<template>
  <LandingContainer>
    <LandingSectionhead >
      <template v-slot:title>File a Grievance</template>
      <template v-slot:desc>Fill in all the required fields.</template>
    </LandingSectionhead>

      
      <div>
        <LandingFileGrievance />
      </div>
   </LandingContainer>
</template>
