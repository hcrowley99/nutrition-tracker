import { useState } from 'react';

/**
 * Custom Food Entry Component
 * Allows users to manually enter a food item with nutrition information
 */
export default function CustomFoodEntry({ onAddFood, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    servingSize: '',
    servingUnit: 'g',
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create custom food object matching the structure of API foods
    const customFood = {
      fdcId: `custom-${Date.now()}`,
      name: formData.name.trim(),
      brandName: 'Custom Food',
      calories: parseFloat(formData.calories),
      protein: parseFloat(formData.protein),
      carbs: parseFloat(formData.carbs),
      fat: parseFloat(formData.fat),
      fiber: parseFloat(formData.fiber) || 0,
      servingSize: parseFloat(formData.servingSize),
      servingUnit: formData.servingUnit,
    };

    onAddFood(customFood);
  };

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.calories &&
      formData.protein &&
      formData.carbs &&
      formData.fat &&
      formData.servingSize
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Add Custom Food
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Food Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="e.g., Homemade Pasta"
              required
            />
          </div>

          {/* Serving Size */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serving Size *
              </label>
              <input
                type="number"
                value={formData.servingSize}
                onChange={(e) => handleChange('servingSize', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="100"
                min="0"
                step="0.1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                value={formData.servingUnit}
                onChange={(e) => handleChange('servingUnit', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              >
                <option value="g">g</option>
                <option value="ml">ml</option>
                <option value="oz">oz</option>
                <option value="cup">cup</option>
                <option value="tbsp">tbsp</option>
                <option value="tsp">tsp</option>
                <option value="piece">piece</option>
              </select>
            </div>
          </div>

          {/* Nutrition Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-gray-700 mb-2">
              Nutrition per serving
            </h3>

            {/* Calories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calories (kcal) *
              </label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => handleChange('calories', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="0"
                min="0"
                step="1"
                required
              />
            </div>

            {/* Protein */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Protein (g) *
              </label>
              <input
                type="number"
                value={formData.protein}
                onChange={(e) => handleChange('protein', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="0"
                min="0"
                step="0.1"
                required
              />
            </div>

            {/* Carbs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Carbohydrates (g) *
              </label>
              <input
                type="number"
                value={formData.carbs}
                onChange={(e) => handleChange('carbs', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="0"
                min="0"
                step="0.1"
                required
              />
            </div>

            {/* Fat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fat (g) *
              </label>
              <input
                type="number"
                value={formData.fat}
                onChange={(e) => handleChange('fat', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="0"
                min="0"
                step="0.1"
                required
              />
            </div>

            {/* Fiber (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fiber (g)
              </label>
              <input
                type="number"
                value={formData.fiber}
                onChange={(e) => handleChange('fiber', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="0 (optional)"
                min="0"
                step="0.1"
              />
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
              disabled={!isFormValid()}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add Food
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          * Required fields
        </p>
      </div>
    </div>
  );
}
