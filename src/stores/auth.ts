import { defineStore } from "pinia";
import axios from "axios";
import { User } from "@/interfaces/user";
import {LoginResponse, Response} from "@/interfaces/response";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    showLoginModal: false,
    error: null,
    errors: [],
    token: localStorage.getItem("jwt") || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await axios.post<Response<LoginResponse>>(
          "/api/v1/user/login",
          { email, password },
        );
        this.token = response.data.data.token;
        localStorage.setItem("jwt", this.token);
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
        const response = await axios.get("/api/v1/user");
        this.user = response.data.data as User;
        this.error = null;
      } catch (error: any) {
        this.user = {} as User;
        this.error = error.response?.data?.error || "Failed to fetch user data";
      }
    },
    async logout() {
      try {
        await axios.get("/api/v1/user/logout", {});
        localStorage.removeItem("jwt");
        this.user = null
        this.token = null;
        this.error = null;
      } catch (error: any) {
        this.error = error.response?.data?.error || "Failed to logout";
      }
    },
    async checkAuth() {
      this.token = localStorage.getItem("jwt");
      console.log(this.token);
      if (this.token != null) {
        await this.fetchUser();
      }

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
