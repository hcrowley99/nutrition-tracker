import { useState, useEffect, useMemo } from 'react';
import { useFoodSearch } from '../hooks/useFoodSearch';
import { getRecentFoods, clearRecentFoods } from '../utils/recentFoods';
import { getCustomFoods, searchCustomFoods } from '../utils/customFoods';
import { formatDate } from '../utils/calculations';
import BarcodeScanner from './BarcodeScanner';
import CustomFoodEntry from './CustomFoodEntry';

// Tab configuration
const TABS = [
  { id: 'recent', label: 'Recent', icon: '🕐' },
  { id: 'search', label: 'Search', icon: '🔍' },
  { id: 'barcode', label: 'Scan', icon: '📷' },
  { id: 'custom', label: 'Custom', icon: '✏️' },
  { id: 'copy', label: 'Copy', icon: '📋' },
];

// Meal display names
const MEAL_NAMES = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snacks: 'Snacks',
};

// Popular foods for empty state
const POPULAR_FOODS = [
  { name: 'Chicken Breast', emoji: '🍗' },
  { name: 'Banana', emoji: '🍌' },
  { name: 'Rice', emoji: '🍚' },
  { name: 'Eggs', emoji: '🥚' },
  { name: 'Oatmeal', emoji: '🥣' },
  { name: 'Salmon', emoji: '🐟' },
];

/**
 * Add Food Page Component
 * Full-page view with tabbed interface for adding foods to a meal
 */
