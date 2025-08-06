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
              No Active Shift
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
                  <div class="text-sm font-bold text-emerald-900">Morning - 7:00 AM</div>
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
                  <div class="text-lg font-bold text-slate-900">$24,680</div>
                </div>
              </div>
              <div class="flex items-center text-emerald-600">
                <TrendingUp class="h-3 w-3 mr-1" />
                <span class="text-xs font-semibold">+8.2%</span>
              </div>
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
                  <div class="text-lg font-bold text-slate-900">38.4 m³</div>
                </div>
              </div>
              <div class="flex items-center text-emerald-600">
                <TrendingUp class="h-3 w-3 mr-1" />
                <span class="text-xs font-semibold">+12.1%</span>
              </div>
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
                  <div class="text-xs font-medium text-slate-600">Feedback Submitted</div>
                  <div class="text-lg font-bold text-slate-900">34</div>
                </div>
              </div>
              <div class="flex items-center text-red-500">
                <TrendingDown class="h-3 w-3 mr-1" />
                <span class="text-xs font-semibold">-2.3%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Chart Section -->
        <div>
          <h3 class="text-lg font-semibold text-slate-900 mb-4">Boards Processed per Hour</h3>
          <div class="bg-white/40 rounded-lg p-4 border border-slate-100">
            <BarChart :data="chartData" height="256px" />
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
          <div class="flex items-center justify-between py-3 px-4 hover:bg-slate-50 rounded-xl border border-slate-100 transition-all duration-200 hover:shadow-md">
            <div class="flex items-center space-x-4 flex-1">
              <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <div>
                <div class="font-semibold text-slate-900">Red Oak - Premium Run</div>
                <div class="text-xs text-slate-500">
                  <router-link to="/orders/ORD-20250701-001" class="text-emerald-600 hover:text-emerald-800 hover:underline font-medium">
                    Order B-4873
                  </router-link>
                  • Started 09:15 AM
                </div>
              </div>
              <div class="text-sm text-slate-600">Johnson Lumber Co.</div>
              <Badge variant="default" class="bg-emerald-100 text-emerald-800">Active</Badge>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <div class="text-sm font-semibold text-slate-900">125 boards</div>
                <div class="text-xs text-slate-500">3.8 / 11.2 m³</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-emerald-600">$2,847</div>
                <div class="text-xs text-slate-500">92.1% acc</div>
              </div>
              <Button variant="ghost" size="sm" class="text-slate-400 hover:text-slate-600">
                <MoreHorizontal class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div class="flex items-center justify-between py-3 px-4 hover:bg-slate-50 rounded-xl border border-slate-100 transition-all duration-200 hover:shadow-md">
            <div class="flex items-center space-x-4 flex-1">
              <div class="w-2 h-2 bg-slate-400 rounded-full"></div>
              <div>
                <div class="font-semibold text-slate-900">Soft Maple - Special Order</div>
                <div class="text-xs text-slate-500">
                  <router-link to="/orders/ORD-20250701-002" class="text-emerald-600 hover:text-emerald-800 hover:underline font-medium">
                    Order B-4872
                  </router-link>
                  • 08:30 AM - 11:45 AM
                </div>
              </div>
              <div class="text-sm text-slate-600">Artisan Furniture</div>
              <Badge variant="secondary">Completed</Badge>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <div class="text-sm font-semibold text-slate-900">287 boards</div>
                <div class="text-xs text-slate-500">12.6 m³</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-emerald-600">$4,125</div>
                <div class="text-xs text-slate-500">91.8% acc</div>
              </div>
              <Button variant="ghost" size="sm" class="text-slate-400 hover:text-slate-600">
                <MoreHorizontal class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div class="flex items-center justify-between py-3 px-4 hover:bg-slate-50 rounded-xl border border-slate-100 transition-all duration-200 hover:shadow-md">
            <div class="flex items-center space-x-4 flex-1">
              <div class="w-2 h-2 bg-slate-400 rounded-full"></div>
              <div>
                <div class="font-semibold text-slate-900">White Oak - Flooring</div>
                <div class="text-xs text-slate-500">
                  <router-link to="/orders/ORD-20250702-003" class="text-emerald-600 hover:text-emerald-800 hover:underline font-medium">
                    Order B-4871
                  </router-link>
                  • 07:15 AM - 10:30 AM
                </div>
              </div>
              <div class="text-sm text-slate-600">Flooring Inc.</div>
              <span class="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-semibold">Completed</span>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <div class="text-sm font-semibold text-slate-900">198 boards</div>
                <div class="text-xs text-slate-500">9.9 m³</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-emerald-600">$3,672</div>
                <div class="text-xs text-slate-500">92.5% acc</div>
              </div>
              <Button variant="ghost" size="sm" class="text-slate-400 hover:text-slate-600">
                <MoreHorizontal class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div class="flex items-center justify-between py-3 px-4 hover:bg-slate-50 rounded-xl border border-slate-100 transition-all duration-200 hover:shadow-md">
            <div class="flex items-center space-x-4 flex-1">
              <div class="w-2 h-2 bg-slate-400 rounded-full"></div>
              <div>
                <div class="font-semibold text-slate-900">Cherry - Cabinet Grade</div>
                <div class="text-xs text-slate-500">
                  <router-link to="/orders/ORD-20250630-004" class="text-emerald-600 hover:text-emerald-800 hover:underline font-medium">
                    Order B-4870
                  </router-link>
                  • 14:20 PM - 17:45 PM
                </div>
              </div>
              <div class="text-sm text-slate-600">Cabinet Masters</div>
              <span class="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-semibold">Completed</span>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <div class="text-sm font-semibold text-slate-900">342 boards</div>
                <div class="text-xs text-slate-500">15.2 m³</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-emerald-600">$5,890</div>
                <div class="text-xs text-slate-500">89.3% acc</div>
              </div>
              <Button variant="ghost" size="sm" class="text-slate-400 hover:text-slate-600">
                <MoreHorizontal class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div class="flex items-center justify-between py-3 px-4 hover:bg-slate-50 rounded-xl border border-slate-100 transition-all duration-200 hover:shadow-md">
            <div class="flex items-center space-x-4 flex-1">
              <div class="w-2 h-2 bg-slate-400 rounded-full"></div>
              <div>
                <div class="font-semibold text-slate-900">Hard Maple - Premium</div>
                <div class="text-xs text-slate-500">
                  <router-link to="/orders/ORD-20250629-005" class="text-emerald-600 hover:text-emerald-800 hover:underline font-medium">
                    Order B-4869
                  </router-link>
                  • 09:00 AM - 13:30 PM
                </div>
              </div>
              <div class="text-sm text-slate-600">Premium Hardwoods</div>
              <span class="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-semibold">Completed</span>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <div class="text-sm font-semibold text-slate-900">421 boards</div>
                <div class="text-xs text-slate-500">18.7 m³</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-emerald-600">$7,234</div>
                <div class="text-xs text-slate-500">94.1% acc</div>
              </div>
              <Button variant="ghost" size="sm" class="text-slate-400 hover:text-slate-600">
                <MoreHorizontal class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div class="flex items-center justify-between py-3 px-4 hover:bg-slate-50 rounded-xl border border-slate-100 transition-all duration-200 hover:shadow-md">
            <div class="flex items-center space-x-4 flex-1">
              <div class="w-2 h-2 bg-slate-400 rounded-full"></div>
              <div>
                <div class="font-semibold text-slate-900">Walnut - Select Grade</div>
                <div class="text-xs text-slate-500">
                  <router-link to="/orders/ORD-20250628-006" class="text-emerald-600 hover:text-emerald-800 hover:underline font-medium">
                    Order B-4868
                  </router-link>
                  • 11:15 AM - 15:20 PM
                </div>
              </div>
              <div class="text-sm text-slate-600">Luxury Millwork</div>
              <span class="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-semibold">Completed</span>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <div class="text-sm font-semibold text-slate-900">156 boards</div>
                <div class="text-xs text-slate-500">22.1 m³</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-emerald-600">$8,945</div>
                <div class="text-xs text-slate-500">90.7% acc</div>
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
        
        <div class="space-y-4">
          <div class="flex items-start space-x-3 p-3 bg-orange-50 border-l-4 border-orange-400 rounded-xl">
            <AlertTriangle class="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-slate-900">Accuracy Drop Detected</div>
              <div class="text-sm text-slate-600 mt-1">Batch #4872 showed 5% lower accuracy than average</div>
              <div class="text-xs text-slate-500 mt-2 flex items-center">
                <Clock class="w-3 h-3 mr-1" />
                2 hours ago
              </div>
            </div>
          </div>

          <div class="flex items-start space-x-3 p-3 bg-emerald-50 border-l-4 border-emerald-400 rounded-xl">
            <FileText class="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-slate-900">New Grading Rule Added</div>
              <div class="text-sm text-slate-600 mt-1">Admin user added a new rule for knot detection</div>
              <div class="text-xs text-slate-500 mt-2 flex items-center">
                <Clock class="w-3 h-3 mr-1" />
                Jul 24, 2025
              </div>
            </div>
          </div>
        </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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


// Simulate async data loading
const loadDashboardData = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Simulate potential error (uncomment to test error state)
  // if (Math.random() > 0.8) {
  //   throw new Error('Failed to fetch dashboard data')
  // }
  
  return { success: true }
}

const { isLoading, error, execute: retryLoad } = useAsyncState(
  loadDashboardData,
  null,
  {
    immediate: false
  }
)

onMounted(() => retryLoad())</script>