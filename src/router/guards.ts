import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export interface RoutePermissions {
  permissions?: string[]
  roles?: string[]
  requiresAuth?: boolean
}

declare module 'vue-router' {
  interface RouteMeta extends RoutePermissions {
    title?: string
  }
}

export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  // DISABLED FOR DEVELOPMENT - Allow access to all routes
  next()
  return
  
  // Original auth logic (commented out for easier development)
  /*
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth ?? true // Default to requiring auth
  const requiredPermissions = to.meta.permissions || []
  const requiredRoles = to.meta.roles || []

  // If route doesn't require auth, allow access
  if (!requiresAuth) {
    next()
    return
  }

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    next({ 
      name: 'Login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // Check role requirements
  if (requiredRoles.length > 0) {
    if (!authStore.user || !requiredRoles.includes(authStore.user.role)) {
      next({ name: 'Unauthorized' })
      return
    }
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    if (!authStore.hasAnyPermission(requiredPermissions)) {
      next({ name: 'Unauthorized' })
      return
    }
  }

  next()
  */
}

export const guestGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }

  next()
}

export const adminGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  // DISABLED FOR DEVELOPMENT - Allow access to all admin routes
  next()
  return
  
  // Original admin logic (commented out for easier development)
  /*
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    next({ 
      name: 'Login',
      query: { redirect: to.fullPath }
    })
    return
  }

  if (!authStore.isAdmin) {
    next({ name: 'Unauthorized' })
    return
  }

  next()
  */
}