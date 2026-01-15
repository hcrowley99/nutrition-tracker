/**
 * Nutrition Data Validation Utility
 *
 * Uses the Atwater formula to cross-check reported calories against macronutrients.
 * Filters out foods with suspicious/inaccurate nutritional data.
 */

/**
 * Calculate expected calories using the Atwater formula
 * Calories = (Protein × 4) + (Carbs × 4) + (Fat × 9)
 *
 * @param {number} protein - Protein in grams
 * @param {number} carbs - Carbohydrates in grams
 * @param {number} fat - Fat in grams
 * @returns {number} - Expected calories
 */
export function calculateExpectedCalories(protein, carbs, fat) {
  return (protein * 4) + (carbs * 4) + (fat * 9);
}

/**
 * Validate a food entry's nutritional data
 * Returns an object with validation status and reason if invalid
 *
 * @param {Object} food - Food object with calories, protein, carbs, fat
 * @returns {Object} - { isValid: boolean, reason?: string }
 */
export function validateFoodData(food) {
  const { calories, protein, carbs, fat } = food;

  // Skip validation if we don't have enough data
  if (calories === 0 && protein === 0 && carbs === 0 && fat === 0) {
    return { isValid: true, reason: 'No nutrition data' };
  }

  // Sanity check 1: Calories per 100g should not exceed ~900 (pure fat)
  // Most foods are normalized to 100g serving in USDA data
  if (calories > 900) {
    return {
      isValid: false,
      reason: `Calories too high (${calories}): exceeds maximum possible (~900 for pure fat)`
    };
  }

  // Sanity check 2: Macro totals should not exceed 100g per 100g serving
  const totalMacros = protein + carbs + fat;
  if (totalMacros > 105) { // Allow small tolerance for rounding
    return {
      isValid: false,
      reason: `Macro totals exceed 100g (${totalMacros.toFixed(1)}g)`
    };
  }

  // Sanity check 3: Atwater cross-check
  // Calculate expected calories from macros and compare to reported calories
  const expectedCalories = calculateExpectedCalories(protein, carbs, fat);

  // Allow for some variance (fiber, rounding, different Atwater factors)
  // Use 30% tolerance - some variance is expected due to different calculation methods
  const tolerance = 0.30;
  const lowerBound = expectedCalories * (1 - tolerance);
  const upperBound = expectedCalories * (1 + tolerance);

  // Only flag if calories are significantly higher than expected
  // (Lower calories could be due to fiber adjustment, which is valid)
  if (calories > upperBound && expectedCalories > 20) {
    return {
      isValid: false,
      reason: `Calories (${calories}) significantly higher than expected from macros (${Math.round(expectedCalories)})`
    };
  }

  // Sanity check 4: If we have significant macros but near-zero calories
  if (expectedCalories > 50 && calories < expectedCalories * 0.3) {
    return {
      isValid: false,
      reason: `Calories (${calories}) too low for macros (expected ~${Math.round(expectedCalories)})`
    };
  }

  return { isValid: true };
}

/**
 * Filter an array of foods, removing entries with invalid nutritional data
 *
 * @param {Array} foods - Array of food objects
 * @param {Object} options - Filtering options
 * @param {boolean} options.logFiltered - Whether to log filtered items (default: false)
 * @returns {Array} - Filtered array of valid foods
 */
export function filterInvalidFoods(foods, options = {}) {
  const { logFiltered = false } = options;

  return foods.filter(food => {
    const validation = validateFoodData(food);

    if (!validation.isValid && logFiltered) {
      console.warn(`Filtered out "${food.name}": ${validation.reason}`);
    }

    return validation.isValid;
  });
}

/**
 * Get a confidence score for a food's nutritional data (0-100)
 * Higher scores indicate more reliable data
 *
 * @param {Object} food - Food object
 * @returns {number} - Confidence score 0-100
 */
export function getNutritionConfidence(food) {
  const { calories, protein, carbs, fat, dataType } = food;

  let score = 100;

  // Validate basic data
  const validation = validateFoodData(food);
  if (!validation.isValid) {
    return 0; // Invalid data gets zero confidence
  }

  // Check Atwater alignment (how close are reported calories to calculated?)
  const expectedCalories = calculateExpectedCalories(protein, carbs, fat);
  if (expectedCalories > 0) {
    const percentDiff = Math.abs(calories - expectedCalories) / expectedCalories;
    // Deduct points for larger differences
    score -= Math.min(30, percentDiff * 100);
  }

  // Data type scoring
  // Foundation and SR Legacy are most reliable
  if (dataType === 'Foundation' || dataType === 'SR Legacy') {
    score += 10;
  } else if (dataType === 'Survey (FNDDS)') {
    score += 5;
  } else if (dataType === 'Branded') {
    score -= 5; // Branded data is less verified
  }

  // Cap score at 100
  return Math.max(0, Math.min(100, Math.round(score)));
}
