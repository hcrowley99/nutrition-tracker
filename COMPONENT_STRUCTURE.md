# Barcode Scanner Component Structure

## Visual Component Hierarchy

```
App.jsx
├── Header
│   └── "Set Goals" Button
├── Main Content
│   ├── DailyProgress Component
│   ├── FoodSearch Component
│   ├── Action Buttons
│   │   ├── "Scan Barcode" Button ← NEW
│   │   └── "Add Custom Food" Button
│   └── FoodList Component
└── Modals (Conditional Rendering)
    ├── GoalsSetting Modal
    ├── CustomFoodEntry Modal
    ├── BarcodeScanner Modal ← NEW
    │   ├── Modal Header
    │   │   ├── Title: "Scan Barcode"
    │   │   └── Close Button (×)
    │   ├── Instructions Banner
    │   ├── Camera Preview Container
    │   │   ├── Video Element (from html5-qrcode)
    │   │   ├── Scanning Overlay
    │   │   └── Loading Overlay (when looking up)
    │   ├── Status Messages
    │   │   ├── Error Message (red)
    │   │   └── Success Message (green)
    │   ├── Close Button
    │   └── Help Text
    └── FoodLogger Modal
        └── (Shows after successful scan)
```

## State Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         App.jsx State                        │
├─────────────────────────────────────────────────────────────┤
│ • showBarcodeScanner: false → true → false                  │
│ • selectedFood: null → {food object} → null                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  User Clicks "Scan Barcode"                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              setShowBarcodeScanner(true)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 BarcodeScanner Component                     │
│                                                              │
│  State:                                                      │
│  • isScanning: false → true                                 │
│  • isLoading: false → true → false                          │
│  • error: null | string                                     │
│  • lastScannedCode: null | string                           │
│                                                              │
│  useEffect: Initialize camera                               │
│  ├─ Request permission                                      │
│  ├─ Get cameras                                             │
│  ├─ Select back camera                                      │
│  └─ Start scanning                                          │
│                                                              │
│  onScanSuccess(barcode):                                    │
│  ├─ Pause scanner                                           │
│  ├─ setIsLoading(true)                                      │
│  ├─ Call lookupFoodByBarcode(barcode)                       │
│  ├─ If found: onFoodFound(food)                             │
│  └─ If not: setError() & resume                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              lookupFoodByBarcode(barcode)                    │
│                    (in api.js)                               │
│                                                              │
│  1. Fetch from Open Food Facts                              │
│     GET https://world.openfoodfacts.net/api/v2/product/...  │
│                                                              │
│  2. Parse response                                           │
│     • Check status (0 or 1)                                 │
│     • Extract product data                                  │
│     • Extract nutriments                                    │
│                                                              │
│  3. Normalize to app format                                 │
│     return {                                                 │
│       fdcId: "OFF-{barcode}",                               │
│       name: product_name,                                   │
│       brandName: brands,                                    │
│       calories: nutriments.energy-kcal_100g,                │
│       protein: nutriments.proteins_100g,                    │
│       carbs: nutriments.carbohydrates_100g,                 │
│       fat: nutriments.fat_100g,                             │
│       fiber: nutriments.fiber_100g,                         │
│       servingSize: serving_quantity,                        │
│       servingUnit: serving_quantity_unit,                   │
│       dataType: "Barcode"                                   │
│     }                                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│           handleBarcodeScanned(food) in App.jsx              │
│                                                              │
│  • setShowBarcodeScanner(false)  ← Close scanner            │
│  • setSelectedFood(food)         ← Open FoodLogger          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   FoodLogger Modal Opens                     │
│                                                              │
│  Shows:                                                      │
│  • Product name and brand                                   │
│  • Serving size input                                       │
│  • Calculated nutrition preview                             │
│  • "Add to Log" button                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              User Adjusts Quantity & Clicks "Add"            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  handleAddFood(loggedFood)                   │
│                                                              │
│  • Add to loggedFoods array                                 │
│  • Save to localStorage                                     │
│  • setSelectedFood(null)  ← Close FoodLogger                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Food Added to Daily Log                    │
│               (Updates DailyProgress & FoodList)             │
└─────────────────────────────────────────────────────────────┘
```

## Error Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    BarcodeScanner Open                       │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│ Camera       │    │ Barcode Not      │    │ API Error    │
│ Permission   │    │ Found in         │    │ or Network   │
│ Denied       │    │ Database         │    │ Failure      │
└──────────────┘    └──────────────────┘    └──────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│ Show Error:  │    │ Show Error:      │    │ Show Error:  │
│ "Camera      │    │ "Barcode         │    │ "Failed to   │
│ permission   │    │ 123456 not       │    │ look up      │
│ denied..."   │    │ found..."        │    │ barcode..."  │
└──────────────┘    └──────────────────┘    └──────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│ Scanner      │    │ Scanner          │    │ Scanner      │
│ Stopped      │    │ Continues        │    │ Continues    │
│              │    │ Running          │    │ Running      │
└──────────────┘    └──────────────────┘    └──────────────┘
        │                     │                     │
        ▼                     │                     │
┌──────────────┐             │                     │
│ User Must    │             │                     │
│ Close &      │             │                     │
│ Fix Issue    │             │                     │
└──────────────┘             │                     │
                             ▼                     ▼
                   ┌──────────────────────────────────┐
                   │ User Can Try Another Barcode     │
                   │ or Close Scanner                 │
                   └──────────────────────────────────┘
```

