<template>
  <div class="w-full px-4 sm:px-6 lg:px-8 py-6">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-extrabold text-gray-900 mb-2">Shift Scheduler</h1>
      <p class="text-gray-600 mt-1">Manage work shifts and holiday schedules for optimal production coverage</p>
    </div>

    <!-- Override Schedule Button -->
    <div class="mb-6">
      <Button>
        <Calendar class="w-4 h-4 mr-2" />
        Override Schedule
      </Button>
    </div>

    <!-- Holiday Management Section -->
    <div class="bg-white rounded-lg shadow mb-8">
      <div class="px-6 py-4 border-b border-gray-200">
        <button
          @click="showHolidays = !showHolidays"
          class="flex items-center justify-between w-full text-left"
        >
          <h2 class="text-2xl font-bold text-gray-900">Holiday Management</h2>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">11 holidays configured</span>
            <ChevronDown :class="showHolidays ? 'rotate-180' : ''" class="w-4 h-4 text-gray-400 transition-transform" />
          </div>
        </button>
      </div>
      
      <div v-if="showHolidays" class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="holiday in holidays" :key="holiday.name" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div class="font-medium text-gray-900">{{ holiday.name }}</div>
              <div class="text-sm text-gray-600">{{ holiday.date }}</div>
            </div>
            <button class="text-gray-400 hover:text-gray-600">
              <Edit class="w-4 h-4" />
            </button>
          </div>
        </div>
        <button class="mt-4 text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center">
          <Plus class="w-4 h-4 mr-1" />
          Add Holiday
        </button>
      </div>
    </div>

    <!-- Weekly Schedule -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Weekly Schedule</h2>
      </div>
      
      <div class="p-6">
        <div class="grid grid-cols-7 gap-4">
          <!-- Monday -->
          <div class="text-center">
            <div class="font-medium text-gray-900 mb-4">Monday</div>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-32 flex flex-col items-center justify-center">
              <div class="text-gray-500 text-sm mb-3">No shifts scheduled</div>
              <Button size="sm">
                Add Shift
              </Button>
            </div>
          </div>

          <!-- Tuesday -->
          <div class="text-center">
            <div class="font-medium text-gray-900 mb-4">Tuesday</div>
            <div class="space-y-2">
              <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <div class="text-sm font-medium text-emerald-900">Morning Shift</div>
                <div class="text-xs text-emerald-700">7:00 AM - 3:00 PM</div>
                <div class="text-xs text-emerald-600 mt-1">John Smith (Lead)</div>
              </div>
              <button class="w-full text-emerald-600 hover:text-emerald-700 text-sm font-medium">+ Add Shift</button>
            </div>
          </div>

          <!-- Wednesday -->
          <div class="text-center">
            <div class="font-medium text-gray-900 mb-4">Wednesday</div>
            <div class="space-y-2">
              <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <div class="text-sm font-medium text-emerald-900">Morning Shift</div>
                <div class="text-xs text-emerald-700">7:00 AM - 3:00 PM</div>
                <div class="text-xs text-emerald-600 mt-1">Sarah Johnson</div>
              </div>
              <div class="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div class="text-sm font-medium text-orange-900">Afternoon Shift</div>
                <div class="text-xs text-orange-700">3:00 PM - 11:00 PM</div>
                <div class="text-xs text-orange-600 mt-1">Mike Davis</div>
              </div>
              <button class="w-full text-emerald-600 hover:text-emerald-700 text-sm font-medium">+ Add Shift</button>
            </div>
          </div>

          <!-- Thursday -->
          <div class="text-center">
            <div class="font-medium text-gray-900 mb-4">Thursday</div>
            <div class="space-y-2">
              <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <div class="text-sm font-medium text-emerald-900">Morning Shift</div>
                <div class="text-xs text-emerald-700">7:00 AM - 3:00 PM</div>
                <div class="text-xs text-emerald-600 mt-1">Robert Chen</div>
              </div>
              <button class="w-full text-emerald-600 hover:text-emerald-700 text-sm font-medium">+ Add Shift</button>
            </div>
          </div>

          <!-- Friday -->
          <div class="text-center">
            <div class="font-medium text-gray-900 mb-4">Friday</div>
            <div class="space-y-2">
              <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <div class="text-sm font-medium text-emerald-900">Morning Shift</div>
                <div class="text-xs text-emerald-700">7:00 AM - 3:00 PM</div>
                <div class="text-xs text-emerald-600 mt-1">Emily Wilson</div>
              </div>
              <div class="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div class="text-sm font-medium text-orange-900">Afternoon Shift</div>
                <div class="text-xs text-orange-700">3:00 PM - 11:00 PM</div>
                <div class="text-xs text-orange-600 mt-1">John Smith</div>
              </div>
              <button class="w-full text-emerald-600 hover:text-emerald-700 text-sm font-medium">+ Add Shift</button>
            </div>
          </div>

          <!-- Saturday -->
          <div class="text-center">
            <div class="font-medium text-gray-900 mb-4">Saturday</div>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-32 flex flex-col items-center justify-center">
              <div class="text-gray-500 text-sm mb-3">Weekend - No shifts</div>
              <Button size="sm">
                Add Shift
              </Button>
            </div>
          </div>

          <!-- Sunday -->
          <div class="text-center">
            <div class="font-medium text-gray-900 mb-4">Sunday</div>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-32 flex flex-col items-center justify-center">
              <div class="text-gray-500 text-sm mb-3">Weekend - No shifts</div>
              <Button size="sm">
                Add Shift
              </Button>
            </div>
          </div>
        </div>

        <!-- Central Add Shift Button for Monday -->
        <div class="mt-6 text-center">
          <Button>
            Add Shift for Monday
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Calendar, ChevronDown, Edit, Plus } from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'

const showHolidays = ref(false)

const holidays = ref([
  { name: 'New Year\'s Day', date: 'January 1, 2025' },
  { name: 'Martin Luther King Jr. Day', date: 'January 20, 2025' },
  { name: 'Presidents\' Day', date: 'February 17, 2025' },
  { name: 'Memorial Day', date: 'May 26, 2025' },
  { name: 'Independence Day', date: 'July 4, 2025' },
  { name: 'Labor Day', date: 'September 1, 2025' },
  { name: 'Columbus Day', date: 'October 13, 2025' },
  { name: 'Veterans Day', date: 'November 11, 2025' },
  { name: 'Thanksgiving', date: 'November 27, 2025' },
  { name: 'Christmas Eve', date: 'December 24, 2025' },
  { name: 'Christmas Day', date: 'December 25, 2025' }
])
</script>