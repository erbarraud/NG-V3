import { createRouter, createWebHistory } from 'vue-router'
import PageLoading from '../components/ui/page-loading.vue'
import NotFound from '../views/error/NotFound.vue'
import ServerError from '../views/error/ServerError.vue'
import NetworkError from '../views/error/NetworkError.vue'
import Dashboard from '../views/Dashboard.vue'
import ProductionOrders from '../views/ProductionOrders.vue'
import CreateProductionOrder from '../views/CreateProductionOrder.vue'
import UserManagement from '../views/UserManagement.vue'
import ShiftScheduler from '../views/ShiftScheduler.vue'
import ClaimsManagement from '../views/ClaimsManagement.vue'
import LineCheck from '../views/LineCheck.vue'
import LiveScanning from '../views/LiveScanning.vue'
import BoardFinder from '../views/BoardFinder.vue'
import BoardInspector from '../views/BoardInspector.vue'
import AllOrders from '../views/AllOrders.vue'
import PastOrders from '../views/PastOrders.vue'
import LineCheckDashboard from '../views/LineCheckDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/orders',
    name: 'ProductionOrders',
    component: ProductionOrders
  },
  {
    path: '/orders/create',
    name: 'CreateProductionOrder',
    component: CreateProductionOrder
  },
  {
    path: '/orders/all',
    name: 'AllOrders',
    component: AllOrders
  },
  {
    path: '/orders/past',
    name: 'PastOrders',
    component: PastOrders
  },
  {
    path: '/users',
    name: 'UserManagement',
    component: UserManagement
  },
  {
    path: '/scheduler',
    name: 'ShiftScheduler',
    component: ShiftScheduler
  },
  {
    path: '/claims',
    name: 'ClaimsManagement',
    component: ClaimsManagement
  },
  {
    path: '/line',
    name: 'LineCheckDashboard',
    component: LineCheckDashboard
  },
  {
    path: '/scanning',
    name: 'LiveScanning',
    component: LiveScanning
  },
  {
    path: '/inspector',
    name: 'BoardInspector',
    component: BoardInspector
  },
  {
    path: '/finder',
    name: 'BoardFinder',
    component: BoardFinder
  },
  {
    path: '/orders/:orderId',
    name: 'OrderDetails',
    component: () => import('../views/OrderDetails.vue'),
    props: true
  },
  {
    path: '/inspector/:boardId',
    name: 'BoardInspectorWithId',
    component: () => import('../views/BoardInspector.vue'),
    props: true
  },
  {
    path: '/error/server',
    name: 'ServerError',
    component: ServerError
  },
  {
    path: '/error/network',
    name: 'NetworkError',
    component: NetworkError
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global loading state management
let loadingComponent = null

/**
 * Show loading indicator for route transitions
 */
const showRouteLoading = () => {
  if (!loadingComponent) {
    loadingComponent = document.createElement('div')
    loadingComponent.id = 'route-loading'
    loadingComponent.innerHTML = `
      <div class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div class="text-center space-y-4">
          <img src="/Asset 3@4x 1.png" alt="Neural Grader" class="h-12 w-auto mx-auto brightness-110" />
          <div class="flex items-center space-x-2">
            <div class="animate-spin rounded-full h-6 w-6 border-4 border-primary border-r-transparent"></div>
            <span class="text-sm font-medium text-foreground">Loading...</span>
          </div>
        </div>
      </div>
    `
    document.body.appendChild(loadingComponent)
  }
}

/**
 * Hide loading indicator
 */
const hideRouteLoading = () => {
  if (loadingComponent) {
    document.body.removeChild(loadingComponent)
    loadingComponent = null
  }
}

// Navigation guards for loading states
router.beforeEach((to, from, next) => {
  // Show loading for route changes (except for error pages)
  if (!to.path.startsWith('/error/') && to.name !== 'NotFound') {
    // Only show loading for slow transitions
    const loadingTimeout = setTimeout(showRouteLoading, 200)
    to.meta.loadingTimeout = loadingTimeout
  }
  
  next()
})

router.afterEach((to, from) => {
  // Clear loading timeout if it exists
  if (to.meta.loadingTimeout) {
    clearTimeout(to.meta.loadingTimeout)
  }
  
  hideRouteLoading()
})

// Global error handler for navigation errors
router.onError((error) => {
  console.error('Router error:', error)
  
  hideRouteLoading()
  
  // Redirect to appropriate error page based on error type
  if (error.message.includes('Loading chunk') || error.message.includes('Network')) {
    router.push('/error/network')
  } else {
    router.push('/error/server')
  }
})

export default router