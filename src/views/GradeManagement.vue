<template>
  <ErrorBoundary>
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
          
          <router-link 
            to="/grade-management/create"
            class="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
          >
            <Plus class="w-4 h-4 mr-2" />
            Create New Grade
          </router-link>
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
        :grades="gradeStore.grades"
        @view-grade="viewGradeDetails"
        @edit-grade="editGrade"
        @duplicate-grade="handleDuplicateGrade"
      />
    </div>

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
  </ErrorBoundary>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Plus, CheckCircle, AlertTriangle, X } from 'lucide-vue-next'
import ErrorBoundary from '@/components/error/error-boundary.vue'
import GradeTable from '@/components/grade/GradeTable.vue'
import { useGradeStore } from '@/stores/grades'

const router = useRouter()
const gradeStore = useGradeStore()

// State
const isLoading = ref(false)

// Message state
const showMessage = ref(false)
const messageType = ref('success')
const messageText = ref('')

// Grade actions
const viewGradeDetails = (grade) => {
  try {
    // Navigate to CreateGrade page with view/edit mode
    router.push(`/grade-management/create?edit=true&id=${grade.id}`)
  } catch (error) {
    console.error('Navigation error:', error)
    showErrorMessage('Failed to navigate to grade details. Please try again.')
  }
}

const editGrade = (grade) => {
  try {
    // Navigate to CreateGrade page with edit mode
    router.push(`/grade-management/create?edit=true&id=${grade.id}`)
  } catch (error) {
    console.error('Navigation error:', error)
    showErrorMessage('Failed to navigate to edit page. Please try again.')
  }
}

const handleDuplicateGrade = (grade) => {
  try {
    gradeStore.duplicateGrade(grade)
    showSuccessMessage(`Grade "${grade.name}" has been duplicated successfully.`)
  } catch (error) {
    console.error('Error duplicating grade:', error)
    showErrorMessage('Failed to duplicate grade. Please try again.')
  }
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