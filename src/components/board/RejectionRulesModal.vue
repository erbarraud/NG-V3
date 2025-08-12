<template>
  <Sheet v-model:open="isOpen">
    <SheetContent side="right" class="w-[400px] sm:w-[540px] overflow-y-auto">
      <SheetHeader class="pb-4 border-b">
        <SheetTitle>Board #{{ board?.id }} - Grade Validation</SheetTitle>
        <div v-if="board" class="flex items-center gap-2 mt-2">
          <span class="px-2 py-1 bg-gray-100 text-xs font-medium rounded">
            Assigned: {{ getGradeName(board.gradeId, board) }}
          </span>
          <span v-if="board.customGradeId" class="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">
            Custom: {{ board.customGradeId }}
          </span>
        </div>
      </SheetHeader>
      
      <div class="py-4" v-if="board">
        <!-- Validation Results -->
        <div v-if="board.grades && board.grades.length > 0">
          <!-- Quick Summary Line -->
          <div class="flex items-center gap-4 mb-3 pb-2 border-b">
            <span class="text-xs text-gray-600">Validation Summary:</span>
            <div class="flex items-center gap-3">
              <span class="flex items-center text-xs">
                <CheckCircle class="w-3 h-3 text-green-600 mr-1" />
                <span class="text-green-600 font-medium">{{ board.grades.filter(g => g.valid).length }} Passed</span>
              </span>
              <span class="flex items-center text-xs">
                <XCircle class="w-3 h-3 text-red-600 mr-1" />
                <span class="text-red-600 font-medium">{{ board.grades.filter(g => !g.valid).length }} Failed</span>
              </span>
            </div>
          </div>
          
          <!-- Failed Grades Details -->
          <div v-if="board.grades.some(g => !g.valid && g.reasons?.length > 0)">
            <h5 class="text-xs font-semibold text-gray-900 mb-2">Failed Grade Requirements:</h5>
            <div class="space-y-3">
              <div v-for="(grade, index) in board.grades.filter(g => !g.valid && g.reasons?.length > 0)" 
                   :key="index"
                   class="border-l-2 border-red-400 pl-3">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-medium text-gray-900">{{ getGradeName(grade.id) }}</span>
                  <span class="text-xs text-red-600">{{ grade.reasons.length }} violation{{ grade.reasons.length > 1 ? 's' : '' }}</span>
                </div>
                <ul class="space-y-1">
                  <li v-for="(reason, rIndex) in grade.reasons" :key="rIndex" class="flex items-start">
                    <span class="text-red-400 mr-2 text-xs">•</span>
                    <span class="text-xs text-gray-600">{{ fixEncoding(reason) }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <!-- Passed Grades List (Simple) -->
          <div v-if="board.grades.some(g => g.valid)" class="mt-4">
            <h5 class="text-xs font-semibold text-gray-900 mb-2">Passed Grades:</h5>
            <div class="flex flex-wrap gap-2">
              <span v-for="(grade, index) in board.grades.filter(g => g.valid)" 
                    :key="index"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle class="w-3 h-3 mr-1" />
                {{ getGradeName(grade.id) }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- No validation data -->
        <div v-else class="text-center py-6 text-gray-500">
          <AlertCircle class="w-8 h-8 mx-auto mb-2" />
          <p class="text-sm">No grade validation data available</p>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-vue-next'
import Sheet from '@/components/ui/sheet.vue'
import SheetContent from '@/components/ui/sheet-content.vue'
import SheetHeader from '@/components/ui/sheet-header.vue'
import SheetTitle from '@/components/ui/sheet-title.vue'
import { useApi } from '@/composables/useApi'

const props = defineProps({
  board: {
    type: Object,
    default: null
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  grades: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Cache for order custom grades mapping
const orderCustomGradesCache = ref({})
const { execute: fetchBatchDetails } = useApi('/api/v3/batches')

// Load order custom grades mapping
const loadOrderCustomGrades = async (orderId) => {
  if (!orderId || orderCustomGradesCache.value[orderId]) {
    return orderCustomGradesCache.value[orderId]
  }
  
  try {
    // Use the correct endpoint format for fetching batch details
    const { execute: fetchBatchDetailsById } = useApi(`/api/v3/batches/${orderId}`)
    const response = await fetchBatchDetailsById()
    
    if (!response || !response.data) {
      console.log(`No batch data found for order ${orderId}`)
      return null
    }
    
    const batchData = Array.isArray(response.data) ? response.data[0] : response.data
    const mapping = {}
    
    if (batchData.customGrades && Array.isArray(batchData.customGrades)) {
      batchData.customGrades.forEach(cg => {
        mapping[cg.id] = cg.customGrade?.name || cg.name || `Grade ${cg.id}`
      })
      orderCustomGradesCache.value[orderId] = mapping
      console.log(`Loaded order ${orderId} custom grades:`, mapping)
      return mapping
    }
  } catch (error) {
    console.error(`Error loading order ${orderId} custom grades:`, error)
  }
  
  return null
}

// Watch for board changes to load custom grades
watch(() => props.board, async (newBoard) => {
  if (newBoard?.batchId) {
    await loadOrderCustomGrades(newBoard.batchId)
  }
}, { immediate: true })

// Get grade name from grades list or use fallback
const getGradeName = (gradeId, board = null) => {
  if (!gradeId) return 'Unknown'
  
  // First check if board has a gradeName
  if (board?.gradeName) return board.gradeName
  
  // For grade IDs > 100, check order custom grades cache
  if (gradeId > 100) {
    // Look through all cached order custom grades
    for (const orderId in orderCustomGradesCache.value) {
      const mapping = orderCustomGradesCache.value[orderId]
      if (mapping && mapping[gradeId]) {
        return mapping[gradeId]
      }
    }
    // Try to find from board's order
    if (props.board?.batchId) {
      const mapping = orderCustomGradesCache.value[props.board.batchId]
      if (mapping && mapping[gradeId]) {
        return mapping[gradeId]
      }
    }
  }
  
  // Then check props.grades array for standard grades
  const grade = props.grades.find(g => g.id === gradeId)
  if (grade) return grade.name
  
  // If no match found, just return the grade ID
  return `Grade ${gradeId}`
}

// Fix encoding issues in rejection reasons
const fixEncoding = (text) => {
  if (!text) return ''
  
  // Common French character replacements
  return text
    .replace(/�/g, 'é')
    .replace(/Ã©/g, 'é')
    .replace(/Ã¨/g, 'è')
    .replace(/Ã /g, 'à')
    .replace(/Ã¢/g, 'â')
    .replace(/Ã´/g, 'ô')
    .replace(/Ã®/g, 'î')
    .replace(/Ã§/g, 'ç')
    .replace(/Ã¹/g, 'ù')
    .replace(/Ãª/g, 'ê')
}
</script>