<template>
  <div class="min-h-screen bg-gray-50"> <!-- root -->
    <div class="w-full px-4 sm:px-6 lg:px-8 py-6"> <!-- container -->
      <!-- Page Header -->
      <div class="mb-8"> <!-- header -->
        <h1 class="text-4xl font-extrabold text-gray-900 mb-2">Create New Order</h1>
        <p class="text-gray-600 mt-1">Configure your production order</p>
      </div> <!-- /header -->
      
      <!-- Main Layout with Left Navigation -->
      <div class="flex gap-8"> <!-- layout -->
        <!-- Left Navigation and Summary -->
        <div class="w-80 space-y-6"> <!-- sidebar -->
          <!-- Progress Navigation -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
            <div class="space-y-3">
              <button
                @click="activeSection = 'details'"
                :class="[
                  'w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200',
                  activeSection === 'details'
                    ? 'bg-emerald-100 text-emerald-700 border-l-4 border-emerald-500'
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                <div :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3',
                  isStepComplete('details')
                    ? 'bg-emerald-500 text-white'
                    : activeSection === 'details'
                    ? 'bg-emerald-200 text-emerald-700'
                    : 'bg-gray-200 text-gray-600'
                ]">
                  <CheckCircle v-if="isStepComplete('details')" class="w-4 h-4" />
                  <span v-else>1</span>
                </div>
                <div>
                  <div class="font-medium">Order Details</div>
                  <div class="text-xs text-gray-500">Basic information & scheduling</div>
                </div>
              </button>

              <button
                @click="activeSection = 'sorts'"
                :class="[
                  'w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200',
                  activeSection === 'sorts'
                    ? 'bg-emerald-100 text-emerald-700 border-l-4 border-emerald-500'
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                <div :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3',
                  isStepComplete('sorts')
                    ? 'bg-emerald-500 text-white'
                    : activeSection === 'sorts'
                    ? 'bg-emerald-200 text-emerald-700'
                    : 'bg-gray-200 text-gray-600'
                ]">
                  <CheckCircle v-if="isStepComplete('sorts')" class="w-4 h-4" />
                  <span v-else>2</span>
                </div>
                <div>
                  <div class="font-medium">Define Sorts</div>
                  <div class="text-xs text-gray-500">Product specifications</div>
                </div>
              </button>
            </div>
          </div>

          <!-- Order Summary Card -->
          <div v-if="orderData.name || orderData.clientId || orderData.sorts.length > 0" class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div class="space-y-2 text-sm">
              <div v-if="orderData.name">
                <span class="text-gray-600">Name:</span>
                <div class="font-medium text-gray-900">{{ orderData.name }}</div>
              </div>
              <div v-if="orderData.clientId">
                <span class="text-gray-600">Client:</span>
                <div class="font-medium text-gray-900">{{ getClientName(orderData.clientId) }}</div>
              </div>
              <div v-if="orderData.sorts.length > 0">
                <span class="text-gray-600">Sorts:</span>
                <div class="font-medium text-gray-900">{{ orderData.sorts.length }}</div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="space-y-3">
              <button 
                @click="createOrder"
                :disabled="!canCreateOrder"
                :class="[
                  'w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  canCreateOrder
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]"
              >
                Create Order
              </button>
              <button class="w-full px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                Save as Draft
              </button>
            </div>
          </div>

        </div> <!-- /sidebar -->
        
        <!-- Main Content Area -->
        <div class="flex-1 space-y-8"> <!-- main -->
          <!-- Order Details Section -->
          <div v-if="activeSection === 'details'" class="bg-white rounded-lg shadow p-8">
            <div class="mb-6">
              <h2 class="text-2xl font-semibold text-gray-900 mb-2">Order Details</h2>
              <p class="text-gray-600">Configure the basic information for your production order</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Basic Information -->
              <div class="space-y-6">
                <h3 class="text-lg font-medium text-gray-900">Basic Information</h3>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Order Name *</label>
                  <input 
                    v-model="orderData.name"
                    type="text" 
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter order name"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Custom Order ID</label>
                  <input 
                    v-model="orderData.customId"
                    type="text" 
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Optional custom ID"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Client *</label>
                  <select 
                    v-model="orderData.clientId"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select client...</option>
                    <option v-for="client in clients" :key="client.id" :value="client.id">
                      {{ client.name }}
                    </option>
                  </select>
                </div>
              </div>

            </div>

            <!-- Scheduling -->
            <div class="mt-8">
              <h3 class="text-lg font-medium text-gray-900 mb-6">Scheduling</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Required Date *</label>
                  <input 
                    v-model="orderData.requiredDate"
                    type="date" 
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                  <select 
                    v-model="orderData.priority"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="standard">Standard</option>
                    <option value="rush">Rush</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Line</label>
                  <select 
                    v-model="orderData.preferredLine"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="auto">Auto Assignment</option>
                    <option value="line1">Line 1</option>
                    <option value="line2">Line 2</option>
                    <option value="line3">Line 3</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Volume and Species -->
            <div class="mt-8">
              <h3 class="text-lg font-medium text-gray-900 mb-6">Volume and Species</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Expected Volume</label>
                  <div class="flex space-x-2">
                    <input 
                      v-model="orderData.expectedVolume"
                      type="number" 
                      class="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="0"
                    />
                    <select 
                      v-model="orderData.volumeUnit"
                      class="px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="m3">m³</option>
                      <option value="bf">Board Feet</option>
                      <option value="pieces">Pieces</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Special Instructions -->
            <div class="mt-8">
              <label class="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
              <textarea 
                v-model="orderData.specialInstructions"
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Any special requirements or notes..."
              ></textarea>
            </div>
          </div>

          <!-- Define Sorts Section -->
          <div v-if="activeSection === 'sorts'" class="bg-white rounded-lg shadow p-8">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-2xl font-semibold text-gray-900 mb-2">Define Sorts</h2>
                <p class="text-gray-600">Configure board geometry, grades, and color sorting for each sort</p>
              </div>
            </div>

            <!-- Added Sorts Display -->
            <div v-if="orderData.sorts.length > 0" class="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-8">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Added Sorts ({{ orderData.sorts.length }})</h3>
                <button 
                  @click="clearAllSorts"
                  class="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              </div>
              
              <div class="space-y-4">
                <div v-for="(sort, index) in orderData.sorts" :key="sort.id" 
                     class="bg-white rounded-lg p-4 border border-gray-200">
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">{{ sort.name }}</h4>
                    <button 
                      @click="removeSort(index)"
                      class="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
                    >
                      <X class="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span class="text-gray-600">Geometry:</span>
                      <div class="font-medium text-gray-900">
                        {{ sort.geometry?.width || 'Any' }}" × {{ sort.geometry?.length || 'Any' }}' × {{ sort.geometry?.thickness || 'Any' }}
                      </div>
                    </div>
                    <div>
                      <span class="text-gray-600">Grades:</span>
                      <div class="font-medium text-gray-900">{{ sort.grades?.join(', ') || 'Not specified' }}</div>
                    </div>
                    <div>
                      <span class="text-gray-600">Target Volume:</span>
                      <div class="font-medium text-gray-900">{{ sort.targetVolume || 'TBD' }} {{ sort.volumeUnit || 'm³' }}</div>
                    </div>
                  </div>
                  
                  <div v-if="sort.colorSorting?.enabled" class="mt-2 text-sm">
                    <span class="text-gray-600">Color Sorting:</span>
                    <span class="font-medium text-gray-900 ml-1">{{ sort.colorSorting.type }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sort Creation Options -->
            <div class="mb-8">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Add Sort to Order</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Create New Sort Option -->
                <button
                  @click="sortCreationMode = 'new'"
                  :class="[
                    'p-6 border-2 rounded-lg text-left transition-all duration-200',
                    sortCreationMode === 'new'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  ]"
                >
                  <div class="flex items-center mb-3">
                    <div :class="[
                      'w-10 h-10 rounded-lg flex items-center justify-center mr-3',
                      sortCreationMode === 'new' ? 'bg-emerald-500' : 'bg-gray-400'
                    ]">
                      <Plus class="w-5 h-5 text-white" />
                    </div>
                    <h4 class="text-lg font-semibold text-gray-900">Create New Sort</h4>
                  </div>
                  <p class="text-sm text-gray-600">
                    Define custom board geometry, grades, and color sorting specifications from scratch.
                  </p>
                </button>

                <!-- Use Template Option -->
                <button
                  @click="sortCreationMode = 'template'"
                  :class="[
                    'p-6 border-2 rounded-lg text-left transition-all duration-200',
                    sortCreationMode === 'template'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  ]"
                >
                  <div class="flex items-center mb-3">
                    <div :class="[
                      'w-10 h-10 rounded-lg flex items-center justify-center mr-3',
                      sortCreationMode === 'template' ? 'bg-emerald-500' : 'bg-gray-400'
                    ]">
                      <FileText class="w-5 h-5 text-white" />
                    </div>
                    <h4 class="text-lg font-semibold text-gray-900">Use Existing Template</h4>
                  </div>
                  <p class="text-sm text-gray-600">
                    Choose from pre-configured lumber specifications for common applications.
                  </p>
                </button>
              </div>
            </div>

            <!-- Create New Sort Form -->
            <div v-if="sortCreationMode === 'new'" class="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Create New Sort</h3>
              
              <!-- Basic Sort Info -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Sort Name *</label>
                  <input 
                    v-model="newSort.name"
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter sort name"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Target Volume *</label>
                  <div class="flex space-x-2">
                    <input 
                      v-model="newSort.targetVolume"
                      type="number" 
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="0"
                    />
                    <select 
                      v-model="newSort.volumeUnit"
                      class="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="m3">m³</option>
                      <option value="bf">Board Feet</option>
                      <option value="pieces">Pieces</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- 3 Configuration Areas -->
              <div class="space-y-6 mb-6">
                <!-- 1. Board Geometry -->
                <div class="bg-white rounded-lg p-6 border border-gray-200">
                  <div class="flex items-center mb-4">
                    <Ruler class="w-5 h-5 text-gray-600 mr-2" />
                    <h4 class="font-medium text-gray-900">Board Geometry</h4>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Width Range -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-3">Width (inches)</label>
                      <div class="space-y-2">
                        <input 
                          v-model="newSort.geometry.width"
                          type="number" 
                          step="0.25"
                          placeholder="Width"
                          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                        />
                        <div class="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            v-model="newSort.geometry.widthTolerance.enabled"
                            class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                          />
                          <label class="text-sm text-gray-700">Add tolerance</label>
                        </div>
                        <input 
                          v-if="newSort.geometry.widthTolerance.enabled"
                          v-model="newSort.geometry.widthTolerance.value"
                          type="number" 
                          step="0.25"
                          placeholder="± Tolerance"
                          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                        />
                      </div>
                    </div>

                    <!-- Length Range -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-3">Length (feet)</label>
                      <div class="space-y-2">
                        <input 
                          v-model="newSort.geometry.length"
                          type="number" 
                          step="0.5"
                          placeholder="Length"
                          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                        />
                        <div class="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            v-model="newSort.geometry.lengthTolerance.enabled"
                            class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                          />
                          <label class="text-sm text-gray-700">Add tolerance</label>
                        </div>
                        <input 
                          v-if="newSort.geometry.lengthTolerance.enabled"
                          v-model="newSort.geometry.lengthTolerance.value"
                          type="number" 
                          step="0.5"
                          placeholder="± Tolerance (feet)"
                          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                        />
                      </div>
                    </div>

                    <!-- Thickness -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-3">Thickness</label>
                      <div class="space-y-2">
                        <input 
                          v-model="newSort.geometry.thickness"
                          type="text"
                          placeholder="Thickness"
                          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                        />
                        <div class="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            v-model="newSort.geometry.thicknessTolerance.enabled"
                            class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                          />
                          <label class="text-sm text-gray-700">Add tolerance</label>
                        </div>
                        <input 
                          v-if="newSort.geometry.thicknessTolerance.enabled"
                          v-model="newSort.geometry.thicknessTolerance.value"
                          type="number" 
                          step="0.125"
                          placeholder="± Tolerance (inches)"
                          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 2. Board Grades -->
                <div class="bg-white rounded-lg p-6 border border-gray-200">
                  <div class="flex items-center mb-4">
                    <CheckCircle class="w-5 h-5 text-gray-600 mr-2" />
                    <h4 class="font-medium text-gray-900">Board Grades</h4>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <label class="flex items-start">
                      <input 
                        type="checkbox" 
                        value="FAS" 
                        v-model="newSort.grades"
                        class="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">FAS</div>
                        <div class="text-xs text-gray-600">First and Seconds - Highest grade</div>
                      </div>
                    </label>

                    <label class="flex items-start">
                      <input 
                        type="checkbox" 
                        value="Select" 
                        v-model="newSort.grades"
                        class="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">Select</div>
                        <div class="text-xs text-gray-600">High quality with minor defects</div>
                      </div>
                    </label>

                    <label class="flex items-start">
                      <input 
                        type="checkbox" 
                        value="No. 1 Common" 
                        v-model="newSort.grades"
                        class="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">No. 1 Common</div>
                        <div class="text-xs text-gray-600">Good for staining and painting</div>
                      </div>
                    </label>

                    <label class="flex items-start">
                      <input 
                        type="checkbox" 
                        value="No. 2 Common" 
                        v-model="newSort.grades"
                        class="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">No. 2 Common</div>
                        <div class="text-xs text-gray-600">Economy grade with character</div>
                      </div>
                    </label>

                    <label class="flex items-start">
                      <input 
                        type="checkbox" 
                        value="No. 3 Common" 
                        v-model="newSort.grades"
                        class="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">No. 3 Common</div>
                        <div class="text-xs text-gray-600">Utility grade for construction</div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- 3. Board Colors -->
                <div class="bg-white rounded-lg p-6 border border-gray-200">
                  <div class="flex items-center mb-4">
                    <Palette class="w-5 h-5 text-gray-600 mr-2" />
                    <h4 class="font-medium text-gray-900">Board Colors</h4>
                  </div>
                  
                  <div class="space-y-4">
                    <!-- Enable Color Sorting -->
                    <label class="flex items-center">
                      <input 
                        type="checkbox" 
                        v-model="newSort.colorSorting.enabled"
                        class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <span class="ml-2 text-sm font-medium text-gray-900">Enable Color Sorting</span>
                    </label>
                    
                    <!-- Color Options (only show if enabled) -->
                    <div v-if="newSort.colorSorting.enabled" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label class="flex items-center">
                        <input 
                          type="radio" 
                          value="White/Light" 
                          v-model="newSort.colorSorting.type"
                          class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                        />
                        <div class="ml-3 flex items-center">
                          <div class="w-4 h-4 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                          <div class="text-sm text-gray-900">White/Light</div>
                        </div>
                      </label>
                      
                      <label class="flex items-center">
                        <input 
                          type="radio" 
                          value="Red/Dark" 
                          v-model="newSort.colorSorting.type"
                          class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                        />
                        <div class="ml-3 flex items-center">
                          <div class="w-4 h-4 bg-red-300 border border-red-400 rounded mr-2"></div>
                          <div class="text-sm text-gray-900">Red/Dark</div>
                        </div>
                      </label>
                      
                      <label class="flex items-center">
                        <input 
                          type="radio" 
                          value="Mixed" 
                          v-model="newSort.colorSorting.type"
                          class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                        />
                        <div class="ml-3 flex items-center">
                          <div class="w-4 h-4 bg-gradient-to-r from-gray-100 to-red-300 border border-gray-300 rounded mr-2"></div>
                          <div class="text-sm text-gray-900">Mixed</div>
                        </div>
                      </label>
                      
                      <label class="flex items-center">
                        <input 
                          type="radio" 
                          value="Natural Variation" 
                          v-model="newSort.colorSorting.type"
                          class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                        />
                        <div class="ml-3 flex items-center">
                          <div class="w-4 h-4 bg-gradient-to-br from-yellow-200 via-orange-200 to-red-200 border border-gray-300 rounded mr-2"></div>
                          <div class="text-sm text-gray-900">Natural Variation</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="flex justify-end space-x-3">
                <button 
                  @click="resetNewSort"
                  class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button 
                  @click="addNewSort"
                  :disabled="!canAddSort"
                  :class="[
                    'px-4 py-2 rounded-lg transition-colors',
                    canAddSort
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  ]"
                >
                  Add Sort to Order
                </button>
              </div>
            </div>

            <!-- Template Selection (when template mode is active) -->
            <div v-if="sortCreationMode === 'template'" class="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Choose Sort Template</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <button
                  v-for="template in sortTemplates"
                  :key="template.id"
                  @click="selectTemplate(template)"
                  :class="[
                    'p-4 border-2 rounded-lg text-left transition-all duration-200',
                    selectedTemplate?.id === template.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  ]"
                >
                  <h4 class="font-medium text-gray-900 mb-2">{{ template.name }}</h4>
                  <div class="text-sm text-gray-600 space-y-1">
                    <div>{{ template.geometry.width }}" × {{ template.geometry.length }}' × {{ template.geometry.thickness }}</div>
                    <div>Grades: {{ template.grades.join(', ') }}</div>
                    <div v-if="template.colorSorting.enabled">Color: {{ template.colorSorting.type }}</div>
                  </div>
                </button>
              </div>

              <div class="flex justify-end space-x-3">
                <button 
                  @click="selectedTemplate = null"
                  class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Selection
                </button>
                <button 
                  @click="addTemplateSort"
                  :disabled="!selectedTemplate"
                  :class="[
                    'px-4 py-2 rounded-lg transition-colors',
                    selectedTemplate
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  ]"
                >
                  Add Template to Order
                </button>
              </div>
            </div>
          </div>
        </div> <!-- /main -->
      </div> <!-- /layout -->
    </div> <!-- /container -->
  </div> <!-- /root -->
