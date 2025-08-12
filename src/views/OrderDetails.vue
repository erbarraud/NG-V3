<template>
  <div class="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
    <!-- Loading State -->
    <div v-if="loading" class="space-y-8">
      <div class="flex items-center justify-between">
        <LoadingSkeleton variant="text" :rows="2" container-class="w-64" />
        <LoadingSkeleton variant="text" :rows="1" container-class="w-32" />
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <LoadingSkeleton variant="card" v-for="i in 4" :key="i" />
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="list" :rows="4" />
        </div>
        <div class="space-y-8">
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-64">
      <div class="text-center">
        <AlertCircle class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <Button @click="$router.push('/orders')">
          <ArrowLeft class="w-4 h-4 mr-2" />
          Back to Orders
        </Button>
      </div>
    </div>

    <!-- Order Details Content -->
    <div v-else-if="order">
      <!-- Page Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <Button variant="outline" @click="$router.go(-1)">
            <ArrowLeft class="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ order.name }}</h1>
            <p class="text-gray-600 mt-1">Order ID: {{ order.id }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <Badge :variant="getStatusVariant(order.status)" class="text-sm px-3 py-1">
            {{ order.status }}
          </Badge>
          <Button variant="outline">
            <Download class="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button v-if="order.status === 'Running'" variant="destructive">
            <Square class="w-4 h-4 mr-2" />
            Stop Order
          </Button>
          <Button v-else-if="order.status === 'Scheduled'">
            <Play class="w-4 h-4 mr-2" />
            Start Order
          </Button>
        </div>
      </div>

      <!-- Order Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent class="p-6">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                <Package class="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div class="text-sm text-gray-600">Total Volume</div>
                <div class="text-2xl font-bold text-gray-900">{{ order.volume }}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <BarChart3 class="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div class="text-sm text-gray-600">Boards Processed</div>
                <div class="text-2xl font-bold text-gray-900">{{ order.boardsProcessed || 0 }}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <DollarSign class="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div class="text-sm text-gray-600">Total Value</div>
                <div class="text-2xl font-bold text-gray-900">${{ order.totalValue || '0' }}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Target class="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div class="text-sm text-gray-600">Accuracy Rate</div>
                <div class="text-2xl font-bold text-gray-900">{{ order.accuracyRate || 'N/A' }}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Order Information -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Basic Information -->
          <Card>
            <CardContent class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Order Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div class="text-sm text-gray-600 mb-1">Customer</div>
                  <div class="font-medium text-gray-900">{{ order.customer }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-600 mb-1">Species</div>
                  <div class="font-medium text-gray-900">{{ order.species }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-600 mb-1">Dry Status</div>
                  <div class="font-medium text-gray-900">{{ order.dryStatus }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-600 mb-1">Scheduled Date</div>
                  <div class="font-medium text-gray-900">{{ order.date }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-600 mb-1">Time Slot</div>
                  <div class="font-medium text-gray-900">{{ order.time }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-600 mb-1">Operator</div>
                  <div class="font-medium text-gray-900">{{ order.operator || 'Not assigned' }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-600 mb-1">Sorts</div>
                  <div class="font-medium text-gray-900">{{ order.sorts?.length || 0 }} configured</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Grade Distribution -->
          <Card>
            <CardContent class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Grade Distribution</h3>
              <div class="space-y-4">
                <div v-for="grade in order.gradeDistribution" :key="grade.name" class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div :class="grade.color" class="w-4 h-4 rounded"></div>
                    <span class="font-medium text-gray-900">{{ grade.name }}</span>
                  </div>
                  <div class="flex items-center space-x-4">
                    <span class="text-sm text-gray-600">{{ grade.count }} boards</span>
                    <span class="font-semibold text-gray-900">{{ grade.percentage }}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Recent Activity -->
          <Card>
            <CardContent class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div class="space-y-4">
                <div v-for="activity in order.recentActivity" :key="activity.id" class="flex items-start space-x-3">
                  <div :class="activity.iconColor" class="w-8 h-8 rounded-full flex items-center justify-center mt-0.5">
                    <component :is="activity.icon" class="w-4 h-4 text-white" />
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900">{{ activity.title }}</div>
                    <div class="text-sm text-gray-600">{{ activity.description }}</div>
                    <div class="text-xs text-gray-500 mt-1">{{ activity.timestamp }}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Right Column - Progress & Actions -->
        <div class="space-y-8">
          <!-- Progress Tracking -->
          <Card>
            <CardContent class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Progress</h3>
              <div class="space-y-4">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-600">Completion</span>
                    <span class="text-sm font-medium text-gray-900">{{ order.completionPercentage }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-emerald-600 h-2 rounded-full transition-all duration-300" 
                      :style="{ width: order.completionPercentage + '%' }"
                    ></div>
                  </div>
                </div>
                
                <div v-if="order.status === 'Running'">
                  <div class="text-sm text-gray-600 mb-2">Time Remaining (Est.)</div>
                  <div class="text-lg font-semibold text-gray-900">{{ order.timeRemaining }}</div>
                </div>
                
                <div v-if="order.startTime">
                  <div class="text-sm text-gray-600 mb-2">Started</div>
                  <div class="text-sm font-medium text-gray-900">{{ order.startTime }}</div>
                </div>
                
                <div v-if="order.completedTime">
                  <div class="text-sm text-gray-600 mb-2">Completed</div>
                  <div class="text-sm font-medium text-gray-900">{{ order.completedTime }}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Quick Actions -->
          <Card>
            <CardContent class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div class="space-y-3">
                <Button class="w-full justify-start" variant="outline">
                  <Eye class="w-4 h-4 mr-2" />
                  View Boards
                </Button>
                <Button class="w-full justify-start" variant="outline">
                  <FileText class="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button class="w-full justify-start" variant="outline">
                  <Settings class="w-4 h-4 mr-2" />
                  Edit Order
                </Button>
                <Button class="w-full justify-start" variant="outline">
                  <Copy class="w-4 h-4 mr-2" />
                  Duplicate Order
                </Button>
              </div>
            </CardContent>
          </Card>

          <!-- Order Notes -->
          <Card>
            <CardContent class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Notes</h3>
              <div class="space-y-3">
                <textarea 
                  v-model="orderNotes"
                  placeholder="Add notes about this order..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  rows="4"
                ></textarea>
                <Button size="sm" class="w-full">
                  <Save class="w-4 h-4 mr-2" />
                  Save Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, AlertCircle, Download, Square, Play, Package, BarChart3, 
  DollarSign, Target, Eye, FileText, Settings, Copy, Save,
  CheckCircle, Clock, AlertTriangle
} from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import CardContent from '@/components/ui/card-content.vue'
import Badge from '@/components/ui/badge.vue'
import LoadingSkeleton from '@/components/ui/loading-skeleton.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref(null)
const order = ref(null)
const orderNotes = ref('')

// Sample order data - in a real app, this would come from an API
const sampleOrders = {
  'ORD-20250701-001': {
    id: 'ORD-20250701-001',
    name: 'Red Oak - Prime Run',
    customer: 'Johnson Lumber Co.',
    species: 'Red Oak',
    dryStatus: 'Kiln Dried (KD)',
    volume: '3,200 bf',
    date: 'Jul 1, 2025',
    time: '8:00 AM - 12:00 PM',
    status: 'Running',
    operator: 'John Smith',
    boardsProcessed: 125,
    totalValue: '24,680',
    accuracyRate: '92.1%',
    completionPercentage: 35,
    timeRemaining: '1h 58m',
    startTime: 'Jul 1, 2025 8:00 AM',
    gradeDistribution: [
      { name: 'FAS', count: 45, percentage: 36, color: 'bg-emerald-500' },
      { name: 'Select', count: 38, percentage: 30, color: 'bg-blue-500' },
      { name: '1 Common', count: 32, percentage: 26, color: 'bg-yellow-500' },
      { name: '2 Common', count: 10, percentage: 8, color: 'bg-orange-500' }
    ],
    recentActivity: [
      {
        id: 1,
        icon: CheckCircle,
        iconColor: 'bg-emerald-500',
        title: 'Batch B-4873 completed',
        description: '45 boards processed successfully',
        timestamp: '2 minutes ago'
      },
      {
        id: 2,
        icon: AlertTriangle,
        iconColor: 'bg-yellow-500',
        title: 'Quality alert',
        description: 'Lower than expected FAS grade percentage',
        timestamp: '15 minutes ago'
      },
      {
        id: 3,
        icon: Clock,
        iconColor: 'bg-blue-500',
        title: 'Order started',
        description: 'Production began on schedule',
        timestamp: '1 hour ago'
      }
    ]
  },
  'ORD-20250701-002': {
    id: 'ORD-20250701-002',
    name: 'Soft Maple - Special Order',
    customer: 'Artisan Furniture',
    species: 'Soft Maple',
    dryStatus: 'Green (Air Dried)',
    volume: '2,500 bf',
    date: 'Jul 1, 2025',
    time: '1:00 PM - 6:00 PM',
    status: 'Scheduled',
    operator: 'Sarah Johnson',
    boardsProcessed: 0,
    totalValue: '0',
    accuracyRate: 'N/A',
    completionPercentage: 0,
    gradeDistribution: [],
    recentActivity: [
      {
        id: 1,
        icon: Clock,
        iconColor: 'bg-blue-500',
        title: 'Order scheduled',
        description: 'Ready to start at 1:00 PM',
        timestamp: '2 hours ago'
      }
    ]
  }
}

onMounted(() => {
  const initializeOrder = async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const orderId = route.params.orderId
      const foundOrder = sampleOrders[orderId]
      
      if (foundOrder) {
        order.value = foundOrder
        orderNotes.value = foundOrder.notes || ''
      } else {
        error.value = `Order ${orderId} not found. Please check the order ID and try again.`
      }
    } catch (err) {
      error.value = 'Failed to load order details. Please try again later.'
    } finally {
      loading.value = false
    }
  }
  
  initializeOrder()
})

const getStatusVariant = (status) => {
  switch (status) {
    case 'Running':
      return 'default'
    case 'Scheduled':
      return 'secondary'
    case 'Completed':
      return 'outline'
    case 'Cancelled':
      return 'destructive'
    default:
      return 'secondary'
  }
}
</script>