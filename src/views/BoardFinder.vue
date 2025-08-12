<template>
  <div class="w-full px-4 sm:px-6 lg:px-8 py-6">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-extrabold text-gray-900 mb-2">Board Finder</h1>
      <p class="text-gray-600 mt-1">Find and analyze boards as they move through the scanning line</p>
    </div>

    <!-- Search Bar -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4 flex-1">
          <div class="relative flex-1 max-w-md">
            <Search class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search boards by ID, batch, or grade..."
              v-model="searchQuery"
              @input="debouncedSearch"
              class="pl-10 pr-3 py-2 w-full border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
            />
          </div>
          <Button variant="outline" @click="toggleFilters" :class="hasActiveFilters ? 'border-emerald-500 text-emerald-700' : ''">
            <Filter class="w-4 h-4 mr-2" />
            Filters
            <span v-if="hasActiveFilters" class="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs">
              Active
            </span>
          </Button>
          <Button @click="loadBoards" variant="outline">
            <RefreshCw :class="isLoading ? 'animate-spin' : ''" class="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-600">Show</span>
          <select v-model="pageSize" @change="loadBoards" class="border border-input rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-ring focus:border-ring">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Filters Panel -->
    <div v-if="showFilters" class="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Filter Boards</h3>
        <div class="flex items-center space-x-2">
          <Button variant="outline" size="sm" @click="clearAllFilters" v-if="hasActiveFilters">
            <X class="w-4 h-4 mr-1" />
            Clear All
          </Button>
          <Button variant="ghost" size="sm" @click="showFilters = false">
            <X class="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Batch Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Batch</label>
          <select v-model="filters.batchId" @change="loadBoards" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
            <option value="">All Batches</option>
            <option v-for="batch in availableBatches" :key="batch.id" :value="batch.id">
              {{ batch.name }} ({{ batch.status }})
            </option>
          </select>
        </div>

        <!-- Grade Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Grade</label>
          <select v-model="filters.gradeId" @change="loadBoards" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
            <option value="">All Grades</option>
            <option v-for="grade in availableGrades" :key="grade.id" :value="grade.id">
              {{ grade.name }}
            </option>
          </select>
        </div>

        <!-- Bundle Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Bundle</label>
          <select v-model="filters.bundleId" @change="loadBoards" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
            <option value="">All Bundles</option>
            <option v-for="bundle in availableBundles" :key="bundle.id" :value="bundle.id">
              Bundle {{ bundle.id }} ({{ bundle.boardCount }} boards)
            </option>
          </select>
        </div>

        <!-- Shot ID Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Shot ID</label>
          <input
            v-model="filters.shotId"
            type="number"
            placeholder="Enter shot ID"
            @input="debouncedSearch"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <!-- Length Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Length Range</label>
          <div class="flex space-x-2">
            <input
              v-model="filters.lengthMin"
              type="number"
              placeholder="Min"
              @input="debouncedSearch"
              class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <input
              v-model="filters.lengthMax"
              type="number"
              placeholder="Max"
              @input="debouncedSearch"
              class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <!-- Width Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Width Range</label>
          <div class="flex space-x-2">
            <input
              v-model="filters.widthMin"
              type="number"
              placeholder="Min"
              @input="debouncedSearch"
              class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <input
              v-model="filters.widthMax"
              type="number"
              placeholder="Max"
              @input="debouncedSearch"
              class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      <!-- Filter Summary -->
      <div v-if="hasActiveFilters" class="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
        <div class="text-sm text-emerald-700">
          <strong>{{ boards.length }}</strong> board(s) match your current filters
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <LoadingSpinner class="w-8 h-8 text-emerald-600" />
      <span class="ml-3 text-gray-600">Loading boards...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <AlertTriangle class="w-5 h-5 text-red-600 mr-2" />
        <span class="text-red-800">{{ error }}</span>
      </div>
    </div>

    <!-- Results Section -->
    <div v-else-if="boards.length > 0">
      <div class="flex items-center justify-between mb-4">
        <div class="text-sm text-gray-600">
          Showing {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, totalBoards) }} of {{ totalBoards }} boards
        </div>
        <div class="flex items-center space-x-2">
          <button 
            @click="previousPage" 
            :disabled="currentPage === 1"
            class="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span class="text-sm text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
          <button 
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Main Content Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Left Sidebar - Board List -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow">
            <div class="space-y-1 p-2">
              <div v-for="board in boards" :key="board.id"
                   :class="[
                     'p-3 rounded-lg cursor-pointer border-2 transition-all',
                     selectedBoard?.id === board.id
                       ? 'border-emerald-500 bg-emerald-50'
                       : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
                   ]"
                   @click="selectBoard(board)"
              >
                <div class="flex items-center justify-between">
                  <router-link 
                    :to="`/board-inspector/${board.id}`"
                    class="font-semibold text-emerald-600 hover:text-emerald-800 hover:underline"
                  >
                    Board #{{ board.id }}
                  </router-link>
                  <div class="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {{ getGradeName(board.gradeId) }}
                  </div>
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  <span v-if="board.batchId">Batch {{ board.batchId }}</span>
                  <span v-if="board.bundleId" class="ml-2">Bundle {{ board.bundleId }}</span>
                </div>
                <div class="text-xs text-gray-400 mt-1">
                  {{ formatDimensions(board) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="lg:col-span-3">
          <div v-if="selectedBoard" class="bg-white rounded-lg border-2 border-emerald-500 p-8">
            <!-- Board Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-4">
                <h2 class="text-2xl font-bold text-gray-900">
                  Board 
                  <router-link 
                    :to="`/board-inspector/${selectedBoard.id}`"
                    class="text-emerald-600 hover:text-emerald-800 hover:underline ml-2"
                  >
                    #{{ selectedBoard.id }}
                  </router-link>
                </h2>
                <span class="px-3 py-1 bg-gray-800 text-white text-sm font-medium rounded">
                  {{ getGradeName(selectedBoard.gradeId) }}
                </span>
                <span v-if="selectedBoard.customGradeId" class="px-3 py-1 bg-emerald-600 text-white text-sm font-medium rounded">
                  Custom: {{ selectedBoard.customGradeId }}
                </span>
              </div>
            </div>

            <!-- Divider -->
            <div class="border-b border-gray-200 mb-8"></div>

            <!-- Board Specifications -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div class="text-center">
                <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div class="flex items-center justify-center mb-2">
                    <Ruler class="w-5 h-5 text-amber-600 mr-1" />
                    <span class="text-sm font-medium text-gray-700">Length</span>
                  </div>
                  <div class="text-lg font-bold text-gray-900">{{ formatLength(selectedBoard.length) }}</div>
                </div>
              </div>
              <div class="text-center">
                <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div class="flex items-center justify-center mb-2">
                    <ArrowLeftRight class="w-5 h-5 text-blue-600 mr-1" />
                    <span class="text-sm font-medium text-gray-700">Width</span>
                  </div>
                  <div class="text-lg font-bold text-gray-900">{{ formatLength(selectedBoard.width) }}</div>
                </div>
              </div>
              <div class="text-center">
                <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div class="flex items-center justify-center mb-2">
                    <Layers class="w-5 h-5 text-purple-600 mr-1" />
                    <span class="text-sm font-medium text-gray-700">Thickness</span>
                  </div>
                  <div class="text-lg font-bold text-gray-900">{{ formatLength(selectedBoard.thickness) }}</div>
                </div>
              </div>
              <div class="text-center">
                <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div class="flex items-center justify-center mb-2">
                    <Box class="w-5 h-5 text-green-600 mr-1" />
                    <span class="text-sm font-medium text-gray-700">Surface</span>
                  </div>
                  <div class="text-lg font-bold text-gray-900">{{ formatSurface(selectedBoard.surface) }}</div>
                </div>
              </div>
            </div>

            <!-- Board Metadata -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-xs text-gray-500 mb-1">Shot ID</div>
                <div class="font-semibold text-gray-900">{{ selectedBoard.shotId || 'N/A' }}</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-xs text-gray-500 mb-1">Batch</div>
                <div class="font-semibold text-gray-900">{{ selectedBoard.batchId || 'N/A' }}</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-xs text-gray-500 mb-1">Bundle</div>
                <div class="font-semibold text-gray-900">{{ selectedBoard.bundleId || 'N/A' }}</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-xs text-gray-500 mb-1">Created</div>
                <div class="font-semibold text-gray-900">{{ formatDate(selectedBoard.createDate) }}</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-xs text-gray-500 mb-1">Defects</div>
                <div class="font-semibold text-gray-900">{{ selectedBoard.defects?.length || 0 }}</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-xs text-gray-500 mb-1">Faces</div>
                <div class="font-semibold text-gray-900">{{ selectedBoard.faces?.length || 0 }}</div>
              </div>
            </div>

            <!-- Board Images (if available) -->
            <div v-if="boardImages && boardImages.length > 0" class="space-y-4 mb-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-2">Board Images</h4>
              <div v-for="(image, index) in boardImages" :key="index">
                <h5 class="text-md font-medium text-gray-700 mb-2">{{ image.faceName }}</h5>
                <div class="border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    :src="image.url" 
                    :alt="`Board ${selectedBoard.id} - ${image.faceName}`"
                    class="w-full h-auto"
                    @error="handleImageError"
                  />
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-3 mb-8">
              <Button @click="loadBoardImages" variant="outline" v-if="!boardImages">
                <ImageIcon class="w-4 h-4 mr-2" />
                Load Images
              </Button>
              <Button @click="downloadBoardData" variant="outline">
                <Download class="w-4 h-4 mr-2" />
                Download Data
              </Button>
              <Button class="bg-emerald-600 hover:bg-emerald-700 text-white">
                <router-link :to="`/board-inspector/${selectedBoard.id}`" class="flex items-center">
                  <Eye class="w-4 h-4 mr-2" />
                  Full Inspection
                </router-link>
              </Button>
            </div>
          </div>

          <!-- Empty state when no board selected -->
          <div v-else class="bg-white rounded-lg border-2 border-gray-200 p-12 text-center">
            <Package class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Select a Board</h3>
            <p class="text-gray-600">Choose a board from the list to view its details</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!isLoading" class="bg-white rounded-lg shadow p-12 text-center">
      <Package class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-gray-900 mb-2">No Boards Found</h3>
      <p class="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
      <Button @click="clearAllFilters" variant="outline">
        Clear Filters
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Search, Filter, RefreshCw, X, Ruler, ArrowLeftRight, Box, AlertTriangle,
  Layers, Download, Eye, Package, ImageIcon
} from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'
import LoadingSpinner from '@/components/ui/loading-spinner.vue'
import { useApi } from '@/composables/useApi'

const router = useRouter()

// State
const searchQuery = ref('')
const selectedBoard = ref(null)
const showFilters = ref(false)
const isLoading = ref(false)
const error = ref(null)
const boards = ref([])
const boardImages = ref(null)

// Pagination
const currentPage = ref(1)
const pageSize = ref(25)
const totalBoards = ref(0)
const totalPages = computed(() => Math.ceil(totalBoards.value / pageSize.value))

// Available filter options (will be loaded from API)
const availableBatches = ref([])
const availableGrades = ref([])
const availableBundles = ref([])

// Filters
const filters = ref({
  batchId: '',
  gradeId: '',
  bundleId: '',
  shotId: '',
  lengthMin: '',
  lengthMax: '',
  widthMin: '',
  widthMax: ''
})

// API composables
const { execute: fetchBoards } = useApi('/api/v3/boards')
const { execute: fetchBatches } = useApi('/api/v3/batches')
const { execute: fetchGrades } = useApi('/api/v3/grades')
const { execute: fetchBundles } = useApi('/api/v3/bundles')

// Load boards from API
const loadBoards = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // TEMPORARY FIX: Backend /boards endpoint doesn't handle pagination params
    // Only send filter params without pagination until backend is fixed
    const params = {}
    
    // Add filters (these still work)
    if (filters.value.batchId) params.batchId = filters.value.batchId
    if (filters.value.gradeId) params.gradeId = filters.value.gradeId
    if (filters.value.bundleId) params.bundleId = filters.value.bundleId
    if (filters.value.shotId) params.shotId = filters.value.shotId
    if (searchQuery.value) params.search = searchQuery.value
    
    const response = await fetchBoards(params)
    
    if (response && response.data) {
      // Handle the response structure from the API
      if (response.data.boards) {
        boards.value = response.data.boards
        totalBoards.value = response.data.pagination?.total || response.data.boards.length
      } else if (Array.isArray(response.data)) {
        // TEMPORARY: Since we're not using pagination, implement client-side pagination
        const allBoards = response.data
        totalBoards.value = allBoards.length
        
        // Client-side pagination
        const startIndex = (currentPage.value - 1) * pageSize.value
        const endIndex = startIndex + pageSize.value
        boards.value = allBoards.slice(startIndex, endIndex)
      } else {
        boards.value = []
        totalBoards.value = 0
      }
      
      // Auto-select first board if none selected
      if (boards.value.length > 0 && !selectedBoard.value) {
        selectBoard(boards.value[0])
      }
    } else {
      // Handle null response (error case)
      boards.value = []
      totalBoards.value = 0
    }
  } catch (err) {
    console.error('Error loading boards:', err)
    error.value = 'Failed to load boards. Please try again.'
    boards.value = []
  } finally {
    isLoading.value = false
  }
}

