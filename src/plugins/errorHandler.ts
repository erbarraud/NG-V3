import type { App } from 'vue'
import { useErrorLogging } from '@/composables/useErrorLogging'

export function setupErrorHandler(app: App) {
  const { logError, initGlobalErrorHandler } = useErrorLogging()

  // Vue error handler
  app.config.errorHandler = (error, instance, info) => {
    const componentName = instance?.$options.name || instance?.$?.type?.name || 'Unknown'
    
    logError(error, 'error', {
      component: componentName,
      errorInfo: info,
      vueInstance: {
        props: instance?.$props,
        route: instance?.$route?.path
      }
    })
  }

  // Vue warning handler (development only)
  if (import.meta.env.DEV) {
    app.config.warnHandler = (message, instance, trace) => {
      const componentName = instance?.$options.name || instance?.$?.type?.name || 'Unknown'
      
      logError(message, 'warn', {
        component: componentName,
        trace,
        vueInstance: {
          props: instance?.$props,
          route: instance?.$route?.path
        }
      })
    }
  }

  // Initialize global error handlers
  initGlobalErrorHandler()

  // Return logging utilities for use in components
  return {
    logError
  }
}