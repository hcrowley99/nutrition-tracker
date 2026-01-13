import { useState, useEffect } from 'react';
import { calculatePortionNutrients } from '../utils/calculations';
import {
  convertUnit,
  getCompatibleUnits,
  formatConversionFactor
} from '../utils/unitConversions';

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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-gray-100 animate-scale-in">
        <h2 className="text-3xl font-bold text-gray-900 mb-5">
          Add Food
        </h2>

        {/* Food Name */}
        <div className="mb-5 pb-5 border-b border-gray-100">
          <h3 className="font-bold text-xl text-gray-900 leading-tight">{food.name}</h3>
          {food.brandName && (
            <p className="text-sm text-gray-500 font-medium mt-1">{food.brandName}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Amount and Unit Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span>🔢</span>
              <span>Amount</span>
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                value={displayAmount}
                onChange={(e) => setDisplayAmount(parseFloat(e.target.value) || 1)}
                className="flex-1 px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-lg font-medium transition-all duration-200 shadow-sm focus:shadow-md"
                min="0.1"
                step="0.1"
                required
              />
              {compatibleUnits.length > 1 ? (
                <select
                  value={displayUnit}
                  onChange={(e) => setDisplayUnit(e.target.value)}
                  className="px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-lg font-medium transition-all duration-200 shadow-sm focus:shadow-md"
                >
                  {compatibleUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              ) : (
                <div className="px-4 py-3.5 bg-gray-100 border-2 border-gray-200 rounded-xl text-lg font-medium text-gray-700">
                  {displayUnit}
                </div>
              )}
            </div>

            {/* Conversion Display */}
            {displayUnit !== food.servingUnit && (
              <div className="mt-2 p-3 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <p className="text-sm text-blue-800 font-medium">
                  🔄 {displayAmount} {displayUnit} = {(quantity * food.servingSize).toFixed(1)} {food.servingUnit}
                  <span className="text-xs text-blue-600 ml-2">
                    ({formatConversionFactor(convertUnit(1, displayUnit, food.servingUnit))})
                  </span>
                </p>
              </div>
            )}

            <p className="text-sm text-gray-500 mt-2 font-medium">
              📏 1 serving = {food.servingSize}{food.servingUnit}
              <span className="text-xs text-gray-400 ml-2">
                ({quantity.toFixed(2)} servings)
              </span>
            </p>
          </div>

          {/* Nutrition Preview */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-5 border-2 border-gray-100">
            <h4 className="font-bold text-gray-900 mb-4 text-lg">
              Nutrition Preview
              <span className="text-sm font-medium text-gray-500 ml-2">
                ({quantity} serving{quantity !== 1 ? 's' : ''})
              </span>
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-3 border border-red-100">
                <p className="text-xs text-gray-600 font-semibold mb-1">🔥 Calories</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  {adjustedNutrients.calories}
                </p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-cyan-100">
                <p className="text-xs text-gray-600 font-semibold mb-1">💪 Protein</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-teal-400 bg-clip-text text-transparent">
                  {adjustedNutrients.protein}g
                </p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-yellow-100">
                <p className="text-xs text-gray-600 font-semibold mb-1">🌾 Carbs</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
                  {adjustedNutrients.carbs}g
                </p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-green-100">
                <p className="text-xs text-gray-600 font-semibold mb-1">🥑 Fat</p>
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
              className="flex-1 px-6 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:shadow-md transition-all duration-200 active:scale-95"
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
