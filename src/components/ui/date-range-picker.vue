<template>
  <div class="flex items-center space-x-2">
    <Popover>
      <PopoverTrigger as-child>
        <Button variant="outline" :class="cn('justify-start text-left font-normal text-white bg-emerald-600 border-emerald-600 hover:bg-emerald-700')">
          <CalendarIcon class="mr-2 h-4 w-4 text-white" />
          {{ formattedDateRange || 'Pick a date range' }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0" align="start">
        <div class="p-4">
          <div class="space-y-4">
            <!-- Quick select options -->
            <div class="space-y-2">
              <button
                v-for="option in quickOptions"
                :key="option.value"
                @click="selectQuickOption(option.value)"
                :class="cn(
                  'w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100',
                  modelValue === option.value && 'bg-gray-100 font-medium'
                )"
              >
                {{ option.label }}
              </button>
            </div>
            
            <!-- Custom date inputs -->
            <div v-if="modelValue === 'custom'" class="space-y-2 pt-2 border-t">
              <div>
                <label class="text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  v-model="customStartDate"
                  @change="updateCustomRange"
                  class="w-full mt-1 px-3 py-2 text-sm border rounded-md"
                />
              </div>
              <div>
                <label class="text-sm font-medium">End Date</label>
                <input
                  type="date"
                  v-model="customEndDate"
                  @change="updateCustomRange"
                  class="w-full mt-1 px-3 py-2 text-sm border rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { CalendarIcon } from 'lucide-vue-next'
import Button from './button.vue'
import Popover from './popover.vue'
import PopoverTrigger from './popover-trigger.vue'
import PopoverContent from './popover-content.vue'
import { cn } from '@/lib/utils'

interface Props {
  modelValue: string
  customStartDate?: string
  customEndDate?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'update:customStartDate', value: string): void
  (e: 'update:customEndDate', value: string): void
  (e: 'change'): void
  (e: 'invalid-range'): void
}
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Use reactive props with watchers to sync changes
const customStartDate = ref(props.customStartDate || '')
const customEndDate = ref(props.customEndDate || '')

// Watch for prop changes and sync local state
watch(() => props.customStartDate, (newValue) => {
  customStartDate.value = newValue || ''
})

watch(() => props.customEndDate, (newValue) => {
  customEndDate.value = newValue || ''
})

const quickOptions = [
  { value: '1h', label: 'Last hour' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'custom', label: 'Custom range...' }
]

const formattedDateRange = computed(() => {
  const option = quickOptions.find(o => o.value === props.modelValue)
  if (option && props.modelValue !== 'custom') {
    return option.label
  }
  if (props.modelValue === 'custom' && customStartDate.value && customEndDate.value) {
    const start = new Date(customStartDate.value).toLocaleDateString()
    const end = new Date(customEndDate.value).toLocaleDateString()
    return `${start} - ${end}`
  }
  return null
})

const selectQuickOption = (value: string) => {
  emit('update:modelValue', value)
  if (value !== 'custom') {
    emit('change')
  }
}

const updateCustomRange = () => {
  // Validate date order
  if (customStartDate.value && customEndDate.value) {
    const startDate = new Date(customStartDate.value)
    const endDate = new Date(customEndDate.value)
    
    if (endDate < startDate) {
      // Normalize by setting end date to start date
      customEndDate.value = customStartDate.value
      emit('invalid-range')
      return
    }
  }

  emit('update:customStartDate', customStartDate.value)
  emit('update:customEndDate', customEndDate.value)
  emit('change')
}
</script>