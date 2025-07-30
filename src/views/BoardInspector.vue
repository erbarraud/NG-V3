<template>
  <div class="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-1">Board Inspector</h1>
        <p class="text-gray-600">Find and analyze boards in the system</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="text-right">
          <div class="text-sm text-gray-600">Order: B-4873 - Red Oak 4/4 Premium</div>
        </div>
        <Button variant="outline" class="flex items-center">
          <List class="w-4 h-4 mr-2" />
          View All Boards in This Order
        </Button>
      </div>
    </div>

    <!-- Board Navigation Card -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-4">
          <button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <div class="text-sm text-gray-600">
              Order: <router-link to="/orders/ORD-20250701-001" class="text-emerald-600 hover:text-emerald-800 hover:underline font-medium">B-4873</router-link> - Red Oak 4/4 Premium
            </div>
          </button>
          <div class="flex items-center space-x-3">
            <h2 class="text-2xl font-bold text-gray-900">{{ currentBoardId }}</h2>
            <span class="px-3 py-1 bg-emerald-600 text-white text-sm font-medium rounded-full">1COMMON</span>
            <button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight class="w-5 h-5" />
            </button>
          </div>
          <div class="flex items-center space-x-4 text-sm text-gray-600">
            <div class="flex items-center">
              <TreePine class="w-4 h-4 mr-1" />
              <span>Red Oak</span>
            </div>
            <div class="flex items-center">
              <Droplets class="w-4 h-4 mr-1" />
              <span>Kiln Dried</span>
            </div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm text-gray-600">Value</div>
          <div class="text-2xl font-bold text-gray-900">$4.90</div>
        </div>
      </div>

      <!-- Timestamp -->
      <div class="flex items-center text-sm text-gray-500 mb-6">
        <Clock class="w-4 h-4 mr-1" />
        03/18/2025 3:58 PM
      </div>

      <!-- Board Specifications -->
      <div class="grid grid-cols-6 gap-6 mb-8">
        <div class="text-center">
          <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div class="flex items-center justify-center mb-2">
              <Ruler class="w-5 h-5 text-amber-600 mr-1" />
              <span class="text-sm font-medium text-gray-700">Length</span>
            </div>
            <div class="text-lg font-bold text-gray-900">8' 3 3/4"</div>
          </div>
        </div>
        <div class="text-center">
          <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div class="flex items-center justify-center mb-2">
              <ArrowLeftRight class="w-5 h-5 text-blue-600 mr-1" />
              <span class="text-sm font-medium text-gray-700">Width</span>
            </div>
            <div class="text-lg font-bold text-gray-900">5 1/2"</div>
          </div>
        </div>
        <div class="text-center">
          <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div class="flex items-center justify-center mb-2">
              <Layers class="w-5 h-5 text-purple-600 mr-1" />
              <span class="text-sm font-medium text-gray-700">Thickness</span>
            </div>
            <div class="text-lg font-bold text-gray-900">15/16"</div>
          </div>
        </div>
        <div class="text-center">
          <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div class="flex items-center justify-center mb-2">
              <Box class="w-5 h-5 text-green-600 mr-1" />
              <span class="text-sm font-medium text-gray-700">Volume</span>
            </div>
            <div class="text-lg font-bold text-gray-900">4 bf</div>
          </div>
        </div>
        <div class="text-center">
          <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div class="flex items-center justify-center mb-2">
              <AlertTriangle class="w-5 h-5 text-red-600 mr-1" />
              <span class="text-sm font-medium text-gray-700">Total Defects</span>
            </div>
            <div class="text-lg font-bold text-gray-900">2</div>
          </div>
        </div>
        <div class="text-center">
          <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div class="flex items-center justify-center mb-2">
              <TrendingUp class="w-5 h-5 text-indigo-600 mr-1" />
              <span class="text-sm font-medium text-gray-700">Yield</span>
            </div>
            <div class="text-lg font-bold text-gray-900">85%</div>
          </div>
        </div>
      </div>

      <!-- Inspector Tools -->
      <div class="flex flex-wrap gap-3 mb-6">
        <button 
          @click="toggleMagnifier"
          :class="[
            'flex items-center px-3 py-1.5 text-sm font-medium bg-white border-2 rounded-md hover:bg-gray-50 transition-colors',
            magnifierEnabled 
              ? 'text-emerald-600 border-emerald-300' 
              : 'text-gray-600 border-gray-300'
          ]"
        >
          <ZoomIn class="w-4 h-4 mr-2" />
          {{ magnifierEnabled ? 'Disable Magnifier' : 'Enable Magnifier' }}
        </button>
        <button class="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          <EyeOff class="w-4 h-4 mr-2" />
          Hide Minor Defects
        </button>
        <button class="flex items-center px-3 py-1.5 text-sm font-medium text-emerald-600 bg-white border-2 border-emerald-300 rounded-md hover:bg-gray-50 transition-colors">
          <CheckCircle class="w-4 h-4 mr-2" />
          Agree with NG AI
        </button>
        <button class="flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-white border-2 border-red-300 rounded-md hover:bg-gray-50 transition-colors">
          <XCircle class="w-4 h-4 mr-2" />
          Disagree with NG AI
        </button>
        <button class="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          <FileText class="w-4 h-4 mr-2" />
          See rejected rules
        </button>
        <button class="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          <BookOpen class="w-4 h-4 mr-2" />
          Add to Reference Bundle
        </button>
      </div>
    </div>

    <!-- Face 1 -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-3">Face 1</h3>
      <div class="bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div 
          class="bg-gray-100 flex items-center justify-center relative"
          @mousemove="(event) => handleMouseMove(event, 'face1')"
          @mouseenter="() => handleMouseEnter('face1')"
          @mouseleave="handleMouseLeave"
          ref="face1Container"
          style="overflow: visible;"
        >
          <img 
            src="/image.png" 
            alt="Board Face 1" 
            class="w-full h-auto object-contain"
            ref="face1Image"
            @load="onImageLoad"
          />
          
          <!-- Magnifier Window -->
          <div
            v-if="showMagnifier && magnifierEnabled && activeMagnifierBoard === 'face1'"
            :style="magnifierStyle"
            class="fixed pointer-events-none border-2 border-white shadow-lg rounded-lg overflow-hidden z-50"
          >
            <div
              :style="magnifiedImageStyle"
              class="w-full h-full bg-no-repeat"
            ></div>
          </div>
        </div>
      </div>
      <!-- Defect Tags -->
      <div class="flex flex-wrap gap-2 mt-3">
        <button 
          v-for="defect in face1DefectTypes" 
          :key="defect.name"
          @click="toggleDefect('face1', defect.name)"
          :class="[
            'px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 border-2',
            isDefectVisible('face1', defect.name)
              ? `${defect.activeClass} ${defect.activeBorder} shadow-md`
              : `${defect.inactiveClass} ${defect.inactiveBorder} opacity-50 hover:opacity-75`
          ]"
        >
          {{ defect.name }}
        </button>
      </div>
    </div>

    <!-- Face 2 -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-3">Face 2</h3>
      <div class="bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div 
          class="bg-gray-100 flex items-center justify-center relative"
          @mousemove="(event) => handleMouseMove(event, 'face2')"
          @mouseenter="() => handleMouseEnter('face2')"
          @mouseleave="handleMouseLeave"
          ref="face2Container"
          style="overflow: visible;"
        >
          <img 
            src="/image.png" 
            alt="Board Face 2" 
            class="w-full h-auto object-contain"
            ref="face2Image"
            @load="onImageLoad"
          />
          
          <!-- Magnifier Window -->
          <div
            v-if="showMagnifier && magnifierEnabled && activeMagnifierBoard === 'face2'"
            :style="magnifierStyle"
            class="fixed pointer-events-none border-2 border-white shadow-lg rounded-lg overflow-hidden z-50"
          >
            <div
              :style="magnifiedImageStyle"
              class="w-full h-full bg-no-repeat"
            ></div>
          </div>
        </div>
      </div>
      <!-- Defect Tags -->
      <div class="flex flex-wrap gap-2 mt-3">
        <button 
          v-for="defect in face2DefectTypes" 
          :key="defect.name"
          @click="toggleDefect('face2', defect.name)"
          :class="[
            'px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 border-2',
            isDefectVisible('face2', defect.name)
              ? `${defect.activeClass} ${defect.activeBorder} shadow-md`
              : `${defect.inactiveClass} ${defect.inactiveBorder} opacity-50 hover:opacity-75`
          ]"
        >
          {{ defect.name }}
        </button>
      </div>
    </div>

    <!-- Clear Cuttings -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Face 1 Clear Cuttings -->
      <div>
        <h4 class="text-lg font-semibold text-gray-900 mb-4">Clear Cuttings (Face 1)</h4>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-gray-700">6' 2 3/4" × 5 3/8"</span>
            <span class="font-semibold text-gray-900">33.28 units</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-700">2' × 4 13/16"</span>
            <span class="font-semibold text-gray-900">9.64 units</span>
          </div>
          <div class="border-t border-gray-200 pt-3">
            <div class="flex items-center justify-between">
              <span class="font-semibold text-gray-900">Total Units:</span>
              <span class="text-xl font-bold text-gray-900">43</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Face 2 Clear Cuttings -->
      <div>
        <h4 class="text-lg font-semibold text-gray-900 mb-4">Clear Cuttings (Face 2)</h4>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-gray-700">3' 3 3/4" × 5 3/16"</span>
            <span class="font-semibold text-gray-900">17.2 units</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-700">3' 5 3/4" × 4 7/8"</span>
            <span class="font-semibold text-gray-900">16.83 units</span>
          </div>
          <div class="border-t border-gray-200 pt-3">
            <div class="flex items-center justify-between">
              <span class="font-semibold text-gray-900">Total Units:</span>
              <span class="text-xl font-bold text-gray-900">34</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Previously Scanned Boards -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Previously Scanned Boards</h3>
            <p class="text-sm text-gray-600 mt-1">All boards from the current sorting order</p>
          </div>
          <div class="relative">
            <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search boards..."
              class="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-64"
            />
          </div>
        </div>
      </div>
      
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Board ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scan Time</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Defects</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <router-link 
                  to="/inspector/BRD-58918"
                  class="text-sm font-medium text-emerald-600 hover:text-emerald-800 hover:underline"
                >
                  BRD-58918
                </router-link>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">03/18/2025 3:40 PM</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                  1COMMON
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">-</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button class="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100" title="Reprocess">
                    <RotateCcw class="w-4 h-4" />
                  </button>
                  <button class="text-emerald-600 hover:text-emerald-800 text-sm">View</button>
                </div>
              </td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <router-link 
                  to="/inspector/BRD-58917"
                  class="text-sm font-medium text-emerald-600 hover:text-emerald-800 hover:underline"
                >
                  BRD-58917
                </router-link>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">03/18/2025 3:40 PM</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                  1COMMON
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <span class="px-2 py-1 text-xs rounded bg-red-100 text-red-800">Knot</span>
                  <span class="text-xs text-gray-500">+1</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button class="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100" title="Reprocess">
                    <RotateCcw class="w-4 h-4" />
                  </button>
                  <button class="text-emerald-600 hover:text-emerald-800 text-sm">View</button>
                </div>
              </td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <router-link 
                  to="/inspector/BRD-58916"
                  class="text-sm font-medium text-emerald-600 hover:text-emerald-800 hover:underline"
                >
                  BRD-58916
                </router-link>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">03/18/2025 3:39 PM</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                  1COMMON
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <span class="px-2 py-1 text-xs rounded bg-red-100 text-red-800">Knot</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button class="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100" title="Reprocess">
                    <RotateCcw class="w-4 h-4" />
                  </button>
                  <button class="text-emerald-600 hover:text-emerald-800 text-sm">View</button>
                </div>
              </td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <router-link 
                  to="/inspector/BRD-58915"
                  class="text-sm font-medium text-emerald-600 hover:text-emerald-800 hover:underline"
                >
                  BRD-58915
                </router-link>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">03/18/2025 3:39 PM</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                  1COMMON
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <span class="px-2 py-1 text-xs rounded bg-orange-100 text-orange-800">Split</span>
                  <span class="text-xs text-gray-500">+1</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button class="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100" title="Reprocess">
                    <RotateCcw class="w-4 h-4" />
                  </button>
                  <button class="text-emerald-600 hover:text-emerald-800 text-sm">View</button>
                </div>
              </td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <router-link 
                  to="/inspector/BRD-58914"
                  class="text-sm font-medium text-emerald-600 hover:text-emerald-800 hover:underline"
                >
                  BRD-58914
                </router-link>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">03/18/2025 3:38 PM</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  2COMMON
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <span class="px-2 py-1 text-xs rounded bg-red-100 text-red-800">Knot</span>
                  <span class="text-xs text-gray-500">+2</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button class="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100" title="Reprocess">
                    <RotateCcw class="w-4 h-4" />
                  </button>
                  <button class="text-emerald-600 hover:text-emerald-800 text-sm">View</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Clock, Ruler, Layers, TreePine, Droplets,
  ZoomIn, EyeOff, CheckCircle, XCircle, FileText, BookOpen, List,
  Search, RotateCcw, ArrowLeftRight, Box, AlertTriangle, TrendingUp
} from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'

