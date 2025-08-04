<template>
  <div class="grade-management"> <!-- root -->
    <div class="header-section w-full px-4 sm:px-6 lg:px-8 py-6"> <!-- header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Grade Management</h1>
          <p class="text-gray-600 mt-1">Manage lumber grading standards and templates</p>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Search Input -->
          <div class="relative">
            <Search class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search grades..."
              class="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <!-- Filter Dropdown -->
          <select class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
            <option value="">All Grade Types</option>
            <option value="hardwood">Hardwood</option>
            <option value="softwood">Softwood</option>
            <option value="custom">Custom</option>
          </select>
          
          <!-- Create New Grade Button -->
          <button @click="openCreateModal" class="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center">
            <Plus class="w-4 h-4 mr-2" />
            Create New Grade
          </button>
        </div>
      </div>
    </div> <!-- /header -->
    <div class="content-wrapper w-full px-4 sm:px-6 lg:px-8 py-6"> <!-- content -->
      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="animate-pulse">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div class="space-y-2 mb-4">
              <div class="h-3 bg-gray-200 rounded"></div>
              <div class="h-3 bg-gray-200 rounded w-5/6"></div>
              <div class="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
            <div class="flex justify-between items-center">
              <div class="h-6 bg-gray-200 rounded w-16"></div>
              <div class="flex space-x-2">
                <div class="h-8 w-8 bg-gray-200 rounded"></div>
                <div class="h-8 w-8 bg-gray-200 rounded"></div>
                <div class="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grade Cards Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="grade in gradeCards" 
          :key="grade.id"
          :class="[
            'bg-white rounded-lg border-2 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer',
            getColorClasses(grade.color).border,
            'hover:' + getColorClasses(grade.color).bg
          ]"
          @click="viewGradeDetails(grade)"
        >
          <!-- Card Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ grade.name }}</h3>
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                grade.isCustom ? 'bg-purple-100 text-purple-800' : getColorClasses(grade.color).badge,
                getColorClasses(grade.color).badge
              ]">
                {{ grade.type }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <p class="text-sm text-gray-600 mb-4">{{ grade.description }}</p>

          <!-- Key Specifications -->
          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Key Specifications:</h4>
            <ul class="space-y-1">
              <li v-for="spec in grade.keySpecs" :key="spec" class="text-xs text-gray-600 flex items-start">
                <span class="w-1 h-1 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                {{ spec }}
              </li>
            </ul>
          </div>

          <!-- Key Specifications -->
          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Key Specifications:</h4>
            <ul class="space-y-1">
              <li v-for="spec in grade.keySpecs" :key="spec" class="text-xs text-gray-600 flex items-start">
                <span class="w-1 h-1 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                {{ spec }}
              </li>
            </ul>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-4 border-t border-gray-100">
            <div class="flex items-center text-sm text-gray-500">
              <Package class="w-4 h-4 mr-1" />
              <span class="font-medium text-gray-900">{{ grade.usageCount }}</span> orders
            </div>
            <div class="flex items-center space-x-1">
              <button 
                @click.stop="viewGradeDetails(grade)"
                class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                title="View Details"
              >
                <Eye class="w-4 h-4" />
              </button>
              <button 
                @click.stop="editGrade(grade)"
                class="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" 
                title="Edit Grade"
              >
                <Edit class="w-4 h-4" />
              </button>
              <button 
                @click.stop="duplicateGrade(grade)"
                class="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors" 
                title="Duplicate"
              >
                <Copy class="w-4 h-4" />
              </button>
              <button 
                @click.stop="deleteGrade(grade)"
                class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" 
                title="Delete"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div> <!-- /content -->

    <!-- Grade Creation/Editing Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <!-- Modal backdrop with blur effect -->
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity" aria-hidden="true" @click="closeModal"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <!-- Modal header -->
          <div class="bg-white px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900" id="modal-title">
                {{ isEditMode ? 'Edit Grade' : 'Create New Grade' }}
              </h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                <X class="w-6 h-6" />
              </button>
            </div>
          </div>

          <!-- Modal content -->
          <div class="bg-white px-6 py-6">
            <form @submit.prevent="saveGrade" class="space-y-6">
              <!-- Basic Information -->
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
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter grade name"
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
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select grade type</option>
                    <option value="Hardwood">Hardwood</option>
                    <option value="Softwood">Softwood</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              <!-- Description -->
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  v-model="formData.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter grade description"
                ></textarea>
              </div>

              <!-- Specifications -->
              <div>
                <h4 class="text-lg font-medium text-gray-900 mb-4">Specifications</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="minWidth" class="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Width (inches)
                    </label>
                    <input
                      id="minWidth"
                      v-model="formData.specifications.minWidth"
                      type="number"
                      step="0.25"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="0"
                    />
                  </div>

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
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label for="maxDefects" class="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Defects
                    </label>
                    <input
                      id="maxDefects"
                      v-model="formData.specifications.maxDefects"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g., Minimal, Few, Moderate"
                    />
                  </div>
                </div>
              </div>

              <!-- Zone Drawing Canvas -->
              <div>
                <h4 class="text-lg font-medium text-gray-900 mb-4">Defect Zone Mapping</h4>
                <div class="space-y-4">
                  <!-- Canvas Tools -->
                  <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div class="flex items-center space-x-4">
                      <button
                        type="button"
                        @click="addZone"
                        class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <Plus class="w-4 h-4 mr-2" />
                        Add Zone
                      </button>
                      <button
                        type="button"
                        @click="clearZones"
                        class="inline-flex items-center px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                    <div class="text-sm text-gray-600">
                      Zones: {{ zones.length }}
                    </div>
                  </div>
                  
                  <!-- Canvas Container -->
                  <div 
                    ref="canvasContainer"
                    class="border-2 border-gray-300 rounded-lg bg-white relative overflow-hidden"
                    style="height: 400px;"
                  >
                    <canvas 
                      ref="canvas"
                      id="zoneCanvas"
                      class="absolute inset-0"
                    ></canvas>
                  </div>
                  
                  <!-- Zone List -->
                  <div v-if="zones.length > 0" class="space-y-2">
                    <h5 class="text-sm font-medium text-gray-900">Defined Zones:</h5>
                    <div class="space-y-2 max-h-32 overflow-y-auto">
                      <div 
                        v-for="(zone, index) in zones" 
                        :key="index"
                        class="flex items-center justify-between p-2 bg-gray-50 rounded border text-sm"
                      >
                        <div class="flex items-center space-x-3">
                          <div 
                            class="w-4 h-4 rounded border"
                            :style="{ backgroundColor: zone.fill }"
                          ></div>
                          <span class="font-medium">{{ zone.label }}</span>
                          <span class="text-gray-500">
                            {{ Math.round(zone.width) }}×{{ Math.round(zone.height) }}
                          </span>
                        </div>
                        <button
                          type="button"
                          @click="removeZone(index)"
                          class="text-red-600 hover:text-red-800 p-1"
                        >
                          <X class="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <!-- Modal footer -->
          <div class="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="saveGrade"
              :disabled="!isFormValid"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                isFormValid
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              ]"
            >
              {{ isEditMode ? 'Update Grade' : 'Create Grade' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div> <!-- /root -->
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Plus, Eye, Edit, Copy, Trash2, Package, X, Palette } from 'lucide-vue-next'

// Canvas and zones state
const zones = ref([])
const fabricCanvas = ref(null)
const canvas = ref(null)
const canvasContainer = ref(null)

// Loading state
const isLoading = ref(false)

// Modal state
const showModal = ref(false)
const isEditMode = ref(false)
const editingGradeId = ref(null)

// Form data
const formData = ref({
  name: '',
  type: '',
  description: '',
  specifications: {
    minWidth: '',
    minLength: '',
    clearFace: '',
    maxDefects: ''
  }
})

// Sample American Hardwood grades data
const gradeCards = ref([
  {
    id: 1,
    name: 'FAS (First and Seconds)',
    type: 'Hardwood',
    description: 'Highest grade with 83.3% clear face cuttings',
    keySpecs: [
      'Min width: 6 inches',
      'Min length: 8 feet',
      'Clear face: 83.3%',
      'Max defects: Minimal'
    ],
    usageCount: 24,
    color: 'emerald',
    isCustom: false,
    keySpecs: [
      'Min width: 6 inches',
      'Min length: 8 feet',
      'Clear face: 83.3%',
      'Max defects: Minimal'
    ]
  },
  {
    id: 2,
    name: 'Select & Better',
    type: 'Hardwood',
    description: 'High quality grade combining FAS and Select',
    keySpecs: [
      'Min width: 4 inches',
      'Min length: 6 feet',
      'Clear face: 83.3%',
      'Good for staining'
    ],
    usageCount: 18,
    color: 'blue',
    isCustom: false,
    keySpecs: [
      'Min width: 4 inches',
      'Min length: 6 feet',
      'Clear face: 83.3%',
      'Good for staining'
    ]
  },
  {
    id: 3,
    name: 'No.1 Common',
    type: 'Hardwood',
    description: 'Good grade suitable for most applications',
    keySpecs: [
      'Min width: 3 inches',
      'Min length: 4 feet',
      'Clear face: 66.7%',
      'Paint grade quality'
    ],
    usageCount: 32,
    color: 'yellow',
    isCustom: false,
    keySpecs: [
      'Min width: 3 inches',
      'Min length: 4 feet',
      'Clear face: 66.7%',
      'Paint grade quality'
    ]
  },
  {
    id: 4,
    name: 'No.2A Common',
    type: 'Hardwood',
    description: 'Economy grade with character marks',
    keySpecs: [
      'Min width: 3 inches',
      'Min length: 4 feet',
      'Clear face: 50%',
      'Rustic appearance'
    ],
    usageCount: 15,
    color: 'orange',
    isCustom: false,
    keySpecs: [
      'Min width: 3 inches',
      'Min length: 4 feet',
      'Clear face: 50%',
      'Rustic appearance'
    ]
  }
])

// Get color classes for cards
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
    }
  }
  return colorMap[color] || colorMap.emerald
}

