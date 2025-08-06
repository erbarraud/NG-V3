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
          <router-link to="/grade-management/create" class="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center">
            <Plus class="w-4 h-4 mr-2" />
            Create New Grade
          </router-link>
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
      <!-- Grades Table -->
      <div v-else class="bg-white shadow rounded-lg overflow-hidden">
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
              v-for="grade in gradeCards" 
              :key="grade.id" 
              class="hover:bg-emerald-50 transition-colors duration-150 cursor-pointer"
              @click="viewGradeDetails(grade)"
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
                    @click.stop="viewGradeDetails(grade)"
                    class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                    title="View Details"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <button 
                    @click.stop="editGrade(grade)"
                    class="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
                    title="Edit Grade"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  <button 
                    @click.stop="duplicateGrade(grade)"
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
    </div> <!-- /content -->

    <!-- Grade Creation/Editing Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <!-- Modal backdrop with blur effect -->
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full max-h-screen overflow-y-auto">
          <!-- Modal header -->
          <div class="bg-white px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900" id="modal-title">
                {{ isEditMode ? 'Edit Grade' : 'Create New Grade' }}
              </h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                <X class="w-6 h-6" />
              </button>
            </div>
          </div>

          <!-- Modal content -->
          <div class="bg-white px-6 py-6">
            <form @submit.prevent="saveGrade" class="space-y-6">
              <!-- Basic Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="gradeName" class="block text-sm font-medium text-gray-700 mb-2">
                    Grade Name *
                  </label>
                  <input
                    id="gradeName"
                    v-model="formData.name"
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
                    v-model="formData.type"
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
                  v-model="formData.description"
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
                      v-model="formData.specifications.minWidth"
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
                      v-model="formData.specifications.minLength"
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
                      v-model="formData.specifications.clearFace"
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
                      v-model="formData.specifications.maxDefects"
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
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="saveGrade"
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
      </div>
    </Teleport>
  </div> <!-- /root -->
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="delete-modal-title" role="dialog" aria-modal="true">
      <!-- Modal backdrop -->
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity" aria-hidden="true" @click="closeDeleteModal"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <!-- Modal header -->
          <div class="bg-white px-6 py-4">
            <div class="flex items-center">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <AlertTriangle class="h-6 w-6 text-red-600" />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="delete-modal-title">
                  Delete Grade
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete "{{ gradeToDelete?.name }}"?
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal content -->
          <div class="bg-white px-6 py-4">
            <!-- Warning for grades in use -->
            <div v-if="gradeToDelete && gradeToDelete.usageCount > 0" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div class="flex">
                <AlertTriangle class="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                <div>
                  <h4 class="text-sm font-medium text-yellow-800">Warning: Grade Currently in Use</h4>
                  <p class="text-sm text-yellow-700 mt-1">
                    This grade is currently used in {{ gradeToDelete.usageCount }} order(s). 
                    Deleting it may affect existing production orders and historical data.
                  </p>
                </div>
              </div>
            </div>

            <!-- Safe deletion message -->
            <div v-else class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex">
                <CheckCircle class="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                <div>
                  <h4 class="text-sm font-medium text-green-800">Safe to Delete</h4>
                  <p class="text-sm text-green-700 mt-1">
                    This grade is not currently used in any orders and can be safely deleted.
                  </p>
                </div>
              </div>
            </div>

            <p class="text-sm text-gray-600">
              This action cannot be undone. All grade specifications and zone mappings will be permanently removed.
            </p>
          </div>

          <!-- Modal footer -->
          <div class="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              @click="closeDeleteModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="confirmDelete"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                gradeToDelete && gradeToDelete.usageCount > 0
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
              ]"
            >
              {{ gradeToDelete && gradeToDelete.usageCount > 0 ? 'Delete Anyway' : 'Delete Grade' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Grade Details Modal -->
    <Teleport to="body">
      <div v-if="showDetailsModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="details-modal-title" role="dialog" aria-modal="true">
        <!-- Modal backdrop -->
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity" aria-hidden="true" @click="closeDetailsModal"></div>

          <!-- Modal panel -->
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
            <!-- Modal header -->
            <div class="bg-white px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <h3 class="text-xl font-semibold text-gray-900" id="details-modal-title">
                    {{ selectedGrade?.name }}
                  </h3>
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getColorClasses(selectedGrade?.color).badge
                  ]">
                    {{ selectedGrade?.species }}
                  </span>
                </div>
                <button @click="closeDetailsModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                  <X class="w-6 h-6" />
                </button>
              </div>
            </div>

            <!-- Modal content -->
            <div class="bg-white px-6 py-6 max-h-96 overflow-y-auto">
              <div v-if="selectedGrade" class="space-y-6">
                <!-- Grade Overview -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center mb-2">
                      <Package class="w-5 h-5 text-gray-600 mr-2" />
                      <span class="text-sm font-medium text-gray-700">Usage Statistics</span>
                    </div>
                    <div class="text-2xl font-bold text-gray-900">{{ selectedGrade.usageCount }}</div>
                    <div class="text-sm text-gray-600">Orders processed</div>
                  </div>
                  
                  <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center mb-2">
                      <BarChart3 class="w-5 h-5 text-gray-600 mr-2" />
                      <span class="text-sm font-medium text-gray-700">Total Volume</span>
                    </div>
                    <div class="text-2xl font-bold text-gray-900">{{ getTotalVolume(selectedGrade) }}</div>
                    <div class="text-sm text-gray-600">Processed to date</div>
                  </div>
                  
                  <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center mb-2">
                      <Clock class="w-5 h-5 text-gray-600 mr-2" />
                      <span class="text-sm font-medium text-gray-700">Last Used</span>
                    </div>
                    <div class="text-lg font-bold text-gray-900">{{ getLastUsedDate(selectedGrade) }}</div>
                    <div class="text-sm text-gray-600">Most recent order</div>
                  </div>
                </div>

                <!-- Grade Description -->
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                  <p class="text-gray-700 bg-gray-50 rounded-lg p-4">{{ selectedGrade.description }}</p>
                </div>

                <!-- Grade Specifications -->
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 mb-3">Key Specifications</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="spec in selectedGrade.keySpecs" :key="spec" class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span class="text-sm text-gray-700">{{ spec }}</span>
                    </div>
                  </div>
                </div>

                <!-- Recent Orders Using This Grade -->
                <div v-if="selectedGrade.usageCount > 0">
                  <h4 class="text-lg font-semibold text-gray-900 mb-3">Recent Orders</h4>
                  <div class="bg-gray-50 rounded-lg overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-100">
                        <tr>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="order in getOrdersUsingGrade(selectedGrade)" :key="order.id" class="hover:bg-gray-50">
                          <td class="px-4 py-3 whitespace-nowrap">
                            <router-link :to="`/orders/${order.id}`" class="text-sm font-medium text-emerald-600 hover:text-emerald-800 hover:underline">
                              {{ order.id }}
                            </router-link>
                          </td>
                          <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ order.customer }}</td>
                          <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ order.volume }}</td>
                          <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ order.date }}</td>
                          <td class="px-4 py-3 whitespace-nowrap">
                            <span :class="[
                              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                              order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                              order.status === 'Running' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            ]">
                              {{ order.status }}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- No Usage Message -->
                <div v-else class="text-center py-8">
                  <Package class="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h4 class="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h4>
                  <p class="text-gray-600">This grade hasn't been used in any production orders.</p>
                </div>
              </div>
            </div>

            <!-- Modal footer -->
            <div class="bg-gray-50 px-6 py-4 flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <button
                  @click="editGrade(selectedGrade)"
                  class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                >
                  <Edit class="w-4 h-4 mr-2" />
                  Edit Grade
                </button>
                <button
                  @click="duplicateGrade(selectedGrade)"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Copy class="w-4 h-4 mr-2" />
                  Duplicate
                </button>
              </div>
              <button
                @click="closeDetailsModal"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

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
</template>

