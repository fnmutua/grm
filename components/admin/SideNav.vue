<template>
  <div>
    <!-- Left Column -->
    <div>
      <UButton 
        v-if="isCollapsed" 
        icon="i-heroicons-bars-2" 
        color="gray" 
        variant="ghost"  
        @click="isOpen = true" 
      />

      <USlideover v-model="isOpen" side="left" :style="{ width: '250px' }" prevent-close>
        <UCard class="flex flex-col flex-1" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Menu</h3>
              <div class="flex gap-5">
                <AvatarRoot class="bg-blackA3 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full align-middle">
                  <AvatarImage
                    class="h-full w-full rounded-[inherit] object-cover"
                    src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
                    alt="Colm Tuite"
                  />
                  <AvatarFallback
                    class="text-grass11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
                    :delay-ms="600"
                  >
                    CT
                  </AvatarFallback>
                </AvatarRoot>
              </div>
              <UButton 
                color="gray" 
                variant="ghost" 
                icon="i-heroicons-chevron-double-left" 
                class="-my-1" 
                @click="isOpen = false" 
              />
            </div>
          </template>

          <div class="lg:col-span-1" :class="{ 'hidden': !isCollapsed }">
            <div>
              <el-scrollbar :height="scrollbarHeight + 'px'">
                <UVerticalNavigation :links="links">
                  <template #default="{ link }">
                    <span 
                      class="group-hover:text-primary relative" 
                      :class="{ 'font-bold': link.type === 'header' }"
                    >
                      {{ link.label }}
                    </span>
                  </template>
                </UVerticalNavigation>
              </el-scrollbar>
            </div>
          </div>
        </UCard>
      </USlideover>
    </div>

    <div class="grid lg:grid-cols-1">
      <UCard class="flex flex-col flex-3" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <div :class="{ 'hidden': isCollapsed }">
          <div>
            <el-scrollbar :height="scrollbarHeight + 'px'">
              <UVerticalNavigation :links="filteredLinks">
                <template #default="{ link }">
                  <span 
                    class="group-hover:text-primary relative" 
                    :class="{ 'font-bold': link.type === 'header' }"
                  >
                    {{ link.label }}
                  </span>
                </template>
              </UVerticalNavigation>
            </el-scrollbar>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AvatarFallback, AvatarImage, AvatarRoot } from 'radix-vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const { data } = useAuth();  // user data from session 



const scrollbarHeight = ref(890); // Initial height based on current window size



// Function to update the scrollbar height
const updateScrollbarHeight = () => {
  scrollbarHeight.value = window.innerHeight;
  isCollapsed.value = window.innerWidth <= 850;

};

// Detect screen size on mount and add event listener for resize
onMounted(() => {
  updateScrollbarHeight(); // Set initial height
  window.addEventListener('resize', updateScrollbarHeight); // Update height on resize
});



const isOpen = ref(false);

// Reactive variable to track sidebar collapse state
const isCollapsed = ref(false);

// Function to toggle sidebar collapse state
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};


// const isAdmin =  user.roles.includes("ADMIN");
// const isUser =  user.roles.includes("USER");
// const isSettGRC =  user.roles.includes("SETTLEMENT_GRC");
// const isCountyGRC =  user.roles.includes("COUNTY_GRC");
// const isNationalGRC =  user.roles.includes("NATIONAL_GRC");
// const isGBV =  user.roles.includes("GBV");


const links = [
  // Group 1
  [
    {
      label: 'Dashboards',
      type: 'header'
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
      type: 'header',
      roles:['isAdmin','isGBV','isSettGRC','isCountyGRC','isNationalGRC','isGBV']

    }
  ],
  [
    {
      label: 'Open',
      icon: 'i-heroicons-shield-exclamation',
      to: '/grievances/open',
      roles:['isAdmin','isGBV','isSettGRC','isCountyGRC','isNationalGRC','isGBV']

    },
    {
      label: 'Investigate',
      icon: 'i-heroicons-question-mark-circle',
      to: '/grievances/investigate',
      roles:['isAdmin','isGBV','isSettGRC','isCountyGRC','isNationalGRC','isGBV']

    },
    {
      label: 'Resolved',
      icon: 'i-heroicons-check',
      to: '/grievances/resolved',
      roles:['isAdmin','isGBV','isSettGRC','isCountyGRC','isNationalGRC','isGBV']

    },
    {
      label: 'Escalated',
      icon: 'i-heroicons-bars-arrow-up',
      to: '/grievances/escalated',
      roles:['isAdmin','isGBV','isSettGRC','isCountyGRC','isNationalGRC','isGBV']

    }
  ],
  [
    {
      label: 'GBV',
      type: 'header',
      roles:['isGBV']

    }
  ],
  [
    {
      label: 'Open',
      icon: 'i-heroicons-shield-exclamation',
      to: '/grievances/open',
      roles:['isGBV']

    },
    {
      label: 'Investigate',
      icon: 'i-heroicons-question-mark-circle',
      to: '/grievances/investigate',
      roles:['isGBV']

    },
    {
      label: 'Resolved',
      icon: 'i-heroicons-check',
      to: '/grievances/resolved',
      roles:['isGBV']

    },
    {
      label: 'Escalated',
      icon: 'i-heroicons-bars-arrow-up',
      to: '/grievances/escalated',
      roles:['isGBV']

    }
  ],

  // Group 4
  [
    {
      label: 'Admin',
      type: 'header',
      roles:['isAdmin']

    }
  ],
  [
    {
      label: 'Users',
      icon: 'i-heroicons-user',
      to: '/admin/users',
      roles:['isAdmin']
    },
    {
      label: 'GRCs',
      icon: 'i-heroicons-user-group',
      roles:['isAdmin']

    }
  ],
  // Group 5
  [
    {
      label: 'Settings',
      type: 'header',
      roles:['isAdmin']

    }
  ],
  [
    {
      label: 'Logs',
      icon: 'i-heroicons-user',
      roles:['isAdmin']

    },
    {
      label: 'Roles',
      icon: 'i-heroicons-user-group',
      roles:['isAdmin']

    },
    {
      label: 'Settlements',
      icon: 'i-heroicons-map-pin',
      roles:['isAdmin']

    }
  ]
];



 // Computed property to filter the links based on user roles
// Computed property to filter the links based on user roles and remove empty groups
const filteredLinks = computed(() => {
  return links
    .map(group => {
      // Filter links within each group
      const filteredGroup = group.filter(link => {
        if (link.roles) {
          // Check if the user has at least one of the roles required for this link
          return link.roles.some(role => data.value[role]);
        }
        // Include links without roles
        return true;
      });
      // Return the filtered group if it's not empty
      return filteredGroup.length > 0 ? filteredGroup : null;
    })
    .filter(group => group !== null); // Remove null groups
});
console.log('filteredLinks',filteredLinks.value)


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
