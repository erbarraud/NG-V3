<template>
  <div class="chart-container" :style="{ height: height }">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions
} from 'chart.js'

// Register only the Chart.js components we need
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface Props {
  data: ChartData<'bar'>
  options?: ChartOptions<'bar'>
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '300px',
  options: () => ({})
})

const chartData = computed(() => props.data)

const defaultOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
      grid: {
        color: '#f1f5f9',
        drawBorder: false
      },
      ticks: {
        color: '#6b7280',
        font: {
          size: 12
        }
      }
    },
    y: {
      stacked: true,
      grid: {
        color: '#f1f5f9',
        drawBorder: false
      },
      ticks: {
        color: '#6b7280',
        font: {
          size: 12
        }
      }
    }
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: '#6b7280',
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#e2e8f0',
      borderWidth: 1
    }
  }
}

const chartOptions = computed(() => ({
  ...defaultOptions,
  ...props.options
}))
</script>

<style scoped>
.chart-container {
  position: relative;
}
</style>