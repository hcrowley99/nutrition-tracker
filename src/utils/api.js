import { normalizeUnit } from './unitConversions';
import { filterInvalidFoods } from './validateNutrition';

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
    const foods = data.foods.map(food => {
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
        servingUnit: normalizeUnit(food.servingSizeUnit) || 'g',
        dataType: food.dataType // Survey (FNDDS) or Branded
      };
    });

    // Filter out foods with invalid/suspicious nutritional data
    return filterInvalidFoods(foods, { logFiltered: true });
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

/**
 * Look up food by barcode using Open Food Facts API
 *
 * @param {string} barcode - UPC/EAN barcode number
 * @returns {Promise<Object|null>} - Food object with nutrition info or null if not found
 */
export async function lookupFoodByBarcode(barcode) {
  if (!barcode || barcode.trim().length === 0) {
    return null;
  }

  try {
    // Try Open Food Facts API first
    const offResponse = await fetch(
      `https://world.openfoodfacts.net/api/v2/product/${barcode}`
    );

    if (!offResponse.ok) {
      throw new Error(`API error: ${offResponse.status}`);
    }

    const offData = await offResponse.json();

    // Check if product was found
    if (offData.status === 0 || !offData.product) {
      return null;
    }

    const product = offData.product;

    // Extract nutrition data per 100g (Open Food Facts standard)
    const nutriments = product.nutriments || {};

    // Convert Open Food Facts data to our format
    return {
      fdcId: `OFF-${barcode}`,
      name: product.product_name || product.product_name_en || 'Unknown Product',
      brandName: product.brands || null,
      calories: Math.round(nutriments.energy_value || nutriments['energy-kcal_100g'] || 0),
      protein: Math.round(nutriments.proteins_100g || 0),
      carbs: Math.round(nutriments.carbohydrates_100g || 0),
      fat: Math.round(nutriments.fat_100g || 0),
      fiber: Math.round(nutriments.fiber_100g || 0),
      servingSize: product.serving_quantity || 100,
      servingUnit: normalizeUnit(product.serving_quantity_unit) || 'g',
      dataType: 'Barcode',
      barcode: barcode,
      imageUrl: product.image_url || null,
    };
  } catch (error) {
    console.error('Error looking up barcode:', error);
    throw new Error('Failed to look up barcode. Please try again or search manually.');
  }
}
