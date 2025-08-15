# NG-V3 Developer Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Access to backend API (configure via BACKEND_URL environment variable)

### Setup
```bash
# Install dependencies
npm install

# Configure environment (copy and modify .env.example)
cp .env.example .env.local
# Edit .env.local to set VITE_API_TARGET=${BACKEND_URL}

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run type checking
npm run typecheck
```

## 📁 Project Structure

```
src/
├── components/
│   ├── board/              # Board display components
│   │   ├── BoardViewer.vue # Main board display with defects & overlays
│   │   └── RejectionRulesModal.vue
│   ├── Layout/            
│   │   └── AppLayout.vue   # Main app layout wrapper
│   └── ui/                 # Reusable UI components (shadcn-based)
│
├── views/                  # Page components
│   ├── BoardFinder.vue     # Board search & browsing
│   ├── BoardInspector.vue  # Sequential board navigation
│   ├── Dashboard.vue       # Main dashboard
│   ├── Orders.vue          # Order management
│   ├── ProductionOrders.vue# Production order dashboard
│   └── LineCheckDashboard.vue # Live scanning monitor
│
├── services/
│   └── api-adapter.ts      # API integration layer
│
├── stores/
│   └── auth.ts            # Authentication store (Pinia)
│
└── router/
    └── index.ts           # Vue Router configuration
```

## 🔑 Key Concepts

### 1. Board Data Structure
Boards are the core entity - wooden boards being graded:
- **ID**: Unique identifier
- **Faces**: face1 and face2 with images and defects
- **Grades**: Validation results for each grade
- **Dimensions**: length, width, thickness, volume
- **Metadata**: species, dry status, batch/order

### 2. Defect System
Defects are polygonal regions on board faces:
- Coordinates in format: `[x1,y1,x2,y2,x3,y3,...]`
- Multiple defect types (knots, cracks, etc.)
- Can be toggled on/off in the UI
- Drawn on HTML5 Canvas overlays

### 3. Grade Validation
- Boards are tested against multiple grades
- Each grade has pass/fail with rejection reasons
- Grades have IDs > 100 for batch-specific assignments
- "Rebut" = reject grade when all others fail

### 4. API Integration
- Legacy backend at `http://192.168.111.132:8082`
- API adapter handles CORS and data transformation
- Most endpoints return paginated results
- Authentication optional for most endpoints

## 🎨 UI Components

### BoardViewer Component
Central component for displaying boards:
- **Images**: Displays face1/face2 with defect overlays
- **Defects**: Toggle individual defect types
- **Usable Area**: Shows clear wood areas (white overlay)
- **Magnifier**: Zoom feature for detailed inspection
- **Grade Validation**: Shows pass/fail for each grade

### Key Features
1. **Defect Filtering**: Show/hide specific defect types
2. **Usable Area Calculation**: Pixel-level analysis to show usable wood
3. **Image Fallbacks**: Multiple fallback URLs for images
4. **Canvas Overlays**: Dynamic defect rendering

## 🔧 Common Tasks

### Adding a New Page
1. Create component in `/src/views/`
2. Add route in `/src/router/index.ts`
3. Add navigation link in `AppLayout.vue`

### Working with Board Images
```javascript
// Board images come from nginx or API
const imageUrl = board.face1.url 
  ? `/${board.face1.url}`  // nginx path
  : `/api/legacy/ui/images/render/board/${boardId}/face1/original`
```

### Handling Defects
```javascript
// Parse defect coordinates
const points = defect.points // [x1,y1,x2,y2,...]
const coordinates = []
for (let i = 0; i < points.length; i += 2) {
  coordinates.push({ x: points[i], y: points[i+1] })
}
```

## 🌐 API Endpoints

### Main Endpoints
- `GET /api/v3/boards` - List boards (paginated)
- `GET /api/v3/boards/{id}` - Single board details
- `GET /api/v3/grades` - Available grades
- `GET /api/v3/orders` - Orders/batches
- `GET /api/legacy/ui/images/render/board/{id}/face{n}/original` - Board images

### Pagination
API versions use different parameter names:
- **v3 API**: `?page=1&limit=100` (default limit: 20)
- **Legacy API**: `?pageNumber=1&pageSize=100` (default pageSize: 10)

Examples:
```bash
# v3 API
GET /api/v3/boards?page=1&limit=50

# Legacy API  
GET /api/legacy/boards?pageNumber=1&pageSize=50
```

## ⚠️ Important Notes

### Terminology
- **Orders** in UI = **Batches** in API
- **Grades** can be standard or batch-specific
- **Price/Value** - Not provided by API currently

### Image Loading
- Images can be large (9336x693 pixels)
- Multiple fallback URLs for robustness
- Clean images (no defects) not available from API

### Performance Considerations
- Board images are high-res - implement lazy loading
- Canvas operations can be CPU intensive
- Pagination essential for large datasets

## 🐛 Debugging Tips

### Common Issues
1. **Boards not loading**: Check pagination (API returns max 10 by default)
2. **Images 404**: Try fallback URLs, check nginx proxy
3. **Grades showing IDs**: Batch-specific grades need mapping
4. **French characters**: API encoding issues, client-side fixes applied

### Useful Commands
```bash
# Check API health
curl http://192.168.111.132:8082/api/v3/boards?page=1&pageSize=1

# View board structure
npm run dev
# Navigate to http://localhost:5173/board-inspector/106760
```

## 📚 Technologies

- **Vue 3** - Composition API
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Radix Vue** - Headless UI components
- **Lucide Icons** - Icon library
- **Vite** - Build tool
- **Pinia** - State management

## 🤝 Contributing

### Code Style
- Use Composition API (`<script setup>`)
- TypeScript for new code
- Tailwind for styling
- Comment complex logic
- Remove console.logs before commit

### Git Workflow
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Remove debug code
5. Create PR with clear description

## 📋 Current Limitations

### Missing from API
- Board pricing/value data
- Clean board images (without defects)
- Real-time scanning WebSocket
- Customer information
- Production metrics

See `API_MISSING_ENDPOINTS.md` for full list.

## 🆘 Getting Help

- Check `CLAUDE.md` for project context
- Review `API_MISSING_ENDPOINTS.md` for API limitations
- Test environment: http://192.168.111.132
- Board examples: 106760, 106761, 106762

## 📝 License

Proprietary - All rights reserved