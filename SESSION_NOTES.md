# MaddiGPT - Session Notes

## Current Status (January 2026)

### App Overview
- **App Name:** MaddiGPT
- **Live URL:** https://hanks-nutrition-tracker.netlify.app/
- **GitHub:** https://github.com/hcrowley99/nutrition-tracker
- **Tech Stack:** React + Vite, Tailwind CSS, USDA FoodData Central API, Open Food Facts (barcode)
- **Deployment:** Netlify (auto-deploys currently OFF to manage credits - manual deploy required)

### January 14, 2026 Session (Continued)

#### 11. Meal Categories ✅
- **Change:** Replaced single "Today's Foods" section with 4 meal categories
- **Categories:** Breakfast, Lunch, Dinner, Snacks
- **Each section shows:** Meal icon, calorie total, food list, "+ Add" button
- **Migration:** Existing foods without `meal` property default to Snacks
- **Files:**
  - `src/components/MealSection.jsx` - New reusable meal section component
  - `src/components/FoodList.jsx` - Now renders 4 MealSection components

#### 12. Add Food Page ✅
- **Change:** Replaced inline search + action buttons with full-page tabbed interface
- **Tabs:**
  - **Recent:** Last 10 recently added foods
  - **Search:** USDA database search with filters
  - **Scan:** Barcode scanner (camera)
  - **Custom:** Searchable list of saved custom foods + create new
  - **Copy:** Copy foods from previous days
- **Flow:** Tap "+ Add" on meal → Add Food page → Select food → Quantity modal → Returns to main view
- **File:** `src/components/AddFoodPage.jsx` - New tabbed page component

#### 13. Custom Foods List ✅
- **Feature:** Persistent storage of all custom foods ever created
- **Searchable:** Filter custom foods by name in the Custom tab
- **Storage:** localStorage (`custom-foods` key)
- **Files:**
  - `src/utils/customFoods.js` - New utility (getCustomFoods, addCustomFood, searchCustomFoods)
  - `src/components/CustomFoodEntry.jsx` - Now saves to custom foods list

#### 14. Nutrition Data Validation ✅
- **Issue:** Some USDA API entries have inaccurate calorie data (e.g., 874 cal/100g for lean lamb)
- **Solution:** Atwater formula cross-check (Calories ≈ P×4 + C×4 + F×9)
- **Filters out:** Foods where reported calories differ >30% from calculated
- **Also checks:** Calories >900/100g, macro totals >100g
- **File:** `src/utils/validateNutrition.js` - New validation utility

#### 15. Food Logger Improvements ✅
- **Modal width:** Increased from `max-w-md` to `max-w-lg` for better spacing
- **Unit switching:** Quantity now auto-converts when changing units (e.g., 100g → 3.53oz)
- **Display units:** Foods show in user-selected units in Today's Foods list
- **File:** `src/components/FoodLogger.jsx`

#### 16. Timezone Fix ✅
- **Issue:** Date showed next day after ~7pm EST (was using UTC)
- **Fix:** Changed all `toISOString()` calls to use local time components
- **Files:** `src/utils/calculations.js`, `src/App.jsx`, `src/components/CopyFromDay.jsx`, `src/components/SummaryView.jsx`

---

### January 14, 2026 Session (Earlier)

#### 1. App Rebranding ✅
- **Change:** Renamed app from "NutriTrack" to "MaddiGPT"
- **Files:** `src/App.jsx`, `index.html`

#### 2. Goal Calculator Improvements ✅
- **Change:** Goal Calculator now opens by default (instead of manual entry)
- **Feature:** Added imperial/metric unit toggle
- **Default:** Imperial units (lbs, ft/in)
- **Files:** `src/components/GoalCalculator.jsx`, `src/components/GoalsSetting.jsx`

#### 3. Food Title Fix ✅
- **Issue:** Today's Foods list only showed brand name, not food name
- **Fix:** Changed `food.foodName` to `food.name` in FoodList
- **File:** `src/components/FoodList.jsx`

