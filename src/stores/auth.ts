import { defineStore } from "pinia";
import axios from "axios";
import Cookie from "js-cookie";
import { User } from "@/interfaces/user";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {} as User,
    showLoginModal: false,
    error: null,
    errors: [],
    token: Cookie.get("jwt"),
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await axios.post(
          "/api/v1/login",
          { email, password },
          { withCredentials: true }
        );
        this.token = response.data.token;
        await this.fetchUser();
        this.showLoginModal = false;
        this.error = null;
        return true;
      } catch (error: any) {
        this.error =
          error.response?.data?.error || "An unexpected error occurred";
        this.errors = error.response?.data?.errors || [];
        return false;
      }
    },
    async fetchUser() {
      try {
        const response = await axios.get("/api/v1/user", {
          withCredentials: true,
        });
        this.user = response.data;
        this.error = null;
      } catch (error: any) {
        this.user = {} as User;
        this.error = error.response?.data?.error || "Failed to fetch user data";
      }
    },
    async logout() {
      try {
        await axios.post("/api/v1/user/logout", {}, { withCredentials: true });
        this.user = {} as User;
        this.error = null;
      } catch (error: any) {
        this.error = error.response?.data?.error || "Failed to logout";
      }
    },
    async checkAuth() {
      this.token = Cookie.get("jwt");
      await this.fetchUser();
      if (!this.user) {
        this.showLoginModal = true;
      }
    },
    clearErrors() {
      this.error = null;
      this.errors = [];
    },
  },
});
