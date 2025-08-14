# Missing API Endpoints Documentation

## CRITICAL: Board Pricing Data (2025-08-14)
**Issue**: No pricing/value data provided by API for boards
**Current Behavior**: 
- Board objects don't include `price` or `value` fields
- Cannot display board monetary value to users
- Client-side calculations removed to support multiple customer pricing models

**Required**:
- Each board should include a `price` or `value` field from the backend
- Price should be calculated server-side based on:
  - Customer-specific pricing rules
  - Grade quality
  - Board volume/dimensions
  - Market conditions
- Currency should be configurable per customer (EUR for current customer)

**Example API Response**:
```json
{
  "id": 106760,
  "gradeId": 575,
  "price": 125.50,  // Server-calculated price
  "currency": "EUR", // Customer-specific currency
  "pricePerM3": 850, // Optional: unit price for transparency
  ...
}
```

## High-Resolution Board Images

### Investigation Results (2025-08-14)
Checked for high-resolution image endpoints and found:

1. **Current images ARE already high-resolution**:
   - Standard images: 9336x693 pixels
   - Both `url` and `annotatedUrl` serve the same resolution
   - The `h600_` prefix in annotatedUrl doesn't reduce quality

2. **No HD/fullres endpoints available**:
   - Tested patterns: `/hd`, `/fullres`, `/original`, `hd_`, `original_`
   - All return 404 errors

3. **Current Solution**:
   - Images are already HD quality (9336x693)
   - BoardViewer includes a **Magnifier feature** for zooming
   - Enable via "Enable Magnifier" button in BoardInspector

### Conclusion
No additional HD endpoints needed - current images are already maximum resolution.

## CRITICAL: Clean Board Images (2025-08-14)
**Issue**: No endpoint provides clean board images without defects
**Current Behavior**: 
- `/ui/images/render/board/{id}/face{n}/original` returns images WITH defects already drawn
- `?annotations=false` parameter returns 406 Not Acceptable  
- `/clean`, `/raw`, `/base` endpoints all return 406
- Board data contains `url` and `annotatedUrl` fields but both paths return 404

**Required**: 
- Endpoint that returns board images WITHOUT any defects drawn
- This is essential for the defect filtering feature to work properly
- Without clean images, we cannot implement proper defect toggling as designed

**Workaround**: Currently showing images with all defects visible (suboptimal)

## Current API Data Available
The `/api/legacy/batches` endpoint provides:
- `id`: Batch/Order ID
- `name`: Order name
- `status`: OPEN or CLOSED
- `specie`: Species object with id and name
- `dryStatus`: Dry status object with id and name
- `thickness`: Thickness object with id and name (in mm)
- `startDate`: Date string

## Missing Data/Endpoints Needed

### 1. Order Management
- **Customer Information**: Customer name, contact details
- **Order Volume**: Board feet or cubic meters for the order
- **Target Grade Mix**: Percentage breakdown of expected grades
- **Sorts/Bundles Configuration**: How boards should be sorted

### 2. Order Scheduling
- **Scheduled Time**: Start and end times for orders
- **Shift Information**: Which shift the order is assigned to
- **Operator Assignment**: Who is assigned to run the order
- **Order Priority**: For reordering and scheduling
- **Order Status Details**: More granular status (Scheduled, Ready, Pending Setup, etc.)

### 3. Real-time Production Metrics
- **Boards Scanned Count**: Number of boards processed in current order
- **Bundles Created**: Number of bundles/sorts created
- **Time Elapsed**: How long the order has been running
- **Estimated Time Remaining**: Based on volume and scan rate
- **Current Scan Rate**: Boards per minute/hour

### 4. Order Actions
- **Start Order**: Endpoint to start a scheduled order
- **Stop/Complete Order**: Endpoint to stop running order
- **Reorder/Reprioritize**: Endpoint to change order sequence
- **Edit Order**: Endpoint to modify order details

### 5. Historical Data
- **Past Orders**: Need status filter or separate endpoint for completed orders
- **Order Performance Metrics**: Actual vs target grade mix, efficiency metrics

