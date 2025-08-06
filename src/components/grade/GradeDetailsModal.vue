<template>
  <Teleport to="body">
    <div v-if="show && grade" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="details-modal-title" role="dialog" aria-modal="true">
      <!-- Modal backdrop -->
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity" aria-hidden="true" @click="$emit('close')"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <!-- Modal header -->
          <div class="bg-white px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <h3 class="text-xl font-semibold text-gray-900" id="details-modal-title">
                  {{ grade.name }}
                </h3>
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getColorClasses(grade.color).badge
                ]">
                  {{ grade.species }}
                </span>
              </div>
              <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
                <X class="w-6 h-6" />
              </button>
            </div>
          </div>

          <!-- Modal content -->
          <div class="bg-white px-6 py-6 max-h-96 overflow-y-auto">
            <div class="space-y-6">
              <!-- Grade Overview -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center mb-2">
                    <Package class="w-5 h-5 text-gray-600 mr-2" />
                    <span class="text-sm font-medium text-gray-700">Usage Statistics</span>
                  </div>
                  <div class="text-2xl font-bold text-gray-900">{{ grade.usageCount }}</div>
                  <div class="text-sm text-gray-600">Orders processed</div>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center mb-2">
                    <BarChart3 class="w-5 h-5 text-gray-600 mr-2" />
                    <span class="text-sm font-medium text-gray-700">Total Volume</span>
                  </div>
                  <div class="text-2xl font-bold text-gray-900">{{ getTotalVolume(grade) }}</div>
                  <div class="text-sm text-gray-600">Processed to date</div>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center mb-2">
                    <Clock class="w-5 h-5 text-gray-600 mr-2" />
                    <span class="text-sm font-medium text-gray-700">Last Used</span>
                  </div>
                  <div class="text-lg font-bold text-gray-900">{{ getLastUsedDate(grade) }}</div>
                  <div class="text-sm text-gray-600">Most recent order</div>
                </div>
              </div>

              <!-- Grade Description -->
              <div>
                <h4 class="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                <p class="text-gray-700 bg-gray-50 rounded-lg p-4">{{ grade.description }}</p>
              </div>

              <!-- Grade Specifications -->
              <div>
                <h4 class="text-lg font-semibold text-gray-900 mb-3">Key Specifications</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="spec in grade.keySpecs" :key="spec" class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span class="text-sm text-gray-700">{{ spec }}</span>
                  </div>
                </div>
              </div>

              <!-- Recent Orders Using This Grade -->
              <div v-if="grade.usageCount > 0">
                <h4 class="text-lg font-semibold text-gray-900 mb-3">Recent Orders</h4>
                <div class="bg-gray-50 rounded-lg overflow-hidden">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-100">
                      <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="order in getOrdersUsingGrade(grade)" :key="order.id" class="hover:bg-gray-50">
                        <td class="px-4 py-3 whitespace-nowrap">
                          <router-link :to="`/orders/${order.id}`" class="text-sm font-medium text-emerald-600 hover:text-emerald-800 hover:underline">
                            {{ order.id }}
                          </router-link>
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ order.customer }}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ order.volume }}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ order.date }}</td>
                        <td class="px-4 py-3 whitespace-nowrap">
                          <span :class="[
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                            order.status === 'Running' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          ]">
                            {{ order.status }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- No Usage Message -->
              <div v-else class="text-center py-8">
                <Package class="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h4 class="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h4>
                <p class="text-gray-600">This grade hasn't been used in any production orders.</p>
              </div>
            </div>
          </div>

          <!-- Modal footer -->
          <div class="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <button
                @click="$emit('edit-grade', grade)"
                class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
              >
                <Edit class="w-4 h-4 mr-2" />
                Edit Grade
              </button>
              <button
                @click="$emit('duplicate-grade', grade)"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
              >
                <Copy class="w-4 h-4 mr-2" />
                Duplicate
              </button>
            </div>
            <button
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { Package, BarChart3, Clock, Edit, Copy, X } from 'lucide-vue-next'

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  grade: {
    type: Object,
    default: null
  }
})

defineEmits(['close', 'edit-grade', 'duplicate-grade'])

const getColorClasses = (color) => {
  const colorMap = {
    emerald: { badge: 'bg-emerald-100 text-emerald-800' },
    blue: { badge: 'bg-blue-100 text-blue-800' },
    yellow: { badge: 'bg-yellow-100 text-yellow-800' },
    orange: { badge: 'bg-orange-100 text-orange-800' }
  }
  return colorMap[color] || colorMap.emerald
}

const getTotalVolume = (grade) => {
  if (!grade?.usageCount) return '0 bf'
  
  const avgOrderVolume = 2500
  const totalBf = grade.usageCount * avgOrderVolume
  
  if (totalBf >= 1000000) {
    return `${(totalBf / 1000000).toFixed(1)}M bf`
  } else if (totalBf >= 1000) {
    return `${(totalBf / 1000).toFixed(1)}K bf`
  } else {
    return `${totalBf} bf`
  }
}

const getLastUsedDate = (grade) => {
  if (!grade?.usageCount || grade.usageCount === 0) return 'Never'
  
  const daysAgo = Math.floor(Math.random() * 30) + 1
  const lastUsed = new Date()
  lastUsed.setDate(lastUsed.getDate() - daysAgo)
  
  return lastUsed.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

const getOrdersUsingGrade = (grade) => {
  if (!grade || grade.usageCount === 0) return []
  
  const mockOrders = [
    {
      id: 'ORD-20250115-001',
      customer: 'Johnson Lumber Co.',
      volume: '2,400 bf',
      date: 'Jan 15, 2025',
      status: 'Completed'
    },
    {
      id: 'ORD-20250112-003',
      customer: 'Premium Hardwoods',
      volume: '1,800 bf',
      date: 'Jan 12, 2025',
      status: 'Completed'
    },
    {
      id: 'ORD-20250118-002',
      customer: 'Cabinet Masters',
      volume: '3,200 bf',
      date: 'Jan 18, 2025',
      status: 'Running'
    }
  ]
  
  return mockOrders.slice(0, Math.min(grade.usageCount, 3))
}
</script>