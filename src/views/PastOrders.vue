<template>
  <div class="w-full px-4 sm:px-6 lg:px-8 py-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading past orders...</p>
      </div>
    </div>
    
    <!-- Main Content -->
    <div v-else>
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-4xl font-extrabold text-gray-900">Past Orders</h1>
        <p class="text-gray-600 mt-1">View and manage completed and cancelled production orders</p>
      </div>
      <Button>
        <router-link to="/orders/create" class="flex items-center">
          <Plus class="w-4 h-4 mr-2" />
          Schedule New Order
        </router-link>
      </Button>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-lg shadow">
      <!-- Table Header with Search and Filters -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-4">
            <div class="relative">
              <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search orders..."
                class="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-80 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <select
              v-model="speciesFilter"
              class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Species</option>
              <option value="Hêtre">Hêtre</option>
            </select>
            <Button variant="outline" @click="clearFilters">
              <X class="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
          <div class="text-sm text-gray-600">
            Showing {{ filteredOrders.length }} of {{ pastOrders.length }} orders
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          {{ errorMessage }}
        </div>
        <Button @click="retryLoad" variant="outline" size="sm">
          Retry
        </Button>
      </div>

      <!-- Data Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">
                Order ID
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">
                Order Name
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">
                Customer
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">
                Species
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">
                Volume
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">
                Sorts
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">
                Completed Date
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">
                Status
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in paginatedOrders" :key="order.id" class="hover:bg-emerald-50 transition-colors duration-150">
              <td class="px-6 py-4 whitespace-nowrap">
                <router-link :to="`/orders/${order.id}`" class="text-sm font-medium text-emerald-600 hover:text-emerald-800 hover:underline">
                  {{ order.id }}
                </router-link>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ order.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ order.customer }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ order.species }}</div>
                <div class="text-xs text-gray-500">{{ order.dryStatus }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ order.volume }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ order.sorts?.length || 0 }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ order.completedDate }}</div>
                <div class="text-xs text-gray-500">{{ order.completedTime }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge :variant="getStatusVariant(order.status)" class="text-xs">
                  {{ order.status }}
                </Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <router-link :to="`/orders/${order.id}`" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye class="w-4 h-4" />
                  </router-link>
                  <button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <MoreHorizontal class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredOrders.length) }} of {{ filteredOrders.length }} results
          </div>
          <div class="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              <ChevronLeft class="w-4 h-4" />
              Previous
            </Button>
            <div class="flex items-center space-x-1">
              <Button
                v-for="page in visiblePages"
                :key="page"
                :variant="page === currentPage ? 'default' : 'outline'"
                size="sm"
                class="w-8 h-8"
                @click="currentPage = page"
              >
                {{ page }}
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              Next
              <ChevronRight class="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, Plus, X, Eye, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'
import Badge from '@/components/ui/badge.vue'

// Filters
const searchQuery = ref('')
const speciesFilter = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

// API data
const apiOrders = ref([])
const isLoading = ref(false)

// Load orders from API
const errorMessage = ref('')

const loadOrders = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await fetch('/api/legacy/batches')
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    const data = await response.json()
    apiOrders.value = data.data || []
  } catch (err) {
    console.error('Error loading orders:', err)
    errorMessage.value = err.message || 'Failed to load orders. Please try again.'
    apiOrders.value = []
  } finally {
    isLoading.value = false
  }
}

const retryLoad = () => {
  loadOrders()
}

// Get past (closed) orders from API data
const pastOrders = computed(() => {
  // Filter for CLOSED status orders
  const closedOrders = apiOrders.value.filter(o => o.status === 'CLOSED')
  
  // Map to display format with N/A for missing data
  return closedOrders.map(order => ({
    id: `ORD-${order.id}`,
    name: order.name,
    customer: 'N/A', // Not in API
    species: order.specie?.name || 'N/A',
    dryStatus: order.dryStatus?.name || 'N/A',
    volume: 'N/A', // Not in API
    completedDate: order.startDate ? (() => {
      const date = new Date(order.startDate)
      return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    })() : 'N/A',
    completedTime: 'N/A', // Not in API
    status: order.status || 'N/A',
    sorts: [] // Not in API
  }))
})

