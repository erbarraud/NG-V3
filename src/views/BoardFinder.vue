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
              placeholder="Search by board ID, order, grade..."
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
          <DateRangePicker 
            v-model="dateRange"
            v-model:custom-start-date="customStartDate"
            v-model:custom-end-date="customEndDate"
            @change="onDateRangeChange"
          />
        </div>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="flex gap-6">
      <!-- Board List Sidebar -->
      <div class="w-1/3 max-w-md">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-gray-700">
                {{ filteredBoards.length }} boards
              </h3>
              <span class="text-xs text-gray-500">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
            </div>
          </div>
          
          <div class="overflow-y-auto max-h-[calc(100vh-300px)]">
            <div v-if="isLoading" class="p-4 text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
              <p class="text-gray-600 mt-2">Loading boards...</p>
            </div>
            
            <div v-else-if="paginatedBoards.length === 0" class="p-4 text-center text-gray-500">
              No boards found
            </div>
            
            <div v-else>
              <div
                v-for="board in paginatedBoards"
                :key="board.id"
                @click="selectBoard(board)"
                :class="[
                  'px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors',
                  selectedBoard?.id === board.id ? 'bg-emerald-50 border-emerald-300' : 'hover:bg-gray-50'
                ]"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <span class="font-semibold text-gray-900">Board #{{ board.id }}</span>
                      <span class="text-xs text-gray-500">Order {{ board.batch?.id || 'N/A' }}</span>
                    </div>
                    <div class="flex items-center gap-3 mt-1">
                      <span class="text-xs text-gray-600">{{ getSpeciesName(board) }}</span>
                      <span class="text-xs text-gray-600">{{ formatDimensions(board) }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="inline-block px-2 py-1 text-xs font-medium rounded-full"
                          :class="getGradeColorClass(board)">
                      {{ getGradeName(board) }}
                    </span>
                    <div v-if="calculateBoardValue(board)" class="text-sm font-semibold text-green-600 mt-1">
                      {{ calculateBoardValue(board) }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ formatDate(board.createDate) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Pagination -->
          <div class="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <Button 
                size="sm" 
                variant="outline" 
                @click="previousPage" 
                :disabled="currentPage <= 1"
              >
                Previous
              </Button>
              <span class="text-sm text-gray-600">
                {{ startIndex + 1 }}-{{ endIndex }} of {{ filteredBoards.length }}
              </span>
              <Button 
                size="sm" 
                variant="outline" 
                @click="nextPage" 
                :disabled="currentPage >= totalPages"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Board Detail View -->
      <div class="flex-1">
        <div v-if="!selectedBoard" class="bg-white rounded-lg shadow-lg p-12 text-center">
          <Package class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No Board Selected</h3>
          <p class="text-gray-500">Select a board from the list to view details</p>
        </div>
        
        <!-- Use the shared BoardViewer component -->
        <BoardViewer
          v-else
          ref="boardViewerRef"
          :board="selectedBoard"
          :available-grades="availableGrades"
          :show-kpis="true"
          @usable-area-toggled="handleUsableAreaToggle"
        >
          <!-- Additional action buttons for BoardFinder -->
          <template #actions>
            <button class="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <ThumbsUp class="w-4 h-4 mr-2" />
              Agree with NG AI
            </button>
            <button @click="() => { if (boardViewerRef) boardViewerRef.showFeedbackModal = true }" class="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <ThumbsDown class="w-4 h-4 mr-2" />
              Disagree with NG AI
            </button>
            <button class="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <BookOpen class="w-4 h-4 mr-2" />
              Add to Reference Bundle
            </button>
            <button 
              @click="goToInspector"
              class="flex items-center px-3 py-1.5 text-sm font-medium text-emerald-600 bg-white border-2 border-emerald-300 rounded-md hover:bg-emerald-50 transition-colors">
              <ExternalLink class="w-4 h-4 mr-2" />
              Open in Inspector
            </button>
          </template>
        </BoardViewer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BoardViewer from '@/components/board/BoardViewer.vue'
import Button from '@/components/ui/button.vue'
import { Search, Filter, Package, ThumbsUp, ThumbsDown, BookOpen, ExternalLink } from 'lucide-vue-next'
import DateRangePicker from '@/components/ui/date-range-picker.vue'

// Simple debounce implementation
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const router = useRouter()

// State
const boards = ref([])
const selectedBoard = ref(null)
const searchQuery = ref('')
const showFilters = ref(false)
const isLoading = ref(false)
const error = ref(null)
const pageSize = ref(25)
const currentPage = ref(1)
const availableGrades = ref([])
const boardViewerRef = ref(null)

// Date range filtering
const dateRange = ref('24h')  // Default to last 24 hours
const customStartDate = ref('')
const customEndDate = ref('')

// Filters
const filters = ref({
  orderId: null,
  gradeId: null,
  speciesId: null,
  lengthMin: null,
  lengthMax: null,
  widthMin: null,
  widthMax: null,
  hasDefects: null
})

// Computed
const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some(v => v !== null && v !== '')
})

