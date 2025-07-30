<template>
  <div class="w-full px-4 sm:px-6 lg:px-8 py-6">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-extrabold text-gray-900 mb-2">Claims Management</h1>
      <p class="text-gray-600 mt-1">Track and resolve customer quality claims efficiently</p>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white border-l-4 border-red-500 rounded-lg p-6 shadow-sm">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
            <AlertCircle class="h-6 w-6 text-red-600" />
          </div>
          <div class="ml-4">
            <div class="text-2xl font-bold text-gray-900">2</div>
            <div class="text-sm font-medium text-gray-600">Open Claims</div>
          </div>
        </div>
      </div>

      <div class="bg-white border-l-4 border-emerald-500 rounded-lg p-6 shadow-sm">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
            <CheckCircle class="h-6 w-6 text-emerald-600" />
          </div>
          <div class="ml-4">
            <div class="text-2xl font-bold text-gray-900">87%</div>
            <div class="text-sm font-medium text-gray-600">Resolution Rate</div>
          </div>
        </div>
      </div>

      <div class="bg-white border-l-4 border-blue-500 rounded-lg p-6 shadow-sm">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <Clock class="h-6 w-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <div class="text-2xl font-bold text-gray-900">3.2</div>
            <div class="text-sm font-medium text-gray-600">Average Resolution Time (days)</div>
          </div>
    </div>
        </div>
      </div>
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <Button variant="outline">
          <RefreshCw class="w-4 h-4 mr-2" />
          Refresh
        </Button>
        <Button variant="outline">
          <Share class="w-4 h-4 mr-2" />
          Share Claim Link
        </Button>
      </div>
      <Button>
        <Plus class="w-4 h-4 mr-2" />
        New Claim
      </Button>
    </div>

    <!-- Search and Filters -->
    <div class="flex items-center space-x-4 mb-6">
      <div class="relative flex-1 max-w-md">
        <Search class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search claims by ID, customer, or batch..."
          v-model="searchQuery"
          class="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
      <select 
        v-model="selectedStatus"
        class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
      >
        <option value="">All Statuses</option>
        <option value="New">New</option>
        <option value="In Review">In Review</option>
        <option value="Approved">Approved</option>
        <option value="Declined">Declined</option>
        <option value="Closed">Closed</option>
      </select>
    </div>

    <!-- Claims Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">Claim ID</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">Customer</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">Batch</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">Issue Type</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">Status</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">Created</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">Priority</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="claim in filteredClaims" :key="claim.id" class="hover:bg-emerald-50 transition-colors duration-150">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium">
                <router-link to="/orders/ORD-20250701-001" class="text-emerald-600 hover:text-emerald-800 hover:underline">
                  {{ claim.id }}
                </router-link>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ claim.customer }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                <router-link to="/orders/ORD-20250701-001" class="text-emerald-600 hover:text-emerald-800 hover:underline">
                  {{ claim.batch }}
                </router-link>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ claim.issueType }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusBadgeClass(claim.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ claim.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ claim.created }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getPriorityBadgeClass(claim.priority)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ claim.priority }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button class="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                <MoreHorizontal class="h-4 w-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  AlertCircle, CheckCircle, Clock, RefreshCw, Share, Plus, Search, MoreHorizontal
} from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'

const searchQuery = ref('')
const selectedStatus = ref('')

const claims = ref([
  {
    id: 'CLM-2023-001',
    customer: 'Johnson Lumber Co.',
    batch: 'B-4871',
    issueType: 'Grade Mismatch',
    status: 'New',
    created: 'Mar 18, 2025',
    priority: 'High'
  },
  {
    id: 'CLM-2023-002',
    customer: 'Artisan Furniture',
    batch: 'B-4870',
    issueType: 'Moisture Content',
    status: 'In Review',
    created: 'Mar 17, 2025',
    priority: 'Medium'
  },
  {
    id: 'CLM-2023-003',
    customer: 'Premium Hardwoods',
    batch: 'B-4869',
    issueType: 'Defect Detection',
    status: 'Approved',
    created: 'Mar 15, 2025',
    priority: 'Low'
  },
  {
    id: 'CLM-2023-004',
    customer: 'Flooring Inc.',
    batch: 'B-4868',
    issueType: 'Dimension Variance',
    status: 'Declined',
    created: 'Mar 14, 2025',
    priority: 'Medium'
  },
  {
    id: 'CLM-2023-005',
    customer: 'Cabinet Masters',
    batch: 'B-4867',
    issueType: 'Surface Quality',
    status: 'Closed',
    created: 'Mar 12, 2025',
    priority: 'High'
  }
])

const filteredClaims = computed(() => {
  return claims.value.filter(claim => {
    const matchesSearch = 
      claim.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      claim.customer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      claim.batch.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = !selectedStatus.value || claim.status === selectedStatus.value
    
    return matchesSearch && matchesStatus
  })
})

const getStatusBadgeClass = (status) => {
  const classes = {
    'New': 'bg-emerald-100 text-emerald-800',
    'In Review': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-emerald-100 text-emerald-800',
    'Declined': 'bg-red-100 text-red-800',
    'Closed': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getPriorityBadgeClass = (priority) => {
  const classes = {
    'High': 'bg-red-100 text-red-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-emerald-100 text-emerald-800'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}
</script>