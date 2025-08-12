# Claude Code Context for NG-V3 Project

## Project Overview
This is a Vue 3 + TypeScript application for a lumber grading system (NG-V3) that interfaces with a legacy backend system for analyzing and grading wooden boards.

## User Instructions & Preferences
**IMPORTANT: Always follow these rules:**
- Always test/check a page for errors before telling the user it's working
- Don't use decorative colors - only use colors when they're meaningful (red for errors/defects, green for money/success)
- Keep UI professional and clean - no unnecessary visual elements
- Automatically load board images when a board is selected (no manual load button)
- Display measurements in metric units (cm) not imperial
- Don't round corners on board images - users need to see the full board edges
- Save context to this CLAUDE.md file after each session
- Always run lint and typecheck commands when code changes are made
- **Use "Orders" terminology instead of "Batches" in the UI** (the old app used "batches", new app uses "orders")

## Recent Changes & Current State

### Session: 2025-08-13 (Terminology Update)
**Changes Made:**
1. **Replaced "Batch" with "Order" terminology throughout the UI**:
   - Updated search placeholder text
   - Changed filter labels from "Batch" to "Order"
   - Updated board list display to show "Order" instead of "Batch"
   - Renamed variables: `availableBatches` → `availableOrders`
   - Renamed cache: `batchCustomGradesCache` → `orderCustomGradesCache`
   - Renamed function: `loadBatchCustomGrades` → `loadOrderCustomGrades`
   - Added comments noting that API still uses 'batches' terminology
   - **Important**: Legacy API endpoints still use `/batches` but UI now displays "Orders"

### Session: 2025-08-12 (Critical Bug Fixes - FINAL)
**RESOLVED ISSUES:**

1. **Authentication Headers Issue**:
   - **Problem**: Boards not loading in Firefox normal mode when logged in, but working in private mode
   - **Root Cause**: API adapter was sending Authorization headers for all requests when user authenticated
   - **Solution**: Modified `api-adapter.ts` to only send auth headers for endpoints that explicitly require authentication
   - **Impact**: BoardFinder now works consistently regardless of authentication state

2. **Vue Lifecycle Warnings**:
   - **Problem**: Console warnings "onMounted is called when there is no active component instance"
   - **Root Cause**: Multiple issues - direct async usage in Vue lifecycle hooks + dynamic auth store import in router
   - **Solution**: 
     * Wrapped async operations in inner functions within lifecycle hooks
     * Moved auth initialization from router to main.ts (safer location)
     * Fixed BoardFinder.vue, lazy-image.vue, OrderDetails.vue
   - **Impact**: Clean console output, proper component initialization

3. **Search Functionality Issues**:
   - **Problem**: Search crashed on null/undefined fields (`TypeError: board.species.toLowerCase is not a function`)
   - **Root Cause**: Board data contained null values for some fields like species, dryStatus
   - **Solution**: Added safe null checking and proper field filtering in search function
   - **Impact**: Search now works reliably across all board fields

**Current Search Features**:
- ✅ Client-side filtering for fast results
- ✅ Multi-field search: Board ID, Shot ID, Batch, Grade, Species, Dimensions
- ✅ Safe null/undefined handling
- ✅ Real-time results with 300ms debounce
- ✅ Cached data approach for performance

**Current Authentication Strategy**:
- Public endpoints (boards, batches, grades): No auth headers
- Protected endpoints (auth/, user/, admin/): Auth headers included
- Development mode: Route guards disabled for easier testing
- Auth initialization: Moved to main.ts for stability

### Session: 2025-08-12 (Earlier Update)
**Changes Made:**
1. **Sheet Component Migration**:
   - Replaced Drawer with Sheet component from radix-vue/shadcn
   - Created sheet components in `/src/components/ui/sheet*.vue`
   - Implemented smooth slide animations from the right side
   - Sheet shows grade validation results when "See rejection rules" is clicked
   - Added proper CSS animations with data-state selectors

2. **Grade Names Fix**:
   - Fixed issue where grade IDs (575-581) were showing instead of names
   - Discovered these are batch-specific custom grade assignment IDs
   - Added `batchCustomGradesCache` to cache batch-specific grade mappings
   - Created `loadBatchCustomGrades()` function to fetch batch grade data
   - Updated `getGradeName()` to check batch custom grades for IDs > 100
   - Preloading batch 84 custom grades on mount (common test batch)

3. **French Character Encoding Fix**:
   - Fixed encoding issues with French accented characters (è, é, à, etc.)
   - Added UTF-8 charset headers to API requests
   - Created `fixEncoding()` helper function to fix malformed characters
   - Applied fix to rejection reasons display in Sheet component

4. **Understanding Grade Validation**:
   - Boards show all grades as failed when they don't meet any grade requirements
   - "Rebut" (reject) is the lowest grade, assigned when all others fail
   - API returns `gradeId: null` when no final grade has been assigned
   - Validation comes directly from legacy API, not our logic