<script setup>
import { ref, computed, nextTick, Teleport } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Plus, Eye, Edit, Copy, Trash2, Package, X, Palette, AlertTriangle, CheckCircle, BarChart3, Clock } from 'lucide-vue-next'

const router = useRouter()

// Canvas and zones state
const zones = ref([])
const fabricCanvas = ref(null)
const canvas = ref(null)
const canvasContainer = ref(null)

// Loading state
const isLoading = ref(false)

// Modal state
const showModal = ref(false)
const showDeleteModal = ref(false)
const showDetailsModal = ref(false)
const selectedGrade = ref(null)
const gradeToDelete = ref(null)
const isEditMode = ref(false)
const editingGradeId = ref(null)

// Message state
const showMessage = ref(false)
const messageType = ref('success') // 'success' or 'error'
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

// Sample American Hardwood grades data
const gradeCards = ref([
  {
    id: 1,
    name: 'FAS (First and Seconds)',
    type: 'Hardwood',
    species: 'Red Oak',
    description: 'Highest grade with 83.3% clear face cuttings',
    keySpecs: [
      'Min width: 6 inches',
      'Min length: 8 feet',
      'Clear face: 83.3%',
      'Max defects: Minimal'
    ],
    usageCount: 24,
    color: 'emerald',
    isCustom: false,
    keySpecs: [
      'Min width: 6 inches',
      'Min length: 8 feet',
      'Clear face: 83.3%',
      'Max defects: Minimal'
    ]
  },
  {
    id: 2,
    name: 'Select & Better',
    type: 'Hardwood',
    species: 'White Oak',
    description: 'High quality grade combining FAS and Select',
    keySpecs: [
      'Min width: 4 inches',
      'Min length: 6 feet',
      'Clear face: 83.3%',
      'Good for staining'
    ],
    usageCount: 18,
    color: 'blue',
    isCustom: false,
    keySpecs: [
      'Min width: 4 inches',
      'Min length: 6 feet',
      'Clear face: 83.3%',
      'Good for staining'
    ]
  },
  {
    id: 3,
    name: 'No.1 Common',
    type: 'Hardwood',
    species: 'Soft Maple',
    description: 'Good grade suitable for most applications',
    keySpecs: [
      'Min width: 3 inches',
      'Min length: 4 feet',
      'Clear face: 66.7%',
      'Paint grade quality'
    ],
    usageCount: 32,
    color: 'yellow',
    isCustom: false,
    keySpecs: [
      'Min width: 3 inches',
      'Min length: 4 feet',
      'Clear face: 66.7%',
      'Paint grade quality'
    ]
  },
  {
    id: 4,
    name: 'No.2A Common',
    type: 'Hardwood',
    species: 'Cherry',
    description: 'Economy grade with character marks',
    keySpecs: [
      'Min width: 3 inches',
      'Min length: 4 feet',
      'Clear face: 50%',
      'Rustic appearance'
    ],
    usageCount: 15,
    color: 'orange',
    isCustom: false,
    keySpecs: [
      'Min width: 3 inches',
      'Min length: 4 feet',
      'Clear face: 50%',
      'Rustic appearance'
    ]
  }
])

