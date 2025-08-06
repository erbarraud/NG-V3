import { ref } from 'vue'

interface ErrorLog {
  id: string
  message: string
  stack?: string
  componentName?: string
  route?: string
  userAgent: string
  timestamp: number
  level: 'error' | 'warn' | 'info'
  context?: Record<string, unknown>
}

interface ErrorLoggingConfig {
  enableConsoleLogging?: boolean
  enableRemoteLogging?: boolean
  maxLogEntries?: number
  apiEndpoint?: string
}

const errorLogs = ref<ErrorLog[]>([])
const config = ref<ErrorLoggingConfig>({
  enableConsoleLogging: false, // Disabled for cleaner development
  enableRemoteLogging: false,
  maxLogEntries: 100,
  apiEndpoint: undefined
})

let logIdCounter = 0

export function useErrorLogging() {
  
  const configure = (newConfig: Partial<ErrorLoggingConfig>) => {
    config.value = { ...config.value, ...newConfig }
  }

  const generateLogId = (): string => {
    return `error-${Date.now()}-${++logIdCounter}`
  }

  const logError = (
    error: Error | string,
    level: ErrorLog['level'] = 'error',
    context?: Record<string, unknown>
  ) => {
    const errorMessage = typeof error === 'string' ? error : error.message
    const errorStack = typeof error === 'string' ? undefined : error.stack

    const errorLog: ErrorLog = {
      id: generateLogId(),
      message: errorMessage,
      stack: errorStack,
      componentName: context?.component as string,
      route: window.location.pathname,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      level,
      context
    }

    // Add to local logs
    addLogEntry(errorLog)

    // Console logging
    if (config.value.enableConsoleLogging) {
      logToConsole(errorLog)
    }

    // Remote logging
    if (config.value.enableRemoteLogging && config.value.apiEndpoint) {
      sendToRemote(errorLog).catch(err => {
        console.warn('Failed to send error log to remote:', err)
      })
    }
  }

  const addLogEntry = (log: ErrorLog) => {
    errorLogs.value.unshift(log)

    // Limit log entries to prevent memory issues
    if (errorLogs.value.length > (config.value.maxLogEntries || 100)) {
      errorLogs.value = errorLogs.value.slice(0, config.value.maxLogEntries)
    }
  }

  const logToConsole = (log: ErrorLog) => {
    const consoleMethod = log.level === 'error' ? 'error' : log.level === 'warn' ? 'warn' : 'info'
    
    console.group(`🚨 ${log.level.toUpperCase()}: ${log.message}`)
    console.log('ID:', log.id)
    console.log('Route:', log.route)
    console.log('Timestamp:', new Date(log.timestamp).toISOString())
    
    if (log.componentName) {
      console.log('Component:', log.componentName)
    }
    
    if (log.context) {
      console.log('Context:', log.context)
    }
    
    if (log.stack) {
      console.log('Stack:', log.stack)
    }
    
    console.groupEnd()
  }

  const sendToRemote = async (log: ErrorLog): Promise<void> => {
    if (!config.value.apiEndpoint) return

    try {
      const response = await fetch(config.value.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...log,
          app: 'neural-grader',
          version: '1.0.0'
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      // Don't log remote logging errors to prevent infinite loops
      console.warn('Remote logging failed:', error)
    }
  }

  const getLogs = (level?: ErrorLog['level']): ErrorLog[] => {
    if (level) {
      return errorLogs.value.filter(log => log.level === level)
    }
    return [...errorLogs.value]
  }

  const clearLogs = () => {
    errorLogs.value = []
  }

  const getLogById = (id: string): ErrorLog | undefined => {
    return errorLogs.value.find(log => log.id === id)
  }

  const exportLogs = (format: 'json' | 'csv' = 'json'): string => {
    if (format === 'csv') {
      const headers = ['id', 'message', 'level', 'route', 'componentName', 'timestamp']
      const csvRows = [
        headers.join(','),
        ...errorLogs.value.map(log => 
          headers.map(header => {
            const value = log[header as keyof ErrorLog]
            return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
          }).join(',')
        )
      ]
      return csvRows.join('\n')
    }
    
    return JSON.stringify(errorLogs.value, null, 2)
  }

  const downloadLogs = (format: 'json' | 'csv' = 'json') => {
    const content = exportLogs(format)
    const blob = new Blob([content], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `error-logs-${new Date().toISOString().split('T')[0]}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Global error handler setup
  const initGlobalErrorHandler = () => {
    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      logError(event.error || event.message, 'error', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      })
    })

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      logError(
        event.reason?.message || event.reason || 'Unhandled promise rejection',
        'error',
        { 
          type: 'unhandledRejection',
          reason: event.reason 
        }
      )
    })
  }

  const getLogStats = () => {
    const logs = errorLogs.value
    return {
      total: logs.length,
      errors: logs.filter(l => l.level === 'error').length,
      warnings: logs.filter(l => l.level === 'warn').length,
      info: logs.filter(l => l.level === 'info').length,
      latest: logs[0]?.timestamp ? new Date(logs[0].timestamp) : null,
      routes: [...new Set(logs.map(l => l.route))],
      components: [...new Set(logs.map(l => l.componentName).filter(Boolean))]
    }
  }

  return {
    errorLogs,
    config,
    configure,
    logError,
    getLogs,
    clearLogs,
    getLogById,
    exportLogs,
    downloadLogs,
    initGlobalErrorHandler,
    getLogStats
  }
}