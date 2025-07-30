<template>
  <div class="min-h-screen bg-background flex items-center justify-center">
    <div class="text-center space-y-8 max-w-lg mx-auto px-4">
      <!-- Logo -->
      <div class="flex justify-center">
        <img 
          src="/Asset 3@4x 1.png" 
          alt="Neural Grader" 
          class="h-16 w-auto brightness-110"
        />
      </div>
      
      <!-- Network Error Illustration -->
      <div class="space-y-4">
        <div class="flex justify-center">
          <div class="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
            <WifiOff class="w-12 h-12 text-orange-600" />
          </div>
        </div>
      </div>
      
      <!-- Error Message -->
      <div class="space-y-3">
        <h1 class="text-3xl font-bold text-foreground">Connection Problem</h1>
        <p class="text-lg text-muted-foreground">
          Unable to connect to Neural Grader servers. Please check your internet connection.
        </p>
      </div>
      
      <!-- Connection Status -->
      <div class="bg-muted/30 rounded-lg p-6 space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-foreground">Connection Status:</span>
          <div class="flex items-center space-x-2">
            <div :class="[
              'w-2 h-2 rounded-full',
              isOnline ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'
            ]"></div>
            <span class="text-sm text-muted-foreground">
              {{ isOnline ? 'Connected' : 'Disconnected' }}
            </span>
          </div>
        </div>
        
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-foreground">Last Attempt:</span>
          <span class="text-sm text-muted-foreground">{{ lastAttempt }}</span>
        </div>
      </div>
      
      <!-- Troubleshooting Tips -->
      <div class="text-left bg-muted/20 rounded-lg p-6 space-y-3">
        <h3 class="font-semibold text-foreground">Troubleshooting Tips:</h3>
        <ul class="space-y-2 text-sm text-muted-foreground">
          <li class="flex items-start space-x-2">
            <div class="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <span>Check your internet connection</span>
          </li>
          <li class="flex items-start space-x-2">
            <div class="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <span>Verify your network settings</span>
          </li>
          <li class="flex items-start space-x-2">
            <div class="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <span>Try refreshing the page</span>
          </li>
          <li class="flex items-start space-x-2">
            <div class="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <span>Contact your network administrator</span>
          </li>
        </ul>
      </div>
      
      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <Button @click="retry" variant="default" :disabled="isRetrying">
          <RefreshCw :class="['w-4 h-4 mr-2', isRetrying && 'animate-spin']" />
          {{ isRetrying ? 'Retrying...' : 'Try Again' }}
        </Button>
        <Button @click="goOffline" variant="outline">
          <Monitor class="w-4 h-4 mr-2" />
          Work Offline
        </Button>
      </div>
      
      <!-- Support -->
      <div class="text-sm text-muted-foreground">
        Still having trouble? 
        <a href="mailto:support@neuralgrader.com" class="text-primary hover:underline">
          Contact Support
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { WifiOff, RefreshCw, Monitor } from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'

const router = useRouter()

const isOnline = ref(navigator.onLine)
const isRetrying = ref(false)
const lastAttempt = ref(new Date().toLocaleTimeString())

let retryInterval = null

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine
  lastAttempt.value = new Date().toLocaleTimeString()
}

const retry = async () => {
  isRetrying.value = true
  lastAttempt.value = new Date().toLocaleTimeString()
  
  try {
    // Attempt to fetch a small resource to test connectivity
    await fetch('/Asset 3@4x 1.png', { 
      method: 'HEAD',
      cache: 'no-cache'
    })
    
    // If successful, reload the page
    window.location.reload()
  } catch (error) {
    // Still offline, update status
    updateOnlineStatus()
  } finally {
    isRetrying.value = false
  }
}

const goOffline = () => {
  // Redirect to a cached/offline version if available
  router.push('/')
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
  
  // Auto-retry every 30 seconds
  retryInterval = setInterval(() => {
    if (!isOnline.value && !isRetrying.value) {
      retry()
    }
  }, 30000)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
  
  if (retryInterval) {
    clearInterval(retryInterval)
  }
})
</script>