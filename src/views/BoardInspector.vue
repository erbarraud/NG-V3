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
          <p class="text-gray-600">Detailed analysis of board #{{ currentBoardId }}</p>
        </div>
        <div class="flex items-center space-x-4">
          <Button variant="outline" class="flex items-center" @click="goToBoardFinder">
            <List class="w-4 h-4 mr-2" />
            View All Boards
          </Button>
        </div>
      </div>

      <!-- Board Navigation -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <Button variant="outline" size="sm" @click="previousBoard" :disabled="!hasPrevious">
              <ChevronLeft class="w-4 h-4" />
              Previous
            </Button>
            <span class="text-sm text-gray-600">
              Board {{ currentIndex + 1 }} of {{ totalBoards }}
            </span>
            <Button variant="outline" size="sm" @click="nextBoard" :disabled="!hasNext">
              Next
              <ChevronRight class="w-4 h-4" />
            </Button>
          </div>
          
          <!-- Quick Jump -->
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-600">Jump to:</label>
            <input
              v-model.number="jumpToId"
              type="number"
              placeholder="Board ID"
              class="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              @keyup.enter="jumpToBoard"
            />
            <Button size="sm" @click="jumpToBoard">Go</Button>
          </div>
        </div>
      </div>

      <!-- Use the shared BoardViewer component -->
      <BoardViewer
        v-if="boardData"
        ref="boardViewerRef"
        :board="boardData"
        :available-grades="availableGrades"
        :show-kpis="true"
        @usable-area-toggled="handleUsableAreaToggle"
      >
        <!-- Additional action buttons specific to BoardInspector -->
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
        </template>

        <!-- Extended content specific to BoardInspector -->
        <template #extended-content>
          <!-- Clear Cuttings Section -->
          <div class="border-t border-gray-200 px-6 py-4">
            <h3 class="text-lg font-semibold mb-4">Clear Cuttings</h3>
            <div v-if="hasClearCuttings" class="space-y-2">
              <div v-for="(cutting, index) in clearCuttings" :key="index"
                   class="bg-green-50 rounded-lg p-3 border border-green-200">
                <div class="flex justify-between items-center">
                  <span class="font-medium text-green-900">Cutting #{{ index + 1 }}</span>
                  <span class="text-sm text-green-700">{{ cutting.dimensions || 'N/A' }}</span>
                </div>
              </div>
            </div>
            <div v-else class="text-gray-500 text-center py-4">
              No clear cutting data available
            </div>
          </div>

        </template>
      </BoardViewer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BoardViewer from '@/components/board/BoardViewer.vue'
import Button from '@/components/ui/button.vue'
import { ChevronLeft, ChevronRight, List, ThumbsUp, ThumbsDown, BookOpen } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

// State
const currentBoardId = ref(parseInt(route.params.id) || 1)
const boardData = ref(null)
const availableGrades = ref([])
const isLoading = ref(false)
const error = ref(null)
const jumpToId = ref(null)
const boardViewerRef = ref(null)

// Board IDs loaded from API for navigation
const allBoardIds = ref([])
const currentIndex = computed(() => allBoardIds.value.indexOf(currentBoardId.value))
const totalBoards = computed(() => allBoardIds.value.length)
const hasPrevious = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < allBoardIds.value.length - 1)

// Clear cuttings
const clearCuttings = ref([])
const hasClearCuttings = computed(() => clearCuttings.value && clearCuttings.value.length > 0)

// Methods
const loadBoard = async (id) => {
  isLoading.value = true
  error.value = null
  
  try {
    // Try to load all boards with pagination to find the one with matching ID
    let board = null
    let page = 1
    let hasMore = true
    const pageSize = 500 // Match BoardFinder's page size
    
    while (hasMore && !board) {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
      })
      
      const response = await fetch(`/api/v3/boards?${params}`)
      if (!response.ok) throw new Error('Failed to fetch boards')
      
      const data = await response.json()
      const pageBoards = data.data || []
      
      // Find the board with the matching ID in this page
      board = pageBoards.find(b => b.id === parseInt(id))
      
      if (pageBoards.length < pageSize) {
        hasMore = false // No more pages
      }
      
      page++
      
      // Prevent infinite loop - stop after 10 pages
      if (page > 10) {
        hasMore = false
      }
    }
    
    if (!board) {
      // Board not found - show error
      error.value = `Board with ID ${id} not found. The board may have been deleted or the ID is incorrect.`
      boardData.value = null // Clear any previous board data
      return // Exit early since board doesn't exist
    }
    
    boardData.value = board
    
    // Update current board ID
    currentBoardId.value = parseInt(id)
    
    // Update route
    if (route.params.id !== id.toString()) {
      router.replace({ params: { id: id.toString() } })
    }
  } catch (err) {
    error.value = `Failed to load board: ${err.message}`
    console.error('Error loading board:', err)
    boardData.value = null // Clear any previous board data
  } finally {
    isLoading.value = false
  }
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

const loadAllBoardIds = async () => {
  try {
    const boardIds = []
    let page = 1
    let hasMore = true
    const pageSize = 500
    
    while (hasMore) {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
      })
      
      const response = await fetch(`/api/v3/boards?${params}`)
      if (!response.ok) throw new Error('Failed to fetch boards')
      
      const data = await response.json()
      const pageBoards = data.data || []
      
      boardIds.push(...pageBoards.map(b => b.id))
      
      if (pageBoards.length < pageSize) {
        hasMore = false
      }
      
      page++
      
      // Prevent infinite loop
      if (page > 10) {
        hasMore = false
      }
    }
    
    allBoardIds.value = boardIds.sort((a, b) => a - b)
  } catch (err) {
    console.error('Error loading board IDs:', err)
    // Don't use fallback, just leave empty
    allBoardIds.value = []
  }
}

const previousBoard = () => {
  if (hasPrevious.value) {
    const prevId = allBoardIds.value[currentIndex.value - 1]
    loadBoard(prevId)
  }
}

const nextBoard = () => {
  if (hasNext.value) {
    const nextId = allBoardIds.value[currentIndex.value + 1]
    loadBoard(nextId)
  }
}

const jumpToBoard = () => {
  if (jumpToId.value && jumpToId.value > 0) {
    loadBoard(jumpToId.value)
  }
}

const goToBoardFinder = () => {
  router.push('/board-finder')
}

const handleUsableAreaToggle = (isShowing) => {
  console.log('Usable area toggled:', isShowing)
}

// Helper methods for compatibility
const getGradeName = (board) => {
  if (!board?.gradeId) return 'Ungraded'
  const grade = availableGrades.value.find(g => g.id === board.gradeId)
  return grade?.name || `Grade ${board.gradeId}`
}

// Lifecycle
onMounted(() => {
  // Wrap async operations in an inner function to avoid Vue lifecycle warnings
  const initializeData = async () => {
    await Promise.all([
      loadGrades(),
      loadAllBoardIds(),
      loadBoard(currentBoardId.value)
    ])
  }
  
  initializeData()
})
</script>

<style scoped>
/* Any BoardInspector-specific styles */
</style>