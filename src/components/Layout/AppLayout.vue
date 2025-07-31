<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo and Brand -->
          <div class="flex items-center space-x-4">
            <img 
              src="/Asset 3@4x 1.png" 
              alt="Neural Grader" 
              class="h-8 w-auto"
            />
            <h1 class="text-xl font-bold text-gray-900">Neural Grader</h1>
          </div>
          
          <!-- Navigation Menu -->
          <nav class="hidden md:flex items-center space-x-8">
            <router-link 
              to="/" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-emerald-600 bg-emerald-50"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/orders" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-emerald-600 bg-emerald-50"
            >
              Orders
            </router-link>
            <router-link 
              to="/line-check" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-emerald-600 bg-emerald-50"
            >
              Line Check
            </router-link>
            <router-link 
              to="/board-finder" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-emerald-600 bg-emerald-50"
            >
              Board Finder
            </router-link>
            <router-link 
              to="/grade-management" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-emerald-600 bg-emerald-50"
            >
              Grade Management
            </router-link>
          </nav>
          
          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <button class="text-gray-600 hover:text-gray-900 p-2 rounded-md">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5v-12"></path>
              </svg>
            </button>
            <div class="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">JD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'AppLayout'
}
</script>