// Form validation
const isFormValid = computed(() => {
  return formData.value.name.trim() !== '' && formData.value.type !== ''
})

// Modal methods
const openCreateModal = () => {
  isEditMode.value = false
  editingGradeId.value = null
  resetForm()
  showModal.value = true
}

const openEditModal = (grade) => {
  isEditMode.value = true
  editingGradeId.value = grade.id
  formData.value = {
    name: grade.name,
    type: grade.type,
    description: grade.description,
    specifications: {
      minWidth: grade.keySpecs[0]?.split(': ')[1]?.replace(' inches', '') || '',
      minLength: grade.keySpecs[1]?.split(': ')[1]?.replace(' feet', '') || '',
      clearFace: grade.keySpecs[2]?.split(': ')[1]?.replace('%', '') || '',
      maxDefects: grade.keySpecs[3]?.split(': ')[1] || ''
    },
    zones: grade.zones || []
  }
  zones.value = [...(grade.zones || [])]
  showModal.value = true
  
  nextTick(() => {
    initializeCanvas()
  })
}

const closeModal = () => {
  showModal.value = false
  if (fabricCanvas.value) {
    fabricCanvas.value.dispose()
    fabricCanvas.value = null
  }
  resetForm()
}

const resetForm = () => {
  formData.value = {
    name: '',
    type: '',
    description: '',
    specifications: {
      minWidth: '',
      minLength: '',
      clearFace: '',
      maxDefects: ''
    },
    zones: []
  }
  zones.value = []
  if (fabricCanvas.value) {
    fabricCanvas.value.clear()
    loadLumberBackground()
  }
}