const route = useRoute()

// Get board ID from route params or default
const currentBoardId = computed(() => route.params.boardId || 'BRD-4625')

// Magnifier state
const magnifierEnabled = ref(false)
const showMagnifier = ref(false)
const mousePosition = ref({ x: 0, y: 0 })
const activeMagnifierBoard = ref(null) // Track which board has active magnifier
const magnifierSize = 200
const magnificationLevel = 2.5

// Template refs
const face1Container = ref(null)
const face2Container = ref(null)
const face1Image = ref(null)
const face2Image = ref(null)

// Defect types with styling
const face1DefectTypes = ref([
  { 
    name: 'Knot', 
    activeClass: 'bg-red-500 text-white', 
    activeBorder: 'border-red-600',
    inactiveClass: 'bg-red-50 text-red-700', 
    inactiveBorder: 'border-red-200'
  },
  { 
    name: 'Split', 
    activeClass: 'bg-orange-500 text-white', 
    activeBorder: 'border-orange-600',
    inactiveClass: 'bg-orange-50 text-orange-700', 
    inactiveBorder: 'border-orange-200'
  },
  { 
    name: 'Wane', 
    activeClass: 'bg-amber-500 text-white', 
    activeBorder: 'border-amber-600',
    inactiveClass: 'bg-amber-50 text-amber-700', 
    inactiveBorder: 'border-amber-200'
  },
  { 
    name: 'Stain', 
    activeClass: 'bg-violet-500 text-white', 
    activeBorder: 'border-violet-600',
    inactiveClass: 'bg-violet-50 text-violet-700', 
    inactiveBorder: 'border-violet-200'
  },
  { 
    name: 'Pitch Pocket', 
    activeClass: 'bg-blue-500 text-white', 
    activeBorder: 'border-blue-600',
    inactiveClass: 'bg-blue-50 text-blue-700', 
    inactiveBorder: 'border-blue-200'
  },
  { 
    name: 'Shake', 
    activeClass: 'bg-slate-500 text-white', 
    activeBorder: 'border-slate-600',
    inactiveClass: 'bg-slate-50 text-slate-700', 
    inactiveBorder: 'border-slate-200'
  }
])

