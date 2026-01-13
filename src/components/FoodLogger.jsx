import { useState } from 'react';
import { calculatePortionNutrients } from '../utils/calculations';

/**
 * Food Logger Component
 * Allows users to adjust quantity and log a selected food
 */
export default function FoodLogger({ food, onAddFood, onCancel }) {
  const [quantity, setQuantity] = useState(1);

  // Calculate adjusted nutrients based on quantity
  const adjustedNutrients = calculatePortionNutrients(food, quantity);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Add Food
        </h2>

        {/* Food Name */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-gray-800">{food.name}</h3>
          {food.brandName && (
            <p className="text-sm text-gray-500">{food.brandName}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quantity Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Servings
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              min="0.1"
              step="0.1"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {food.servingSize}{food.servingUnit} per serving
            </p>
          </div>

          {/* Nutrition Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-2">
              Nutrition ({quantity} serving{quantity !== 1 ? 's' : ''})
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-600">Calories</p>
                <p className="text-xl font-semibold text-gray-800">
                  {adjustedNutrients.calories}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Protein</p>
                <p className="text-xl font-semibold text-gray-800">
                  {adjustedNutrients.protein}g
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Carbs</p>
                <p className="text-xl font-semibold text-gray-800">
                  {adjustedNutrients.carbs}g
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fat</p>
                <p className="text-xl font-semibold text-gray-800">
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
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Add to Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
