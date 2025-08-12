import ApiAdapter from './api-adapter'
import type { V3Response } from './api-adapter'

class ApiClient {
  private adapter: ApiAdapter
  private cache: Map<string, { data: any; timestamp: number }>
  private cacheTimeout: number = 5 * 60 * 1000 // 5 minutes

  constructor() {
    // Use proxied path in development, direct URL in production
    const legacyUrl = import.meta.env.DEV 
      ? '/api/legacy' 
      : (import.meta.env.VITE_LEGACY_API_URL || '')
    const v3Url = import.meta.env.VITE_API_URL || '/api/v3'
    
    this.adapter = new ApiAdapter(legacyUrl, v3Url)
    this.cache = new Map()
  }

  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}:${JSON.stringify(params || {})}`
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    const isExpired = Date.now() - cached.timestamp > this.cacheTimeout
    if (isExpired) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  async get<T>(endpoint: string, params?: any): Promise<V3Response<T>> {
    const cacheKey = this.getCacheKey(endpoint, params)
    const cached = this.getFromCache(cacheKey)
    
    if (cached) {
      return cached
    }
    
    // Only add query string if params exists and has properties
    let queryString = ''
    if (params && Object.keys(params).length > 0) {
      queryString = '?' + new URLSearchParams(params).toString()
    }
    
    const response = await this.adapter.request<T>(`${endpoint}${queryString}`, {
      method: 'GET'
    })
    
    if (!response.error) {
      this.setCache(cacheKey, response)
    }
    
    return response
  }

  async post<T>(endpoint: string, data: any): Promise<V3Response<T>> {
    return this.adapter.request<T>(endpoint, {
      method: 'POST',
      body: data
    })
  }

  async put<T>(endpoint: string, data: any): Promise<V3Response<T>> {
    return this.adapter.request<T>(endpoint, {
      method: 'PUT',
      body: data
    })
  }

  async delete<T>(endpoint: string): Promise<V3Response<T>> {
    return this.adapter.request<T>(endpoint, {
      method: 'DELETE'
    })
  }

  clearCache(): void {
    this.cache.clear()
  }
}

const apiClient = new ApiClient()

export default apiClient
export { ApiClient }