// Load filter options
const loadFilterOptions = async () => {
  try {
    // Load batches - TEMPORARY: Use no params to avoid pagination issues
    const batchResponse = await fetchBatches({})
    if (batchResponse && batchResponse.data) {
      availableBatches.value = Array.isArray(batchResponse.data) ? batchResponse.data : []
    }
    
    // Load grades
    const gradeResponse = await fetchGrades({})
    if (gradeResponse && gradeResponse.data) {
      availableGrades.value = Array.isArray(gradeResponse.data) ? gradeResponse.data : []
    }
    
    // Load bundles - TEMPORARY: Use no params to avoid pagination issues
    // Note: bundles endpoint may not exist (404 errors in logs)
    const bundleResponse = await fetchBundles({})
    if (bundleResponse && bundleResponse.data) {
      if (bundleResponse.data.bundles) {
        availableBundles.value = bundleResponse.data.bundles
      } else if (Array.isArray(bundleResponse.data)) {
        availableBundles.value = bundleResponse.data
      }
    }
  } catch (err) {
    console.error('Error loading filter options:', err)
  }
}

// Load board images
const loadBoardImages = async () => {
  if (!selectedBoard.value) return
  
  try {
    // This would call the image endpoint - adjust based on your API
    boardImages.value = [
      {
        faceName: 'Face 1',
        url: `/api/legacy/ui/images/render/board/${selectedBoard.value.id}/face1/original`
      },
      {
        faceName: 'Face 2', 
        url: `/api/legacy/ui/images/render/board/${selectedBoard.value.id}/face2/original`
      }
    ]
  } catch (err) {
    console.error('Error loading board images:', err)
  }
}

