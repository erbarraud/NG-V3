<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">
            Grade Name
          </th>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">
            Type
          </th>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">
            Species
          </th>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">
            Description
          </th>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">
            Usage
          </th>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">
            Last Used
          </th>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-emerald-500">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr 
          v-for="grade in grades" 
          :key="grade.id" 
          class="hover:bg-emerald-50 transition-colors duration-150 cursor-pointer"
          @click="$emit('view-grade', grade)"
        >
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div :class="[
                  'w-3 h-3 rounded-full',
                  getColorClasses(grade.color).indicator
                ]"></div>
              </div>
              <div class="ml-3">
                <div class="text-sm font-medium text-gray-900">{{ grade.name }}</div>
                <div v-if="grade.isCustom" class="text-xs text-purple-600 font-medium">Custom Grade</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              grade.type === 'Hardwood' ? 'bg-green-100 text-green-800' :
              grade.type === 'Softwood' ? 'bg-blue-100 text-blue-800' :
              'bg-purple-100 text-purple-800'
            ]">
              {{ grade.type }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{{ grade.species }}</div>
          </td>
          <td class="px-6 py-4">
            <div class="text-sm text-gray-900 max-w-xs truncate" :title="grade.description">
              {{ grade.description }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <Package class="w-4 h-4 text-gray-400 mr-2" />
              <span class="text-sm font-medium text-gray-900">{{ grade.usageCount }}</span>
              <span class="text-sm text-gray-500 ml-1">orders</span>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{{ getLastUsedDate(grade) }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div class="flex items-center space-x-2">
              <button 
                @click.stop="$emit('edit-grade', grade)"
                class="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
                title="Edit Grade"
              >
                <Edit class="w-4 h-4" />
              </button>
              <button 
                @click.stop="$emit('duplicate-grade', grade)"
                class="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" 
                title="Duplicate"
              >
                <Copy class="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { Package, Edit, Copy } from 'lucide-vue-next'

defineProps({
  grades: {
    type: Array,
    required: true
  }
})

defineEmits(['view-grade', 'edit-grade', 'duplicate-grade'])

const getColorClasses = (color) => {
  const colorMap = {
    emerald: { indicator: 'bg-emerald-500' },
    blue: { indicator: 'bg-blue-500' },
    yellow: { indicator: 'bg-yellow-500' },
    orange: { indicator: 'bg-orange-500' }
  }
  return colorMap[color] || colorMap.emerald
}

const getLastUsedDate = (grade) => {
  if (!grade?.usageCount || grade.usageCount === 0) return 'Never'
  
  const daysAgo = Math.floor(Math.random() * 30) + 1
  const lastUsed = new Date()
  lastUsed.setDate(lastUsed.getDate() - daysAgo)
  
  return lastUsed.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}
</script>