const face2DefectTypes = ref([
  { 
    name: 'Knot', 
    activeClass: 'bg-red-500 text-white', 
    activeBorder: 'border-red-600',
    inactiveClass: 'bg-red-50 text-red-700', 
    inactiveBorder: 'border-red-200'
  },
  { 
    name: 'Split', 
    activeClass: 'bg-orange-500 text-white', 
    activeBorder: 'border-orange-600',
    inactiveClass: 'bg-orange-50 text-orange-700', 
    inactiveBorder: 'border-orange-200'
  },
  { 
    name: 'Wane', 
    activeClass: 'bg-amber-500 text-white', 
    activeBorder: 'border-amber-600',
    inactiveClass: 'bg-amber-50 text-amber-700', 
    inactiveBorder: 'border-amber-200'
  },
  { 
    name: 'Stain', 
    activeClass: 'bg-violet-500 text-white', 
    activeBorder: 'border-violet-600',
    inactiveClass: 'bg-violet-50 text-violet-700', 
    inactiveBorder: 'border-violet-200'
  },
  { 
    name: 'Pitch Pocket', 
    activeClass: 'bg-blue-500 text-white', 
    activeBorder: 'border-blue-600',
    inactiveClass: 'bg-blue-50 text-blue-700', 
    inactiveBorder: 'border-blue-200'
  },
  { 
    name: 'Shake', 
    activeClass: 'bg-slate-500 text-white', 
    activeBorder: 'border-slate-600',
    inactiveClass: 'bg-slate-50 text-slate-700', 
    inactiveBorder: 'border-slate-200'
  }
])