const filteredBoards = computed(() => {
  let result = [...boards.value]
  
  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(board => {
      return (
        board.id?.toString().includes(query) ||
        board.batch?.id?.toString().includes(query) ||
        board.batch?.name?.toLowerCase().includes(query) ||
        board.face1?.shotId?.toString().includes(query) ||
        board.face2?.shotId?.toString().includes(query) ||
        getGradeName(board).toLowerCase().includes(query) ||
        getSpeciesName(board).toLowerCase().includes(query)
      )
    })
  }
  
  // Apply filters
  if (filters.value.orderId) {
    result = result.filter(b => b.batch?.id == filters.value.orderId)
  }
  if (filters.value.gradeId) {
    result = result.filter(b => b.gradeId == filters.value.gradeId)
  }
  
  return result
})

const totalPages = computed(() => Math.ceil(filteredBoards.value.length / pageSize.value))
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value)
const endIndex = computed(() => Math.min(startIndex.value + pageSize.value, filteredBoards.value.length))
const paginatedBoards = computed(() => filteredBoards.value.slice(startIndex.value, endIndex.value))

// Methods
const getDateRangeParams = () => {
  const now = new Date()
  let startDate = new Date()
  
  switch(dateRange.value) {
    case '1h':
      startDate.setHours(now.getHours() - 1)
      break
    case '24h':
      startDate.setDate(now.getDate() - 1)
      break
    case '7d':
      startDate.setDate(now.getDate() - 7)
      break
    case '30d':
      startDate.setDate(now.getDate() - 30)
      break
    case 'custom':
      if (customStartDate.value && customEndDate.value) {
        return {
          startDate: new Date(customStartDate.value).toISOString(),
          endDate: new Date(customEndDate.value).toISOString()
        }
      }
      // Fall back to 24h if custom dates not set
      startDate.setDate(now.getDate() - 1)
      break
    default:
      startDate.setDate(now.getDate() - 1)
  }
  
  return {
    startDate: startDate.toISOString(),
    endDate: now.toISOString()
  }
}

const loadBoards = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // Get date range for client-side filtering
    const dateParams = getDateRangeParams()
    const startDate = new Date(dateParams.startDate)
    const endDate = new Date(dateParams.endDate)
    
    // Load all boards using pagination (backend doesn't support date filtering)
    const pageSize = 500 // Reasonable page size for performance
    let allBoards = []
    let currentPage = 1
    let hasMore = true
    
    while (hasMore) {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(pageSize),
        sortBy: 'createDate',
        sortDesc: 'true'  // Most recent first
      })
      
      const response = await fetch(`/api/v3/boards?${params}`)
      if (!response.ok) throw new Error('Failed to fetch boards')
      
      const data = await response.json()
      const pageBoards = data.data || []
      
      if (pageBoards.length === 0) {
        // No more boards
        hasMore = false
      } else {
        // Filter by date on client side since backend doesn't support it
        const filteredPageBoards = pageBoards.filter(board => {
          if (!board.createDate) return false
          const boardDate = new Date(board.createDate)
          return boardDate >= startDate && boardDate <= endDate
        })
        
        // Check for duplicates (in case pagination is broken)
        const existingIds = new Set(allBoards.map(b => b.id))
        const newBoards = filteredPageBoards.filter(b => !existingIds.has(b.id))
        
        if (newBoards.length === 0 && pageBoards.length === pageSize) {
          // No boards in date range on this page, but might be more pages
          currentPage++
        } else {
          allBoards = [...allBoards, ...newBoards]
          
          // If we got less than pageSize, we've reached the end
          if (pageBoards.length < pageSize) {
            hasMore = false
          } else {
            currentPage++
          }
        }
      }
      
      // Safety limit to prevent infinite loops
      if (currentPage > 20) {
        console.warn('Reached maximum page limit, stopping')
        hasMore = false
      }
    }
    
    boards.value = allBoards
    console.log(`Loaded ${boards.value.length} boards within date range from ${currentPage} page(s)`)
    console.log(`Date range: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`)
    
    // Auto-select first board if none selected
    if (boards.value.length > 0 && !selectedBoard.value) {
      selectBoard(boards.value[0])
    }
  } catch (err) {
    error.value = err.message
    console.error('Error loading boards:', err)
  } finally {
    isLoading.value = false
  }
}

const onDateRangeChange = () => {
  // Reload boards when date range changes
  loadBoards()
}

const loadGrades = async () => {
  try {
    const response = await fetch('/api/v3/grades')
    if (!response.ok) throw new Error('Failed to fetch grades')
    const data = await response.json()
    availableGrades.value = data.data || []
  } catch (err) {
    console.error('Error loading grades:', err)
  }
}

