<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-black/50" 
          @click="$emit('update:open', false)"
        ></div>
        
        <!-- Dialog content -->
        <div 
          ref="dialogRef"
          role="dialog"
          aria-modal="true"
          class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          @keydown="handleKeydown"
        >
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue'
import { useScrollLock } from '@vueuse/core'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:open'])

const dialogRef = ref()
const isLocked = useScrollLock(document.body)

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    emit('update:open', false)
  }
}

watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    isLocked.value = true
    await nextTick()
    dialogRef.value?.focus()
  } else {
    isLocked.value = false
  }
})

onUnmounted(() => {
  isLocked.value = false
})
</script>