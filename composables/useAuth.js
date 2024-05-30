// composables/useAuth.js
import { useState } from "#app";

export const useAuth = () => {
  
  const isAuthenticated = useState("isAuthenticated", () => {
    if (process.client) {
      return localStorage.getItem("isAuthenticated") == "true";
    }
    return false;
  });

  const login = () => {
    isAuthenticated.value = true;
    if (process.client) {
      localStorage.setItem("isAuthenticated", "true");
    }
  };

  const logout = () => {
    console.log("signoff");
    isAuthenticated.value = false;
    if (process.client) {
      localStorage.setItem("isAuthenticated", "false");
    }
  };
  console.log("--isAuthenticated--", isAuthenticated.value);

  return {
    isAuthenticated,
    login,
    logout,
  };
};
