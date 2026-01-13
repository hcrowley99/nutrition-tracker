import { useState } from 'react';

/**
 * Goals Setting Component
 * Allows users to set their daily nutrition goals
 */
export default function GoalsSetting({ goals, onSaveGoals, onClose }) {
  const [localGoals, setLocalGoals] = useState(goals);

  const handleChange = (nutrient, value) => {
    const numValue = parseFloat(value) || 0;
    setLocalGoals({ ...localGoals, [nutrient]: numValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveGoals(localGoals);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Set Your Daily Goals
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Calories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Calories (kcal)
            </label>
            <input
              type="number"
              value={localGoals.calories}
              onChange={(e) => handleChange('calories', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              min="0"
              step="50"
              required
            />
          </div>

          {/* Protein */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Protein (g)
            </label>
            <input
              type="number"
              value={localGoals.protein}
              onChange={(e) => handleChange('protein', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              min="0"
              step="5"
              required
            />
          </div>

          {/* Carbs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carbohydrates (g)
            </label>
            <input
              type="number"
              value={localGoals.carbs}
              onChange={(e) => handleChange('carbs', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              min="0"
              step="5"
              required
            />
          </div>

          {/* Fat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fat (g)
            </label>
            <input
              type="number"
              value={localGoals.fat}
              onChange={(e) => handleChange('fat', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              min="0"
              step="5"
              required
            />
          </div>

          {/* Fiber */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fiber (g)
            </label>
            <input
              type="number"
              value={localGoals.fiber}
              onChange={(e) => handleChange('fiber', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              min="0"
              step="5"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Save Goals
            </button>
          </div>
        </form>

        {/* Info text */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          Recommended: 2000 kcal, 150g protein, 200g carbs, 65g fat, 30g fiber
        </p>
      </div>
    </div>
  );
}
