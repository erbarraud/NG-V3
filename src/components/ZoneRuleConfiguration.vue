<template>
  <div class="space-y-6">
    <!-- Defect Rules Section -->
    <div>
      <h4 class="text-lg font-semibold text-gray-900 mb-4">Defect Rules</h4>
      
      <div class="space-y-4">
        <!-- Defect Categories -->
        <div v-for="category in defectCategories" :key="category.id" class="border border-gray-200 rounded-lg">
          <button
            @click="toggleCategory(category.id)"
            class="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <div class="flex items-center space-x-3">
              <component :is="category.icon" class="w-5 h-5 text-gray-600" />
              <span class="font-medium text-gray-900">{{ category.name }}</span>
              <span class="text-sm text-gray-500">({{ category.defects.length }} defects)</span>
            </div>
            <ChevronDown 
              :class="[
                'w-4 h-4 text-gray-400 transition-transform',
                expandedCategories.includes(category.id) ? 'rotate-180' : ''
              ]" 
            />
          </button>
          
          <div v-if="expandedCategories.includes(category.id)" class="border-t border-gray-200 p-4">
            <div class="grid grid-cols-1 gap-4">
              <div v-for="defect in category.defects" :key="defect.id" class="border border-gray-100 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center space-x-3">
                    <label class="flex items-center">
                      <input
                        type="checkbox"
                        :checked="isDefectEnabled(defect.id)"
                        @change="toggleDefect(defect.id)"
                        class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <span class="ml-2 font-medium text-gray-900">{{ defect.name }}</span>
                    </label>
                    <Badge variant="outline" class="text-xs">{{ defect.type }}</Badge>
                  </div>
                  <Button
                    v-if="isDefectEnabled(defect.id)"
                    variant="outline"
                    size="sm"
                    @click="configureDefect(defect.id)"
                  >
                    <Settings class="w-3 h-3 mr-1" />
                    Configure
                  </Button>
                </div>
                
                <div v-if="isDefectEnabled(defect.id)" class="space-y-3 bg-gray-50 rounded p-3">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">Measurement</label>
                      <select
                        :value="getDefectRule(defect.id, 'measurement')"
                        @change="updateDefectRule(defect.id, 'measurement', $event.target.value)"
                        class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="diameter">Diameter</option>
                        <option value="length">Length</option>
                        <option value="area">Area</option>
                        <option value="count">Count</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">Aggregation</label>
                      <select
                        :value="getDefectRule(defect.id, 'aggregation')"
                        @change="updateDefectRule(defect.id, 'aggregation', $event.target.value)"
                        class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="maximum">Maximum</option>
                        <option value="sum">Sum</option>
                        <option value="average">Average</option>
                        <option value="per-meter">Per Linear Meter</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">Limit</label>
                      <div class="flex space-x-1">
                        <input
                          type="number"
                          :value="getDefectRule(defect.id, 'limit')"
                          @input="updateDefectRule(defect.id, 'limit', $event.target.value)"
                          class="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500"
                          placeholder="0"
                        />
                        <select
                          :value="getDefectRule(defect.id, 'limitType')"
                          @change="updateDefectRule(defect.id, 'limitType', $event.target.value)"
                          class="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="fixed">Fixed</option>
                          <option value="percent">%</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">Classification</label>
                      <select
                        :value="getDefectRule(defect.id, 'classification')"
                        @change="updateDefectRule(defect.id, 'classification', $event.target.value)"
                        class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="sound">Sound</option>
                        <option value="unsound">Unsound</option>
                        <option value="either">Either</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">Clustering Distance (mm)</label>
                      <input
                        type="number"
                        :value="getDefectRule(defect.id, 'clusterDistance')"
                        @input="updateDefectRule(defect.id, 'clusterDistance', $event.target.value)"
                        class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500"
                        placeholder="25"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cutting & Reduction Rules Section -->
    <div>
      <h4 class="text-lg font-semibold text-gray-900 mb-4">Cutting & Reduction Rules</h4>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Cutting Rules -->
        <div class="border border-gray-200 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <h5 class="font-medium text-gray-900">Cutting Methodology</h5>
            <label class="flex items-center">
              <input
                type="checkbox"
                :checked="rules.cutting?.enabled"
                @change="updateRule('cutting.enabled', $event.target.checked)"
                class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">Enable</span>
            </label>
          </div>
          
          <div v-if="rules.cutting?.enabled" class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Min Length (ft)</label>
                <input
                  type="number"
                  :value="rules.cutting?.minLength"
                  @input="updateRule('cutting.minLength', $event.target.value)"
                  class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500"
                  step="0.5"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Min Width (in)</label>
                <input
                  type="number"
                  :value="rules.cutting?.minWidth"
                  @input="updateRule('cutting.minWidth', $event.target.value)"
                  class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500"
                  step="0.25"
                />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Max Cuttings in Zone</label>
              <input
                type="number"
                :value="rules.cutting?.maxCount"
                @input="updateRule('cutting.maxCount', $event.target.value)"
                class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500"
                min="1"
              />
            </div>
          </div>
        </div>

        <!-- Reduction Rules -->
        <div class="border border-gray-200 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <h5 class="font-medium text-gray-900">Reduction Methodology</h5>
            <label class="flex items-center">
              <input
                type="checkbox"
                :checked="rules.reduction?.enabled"
                @change="updateRule('reduction.enabled', $event.target.checked)"
                class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">Enable</span>
            </label>
          </div>
          
          <div v-if="rules.reduction?.enabled" class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Allowed Types</label>
              <div class="space-y-1">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    :checked="rules.reduction?.types?.includes('full-width')"
                    @change="toggleReductionType('full-width')"
                    class="h-3 w-3 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-xs text-gray-700">Full Width</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    :checked="rules.reduction?.types?.includes('full-length')"
                    @change="toggleReductionType('full-length')"
                    class="h-3 w-3 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-xs text-gray-700">Full Length</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    :checked="rules.reduction?.types?.includes('boxed')"
                    @change="toggleReductionType('boxed')"
                    class="h-3 w-3 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-xs text-gray-700">Boxed</span>
                </label>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Max Size (%)</label>
                <input
                  type="number"
                  :value="rules.reduction?.maxSize"
                  @input="updateRule('reduction.maxSize', $event.target.value)"
                  class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500"
                  min="1"
                  max="100"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Min Distance (in)</label>
                <input
                  type="number"
                  :value="rules.reduction?.minDistance"
                  @input="updateRule('reduction.minDistance', $event.target.value)"
                  class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500"
                  step="0.25"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Yield Requirements Section -->
    <div>
      <h4 class="text-lg font-semibold text-gray-900 mb-4">Yield Requirements</h4>
      
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Minimum Yield (%)</label>
            <input
              type="number"
              :value="rules.yield?.minimum"
              @input="updateRule('yield.minimum', $event.target.value)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              min="0"
              max="100"
              step="1"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Calculation Method</label>
            <select
              :value="rules.yield?.method"
              @change="updateRule('yield.method', $event.target.value)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="area">By Area</option>
              <option value="volume">By Volume</option>
              <option value="linear">By Linear Measure</option>
            </select>
          </div>
          <div class="flex items-center">
            <label class="flex items-center">
              <input
                type="checkbox"
                :checked="rules.yield?.contributesToOverall"
                @change="updateRule('yield.contributesToOverall', $event.target.checked)"
                class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">Contributes to Overall Yield</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronDown, Settings, TreePine, Zap, Droplets, AlertTriangle, Scissors } from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'
