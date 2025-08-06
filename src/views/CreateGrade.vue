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
        <div class="mt-6">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            v-model="gradeForm.description"
            rows="3"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter grade description and specifications"
          ></textarea>
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
              class="absolute top-0 left-0 right-0 bg-green-200 border-2 border-green-400 rounded-t-lg transition-all duration-300"
              :style="{ height: `${zoneConfig.top.depth * 3}px` }"
            >
              <div class="absolute inset-0 flex items-center justify-center text-xs font-medium text-green-800">
                Top Edge ({{ zoneConfig.top.depth }}cm)
              </div>
            </div>

            <!-- Bottom Edge Zone -->
            <div 
              v-if="zoneConfig.bottom.enabled"
              class="absolute bottom-0 left-0 right-0 bg-green-200 border-2 border-green-400 rounded-b-lg transition-all duration-300"
              :style="{ height: `${zoneConfig.bottom.depth * 3}px` }"
            >
              <div class="absolute inset-0 flex items-center justify-center text-xs font-medium text-green-800">
                Bottom Edge ({{ zoneConfig.bottom.depth }}cm)
              </div>
            </div>

            <!-- Left Edge Zone (Full Height) -->
            <div 
              v-if="zoneConfig.left.enabled"
              class="absolute top-0 bottom-0 left-0 bg-blue-200 border-2 border-blue-400 rounded-l-lg transition-all duration-300 z-10"
              :style="{ width: `${zoneConfig.left.depth * 6}px` }"
            >
              <div class="absolute inset-0 flex items-center justify-center text-xs font-medium text-blue-800 transform -rotate-90">
                Left ({{ zoneConfig.left.depth }}cm)
              </div>
            </div>

            <!-- Right Edge Zone (Full Height) -->
            <div 
              v-if="zoneConfig.right.enabled"
              class="absolute top-0 bottom-0 right-0 bg-blue-200 border-2 border-blue-400 rounded-r-lg transition-all duration-300 z-10"
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
          <!-- Top/Bottom Edge Control -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Top Edge</label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="topBottomZoneEnabled"
                  @change="handleTopBottomZoneChange"
                  class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-xs text-gray-600">Enable</span>
              </label>
            </div>
            <div class="space-y-2">
              <input
                v-model="topBottomZoneDepth"
                @input="handleTopBottomDepthChange"
                type="range"
                min="0"
                max="50"
                :disabled="!topBottomZoneEnabled"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
              <div class="text-xs text-gray-500 text-center">{{ topBottomZoneDepth }}cm from edge</div>
            </div>
          </div>

          <!-- Bottom Edge Display -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Bottom Edge</label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  :checked="topBottomZoneEnabled"
                  disabled
                  class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded opacity-50"
                />
                <span class="ml-2 text-xs text-gray-600">Enable</span>
              </label>
            </div>
            <div class="space-y-2">
              <input
                :value="topBottomZoneDepth"
                type="range"
                min="0"
                max="50"
                disabled
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer opacity-50"
              />
              <div class="text-xs text-gray-500 text-center">{{ topBottomZoneDepth }}cm from edge</div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
          <!-- Left Edge Control -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Left Edge</label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="leftRightZoneEnabled"
                  @change="handleLeftRightZoneChange"
                  class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-xs text-gray-600">Enable</span>
              </label>
            </div>
            <div class="space-y-2">
              <input
                v-model="leftRightZoneDepth"
                @input="handleLeftRightDepthChange"
                type="range"
                min="0"
                max="50"
                :disabled="!leftRightZoneEnabled"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
              <div class="text-xs text-gray-500 text-center">{{ leftRightZoneDepth }}cm from edge</div>
            </div>
          </div>

          <!-- Right Edge Display -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Right Edge</label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  :checked="leftRightZoneEnabled"
                  disabled
                  class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded opacity-50"
                />
                <span class="ml-2 text-xs text-gray-600">Enable</span>
              </label>
            </div>
            <div class="space-y-2">
              <input
                :value="leftRightZoneDepth"
                type="range"
                min="0"
                max="50"
                disabled
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer opacity-50"
              />
              <div class="text-xs text-gray-500 text-center">{{ leftRightZoneDepth }}cm from edge</div>
            </div>
          </div>
        </div>
        <!-- Zone Controls -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
          <!-- Top/Bottom Edge Control -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Top & Bottom Edges</label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="topBottomZoneEnabled"
                  @change="handleTopBottomZoneChange"
                  class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-xs text-gray-600">Enable</span>
              </label>
            </div>
            <div class="space-y-2">
              <input
                v-model="topBottomZoneDepth"
                @input="handleTopBottomDepthChange"
                type="range"
                min="0"
                max="50"
                :disabled="!topBottomZoneEnabled"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
              <div class="text-xs text-gray-500 text-center">{{ topBottomZoneDepth }}cm from edge</div>
            </div>
          </div>

          <!-- Left/Right Edge Control -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Left & Right Edges</label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="leftRightZoneEnabled"
                  @change="handleLeftRightZoneChange"
                  class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-xs text-gray-600">Enable</span>
              </label>
            </div>
            <div class="space-y-2">
              <input
                v-model="leftRightZoneDepth"
                @input="handleLeftRightDepthChange"
                type="range"
                min="0"
                max="50"
                :disabled="!leftRightZoneEnabled"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
              <div class="text-xs text-gray-500 text-center">{{ leftRightZoneDepth }}cm from edge</div>
            </div>
          </div>
        </div>

      </div>

      <!-- Defect Rules Section -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">Defect Rules Configuration</h2>
          <div class="flex items-center space-x-2">
            <button
              @click="enableAllDefects"
              class="px-3 py-1.5 text-sm bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg transition-colors"
            >
              Enable All
            </button>
            <button
              @click="disableAllDefects"
              class="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Disable All
            </button>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="flex items-center space-x-1 mb-6 border-b border-gray-200">
          <button
            @click="activeRuleTab = 'board'"
            :class="[
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeRuleTab === 'board'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
          >
            Entire Board Rules
            <span class="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
              {{ getEnabledDefectsCount('board') }}
            </span>
          </button>
          <button
            v-if="hasAnyZones"
            @click="activeRuleTab = 'leftRight'"
            :class="[
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeRuleTab === 'leftRight'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
          >
            Left & Right Edge Rules
            <span class="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs">
              {{ getEnabledDefectsCount('leftRight') }}
            </span>
          </button>
          <button
            v-if="hasAnyZones"
            @click="activeRuleTab = 'topBottom'"
            :class="[
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeRuleTab === 'topBottom'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
          >
            Top & Bottom Edge Rules
            <span class="ml-2 px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-xs">
              {{ getEnabledDefectsCount('topBottom') }}
            </span>
          </button>
        </div>

        <!-- Board Rules Tab -->
        <div v-if="activeRuleTab === 'board'" class="space-y-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Rules for Entire Board</h3>
            <div class="text-sm text-gray-600">
              These rules apply to the entire board surface
            </div>
          </div>

          <!-- Defect Categories for Board -->
          <div v-for="category in defectCategories" :key="category.id" class="border border-gray-200 rounded-lg">
            <div class="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
              <div class="flex items-center justify-between">
                <h4 class="font-medium text-gray-900">{{ category.name }}</h4>
                <div class="flex items-center space-x-3">
                  <span class="text-sm text-gray-600">
                    {{ getEnabledInCategory(category.id, 'board') }} / {{ getCategoryDefects(category.id).length }} enabled
                  </span>
                  <button
                    @click="toggleAllInCategory(category.id, 'board')"
                    class="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    {{ getEnabledInCategory(category.id, 'board') === getCategoryDefects(category.id).length ? 'Disable All' : 'Enable All' }}
                  </button>
                </div>
              </div>
            </div>
            
            <div class="p-4 space-y-4">
              <div v-for="defect in getCategoryDefects(category.id)" :key="defect.id" class="border border-gray-100 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      v-model="boardRules[defect.id].enabled"
                      class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 font-medium text-gray-900">{{ defect.name }}</span>
                  </label>
                </div>
                
                <div v-if="boardRules[defect.id].enabled" class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Metric</label>
                    <select
                      v-model="boardRules[defect.id].metric"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                    >
                      <option v-for="metric in getMetricOptions(defect.id)" :key="metric" :value="metric">
                        {{ formatMetric(metric) }}
                      </option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Limit Value ({{ getUnitForMetric(boardRules[defect.id].metric) }})
                    </label>
                    <input
                      v-model="boardRules[defect.id].limitValue"
                      type="number"
                      step="0.1"
                      min="0"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Aggregation</label>
                    <select
                      v-model="boardRules[defect.id].aggregationMethod"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                    >
                      <option v-for="option in aggregationOptions" :key="option.value" :value="option.value">
                        {{ option.title }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Left & Right Edge Rules Tab -->
        <div v-if="activeRuleTab === 'leftRight'" class="space-y-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 text-blue-700">Rules for Left & Right Edges</h3>
            <div class="flex items-center space-x-3">
              <div class="text-sm text-gray-600">
                Zones: {{ (zoneConfig.left.enabled ? 'Left (' + zoneConfig.left.depth + 'cm)' : '') }}{{ zoneConfig.left.enabled && zoneConfig.right.enabled ? ', ' : '' }}{{ (zoneConfig.right.enabled ? 'Right (' + zoneConfig.right.depth + 'cm)' : '') }}
              </div>
              <button
                @click="copyBoardRulesToZones('leftRight')"
                class="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors flex items-center"
              >
                <Copy class="w-4 h-4 mr-1" />
                Copy from Board
              </button>
            </div>
          </div>

          <!-- Defect Categories for Left/Right Zones -->
          <div v-for="category in defectCategories" :key="category.id" class="border border-blue-200 rounded-lg">
            <div class="bg-blue-50 px-4 py-3 border-b border-blue-200 rounded-t-lg">
              <div class="flex items-center justify-between">
                <h4 class="font-medium text-gray-900">{{ category.name }}</h4>
                <div class="flex items-center space-x-3">
                  <span class="text-sm text-gray-600">
                    {{ getEnabledInCategory(category.id, 'leftRight') }} / {{ getCategoryDefects(category.id).length }} enabled
                  </span>
                  <button
                    @click="toggleAllInCategory(category.id, 'leftRight')"
                    class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {{ getEnabledInCategory(category.id, 'leftRight') === getCategoryDefects(category.id).length ? 'Disable All' : 'Enable All' }}
                  </button>
                </div>
              </div>
            </div>
            
            <div class="p-4 space-y-4">
              <div v-for="defect in getCategoryDefects(category.id)" :key="defect.id" class="border border-gray-100 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      v-model="leftRightRules[defect.id].enabled"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 font-medium text-gray-900">{{ defect.name }}</span>
                  </label>
                  <div v-if="!leftRightRules[defect.id].enabled && boardRules[defect.id].enabled" class="text-xs text-gray-500 italic">
                    ↳ Inherits from board
                  </div>
                  <div v-else-if="leftRightRules[defect.id].enabled" class="text-xs text-blue-600 font-medium">
                    ↳ Zone override
                  </div>
                </div>
                
                <div v-if="leftRightRules[defect.id].enabled" class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Metric</label>
                    <select
                      v-model="leftRightRules[defect.id].metric"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option v-for="metric in getMetricOptions(defect.id)" :key="metric" :value="metric">
                        {{ formatMetric(metric) }}
                      </option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Limit Value ({{ getUnitForMetric(leftRightRules[defect.id].metric) }})
                    </label>
                    <input
                      v-model="leftRightRules[defect.id].limitValue"
                      type="number"
                      step="0.1"
                      min="0"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Aggregation</label>
                    <select
                      v-model="leftRightRules[defect.id].aggregationMethod"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option v-for="option in aggregationOptions" :key="option.value" :value="option.value">
                        {{ option.title }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top & Bottom Edge Rules Tab -->
        <div v-if="activeRuleTab === 'topBottom'" class="space-y-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 text-green-700">Rules for Top & Bottom Edges</h3>
            <div class="flex items-center space-x-3">
              <div class="text-sm text-gray-600">
                Zones: {{ (zoneConfig.top.enabled ? 'Top (' + zoneConfig.top.depth + 'cm)' : '') }}{{ zoneConfig.top.enabled && zoneConfig.bottom.enabled ? ', ' : '' }}{{ (zoneConfig.bottom.enabled ? 'Bottom (' + zoneConfig.bottom.depth + 'cm)' : '') }}
              </div>
              <button
                @click="copyBoardRulesToZones('topBottom')"
                class="px-3 py-1.5 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors flex items-center"
              >
                <Copy class="w-4 h-4 mr-1" />
                Copy from Board
              </button>
            </div>
          </div>

          <!-- Defect Categories for Top/Bottom Zones -->
          <div v-for="category in defectCategories" :key="category.id" class="border border-green-200 rounded-lg">
            <div class="bg-green-50 px-4 py-3 border-b border-green-200 rounded-t-lg">
              <div class="flex items-center justify-between">
                <h4 class="font-medium text-gray-900">{{ category.name }}</h4>
                <div class="flex items-center space-x-3">
                  <span class="text-sm text-gray-600">
                    {{ getEnabledInCategory(category.id, 'topBottom') }} / {{ getCategoryDefects(category.id).length }} enabled
                  </span>
                  <button
                    @click="toggleAllInCategory(category.id, 'topBottom')"
                    class="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    {{ getEnabledInCategory(category.id, 'topBottom') === getCategoryDefects(category.id).length ? 'Disable All' : 'Enable All' }}
                  </button>
                </div>
              </div>
            </div>
            
            <div class="p-4 space-y-4">
              <div v-for="defect in getCategoryDefects(category.id)" :key="defect.id" class="border border-gray-100 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      v-model="topBottomRules[defect.id].enabled"
                      class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 font-medium text-gray-900">{{ defect.name }}</span>
                  </label>
                  <div v-if="!topBottomRules[defect.id].enabled && boardRules[defect.id].enabled" class="text-xs text-gray-500 italic">
                    ↳ Inherits from board
                  </div>
                  <div v-else-if="topBottomRules[defect.id].enabled" class="text-xs text-green-600 font-medium">
                    ↳ Zone override
                  </div>
                </div>
                
                <div v-if="topBottomRules[defect.id].enabled" class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Metric</label>
                    <select
                      v-model="topBottomRules[defect.id].metric"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                    >
                      <option v-for="metric in getMetricOptions(defect.id)" :key="metric" :value="metric">
                        {{ formatMetric(metric) }}
                      </option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Limit Value ({{ getUnitForMetric(topBottomRules[defect.id].metric) }})
                    </label>
                    <input
                      v-model="topBottomRules[defect.id].limitValue"
                      type="number"
                      step="0.1"
                      min="0"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Aggregation</label>
                    <select
                      v-model="topBottomRules[defect.id].aggregationMethod"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                    >
                      <option v-for="option in aggregationOptions" :key="option.value" :value="option.value">
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

      <!-- Summary Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Grade Configuration Summary</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Board Rules Summary -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 mb-3 flex items-center">
              <Package class="w-4 h-4 mr-2" />
              Board Rules
            </h3>
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
                No board rules configured
              </div>
            </div>
          </div>

          <!-- Left/Right Zone Rules Summary -->
          <div class="bg-blue-50 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 mb-3 flex items-center">
              <Map class="w-4 h-4 mr-2 text-blue-600" />
              Left & Right Edge Rules
            </h3>
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
                {{ (zoneConfig.left.enabled || zoneConfig.right.enabled) ? 'No zone overrides configured' : 'No left/right zones defined' }}
              </div>
            </div>
          </div>

          <!-- Top/Bottom Zone Rules Summary -->
          <div class="bg-green-50 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 mb-3 flex items-center">
              <Map class="w-4 h-4 mr-2 text-green-600" />
              Top & Bottom Edge Rules
            </h3>
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
                {{ (zoneConfig.top.enabled || zoneConfig.bottom.enabled) ? 'No zone overrides configured' : 'No top/bottom zones defined' }}
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
        metric: defect.metric || 'diameter',
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

// Simplified zone controls
const topBottomZoneEnabled = ref(false)
const topBottomZoneDepth = ref(10)
const leftRightZoneEnabled = ref(false)
const leftRightZoneDepth = ref(10)

// Sync simplified controls with zone config
const handleTopBottomZoneChange = () => {
  zoneConfig.value.top.enabled = topBottomZoneEnabled.value
  zoneConfig.value.bottom.enabled = topBottomZoneEnabled.value
}

const handleTopBottomDepthChange = () => {
  zoneConfig.value.top.depth = topBottomZoneDepth.value
  zoneConfig.value.bottom.depth = topBottomZoneDepth.value
}

const handleLeftRightZoneChange = () => {
  zoneConfig.value.left.enabled = leftRightZoneEnabled.value
  zoneConfig.value.right.enabled = leftRightZoneEnabled.value
}

const handleLeftRightDepthChange = () => {
  zoneConfig.value.left.depth = leftRightZoneDepth.value
  zoneConfig.value.right.depth = leftRightZoneDepth.value
}
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
  
  const composableCategoryKey = categoryMap[categoryId]
  return defectCategoriesData.value[composableCategoryKey]?.defects || []
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
    default:
      return 0
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
      return 0
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
      return
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
      topBottomZoneEnabled.value = false
      leftRightZoneEnabled.value = false
      topBottomZoneDepth.value = 10
      leftRightZoneDepth.value = 10
      handleTopBottomZoneChange()
      handleLeftRightZoneChange()
      handleTopBottomDepthChange()
      handleLeftRightDepthChange()
      break
    case 'standard':
      topBottomZoneEnabled.value = true
      leftRightZoneEnabled.value = true
      topBottomZoneDepth.value = 10
      leftRightZoneDepth.value = 10
      handleTopBottomZoneChange()
      handleLeftRightZoneChange()
      handleTopBottomDepthChange()
      handleLeftRightDepthChange()
      break
    case 'wide-ends':
      topBottomZoneEnabled.value = true
      leftRightZoneEnabled.value = true
      topBottomZoneDepth.value = 20
      leftRightZoneDepth.value = 5
      handleTopBottomZoneChange()
      handleLeftRightZoneChange()
      handleTopBottomDepthChange()
      handleLeftRightDepthChange()
      break
    case 'custom':
      // Keep current settings
      break
  }
}


const copyBoardRulesToZones = (zoneType) => {
  let targetRules
  switch (zoneType) {
    case 'leftRight':
      targetRules = leftRightRules.value
      break
    case 'topBottom':
      targetRules = topBottomRules.value
      break
    default:
      return
  }
  
  Object.keys(boardRules.value).forEach(defectId => {
    if (boardRules.value[defectId].enabled) {
      targetRules[defectId] = { ...boardRules.value[defectId] }
    }
  })
}

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