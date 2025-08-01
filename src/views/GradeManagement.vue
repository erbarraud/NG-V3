<template>
  <div class="w-full px-4 sm:px-6 lg:px-8 py-6">
    <!-- Page Header -->
    <div class="header-section mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Grade Management</h1>
          <p class="text-gray-600">Manage lumber grading standards and templates</p>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Search Input -->
          <div class="relative">
            <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search grades..."
              class="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-80 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <!-- Filter Dropdown -->
          <select
            v-model="statusFilter"
            class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">All Grade Types</option>
            <option value="active">Active Grades</option>
            <option value="inactive">Inactive Grades</option>
            <option value="template">Templates</option>
          </select>
          
          <!-- Create New Grade Button -->
          <Button @click="createNewGrade">
            <Plus class="w-4 h-4 mr-2" />
            Create New Grade
          </Button>
        </div>
      </div>
    </div>

    <!-- Grade List View -->
    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <LoadingSkeleton variant="card" v-for="i in 8" :key="i" />
      </div>
    </div>

    <!-- Grade Cards Grid -->
    <div v-else-if="currentView === 'list'" class="space-y-6">
      <!-- Results Summary -->
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600">
          Showing {{ filteredGrades.length }} of {{ grades.length }} grades
        </div>
        <div class="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Upload class="w-4 h-4 mr-2" />
            Import Grades
          </Button>
          <Button variant="outline" size="sm">
            <Download class="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <!-- Grade Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- FAS Grade Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Award class="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">FAS</h3>
                  <p class="text-sm text-gray-500">First and Seconds</p>
                </div>
              </div>
              <Badge variant="default" class="text-xs">Active</Badge>
            </div>
            
            <div class="space-y-3 mb-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Face Method:</span>
                <span class="font-medium text-gray-900">Good Face</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Min Width:</span>
                <span class="font-medium text-gray-900">6 inches</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Min Length:</span>
                <span class="font-medium text-gray-900">8 feet</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Usage Count:</span>
                <span class="font-medium text-emerald-600">1,247 boards</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <Button variant="outline" size="sm" class="flex-1" @click="editGrade(grades[0])">
                <Edit class="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" @click="cloneGrade(grades[0])">
                <Copy class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <!-- Select & Better Grade Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Star class="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Select & Better</h3>
                  <p class="text-sm text-gray-500">High Quality</p>
                </div>
              </div>
              <Badge variant="default" class="text-xs">Active</Badge>
            </div>
            
            <div class="space-y-3 mb-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Face Method:</span>
                <span class="font-medium text-gray-900">Both Faces</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Min Width:</span>
                <span class="font-medium text-gray-900">4 inches</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Min Length:</span>
                <span class="font-medium text-gray-900">6 feet</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Usage Count:</span>
                <span class="font-medium text-emerald-600">892 boards</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <Button variant="outline" size="sm" class="flex-1" @click="editGrade(grades[1])">
                <Edit class="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" @click="cloneGrade(grades[1])">
                <Copy class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <!-- No.1 Common Grade Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Package class="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">No.1 Common</h3>
                  <p class="text-sm text-gray-500">Standard Grade</p>
                </div>
              </div>
              <Badge variant="default" class="text-xs">Active</Badge>
            </div>
            
            <div class="space-y-3 mb-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Face Method:</span>
                <span class="font-medium text-gray-900">Poor Face</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Min Width:</span>
                <span class="font-medium text-gray-900">3 inches</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Min Length:</span>
                <span class="font-medium text-gray-900">4 feet</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Usage Count:</span>
                <span class="font-medium text-emerald-600">2,156 boards</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <Button variant="outline" size="sm" class="flex-1" @click="editGrade(grades[2])">
                <Edit class="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" @click="cloneGrade(grades[2])">
                <Copy class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <!-- No.2A Common Grade Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Layers class="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">No.2A Common</h3>
                  <p class="text-sm text-gray-500">Economy Grade</p>
                </div>
              </div>
              <Badge variant="secondary" class="text-xs">Inactive</Badge>
            </div>
            
            <div class="space-y-3 mb-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Face Method:</span>
                <span class="font-medium text-gray-900">Poor Face</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Min Width:</span>
                <span class="font-medium text-gray-900">3 inches</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Min Length:</span>
                <span class="font-medium text-gray-900">4 feet</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Usage Count:</span>
                <span class="font-medium text-gray-500">0 boards</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <Button variant="outline" size="sm" class="flex-1" @click="editGrade(grades[3])">
                <Edit class="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" @click="cloneGrade(grades[3])">
                <Copy class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <!-- Additional Grade Cards (filtered results) -->
        <div 
          v-for="grade in filteredGrades.slice(4)" 
          :key="grade.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText class="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ grade.name }}</h3>
                  <p class="text-sm text-gray-500">{{ grade.description }}</p>
                </div>
              </div>
              <Badge :variant="grade.isActive ? 'default' : 'secondary'" class="text-xs">
                {{ grade.isActive ? 'Active' : 'Inactive' }}
              </Badge>
            </div>
            
            <div class="space-y-3 mb-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Face Method:</span>
                <span class="font-medium text-gray-900">{{ getFaceMethodLabel(grade.faceMethod) }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Width Method:</span>
                <span class="font-medium text-gray-900">{{ getWidthMethodLabel(grade.widthMethod) }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Zones:</span>
                <span class="font-medium text-gray-900">{{ grade.zones?.length || 0 }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Usage Count:</span>
                <span class="font-medium text-emerald-600">{{ Math.floor(Math.random() * 1000) }} boards</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <Button variant="outline" size="sm" class="flex-1" @click="editGrade(grade)">
                <Edit class="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" @click="cloneGrade(grade)">
                <Copy class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <!-- Empty State for No Results -->
        <div v-if="filteredGrades.length === 0" class="col-span-full">
          <div class="text-center py-12">
            <FileText class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">No grades found</h3>
            <p class="text-gray-500 mb-4">Try adjusting your search or filters</p>
            <Button @click="clearFilters">
              <X class="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Grade Creation/Edit Form -->
    <div v-if="currentView === 'form'" class="space-y-6">
      <!-- Form Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <Button variant="outline" @click="cancelForm">
            <ArrowLeft class="w-4 h-4 mr-2" />
            Back to List
          </Button>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">
              {{ isEditing ? 'Edit Grade' : 'Create New Grade' }}
            </h2>
            <p class="text-gray-600">{{ currentGrade?.name || 'Configure grade rules and zones' }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <Button variant="outline" @click="previewGrade">
            <Eye class="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button @click="saveGrade" :disabled="!isFormValid">
            <Save class="w-4 h-4 mr-2" />
            {{ isEditing ? 'Update Grade' : 'Create Grade' }}
          </Button>
        </div>
      </div>

      <!-- Form Tabs -->
      <div class="bg-white rounded-lg shadow">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6">
            <button
              v-for="tab in formTabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <component :is="tab.icon" class="w-4 h-4 mr-2 inline" />
              {{ tab.name }}
              <span v-if="tab.badge" class="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                {{ tab.badge }}
              </span>
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Basic Information Tab -->
          <div v-if="activeTab === 'basic'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Grade Name *</label>
                <input
                  v-model="currentGrade.name"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter grade name (e.g., FAS, Select, 1 Common)"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  v-model="currentGrade.isActive"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option :value="true">Active</option>
                  <option :value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                v-model="currentGrade.description"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Describe this grade and its intended use..."
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Face Grading Method *</label>
                <select
                  v-model="currentGrade.faceMethod"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="good">Good Face Only</option>
                  <option value="poor">Poor Face Only</option>
                  <option value="both">Both Faces</option>
                </select>
                <p class="text-xs text-gray-500 mt-1">
                  Determines which face(s) are evaluated for grading
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Width Measurement Method *</label>
                <select
                  v-model="currentGrade.widthMethod"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="full-wane">Full-wane</option>
                  <option value="half-wane">Half-wane</option>
                  <option value="smaller-side">Smaller Side</option>
                </select>
                <p class="text-xs text-gray-500 mt-1">
                  How board width is measured when wane is present
                </p>
              </div>
            </div>
          </div>

          <!-- Zone Definition Tab -->
          <div v-if="activeTab === 'zones'" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Visual Zone Designer -->
              <div>
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-semibold text-gray-900">Zone Designer</h3>
                  <div class="flex items-center space-x-2">
                    <Button variant="outline" size="sm" @click="showGrid = !showGrid">
                      <Grid class="w-4 h-4 mr-1" />
                      Grid
                    </Button>
                    <Button variant="outline" size="sm" @click="clearAllZones">
                      <Trash2 class="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>

                <!-- Board Canvas -->
                <div class="relative border-2 border-gray-300 rounded-lg bg-amber-50 overflow-hidden">
                  <svg
                    ref="boardCanvas"
                    :width="canvasWidth"
                    :height="canvasHeight"
                    class="cursor-crosshair"
                    @mousedown="startDrawing"
                    @mousemove="updateDrawing"
                    @mouseup="endDrawing"
                    @mouseleave="endDrawing"
                  >
                    <!-- Grid -->
                    <defs v-if="showGrid">
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" stroke-width="1"/>
                      </pattern>
                    </defs>
                    <rect v-if="showGrid" width="100%" height="100%" fill="url(#grid)" />

                    <!-- Board outline -->
                    <rect
                      x="20"
                      y="20"
                      :width="canvasWidth - 40"
                      :height="canvasHeight - 40"
                      fill="#fbbf24"
                      stroke="#92400e"
                      stroke-width="2"
                      rx="4"
                    />

                    <!-- Existing zones -->
                    <g v-for="(zone, index) in currentGrade.zones" :key="zone.id">
                      <rect
                        :x="zone.x"
                        :y="zone.y"
                        :width="zone.width"
                        :height="zone.height"
                        :fill="getZoneColorHex(index)"
                        :stroke="selectedZone === zone.id ? '#059669' : '#374151'"
                        :stroke-width="selectedZone === zone.id ? 3 : 1"
                        fill-opacity="0.3"
                        class="cursor-pointer"
                        @click="selectZone(zone.id)"
                      />
                      <text
                        :x="zone.x + zone.width / 2"
                        :y="zone.y + zone.height / 2"
                        text-anchor="middle"
                        dominant-baseline="middle"
                        class="text-xs font-medium fill-gray-700 pointer-events-none"
                      >
                        {{ zone.name }}
                      </text>
                    </g>

                    <!-- Drawing preview -->
                    <rect
                      v-if="isDrawing && drawingZone"
                      :x="drawingZone.x"
                      :y="drawingZone.y"
                      :width="drawingZone.width"
                      :height="drawingZone.height"
                      fill="#10b981"
                      fill-opacity="0.2"
                      stroke="#10b981"
                      stroke-width="2"
                      stroke-dasharray="5,5"
                    />
                  </svg>
                </div>

                <!-- Zone Templates -->
                <div class="mt-4">
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Quick Templates</h4>
                  <div class="flex flex-wrap gap-2">
                    <Button
                      v-for="template in zoneTemplates"
                      :key="template.id"
                      variant="outline"
                      size="sm"
                      @click="applyZoneTemplate(template)"
                    >
                      {{ template.name }}
                    </Button>
                  </div>
                </div>
              </div>

              <!-- Zone List and Properties -->
              <div>
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-semibold text-gray-900">Zones ({{ currentGrade.zones?.length || 0 }})</h3>
                  <Button variant="outline" size="sm" @click="addZoneManually">
                    <Plus class="w-4 h-4 mr-1" />
                    Add Zone
                  </Button>
                </div>

                <div class="space-y-3 max-h-96 overflow-y-auto">
                  <div
                    v-for="(zone, index) in currentGrade.zones"
                    :key="zone.id"
                    :class="[
                      'p-4 border-2 rounded-lg cursor-pointer transition-all',
                      selectedZone === zone.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                    @click="selectZone(zone.id)"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center space-x-2">
                        <div
                          :class="[
                            'w-4 h-4 rounded border',
                            getZoneColor(index)
                          ]"
                        ></div>
                        <input
                          v-model="zone.name"
                          class="font-medium text-gray-900 bg-transparent border-none p-0 focus:ring-0"
                          @click.stop
                        />
                      </div>
                      <div class="flex items-center space-x-1">
                        <button
                          @click.stop="moveZone(index, -1)"
                          :disabled="index === 0"
                          class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <ChevronUp class="w-4 h-4" />
                        </button>
                        <button
                          @click.stop="moveZone(index, 1)"
                          :disabled="index === currentGrade.zones.length - 1"
                          class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <ChevronDown class="w-4 h-4" />
                        </button>
                        <button
                          @click.stop="deleteZone(zone.id)"
                          class="p-1 text-gray-400 hover:text-red-600"
                        >
                          <X class="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div class="text-xs text-gray-500">
                      Position: {{ Math.round(zone.x) }}, {{ Math.round(zone.y) }} | 
                      Size: {{ Math.round(zone.width) }} × {{ Math.round(zone.height) }}
                    </div>
                    <div class="mt-2 flex items-center space-x-4 text-xs">
                      <label class="flex items-center">
                        <input
                          type="checkbox"
                          v-model="zone.canOverlap"
                          class="h-3 w-3 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                          @click.stop
                        />
                        <span class="ml-1 text-gray-600">Can Overlap</span>
                      </label>
                      <div class="flex items-center space-x-1">
                        <span class="text-gray-600">Priority:</span>
                        <input
                          v-model.number="zone.priority"
                          type="number"
                          min="1"
                          max="10"
                          class="w-12 px-1 py-0 text-xs border border-gray-300 rounded"
                          @click.stop
                        />
                      </div>
                    </div>
                  </div>

                  <div v-if="!currentGrade.zones?.length" class="text-center py-8 text-gray-500">
                    <Layers class="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p class="text-sm">No zones defined</p>
                    <p class="text-xs">Draw zones on the board or use templates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Board Rules Tab -->
          <div v-if="activeTab === 'board-rules'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Dimension Constraints -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Dimension Constraints</h3>
                <div class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Min Length (ft)</label>
                      <input
                        v-model.number="currentGrade.boardRules.minLength"
                        type="number"
                        step="0.5"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Max Length (ft)</label>
                      <input
                        v-model.number="currentGrade.boardRules.maxLength"
                        type="number"
                        step="0.5"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Min Width (in)</label>
                      <input
                        v-model.number="currentGrade.boardRules.minWidth"
                        type="number"
                        step="0.25"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Max Width (in)</label>
                      <input
                        v-model.number="currentGrade.boardRules.maxWidth"
                        type="number"
                        step="0.25"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Thickness Constraints</label>
                    <select
                      v-model="currentGrade.boardRules.thicknessConstraint"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="any">Any Thickness</option>
                      <option value="4/4">4/4 (1 inch)</option>
                      <option value="5/4">5/4 (1.25 inches)</option>
                      <option value="6/4">6/4 (1.5 inches)</option>
                      <option value="8/4">8/4 (2 inches)</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Warp Tolerances -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Warp Tolerances</h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Max Bow (in per 8ft)</label>
                    <input
                      v-model.number="currentGrade.boardRules.maxBow"
                      type="number"
                      step="0.125"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Max Cup (in per width)</label>
                    <input
                      v-model.number="currentGrade.boardRules.maxCup"
                      type="number"
                      step="0.125"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Max Crook (in per 8ft)</label>
                    <input
                      v-model.number="currentGrade.boardRules.maxCrook"
                      type="number"
                      step="0.125"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Max Twist (in per 8ft)</label>
                    <input
                      v-model.number="currentGrade.boardRules.maxTwist"
                      type="number"
                      step="0.125"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Zone Rules Tab -->
          <div v-if="activeTab === 'zone-rules'" class="space-y-6">
            <div v-if="!currentGrade.zones?.length" class="text-center py-12 text-gray-500">
              <Layers class="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 class="text-lg font-medium text-gray-900 mb-2">No Zones Defined</h3>
              <p class="text-sm text-gray-600 mb-4">Create zones first to configure zone-specific rules</p>
              <Button @click="activeTab = 'zones'">
                <Plus class="w-4 h-4 mr-2" />
                Define Zones
              </Button>
            </div>

            <div v-else>
              <!-- Zone Selector -->
              <div class="flex items-center space-x-4 mb-6">
                <span class="text-sm font-medium text-gray-700">Configure rules for:</span>
                <div class="flex space-x-2">
                  <button
                    @click="selectedRuleZone = 'overall'"
                    :class="[
                      'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                      selectedRuleZone === 'overall'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    ]"
                  >
                    Overall Board
                  </button>
                  <button
                    v-for="(zone, index) in currentGrade.zones"
                    :key="zone.id"
                    @click="selectedRuleZone = zone.id"
                    :class="[
                      'px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2',
                      selectedRuleZone === zone.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    ]"
                  >
                    <div :class="['w-3 h-3 rounded border', getZoneColor(index)]"></div>
                    <span>{{ zone.name }}</span>
                  </button>
                </div>
              </div>

              <!-- Rule Configuration -->
              <div class="bg-gray-50 rounded-lg p-6">
                <ZoneRuleConfiguration
                  :zone-id="selectedRuleZone"
                  :rules="getCurrentZoneRules()"
                  @update-rules="updateZoneRules"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Plus, Search, Edit, Copy, Power, Trash2, ArrowLeft, Eye, Save, Upload, Download,
  Grid, Layers, ChevronUp, ChevronDown, X
} from 'lucide-vue-next'
import { Award, Star, Package, FileText } from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'
import Badge from '@/components/ui/badge.vue'
import LoadingSkeleton from '@/components/ui/loading-skeleton.vue'
import { useAsyncState } from '@/composables/useAsyncState.js'

// Component state
const currentView = ref('list') // 'list' or 'form'
const isEditing = ref(false)
const activeTab = ref('basic')
const selectedZone = ref(null)
const selectedRuleZone = ref('overall')
const showGrid = ref(true)
const showImportModal = ref(false)
const isLoading = ref(false)

// Search and filters
const searchQuery = ref('')
const statusFilter = ref('')
const faceMethodFilter = ref('')

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  faceMethodFilter.value = ''
}

