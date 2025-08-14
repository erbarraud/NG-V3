<template>
  <div class="min-h-screen bg-gray-50">
    <div class="w-full px-4 sm:px-6 lg:px-8 py-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-4xl font-extrabold text-gray-900 mb-2">Line Check</h1>
        </div>
        
        <!-- Tab Navigation -->
        <div class="flex items-center space-x-2">
          <button class="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 flex items-center">
            <div class="w-4 h-4 mr-2 flex items-center justify-center">
              <div class="w-2 h-2 bg-gray-600 rounded-sm"></div>
              <div class="w-2 h-2 bg-gray-600 rounded-sm ml-0.5"></div>
            </div>
            Live View
          </button>
          <button class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center">
            <Camera class="w-4 h-4 mr-2" />
            Scanner
          </button>
        </div>
      </div>

      <!-- Control Bar -->
      <div v-if="!isFullScreen" class="flex items-center justify-between mb-6 bg-white rounded-lg p-4 shadow border">
        <div class="flex items-center space-x-4">
          <div class="flex items-center text-gray-600">
            <Clock class="w-4 h-4 mr-2" />
            <span class="text-gray-900 font-medium">{{ currentTime }}</span>
          </div>
          <select 
            v-model="scanInterval" 
            @change="updateScanInterval"
            class="bg-white text-gray-900 px-3 py-1 rounded text-sm border border-gray-300"
          >
            <option value="10000">Every 10s</option>
            <option value="5000">Every 5s</option>
            <option value="3000">Every 3s</option>
            <option value="2000">Every 2s</option>
          </select>
        </div>
        <div class="flex items-center space-x-3">
          <button 
            @click="toggleScanning"
            :class="[
              'flex items-center px-3 py-1.5 rounded-lg transition-colors',
              isScanning ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
            ]"
          >
            <component :is="isScanning ? Pause : Play" class="w-4 h-4 mr-2" />
            {{ isScanning ? 'Pause' : 'Play' }}
          </button>
          <button 
            @click="toggleFullScreen"
            class="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            title="Enter Full Screen"
          >
            <Maximize class="w-4 h-4 mr-2" />
            Full Screen
          </button>
        </div>
      </div>

      <!-- Recent Boards Section -->
      <div class="mb-4">
        <h3 class="text-xl font-semibold text-gray-900">Recent Boards</h3>
      </div>

      <!-- Board List Container -->
      <div class="bg-white rounded-lg overflow-hidden shadow">
        <!-- Empty State -->
        <div v-if="recentBoards.length === 0" class="text-center py-16">
          <Package class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No Recent Boards</h3>
          <p class="text-gray-500 mb-4">
            {{ isScanning ? 'Waiting for new boards to be scanned...' : 'Click Play to start monitoring boards' }}
          </p>
          <Button v-if="!isScanning" @click="toggleScanning" variant="default" class="bg-emerald-600 hover:bg-emerald-700">
            <Play class="w-4 h-4 mr-2" />
            Start Monitoring
          </Button>
        </div>
        
        <!-- Board List -->
        <TransitionGroup v-else name="board-list" tag="div">
          <div
            v-for="board in recentBoards"
            :key="board.id"
            class="relative border-b border-gray-200 last:border-b-0 transition-all duration-300"
          >
            <!-- Board Header -->
            <div class="px-4 py-2 bg-gray-100 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <router-link 
                    :to="`/inspector/${board.id}`" 
                    class="font-bold text-lg text-emerald-600 hover:text-emerald-800 hover:underline"
                  >
                    {{ board.id }}
                  </router-link>
                  <span :class="getGradeBadgeClass(board.grade)" class="px-2 py-1 rounded text-xs font-medium">
                    {{ board.grade }}
                  </span>
                  <div class="flex items-center text-sm text-gray-600">
                    <div class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                    Order: <router-link :to="`/orders/${board.orderId}`" class="text-emerald-600 hover:text-emerald-800 hover:underline font-medium ml-1">{{ board.orderId }}</router-link>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-lg font-bold text-gray-900">€{{ board.value }}</div>
                  <div class="text-xs text-gray-500">{{ board.scannedTime }}</div>
                </div>
              </div>
            </div>

            <!-- Two Faces Side by Side -->
            <div class="space-y-0">
              <!-- Face 1 -->
              <div class="relative">
                <div class="absolute top-2 left-2 z-10">
                  <span class="bg-black/70 text-white text-xs px-2 py-1 rounded font-medium">Face 1</span>
                </div>
                <img 
                  :src="`/api/v3/images/board/${board.id}/face1/original`" 
                  :alt="`Board ${board.id} Face 1`" 
                  class="w-full h-48 object-cover"
                  loading="lazy"
                  @error="handleImageError"
                />
              </div>
              
              <!-- Face 2 -->
              <div class="relative border-t border-gray-200">
                <div class="absolute top-2 left-2 z-10">
                  <span class="bg-black/70 text-white text-xs px-2 py-1 rounded font-medium">Face 2</span>
                </div>
                <img 
                  :src="`/api/v3/images/board/${board.id}/face2/original`" 
                  :alt="`Board ${board.id} Face 2`" 
                  class="w-full h-48 object-cover"
                  loading="lazy"
                  @error="handleImageError"
                />
              </div>
            </div>
            
            <!-- Batch Information -->
          </div>
        </TransitionGroup>
      </div>

      <!-- Footer Info -->
      <div class="mt-4 flex items-center text-gray-500 text-sm">
        <div class="w-4 h-4 rounded-full border border-gray-400 mr-2 flex items-center justify-center">
          <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
        Live feed with board images (original aspect ratio). KPIs are overlaid. Click Board ID for details.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Clock, Square, RefreshCw, Maximize, Minimize, Camera, Play, Pause, Package } from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'

