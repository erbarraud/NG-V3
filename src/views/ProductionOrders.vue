<template>
  <div class="w-full px-4 sm:px-6 lg:px-8 py-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-4xl font-extrabold text-gray-900">Production Orders</h1>
      <Button>
        <router-link to="/orders/create" class="flex items-center">
          <Plus class="w-4 h-4 mr-2" />
          Schedule New Order
        </router-link>
      </Button>
    </div>

    <!-- Running Order -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-emerald-600 mb-4">Running Order</h2>
      
      <Card v-if="runningOrder" class="border-2 border-emerald-300 bg-gray-50">
        <CardContent class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-4">
              <div class="animate-pulse">
                <Zap class="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">{{ runningOrder.name }}</h3>
                <div class="text-sm text-gray-500">
                  <router-link :to="`/orders/ORD-${runningOrder.id}`" class="text-emerald-600 hover:text-emerald-800 hover:underline font-medium">ORD-{{ runningOrder.id }}</router-link>
                  <span class="mx-2">•</span>
                  {{ runningOrder.specie?.name || 'N/A' }} ({{ runningOrder.dryStatus?.name || 'N/A' }})
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="text-right">
                <div class="text-sm text-gray-500">Started</div>
                <div class="text-sm font-medium">{{ new Date(runningOrder.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}</div>
              </div>
              <Button variant="outline" size="sm">
                <Power class="w-4 h-4 mr-2" />
                Stop Order
              </Button>
            </div>
          </div>

          <!-- Live Metrics Grid -->
          <div class="grid grid-cols-5 gap-4">
            <div class="bg-white rounded-lg p-3 border border-gray-200">
              <div class="flex items-center justify-between mb-1">
                <BarChart3 class="w-4 h-4 text-emerald-600" />
                <span class="text-2xl font-bold text-gray-900">N/A</span>
              </div>
              <div class="text-xs text-gray-600">Boards Scanned</div>
            </div>
            <div class="bg-white rounded-lg p-3 border border-gray-200">
              <div class="flex items-center justify-between mb-1">
                <Package class="w-4 h-4 text-emerald-600" />
                <span class="text-2xl font-bold text-gray-900">N/A</span>
              </div>
              <div class="text-xs text-gray-600">Bundles</div>
            </div>
            <div class="bg-white rounded-lg p-3 border border-gray-200">
              <div class="flex items-center justify-between mb-1">
                <Timer class="w-4 h-4 text-blue-600" />
                <span class="text-2xl font-bold text-gray-900">N/A</span>
              </div>
              <div class="text-xs text-gray-600">Scan Rate/min</div>
            </div>
            <div class="bg-white rounded-lg p-3 border border-gray-200">
              <div class="flex items-center justify-between mb-1">
                <Clock class="w-4 h-4 text-orange-600" />
                <span class="text-2xl font-bold text-gray-900">N/A</span>
              </div>
              <div class="text-xs text-gray-600">Time Elapsed</div>
            </div>
            <div class="bg-white rounded-lg p-3 border border-gray-200">
              <div class="flex items-center justify-between mb-1">
                <User class="w-4 h-4 text-gray-600" />
                <span class="text-lg font-bold text-gray-900">N/A</span>
              </div>
              <div class="text-xs text-gray-600">Operator</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <!-- No Running Order -->
      <Card v-else class="border-2 border-gray-300">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Power class="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p class="text-gray-900 font-medium">No Active Order</p>
                <p class="text-sm text-gray-500">Start an order to begin production</p>
              </div>
            </div>
            <Button v-if="upcomingOrders.length > 0" size="sm">
              <Play class="w-4 h-4 mr-2" />
              Start Next Order
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Orders Section (Upcoming and Past side by side) -->
    <div class="grid grid-cols-2 gap-6">
      <!-- Upcoming Orders -->
      <div>
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-4">
            <h2 class="text-2xl font-bold text-gray-900">Upcoming Orders ({{ upcomingOrders.length }})</h2>
            <Button variant="outline" size="sm" asChild>
              <router-link to="/orders/upcoming">
                Show all
              </router-link>
            </Button>
          </div>
        </div>
        
        <!-- Upcoming Orders Table -->
        <div v-if="upcomingOrders.length === 0" class="bg-white shadow rounded-lg p-8 text-center">
          <p class="text-gray-500">No upcoming orders scheduled</p>
          <p class="text-sm text-gray-400 mt-2">API does not provide scheduled order data</p>
        </div>
        <div v-else class="bg-white shadow rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500 w-16">Priority</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">Order Details</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">Species & Grade Mix</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">Schedule</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">Status</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="(order, index) in upcomingOrders" 
              :key="order.id" 
              :class="[
                'hover:bg-emerald-50 transition-colors duration-150 cursor-move',
                dragOverIndex === index ? 'bg-emerald-100 border-t-2 border-emerald-500' : ''
              ]"
              draggable="true"
              @dragstart="handleDragStart($event, order, index)"
              @dragend="handleDragEnd"
              @dragover="handleDragOver($event, index)"
              @dragleave="handleDragLeave"
              @drop="handleDrop($event, index)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <div class="drag-handle flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                    <Menu class="w-4 h-4" />
                  </div>
                  <div class="flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                    {{ order.priority }}
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-start">
                  <div>
                    <div class="text-sm font-bold text-gray-900">{{ order.name }}</div>
                    <div class="text-xs text-emerald-600 font-medium">
                      <router-link :to="`/orders/${order.id}`" class="hover:text-emerald-800 hover:underline">
                        {{ order.id }}
                      </router-link>
                    </div>
                    <div class="text-xs text-gray-500">{{ order.volume }} • {{ order.sorts?.length || 0 }} sorts</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="space-y-1">
                  <div class="text-xs font-medium text-gray-900">{{ order.species }}</div>
                  <div class="text-xs text-gray-600">{{ order.dryStatus }}</div>
                  <div class="text-xs text-gray-500 truncate max-w-32" :title="order.targetMix">
                    {{ order.targetMix }}
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="space-y-0.5">
                  <div class="text-xs font-medium text-gray-900">{{ order.date }}</div>
                  <div class="text-xs text-gray-600">{{ order.time }}</div>
                  <div class="text-xs text-gray-500 truncate">{{ order.shift }}</div>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="space-y-1">
                  <Badge :variant="getStatusVariant(order.status)" class="border text-xs px-2 py-0.5">{{ order.status }}</Badge>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center space-x-2">
                  <button 
                    class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                    :disabled="!order.canStart" 
                    :title="order.canStart ? 'Start Order' : 'Setup Required'"
                  >
                    <Play v-if="order.canStart" class="w-3 h-3 mx-auto" />
                    <Settings v-else class="w-3 h-3 mx-auto" />
                  </button>
                  <button 
                    class="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                    title="Edit Order"
                  >
                    <Edit class="w-3 h-3" />
                  </button>
                  <button 
                    class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors" 
                    title="View Details"
                  >
                    <Eye class="w-3 h-3" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>

      <!-- Past Orders -->
      <div>
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-4">
            <h2 class="text-2xl font-bold text-gray-900">Past Orders ({{ pastOrders.length }})</h2>
            <Button variant="outline" size="sm" asChild>
              <router-link to="/orders/past">
                Show all
              </router-link>
            </Button>
          </div>
        </div>
        
        <!-- Past Orders Table -->
        <div v-if="pastOrders.length === 0" class="bg-white shadow rounded-lg p-8 text-center">
          <p class="text-gray-500">No past orders available</p>
        </div>
        <div v-else class="bg-white shadow rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-gray-500">Order Details</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-gray-500">Species & Grade Mix</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-gray-500">Completed</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-gray-500">Status</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="order in limitedPastOrders" 
              :key="order.id" 
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <td class="px-4 py-3">
                <div class="flex items-start">
                  <div>
                    <div class="text-sm font-bold text-gray-900">{{ order.name }}</div>
                    <div class="text-xs text-gray-600 font-medium">
                      <router-link :to="`/orders/${order.id}`" class="hover:text-gray-800 hover:underline">
                        ORD-{{ order.id }}
                      </router-link>
                    </div>
                    <div class="text-xs text-gray-500">{{ order.volume }} • {{ order.sorts?.length || 0 }} sorts</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="space-y-1">
                  <div class="text-xs font-medium text-gray-900">{{ order.species }}</div>
                  <div class="text-xs text-gray-600">{{ order.dryStatus }}</div>
                  <div class="text-xs text-gray-500 truncate max-w-32" :title="order.targetMix">
                    {{ order.targetMix }}
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="space-y-0.5">
                  <div class="text-xs font-medium text-gray-900">{{ order.completedDate }}</div>
                  <div class="text-xs text-gray-600">{{ order.completedTime }}</div>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="space-y-1">
                  <Badge :variant="getStatusVariant(order.status)" class="border text-xs px-2 py-0.5">{{ order.status }}</Badge>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center space-x-2">
                  <router-link 
                    :to="`/orders/${order.id}`"
                    class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors" 
                    title="View Details"
                  >
                    <Eye class="w-3 h-3" />
                  </router-link>
                  <button 
                    class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors" 
                    title="More Options"
                  >
                    <MoreHorizontal class="w-3 h-3" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  Plus, Zap, TreePine, Clock, User, Power, BarChart3, Timer, Menu, Edit, Play,
  Eye, Package, Settings, MoreHorizontal
} from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import CardContent from '@/components/ui/card-content.vue'
import Badge from '@/components/ui/badge.vue'

