<template>
  <div class="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading board data...</p>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <p class="text-red-700">{{ error }}</p>
    </div>
    
    <!-- Main Content -->
    <div v-else>
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-1">Board Inspector</h1>
        <p class="text-gray-600">Find and analyze boards in the system</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="text-right">
          <div class="text-sm text-gray-600" v-if="boardData">Order: {{ boardData.batchId || 'Unknown' }}</div>
        </div>
        <Button variant="outline" class="flex items-center">
          <List class="w-4 h-4 mr-2" />
          View All Boards in This Order
        </Button>
      </div>
    </div>

    <!-- Board Navigation Card -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-4">
          <button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <div class="text-sm text-gray-600">
              Order: <router-link to="/orders/ORD-20250701-001" class="text-emerald-600 hover:text-emerald-800 hover:underline font-medium">B-4873</router-link> - Red Oak 4/4 Premium
            </div>
          </button>
          <div class="flex items-center space-x-3">
            <h2 class="text-2xl font-bold text-gray-900">Board #{{ currentBoardId }}</h2>
            <span v-if="boardData" class="px-3 py-1 bg-emerald-600 text-white text-sm font-medium rounded-full">{{ getGradeName(boardData) }}</span>
            <button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight class="w-5 h-5" />
            </button>
          </div>
          <div class="flex items-center space-x-4 text-sm text-gray-600">
            <div class="flex items-center">
              <TreePine class="w-4 h-4 mr-1" />
              <span>{{ boardData?.species || 'Unknown' }}</span>
            </div>
            <div class="flex items-center">
              <Droplets class="w-4 h-4 mr-1" />
              <span>{{ boardData?.dryStatus || 'Unknown' }}</span>
            </div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm text-gray-600">Value</div>
          <div class="text-2xl font-bold text-gray-900" v-if="boardData">${{ (boardData.value || 0).toFixed(2) }}</div>
        </div>
      </div>

      <!-- Timestamp -->
      <div class="flex items-center text-sm text-gray-500 mb-6">
        <Clock class="w-4 h-4 mr-1" />
        {{ boardData ? formatDate(boardData.scanDate || boardData.createDate) : 'N/A' }}
      </div>

      <!-- Board Specifications -->
      <div class="grid grid-cols-6 gap-6 mb-8">
        <div class="text-center">
          <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div class="flex items-center justify-center mb-2">
              <Ruler class="w-5 h-5 text-amber-600 mr-1" />
              <span class="text-sm font-medium text-gray-700">Length</span>
            </div>
            <div class="text-lg font-bold text-gray-900">{{ boardData ? formatLength(boardData.length) : 'N/A' }}</div>
          </div>
        </div>
        <div class="text-center">
          <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div class="flex items-center justify-center mb-2">
              <ArrowLeftRight class="w-5 h-5 text-blue-600 mr-1" />
              <span class="text-sm font-medium text-gray-700">Width</span>
            </div>
            <div class="text-lg font-bold text-gray-900">{{ boardData ? formatLength(boardData.width) : 'N/A' }}</div>
          </div>
        </div>
        <div class="text-center">
          <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div class="flex items-center justify-center mb-2">
              <Layers class="w-5 h-5 text-purple-600 mr-1" />
              <span class="text-sm font-medium text-gray-700">Thickness</span>
            </div>
            <div class="text-lg font-bold text-gray-900">{{ boardData ? formatLength(boardData.thickness) : 'N/A' }}</div>
          </div>
        </div>
        <div class="text-center">
          <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div class="flex items-center justify-center mb-2">
              <Box class="w-5 h-5 text-green-600 mr-1" />
              <span class="text-sm font-medium text-gray-700">Volume</span>
            </div>
            <div class="text-lg font-bold text-gray-900">{{ boardData ? formatVolume(boardData) : 'N/A' }}</div>
          </div>
        </div>
        <div class="text-center">
          <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div class="flex items-center justify-center mb-2">
              <AlertTriangle class="w-5 h-5 text-red-600 mr-1" />
              <span class="text-sm font-medium text-gray-700">Total Defects</span>
            </div>
            <div class="text-lg font-bold text-gray-900">{{ boardData?.defects?.length || 0 }}</div>
          </div>
        </div>
        <div class="text-center">
          <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div class="flex items-center justify-center mb-2">
              <TrendingUp class="w-5 h-5 text-indigo-600 mr-1" />
              <span class="text-sm font-medium text-gray-700">Yield</span>
            </div>
            <div class="text-lg font-bold text-gray-900">85%</div>
          </div>
        </div>
      </div>

      <!-- Inspector Tools -->
      <div class="flex flex-wrap gap-3 mb-6">
        <button 
          @click="toggleMagnifier"
          :class="[
            'flex items-center px-3 py-1.5 text-sm font-medium bg-white border-2 rounded-md hover:bg-gray-50 transition-colors',
            magnifierEnabled 
              ? 'text-emerald-600 border-emerald-300' 
              : 'text-gray-600 border-gray-300'
          ]"
        >
          <ZoomIn class="w-4 h-4 mr-2" />
          {{ magnifierEnabled ? 'Disable Magnifier' : 'Enable Magnifier' }}
        </button>
        <button class="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          <EyeOff class="w-4 h-4 mr-2" />
          Hide Minor Defects
        </button>
        <button class="flex items-center px-3 py-1.5 text-sm font-medium text-emerald-600 bg-white border-2 border-emerald-300 rounded-md hover:bg-gray-50 transition-colors">
          <CheckCircle class="w-4 h-4 mr-2" />
          Agree with NG AI
        </button>
        <button class="flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-white border-2 border-red-300 rounded-md hover:bg-gray-50 transition-colors">
          <XCircle class="w-4 h-4 mr-2" />
          Disagree with NG AI
        </button>
        <button 
          @click="showRejectionRules = true"
          class="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <FileText class="w-4 h-4 mr-2" />
          See rejected rules
        </button>
        <button class="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          <BookOpen class="w-4 h-4 mr-2" />
          Add to Reference Bundle
        </button>
      </div>
    </div>

    <!-- Face 1 -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-3">Face 1</h3>
      <div class="bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div 
          class="bg-gray-100 flex items-center justify-center relative"
          @mousemove="(event) => handleMouseMove(event, 'face1')"
          @mouseenter="() => handleMouseEnter('face1')"
          @mouseleave="handleMouseLeave"
          ref="face1Container"
          style="overflow: visible;"
        >
          <img 
            :key="`face1-${imageKeys.face1}`"
            :src="boardImageUrl('face1')" 
            alt="Board Face 1" 
            class="w-full h-auto object-contain"
            ref="face1Image"
            @load="onImageLoad"
          />
          
          <!-- Magnifier Window -->
          <div
            v-if="showMagnifier && magnifierEnabled && activeMagnifierBoard === 'face1'"
            :style="magnifierStyle"
            class="fixed pointer-events-none border-2 border-white shadow-lg rounded-lg overflow-hidden z-50"
          >
            <div
              :style="magnifiedImageStyle"
              class="w-full h-full bg-no-repeat"
            ></div>
          </div>
        </div>
      </div>
      <!-- Defect Tags -->
      <div class="flex flex-wrap gap-2 mt-3">
        <button 
          v-for="defect in face1DefectTypes" 
          :key="defect.name"
          @click="toggleDefect('face1', defect.name)"
          :class="[
            'px-2 py-1 text-sm rounded-full transition-all duration-200 border flex items-center gap-1.5',
            isDefectVisible('face1', defect.name)
              ? 'bg-white border-gray-400 text-gray-800'
              : 'bg-gray-50 border-gray-200 text-gray-500 opacity-60 hover:opacity-100'
          ]"
          :title="`${defect.count} ${defect.name} defect(s) detected`"
        >
          <div 
            class="w-2 h-2 rounded-full" 
            :style="`background-color: ${defect.color}`"
          ></div>
          <span>{{ defect.name }}</span>
          <span v-if="defect.count > 0" class="text-xs text-gray-500">({{ defect.count }})</span>
        </button>
      </div>
    </div>

    <!-- Face 2 -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-3">Face 2</h3>
      <div class="bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div 
          class="bg-gray-100 flex items-center justify-center relative"
          @mousemove="(event) => handleMouseMove(event, 'face2')"
          @mouseenter="() => handleMouseEnter('face2')"
          @mouseleave="handleMouseLeave"
          ref="face2Container"
          style="overflow: visible;"
        >
          <img 
            :key="`face2-${imageKeys.face2}`"
            :src="boardImageUrl('face2')" 
            alt="Board Face 2" 
            class="w-full h-auto object-contain"
            ref="face2Image"
            @load="onImageLoad"
          />
          
          <!-- Magnifier Window -->
          <div
            v-if="showMagnifier && magnifierEnabled && activeMagnifierBoard === 'face2'"
            :style="magnifierStyle"
            class="fixed pointer-events-none border-2 border-white shadow-lg rounded-lg overflow-hidden z-50"
          >
            <div
              :style="magnifiedImageStyle"
              class="w-full h-full bg-no-repeat"
            ></div>
          </div>
        </div>
      </div>
      <!-- Defect Tags -->
      <div class="flex flex-wrap gap-2 mt-3">
        <button 
          v-for="defect in face2DefectTypes" 
          :key="defect.name"
          @click="toggleDefect('face2', defect.name)"
          :class="[
            'px-2 py-1 text-sm rounded-full transition-all duration-200 border flex items-center gap-1.5',
            isDefectVisible('face2', defect.name)
              ? 'bg-white border-gray-400 text-gray-800'
              : 'bg-gray-50 border-gray-200 text-gray-500 opacity-60 hover:opacity-100'
          ]"
          :title="`${defect.count} ${defect.name} defect(s) detected`"
        >
          <div 
            class="w-2 h-2 rounded-full" 
            :style="`background-color: ${defect.color}`"
          ></div>
          <span>{{ defect.name }}</span>
          <span v-if="defect.count > 0" class="text-xs text-gray-500">({{ defect.count }})</span>
        </button>
      </div>
    </div>

    <!-- Clear Cuttings -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Face 1 Clear Cuttings -->
      <div>
        <h4 class="text-lg font-semibold text-gray-900 mb-4">Clear Cuttings (Face 1)</h4>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-gray-700">6' 2 3/4" × 5 3/8"</span>
            <span class="font-semibold text-gray-900">33.28 units</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-700">2' × 4 13/16"</span>
            <span class="font-semibold text-gray-900">9.64 units</span>
          </div>
          <div class="border-t border-gray-200 pt-3">
            <div class="flex items-center justify-between">
              <span class="font-semibold text-gray-900">Total Units:</span>
              <span class="text-xl font-bold text-gray-900">43</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Face 2 Clear Cuttings -->
      <div>
        <h4 class="text-lg font-semibold text-gray-900 mb-4">Clear Cuttings (Face 2)</h4>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-gray-700">3' 3 3/4" × 5 3/16"</span>
            <span class="font-semibold text-gray-900">17.2 units</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-700">3' 5 3/4" × 4 7/8"</span>
            <span class="font-semibold text-gray-900">16.83 units</span>
          </div>
          <div class="border-t border-gray-200 pt-3">
            <div class="flex items-center justify-between">
              <span class="font-semibold text-gray-900">Total Units:</span>
              <span class="text-xl font-bold text-gray-900">34</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Previously Scanned Boards -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Previously Scanned Boards</h3>
            <p class="text-sm text-gray-600 mt-1">All boards from the current sorting order</p>
          </div>
          <div class="relative">
            <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              v-model="previousBoardsSearch"
              placeholder="Search boards..."
              class="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-64"
            />
          </div>
        </div>
      </div>
      
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Board ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scan Time</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Defects</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="board in filteredPreviousBoards" :key="board.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <router-link 
                  :to="`/board-inspector/${board.id}`"
                  class="text-sm font-medium text-emerald-600 hover:text-emerald-800 hover:underline"
                >
                  Board #{{ board.id }}
                </router-link>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(board.createDate || board.scanDate) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="board.gradeId" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                  {{ board.gradeId }}
                </span>
                <span v-else class="text-sm text-gray-500">-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="board.defects && board.defects.length > 0" class="flex items-center space-x-2">
                  <span class="text-xs text-gray-700">{{ board.defects.length }} defect(s)</span>
                </div>
                <div v-else class="text-sm text-gray-500">-</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button class="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100" title="Reprocess">
                    <RotateCcw class="w-4 h-4" />
                  </button>
                  <button @click="navigateToBoard(board.id)" class="text-emerald-600 hover:text-emerald-800 text-sm">View</button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredPreviousBoards.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-sm text-gray-500">
                No previously scanned boards found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div> <!-- End of main content v-else -->
  </div>
  
  <!-- Rejection Rules Modal -->
  <RejectionRulesModal 
    v-model="showRejectionRules" 
    :board="boardData"
    :grades="availableGrades"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Clock, Ruler, Layers, TreePine, Droplets,
  ZoomIn, EyeOff, CheckCircle, XCircle, FileText, BookOpen, List,
  Search, RotateCcw, ArrowLeftRight, Box, AlertTriangle, TrendingUp
} from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'
import RejectionRulesModal from '@/components/board/RejectionRulesModal.vue'
import { useApi } from '@/composables/useApi'

