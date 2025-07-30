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
            <option value="12000">5/min</option>
            <option value="5000">12/min</option>
            <option value="2000">30/min</option>
          </select>
        </div>
        <div class="flex items-center space-x-3">
          <button class="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Square class="w-4 h-4 mr-2" />
            Pause
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
        <TransitionGroup name="board-list" tag="div">
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
                  <div class="text-lg font-bold text-gray-900">${{ board.value }}</div>
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
                  src="/image.png" 
                  alt="Board Face 1" 
                  class="w-full h-48 object-cover"
                />
              </div>
              
              <!-- Face 2 -->
              <div class="relative border-t border-gray-200">
                <div class="absolute top-2 left-2 z-10">
                  <span class="bg-black/70 text-white text-xs px-2 py-1 rounded font-medium">Face 2</span>
                </div>
                <img 
                  src="/image.png" 
                  alt="Board Face 2" 
                  class="w-full h-48 object-cover"
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
import { Clock, Square, RefreshCw, Maximize, Minimize, Camera } from 'lucide-vue-next'

// Reactive state
const isScanning = ref(true)
const scanInterval = ref(12000) // 5/min default
const currentTime = ref('')
const recentBoards = ref([])
const isFullScreen = ref(false)

// Timers
let clockTimer = null
let scanTimer = null

// Sample data for generating boards
const sampleGrades = ['2COMMON', 'Select', 'Common']
const sampleBatches = ['B-934', 'B-789', 'B-790', 'B-791', 'B-792']
const sampleOrderIds = ['ORD-20250701-001', 'ORD-20250701-002', 'ORD-20250628-006', 'ORD-20250630-004', 'ORD-20250629-008']
const sampleValues = ['8.41', '12.50', '18.75', '15.25', '22.00']

/**
 * Generates a random board with realistic lumber data
 * @returns {Object} Board object with id, grade, batch, etc.
 */
const generateRandomBoard = () => {
  const boardNumber = Math.floor(Math.random() * 9999) + 1000
  const boardId = `BRD-${boardNumber}`
  const grade = sampleGrades[Math.floor(Math.random() * sampleGrades.length)]
  const orderId = sampleOrderIds[Math.floor(Math.random() * sampleOrderIds.length)]
  const value = sampleValues[Math.floor(Math.random() * sampleValues.length)]
  
  return {
    id: boardId,
    grade,
    orderId,
    value,
    scannedTime: new Date().toLocaleTimeString(),
    isNew: true
  }
}

/**
 * Adds a new randomly generated board to the scanning results
 */
const addNewBoard = () => {
  if (!isScanning.value) return
  
  const newBoard = generateRandomBoard()
  
  // Add to the beginning of the array
  recentBoards.value.unshift(newBoard)
  
  // Remove the "new" highlight after 3 seconds
  setTimeout(() => {
    newBoard.isNew = false
  }, 3000)
  
  // Keep only the last 10 boards
  if (recentBoards.value.length > 10) {
    recentBoards.value = recentBoards.value.slice(0, 10)
  }
}

/**
 * Starts the scanning process
 */
const startScanning = () => {
  if (scanTimer) clearInterval(scanTimer)
  
  // Add a board immediately when starting
  addNewBoard()
  
  // Start scanning timer
  scanTimer = setInterval(() => {
    addNewBoard()
  }, scanInterval.value)
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
    '2COMMON': 'bg-gray-600 text-white',
    'Select': 'bg-blue-600 text-white',
    'Common': 'bg-yellow-600 text-white'
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
  initializeSampleBoards()
  updateTime()
  
  // Start clock timer
  clockTimer = setInterval(updateTime, 1000)
  
  // Start scanning
  if (isScanning.value) {
    startScanning()
  }
  
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