#### 4. Seamless Food Logging ✅
Focused on making food logging more intuitive:

**Quick Portion Presets** (FoodLogger.jsx)
- Tap buttons for ½, 1, 1.5, 2 servings
- Smart presets based on unit type (4 oz, 100g, 1 cup, ½ cup)
- New file: `src/utils/portionPresets.js`

**Stepper Buttons** (FoodLogger.jsx)
- +/- buttons for easier quantity adjustment
- Smart step sizes: 10g for grams, 0.25 for cups, 0.5 for oz

**Category Filters** (FoodSearch.jsx)
- Filter chips: All | Generic | Branded
- Generic = USDA reference foods, Branded = commercial products

**Smart Search Ranking** (useFoodSearch.js)
- Results sorted by relevance
- Exact matches first, simpler names ranked higher
- New file: `src/utils/searchRanking.js`

**Popular Foods Suggestions** (FoodSearch.jsx)
- Empty state shows tappable chips: Chicken, Banana, Rice, Eggs, Oatmeal, Salmon
- One tap pre-fills search

**Faster Search**
- Reduced debounce from 500ms to 300ms

#### 5. Unit Conversion Improvements ✅
- **Issue:** USDA API returns non-standard unit codes (MLT, GRM, etc.)
- **Fix:** Added `normalizeUnit()` function with comprehensive alias mapping
- **Supported aliases:** grm→g, mlt→ml, oz/ounce→oz, plurals, etc.
- **File:** `src/utils/unitConversions.js`

#### 6. Dark Mode Conversion ✅
- **Change:** Converted entire UI to dark mode color scheme
- **Colors:** gray-800/900 backgrounds, white/gray-100 text, gray-700 inputs
- **Files:** All 13 components updated

#### 7. Modal Scrolling Fix ✅
- **Issue:** Modals were cut off on mobile devices
- **Fix:** Added `max-h-[90vh] overflow-y-auto` to all modal containers
- **Pattern:** Flex layout with `flex-shrink-0` on headers/footers

#### 8. Data Validation Precision ✅
- **Goals inputs:** Step changed to 0.1 for single decimal precision
- **Quantity inputs:** Step changed to 0.01 for two decimal precision

#### 9. Dark Mode Contrast Fix ✅
- **Issue:** Text in CustomFoodEntry inputs was black on dark background
- **Fix:** Added `text-white placeholder-gray-400` to all inputs
- **File:** `src/components/CustomFoodEntry.jsx`

#### 10. Calorie Doubling Bug Fix ✅
- **Issue:** Calorie ring showed 2x the correct value (e.g., 1748 instead of 874)
- **Root cause:** `calculateDailyTotals` multiplied by quantity, but nutrients were already pre-calculated in FoodLogger
- **Fix:** Removed redundant `* food.quantity` multiplication
- **File:** `src/utils/calculations.js`

---

### Previous Session Features

#### 1. Barcode Scanner Fix ✅
- **Issue:** Scanner wasn't detecting barcodes
- **Fix:** Updated to use proper Html5QrcodeSupportedFormats enum values
- **Files:** `src/components/BarcodeScanner.jsx`
- **Status:** Should now work correctly

#### 2. Goal Calculator ✅
- **Feature:** Calculate nutrition goals based on body metrics
- **Formula:** Mifflin-St Jeor (BMR/TDEE)
- **Presets:** Weight Loss, Muscle Gain, Maintenance, Balanced
- **Files:**
  - `src/utils/goalCalculations.js` - Formulas
  - `src/components/GoalCalculator.jsx` - 3-step wizard UI
  - `src/components/GoalsSetting.jsx` - Integration
- **Storage:** User metrics saved to localStorage (`user-metrics` key)

#### 3. Recent Foods ✅
- **Feature:** Last 10 recently added foods for quick re-adding
- **Display:** Shows when search is empty
- **Files:**
  - `src/utils/recentFoods.js` - Utility functions
  - `src/components/FoodSearch.jsx` - Display
  - `src/App.jsx` - Tracking in handleAddFood
