<template>
  <div class="min-h-screen bg-gray-50">
    <div class="w-full px-4 sm:px-6 lg:px-8 py-6">
      <!-- Header Section -->
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
            <p class="text-gray-600 mt-1">Configure lumber grading standards with zone-based rules</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
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

      <!-- Grade Basic Information -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Grade Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
          <div>
            <label for="gradeValue" class="block text-sm font-medium text-gray-700 mb-2">
              Value per Unit ($)
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
        </div>
      </div>

      <!-- Visual Board Designer -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Board Zone Designer</h2>
        <p class="text-gray-600 mb-6">Define edge zones with different defect rules. Drag sliders to adjust zone depths.</p>
        
        <!-- Quick Templates -->
        <div class="mb-6">
          <div class="text-sm font-medium text-gray-700 mb-3">Quick Templates:</div>
          <div class="flex items-center space-x-3">
            <button
              @click="applyZoneTemplate('none')"
              :class="[
                'px-3 py-2 text-sm rounded-lg border transition-colors',
                !hasAnyZones ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-300 hover:bg-gray-50'
              ]"
            >
              No Edge Zones
            </button>
            <button
              @click="applyZoneTemplate('standard')"
              :class="[
                'px-3 py-2 text-sm rounded-lg border transition-colors',
                hasStandardZones ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-300 hover:bg-gray-50'
              ]"
            >
              Standard Edges (10cm)
            </button>
            <button
              @click="applyZoneTemplate('wide-ends')"
              class="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Wide Ends (20cm top/bottom)
            </button>
            <button
              @click="applyZoneTemplate('custom')"
              class="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Custom
            </button>
          </div>
        </div>

        <!-- Visual Board with Zones -->
        <div class="relative bg-gray-100 rounded-lg p-8 mb-6">
          <!-- Board Container -->
          <div class="relative mx-auto" style="width: 600px; height: 300px;">
            <!-- Top Edge Zone -->
            <div 
              v-if="zoneConfig.top.enabled"
              class="absolute top-0 left-0 right-0 bg-blue-200 border-2 border-blue-400 rounded-t-lg transition-all duration-300"
              :style="{ height: `${zoneConfig.top.depth * 3}px` }"
            >
              <div class="absolute inset-0 flex items-center justify-center text-xs font-medium text-blue-800">
                Top Edge ({{ zoneConfig.top.depth }}cm)
              </div>
            </div>

            <!-- Bottom Edge Zone -->
            <div 
              v-if="zoneConfig.bottom.enabled"
              class="absolute bottom-0 left-0 right-0 bg-blue-200 border-2 border-blue-400 rounded-b-lg transition-all duration-300"
              :style="{ height: `${zoneConfig.bottom.depth * 3}px` }"
            >
              <div class="absolute inset-0 flex items-center justify-center text-xs font-medium text-blue-800">
                Bottom Edge ({{ zoneConfig.bottom.depth }}cm)
              </div>
            </div>

            <!-- Left Edge Zone -->
            <div 
              v-if="zoneConfig.left.enabled"
              class="absolute top-0 bottom-0 left-0 bg-blue-200 border-2 border-blue-400 rounded-l-lg transition-all duration-300"
              :style="{ width: `${zoneConfig.left.depth * 6}px` }"
            >
              <div class="absolute inset-0 flex items-center justify-center text-xs font-medium text-blue-800 transform -rotate-90">
                Left ({{ zoneConfig.left.depth }}cm)
              </div>
            </div>

            <!-- Right Edge Zone -->
            <div 
              v-if="zoneConfig.right.enabled"
              class="absolute top-0 bottom-0 right-0 bg-blue-200 border-2 border-blue-400 rounded-r-lg transition-all duration-300"
              :style="{ width: `${zoneConfig.right.depth * 6}px` }"
            >
              <div class="absolute inset-0 flex items-center justify-center text-xs font-medium text-blue-800 transform rotate-90">
                Right ({{ zoneConfig.right.depth }}cm)
              </div>
            </div>

            <!-- Center Area -->
            <div 
              class="absolute bg-white border-2 border-gray-300 rounded-lg transition-all duration-300"
              :style="centerAreaStyle"
            >
              <div class="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-600">
                Main Board Area
              </div>
            </div>

            <!-- Board Outline -->
            <div class="absolute inset-0 border-4 border-amber-600 rounded-lg bg-amber-100/30">
              <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600">
                Board Preview
              </div>
            </div>
          </div>
        </div>

        <!-- Zone Controls -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <!-- Top Edge -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Top Edge</label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="zoneConfig.top.enabled"
                  class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-xs text-gray-600">Enable</span>
              </label>
            </div>
            <div class="space-y-2">
              <input
                v-model="zoneConfig.top.depth"
                type="range"
                min="0"
                max="50"
                :disabled="!zoneConfig.top.enabled"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
              <div class="text-xs text-gray-500 text-center">{{ zoneConfig.top.depth }}cm from edge</div>
            </div>
          </div>

          <!-- Bottom Edge -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Bottom Edge</label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="zoneConfig.bottom.enabled"
                  class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-xs text-gray-600">Enable</span>
              </label>
            </div>
            <div class="space-y-2">
              <input
                v-model="zoneConfig.bottom.depth"
                type="range"
                min="0"
                max="50"
                :disabled="!zoneConfig.bottom.enabled"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
              <div class="text-xs text-gray-500 text-center">{{ zoneConfig.bottom.depth }}cm from edge</div>
            </div>
          </div>

          <!-- Left Edge -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Left Edge</label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="zoneConfig.left.enabled"
                  class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-xs text-gray-600">Enable</span>
              </label>
            </div>
            <div class="space-y-2">
              <input
                v-model="zoneConfig.left.depth"
                type="range"
                min="0"
                max="50"
                :disabled="!zoneConfig.left.enabled"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
              <div class="text-xs text-gray-500 text-center">{{ zoneConfig.left.depth }}cm from edge</div>
            </div>
          </div>

          <!-- Right Edge -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Right Edge</label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="zoneConfig.right.enabled"
                  class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-xs text-gray-600">Enable</span>
              </label>
            </div>
            <div class="space-y-2">
              <input
                v-model="zoneConfig.right.depth"
                type="range"
                min="0"
                max="50"
                :disabled="!zoneConfig.right.enabled"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
              <div class="text-xs text-gray-500 text-center">{{ zoneConfig.right.depth }}cm from edge</div>
            </div>
          </div>
        </div>

        <!-- Link All Edges Option -->
        <div class="flex items-center space-x-2">
          <input
            type="checkbox"
            v-model="linkAllEdges"
            @change="handleLinkEdgesChange"
            class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <label class="text-sm text-gray-700">Link all edges (move sliders together)</label>
        </div>
      </div>

      <!-- Defect Rules Section -->
      <div class="bg-white rounded-lg shadow">
        <!-- Tab Navigation -->
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6">
            <button
              @click="activeRuleTab = 'board'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center',
                activeRuleTab === 'board'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <Package class="w-4 h-4 mr-2" />
              Entire Board
              <span class="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                {{ getEnabledDefectsCount('board') }}
              </span>
            </button>
            <button
              v-if="hasAnyZones"
              @click="activeRuleTab = 'zones'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center',
                activeRuleTab === 'zones'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <Map class="w-4 h-4 mr-2" />
              Edge Zones
              <span class="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs">
                {{ getEnabledDefectsCount('zones') }}
              </span>
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Entire Board Rules Tab -->
          <div v-if="activeRuleTab === 'board'">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Board-Wide Defect Rules</h3>
              <p class="text-gray-600 text-sm">These rules apply to the entire board surface</p>
            </div>
            
            <!-- Defect Categories for Board -->
            <div class="space-y-6">
              <div
                v-for="category in defectCategories"
                :key="category.id"
                class="border border-gray-200 rounded-lg overflow-hidden"
              >
                <!-- Category Header -->
                <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div class="flex items-center justify-between">
                    <h4 class="text-lg font-semibold text-gray-900">{{ category.name }}</h4>
                    <div class="flex items-center space-x-3">
                      <span class="text-sm text-gray-500">
                        {{ getEnabledInCategory(category.id, 'board') }} of {{ category.defects.length }} enabled
                      </span>
                      <button
                        @click="toggleAllInCategory(category.id, 'board')"
                        class="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        {{ getEnabledInCategory(category.id, 'board') === category.defects.length ? 'Disable All' : 'Enable All' }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Defect Rules -->
                <div class="p-6 space-y-4">
                  <div
                    v-for="defect in category.defects"
                    :key="defect.id"
                    class="border border-gray-200 rounded-lg p-4"
                  >
                    <div class="flex items-center justify-between mb-4">
                      <label class="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          v-model="boardRules[defect.id].enabled"
                          class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                        <span class="text-base font-medium text-gray-900">{{ defect.name }}</span>
                      </label>
                      <div v-if="boardRules[defect.id].enabled" class="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                        Enabled
                      </div>
                    </div>

                    <div v-if="boardRules[defect.id].enabled" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <!-- Metric Selection -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Measurement</label>
                        <select
                          v-model="boardRules[defect.id].metric"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="">Select metric</option>
                          <option 
                            v-for="metric in getMetricOptions(defect.id)"
                            :key="metric"
                            :value="metric"
                          >
                            {{ formatMetric(metric) }}
                          </option>
                        </select>
                      </div>

                      <!-- Limit Value -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Max Value ({{ getUnitForMetric(boardRules[defect.id].metric) }})
                        </label>
                        <input
                          v-model="boardRules[defect.id].limitValue"
                          type="number"
                          min="0"
                          step="0.1"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="0"
                        />
                      </div>

                      <!-- Aggregation Method -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Aggregation</label>
                        <select
                          v-model="boardRules[defect.id].aggregationMethod"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option 
                            v-for="option in aggregationOptions"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.title }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Edge Zones Rules Tab -->
          <div v-if="activeRuleTab === 'zones' && hasAnyZones">
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900">Edge Zone Rules</h3>
              <p class="text-gray-600 text-sm">Configure different rules for edge zones. These override board-wide rules.</p>
              
              <!-- Copy from Board Rules Button -->
              <div class="mt-4">
                <button
                  @click="copyBoardRulesToZones"
                  class="flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                >
                  <Copy class="w-4 h-4 mr-2" />
                  Copy from Board Rules
                </button>
              </div>
            </div>

            <!-- Zone Rule Categories -->
            <div class="space-y-6">
              <div
                v-for="category in defectCategories"
                :key="category.id"
                class="border border-gray-200 rounded-lg overflow-hidden"
              >
                <!-- Category Header -->
                <div class="bg-blue-50 px-6 py-4 border-b border-blue-200">
                  <div class="flex items-center justify-between">
                    <h4 class="text-lg font-semibold text-gray-900">{{ category.name }} (Edge Zones)</h4>
                    <div class="flex items-center space-x-3">
                      <span class="text-sm text-gray-500">
                        {{ getEnabledInCategory(category.id, 'zones') }} of {{ category.defects.length }} enabled
                      </span>
                      <button
                        @click="toggleAllInCategory(category.id, 'zones')"
                        class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {{ getEnabledInCategory(category.id, 'zones') === category.defects.length ? 'Disable All' : 'Enable All' }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Zone Defect Rules -->
                <div class="p-6 space-y-4">
                  <div
                    v-for="defect in category.defects"
                    :key="defect.id"
                    class="border border-gray-200 rounded-lg p-4"
                  >
                    <div class="flex items-center justify-between mb-4">
                      <label class="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          v-model="zoneRules[defect.id].enabled"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span class="text-base font-medium text-gray-900">{{ defect.name }}</span>
                      </label>
                      <div class="flex items-center space-x-2">
                        <div v-if="zoneRules[defect.id].enabled" class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          Zone Override
                        </div>
                        <div v-else-if="boardRules[defect.id].enabled" class="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          ↳ Inherits from Board
                        </div>
                      </div>
                    </div>

                    <div v-if="zoneRules[defect.id].enabled" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <!-- Metric Selection -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Measurement</label>
                        <select
                          v-model="zoneRules[defect.id].metric"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select metric</option>
                          <option 
                            v-for="metric in getMetricOptions(defect.id)"
                            :key="metric"
                            :value="metric"
                          >
                            {{ formatMetric(metric) }}
                          </option>
                        </select>
                      </div>

                      <!-- Limit Value -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Max Value ({{ getUnitForMetric(zoneRules[defect.id].metric) }})
                        </label>
                        <input
                          v-model="zoneRules[defect.id].limitValue"
                          type="number"
                          min="0"
                          step="0.1"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
                        />
                      </div>

                      <!-- Aggregation Method -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Aggregation</label>
                        <select
                          v-model="zoneRules[defect.id].aggregationMethod"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option 
                            v-for="option in aggregationOptions"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.title }}
                          </option>
                        </select>
                      </div>
                    </div>

                    <!-- Rule Comparison -->
                    <div v-if="boardRules[defect.id].enabled && zoneRules[defect.id].enabled" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div class="text-sm text-yellow-800">
                        <strong>Board Rule:</strong> Max {{ boardRules[defect.id].limitValue }} {{ getUnitForMetric(boardRules[defect.id].metric) }}
                        →
                        <strong>Zone Override:</strong> Max {{ zoneRules[defect.id].limitValue }} {{ getUnitForMetric(zoneRules[defect.id].metric) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Section -->
      <div class="mt-8 bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Grade Summary</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Board Rules Summary -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-3">Board Rules</h4>
            <div class="space-y-2 text-sm">
              <div v-for="(rule, defectId) in boardRules" :key="defectId">
                <div v-if="rule.enabled" class="flex items-center justify-between">
                  <span class="text-gray-700">{{ getDefectName(defectId) }}</span>
                  <span class="font-medium text-gray-900">
                    Max {{ rule.limitValue }} {{ getUnitForMetric(rule.metric) }}
                  </span>
                </div>
              </div>
              <div v-if="getEnabledDefectsCount('board') === 0" class="text-gray-500 italic">
                No defect rules configured
              </div>
            </div>
          </div>

          <!-- Zone Rules Summary -->
          <div class="space-y-4">
            <!-- Left/Right Zone Rules Summary -->
            <div class="bg-blue-50 rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-3">Left/Right Edge Overrides</h4>
              <div class="space-y-2 text-sm">
                <div v-for="(rule, defectId) in leftRightRules" :key="defectId">
                  <div v-if="rule.enabled" class="flex items-center justify-between">
                    <span class="text-gray-700">{{ getDefectName(defectId) }}</span>
                    <span class="font-medium text-blue-700">
                      Max {{ rule.limitValue }} {{ getUnitForMetric(rule.metric) }}
                    </span>
                  </div>
                </div>
                <div v-if="getEnabledDefectsCount('leftRight') === 0" class="text-gray-500 italic">
                  {{ (zoneConfig.left.enabled || zoneConfig.right.enabled) ? 'No L/R overrides configured' : 'No left/right zones defined' }}
                </div>
              </div>
            </div>

            <!-- Top/Bottom Zone Rules Summary -->
            <div class="bg-green-50 rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-3">Top/Bottom Edge Overrides</h4>
              <div class="space-y-2 text-sm">
                <div v-for="(rule, defectId) in topBottomRules" :key="defectId">
                  <div v-if="rule.enabled" class="flex items-center justify-between">
                    <span class="text-gray-700">{{ getDefectName(defectId) }}</span>
                    <span class="font-medium text-green-700">
                      Max {{ rule.limitValue }} {{ getUnitForMetric(rule.metric) }}
                    </span>
                  </div>
                </div>
                <div v-if="getEnabledDefectsCount('topBottom') === 0" class="text-gray-500 italic">
                  {{ (zoneConfig.top.enabled || zoneConfig.bottom.enabled) ? 'No T/B overrides configured' : 'No top/bottom zones defined' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, Package, Map, Copy
} from 'lucide-vue-next'
import LoadingSpinner from '@/components/ui/loading-spinner.vue'
import { useDefectRules } from '@/composables/useDefectRules'

const route = useRoute()
const router = useRouter()

// Check if we're editing an existing grade
const isEditMode = computed(() => route.query.edit === 'true')

// Loading state
const isSaving = ref(false)

// Active tab
const activeRuleTab = ref('board')

// Use composables
const { 
  defectCategories: defectCategoriesData,
  aggregationOptions, 
  referenceOptions,
  getMetricOptions,
  getUnitForMetric,
  getCurrentCategoryName,
  getCurrentCategoryDefects,
  getEnabledDefectsCount: getEnabledDefectsCountFromComposable,
  enableAllInCategory,
  disableAllInCategory,
  enableAllDefects,
  disableAllDefects,
  getAllEnabledDefects
} = useDefectRules()

// Grade form data
const gradeForm = ref({
  name: '',
  description: '',
  valuePerUnit: '',
  species: [],
  faceGradingOption: 'both-faces'
})

// Zone configuration
const zoneConfig = ref({
  top: { enabled: false, depth: 10 },
  bottom: { enabled: false, depth: 10 },
  left: { enabled: false, depth: 10 },
  right: { enabled: false, depth: 10 }
})

const linkAllEdges = ref(false)

// Convert composable data to flat defect categories for easier template use
const defectCategories = computed(() => {
  return [
    { id: 'knots', name: 'Natural Characteristics', defects: defectCategoriesData.value.knots.defects },
    { id: 'cracks', name: 'Cracks & Splits', defects: defectCategoriesData.value.cracksAndSplits.defects },
    { id: 'surface', name: 'Surface Defects', defects: defectCategoriesData.value.surfaceDefects.defects },
    { id: 'holes', name: 'Holes', defects: defectCategoriesData.value.holes.defects },
    { id: 'other', name: 'Other Defects', defects: defectCategoriesData.value.otherDefects.defects }
  ]
})

// Initialize defect rules for board and zones
const initializeDefectRules = () => {
  const rules = {}
  defectCategories.value.forEach(category => {
    category.defects.forEach(defect => {
      rules[defect.id] = {
        enabled: false,
        metric: defect.metric || '',
        limitValue: defect.limitValue || 0,
        aggregationMethod: defect.aggregationMethod || 'maximum'
      }
    })
  })
  return rules
}

const boardRules = ref(initializeDefectRules())
const leftRightRules = ref(initializeDefectRules())
const topBottomRules = ref(initializeDefectRules())

// Add the missing formatMetric function
const formatMetric = (metric) => {
  if (!metric) return ''
  
  // If metric is a string, capitalize it
  if (typeof metric === 'string') {
    return metric.charAt(0).toUpperCase() + metric.slice(1).replace(/([A-Z])/g, ' $1').trim()
  }
  
  // If metric is an object with title property
  if (metric.title) {
    return metric.title
  }
  
  // If metric is an object with value property
  if (metric.value) {
    return metric.value.charAt(0).toUpperCase() + metric.value.slice(1).replace(/([A-Z])/g, ' $1').trim()
  }
  
  return String(metric)
}

// Helper function to get category defects
const getCategoryDefects = (categoryId) => {
  const categoryMap = {
    'knots': 'knots',
    'cracks': 'cracksAndSplits', 
    'surface': 'surfaceDefects',
    'holes': 'holes',
    'other': 'otherDefects'
  }
  
  const composableKey = categoryMap[categoryId]
  return defectCategoriesData.value[composableKey]?.defects || []
}

// Computed properties
const hasAnyZones = computed(() => {
  return Object.values(zoneConfig.value).some(zone => zone.enabled)
})

const hasStandardZones = computed(() => {
  return Object.values(zoneConfig.value).every(zone => zone.enabled && zone.depth === 10)
})

const centerAreaStyle = computed(() => {
  const topOffset = zoneConfig.value.top.enabled ? zoneConfig.value.top.depth * 3 : 0
  const bottomOffset = zoneConfig.value.bottom.enabled ? zoneConfig.value.bottom.depth * 3 : 0
  const leftOffset = zoneConfig.value.left.enabled ? zoneConfig.value.left.depth * 6 : 0
  const rightOffset = zoneConfig.value.right.enabled ? zoneConfig.value.right.depth * 6 : 0
  
  return {
    top: `${topOffset}px`,
    bottom: `${bottomOffset}px`,
    left: `${leftOffset}px`,
    right: `${rightOffset}px`
  }
})

const isFormValid = computed(() => {
  return gradeForm.value.name.trim() !== ''
})

// Helper functions
const getDefectName = (defectId) => {
  for (const category of defectCategories.value) {
    const defect = category.defects.find(d => d.id === defectId)
    if (defect) return defect.name
  }
  return defectId
}

const getEnabledDefectsCount = (ruleType) => {
  let rules
  switch (ruleType) {
    case 'board':
      rules = boardRules.value
      break
    case 'leftRight':
      rules = leftRightRules.value
      break
    case 'topBottom':
      rules = topBottomRules.value
      break
    case 'zones':
      // For backward compatibility, count both zone types
      const leftRightCount = Object.values(leftRightRules.value).filter(rule => rule.enabled).length
      const topBottomCount = Object.values(topBottomRules.value).filter(rule => rule.enabled).length
      return leftRightCount + topBottomCount
    default:
      rules = boardRules.value
  }
  return Object.values(rules).filter(rule => rule.enabled).length
}

const getEnabledInCategory = (categoryId, ruleType) => {
  const category = defectCategories.value.find(c => c.id === categoryId)
  if (!category) return 0
  
  let rules
  switch (ruleType) {
    case 'board':
      rules = boardRules.value
      break
    case 'leftRight':
      rules = leftRightRules.value
      break
    case 'topBottom':
      rules = topBottomRules.value
      break
    default:
      rules = boardRules.value
  }
  return category.defects.filter(defect => rules[defect.id]?.enabled).length
}

const toggleAllInCategory = (categoryId, ruleType) => {
  const category = defectCategories.value.find(c => c.id === categoryId)
  if (!category) return
  
  let rules
  switch (ruleType) {
    case 'board':
      rules = boardRules.value
      break
    case 'leftRight':
      rules = leftRightRules.value
      break
    case 'topBottom':
      rules = topBottomRules.value
      break
    default:
      rules = boardRules.value
  }
  
  const enabledCount = getEnabledInCategory(categoryId, ruleType)
  const shouldEnable = enabledCount < category.defects.length
  
  category.defects.forEach(defect => {
    if (rules[defect.id]) {
      rules[defect.id].enabled = shouldEnable
    }
  })
}

// Zone template methods
const applyZoneTemplate = (template) => {
  switch (template) {
    case 'none':
      Object.keys(zoneConfig.value).forEach(key => {
        zoneConfig.value[key].enabled = false
        zoneConfig.value[key].depth = 10
      })
      break
    case 'standard':
      Object.keys(zoneConfig.value).forEach(key => {
        zoneConfig.value[key].enabled = true
        zoneConfig.value[key].depth = 10
      })
      break
    case 'wide-ends':
      zoneConfig.value.top.enabled = true
      zoneConfig.value.top.depth = 20
      zoneConfig.value.bottom.enabled = true
      zoneConfig.value.bottom.depth = 20
      zoneConfig.value.left.enabled = true
      zoneConfig.value.left.depth = 5
      zoneConfig.value.right.enabled = true
      zoneConfig.value.right.depth = 5
      break
    case 'custom':
      // Keep current settings
      break
  }
}

const handleLinkEdgesChange = () => {
  if (linkAllEdges.value) {
    // Set all edges to the same depth as the first enabled zone
    const firstEnabledZone = Object.values(zoneConfig.value).find(zone => zone.enabled)
    if (firstEnabledZone) {
      const depth = firstEnabledZone.depth
      Object.keys(zoneConfig.value).forEach(key => {
        zoneConfig.value[key].depth = depth
      })
    }
  }
}

const copyBoardRulesToZones = () => {
  Object.keys(boardRules.value).forEach(defectId => {
    if (boardRules.value[defectId].enabled) {
      leftRightRules.value[defectId] = { ...boardRules.value[defectId] }
      topBottomRules.value[defectId] = { ...boardRules.value[defectId] }
    }
  })
}

// Watch for linked edges
watch(linkAllEdges, (newValue) => {
  if (newValue) {
    // When linking is enabled, sync all depths
    const depths = Object.values(zoneConfig.value).map(zone => zone.depth)
    const avgDepth = Math.round(depths.reduce((a, b) => a + b, 0) / depths.length)
    
    Object.keys(zoneConfig.value).forEach(key => {
      zoneConfig.value[key].depth = avgDepth
    })
  }
})

// Watch for depth changes when linked
watch(() => Object.values(zoneConfig.value).map(zone => zone.depth), (newDepths, oldDepths) => {
  if (linkAllEdges.value && oldDepths) {
    // Find which depth changed and sync all others
    const keys = Object.keys(zoneConfig.value)
    for (let i = 0; i < newDepths.length; i++) {
      if (newDepths[i] !== oldDepths[i]) {
        const newDepth = newDepths[i]
        keys.forEach(key => {
          zoneConfig.value[key].depth = newDepth
        })
        break
      }
    }
  }
}, { deep: true })

const saveGrade = async () => {
  if (!isFormValid.value) return
  
  isSaving.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const gradeData = {
      ...gradeForm.value,
      zones: zoneConfig.value,
      boardRules: boardRules.value,
      leftRightRules: leftRightRules.value,
      topBottomRules: topBottomRules.value
    }
    
    console.log('Saving grade:', gradeData)
    
    // Navigate back to grade management
    router.push('/grade-management')
  } catch (error) {
    console.error('Error saving grade:', error)
  } finally {
    isSaving.value = false
  }
}
</script>
            <div class="space-y-2 text-sm">
              <div v-for="(rule, defectId) in zoneRules" :key="defectId">
                <div v-if="rule.enabled" class="flex items-center justify-between">
                  <span class="text-gray-700">{{ getDefectName(defectId) }}</span>
                  <span class="font-medium text-blue-700">
                    Max {{ rule.limitValue }} {{ getUnitForMetric(rule.metric) }}
                  </span>
                </div>
              </div>
              <div v-if="getEnabledDefectsCount('zones') === 0" class="text-gray-500 italic">
                {{ hasAnyZones ? 'No zone overrides configured' : 'No edge zones defined' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, Package, Map, Copy
} from 'lucide-vue-next'
import LoadingSpinner from '@/components/ui/loading-spinner.vue'
import { useDefectRules } from '@/composables/useDefectRules'

const route = useRoute()
const router = useRouter()

// Check if we're editing an existing grade
const isEditMode = computed(() => route.query.edit === 'true')

// Loading state
const isSaving = ref(false)

// Active tab
const activeRuleTab = ref('board')

// Use composables
const { 
  defectCategories: defectCategoriesData,
  aggregationOptions, 
  referenceOptions,
  getMetricOptions,
  getUnitForMetric,
  getCurrentCategoryName,
  getCurrentCategoryDefects,
  getEnabledDefectsCount: getEnabledDefectsCountFromComposable,
  enableAllInCategory,
  disableAllInCategory,
  enableAllDefects,
  disableAllDefects,
  getAllEnabledDefects
} = useDefectRules()

// Grade form data
const gradeForm = ref({
  name: '',
  description: '',
  valuePerUnit: '',
  species: [],
  faceGradingOption: 'both-faces'
})

// Zone configuration
const zoneConfig = ref({
  top: { enabled: false, depth: 10 },
  bottom: { enabled: false, depth: 10 },
  left: { enabled: false, depth: 10 },
  right: { enabled: false, depth: 10 }
})

const linkAllEdges = ref(false)

// Convert composable data to flat defect categories for easier template use
const defectCategories = computed(() => {
  return [
    { id: 'knots', name: 'Natural Characteristics', defects: defectCategoriesData.value.knots.defects },
    { id: 'cracks', name: 'Cracks & Splits', defects: defectCategoriesData.value.cracksAndSplits.defects },
    { id: 'surface', name: 'Surface Defects', defects: defectCategoriesData.value.surfaceDefects.defects },
    { id: 'holes', name: 'Holes', defects: defectCategoriesData.value.holes.defects },
    { id: 'other', name: 'Other Defects', defects: defectCategoriesData.value.otherDefects.defects }
  ]
})

// Initialize defect rules for board and zones
const initializeDefectRules = () => {
  const rules = {}
  defectCategories.value.forEach(category => {
    category.defects.forEach(defect => {
      rules[defect.id] = {
        enabled: false,
        metric: defect.metric || '',
        limitValue: defect.limitValue || 0,
        aggregationMethod: defect.aggregationMethod || 'maximum'
      }
    })
  })
  return rules
}

const boardRules = ref(initializeDefectRules())
const zoneRules = ref(initializeDefectRules())

// Computed properties
const hasAnyZones = computed(() => {
  return Object.values(zoneConfig.value).some(zone => zone.enabled)
})

const hasStandardZones = computed(() => {
  return Object.values(zoneConfig.value).every(zone => zone.enabled && zone.depth === 10)
})

const centerAreaStyle = computed(() => {
  const topOffset = zoneConfig.value.top.enabled ? zoneConfig.value.top.depth * 3 : 0
  const bottomOffset = zoneConfig.value.bottom.enabled ? zoneConfig.value.bottom.depth * 3 : 0
  const leftOffset = zoneConfig.value.left.enabled ? zoneConfig.value.left.depth * 6 : 0
  const rightOffset = zoneConfig.value.right.enabled ? zoneConfig.value.right.depth * 6 : 0
  
  return {
    top: `${topOffset}px`,
    bottom: `${bottomOffset}px`,
    left: `${leftOffset}px`,
    right: `${rightOffset}px`
  }
})

const isFormValid = computed(() => {
  return gradeForm.value.name.trim() !== ''
})

// Helper functions
const formatMetric = (metric) => {
  if (!metric) return ''
  
  // If metric is a string, capitalize it
  if (typeof metric === 'string') {
    return metric.charAt(0).toUpperCase() + metric.slice(1).replace(/([A-Z])/g, ' $1').trim()
  }
  
  // If metric is an object with title property
  if (metric.title) {
    return metric.title
  }
  
  // If metric is an object with value property
  if (metric.value) {
    return metric.value.charAt(0).toUpperCase() + metric.value.slice(1).replace(/([A-Z])/g, ' $1').trim()
  }
  
  return String(metric)
}

const getDefectName = (defectId) => {
  for (const category of defectCategories.value) {
    const defect = category.defects.find(d => d.id === defectId)
    if (defect) return defect.name
  }
  return defectId
}

const getEnabledDefectsCount = (ruleType) => {
  const rules = ruleType === 'board' ? boardRules.value : zoneRules.value
  return Object.values(rules).filter(rule => rule.enabled).length
}

const getEnabledInCategory = (categoryId, ruleType) => {
  const category = defectCategories.value.find(c => c.id === categoryId)
  if (!category) return 0
  
  const rules = ruleType === 'board' ? boardRules.value : zoneRules.value
  return category.defects.filter(defect => rules[defect.id]?.enabled).length
}

const toggleAllInCategory = (categoryId, ruleType) => {
  const category = defectCategories.value.find(c => c.id === categoryId)
  if (!category) return
  
  const rules = ruleType === 'board' ? boardRules.value : zoneRules.value
  const enabledCount = getEnabledInCategory(categoryId, ruleType)
  const shouldEnable = enabledCount < category.defects.length
  
  category.defects.forEach(defect => {
    if (rules[defect.id]) {
      rules[defect.id].enabled = shouldEnable
    }
  })
}

// Zone template methods
const applyZoneTemplate = (template) => {
  switch (template) {
    case 'none':
      Object.keys(zoneConfig.value).forEach(key => {
        zoneConfig.value[key].enabled = false
        zoneConfig.value[key].depth = 10
      })
      break
    case 'standard':
      Object.keys(zoneConfig.value).forEach(key => {
        zoneConfig.value[key].enabled = true
        zoneConfig.value[key].depth = 10
      })
      break
    case 'wide-ends':
      zoneConfig.value.top.enabled = true
      zoneConfig.value.top.depth = 20
      zoneConfig.value.bottom.enabled = true
      zoneConfig.value.bottom.depth = 20
      zoneConfig.value.left.enabled = true
      zoneConfig.value.left.depth = 5
      zoneConfig.value.right.enabled = true
      zoneConfig.value.right.depth = 5
      break
    case 'custom':
      // Keep current settings
      break
  }
}

const handleLinkEdgesChange = () => {
  if (linkAllEdges.value) {
    // Set all edges to the same depth as the first enabled zone
    const firstEnabledZone = Object.values(zoneConfig.value).find(zone => zone.enabled)
    if (firstEnabledZone) {
      const depth = firstEnabledZone.depth
      Object.keys(zoneConfig.value).forEach(key => {
        zoneConfig.value[key].depth = depth
      })
    }
  }
}

const copyBoardRulesToZones = () => {
  Object.keys(boardRules.value).forEach(defectId => {
    if (boardRules.value[defectId].enabled) {
      zoneRules.value[defectId] = { ...boardRules.value[defectId] }
    }
  })
}

// Watch for linked edges
watch(linkAllEdges, (newValue) => {
  if (newValue) {
    // When linking is enabled, sync all depths
    const depths = Object.values(zoneConfig.value).map(zone => zone.depth)
    const avgDepth = Math.round(depths.reduce((a, b) => a + b, 0) / depths.length)
    
    Object.keys(zoneConfig.value).forEach(key => {
      zoneConfig.value[key].depth = avgDepth
    })
  }
})

// Watch for depth changes when linked
watch(() => Object.values(zoneConfig.value).map(zone => zone.depth), (newDepths, oldDepths) => {
  if (linkAllEdges.value && oldDepths) {
    // Find which depth changed and sync all others
    const keys = Object.keys(zoneConfig.value)
    for (let i = 0; i < newDepths.length; i++) {
      if (newDepths[i] !== oldDepths[i]) {
        const newDepth = newDepths[i]
        keys.forEach(key => {
          zoneConfig.value[key].depth = newDepth
        })
        break
      }
    }
  }
}, { deep: true })

const saveGrade = async () => {
  if (!isFormValid.value) return
  
  isSaving.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const gradeData = {
      ...gradeForm.value,
      zones: zoneConfig.value,
      boardRules: boardRules.value,
      zoneRules: zoneRules.value
    }
    
    console.log('Saving grade:', gradeData)
    
    // Navigate back to grade management
    router.push('/grade-management')
  } catch (error) {
    console.error('Error saving grade:', error)
  } finally {
    isSaving.value = false
  }
}
</script>