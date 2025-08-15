<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div class="px-6 py-4">
        <h1 class="text-2xl font-bold text-gray-900">UI Component Test Page</h1>
        <p class="text-sm text-gray-600 mt-1">Test and preview all UI components in isolation</p>
      </div>
    </div>

    <!-- Component Sections -->
    <div class="container mx-auto px-6 py-8 space-y-12">
      
      <!-- Buttons Section -->
      <section class="bg-white rounded-lg p-6 shadow">
        <h2 class="text-xl font-semibold mb-4 pb-2 border-b">Buttons</h2>
        <div class="space-y-4">
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Primary Buttons</h3>
            <div class="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="default">
                <Plus class="w-4 h-4 mr-2" />
                With Icon
              </Button>
              <Button disabled>Disabled</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Secondary Buttons</h3>
            <div class="flex flex-wrap gap-2">
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="secondary">Secondary</Button>
            </div>
          </div>
        </div>
      </section>

      <!-- Cards Section -->
      <section class="bg-white rounded-lg p-6 shadow">
        <h2 class="text-xl font-semibold mb-4 pb-2 border-b">Cards</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content with some text</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                <Activity class="w-5 h-5 inline-block mr-2" />
                With Icon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">€1,234.56</div>
              <p class="text-sm text-gray-600">Total Value</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <!-- Form Controls Section -->
      <section class="bg-white rounded-lg p-6 shadow">
        <h2 class="text-xl font-semibold mb-4 pb-2 border-b">Form Controls</h2>
        <div class="space-y-4 max-w-md">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Input</label>
            <input 
              type="text" 
              placeholder="Enter text..." 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Select</label>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Checkbox</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="checkbox" class="mr-2" checked />
                <span>Option 1</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-2" />
                <span>Option 2</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <!-- Badge Section -->
      <section class="bg-white rounded-lg p-6 shadow">
        <h2 class="text-xl font-semibold mb-4 pb-2 border-b">Badges</h2>
        <div class="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge class="bg-emerald-100 text-emerald-800">Custom Color</Badge>
        </div>
      </section>

      <!-- Dialog/Modal Section -->
      <section class="bg-white rounded-lg p-6 shadow">
        <h2 class="text-xl font-semibold mb-4 pb-2 border-b">Dialogs & Modals</h2>
        <div class="space-x-2">
          <Button @click="showDialog = true">Open Dialog</Button>
          <Button @click="showSheet = true">Open Sheet</Button>
        </div>
        
        <!-- Dialog -->
        <Dialog v-model:open="showDialog">
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sample Dialog</DialogTitle>
              <DialogDescription>
                This is a sample dialog for testing purposes.
              </DialogDescription>
            </DialogHeader>
            <div class="py-4">
              <p>Dialog content goes here...</p>
            </div>
            <DialogFooter>
              <Button variant="outline" @click="showDialog = false">Cancel</Button>
              <Button @click="showDialog = false">Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <!-- Sheet -->
        <Sheet v-model:open="showSheet">
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sample Sheet</SheetTitle>
              <SheetDescription>
                This slides in from the side
              </SheetDescription>
            </SheetHeader>
            <div class="py-4">
              <p>Sheet content goes here...</p>
            </div>
          </SheetContent>
        </Sheet>
      </section>

      <!-- Alert Section -->
      <section class="bg-white rounded-lg p-6 shadow">
        <h2 class="text-xl font-semibold mb-4 pb-2 border-b">Alerts</h2>
        <div class="space-y-3">
          <Alert>
            <AlertCircle class="h-4 w-4" />
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>This is a default alert message.</AlertDescription>
          </Alert>
          
          <Alert variant="destructive">
            <AlertTriangle class="h-4 w-4" />
            <AlertTitle>Error Alert</AlertTitle>
            <AlertDescription>Something went wrong!</AlertDescription>
          </Alert>
          
          <Alert class="border-emerald-200 bg-emerald-50">
            <CheckCircle class="h-4 w-4 text-emerald-600" />
            <AlertTitle class="text-emerald-800">Success Alert</AlertTitle>
            <AlertDescription class="text-emerald-700">Operation completed successfully!</AlertDescription>
          </Alert>
        </div>
      </section>

      <!-- Loading States Section -->
      <section class="bg-white rounded-lg p-6 shadow">
        <h2 class="text-xl font-semibold mb-4 pb-2 border-b">Loading States</h2>
        <div class="space-y-4">
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Spinner</h3>
            <div class="flex items-center gap-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
            </div>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Skeleton</h3>
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Table Section -->
      <section class="bg-white rounded-lg p-6 shadow">
        <h2 class="text-xl font-semibold mb-4 pb-2 border-b">Table</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="i in 3" :key="i">
                <td class="px-6 py-4 whitespace-nowrap">User {{ i }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Badge :variant="i === 1 ? 'default' : 'secondary'">
                    {{ i === 1 ? 'Active' : 'Inactive' }}
                  </Badge>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">Admin</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Colors Section -->
      <section class="bg-white rounded-lg p-6 shadow">
        <h2 class="text-xl font-semibold mb-4 pb-2 border-b">Color Palette</h2>
        <div class="space-y-4">
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Primary Colors (Emerald)</h3>
            <div class="flex gap-2">
              <div class="text-center">
                <div class="w-20 h-20 bg-emerald-50 rounded"></div>
                <span class="text-xs">50</span>
              </div>
              <div class="text-center">
                <div class="w-20 h-20 bg-emerald-100 rounded"></div>
                <span class="text-xs">100</span>
              </div>
              <div class="text-center">
                <div class="w-20 h-20 bg-emerald-200 rounded"></div>
                <span class="text-xs">200</span>
              </div>
              <div class="text-center">
                <div class="w-20 h-20 bg-emerald-500 rounded"></div>
                <span class="text-xs">500</span>
              </div>
              <div class="text-center">
                <div class="w-20 h-20 bg-emerald-600 rounded"></div>
                <span class="text-xs">600</span>
              </div>
              <div class="text-center">
                <div class="w-20 h-20 bg-emerald-700 rounded"></div>
                <span class="text-xs">700</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Semantic Colors</h3>
            <div class="flex gap-2">
              <div class="text-center">
                <div class="w-20 h-20 bg-red-500 rounded"></div>
                <span class="text-xs">Error/Defect</span>
              </div>
              <div class="text-center">
                <div class="w-20 h-20 bg-green-500 rounded"></div>
                <span class="text-xs">Success/Money</span>
              </div>
              <div class="text-center">
                <div class="w-20 h-20 bg-yellow-500 rounded"></div>
                <span class="text-xs">Warning</span>
              </div>
              <div class="text-center">
                <div class="w-20 h-20 bg-blue-500 rounded"></div>
                <span class="text-xs">Info</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Icons Section -->
      <section class="bg-white rounded-lg p-6 shadow">
        <h2 class="text-xl font-semibold mb-4 pb-2 border-b">Icons (Lucide)</h2>
        <div class="grid grid-cols-8 gap-4">
          <div class="text-center">
            <Trees class="w-6 h-6 mx-auto mb-1" />
            <span class="text-xs">Trees</span>
          </div>
          <div class="text-center">
            <Droplets class="w-6 h-6 mx-auto mb-1" />
            <span class="text-xs">Droplets</span>
          </div>
          <div class="text-center">
            <Package class="w-6 h-6 mx-auto mb-1" />
            <span class="text-xs">Package</span>
          </div>
          <div class="text-center">
            <Activity class="w-6 h-6 mx-auto mb-1" />
            <span class="text-xs">Activity</span>
          </div>
          <div class="text-center">
            <Eye class="w-6 h-6 mx-auto mb-1" />
            <span class="text-xs">Eye</span>
          </div>
          <div class="text-center">
            <EyeOff class="w-6 h-6 mx-auto mb-1" />
            <span class="text-xs">EyeOff</span>
          </div>
          <div class="text-center">
            <Settings class="w-6 h-6 mx-auto mb-1" />
            <span class="text-xs">Settings</span>
          </div>
          <div class="text-center">
            <Search class="w-6 h-6 mx-auto mb-1" />
            <span class="text-xs">Search</span>
          </div>
        </div>
      </section>

      <!-- Custom Board Components -->
      <section class="bg-white rounded-lg p-6 shadow">
        <h2 class="text-xl font-semibold mb-4 pb-2 border-b">Custom Components</h2>
        
        <div class="space-y-6">
          <!-- KPI Card Example -->
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">KPI Cards</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-white rounded-lg p-4 border border-gray-200">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs text-gray-600">Length</span>
                  <Ruler class="w-4 h-4 text-gray-400" />
                </div>
                <div class="text-lg font-semibold">245.5 cm</div>
              </div>
              
              <div class="bg-white rounded-lg p-4 border border-gray-200">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs text-gray-600">Value</span>
                  <Activity class="w-4 h-4 text-green-500" />
                </div>
                <div class="text-lg font-semibold text-green-600">€125.50</div>
              </div>
              
              <div class="bg-white rounded-lg p-4 border border-gray-200">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs text-gray-600">Defects</span>
                  <AlertCircle class="w-4 h-4 text-red-500" />
                </div>
                <div class="text-lg font-semibold text-red-600">3</div>
              </div>
              
              <div class="bg-white rounded-lg p-4 border border-gray-200">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs text-gray-600">Grade</span>
                  <Package class="w-4 h-4 text-gray-400" />
                </div>
                <div class="text-lg font-semibold">AW</div>
              </div>
            </div>
          </div>

          <!-- Toggle Buttons -->
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Toggle Actions</h3>
            <div class="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                @click="toggleStates.defects = !toggleStates.defects"
                :class="toggleStates.defects ? 'bg-gray-100' : ''"
              >
                <EyeOff v-if="toggleStates.defects" class="w-4 h-4 mr-2" />
                <Eye v-else class="w-4 h-4 mr-2" />
                {{ toggleStates.defects ? 'Hide' : 'Show' }} Minor Defects
              </Button>
              
              <Button 
                variant="outline"
                @click="toggleStates.usableArea = !toggleStates.usableArea"
                :class="toggleStates.usableArea ? 'bg-emerald-50 border-emerald-300' : ''"
              >
                <Maximize2 class="w-4 h-4 mr-2" />
                {{ toggleStates.usableArea ? 'Hide' : 'Show' }} Usable Area
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  Plus, Trees, Droplets, Package, Activity, Eye, EyeOff, 
  Settings, Search, AlertCircle, AlertTriangle, CheckCircle,
  Maximize2, Ruler
} from 'lucide-vue-next'

