/**
 * Custom Foods Utility
 * Manages a persistent list of user-created custom foods in localStorage
 */

const CUSTOM_FOODS_KEY = 'custom-foods';

/**
 * Get all custom foods from localStorage
 * @returns {Array} Array of custom food objects
 */
export function getCustomFoods() {
  try {
    const stored = localStorage.getItem(CUSTOM_FOODS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading custom foods:', error);
    return [];
  }
}

/**
 * Add a custom food to the persistent list
 * @param {Object} food - Custom food object (must have fdcId starting with 'custom-')
 */
export function addCustomFood(food) {
  try {
    const customFoods = getCustomFoods();

    // Check if food with same fdcId already exists (update it)
    const existingIndex = customFoods.findIndex(f => f.fdcId === food.fdcId);

    if (existingIndex >= 0) {
      customFoods[existingIndex] = {
        ...food,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Add new food with timestamp
      customFoods.unshift({
        ...food,
        createdAt: new Date().toISOString(),
      });
    }

    localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(customFoods));
  } catch (error) {
    console.error('Error saving custom food:', error);
  }
}

/**
 * Search custom foods by name (case-insensitive)
 * @param {string} query - Search query
 * @returns {Array} Filtered array of matching custom foods
 */
export function searchCustomFoods(query) {
  const customFoods = getCustomFoods();

  if (!query || query.trim().length === 0) {
    return customFoods;
  }

  const lowerQuery = query.toLowerCase().trim();
  return customFoods.filter(food =>
    food.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Delete a custom food by fdcId
 * @param {string} fdcId - The fdcId of the custom food to delete
 */
export function deleteCustomFood(fdcId) {
  try {
    const customFoods = getCustomFoods();
    const filtered = customFoods.filter(f => f.fdcId !== fdcId);
    localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting custom food:', error);
  }
}

/**
 * Clear all custom foods
 */
export function clearCustomFoods() {
  try {
    localStorage.removeItem(CUSTOM_FOODS_KEY);
  } catch (error) {
    console.error('Error clearing custom foods:', error);
  }
}
