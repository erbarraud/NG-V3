<template>
  <div class="w-full px-4 sm:px-6 lg:px-8 py-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-4xl font-extrabold text-gray-900">Production Orders</h1>
      <div class="flex items-center space-x-4">
        <Button variant="outline" asChild>
          <router-link to="/orders/past">
            Past Orders
          </router-link>
        </Button>
        <Button>
          <router-link to="/orders/create" class="flex items-center">
            <Plus class="w-4 h-4 mr-2" />
            Schedule New Order
          </router-link>
        </Button>
      </div>
    </div>

    <!-- Running Order -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-emerald-600 mb-6">Running Order</h2>
      
      <Card class="border-2 border-emerald-300">
        <CardContent class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-xl font-bold text-gray-900 flex items-center mb-1">
                <Zap class="w-5 h-5 text-emerald-600 mr-2" />
                Red Oak - Prime Run
              </h3>
              <div class="text-sm text-gray-500">
                ID: <router-link to="/orders/ORD-20250701-001" class="text-emerald-600 hover:text-emerald-800 hover:underline font-medium">ORD-20250701-001</router-link> | Customer: Johnson Lumber Co.
              </div>
            </div>
            <Badge variant="secondary" class="border">Running</Badge>
          </div>

          <div class="grid grid-cols-3 gap-6 mb-6">
            <div>
              <div class="flex items-center mb-2">
                <TreePine class="w-4 h-4 text-gray-400 mr-2" />
                <span class="text-sm text-gray-600">Species</span>
              </div>
              <div class="text-base font-medium text-gray-900">Red Oak (KD)</div>
            </div>
            <div>
              <div class="flex items-center mb-2">
                <Clock class="w-4 h-4 text-gray-400 mr-2" />
                <span class="text-sm text-gray-600">Scheduled Start</span>
              </div>
              <div class="text-base font-medium text-gray-900">Jul 1, 8:00 AM</div>
            </div>
            <div>
              <div class="flex items-center mb-2">
                <User class="w-4 h-4 text-gray-400 mr-2" />
                <span class="text-sm text-gray-600">Operator</span>
              </div>
              <div class="text-base font-medium text-gray-900">John Doe</div>
            </div>
          </div>

          <div class="text-sm text-gray-600 mb-3">Key Performance Indicators:</div>
          <div class="grid grid-cols-4 gap-4 mb-6">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                <BarChart3 class="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <div class="text-sm text-gray-600">Boards Scanned</div>
                <div class="text-lg font-bold text-gray-900">125</div>
              </div>
            </div>
            <div class="flex items-center">
              <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                <Package class="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <div class="text-sm text-gray-600">Bundles Created</div>
                <div class="text-lg font-bold text-gray-900">4</div>
              </div>
            </div>
            <div class="flex items-center">
              <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <Clock class="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <div class="text-sm text-gray-600">Time Elapsed</div>
                <div class="text-lg font-bold text-gray-900">1h 02m</div>
              </div>
            </div>
            <div class="flex items-center">
              <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <Timer class="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <div class="text-sm text-gray-600">Time Remaining (Est.)</div>
                <div class="text-lg font-bold text-gray-900">1h 58m</div>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <Button variant="outline">
              <Power class="w-4 h-4 mr-2" />
              Stop & Complete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Upcoming Orders -->
    <div>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Upcoming Orders (5)</h2>
        <Button variant="outline" asChild>
          <router-link to="/orders/all">
            Show All
          </router-link>
        </Button>
      </div>
      
      <!-- Upcoming Orders Table -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
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
          <tbody ref="tableBodyRef" class="bg-white divide-y divide-gray-200">
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
                  <Badge variant="secondary" class="border text-xs px-2 py-0.5">{{ order.status }}</Badge>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Plus, Zap, TreePine, Clock, User, Power, BarChart3, Timer, Menu, Edit, Play,
  Eye, Package, Settings
} from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import CardContent from '@/components/ui/card-content.vue'
import Badge from '@/components/ui/badge.vue'

// Drag and drop state
const draggedItem = ref(null)
const dragOverIndex = ref(null)

// Orders data with priority field
const upcomingOrders = ref([
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
  
  const orders = [...upcomingOrders.value]
  const draggedOrder = orders[draggedItem.value.index]
  
  // Remove the dragged item
  orders.splice(draggedItem.value.index, 1)
  
  // Insert at new position
  orders.splice(targetIndex, 0, draggedOrder)
  
  // Update priorities
  orders.forEach((order, index) => {
    order.priority = index + 1
  })
  
  upcomingOrders.value = orders
  draggedItem.value = null
  dragOverIndex.value = null
}
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