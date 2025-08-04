import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import ProductionOrders from '../views/ProductionOrders.vue'
import CreateProductionOrder from '../views/CreateProductionOrder.vue'
import OrderDetails from '../views/OrderDetails.vue'
import AllOrders from '../views/AllOrders.vue'
import PastOrders from '../views/PastOrders.vue'
import LiveScanning from '../views/LiveScanning.vue'
import LineCheck from '../views/LineCheck.vue'
import LineCheckDashboard from '../views/LineCheckDashboard.vue'
import BoardFinder from '../views/BoardFinder.vue'
import BoardInspector from '../views/BoardInspector.vue'
import ShiftScheduler from '../views/ShiftScheduler.vue'
import UserManagement from '../views/UserManagement.vue'
import ClaimsManagement from '../views/ClaimsManagement.vue'
import GradeManagement from '../views/GradeManagement.vue'
import NotFound from '../views/error/NotFound.vue'
import ServerError from '../views/error/ServerError.vue'
import NetworkError from '../views/error/NetworkError.vue'

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
    component: UserManagement
  },
  {
    path: '/claims',
    name: 'ClaimsManagement',
    component: ClaimsManagement
  },
  {
    path: '/grade-management',
    name: 'GradeManagement',
    component: GradeManagement
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

export default router