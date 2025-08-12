interface LegacyResponse {
  status: number
  data: any
  error?: string
}

interface V3Response<T> {
  data: T
  meta?: {
    timestamp: string
    version: string
    pagination?: any
  }
  error?: {
    code: string
    message: string
  }
}

class ApiAdapter {
  private legacyBaseUrl: string
  private v3BaseUrl: string
  private transformers: Map<string, Function>

  constructor(legacyUrl: string, v3Url: string) {
    this.legacyBaseUrl = legacyUrl
    this.v3BaseUrl = v3Url
    this.transformers = new Map()
    this.registerTransformers()
  }

  private registerTransformers() {
    this.transformers.set('grades', this.transformGrades)
    this.transformers.set('custom-grades', this.transformCustomGrades)
    this.transformers.set('batches', this.transformBatches)
    this.transformers.set('boards', this.transformBoards)
    this.transformers.set('bundles', this.transformBundles)
    this.transformers.set('species', this.transformLookupData)
    this.transformers.set('thickness', this.transformLookupData)
    this.transformers.set('suppliers', this.transformLookupData)
    this.transformers.set('graders', this.transformLookupData)
    this.transformers.set('markets', this.transformLookupData)
    this.transformers.set('auth', this.transformAuth)
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<V3Response<T>> {
    try {
      const legacyEndpoint = this.mapToLegacyEndpoint(endpoint)
      const legacyOptions = this.transformRequestOptions(options)
      
      const response = await fetch(`${this.legacyBaseUrl}${legacyEndpoint}`, legacyOptions)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const legacyData = await response.json()
      
      // Check if the response has a success status
      if (legacyData.status === 'error' || legacyData.errors) {
        return this.handleError(new Error(legacyData.message || 'API request failed'))
      }
      
      return this.transformResponse<T>(endpoint, legacyData)
    } catch (error) {
      return this.handleError(error)
    }
  }

  private mapToLegacyEndpoint(v3Endpoint: string): string {
    const endpointMap: Record<string, string> = {
      '/api/v3/grades': '/grades',
      '/api/v3/custom-grades': '/custom-grades',
      '/api/v3/batches': '/batches',
      '/api/v3/batches/open': '/batches/open',
      '/api/v3/bundles': '/bundles',
      '/api/v3/boards': '/boards',
      '/api/v3/species': '/species',
      '/api/v3/thickness': '/thicknessValues',
      '/api/v3/suppliers': '/suppliers',
      '/api/v3/graders': '/graders',
      '/api/v3/markets': '/markets',
      '/api/v3/auth/login': '/auth/login',
      '/api/v3/auth/validate': '/auth/validate-token',
      '/api/v3/auth/register': '/auth/register',
      '/api/v3/defect-types': '/defect-types',
      '/api/v3/attributes': '/attributes',
      '/api/v3/system-properties': '/system-properties',
      '/api/v3/units': '/units',
      '/api/v3/dry-statuses': '/dryStatuses',
      '/api/v3/printers': '/printers',
      '/api/v3/feedback-categories': '/feedback-categories'
    }
    
    const match = v3Endpoint.match(/^(\/api\/v3\/[^\/]+)(\/\d+)?(.*)$/)
    if (match) {
      const base = match[1]
      const id = match[2] || ''
      const rest = match[3] || ''
      const mappedBase = endpointMap[base] || base.replace('/api/v3', '')
      return `${mappedBase}${id}${rest}`
    }
    
    return endpointMap[v3Endpoint] || v3Endpoint.replace('/api/v3', '')
  }

  private transformRequestOptions(options: RequestInit): RequestInit {
    const headers = new Headers(options.headers)
    
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
    
    const token = localStorage.getItem('auth_token')
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    
    if (options.body && typeof options.body === 'object') {
      options.body = JSON.stringify(this.transformRequestBody(options.body))
    }
    
    return { ...options, headers }
  }

  private transformRequestBody(v3Body: any): any {
    if (v3Body.grades) {
      return {
        customGrades: v3Body.grades,
        timestamp: new Date().toISOString()
      }
    }
    
    if (v3Body.batch) {
      return {
        name: v3Body.batch.name,
        graderId: v3Body.batch.graderId,
        supplierId: v3Body.batch.supplierId,
        specieId: v3Body.batch.specieId,
        dryStatusId: v3Body.batch.dryStatusId,
        thicknessValueId: v3Body.batch.thicknessId,
        customGrades: v3Body.batch.customGrades
      }
    }
    
    return v3Body
  }

  private transformResponse<T>(endpoint: string, legacyData: LegacyResponse): V3Response<T> {
    const resourceType = this.getResourceType(endpoint)
    const transformer = this.transformers.get(resourceType)
    
    if (transformer) {
      return transformer.call(this, legacyData)
    }
    
    return {
      data: legacyData.data as T,
      meta: {
        timestamp: new Date().toISOString(),
        version: '3.0.0'
      }
    }
  }

  private getResourceType(endpoint: string): string {
    const patterns = [
      { regex: /\/auth\//, type: 'auth' },
      { regex: /\/custom-grades/, type: 'custom-grades' },
      { regex: /\/grades/, type: 'grades' },
      { regex: /\/batches/, type: 'batches' },
      { regex: /\/boards/, type: 'boards' },
      { regex: /\/bundles/, type: 'bundles' },
      { regex: /\/species/, type: 'species' },
      { regex: /\/thickness/, type: 'thickness' },
      { regex: /\/suppliers/, type: 'suppliers' },
      { regex: /\/graders/, type: 'graders' },
      { regex: /\/markets/, type: 'markets' }
    ]
    
    for (const pattern of patterns) {
      if (pattern.regex.test(endpoint)) {
        return pattern.type
      }
    }
    
    return 'default'
  }

  private transformGrades(legacy: LegacyResponse): V3Response<any> {
    const gradesData = legacy.data?.data || legacy.data || []
    const grades = Array.isArray(gradesData) ? gradesData : []
    
    return {
      data: grades,
      meta: {
        timestamp: new Date().toISOString(),
        version: '3.0.0'
      }
    }
  }

  private transformCustomGrades(legacy: LegacyResponse): V3Response<any> {
    const gradesData = legacy.data?.data || legacy.data || []
    const grades = Array.isArray(gradesData) ? gradesData : []
    
    return {
      data: grades.map(grade => ({
        id: grade.id,
        name: grade.name,
        printLabel: grade.printLabel,
        sortingBin: grade.sortingBin,
        deleted: grade.deleted || false
      })),
      meta: {
        timestamp: new Date().toISOString(),
        version: '3.0.0'
      }
    }
  }

  private transformBatches(legacy: LegacyResponse): V3Response<any> {
    const batchesData = legacy.data?.data || legacy.data || []
    const batches = Array.isArray(batchesData) ? batchesData : []
    
    return {
      data: batches.map(batch => ({
        id: batch.id,
        name: batch.name,
        specie: batch.specie,
        thickness: batch.thickness,
        dryStatus: batch.dryStatus,
        graderId: batch.graderId,
        supplierId: batch.supplierId,
        status: batch.status,
        startDate: batch.startDate,
        closeDate: batch.closeDate,
        boardsCount: batch.boardsCount,
        customGrades: batch.customGrades || [],
        lumberStage: batch.lumberStage
      })),
      meta: {
        timestamp: new Date().toISOString(),
        version: '3.0.0'
      }
    }
  }

  private transformBoards(legacy: LegacyResponse): V3Response<any> {
    const wrapper = legacy.data || {}
    const boardsData = wrapper.data || wrapper.boards || []
    const boards = Array.isArray(boardsData) ? boardsData : []
    
    return {
      data: {
        boards: boards.map(board => ({
          id: board.id,
          shotId: board.shotId,
          batchId: board.batchId,
          bundleId: board.bundleId,
          gradeId: board.gradeId,
          customGradeId: board.customGradeId,
          length: board.length,
          width: board.width,
          thickness: board.thickness,
          surface: board.surface,
          createDate: board.createDate,
          defects: board.defects || [],
          faces: board.faces || []
        })),
        pagination: wrapper.pagination || {
          page: wrapper.pageNumber || 0,
          size: wrapper.pageSize || 10,
          total: wrapper.totalElements || boards.length
        }
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '3.0.0'
      }
    }
  }

  private transformBundles(legacy: LegacyResponse): V3Response<any> {
    const wrapper = legacy.data || {}
    const bundlesData = wrapper.data || wrapper.bundles || []
    const bundles = Array.isArray(bundlesData) ? bundlesData : []
    
    return {
      data: {
        bundles: bundles.map(bundle => ({
          id: bundle.id,
          batchId: bundle.batchId,
          status: bundle.status,
          boardCount: bundle.boardCount,
          totalVolume: bundle.totalVolume,
          gradeDistribution: bundle.gradeDistribution || {},
          createDate: bundle.createDate,
          closeDate: bundle.closeDate
        })),
        pagination: wrapper.pagination
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '3.0.0'
      }
    }
  }

  private transformLookupData(legacy: LegacyResponse): V3Response<any> {
    // Handle the legacy response format which wraps data in a 'data' field
    let items = []
    
    if (legacy.data) {
      // Check if it's already an array
      if (Array.isArray(legacy.data)) {
        items = legacy.data
      }
      // Check if data is wrapped in another data field
      else if (legacy.data.data) {
        items = Array.isArray(legacy.data.data) ? legacy.data.data : []
      }
      // Check if it's an object with array values
      else if (typeof legacy.data === 'object') {
        // For responses that return objects, convert to array
        items = Object.values(legacy.data)
      }
    }
    
    return {
      data: items.map((item: any) => ({
        id: item.id,
        name: item.name || item.label || item.defaultName,
        description: item.description,
        active: item.active !== false,
        selected: item.selected,
        metadata: item.metadata || {}
      })),
      meta: {
        timestamp: new Date().toISOString(),
        version: '3.0.0'
      }
    }
  }

  private transformAuth(legacy: any): V3Response<any> {
    if (legacy.token || legacy.accessToken || legacy.data?.token) {
      const token = legacy.token || legacy.accessToken || legacy.data?.token
      return {
        data: {
          token: token,
          refreshToken: legacy.refreshToken || legacy.data?.refreshToken,
          expiresIn: legacy.expiresIn || legacy.data?.expiresIn || 3600,
          user: {
            id: legacy.userId || legacy.data?.userId,
            username: legacy.username || legacy.data?.username,
            roles: legacy.roles || legacy.data?.roles || [],
            permissions: legacy.permissions || legacy.data?.permissions || []
          }
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '3.0.0'
        }
      }
    }
    
    return this.handleError(new Error('Invalid authentication response'))
  }

  private handleError(error: any): V3Response<any> {
    return {
      data: null,
      error: {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'An unexpected error occurred'
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '3.0.0'
      }
    }
  }
}

export default ApiAdapter
export type { V3Response, LegacyResponse }