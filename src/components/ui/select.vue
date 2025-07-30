<template>
  <select
    :class="cn(
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      $attrs.class
    )"
    v-bind="$attrs"
  >
    <slot />
  </select>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
</script>