// middleware/auth.js
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    // If not authenticated, redirect to login page
    console.log("Check b4",isAuthenticated )
    if (!isAuthenticated) {
      return navigateTo('/login');
    }
  }
});
