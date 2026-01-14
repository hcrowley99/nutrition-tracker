import { useState, useEffect } from 'react';
import { searchFoods } from '../utils/api';
import { rankSearchResults } from '../utils/searchRanking';

/**
 * Custom hook for food search with debouncing and ranking
 * Waits 300ms after user stops typing before searching
 *
 * @param {string} query - Search query
 * @returns {Object} - Search results, loading state, and error
 */
export function useFoodSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Don't search if query is too short
    if (!query || query.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Debounce: wait 300ms after user stops typing
    const timeoutId = setTimeout(async () => {
      try {
        const searchResults = await searchFoods(query);
        // Rank results by relevance
        const rankedResults = rankSearchResults(searchResults, query);
        setResults(rankedResults);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setResults([]);
        setLoading(false);
      }
    }, 300);

    // Cleanup: cancel the timeout if query changes before 300ms
    return () => clearTimeout(timeoutId);
  }, [query]);

  return { results, loading, error };
}