// Canvas dimensions
const canvasWidth = ref(400)
const canvasHeight = ref(200)

// Drawing state
const isDrawing = ref(false)
const drawingZone = ref(null)
const startPoint = ref({ x: 0, y: 0 })

// Form tabs
const formTabs = ref([
  { id: 'basic', name: 'Basic Info', icon: 'FileText' },
  { id: 'zones', name: 'Zone Definition', icon: 'Layers', badge: computed(() => currentGrade.value?.zones?.length || 0) },
  { id: 'board-rules', name: 'Board Rules', icon: 'Settings' },
  { id: 'zone-rules', name: 'Zone Rules', icon: 'Target' }
])

// Current grade being edited
const currentGrade = ref({
  id: null,
  name: '',
  description: '',
  faceMethod: 'both',
  widthMethod: 'full-wane',
  isActive: true,
  zones: [],
  boardRules: {
    minLength: null,
    maxLength: null,
    minWidth: null,
    maxWidth: null,
    thicknessConstraint: 'any',
    maxBow: null,
    maxCup: null,
    maxCrook: null,
    maxTwist: null
  },
  zoneRules: {}
})

// Sample grades data
const grades = ref([
  {
    id: 1,
    name: 'FAS',
    description: 'First and Seconds - Highest grade lumber',
    faceMethod: 'good',
    widthMethod: 'full-wane',
    isActive: true,
    zones: [
      { id: 'z1', name: 'Center Zone', x: 50, y: 40, width: 300, height: 120, canOverlap: false, priority: 1 },
      { id: 'z2', name: 'Edge Zone', x: 30, y: 30, width: 340, height: 20, canOverlap: true, priority: 2 }
    ]
  },
  {
    id: 2,
    name: 'Select',
    description: 'High quality lumber with minor defects allowed',
    faceMethod: 'both',
    widthMethod: 'half-wane',
    isActive: true,
    zones: [
      { id: 'z3', name: 'Main Area', x: 40, y: 30, width: 320, height: 140, canOverlap: false, priority: 1 }
    ]
  },
  {
    id: 3,
    name: '1 Common',
    description: 'Good for staining and painting applications',
    faceMethod: 'both',
    widthMethod: 'smaller-side',
    isActive: true,
    zones: []
  },
  {
    id: 4,
    name: '2 Common',
    description: 'Economy grade with character marks',
    faceMethod: 'poor',
    widthMethod: 'full-wane',
    isActive: false,
    zones: []
  }
])