// Reactive state
const isScanning = ref(false) // Start paused
const scanInterval = ref(5000) // Poll every 5 seconds
const currentTime = ref('')
const recentBoards = ref([])
const isFullScreen = ref(false)
const isLoading = ref(false)
const lastFetchedBoardId = ref(null) // Track last board to avoid duplicates
const seenBoardIds = ref(new Set()) // Track all boards we've shown

// Timers
let clockTimer = null
let scanTimer = null

// API endpoint - using translated endpoint
const API_BOARDS_URL = '/api/v3/boards'

// Sample data for generating boards
const sampleGrades = ['2COMMON', 'Select', 'Common']
const sampleBatches = ['B-934', 'B-789', 'B-790', 'B-791', 'B-792']
const sampleOrderIds = ['ORD-20250701-001', 'ORD-20250701-002', 'ORD-20250628-006', 'ORD-20250630-004', 'ORD-20250629-008']
const sampleValues = ['8.41', '12.50', '18.75', '15.25', '22.00']

/**
 * Fetches new boards from the API
 */
const fetchNewBoards = async (isInitialLoad = false) => {
  // Allow initial load even when not scanning
  if (!isInitialLoad && !isScanning.value) return
  
  try {
    isLoading.value = true
    const response = await fetch(API_BOARDS_URL)
    if (!response.ok) throw new Error('Failed to fetch boards')
    
    const data = await response.json()
    const boards = data.data || []
    
    // Process boards - get only new ones we haven't seen
    const newBoards = boards.filter(board => !seenBoardIds.value.has(board.id))
    
    if (newBoards.length > 0) {
      // Take only the most recent new boards (up to 3)
      const boardsToAdd = newBoards.slice(0, 3)
      
      boardsToAdd.forEach(board => {
        // Mark as seen
        seenBoardIds.value.add(board.id)
        
        // Format board for display
        // Check if board has a passing grade
        let gradeName = 'Ungraded'
        if (board.gradeId) {
          gradeName = getGradeName(board.gradeId)
        } else if (board.grades && board.grades.length > 0) {
          // Check validation results for passing grade
          const passingGrade = board.grades.find(g => g.valid === true)
          if (passingGrade) {
            gradeName = getGradeName(passingGrade.id)
          } else {
            // All grades failed - this is a reject
            gradeName = 'Rebut'
          }
        }
        
        const formattedBoard = {
          id: board.id,
          grade: gradeName,
          orderId: board.batch?.id || 'N/A',
          value: 'N/A', // API doesn't provide value
          scannedTime: new Date().toLocaleTimeString(),
          isNew: true,
          // Store original data for image URLs
          originalData: board
        }
        
        // Add to the beginning of the array
        recentBoards.value.unshift(formattedBoard)
        
        // Remove the "new" highlight after 3 seconds
        setTimeout(() => {
          formattedBoard.isNew = false
        }, 3000)
      })
      
      // Keep only the last 10 boards
      if (recentBoards.value.length > 10) {
        recentBoards.value = recentBoards.value.slice(0, 10)
      }
    }
  } catch (err) {
    console.error('Error fetching boards:', err)
  } finally {
    isLoading.value = false
  }
}

/**
 * Gets grade name from grade ID
 */
