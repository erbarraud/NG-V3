import { ref, computed } from 'vue'

export function useGradeForm() {
  const gradeForm = ref({
    // Basic Information
    name: '',
    description: '',
    valuePerUnit: '',
    species: [],
    faceGradingOption: 'both-faces',
    
    // Board-Level Rules
    boardRules: {
      maxBow: '',
      maxCup: '',
      maxCrook: '',
      maxTwist: '',
      minLength: '',
      minWidth: '',
      minThickness: '',
      maxThickness: '',
      widthMeasurementMethod: ''
    },
    
    // Defect Configuration
    defects: {},
    
    // Zone-Based Rules
    zones: [],
    
    // Clustering Rules
    clustering: {
      enabled: false,
      distance: 50,
      clusterableDefects: []
    },
    
    // Cutting/Reduction Strategy
    cuttingStrategy: {
      method: 'none',
      minYield: 66,
      reductions: {
        maxNumber: '',
        minDistanceBetween: '',
        minDistanceToEdge: '',
        maxSize: '',
        dynamicShape: false
      },
      cuttings: {
        minLength: '',
        minWidth: '',
        maxNumber: ''
      }
    }
  })

  const validationErrors = ref({})

  const isFormValid = computed(() => {
    return gradeForm.value.name.trim() !== '' && 
           gradeForm.value.species.length > 0 &&
           gradeForm.value.faceGradingOption !== ''
  })

  const resetForm = () => {
    gradeForm.value = {
      name: '',
      description: '',
      valuePerUnit: '',
      species: [],
      faceGradingOption: 'both-faces',
      boardRules: {
        maxBow: '',
        maxCup: '',
        maxCrook: '',
        maxTwist: '',
        minLength: '',
        minWidth: '',
        minThickness: '',
        maxThickness: '',
        widthMeasurementMethod: ''
      },
      defects: {},
      zones: [],
      clustering: {
        enabled: false,
        distance: 50,
        clusterableDefects: []
      },
      cuttingStrategy: {
        method: 'none',
        minYield: 66,
        reductions: {
          maxNumber: '',
          minDistanceBetween: '',
          minDistanceToEdge: '',
          maxSize: '',
          dynamicShape: false
        },
        cuttings: {
          minLength: '',
          minWidth: '',
          maxNumber: ''
        }
      }
    }
    validationErrors.value = {}
  }

  return {
    gradeForm,
    validationErrors,
    isFormValid,
    resetForm
  }
}