export default function AddFoodPage({
  mealCategory,
  onSelectFood,
  onClose,
  onCopyFoods,
  loggedFoods,
  selectedDate,
}) {
  const [activeTab, setActiveTab] = useState('recent');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white shadow-2xl sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold">Add to {MEAL_NAMES[mealCategory]}</h1>
              <p className="text-sm text-white/70">Choose how to add food</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="sticky top-[72px] z-30 bg-gray-900/95 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2 scrollbar-hide">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {activeTab === 'recent' && (
          <RecentTab onSelectFood={onSelectFood} />
        )}
        {activeTab === 'search' && (
          <SearchTab onSelectFood={onSelectFood} />
        )}
        {activeTab === 'barcode' && (
          <BarcodeTab onSelectFood={onSelectFood} />
        )}
        {activeTab === 'custom' && (
          <CustomTab onSelectFood={onSelectFood} />
        )}
        {activeTab === 'copy' && (
          <CopyTab
            loggedFoods={loggedFoods}
            selectedDate={selectedDate}
            onCopyFoods={onCopyFoods}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Recent Tab - Shows last 10 recently added foods
 */
function RecentTab({ onSelectFood }) {
  const [recentFoods, setRecentFoods] = useState([]);

  useEffect(() => {
    setRecentFoods(getRecentFoods());
  }, []);

  if (recentFoods.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-6xl mb-4 block">🕐</span>
        <h3 className="text-xl font-bold text-white mb-2">No Recent Foods</h3>
        <p className="text-gray-400">
          Foods you add will appear here for quick access
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">Recently Added</h3>
        <button
          onClick={() => {
            clearRecentFoods();
            setRecentFoods([]);
          }}
          className="text-sm text-gray-400 hover:text-red-400 font-medium transition-colors"
        >
          Clear All
        </button>
      </div>
      <div className="space-y-3">
        {recentFoods.map((food) => (
          <FoodCard key={food.fdcId + food.lastAdded} food={food} onSelect={onSelectFood} />
        ))}
      </div>
    </div>
  );
}

/**
 * Search Tab - USDA database search
 */
function SearchTab({ onSelectFood }) {
  const [query, setQuery] = useState('');
  const { results, loading, error } = useFoodSearch(query);
  const [dataTypeFilter, setDataTypeFilter] = useState('all');

  const filteredResults = results.filter(food => {
    if (dataTypeFilter === 'all') return true;
    if (dataTypeFilter === 'generic') return food.dataType !== 'Branded';
    if (dataTypeFilter === 'branded') return food.dataType === 'Branded';
    return true;
  });

  return (
    <div>
      {/* Search Input */}
      <div className="relative mb-4">
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
          className="w-full pl-12 pr-12 py-4 bg-gray-800 border-2 border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 text-lg text-white placeholder-gray-400 transition-all duration-200"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filters */}
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
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-700 border-t-blue-500 mb-3"></div>
          <p className="text-gray-400 font-medium">Searching...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-900/50 border-2 border-red-700 rounded-2xl p-4 text-red-300">
          {error}
        </div>
      )}

      {/* Empty Query - Show popular foods */}
      {!query && (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">Try searching for popular foods</p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_FOODS.map((food) => (
              <button
                key={food.name}
                onClick={() => setQuery(food.name)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl text-sm font-medium transition-all duration-200"
              >
                {food.emoji} {food.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && !error && query && filteredResults.length === 0 && (
        <div className="text-center py-12">
          <span className="text-5xl mb-3 block">🔍</span>
          <p className="text-gray-400 font-medium">No foods found</p>
          <p className="text-sm text-gray-500 mt-1">Try a different search term</p>
        </div>
      )}

      {/* Results */}
      {!loading && filteredResults.length > 0 && (
        <div className="space-y-3">
          {filteredResults.map((food) => (
            <FoodCard key={food.fdcId} food={food} onSelect={onSelectFood} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Barcode Tab - Camera scanner
 */
function BarcodeTab({ onSelectFood }) {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedFood, setScannedFood] = useState(null);

  const handleFoodFound = (food) => {
    setScannedFood(food);
    setShowScanner(false);
  };

  if (showScanner) {
    return (
      <BarcodeScanner
        onFoodFound={handleFoodFound}
        onClose={() => setShowScanner(false)}
      />
    );
  }

  return (
    <div className="text-center py-8">
      {scannedFood ? (
        <div>
          <p className="text-green-400 font-medium mb-4">Product found!</p>
          <FoodCard food={scannedFood} onSelect={onSelectFood} />
          <button
            onClick={() => {
              setScannedFood(null);
              setShowScanner(true);
            }}
            className="mt-4 px-6 py-3 bg-gray-800 text-gray-300 rounded-xl font-medium hover:bg-gray-700 transition-colors"
          >
            Scan Another
          </button>
        </div>
      ) : (
        <>
          <span className="text-6xl mb-4 block">📷</span>
          <h3 className="text-xl font-bold text-white mb-2">Scan Barcode</h3>
          <p className="text-gray-400 mb-6">
            Scan a product barcode to quickly find nutrition info
          </p>
          <button
            onClick={() => setShowScanner(true)}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-semibold text-lg hover:shadow-lg transition-all duration-200"
          >
            Open Camera
          </button>
        </>
      )}
    </div>
  );
}

/**
 * Custom Tab - Saved custom foods + create new
 */
function CustomTab({ onSelectFood }) {
  const [customFoods, setCustomFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    setCustomFoods(getCustomFoods());
  }, []);

  const filteredFoods = searchQuery
    ? searchCustomFoods(searchQuery)
    : customFoods;

  const handleCreateFood = (food) => {
    // Refresh the list after creating
    setCustomFoods(getCustomFoods());
    setShowCreateForm(false);
    onSelectFood(food);
  };

  if (showCreateForm) {
    return (
      <CustomFoodEntry
        onAddFood={handleCreateFood}
        onCancel={() => setShowCreateForm(false)}
        saveToList={true}
      />
    );
  }

  return (
    <div>
      {/* Create New Button */}
      <button
        onClick={() => setShowCreateForm(true)}
        className="w-full mb-4 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-semibold text-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
      >
        <span className="text-xl">+</span>
        Create Custom Food
      </button>

      {customFoods.length > 0 && (
        <>
          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search custom foods..."
              className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Custom Foods List */}
          <div className="space-y-3">
            {filteredFoods.map((food) => (
              <FoodCard key={food.fdcId} food={food} onSelect={onSelectFood} />
            ))}
          </div>

          {filteredFoods.length === 0 && searchQuery && (
            <p className="text-center text-gray-400 py-8">
              No custom foods match "{searchQuery}"
            </p>
          )}
        </>
      )}

      {customFoods.length === 0 && (
        <div className="text-center py-8">
          <span className="text-5xl mb-3 block">✏️</span>
          <p className="text-gray-400">
            No custom foods yet. Create one above!
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Copy Tab - Copy foods from previous days
 */
function CopyTab({ loggedFoods, selectedDate, onCopyFoods }) {
  const [sourceDate, setSourceDate] = useState('');
  const [selectedFoodIds, setSelectedFoodIds] = useState(new Set());

  // Get unique dates that have foods (excluding current date)
  const availableDates = useMemo(() => {
    const dates = [...new Set(loggedFoods.map(f => f.date))]
      .filter(d => d !== selectedDate)
      .sort((a, b) => b.localeCompare(a)); // Most recent first
    return dates;
  }, [loggedFoods, selectedDate]);

  // Foods for selected source date
  const sourceFoods = useMemo(() => {
    if (!sourceDate) return [];
    return loggedFoods.filter(f => f.date === sourceDate);
  }, [loggedFoods, sourceDate]);

  // Quick action: copy from yesterday
  const copyFromYesterday = () => {
    const today = new Date(selectedDate + 'T00:00:00');
    today.setDate(today.getDate() - 1);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setSourceDate(`${year}-${month}-${day}`);
  };

  const toggleFood = (foodId) => {
    const newSelection = new Set(selectedFoodIds);
    if (newSelection.has(foodId)) {
      newSelection.delete(foodId);
    } else {
      newSelection.add(foodId);
    }
    setSelectedFoodIds(newSelection);
  };

  const toggleAll = () => {
    if (selectedFoodIds.size === sourceFoods.length) {
      setSelectedFoodIds(new Set());
    } else {
      setSelectedFoodIds(new Set(sourceFoods.map(f => f.id)));
    }
  };

  const handleCopy = () => {
    const foodsToCopy = sourceFoods.filter(f => selectedFoodIds.has(f.id));
    onCopyFoods(foodsToCopy);
  };

  if (availableDates.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-6xl mb-4 block">📋</span>
        <h3 className="text-xl font-bold text-white mb-2">No Previous Days</h3>
        <p className="text-gray-400">
          Log some foods first, then you can copy them to other days
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Quick Actions */}
      <button
        onClick={copyFromYesterday}
        className="w-full mb-4 px-4 py-3 bg-gray-800 border-2 border-gray-700 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
      >
        📅 Copy from Yesterday
      </button>

      {/* Date Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Or select a date:
        </label>
        <select
          value={sourceDate}
          onChange={(e) => {
            setSourceDate(e.target.value);
            setSelectedFoodIds(new Set());
          }}
          className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
        >
          <option value="">Choose a date...</option>
          {availableDates.map(date => (
            <option key={date} value={date}>
              {formatDate(date)}
            </option>
          ))}
        </select>
      </div>

      {/* Foods to Copy */}
      {sourceDate && sourceFoods.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-400">
              {sourceFoods.length} food{sourceFoods.length !== 1 ? 's' : ''} on this day
            </p>
            <button
              onClick={toggleAll}
              className="text-sm text-blue-400 hover:text-blue-300 font-medium"
            >
              {selectedFoodIds.size === sourceFoods.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="space-y-2 mb-4">
            {sourceFoods.map(food => (
              <label
                key={food.id}
                className={`flex items-center gap-3 p-3 bg-gray-800 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedFoodIds.has(food.id)
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedFoodIds.has(food.id)}
                  onChange={() => toggleFood(food.id)}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{food.name}</p>
                  <p className="text-sm text-gray-400">
                    {Math.round(food.calories)} cal
                  </p>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={handleCopy}
            disabled={selectedFoodIds.size === 0}
            className={`w-full px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 ${
              selectedFoodIds.size > 0
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Copy {selectedFoodIds.size} Food{selectedFoodIds.size !== 1 ? 's' : ''}
          </button>
        </>
      )}

      {sourceDate && sourceFoods.length === 0 && (
        <p className="text-center text-gray-400 py-8">
          No foods logged on this day
        </p>
      )}
    </div>
  );
}

/**
 * Reusable Food Card Component
 */
function FoodCard({ food, onSelect }) {
  return (
    <div className="bg-gray-800 border-2 border-gray-700 rounded-2xl p-4 hover:border-blue-500 transition-all duration-200">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 pr-3 min-w-0">
          <h4 className="font-semibold text-white leading-tight truncate">
            {food.name}
          </h4>
          {food.brandName && (
            <p className="text-sm text-gray-400 truncate">{food.brandName}</p>
          )}
        </div>
        <button
          onClick={() => onSelect(food)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 active:scale-95 flex-shrink-0"
        >
          Add
        </button>
      </div>
      <div className="flex gap-3 text-sm text-gray-300">
        <span className="font-bold text-red-400">{Math.round(food.calories)} cal</span>
        <span className="text-gray-600">|</span>
        <span>P: {Math.round(food.protein)}g</span>
        <span className="text-gray-600">|</span>
        <span>C: {Math.round(food.carbs)}g</span>
        <span className="text-gray-600">|</span>
        <span>F: {Math.round(food.fat)}g</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Per {food.servingSize}{food.servingUnit}
      </p>
    </div>
  );
}
