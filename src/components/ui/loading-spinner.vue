<template>
  <div 
    :class="cn('flex items-center justify-center', containerClass)"
    role="status"
    :aria-label="ariaLabel"
  >
    <div class="relative">
      <!-- Logo Background -->
      <div 
        v-if="showLogo"
        :class="cn(
          'absolute inset-0 flex items-center justify-center',
          logoSize === 'sm' ? 'w-8 h-8' : logoSize === 'lg' ? 'w-16 h-16' : 'w-12 h-12'
        )"
      >
        <img 
          src="/Asset 3@4x 1.png" 
          alt="Neural Grader" 
          :class="cn(
            'opacity-20',
            logoSize === 'sm' ? 'h-6 w-auto' : logoSize === 'lg' ? 'h-12 w-auto' : 'h-8 w-auto'
          )"
        />
      </div>
      
      <!-- Spinner -->
      <div
        :class="cn(
          'animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]',
          sizeClasses,
          colorClasses
        )"
      >
        <span class="sr-only">{{ loadingText }}</span>
      </div>
    </div>
    
    <!-- Loading Text -->
    <div v-if="showText" :class="cn('ml-3 text-sm font-medium', textColorClass)">
      {{ loadingText }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'white', 'muted'].includes(value)
  },
  showLogo: {
    type: Boolean,
    default: false
  },
  showText: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: 'Loading...'
  },
  containerClass: {
    type: String,
    default: ''
  },
  ariaLabel: {
    type: String,
    default: 'Loading content'
  }
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }
  return sizes[props.size]
})

const logoSize = computed(() => {
  if (props.size === 'sm') return 'sm'
  if (props.size === 'xl') return 'lg'
  return 'md'
})

const colorClasses = computed(() => {
  const variants = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    white: 'text-white',
    muted: 'text-muted-foreground'
  }
  return variants[props.variant]
})

const textColorClass = computed(() => {
  const variants = {
    primary: 'text-primary',
    secondary: 'text-secondary-foreground',
    white: 'text-white',
    muted: 'text-muted-foreground'
  }
  return variants[props.variant]
})
</script>