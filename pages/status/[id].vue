<script setup>
definePageMeta({
  layout: "landing",
});
</script>

<template>
  <LandingContainer>
    <LandingSectionhead >
      <template v-slot:title>Status</template>
      <template v-slot:desc>The status of your grievance will be shown here.</template>

     </LandingSectionhead>

      
      <div>
        <LandingStatusform />
      </div>
   </LandingContainer>
</template>