## File Dependencies

```
/src/
├── App.jsx
│   ├── imports BarcodeScanner
│   ├── imports FoodLogger
│   └── manages state flow
│
├── components/
│   ├── BarcodeScanner.jsx
│   │   ├── imports { Html5Qrcode } from 'html5-qrcode'
│   │   ├── imports { lookupFoodByBarcode } from '../utils/api'
│   │   └── exports default BarcodeScanner
│   │
│   └── FoodLogger.jsx
│       ├── receives food prop from App
│       └── handles quantity adjustment
│
└── utils/
    └── api.js
        ├── exports searchFoods() [existing]
        ├── exports getFoodDetails() [existing]
        ├── exports isApiConfigured() [existing]
        └── exports lookupFoodByBarcode() [NEW]
            └── calls Open Food Facts API
```

## Props Interface

### BarcodeScanner Component

```typescript
interface BarcodeScannerProps {
  onFoodFound: (food: FoodObject) => void;  // Called when barcode found
  onClose: () => void;                       // Called when user closes scanner
}

interface FoodObject {
  fdcId: string;           // e.g., "OFF-3017620422003"
  name: string;            // e.g., "Nutella"
  brandName: string | null; // e.g., "Ferrero"
  calories: number;        // per 100g or per serving
  protein: number;         // grams
  carbs: number;           // grams
  fat: number;             // grams
  fiber: number;           // grams
  servingSize: number;     // e.g., 15
  servingUnit: string;     // e.g., "g"
  dataType: string;        // "Barcode"
  barcode?: string;        // Original barcode
  imageUrl?: string | null; // Product image
}
```

### App.jsx Handlers

```javascript
// Opens BarcodeScanner modal
const handleBarcodeClick = () => {
  setShowBarcodeScanner(true);
};

// Called by BarcodeScanner when food is found
const handleBarcodeScanned = (food) => {
  setShowBarcodeScanner(false);  // Close scanner
  setSelectedFood(food);          // Open FoodLogger
};

// Called by BarcodeScanner when user closes
const handleScannerClose = () => {
  setShowBarcodeScanner(false);
};
```

## CSS/Styling Classes

```css
/* Modal backdrop */
.fixed.inset-0.bg-black.bg-opacity-90

/* Modal container */
.bg-white.rounded-lg.shadow-xl.max-w-2xl.w-full.p-6

/* Scan Barcode button */
.bg-purple-600.hover:bg-purple-700

/* Camera preview container */
#barcode-reader (div with min-height 400px)

/* Loading overlay */
.absolute.inset-0.bg-black.bg-opacity-60

/* Error message */
.bg-red-50.border.border-red-200.text-red-800

/* Success message */
.bg-green-50.text-green-800

/* Camera icon SVG */
.w-5.h-5 (24x24px camera icon)
```

## Key HTML5/Browser APIs Used

1. **getUserMedia API**
   - Accesses device camera
   - Requires HTTPS
   - Requires user permission

2. **MediaDevices.enumerateDevices()**
   - Lists available cameras
   - Used to select back camera

3. **Fetch API**
   - Calls Open Food Facts API
   - Handles async requests

4. **localStorage**
   - Stores logged foods
   - Persists between sessions

## Integration Points

### 1. Scanner Button in App.jsx
```jsx
<button onClick={() => setShowBarcodeScanner(true)}>
  <svg>...</svg> Scan Barcode
</button>
```

### 2. Conditional Rendering
```jsx
{showBarcodeScanner && (
  <BarcodeScanner
    onFoodFound={handleBarcodeScanned}
    onClose={() => setShowBarcodeScanner(false)}
  />
)}
```

### 3. Food Data Handoff
```jsx
// Scanner finds food → passes to App → opens FoodLogger
BarcodeScanner → onFoodFound(food) → setSelectedFood(food) → FoodLogger
```

## Summary

The barcode scanner integrates seamlessly into the existing app architecture by:
- Following the modal pattern used by other components
- Reusing the FoodLogger component for quantity adjustment
- Using the same food data structure as USDA search
- Maintaining consistent state management patterns
- Matching the existing UI/UX design language
