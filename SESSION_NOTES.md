# MaddiGPT - Session Notes

## Current Status (January 2026)

### App Overview
- **App Name:** MaddiGPT
- **Live URL:** https://hanks-nutrition-tracker.netlify.app/
- **GitHub:** https://github.com/hcrowley99/nutrition-tracker
- **Tech Stack:** React + Vite, Tailwind CSS, USDA FoodData Central API, Open Food Facts (barcode)
- **Deployment:** Netlify (auto-deploys from GitHub main branch)

### January 14, 2026 Session

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
'logged-foods'       // All logged food entries
'user-metrics'       // Body metrics for goal calculator
'recent-foods'       // Last 10 recently added foods
```

### Known Working Features
- ✅ Food search (USDA database) with smart ranking
- ✅ Category filters (Generic/Branded)
- ✅ Quick portion presets & stepper buttons
- ✅ Custom food entry
- ✅ Barcode scanning (Open Food Facts)
- ✅ Daily progress tracking with calorie ring
- ✅ Weekly/monthly summary views
- ✅ Date navigation
- ✅ Goals setting (calculator default, imperial/metric toggle)
- ✅ Recent foods quick-add
- ✅ Popular foods suggestions
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
2. **Goal Calculator:** Verify opens by default, test imperial/metric toggle
3. **Recent Foods:** Add 5+ foods, verify they appear
4. **Copy Function:** Log foods on multiple days, copy between dates
5. **Unit Conversion:** Try g→oz, ml→cups conversions
6. **Portion Presets:** Tap preset buttons, verify quantity updates
7. **Stepper Buttons:** Use +/- to adjust amounts
8. **Category Filters:** Search "chicken", toggle Generic/Branded filters
9. **Popular Foods:** Clear search, tap a suggested food chip
10. **Food Titles:** Verify food names show in Today's Foods list

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
│   ├── BarcodeScanner.jsx       [Barcode detection]
│   ├── CalorieRing.jsx           [SVG circular progress]
│   ├── CopyFromDay.jsx           [Copy foods modal]
│   ├── CustomFoodEntry.jsx       [Manual food entry]
│   ├── DailyProgress.jsx         [Calorie ring + macros]
│   ├── FoodList.jsx              [Today's logged foods - fixed title]
│   ├── FoodLogger.jsx            [Portion presets, steppers, unit conversion]
│   ├── FoodSearch.jsx            [Search, filters, recent foods, popular suggestions]
│   ├── GoalCalculator.jsx        [3-step calculator, imperial/metric toggle]
│   ├── GoalsSetting.jsx          [Calculator opens by default]
│   └── SummaryView.jsx           [Weekly/monthly stats]
├── hooks/
│   ├── useFoodSearch.js          [Search with ranking, 300ms debounce]
│   └── useLocalStorage.js        [Persist to localStorage]
├── utils/
│   ├── api.js                    [USDA + Open Food Facts]
│   ├── calculations.js           [Nutrition math]
│   ├── goalCalculations.js       [BMR/TDEE formulas]
│   ├── portionPresets.js         [Smart portion presets + step sizes]
│   ├── recentFoods.js            [Recent foods manager]
│   ├── searchRanking.js          [Relevance scoring for search]
│   └── unitConversions.js        [Unit conversion logic]
└── App.jsx                       [Main app - MaddiGPT branding]
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
January 14, 2026
