// import { computed } from 'vue'

export function useZoneManager(gradeForm) {
  const zoneColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']

  const addZone = () => {
    const colorIndex = gradeForm.value.zones.length % zoneColors.length
    const newZone = {
      id: Date.now(),
      name: `Zone ${gradeForm.value.zones.length + 1}`,
      type: 'edge-zone',
      color: zoneColors[colorIndex],
      edgeDistance: 50,
      startPosition: 0,
      endPosition: 100,
      allowedDefects: [],
      showDefectOverrides: false
    }
    gradeForm.value.zones.push(newZone)
  }

  const removeZone = (index) => {
    gradeForm.value.zones.splice(index, 1)
  }

  const getZoneColorClass = (color) => {
    const colorMap = {
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500'
    }
    return colorMap[color] || 'bg-gray-500'
  }

  const getZoneStyle = (zone) => {
    if (zone.type === 'edge-zone') {
      return {
        left: '0%',
        right: '0%',
        top: '0%',
        bottom: '0%',
        border: `${zone.edgeDistance / 10}px solid currentColor`
      }
    } else if (zone.type === 'center-zone') {
      return {
        left: '25%',
        right: '25%',
        top: '25%',
        bottom: '25%'
      }
    } else {
      return {
        left: `${zone.startPosition}%`,
        right: `${100 - zone.endPosition}%`,
        top: '10%',
        bottom: '10%'
      }
    }
  }

  return {
    addZone,
    removeZone,
    getZoneColorClass,
    getZoneStyle
  }
}