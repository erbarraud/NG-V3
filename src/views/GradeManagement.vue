<template>
  <div class="grade-management">
    <div class="header-section w-full px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Grade Management</h1>
          <p class="text-gray-600 mt-1">Manage lumber grading standards and templates</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <Search class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search grades..."
              class="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <button 
            @click="openCreateModal"
            class="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
          >
            <Plus class="w-4 h-4 mr-2" />
            Create New Grade
          </button>
        </div>
      </div>
    </div>
    
    <div class="content-wrapper w-full px-4 sm:px-6 lg:px-8 py-6">
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

      <!-- Grades Table -->
      <GradeTable 
        v-else
        :grades="gradeCards"
        @view-grade="viewGradeDetails"
        @edit-grade="editGrade"
        @duplicate-grade="handleDuplicateGrade"
      />
    </div>

    <!-- Grade Form Modal -->
    <GradeFormModal
      :show="showModal"
      :form-data="formData"
      :is-edit-mode="isEditMode"
      @close="closeModal"
      @save="saveGrade"
    />

    <!-- Grade Details Modal -->
    <GradeDetailsModal
      :show="showDetailsModal"
      :grade="selectedGrade"
      @close="closeDetailsModal"
      @edit-grade="editGrade"
      @duplicate-grade="handleDuplicateGrade"
    />

    <!-- Success/Error Messages -->
    <div v-if="showMessage" class="fixed top-4 right-4 z-50">
      <div :class="[
        'px-4 py-3 rounded-lg shadow-lg border flex items-center space-x-3 transition-all duration-300',
        messageType === 'success' 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-red-50 border-red-200 text-red-800'
      ]">
        <CheckCircle v-if="messageType === 'success'" class="h-5 w-5 text-green-600" />
        <AlertTriangle v-else class="h-5 w-5 text-red-600" />
        <span class="text-sm font-medium">{{ messageText }}</span>
        <button @click="hideMessage" class="text-gray-400 hover:text-gray-600">
          <X class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, Plus, CheckCircle, AlertTriangle, X } from 'lucide-vue-next'
import GradeTable from '@/components/grade/GradeTable.vue'
import GradeFormModal from '@/components/grade/GradeFormModal.vue'
import GradeDetailsModal from '@/components/grade/GradeDetailsModal.vue'
import { useGradeData } from '@/composables/useGradeData.js'

const { gradeCards, createGrade, updateGrade, duplicateGrade } = useGradeData()

// State
const isLoading = ref(false)
const showModal = ref(false)
const showDetailsModal = ref(false)
const selectedGrade = ref(null)
const isEditMode = ref(false)
const editingGradeId = ref(null)

// Message state
const showMessage = ref(false)
const messageType = ref('success')
const messageText = ref('')

// Form data
const formData = ref({
  name: '',
  type: '',
  description: '',
  specifications: {
    minWidth: '',
    minLength: '',
    clearFace: '',
    maxDefects: ''
  }
})

// Modal methods
const openCreateModal = () => {
  console.log('Opening create modal...')
  isEditMode.value = false
  resetForm()
  showModal.value = true
  console.log('Modal state:', showModal.value)
  console.log('Form data:', formData.value)
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const resetForm = () => {
  formData.value = {
    name: '',
    type: '',
    description: '',
    specifications: {
      minWidth: '',
      minLength: '',
      clearFace: '',
      maxDefects: ''
    }
  }
}

const saveGrade = (gradeData) => {
  try {
    if (isEditMode.value) {
      const updatedGrade = updateGrade(editingGradeId.value, gradeData)
      if (updatedGrade) {
        showSuccessMessage(`Grade "${gradeData.name}" has been updated successfully.`)
      } else {
        showErrorMessage('Failed to update grade. Please try again.')
      }
    } else {
      createGrade(gradeData)
      showSuccessMessage(`Grade "${gradeData.name}" has been created successfully.`)
    }
    closeModal()
  } catch (error) {
    console.error('Error saving grade:', error)
    showErrorMessage('Failed to save grade. Please try again.')
  }
}

// Grade actions
const viewGradeDetails = (grade) => {
  selectedGrade.value = grade
  showDetailsModal.value = true
}

const editGrade = (grade) => {
  isEditMode.value = true
  editingGradeId.value = grade.id
  
  // Populate form with grade data
  formData.value = {
    name: grade.name,
    type: grade.type,
    description: grade.description,
    specifications: {
      minWidth: grade.keySpecs[0]?.split(': ')[1]?.replace(' inches', '') || '',
      minLength: grade.keySpecs[1]?.split(': ')[1]?.replace(' feet', '') || '',
      clearFace: grade.keySpecs[2]?.split(': ')[1]?.replace('%', '') || '',
      maxDefects: grade.keySpecs[3]?.split(': ')[1] || ''
    }
  }
  
  showModal.value = true
}

const handleDuplicateGrade = (grade) => {
  try {
    const duplicatedGrade = duplicateGrade(grade)
    showSuccessMessage(`Grade "${grade.name}" has been duplicated successfully.`)
  } catch (error) {
    console.error('Error duplicating grade:', error)
    showErrorMessage('Failed to duplicate grade. Please try again.')
  }
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedGrade.value = null
}

// Message methods
const showSuccessMessage = (text) => {
  messageType.value = 'success'
  messageText.value = text
  showMessage.value = true
  setTimeout(() => {
    hideMessage()
  }, 5000)
}

const showErrorMessage = (text) => {
  messageType.value = 'error'
  messageText.value = text
  showMessage.value = true
  setTimeout(() => {
    hideMessage()
  }, 5000)
}

const hideMessage = () => {
  showMessage.value = false
  messageText.value = ''
}
</script>