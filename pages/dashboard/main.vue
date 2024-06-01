<template>
  <div class="grid lg:grid-cols-12 place-items-left pt-5 pb-8 md:pt-8">
    <!-- Left Column (Side Navigation) -->
    <div class="lg:col-span-2">
      <AdminSideNav />
    </div>
    
    <!-- Right Column (Main Content) -->
    <main class="lg:col-span-9 pt-16 pb-8 md:pt-8 pl-4">

      
         <div>
          <h2 class="font-medium text-2xl text-gray-800">Main Dashboard</h2>
          <p class="text-lg leading-relaxed text-slate-500 mt-3">in progress.....</p>
        </div>
     </main>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "landing",
  middleware:"auth"

});
</script>


 