// Zone templates
const zoneTemplates = ref([
  {
    id: 'center-only',
    name: 'Center Only',
    zones: [
      { name: 'Center Zone', x: 60, y: 50, width: 280, height: 100, canOverlap: false, priority: 1 }
    ]
  },
  {
    id: 'exclude-edges',
    name: 'Exclude Edges',
    zones: [
      { name: 'Main Area', x: 40, y: 40, width: 320, height: 120, canOverlap: false, priority: 1 }
    ]
  },
  {
    id: 'three-zones',
    name: 'Three Zones',
    zones: [
      { name: 'Left Zone', x: 30, y: 40, width: 120, height: 120, canOverlap: false, priority: 1 },
      { name: 'Center Zone', x: 160, y: 40, width: 80, height: 120, canOverlap: false, priority: 2 },
      { name: 'Right Zone', x: 250, y: 40, width: 120, height: 120, canOverlap: false, priority: 3 }
    ]
  }
])

// Computed properties
const filteredGrades = computed(() => {
  return grades.value.filter(grade => {
    const matchesSearch = !searchQuery.value || 
      grade.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      grade.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = !statusFilter.value || 
      (statusFilter.value === 'active' && grade.isActive) ||
      (statusFilter.value === 'inactive' && !grade.isActive)
    
    const matchesFaceMethod = !faceMethodFilter.value || grade.faceMethod === faceMethodFilter.value
    
    return matchesSearch && matchesStatus && matchesFaceMethod
  })
})