const saveGrade = () => {
  if (!isFormValid.value) return
  
  // Save zones to form data
  formData.value.zones = zones.value
  
  if (isEditMode.value) {
    // Update existing grade
    const gradeIndex = gradeCards.value.findIndex(g => g.id === editingGradeId.value)
    if (gradeIndex !== -1) {
      gradeCards.value[gradeIndex] = {
        ...gradeCards.value[gradeIndex],
        name: formData.value.name,
        type: formData.value.type,
        description: formData.value.description,
        keySpecs: [
          `Min width: ${formData.value.specifications.minWidth} inches`,
          `Min length: ${formData.value.specifications.minLength} feet`,
          `Clear face: ${formData.value.specifications.clearFace}%`,
          `Max defects: ${formData.value.specifications.maxDefects}`
        ],
        zones: formData.value.zones
      }
    }
  } else {
    // Create new grade
    const newGrade = {
      id: Date.now(),
      name: formData.value.name,
      type: formData.value.type,
      description: formData.value.description,
      keySpecs: [
        `Min width: ${formData.value.specifications.minWidth} inches`,
        `Min length: ${formData.value.specifications.minLength} feet`,
        `Clear face: ${formData.value.specifications.clearFace}%`,
        `Max defects: ${formData.value.specifications.maxDefects}`
      ],
      usageCount: 0,
      color: 'emerald',
      isCustom: formData.value.type === 'Custom',
      zones: formData.value.zones
    }
    gradeCards.value.push(newGrade)
  }
  
  closeModal()
}

