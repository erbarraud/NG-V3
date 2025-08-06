<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Debug & Monitoring Dashboard</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Error Stats -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Error Statistics</h2>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Total Logs:</span>
              <span class="font-medium">{{ errorStats.total }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-red-600">Errors:</span>
              <span class="font-medium text-red-600">{{ errorStats.errors }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-yellow-600">Warnings:</span>
              <span class="font-medium text-yellow-600">{{ errorStats.warnings }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-blue-600">Info:</span>
              <span class="font-medium text-blue-600">{{ errorStats.info }}</span>
            </div>
          </div>
        </div>

        <!-- Performance Stats -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Performance</h2>
          <div class="space-y-3">
            <div v-if="performanceReport.vitals.fcp" class="flex justify-between">
              <span class="text-gray-600">FCP:</span>
              <span class="font-medium">{{ performanceReport.vitals.fcp.toFixed(0) }}ms</span>
            </div>
            <div v-if="performanceReport.vitals.lcp" class="flex justify-between">
              <span class="text-gray-600">LCP:</span>
              <span class="font-medium">{{ performanceReport.vitals.lcp.toFixed(0) }}ms</span>
            </div>
            <div v-if="performanceReport.vitals.ttfb" class="flex justify-between">
              <span class="text-gray-600">TTFB:</span>
              <span class="font-medium">{{ performanceReport.vitals.ttfb.toFixed(0) }}ms</span>
            </div>
            <div v-if="performanceReport.vitals.cls" class="flex justify-between">
              <span class="text-gray-600">CLS:</span>
              <span class="font-medium">{{ performanceReport.vitals.cls.toFixed(4) }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
          <div class="space-y-3">
            <button
              @click="clearAllLogs"
              class="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Clear Logs
            </button>
            <button
              @click="downloadLogs('json')"
              class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Export JSON
            </button>
            <button
              @click="downloadLogs('csv')"
              class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Export CSV
            </button>
            <button
              @click="showPerformanceReport"
              class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Log Performance
            </button>
          </div>
        </div>
      </div>

      <!-- Error Logs Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Recent Error Logs</h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Component
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="log in recentLogs" :key="log.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatTime(log.timestamp) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    log.level === 'error' ? 'bg-red-100 text-red-800' :
                    log.level === 'warn' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  ]">
                    {{ log.level.toUpperCase() }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 max-w-md truncate" :title="log.message">
                  {{ log.message }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ log.componentName || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ log.route || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    @click="showLogDetails(log)"
                    class="text-indigo-600 hover:text-indigo-900 font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
              
              <tr v-if="recentLogs.length === 0">
                <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                  No error logs found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Log Details Modal -->
      <div v-if="selectedLog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="selectedLog = null">
        <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Error Log Details</h3>
            <button @click="selectedLog = null" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>
          
          <div class="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
            <pre class="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">{{ JSON.stringify(selectedLog, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { X } from 'lucide-vue-next'
import { useErrorLogging } from '@/composables/useErrorLogging'
import { usePerformance } from '@/composables/usePerformance'

const errorLogging = useErrorLogging()
const performance = usePerformance()

const selectedLog = ref(null)

const errorStats = computed(() => errorLogging.getLogStats())
const recentLogs = computed(() => errorLogging.getLogs().slice(0, 50))
const performanceReport = computed(() => performance.getReport())

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString()
}

const clearAllLogs = () => {
  if (confirm('Are you sure you want to clear all logs?')) {
    errorLogging.clearLogs()
  }
}

const downloadLogs = (format: 'json' | 'csv') => {
  errorLogging.downloadLogs(format)
}

const showLogDetails = (log: any) => {
  selectedLog.value = log
}

const showPerformanceReport = () => {
  performance.logReport()
}

// Demo error logging
const generateTestError = () => {
  try {
    throw new Error('Test error for debugging')
  } catch (error) {
    errorLogging.logError(error, 'error', { 
      component: 'Debug', 
      action: 'generateTestError' 
    })
  }
}

onMounted(() => {
  // Generate a test log entry for demo purposes
  if (errorStats.value.total === 0) {
    errorLogging.logError('Welcome to the debug dashboard!', 'info', {
      component: 'Debug',
      action: 'mounted'
    })
  }
})
</script>