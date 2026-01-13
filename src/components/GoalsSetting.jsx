import { useState } from 'react';
import GoalCalculator from './GoalCalculator';

/**
 * Goals Setting Component - Enhanced Design
 * Allows users to set their daily nutrition goals with Apple-inspired styling
 */
export default function GoalsSetting({ goals, onSaveGoals, onClose }) {
  const [localGoals, setLocalGoals] = useState(goals);
  const [showCalculator, setShowCalculator] = useState(false);

  const handleChange = (nutrient, value) => {
    const numValue = parseFloat(value) || 0;
    setLocalGoals({ ...localGoals, [nutrient]: numValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveGoals(localGoals);
    if (onClose) onClose();
  };

  const nutrients = [
    { key: 'calories', label: 'Calories', unit: 'kcal', step: 50, icon: '🔥' },
    { key: 'protein', label: 'Protein', unit: 'g', step: 5, icon: '💪' },
    { key: 'carbs', label: 'Carbohydrates', unit: 'g', step: 5, icon: '🌾' },
    { key: 'fat', label: 'Fat', unit: 'g', step: 5, icon: '🥑' },
    { key: 'fiber', label: 'Fiber', unit: 'g', step: 5, icon: '🌿' },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-gray-100 animate-scale-in">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Set Your Daily Goals
        </h2>

        {/* Calculator Button */}
        <button
          type="button"
          onClick={() => setShowCalculator(true)}
          className="w-full mb-5 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span className="text-xl">🧮</span>
          <span>Use Goal Calculator</span>
        </button>

        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 font-medium">or enter manually</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {nutrients.map(({ key, label, unit, step, icon }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span>{icon}</span>
                <span>{label} ({unit})</span>
              </label>
              <input
                type="number"
                value={localGoals[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-lg font-medium transition-all duration-200 shadow-sm focus:shadow-md"
                min="0"
                step={step}
                required
              />
            </div>
          ))}

          {/* Buttons */}
          <div className="flex gap-3 pt-6">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:shadow-md transition-all duration-200 active:scale-95"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 active:scale-95"
            >
              Save Goals
            </button>
          </div>
        </form>

        {/* Info text */}
        <p className="text-xs text-gray-500 mt-5 text-center bg-gray-50 rounded-xl p-3">
          💡 Recommended: 2000 kcal, 150g protein, 200g carbs, 65g fat, 30g fiber
        </p>
      </div>

      {/* Goal Calculator Modal */}
      {showCalculator && (
        <GoalCalculator
          onSaveGoals={(goals) => {
            setLocalGoals(goals);
            setShowCalculator(false);
          }}
          onClose={() => setShowCalculator(false)}
        />
      )}
    </div>
  );
}