## Suggested API Enhancements

### Enhanced Order Object
```json
{
  "id": 84,
  "name": "20250730-16-Hêtre-30",
  "customer": {
    "id": 1,
    "name": "Johnson Lumber Co.",
    "contact": "john@johnsonlumber.com"
  },
  "status": "RUNNING", // SCHEDULED, READY, RUNNING, PAUSED, COMPLETED
  "statusDetail": "In Progress",
  "priority": 1,
  "volume": {
    "value": 2500,
    "unit": "bf"
  },
  "targetGradeMix": [
    {"grade": "Prime", "percentage": 40},
    {"grade": "Select", "percentage": 35},
    {"grade": "Common", "percentage": 25}
  ],
  "schedule": {
    "startTime": "2025-07-30T08:00:00",
    "endTime": "2025-07-30T17:00:00",
    "shift": "Morning",
    "operator": {
      "id": 1,
      "name": "John Doe"
    }
  },
  "metrics": {
    "boardsScanned": 125,
    "bundlesCreated": 4,
    "timeElapsed": 3720, // seconds
    "estimatedTimeRemaining": 7080, // seconds
    "scanRate": 2.1 // boards per minute
  },
  "sorts": [
    {"id": 1, "name": "Prime", "targetCount": 100},
    {"id": 2, "name": "Select", "targetCount": 75}
  ]
}
```

### New Endpoints Needed
1. `GET /api/orders/running` - Get currently running order with live metrics
2. `GET /api/orders/scheduled` - Get upcoming scheduled orders
3. `POST /api/orders/{id}/start` - Start a scheduled order
4. `POST /api/orders/{id}/stop` - Stop/complete a running order
5. `PUT /api/orders/{id}/priority` - Update order priority/sequence
6. `GET /api/orders/{id}/metrics` - Get real-time metrics for an order

## Dashboard/Overview Page - Missing Endpoints

### 6. Production Metrics & KPIs
- **Total Value Processed**: Sum of monetary value of all processed boards (daily/weekly/monthly)
  - Used for: "Value Processed" KPI card
  - Need: Dollar amount and percentage change from previous period
  
- **Total Volume Processed**: Total cubic meters/board feet processed
  - Used for: "Volume Processed" KPI card  
  - Need: Volume amount and percentage change from previous period

- **Hourly Production Data**: Boards processed per hour for chart
  - Used for: "Boards Processed per Hour" chart
  - Need: Hourly breakdown by grade (Grade A, B, C counts)
  - Time range: Last 8-12 hours of production

### 7. Shift Management
- **Current Shift Status**: Information about active shift
  - Used for: Shift status badge
  - Need: Shift name, start/end time, operator on duty
  
- **Next Shift Schedule**: Upcoming shift information
  - Used for: "Next Shift" KPI card
  - Need: Shift name, scheduled start time

### 8. System Alerts & Notifications
- **Recent System Alerts**: Production issues, quality alerts, system notifications
  - Used for: System Alerts panel
  - Need: Alert type (warning/info/error), message, timestamp
  - Examples: Accuracy drops, grading rule changes, maintenance notices

### 9. Order Details for Dashboard
- **Board Count per Order**: Number of boards processed in each order
  - Used for: Recent Orders list
  - Need: Board count for each order ID
  
- **Order Value**: Monetary value of processed boards per order
  - Used for: Recent Orders list showing value
  - Need: Dollar amount per order
  
- **Order Accuracy**: Grading accuracy percentage
  - Used for: Recent Orders list showing accuracy
  - Need: Accuracy percentage per order

- **Customer Information**: Customer name for each order
  - Used for: Recent Orders list
  - Need: Customer name linked to order

### Suggested Dashboard API Endpoints

