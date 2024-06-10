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
              <!-- <el-scrollbar :height="scrollbarHeight + 'px'">
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
              </el-scrollbar> -->
              <UAccordion :items="items">
              <template #item="{ item, index, open, close }">
                <div>
                  <div   class="accordion-content">
                    <ul>
                      <li v-for="link in item.links" :key="link.url">
                        <!-- <NuxtLink :to="link.url" class="flex items-center space-x-4"> <i :class="link.icon"></i>
                          <span>{{ link.text }}</span>
                        </NuxtLink> -->

                        <ULink
                          :to="link.url" 
                          active-class="text-primary"
                          class="flex items-center p-1.5 pl-6"
                          inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                        {{ link.text }}
                        </ULink>
                      </li>
                    </ul>
                  </div>
                </div>
              </template>
            </UAccordion>
            </div>
          </div>
        </UCard>
      </USlideover>
    </div>

    <div class="grid lg:grid-cols-1">
      <UCard class="flex flex-col flex-3" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <div :class="{ 'hidden': isCollapsed }">
          <div>
            <UAccordion :items="items">
              <template #item="{ item, index, open, close }">
                <div>
                  <div   class="accordion-content">
                    <ul>
                      <li v-for="link in item.links" :key="link.url">
                        <!-- <NuxtLink :to="link.url" class="flex items-center space-x-4"> <i :class="link.icon"></i>
                          <span>{{ link.text }}</span>
                        </NuxtLink> -->

                        <ULink
                          :to="link.url" 
                          active-class="text-primary"
                          class="flex items-center p-1.5 pl-6"
                          inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                        {{ link.text }}
                        </ULink>
                      </li>
                    </ul>
                  </div>
                </div>
              </template>
            </UAccordion>

          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AvatarFallback, AvatarImage, AvatarRoot } from 'radix-vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';

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
      type: 'header'
    }
  ],
  [
    {
      label: 'Open',
      icon: 'i-heroicons-shield-exclamation',
      to: '/grievances/open'
    },
    {
      label: 'Investigate',
      icon: 'i-heroicons-question-mark-circle',
      to: '/grievances/investigate'
    },
    {
      label: 'Resolved',
      icon: 'i-heroicons-check',
      to: '/grievances/resolved'
    },
    {
      label: 'Escalated',
      icon: 'i-heroicons-bars-arrow-up',
      to: '/grievances/escalated'
    }
  ],
  // Group 4
  [
    {
      label: 'Admin',
      type: 'header'
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
    }
  ],
  // Group 5
  [
    {
      label: 'Settings',
      type: 'header'
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

 const items = [{
  label: 'Dashboards',
  icon: 'i-heroicons-chart-bar',
  defaultOpen: true,
  links: [
    { text: 'Overview', url: '/dashboard/main', icon: 'i-heroicons-information-circle' },
    { text: 'Quick Start', url: '/dashboard/grv', icon: 'i-heroicons-information-circle' }
  ]
}, {
  label: 'Grievances',
  icon: 'i-heroicons-arrow-down-tray',
    links: [
    { text: 'Open', url: '/grievances/open', icon: 'i-heroicons-outline-clipboard-list' },
    { text: 'Investigate', url: '/grievances/investigate', icon: 'i-heroicons-outline-steps' },
    { text: 'Resolved', url: '/grievances/resolved', icon: 'i-heroicons-outline-steps' },
    { text: 'Escalated', url: '/grievances/escalated', icon: 'i-heroicons-outline-steps' },
  ]
}, {
  label: 'Admin',
  icon: 'i-heroicons-eye-dropper',
   links: [
    { text: 'Users', url: '/admin/users', icon: 'i-heroicons-person' },
    { text: 'GRCS', url: '/admin/users', icon: 'i-heroicons-outline-light-bulb' },

  ]
}, {
  label: 'Administrative Units',
  icon: 'i-heroicons-rectangle-group',
   links: [
   { text: 'Counties', url: '/theming/best-practices', icon: 'i-heroicons-outline-light-bulb' },
    { text: 'Subcounties', url: '/theming/best-practices', icon: 'i-heroicons-outline-light-bulb' },
    { text: 'Wards', url: '/theming/best-practices', icon: 'i-heroicons-outline-light-bulb' },
    { text: 'Settlements', url: '/theming/best-practices', icon: 'i-heroicons-outline-light-bulb' }
  ]
}, {
  label: 'Settings',
  icon: 'i-heroicons-square-3-stack-3d',
   links: [
    { text: 'Buttons', url: '/components/buttons', icon: 'i-heroicons-outline-button' },
    { text: 'Cards', url: '/components/cards', icon: 'i-heroicons-outline-card' }
  ]
} ]


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
