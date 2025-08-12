<script setup lang="ts">
import { computed } from 'vue'
import { DrawerRoot } from 'vaul-vue'

const props = defineProps<{
  shouldScaleBackground?: boolean
  open?: boolean
}>()

const emits = defineEmits<{
  'update:open': [value: boolean]
}>()

const delegatedProps = computed(() => {
  const { ...delegated } = props
  return delegated
})
</script>

<template>
  <DrawerRoot
    v-bind="delegatedProps"
    @update:open="(v) => emits('update:open', v)"
  >
    <slot />
  </DrawerRoot>
</template>