// Get color classes for cards
const getColorClasses = (color) => {
  const colorMap = {
    emerald: {
      border: 'border-emerald-200',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-800',
      indicator: 'bg-emerald-500'
    },
    blue: {
      border: 'border-blue-200',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-800',
      indicator: 'bg-blue-500'
    },
    yellow: {
      border: 'border-yellow-200',
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      badge: 'bg-yellow-100 text-yellow-800',
      indicator: 'bg-yellow-500'
    },
    orange: {
      border: 'border-orange-200',
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      badge: 'bg-orange-100 text-orange-800',
      indicator: 'bg-orange-500'
    }
  }
  return colorMap[color] || colorMap.emerald
}

// Form validation
const isFormValid = computed(() => {
  return formData.value.name.trim() !== '' && formData.value.type !== ''
})

// Modal methods
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

const saveGrade = () => {
  if (!isFormValid.value) return
  
  if (isEditMode.value) {
    // Update existing grade
    const gradeIndex = gradeCards.value.findIndex(g => g.id === editingGradeId.value)
    if (gradeIndex !== -1) {
      gradeCards.value[gradeIndex] = {
        ...gradeCards.value[gradeIndex],
        name: formData.value.name,
        type: formData.value.type,
        description: formData.value.description,
        keySpecs: [
          `Min width: ${formData.value.specifications.minWidth} inches`,
          `Min length: ${formData.value.specifications.minLength} feet`,
          `Clear face: ${formData.value.specifications.clearFace}%`,
          `Max defects: ${formData.value.specifications.maxDefects}`
        ]
      }
    }
  } else {
    // Create new grade
    const newGrade = {
      id: Date.now(),
      name: formData.value.name,
      type: formData.value.type,
      description: formData.value.description,
      keySpecs: [
        `Min width: ${formData.value.specifications.minWidth} inches`,
        `Min length: ${formData.value.specifications.minLength} feet`,
        `Clear face: ${formData.value.specifications.clearFace}%`,
        `Max defects: ${formData.value.specifications.maxDefects}`
      ],
      usageCount: 0,
      color: 'emerald',
      isCustom: formData.value.type === 'Custom'
    }
    gradeCards.value.push(newGrade)
  }
  
  closeModal()
    showSuccessMessage(`Grade "${formData.value.name}" has been ${isEditMode.value ? 'updated' : 'created'} successfully.`)
}