const isFormValid = computed(() => {
  return currentGrade.value.name && 
         currentGrade.value.faceMethod && 
         currentGrade.value.widthMethod
})

// Methods
const createNewGrade = () => {
  currentGrade.value = {
    id: null,
    name: '',
    description: '',
    faceMethod: 'both',
    widthMethod: 'full-wane',
    isActive: true,
    zones: [],
    boardRules: {
      minLength: null,
      maxLength: null,
      minWidth: null,
      maxWidth: null,
      thicknessConstraint: 'any',
      maxBow: null,
      maxCup: null,
      maxCrook: null,
      maxTwist: null
    },
    zoneRules: {}
  }
  isEditing.value = false
  currentView.value = 'form'
  activeTab.value = 'basic'
}

const editGrade = (grade) => {
  currentGrade.value = JSON.parse(JSON.stringify(grade))
  isEditing.value = true
  currentView.value = 'form'
  activeTab.value = 'basic'
}

const cloneGrade = (grade) => {
  const cloned = JSON.parse(JSON.stringify(grade))
  cloned.id = null
  cloned.name = `${grade.name} (Copy)`
  cloned.isActive = false
  currentGrade.value = cloned
  isEditing.value = false
  currentView.value = 'form'
  activeTab.value = 'basic'
}

const deleteGrade = (grade) => {
  if (confirm(`Are you sure you want to delete the grade "${grade.name}"?`)) {
    const index = grades.value.findIndex(g => g.id === grade.id)
    if (index > -1) {
      grades.value.splice(index, 1)
    }
  }
}

