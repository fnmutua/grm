<template>
  <LandingNavbar></LandingNavbar>


  <div class="grid lg:grid-cols-6 place-items-left pt-16 pb-8 md:pt-8 mt-20">
    <!-- Left Column -->
    <div class="lg:col-span-1">
      <div>
        <UVerticalNavigation :links="links"  />
      </div>
    </div>
    
    <!-- Divider -->
    <UDivider orientation="vertical" class="hidden lg:block" />

    <!-- Right Column -->
    <main class="lg:col-span-4">
    </main>


  </div>
</template>

<script setup lang="ts">
 
 
const links = [
  
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/dashboard/grv'
  },
  {
    label: 'Contact',
    icon: 'i-heroicons-chart-bar',
    to: '/dashboard/main'
  },
  {
    label: 'Command Palette',
    icon: 'i-heroicons-command-line',
    to: '/contact'
  }
];

 
</script>

 