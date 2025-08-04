<template>
  <div class="min-h-screen bg-gray-50">
    <div class="w-full px-4 sm:px-6 lg:px-8 py-6">
      <!-- Page Header -->
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
            <p class="text-gray-600 mt-1">Configure lumber grading standards and specifications</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button 
            @click="saveGrade"
            :disabled="!isFormValid"
            :class="[
              'px-6 py-2 rounded-lg font-medium transition-colors',
              isFormValid
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            {{ isEditMode ? 'Update Grade' : 'Create Grade' }}
          </button>
          <button 
            @click="$router.push('/grade-management')"
            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="mb-8">
        <nav class="flex space-x-8 border-b border-gray-200">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <component :is="tab.icon" class="w-5 h-5 mr-2 inline" />
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="bg-white rounded-lg shadow">
        <!-- Basic Information Tab -->
        <div v-if="activeTab === 'basic'" class="p-8">
          <div class="max-w-2xl">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="gradeName" class="block text-sm font-medium text-gray-700 mb-2">
                    Grade Name *
                  </label>
                  <input
                    id="gradeName"
                    v-model="formData.name"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter grade name (e.g., FAS, Select, No.1 Common)"
                  />
                </div>

                <div>
                  <label for="gradeType" class="block text-sm font-medium text-gray-700 mb-2">
                    Grade Type *
                  </label>
                  <select
                    id="gradeType"
                    v-model="formData.type"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select grade type</option>
                    <option value="Hardwood">Hardwood</option>
                    <option value="Softwood">Softwood</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  v-model="formData.description"
                  rows="4"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter a detailed description of this grade..."
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Grade Color
                </label>
                <div class="flex space-x-3">
                  <button
                    v-for="color in colorOptions"
                    :key="color.value"
                    @click="formData.color = color.value"
                    :class="[
                      'w-12 h-12 rounded-lg border-2 transition-all',
                      formData.color === color.value
                        ? 'border-gray-800 ring-2 ring-gray-300'
                        : 'border-gray-300 hover:border-gray-400',
                      color.class
                    ]"
                    :title="color.name"
                  ></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Specifications Tab -->
        <div v-if="activeTab === 'specifications'" class="p-8">
          <div class="max-w-4xl">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">Grade Specifications</h2>
            
            <div class="space-y-8">
              <!-- Dimensional Requirements -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Dimensional Requirements</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label for="minWidth" class="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Width (inches)
                    </label>
                    <input
                      id="minWidth"
                      v-model="formData.specifications.minWidth"
                      type="number"
                      step="0.25"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label for="minLength" class="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Length (feet)
                    </label>
                    <input
                      id="minLength"
                      v-model="formData.specifications.minLength"
                      type="number"
                      step="0.5"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label for="thickness" class="block text-sm font-medium text-gray-700 mb-2">
                      Thickness Requirements
                    </label>
                    <input
                      id="thickness"
                      v-model="formData.specifications.thickness"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g., 4/4, 5/4, 6/4"
                    />
                  </div>
                </div>
              </div>

              <!-- Quality Requirements -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Quality Requirements</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="clearFace" class="block text-sm font-medium text-gray-700 mb-2">
                      Clear Face Percentage (%)
                    </label>
                    <input
                      id="clearFace"
                      v-model="formData.specifications.clearFace"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label for="maxDefects" class="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Defects
                    </label>
                    <select
                      id="maxDefects"
                      v-model="formData.specifications.maxDefects"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">Select defect level</option>
                      <option value="Minimal">Minimal</option>
                      <option value="Few">Few</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Many">Many</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Defect Types -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Allowed Defect Types</h3>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <label
                    v-for="defect in defectTypes"
                    :key="defect.value"
                    class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      :value="defect.value"
                      v-model="formData.specifications.allowedDefects"
                      class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span class="text-sm font-medium text-gray-900">{{ defect.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Rules Tab -->
        <div v-if="activeTab === 'rules'" class="p-8">
          <div class="max-w-4xl">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">Grading Rules</h2>
            
            <div class="space-y-8">
              <!-- Cutting Requirements -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Cutting Requirements</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="minCuttingLength" class="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Cutting Length (inches)
                    </label>
                    <input
                      id="minCuttingLength"
                      v-model="formData.rules.minCuttingLength"
                      type="number"
                      step="1"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="24"
                    />
                  </div>

                  <div>
                    <label for="minCuttingWidth" class="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Cutting Width (inches)
                    </label>
                    <input
                      id="minCuttingWidth"
                      v-model="formData.rules.minCuttingWidth"
                      type="number"
                      step="0.25"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="3"
                    />
                  </div>
                </div>
              </div>

              <!-- Yield Requirements -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Yield Requirements</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="minYield" class="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Yield Percentage (%)
                    </label>
                    <input
                      id="minYield"
                      v-model="formData.rules.minYield"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="66.7"
                    />
                  </div>

                  <div>
                    <label for="cuttingUnit" class="block text-sm font-medium text-gray-700 mb-2">
                      Cutting Unit System
                    </label>
                    <select
                      id="cuttingUnit"
                      v-model="formData.rules.cuttingUnit"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="surface-measure">Surface Measure</option>
                      <option value="unit-measure">Unit Measure</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Additional Rules -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Additional Rules</h3>
                <div class="space-y-4">
                  <label class="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      v-model="formData.rules.allowWane"
                      class="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <div>
                      <div class="text-sm font-medium text-gray-900">Allow Wane</div>
                      <div class="text-sm text-gray-600">Permit wane defects in this grade</div>
                    </div>
                  </label>

                  <label class="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      v-model="formData.rules.allowSapwood"
                      class="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <div>
                      <div class="text-sm font-medium text-gray-900">Allow Sapwood</div>
                      <div class="text-sm text-gray-600">Permit sapwood in this grade</div>
                    </div>
                  </label>

                  <label class="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      v-model="formData.rules.requireStraightGrain"
                      class="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <div>
                      <div class="text-sm font-medium text-gray-900">Require Straight Grain</div>
                      <div class="text-sm text-gray-600">Boards must have straight grain pattern</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview Tab -->
        <div v-if="activeTab === 'preview'" class="p-8">
          <div class="max-w-4xl">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">Grade Preview</h2>
            
            <!-- Grade Card Preview -->
            <div class="mb-8">
              <h3 class="text-lg font-medium text-gray-900 mb-4">How this grade will appear:</h3>
              <div class="max-w-sm">
                <div :class="[
                  'bg-white rounded-lg border-2 p-6 shadow-sm',
                  getColorClasses(formData.color).border
                ]">
                  <!-- Card Header -->
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                      <h3 class="text-lg font-semibold text-gray-900 mb-1">
                        {{ formData.name || 'Grade Name' }}
                      </h3>
                      <span :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        getColorClasses(formData.color).badge
                      ]">
                        {{ formData.type || 'Grade Type' }}
                      </span>
                    </div>
                  </div>

                  <!-- Description -->
                  <p class="text-sm text-gray-600 mb-4">
                    {{ formData.description || 'Grade description will appear here...' }}
                  </p>

                  <!-- Key Specifications -->
                  <div class="mb-4">
                    <h4 class="text-sm font-medium text-gray-900 mb-2">Key Specifications:</h4>
                    <ul class="space-y-1">
                      <li v-if="formData.specifications.minWidth" class="text-xs text-gray-600 flex items-start">
                        <span class="w-1 h-1 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                        Min width: {{ formData.specifications.minWidth }} inches
                      </li>
                      <li v-if="formData.specifications.minLength" class="text-xs text-gray-600 flex items-start">
                        <span class="w-1 h-1 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                        Min length: {{ formData.specifications.minLength }} feet
                      </li>
                      <li v-if="formData.specifications.clearFace" class="text-xs text-gray-600 flex items-start">
                        <span class="w-1 h-1 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                        Clear face: {{ formData.specifications.clearFace }}%
                      </li>
                      <li v-if="formData.specifications.maxDefects" class="text-xs text-gray-600 flex items-start">
                        <span class="w-1 h-1 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                        Max defects: {{ formData.specifications.maxDefects }}
                      </li>
                    </ul>
                  </div>

                  <!-- Footer -->
                  <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div class="flex items-center text-sm text-gray-500">
                      <Package class="w-4 h-4 mr-1" />
                      <span class="font-medium text-gray-900">0</span> orders
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Summary -->
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Grade Summary</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-2">Basic Information</h4>
                  <ul class="space-y-1 text-sm text-gray-600">
                    <li>Name: {{ formData.name || 'Not specified' }}</li>
                    <li>Type: {{ formData.type || 'Not specified' }}</li>
                    <li>Color: {{ getColorName(formData.color) }}</li>
                  </ul>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-2">Key Requirements</h4>
                  <ul class="space-y-1 text-sm text-gray-600">
                    <li>Min Width: {{ formData.specifications.minWidth || 'Not specified' }} inches</li>
                    <li>Min Length: {{ formData.specifications.minLength || 'Not specified' }} feet</li>
                    <li>Clear Face: {{ formData.specifications.clearFace || 'Not specified' }}%</li>
                    <li>Yield: {{ formData.rules.minYield || 'Not specified' }}%</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, FileText, Settings, Eye, Package, Ruler, Map } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

