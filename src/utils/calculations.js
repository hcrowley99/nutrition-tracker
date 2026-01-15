/**
 * Calculate total nutrients for all foods logged on a specific date
 *
 * @param {Array} loggedFoods - Array of all logged food entries
 * @param {string} date - Date string in YYYY-MM-DD format
 * @returns {Object} - Totals for calories, protein, carbs, fat, fiber
 */
export function calculateDailyTotals(loggedFoods, date) {
  // Filter foods for the specific date
  const foodsForDate = loggedFoods.filter(food => food.date === date);

  // Sum up all nutrients (already adjusted for quantity when logged)
  const totals = foodsForDate.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fat: acc.fat + food.fat,
      fiber: acc.fiber + (food.fiber || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  return totals;
}

/**
 * Compare daily totals against goals and calculate progress percentages
 *
 * @param {Object} totals - Current day's totals
 * @param {Object} goals - Target goals
 * @returns {Object} - Progress percentages for each nutrient
 */
export function calculateProgress(totals, goals) {
  return {
    calories: goals.calories > 0 ? (totals.calories / goals.calories) * 100 : 0,
    protein: goals.protein > 0 ? (totals.protein / goals.protein) * 100 : 0,
    carbs: goals.carbs > 0 ? (totals.carbs / goals.carbs) * 100 : 0,
    fat: goals.fat > 0 ? (totals.fat / goals.fat) * 100 : 0,
    fiber: goals.fiber > 0 ? (totals.fiber / goals.fiber) * 100 : 0,
  };
}

/**
 * Calculate nutrients for a specific portion of food
 *
 * @param {Object} foodData - Food nutrition data (per serving)
 * @param {number} quantity - Multiplier for the serving (e.g., 1.5 servings)
 * @returns {Object} - Adjusted nutrition values
 */
export function calculatePortionNutrients(foodData, quantity) {
  return {
    calories: Math.round(foodData.calories * quantity),
    protein: Math.round(foodData.protein * quantity * 10) / 10, // Round to 1 decimal
    carbs: Math.round(foodData.carbs * quantity * 10) / 10,
    fat: Math.round(foodData.fat * quantity * 10) / 10,
    fiber: Math.round((foodData.fiber || 0) * quantity * 10) / 10,
  };
}

/**
 * Get today's date in YYYY-MM-DD format (using local time)
 *
 * @returns {string} - Today's date
 */
export function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a date string to display format (e.g., "Monday, Jan 12")
 *
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} - Formatted date
 */
export function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00'); // Add time to avoid timezone issues
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
}
