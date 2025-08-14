<template>
  <div class="w-full px-4 sm:px-6 lg:px-8 py-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-6">
      <div class="flex items-center justify-between">
        <LoadingSkeleton variant="text" :rows="2" container-class="w-64" />
        <LoadingSkeleton variant="text" :rows="1" container-class="w-32" />
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <LoadingSkeleton variant="table" :rows="8" />
      </div>
    </div>

    <!-- Page Header -->
    <div v-else class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-4xl font-extrabold text-gray-900">{{ pageTitle }}</h1>
        <p class="text-gray-600 mt-1">{{ pageDescription }}</p>
      </div>
      <Button>
        <router-link to="/orders/create" class="flex items-center">
          <Plus class="w-4 h-4 mr-2" />
          Schedule New Order
        </router-link>
      </Button>
    </div>

    <!-- Empty State for Upcoming Orders -->
    <div v-if="displayMode === 'upcoming' && displayOrders.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
      <div class="max-w-md mx-auto">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No Upcoming Orders</h3>
        <p class="text-gray-500 mb-6">There are no scheduled orders at this time. The API does not currently provide scheduled order data.</p>
        <Button asChild>
          <router-link to="/orders/create">
            <Plus class="w-4 h-4 mr-2" />
            Schedule New Order
          </router-link>
        </Button>
      </div>
    </div>

    <!-- Data Table -->
    <div v-else class="bg-white rounded-lg shadow">
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
              v-if="showAllOrders"
              v-model="statusFilter"
              class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Statuses</option>
              <option value="PLANNED">Planned</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
            </select>
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
            Showing {{ filteredOrders.length }} of {{ displayOrders.length }} orders
          </div>
        </div>
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
                {{ showAllOrders ? 'Schedule' : 'Completed Date' }}
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
                <div class="text-sm text-gray-900">{{ order.date }}</div>
                <div class="text-xs text-gray-500">{{ order.time }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge :variant="getStatusVariant(order.status)" class="text-xs">
                  {{ order.status }}
                </Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button v-if="showAllOrders" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit class="w-4 h-4" />
                  </button>
                  <router-link :to="`/orders/${order.id}`" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Search, Plus, X, Edit, Eye, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'
import Badge from '@/components/ui/badge.vue'
import LoadingSkeleton from '@/components/ui/loading-skeleton.vue'
import { useAsyncState } from '@/composables/useAsyncState.js'

// Get route to determine display mode
const route = useRoute()
const displayMode = computed(() => {
  if (route.path === '/orders/upcoming') return 'upcoming'
  if (route.path === '/orders/past') return 'past'
  return 'all' // default for /orders/all
})

const showAllOrders = computed(() => displayMode.value === 'all')

// Page title and description based on mode
const pageTitle = computed(() => {
  switch (displayMode.value) {
    case 'upcoming': return 'Upcoming Orders'
    case 'past': return 'Past Orders'
    default: return 'All Orders'
  }
})

const pageDescription = computed(() => {
  switch (displayMode.value) {
    case 'upcoming': return 'View and manage scheduled production orders'
    case 'past': return 'View and manage completed and cancelled production orders'
    default: return 'View and manage all production orders'
  }
})

// Filters
const searchQuery = ref('')
const statusFilter = ref('')
const speciesFilter = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

// API data
const apiOrders = ref([])

// Load orders from API
const loadOrders = async () => {
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
  return apiOrders.value
}

// Get display orders based on mode
const displayOrders = computed(() => {
  let orders = []
  
  // Filter based on mode
  switch (displayMode.value) {
    case 'upcoming':
      // Show PLANNED orders as upcoming (if they exist in production)
      // Also include OPEN orders with future start dates
      const today = new Date().toISOString().split('T')[0]
      orders = apiOrders.value.filter(o => 
        o.status === 'PLANNED' || 
        o.status === 'SCHEDULED' ||
        (o.status === 'OPEN' && o.startDate > today)
      )
      break
    case 'past':
      orders = apiOrders.value.filter(o => o.status === 'CLOSED')
      break
    default: // 'all'
      orders = apiOrders.value
      break
  }
  
  // Map to display format with N/A for missing data
  return orders.map(order => ({
    id: `ORD-${order.id}`,
    name: order.name,
    customer: 'N/A', // Not in API
    species: order.specie?.name || 'N/A',
    dryStatus: order.dryStatus?.name || 'N/A',
    volume: 'N/A', // Not in API
    date: order.startDate ? new Date(order.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
    time: 'N/A', // Not in API
    status: order.status || 'N/A',
    sorts: [] // Not in API
  }))
})

// Computed properties
const filteredOrders = computed(() => {
  return displayOrders.value.filter(order => {
    const matchesSearch = !searchQuery.value || 
      order.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = !statusFilter.value || order.status === statusFilter.value
    const matchesSpecies = !speciesFilter.value || order.species === speciesFilter.value
    
    return matchesSearch && matchesStatus && matchesSpecies
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
  statusFilter.value = ''
  speciesFilter.value = ''
  currentPage.value = 1
}

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

const { isLoading } = useAsyncState(
  loadOrders,
  null,
  {
    immediate: true
  }
)
</script>