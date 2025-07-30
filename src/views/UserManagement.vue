<template>
  <div class="w-full px-4 sm:px-6 lg:px-8 py-6">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-extrabold text-gray-900 mb-2">User Management</h1>
      <p class="text-gray-600 mt-1">Manage users, roles, and permissions for the Neural Grader system</p>
    </div>

    <!-- Tab Navigation -->
    <div class="mb-6">
      <nav class="flex space-x-8">
        <button 
          :class="[
            activeTab === 'users' 
              ? 'border-b-2 border-emerald-500 pb-2 text-sm font-semibold text-emerald-600'
              : 'pb-2 text-sm font-medium text-gray-500 hover:text-gray-700'
          ]"
          @click="activeTab = 'users'"
        >
          Users
        </button>
        <button 
          :class="[
            activeTab === 'roles' 
              ? 'border-b-2 border-emerald-500 pb-2 text-sm font-semibold text-emerald-600'
              : 'pb-2 text-sm font-medium text-gray-500 hover:text-gray-700'
          ]"
          @click="activeTab = 'roles'"
        >
          Roles & Permissions
        </button>
        <button 
          :class="[
            activeTab === 'security' 
              ? 'border-b-2 border-emerald-500 pb-2 text-sm font-semibold text-emerald-600'
              : 'pb-2 text-sm font-medium text-gray-500 hover:text-gray-700'
          ]"
          @click="activeTab = 'security'"
        >
          Security Settings
        </button>
      </nav>
    </div>

    <!-- Users Tab -->
    <div v-if="activeTab === 'users'">
      <!-- Search and Filters -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <div class="relative">
            <Search class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search users..." 
              v-model="searchQuery"
              class="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <select 
            v-model="selectedRole"
            class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Operator">Operator</option>
            <option value="Quality Manager">Quality Manager</option>
            <option value="Viewer">Viewer</option>
          </select>
          <select 
            v-model="selectedStatus"
            class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <Button @click="showAddUserModal = true">
          <UserPlus class="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <!-- Users Table -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">Name</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">Email</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">Role</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">Status</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">Last Login</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-emerald-50 transition-colors duration-150">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User class="h-5 w-5 text-gray-600" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getRoleBadgeClass(user.role)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div :class="user.status === 'Active' ? 'bg-emerald-400' : 'bg-gray-400'" class="w-2 h-2 rounded-full mr-2"></div>
                  <span class="text-sm text-gray-900">{{ user.status }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.lastLogin }}
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

    <!-- Roles & Permissions Tab -->
    <div v-if="activeTab === 'roles'" class="bg-white rounded-lg shadow p-6">
      <h3 class="text-2xl font-bold text-gray-900 mb-4">Role Management</h3>
      <p class="text-gray-600">Configure roles and their associated permissions for the Neural Grader system.</p>
      
      <div class="mt-6 space-y-4">
        <div v-for="role in roles" :key="role.name" class="border border-gray-200 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900">{{ role.name }}</h4>
          <p class="text-sm text-gray-600 mt-1">{{ role.description }}</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <span v-for="permission in role.permissions" :key="permission" 
                  class="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded">
              {{ permission }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Security Settings Tab -->
    <div v-if="activeTab === 'security'" class="bg-white rounded-lg shadow p-6">
      <h3 class="text-2xl font-bold text-gray-900 mb-4">Security Settings</h3>
      <p class="text-gray-600">Configure security policies and authentication requirements.</p>
      
      <div class="mt-6 space-y-6">
        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Password Policy</h4>
          <div class="space-y-2">
            <label class="flex items-center">
              <input type="checkbox" class="h-4 w-4 text-emerald-600 focus:ring-emerald-500" checked />
              <span class="ml-2 text-sm text-gray-700">Minimum 8 characters</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" class="h-4 w-4 text-emerald-600 focus:ring-emerald-500" checked />
              <span class="ml-2 text-sm text-gray-700">Require uppercase and lowercase letters</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" class="h-4 w-4 text-emerald-600 focus:ring-emerald-500" />
              <span class="ml-2 text-sm text-gray-700">Require special characters</span>
            </label>
          </div>
        </div>
        
        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Session Management</h4>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Session Timeout (hours)</label>
              <input type="number" value="8" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Max Concurrent Sessions</label>
              <input type="number" value="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, UserPlus, User, MoreHorizontal } from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'

const activeTab = ref('users')
const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const showAddUserModal = ref(false)

const users = ref([
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@neuralgrader.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: 'Mar 18, 2025 2:30 PM'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@neuralgrader.com',
    role: 'Quality Manager',
    status: 'Active',
    lastLogin: 'Mar 18, 2025 1:15 PM'
  },
  {
    id: 3,
    name: 'Mike Davis',
    email: 'mike.davis@neuralgrader.com',
    role: 'Operator',
    status: 'Active',
    lastLogin: 'Mar 18, 2025 9:45 AM'
  },
  {
    id: 4,
    name: 'Emily Wilson',
    email: 'emily.wilson@neuralgrader.com',
    role: 'Viewer',
    status: 'Inactive',
    lastLogin: 'Mar 15, 2025 4:20 PM'
  },
  {
    id: 5,
    name: 'Robert Chen',
    email: 'robert.chen@neuralgrader.com',
    role: 'Operator',
    status: 'Active',
    lastLogin: 'Mar 18, 2025 11:30 AM'
  }
])

const roles = ref([
  {
    name: 'Admin',
    description: 'Full system access including user management and system configuration',
    permissions: ['User Management', 'System Configuration', 'All Operations', 'Reports', 'Audit Logs']
  },
  {
    name: 'Quality Manager',
    description: 'Oversee quality control processes and review grading decisions',
    permissions: ['Quality Review', 'Grade Override', 'Reports', 'Claims Management']
  },
  {
    name: 'Operator',
    description: 'Day-to-day operations including running orders and monitoring lines',
    permissions: ['Production Orders', 'Line Monitoring', 'Board Inspection', 'Basic Reports']
  },
  {
    name: 'Viewer',
    description: 'Read-only access to reports and production data',
    permissions: ['View Reports', 'View Production Data', 'View Dashboard']
  }
])

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = !selectedRole.value || user.role === selectedRole.value
    const matchesStatus = !selectedStatus.value || user.status === selectedStatus.value
    
    return matchesSearch && matchesRole && matchesStatus
  })
})

const getRoleBadgeClass = (role) => {
  const classes = {
    'Admin': 'bg-emerald-100 text-emerald-800',
    'Quality Manager': 'bg-purple-100 text-purple-800',
    'Operator': 'bg-emerald-100 text-emerald-800',
    'Viewer': 'bg-gray-100 text-gray-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}
</script>