</template>

<script>
import { CheckCircle, X, Ruler, Palette, Plus, FileText } from 'lucide-vue-next'

export default {
  name: 'CreateProductionOrder',
  components: {
    CheckCircle,
    X,
    Ruler,
    Palette,
    Plus,
    FileText
  },
  data() {
    return {
      activeSection: 'details',
      
      // Order data
      orderData: {
        name: '',
        customId: '',
        clientId: '',
        contactPerson: '',
        projectReference: '',
        requiredDate: '',
        priority: 'standard',
        preferredLine: 'auto',
        expectedVolume: '',
        volumeUnit: 'm3',
        species: '',
        specialInstructions: '',
        sorts: []
      },

      // New sort form
      newSort: {
        name: '',
        targetVolume: '',
        volumeUnit: 'm3',
        specialRequirements: '',
        geometry: {
          width: '',
          widthTolerance: {
            enabled: false,
            value: ''
          },
          length: '',
          lengthTolerance: {
            enabled: false,
            value: ''
          },
          thickness: '',
          thicknessTolerance: {
            enabled: false,
            value: ''
          }
        },
        grades: [],
        colorSorting: {
          enabled: false,
          type: ''
        }
      },

      // Sample data
      clients: [
        { id: 'client1', name: 'Johnson Lumber Co.' },
        { id: 'client2', name: 'Artisan Furniture Ltd.' },
        { id: 'client3', name: 'Premium Hardwoods Inc.' },
        { id: 'client4', name: 'Cabinet Masters LLC' },
        { id: 'client5', name: 'Construction Supply Co.' }
      ],

      speciesList: [
        'Oak', 'Maple', 'Cherry', 'Walnut', 'Pine', 'Cedar', 'Birch', 'Ash', 'Mahogany', 'Teak'
      ],

      // Sort creation mode
      sortCreationMode: 'new', // 'new' or 'template'
      selectedTemplate: null,

      // Sort templates
      sortTemplates: [
        {
          id: 'template1',
          name: 'Standard Flooring',
          geometry: { width: 3.25, length: 8, thickness: '3/4' },
          grades: ['Select', 'No. 1 Common'],
          colorSorting: { enabled: true, type: 'White/Light' }
        },
        {
          id: 'template2',
          name: 'Cabinet Grade',
          geometry: { width: 6, length: 10, thickness: '4/4' },
          grades: ['FAS', 'Select'],
          colorSorting: { enabled: false, type: '' }
        },
        {
          id: 'template3',
          name: 'Construction Grade',
          geometry: { width: 5.5, length: 12, thickness: '8/4' },
          grades: ['No. 2 Common', 'No. 3 Common'],
          colorSorting: { enabled: false, type: '' }
        },
        {
          id: 'template4',
          name: 'Premium Furniture',
          geometry: { width: 8, length: 12, thickness: '5/4' },
          grades: ['FAS'],
          colorSorting: { enabled: true, type: 'Natural Variation' }
        },
        {
          id: 'template5',
          name: 'Millwork Standard',
          geometry: { width: 4, length: 16, thickness: '6/4' },
          grades: ['Select', 'No. 1 Common'],
          colorSorting: { enabled: true, type: 'Mixed' }
        },
        {
          id: 'template6',
          name: 'Pallet Stock',
          geometry: { width: 3.5, length: 4, thickness: '4/4' },
          grades: ['No. 3 Common'],
          colorSorting: { enabled: false, type: '' }
        }
      ]
    }
  },

  computed: {
    canCreateOrder() {
      return this.orderData.name && 
             this.orderData.clientId && 
             this.orderData.requiredDate && 
             this.orderData.sorts.length > 0
    },

    canAddSort() {
      return this.newSort.name && 
             this.newSort.targetVolume && 
             this.newSort.grades.length > 0 &&
             (this.newSort.geometry.width || this.newSort.geometry.length || this.newSort.geometry.thickness)
    }
  },

  methods: {
    isStepComplete(step) {
      switch (step) {
        case 'details':
          return this.orderData.name && this.orderData.clientId && this.orderData.requiredDate
        case 'sorts':
          return this.orderData.sorts.length > 0
        default:
          return false
      }
    },

    getClientName(clientId) {
      const client = this.clients.find(c => c.id === clientId)
      return client ? client.name : ''
    },

    addNewSort() {
      if (this.canAddSort) {
        this.orderData.sorts.push({
          ...this.newSort,
          id: 'custom_' + Date.now()
        })
        
        this.resetNewSort()
      }
    },

    removeSort(index) {
      this.orderData.sorts.splice(index, 1)
    },

    resetNewSort() {
      this.newSort = {
        name: '',
        targetVolume: '',
        volumeUnit: 'm3',
        specialRequirements: '',
        geometry: {
          width: '',
          widthTolerance: {
            enabled: false,
            value: ''
          },
          length: '',
          lengthTolerance: {
            enabled: false,
            value: ''
          },
          thickness: '',
          thicknessTolerance: {
            enabled: false,
            value: ''
          }
        },
        grades: [],
        colorSorting: {
          enabled: false,
          type: ''
        }
      }
    },

    createOrder() {
      if (this.canCreateOrder) {
        console.log('Creating order:', this.orderData)
        alert('Order created successfully!')
        this.$router.push('/orders')
      }
    },

    selectTemplate(template) {
      this.selectedTemplate = template
    },

    addTemplateSort() {
      if (this.selectedTemplate) {
        this.orderData.sorts.push({
          id: 'template_' + Date.now(),
          name: this.selectedTemplate.name,
          targetVolume: 100,
          volumeUnit: 'm3',
          geometry: {
            width: this.selectedTemplate.geometry.width,
            length: this.selectedTemplate.geometry.length,
            thickness: this.selectedTemplate.geometry.thickness,
            widthTolerance: { enabled: false, value: '' },
            lengthTolerance: { enabled: false, value: '' },
            thicknessTolerance: { enabled: false, value: '' }
          },
          grades: [...this.selectedTemplate.grades],
          colorSorting: {
            enabled: this.selectedTemplate.colorSorting.enabled,
            type: this.selectedTemplate.colorSorting.type
          },
          specialRequirements: ''
        })
        
        this.selectedTemplate = null
      }
    },

    clearAllSorts() {
      this.orderData.sorts = []
    }
  },

  mounted() {
    // Set default required date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    this.orderData.requiredDate = tomorrow.toISOString().split('T')[0]
  }
}
</script>