const route = useRoute()
const router = useRouter()

// Get board ID from route params
const currentBoardId = computed(() => route.params.id)

// Board data
const boardData = ref(null)
const isLoading = ref(false)
const error = ref(null)
const previousBoards = ref([])
const previousBoardsSearch = ref('')
const showRejectionRules = ref(false)
const availableGrades = ref([])

// API composables
const { execute: fetchBoardDetails } = useApi(`/api/v3/boards`)
const { execute: fetchAllBoards } = useApi('/api/v3/boards')
const { execute: fetchGrades } = useApi('/api/v3/grades')

// Magnifier state
const magnifierEnabled = ref(false)
const showMagnifier = ref(false)
const mousePosition = ref({ x: 0, y: 0 })
const activeMagnifierBoard = ref(null) // Track which board has active magnifier
const magnifierSize = 250  // Increased size for better visibility
const magnificationLevel = 1.2  // Fixed zoom level at 1.2x (20% magnification)
const useImageSmoothing = ref(true)  // Toggle for image smoothing

// Template refs
const face1Container = ref(null)
const face2Container = ref(null)
const face1Image = ref(null)
const face2Image = ref(null)

// Defect types will be populated from board data
const face1DefectTypes = computed(() => {
  if (!boardData.value?.face1?.defects) return []
  
  return boardData.value.face1.defects.map(defect => ({
    name: defect.name,
    color: defect.color,
    count: defect.defects?.length || 0,
    activeClass: 'bg-emerald-500 text-white',
    activeBorder: 'border-emerald-600',
    inactiveClass: 'bg-gray-100 text-gray-700',
    inactiveBorder: 'border-gray-300'
  }))
})

