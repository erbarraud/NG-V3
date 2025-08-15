# API Design Recommendations for NG-V3

## Current Issues with Our v3 API Design

### 1. **Inconsistent Naming Conventions**
- **Current**: Mix of kebab-case (`/custom-grades`, `/defect-types`) and camelCase
- **Best Practice**: Use kebab-case consistently for URLs
- **Recommendation**: 
  - ✅ `/orders`, `/boards`, `/grades`
  - ✅ `/thickness-values`, `/dry-statuses`
  - ❌ `/thicknessValues`, `/dryStatuses`

### 2. **Non-RESTful Endpoints**
- **Current**: `/orders/open`, `/orders/closed`
- **Best Practice**: Use query parameters for filtering
- **Recommendation**: 
  - ✅ `GET /orders?status=open`
  - ✅ `GET /orders?status=closed`
  - ❌ `GET /orders/open`

### 3. **Missing Proper Resource Nesting**
- **Current**: Flat structure for all resources
- **Best Practice**: Logical nesting for related resources
- **Recommendation**:
  - ✅ `GET /orders/{orderId}/boards` - Boards in an order
  - ✅ `GET /boards/{boardId}/defects` - Defects on a board
  - ✅ `GET /boards/{boardId}/images/{face}` - Board images

### 4. **Inconsistent Response Format**
- **Current**: Mixed response structures
- **Best Practice**: Consistent envelope pattern
- **Recommendation**:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  },
  "meta": {
    "timestamp": "2025-01-13T12:00:00Z",
    "version": "3.0.0"
  }
}
```

### 5. **Poor Image URL Design**
- **Current**: `/api/v3/images/board/{id}/face{n}/{quality}`
- **Best Practice**: RESTful resource pattern
- **Recommendation**: 
  - ✅ `GET /boards/{boardId}/images/{face}?quality=original&annotations=true`
  - ❌ `/images/board/{id}/face1/original`

### 6. **Missing Standard HTTP Headers**
- **Current**: Custom status fields in response body
- **Best Practice**: Use standard HTTP status codes and headers
- **Recommendation**:
  - Use `200 OK` for successful GET
  - Use `201 Created` for successful POST
  - Use `204 No Content` for successful DELETE
  - Use `Location` header for created resources
  - Use `ETag` for caching

### 7. **No Pagination Standards**
- **Current**: No consistent pagination
- **Best Practice**: Standard pagination parameters
- **Recommendation**:
  - `?page=1&limit=20` for page-based
  - `?cursor=xyz&limit=20` for cursor-based
  - Include `Link` headers for navigation

### 8. **Missing API Versioning Strategy**
- **Current**: Version in URL (`/v3`)
- **Options**:
  1. **URL versioning** (current): `/api/v3/orders`
  2. **Header versioning**: `Accept: application/vnd.api+json;version=3`
  3. **Query parameter**: `/api/orders?version=3`
- **Recommendation**: Keep URL versioning but be consistent

## Proposed API Structure

### Core Resources
```
/api/v3/
├── orders/
│   ├── GET    /orders                 # List orders
│   ├── POST   /orders                 # Create order
│   ├── GET    /orders/{id}            # Get order
│   ├── PATCH  /orders/{id}            # Update order
│   ├── DELETE /orders/{id}            # Delete order
│   ├── GET    /orders/{id}/boards     # List boards in order
│   └── PATCH  /orders/{id}            # Update order status (body: { "status": "started" })
│
├── boards/
│   ├── GET    /boards                 # List boards
│   ├── GET    /boards/{id}            # Get board
│   ├── PATCH  /boards/{id}            # Update board
│   ├── GET    /boards/{id}/images/{face}  # Get board image
│   ├── GET    /boards/{id}/defects    # List defects
│   └── POST   /boards/{id}/feedback   # Submit feedback
│
├── grades/
│   ├── GET    /grades                 # List grades
│   ├── POST   /grades                 # Create grade
│   ├── GET    /grades/{id}            # Get grade
│   ├── PATCH  /grades/{id}            # Update grade
│   └── GET    /grades/{id}/rules      # Get grade rules
│
├── resources/
│   ├── GET    /species                # List species
│   ├── GET    /thickness-values       # List thicknesses
│   ├── GET    /dry-statuses           # List dry statuses
│   └── GET    /defect-types           # List defect types
│
└── auth/
    ├── POST   /auth/login             # Login
    ├── POST   /auth/logout            # Logout
    ├── POST   /auth/refresh           # Refresh token
    └── GET    /auth/user              # Get current user
```

### Query Parameters Standards
```
# Filtering
GET /boards?orderId=84&gradeId=2

# Pagination
GET /boards?page=1&limit=20

# Sorting
GET /orders?sort=-createdAt,name  # Sort by createdAt DESC, then name ASC

# Field selection (sparse fieldsets)
GET /boards?fields=id,grade,dimensions

# Including related resources
GET /orders?include=customer,boards

# Search
GET /boards?q=oak+select
```

### Response Status Codes
- `200 OK` - Successful GET, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing/invalid auth
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server error

### Headers Best Practices
```http
# Request Headers
Accept: application/json
Content-Type: application/json
Authorization: Bearer {token}
X-Request-ID: uuid

# Response Headers
Content-Type: application/json
X-Request-ID: uuid
X-Rate-Limit-Remaining: 100
X-Rate-Limit-Reset: 1234567890
ETag: "33a64df551"
Link: </api/v3/boards?page=2>; rel="next"
```

## Implementation Priority

### Phase 1: Critical Changes (Breaking)
1. Fix endpoint naming consistency (kebab-case)
2. Replace `/orders/open` with query parameters
3. Standardize response envelope format
4. Fix image endpoints to be RESTful

### Phase 2: Enhancements (Non-breaking)
1. Add proper pagination
2. Implement field selection
3. Add sorting capabilities
4. Implement proper HTTP caching

### Phase 3: Advanced Features
1. Add GraphQL endpoint for complex queries
2. Implement WebSocket/SSE for real-time updates
3. Add batch operations support
4. Implement HATEOAS links

## Migration Strategy

1. **Maintain backward compatibility** during transition
2. **Deprecation warnings** in headers for old endpoints
3. **Dual support period** (6 months)
4. **Auto-redirect** old endpoints to new ones where possible
5. **Comprehensive documentation** and migration guide

## Tools & Testing

### Recommended Tools
- **OpenAPI/Swagger** for documentation
- **Postman/Insomnia** for testing
- **JSON Schema** for validation
- **API versioning** tools

### Testing Requirements
- Unit tests for all endpoints
- Integration tests for workflows
- Load testing for performance
- Security testing (OWASP Top 10)

## Security Considerations

1. **Authentication**: JWT with refresh tokens
2. **Authorization**: Role-based access control (RBAC)
3. **Rate limiting**: Per-user and per-IP
4. **Input validation**: Strict schema validation
5. **CORS**: Properly configured for production
6. **HTTPS**: Required for all production traffic
7. **API keys**: For service-to-service communication

## Documentation Requirements

1. **OpenAPI 3.0 specification** (complete)
2. **Interactive documentation** (Swagger UI)
3. **Authentication guide**
4. **Error handling guide**
5. **Rate limiting documentation**
6. **Webhook documentation** (if applicable)
7. **SDKs** for major languages

## Next Steps

1. Review and approve the OpenAPI specification
2. Update the API adapter to match new patterns
3. Create migration plan for existing endpoints
4. Implement Phase 1 changes
5. Update frontend to use new endpoints
6. Deploy with deprecation warnings
7. Monitor usage and gather feedback

---

*This document should be shared with the backend team to ensure the new API follows these best practices from the start.*