<template>
  <div class="min-h-screen bg-gray-50">
    <div class="w-full px-4 sm:px-6 lg:px-8 py-6">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-2">Live Scanning View</h1>
        <p class="text-gray-600 mt-1">Monitor boards as they pass through the scanning system</p>
      </div>

      <!-- Control Panel -->
      <div class="bg-white rounded-lg p-6 mb-8 shadow border">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <Button variant="secondary">
              <Pause v-if="isScanning" class="w-4 h-4 mr-2" />
              <Play v-else class="w-4 h-4 mr-2" />
              {{ isScanning ? 'Pause' : 'Resume' }}
            </Button>
            <Button>
              <RefreshCw class="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <div class="flex items-center space-x-2">
              <span class="text-gray-600 text-sm">Refresh Rate:</span>
              <select 
                v-model="scanInterval" 
                @change="updateScanInterval"
                class="bg-white text-gray-900 px-3 py-1 rounded text-sm border border-gray-300"
              >
                <option value="10000">3/min</option>
                <option value="5000">12/min</option>
                <option value="2000">30/min</option>
              </select>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-right">
              <div class="text-sm text-gray-600">Current Time</div>
              <div class="text-lg font-semibold text-gray-900">{{ currentTime }}</div>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-600">Scanning Status</div>
              <div class="flex items-center">
                <div :class="isScanning ? 'bg-emerald-400' : 'bg-gray-400'" class="w-2 h-2 rounded-full mr-2"></div>
                <span class="text-sm font-semibold text-gray-900">{{ isScanning ? 'Active' : 'Paused' }}</span>
              </div>
            </div>
            <Button>
              <Maximize class="w-4 h-4 mr-2" />
              Full Screen
            </Button>
          </div>
        </div>
      </div>

      <!-- Live Feed and Recent Boards -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Live Feed -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg p-6 shadow border">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Live Feed</h2>
            <div class="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4 relative">
              <div v-if="isScanning" class="text-center">
                <div class="text-gray-300 text-lg mb-2">Board Scanning in Progress</div>
                <div class="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div class="text-emerald-400 text-sm mt-2">Next scan in {{ countdown }}s</div>
              </div>
              <div v-else class="text-center">
                <div class="text-gray-300 text-lg mb-2">Scanning Paused</div>
                <div class="text-gray-500 text-sm">Click Resume to continue scanning</div>
              </div>
              
              <!-- Latest Board Preview -->
              <div v-if="recentBoards.length > 0 && isScanning" class="absolute top-4 right-4 bg-black bg-opacity-75 rounded-lg p-3">
                <div class="text-white text-sm">Latest Scan:</div>
                <div class="text-emerald-400 font-bold">{{ recentBoards[0].id }}</div>
                <div class="text-gray-300 text-xs">{{ recentBoards[0].grade }}</div>
              </div>
            </div>
            
            <!-- Scanning Stats Overlay -->
            <div class="grid grid-cols-3 gap-4 text-center">
              <div class="bg-gray-100 rounded-lg p-3">
                <div class="text-2xl font-bold text-emerald-400">{{ totalBoardsScanned }}</div>
                <div class="text-sm text-gray-600">Boards Scanned</div>
              </div>
              <div class="bg-gray-100 rounded-lg p-3">
                <div class="text-2xl font-bold text-emerald-400">23</div>
                <div class="text-sm text-gray-600">Batches Today</div>
              </div>
              <div class="bg-gray-100 rounded-lg p-3">
                <div class="text-2xl font-bold text-emerald-400">98.7%</div>
                <div class="text-sm text-gray-600">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Boards -->
        <div>
          <div class="bg-white rounded-lg p-6 shadow border">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-2xl font-bold text-gray-900">Recent Boards</h2>
              <div class="text-sm text-gray-500">{{ recentBoards.length }} boards</div>
            </div>
            



            <div class="space-y-3 max-h-96 overflow-y-auto">
              <TransitionGroup name="board" tag="div">
                <div 
                  v-for="board in recentBoards" 
                  :key="board.id"
                  :class="[
                    'bg-gray-100 rounded-lg p-4 transition-all duration-300',
                    board.isNew ? 'ring-2 ring-emerald-400 bg-emerald-50' : ''
                  ]"
                >
                  <div class="flex items-center justify-between mb-2">
                    <router-link 
                      :to="`/inspector/${board.id}`" 
                      class="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                    >
                      {{ board.id }}
                    </router-link>
                    <span class="text-emerald-400 font-semibold">${{ board.value }}</span>
                  </div>
                  <div class="text-sm text-gray-600">
                    <div>
                      Batch: <router-link :to="`/orders/${board.orderId}`" class="text-emerald-600 hover:text-emerald-800 hover:underline">{{ board.batch }}</router-link>
                    </div>
                    <div>Grade: {{ board.grade }}</div>
                    <div>Scanned: {{ board.scannedTime }}</div>
                  </div>
                </div>
              </TransitionGroup>
              
              <div v-if="recentBoards.length === 0" class="text-center py-8 text-gray-500">
                <div class="text-lg mb-2">No boards scanned yet</div>
                <div class="text-sm">Boards will appear here as they are scanned</div>
              </div>
            </div>

            <Button class="w-full mt-4">
              View All Recent Boards
            </Button>
          </div>
        </div>
      </div>

      <!-- System Status -->
      <div class="mt-8 bg-white rounded-lg p-6 shadow border">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">System Status</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="flex items-center justify-center mb-2">
              <div :class="isScanning ? 'bg-emerald-400' : 'bg-gray-400'" class="w-3 h-3 rounded-full mr-2"></div>
              <span class="text-gray-900 font-medium">Scanner Online</span>
            </div>
            <div class="text-sm text-gray-600">{{ isScanning ? 'All systems operational' : 'Scanning paused' }}</div>
          </div>
          <div class="text-center">
            <div class="flex items-center justify-center mb-2">
              <div class="w-3 h-3 bg-emerald-400 rounded-full mr-2"></div>
              <span class="text-gray-900 font-medium">Camera Feed</span>
            </div>
            <div class="text-sm text-gray-600">1080p @ 30fps</div>
          </div>
          <div class="text-center">
            <div class="flex items-center justify-center mb-2">
              <div class="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
              <span class="text-gray-900 font-medium">Processing Load</span>
            </div>
            <div class="text-sm text-gray-600">75% CPU usage</div>
          </div>
          <div class="text-center">
            <div class="flex items-center justify-center mb-2">
              <div class="w-3 h-3 bg-emerald-400 rounded-full mr-2"></div>
              <span class="text-gray-900 font-medium">Network</span>
            </div>
            <div class="text-sm text-gray-600">Stable connection</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Pause, Play, RefreshCw, Maximize } from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'