const toggleGradeStatus = (grade) => {
  grade.isActive = !grade.isActive
}

const cancelForm = () => {
  currentView.value = 'list'
  selectedZone.value = null
  selectedRuleZone.value = 'overall'
}

const saveGrade = () => {
  if (!isFormValid.value) return
  
  if (isEditing.value) {
    const index = grades.value.findIndex(g => g.id === currentGrade.value.id)
    if (index > -1) {
      grades.value[index] = { ...currentGrade.value }
    }
  } else {
    currentGrade.value.id = Date.now()
    grades.value.push({ ...currentGrade.value })
  }
  
  currentView.value = 'list'
}

const previewGrade = () => {
  // Implementation for grade preview
  console.log('Preview grade:', currentGrade.value)
}

// Zone management methods
const startDrawing = (event) => {
  const rect = event.target.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  // Check if within board bounds
  if (x < 20 || x > canvasWidth.value - 20 || y < 20 || y > canvasHeight.value - 20) {
    return
  }
  
  isDrawing.value = true
  startPoint.value = { x, y }
  drawingZone.value = { x, y, width: 0, height: 0 }
}

const updateDrawing = (event) => {
  if (!isDrawing.value) return
  
  const rect = event.target.getBoundingClientRect()
  const currentX = event.clientX - rect.left
  const currentY = event.clientY - rect.top
  
  drawingZone.value = {
    x: Math.min(startPoint.value.x, currentX),
    y: Math.min(startPoint.value.y, currentY),
    width: Math.abs(currentX - startPoint.value.x),
    height: Math.abs(currentY - startPoint.value.y)
  }
}

