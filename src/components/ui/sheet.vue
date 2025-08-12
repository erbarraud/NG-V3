<script setup lang="ts">
import { DialogRoot, DialogPortal } from 'radix-vue'
import { useVModel } from '@vueuse/core'

interface SheetProps {
  open?: boolean
  defaultOpen?: boolean
}

const props = defineProps<SheetProps>()

const emits = defineEmits<{
  'update:open': [value: boolean]
}>()

const open = useVModel(props, 'open', emits, {
  defaultValue: props.defaultOpen ?? false,
  passive: (props.open === undefined),
})
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <slot />
    </DialogPortal>
  </DialogRoot>
</template>