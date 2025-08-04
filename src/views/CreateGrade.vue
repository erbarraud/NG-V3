<template>
  <div class="min-h-screen bg-gray-50">
    <div class="w-full px-4 sm:px-6 lg:px-8 py-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center space-x-4">
          <button 
            @click="$router.go(-1)"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ isEditMode ? 'Edit Grade' : 'Create New Grade' }}
            </h1>
            <p class="text-gray-600 mt-1">Configure comprehensive lumber grading standards and specifications</p>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="mb-8">
        <nav class="flex space-x-8 border-b border-gray-200">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center',
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <component :is="tab.icon" class="w-5 h-5 mr-2" />
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="space-y-6">
        <!-- Basic Information Tab -->
        <div v-if="activeTab === 'basic'" class="bg-white rounded-lg shadow p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Grade Basic Information</h2>
          
          <div class="space-y-6 max-w-2xl">
            <div>
              <label for="gradeName" class="block text-sm font-medium text-gray-700 mb-2">
                Grade Name *
              </label>
              <input
                id="gradeName"
                v-model="gradeForm.name"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter grade name (e.g., FAS, Select, No.1 Common)"
              />
              <div v-if="validationErrors.name" class="mt-1 text-sm text-red-600">{{ validationErrors.name }}</div>
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                Grade Description
              </label>
              <textarea
                id="description"
                v-model="gradeForm.description"
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter a detailed description of this grade and its intended use..."
              ></textarea>
            </div>

            <div>
              <label for="gradeValue" class="block text-sm font-medium text-gray-700 mb-2">
                Grade Value/Price per Surface Unit ($)
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  id="gradeValue"
                  v-model="gradeForm.valuePerUnit"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full pl-7 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Species Selection
              </label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <label
                  v-for="species in speciesOptions"
                  :key="species.value"
                  class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :value="species.value"
                    v-model="gradeForm.species"
                    class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <span class="text-sm font-medium text-gray-900">{{ species.label }}</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-4">
                Face Grading Option
              </label>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input
                    type="radio"
                    value="good-face-only"
                    v-model="gradeForm.faceGradingOption"
                    class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <span class="ml-3 text-sm text-gray-900">Good Face Only</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    value="poor-face-only"
                    v-model="gradeForm.faceGradingOption"
                    class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <span class="ml-3 text-sm text-gray-900">Poor Face Only</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    value="both-faces"
                    v-model="gradeForm.faceGradingOption"
                    class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <span class="ml-3 text-sm text-gray-900">Both Faces</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Board-Level Rules Tab -->
        <div v-if="activeTab === 'board-rules'" class="bg-white rounded-lg shadow p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Board-Level Rules</h2>
          
          <div class="space-y-8 max-w-4xl">
            <!-- Warp Allowances -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Warp Allowances</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="maxBow" class="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Bow Allowance (mm)
                  </label>
                  <input
                    id="maxBow"
                    v-model="gradeForm.boardRules.maxBow"
                    type="number"
                    min="0"
                    step="0.1"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0.0"
                  />
                </div>

                <div>
                  <label for="maxCup" class="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Cup Allowance (mm)
                  </label>
                  <input
                    id="maxCup"
                    v-model="gradeForm.boardRules.maxCup"
                    type="number"
                    min="0"
                    step="0.1"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0.0"
                  />
                </div>

                <div>
                  <label for="maxCrook" class="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Crook/Spring Allowance (mm)
                  </label>
                  <input
                    id="maxCrook"
                    v-model="gradeForm.boardRules.maxCrook"
                    type="number"
                    min="0"
                    step="0.1"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0.0"
                  />
                </div>

                <div>
                  <label for="maxTwist" class="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Twist Allowance (mm)
                  </label>
                  <input
                    id="maxTwist"
                    v-model="gradeForm.boardRules.maxTwist"
                    type="number"
                    min="0"
                    step="0.1"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0.0"
                  />
                </div>
              </div>
            </div>

            <!-- Dimensional Constraints -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Dimensional Constraints</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="minLength" class="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Length (mm)
                  </label>
                  <input
                    id="minLength"
                    v-model="gradeForm.boardRules.minLength"
                    type="number"
                    min="0"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label for="minWidth" class="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Width (mm)
                  </label>
                  <input
                    id="minWidth"
                    v-model="gradeForm.boardRules.minWidth"
                    type="number"
                    min="0"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label for="minThickness" class="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Thickness (mm)
                  </label>
                  <input
                    id="minThickness"
                    v-model="gradeForm.boardRules.minThickness"
                    type="number"
                    min="0"
                    step="0.1"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0.0"
                  />
                </div>

                <div>
                  <label for="maxThickness" class="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Thickness (mm)
                  </label>
                  <input
                    id="maxThickness"
                    v-model="gradeForm.boardRules.maxThickness"
                    type="number"
                    min="0"
                    step="0.1"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0.0"
                  />
                </div>
              </div>
            </div>

            <!-- Width Measurement Method -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Width Measurement Method</h3>
              <select
                v-model="gradeForm.boardRules.widthMeasurementMethod"
                class="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select measurement method</option>
                <option value="full-wane">Full Wane</option>
                <option value="half-wane">Half Wane</option>
                <option value="smaller-side">Smaller Side</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Defect Configuration Tab -->
        <div v-if="activeTab === 'defects'" class="space-y-6">
          <div class="bg-white rounded-lg shadow p-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">Defect Configuration</h2>
            
            <!-- Defect Category Tabs -->
            <div class="mb-6">
              <nav class="flex space-x-4 border-b border-gray-200">
                <button
                  v-for="category in defectCategories"
                  :key="category.id"
                  @click="activeDefectCategory = category.id"
                  :class="[
                    'py-2 px-4 border-b-2 font-medium text-sm transition-colors',
                    activeDefectCategory === category.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  ]"
                >
                  {{ category.name }}
                </button>
              </nav>
            </div>

            <!-- Defect Cards for Active Category -->
            <div class="space-y-4">
              <div
                v-for="defect in getCurrentCategoryDefects()"
                :key="defect.id"
                class="border border-gray-200 rounded-lg p-6"
              >
                <div class="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                  <!-- Enable/Disable Switch -->
                  <div class="lg:col-span-1">
                    <label class="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        v-model="defect.enabled"
                        class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <span class="text-sm font-medium text-gray-900">{{ defect.name }}</span>
                    </label>
                  </div>

                  <!-- Metric Dropdown -->
                  <div class="lg:col-span-1">
                    <select
                      v-model="defect.metric"
                      :disabled="!defect.enabled"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      <option value="">Select metric</option>
                      <option value="diameter">Diameter</option>
                      <option value="length">Length</option>
                      <option value="area">Area</option>
                      <option value="count">Count</option>
                      <option value="presence">Presence</option>
                    </select>
                  </div>

                  <!-- Unit Display -->
                  <div class="lg:col-span-1">
                    <div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                      {{ getUnitForMetric(defect.metric) }}
                    </div>
                  </div>

                  <!-- Aggregation Method -->
                  <div class="lg:col-span-1">
                    <select
                      v-model="defect.aggregationMethod"
                      :disabled="!defect.enabled"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      <option value="">Aggregation</option>
                      <option value="maximum">Maximum</option>
                      <option value="sum">Sum</option>
                      <option value="average">Average</option>
                      <option value="count-per-meter">Count per linear meter</option>
                    </select>
                  </div>

                  <!-- Limit Value -->
                  <div class="lg:col-span-1">
                    <input
                      v-model="defect.limitValue"
                      type="number"
                      min="0"
                      step="0.1"
                      :disabled="!defect.enabled"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:text-gray-500"
                      placeholder="Limit"
                    />
                  </div>

                  <!-- Reference Type -->
                  <div class="lg:col-span-1">
                    <select
                      v-model="defect.referenceType"
                      :disabled="!defect.enabled"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      <option value="">Reference</option>
                      <option value="fixed-value">Fixed value</option>
                      <option value="percent-width">% of board width</option>
                      <option value="percent-surface">% of board surface</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Zone-Based Rules Tab -->
        <div v-if="activeTab === 'zones'" class="space-y-6">
          <div class="bg-white rounded-lg shadow p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-semibold text-gray-900">Zone-Based Rules</h2>
              <button
                @click="addZone"
                class="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus class="w-4 h-4 mr-2" />
                Add Zone
              </button>
            </div>

            <!-- Zone List -->
            <div v-if="gradeForm.zones.length === 0" class="text-center py-12 text-gray-500">
              <Map class="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 class="text-lg font-medium text-gray-900 mb-2">No zones defined</h3>
              <p class="text-gray-600 mb-4">Add zones to define specific areas of the board with different defect rules</p>
              <button
                @click="addZone"
                class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus class="w-4 h-4 mr-2" />
                Add Your First Zone
              </button>
            </div>

            <div v-else class="space-y-6">
              <div
                v-for="(zone, index) in gradeForm.zones"
                :key="zone.id"
                class="border border-gray-200 rounded-lg p-6"
              >
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center space-x-3">
                    <div :class="[
                      'w-4 h-4 rounded',
                      getZoneColorClass(zone.color)
                    ]"></div>
                    <h3 class="text-lg font-medium text-gray-900">{{ zone.name }}</h3>
                  </div>
                  <button
                    @click="removeZone(index)"
                    class="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Zone Name
                    </label>
                    <input
                      v-model="zone.name"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter zone name"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Zone Type
                    </label>
                    <select
                      v-model="zone.type"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="edge-zone">Edge Zone</option>
                      <option value="center-zone">Center Zone</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>

                <!-- Zone Definition -->
                <div class="mt-4">
                  <div v-if="zone.type === 'edge-zone'">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Distance from Edge: {{ zone.edgeDistance }}mm
                    </label>
                    <input
                      v-model="zone.edgeDistance"
                      type="range"
                      min="0"
                      max="200"
                      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div v-else-if="zone.type === 'custom'" class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Start Position (%)
                      </label>
                      <input
                        v-model="zone.startPosition"
                        type="number"
                        min="0"
                        max="100"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        End Position (%)
                      </label>
                      <input
                        v-model="zone.endPosition"
                        type="number"
                        min="0"
                        max="100"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="100"
                      />
                    </div>
                  </div>
                </div>

                <!-- Defect Overrides -->
                <div class="mt-6">
                  <button
                    @click="zone.showDefectOverrides = !zone.showDefectOverrides"
                    class="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    <ChevronDown :class="zone.showDefectOverrides ? 'rotate-180' : ''" class="w-4 h-4 mr-1 transition-transform" />
                    Configure Defect Overrides
                  </button>
                  
                  <div v-if="zone.showDefectOverrides" class="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <label
                        v-for="defectType in allDefectTypes"
                        :key="defectType.value"
                        class="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          :value="defectType.value"
                          v-model="zone.allowedDefects"
                          class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                        <span class="text-sm text-gray-900">{{ defectType.label }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Visual Board Preview -->
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Board Zone Preview</h3>
                <div class="relative bg-amber-100 border-2 border-amber-300 rounded-lg h-32 overflow-hidden">
                  <!-- Board representation -->
                  <div class="absolute inset-2 bg-amber-200 rounded">
                    <!-- Zone overlays -->
                    <div
                      v-for="(zone, index) in gradeForm.zones"
                      :key="zone.id"
                      :class="[
                        'absolute rounded opacity-60',
                        getZoneColorClass(zone.color)
                      ]"
                      :style="getZoneStyle(zone)"
                    >
                      <div class="text-xs font-medium text-white p-1">{{ zone.name }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Clustering Rules Tab -->
        <div v-if="activeTab === 'clustering'" class="bg-white rounded-lg shadow p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Clustering Rules</h2>
          
          <div class="space-y-6 max-w-2xl">
            <div>
              <label class="flex items-center space-x-3">
                <input
                  type="checkbox"
                  v-model="gradeForm.clustering.enabled"
                  class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span class="text-sm font-medium text-gray-900">Enable Clustering</span>
              </label>
              <p class="text-sm text-gray-600 mt-1">Group nearby defects together for evaluation</p>
            </div>

            <div v-if="gradeForm.clustering.enabled">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Clustering Distance: {{ gradeForm.clustering.distance }}mm
              </label>
              <input
                v-model="gradeForm.clustering.distance"
                type="range"
                min="0"
                max="100"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>0mm</span>
                <span>100mm</span>
              </div>
            </div>

            <div v-if="gradeForm.clustering.enabled">
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Clusterable Defect Types
              </label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <label
                  v-for="defectType in allDefectTypes"
                  :key="defectType.value"
                  class="flex items-center space-x-2 p-2 border border-gray-200 rounded hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    :value="defectType.value"
                    v-model="gradeForm.clustering.clusterableDefects"
                    class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <span class="text-sm text-gray-900">{{ defectType.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Cutting/Reduction Strategy Tab -->
        <div v-if="activeTab === 'cutting'" class="bg-white rounded-lg shadow p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Cutting/Reduction Strategy</h2>
          
          <div class="space-y-8 max-w-4xl">
            <!-- Strategy Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-4">
                Cutting/Reduction Method
              </label>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input
                    type="radio"
                    value="none"
                    v-model="gradeForm.cuttingStrategy.method"
                    class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <span class="ml-3 text-sm text-gray-900">None</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    value="cutting"
                    v-model="gradeForm.cuttingStrategy.method"
                    class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <span class="ml-3 text-sm text-gray-900">Cutting</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    value="reduction"
                    v-model="gradeForm.cuttingStrategy.method"
                    class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <span class="ml-3 text-sm text-gray-900">Reduction</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    value="both"
                    v-model="gradeForm.cuttingStrategy.method"
                    class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <span class="ml-3 text-sm text-gray-900">Both</span>
                </label>
              </div>
            </div>

            <!-- Reduction Settings -->
            <div v-if="gradeForm.cuttingStrategy.method === 'reduction' || gradeForm.cuttingStrategy.method === 'both'">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Reduction Settings</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Max Number of Reductions
                  </label>
                  <input
                    v-model="gradeForm.cuttingStrategy.reductions.maxNumber"
                    type="number"
                    min="0"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Min Distance Between Reductions (mm)
                  </label>
                  <input
                    v-model="gradeForm.cuttingStrategy.reductions.minDistanceBetween"
                    type="number"
                    min="0"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Min Distance to Edge (mm)
                  </label>
                  <input
                    v-model="gradeForm.cuttingStrategy.reductions.minDistanceToEdge"
                    type="number"
                    min="0"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Max Reduction Size (mm²)
                  </label>
                  <input
                    v-model="gradeForm.cuttingStrategy.reductions.maxSize"
                    type="number"
                    min="0"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div class="mt-4">
                <label class="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    v-model="gradeForm.cuttingStrategy.reductions.dynamicShape"
                    class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <span class="text-sm font-medium text-gray-900">Dynamic Reduction Shape</span>
                </label>
                <p class="text-sm text-gray-600 mt-1">Allow dynamic shapes instead of fixed rectangles</p>
              </div>
            </div>

            <!-- Cutting Settings -->
            <div v-if="gradeForm.cuttingStrategy.method === 'cutting' || gradeForm.cuttingStrategy.method === 'both'">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Cutting Settings</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Min Cutting Length (mm)
                  </label>
                  <input
                    v-model="gradeForm.cuttingStrategy.cuttings.minLength"
                    type="number"
                    min="0"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Min Cutting Width (mm)
                  </label>
                  <input
                    v-model="gradeForm.cuttingStrategy.cuttings.minWidth"
                    type="number"
                    min="0"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Max Number of Cuttings
                  </label>
                  <input
                    v-model="gradeForm.cuttingStrategy.cuttings.maxNumber"
                    type="number"
                    min="0"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <!-- Minimum Yield -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Minimum Yield Percentage: {{ gradeForm.cuttingStrategy.minYield }}%
              </label>
              <input
                v-model="gradeForm.cuttingStrategy.minYield"
                type="range"
                min="0"
                max="100"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview Tab -->
        <div v-if="activeTab === 'preview'" class="bg-white rounded-lg shadow p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Grade Preview & Summary</h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Grade Card Preview -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Grade Card Preview</h3>
              <div class="border-2 border-emerald-200 bg-emerald-50 rounded-lg p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 mb-1">
                      {{ gradeForm.name || 'Grade Name' }}
                    </h3>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      Custom Grade
                    </span>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-bold text-emerald-600">
                      ${{ gradeForm.valuePerUnit || '0.00' }}/unit
                    </div>
                  </div>
                </div>

                <p class="text-sm text-gray-600 mb-4">
                  {{ gradeForm.description || 'Grade description will appear here...' }}
                </p>

                <div class="space-y-2">
                  <div class="text-xs text-gray-600">
                    <strong>Species:</strong> {{ gradeForm.species.join(', ') || 'None selected' }}
                  </div>
                  <div class="text-xs text-gray-600">
                    <strong>Face Grading:</strong> {{ getFaceGradingLabel(gradeForm.faceGradingOption) }}
                  </div>
                  <div class="text-xs text-gray-600">
                    <strong>Zones:</strong> {{ gradeForm.zones.length }} defined
                  </div>
                </div>
              </div>
            </div>

            <!-- Configuration Summary -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Configuration Summary</h3>
              <div class="space-y-4">
                <!-- Board Rules Summary -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="font-medium text-gray-900 mb-2">Board Rules</h4>
                  <div class="text-sm text-gray-600 space-y-1">
                    <div>Min Length: {{ gradeForm.boardRules.minLength || 'Not set' }}mm</div>
                    <div>Min Width: {{ gradeForm.boardRules.minWidth || 'Not set' }}mm</div>
                    <div>Max Bow: {{ gradeForm.boardRules.maxBow || 'Not set' }}mm</div>
                    <div>Width Method: {{ gradeForm.boardRules.widthMeasurementMethod || 'Not set' }}</div>
                  </div>
                </div>

                <!-- Defects Summary -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="font-medium text-gray-900 mb-2">Defect Rules</h4>
                  <div class="text-sm text-gray-600">
                    {{ getEnabledDefectsCount() }} defect types configured
                  </div>
                </div>

                <!-- Zones Summary -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="font-medium text-gray-900 mb-2">Zone Configuration</h4>
                  <div class="text-sm text-gray-600 space-y-1">
                    <div v-for="zone in gradeForm.zones" :key="zone.id">
                      {{ zone.name }}: {{ zone.type }}
                    </div>
                    <div v-if="gradeForm.zones.length === 0">No zones defined</div>
                  </div>
                </div>

                <!-- Cutting Strategy Summary -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="font-medium text-gray-900 mb-2">Cutting Strategy</h4>
                  <div class="text-sm text-gray-600 space-y-1">
                    <div>Method: {{ gradeForm.cuttingStrategy.method || 'None' }}</div>
                    <div>Min Yield: {{ gradeForm.cuttingStrategy.minYield }}%</div>
                    <div v-if="gradeForm.clustering.enabled">Clustering: Enabled ({{ gradeForm.clustering.distance }}mm)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions Section -->
      <div class="mt-8 bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button
              @click="importJSON"
              class="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Upload class="w-4 h-4 mr-2" />
              Import JSON
            </button>
            <button
              @click="exportJSON"
              class="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download class="w-4 h-4 mr-2" />
              Export JSON
            </button>
          </div>
          
          <div class="flex items-center space-x-3">
            <button
              @click="saveAsTemplate"
              :disabled="!isFormValid || isSaving"
              class="flex items-center px-4 py-2 border border-emerald-300 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText class="w-4 h-4 mr-2" />
              Save as Template
            </button>
            <button
              @click="$router.push('/grade-management')"
              class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveGrade"
              :disabled="!isFormValid || isSaving"
              :class="[
                'px-6 py-2 rounded-lg font-medium transition-colors flex items-center',
                isFormValid && !isSaving
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              ]"
            >
              <LoadingSpinner v-if="isSaving" size="sm" variant="white" class="mr-2" />
              {{ isSaving ? 'Saving...' : (isEditMode ? 'Update Grade' : 'Create Grade') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, FileText, Settings, Eye, Package, Ruler, Map, Plus, ChevronDown, 
  Trash2, Upload, Download, Activity, Scissors
} from 'lucide-vue-next'
import LoadingSpinner from '@/components/ui/loading-spinner.vue'
import { useGradeForm } from '@/composables/useGradeForm'
import { useDefectRules } from '@/composables/useDefectRules'
import { useZoneManager } from '@/composables/useZoneManager'

const route = useRoute()
const router = useRouter()

// Check if we're editing an existing grade
const isEditMode = computed(() => route.query.edit === 'true')

// Active tabs
const activeTab = ref('basic')
const activeDefectCategory = ref('knots')

// Loading state
const isSaving = ref(false)

// Tab configuration
const tabs = ref([
  { id: 'basic', name: 'Basic Info', icon: FileText },
  { id: 'board-rules', name: 'Board Rules', icon: Ruler },
  { id: 'defects', name: 'Defects', icon: Settings },
  { id: 'zones', name: 'Zones', icon: Map },
  { id: 'clustering', name: 'Clustering', icon: Activity },
  { id: 'cutting', name: 'Cutting/Reduction', icon: Scissors },
  { id: 'preview', name: 'Preview', icon: Eye }
])

// Species options
const speciesOptions = ref([
  { value: 'red-oak', label: 'Red Oak' },
  { value: 'white-oak', label: 'White Oak' },
  { value: 'hard-maple', label: 'Hard Maple' },
  { value: 'soft-maple', label: 'Soft Maple' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'walnut', label: 'Walnut' },
  { value: 'ash', label: 'Ash' },
  { value: 'birch', label: 'Birch' },
  { value: 'pine', label: 'Pine' },
  { value: 'douglas-fir', label: 'Douglas Fir' }
])

// Defect categories
const defectCategories = ref([
  { id: 'knots', name: 'Knots' },
  { id: 'cracks', name: 'Cracks & Splits' },
  { id: 'surface', name: 'Surface Defects' },
  { id: 'holes', name: 'Holes' },
  { id: 'other', name: 'Other Defects' }
])

// All defect types for clustering and zones
const allDefectTypes = ref([
  { value: 'sound-knots', label: 'Sound Knots' },
  { value: 'unsound-knots', label: 'Unsound Knots' },
  { value: 'pin-knots', label: 'Pin Knots' },
  { value: 'splits', label: 'Splits' },
  { value: 'checks', label: 'Checks' },
  { value: 'shakes', label: 'Shakes' },
  { value: 'light-stain', label: 'Light Stain' },
  { value: 'stain', label: 'Stain' },
  { value: 'skip-marks', label: 'Skip Marks' },
  { value: 'wane', label: 'Wane' },
  { value: 'decay', label: 'Decay' },
  { value: 'insect-holes', label: 'Insect Holes' },
  { value: 'general-holes', label: 'General Holes' }
])

// Use composables
const { gradeForm, validationErrors, isFormValid, resetForm } = useGradeForm()
const { defectRules, getUnitForMetric, getCurrentCategoryDefects, getEnabledDefectsCount } = useDefectRules()
const { addZone, removeZone, getZoneColorClass, getZoneStyle } = useZoneManager(gradeForm)

// Helper methods
const getFaceGradingLabel = (option) => {
  const labels = {
    'good-face-only': 'Good Face Only',
    'poor-face-only': 'Poor Face Only',
    'both-faces': 'Both Faces'
  }
  return labels[option] || 'Not selected'
}

const saveGrade = async () => {
  if (!isFormValid.value) return
  
  isSaving.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Saving grade:', gradeForm.value)
    
    // Navigate back to grade management
    router.push('/grade-management')
  } catch (error) {
    console.error('Error saving grade:', error)
  } finally {
    isSaving.value = false
  }
}

const saveAsTemplate = async () => {
  if (!isFormValid.value) return
  
  isSaving.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Saving grade as template:', gradeForm.value)
    
    // Show success message or navigate
    alert('Grade saved as template successfully!')
  } catch (error) {
    console.error('Error saving template:', error)
  } finally {
    isSaving.value = false
  }
}

const importJSON = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result)
          Object.assign(gradeForm.value, importedData)
          alert('Grade configuration imported successfully!')
        } catch (error) {
          alert('Error importing JSON: Invalid file format')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

const exportJSON = () => {
  const dataStr = JSON.stringify(gradeForm.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${gradeForm.value.name || 'grade'}-config.json`
  link.click()
  URL.revokeObjectURL(url)
}

// Load existing grade data if editing
onMounted(() => {
  if (isEditMode.value && route.query.id) {
    console.log('Loading grade for editing:', route.query.id)
    // TODO: Load grade data from backend
  }
})
</script>