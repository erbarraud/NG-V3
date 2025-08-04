import { ref, computed } from 'vue'

export function useDefectRules() {
  // Define defect categories with all defects
  const defectCategories = ref({
    knots: {
      name: 'Knots',
      icon: 'mdi-circle-outline',
      defects: [
        { id: 'knot_sound', name: 'Sound Knots', enabled: false, metric: 'diameter', limitValue: 0, aggregationMethod: 'maximum', referenceType: 'fixed', clusteringEnabled: false },
        { id: 'knot_unsound', name: 'Unsound Knots', enabled: false, metric: 'diameter', limitValue: 0, aggregationMethod: 'maximum', referenceType: 'fixed', clusteringEnabled: false },
        { id: 'knot_pin', name: 'Pin Knots', enabled: false, metric: 'diameter', limitValue: 0, aggregationMethod: 'maximum', referenceType: 'fixed', clusteringEnabled: false },
        { id: 'knot_traversing', name: 'Traversing Knots', enabled: false, metric: 'diameter', limitValue: 0, aggregationMethod: 'maximum', referenceType: 'fixed', clusteringEnabled: false }
      ]
    },
    cracksAndSplits: {
      name: 'Cracks & Splits',
      icon: 'mdi-lightning-bolt',
      defects: [
        { id: 'splits', name: 'Splits', enabled: false, metric: 'length', limitValue: 0, aggregationMethod: 'sum', referenceType: 'fixed', clusteringEnabled: false },
        { id: 'checks', name: 'Checks', enabled: false, metric: 'length', limitValue: 0, aggregationMethod: 'sum', referenceType: 'fixed', clusteringEnabled: false },
        { id: 'shakes', name: 'Shakes', enabled: false, metric: 'length', limitValue: 0, aggregationMethod: 'maximum', referenceType: 'fixed', clusteringEnabled: false }
      ]
    },
    surfaceDefects: {
      name: 'Surface Defects',
      icon: 'mdi-texture',
      defects: [
        { id: 'light_stain', name: 'Light Stain', enabled: false, metric: 'area', limitValue: 0, aggregationMethod: 'sum', referenceType: 'percentBoardSurface', clusteringEnabled: false },
        { id: 'stain', name: 'Stain', enabled: false, metric: 'area', limitValue: 0, aggregationMethod: 'sum', referenceType: 'percentBoardSurface', clusteringEnabled: false },
        { id: 'skip_marks', name: 'Skip Marks', enabled: false, metric: 'width', limitValue: 0, aggregationMethod: 'sum', referenceType: 'percentBoardWidth', clusteringEnabled: false },
        { id: 'einlauf_stain', name: 'Einlauf Stain', enabled: false, metric: 'area', limitValue: 0, aggregationMethod: 'sum', referenceType: 'percentBoardSurface', clusteringEnabled: false }
      ]
    },
    holes: {
      name: 'Holes',
      icon: 'mdi-circle',
      defects: [
        { id: 'insect_holes', name: 'Insect Holes', enabled: false, metric: 'count', limitValue: 0, aggregationMethod: 'countPerLinearMeter', referenceType: 'fixed', clusteringEnabled: true },
        { id: 'general_holes', name: 'General Holes', enabled: false, metric: 'count', limitValue: 0, aggregationMethod: 'countPerLinearMeter', referenceType: 'fixed', clusteringEnabled: true }
      ]
    },
    otherDefects: {
      name: 'Other Defects',
      icon: 'mdi-alert-circle-outline',
      defects: [
        { id: 'wane', name: 'Wane', enabled: false, metric: 'length', limitValue: 0, aggregationMethod: 'maximum', referenceType: 'percentBoardWidth', clusteringEnabled: false },
        { id: 'decay', name: 'Decay', enabled: false, metric: 'area', limitValue: 0, aggregationMethod: 'sum', referenceType: 'percentBoardSurface', clusteringEnabled: false },
        { id: 'black_mold', name: 'Black Mold', enabled: false, metric: 'area', limitValue: 0, aggregationMethod: 'sum', referenceType: 'percentBoardSurface', clusteringEnabled: false },
        { id: 'green_mold', name: 'Green Mold', enabled: false, metric: 'area', limitValue: 0, aggregationMethod: 'sum', referenceType: 'percentBoardSurface', clusteringEnabled: false },
        { id: 'pith', name: 'Pith', enabled: false, metric: 'presence', limitValue: 0, aggregationMethod: 'maximum', referenceType: 'fixed', clusteringEnabled: false },
        { id: 'manufacturing_errors', name: 'Manufacturing Errors', enabled: false, metric: 'area', limitValue: 0, aggregationMethod: 'sum', referenceType: 'percentBoardSurface', clusteringEnabled: false },
        { id: 'bark', name: 'Bark', enabled: false, metric: 'area', limitValue: 0, aggregationMethod: 'sum', referenceType: 'percentBoardSurface', clusteringEnabled: false }
      ]
    }
  })

  // Get metric options based on defect type
  const getMetricOptions = (defectId) => {
    const options = [
      { title: 'Diameter', value: 'diameter' },
      { title: 'Length', value: 'length' },
      { title: 'Width', value: 'width' },
      { title: 'Area', value: 'area' },
      { title: 'Count', value: 'count' },
      { title: 'Presence', value: 'presence' }
    ]

    if (defectId.includes('knot')) {
      return options.filter(o => ['diameter', 'count', 'area'].includes(o.value))
    } else if (defectId.includes('stain') || defectId.includes('mold')) {
      return options.filter(o => ['area', 'length', 'width'].includes(o.value))
    } else if (defectId.includes('split') || defectId.includes('check') || defectId.includes('shake')) {
      return options.filter(o => ['length', 'count'].includes(o.value))
    } else if (defectId.includes('hole')) {
      return options.filter(o => ['diameter', 'count', 'area'].includes(o.value))
    } else if (defectId === 'pith') {
      return options.filter(o => o.value === 'presence')
    } else if (defectId === 'wane') {
      return options.filter(o => ['length', 'width'].includes(o.value))
    }
    return options.filter(o => ['area', 'count', 'length'].includes(o.value))
  }

  // Get unit based on metric
  const getUnitForMetric = (metric) => {
    switch(metric) {
      case 'diameter': return 'mm'
      case 'length': return 'mm'
      case 'width': return 'mm'
      case 'area': return 'cm²'
      case 'count': return 'count'
      case 'presence': return 'yes/no'
      default: return ''
    }
  }

  // Get defects for current category
  const getCurrentCategoryDefects = (categoryKey) => {
    return defectCategories.value[categoryKey]?.defects || []
  }

  // Get enabled defects count
  const getEnabledDefectsCount = () => {
    let count = 0
    Object.values(defectCategories.value).forEach(category => {
      count += category.defects.filter(d => d.enabled).length
    })
    return count
  }

  // Aggregation options
  const aggregationOptions = [
    { title: 'Maximum', value: 'maximum' },
    { title: 'Sum', value: 'sum' },
    { title: 'Average', value: 'average' },
    { title: 'Count per Linear Meter', value: 'countPerLinearMeter' }
  ]

  // Reference type options
  const referenceOptions = [
    { title: 'Fixed Value', value: 'fixed' },
    { title: '% of Board Width', value: 'percentBoardWidth' },
    { title: '% of Board Surface', value: 'percentBoardSurface' }
  ]

  // Get all defect types for clustering and zones
  const getAllDefectTypes = computed(() => {
    const allDefects = []
    Object.values(defectCategories.value).forEach(category => {
      category.defects.forEach(defect => {
        allDefects.push({
          value: defect.id,
          label: defect.name
        })
      })
    })
    return allDefects
  })

  // Get current category name
  const getCurrentCategoryName = (categoryKey) => {
    return defectCategories.value[categoryKey]?.name || ''
  }

  // Get defects for current category
  const getCurrentCategoryDefects = (categoryKey) => {
    return defectCategories.value[categoryKey]?.defects || []
  }

  // Enable all defects in a category
  const enableAllInCategory = (categoryKey) => {
    const category = defectCategories.value[categoryKey]
    if (category) {
      category.defects.forEach(defect => {
        defect.enabled = true
      })
    }
  }

  // Disable all defects in a category
  const disableAllInCategory = (categoryKey) => {
    const category = defectCategories.value[categoryKey]
    if (category) {
      category.defects.forEach(defect => {
        defect.enabled = false
      })
    }
  }

  // Enable all defects
  const enableAllDefects = () => {
    Object.keys(defectCategories.value).forEach(key => {
      enableAllInCategory(key)
    })
  }

  // Disable all defects
  const disableAllDefects = () => {
    Object.keys(defectCategories.value).forEach(key => {
      disableAllInCategory(key)
    })
  }

  // Get all enabled defects across all categories
  const getAllEnabledDefects = () => {
    const enabledDefects = []
    Object.values(defectCategories.value).forEach(category => {
      category.defects.forEach(defect => {
        if (defect.enabled) {
          enabledDefects.push(defect)
        }
      })
    })
    return enabledDefects
  }
  return {
    defectCategories,
    getMetricOptions,
    getUnitForMetric,
    getCurrentCategoryDefects,
    getCurrentCategoryName,
    getEnabledDefectsCount,
    aggregationOptions,
    referenceOptions,
    getAllDefectTypes,
    getCurrentCategoryName,
    getCurrentCategoryDefects,
    enableAllInCategory,
    disableAllInCategory,
    enableAllDefects,
    disableAllDefects,
    getAllEnabledDefects
  }
}