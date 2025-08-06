import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'operator' | 'viewer'
  permissions: string[]
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const token = ref<string | null>(localStorage.getItem('auth_token'))

  // Computed properties
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isOperator = computed(() => user.value?.role === 'operator')
  const userPermissions = computed(() => user.value?.permissions || [])

  // Actions
  const login = async (email: string, password: string): Promise<boolean> => {
    isLoading.value = true
    
    try {
      // Simulate API call - in real app this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful login for demo purposes
      if (email === 'admin@example.com' && password === 'admin123') {
        const mockUser: User = {
          id: 1,
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          permissions: ['view_all', 'edit_all', 'delete_all', 'manage_users', 'manage_grades']
        }
        const mockToken = 'mock-jwt-token-' + Date.now()
        
        user.value = mockUser
        token.value = mockToken
        localStorage.setItem('auth_token', mockToken)
        localStorage.setItem('user', JSON.stringify(mockUser))
        
        return true
      } else if (email === 'operator@example.com' && password === 'operator123') {
        const mockUser: User = {
          id: 2,
          name: 'Operator User',
          email: 'operator@example.com', 
          role: 'operator',
          permissions: ['view_grades', 'edit_grades', 'view_orders', 'create_orders']
        }
        const mockToken = 'mock-jwt-token-' + Date.now()
        
        user.value = mockUser
        token.value = mockToken
        localStorage.setItem('auth_token', mockToken)
        localStorage.setItem('user', JSON.stringify(mockUser))
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  const initializeAuth = () => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      try {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      } catch (error) {
        console.error('Failed to parse stored user data:', error)
        logout()
      }
    }
  }

  const hasPermission = (permission: string): boolean => {
    return userPermissions.value.includes(permission)
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission))
  }

  const hasRole = (role: User['role']): boolean => {
    return user.value?.role === role
  }

  return {
    // State
    user,
    isLoading,
    token,
    
    // Getters
    isAuthenticated,
    isAdmin,
    isOperator,
    userPermissions,
    
    // Actions
    login,
    logout,
    initializeAuth,
    hasPermission,
    hasAnyPermission,
    hasRole
  }
})