// Reactive state
const isScanning = ref(true)
const scanInterval = ref(5000) // 5 seconds default
const countdown = ref(5)
const currentTime = ref('')
const recentBoards = ref([])

// Timers
let scanTimer = null
let countdownTimer = null
let clockTimer = null

// Sample data for generating boards
const sampleGrades = ['FAS', 'Select', '1 Common', '2 Common', '3 Common']
const sampleBatches = ['B-789', 'B-790', 'B-791', 'B-792', 'B-793', 'B-794']
const sampleOrders = ['ORD-20250701-001', 'ORD-20250701-002', 'ORD-20250628-006', 'ORD-20250629-005']

// Computed properties
const totalBoardsScanned = computed(() => recentBoards.value.length + 1247)

/**
 * Generates a random board with realistic lumber data
 * @returns {Object} Board object with id, grade, batch, etc.
 */
const generateRandomBoard = () => {
  const boardNumber = Math.floor(Math.random() * 9999) + 2000
  const grade = sampleGrades[Math.floor(Math.random() * sampleGrades.length)]
  const batch = sampleBatches[Math.floor(Math.random() * sampleBatches.length)]
  const orderId = sampleOrders[Math.floor(Math.random() * sampleOrders.length)]
  const value = (Math.random() * 30 + 5).toFixed(2)
  
  return {
    id: `BRD-${boardNumber}`,
    grade,
    batch,
    orderId,
    value,
    scannedTime: new Date().toLocaleTimeString(),
    isNew: true
  }
}

/**
 * Adds a new randomly generated board to the scanning results
 * Manages the board list size and new board highlighting
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
  
  // Keep only the last 20 boards
  if (recentBoards.value.length > 20) {
    recentBoards.value = recentBoards.value.slice(0, 20)
  }
}

/**
 * Starts the scanning process with countdown and board generation
 */
const startScanning = () => {
  if (scanTimer) clearInterval(scanTimer)
  if (countdownTimer) clearInterval(countdownTimer)
  
  // Reset countdown
  countdown.value = Math.floor(scanInterval.value / 1000)
  
  // Add a board immediately when starting
  addNewBoard()
  
  // Start countdown timer
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      countdown.value = Math.floor(scanInterval.value / 1000)
    }
  }, 1000)
  
  // Start scanning timer
  scanTimer = setInterval(() => {
    addNewBoard()
    countdown.value = Math.floor(scanInterval.value / 1000)
  }, scanInterval.value)
}

/**
 * Stops all scanning timers and processes
 */
const stopScanning = () => {
  if (scanTimer) {
    clearInterval(scanTimer)
    scanTimer = null
  }
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

/**
 * Toggles between scanning and paused states
 */
const toggleScanning = () => {
  isScanning.value = !isScanning.value
  
  if (isScanning.value) {
    startScanning()
  } else {
    stopScanning()
  }
}

/**
 * Updates the scanning interval and restarts if currently scanning
 */
const updateScanInterval = () => {
  if (isScanning.value) {
    stopScanning()
    startScanning()
  }
}

/**
 * Updates the current time display
 */
const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString()
}

/**
 * Initializes the component with sample board data
 */
const initializeSampleBoards = () => {
  const initialBoards = [
    {
      id: 'BRD-1004',
      grade: 'FAS',
      batch: 'B-792',
      orderId: 'ORD-20250629-005',
      value: '22.00',
      scannedTime: '05:06:50 PM',
      isNew: false
    },
    {
      id: 'BRD-1003',
      grade: '2 Common',
      batch: 'B-791',
      orderId: 'ORD-20250628-006',
      value: '9.25',
      scannedTime: '05:06:45 PM',
      isNew: false
    },
    {
      id: 'BRD-1002',
      grade: '1 Common',
      batch: 'B-790',
      orderId: 'ORD-20250701-002',
      value: '18.75',
      scannedTime: '05:06:01 PM',
      isNew: false
    },
    {
      id: 'BRD-1001',
      grade: 'FAS',
      batch: 'B-789',
      orderId: 'ORD-20250701-001',
      value: '12.50',
      scannedTime: '05:05:23 PM',
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
})

onUnmounted(() => {
  stopScanning()
  if (clockTimer) {
    clearInterval(clockTimer)
  }
})
</script>

<style scoped>
/* Transition animations for new boards */
.board-enter-active {
  transition: all 0.5s ease;
}

.board-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.board-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.board-leave-active {
  transition: all 0.3s ease;
}

.board-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>