// Check if we're editing an existing grade
const isEditMode = computed(() => route.query.edit === 'true')

// Active tab
const activeTab = ref('basic')

// Tab configuration
const tabs = ref([
  { id: 'basic', name: 'Basic Info', icon: FileText },
  { id: 'specifications', name: 'Specifications', icon: Ruler },
  { id: 'rules', name: 'Rules', icon: Settings },
  { id: 'zones', name: 'Zones', icon: Map },
  { id: 'preview', name: 'Preview', icon: Eye }
])

// Color options
const colorOptions = ref([
  { value: 'emerald', name: 'Emerald', class: 'bg-emerald-500' },
  { value: 'blue', name: 'Blue', class: 'bg-blue-500' },
  { value: 'yellow', name: 'Yellow', class: 'bg-yellow-500' },
  { value: 'orange', name: 'Orange', class: 'bg-orange-500' },
  { value: 'red', name: 'Red', class: 'bg-red-500' },
  { value: 'purple', name: 'Purple', class: 'bg-purple-500' }
])

// Defect types
const defectTypes = ref([
  { value: 'knots', label: 'Knots' },
  { value: 'splits', label: 'Splits' },
  { value: 'wane', label: 'Wane' },
  { value: 'stain', label: 'Stain' },
  { value: 'pitch', label: 'Pitch Pockets' },
  { value: 'shake', label: 'Shake' },
  { value: 'checks', label: 'Checks' },
  { value: 'holes', label: 'Holes' }
])

