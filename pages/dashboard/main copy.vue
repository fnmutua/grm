<script setup>
definePageMeta({
  layout: "landing",
 });
 
 

</script>
 


<template>
  <LandingContainer>   

   
    <div class="grid md:grid-cols-4 gap-10 mx-auto max-w-screen-lg mt-12 pt-10">
      <StatCard
        title="Total Grievances"
        value="1,234"
        icon="i-heroicons-megaphone"
        class="bg-slate-50  text-black-600"
      />
      <StatCard
        title="Open Grievances"
        value="$56,789"
        icon="i-heroicons-phone-arrow-down-left"
        class="bg-slate-50  text-red-600"
      />
      <StatCard
        title="GBV Grievances"
        value="123"
        icon="i-heroicons-hand-thumb-down"
        class="bg-slate-50 text-pink-400 underline decoration-pink-500"
      />
      <StatCard
        title="Resolved"
        value="456"
        icon="i-heroicons-hand-thumb-up"
        class="bg-lime-300 text-black shadow-inner  "
      />

    </div>

    <div class="grid gap-10 mx-auto max-w-screen-lg mt-12">
      <UDivider label="****" />

 </div>
  </LandingContainer>
</template>