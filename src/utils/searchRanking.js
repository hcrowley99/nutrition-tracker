/**
 * Search Ranking Utility
 * Scores and ranks food search results by relevance
 */

/**
 * Rank search results by relevance to the query
 * @param {Array} results - Array of food objects from API
 * @param {string} query - User's search query
 * @returns {Array} Sorted array with most relevant results first
 */
export function rankSearchResults(results, query) {
  if (!results || !query) return results;

  const queryTerms = query.toLowerCase().trim().split(/\s+/);

  return results
    .map(food => ({
      ...food,
      relevanceScore: calculateRelevanceScore(food, queryTerms)
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Calculate relevance score for a single food item
 * @param {Object} food - Food object with name and optionally brandName
 * @param {Array} queryTerms - Array of lowercase query terms
 * @returns {number} Relevance score (higher = more relevant)
 */
function calculateRelevanceScore(food, queryTerms) {
  const name = food.name.toLowerCase();
  let score = 0;

  // Exact match at start of name (highest priority)
  const fullQuery = queryTerms.join(' ');
  if (name.startsWith(fullQuery)) {
    score += 100;
  } else if (name.includes(fullQuery)) {
    score += 50;
  }

  // All query terms present
  const allTermsPresent = queryTerms.every(term => name.includes(term));
  if (allTermsPresent) {
    score += 40;
  }

  // Boost for each matching term at word boundary
  queryTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}`, 'i');
    if (regex.test(name)) {
      score += 15;
    }
  });

  // Shorter names = more generic/common = slight boost
  // But cap the boost so very short names don't dominate
  const lengthBonus = Math.max(0, 30 - name.length * 0.3);
  score += lengthBonus;

  // Penalize overly specific preparation descriptors
  const specificTerms = ['raw', 'cooked', 'roasted', 'fried', 'baked', 'grilled',
    'steamed', 'boiled', 'skin', 'bone', 'without', 'with', 'added'];
  specificTerms.forEach(term => {
    if (name.includes(term)) {
      score -= 3;
    }
  });

  // Boost branded items slightly (users often search for brands)
  if (food.brandName && food.dataType === 'Branded') {
    score += 5;
    // Extra boost if brand name matches query
    if (queryTerms.some(term => food.brandName.toLowerCase().includes(term))) {
      score += 20;
    }
  }

  // Boost generic/survey foods for common food searches
  if (food.dataType === 'Survey (FNDDS)' || food.dataType === 'SR Legacy') {
    score += 8;
  }

  return score;
}