// Form data
const formData = ref({
  name: '',
  type: '',
  description: '',
  color: 'emerald',
  specifications: {
    minWidth: '',
    minLength: '',
    thickness: '',
    clearFace: '',
    maxDefects: '',
    allowedDefects: []
  },
  rules: {
    minCuttingLength: '',
    minCuttingWidth: '',
    minYield: '',
    cuttingUnit: 'surface-measure',
    allowWane: false,
    allowSapwood: false,
    requireStraightGrain: false
  },
  zones: []
})

// Form validation
const isFormValid = computed(() => {
  return formData.value.name.trim() !== '' && formData.value.type !== ''
})

// Get color classes for preview
const getColorClasses = (color) => {
  const colorMap = {
    emerald: {
      border: 'border-emerald-200',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-800'
    },
    blue: {
      border: 'border-blue-200',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-800'
    },
    yellow: {
      border: 'border-yellow-200',
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      badge: 'bg-yellow-100 text-yellow-800'
    },
    orange: {
      border: 'border-orange-200',
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      badge: 'bg-orange-100 text-orange-800'
    },
    red: {
      border: 'border-red-200',
      bg: 'bg-red-50',
      text: 'text-red-700',
      badge: 'bg-red-100 text-red-800'
    },
    purple: {
      border: 'border-purple-200',
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      badge: 'bg-purple-100 text-purple-800'
    }
  }
  return colorMap[color] || colorMap.emerald
}

// Get color name
const getColorName = (color) => {
  const colorOption = colorOptions.value.find(c => c.value === color)
  return colorOption ? colorOption.name : 'Emerald'
}

// Zone management methods
const addZone = () => {
  const zoneColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
  const colorIndex = formData.value.zones.length % zoneColors.length
  
  const newZone = {
    id: Date.now(),
    name: `Zone ${formData.value.zones.length + 1}`,
    type: 'acceptable',
    color: zoneColors[colorIndex],
    allowedDefects: []
  }
  
  formData.value.zones.push(newZone)
}

const removeZone = (index) => {
  formData.value.zones.splice(index, 1)
}

const getZoneColorClass = (color) => {
  const colorMap = {
    red: 'bg-red-500 border-red-600',
    orange: 'bg-orange-500 border-orange-600',
    yellow: 'bg-yellow-500 border-yellow-600',
    green: 'bg-green-500 border-green-600',
    blue: 'bg-blue-500 border-blue-600',
    purple: 'bg-purple-500 border-purple-600'
  }
  return colorMap[color] || 'bg-gray-500 border-gray-600'
}

const applyZoneTemplate = (templateType) => {
  switch (templateType) {
    case 'standard':
      formData.value.zones = [
        {
          id: Date.now(),
          name: 'Clear Center Zone',
          type: 'restricted',
          color: 'green',
          allowedDefects: []
        },
        {
          id: Date.now() + 1,
          name: 'Edge Utility Zone',
          type: 'utility',
          color: 'yellow',
          allowedDefects: ['wane', 'checks', 'splits']
        }
      ]
      break
    case 'premium':
      formData.value.zones = [
        {
          id: Date.now(),
          name: 'Premium Clear Zone',
          type: 'restricted',
          color: 'green',
          allowedDefects: []
        },
        {
          id: Date.now() + 1,
          name: 'Minor Defect Zone',
          type: 'limited',
          color: 'blue',
          allowedDefects: ['stain']
        }
      ]
      break
    case 'utility':
      formData.value.zones = [
        {
          id: Date.now(),
          name: 'Primary Zone',
          type: 'acceptable',
          color: 'orange',
          allowedDefects: ['knots', 'stain', 'checks']
        },
        {
          id: Date.now() + 1,
          name: 'Secondary Zone',
          type: 'utility',
          color: 'red',
          allowedDefects: ['knots', 'splits', 'wane', 'stain', 'pitch', 'shake', 'checks', 'holes']
        }
      ]
      break
  }
}

// Save grade
const saveGrade = () => {
  if (!isFormValid.value) return
  
  console.log('Saving grade:', formData.value)
  
  // TODO: Save to backend or store
  
  // Navigate back to grade management
  router.push('/grade-management')
}

// Load existing grade data if editing
if (isEditMode.value && route.query.id) {
  // TODO: Load grade data from backend
  console.log('Loading grade for editing:', route.query.id)
}
</script>