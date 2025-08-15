<template>
  <div class="board-viewer">
    <!-- Board Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Left side: Board ID and Order -->
        <div class="flex items-center gap-6">
          <div>
            <div class="text-2xl font-bold text-gray-900">Board #{{ board.id }}</div>
            <div class="text-sm text-gray-500 mt-1">Order {{ board.batch?.id || 'N/A' }} - {{ board.batch?.name || '' }}</div>
          </div>
          
          <!-- Vertical divider -->
          <div class="h-12 w-px bg-gray-300"></div>
          
          <!-- Species and Dry Status with icons -->
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2 text-gray-700">
              <Trees class="w-4 h-4 text-gray-500" />
              <span class="font-medium">{{ getSpeciesName(board) }}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-700">
              <Droplets class="w-4 h-4 text-gray-500" />
              <span class="font-medium">{{ getDryStatusName(board) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Right side: Grade, Yield and Price -->
        <div class="flex items-center gap-6 text-right">
          <div>
            <div class="text-sm text-gray-500 mb-1">Grade</div>
            <div class="flex items-center gap-2">
              <div :class="[
                'px-3 py-1 text-xl font-bold rounded-md',
                getGradeColorClass(getGradeName(board.gradeId))
              ]">
                {{ getGradeName(board.gradeId) }}
              </div>
              <div v-if="feedbackSubmitted" class="flex items-center gap-1 px-2 py-1 bg-yellow-100 rounded-full">
                <MessageSquare class="w-3 h-3 text-yellow-700" />
                <span class="text-xs font-medium text-yellow-700">Feedback sent</span>
              </div>
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-500">Yield</div>
            <div class="text-xl font-bold text-gray-900">
              {{ getYieldForGrade(board) ? `${getYieldForGrade(board).toFixed(1)}%` : 'N/A' }}
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-500">Value</div>
            <div class="text-xl font-bold" :class="calculateValue(board) === 'N/A' ? 'text-gray-400' : 'text-green-600'">
              {{ calculateValue(board) === 'N/A' ? 'N/A' : `€${calculateValue(board)}` }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Scan date -->
      <div class="text-xs text-gray-400 mt-2">
        Scanned: {{ formatDate(board.createDate) }}
      </div>
    </div>

    <!-- Action Buttons (slot for additional buttons) -->
    <div class="bg-gray-50 border-b border-gray-200 px-6 py-3">
      <div class="flex items-center gap-2">
        <button 
          @click="toggleUsableArea"
          :class="[
            'flex items-center px-3 py-1.5 text-sm font-medium bg-white border-2 rounded-md hover:bg-gray-50 transition-colors',
            showUsableArea 
              ? 'text-blue-600 border-blue-300' 
              : 'text-gray-600 border-gray-300'
          ]">
          <Maximize2 class="w-4 h-4 mr-2" />
          {{ showUsableArea ? 'Hide' : 'Show' }} Usable Area
        </button>
        
        <button 
          v-if="board.grades && board.grades.length > 0"
          @click="showGradeModal = true"
          class="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          <FileText class="w-4 h-4 mr-2" />
          See rejection rules
        </button>
        
        <button 
          @click="hideFilteredDefects = !hideFilteredDefects"
          :class="[
            'flex items-center px-3 py-1.5 text-sm font-medium bg-white border-2 rounded-md hover:bg-gray-50 transition-colors',
            hideFilteredDefects 
              ? 'text-blue-600 border-blue-300' 
              : 'text-gray-600 border-gray-300'
          ]">
          <EyeOff v-if="hideFilteredDefects" class="w-4 h-4 mr-2" />
          <Eye v-else class="w-4 h-4 mr-2" />
          {{ hideFilteredDefects ? 'Show' : 'Hide' }} filtered defects
        </button>
        
        <button 
          v-if="$slots['extended-content']"
          @click="toggleMagnifier"
          :class="[
            'flex items-center px-3 py-1.5 text-sm font-medium bg-white border-2 rounded-md hover:bg-gray-50 transition-colors',
            magnifierEnabled 
              ? 'text-emerald-600 border-emerald-300' 
              : 'text-gray-600 border-gray-300'
          ]">
          <ZoomIn class="w-4 h-4 mr-2" />
          {{ magnifierEnabled ? 'Disable Magnifier' : 'Enable Magnifier' }}
        </button>
        
        <!-- Slot for additional action buttons -->
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- KPI Cards (optional, controlled by prop) -->
    <div v-if="showKpis" class="px-6 py-4 bg-gray-50">
      <div class="grid grid-cols-8 gap-3">
        <div v-for="kpi in kpiData" :key="kpi.label" class="bg-white rounded-lg shadow-sm p-3">
          <div class="flex items-center gap-1 mb-1">
            <component 
              :is="kpi.icon" 
              :class="['w-4 h-4', kpi.iconColor]" 
            />
            <div class="text-xs text-gray-500">{{ kpi.label }}</div>
          </div>
          <div class="text-lg font-semibold" :class="kpi.colorClass || 'text-gray-900'">
            {{ kpi.value }}
          </div>
        </div>
      </div>
    </div>

    <!-- Board Images -->
    <div class="px-6 py-4">
      <div v-if="boardImages && boardImages.length > 0">
        <div v-for="(image, index) in boardImages" :key="index" class="mb-4">
          <div class="flex items-center gap-2 mb-2">
            <h5 class="text-md font-medium text-gray-700">{{ image.faceName }}</h5>
            <!-- Shot ID -->
            <span class="text-sm text-gray-500">
              Shot #{{ index === 0 ? (board.face1?.shotId || '-') : (board.face2?.shotId || '-') }}
            </span>
            <!-- Grading face indicator -->
            <span v-if="board.gradingFace === index + 1 || (index === 0 && !board.gradingFace)" 
                  class="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
              Grading Face
            </span>
          </div>
          <div class="border border-gray-300 bg-gray-100"
               :data-fallback-url="image.fallbackUrl"
               :ref="el => imageContainers[index] = el"
               @mousemove="(e) => handleMouseMove(e, index)"
               @mouseenter="() => handleMouseEnter(index)"
               @mouseleave="handleMouseLeave"
               :style="{ cursor: magnifierEnabled ? 'crosshair' : 'default' }">
            <!-- Inner container for image and overlays -->
            <div class="relative inline-block">
              <!-- Board image - clean or with usable area overlay -->
              <img 
                :key="`${board.id}-${index}-${showUsableArea ? 'annotated' : 'clean'}`"
                :src="getImageUrl(index)"
                :alt="`Board ${board.id} - ${image.faceName}`"
                class="block"
                :ref="el => imageRefs[index] = el"
                @error="(e) => handleImageError(e, index)"
                @load="(e) => handleImageLoad(e, index)"
              />
              
              <!-- Usable area mask overlay (only on grading face) -->
              <img
                v-if="showUsableArea && boardImages[index]?.isGradingFace && getMaskUrl(index)"
                :src="getMaskUrl(index)"
                :alt="`Usable area mask for ${image.faceName}`"
                class="absolute top-0 left-0 pointer-events-none z-10"
                :style="{ 
                  opacity: 0.3,
                  mixBlendMode: 'multiply'
                }"
              />
              
              <!-- Canvas overlay for defects (positioned absolutely on top) -->
              <canvas
                :ref="el => { if (el) canvasRefs[index] = el }"
                class="absolute top-0 left-0 pointer-events-none z-20"
                :style="{ 
                  display: imageLoadedStates[index] ? 'block' : 'none'
                }"
              ></canvas>
            </div>
            
            <!-- Magnifier Window -->
            <div
              v-if="showMagnifier && magnifierEnabled && activeMagnifierBoard === index"
              :style="magnifierStyle"
              class="fixed pointer-events-none border-2 border-white shadow-lg rounded-lg overflow-hidden z-50"
            >
              <div
                :style="getMagnifiedImageStyle(index)"
                class="w-full h-full bg-no-repeat"
              ></div>
            </div>
          </div>
          
          <!-- Defect chips for this face -->
          <div v-if="getFaceDefects(index + 1).length > 0" class="flex items-center gap-2 mt-2 flex-wrap">
            <span class="text-xs text-gray-600 font-medium mr-1">Defects:</span>
            
            <!-- Show All/Hide All button at the beginning -->
            <button 
              @click="toggleAllDefects()"
              :class="[
                'inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border transition-all cursor-pointer mr-1',
                selectedDefects.size === 0 
                  ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100' 
                  : 'bg-gray-50 border-gray-400 text-gray-700 hover:bg-gray-100'
              ]">
              <svg v-if="selectedDefects.size === 0" class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <svg v-else class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
              </svg>
              {{ selectedDefects.size === 0 ? 'Show All' : 'Hide All' }}
            </button>
            
            <span class="text-gray-300">|</span>
            
            <!-- Individual defect chips -->
            <button v-for="(defect, dIndex) in getFaceDefects(index + 1)" 
                  :key="dIndex"
                  @click="toggleDefectSelection(defect.name)"
                  :disabled="hideFilteredDefects && defect.isFiltered"
                  :class="[
                    'inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border transition-all',
                    hideFilteredDefects && defect.isFiltered
                      ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                      : isDefectSelected(defect.name)
                        ? 'bg-white border-gray-800 text-gray-800 cursor-pointer' 
                        : 'bg-white border-gray-300 text-gray-500 cursor-pointer'
                  ]">
              <!-- Color circle indicator -->
              <span class="w-2 h-2 rounded-full mr-1.5 flex-shrink-0" 
                    :style="{ 
                      backgroundColor: defect.color || '#DC2626',
                      opacity: hideFilteredDefects && defect.isFiltered ? 0.4 : 1
                    }"></span>
              {{ defect.name }}
              <span v-if="defect.count > 0" class="ml-1 font-semibold">
                ({{ defect.count }})
              </span>
              <span v-if="defect.totalArea > 0" class="ml-1">
                {{ defect.totalArea }} cm²
              </span>
            </button>
          </div>
          <div v-else class="text-xs text-gray-500 mt-2">
            Clean face - No defects
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-500">
        <ImageIcon class="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>No images available</p>
      </div>
    </div>

    <!-- Additional content slot for extended features -->
    <slot name="extended-content"></slot>
    
    <!-- Grade Validation Sheet (Right-side drawer) -->
    <Sheet v-model:open="showGradeModal">
      <SheetContent class="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Grade Validation Results</SheetTitle>
          <SheetDescription>
            Board #{{ board?.id }} - Current Grade: {{ getGradeName(board?.gradeId) }}
          </SheetDescription>
        </SheetHeader>
        
        <div class="mt-4 space-y-2">
          <div v-if="logicalGrades && logicalGrades.length > 0">
            <div v-for="grade in logicalGrades" :key="grade.id" 
                 :class="[
                   'rounded-md p-2 border transition-all',
                   grade.valid 
                     ? 'bg-green-50 border-green-200' 
                     : 'bg-red-50 border-red-200'
                 ]">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span :class="[
                    'font-semibold text-sm',
                    grade.valid ? 'text-green-900' : 'text-red-900'
                  ]">
                    {{ getGradeNameById(grade.id) }}
                  </span>
                  <span v-if="grade.yield" :class="[
                    'text-xs',
                    grade.valid ? 'text-green-700' : 'text-gray-500'
                  ]">
                    {{ grade.yield.toFixed(1) }}%
                  </span>
                </div>
                <span :class="[
                  'px-2 py-0.5 text-xs font-medium rounded',
                  grade.valid 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                ]">
                  {{ grade.valid ? '✓' : '✗' }}
                </span>
              </div>
              
              <div v-if="!grade.valid && grade.reasons && grade.reasons.length > 0" 
                   class="mt-1 pl-2">
                <ul class="text-xs text-red-600 space-y-0.5">
                  <li v-for="(reason, index) in grade.reasons" 
                      :key="index"
                      class="before:content-['•'] before:mr-1">
                    {{ fixEncoding(reason) }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-gray-500">
            <AlertCircle class="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No grade validation data available</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
    
    <!-- Feedback Modal -->
    <Dialog v-model:open="showFeedbackModal">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Disagree with Grading</h2>
          <button @click="showFeedbackModal = false" class="text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="mb-4">
          <p class="text-sm text-gray-600">Board #{{ board?.id }} - Current Grade: {{ getGradeName(board?.gradeId) }}</p>
        </div>
        
        <!-- Grade Evaluation Reasons -->
        <div class="mb-6">
          <h3 class="text-sm font-medium text-gray-700 mb-3">Grade Evaluation Results:</h3>
          <div class="max-h-60 overflow-y-auto space-y-2">
            <div v-for="grade in logicalGrades" :key="grade.id" 
                 class="border rounded-lg p-3 text-sm"
                 :class="grade.valid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'">
              <div class="flex justify-between items-start mb-1">
                <span class="font-medium">{{ getGradeNameById(grade.id) }}</span>
                <span :class="grade.valid ? 'text-green-600' : 'text-red-600'">
                  {{ grade.valid ? 'Passed' : 'Failed' }}
                </span>
              </div>
              <div v-if="!grade.valid && grade.reasons?.length > 0" class="text-xs text-gray-600 mt-1">
                {{ fixEncoding(grade.reasons[0]) }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Feedback Form -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Why do you disagree with the grading?
            </label>
            <select v-model="feedbackForm.reason" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select a reason...</option>
              <option value="missed_defect">Missed a defect</option>
              <option value="wrong_defect">Incorrectly identified defect</option>
              <option value="wrong_grade">Should be different grade</option>
              <option value="measurement_error">Measurement error</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Additional Comments
            </label>
            <textarea v-model="feedbackForm.comment" 
                      rows="4"
                      placeholder="Please provide more details..."
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 mt-6">
          <button @click="showFeedbackModal = false" 
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Cancel
          </button>
          <button @click="submitFeedback" 
                  :disabled="!feedbackForm.reason"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            Submit Feedback
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
/**
 * BoardViewer Component
 * 
 * Displays lumber board images with overlays for defects and usable areas.
 * 
 * Architecture:
 * - Base Layer: Clean board images (no overlays) served from nginx via gateway URLs
 * - Defects Layer: Canvas overlay drawing defect polygons from API data
 * - Usable Area Layer: Semi-transparent PNG mask showing clear cutting areas
 * 
 * Image Sources:
 * - Clean images: face.url (e.g., gateway/stitches/date/row/id/id-face-0.jpg)
 * - Usable area masks: face.usableAreaMaskUrl (e.g., gateway/stitches/date/row/id/usable-id-face-0.png)
 * - All images served by nginx on port 80, proxied through /gateway path
 * 
 * Key Features:
 * - Toggle defects visibility (Hide Minor Defects button)
 * - Toggle usable area overlay (Show Usable Area button) - only on grading face
 * - Interactive defect selection for grading feedback
 * - Magnifier for detailed inspection
 * - Grade validation results in side sheet
 * 
 * Props:
 * - board: Board data object with faces, defects, grades
 * - availableGrades: List of available grades for validation
 * - showKpis: Whether to show KPI cards
 */
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { Trees, Droplets, Maximize2, AlertCircle, AlertTriangle, ImageIcon, Ruler, ArrowLeftRight, Square, Package, Activity, Box, FileStack, FileText, Eye, EyeOff, ZoomIn, X, MessageSquare } from 'lucide-vue-next'
import Sheet from '@/components/ui/sheet.vue'
import SheetContent from '@/components/ui/sheet-content.vue'
import SheetHeader from '@/components/ui/sheet-header.vue'
import SheetTitle from '@/components/ui/sheet-title.vue'
import SheetDescription from '@/components/ui/sheet-description.vue'
import Dialog from '@/components/ui/dialog.vue'

const props = defineProps({
  board: {
    type: Object,
    required: true
  },
  showKpis: {
    type: Boolean,
    default: true
  },
  availableGrades: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:board', 'image-loaded', 'usable-area-toggled'])

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const showUsableArea = ref(false)
const boardImages = ref(null)
const showGradeModal = ref(false)
const selectedDefects = ref(new Set()) // Track which defect types are selected for display
const hideFilteredDefects = ref(true) // Default to hiding minor/filtered defects
const showFeedbackModal = ref(false) // Track feedback modal visibility
const feedbackSubmitted = ref(false) // Track if feedback was submitted for this board
const feedbackForm = ref({
  reason: '',
  comment: ''
})
const imageLoadedStates = ref([false, false]) // Track if images are loaded
const imageDimensions = ref([null, null]) // Store natural dimensions of images
const canvasRefs = ref({}) // References to canvas elements
const canvasContexts = ref({}) // Canvas 2D contexts
// Removed: usableAreaCanvasRefs - no longer needed, using server mask overlay instead

// Magnifier state
const magnifierEnabled = ref(false)
const showMagnifier = ref(false)
const mousePosition = ref({ x: 0, y: 0 })
const activeMagnifierBoard = ref(null)
const magnifierSize = 200
const magnificationLevel = 1.2

// Template refs for images
const imageContainers = ref([])
const imageRefs = ref([])

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

// Computed property to fix illogical grade validation and sort by yield
const logicalGrades = computed(() => {
  if (!props.board?.grades) return []
  
  // Create a copy of grades to modify
  let grades = [...props.board.grades]
  
  // Check if Rebut is present
  const rebutGrade = grades.find(g => {
    const gradeName = getGradeNameById(g.id)
    return gradeName.toLowerCase().includes('rebut')
  })
  
  // If Rebut exists and is valid, check if any other grade is also valid
  if (rebutGrade?.valid) {
    const hasOtherValidGrades = grades.some(g => {
      if (g.id === rebutGrade.id) return false
      return g.valid === true
    })
    
    // If other grades are valid, Rebut should not be valid (logical inconsistency)
    if (hasOtherValidGrades) {
      // Mark Rebut as invalid since other grades passed
      grades = grades.map(g => {
        if (g.id === rebutGrade.id) {
          return { ...g, valid: false, reasons: ['Board passed other grades, so Rebut does not apply'] }
        }
        return g
      })
    }
  }
  
  // Sort grades by yield (highest first) for valid grades, then by validity
  // This helps understand which grade was likely selected when multiple are valid
  return grades.sort((a, b) => {
    // First sort by validity (valid grades first)
    if (a.valid !== b.valid) {
      return a.valid ? -1 : 1
    }
    // Then sort by yield (highest yield first)
    const yieldA = a.yield || 0
    const yieldB = b.yield || 0
    return yieldB - yieldA
  })
})

// Computed KPI data
const kpiData = computed(() => {
  if (!props.board) return []
  
  // Handle volume which might be a number, object, or undefined
  let volumeValue = 'N/A'
  if (props.board.volume) {
    if (typeof props.board.volume === 'object' && props.board.volume.value) {
      volumeValue = `${parseFloat(props.board.volume.value).toFixed(3)} m³`
    } else if (typeof props.board.volume === 'number') {
      volumeValue = `${props.board.volume.toFixed(3)} m³`
    }
  }
  
  // Count total defects across both faces (major defects only, not filtered ones)
  const face1Defects = props.board.face1?.defects?.reduce((sum, group) => sum + (group.defects?.length || 0), 0) || 0
  const face2Defects = props.board.face2?.defects?.reduce((sum, group) => sum + (group.defects?.length || 0), 0) || 0
  const totalDefects = face1Defects + face2Defects
  const hasDefects = totalDefects > 0
  
  // Calculate surface area
  const surfaceValue = props.board.length && props.board.width ? 
    formatSurface({ value: (parseFloat(props.board.length.value || props.board.length) * parseFloat(props.board.width.value || props.board.width)) / 10000 }) :
    'N/A'
  
  return [
    { label: 'Length', value: formatLength(props.board.length), icon: Ruler, iconColor: 'text-amber-600' },
    { label: 'Width', value: formatLength(props.board.width), icon: ArrowLeftRight, iconColor: 'text-blue-600' },
    { label: 'Thickness', value: formatLength(props.board.thickness), icon: Square, iconColor: 'text-purple-600' },
    { label: 'Surface', value: surfaceValue, icon: Square, iconColor: 'text-indigo-600' },
    { label: 'Volume', value: volumeValue, icon: Box, iconColor: 'text-cyan-600' },
    { 
      label: 'Defects', 
      value: totalDefects, 
      icon: Activity,
      iconColor: hasDefects ? 'text-red-600' : 'text-gray-600',
      colorClass: hasDefects ? 'text-red-600' : 'text-gray-900' 
    }
  ]
})

// ============================================================================
// CORE METHODS
// ============================================================================

/**
 * Load board images based on current display mode (normal or usable area).
 * Sets up image URLs for both faces and preloads high-resolution images for magnifier.
 * 
 * @async
 * @returns {Promise<void>}
 */
/**
 * Load board images from the API.
 * Images are served by nginx on port 80 via gateway URLs.
 * Each face has:
 * - url: Clean image without any overlays
 * - usableAreaMaskUrl: Semi-transparent mask showing usable areas
 * - annotatedUrl: Image with all overlays baked in (not currently used)
 */
const loadBoardImages = async () => {
  if (!props.board) return
  
  try {
    // Check which face is the grading face (only this face shows usable area mask)
    const face1IsGradingFace = props.board.face1?.gradingFace === true
    const face2IsGradingFace = props.board.face2?.gradingFace === true
    
    // Get clean URLs from the board data (gateway/stitches/... paths)
    const face1Clean = props.board.face1?.url ? `/${props.board.face1.url}` : ''
    const face2Clean = props.board.face2?.url ? `/${props.board.face2.url}` : ''
    
    boardImages.value = [
      {
        faceName: 'Face 1',
        url: face1Clean,
        highResUrl: face1Clean,
        isGradingFace: face1IsGradingFace
      },
      {
        faceName: 'Face 2',
        url: face2Clean,
        highResUrl: face2Clean,
        isGradingFace: face2IsGradingFace
      }
    ]
    
    // Preload high-res images for magnifier
    boardImages.value.forEach(img => {
      const preloadImg = new Image()
      preloadImg.src = img.highResUrl
    })
  } catch (err) {
    // Handle error silently - placeholder will be shown
  }
}

/**
 * Toggle the display of usable area mask overlay.
 * When enabled, shows a semi-transparent mask highlighting wood areas
 * suitable for clear cuttings (without defects).
 */
const toggleUsableArea = () => {
  showUsableArea.value = !showUsableArea.value
  emit('usable-area-toggled', showUsableArea.value)
  // The mask overlay is handled via template v-if directive
}

/**
 * Handle image loading errors with fallback logic.
 * Attempts multiple fallback URLs before using default placeholder.
 * 
 * @param {Event} event - Image error event
 * @param {number} index - Face index (0 or 1)
 */
const handleImageError = (event, index) => {
  // If clean image fails, try the regular image with defects
  if (event.target.src.includes('annotations=false')) {
    const fallbackUrl = getFallbackImageUrl(index)
    event.target.src = fallbackUrl
    return
  }
  
  // Check if this image has a fallback URL (for usable area images that might not exist)
  const imageContainer = event.target.closest('[data-fallback-url]')
  if (imageContainer && imageContainer.dataset.fallbackUrl) {
    event.target.src = imageContainer.dataset.fallbackUrl
    // Remove the fallback to prevent infinite loop
    delete imageContainer.dataset.fallbackUrl
  } else {
    event.target.src = '/boardpic.png' // Final fallback image
  }
}

// Utility functions
const formatLength = (value) => {
  if (!value) return 'N/A'
  
  // Handle object format from API
  if (typeof value === 'object' && value.value) {
    const rawValue = parseFloat(value.value)
    const unit = value.unit || 'cm'
    
    if (unit === 'cm') {
      return `${rawValue.toFixed(1)} cm`
    } else if (unit === 'mm') {
      // Convert mm to cm for display
      const cm = rawValue / 10
      return `${cm.toFixed(1)} cm`
    }
    return `${rawValue.toFixed(1)} ${unit}`
  }
  
  // Handle numeric value (assume mm, convert to cm)
  const cm = value / 10
  return `${cm.toFixed(1)} cm`
}

const formatSurface = (value) => {
  if (!value) return 'N/A'
  
  // Handle surface which might be a number, object, or undefined
  if (typeof value === 'object' && value.value) {
    return `${parseFloat(value.value).toFixed(2)} m²`
  } else if (typeof value === 'number') {
    return `${value.toFixed(2)} m²`
  }
  
  return 'N/A'
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/**
 * Get the display name for a grade ID, handling null/undefined values.
 * Uses grade validation results to determine appropriate grade when gradeId is null.
 * 
 * @param {number|null|undefined} gradeId - Grade ID from API
 * @returns {string} Human-readable grade name
 */
const getGradeName = (gradeId) => {
  // Handle null/undefined gradeId from API
  if (gradeId === null || gradeId === undefined) {
    // When gradeId is null, check what grades passed
    if (props.board?.grades && props.board.grades.length > 0) {
      // Use logicalGrades to get the corrected validation results
      const grades = logicalGrades.value || props.board.grades
      
      // Find the highest priority valid grade (excluding Rebut)
      const validGrade = grades.find(g => {
        if (!g.valid) return false
        const gradeName = getGradeNameById(g.id)
        // Exclude Rebut from being selected as the primary grade
        return !gradeName.toLowerCase().includes('rebut')
      })
      
      if (validGrade) {
        return getGradeNameById(validGrade.id)
      }
      
      // Check if only Rebut passed
      const rebutGrade = grades.find(g => {
        const gradeName = getGradeNameById(g.id)
        return gradeName.toLowerCase().includes('rebut') && g.valid
      })
      
      if (rebutGrade) {
        return 'Rebut'
      }
      
      // If no grades passed and we have validation data, it's Rebut (reject)
      const hasValidationData = grades.some(g => g.valid !== undefined)
      if (hasValidationData) {
        return 'Rebut' // All grades failed, board is rejected
      }
    }
    // Only show Ungraded if there's no validation data at all
    return 'Ungraded'
  }
  
  const grade = props.availableGrades.find(g => g.id === gradeId)
  return grade?.name || `Grade ${gradeId}`
}

// Get color class for grade display
const getGradeColorClass = (gradeName) => {
  if (!gradeName) return 'bg-gray-100 text-gray-700'
  
  const gradeColors = {
    // A grades - Premium (Green)
    'AW': 'bg-green-100 text-green-800',
    'AR': 'bg-green-100 text-green-800',
    // B grades - Standard (Blue)
    'BW': 'bg-blue-100 text-blue-800',
    'BR': 'bg-blue-100 text-blue-800',
    // C grades - Economy (Yellow)
    'CW': 'bg-yellow-100 text-yellow-800',
    'CR': 'bg-yellow-100 text-yellow-800',
    // Reject - (Red)
    'Rebut': 'bg-red-100 text-red-800',
    'Reject': 'bg-red-100 text-red-800',
    // Prime/Select - Premium
    'Prime': 'bg-emerald-100 text-emerald-800',
    'Select': 'bg-teal-100 text-teal-800',
    // Common
    'Common': 'bg-amber-100 text-amber-800'
  }
  
  return gradeColors[gradeName] || 'bg-gray-100 text-gray-700'
}

// Get yield percentage for the current grade
const getYieldForGrade = (board) => {
  if (!board?.grade?.id || !board?.grades) return null
  
  // Find the grade entry for the assigned grade
  const gradeEntry = board.grades.find(g => g.id === board.grade.id)
  
  // Return yield if found and valid
  if (gradeEntry?.valid && gradeEntry?.yield !== undefined) {
    return gradeEntry.yield
  }
  
  return null
}

const getGradeNameById = (gradeId) => {
  // Map batch-specific grade IDs to standard grade names
  // These are batch 84 specific mappings (IDs > 100 are batch-specific)
  const batchGradeMapping = {
    575: 'AW',
    576: 'AR', 
    577: 'BW',
    578: 'BR',
    579: 'CW',
    580: 'CR',
    581: 'Rebut'
  }
  
  // Check if it's a batch-specific ID
  if (gradeId > 100 && batchGradeMapping[gradeId]) {
    return batchGradeMapping[gradeId]
  }
  
  // Otherwise look up in standard grades
  const grade = props.availableGrades.find(g => g.id === gradeId)
  return grade?.name || `Grade ${gradeId}`
}

// Fix encoding issues from legacy API
const fixEncoding = (text) => {
  if (!text) return text
  // Common French character replacements
  return text
    .replace(/�|Ã¨/g, 'è')
    .replace(/Ã©/g, 'é')
    .replace(/Ã /g, 'à')
    .replace(/Ã¢/g, 'â')
    .replace(/Ã§/g, 'ç')
    .replace(/Ã´/g, 'ô')
    .replace(/Ã»/g, 'û')
    .replace(/Ã®/g, 'î')
    .replace(/Ãª/g, 'ê')
    .replace(/Ã¹/g, 'ù')
}

const getSpeciesName = (board) => {
  if (!board) return 'Unknown'
  
  // API uses 'specie' not 'species'
  if (board.specie) {
    if (typeof board.specie === 'object' && board.specie.name) {
      return board.specie.name
    }
    if (typeof board.specie === 'string') {
      return board.specie
    }
  }
  // Fallback to species for compatibility
  if (board.species) {
    if (typeof board.species === 'object' && board.species.name) {
      return board.species.name
    }
    if (typeof board.species === 'string') {
      return board.species
    }
  }
  
  return 'Unknown'
}

const getDryStatusName = (board) => {
  if (!board) return 'Unknown'
  
  if (board.dryStatus) {
    if (typeof board.dryStatus === 'object' && board.dryStatus.name) {
      return board.dryStatus.name
    }
    if (typeof board.dryStatus === 'string') {
      return board.dryStatus
    }
  }
  
  return 'Unknown'
}

/**
 * Calculate the monetary value of a board based on API-provided pricing data.
 * No client-side calculations are performed to support multiple customer pricing models.
 * 
 * @param {Object} board - Board object from API
 * @returns {string} Formatted price or 'N/A' if no pricing available
 */
const calculateValue = (board) => {
  if (!board) return 'N/A'
  
  // Only display price/value if provided by the API
  // No client-side calculations to support multiple customer sources
  
  // Check if board has a price field from API
  if (board.price !== undefined && board.price !== null) {
    return board.price.toFixed(2)
  }
  
  // Check if board has a value field from API
  if (board.value !== undefined && board.value !== null) {
    return board.value.toFixed(2)
  }
  
  // If API doesn't provide price/value, show N/A
  return 'N/A'
}

// Get defects for a specific face
const getFaceDefects = (faceNumber) => {
  if (!props.board) return []
  
  // Check if board has face1 and face2 with defects arrays
  const face = faceNumber === 1 ? props.board.face1 : props.board.face2
  if (!face?.defects) return []
  
  // Filter defects based on hideFilteredDefects toggle
  let defectGroups = face.defects
  
  return defectGroups.map(defectGroup => {
    // Count how many defects in this group are filtered
    const filteredCount = defectGroup.defects ? 
      defectGroup.defects.filter(d => d.filtered).length : 0
    const totalCount = defectGroup.defects ? defectGroup.defects.length : 0
    const unfilteredCount = totalCount - filteredCount
    
    // Calculate total area (always show total, not filtered)
    const totalArea = defectGroup.defects ? 
      defectGroup.defects.reduce((sum, d) => sum + (d.geometricProperties?.area || 0), 0) : 0
    
    // Always show total count and area in chips (not affected by filter toggle)
    return {
      name: defectGroup.name,
      color: defectGroup.color,
      count: totalCount, // Always show total count
      totalArea: totalArea.toFixed(1), // Always show total area
      isFiltered: filteredCount > 0 && filteredCount === totalCount, // All defects in group are filtered
      defects: defectGroup.defects || [] // Include the actual defects array!
    }
  })
}

/**
 * Toggle the visibility of a specific defect type on the canvas overlay.
 * Updates the selection state and redraws both face canvases.
 * 
 * @param {string} defectName - Name of the defect type to toggle
 */
const toggleDefectSelection = (defectName) => {
  const newSet = new Set(selectedDefects.value)
  if (newSet.has(defectName)) {
    newSet.delete(defectName)
  } else {
    newSet.add(defectName)
  }
  selectedDefects.value = newSet
  
  // Manually trigger redraw since we don't have a watcher
  drawDefectsOnCanvas(0)
  drawDefectsOnCanvas(1)
}

// Select all defects
const selectAllDefects = () => {
  const allDefectTypes = getAllDefectTypes()
  selectedDefects.value = new Set(allDefectTypes)
}

// Deselect all defects
const deselectAllDefects = () => {
  selectedDefects.value = new Set()
}

// Get all unique defect types across all faces
const getAllDefectTypes = () => {
  if (!props.board?.faces) return []
  
  const defectTypes = new Set()
  props.board.faces.forEach(face => {
    if (face?.defects) {
      face.defects.forEach(defect => {
        if (defect?.name) {
          defectTypes.add(defect.name)
        }
      })
    }
  })
  return Array.from(defectTypes)
}

// Get total count of unique defect types
const getTotalDefectCount = () => {
  return getAllDefectTypes().length
}

// Parse serialized coordinates [x1,y1,x2,y2,x3,y3...] into points [{x,y}, {x,y}, {x,y}...]
const parseDefectCoordinates = (coords) => {
  if (!coords || !Array.isArray(coords) || coords.length < 6) {
    return []
  }
  
  if (coords.length % 2 !== 0) {
    return []
  }
  
  const points = []
  for (let i = 0; i < coords.length; i += 2) {
    points.push({
      x: coords[i],
      y: coords[i + 1]
    })
  }
  
  return points
}

// Draw defect polygon on canvas with proper colors
const drawDefectPolygon = (ctx, points, imageWidth, imageHeight, canvasWidth, canvasHeight, color = '#FF0000') => {
  if (!points || points.length < 3) {
    return
  }
  
  // Calculate scaling factors
  const scaleX = canvasWidth / imageWidth
  const scaleY = canvasHeight / imageHeight
  
  ctx.beginPath()
  
  // Move to first point (scaled to canvas dimensions)
  const firstPoint = points[0]
  ctx.moveTo(firstPoint.x * scaleX, firstPoint.y * scaleY)
  
  // Draw lines to remaining points
  for (let i = 1; i < points.length; i++) {
    const point = points[i]
    ctx.lineTo(point.x * scaleX, point.y * scaleY)
  }
  
  // Close the polygon
  ctx.closePath()
  
  // Convert hex color to RGBA for transparency
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  
  // Draw defect with color-specific outline only (no fill)
  ctx.strokeStyle = hexToRgba(color, 1.0) // Full opacity colored outline
  ctx.lineWidth = 3 // Slightly thicker for better visibility
  ctx.stroke()
}

// Check if a defect is selected
const isDefectSelected = (defectName) => {
  return selectedDefects.value.has(defectName)
}

/**
 * Initialize defect selection by collecting all defect types from both faces.
 * Called when a new board is loaded to set up initial defect visibility state.
 */
const initializeDefectSelection = () => {
  const allDefects = new Set()
  
  // Add all defect types from both faces
  if (props.board?.face1?.defects) {
    props.board.face1.defects.forEach(group => {
      if (group.name) allDefects.add(group.name)
    })
  }
  if (props.board?.face2?.defects) {
    props.board.face2.defects.forEach(group => {
      if (group.name) allDefects.add(group.name)
    })
  }
  
  selectedDefects.value = allDefects
}

/**
 * Toggle all defects on or off at once.
 * If no defects are selected, selects all. If any are selected, clears all.
 */
const toggleAllDefects = () => {
  if (selectedDefects.value.size === 0) {
    // Select all
    initializeDefectSelection()
  } else {
    // Clear all
    selectedDefects.value = new Set()
  }
}

/**
 * Handle successful image loading by setting up canvas overlay dimensions and drawing defects.
 * Sets up the canvas to match the displayed image dimensions and initializes drawing contexts.
 * 
 * @param {Event} event - Image load event
 * @param {number} index - Face index (0 or 1)
 */
const handleImageLoad = async (event, index) => {
  const img = event.target
  
  // Wait for next tick to ensure canvas ref is set
  await nextTick()
  
  let canvas = canvasRefs.value[index]
  
  if (!canvas) {
    // Try to find it in DOM as fallback
    const parentDiv = img.parentElement
    const canvasInParent = parentDiv?.querySelector('canvas')
    if (canvasInParent) {
      canvasRefs.value[index] = canvasInParent
      canvas = canvasInParent
    } else {
      return
    }
  }
  
  // Get actual display dimensions of the image
  const displayWidth = img.offsetWidth
  const displayHeight = img.offsetHeight
  
  // IMPORTANT: Set the actual canvas buffer size FIRST (this clears the canvas!)
  canvas.width = displayWidth
  canvas.height = displayHeight
  
  // Set the CSS display size to match (this stretches/shrinks the canvas to fit)
  canvas.style.width = displayWidth + 'px'
  canvas.style.height = displayHeight + 'px'
  
  // Get canvas context AFTER setting size (because changing size clears the canvas)
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  canvasContexts.value[index] = ctx
  
  imageDimensions.value[index] = {
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    displayWidth: displayWidth,
    displayHeight: displayHeight
  }
  
  imageLoadedStates.value[index] = true
  
  // Draw defects overlay
  drawDefectsOnCanvas(index)
}

// Get filtered defects based on selection and minor defect toggle
const getFilteredDefects = (faceNumber) => {
  if (!props.board) return []
  
  const face = faceNumber === 1 ? props.board.face1 : props.board.face2
  if (!face?.defects) return []
  
  // Filter based on hideFilteredDefects toggle
  let defects = face.defects
  if (hideFilteredDefects.value) {
    // Filter out minor defects (you can adjust this logic based on your API)
    defects = defects.filter(d => {
      // Example: filter out defects marked as minor or below a certain size threshold
      // This depends on how your API marks minor defects
      return !d.isMinor && !d.name?.toLowerCase().includes('minor')
    })
  }
  
  return defects
}

// Get SVG overlay style to match image dimensions
const getSvgOverlayStyle = (index) => {
  const dims = imageDimensions.value[index]
  if (!dims) return { display: 'none' }
  
  return {
    width: `${dims.displayWidth}px`,
    height: `${dims.displayHeight}px`
  }
}

// Scale defect coordinates to match displayed image size
const getScaledX = (x, imageIndex) => {
  const dims = imageDimensions.value[imageIndex]
  if (!dims || !x) return 0
  return (x / dims.naturalWidth) * dims.displayWidth
}

const getScaledY = (y, imageIndex) => {
  const dims = imageDimensions.value[imageIndex]
  if (!dims || !y) return 0
  return (y / dims.naturalHeight) * dims.displayHeight
}

const getScaledWidth = (width, imageIndex) => {
  const dims = imageDimensions.value[imageIndex]
  if (!dims || !width) return 0
  return (width / dims.naturalWidth) * dims.displayWidth
}

const getScaledHeight = (height, imageIndex) => {
  const dims = imageDimensions.value[imageIndex]
  if (!dims || !height) return 0
  return (height / dims.naturalHeight) * dims.displayHeight
}

// Watch for board changes and initialize defects visibility
watch(() => props.board, (newBoard) => {
  if (newBoard) {
    // Board changed, reset defect visibility
    
    // Start with no defects selected (clean board)
    selectedDefects.value = new Set()
    // Board loaded with clean view (no defects selected)
    
    // Reset feedback state
    feedbackSubmitted.value = false
    
    // Redraw defects after board loads
    nextTick(() => {
      if (imageLoadedStates.value[0]) {
        drawDefectsOnCanvas(0)
      }
      if (imageLoadedStates.value[1]) {
        drawDefectsOnCanvas(1)
      }
    })
  }
}, { immediate: true })

/**
 * Submit user feedback about grading disagreement.
 * Stores feedback locally and marks as submitted for the current board.
 */
const submitFeedback = () => {
  if (!feedbackForm.value.reason) return
  
  // TODO: Send feedback to API when backend endpoint is available
  
  // Mark feedback as submitted
  feedbackSubmitted.value = true
  showFeedbackModal.value = false
  
  // Store feedback in localStorage for persistence
  if (props.board?.id) {
    const feedbackKey = `board-feedback-${props.board.id}`
    localStorage.setItem(feedbackKey, JSON.stringify({
      submitted: true,
      date: new Date().toISOString(),
      reason: feedbackForm.value.reason
    }))
  }
  
  // Reset form
  feedbackForm.value = { reason: '', comment: '' }
}

// Toggle magnifier
const toggleMagnifier = () => {
  magnifierEnabled.value = !magnifierEnabled.value
  if (!magnifierEnabled.value) {
    showMagnifier.value = false
  }
}

// Handle mouse movement
const handleMouseMove = (event, boardIndex) => {
  if (!magnifierEnabled.value) return
  
  activeMagnifierBoard.value = boardIndex
  
  const rect = event.currentTarget.getBoundingClientRect()
  mousePosition.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
}

// Handle mouse enter for magnifier
const handleMouseEnter = (boardIndex) => {
  if (!magnifierEnabled.value) return
  showMagnifier.value = true
  activeMagnifierBoard.value = boardIndex
}

// Handle mouse leave for magnifier
const handleMouseLeave = () => {
  showMagnifier.value = false
  activeMagnifierBoard.value = null
}

// Computed styles for magnifier
const magnifierStyle = computed(() => {
  const { x, y } = mousePosition.value
  
  const activeContainer = imageContainers.value[activeMagnifierBoard.value]
  if (!activeContainer) return {}
  
  const containerRect = activeContainer.getBoundingClientRect()
  
  // Calculate screen position
  const screenX = containerRect.left + x
  const screenY = containerRect.top + y
  
  // Position magnifier above the cursor, centered horizontally
  let left = screenX - (magnifierSize / 2)
  let top = screenY - magnifierSize - 20
  
  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${magnifierSize}px`,
    height: `${magnifierSize}px`,
    backgroundColor: '#ffffff'
  }
})

// Get magnified image style for specific board
const getMagnifiedImageStyle = (boardIndex) => {
  const { x, y } = mousePosition.value
  
  const activeContainer = imageContainers.value[boardIndex]
  const activeImage = imageRefs.value[boardIndex]
  const boardImage = boardImages.value?.[boardIndex]
  
  if (!activeContainer || !activeImage || !boardImage) return {}
  
  const containerRect = activeContainer.getBoundingClientRect()
  const imageRect = activeImage.getBoundingClientRect()
  
  // Calculate the scale factor between the container and the actual image
  const scaleX = activeImage.naturalWidth / imageRect.width
  const scaleY = activeImage.naturalHeight / imageRect.height
  
  // Convert cursor position to image coordinates
  const imageX = x * scaleX
  const imageY = y * scaleY
  
  // Calculate background position to center the cursor area in the magnifier
  const backgroundX = -(imageX * magnificationLevel) + (magnifierSize / 2)
  const backgroundY = -(imageY * magnificationLevel) + (magnifierSize / 2)
  
  // Calculate the background size based on the original image dimensions
  const backgroundWidth = activeImage.naturalWidth * magnificationLevel
  const backgroundHeight = activeImage.naturalHeight * magnificationLevel
  
  // Use high-res URL for magnifier to ensure clarity
  const imageUrl = boardImage.highResUrl || activeImage.src
  
  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: `${backgroundWidth}px ${backgroundHeight}px`,
    backgroundPosition: `${backgroundX}px ${backgroundY}px`,
    imageRendering: 'crisp-edges' // Ensure sharp rendering
  }
}

/**
 * Get the URL for a board face image.
 * Always returns the clean image URL (no defects or overlays).
 * Images are served by nginx on port 80 from gateway/stitches paths.
 * 
 * @param {number} index - Face index (0 or 1)
 * @returns {string} Image URL path
 */
const getImageUrl = (index) => {
  if (!props.board) return ''
  
  const faceNumber = index + 1
  const faceName = `face${faceNumber}`
  const face = props.board[faceName]
  
  // Always use the clean face URL from the API - it's served by nginx on port 80
  // We'll overlay the usable area mask separately
  if (face?.url) {
    return `/${face.url}`
  }
  
  // Fallback to constructed URL if no face URL
  const boardId = props.board.id
  return `/api/legacy/ui/images/render/board/${boardId}/face${faceNumber}/original`
}

/**
 * Get the URL for the usable area mask overlay.
 * Returns a semi-transparent PNG showing areas suitable for clear cuttings.
 * Only available for the grading face.
 * 
 * @param {number} index - Face index (0 or 1)
 * @returns {string} Mask image URL path or empty string if unavailable
 */
const getMaskUrl = (index) => {
  if (!props.board) return ''
  
  const faceNumber = index + 1
  const faceName = `face${faceNumber}`
  const face = props.board[faceName]
  
  
  // Return the mask URL if available (served as PNG with transparency)
  if (face?.usableAreaMaskUrl) {
    return `/${face.usableAreaMaskUrl}`
  }
  
  return ''
}

// Note: These functions were removed as we now use server-provided mask overlays
// The API doesn't currently provide coordinate data for client-side drawing

/**
 * DEPRECATED: Client-side usable area drawing.
 * This function is no longer used as we now use server-provided mask overlays.
 * Kept for reference in case server masks become unavailable.
 * 
 * @deprecated Use server mask overlays via getMaskUrl() instead
 * @param {number} canvasIndex - Index of the canvas (0 or 1)
 */
const drawUsableAreaOverlay = async (canvasIndex) => {
  const canvas = usableAreaCanvasRefs.value[canvasIndex]
  const img = imageRefs.value[canvasIndex]
  
  if (!canvas || !img) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // Get the actual image dimensions from the loaded image
  const displayWidth = img.clientWidth
  const displayHeight = img.clientHeight
  const naturalWidth = img.naturalWidth
  const naturalHeight = img.naturalHeight
  
  // Set canvas size to match display dimensions
  canvas.width = displayWidth
  canvas.height = displayHeight
  canvas.style.width = displayWidth + 'px'
  canvas.style.height = displayHeight + 'px'
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  if (!showUsableArea.value) return
  
  const faceNumber = canvasIndex + 1
  const faceName = `face${faceNumber}`
  const face = props.board[faceName]
  
  // Note: This function is currently disabled as we use server-provided mask overlays
  // Keeping the defect-based approach as fallback if server masks are unavailable
  
  // High contrast approach: Darken entire board, then highlight usable areas
  
  // First, darken the entire board (everything non-usable by default)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)' // Dark overlay
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // Create a temporary canvas to build the usable area mask
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = displayWidth
  tempCanvas.height = displayHeight
  const tempCtx = tempCanvas.getContext('2d')
  
  // Draw the image first to use as a mask for board boundaries
  tempCtx.drawImage(img, 0, 0, displayWidth, displayHeight)
  
  // Get image data to detect board vs background
  const boardMaskData = tempCtx.getImageData(0, 0, displayWidth, displayHeight)
  
  // Clear and start fresh for the usable area mask
  tempCtx.clearRect(0, 0, displayWidth, displayHeight)
  tempCtx.fillStyle = 'white'
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
  
  // Now cut out major defect areas (make them black/non-usable)
  if (face?.defects) {
    tempCtx.fillStyle = 'black'
    
    for (const defectGroup of face.defects) {
      if (!defectGroup.defects) continue
      
      for (const defect of defectGroup.defects) {
        // Skip filtered (minor) defects - they don't affect usable area
        if (defect.filtered) continue
        
        if (!defect.points || defect.points.length < 6) continue
        
        const points = parseDefectCoordinates(defect.points)
        if (points.length < 3) continue
        
        // Use the natural dimensions for proper scaling
        const scaleX = displayWidth / naturalWidth
        const scaleY = displayHeight / naturalHeight
        
        // Draw defect polygon with padding
        tempCtx.beginPath()
        tempCtx.moveTo(points[0].x * scaleX, points[0].y * scaleY)
        for (let i = 1; i < points.length; i++) {
          tempCtx.lineTo(points[i].x * scaleX, points[i].y * scaleY)
        }
        tempCtx.closePath()
        
        // Fill the defect area
        tempCtx.fill()
        
        // Add padding around defects (safety margin)
        tempCtx.lineWidth = Math.max(5, 20 * scaleX)
        tempCtx.stroke()
      }
    }
  }
  
  // Convert the mask to bright white overlay for usable areas
  const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
  const data = imageData.data
  const boardPixels = boardMaskData.data
  
  // Improved background detection
  for (let i = 0; i < data.length; i += 4) {
    // Check if this pixel is part of the board (not gray/black background)
    const r = boardPixels[i]
    const g = boardPixels[i + 1]
    const b = boardPixels[i + 2]
    
    // Calculate pixel position for edge detection
    const pixelIndex = i / 4
    const x = pixelIndex % displayWidth
    const y = Math.floor(pixelIndex / displayWidth)
    
    // Detect background using multiple criteria
    const avgColor = (r + g + b) / 3
    const maxColorDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b))
    
    const isBackground = (
      // Black or very dark areas (borders)
      avgColor < 40 ||
      // Gray background with low color variance
      (maxColorDiff < 25 && avgColor > 80 && avgColor < 180) ||
      // Top and bottom edges (usually background)
      y < 10 || y > displayHeight - 10 ||
      // Pure black pixels
      (r === 0 && g === 0 && b === 0)
    )
    
    // Additional check for wood grain vs gray background
    // Wood typically has more color variation than uniform gray
    const hasWoodTexture = maxColorDiff > 30 || 
                          (avgColor > 180 && avgColor < 250) || // Lighter wood
                          (avgColor > 50 && avgColor < 80 && maxColorDiff > 15) // Darker wood
    
    if (isBackground && !hasWoodTexture) {
      // This is background, make it fully transparent
      data[i + 3] = 0
    } else if (data[i] > 128) { // White areas (usable wood)
      // Make it bright white with transparency
      data[i] = 255     // R
      data[i + 1] = 255 // G
      data[i + 2] = 255 // B
      data[i + 3] = 120 // Alpha - semi-transparent white overlay
    } else { // Black areas (defects on wood)
      // Keep them fully transparent to show dark overlay
      data[i + 3] = 0
    }
  }
  
  // Apply the bright overlay for usable areas
  ctx.putImageData(imageData, 0, 0)
}

// Fallback URL for when clean images aren't available (use annotated version)
const getFallbackImageUrl = (index) => {
  if (!props.board) return ''
  
  const faceNumber = index + 1
  const boardId = props.board.id
  
  // Always use our constructed URL - don't trust URLs from API as they may contain placeholders
  return `/api/legacy/ui/images/render/board/${boardId}/face${faceNumber}/original`
}

/**
 * Draw selected defects on the canvas overlay for a specific face.
 * Only draws defects that are currently selected for visibility.
 * Supports both polygon and bounding box defect representations.
 * 
 * @param {number} canvasIndex - Index of the canvas (0 or 1) corresponding to face number
 */
const drawDefectsOnCanvas = (canvasIndex) => {
  const ctx = canvasContexts.value[canvasIndex]
  const dims = imageDimensions.value[canvasIndex]
  
  if (!ctx || !dims) {
    return
  }
  
  const faceNumber = canvasIndex + 1
  const defectGroups = getFaceDefects(faceNumber)
  
  // Clear the canvas first (removes all previously drawn defects)
  ctx.clearRect(0, 0, dims.displayWidth, dims.displayHeight)
  
  // Get the original image dimensions (needed for scaling)
  const originalWidth = dims.naturalWidth || dims.displayWidth
  const originalHeight = dims.naturalHeight || dims.displayHeight
  
  // Only draw SELECTED defects
  defectGroups.forEach(defectGroup => {
    const isSelected = isDefectSelected(defectGroup.name)
    
    // Skip unselected defect groups entirely - don't draw them at all
    if (!isSelected) {
      return
    }
    
    // Draw each defect in the selected group
    defectGroup.defects?.forEach((defect, idx) => {
      // Skip filtered defects if hideFilteredDefects is enabled
      if (hideFilteredDefects.value && defect?.filtered) {
        return // Skip this defect
      }
      
      if (defect?.points && defect.points.length >= 6) {
        // Parse coordinates from serialized format [x1,y1,x2,y2,x3,y3...]
        const points = parseDefectCoordinates(defect.points)
        
        if (points.length >= 3) {
          // Draw defect polygon with the defect group's color
          drawDefectPolygon(
            ctx, 
            points, 
            originalWidth, 
            originalHeight, 
            dims.displayWidth, 
            dims.displayHeight, 
            defectGroup.color || '#FF0000' // Use the defect group's color
          )
        }
      } else if (defect?.boundingBox) {
        // Skip filtered defects if hideFilteredDefects is enabled
        if (hideFilteredDefects.value && defect?.filtered) {
          return // Skip this defect
        }
        
        // Fallback: draw rectangle from bounding box
        const bbox = defect.boundingBox
        
        const scaleX = dims.displayWidth / originalWidth
        const scaleY = dims.displayHeight / originalHeight
        
        const scaledX = bbox.x * scaleX
        const scaledY = bbox.y * scaleY
        const scaledWidth = bbox.width * scaleX
        const scaledHeight = bbox.height * scaleY
        
        // Convert hex color to RGBA for transparency
        const hexToRgba = (hex, alpha) => {
          const r = parseInt(hex.slice(1, 3), 16)
          const g = parseInt(hex.slice(3, 5), 16)
          const b = parseInt(hex.slice(5, 7), 16)
          return `rgba(${r}, ${g}, ${b}, ${alpha})`
        }
        
        const color = defectGroup.color || '#FF0000'
        
        // Draw defect rectangle with outline only (no fill)
        ctx.strokeStyle = hexToRgba(color, 1.0) // Full opacity colored outline
        ctx.lineWidth = 3 // Slightly thicker for better visibility
        ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight)
      }
    })
  })
}


// Draw defect rectangle from bounding box
const drawDefectRectangle = (ctx, bbox, dims) => {
  const x = ((bbox.x || 0) / dims.naturalWidth) * dims.displayWidth
  const y = ((bbox.y || 0) / dims.naturalHeight) * dims.displayHeight
  const width = ((bbox.width || 50) / dims.naturalWidth) * dims.displayWidth
  const height = ((bbox.height || 50) / dims.naturalHeight) * dims.displayHeight
  
  ctx.fillRect(x, y, width, height)
  ctx.strokeRect(x, y, width, height)
}

// Watch for board changes
watch(() => props.board, async (newBoard) => {
  if (newBoard) {
    // Reset image states when board changes
    imageLoadedStates.value = [false, false]
    imageDimensions.value = [null, null]
    canvasContexts.value = []
    
    initializeDefectSelection()
    await loadBoardImages()
    
    // Check if feedback was previously submitted for this board
    const feedbackKey = `board-feedback-${newBoard.id}`
    const storedFeedback = localStorage.getItem(feedbackKey)
    if (storedFeedback) {
      try {
        const feedback = JSON.parse(storedFeedback)
        feedbackSubmitted.value = feedback.submitted || false
      } catch (e) {
        feedbackSubmitted.value = false
      }
    } else {
      feedbackSubmitted.value = false
    }
  }
}, { immediate: true })

// Watch for defect selection changes and redraw canvas
watch([selectedDefects, hideFilteredDefects], () => {
  // Redraw both canvases when defect selections change
  [0, 1].forEach(index => {
    if (imageLoadedStates.value[index]) {
      drawDefectsOnCanvas(index)
    }
  })
}, { deep: true })

// Lifecycle
onMounted(async () => {
  if (props.board) {
    await loadBoardImages()
  }
})

// Expose methods for parent components
defineExpose({
  toggleUsableArea,
  loadBoardImages,
  showUsableArea,
  showFeedbackModal
})
</script>

<style scoped>
/* BoardViewer styles */
.board-viewer {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>