<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Modal backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="$emit('close')"></div>
    
    <!-- Modal panel -->
    <div class="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
          <!-- Modal header -->
          <div class="bg-white px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900" id="modal-title">
                {{ isEditMode ? 'Edit Grade' : 'Create New Grade' }}
              </h3>
              <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
                <X class="w-6 h-6" />
              </button>
            </div>
          </div>

          <!-- Modal content -->
          <div class="bg-white px-6 py-6">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Basic Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="gradeName" class="block text-sm font-medium text-gray-700 mb-2">
                    Grade Name *
                  </label>
                  <input
                    id="gradeName"
                    v-model="localFormData.name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter grade name"
                  />
                </div>

                <div>
                  <label for="gradeType" class="block text-sm font-medium text-gray-700 mb-2">
                    Grade Type *
                  </label>
                  <select
                    id="gradeType"
                    v-model="localFormData.type"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select grade type</option>
                    <option value="Hardwood">Hardwood</option>
                    <option value="Softwood">Softwood</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              <!-- Description -->
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  v-model="localFormData.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter grade description"
                ></textarea>
              </div>

              <!-- Specifications -->
              <div>
                <h4 class="text-lg font-medium text-gray-900 mb-4">Specifications</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="minWidth" class="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Width (inches)
                    </label>
                    <input
                      id="minWidth"
                      v-model="localFormData.specifications.minWidth"
                      type="number"
                      step="0.25"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label for="minLength" class="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Length (feet)
                    </label>
                    <input
                      id="minLength"
                      v-model="localFormData.specifications.minLength"
                      type="number"
                      step="0.5"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label for="clearFace" class="block text-sm font-medium text-gray-700 mb-2">
                      Clear Face Percentage (%)
                    </label>
                    <input
                      id="clearFace"
                      v-model="localFormData.specifications.clearFace"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label for="maxDefects" class="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Defects
                    </label>
                    <input
                      id="maxDefects"
                      v-model="localFormData.specifications.maxDefects"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g., Minimal, Few, Moderate"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          <!-- Modal footer -->
          <div class="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="handleSubmit"
              :disabled="!isFormValid"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                isFormValid
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              ]"
            >
              {{ isEditMode ? 'Update Grade' : 'Create Grade' }}
            </button>
          </div>
        </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  formData: {
    type: Object,
    default: () => ({
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
  },
  isEditMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

const localFormData = ref({
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

const isFormValid = computed(() => {
  return localFormData.value.name.trim() !== '' && localFormData.value.type !== ''
})

const handleSubmit = () => {
  if (!isFormValid.value) return
  emit('save', localFormData.value)
}

// Initialize and watch for form data changes
watch(() => props.formData, (newData) => {
  console.log('GradeFormModal: formData changed', newData)
  if (newData) {
    localFormData.value = { ...newData }
  }
}, { deep: true, immediate: true })

// Watch show prop changes
watch(() => props.show, (newVal) => {
  console.log('GradeFormModal: show changed to', newVal)
})
</script>