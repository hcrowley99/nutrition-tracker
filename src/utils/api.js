// Get API key from environment variables
const API_KEY = import.meta.env.VITE_USDA_API_KEY;
const BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

/**
 * Search for foods in the USDA database
 *
 * @param {string} query - Search term (e.g., "chicken breast")
 * @returns {Promise<Array>} - Array of food objects with nutrition info
 */
export async function searchFoods(query) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/foods/search?api_key=${API_KEY}&query=${encodeURIComponent(query)}&pageSize=25`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Simplify and standardize the response
    return data.foods.map(food => {
      // Helper function to find nutrient value
      const getNutrient = (nutrientName) => {
        const nutrient = food.foodNutrients?.find(n =>
          n.nutrientName === nutrientName
        );
        return nutrient?.value || 0;
      };

      return {
        fdcId: food.fdcId,
        name: food.description,
        brandName: food.brandName || food.brandOwner || null,
        // Nutrition per 100g or per serving
        calories: getNutrient('Energy'),
        protein: getNutrient('Protein'),
        carbs: getNutrient('Carbohydrate, by difference'),
        fat: getNutrient('Total lipid (fat)'),
        fiber: getNutrient('Fiber, total dietary'),
        servingSize: food.servingSize || 100,
        servingUnit: food.servingSizeUnit || 'g',
        dataType: food.dataType // Survey (FNDDS) or Branded
      };
    });
  } catch (error) {
    console.error('Error searching foods:', error);
    throw new Error('Failed to search foods. Please try again.');
  }
}

/**
 * Get detailed nutrition information for a specific food
 * (Currently we get enough info from search, but this is here for future use)
 *
 * @param {number} fdcId - Food Data Central ID
 * @returns {Promise<Object>} - Detailed food information
 */
export async function getFoodDetails(fdcId) {
  try {
    const response = await fetch(
      `${BASE_URL}/food/${fdcId}?api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching food details:', error);
    throw new Error('Failed to get food details. Please try again.');
  }
}

/**
 * Check if API key is configured
 *
 * @returns {boolean} - True if API key exists
 */
export function isApiConfigured() {
  return !!API_KEY && API_KEY.length > 0;
}
