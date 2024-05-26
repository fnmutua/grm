<script setup>
definePageMeta({
  layout: "landing",
});
</script>

<template>
  <LandingContainer>
    <LandingSectionhead >
      <template v-slot:title>Status</template>
     </LandingSectionhead>

      
      <div>
        <LandingStatusform />
      </div>
   </LandingContainer>
</template>
