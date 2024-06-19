<template>
  <LandingContainer>
       
      <header :class="['fixed top-0 left-0 w-full backdrop-blur-lg z-50 flex flex-col lg:flex-row justify-between items-center py-4 px-5 shadow-md' ]" >
      <div class="flex w-full lg:w-auto items-center justify-between">
        <a href="/" class="text-lg">
          <span class="font-bold text-slate-800">e</span>
          <span class="text-slate-500">GRM</span>
        </a>
        <div class="block lg:hidden">
          <ColorMode></ColorMode>
        </div>

        <div class="block lg:hidden">

          <button @click="open = !open" class="text-white-800">
            <UIcon name="i-heroicons-bars-4" />
          </button>
        </div>
      </div>
      
      <nav class="w-full lg:w-auto mt-2 lg:flex lg:mt-0" :class="{ block: open, hidden: !open }">
        <ul class="flex flex-col lg:flex-row lg:gap-3">
          <li v-for="(item, index) in filteredLinks" :key="item.path" class="relative group">
            <div v-if="item.children">
              
              <a href="#" @click.prevent="toggleDropdown(index)" class="flex items-center lg:px-3 py-2 text-gray-600 hover:text-green-900">
              <span>{{ item.title }}</span>
              <span class="ml-auto"><UIcon name="i-heroicons-chevron-down" /></span>
            </a>


              <ul v-show="dropdownOpenState[index]" class="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-900 shadow-lg rounded-md py-2 z-20">
                <li v-for="child in item.children" :key="child.path">
                  <a :href="child.path" class="block px-4 py-2 text-gray-600 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800">
                    {{ child.title }}
                  </a>
                </li>
              </ul>
            </div>

            <div v-else>
              <a :href="item.path" :class="{'nuxt-green': route.path === item.path, 'flex lg:px-3 py-2 text-gray-600 hover:text-green-900': true}">
                {{ item.title }}
              </a>
            </div>
          </li>
        </ul>
          <div class="lg:hidden flex items-center mt-3 gap-4">
            <UTooltip v-if="!isAuthenticated" text="Sign In">
              <!-- <UButton icon='i-heroicons-lock-open' color="gray" variant="ghost" aria-label="Theme" @click="logoff" /> -->
               <UButton  color="gray" variant='outline'  aria-label="Theme" @click="logoff"> Login</UButton>

            </UTooltip>

            <UTooltip v-if="isAuthenticated" text="Logout">
               <UButton  color="gray" variant='outline' aria-label="Theme" @click="logoff"> Logout</UButton>
            </UTooltip>

          </div>
          <ColorMode> </ColorMode>

          
       </nav>
        

      <div class="hidden lg:flex items-center gap-4 navbar-end">
 
        <UTooltip v-if="!isAuthenticated" text="Sign In">
          <UButton icon='i-heroicons-lock-open' color="gray" variant="ghost" aria-label="Theme" @click="logoff" />
        </UTooltip>

        <UTooltip v-if="isAuthenticated" text="Logout">
          <UButton icon='i-heroicons-lock-closed' color="gray" variant="ghost" aria-label="Theme" @click="logoff" />
        </UTooltip>
      </div>
    </header>
  </LandingContainer>
</template>

<script setup>
  const route = useRoute();

const { signOut, getSession } = useAuth();
let isAuthenticated =false 

const session = await getSession({ force: true })
   console.log("session",session)


if (session) {
    isAuthenticated = true
  }else {
    isAuthenticated =false 
  }
 

  

// Track the open state of each menu item's dropdown
const dropdownOpenState = ref({});
  
  const toggleDropdown = (index) => {
    dropdownOpenState.value[index] = !dropdownOpenState.value[index];
  };

 
  const menuitems = [
  { title: 'Home', path: '/' },
  
  { title: 'Report', path: '/report' },
  { title: 'Status', path: '/grievances/status' },
  { title: 'About', path: '/about' },
  { title: 'Contact', path: '/contact' },
  {
  title: 'Dashboards',   path: '/dashboard/main' , roles: ['isAdmin', 'isGBV', 'isSettGRC', 'isCountyGRC', 'isNationalGRC'],},
 ]; 

// Get auth details 
const { data } = useAuth();  // user data from session 

console.log('raw', menuitems);

const filteredLinks = computed(() => {
  // Check if data.value is null or empty
  if (!data.value) {
    // If data.value is null, show only links without roles
    return menuitems.filter(item => !item.roles);
  }

  return menuitems
    .map(item => {
      if (!item.roles) {
        // For items without roles, include them and their children by default
        const filteredChildren = item.children ? item.children.filter(child => !child.roles || child.roles.some(role => data.value[role])) : [];
        return filteredChildren.length > 0 ? { ...item, children: filteredChildren } : { ...item, children: undefined };
      } else {
        // For items with roles, filter based on the user's roles
        const hasRequiredRoles = item.roles.some(role => data.value[role]);
        if (hasRequiredRoles) {
          const filteredChildren = item.children ? item.children.filter(child => !child.roles || child.roles.some(role => data.value[role])) : [];
          return filteredChildren.length > 0 ? { ...item, children: filteredChildren } : { ...item, children: undefined };
        }
        return null;
      }
    })
    .filter(item => item !== null); // Remove items that don't have required roles
});

console.log('filtered', filteredLinks.value);

 


 
 async function logoff() {
  console.log("Logging off")
   await signOut({ callbackUrl: '/login' })
} 

  
const open = ref(false);
</script>
 

<style scoped>
.header {
  backdrop-filter: blur(10px); /* Optional: for a more pronounced effect */
}
</style>

<style>
.navbar-end {
  z-index: 9999;
  /* Set a high z-index */
}
</style>

<style scoped>
.header {
  backdrop-filter: blur(10px); /* Optional: for a more pronounced effect */
}
</style>



<style>
.navbar-end {

  z-index: 9999;
  /* Set a high z-index */
}
</style>

<style scoped>
.nuxt-green {
  color: #00DC82; /* Nuxt green color */
  font-weight: bold;
}
</style>