import Badge from '@/components/ui/badge.vue'

const props = defineProps({
  zoneId: String,
  rules: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update-rules'])

const expandedCategories = ref(['natural', 'cracks'])

// Defect categories and types
const defectCategories = ref([
  {
    id: 'natural',
    name: 'Natural Characteristics',
    icon: TreePine,
    defects: [
      { id: 'knot-sound', name: 'Sound Knot', type: 'Natural' },
      { id: 'knot-unsound', name: 'Unsound Knot', type: 'Natural' },
      { id: 'pin-knot', name: 'Pin Knot', type: 'Natural' },
      { id: 'pith', name: 'Pith', type: 'Natural' },
      { id: 'sap-wood', name: 'Sap Wood', type: 'Natural' },
      { id: 'heart-wood', name: 'Heart Wood', type: 'Natural' }
    ]
  },
  {
    id: 'cracks',
    name: 'Cracks & Splits',
    icon: Zap,
    defects: [
      { id: 'split', name: 'Split', type: 'Crack' },
      { id: 'check', name: 'Check', type: 'Crack' },
      { id: 'shake', name: 'Shake', type: 'Crack' },
      { id: 'honeycomb', name: 'Honeycomb', type: 'Crack' }
    ]
  },
  {
    id: 'surface',
    name: 'Surface Defects',
    icon: Droplets,
    defects: [
      { id: 'stain-blue', name: 'Blue Stain', type: 'Surface' },
      { id: 'stain-brown', name: 'Brown Stain', type: 'Surface' },
      { id: 'skip-marks', name: 'Skip Marks', type: 'Surface' },
      { id: 'machine-marks', name: 'Machine Marks', type: 'Surface' }
    ]
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing Defects',
    icon: Scissors,
    defects: [
      { id: 'wane', name: 'Wane', type: 'Manufacturing' },
      { id: 'torn-grain', name: 'Torn Grain', type: 'Manufacturing' },
      { id: 'chip-marks', name: 'Chip Marks', type: 'Manufacturing' }
    ]
  },
  {
    id: 'decay',
    name: 'Decay & Mold',
    icon: AlertTriangle,
    defects: [
      { id: 'decay', name: 'Decay', type: 'Biological' },
      { id: 'mold', name: 'Mold', type: 'Biological' },
      { id: 'insect-damage', name: 'Insect Damage', type: 'Biological' }
    ]
  }
])

// Methods
const toggleCategory = (categoryId) => {
  const index = expandedCategories.value.indexOf(categoryId)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(categoryId)
  }
}

const isDefectEnabled = (defectId) => {
  return props.rules.defects?.[defectId]?.enabled || false
}

const toggleDefect = (defectId) => {
  const currentRules = { ...props.rules }
  if (!currentRules.defects) currentRules.defects = {}
  if (!currentRules.defects[defectId]) currentRules.defects[defectId] = {}
  
  currentRules.defects[defectId].enabled = !currentRules.defects[defectId].enabled
  
  // Set default values when enabling
  if (currentRules.defects[defectId].enabled) {
    currentRules.defects[defectId] = {
      enabled: true,
      measurement: 'diameter',
      aggregation: 'maximum',
      limit: 25,
      limitType: 'fixed',
      classification: 'sound',
      clusterDistance: 25
    }
  }
  
  emit('update-rules', currentRules)
}

const getDefectRule = (defectId, property) => {
  return props.rules.defects?.[defectId]?.[property] || ''
}

const updateDefectRule = (defectId, property, value) => {
  const currentRules = { ...props.rules }
  if (!currentRules.defects) currentRules.defects = {}
  if (!currentRules.defects[defectId]) currentRules.defects[defectId] = {}
  
  currentRules.defects[defectId][property] = value
  emit('update-rules', currentRules)
}

const updateRule = (path, value) => {
  const currentRules = { ...props.rules }
  const keys = path.split('.')
  let current = currentRules
  
  // Navigate to the parent object
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {}
    current = current[keys[i]]
  }
  
  // Set the value
  current[keys[keys.length - 1]] = value
  
  emit('update-rules', currentRules)
}

const toggleReductionType = (type) => {
  const currentRules = { ...props.rules }
  if (!currentRules.reduction) currentRules.reduction = {}
  if (!currentRules.reduction.types) currentRules.reduction.types = []
  
  const index = currentRules.reduction.types.indexOf(type)
  if (index > -1) {
    currentRules.reduction.types.splice(index, 1)
  } else {
    currentRules.reduction.types.push(type)
  }
  
  emit('update-rules', currentRules)
}

const configureDefect = (defectId) => {
  // Implementation for advanced defect configuration
  console.log('Configure defect:', defectId)
}
</script>