import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GradeTable from '@/components/grade/GradeTable.vue'
import type { Grade } from '@/stores/grades'

// Mock Lucide icons
vi.mock('lucide-vue-next', () => ({
  Package: { name: 'Package', template: '<div />' },
  Edit: { name: 'Edit', template: '<div />' },
  Copy: { name: 'Copy', template: '<div />' }
}))

describe('GradeTable', () => {
  const mockGrades: Grade[] = [
    {
      id: 1,
      name: 'Test Grade 1',
      type: 'Hardwood',
      species: 'Oak',
      description: 'Test description 1',
      keySpecs: ['Min width: 4 inches'],
      usageCount: 10,
      color: 'emerald',
      isCustom: false
    },
    {
      id: 2,
      name: 'Test Grade 2',
      type: 'Custom',
      species: 'Pine',
      description: 'Test description 2',
      keySpecs: ['Min width: 3 inches'],
      usageCount: 0,
      color: 'blue',
      isCustom: true
    }
  ]

  it('renders table with grades', () => {
    const wrapper = mount(GradeTable, {
      props: {
        grades: mockGrades
      }
    })

    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  it('displays grade information correctly', () => {
    const wrapper = mount(GradeTable, {
      props: {
        grades: mockGrades
      }
    })

    const firstRow = wrapper.find('tbody tr:first-child')
    
    expect(firstRow.text()).toContain('Test Grade 1')
    expect(firstRow.text()).toContain('Oak')
    expect(firstRow.text()).toContain('Test description 1')
    expect(firstRow.text()).toContain('10orders')
  })

  it('shows custom grade badge', () => {
    const wrapper = mount(GradeTable, {
      props: {
        grades: mockGrades
      }
    })

    const secondRow = wrapper.find('tbody tr:nth-child(2)')
    expect(secondRow.text()).toContain('Custom Grade')
  })

  it('applies correct type styling', () => {
    const wrapper = mount(GradeTable, {
      props: {
        grades: mockGrades
      }
    })

    const hardwoodBadge = wrapper.find('.bg-green-100')
    const customBadge = wrapper.find('.bg-purple-100')
    
    expect(hardwoodBadge.text()).toBe('Hardwood')
    expect(customBadge.text()).toBe('Custom')
  })

  it('emits view-grade event on row click', async () => {
    const wrapper = mount(GradeTable, {
      props: {
        grades: mockGrades
      }
    })

    const firstRow = wrapper.find('tbody tr:first-child')
    await firstRow.trigger('click')

    expect(wrapper.emitted('view-grade')).toBeTruthy()
    expect(wrapper.emitted('view-grade')![0]).toEqual([mockGrades[0]])
  })

  it('emits edit-grade event on edit button click', async () => {
    const wrapper = mount(GradeTable, {
      props: {
        grades: mockGrades
      }
    })

    const editButton = wrapper.find('button[title="Edit Grade"]')
    await editButton.trigger('click')

    expect(wrapper.emitted('edit-grade')).toBeTruthy()
    expect(wrapper.emitted('edit-grade')![0]).toEqual([mockGrades[0]])
  })

  it('emits duplicate-grade event on duplicate button click', async () => {
    const wrapper = mount(GradeTable, {
      props: {
        grades: mockGrades
      }
    })

    const duplicateButton = wrapper.find('button[title="Duplicate"]')
    await duplicateButton.trigger('click')

    expect(wrapper.emitted('duplicate-grade')).toBeTruthy()
    expect(wrapper.emitted('duplicate-grade')![0]).toEqual([mockGrades[0]])
  })

  it('displays "Never" for unused grades', () => {
    const unusedGrade = [{
      ...mockGrades[1],
      usageCount: 0
    }]

    const wrapper = mount(GradeTable, {
      props: {
        grades: unusedGrade
      }
    })

    expect(wrapper.text()).toContain('Never')
  })

  it('handles empty grades array', () => {
    const wrapper = mount(GradeTable, {
      props: {
        grades: []
      }
    })

    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.findAll('tbody tr')).toHaveLength(0)
  })
})