<template>
  <div class="grade-management"> <!-- root -->
    <div class="header-section w-full px-4 sm:px-6 lg:px-8 py-6"> <!-- header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Grade Management</h1>
          <p class="text-gray-600 mt-1">Manage lumber grading standards and templates</p>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Search Input -->
          <div class="relative">
            <Search class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search grades..."
              class="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <!-- Filter Dropdown -->
          <select class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
            <option value="">All Grade Types</option>
            <option value="hardwood">Hardwood</option>
            <option value="softwood">Softwood</option>
            <option value="custom">Custom</option>
          </select>
          
          <!-- Create New Grade Button -->
          <button class="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center">
            <Plus class="w-4 h-4 mr-2" />
            Create New Grade
          </button>
        </div>
      </div>
    </div> <!-- /header -->
    <div class="content-wrapper w-full px-4 sm:px-6 lg:px-8 py-6"> <!-- content -->
      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="animate-pulse">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div class="space-y-2 mb-4">
              <div class="h-3 bg-gray-200 rounded"></div>
              <div class="h-3 bg-gray-200 rounded w-5/6"></div>
              <div class="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
            <div class="flex justify-between items-center">
              <div class="h-6 bg-gray-200 rounded w-16"></div>
              <div class="flex space-x-2">
                <div class="h-8 w-8 bg-gray-200 rounded"></div>
                <div class="h-8 w-8 bg-gray-200 rounded"></div>
                <div class="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grade Cards Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="grade in gradeCards" 
          :key="grade.id"
          :class="[
            'bg-white rounded-lg border-2 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer',
            getColorClasses(grade.color).border,
            'hover:' + getColorClasses(grade.color).bg
          ]"
        >
          <!-- Card Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ grade.name }}</h3>
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getColorClasses(grade.color).badge
              ]">
                {{ grade.type }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <p class="text-sm text-gray-600 mb-4">{{ grade.description }}</p>

          <!-- Key Specifications -->
          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Key Specifications:</h4>
            <ul class="space-y-1">
              <li v-for="spec in grade.keySpecs" :key="spec" class="text-xs text-gray-600 flex items-start">
                <span class="w-1 h-1 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                {{ spec }}
              </li>
            </ul>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-4 border-t border-gray-100">
            <div class="text-sm text-gray-500">
              <span class="font-medium text-gray-900">{{ grade.usageCount }}</span> orders using
            </div>
            <div class="flex items-center space-x-1">
              <button class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View Details">
                <Eye class="w-4 h-4" />
              </button>
              <button class="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Edit Grade">
                <Edit class="w-4 h-4" />
              </button>
              <button class="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors" title="Duplicate">
                <Copy class="w-4 h-4" />
              </button>
              <button class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div> <!-- /content -->
  </div> <!-- /root -->
</template>

<script setup>
import { ref } from 'vue'
import { Search, Plus, Eye, Edit, Copy, Trash2 } from 'lucide-vue-next'

// Loading state
const isLoading = ref(false)

// Sample American Hardwood grades data
const gradeCards = ref([
  {
    id: 1,
    name: 'FAS (First and Seconds)',
    type: 'Hardwood',
    description: 'Highest grade with 83.3% clear face cuttings',
    keySpecs: [
      'Min width: 6 inches',
      'Min length: 8 feet',
      'Clear face: 83.3%',
      'Max defects: Minimal'
    ],
    usageCount: 24,
    color: 'emerald'
  },
  {
    id: 2,
    name: 'Select & Better',
    type: 'Hardwood',
    description: 'High quality grade combining FAS and Select',
    keySpecs: [
      'Min width: 4 inches',
      'Min length: 6 feet',
      'Clear face: 83.3%',
      'Good for staining'
    ],
    usageCount: 18,
    color: 'blue'
  },
  {
    id: 3,
    name: 'No.1 Common',
    type: 'Hardwood',
    description: 'Good grade suitable for most applications',
    keySpecs: [
      'Min width: 3 inches',
      'Min length: 4 feet',
      'Clear face: 66.7%',
      'Paint grade quality'
    ],
    usageCount: 32,
    color: 'yellow'
  },
  {
    id: 4,
    name: 'No.2A Common',
    type: 'Hardwood',
    description: 'Economy grade with character marks',
    keySpecs: [
      'Min width: 3 inches',
      'Min length: 4 feet',
      'Clear face: 50%',
      'Rustic appearance'
    ],
    usageCount: 15,
    color: 'orange'
  }
])

// Get color classes for cards
const getColorClasses = (color) => {
  const colorMap = {
    emerald: {
      border: 'border-emerald-200',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-800'
    },
    blue: {
      border: 'border-blue-200',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-800'
    },
    yellow: {
      border: 'border-yellow-200',
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      badge: 'bg-yellow-100 text-yellow-800'
    },
    orange: {
      border: 'border-orange-200',
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      badge: 'bg-orange-100 text-orange-800'
    }
  }
  return colorMap[color] || colorMap.emerald
}
</script>