const selectBoard = (board) => {
  selectedBoard.value = board
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToInspector = () => {
  if (selectedBoard.value) {
    router.push(`/board-inspector/${selectedBoard.value.id}`)
  }
}

const handleUsableAreaToggle = (isShowing) => {
  console.log('Usable area toggled:', isShowing)
}

// Helper functions
const getGradeNameById = (gradeId) => {
  // Map batch-specific grade IDs to standard grade names
  const batchGradeMapping = {
    575: 'AW',
    576: 'AR', 
    577: 'BW',
    578: 'BR',
    579: 'CW',
    580: 'CR',
    581: 'Rebut'
  }
  
  if (batchGradeMapping[gradeId]) {
    return batchGradeMapping[gradeId]
  }
  
  const grade = availableGrades.value.find(g => g.id === gradeId)
  return grade?.name || `Grade ${gradeId}`
}

const getGradeName = (board) => {
  // Handle null/undefined gradeId
  if (!board?.gradeId) {
    // When gradeId is null, check what grades passed
    if (board?.grades && board.grades.length > 0) {
      // Find the first valid grade (excluding Rebut)
      const validGrade = board.grades.find(g => {
        if (!g.valid) return false
        const gradeName = getGradeNameById(g.id)
        // Exclude Rebut from being selected as the primary grade
        return !gradeName.toLowerCase().includes('rebut')
      })
      
      if (validGrade) {
        return getGradeNameById(validGrade.id)
      }
      
      // Check if only Rebut passed
      const rebutGrade = board.grades.find(g => {
        const gradeName = getGradeNameById(g.id)
        return gradeName.toLowerCase().includes('rebut') && g.valid
      })
      
      // If Rebut is valid but other grades are also valid, ignore Rebut
      if (rebutGrade && board.grades.some(g => g.valid && g.id !== rebutGrade.id)) {
        // Find the non-Rebut valid grade
        const otherValidGrade = board.grades.find(g => g.valid && g.id !== rebutGrade.id)
        return getGradeNameById(otherValidGrade.id)
      }
      
      if (rebutGrade) {
        return 'Rebut'
      }
      
      // If no grades passed and we have validation data, it's Rebut (reject)
      const hasValidationData = board.grades.some(g => g.valid !== undefined)
      if (hasValidationData) {
        return 'Rebut' // All grades failed, board is rejected
      }
    }
    // Only show Ungraded if there's no validation data at all
    return 'Ungraded'
  }
  
  const grade = availableGrades.value.find(g => g.id === board.gradeId)
  return grade?.name || `Grade ${board.gradeId}`
}

const getSpeciesName = (board) => {
  if (!board) return 'Unknown'
  
  // API uses 'specie' not 'species'
  if (board.specie) {
    if (typeof board.specie === 'object' && board.specie.name) {
      return board.specie.name
    }
    if (typeof board.specie === 'string') {
      return board.specie
    }
  }
  // Fallback to species for compatibility
  if (board.species) {
    if (typeof board.species === 'object' && board.species.name) {
      return board.species.name
    }
    if (typeof board.species === 'string') {
      return board.species
    }
  }
  
  return 'Unknown'
}

const formatDimensions = (board) => {
  const length = formatLength(board.length)
  const width = formatLength(board.width)
  return `${length} × ${width}`
}

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

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const calculateBoardValue = (board) => {
  if (!board) return ''
  
  // Only display price/value if provided by the API
  // No client-side calculations to support multiple customer sources
  
  // Check if board has a price field from API
  if (board.price !== undefined && board.price !== null) {
    return `€${board.price.toFixed(2)}`
  }
  
  // Check if board has a value field from API  
  if (board.value !== undefined && board.value !== null) {
    return `€${board.value.toFixed(2)}`
  }
  
  // If API doesn't provide price/value, don't show anything
  // This allows different customers to have their own pricing models
  return ''
}

const getGradeColorClass = (board) => {
  const gradeName = getGradeName(board)
  if (gradeName.includes('A')) return 'bg-emerald-100 text-emerald-700'
  if (gradeName.includes('B')) return 'bg-blue-100 text-blue-700'
  if (gradeName.includes('C')) return 'bg-amber-100 text-amber-700'
  if (gradeName.toLowerCase().includes('rebut')) return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-700'
}

// Debounced search
const debouncedSearch = debounce(() => {
  currentPage.value = 1 // Reset to first page on search
}, 300)

// Lifecycle
onMounted(() => {
  // Wrap async operations in an inner function to avoid Vue lifecycle warnings
  const initializeData = async () => {
    await Promise.all([
      loadGrades(),
      loadBoards()
    ])
  }
  
  initializeData()
})
</script>

<style scoped>
/* Any BoardFinder-specific styles */
</style>