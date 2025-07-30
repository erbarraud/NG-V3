<template>
  <div :class="cn('animate-pulse', containerClass)" role="status" :aria-label="ariaLabel">
    <div v-if="variant === 'card'" class="space-y-4">
      <!-- Card Header -->
      <div class="flex items-center space-x-4">
        <div class="rounded-full bg-muted h-12 w-12"></div>
        <div class="space-y-2 flex-1">
          <div class="h-4 bg-muted rounded w-3/4"></div>
          <div class="h-3 bg-muted rounded w-1/2"></div>
        </div>
      </div>
      <!-- Card Content -->
      <div class="space-y-3">
        <div class="h-4 bg-muted rounded"></div>
        <div class="h-4 bg-muted rounded w-5/6"></div>
        <div class="h-4 bg-muted rounded w-4/6"></div>
      </div>
    </div>

    <div v-else-if="variant === 'table'" class="space-y-3">
      <!-- Table Header -->
      <div class="grid grid-cols-4 gap-4">
        <div class="h-4 bg-muted rounded"></div>
        <div class="h-4 bg-muted rounded"></div>
        <div class="h-4 bg-muted rounded"></div>
        <div class="h-4 bg-muted rounded"></div>
      </div>
      <!-- Table Rows -->
      <div v-for="i in rows" :key="i" class="grid grid-cols-4 gap-4">
        <div class="h-4 bg-muted rounded"></div>
        <div class="h-4 bg-muted rounded"></div>
        <div class="h-4 bg-muted rounded"></div>
        <div class="h-4 bg-muted rounded"></div>
      </div>
    </div>

    <div v-else-if="variant === 'list'" class="space-y-4">
      <div v-for="i in rows" :key="i" class="flex items-center space-x-4">
        <div class="rounded-full bg-muted h-8 w-8"></div>
        <div class="space-y-2 flex-1">
          <div class="h-4 bg-muted rounded w-3/4"></div>
          <div class="h-3 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <div v-else-if="variant === 'text'" class="space-y-2">
      <div v-for="i in rows" :key="i" :class="cn('h-4 bg-muted rounded', i === rows ? 'w-3/4' : 'w-full')"></div>
    </div>

    <div v-else class="space-y-3">
      <div class="h-6 bg-muted rounded w-1/4"></div>
      <div class="space-y-2">
        <div class="h-4 bg-muted rounded"></div>
        <div class="h-4 bg-muted rounded w-5/6"></div>
      </div>
    </div>

    <span class="sr-only">{{ loadingText }}</span>
  </div>
</template>

<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'card', 'table', 'list', 'text'].includes(value)
  },
  rows: {
    type: Number,
    default: 3
  },
  containerClass: {
    type: String,
    default: ''
  },
  loadingText: {
    type: String,
    default: 'Loading content...'
  },
  ariaLabel: {
    type: String,
    default: 'Loading content'
  }
})
</script>