// Interactive methods
const viewGradeDetails = (grade) => {
  router.push(`/grade-management/create?edit=true&id=${grade.id}`)

const editGrade = (grade) => {
  console.log('Editing grade:', grade.name)
  router.push(`/grade-management/create?edit=true&id=${grade.id}`)
}

const duplicateGrade = (grade) => {
  console.log('Duplicating grade:', grade.name)
  // TODO: Implement duplicate functionality
  showSuccessMessage(`Grade "${grade.name}" duplicated successfully.`)
}

const deleteGrade = (grade) => {
  gradeToDelete.value = grade
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  gradeToDelete.value = null
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedGrade.value = null
}

const getTotalVolume = (grade) => {
  // Mock calculation based on usage count
  if (!grade?.usageCount) return '0 bf'
  
  // Simulate total volume based on usage count and typical order sizes
  const avgOrderVolume = 2500 // average board feet per order
  const totalBf = grade.usageCount * avgOrderVolume
  
  if (totalBf >= 1000000) {
    return `${(totalBf / 1000000).toFixed(1)}M bf`
  } else if (totalBf >= 1000) {
    return `${(totalBf / 1000).toFixed(1)}K bf`
  } else {
    return `${totalBf} bf`
  }
}

const getLastUsedDate = (grade) => {
  if (!grade?.usageCount || grade.usageCount === 0) return 'Never'
  
  // Mock last used date based on grade usage
  const daysAgo = Math.floor(Math.random() * 30) + 1
  const lastUsed = new Date()
  lastUsed.setDate(lastUsed.getDate() - daysAgo)
  
  return lastUsed.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

const getOrdersUsingGrade = (grade) => {
  if (!grade || grade.usageCount === 0) return []
  
  // Mock data for orders using this grade
  const mockOrders = [
    {
      id: 'ORD-20250115-001',
      customer: 'Johnson Lumber Co.',
      volume: '2,400 bf',
      date: 'Jan 15, 2025',
      status: 'Completed'
    },
    {
      id: 'ORD-20250112-003',
      customer: 'Premium Hardwoods',
      volume: '1,800 bf',
      date: 'Jan 12, 2025',
      status: 'Completed'
    },
    {
      id: 'ORD-20250118-002',
      customer: 'Cabinet Masters',
      volume: '3,200 bf',
      date: 'Jan 18, 2025',
      status: 'Running'
    }
  ]
  
  // Return a subset based on usage count
  return mockOrders.slice(0, Math.min(grade.usageCount, 3))
}

const confirmDelete = () => {
  if (!gradeToDelete.value) return
  
  try {
    // Find and remove the grade
    const gradeIndex = gradeCards.value.findIndex(g => g.id === gradeToDelete.value.id)
    if (gradeIndex !== -1) {
      gradeCards.value.splice(gradeIndex, 1)
      showSuccessMessage(`Grade "${gradeToDelete.value.name}" has been deleted successfully.`)
    } else {
      showErrorMessage('Grade not found. It may have already been deleted.')
    }
  } catch (error) {
    console.error('Error deleting grade:', error)
    showErrorMessage('Failed to delete grade. Please try again.')
  }
  
  closeDeleteModal()
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
</script>