const face2DefectTypes = computed(() => {
  if (!boardData.value?.face2?.defects) return []
  
  return boardData.value.face2.defects.map(defect => ({
    name: defect.name,
    color: defect.color,
    count: defect.defects?.length || 0,
    activeClass: 'bg-emerald-500 text-white',
    activeBorder: 'border-emerald-600',
    inactiveClass: 'bg-gray-100 text-gray-700',
    inactiveBorder: 'border-gray-300'
  }))
})

// Toggle magnifier
const toggleMagnifier = () => {
  magnifierEnabled.value = !magnifierEnabled.value
  if (!magnifierEnabled.value) {
    showMagnifier.value = false
  }
}

// Handle mouse movement
const handleMouseMove = (event, boardId) => {
  if (!magnifierEnabled.value) return
  
  // Only set active board if we're hovering over this specific board
  activeMagnifierBoard.value = boardId
  
  const rect = event.currentTarget.getBoundingClientRect()
  mousePosition.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
}

// Handle mouse enter for magnifier
const handleMouseEnter = (boardId) => {
  if (!magnifierEnabled.value) return
  // Only show magnifier on the board being hovered
  showMagnifier.value = true
  activeMagnifierBoard.value = boardId
}

// Handle mouse leave for magnifier
const handleMouseLeave = () => {
  // Hide magnifier when leaving any board
  showMagnifier.value = false
  activeMagnifierBoard.value = null
}

