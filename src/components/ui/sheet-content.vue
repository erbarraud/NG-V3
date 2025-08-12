<script setup lang="ts">
import { DialogContent, DialogOverlay, DialogClose } from 'radix-vue'
import { X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface SheetContentProps {
  class?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
}

const props = withDefaults(defineProps<SheetContentProps>(), {
  side: 'right'
})

const sheetVariants = {
  top: 'inset-x-0 top-0 border-b',
  bottom: 'inset-x-0 bottom-0 border-t',
  left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
  right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
}
</script>

<template>
  <DialogOverlay 
    class="fixed inset-0 z-50 bg-black/80 sheet-overlay" 
  />
  <DialogContent
    :class="cn(
      'fixed z-50 gap-4 bg-white p-6 shadow-lg sheet-content',
      sheetVariants[props.side],
      `sheet-${props.side}`,
      props.class
    )"
  >
    <div class="mx-auto w-full max-w-2xl">
      <slot />
    </div>
    <DialogClose 
      class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:pointer-events-none"
    >
      <X class="h-4 w-4" />
      <span class="sr-only">Close</span>
    </DialogClose>
  </DialogContent>
</template>

<style scoped>
/* Overlay animations */
.sheet-overlay[data-state="open"] {
  animation: overlay-show 200ms ease-out;
}

.sheet-overlay[data-state="closed"] {
  animation: overlay-hide 200ms ease-in;
}

/* Sheet animations for right side */
.sheet-content.sheet-right[data-state="open"] {
  animation: slide-in-from-right 300ms cubic-bezier(0.32, 0.72, 0, 1);
}

.sheet-content.sheet-right[data-state="closed"] {
  animation: slide-out-to-right 200ms cubic-bezier(0.32, 0.72, 0, 1);
}

/* Sheet animations for left side */
.sheet-content.sheet-left[data-state="open"] {
  animation: slide-in-from-left 300ms cubic-bezier(0.32, 0.72, 0, 1);
}

.sheet-content.sheet-left[data-state="closed"] {
  animation: slide-out-to-left 200ms cubic-bezier(0.32, 0.72, 0, 1);
}

/* Sheet animations for top */
.sheet-content.sheet-top[data-state="open"] {
  animation: slide-in-from-top 300ms cubic-bezier(0.32, 0.72, 0, 1);
}

.sheet-content.sheet-top[data-state="closed"] {
  animation: slide-out-to-top 200ms cubic-bezier(0.32, 0.72, 0, 1);
}

/* Sheet animations for bottom */
.sheet-content.sheet-bottom[data-state="open"] {
  animation: slide-in-from-bottom 300ms cubic-bezier(0.32, 0.72, 0, 1);
}

.sheet-content.sheet-bottom[data-state="closed"] {
  animation: slide-out-to-bottom 200ms cubic-bezier(0.32, 0.72, 0, 1);
}

/* Keyframes */
@keyframes overlay-show {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes overlay-hide {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes slide-in-from-right {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slide-out-to-right {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

@keyframes slide-in-from-left {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slide-out-to-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

@keyframes slide-in-from-top {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slide-out-to-top {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
}

@keyframes slide-in-from-bottom {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slide-out-to-bottom {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}
</style>