// Get status badge variant
const getStatusVariant = (status) => {
  switch (status) {
    case 'PLANNED':
      return 'outline'  // Blue outline for planned
    case 'OPEN':
      return 'default'   // Green for active/open
    case 'CLOSED':
      return 'secondary' // Gray for closed
    default:
      return 'outline'
  }
}

// Drag and drop state
const draggedItem = ref(null)
const dragOverIndex = ref(null)

// API data
const apiOrders = ref([])
const isLoading = ref(false)

// Load orders from API
const loadOrders = async () => {
  isLoading.value = true
  try {
    // Load all orders with proper pagination
    const allOrders = []
    let page = 1
    let hasMore = true
    const pageSize = 100
    
    while (hasMore) {
      const response = await fetch(`/api/v3/orders?page=${page}&pageSize=${pageSize}`)
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      const pageOrders = data.data || []
      
      allOrders.push(...pageOrders)
      
      if (pageOrders.length < pageSize) {
        hasMore = false
      }
      
      page++
      
      // Safety limit to prevent infinite loop
      if (page > 10) hasMore = false
    }
    
    apiOrders.value = allOrders
  } catch (err) {
    console.error('Error loading orders:', err)
  } finally {
    isLoading.value = false
  }
}

// Get the running order (OPEN status)
const runningOrder = computed(() => {
  const openOrder = apiOrders.value.find(o => o.status === 'OPEN')
  if (!openOrder) return null
  
  // Return with N/A for missing fields
  return {
    ...openOrder,
    customer: 'N/A', // Not in API
    boardsScanned: 'N/A', // Would need separate API call
    bundlesCreated: 'N/A', // Not in API
    timeElapsed: 'N/A', // Would need calculation
    timeRemaining: 'N/A', // Would need calculation
    operator: 'N/A' // Not in API
  }
})