const getGradeName = (gradeId) => {
  // Map common grade IDs to names from the actual API
  const gradeMap = {
    1: 'AW',
    2: 'AR',
    3: 'BW',
    4: 'BR',
    5: 'CW',
    6: 'CR',
    7: 'Rebut'
  }
  return gradeMap[gradeId] || `Grade ${gradeId}`
}

/**
 * Starts the scanning process
 */
const startScanning = () => {
  if (scanTimer) clearInterval(scanTimer)
  
  // Fetch boards immediately when starting
  fetchNewBoards()
  
  // Start polling timer
  scanTimer = setInterval(() => {
    fetchNewBoards()
  }, scanInterval.value)
}

/**
 * Toggle scanning on/off
 */
const toggleScanning = () => {
  isScanning.value = !isScanning.value
  
  if (isScanning.value) {
    startScanning()
  } else {
    if (scanTimer) {
      clearInterval(scanTimer)
      scanTimer = null
    }
  }
}

/**
 * Updates the scanning interval and restarts if currently scanning
 */
const updateScanInterval = () => {
  if (isScanning.value) {
    if (scanTimer) clearInterval(scanTimer)
    startScanning()
  }
}

/**
 * Updates the current time display
 */
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', { 
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

/**
 * Gets CSS class for grade badge styling
 * @param {string} grade - Board grade
 * @returns {string} CSS class
 */
const getGradeBadgeClass = (grade) => {
  const badgeMap = {
    'AW': 'bg-emerald-600 text-white',
    'AR': 'bg-emerald-500 text-white',
    'BW': 'bg-blue-600 text-white',
    'BR': 'bg-blue-500 text-white',
    'CW': 'bg-amber-600 text-white',
    'CR': 'bg-amber-500 text-white',
    'Rebut': 'bg-red-600 text-white',
    'Ungraded': 'bg-gray-500 text-white'
  }
  return badgeMap[grade] || 'bg-gray-600 text-white'
}

/**
 * Toggle full screen mode for office display
 */
const toggleFullScreen = async () => {
  try {
    if (!document.fullscreenElement) {
      // Enter full screen
      await document.documentElement.requestFullscreen()
      isFullScreen.value = true
    } else {
      // Exit full screen
      await document.exitFullscreen()
      isFullScreen.value = false
    }
  } catch (error) {
    console.error('Error toggling fullscreen:', error)
    // Fallback for browsers that don't support fullscreen API
    alert('Full screen mode is not supported in this browser')
  }
}

/**
 * Handle fullscreen change events
 */
const handleFullscreenChange = () => {
  isFullScreen.value = !!document.fullscreenElement
}

/**
 * Handle keyboard shortcuts for fullscreen
 */
const handleKeydown = (event) => {
  // F11 or F key for fullscreen toggle
  if (event.key === 'F11' || (event.key === 'f' && event.ctrlKey)) {
    event.preventDefault()
    toggleFullScreen()
  }
  // Escape key to exit fullscreen
  if (event.key === 'Escape' && isFullScreen.value) {
    toggleFullScreen()
  }
}

/**
 * Handle image load errors
 */
const handleImageError = (event) => {
  // Set a placeholder image on error
  event.target.src = '/image.png'
}
/**
 * Initializes the component with sample board data
 */
const initializeSampleBoards = () => {
  const initialBoards = [
    {
      id: 'BRD-4625',
      grade: '2COMMON',
      orderId: 'ORD-20250701-001',
      value: '8.41',
      scannedTime: '06:39:00 PM',
      isNew: true
    },
    {
      id: 'BRD-4624',
      grade: 'Select',
      orderId: 'ORD-20250701-002',
      value: '12.50',
      scannedTime: '06:38:55 PM',
      isNew: false
    },
    {
      id: 'BRD-4623',
      grade: 'Common',
      orderId: 'ORD-20250628-006',
      value: '18.75',
      scannedTime: '06:38:50 PM',
      isNew: false
    }
  ]
  
  recentBoards.value = initialBoards
}

onMounted(() => {
  updateTime()
  
  // Start clock timer
  clockTimer = setInterval(updateTime, 1000)
  
  // Load initial boards to show something
  fetchNewBoards(true)
  
  // Add fullscreen event listeners
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('keydown', handleKeydown)
  
  // Check initial fullscreen state
  isFullScreen.value = !!document.fullscreenElement
})

onUnmounted(() => {
  if (scanTimer) clearInterval(scanTimer)
  if (clockTimer) clearInterval(clockTimer)
  
  // Remove fullscreen event listeners
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Transition animations for new boards */
.board-list-enter-active {
  transition: all 0.5s ease;
}

.board-list-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.board-list-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.board-list-leave-active {
  transition: all 0.3s ease;
}

.board-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>