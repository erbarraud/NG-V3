<template>
  <div class="min-h-screen bg-gray-50">
    <div class="w-full px-4 sm:px-6 lg:px-8 py-6">
      <!-- Header Section -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center space-x-4">
          <button 
            @click="$router.go(-1)"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ isEditMode ? 'Edit Grade' : 'Create New Grade' }}
            </h1>
            <p class="text-gray-600 mt-1">Configure lumber grading standards with zone-based rules</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="$router.push('/grade-management')"
            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveGrade"
            :disabled="!isFormValid || isSaving"
            :class="[
              'px-6 py-2 rounded-lg font-medium transition-colors flex items-center',
              isFormValid && !isSaving
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            <LoadingSpinner v-if="isSaving" size="sm" variant="white" class="mr-2" />
            {{ isSaving ? 'Saving...' : (isEditMode ? 'Update Grade' : 'Create Grade') }}
          </button>
        </div>
      </div>

      <!-- Grade Basic Information -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Grade Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="gradeName" class="block text-sm font-medium text-gray-700 mb-2">
              Grade Name *
            </label>
            <input
              id="gradeName"
              v-model="gradeForm.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter grade name (e.g., FAS, Select, No.1 Common)"
            />
          </div>
          <div>
            <label for="gradeValue" class="block text-sm font-medium text-gray-700 mb-2">
              Value per Unit ($)
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                id="gradeValue"
                v-model="gradeForm.valuePerUnit"
                type="number"
                step="0.01"
                min="0"
                class="w-full pl-7 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Visual Board Designer -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Board Zone Designer</h2>
        <p class="text-gray-600 mb-6">Define edge zones with different defect rules. Drag sliders to adjust zone depths.</p>
        
        <!-- Quick Templates -->
        <div class="mb-6">
          <div class="text-sm font-medium text-gray-700 mb-3">Quick Templates:</div>
          <div class="flex items-center space-x-3">
            <button
              @click="applyZoneTemplate('none')"
              :class="[
                'px-3 py-2 text-sm rounded-lg border transition-colors',
                !hasAnyZones ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-300 hover:bg-gray-50'
              ]"
            >
              No Edge Zones
            </button>
            <button
              @click="applyZoneTemplate('standard')"
              :class="[
                'px-3 py-2 text-sm rounded-lg border transition-colors',
                hasStandardZones ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-300 hover:bg-gray-50'
              ]"
            >
              Standard Edges (10cm)
            </button>
            <button
              @click="applyZoneTemplate('wide-ends')"
              class="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Wide Ends (20cm top/bottom)
            </button>
            <button
              @click="applyZoneTemplate('custom')"
              class="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Custom
            </button>
          </div>
        </div>

        <!-- Visual Board with Zones -->
        <div class="relative bg-gray-100 rounded-lg p-8 mb-6">
          <!-- Board Container -->
          <div class="relative mx-auto" style="width: 600px; height: 300px;">
            <!-- Top Edge Zone -->
            <div 
              v-if="zoneConfig.top.enabled"
              class="absolute top-0 left-0 right-0 bg-blue-200 border-2 border-blue-400 rounded-t-lg transition-all duration-300"
              :style="{ height: `${zoneConfig.top.depth * 3}px` }"
            >
              <div class="absolute inset-0 flex items-center justify-center text-xs font-medium text-blue-800">
                Top Edge ({{ zoneConfig.top.depth }}cm)
              </div>
            </div>

            <!-- Bottom Edge Zone -->
            <div 
              v-if="zoneConfig.bottom.enabled"
              class="absolute bottom-0 left-0 right-0 bg-blue-200 border-2 border-blue-400 rounded-b-lg transition-all duration-300"
              :style="{ height: `${zoneConfig.bottom.depth * 3}px` }"
            >
              <div class="absolute inset-0 flex items-center justify-center text-xs font-medium text-blue-800">
                Bottom Edge ({{ zoneConfig.bottom.depth }}cm)
              </div>
            </div>

            <!-- Left Edge Zone -->
            <div 
              v-if="zoneConfig.left.enabled"
              class="absolute top-0 bottom-0 left-0 bg-blue-200 border-2 border-blue-400 rounded-l-lg transition-all duration-300"
              :style="{ width: `${zoneConfig.left.depth * 6}px` }"
            >
              <div class="absolute inset-0 flex items-center justify-center text-xs font-medium text-blue-800 transform -rotate-90">
                Left ({{ zoneConfig.left.depth }}cm)
              </div>
            </div>

            <!-- Right Edge Zone -->
            <div 
              v-if="zoneConfig.right.enabled"
              class="absolute top-0 bottom-0 right-0 bg-blue-200 border-2 border-blue-400 rounded-r-lg transition-all duration-300"
              :style="{ width: `${zoneConfig.right.depth * 6}px` }"
            >
              <div class="absolute inset-0 flex items-center justify-center text-xs font-medium text-blue-800 transform rotate-90">
                Right ({{ zoneConfig.right.depth }}cm)
              </div>
            </div>

            <!-- Center Area -->
            <div 
              class="absolute bg-white border-2 border-gray-300 rounded-lg transition-all duration-300"
              :style="centerAreaStyle"
            >
              <div class="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-600">
                Main Board Area
              </div>
            </div>

            <!-- Board Outline -->
            <div class="absolute inset-0 border-4 border-amber-600 rounded-lg bg-amber-100/30">
              <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600">
                Board Preview
              </div>
            </div>
          </div>
        </div>

        <!-- Zone Controls -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <!-- Top Edge -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Top Edge</label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="zoneConfig.top.enabled"
                  class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-xs text-gray-600">Enable</span>
              </label>
            </div>
            <div class="space-y-2">
              <input
                v-model="zoneConfig.top.depth"
                type="range"
                min="0"
                max="50"
                :disabled="!zoneConfig.top.enabled"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
              <div class="text-xs text-gray-500 text-center">{{ zoneConfig.top.depth }}cm from edge</div>
            </div>
          </div>

          <!-- Bottom Edge -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Bottom Edge</label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="zoneConfig.bottom.enabled"
                  class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-xs text-gray-600">Enable</span>
              </label>
            </div>
            <div class="space-y-2">
              <input
                v-model="zoneConfig.bottom.depth"
                type="range"
                min="0"
                max="50"
                :disabled="!zoneConfig.bottom.enabled"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
              <div class="text-xs text-gray-500 text-center">{{ zoneConfig.bottom.depth }}cm from edge</div>
            </div>
          </div>

          <!-- Left Edge -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Left Edge</label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="zoneConfig.left.enabled"
                  class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-xs text-gray-600">Enable</span>
              </label>
            </div>
            <div class="space-y-2">
              <input
                v-model="zoneConfig.left.depth"
                type="range"
                min="0"
                max="50"
                :disabled="!zoneConfig.left.enabled"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
              <div class="text-xs text-gray-500 text-center">{{ zoneConfig.left.depth }}cm from edge</div>
            </div>
          </div>

          <!-- Right Edge -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Right Edge</label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="zoneConfig.right.enabled"
                  class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
