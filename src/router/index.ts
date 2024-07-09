/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import {createRouter, createWebHistory} from 'vue-router/auto'
import {setupLayouts} from 'virtual:generated-layouts'
import {useAuthStore} from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  extendRoutes: setupLayouts,
})

router.beforeEach(async (to, from, next) => {
  // canUserAccess() returns `true` or `false`
  const canAccess = await useAuthStore().user != null
  if (to.meta.requiresAuth && !canAccess) {
    next('/login')
  }
  next()
})

export default router