// Get upcoming orders (PLANNED status orders)
const upcomingOrders = computed(() => {
  // Filter for PLANNED status orders
  const plannedOrders = apiOrders.value.filter(o => o.status === 'PLANNED')
  
  // Map to display format
  return plannedOrders.map((order, index) => ({
    id: order.id,
    priority: index + 1,
    name: order.name,
    customer: 'N/A', // Not in API
    species: order.specie?.name || 'N/A',
    gradeMix: 'N/A', // Not in API
    dryStatus: order.dryStatus?.name || 'N/A',
    volume: 'N/A', // Not in API
    schedule: order.startDate ? new Date(order.startDate).toLocaleDateString() : 'N/A',
    duration: 'N/A', // Not in API
    operator: 'N/A', // Not in API
    status: order.status // Include status for badge display
  }))
})

// Get past orders (CLOSED status)
const pastOrders = computed(() => {
  const closedOrders = apiOrders.value.filter(o => o.status === 'CLOSED')
  
  // Map to display format with N/A for missing data
  return closedOrders.map(order => ({
    id: order.id,
    name: order.name,
    species: order.specie?.name || 'N/A',
    dryStatus: order.dryStatus?.name || 'N/A',
    volume: 'N/A', // Not in API
    completedDate: order.startDate ? new Date(order.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
    completedTime: 'N/A', // Not in API
    status: 'CLOSED',
    targetMix: 'N/A', // Not in API
    sorts: [] // Not in API
  }))
})

// Limit past orders to show only first 5
const limitedPastOrders = computed(() => {
  return pastOrders.value.slice(0, 5)
})

// Original mock data as fallback (keeping for reference of desired features)
const mockUpcomingOrders = ref([
  {
    id: 'ORD-20250701-002',
    priority: 1,
    name: 'Soft Maple - Special Order',
    species: 'Soft Maple',
    dryStatus: 'Green (Air Dried)',
    volume: '2,500 bf',
    date: 'Jul 1, 2025',
    time: '1:00 PM - 6:00 PM',
    shift: 'Afternoon Shift',
    status: 'Scheduled',
    statusDetail: 'Ready to Start',
    targetMix: '40% Prime, 35% Select, 25% #1 Common',
    canStart: true
  },
  {
    id: 'ORD-20250702-003',
    priority: 2,
    name: 'White Oak - Flooring Grade',
    species: 'White Oak',
    dryStatus: 'Kiln Dried (KD)',
    volume: '4,200 bf',
    date: 'Jul 2, 2025',
    time: '9:00 AM - 5:00 PM',
    shift: 'Morning + Afternoon Shift',
    status: 'Scheduled',
    statusDetail: 'Pending Setup',
    targetMix: '60% Select, 30% #1 Common, 10% #2 Common',
    canStart: false
  },
  {
    id: 'ORD-20250703-004',
    priority: 3,
    name: 'Cherry - Cabinet Grade',
    species: 'Cherry',
    dryStatus: 'Kiln Dried (KD)',
    volume: '1,800 bf',
    date: 'Jul 3, 2025',
    time: '8:00 AM - 2:00 PM',
    shift: 'Morning Shift',
    status: 'Scheduled',
    statusDetail: 'Ready to Start',
    targetMix: '50% FAS, 30% Select, 20% #1 Common',
    canStart: true
  },
  {
    id: 'ORD-20250703-005',
    priority: 4,
    name: 'Hard Maple - Premium',
    species: 'Hard Maple',
    dryStatus: 'Kiln Dried (KD)',
    volume: '3,600 bf',
    date: 'Jul 3, 2025',
    time: '2:00 PM - 8:00 PM',
    shift: 'Afternoon Shift',
    status: 'Scheduled',
    statusDetail: 'Pending Setup',
    targetMix: '45% FAS, 35% Select, 20% #1 Common',
    canStart: false
  },
  {
    id: 'ORD-20250704-006',
    priority: 5,
    name: 'Walnut - Select Grade',
    species: 'Walnut',
    dryStatus: 'Kiln Dried (KD)',
    volume: '1,200 bf',
    date: 'Jul 4, 2025',
    time: '9:00 AM - 3:00 PM',
    shift: 'Morning Shift',
    status: 'Scheduled',
    statusDetail: 'Material Pending',
    targetMix: '60% FAS, 25% Select, 15% #1 Common',
    canStart: false
  }
])

// Drag and drop handlers
const handleDragStart = (event, order, index) => {
  draggedItem.value = { order, index }
  event.dataTransfer.effectAllowed = 'move'
  event.target.style.opacity = '0.5'
}

const handleDragEnd = (event) => {
  event.target.style.opacity = '1'
  draggedItem.value = null
  dragOverIndex.value = null
}

const handleDragOver = (event, index) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
  dragOverIndex.value = index
}

const handleDragLeave = () => {
  dragOverIndex.value = null
}

const handleDrop = (event, targetIndex) => {
  event.preventDefault()
  
  if (!draggedItem.value || draggedItem.value.index === targetIndex) {
    return
  }
  
  // Since upcomingOrders is now computed, we can't directly modify it
  // In a real app, this would update the order in the backend
  console.log('Reordering not available with API data - would need backend support')
  
  // For now, just reset the drag state
  draggedItem.value = null
  dragOverIndex.value = null
}

// Load data on mount
onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.sortable-chosen {
  background: #ecfdf5;
}

.sortable-drag {
  background: #ffffff;
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
  transform: rotate(2deg);
}

.sortable-ghost td {
  background: transparent;
}
</style>