</script>
            <div class="space-y-2 text-sm">
              <div v-for="(rule, defectId) in zoneRules" :key="defectId">
                <div v-if="rule.enabled" class="flex items-center justify-between">
                  <span class="text-gray-700">{{ getDefectName(defectId) }}</span>
                  <span class="font-medium text-blue-700">
                    Max {{ rule.limitValue }} {{ getUnitForMetric(rule.metric) }}
                  </span>
                </div>
              </div>
              <div v-if="getEnabledDefectsCount('zones') === 0" class="text-gray-500 italic">
                {{ hasAnyZones ? 'No zone overrides configured' : 'No edge zones defined' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, Package, Map, Copy
} from 'lucide-vue-next'
import LoadingSpinner from '@/components/ui/loading-spinner.vue'
import { useDefectRules } from '@/composables/useDefectRules'

const route = useRoute()
const router = useRouter()

// Check if we're editing an existing grade
const isEditMode = computed(() => route.query.edit === 'true')

// Loading state
const isSaving = ref(false)

// Active tab
const activeRuleTab = ref('board')

// Use composables
const { 
  defectCategories: defectCategoriesData,
  aggregationOptions, 
  referenceOptions,
  getMetricOptions,
  getUnitForMetric,
  getCurrentCategoryName,
  getCurrentCategoryDefects,
  getEnabledDefectsCount: getEnabledDefectsCountFromComposable,
  enableAllInCategory,
  disableAllInCategory,
  enableAllDefects,
  disableAllDefects,
  getAllEnabledDefects
} = useDefectRules()

// Grade form data
const gradeForm = ref({
  name: '',
  description: '',
  valuePerUnit: '',
  species: [],
  faceGradingOption: 'both-faces'
})

// Zone configuration
const zoneConfig = ref({
  top: { enabled: false, depth: 10 },
  bottom: { enabled: false, depth: 10 },
  left: { enabled: false, depth: 10 },
  right: { enabled: false, depth: 10 }
})

const linkAllEdges = ref(false)

// Convert composable data to flat defect categories for easier template use
const defectCategories = computed(() => {
  return [
    { id: 'knots', name: 'Natural Characteristics', defects: defectCategoriesData.value.knots.defects },
    { id: 'cracks', name: 'Cracks & Splits', defects: defectCategoriesData.value.cracksAndSplits.defects },
    { id: 'surface', name: 'Surface Defects', defects: defectCategoriesData.value.surfaceDefects.defects },
    { id: 'holes', name: 'Holes', defects: defectCategoriesData.value.holes.defects },
    { id: 'other', name: 'Other Defects', defects: defectCategoriesData.value.otherDefects.defects }
  ]
})

// Initialize defect rules for board and zones
const initializeDefectRules = () => {
  const rules = {}
  defectCategories.value.forEach(category => {
    category.defects.forEach(defect => {
      rules[defect.id] = {
        enabled: false,
        metric: defect.metric || '',
        limitValue: defect.limitValue || 0,
        aggregationMethod: defect.aggregationMethod || 'maximum'
      }
    })
  })
  return rules
}

const boardRules = ref(initializeDefectRules())
const zoneRules = ref(initializeDefectRules())

// Computed properties
const hasAnyZones = computed(() => {
  return Object.values(zoneConfig.value).some(zone => zone.enabled)
})

const hasStandardZones = computed(() => {
  return Object.values(zoneConfig.value).every(zone => zone.enabled && zone.depth === 10)
})

const centerAreaStyle = computed(() => {
  const topOffset = zoneConfig.value.top.enabled ? zoneConfig.value.top.depth * 3 : 0
  const bottomOffset = zoneConfig.value.bottom.enabled ? zoneConfig.value.bottom.depth * 3 : 0
  const leftOffset = zoneConfig.value.left.enabled ? zoneConfig.value.left.depth * 6 : 0
  const rightOffset = zoneConfig.value.right.enabled ? zoneConfig.value.right.depth * 6 : 0
  
  return {
    top: `${topOffset}px`,
    bottom: `${bottomOffset}px`,
    left: `${leftOffset}px`,
    right: `${rightOffset}px`
  }
})

const isFormValid = computed(() => {
  return gradeForm.value.name.trim() !== ''
})

// Helper functions
const formatMetric = (metric) => {
  if (!metric) return ''
  
  // If metric is a string, capitalize it
  if (typeof metric === 'string') {
    return metric.charAt(0).toUpperCase() + metric.slice(1).replace(/([A-Z])/g, ' $1').trim()
  }
  
  // If metric is an object with title property
  if (metric.title) {
    return metric.title
  }
  
  // If metric is an object with value property
  if (metric.value) {
    return metric.value.charAt(0).toUpperCase() + metric.value.slice(1).replace(/([A-Z])/g, ' $1').trim()
  }
  
  return String(metric)
}

const getDefectName = (defectId) => {
  for (const category of defectCategories.value) {
    const defect = category.defects.find(d => d.id === defectId)
    if (defect) return defect.name
  }
  return defectId
}

const getEnabledDefectsCount = (ruleType) => {
  const rules = ruleType === 'board' ? boardRules.value : zoneRules.value
  return Object.values(rules).filter(rule => rule.enabled).length
}

const getEnabledInCategory = (categoryId, ruleType) => {
  const category = defectCategories.value.find(c => c.id === categoryId)
  if (!category) return 0
  
  const rules = ruleType === 'board' ? boardRules.value : zoneRules.value
  return category.defects.filter(defect => rules[defect.id]?.enabled).length
}

const toggleAllInCategory = (categoryId, ruleType) => {
  const category = defectCategories.value.find(c => c.id === categoryId)
  if (!category) return
  
  const rules = ruleType === 'board' ? boardRules.value : zoneRules.value
  const enabledCount = getEnabledInCategory(categoryId, ruleType)
  const shouldEnable = enabledCount < category.defects.length
  
  category.defects.forEach(defect => {
    if (rules[defect.id]) {
      rules[defect.id].enabled = shouldEnable
    }
  })
}

// Zone template methods
const applyZoneTemplate = (template) => {
  switch (template) {
    case 'none':
      Object.keys(zoneConfig.value).forEach(key => {
        zoneConfig.value[key].enabled = false
        zoneConfig.value[key].depth = 10
      })
      break
    case 'standard':
      Object.keys(zoneConfig.value).forEach(key => {
        zoneConfig.value[key].enabled = true
        zoneConfig.value[key].depth = 10
      })
      break
    case 'wide-ends':
      zoneConfig.value.top.enabled = true
      zoneConfig.value.top.depth = 20
      zoneConfig.value.bottom.enabled = true
      zoneConfig.value.bottom.depth = 20
      zoneConfig.value.left.enabled = true
      zoneConfig.value.left.depth = 5
      zoneConfig.value.right.enabled = true
      zoneConfig.value.right.depth = 5
      break
    case 'custom':
      // Keep current settings
      break
  }
}

const handleLinkEdgesChange = () => {
  if (linkAllEdges.value) {
    // Set all edges to the same depth as the first enabled zone
    const firstEnabledZone = Object.values(zoneConfig.value).find(zone => zone.enabled)
    if (firstEnabledZone) {
      const depth = firstEnabledZone.depth
      Object.keys(zoneConfig.value).forEach(key => {
        zoneConfig.value[key].depth = depth
      })
    }
  }
}

const copyBoardRulesToZones = () => {
  Object.keys(boardRules.value).forEach(defectId => {
    if (boardRules.value[defectId].enabled) {
      zoneRules.value[defectId] = { ...boardRules.value[defectId] }
    }
  })
}

// Watch for linked edges
watch(linkAllEdges, (newValue) => {
  if (newValue) {
    // When linking is enabled, sync all depths
    const depths = Object.values(zoneConfig.value).map(zone => zone.depth)
    const avgDepth = Math.round(depths.reduce((a, b) => a + b, 0) / depths.length)
    
    Object.keys(zoneConfig.value).forEach(key => {
      zoneConfig.value[key].depth = avgDepth
    })
  }
})

// Watch for depth changes when linked
watch(() => Object.values(zoneConfig.value).map(zone => zone.depth), (newDepths, oldDepths) => {
  if (linkAllEdges.value && oldDepths) {
    // Find which depth changed and sync all others
    const keys = Object.keys(zoneConfig.value)
    for (let i = 0; i < newDepths.length; i++) {
      if (newDepths[i] !== oldDepths[i]) {
        const newDepth = newDepths[i]
        keys.forEach(key => {
          zoneConfig.value[key].depth = newDepth
        })
        break
      }
    }
  }
}, { deep: true })

const saveGrade = async () => {
  if (!isFormValid.value) return
  
  isSaving.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const gradeData = {
      ...gradeForm.value,
      zones: zoneConfig.value,
      boardRules: boardRules.value,
      zoneRules: zoneRules.value
    }
    
    console.log('Saving grade:', gradeData)
    
    // Navigate back to grade management
    router.push('/grade-management')
  } catch (error) {
    console.error('Error saving grade:', error)
  } finally {
    isSaving.value = false
  }
}
</script>