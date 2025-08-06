import { describe, it, expect, vi } from 'vitest'
import { useAsyncState } from '@/composables/useAsyncState'

describe('useAsyncState', () => {
  it('should initialize with correct default state', () => {
    const mockFn = vi.fn(() => Promise.resolve('test result'))
    const { isLoading, error, state } = useAsyncState(mockFn, null, { immediate: false })

    expect(isLoading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(state.value).toBeNull()
  })

  it('should handle successful async operation', async () => {
    const mockFn = vi.fn(() => Promise.resolve('success'))
    const { isLoading, error, state, execute } = useAsyncState(mockFn, null, { immediate: false })

    expect(isLoading.value).toBe(false)
    
    const promise = execute()
    expect(isLoading.value).toBe(true)
    
    await promise
    
    expect(isLoading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(state.value).toBe('success')
  })

  it('should handle async operation errors', async () => {
    const mockError = new Error('Test error')
    const mockFn = vi.fn(() => Promise.reject(mockError))
    const { isLoading, error, state, execute } = useAsyncState(mockFn, null, { immediate: false })

    const promise = execute().catch(() => {}) // Catch to prevent unhandled rejection
    expect(isLoading.value).toBe(true)
    
    await promise
    
    expect(isLoading.value).toBe(false)
    expect(error.value).toBe(mockError)
    expect(state.value).toBeNull()
  })

  it('should execute immediately when immediate option is true', async () => {
    const mockFn = vi.fn(() => Promise.resolve('immediate result'))
    const { isLoading, state } = useAsyncState(mockFn, null, { immediate: true })

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(isLoading.value).toBe(true)

    // Wait for the async operation to complete
    await new Promise(resolve => setTimeout(resolve, 10))
    
    expect(isLoading.value).toBe(false)
    expect(state.value).toBe('immediate result')
  })

  it('should use default value when provided', () => {
    const mockFn = vi.fn(() => Promise.resolve('test'))
    const defaultValue = 'default'
    const { state } = useAsyncState(mockFn, defaultValue, { immediate: false })

    expect(state.value).toBe(defaultValue)
  })

  it('should handle resetOnExecute option', async () => {
    const mockFn = vi.fn()
      .mockResolvedValueOnce('first')
      .mockResolvedValueOnce('second')

    const { state, execute } = useAsyncState(mockFn, null, { 
      immediate: false, 
      resetOnExecute: false 
    })

    await execute()
    expect(state.value).toBe('first')

    await execute()
    expect(state.value).toBe('second')
  })
})