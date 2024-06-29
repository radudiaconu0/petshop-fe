import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { App } from "vue";

export default {
  install: (app: App) => {
    const authStore = useAuthStore()
    axios.defaults.baseURL = 'https://petshop-api.test'
    // Add axios interceptor for adding token to requests
    axios.interceptors.request.use(config => {
      console.log('Adding token to request', authStore.token)
      const token = authStore.token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {

        }
        return Promise.reject(error)
      }
    )

    // Check authentication status when the plugin is installed
    authStore.checkAuth()

    // Add auth store to app's global properties
    app.config.globalProperties.$auth = authStore
  }
}
