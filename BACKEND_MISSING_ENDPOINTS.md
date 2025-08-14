# Missing Backend Endpoints Documentation

## Board Images with Defect Overlays

### Current Situation
The backend API returns board data with image URLs, but these images are not accessible (404 errors). The system needs proper image endpoints to display boards with defect overlay toggling functionality.

### Missing/Non-functional Endpoints

#### 1. Board Face Images (Clean - Without Defects)
**Current paths in API response that return 404:**
- `http://192.168.111.132:8082/processing/gateway/stitches/20250723/row1/{shotId}/{shotId}-1-0.jpg` (Face 1)
- `http://192.168.111.132:8082/processing/gateway/stitches/20250723/row2/{shotId}/{shotId}-2-0.jpg` (Face 2)

**Example:**
- Board ID 1: `gateway/stitches/20250723/row1/100/100-1-0.jpg` → 404
- Board ID 5: `gateway/stitches/20250723/row1/104/104-1-0.jpg` → 404

#### 2. Board Face Images with Defect Overlays (Annotated)
**Current paths in API response that return 404:**
- `http://192.168.111.132:8082/processing/gateway/stitches/20250723/row1/{shotId}/h600_{shotId}-1-0.jpg` (Face 1 with overlays)
- `http://192.168.111.132:8082/processing/gateway/stitches/20250723/row2/{shotId}/h600_{shotId}-2-0.jpg` (Face 2 with overlays)

**Example:**
- Board ID 1: `gateway/stitches/20250723/row1/100/h600_100-1-0.jpg` → 404
- Board ID 5: `gateway/stitches/20250723/row1/104/h600_104-1-0.jpg` → 404

#### 3. Render Endpoint (Partially Working)
**Current endpoint that returns 406 (Not Acceptable):**
- `/ui/images/render/board/{boardId}/face{faceNum}/original`

This endpoint exists but returns HTTP 406 error, possibly due to missing Accept headers or content negotiation issues.

### Required Functionality

For the defect toggle feature to work properly, we need:

1. **Clean Board Images**: Base images without any defect overlays
2. **Annotated Board Images**: Images with defect overlays drawn on them
3. **Dynamic Overlay Control**: Ideally, an endpoint that accepts parameters to show/hide specific defect types

### Proposed Solutions

#### Option 1: Fix Existing Endpoints
Make the following endpoints functional:
- Fix the `gateway/stitches/` paths to serve the actual image files
- Fix the `h600_` annotated versions to serve images with defect overlays

#### Option 2: Implement Dynamic Rendering
Create an endpoint that accepts parameters:
```
/api/boards/{boardId}/face{faceNum}/render?defects=Knot,Split,Wane
```
This would return an image with only the specified defects overlaid.

#### Option 3: Provide Defect Coordinates for Frontend Rendering
Since the API already provides defect polygon coordinates, the frontend could render defects as SVG overlays:
```json
{
  "face1": {
    "url": "path/to/clean/image.jpg",
    "defects": [
      {
        "name": "Knot",
        "color": "#FF0000",
        "defects": [
          {
            "points": [x1, y1, x2, y2, ...]
          }
        ]
      }
    ]
  }
}
```

### Current Workaround
The application currently uses the `/api/legacy/ui/images/render/board/{id}/face{1|2}/original` endpoint which partially works in BoardFinder, but this doesn't support defect overlay toggling.

### Data Available from API
The API correctly provides:
- Board metadata (ID, dimensions, grades, etc.)
- Defect data with names, colors, and polygon coordinates
- Image URLs (though they return 404)

### Next Steps
1. Backend team needs to ensure image files are accessible at the specified URLs
2. Implement either annotated image versions or a dynamic rendering endpoint
3. Or confirm that frontend should render defects using the provided polygon coordinates

## Order Status - Missing "PLANNED" Status

### Current Situation
The Orders page expects to show "Upcoming Orders" but the API only provides orders with statuses:
- **OPEN** - Currently in production
- **CLOSED** - Completed production

### Missing Status
- **PLANNED** or **SCHEDULED** - Orders that are scheduled but not yet started

### Current Data
```json
{
  "id": 84,
  "name": "20250730-16-Hêtre-30",
  "status": "OPEN",    // Only OPEN or CLOSED available
  "startDate": "2025-07-30",
  "closeDate": null    // Only present for CLOSED orders
}
```

### Required for Upcoming Orders Feature
To properly display upcoming/scheduled orders, the API needs to:
1. Add a "PLANNED" or "SCHEDULED" status for orders that are scheduled but not yet in production
2. Include scheduled start date/time for planned orders
3. Include estimated completion date/time

### Workaround Options
1. **Treat OPEN as Upcoming**: Display OPEN orders in the Upcoming Orders section (currently in production)
2. **Use Date Logic**: Orders with future `startDate` could be considered upcoming
3. **Request Backend Update**: Add proper PLANNED status to the order lifecycle

## Contact
For backend issues, coordinate with the API team to implement these missing endpoints.