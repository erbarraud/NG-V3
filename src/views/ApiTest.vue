<template>
  <div class="p-8 space-y-6">
    <h1 class="text-2xl font-bold">API Bridge Test</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Test Species Endpoint -->
      <Card>
        <CardContent class="p-4">
          <h2 class="text-lg font-semibold mb-2">Species</h2>
          <Button @click="testSpecies" :disabled="speciesLoading" variant="outline" size="sm">
            <RefreshCw v-if="speciesLoading" class="w-4 h-4 mr-2 animate-spin" />
            Test /species
          </Button>
          <div v-if="speciesError" class="mt-2 text-red-500 text-sm">
            Error: {{ speciesError.message }}
          </div>
          <div v-if="speciesData" class="mt-2 text-sm">
            <pre class="bg-gray-100 p-2 rounded overflow-auto max-h-40">{{ JSON.stringify(speciesData, null, 2) }}</pre>
          </div>
        </CardContent>
      </Card>

      <!-- Test Thickness Endpoint -->
      <Card>
        <CardContent class="p-4">
          <h2 class="text-lg font-semibold mb-2">Thickness Values</h2>
          <Button @click="testThickness" :disabled="thicknessLoading" variant="outline" size="sm">
            <RefreshCw v-if="thicknessLoading" class="w-4 h-4 mr-2 animate-spin" />
            Test /thickness
          </Button>
          <div v-if="thicknessError" class="mt-2 text-red-500 text-sm">
            Error: {{ thicknessError.message }}
          </div>
          <div v-if="thicknessData" class="mt-2 text-sm">
            <pre class="bg-gray-100 p-2 rounded overflow-auto max-h-40">{{ JSON.stringify(thicknessData, null, 2) }}</pre>
          </div>
        </CardContent>
      </Card>

      <!-- Test Batches Endpoint -->
      <Card>
        <CardContent class="p-4">
          <h2 class="text-lg font-semibold mb-2">Batches</h2>
          <Button @click="testBatches" :disabled="batchesLoading" variant="outline" size="sm">
            <RefreshCw v-if="batchesLoading" class="w-4 h-4 mr-2 animate-spin" />
            Test /batches
          </Button>
          <div v-if="batchesError" class="mt-2 text-red-500 text-sm">
            Error: {{ batchesError.message }}
          </div>
          <div v-if="batchesData" class="mt-2 text-sm">
            <pre class="bg-gray-100 p-2 rounded overflow-auto max-h-40">{{ JSON.stringify(batchesData, null, 2) }}</pre>
          </div>
        </CardContent>
      </Card>

      <!-- Test Custom Grades Endpoint -->
      <Card>
        <CardContent class="p-4">
          <h2 class="text-lg font-semibold mb-2">Custom Grades</h2>
          <Button @click="testCustomGrades" :disabled="gradesLoading" variant="outline" size="sm">
            <RefreshCw v-if="gradesLoading" class="w-4 h-4 mr-2 animate-spin" />
            Test /custom-grades
          </Button>
          <div v-if="gradesError" class="mt-2 text-red-500 text-sm">
            Error: {{ gradesError.message }}
          </div>
          <div v-if="gradesData" class="mt-2 text-sm">
            <pre class="bg-gray-100 p-2 rounded overflow-auto max-h-40">{{ JSON.stringify(gradesData, null, 2) }}</pre>
          </div>
        </CardContent>
      </Card>

      <!-- Test Open Batch Endpoint -->
      <Card>
        <CardContent class="p-4">
          <h2 class="text-lg font-semibold mb-2">Open Batch</h2>
          <Button @click="testOpenBatch" :disabled="openBatchLoading" variant="outline" size="sm">
            <RefreshCw v-if="openBatchLoading" class="w-4 h-4 mr-2 animate-spin" />
            Test /batches/open
          </Button>
          <div v-if="openBatchError" class="mt-2 text-red-500 text-sm">
            Error: {{ openBatchError.message }}
          </div>
          <div v-if="openBatchData" class="mt-2 text-sm">
            <pre class="bg-gray-100 p-2 rounded overflow-auto max-h-40">{{ JSON.stringify(openBatchData, null, 2) }}</pre>
          </div>
        </CardContent>
      </Card>

      <!-- Direct Legacy Test -->
      <Card>
        <CardContent class="p-4">
          <h2 class="text-lg font-semibold mb-2">Direct Legacy Test</h2>
          <Button @click="testDirectLegacy" :disabled="directLoading" variant="outline" size="sm">
            <RefreshCw v-if="directLoading" class="w-4 h-4 mr-2 animate-spin" />
            Test Direct Connection
          </Button>
          <div v-if="directError" class="mt-2 text-red-500 text-sm">
            Error: {{ directError }}
          </div>
          <div v-if="directData" class="mt-2 text-sm">
            <pre class="bg-gray-100 p-2 rounded overflow-auto max-h-40">{{ JSON.stringify(directData, null, 2) }}</pre>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Connection Status -->
    <Card>
      <CardContent class="p-4">
        <h2 class="text-lg font-semibold mb-2">Connection Details</h2>
        <div class="space-y-1 text-sm">
          <p><span class="font-medium">Legacy URL:</span> {{ legacyUrl }}</p>
          <p><span class="font-medium">V3 Base:</span> {{ v3Url }}</p>
          <p><span class="font-medium">Status:</span> 
            <span :class="connectionStatus === 'Connected' ? 'text-green-600' : 'text-orange-600'">
              {{ connectionStatus }}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import Card from '@/components/ui/card.vue'
