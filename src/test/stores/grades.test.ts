import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGradeStore, type GradeFormData } from '@/stores/grades'

describe('Grade Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('should have default grades', () => {
      const store = useGradeStore()
      
      expect(store.grades).toHaveLength(4)
      expect(store.grades[0].name).toBe('FAS (First and Seconds)')
      expect(store.totalGrades).toBe(4)
    })

    it('should have correct computed properties', () => {
      const store = useGradeStore()
      
      expect(store.customGrades).toEqual([])
      expect(store.standardGrades).toHaveLength(4)
      expect(store.mostUsedGrade.name).toBe('No.1 Common')
      expect(store.mostUsedGrade.usageCount).toBe(32)
    })
  })

  describe('createGrade', () => {
    it('should create a new grade', () => {
      const store = useGradeStore()
      const initialCount = store.grades.length

      const gradeData: GradeFormData = {
        name: 'Test Grade',
        type: 'Custom',
        description: 'Test description',
        species: 'Test Species',
        specifications: {
          minWidth: '4',
          minLength: '6',
          clearFace: '75',
          maxDefects: 'Low'
        }
      }

      const newGrade = store.createGrade(gradeData)

      expect(store.grades).toHaveLength(initialCount + 1)
      expect(newGrade.name).toBe('Test Grade')
      expect(newGrade.isCustom).toBe(true)
      expect(newGrade.species).toBe('Test Species')
      expect(newGrade.usageCount).toBe(0)
    })

    it('should handle missing species', () => {
      const store = useGradeStore()
      
      const gradeData: GradeFormData = {
        name: 'Test Grade',
        type: 'Hardwood',
        description: 'Test description',
        specifications: {
          minWidth: '4',
          minLength: '6',
          clearFace: '75',
          maxDefects: 'Low'
        }
      }

      const newGrade = store.createGrade(gradeData)
      expect(newGrade.species).toBe('Mixed')
    })
  })

  describe('updateGrade', () => {
    it('should update existing grade', () => {
      const store = useGradeStore()
      const gradeId = store.grades[0].id

      const updateData: GradeFormData = {
        name: 'Updated Grade',
        type: 'Hardwood',
        description: 'Updated description',
        specifications: {
          minWidth: '5',
          minLength: '7',
          clearFace: '80',
          maxDefects: 'Minimal'
        }
      }

      const updatedGrade = store.updateGrade(gradeId, updateData)

      expect(updatedGrade).not.toBeNull()
      expect(updatedGrade!.name).toBe('Updated Grade')
      expect(updatedGrade!.description).toBe('Updated description')
    })

    it('should return null for non-existent grade', () => {
      const store = useGradeStore()
      
      const updateData: GradeFormData = {
        name: 'Updated Grade',
        type: 'Hardwood', 
        description: 'Updated description',
        specifications: {
          minWidth: '5',
          minLength: '7',
          clearFace: '80',
          maxDefects: 'Minimal'
        }
      }

      const result = store.updateGrade(999999, updateData)
      expect(result).toBeNull()
    })
  })

  describe('deleteGrade', () => {
    it('should delete existing grade', () => {
      const store = useGradeStore()
      const initialCount = store.grades.length
      const gradeToDelete = store.grades[0]

      const deletedGrade = store.deleteGrade(gradeToDelete.id)

      expect(store.grades).toHaveLength(initialCount - 1)
      expect(deletedGrade).toEqual(gradeToDelete)
      expect(store.getGradeById(gradeToDelete.id)).toBeUndefined()
    })

    it('should return null for non-existent grade', () => {
      const store = useGradeStore()
      const result = store.deleteGrade(999999)
      expect(result).toBeNull()
    })
  })

  describe('duplicateGrade', () => {
    it('should create duplicate with different id and name', () => {
      const store = useGradeStore()
      const originalGrade = store.grades[0]
      const initialCount = store.grades.length

      const duplicate = store.duplicateGrade(originalGrade)

      expect(store.grades).toHaveLength(initialCount + 1)
      expect(duplicate.id).not.toBe(originalGrade.id)
      expect(duplicate.name).toBe(`${originalGrade.name} (Copy)`)
      expect(duplicate.usageCount).toBe(0)
      expect(duplicate.type).toBe(originalGrade.type)
    })
  })

  describe('utility methods', () => {
    it('should increment usage count', () => {
      const store = useGradeStore()
      const grade = store.grades[0]
      const initialUsage = grade.usageCount

      store.incrementUsage(grade.id)

      expect(grade.usageCount).toBe(initialUsage + 1)
    })

    it('should find grade by id', () => {
      const store = useGradeStore()
      const grade = store.grades[0]

      const foundGrade = store.getGradeById(grade.id)
      expect(foundGrade).toEqual(grade)

      const notFoundGrade = store.getGradeById(999999)
      expect(notFoundGrade).toBeUndefined()
    })
  })
})