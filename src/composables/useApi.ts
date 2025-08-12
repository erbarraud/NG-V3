import { ref, Ref } from 'vue'
import apiClient from '@/services/api-client'
import type { V3Response } from '@/services/api-adapter'

interface UseApiOptions {
  immediate?: boolean
  cache?: boolean
  onError?: (error: any) => void
  onSuccess?: (data: any) => void
}

interface UseApiReturn<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  execute: (params?: any) => Promise<void>
  refresh: () => Promise<void>
}

export function useApi<T>(
  endpoint: string,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const execute = async (params?: any) => {
    loading.value = true
    error.value = null

    try {
      const response: V3Response<T> = await apiClient.get<T>(endpoint, params)
      
      if (response.error) {
        throw new Error(response.error.message)
      }
      
      data.value = response.data
      options.onSuccess?.(response.data)
    } catch (err) {
      error.value = err as Error
      options.onError?.(err)
    } finally {
      loading.value = false
    }
  }

  const refresh = async () => {
    if (!options.cache) {
      apiClient.clearCache()
    }
    await execute()
  }

  if (options.immediate) {
    execute()
  }

  return {
    data,
    loading,
    error,
    execute,
    refresh
  }
}

export function useApiMutation<T>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST'
): UseApiReturn<T> {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const execute = async (payload?: any) => {
    loading.value = true
    error.value = null

    try {
      let response: V3Response<T>
      
      switch (method) {
        case 'POST':
          response = await apiClient.post<T>(endpoint, payload)
          break
        case 'PUT':
          response = await apiClient.put<T>(endpoint, payload)
          break
        case 'DELETE':
          response = await apiClient.delete<T>(endpoint)
          break
      }
      
      if (response.error) {
        throw new Error(response.error.message)
      }
      
      data.value = response.data
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }

  const refresh = execute

  return {
    data,
    loading,
    error,
    execute,
    refresh
  }
}