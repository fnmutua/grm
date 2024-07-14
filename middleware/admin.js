export default defineNuxtRouteMiddleware(async (to, from) => {
      const { data ,status} = useAuth();
    
      console.log("Logged in user - isAdmin", data.value);
      console.log("status", status.value);
      const hasAdminRole =  data.value.isAdmin;

    if (!hasAdminRole) {
      return navigateTo('/dashboard/main');
    }
    if (status.value !='authenticated') {
      return navigateTo('/login');
    }

  });