// Utility functions
const selectBoard = (board) => {
  selectedBoard.value = board
  boardImages.value = null // Reset images when selecting new board
}

const formatLength = (value) => {
  if (!value) return 'N/A'
  // Convert mm to inches and format
  const inches = value / 25.4
  const feet = Math.floor(inches / 12)
  const remainingInches = (inches % 12).toFixed(2)
  return feet > 0 ? `${feet}' ${remainingInches}"` : `${remainingInches}"`
}

const formatSurface = (value) => {
  if (!value) return 'N/A'
  return `${value.toFixed(2)} sq ft`
}

const formatDimensions = (board) => {
  const length = formatLength(board.length)
  const width = formatLength(board.width)
  return `${length} × ${width}`
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString()
}

const getGradeName = (gradeId) => {
  const grade = availableGrades.value.find(g => g.id === gradeId)
  return grade?.name || `Grade ${gradeId}`
}

const handleImageError = (event) => {
  event.target.src = '/boardpic.png' // Fallback image
}

const downloadBoardData = () => {
  if (!selectedBoard.value) return
  
  const dataStr = JSON.stringify(selectedBoard.value, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
  
  const exportFileDefaultName = `board-${selectedBoard.value.id}.json`
  
  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}

// Pagination
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadBoards()
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadBoards()
  }
}

// Filter management
const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const clearAllFilters = () => {
  filters.value = {
    batchId: '',
    gradeId: '',
    bundleId: '',
    shotId: '',
    lengthMin: '',
    lengthMax: '',
    widthMin: '',
    widthMax: ''
  }
  searchQuery.value = ''
  currentPage.value = 1
  loadBoards()
}

const hasActiveFilters = computed(() => {
  return searchQuery.value ||
    filters.value.batchId ||
    filters.value.gradeId ||
    filters.value.bundleId ||
    filters.value.shotId ||
    filters.value.lengthMin ||
    filters.value.lengthMax ||
    filters.value.widthMin ||
    filters.value.widthMax
})

// Debounced search
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadBoards()
  }, 500)
}

// Initialize on mount
onMounted(() => {
  loadFilterOptions()
  loadBoards()
})

// Watch for filter changes
watch(() => filters.value, () => {
  currentPage.value = 1
}, { deep: true })
</script>