// UI Components
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import CardHeader from '@/components/ui/card-header.vue'
import CardTitle from '@/components/ui/card-title.vue'
import CardDescription from '@/components/ui/card-description.vue'
import CardContent from '@/components/ui/card-content.vue'
import Badge from '@/components/ui/badge.vue'
import Alert from '@/components/ui/alert.vue'
import AlertTitle from '@/components/ui/alert-title.vue'
import AlertDescription from '@/components/ui/alert-description.vue'
import Dialog from '@/components/ui/dialog.vue'
import DialogContent from '@/components/ui/dialog-content.vue'
import DialogHeader from '@/components/ui/dialog-header.vue'
import DialogTitle from '@/components/ui/dialog-title.vue'
import DialogDescription from '@/components/ui/dialog-description.vue'
import DialogFooter from '@/components/ui/dialog-footer.vue'
import Sheet from '@/components/ui/sheet.vue'
import SheetContent from '@/components/ui/sheet-content.vue'
import SheetHeader from '@/components/ui/sheet-header.vue'
import SheetTitle from '@/components/ui/sheet-title.vue'
import SheetDescription from '@/components/ui/sheet-description.vue'

// State
const showDialog = ref(false)
const showSheet = ref(false)
const toggleStates = ref({
  defects: false,
  usableArea: false
})
</script>

<style scoped>
/* Any custom styles for the test page */
</style>