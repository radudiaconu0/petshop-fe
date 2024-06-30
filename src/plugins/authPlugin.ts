import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { App } from "vue";
import Cookie from 'js-cookie'

export default {
  install: (app: App) => {
    const authStore = useAuthStore()
    axios.defaults.baseURL = 'http://localhost:8000'
    // Add axios interceptor for adding token to requests
    axios.interceptors.request.use(config => {
      const token = authStore.token || Cookie.get('jwt')
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
