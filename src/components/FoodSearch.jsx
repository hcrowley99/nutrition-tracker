import { useState, useEffect } from 'react';
import { useFoodSearch } from '../hooks/useFoodSearch';
import { getRecentFoods, clearRecentFoods } from '../utils/recentFoods';

// Popular foods for empty state suggestions
const POPULAR_FOODS = [
  { name: 'Chicken Breast', emoji: '🍗' },
  { name: 'Banana', emoji: '🍌' },
  { name: 'Rice', emoji: '🍚' },
  { name: 'Eggs', emoji: '🥚' },
  { name: 'Oatmeal', emoji: '🥣' },
  { name: 'Salmon', emoji: '🐟' },
];

/**
 * Food Search Component - Enhanced Design
 * Search for foods in USDA database with Apple-inspired styling
 */
export default function FoodSearch({ onSelectFood }) {
  const [query, setQuery] = useState('');
  const { results, loading, error } = useFoodSearch(query);
  const [recentFoods, setRecentFoods] = useState([]);
  const [dataTypeFilter, setDataTypeFilter] = useState('all');

  // Load recent foods on mount
  useEffect(() => {
    setRecentFoods(getRecentFoods());
  }, []);

  const handleClear = () => {
    setQuery('');
  };

  const handleSelectFood = (food) => {
    onSelectFood(food);
    setQuery(''); // Clear search after selection
  };

  // Filter results based on dataType filter
  const filteredResults = results.filter(food => {
    if (dataTypeFilter === 'all') return true;
    if (dataTypeFilter === 'generic') return food.dataType !== 'Branded';
    if (dataTypeFilter === 'branded') return food.dataType === 'Branded';
    return true;
  });

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-card p-6 border border-white/50">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Search Foods
      </h2>

      {/* Search Input with Icon */}
      <div className="relative mb-5">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for foods..."
          className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-lg transition-all duration-200 shadow-sm focus:shadow-md"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Category Filters */}
      {query && results.length > 0 && (
        <div className="flex gap-2 mb-4">
          {[
            { key: 'all', label: 'All' },
            { key: 'generic', label: 'Generic' },
            { key: 'branded', label: 'Branded' },
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setDataTypeFilter(filter.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                dataTypeFilter === filter.key
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600 mb-3"></div>
          <p className="text-gray-600 font-medium">Searching...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && query.trim().length > 0 && filteredResults.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-500 font-medium">No foods found</p>
          <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
        </div>
      )}

      {/* Recent Foods (when search is empty) */}
      {!query && recentFoods.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">⏱️ Recent Foods</h3>
            <button
              onClick={() => {
                clearRecentFoods();
                setRecentFoods([]);
              }}
              className="text-xs text-gray-500 hover:text-gray-700 font-medium"
            >
              Clear
            </button>
          </div>
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
            {recentFoods.map((food) => (
              <div
                key={food.fdcId + food.lastAdded}
                className="bg-gradient-to-br from-gray-50 to-blue-50/30 border-2 border-blue-100 rounded-2xl p-4 hover:border-blue-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 pr-3">
                    <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1">
                      {food.name}
                    </h3>
                    {food.brandName && (
                      <p className="text-sm text-gray-500 font-medium">{food.brandName}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleSelectFood(food)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 active:scale-95 flex-shrink-0"
                  >
                    Add
                  </button>
                </div>
                <div className="flex gap-3 text-sm font-medium text-gray-700 mb-1">
                  <span className="font-bold text-red-600">{Math.round(food.calories)} cal</span>
                  <span className="text-gray-400">|</span>
                  <span>P: {Math.round(food.protein)}g</span>
                  <span className="text-gray-400">|</span>
                  <span>C: {Math.round(food.carbs)}g</span>
                  <span className="text-gray-400">|</span>
                  <span>F: {Math.round(food.fat)}g</span>
                </div>
                <div className="text-xs text-blue-600 font-medium">
                  ⏱️ Recently added • {food.servingSize}{food.servingUnit} per serving
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!query && recentFoods.length === 0 && (
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-500 font-medium mb-4">Try searching for popular foods</p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_FOODS.map((food) => (
              <button
                key={food.name}
                onClick={() => setQuery(food.name)}
                className="px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-xl text-sm font-medium transition-all duration-200"
              >
                {food.emoji} {food.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results List */}
      {!loading && filteredResults.length > 0 && (
        <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredResults.map((food) => (
            <div
              key={food.fdcId}
              className="bg-white border-2 border-gray-100 rounded-2xl p-4 hover:border-blue-200 hover:shadow-md transition-all duration-200 hover:scale-[1.01]"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-3">
                  <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1">
                    {food.name}
                  </h3>
                  {food.brandName && (
                    <p className="text-sm text-gray-500 font-medium">{food.brandName}</p>
                  )}
                </div>
                <button
                  onClick={() => handleSelectFood(food)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 active:scale-95 flex-shrink-0"
                >
                  Add
                </button>
              </div>

              {/* Nutrition Preview */}
              <div className="flex gap-3 text-sm font-medium text-gray-700 mb-1">
                <span className="font-bold text-red-600">{Math.round(food.calories)} cal</span>
                <span className="text-gray-400">|</span>
                <span>P: {Math.round(food.protein)}g</span>
                <span className="text-gray-400">|</span>
                <span>C: {Math.round(food.carbs)}g</span>
                <span className="text-gray-400">|</span>
                <span>F: {Math.round(food.fat)}g</span>
              </div>

              <div className="text-xs text-gray-400">
                Per {food.servingSize}{food.servingUnit}
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
