import { ref, type Ref } from 'vue'

export interface Grade {
  id: number
  name: string
  type: 'Hardwood' | 'Softwood' | 'Custom'
  species: string
  description: string
  keySpecs: string[]
  usageCount: number
  color: 'emerald' | 'blue' | 'yellow' | 'orange'
  isCustom: boolean
}

export interface GradeFormData {
  name: string
  type: string
  description: string
  species?: string
  specifications: {
    minWidth: string
    minLength: string
    clearFace: string
    maxDefects: string
  }
}

interface UseGradeDataReturn {
  gradeCards: Ref<Grade[]>
  createGrade: (gradeData: GradeFormData) => Grade
  updateGrade: (gradeId: number, gradeData: GradeFormData) => Grade | null
  deleteGrade: (gradeId: number) => Grade | null
  duplicateGrade: (grade: Grade) => Grade
}

export function useGradeData(): UseGradeDataReturn {
  const gradeCards = ref<Grade[]>([
    {
      id: 1,
      name: 'FAS (First and Seconds)',
      type: 'Hardwood',
      species: 'Red Oak',
      description: 'Highest grade with 83.3% clear face cuttings',
      keySpecs: [
        'Min width: 6 inches',
        'Min length: 8 feet',
        'Clear face: 83.3%',
        'Max defects: Minimal'
      ],
      usageCount: 24,
      color: 'emerald',
      isCustom: false
    },
    {
      id: 2,
      name: 'Select & Better',
      type: 'Hardwood',
      species: 'White Oak',
      description: 'High quality grade combining FAS and Select',
      keySpecs: [
        'Min width: 4 inches',
        'Min length: 6 feet',
        'Clear face: 83.3%',
        'Good for staining'
      ],
      usageCount: 18,
      color: 'blue',
      isCustom: false
    },
    {
      id: 3,
      name: 'No.1 Common',
      type: 'Hardwood',
      species: 'Soft Maple',
      description: 'Good grade suitable for most applications',
      keySpecs: [
        'Min width: 3 inches',
        'Min length: 4 feet',
        'Clear face: 66.7%',
        'Paint grade quality'
      ],
      usageCount: 32,
      color: 'yellow',
      isCustom: false
    },
    {
      id: 4,
      name: 'No.2A Common',
      type: 'Hardwood',
      species: 'Cherry',
      description: 'Economy grade with character marks',
      keySpecs: [
        'Min width: 3 inches',
        'Min length: 4 feet',
        'Clear face: 50%',
        'Rustic appearance'
      ],
      usageCount: 15,
      color: 'orange',
      isCustom: false
    }
  ])

  const createGrade = (gradeData: GradeFormData): Grade => {
    const newGrade: Grade = {
      id: Date.now(),
      name: gradeData.name,
      type: gradeData.type as Grade['type'],
      description: gradeData.description,
      keySpecs: [
        `Min width: ${gradeData.specifications.minWidth} inches`,
        `Min length: ${gradeData.specifications.minLength} feet`,
        `Clear face: ${gradeData.specifications.clearFace}%`,
        `Max defects: ${gradeData.specifications.maxDefects}`
      ],
      usageCount: 0,
      color: 'emerald',
      isCustom: gradeData.type === 'Custom',
      species: gradeData.species || 'Mixed'
    }
    gradeCards.value.push(newGrade)
    return newGrade
  }

  const updateGrade = (gradeId: number, gradeData: GradeFormData): Grade | null => {
    const gradeIndex = gradeCards.value.findIndex(g => g.id === gradeId)
    if (gradeIndex !== -1) {
      gradeCards.value[gradeIndex] = {
        ...gradeCards.value[gradeIndex],
        name: gradeData.name,
        type: gradeData.type as Grade['type'],
        description: gradeData.description,
        keySpecs: [
          `Min width: ${gradeData.specifications.minWidth} inches`,
          `Min length: ${gradeData.specifications.minLength} feet`,
          `Clear face: ${gradeData.specifications.clearFace}%`,
          `Max defects: ${gradeData.specifications.maxDefects}`
        ]
      }
      return gradeCards.value[gradeIndex]
    }
    return null
  }

  const deleteGrade = (gradeId: number): Grade | null => {
    const gradeIndex = gradeCards.value.findIndex(g => g.id === gradeId)
    if (gradeIndex !== -1) {
      const deletedGrade = gradeCards.value[gradeIndex]
      gradeCards.value.splice(gradeIndex, 1)
      return deletedGrade
    }
    return null
  }

  const duplicateGrade = (grade: Grade): Grade => {
    const duplicatedGrade: Grade = {
      ...grade,
      id: Date.now(),
      name: `${grade.name} (Copy)`,
      usageCount: 0
    }
    gradeCards.value.push(duplicatedGrade)
    return duplicatedGrade
  }

  return {
    gradeCards,
    createGrade,
    updateGrade,
    deleteGrade,
    duplicateGrade
  }
}