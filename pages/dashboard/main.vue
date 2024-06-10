<script setup>
definePageMeta({
  layout: "landing",
 });
</script>
 



<template>
  <LandingContainer>
    <LandingSectionhead>
      <template v-slot:title>Main Dashboard</template>
      <template v-slot:desc
        >Charts n maps here.</template
      >
    </LandingSectionhead>
 
    <div class="grid md:grid-cols-3 gap-10 mx-auto max-w-screen-lg mt-12">
      <LandingPricing v-for="item of pricing" :plan="item" />
    </div>
  </LandingContainer>
</template>
