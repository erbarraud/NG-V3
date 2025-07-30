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
      
      <!-- 404 Illustration -->
      <div class="space-y-4">
        <div class="text-8xl font-bold text-primary/20">404</div>
        <div class="w-24 h-1 bg-primary mx-auto rounded-full"></div>
      </div>
      
      <!-- Error Message -->
      <div class="space-y-3">
        <h1 class="text-3xl font-bold text-foreground">Page Not Found</h1>
        <p class="text-lg text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      
      <!-- Helpful Links -->
      <div class="bg-muted/30 rounded-lg p-6 space-y-4">
        <h2 class="text-lg font-semibold text-foreground">Try these instead:</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <router-link 
            to="/" 
            class="flex items-center p-3 bg-background rounded-lg hover:bg-accent transition-colors group"
          >
            <BarChart3 class="w-5 h-5 text-primary mr-3 group-hover:scale-110 transition-transform" />
            <div class="text-left">
              <div class="font-medium text-foreground">Dashboard</div>
              <div class="text-sm text-muted-foreground">Production overview</div>
            </div>
          </router-link>
          
          <router-link 
            to="/orders" 
            class="flex items-center p-3 bg-background rounded-lg hover:bg-accent transition-colors group"
          >
            <Package class="w-5 h-5 text-primary mr-3 group-hover:scale-110 transition-transform" />
            <div class="text-left">
              <div class="font-medium text-foreground">Orders</div>
              <div class="text-sm text-muted-foreground">Production orders</div>
            </div>
          </router-link>
          
          <router-link 
            to="/finder" 
            class="flex items-center p-3 bg-background rounded-lg hover:bg-accent transition-colors group"
          >
            <Search class="w-5 h-5 text-primary mr-3 group-hover:scale-110 transition-transform" />
            <div class="text-left">
              <div class="font-medium text-foreground">Board Finder</div>
              <div class="text-sm text-muted-foreground">Find boards</div>
            </div>
          </router-link>
          
          <router-link 
            to="/line" 
            class="flex items-center p-3 bg-background rounded-lg hover:bg-accent transition-colors group"
          >
            <Activity class="w-5 h-5 text-primary mr-3 group-hover:scale-110 transition-transform" />
            <div class="text-left">
              <div class="font-medium text-foreground">Line Check</div>
              <div class="text-sm text-muted-foreground">Monitor cameras</div>
            </div>
          </router-link>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <Button @click="goBack" variant="default">
          <ArrowLeft class="w-4 h-4 mr-2" />
          Go Back
        </Button>
        <Button @click="goHome" variant="outline">
          <Home class="w-4 h-4 mr-2" />
          Go Home
        </Button>
      </div>
      
      <!-- Support -->
      <div class="text-sm text-muted-foreground">
        Still can't find what you're looking for? 
        <a href="mailto:support@neuralgrader.com" class="text-primary hover:underline">
          Contact Support
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { 
  BarChart3, Package, Search, Activity, ArrowLeft, Home 
} from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const goHome = () => {
  router.push('/')
}
</script>