// Sample past orders data for reference (shows desired structure)
const samplePastOrders = ref([
  {
    id: 'ORD-20250630-004',
    name: 'Cherry - Cabinet Grade',
    customer: 'Cabinet Masters',
    species: 'Cherry',
    dryStatus: 'Kiln Dried (KD)',
    volume: '1,800 bf',
    completedDate: 'Jun 30, 2025',
    completedTime: '2:00 PM',
    status: 'Completed'
  },
  {
    id: 'ORD-20250629-005',
    name: 'Hard Maple - Premium',
    customer: 'Premium Hardwoods',
    species: 'Hard Maple',
    dryStatus: 'Kiln Dried (KD)',
    volume: '3,600 bf',
    completedDate: 'Jun 29, 2025',
    completedTime: '4:00 PM',
    status: 'Completed'
  },
  {
    id: 'ORD-20250628-006',
    name: 'Walnut - Select Grade',
    customer: 'Luxury Millwork',
    species: 'Walnut',
    dryStatus: 'Kiln Dried (KD)',
    volume: '1,200 bf',
    completedDate: 'Jun 28, 2025',
    completedTime: '3:00 PM',
    status: 'Completed'
  },
  {
    id: 'ORD-20250627-007',
    name: 'Red Oak - Construction Grade',
    customer: 'BuildCorp',
    species: 'Red Oak',
    dryStatus: 'Green (Air Dried)',
    volume: '5,000 bf',
    completedDate: 'Jun 27, 2025',
    completedTime: '6:00 PM',
    status: 'Completed'
  },
  {
    id: 'ORD-20250626-008',
    name: 'Soft Maple - Furniture Grade',
    customer: 'Modern Furniture Co.',
    species: 'Soft Maple',
    dryStatus: 'Kiln Dried (KD)',
    volume: '2,800 bf',
    completedDate: 'Jun 26, 2025',
    completedTime: '4:00 PM',
    status: 'Cancelled'
  },
  {
    id: 'ORD-20250625-009',
    name: 'White Oak - Flooring Premium',
    customer: 'Premium Flooring Inc.',
    species: 'White Oak',
    dryStatus: 'Kiln Dried (KD)',
    volume: '4,500 bf',
    completedDate: 'Jun 25, 2025',
    completedTime: '5:30 PM',
    status: 'Completed'
  },
  {
    id: 'ORD-20250624-010',
    name: 'Cherry - Furniture Grade',
    customer: 'Artisan Furniture',
    species: 'Cherry',
    dryStatus: 'Kiln Dried (KD)',
    volume: '2,200 bf',
    completedDate: 'Jun 24, 2025',
    completedTime: '3:45 PM',
    status: 'Completed'
  },
  {
    id: 'ORD-20250623-011',
    name: 'Hard Maple - Select',
    customer: 'Quality Woods Inc.',
    species: 'Hard Maple',
    dryStatus: 'Kiln Dried (KD)',
    volume: '3,100 bf',
    completedDate: 'Jun 23, 2025',
    completedTime: '5:15 PM',
    status: 'Completed'
  }
])

// Computed properties
const filteredOrders = computed(() => {
  return pastOrders.value.filter(order => {
    const matchesSearch = !searchQuery.value || 
      order.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesSpecies = !speciesFilter.value || order.species === speciesFilter.value
    
    return matchesSearch && matchesSpecies
  })
})

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage.value))

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredOrders.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const clearFilters = () => {
  searchQuery.value = ''
  speciesFilter.value = ''
  currentPage.value = 1
}

const getStatusVariant = (status) => {
  switch (status) {
    case 'CLOSED':
      return 'secondary'
    case 'OPEN':
      return 'default'
    default:
      return 'outline'
  }
}

// Load data on mount
onMounted(() => {
  loadOrders()
})
</script>