const endDrawing = () => {
  if (!isDrawing.value || !drawingZone.value) return
  
  // Only create zone if it has meaningful size
  if (drawingZone.value.width > 10 && drawingZone.value.height > 10) {
    const newZone = {
      id: `zone_${Date.now()}`,
      name: `Zone ${(currentGrade.value.zones?.length || 0) + 1}`,
      x: drawingZone.value.x,
      y: drawingZone.value.y,
      width: drawingZone.value.width,
      height: drawingZone.value.height,
      canOverlap: false,
      priority: (currentGrade.value.zones?.length || 0) + 1
    }
    
    if (!currentGrade.value.zones) {
      currentGrade.value.zones = []
    }
    currentGrade.value.zones.push(newZone)
    selectedZone.value = newZone.id
  }
  
  isDrawing.value = false
  drawingZone.value = null
}

const selectZone = (zoneId) => {
  selectedZone.value = selectedZone.value === zoneId ? null : zoneId
}

const deleteZone = (zoneId) => {
  const index = currentGrade.value.zones.findIndex(z => z.id === zoneId)
  if (index > -1) {
    currentGrade.value.zones.splice(index, 1)
    if (selectedZone.value === zoneId) {
      selectedZone.value = null
    }
  }
}

const moveZone = (index, direction) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < currentGrade.value.zones.length) {
    const zones = [...currentGrade.value.zones]
    const temp = zones[index]
    zones[index] = zones[newIndex]
    zones[newIndex] = temp
    
    // Update priorities
    zones.forEach((zone, idx) => {
      zone.priority = idx + 1
    })
    
    currentGrade.value.zones = zones
  }
}

