<template>
  <div v-if="hasError" class="min-h-screen bg-background flex items-center justify-center">
    <div class="text-center space-y-6 max-w-lg mx-auto px-4">
      <!-- Logo -->
      <div class="flex justify-center">
        <img 
          src="/Asset 3@4x 1.png" 
          alt="Neural Grader" 
          class="h-16 w-auto brightness-110"
        />
      </div>
      
      <!-- Error Icon -->
      <div class="flex justify-center">
        <div class="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
          <AlertTriangle class="w-8 h-8 text-destructive" />
        </div>
      </div>
      
      <!-- Error Message -->
      <div class="space-y-2">
        <h1 class="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p class="text-muted-foreground">
          We encountered an unexpected error. Our team has been notified and is working on a fix.
        </p>
      </div>
      
      <!-- Error Details (Development only) -->
      <div v-if="showDetails && errorDetails" class="text-left">
        <details class="bg-muted/50 rounded-lg p-4">
          <summary class="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
            Error Details
          </summary>
          <pre class="mt-2 text-xs text-muted-foreground overflow-auto">{{ errorDetails }}</pre>
        </details>
      </div>
      
      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <Button @click="retry" variant="default">
          <RefreshCw class="w-4 h-4 mr-2" />
          Try Again
        </Button>
        <Button @click="goHome" variant="outline">
          <Home class="w-4 h-4 mr-2" />
          Go Home
        </Button>
      </div>
      
      <!-- Support Contact -->
      <div class="text-xs text-muted-foreground">
        Need help? Contact support at 
        <a href="mailto:support@neuralgrader.com" class="text-primary hover:underline">
          support@neuralgrader.com
        </a>
      </div>
    </div>
  </div>
  
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import { AlertTriangle, RefreshCw, Home } from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'

const router = useRouter()

const hasError = ref(false)
const errorDetails = ref('')
const showDetails = ref(process.env.NODE_ENV === 'development')

const props = defineProps({
  fallback: {
    type: Function,
    default: null
  },
  onError: {
    type: Function,
    default: null
  }
})

onErrorCaptured((error, instance, info) => {
  hasError.value = true
  errorDetails.value = `${error.message}\n\nComponent: ${info}\n\nStack: ${error.stack}`
  
  // Call custom error handler if provided
  if (props.onError) {
    props.onError(error, instance, info)
  }
  
  // Log error for monitoring
  console.error('Error caught by boundary:', error)
  
  // Prevent error from propagating
  return false
})

const retry = () => {
  hasError.value = false
  errorDetails.value = ''
  // Force component re-render
  window.location.reload()
}

const goHome = () => {
  hasError.value = false
  errorDetails.value = ''
  router.push('/')
}
</script>