// Toggle magnifier
const toggleMagnifier = () => {
  magnifierEnabled.value = !magnifierEnabled.value
  if (!magnifierEnabled.value) {
    showMagnifier.value = false
  }
}

// Handle mouse movement
const handleMouseMove = (event, boardId) => {
  if (!magnifierEnabled.value) return
  
  // Only set active board if we're hovering over this specific board
  activeMagnifierBoard.value = boardId
  
  const rect = event.currentTarget.getBoundingClientRect()
  mousePosition.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
}

// Handle mouse enter for magnifier
const handleMouseEnter = (boardId) => {
  if (!magnifierEnabled.value) return
  // Only show magnifier on the board being hovered
  showMagnifier.value = true
  activeMagnifierBoard.value = boardId
}

// Handle mouse leave for magnifier
const handleMouseLeave = () => {
  // Hide magnifier when leaving any board
  showMagnifier.value = false
  activeMagnifierBoard.value = null
}

// Image load handler
const onImageLoad = () => {
  // Image loaded, magnifier ready
}

// Defect visibility state
const visibleDefects = ref({
  face1: new Set(['Knot', 'Split', 'Wane', 'Stain', 'Pitch Pocket', 'Shake']),
  face2: new Set(['Knot', 'Split', 'Wane', 'Stain', 'Pitch Pocket', 'Shake'])
})