- **Storage:** localStorage (`recent-foods` key)

#### 4. Copy from Prior Days ✅
- **Feature:** Copy foods from previous dates to current date
- **UI:** New "Copy" button in action buttons (3-column layout)
- **Files:**
  - `src/components/CopyFromDay.jsx` - Modal component
  - `src/App.jsx` - Integration and handler
- **Note:** Generates new IDs to avoid conflicts

#### 5. Unit Conversion ✅
- **Feature:** Convert serving sizes between compatible units
- **Supported:**
  - Weight: g ↔ oz ↔ lb ↔ kg
  - Volume: ml ↔ cup ↔ tbsp ↔ tsp ↔ fl oz ↔ l
- **Files:**
  - `src/utils/unitConversions.js` - Conversion logic
  - `src/components/FoodLogger.jsx` - UI integration
- **Display:** Shows real-time conversion and factor

### Design System
- **Style:** Apple Health-inspired with activity ring colors
- **Modals:** rounded-3xl, backdrop-blur-sm, animate-scale-in
- **Buttons:** Gradient primary (blue-to-cyan), border-2 secondary
- **Cards:** Gradient backgrounds, emojis for visual categorization
- **Font:** Inter (Google Fonts)

### LocalStorage Keys
```javascript
'nutrition-goals'    // Daily nutrition targets
'logged-foods'       // All logged food entries (now includes 'meal' property)
'user-metrics'       // Body metrics for goal calculator
'recent-foods'       // Last 10 recently added foods
'custom-foods'       // All custom food definitions (NEW)
```

### Known Working Features
- ✅ **Meal categories** (Breakfast, Lunch, Dinner, Snacks)
- ✅ **Add Food page** with tabbed interface (Recent, Search, Scan, Custom, Copy)
- ✅ **Custom foods list** - persistent, searchable collection
- ✅ **Nutrition validation** - filters inaccurate API data using Atwater formula
- ✅ Food search (USDA database) with smart ranking
- ✅ Category filters (Generic/Branded)
- ✅ Quick portion presets & stepper buttons
- ✅ Custom food entry
- ✅ Barcode scanning (Open Food Facts)
- ✅ Daily progress tracking with calorie ring
- ✅ Weekly/monthly summary views
- ✅ Date navigation (local timezone)
- ✅ Goals setting (calculator default, imperial/metric toggle)
- ✅ Recent foods quick-add
- ✅ Popular foods suggestions
- ✅ Copy from prior days
- ✅ Unit conversion (with auto-quantity adjustment)
- ✅ Apple-inspired design throughout
- ✅ Dark mode UI with proper contrast

## Potential Future Enhancements

### Not Yet Implemented
- [ ] Recipe builder
- [ ] Weight tracking over time
- [ ] Historical charts/graphs
- [ ] Photo logging
- [ ] Multi-device sync (requires backend)
- [ ] Micronutrients tracking beyond fiber
- [ ] Favorite foods (star system)
- [ ] Water intake tracking
- [ ] Export data to CSV/PDF

### Possible Improvements
- [ ] Light/dark mode toggle (currently dark mode only)
- [ ] Offline mode with service worker
- [ ] Better error handling for API failures
- [ ] Loading skeletons instead of spinners
- [ ] Undo/redo for deletions
- [ ] Bulk edit quantities
- [ ] Food notes/tags

## Testing Needed

### Features to Verify on iPhone
1. **Meal Sections:** Verify 4 meal categories display (Breakfast, Lunch, Dinner, Snacks)
2. **Add Food Page:** Tap "+ Add" on any meal, verify tabbed page opens
3. **Tab Navigation:** Test all 5 tabs (Recent, Search, Scan, Custom, Copy)
4. **Custom Foods:** Create a custom food, verify it appears in Custom tab
5. **Barcode Scanner:** Point at product barcode (UPC-A/EAN-13)
6. **Goal Calculator:** Verify opens by default, test imperial/metric toggle
7. **Recent Foods:** Add 5+ foods, verify they appear in Recent tab
8. **Copy Function:** Log foods on multiple days, copy between dates
9. **Unit Conversion:** Try g→oz, verify quantity auto-converts
10. **Date Display:** Verify correct local date (not UTC)