import CardContent from '@/components/ui/card-content.vue'
import Button from '@/components/ui/button.vue'
import { RefreshCw } from 'lucide-vue-next'

const legacyUrl = import.meta.env.VITE_LEGACY_API_URL || 'Not configured'
const v3Url = import.meta.env.VITE_API_URL || '/api/v3'
const connectionStatus = ref('Testing...')

// Species test
const { 
  data: speciesData, 
  loading: speciesLoading, 
  error: speciesError, 
  execute: executeSpecies 
} = useApi('/api/v3/species')

const testSpecies = () => executeSpecies({})

// Thickness test
const { 
  data: thicknessData, 
  loading: thicknessLoading, 
  error: thicknessError, 
  execute: executeThickness 
} = useApi('/api/v3/thickness')

const testThickness = () => executeThickness()

// Batches test
const { 
  data: batchesData, 
  loading: batchesLoading, 
  error: batchesError, 
  execute: executeBatches 
} = useApi('/api/v3/batches')

const testBatches = () => executeBatches({ pageNumber: 0, pageSize: 10 })

// Custom grades test
const { 
  data: gradesData, 
  loading: gradesLoading, 
  error: gradesError, 
  execute: executeCustomGrades 
} = useApi('/api/v3/custom-grades')

const testCustomGrades = () => executeCustomGrades({ page: 0, size: 10 })

// Open batch test
const { 
  data: openBatchData, 
  loading: openBatchLoading, 
  error: openBatchError, 
  execute: executeOpenBatch 
} = useApi('/api/v3/batches/open')

const testOpenBatch = () => executeOpenBatch()

// Direct legacy test
const directData = ref(null)
const directError = ref(null)
const directLoading = ref(false)

const testDirectLegacy = async () => {
  directLoading.value = true
  directError.value = null
  directData.value = null
  
  try {
    // Use proxy in development
    const url = import.meta.env.DEV ? '/api/legacy/species' : `${legacyUrl}/species`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    const data = await response.json()
    directData.value = data
    connectionStatus.value = 'Connected'
  } catch (error: any) {
    directError.value = error.message || 'Unknown error'
    connectionStatus.value = 'Connection Failed'
  } finally {
    directLoading.value = false
  }
}

onMounted(() => {
  // Test connection on mount
  testDirectLegacy()
})
</script>