<template>
  <div class="min-h-screen bg-background flex items-center justify-center">
    <div class="text-center space-y-6 max-w-md mx-auto px-4">
      <!-- Logo -->
      <div class="flex justify-center">
        <img 
          src="/Asset 3@4x 1.png" 
          alt="Neural Grader" 
          class="h-16 w-auto brightness-110"
        />
      </div>
      
      <!-- Loading Spinner -->
      <div class="flex justify-center">
        <LoadingSpinner 
          size="xl" 
          variant="primary" 
          :show-text="true" 
          :loading-text="loadingText"
          :aria-label="ariaLabel"
        />
      </div>
      
      <!-- Additional Message -->
      <div v-if="message" class="text-sm text-muted-foreground">
        {{ message }}
      </div>
      
      <!-- Progress Bar (optional) -->
      <div v-if="showProgress" class="w-full bg-muted rounded-full h-2">
        <div 
          class="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
          :style="{ width: `${progress}%` }"
          role="progressbar"
          :aria-valuenow="progress"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="`Loading progress: ${progress}%`"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LoadingSpinner from './loading-spinner.vue'

const props = defineProps({
  loadingText: {
    type: String,
    default: 'Loading Neural Grader...'
  },
  message: {
    type: String,
    default: ''
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 100
  },
  ariaLabel: {
    type: String,
    default: 'Loading application'
  }
})
</script>