// Interactive methods
const viewGradeDetails = (grade) => {
  console.log('Viewing details for:', grade.name)
  // TODO: Navigate to grade details page or open modal
}

const editGrade = (grade) => {
  console.log('Editing grade:', grade.name)
  openEditModal(grade)
}

const duplicateGrade = (grade) => {
  console.log('Duplicating grade:', grade.name)
  // TODO: Create duplicate grade
// Canvas methods
const initializeCanvas = () => {
  if (!canvas.value || !canvasContainer.value) return
  
  // Dispose existing canvas
  if (fabricCanvas.value) {
    fabricCanvas.value.dispose()
  }
  
  // Create new canvas
  fabricCanvas.value = new fabric.Canvas(canvas.value, {
    width: canvasContainer.value.clientWidth,
    height: 400,
    backgroundColor: '#f8fafc'
  })
  
  // Load lumber background
  loadLumberBackground()
  
  // Load existing zones
  loadExistingZones()
}
}
const loadLumberBackground = () => {
  if (!fabricCanvas.value) return
  
  // Create a mock lumber board background
  const boardWidth = fabricCanvas.value.width * 0.8
  const boardHeight = fabricCanvas.value.height * 0.6
  const boardLeft = (fabricCanvas.value.width - boardWidth) / 2
  const boardTop = (fabricCanvas.value.height - boardHeight) / 2
  
  const lumberBoard = new fabric.Rect({
    left: boardLeft,
    top: boardTop,
    width: boardWidth,
    height: boardHeight,
    fill: '#d4a574',
    stroke: '#8b5a2b',
    strokeWidth: 2,
    selectable: false,
    evented: false,
    rx: 5,
    ry: 5
  })
  
  // Add wood grain pattern
  const grainLines = []
  for (let i = 0; i < 8; i++) {
    const line = new fabric.Line([
      boardLeft + 20,
      boardTop + (boardHeight / 8) * i + 20,
      boardLeft + boardWidth - 20,
      boardTop + (boardHeight / 8) * i + 20
    ], {
      stroke: '#8b5a2b',
      strokeWidth: 1,
      opacity: 0.3,
      selectable: false,
      evented: false
    })
    grainLines.push(line)
  }
  
  fabricCanvas.value.add(lumberBoard, ...grainLines)
  fabricCanvas.value.renderAll()
}

const loadExistingZones = () => {
  if (!fabricCanvas.value || zones.value.length === 0) return
  
  zones.value.forEach(zone => {
    const rect = new fabric.Rect({
      left: zone.left,
      top: zone.top,
      width: zone.width,
      height: zone.height,
      fill: zone.fill,
      stroke: zone.stroke,
      strokeWidth: 2,
      opacity: 0.7
    })
    
    const label = new fabric.Text(zone.label, {
      left: zone.left + zone.width / 2,
      top: zone.top + zone.height / 2,
      fontSize: 12,
      fill: '#000',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      selectable: false
    })
    
    fabricCanvas.value.add(rect, label)
  })
  
  fabricCanvas.value.renderAll()
}
const deleteGrade = (grade) => {
const addZone = () => {
  if (!fabricCanvas.value) return
  
  const zoneColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']
  const color = zoneColors[zones.value.length % zoneColors.length]
  
  const rect = new fabric.Rect({
    left: 100 + zones.value.length * 20,
    top: 100 + zones.value.length * 20,
    width: 80,
    height: 60,
    fill: color,
    stroke: '#000',
    strokeWidth: 2,
    opacity: 0.7
  })
  
  const label = new fabric.Text(`Zone ${zones.value.length + 1}`, {
    left: rect.left + rect.width / 2,
    top: rect.top + rect.height / 2,
    fontSize: 12,
    fill: '#000',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false
  })
  
  fabricCanvas.value.add(rect, label)
  
  // Add to zones array
  zones.value.push({
    label: `Zone ${zones.value.length + 1}`,
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    fill: color,
    stroke: '#000'
  })
  
  fabricCanvas.value.renderAll()
}
  console.log('Deleting grade:', grade.name)
const removeZone = (index) => {
  zones.value.splice(index, 1)
  
  // Rebuild canvas
  if (fabricCanvas.value) {
    fabricCanvas.value.clear()
    loadLumberBackground()
    loadExistingZones()
  }
}
  // TODO: Show confirmation dialog and delete
const clearZones = () => {
  zones.value = []
  if (fabricCanvas.value) {
    fabricCanvas.value.clear()
    loadLumberBackground()
  }
}
}
</script>