import { useState, useEffect } from 'react';
import { calculatePortionNutrients } from '../utils/calculations';
import {
  convertUnit,
  getCompatibleUnits,
  formatConversionFactor
} from '../utils/unitConversions';
import { getPortionPresets, getStepSize } from '../utils/portionPresets';

/**
 * Food Logger Component - Enhanced Design
 * Allows users to adjust quantity and log a selected food with beautiful styling
 */
export default function FoodLogger({ food, onAddFood, onCancel }) {
  const [quantity, setQuantity] = useState(1);
  const [displayUnit, setDisplayUnit] = useState(food.servingUnit);
  const [displayAmount, setDisplayAmount] = useState(food.servingSize);

  // Get compatible units for conversion
  const compatibleUnits = getCompatibleUnits(food.servingUnit);

  // Calculate adjusted nutrients based on quantity
  const adjustedNutrients = calculatePortionNutrients(food, quantity);

  // Update quantity when display unit or amount changes
  useEffect(() => {
    if (displayUnit !== food.servingUnit) {
      const converted = convertUnit(displayAmount, displayUnit, food.servingUnit);
      if (converted !== null) {
        setQuantity(converted / food.servingSize);
      }
    } else {
      setQuantity(displayAmount / food.servingSize);
    }
  }, [displayAmount, displayUnit, food.servingSize, food.servingUnit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const loggedFood = {
      ...food,
      quantity,
      calories: adjustedNutrients.calories,
      protein: adjustedNutrients.protein,
      carbs: adjustedNutrients.carbs,
      fat: adjustedNutrients.fat,
    };

    onAddFood(loggedFood);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 border border-gray-700 animate-scale-in">
        <h2 className="text-3xl font-bold text-white mb-5">
          Add Food
        </h2>

        {/* Food Name */}
        <div className="mb-5 pb-5 border-b border-gray-700">
          <h3 className="font-bold text-xl text-white leading-tight">{food.name}</h3>
          {food.brandName && (
            <p className="text-sm text-gray-400 font-medium mt-1">{food.brandName}</p>
          )}
        </div>

        {/* Quick Portion Presets */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Quick Portions
          </label>
          <div className="flex flex-wrap gap-2">
            {getPortionPresets(food).map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setDisplayAmount(preset.amount);
                  setDisplayUnit(preset.unit);
                }}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  displayAmount === preset.amount && displayUnit === preset.unit
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Amount and Unit Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
              <span>🔢</span>
              <span>Amount</span>
            </label>
            <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDisplayAmount(Math.max(getStepSize(displayUnit), displayAmount - getStepSize(displayUnit)))}
                  className="p-3.5 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-xl text-gray-200 transition-all duration-200 active:scale-95"
                >
                  -
                </button>
                <input
                  type="number"
                  value={displayAmount}
                  onChange={(e) => setDisplayAmount(parseFloat(e.target.value) || 1)}
                  className="flex-1 px-4 py-3.5 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 text-lg font-medium text-white transition-all duration-200 shadow-sm focus:shadow-md text-center"
                  min="0.01"
                  step="0.01"
                  required
                />
                <button
                  type="button"
                  onClick={() => setDisplayAmount(displayAmount + getStepSize(displayUnit))}
                  className="p-3.5 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-xl text-gray-200 transition-all duration-200 active:scale-95"
                >
                  +
                </button>
              </div>
              {compatibleUnits.length > 1 ? (
                <select
                  value={displayUnit}
                  onChange={(e) => setDisplayUnit(e.target.value)}
                  className="px-4 py-3.5 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 text-lg font-medium text-white transition-all duration-200 shadow-sm focus:shadow-md"
                >
                  {compatibleUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              ) : (
                <div className="px-4 py-3.5 bg-gray-700 border-2 border-gray-600 rounded-xl text-lg font-medium text-gray-300">
                  {displayUnit}
                </div>
              )}
            </div>

            {/* Conversion Display */}
            {displayUnit !== food.servingUnit && (
              <div className="mt-2 p-3 bg-blue-900/40 border-2 border-blue-700 rounded-xl">
                <p className="text-sm text-blue-300 font-medium">
                  🔄 {displayAmount} {displayUnit} = {(quantity * food.servingSize).toFixed(1)} {food.servingUnit}
                  <span className="text-xs text-blue-400 ml-2">
                    ({formatConversionFactor(convertUnit(1, displayUnit, food.servingUnit))})
                  </span>
                </p>
              </div>
            )}

            <p className="text-sm text-gray-400 mt-2 font-medium">
              📏 1 serving = {food.servingSize}{food.servingUnit}
              <span className="text-xs text-gray-500 ml-2">
                ({quantity.toFixed(2)} servings)
              </span>
            </p>
          </div>

          {/* Nutrition Preview */}
          <div className="bg-gradient-to-br from-gray-700 to-gray-700/50 rounded-2xl p-5 border-2 border-gray-600">
            <h4 className="font-bold text-white mb-4 text-lg">
              Nutrition Preview
              <span className="text-sm font-medium text-gray-400 ml-2">
                ({quantity} serving{quantity !== 1 ? 's' : ''})
              </span>
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-xl p-3 border border-red-900/50">
                <p className="text-xs text-gray-400 font-semibold mb-1">🔥 Calories</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  {adjustedNutrients.calories}
                </p>
              </div>
              <div className="bg-gray-800 rounded-xl p-3 border border-cyan-900/50">
                <p className="text-xs text-gray-400 font-semibold mb-1">💪 Protein</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-teal-400 bg-clip-text text-transparent">
                  {adjustedNutrients.protein}g
                </p>
              </div>
              <div className="bg-gray-800 rounded-xl p-3 border border-yellow-900/50">
                <p className="text-xs text-gray-400 font-semibold mb-1">🌾 Carbs</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
                  {adjustedNutrients.carbs}g
                </p>
              </div>
              <div className="bg-gray-800 rounded-xl p-3 border border-green-900/50">
                <p className="text-xs text-gray-400 font-semibold mb-1">🥑 Fat</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {adjustedNutrients.fat}g
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3.5 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-200 font-semibold hover:bg-gray-600 hover:shadow-md transition-all duration-200 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 active:scale-95"
            >
              Add to Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