const clearAllZones = () => {
  if (confirm('Are you sure you want to clear all zones?')) {
    currentGrade.value.zones = []
    selectedZone.value = null
  }
}

const addZoneManually = () => {
  const newZone = {
    id: `zone_${Date.now()}`,
    name: `Zone ${(currentGrade.value.zones?.length || 0) + 1}`,
    x: 50,
    y: 50,
    width: 100,
    height: 80,
    canOverlap: false,
    priority: (currentGrade.value.zones?.length || 0) + 1
  }
  
  if (!currentGrade.value.zones) {
    currentGrade.value.zones = []
  }
  currentGrade.value.zones.push(newZone)
  selectedZone.value = newZone.id
}

const applyZoneTemplate = (template) => {
  if (currentGrade.value.zones?.length > 0) {
    if (!confirm('This will replace existing zones. Continue?')) {
      return
    }
  }
  
  currentGrade.value.zones = template.zones.map((zone, index) => ({
    ...zone,
    id: `zone_${Date.now()}_${index}`,
    priority: index + 1
  }))
  
  selectedZone.value = currentGrade.value.zones[0]?.id || null
}

// Zone rule methods
const getCurrentZoneRules = () => {
  if (selectedRuleZone.value === 'overall') {
    return currentGrade.value.boardRules || {}
  }
  return currentGrade.value.zoneRules?.[selectedRuleZone.value] || {}
}

const updateZoneRules = (rules) => {
  if (selectedRuleZone.value === 'overall') {
    currentGrade.value.boardRules = { ...currentGrade.value.boardRules, ...rules }
  } else {
    if (!currentGrade.value.zoneRules) {
      currentGrade.value.zoneRules = {}
    }
    currentGrade.value.zoneRules[selectedRuleZone.value] = { 
      ...currentGrade.value.zoneRules[selectedRuleZone.value], 
      ...rules 
    }
  }
}

// Helper methods
const getFaceMethodLabel = (method) => {
  const labels = {
    good: 'Good Face',
    poor: 'Poor Face',
    both: 'Both Faces'
  }
  return labels[method] || method
}

const getFaceMethodVariant = (method) => {
  const variants = {
    good: 'default',
    poor: 'secondary',
    both: 'outline'
  }
  return variants[method] || 'secondary'
}

const getWidthMethodLabel = (method) => {
  const labels = {
    'full-wane': 'Full-wane',
    'half-wane': 'Half-wane',
    'smaller-side': 'Smaller Side'
  }
  return labels[method] || method
}

const getZoneColor = (index) => {
  const colors = [
    'bg-red-200 border-red-400',
    'bg-blue-200 border-blue-400',
    'bg-green-200 border-green-400',
    'bg-yellow-200 border-yellow-400',
    'bg-purple-200 border-purple-400',
    'bg-pink-200 border-pink-400',
    'bg-indigo-200 border-indigo-400',
    'bg-orange-200 border-orange-400'
  ]
  return colors[index % colors.length]
}

const getZoneColorHex = (index) => {
  const colors = [
    '#ef4444', '#3b82f6', '#10b981', '#f59e0b',
    '#8b5cf6', '#ec4899', '#6366f1', '#f97316'
  ]
  return colors[index % colors.length]
}

onMounted(() => {
  // Simulate loading state
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 800)
})
</script>