<script setup>
 const router = useRouter()
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
 



const menuitems = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "Grievances",
    path: "/grievances/status",
  },
  // {
  //   title: "List",
  //   path: "/grievances/list",
  // },
  {
    title: "Report",
    path: "/report",
  },
  {
    title: "About",
    path: "/about",
  },
  {
    title: "Contact",
    path: "/contact",
  },
  {
    title: "Dashboard",
    path: "/dashboard/main",
  },
];


 async function logoff() {
  console.log("Logging off")
  //logout()
   
  

  await signOut({ callbackUrl: '/login' })

 
 

} 

const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const open = ref(false);
</script>
 
<template>
  <LandingContainer>
    <!-- <header class="fixed top-0 left-0 w-full bg-white bg-opacity-75 backdrop-blur-lg z-50 flex flex-col lg:flex-row justify-between items-center py-4 px-5 shadow-md">
       -->
      <header :class="['fixed top-0 left-0 w-full backdrop-blur-lg z-50 flex flex-col lg:flex-row justify-between items-center py-4 px-5 shadow-md',
         isDark ? 'header-dark' : 'header-light']" >
      <div class="flex w-full lg:w-auto items-center justify-between">
        <a href="/" class="text-lg">
          <span class="font-bold text-slate-800">e</span>
          <span class="text-slate-500">GRM</span>
        </a>
        <div class="block lg:hidden">
          <button @click="open = !open" class="text-white-800">
            <svg fill="currentColor" class="w-4 h-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Menu</title>
              <path v-show="open" fill-rule="evenodd" clip-rule="evenodd"
                d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 01-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 011.414-1.414l4.829 4.828 4.828-4.828a1 1 0 111.414 1.414l-4.828 4.829 4.828 4.828z">
              </path>
              <path v-show="!open" fill-rule="evenodd"
                d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z">
              </path>
            </svg>
          </button>
        </div>
      </div>
      <nav class="w-full lg:w-auto mt-2 lg:flex lg:mt-0" :class="{ block: open, hidden: !open }">
        <ul class="flex flex-col lg:flex-row lg:gap-3">
          <li v-for="item of menuitems" :key="item.path">
            <a :href="item.path" :class="{'nuxt-green': route.path === item.path, 'flex lg:px-3 py-2 text-gray-600 hover:text-green-900': true}">
              {{ item.title }}
            </a>
          </li>
      


        </ul>
        <div class="lg:hidden flex items-center mt-3 gap-4">
          <LandingLink to="/login" styleName="muted" block size="md">Log in</LandingLink>
          <LandingLink to="/login" size="md" block>Logout</LandingLink>
        </div>
      </nav>

      <div class="hidden lg:flex items-center gap-4 navbar-end">
        <ClientOnly>
          <UTooltip text="Change theme">
            <UButton :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'" color="gray" variant="ghost" aria-label="Theme" @click="isDark = !isDark" />
          </UTooltip>

          <template #fallback>
            <div class="w-8 h-8" />
          </template>
        </ClientOnly>

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
