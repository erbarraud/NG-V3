import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BarChart from '@/components/charts/BarChart.vue'

// Mock Chart.js components
vi.mock('vue-chartjs', () => ({
  Bar: {
    name: 'Bar',
    template: '<div data-testid="bar-chart"></div>',
    props: ['data', 'options']
  }
}))

vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn()
  },
  CategoryScale: {},
  LinearScale: {},
  BarElement: {},
  Title: {},
  Tooltip: {},
  Legend: {}
}))

describe('BarChart', () => {
  const mockChartData = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Test Data',
        data: [10, 20, 30],
        backgroundColor: '#059669'
      }
    ]
  }

  it('renders chart with default props', () => {
    const wrapper = mount(BarChart, {
      props: {
        data: mockChartData
      }
    })

    expect(wrapper.find('[data-testid="bar-chart"]').exists()).toBe(true)
    expect(wrapper.find('.chart-container').attributes('style')).toContain('height: 300px')
  })

  it('applies custom height', () => {
    const wrapper = mount(BarChart, {
      props: {
        data: mockChartData,
        height: '400px'
      }
    })

    expect(wrapper.find('.chart-container').attributes('style')).toContain('height: 400px')
  })

  it('passes data to Bar component', () => {
    const wrapper = mount(BarChart, {
      props: {
        data: mockChartData
      }
    })

    const barComponent = wrapper.findComponent({ name: 'Bar' })
    expect(barComponent.props('data')).toEqual(mockChartData)
  })

  it('merges custom options with defaults', () => {
    const customOptions = {
      plugins: {
        legend: {
          display: false
        }
      }
    }

    const wrapper = mount(BarChart, {
      props: {
        data: mockChartData,
        options: customOptions
      }
    })

    const barComponent = wrapper.findComponent({ name: 'Bar' })
    const passedOptions = barComponent.props('options')
    
    expect(passedOptions.plugins.legend.display).toBe(false)
    expect(passedOptions.responsive).toBe(true) // Default option should still be there
  })
})