<template>
    <div>
      <div class="grid lg:grid-cols-1 " >
        <!-- Left Column -->
        <div>
    <!-- Initial button -->
    <UButton v-if="!isCollapsed" icon='i-heroicons-bars-2' color="gray" variant="ghost"  @click="isOpen = true"  />
 
    <USlideover v-model="isOpen" side="left" :style="{ width: '250px' }" prevent-close>
  <UCard class="flex flex-col flex-1" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          Menu
        </h3>
        <UButton color="gray" variant="ghost" icon="i-heroicons-chevron-double-left" class="-my-1" @click="isOpen = false" />
      </div>
    </template> 



    <div class="lg:col-span-1" :class="{ 'hidden': isCollapsed }">
            <div>
                <UVerticalNavigation :links="links">
                    <template #default="{ link }">
                    <span class="group-hover:text-primary relative" :class="{ 'font-bold': link.type === 'header' }">{{ link.label }}</span>
                    </template>
                </UVerticalNavigation>
                </div>

        </div>
  </UCard>
</USlideover>


  </div>

  
      
      </div>
    </div>
  </template>
   

<script setup lang="ts">
 
 

 const isOpen = ref(false)


// Reactive variable to track sidebar collapse state
const isCollapsed = ref(false);

// Function to toggle sidebar collapse state
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

  const links = [
    // Group 1
    [
      {
        label: 'Dashboards',
        type:'header'
      }
    ],
    // Group 2
    [
      {
        label: 'Home',
        icon: 'i-heroicons-home',
        to: '/dashboard/main',
        
      },
      {
        label: 'Contact',
        icon: 'i-heroicons-chart-bar',
        to: '/dashboard/grv'
      },
      {
        label: 'Command Palette',
        icon: 'i-heroicons-command-line',
        to: '/contact'
      }
    ],
    
    // Group 3
    [
      {
        label: 'Grievances',
        type:'header'

      }
    ],
    [ 

      {
        label: 'Pending',
        icon: 'i-heroicons-shield-exclamation',
        to: '/grievances/open'

      },
      {
        label: 'Resolved',
        icon: 'i-heroicons-check',
        to: '/grievances/resolved'

      }
      ,
      {
        label: 'Escalated',
        icon: 'i-heroicons-bars-arrow-up',
        to: '/grievances/escalated'

      }
      


    ],

 // Group 3
     [
      {
        label: 'Admin',
        type:'header'

      }
    ],
    [
      {
        label: 'Users',
        icon: 'i-heroicons-user',
        to: '/admin/users'

      },
      {
        label: 'GRCs',
        icon: 'i-heroicons-user-group'
      },
      
    ],


 // Group  
 [
      {
        label: 'Settings',
        type:'header'

      }
    ],
    [
      {
        label: 'Logs',
        icon: 'i-heroicons-user'
      },
      {
        label: 'Roles',
        icon: 'i-heroicons-user-group'
      },
      {
        label: 'Settlements',
        icon: 'i-heroicons-map-pin'
      }
    ]



  ];

 
  </script>
  
  
  <style scoped>
  /* Your scoped styles go here */
  
  /* Hide sidebar on smaller screens when collapsed */
  @media (max-width: 767px) {
    .place-items-left {
      display: flex;
      flex-direction: column;
    }
  }
  </style>