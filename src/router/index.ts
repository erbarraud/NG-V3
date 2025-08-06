import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { authGuard, guestGuard, adminGuard } from './guards'

// Lazy load components for better performance
const Dashboard = () => import('../views/Dashboard.vue')
const ProductionOrders = () => import('../views/ProductionOrders.vue')
const CreateProductionOrder = () => import('../views/CreateProductionOrder.vue')
const OrderDetails = () => import('../views/OrderDetails.vue')
const AllOrders = () => import('../views/AllOrders.vue')
const PastOrders = () => import('../views/PastOrders.vue')
const LiveScanning = () => import('../views/LiveScanning.vue')
const LineCheck = () => import('../views/LineCheck.vue')
const LineCheckDashboard = () => import('../views/LineCheckDashboard.vue')
const BoardFinder = () => import('../views/BoardFinder.vue')
const BoardInspector = () => import('../views/BoardInspector.vue')
const ShiftScheduler = () => import('../views/ShiftScheduler.vue')
const UserManagement = () => import('../views/UserManagement.vue')
const ClaimsManagement = () => import('../views/ClaimsManagement.vue')
const GradeManagement = () => import('../views/GradeManagement.vue')
const CreateGrade = () => import('../views/CreateGrade.vue')
const Login = () => import('../views/Login.vue')
const NotFound = () => import('../views/error/NotFound.vue')
const ServerError = () => import('../views/error/ServerError.vue')
const NetworkError = () => import('../views/error/NetworkError.vue')
const Unauthorized = () => import('../views/error/Unauthorized.vue')
const Debug = () => import('../views/Debug.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: guestGuard,
    meta: {
      requiresAuth: false,
      title: 'Sign In'
    }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: authGuard,
    meta: {
      requiresAuth: true,
      permissions: ['view_dashboard'],
      title: 'Dashboard'
    }
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
    path: '/orders/:id',
    name: 'OrderDetails',
    component: OrderDetails,
    props: true
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
    path: '/scanning',
    name: 'LiveScanning',
    component: LiveScanning
  },
  {
    path: '/line-check',
    name: 'LineCheck',
    component: LineCheck
  },
  {
    path: '/line-check/dashboard',
    name: 'LineCheckDashboard',
    component: LineCheckDashboard
  },
  {
    path: '/board-finder',
    name: 'BoardFinder',
    component: BoardFinder
  },
  {
    path: '/board-inspector/:id?',
    name: 'BoardInspector',
    component: BoardInspector,
    props: true
  },
  {
    path: '/shift-scheduler',
    name: 'ShiftScheduler',
    component: ShiftScheduler
  },
  {
    name: 'UserManagement',
    path: '/user-management',
    component: UserManagement,
    beforeEnter: adminGuard,
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      permissions: ['manage_users'],
      title: 'User Management'
    }
  },
  {
    path: '/claims',
    name: 'ClaimsManagement',
    component: ClaimsManagement
  },
  {
    path: '/grade-management',
    name: 'GradeManagement',
    component: GradeManagement,
    beforeEnter: authGuard,
    meta: {
      requiresAuth: true,
      permissions: ['view_grades', 'manage_grades'],
      title: 'Grade Management'
    }
  },
  {
    path: '/grade-management/create',
    name: 'CreateGrade',
    component: CreateGrade,
    beforeEnter: authGuard,
    meta: {
      requiresAuth: true,
      permissions: ['create_grades', 'manage_grades'],
      title: 'Create Grade'
    }
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: Unauthorized,
    meta: {
      requiresAuth: false,
      title: 'Access Denied'
    }
  },
  {
    path: '/debug',
    name: 'Debug',
    component: Debug,
    beforeEnter: adminGuard,
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      title: 'Debug Dashboard'
    }
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

// Global navigation guard to initialize auth
router.beforeEach(async (to, from, next) => {
  // Initialize auth store on first navigation
  if (!from.name) {
    const { useAuthStore } = await import('@/stores/auth')
    const authStore = useAuthStore()
    authStore.initializeAuth()
  }
  
  next()
})

export default router