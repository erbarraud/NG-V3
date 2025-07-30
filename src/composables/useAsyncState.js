import { ref, computed } from 'vue'

/**
 * Composable for managing async operations with loading, error, and success states
 * @param {Function} asyncFn - The async function to execute
 * @param {*} initialState - Initial state value
 * @param {Object} options - Configuration options
 * @returns {Object} Reactive state object with loading, error, and data properties
 */
export function useAsyncState(asyncFn, initialState = null, options = {}) {
  const {
    immediate = true,
    resetOnExecute = true,
    onError = null,
    onSuccess = null
  } = options

  const state = ref(initialState)
  const isLoading = ref(false)
  const error = ref(null)

  const isReady = computed(() => !isLoading.value && error.value === null)
  const isSuccess = computed(() => !isLoading.value && error.value === null && state.value !== null)

  /**
   * Execute the async function with proper state management
   * @param {...any} args - Arguments to pass to the async function
   * @returns {Promise} The result of the async function
   */
  const execute = async (...args) => {
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
      error.value = err
      
      if (onError) {
        onError(err)
      }
      
      throw err
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