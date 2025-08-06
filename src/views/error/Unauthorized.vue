<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <Shield class="mx-auto h-24 w-24 text-red-400" />
      </div>
      
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Access Denied
      </h1>
      
      <p class="text-lg text-gray-600 mb-8">
        You don't have permission to access this page.
      </p>
      
      <div class="space-y-4">
        <div class="text-sm text-gray-500">
          <p>If you believe this is an error, please contact your administrator.</p>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="goBack"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Go Back
          </button>
          
          <router-link
            to="/"
            class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Go to Dashboard
          </router-link>
        </div>
      </div>
      
      <div v-if="authStore.user" class="mt-8 p-4 bg-white rounded-lg border border-gray-200">
        <h3 class="text-sm font-medium text-gray-900 mb-2">Current User</h3>
        <div class="text-sm text-gray-600">
          <p><strong>Name:</strong> {{ authStore.user.name }}</p>
          <p><strong>Role:</strong> {{ authStore.user.role }}</p>
          <p><strong>Email:</strong> {{ authStore.user.email }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Shield } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const goBack = () => {
  router.go(-1)
}
</script>