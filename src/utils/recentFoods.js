/**
 * Recent Foods Utility
 * Manages a list of recently added foods for quick re-access
 */

const RECENT_FOODS_KEY = 'recent-foods';
const MAX_RECENT_FOODS = 10;

/**
 * Get recent foods from localStorage
 * @returns {Array} Array of recent food objects (most recent first)
 */
export function getRecentFoods() {
  try {
    const stored = localStorage.getItem(RECENT_FOODS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading recent foods:', error);
    return [];
  }
}

/**
 * Add a food to recent foods list
 * Deduplicates based on fdcId - if food already exists, moves it to top
 *
 * @param {Object} food - Food object to add (should have fdcId, name, etc.)
 */
export function addToRecentFoods(food) {
  try {
    const recent = getRecentFoods();

    // Remove any existing entry with same fdcId (to avoid duplicates)
    const filtered = recent.filter(f => f.fdcId !== food.fdcId);

    // Add new food to the beginning with timestamp
    const updated = [
      {
        ...food,
        lastAdded: new Date().toISOString(),
      },
      ...filtered,
    ].slice(0, MAX_RECENT_FOODS); // Keep only the last 10

    localStorage.setItem(RECENT_FOODS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving recent food:', error);
  }
}

/**
 * Clear all recent foods from localStorage
 */
export function clearRecentFoods() {
  try {
    localStorage.removeItem(RECENT_FOODS_KEY);
  } catch (error) {
    console.error('Error clearing recent foods:', error);
  }
}
