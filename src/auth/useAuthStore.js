import { create } from "zustand";
import api from "../api/http";
import { getErrorMessage } from "../api/error";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("admin_user")) || null,
  token: localStorage.getItem("admin_token") || null,
  isLoggingIn: false,

  login: async (credentials) => {
    set({ isLoggingIn: true });
    try {
      const payload = {
        username: credentials.email || credentials.username || credentials.name,
        password: credentials.password,
      };

      const response = await api.post("/auth/login", payload);
      const data = response.data || {};
      const user = data.user || data.profile || data.admin || null;
      const accessToken = data.accessToken || data.token || data.access_token;
      const refreshToken = data.refreshToken || data.refresh_token;

      if (!accessToken) {
        throw new Error("Login succeeded but no access token was returned");
      }

      localStorage.setItem("admin_token", accessToken);
      if (refreshToken) localStorage.setItem("admin_refresh_token", refreshToken);
      localStorage.setItem("admin_user", JSON.stringify(user));

      set({ user, token: accessToken, isLoggingIn: false });
      return { success: true };
    } catch (error) {
      set({ isLoggingIn: false });
      return { success: false, error: getErrorMessage(error) };
    }
  },

  logout: () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_refresh_token");
    localStorage.removeItem("admin_user");
    set({ user: null, token: null });
  },
}));
