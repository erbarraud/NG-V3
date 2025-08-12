<script setup lang="ts">
import { DrawerOverlay } from 'vaul-vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <DrawerOverlay
    :class="cn('fixed inset-0 z-50 bg-black/80', props.class)"
  />
</template>