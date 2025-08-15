<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      class="relative z-50 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg"
      @click.stop
    >
      <button
        @click="$emit('close')"
        class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2"
      >
        <span class="sr-only">Close</span>
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['close'])
</script>