### Edge Cases to Test
- Empty states (no foods, no recent, no prior days)
- Large quantities (999+ servings)
- Very small quantities (0.01 servings)
- Foods with no compatible units (piece, serving, etc.)
- Rapid consecutive barcode scans
- Network offline behavior

## Common Issues & Solutions

### If Barcode Scanner Still Doesn't Work:
1. Check browser console for errors
2. Verify camera permissions are granted
3. Try different barcode types (UPC-A vs EAN-13)
4. Ensure good lighting and steady hand

### If Recent Foods Don't Show:
1. Check localStorage in browser DevTools
2. Verify foods are being added successfully
3. Clear search query to see recent foods

### If Unit Conversion Shows Wrong Values:
1. Verify source and target units are compatible
2. Check conversion factors in `unitConversions.js`
3. Ensure quantity calculation uses converted values

## File Structure Reference

```
src/
├── components/
│   ├── AddFoodPage.jsx           [NEW - Tabbed add food interface]
│   ├── BarcodeScanner.jsx        [Barcode detection]
│   ├── CalorieRing.jsx           [SVG circular progress]
│   ├── CopyFromDay.jsx           [Copy foods - integrated in AddFoodPage]
│   ├── CustomFoodEntry.jsx       [Manual food entry - saves to custom list]
│   ├── DailyProgress.jsx         [Calorie ring + macros]
│   ├── FoodList.jsx              [Renders 4 MealSection components]
│   ├── FoodLogger.jsx            [Portion presets, steppers, unit conversion]
│   ├── FoodSearch.jsx            [Search - integrated in AddFoodPage]
│   ├── GoalCalculator.jsx        [3-step calculator, imperial/metric toggle]
│   ├── GoalsSetting.jsx          [Calculator opens by default]
│   ├── MealSection.jsx           [NEW - Reusable meal category component]
│   └── SummaryView.jsx           [Weekly/monthly stats]
├── hooks/
│   ├── useFoodSearch.js          [Search with ranking, 300ms debounce]
│   └── useLocalStorage.js        [Persist to localStorage]
├── utils/
│   ├── api.js                    [USDA + Open Food Facts + validation]
│   ├── calculations.js           [Nutrition math, local timezone dates]
│   ├── customFoods.js            [NEW - Custom foods localStorage manager]
│   ├── goalCalculations.js       [BMR/TDEE formulas]
│   ├── portionPresets.js         [Smart portion presets + step sizes]
│   ├── recentFoods.js            [Recent foods manager]
│   ├── searchRanking.js          [Relevance scoring for search]
│   ├── unitConversions.js        [Unit conversion logic]
│   └── validateNutrition.js      [NEW - Atwater formula validation]
└── App.jsx                       [Main app - routing, meal context]
```

## API Keys & Environment
- **USDA API Key:** Stored in `.env.local` (gitignored)
- **Netlify Env Var:** `VITE_USDA_API_KEY` configured in Netlify dashboard
- **No API key needed:** Open Food Facts (barcode lookup)

## Git Workflow
```bash
# Make changes
git add .
git commit -m "Description"
git push origin main

# Netlify auto-deploys in 1-2 minutes
```

## Quick Start for Next Session
1. Pull latest from GitHub: `git pull origin main`
2. Install dependencies: `npm install` (if needed)
3. Run dev server: `npm run dev`
4. Check live site: https://hanks-nutrition-tracker.netlify.app/
5. Review this document for context
6. Check GitHub issues or plan document for next tasks

## Last Updated
January 14, 2026 (Evening Session)
