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
      
      <!-- Error Illustration -->
      <div class="space-y-4">
        <div class="flex justify-center">
          <div class="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center">
            <ServerCrash class="w-12 h-12 text-destructive" />
          </div>
        </div>
        <div class="text-6xl font-bold text-destructive/20">500</div>
      </div>
      
      <!-- Error Message -->
      <div class="space-y-3">
        <h1 class="text-3xl font-bold text-foreground">Server Error</h1>
        <p class="text-lg text-muted-foreground">
          We're experiencing technical difficulties. Our team has been notified and is working on a fix.
        </p>
      </div>
      
      <!-- Status Information -->
      <div class="bg-muted/30 rounded-lg p-6 space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-foreground">System Status:</span>
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span class="text-sm text-muted-foreground">Investigating</span>
          </div>
        </div>
        
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-foreground">Estimated Fix:</span>
          <span class="text-sm text-muted-foreground">15-30 minutes</span>
        </div>
        
        <div class="text-xs text-muted-foreground">
          Error ID: {{ errorId }}
        </div>
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
      
      <!-- Support -->
      <div class="text-sm text-muted-foreground space-y-2">
        <div>
          Need immediate assistance? 
          <a href="mailto:support@neuralgrader.com" class="text-primary hover:underline">
            Contact Support
          </a>
        </div>
        <div>
          Check our 
          <a href="#" class="text-primary hover:underline">
            Status Page
          </a> 
          for real-time updates
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ServerCrash, RefreshCw, Home } from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'

const router = useRouter()

// Generate a unique error ID for tracking
const errorId = ref(`ERR-${Date.now().toString(36).toUpperCase()}`)

const retry = () => {
  window.location.reload()
}

const goHome = () => {
  router.push('/')
}
</script>