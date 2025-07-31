<template>
  <div class="w-full px-4 sm:px-6 lg:px-8 py-6">
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
              v-model="statusFilter"
              class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select
              v-model="speciesFilter"
              class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Species</option>
              <option value="Red Oak">Red Oak</option>
              <option value="White Oak">White Oak</option>
              <option value="Soft Maple">Soft Maple</option>
              <option value="Hard Maple">Hard Maple</option>
              <option value="Cherry">Cherry</option>
              <option value="Walnut">Walnut</option>
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
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Plus, X, Eye, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'
import Badge from '@/components/ui/badge.vue'

// Filters
const searchQuery = ref('')
const statusFilter = ref('')
const speciesFilter = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Sample past orders data
const pastOrders = ref([
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
    case 'Completed':
      return 'outline'
    case 'Cancelled':
      return 'destructive'
    default:
      return 'secondary'
  }
}
</script>