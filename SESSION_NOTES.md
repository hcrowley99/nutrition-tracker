# Nutrition Tracker - Session Notes

## Current Status (January 2026)

### App Overview
- **Live URL:** https://hanks-nutrition-tracker.netlify.app/
- **GitHub:** https://github.com/hcrowley99/nutrition-tracker
- **Tech Stack:** React + Vite, Tailwind CSS, USDA FoodData Central API, Open Food Facts (barcode)
- **Deployment:** Netlify (auto-deploys from GitHub main branch)

### Recently Implemented Features (This Session)

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
'logged-foods'       // All logged food entries
'user-metrics'       // Body metrics for goal calculator
'recent-foods'       // Last 10 recently added foods
```

### Known Working Features
- ✅ Food search (USDA database)
- ✅ Custom food entry
- ✅ Barcode scanning (Open Food Facts)
- ✅ Daily progress tracking with calorie ring
- ✅ Weekly/monthly summary views
- ✅ Date navigation
- ✅ Goals setting (manual + calculator)
- ✅ Recent foods quick-add
- ✅ Copy from prior days
- ✅ Unit conversion
- ✅ Apple-inspired design throughout

## Potential Future Enhancements

### Not Yet Implemented
- [ ] Meal planning feature
- [ ] Recipe builder
- [ ] Weight tracking over time
- [ ] Historical charts/graphs
- [ ] Photo logging
- [ ] Multi-device sync (requires backend)
- [ ] Micronutrients tracking beyond fiber
- [ ] Favorite foods (star system)
- [ ] Meal templates (breakfast, lunch, dinner presets)
- [ ] Water intake tracking
- [ ] Export data to CSV/PDF

### Possible Improvements
- [ ] Dark mode toggle
- [ ] Offline mode with service worker
- [ ] Better error handling for API failures
- [ ] Loading skeletons instead of spinners
- [ ] Undo/redo for deletions
- [ ] Search within recent foods
- [ ] Filter copy modal by meal type
- [ ] Bulk edit quantities
- [ ] Food notes/tags

## Testing Needed

### Features to Verify on iPhone
1. **Barcode Scanner:** Point at product barcode (UPC-A/EAN-13)
2. **Goal Calculator:** Complete all 3 steps with sample data
3. **Recent Foods:** Add 5+ foods, verify they appear
4. **Copy Function:** Log foods on multiple days, copy between dates
5. **Unit Conversion:** Try g→oz, ml→cups conversions

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
│   ├── BarcodeScanner.jsx       [Fixed barcode detection]
│   ├── CalorieRing.jsx           [SVG circular progress]
│   ├── CopyFromDay.jsx           [NEW - Copy foods modal]
│   ├── CustomFoodEntry.jsx       [Manual food entry]
│   ├── DailyProgress.jsx         [Calorie ring + macros]
│   ├── FoodList.jsx              [Today's logged foods]
│   ├── FoodLogger.jsx            [Updated - Unit conversion]
│   ├── FoodSearch.jsx            [Updated - Recent foods]
│   ├── GoalCalculator.jsx        [NEW - 3-step calculator]
│   ├── GoalsSetting.jsx          [Updated - Calculator button]
│   └── SummaryView.jsx           [Weekly/monthly stats]
├── hooks/
│   ├── useFoodSearch.js          [Debounced USDA search]
│   └── useLocalStorage.js        [Persist to localStorage]
├── utils/
│   ├── api.js                    [USDA + Open Food Facts]
│   ├── calculations.js           [Nutrition math]
│   ├── goalCalculations.js       [NEW - BMR/TDEE formulas]
│   ├── recentFoods.js            [NEW - Recent foods manager]
│   └── unitConversions.js        [NEW - Unit conversion]
└── App.jsx                       [Main - Updated with new features]
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
January 13, 2026