### Previous Session: 2025-08-12
**Changes Made:**
1. **Unit Conversion**: Changed from imperial (feet/inches) to metric (cm) display
   - Modified `formatLength()` function in BoardFinder.vue to handle API format and convert to cm
   - API returns values in mm/cm, now displaying consistently in cm

2. **UI Improvements**:
   - Added action buttons: Hide Minor Defects, Agree/Disagree with NG AI, Add to Reference Bundle
   - Optimized KPI cards layout - all metrics now on one line
   - Removed unnecessary ID cards (Shot ID, Batch, Bundle)
   - Moved scan date to header as plain text instead of a card
   - Removed rounded corners from board images for full visibility
   - Added "Grading Face" indicator chip next to the face used for grading
   - Auto-load board images when board is selected

3. **Color Scheme Simplification**:
   - Removed decorative colors
   - Gray for most metrics
   - Green only for monetary value
   - Red only for defects when present (dynamic)

## API Integration

### API Adapter (`/src/services/api-adapter.ts`)
- Bridges between Vue app and legacy backend at `http://192.168.111.132:8082`
- Handles CORS and transforms data format
- Preserves unit information from API responses
- Added UTF-8 charset headers for proper encoding

### Key Endpoints
- `/api/v3/boards` - Get board list
- `/api/v3/grades` - Get available grades
- `/api/v3/batches` - Get batch information
- `/api/v3/batches/{id}` - Get specific batch with custom grades
- `/api/legacy/ui/images/render/board/{id}/face{n}/original` - Board images
- `/api/legacy/batches/{id}` - Direct legacy API for batch custom grades

### Important API Findings
- Grade IDs > 100 are batch-specific custom grade assignments
- Each batch has its own custom grade mappings
- Board validation includes all possible grades for the batch
- French text from API has encoding issues (requires client-side fix)

## Component Structure

### BoardFinder (`/src/views/BoardFinder.vue`)
Main board browsing interface with:
- Search and filters
- Board list sidebar
- Detailed board view with KPIs
- Board images with grading face indicator
- Grade validation Sheet component (side panel)
- Batch custom grades caching system
- French character encoding fixes

### Sheet Components (`/src/components/ui/sheet*.vue`)
- `sheet.vue` - Root dialog component
- `sheet-content.vue` - Content container with animations
- `sheet-header.vue` - Header section
- `sheet-title.vue` - Title component
- `sheet-description.vue` - Description component

### Key Features
- Metric measurements display (cm)
- Automatic image loading
- Conditional coloring (red for defects, green for value)
- Responsive KPI card grid (8 cards in one row)
- Clean, professional UI without unnecessary decorations
- Smooth slide animations for Sheet component
- Batch-specific grade name resolution
- French character encoding fixes

## Testing Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # Linting
npm run typecheck    # Type checking (if available)
```

## Known Issues & TODOs
- Backend pagination not working properly (using client-side pagination as workaround)
- Bundles endpoint returns 404 (feature may not be implemented)
- Legacy API sends incorrect character encoding for French text
- Some boards show `gradeId: null` even when failed all validations

## Dependencies Added
- `radix-vue` - UI primitives including Sheet/Dialog components
- `@vueuse/core` - Vue composition utilities
- Various Lucide icons for consistent iconography

## Environment Variables
Check `.env.local` for:
- `VITE_API_BASE_URL` - Backend API URL
- Other environment-specific settings

## Important Files
- `/src/services/api-adapter.ts` - API integration layer with UTF-8 encoding
- `/src/views/BoardFinder.vue` - Main board finder interface with grade mapping
- `/src/components/ui/sheet*.vue` - Sheet UI components with animations
- `/vercel.json` - Deployment configuration
- `/tailwind.config.js` - Contains animation keyframes for Sheet

## Deployment
Currently deployed on Vercel with API proxy configuration to handle CORS issues with the legacy backend.

## Grade System Understanding
- **Standard Grades**: General grades (AW, AR, BW, BR, CW, CR, Rebut)
- **Custom Grade Assignments**: Order-specific instances with unique IDs (575-581 for order 84)
- **Validation**: Each board is tested against all order grades
- **Assignment**: Final grade assigned based on validation results
- **Rebut**: Reject grade when board fails all other grades
- **Note**: API uses "batch" terminology, but UI displays "order"

---
*Last updated: 2025-08-13 (Terminology Update - Batch → Order)*

### Session: 2025-08-12 (Late Evening Update)
**Critical Fix Applied:**
1. **Vue Lifecycle Hook Warnings Fixed**:
   - Fixed `onMounted`/`onUnmounted` warnings that were preventing board loading
   - Issue: Using `async` directly in `onMounted` callback causes Vue lifecycle problems
   - Solution: Wrapped async operations in inner function within `onMounted`
   - Fixed in both `BoardFinder.vue` and `lazy-image.vue` components
   - This resolves the Firefox normal mode vs private mode issue

2. **Root Cause Identified**:
   - Firefox normal mode was caching the failed component state
   - Vue lifecycle warnings were preventing proper component initialization
   - Private mode worked because it bypassed the cached failed state
   - Backend 500 errors are intermittent but not the primary cause