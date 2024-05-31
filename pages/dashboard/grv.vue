<template>
  
 <div class="grid lg:grid-cols-6 place-items-left pt-16 pb-8 md:pt-8 mt-20">
    <!-- Left Column -->
    <div class="lg:col-span-1">
      <AdminSideNav></AdminSideNav>

    </div>
    
    <!-- Divider -->
    <UDivider orientation="vertical" class="hidden lg:block" />

    <!-- Right Column -->
    <main class="lg:col-span-3">
      <p>GRV</p>
    </main>


  </div>


</template>
<script setup>
definePageMeta({
  layout: "landing",
  middleware:"auth"

});
</script>


 