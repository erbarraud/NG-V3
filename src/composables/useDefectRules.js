import { ref, computed } from 'vue'

export function useDefectRules() {
  const defectRules = ref({
    knots: [
      { id: 'sound-knots', name: 'Sound Knots', enabled: false, metric: '', aggregationMethod: '', limitValue: '', referenceType: '' },
      { id: 'unsound-knots', name: 'Unsound Knots', enabled: false, metric: '', aggregationMethod: '', limitValue: '', referenceType: '' },
      { id: 'pin-knots', name: 'Pin Knots', enabled: false, metric: '', aggregationMethod: '', limitValue: '', referenceType: '' },
      { id: 'traversing-knots', name: 'Traversing Knots', enabled: false, metric: '', aggregationMethod: '', limitValue: '', referenceType: '' }
    ],
    cracks: [
      { id: 'splits', name: 'Splits', enabled: false, metric: '', aggregationMethod: '', limitValue: '', referenceType: '' },
      { id: 'checks', name: 'Checks', enabled: false, metric: '', aggregationMethod: '', limitValue: '', referenceType: '' },
      { id: 'shakes', name: 'Shakes', enabled: false, metric: '', aggregationMethod: '', limitValue: '', referenceType: '' }
    ],
    surface: [
      { id: 'light-stain', name: 'Light Stain', enabled: false, metric: '', aggregationMethod: '', limitValue: '', referenceType: '' },
      { id: 'stain', name: 'Stain', enabled: false, metric: '', aggregationMethod: '', limitValue: '', referenceType: '' },
      { id: 'skip-marks', name: 'Skip Marks', enabled: false, metric: '', aggregationMethod: '', limitValue: '', referenceType: '' },
      { id: 'einlauf-stain', name: 'Einlauf Stain', enabled: false, metric: '', aggregationMethod: '', limitValue: '', referenceType: '' }
    ],
    holes: [
      { id: 'insect-holes', name: 'Insect Holes', enabled: false, metric: '', aggregationMethod: '', limitValue: '', referenceType: '' },
      { id: 'general-holes', name: 'General Holes', enabled: false, metric: '', aggregationMethod: '', limitValue: '', referenceType: '' }
    ],
    other: [
      { id: 'wane', name: 'Wane', enabled: false, metric: '', aggregationMethod: '', limitValue: '', referenceType: '' },
      { id: 'decay', name: 'Decay', enabled: false, metric: '', aggregationMethod: '', limitValue: '', referenceType: '' },
      { id: 'black-mold', name: 'Black Mold', enabled: false, metric: '', aggregationMethod: '', limitValue: '', referenceType: '' },
      { id: 'green-mold', name: 'Green Mold', enabled: false, metric: '', aggregationMethod: '', limitValue: '', referenceType: '' },
      { id: 'pith', name: 'Pith', enabled: false, metric: '', aggregationMethod: '', limitValue: '', referenceType: '' },
      { id: 'manufacturing-errors', name: 'Manufacturing Errors', enabled: false, metric: '', aggregationMethod: '', limitValue: '', referenceType: '' },
      { id: 'bark', name: 'Bark', enabled: false, metric: '', aggregationMethod: '', limitValue: '', referenceType: '' }
    ]
  })

  const getUnitForMetric = (metric) => {
    const units = {
      diameter: 'mm',
      length: 'mm',
      area: 'cm²',
      count: 'count',
      presence: '%'
    }
    return units[metric] || '-'
  }

  const getCurrentCategoryDefects = (category = 'knots') => {
    return defectRules.value[category] || []
  }

  const getEnabledDefectsCount = () => {
    let count = 0
    Object.values(defectRules.value).forEach(category => {
      category.forEach(defect => {
        if (defect.enabled) count++
      })
    })
    return count
  }

  return {
    defectRules,
    getUnitForMetric,
    getCurrentCategoryDefects,
    getEnabledDefectsCount
  }
}