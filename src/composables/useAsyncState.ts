import { ref, computed, type Ref } from 'vue'

interface UseAsyncStateOptions<T> {
  immediate?: boolean
  resetOnExecute?: boolean
  onError?: (error: Error) => void
  onSuccess?: (data: T) => void
}

interface UseAsyncStateReturn<T> {
  state: Ref<T | null>
  isLoading: Ref<boolean>
  error: Ref<Error | null>
  isReady: Ref<boolean>
  isSuccess: Ref<boolean>
  execute: (...args: any[]) => Promise<T>
  reset: () => void
}

/**
 * Composable for managing async operations with loading, error, and success states
 */
export function useAsyncState<T>(
  asyncFn: (...args: any[]) => Promise<T>,
  initialState: T | null = null,
  options: UseAsyncStateOptions<T> = {}
): UseAsyncStateReturn<T> {
  const {
    immediate = true,
    resetOnExecute = true,
    onError = null,
    onSuccess = null
  } = options

  const state = ref<T | null>(initialState)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const isReady = computed(() => !isLoading.value && error.value === null)
  const isSuccess = computed(() => !isLoading.value && error.value === null && state.value !== null)

  /**
   * Execute the async function with proper state management
   */
  const execute = async (...args: any[]): Promise<T> => {
    if (resetOnExecute) {
      error.value = null
    }
    
    isLoading.value = true

    try {
      const result = await asyncFn(...args)
      state.value = result
      
      if (onSuccess) {
        onSuccess(result)
      }
      
      return result
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err))
      error.value = errorObj
      
      if (onError) {
        onError(errorObj)
      }
      
      throw errorObj
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Reset the state to initial values
   */
  const reset = () => {
    state.value = initialState
    error.value = null
    isLoading.value = false
  }

  if (immediate) {
    execute()
  }

  return {
    state,
    isLoading,
    error,
    isReady,
    isSuccess,
    execute,
    reset
  }
}