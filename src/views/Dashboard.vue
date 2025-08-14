<template>
  <div class="w-full px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-8">
      <LoadingSkeleton variant="card" />
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LoadingSkeleton variant="list" :rows="6" />
        <LoadingSkeleton variant="card" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-64">
      <div class="text-center space-y-4">
        <AlertCircle class="w-16 h-16 text-destructive mx-auto" />
        <h2 class="text-xl font-semibold text-foreground">Failed to load dashboard</h2>
        <p class="text-muted-foreground">{{ error.message }}</p>
        <Button @click="retryLoad" variant="outline">
          <RefreshCw class="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>

    <!-- First Line: KPIs and Chart -->
    <Card v-else class="mb-8 bg-white/70 backdrop-blur-sm border-0 shadow-sm">
      <CardContent class="p-6">
        <!-- Header with Shift Status -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-6">
            <div class="flex items-center space-x-2">
              <Calendar class="w-5 h-5 text-emerald-600" />
              <span class="text-lg font-semibold text-slate-900">Production Overview</span>
            </div>
            <Badge variant="secondary" class="bg-emerald-50 text-emerald-700 border-emerald-200">
              {{ activeOrder ? 'Active Shift' : 'No Active Shift' }}
            </Badge>
          </div>
          <Button variant="outline" size="sm" class="bg-white/80">
            <Download class="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        <!-- KPIs Row -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <!-- Shift Status -->
          <div class="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg p-4 border border-emerald-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center mr-3">
                  <Calendar class="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div class="text-xs font-medium text-emerald-700">Next Shift</div>
                  <div class="text-sm font-bold text-emerald-900">N/A</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Value Processed -->
          <div class="bg-white/60 rounded-lg p-4 border border-slate-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center mr-3">
                  <DollarSign class="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div class="text-xs font-medium text-slate-600">Value Processed</div>
                  <div class="text-lg font-bold text-slate-900">N/A</div>
                </div>
              </div>
              <!-- Trend removed - no data available -->
            </div>
          </div>

          <!-- Volume Processed -->
          <div class="bg-white/60 rounded-lg p-4 border border-slate-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center mr-3">
                  <Package class="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div class="text-xs font-medium text-slate-600">Volume Processed</div>
                  <div class="text-lg font-bold text-slate-900">N/A</div>
                </div>
              </div>
              <!-- Trend removed - no data available -->
            </div>
          </div>

          <!-- Feedback Submitted -->
          <div class="bg-white/60 rounded-lg p-4 border border-slate-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center mr-3">
                  <MessageSquare class="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div class="text-xs font-medium text-slate-600">Total Orders</div>
                  <div class="text-lg font-bold text-slate-900">{{ totalOrders }}</div>
                </div>
              </div>
              <!-- Trend removed - no data available -->
            </div>
          </div>
        </div>

        <!-- Chart Section -->
        <div>
          <h3 class="text-lg font-semibold text-slate-900 mb-4">Boards Processed per Hour</h3>
          <div class="bg-white/40 rounded-lg p-4 border border-slate-100">
            <div class="text-center py-16 text-gray-500">
              <Package class="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <div>No production data available</div>
              <div class="text-sm text-gray-400 mt-2">API does not provide hourly production metrics</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Second Line: Recent Orders and System Alerts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Orders -->
      <Card>
        <CardContent class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-slate-900">Recent Orders</h3>
          <Button variant="link">
            View All
            <ChevronRight class="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div class="text-sm text-slate-600 mb-4">Latest wood grading operations</div>
        
        <!-- Compact List View -->
        <div class="space-y-2">
          <div v-if="recentOrders.length === 0" class="text-center py-8 text-gray-500">
            No recent orders available
          </div>
          <div v-for="order in recentOrders" :key="order.id"
               class="flex items-center justify-between py-3 px-4 hover:bg-slate-50 rounded-xl border border-slate-100 transition-all duration-200 hover:shadow-md">
            <div class="flex items-center space-x-4 flex-1">
              <div class="w-2 h-2 rounded-full" :class="order.status === 'OPEN' ? 'bg-emerald-500' : 'bg-slate-400'"></div>
              <div>
                <div class="font-semibold text-slate-900">{{ order.name }}</div>
                <div class="text-xs text-slate-500">
                  <router-link :to="`/orders/ORD-${order.id}`" class="text-emerald-600 hover:text-emerald-800 hover:underline font-medium">
                    Order {{ order.orderId }}
                  </router-link>
                  • {{ order.status === 'OPEN' ? 'Started' : '' }} {{ order.startTime }}
                </div>
              </div>
              <div class="text-sm text-slate-600">{{ order.customer }}</div>
              <Badge :variant="order.status === 'OPEN' ? 'default' : 'secondary'" 
                     :class="order.status === 'OPEN' ? 'bg-emerald-100 text-emerald-800' : ''">
                {{ order.status === 'OPEN' ? 'Active' : 'Completed' }}
              </Badge>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <div class="text-sm font-semibold text-slate-900">{{ order.boardCount }} boards</div>
                <div class="text-xs text-slate-500">{{ order.volume }}</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-emerald-600">{{ order.value }}</div>
                <div class="text-xs text-slate-500">{{ order.accuracy }}</div>
              </div>
              <Button variant="ghost" size="sm" class="text-slate-400 hover:text-slate-600">
                <MoreHorizontal class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        </CardContent>
      </Card>

      <!-- System Alerts -->
      <Card>
        <CardContent class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-slate-900">System Alerts</h3>
          <Button variant="link" class="text-emerald-600 hover:text-emerald-700 p-0">View All Alerts</Button>
        </div>
        <div class="text-sm text-slate-600 mb-4">Recent notifications and warnings</div>
        
        <div class="text-center py-8">
          <div class="text-gray-500">No system alerts available</div>
          <div class="text-sm text-gray-400 mt-2">API does not provide alert data</div>
        </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  Calendar, Clock, DollarSign, Package, MessageSquare, TrendingUp, TrendingDown,
  MoreHorizontal, Download, ChevronRight, AlertTriangle, FileText, RefreshCw, AlertCircle
} from 'lucide-vue-next'
import BarChart from '@/components/charts/BarChart.vue'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import CardContent from '@/components/ui/card-content.vue'
import Badge from '@/components/ui/badge.vue'
import LoadingSkeleton from '@/components/ui/loading-skeleton.vue'
import { useAsyncState } from '@/composables/useAsyncState'

