<template>
  <div class="grid lg:grid-cols-6 place-items-left pt-16 pb-8 md:pt-8 mt-20">
    <!-- Left Column -->
    <div class="lg:col-span-1">
      <AdminSideNav></AdminSideNav>
    </div>
    
    <!-- Divider -->
 

    <!-- Right Column -->
    <main class="lg:col-span-4 pt-16 pb-8 md:pt-8  ">
      
      <div class="grid md:grid-cols-4 gap-10 mx-auto max-w-4xl mt-16">
        
        <div>
          <h2 class="font-medium text-2xl text-gray-800">Main Dashboard</h2>
          <p class="text-lg leading-relaxed text-slate-500 mt-3">
            in progress.....
          </p>
          
        </div>
         
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
