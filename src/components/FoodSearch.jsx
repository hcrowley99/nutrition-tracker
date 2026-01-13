import { useState } from 'react';
import { useFoodSearch } from '../hooks/useFoodSearch';

/**
 * Food Search Component
 * Search for foods in USDA database and select them
 */
export default function FoodSearch({ onSelectFood }) {
  const [query, setQuery] = useState('');
  const { results, loading, error } = useFoodSearch(query);

  const handleClear = () => {
    setQuery('');
  };

  const handleSelectFood = (food) => {
    onSelectFood(food);
    setQuery(''); // Clear search after selection
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-xl font-bold text-gray-800 mb-3">
        Search Foods
      </h2>

      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for foods..."
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-gray-600 mt-2">Searching...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && query.trim().length > 0 && results.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No foods found. Try a different search term.
        </div>
      )}

      {!query && (
        <div className="text-center py-8 text-gray-400">
          Start typing to search for foods...
        </div>
      )}

      {/* Results List */}
      {!loading && results.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {results.map((food) => (
            <div
              key={food.fdcId}
              className="border border-gray-200 rounded-lg p-3 hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 mb-1">
                    {food.name}
                  </h3>
                  {food.brandName && (
                    <p className="text-sm text-gray-500">{food.brandName}</p>
                  )}
                </div>
                <button
                  onClick={() => handleSelectFood(food)}
                  className="ml-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>

              {/* Nutrition Preview */}
              <div className="flex gap-4 text-sm text-gray-600">
                <span>{Math.round(food.calories)} cal</span>
                <span>P: {Math.round(food.protein)}g</span>
                <span>C: {Math.round(food.carbs)}g</span>
                <span>F: {Math.round(food.fat)}g</span>
              </div>

              <div className="text-xs text-gray-400 mt-1">
                Per {food.servingSize}{food.servingUnit}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