// API data
const apiOrders = ref([])

// Get active order (OPEN status)
const activeOrder = computed(() => {
  return apiOrders.value.find(o => o.status === 'OPEN')
})

// Get total orders count
const totalOrders = computed(() => {
  return apiOrders.value.length
})

// Get recent orders from API data
const recentOrders = computed(() => {
  // Sort by ID (desc) to get most recent first, limit to 7 items
  const sorted = [...apiOrders.value].sort((a, b) => b.id - a.id).slice(0, 7)
  
  return sorted.map(order => ({
    id: order.id,
    name: order.name,
    orderId: `B-${order.id}`,
    customer: 'N/A', // Not in API
    status: order.status,
    boardCount: 'N/A', // Would need separate API call
    volume: 'N/A', // Not in API
    value: 'N/A', // Not in API
    accuracy: 'N/A', // Not in API
    startTime: order.startDate ? new Date(order.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
    species: order.specie?.name || 'N/A',
    dryStatus: order.dryStatus?.name || 'N/A'
  }))
})

// Chart data
const chartData = ref({
  labels: ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'],
  datasets: [
    {
      label: 'Grade A',
      data: [95, 145, 98, 45, 185, 95, 125, 165, 175],
      backgroundColor: '#059669',
      borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 }
    },
    {
      label: 'Grade B',
      data: [35, 45, 42, 25, 55, 35, 45, 55, 65],
      backgroundColor: '#10b981',
      borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 }
    },
    {
      label: 'Grade C',
      data: [25, 35, 28, 15, 35, 25, 35, 45, 35],
      backgroundColor: '#34d399',
      borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 }
    }
  ]
})


// Load dashboard data from API
const loadDashboardData = async () => {
  try {
    // Fetch orders from API using v3 endpoint (translated to legacy format)
    const response = await fetch('/api/v3/orders')
    if (!response.ok) throw new Error('Failed to fetch orders')
    const data = await response.json()
    apiOrders.value = data.data || []
    
    return { success: true }
  } catch (err) {
    console.error('Error loading dashboard data:', err)
    throw err
  }
}

const { isLoading, error, execute: retryLoad } = useAsyncState(
  loadDashboardData,
  null,
  {
    immediate: false
  }
)

onMounted(() => retryLoad())</script>