// Toggle defect visibility
function toggleDefect(face, defectName) {
  if (visibleDefects.value[face].has(defectName)) {
    visibleDefects.value[face].delete(defectName)
  } else {
    visibleDefects.value[face].add(defectName)
  }
}

// Check if defect is visible
function isDefectVisible(face, defectName) {
  return visibleDefects.value[face].has(defectName)
}

// Computed styles for magnifier
const magnifierStyle = computed(() => {
  const { x, y } = mousePosition.value
  
  // Get the active container to calculate screen position
  const activeContainer = activeMagnifierBoard.value === 'face1' ? face1Container.value : face2Container.value
  if (!activeContainer) return {}
  
  const containerRect = activeContainer.getBoundingClientRect()
  
  // Calculate screen position
  const screenX = containerRect.left + x
  const screenY = containerRect.top + y
  
  // Position magnifier above the cursor, centered horizontally
  let left = screenX - (magnifierSize / 2)
  let top = screenY - magnifierSize - 20
  
  // Allow magnifier to overflow the board boundaries
  // No boundary constraints - let it extend beyond the image container
  
  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${magnifierSize}px`,
    height: `${magnifierSize}px`,
    backgroundColor: '#ffffff'
  }
})

// Computed styles for magnified image
const magnifiedImageStyle = computed(() => {
  const { x, y } = mousePosition.value
  
  // Get the active container and image to calculate proper scaling
  const activeContainer = activeMagnifierBoard.value === 'face1' ? face1Container.value : face2Container.value
  const activeImage = activeMagnifierBoard.value === 'face1' ? face1Image.value : face2Image.value
  
  if (!activeContainer || !activeImage) return {}
  
  // Get the actual image dimensions and container dimensions
  const containerRect = activeContainer.getBoundingClientRect()
  const imageRect = activeImage.getBoundingClientRect()
  
  // Calculate the scale factor between the container and the actual image
  const scaleX = activeImage.naturalWidth / imageRect.width
  const scaleY = activeImage.naturalHeight / imageRect.height
  
  // Convert cursor position to image coordinates
  const imageX = x * scaleX
  const imageY = y * scaleY
  
  // Calculate background position to center the cursor area in the magnifier
  // We want to show the area around the cursor, centered in the magnifier window
  const backgroundX = -(imageX * magnificationLevel) + (magnifierSize / 2)
  const backgroundY = -(imageY * magnificationLevel) + (magnifierSize / 2)
  
  // Calculate the background size based on the original image dimensions
  const backgroundWidth = activeImage.naturalWidth * magnificationLevel
  const backgroundHeight = activeImage.naturalHeight * magnificationLevel
  
  return {
    // Use the same image for both boards
    backgroundImage: 'url(/image.png)',
    backgroundSize: `${backgroundWidth}px ${backgroundHeight}px`,
    backgroundPosition: `${backgroundX}px ${backgroundY}px`
  }
})
</script>