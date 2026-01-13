import { useState, useMemo } from 'react';
import { formatDate } from '../utils/calculations';

/**
 * Copy From Day Component
 * Allows copying foods from previous days to current day
 */
export default function CopyFromDay({ loggedFoods, selectedDate, onCopyFoods, onClose }) {
  const [sourceDate, setSourceDate] = useState('');
  const [selectedFoodIds, setSelectedFoodIds] = useState(new Set());

  // Get unique dates with foods (excluding current date)
  const availableDates = useMemo(() => {
    const dates = new Set();
    loggedFoods.forEach(food => {
      if (food.date !== selectedDate) {
        dates.add(food.date);
      }
    });
    // Sort dates in descending order (most recent first)
    return Array.from(dates).sort().reverse();
  }, [loggedFoods, selectedDate]);

  // Get foods for selected source date
  const sourceFoods = useMemo(() => {
    if (!sourceDate) return [];
    return loggedFoods.filter(food => food.date === sourceDate);
  }, [loggedFoods, sourceDate]);

  // Quick action: copy from yesterday
  const copyFromYesterday = () => {
    const yesterday = new Date(selectedDate + 'T00:00:00');
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    setSourceDate(yesterdayStr);
  };

  // Toggle food selection
  const toggleFood = (foodId) => {
    const newSelection = new Set(selectedFoodIds);
    if (newSelection.has(foodId)) {
      newSelection.delete(foodId);
    } else {
      newSelection.add(foodId);
    }
    setSelectedFoodIds(newSelection);
  };

  // Select/deselect all
  const toggleAll = () => {
    if (selectedFoodIds.size === sourceFoods.length) {
      setSelectedFoodIds(new Set());
    } else {
      setSelectedFoodIds(new Set(sourceFoods.map(f => f.id)));
    }
  };

  // Copy selected foods
  const handleCopy = () => {
    const foodsToCopy = sourceFoods.filter(food => selectedFoodIds.has(food.id));
    onCopyFoods(foodsToCopy);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-100 animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-3xl font-bold text-gray-900">
              📋 Copy from Prior Day
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Quick Action */}
          <button
            onClick={copyFromYesterday}
            className="w-full px-5 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            Quick Copy from Yesterday
          </button>
        </div>

        {/* Date Selection */}
        <div className="p-6 border-b border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            📅 Select Source Date
          </label>
          {availableDates.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {availableDates.map((date) => (
                <button
                  key={date}
                  onClick={() => setSourceDate(date)}
                  className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    sourceDate === date
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {formatDate(date)}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-2xl">
              <p className="font-medium text-gray-700">No previous days with logged foods</p>
              <p className="text-sm text-gray-500 mt-1">Start logging foods to use this feature</p>
            </div>
          )}
        </div>

        {/* Foods List */}
        {sourceDate && sourceFoods.length > 0 && (
          <div className="p-6 max-h-96 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Select Foods to Copy ({selectedFoodIds.size} selected)
              </h3>
              <button
                onClick={toggleAll}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                {selectedFoodIds.size === sourceFoods.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="space-y-2">
              {sourceFoods.map((food) => {
                const isSelected = selectedFoodIds.has(food.id);
                return (
                  <label
                    key={food.id}
                    className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-blue-50 border-blue-400 shadow-md'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleFood(food.id)}
                        className="mt-1 w-5 h-5 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{food.name}</h4>
                        {food.brandName && (
                          <p className="text-sm text-gray-500">{food.brandName}</p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">
                          {food.quantity} × {food.servingSize}{food.servingUnit}
                        </p>
                        <div className="flex gap-3 text-sm font-medium text-gray-700 mt-2">
                          <span className="text-red-600">{Math.round(food.calories)} cal</span>
                          <span className="text-gray-400">|</span>
                          <span>P: {food.protein}g</span>
                          <span className="text-gray-400">|</span>
                          <span>C: {food.carbs}g</span>
                          <span className="text-gray-400">|</span>
                          <span>F: {food.fat}g</span>
                        </div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {sourceDate && sourceFoods.length === 0 && (
          <div className="p-6 text-center bg-gray-50 rounded-2xl mx-6">
            <p className="font-medium text-gray-700">No foods found for this date</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:shadow-md transition-all duration-200 active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleCopy}
            disabled={selectedFoodIds.size === 0}
            className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 active:scale-95 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Copy {selectedFoodIds.size} Food{selectedFoodIds.size !== 1 ? 's' : ''}
          </button>
        </div>

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
    </div>
  );
}
