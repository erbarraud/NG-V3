<template>
  <div
    :class="[
      'relative w-full rounded-lg border p-4',
      variantStyles[variant]
    ]"
    role="alert"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'destructive'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const variantStyles = {
  default: 'bg-white border-gray-200 text-gray-900',
  destructive: 'bg-red-50 border-red-200 text-red-900'
}
</script>