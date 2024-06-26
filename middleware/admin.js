export default defineNuxtRouteMiddleware(async (to, from) => {
      const { data ,status} = useAuth();
    
   console.log("Logged in user - isAdmin", data.value);
   const hasAdminRole =  data.value.roles.includes("ADMIN");

    if (!hasAdminRole) {
      return navigateTo('/dashboard/main');
    }
    if (!status.value.unauthenticated) {
      return navigateTo('/login');
    }

  });