1. `GET /api/dashboard/kpis` - Get all KPI metrics
```json
{
  "valueProcessed": {
    "amount": 24680,
    "currency": "USD",
    "change": 8.2,
    "period": "daily"
  },
  "volumeProcessed": {
    "amount": 38.4,
    "unit": "m³",
    "change": 12.1,
    "period": "daily"
  },
  "totalOrders": 34,
  "activeShift": {
    "name": "Morning",
    "startTime": "07:00",
    "operator": "John Doe"
  },
  "nextShift": {
    "name": "Afternoon",
    "startTime": "15:00"
  }
}
```

2. `GET /api/dashboard/production-chart` - Hourly production data
```json
{
  "labels": ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM"],
  "datasets": [
    {
      "label": "Grade A",
      "data": [95, 145, 98, 45, 185, 95, 125, 165]
    },
    {
      "label": "Grade B", 
      "data": [35, 45, 42, 25, 55, 35, 45, 55]
    },
    {
      "label": "Grade C",
      "data": [25, 35, 28, 15, 35, 25, 35, 45]
    }
  ]
}
```

3. `GET /api/dashboard/alerts` - Recent system alerts
```json
{
  "alerts": [
    {
      "id": 1,
      "type": "warning",
      "title": "Accuracy Drop Detected",
      "message": "Batch #4872 showed 5% lower accuracy than average",
      "timestamp": "2025-01-13T14:30:00Z"
    },
    {
      "id": 2,
      "type": "info",
      "title": "New Grading Rule Added",
      "message": "Admin user added a new rule for knot detection",
      "timestamp": "2025-01-13T10:15:00Z"
    }
  ]
}
```

4. `GET /api/orders/{id}/summary` - Extended order information
```json
{
  "id": 84,
  "customer": "Johnson Lumber Co.",
  "boardCount": 125,
  "volume": "3.8 m³",
  "value": 2847,
  "accuracy": 92.1
}
```

## Line Check Dashboard - Missing Endpoints

### 10. Live Board Scanning Feed
- **Real-time Board Stream**: WebSocket or Server-Sent Events for live board updates
  - Used for: Live feed of boards as they're being scanned
  - Need: Real-time push of new board data as boards are scanned
  - Current workaround: Polling `/api/legacy/boards` endpoint every few seconds

- **Board Value**: Monetary value per board
  - Used for: Displaying value in board header
  - Need: Calculated value based on grade and dimensions

- **Timestamp of Scan**: Exact time when board was scanned
  - Used for: Showing scan time in live feed
  - Need: Timestamp field in board data

### Suggested Line Check API Endpoints

1. `GET /api/live/boards/stream` - WebSocket endpoint for live updates
```json
// WebSocket message format
{
  "type": "new_board",
  "board": {
    "id": 106762,
    "gradeId": 2,
    "gradeName": "Select",
    "orderId": 84,
    "value": 12.50,
    "scannedAt": "2025-01-13T18:39:00Z",
    "dimensions": {
      "length": 250,
      "width": 15,
      "thickness": 30
    }
  }
}
```

2. `GET /api/live/boards/recent?limit=10&since={timestamp}` - Get recent boards since timestamp
```json
{
  "boards": [
    {
      "id": 106762,
      "gradeId": 2,
      "gradeName": "Select",
      "orderId": 84,
      "value": 12.50,
      "scannedAt": "2025-01-13T18:39:00Z"
    }
  ],
  "hasMore": false
}
```

3. `GET /api/live/scanning/status` - Current scanning status
```json
{
  "isScanning": true,
  "currentOrder": {
    "id": 84,
    "name": "Red Oak Premium"
  },
  "scanRate": 12, // boards per minute
  "lastScanTime": "2025-01-13T18:39:00Z"
}
```

## Current Workarounds
- Dashboard shows "N/A" for all monetary values, volumes, and metrics
- Chart replaced with "No production data available" message
- System Alerts shows "No system alerts available"
- Recent Orders shows "N/A" for customer, board count, value, and accuracy
- Shift information hardcoded or shows "N/A"
- All trend indicators removed (no historical data for comparison)
- Line Check Dashboard uses polling instead of real-time updates
- Board values show "N/A" as not provided by API
- No WebSocket/SSE support for live board feed