/**
 * Goal Calculations Utility
 * Implements Mifflin-St Jeor formula for BMR/TDEE and macro distribution presets
 */

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor equation
 * Most accurate modern formula for estimating resting metabolism
 *
 * @param {number} weightKg - Weight in kilograms
 * @param {number} heightCm - Height in centimeters
 * @param {number} age - Age in years
 * @param {string} sex - 'male' or 'female'
 * @returns {number} BMR in calories per day
 */
export function calculateBMR(weightKg, heightCm, age, sex) {
  const baseBMR = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
  const sexModifier = sex === 'male' ? 5 : -161;
  return Math.round(baseBMR + sexModifier);
}

/**
 * Calculate Total Daily Energy Expenditure
 *
 * @param {number} bmr - Basal Metabolic Rate (from calculateBMR)
 * @param {string} activityLevel - Activity level key
 * @returns {number} TDEE in calories per day
 */
export function calculateTDEE(bmr, activityLevel) {
  const activityMultipliers = {
    sedentary: 1.2,      // Little or no exercise
    light: 1.375,        // Light exercise 1-3 days/week
    moderate: 1.55,      // Moderate exercise 3-5 days/week
    active: 1.725,       // Hard exercise 6-7 days/week
    veryActive: 1.9,     // Very hard exercise & physical job or training twice per day
  };

  const multiplier = activityMultipliers[activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
}

/**
 * Calculate macro goals (protein, carbs, fat) based on calorie target and preset
 *
 * @param {number} calories - Target daily calories
 * @param {string} preset - Goal preset key (weightLoss, muscleGain, maintenance, balanced)
 * @returns {Object} Macro goals { protein, carbs, fat } in grams
 */
export function calculateMacros(calories, preset) {
  const presets = {
    weightLoss: { protein: 0.25, carbs: 0.45, fat: 0.30 },    // Higher protein for muscle preservation
    muscleGain: { protein: 0.25, carbs: 0.50, fat: 0.25 },    // High carbs for energy/recovery
    maintenance: { protein: 0.20, carbs: 0.50, fat: 0.30 },   // Balanced for general health
    balanced: { protein: 0.20, carbs: 0.50, fat: 0.30 },      // Same as maintenance
  };

  const ratios = presets[preset] || presets.balanced;

  // Convert calorie percentages to grams
  // Protein: 4 calories per gram
  // Carbohydrates: 4 calories per gram
  // Fat: 9 calories per gram
  return {
    protein: Math.round((calories * ratios.protein) / 4),
    carbs: Math.round((calories * ratios.carbs) / 4),
    fat: Math.round((calories * ratios.fat) / 9),
  };
}

/**
 * Calculate calorie target based on goal type
 *
 * @param {number} tdee - Total Daily Energy Expenditure
 * @param {string} goalType - Goal type key (weightLoss, muscleGain, maintenance, balanced)
 * @returns {number} Target calories per day
 */
export function calculateCalorieTarget(tdee, goalType) {
  const adjustments = {
    weightLoss: -500,    // 500 calorie deficit (1 lb per week loss)
    muscleGain: 300,     // 300 calorie surplus (conservative lean gain)
    maintenance: 0,      // Maintain current weight
    balanced: 0,         // Same as maintenance
  };

  return tdee + (adjustments[goalType] || 0);
}

/**
 * Activity level options with descriptions
 */
export const ACTIVITY_LEVELS = [
  {
    key: 'sedentary',
    label: 'Sedentary',
    description: 'Little or no exercise',
    multiplier: 1.2,
  },
  {
    key: 'light',
    label: 'Lightly Active',
    description: 'Light exercise 1-3 days/week',
    multiplier: 1.375,
  },
  {
    key: 'moderate',
    label: 'Moderately Active',
    description: 'Moderate exercise 3-5 days/week',
    multiplier: 1.55,
  },
  {
    key: 'active',
    label: 'Very Active',
    description: 'Hard exercise 6-7 days/week',
    multiplier: 1.725,
  },
  {
    key: 'veryActive',
    label: 'Extra Active',
    description: 'Very hard exercise & physical job',
    multiplier: 1.9,
  },
];

/**
 * Goal presets with macro ratios and descriptions
 */
export const GOAL_PRESETS = [
  {
    key: 'weightLoss',
    label: 'Weight Loss',
    emoji: '🎯',
    description: '25% protein, 45% carbs, 30% fat',
    detail: '500 calorie deficit for steady fat loss',
  },
  {
    key: 'muscleGain',
    label: 'Muscle Gain',
    emoji: '💪',
    description: '25% protein, 50% carbs, 25% fat',
    detail: '300 calorie surplus for lean muscle growth',
  },
  {
    key: 'maintenance',
    label: 'Maintenance',
    emoji: '⚖️',
    description: '20% protein, 50% carbs, 30% fat',
    detail: 'Maintain current weight and composition',
  },
  {
    key: 'balanced',
    label: 'Balanced',
    emoji: '🌟',
    description: '20% protein, 50% carbs, 30% fat',
    detail: 'Well-rounded nutrition for general health',
  },
];