// Image load handler
const onImageLoad = () => {
  // Image loaded, magnifier ready
}

// Defect visibility state - start with all defects visible
const visibleDefects = ref({
  face1: new Set(),
  face2: new Set()
})

// Image keys to force reload when defects toggle
const imageKeys = ref({
  face1: 0,
  face2: 0
})

// Toggle defect visibility
function toggleDefect(face, defectName) {
  if (visibleDefects.value[face].has(defectName)) {
    visibleDefects.value[face].delete(defectName)
  } else {
    visibleDefects.value[face].add(defectName)
  }
  
  // Force image reload by changing the key
  imageKeys.value[face]++
}

// Check if defect is visible
function isDefectVisible(face, defectName) {
  return visibleDefects.value[face].has(defectName)
}

// Computed styles for magnifier
const magnifierStyle = computed(() => {
  const { x, y } = mousePosition.value
  
  // Get the active container to calculate screen position
  const activeContainer = activeMagnifierBoard.value === 'face1' ? face1Container.value : face2Container.value
  if (!activeContainer) return {}
  
  const containerRect = activeContainer.getBoundingClientRect()
  
  // Calculate screen position
  const screenX = containerRect.left + x
  const screenY = containerRect.top + y
  
  // Position magnifier above the cursor, centered horizontally
  let left = screenX - (magnifierSize / 2)
  let top = screenY - magnifierSize - 20
  
  // Allow magnifier to overflow the board boundaries
  // No boundary constraints - let it extend beyond the image container
  
  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${magnifierSize}px`,
    height: `${magnifierSize}px`,
    backgroundColor: '#ffffff'
  }
})

// Computed styles for magnified image
const magnifiedImageStyle = computed(() => {
  const { x, y } = mousePosition.value
  
  // Get the active container and image to calculate proper scaling
  const activeContainer = activeMagnifierBoard.value === 'face1' ? face1Container.value : face2Container.value
  const activeImage = activeMagnifierBoard.value === 'face1' ? face1Image.value : face2Image.value
  
  if (!activeContainer || !activeImage) return {}
  
  // Get the actual image dimensions and container dimensions
  const containerRect = activeContainer.getBoundingClientRect()
  const imageRect = activeImage.getBoundingClientRect()
  
  // Calculate the scale factor between the container and the actual image
  const scaleX = activeImage.naturalWidth / imageRect.width
  const scaleY = activeImage.naturalHeight / imageRect.height
  
  // Convert cursor position to image coordinates
  const imageX = x * scaleX
  const imageY = y * scaleY
  
  // Calculate background position to center the cursor area in the magnifier
  // We want to show the area around the cursor, centered in the magnifier window
  const backgroundX = -(imageX * magnificationLevel) + (magnifierSize / 2)
  const backgroundY = -(imageY * magnificationLevel) + (magnifierSize / 2)
  
  // Calculate the background size based on the original image dimensions
  const backgroundWidth = activeImage.naturalWidth * magnificationLevel
  const backgroundHeight = activeImage.naturalHeight * magnificationLevel
  
  // Choose rendering mode based on smoothing preference
  const renderingMode = useImageSmoothing.value 
    ? 'auto'  // Smooth scaling
    : 'pixelated'  // Crisp pixels
  
  return {
    // Use high-res images for the magnifier
    backgroundImage: activeMagnifierBoard.value === 'face1' 
      ? `url(${boardImageUrl('face1', true)})` 
      : `url(${boardImageUrl('face2', true)})`,
    backgroundSize: `${backgroundWidth}px ${backgroundHeight}px`,
    backgroundPosition: `${backgroundX}px ${backgroundY}px`,
    // Add image rendering optimizations
    imageRendering: renderingMode,
    '-webkit-image-rendering': renderingMode === 'auto' ? 'auto' : '-webkit-optimize-contrast',
    '-moz-image-rendering': renderingMode === 'auto' ? 'auto' : '-moz-crisp-edges',
    'transform': 'translateZ(0) scale(1.001)',  // Hardware acceleration with micro-scale to force smoothing
    'backface-visibility': 'hidden',  // Reduce flickering
    'filter': useImageSmoothing.value ? 'contrast(1.02) brightness(1.01)' : 'none'  // Subtle enhancement
  }
})

// Load board data from API
const loadBoardData = async () => {
  if (!currentBoardId.value) {
    error.value = 'No board ID provided'
    return
  }
  
  isLoading.value = true
  error.value = null
  
  try {
    // Fetch all boards and find the one with matching ID
    const response = await fetchBoardDetails()
    
    if (response && response.data) {
      const boards = Array.isArray(response.data) ? response.data : response.data.boards || []
      
      // Find board with matching ID
      boardData.value = boards.find(b => {
        const boardId = b.id?.toString()
        const targetId = currentBoardId.value?.toString()
        return boardId === targetId
      })
      
      if (boardData.value) {
        // Initialize all defects as visible
        if (boardData.value.face1?.defects) {
          visibleDefects.value.face1 = new Set(boardData.value.face1.defects.map(d => d.name))
        }
        if (boardData.value.face2?.defects) {
          visibleDefects.value.face2 = new Set(boardData.value.face2.defects.map(d => d.name))
        }
        
        // Preload high-res images for better magnifier quality
        preloadHighResImages()
      } else {
        error.value = `Board ${currentBoardId.value} not found`
      }
    } else {
      error.value = 'Failed to load board data'
    }
  } catch (err) {
    console.error('Error loading board:', err)
    error.value = 'Failed to load board data'
  } finally {
    isLoading.value = false
  }
}

// Format length to metric (cm)
const formatLength = (value) => {
  if (!value) return 'N/A'
  if (typeof value === 'object' && value.value) {
    const rawValue = parseFloat(value.value)
    const unit = value.unit || 'cm'
    if (unit === 'cm') {
      return `${rawValue.toFixed(1)} cm`
    } else if (unit === 'mm') {
      const cm = rawValue / 10
      return `${cm.toFixed(1)} cm`
    }
    return `${rawValue.toFixed(1)} ${unit}`
  }
  const cm = value / 10
  return `${cm.toFixed(1)} cm`
}

// Format volume
const formatVolume = (board) => {
  if (!board) return 'N/A'
  const volume = board.volumeGraded || (board.length * board.width * board.thickness) / 1000000000
  return `${volume.toFixed(4)} m³`
}

// Check if any defects should be shown
const shouldShowDefects = (face) => {
  return visibleDefects.value[face].size > 0
}

// Track failed image URLs to avoid retrying
const failedImages = ref(new Set())

// Get board image URL (with or without defect overlays)
const boardImageUrl = (face, highRes = false) => {
  if (!boardData.value || !boardData.value.id) return '/boardpic.png'
  
  // Use the same approach as BoardFinder - render endpoint
  const proxyPath = '/api/legacy'
  const faceNum = face === 'face1' ? '1' : '2'
  
  // Use the render endpoint which works in BoardFinder
  return `${proxyPath}/ui/images/render/board/${boardData.value.id}/face${faceNum}/original`
}

// Preload high-resolution images for magnifier
const preloadHighResImages = () => {
  if (!boardData.value || !boardData.value.id) return
  
  // Preload images silently
  const img1 = new Image()
  img1.src = boardImageUrl('face1', true)
  
  const img2 = new Image()
  img2.src = boardImageUrl('face2', true)
}

// Get grade name
const getGradeName = (board) => {
  if (!board) return 'Unknown'
  // You might need to fetch grade names from API
  return board.gradeName || board.gradeId || 'Unknown'
}

// Format date
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleString()
}

// Load grades from API
const loadGrades = async () => {
  try {
    const response = await fetchGrades()
    if (response && response.data) {
      availableGrades.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (err) {
    console.error('Error loading grades:', err)
  }
}

// Load previously scanned boards
const loadPreviousBoards = async () => {
  try {
    const response = await fetchAllBoards()
    if (response && response.data) {
      const boards = Array.isArray(response.data) ? response.data : response.data.boards || []
      // Sort by scan date and take most recent 10
      previousBoards.value = boards
        .sort((a, b) => new Date(b.createDate || b.scanDate) - new Date(a.createDate || a.scanDate))
        .slice(0, 10)
    }
  } catch (err) {
    console.error('Error loading previous boards:', err)
  }
}

// Filtered previous boards based on search
const filteredPreviousBoards = computed(() => {
  if (!previousBoardsSearch.value) return previousBoards.value
  
  const query = previousBoardsSearch.value.toLowerCase()
  return previousBoards.value.filter(board => 
    board.id?.toString().toLowerCase().includes(query)
  )
})

// Navigate to board
const navigateToBoard = (boardId) => {
  router.push(`/board-inspector/${boardId}`)
}

// Watch for route changes to reload board data
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadBoardData()
  }
})

// Initialize on mount
onMounted(() => {
  // Wrap async operations to avoid lifecycle warnings
  loadBoardData()
  loadPreviousBoards()
  loadGrades()
})
</script>