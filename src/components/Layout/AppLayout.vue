<template>
  <ErrorBoundary>
  <div class="min-h-screen bg-gray-50 flex flex-col" :class="{ 'fullscreen-mode': isFullScreen }">
    <!-- Navigation Header -->
    <nav v-if="!isFullScreen" class="shadow-xl" style="background-color: #213C33; border-bottom: 2px solid #4ED586;" aria-label="Main navigation">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo and Brand -->
          <div class="flex items-center">
            <router-link to="/" aria-label="Neural Grader - Go to dashboard">
              <img src="/Asset 3@4x 1.png" alt="Neural Grader Logo" class="h-10 w-auto mr-3 brightness-110" />
            </router-link>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:block">
            <div class="flex items-center space-x-1">
              <router-link
                to="/"
                :class="[
                  $route.name === 'Dashboard'
                    ? 'text-white shadow-lg ring-2 ring-primary/50'
                    : 'text-white hover:bg-primary/80 hover:text-white',
                  'px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition-all duration-200 hover:shadow-md'
                ]"
                :style="$route.name === 'Dashboard' ? 'background-color: #204739' : ''"
                :aria-current="$route.name === 'Dashboard' ? 'page' : null"
                aria-label="Dashboard overview"
              >
                <BarChart3 class="w-4 h-4 mr-2 flex-shrink-0" aria-hidden="true" />
                Overview
              </router-link>
              <router-link
                to="/orders"
                :class="[
                  $route.name === 'ProductionOrders' || $route.name === 'CreateProductionOrder'
                    ? 'text-white shadow-lg ring-2 ring-primary/50'
                    : 'text-white hover:bg-primary/80 hover:text-white',
                  'px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition-all duration-200 hover:shadow-md'
                ]"
                :style="($route.name === 'ProductionOrders' || $route.name === 'CreateProductionOrder') ? 'background-color: #204739' : ''"
              >
                <Package class="w-4 h-4 mr-2 flex-shrink-0" />
                Orders
              </router-link>
              <router-link
                to="/board-finder"
                :class="[
                  $route.name === 'BoardFinder'
                    ? 'text-white shadow-lg ring-2 ring-primary/50'
                    : 'text-white hover:bg-primary/80 hover:text-white',
                  'px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition-all duration-200 hover:shadow-md'
                ]"
                :style="$route.name === 'BoardFinder' ? 'background-color: #204739' : ''"
              >
                <Search class="w-4 h-4 mr-2 flex-shrink-0" />
                Board Finder
              </router-link>
              <router-link
                to="/line-check/dashboard"
                :class="[
                  $route.name === 'LineCheckDashboard'
                    ? 'text-white shadow-lg ring-2 ring-primary/50'
                    : 'text-white hover:bg-primary/80 hover:text-white',
                  'px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition-all duration-200 hover:shadow-md'
                ]"
                :style="$route.name === 'LineCheckDashboard' ? 'background-color: #204739' : ''"
              >
                <Activity class="w-4 h-4 mr-2 flex-shrink-0" />
                Line
              </router-link>
              <div class="relative">
                <button
                  @click="showToolsMenu = !showToolsMenu"
                  :class="[
                    ['UserManagement', 'ShiftScheduler', 'ClaimsManagement'].includes($route.name)
                      ? 'text-white shadow-lg ring-2 ring-primary/50'
                      : 'text-white hover:bg-primary/80 hover:text-white',
                    'px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition-all duration-200 hover:shadow-md'
                  ]"
                  :style="['UserManagement', 'ShiftScheduler', 'ClaimsManagement'].includes($route.name) ? 'background-color: #204739' : ''"
                  :aria-expanded="showToolsMenu"
                  aria-haspopup="true"
                  aria-label="Tools menu"
                >
                  Tools
                  <ChevronDown class="w-4 h-4 ml-1" aria-hidden="true" />
                </button>
                <div
                  v-if="showToolsMenu"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 z-50 border border-slate-200 ring-1 ring-black/5"
                  role="menu"
                  aria-labelledby="tools-menu-button"
                >
                  <router-link
                    to="/user-management" 
                    class="block px-4 py-2 text-sm text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors duration-150"
                    @click="showToolsMenu = false"
                  >
                    User Management
                  </router-link>
                  <router-link
                    to="/shift-scheduler"
                    class="block px-4 py-2 text-sm text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors duration-150"
                    @click="showToolsMenu = false"
                  >
                    Shift Scheduler
                  </router-link>
                  <router-link
                    to="/claims"
                    class="block px-4 py-2 text-sm text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors duration-150"
                    @click="showToolsMenu = false"
                  >
                    Claims Management
                  </router-link>
                  <router-link
                    to="/grade-management"
                    class="block px-4 py-2 text-sm text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors duration-150"
                    @click="showToolsMenu = false"
                  >
                    Grade Management
                  </router-link>
                </div>
              </div>
              <button class="text-white hover:bg-primary/80 hover:text-white px-3 py-2 rounded-lg text-sm font-semibold flex items-center transition-all duration-200 hover:shadow-md">
                Support
                <ChevronDown class="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          <!-- Right side -->
          <div class="flex items-center space-x-4">
            <button class="relative text-emerald-100 hover:text-white p-2 rounded-lg hover:bg-emerald-800 transition-all duration-200">
              <Bell class="h-5 w-5" />
              <span class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg">3</span>
            </button>
            <!-- User Menu -->
            <div v-if="authStore.isAuthenticated" class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 text-white hover:bg-emerald-800 px-3 py-2 rounded-lg transition-all duration-200"
                :aria-expanded="showUserMenu"
                aria-haspopup="true"
              >
                <div class="h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-md">
                  <User class="h-4 w-4 text-emerald-600" />
                </div>
                <div class="hidden sm:block text-left">
                  <div class="text-sm font-medium">{{ authStore.user?.name }}</div>
                  <div class="text-xs text-emerald-200">{{ authStore.user?.role }}</div>
                </div>
                <ChevronDown class="w-4 h-4" />
              </button>
              
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 z-50 border border-slate-200"
              >
                <div class="px-4 py-2 border-b border-gray-200">
                  <div class="text-sm font-medium text-gray-900">{{ authStore.user?.name }}</div>
                  <div class="text-sm text-gray-500">{{ authStore.user?.email }}</div>
                </div>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
            
            <router-link
              v-else
              to="/login"
              class="text-white hover:bg-emerald-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              Sign In
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Full Screen Navigation Bar -->
    <nav v-if="isFullScreen" class="shadow-xl" style="background-color: #213C33; border-bottom: 2px solid #4ED586;">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <img src="/Asset 3@4x 1.png" alt="Neural Grader Logo" class="h-10 w-auto mr-3 brightness-110" />
            <span class="text-white font-semibold text-xl">Line Check Dashboard</span>
          </div>
          <button 
            @click="exitFullScreen"
            class="text-white hover:bg-primary/80 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition-all duration-200 hover:shadow-md"
          >
            <Minimize class="w-4 h-4 mr-2" />
            Exit Full Screen
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- Footer -->
    <footer v-if="!isFullScreen" class="bg-white border-t border-slate-200 py-4 mt-auto">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="text-sm text-slate-500">
            © 2024 Neural Grader. Built for precision lumber grading.
          </div>
          <!-- Lumberjack Animation -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-4 text-sm text-slate-500">
              <a href="#" class="hover:text-slate-700 transition-colors duration-150">Terms</a>
              <a href="#" class="hover:text-slate-700 transition-colors duration-150">Privacy</a>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
  </ErrorBoundary>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  BarChart3, Package, Search, Activity, ChevronDown,
  Bell, User, Minimize
} from 'lucide-vue-next'
import ErrorBoundary from '@/components/error/error-boundary.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const showToolsMenu = ref(false)
const showUserMenu = ref(false)
const isFullScreen = ref(false)

/**
 * Handle fullscreen change events
 */
const handleFullscreenChange = () => {
  isFullScreen.value = !!document.fullscreenElement
}

/**
 * Exit full screen mode
 */
const exitFullScreen = async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    }
  } catch (error) {
    console.error('Error exiting fullscreen:', error)
  }
}

/**
 * Handle user logout
 */
const handleLogout = async () => {
  try {
    authStore.logout()
    showUserMenu.value = false
    await router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

onMounted(() => {
  // Add fullscreen event listener
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  
  // Check initial fullscreen state
  isFullScreen.value = !!document.fullscreenElement
})

onUnmounted(() => {
  // Remove fullscreen event listener
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<style scoped>
.fullscreen-mode {
  /* Ensure full screen mode uses all available space */
  height: 100vh;
  overflow: hidden;
}
</style>