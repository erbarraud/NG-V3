import { ref, onMounted, onUnmounted } from 'vue'

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
}

interface PerformanceReport {
  metrics: PerformanceMetric[]
  vitals: {
    fcp?: number // First Contentful Paint
    lcp?: number // Largest Contentful Paint
    fid?: number // First Input Delay
    cls?: number // Cumulative Layout Shift
    ttfb?: number // Time to First Byte
  }
}

export function usePerformance() {
  const metrics = ref<PerformanceMetric[]>([])
  const isSupported = ref(false)
  const observer = ref<PerformanceObserver>()

  onMounted(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      isSupported.value = true
      initPerformanceObserver()
      measurePageLoadMetrics()
    }
  })

  onUnmounted(() => {
    if (observer.value) {
      observer.value.disconnect()
    }
  })

  const initPerformanceObserver = () => {
    try {
      observer.value = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        
        for (const entry of entries) {
          addMetric(entry.name, entry.duration || entry.value, entry.startTime)
        }
      })

      // Observe different types of performance entries
      observer.value.observe({ entryTypes: ['measure', 'navigation', 'paint', 'largest-contentful-paint'] })
      
      // Observe layout shifts for CLS
      if ('LayoutShift' in window) {
        try {
          observer.value.observe({ entryTypes: ['layout-shift'] })
        } catch (e) {
          console.debug('Layout shift observation not supported')
        }
      }

      // Observe first input for FID
      try {
        observer.value.observe({ entryTypes: ['first-input'] })
      } catch (e) {
        console.debug('First input observation not supported')
      }
      
    } catch (error) {
      console.warn('Failed to initialize PerformanceObserver:', error)
    }
  }

  const measurePageLoadMetrics = () => {
    if (!isSupported.value) return

    // Wait for page to load
    if (document.readyState === 'complete') {
      collectMetrics()
    } else {
      window.addEventListener('load', collectMetrics)
    }
  }

  const collectMetrics = () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const paint = performance.getEntriesByType('paint')
    
    if (navigation) {
      // Core navigation metrics
      addMetric('domContentLoaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart)
      addMetric('loadComplete', navigation.loadEventEnd - navigation.loadEventStart)
      addMetric('ttfb', navigation.responseStart - navigation.fetchStart)
      addMetric('domInteractive', navigation.domInteractive - navigation.fetchStart)
      addMetric('domComplete', navigation.domComplete - navigation.fetchStart)
    }

    // Paint metrics
    paint.forEach((entry) => {
      addMetric(entry.name, entry.startTime)
    })
  }

  const addMetric = (name: string, value: number, timestamp = Date.now()) => {
    metrics.value.push({
      name,
      value: Math.round(value * 100) / 100, // Round to 2 decimal places
      timestamp
    })
  }

  const measureUserTiming = (name: string) => {
    if (!isSupported.value) return

    const startMark = `${name}-start`
    const endMark = `${name}-end`
    const measureName = name

    return {
      start: () => {
        performance.mark(startMark)
      },
      
      end: () => {
        performance.mark(endMark)
        performance.measure(measureName, startMark, endMark)
        
        const measure = performance.getEntriesByName(measureName, 'measure')[0]
        if (measure) {
          addMetric(name, measure.duration)
        }
      }
    }
  }

  const getMetrics = (): PerformanceMetric[] => {
    return [...metrics.value]
  }

  const getReport = (): PerformanceReport => {
    const report: PerformanceReport = {
      metrics: getMetrics(),
      vitals: {}
    }

    // Extract Web Vitals
    metrics.value.forEach(metric => {
      switch (metric.name) {
        case 'first-contentful-paint':
          report.vitals.fcp = metric.value
          break
        case 'largest-contentful-paint':
          report.vitals.lcp = metric.value
          break
        case 'first-input':
          report.vitals.fid = metric.value
          break
        case 'layout-shift':
          report.vitals.cls = (report.vitals.cls || 0) + metric.value
          break
        case 'ttfb':
          report.vitals.ttfb = metric.value
          break
      }
    })

    return report
  }

  const clearMetrics = () => {
    metrics.value = []
  }

  const logReport = () => {
    if (!isSupported.value) {
      console.warn('Performance monitoring not supported')
      return
    }

    const report = getReport()
    console.group('🚀 Performance Report')
    
    if (Object.keys(report.vitals).length > 0) {
      console.group('📊 Web Vitals')
      if (report.vitals.fcp) console.log(`First Contentful Paint: ${report.vitals.fcp.toFixed(2)}ms`)
      if (report.vitals.lcp) console.log(`Largest Contentful Paint: ${report.vitals.lcp.toFixed(2)}ms`)
      if (report.vitals.fid) console.log(`First Input Delay: ${report.vitals.fid.toFixed(2)}ms`)
      if (report.vitals.cls) console.log(`Cumulative Layout Shift: ${report.vitals.cls.toFixed(4)}`)
      if (report.vitals.ttfb) console.log(`Time to First Byte: ${report.vitals.ttfb.toFixed(2)}ms`)
      console.groupEnd()
    }

    console.group('📈 Custom Metrics')
    report.metrics
      .filter(m => !Object.values(report.vitals).includes(m.value))
      .forEach(metric => {
        console.log(`${metric.name}: ${metric.value.toFixed(2)}ms`)
      })
    console.groupEnd()
    
    console.groupEnd()
  }

  return {
    metrics,
    isSupported,
    measureUserTiming,
    getMetrics,
    getReport,
    clearMetrics,
    logReport
  }
}