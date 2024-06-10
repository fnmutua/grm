<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Sidebar -->
    <aside :class="['fixed lg:static lg:translate-x-0 transform top-0 left-0 w-64 bg-white dark:bg-gray-800 p-4 h-full z-50 transition-transform duration-300 ease-in-out', { '-translate-x-full': !isSidebarOpen }]">
      <nav class="mt-4 py-15">
      <ul>
        <template v-for="group in links">
          <li v-if="group.type === 'header'" :key="group.label + '_header'" class="my-2">
            <span class="font-bold text-gray-600 dark:text-gray-400">{{ group.label }}</span>
          </li>
          <template v-else>
            <li v-for="link in group.children" :key="link.label" class="my-2">
              <nuxt-link
                :to="link.to"
                class="flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                @click="closeSidebar"
              >
                <i :class="link.icon" class="mr-2"></i>
                {{ link.label }}
              </nuxt-link>
            </li>
          </template>
        </template>
      </ul>
    </nav>

      <div class="mt-4">
        <button @click="toggleDarkMode" class="w-full p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
          <i :class="isDarkMode ? 'i-heroicons-sun' : 'i-heroicons-moon'" class="mr-2"></i>
          {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <header class="p-4 bg-white dark:bg-gray-800 flex justify-between items-center lg:hidden">
        <button
      @click="toggleSidebar"
      class="fixed   lg:left-72 z-50   text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-md shadow-md lg:shadow-none lg:bg-transparent lg:dark:bg-transparent"
    >
      <i :class="isSidebarOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-4'"></i>
    </button>
       </header>
      <main class="flex-1 p-6">
         <slot></slot>
      </main>
    </div>

    <!-- Sidebar Toggle Button -->
  

    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Avatar component
const Avatar = {
  template: `
    <div class="bg-gray-300 dark:bg-gray-700 h-10 w-10 rounded-full"></div>
  `
};

// Links for the sidebar navigation
const xlinks = ref([
  { label: 'Home', icon: 'i-heroicons-home', to: '/' },
  { label: 'About', icon: 'i-heroicons-information-circle', to: '/about' },
  { label: 'Contact', icon: 'i-heroicons-phone', to: '/contact' }
]);


const links = [
  // Group 1: Dashboards
  {
    label: 'Dashboards',
    type: 'header',
    children: [
      { label: 'Home', icon: 'i-heroicons-home', to: '/dashboard/main' },
      { label: 'Contact', icon: 'i-heroicons-chart-bar', to: '/dashboard/grv' },
      { label: 'Command Palette', icon: 'i-heroicons-command-line', to: '/contact' }
    ]
  },

  // Group 2: Grievances
  {
    label: 'Grievances',
    type: 'header',
    roles: ['isAdmin', 'isGBV', 'isSettGRC', 'isCountyGRC', 'isNationalGRC', 'isGBV'],
    children: [
      { label: 'Open', icon: 'i-heroicons-shield-exclamation', to: '/grievances/open', roles: ['isAdmin', 'isGBV', 'isSettGRC', 'isCountyGRC', 'isNationalGRC', 'isGBV'] },
      { label: 'Investigate', icon: 'i-heroicons-question-mark-circle', to: '/grievances/investigate', roles: ['isAdmin', 'isGBV', 'isSettGRC', 'isCountyGRC', 'isNationalGRC', 'isGBV'] },
      { label: 'Resolved', icon: 'i-heroicons-check', to: '/grievances/resolved', roles: ['isAdmin', 'isGBV', 'isSettGRC', 'isCountyGRC', 'isNationalGRC', 'isGBV'] },
      { label: 'Escalated', icon: 'i-heroicons-bars-arrow-up', to: '/grievances/escalated', roles: ['isAdmin', 'isGBV', 'isSettGRC', 'isCountyGRC', 'isNationalGRC', 'isGBV'] }
    ]
  },

  // Group 3: GBV
  {
    label: 'GBV',
    type: 'header',
    roles: ['isGBV'],
    children: [
      { label: 'Open', icon: 'i-heroicons-shield-exclamation', to: '/grievances/open', roles: ['isGBV'] },
      { label: 'Investigate', icon: 'i-heroicons-question-mark-circle', to: '/grievances/investigate', roles: ['isGBV'] },
      { label: 'Resolved', icon: 'i-heroicons-check', to: '/grievances/resolved', roles: ['isGBV'] },
      { label: 'Escalated', icon: 'i-heroicons-bars-arrow-up', to: '/grievances/escalated', roles: ['isGBV'] }
    ]
  },

  // Group 4: Admin
  {
    label: 'Admin',
    type: 'header',
    roles: ['isAdmin'],
    children: [
      { label: 'Users', icon: 'i-heroicons-user', to: '/admin/users', roles: ['isAdmin'] },
      { label: 'GRCs', icon: 'i-heroicons-user-group', roles: ['isAdmin'] }
    ]
  },

  // Group 5: Settings
  {
    label: 'Settings',
    type: 'header',
    roles: ['isAdmin'],
    children: [
      { label: 'Logs', icon: 'i-heroicons-user', roles: ['isAdmin'] },
      { label: 'Roles', icon: 'i-heroicons-user-group', roles: ['isAdmin'] },
      { label: 'Settlements', icon: 'i-heroicons-map-pin', roles: ['isAdmin'] }
    ]
  }
];


// Dark mode toggle functionality
const isDarkMode = ref(false);

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle('dark', isDarkMode.value);
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
};

onMounted(() => {
  // Check the initial theme preference from localStorage or system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark';
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDarkMode.value = prefersDark;
  }
  document.documentElement.classList.toggle('dark', isDarkMode.value);
});

// Sidebar toggle functionality
const isSidebarOpen = ref(true);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>

<style scoped>
/* Scoped styles for the layout */
body {
  margin: 0;
}

a {
  text-decoration: none;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: inherit;
  transition: background-color 0.3s;
}

@media (min-width: 1024px) {
  .lg\:hidden {
    display: none;
  }
}
</style>
