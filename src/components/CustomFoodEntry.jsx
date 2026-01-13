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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto border border-gray-100 animate-scale-in">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Add Custom Food
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Food Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span>🍽️</span>
              <span>Food Name *</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-lg font-medium transition-all duration-200 shadow-sm focus:shadow-md"
              placeholder="e.g., Homemade Pasta"
              required
            />
          </div>

          {/* Serving Size */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span>📏</span>
                <span>Serving Size *</span>
              </label>
              <input
                type="number"
                value={formData.servingSize}
                onChange={(e) => handleChange('servingSize', e.target.value)}
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-lg font-medium transition-all duration-200 shadow-sm focus:shadow-md"
                placeholder="100"
                min="0"
                step="0.1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Unit
              </label>
              <select
                value={formData.servingUnit}
                onChange={(e) => handleChange('servingUnit', e.target.value)}
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-lg font-medium transition-all duration-200 shadow-sm focus:shadow-md"
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
          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-5 border-2 border-gray-100 space-y-3">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">
              Nutrition per serving
            </h3>

            {/* Calories */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span>🔥</span>
                <span>Calories (kcal) *</span>
              </label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => handleChange('calories', e.target.value)}
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-lg font-medium transition-all duration-200 shadow-sm focus:shadow-md"
                placeholder="0"
                min="0"
                step="1"
                required
              />
            </div>

            {/* Protein */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span>💪</span>
                <span>Protein (g) *</span>
              </label>
              <input
                type="number"
                value={formData.protein}
                onChange={(e) => handleChange('protein', e.target.value)}
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-lg font-medium transition-all duration-200 shadow-sm focus:shadow-md"
                placeholder="0"
                min="0"
                step="0.1"
                required
              />
            </div>

            {/* Carbs */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span>🌾</span>
                <span>Carbohydrates (g) *</span>
              </label>
              <input
                type="number"
                value={formData.carbs}
                onChange={(e) => handleChange('carbs', e.target.value)}
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-lg font-medium transition-all duration-200 shadow-sm focus:shadow-md"
                placeholder="0"
                min="0"
                step="0.1"
                required
              />
            </div>

            {/* Fat */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span>🥑</span>
                <span>Fat (g) *</span>
              </label>
              <input
                type="number"
                value={formData.fat}
                onChange={(e) => handleChange('fat', e.target.value)}
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-lg font-medium transition-all duration-200 shadow-sm focus:shadow-md"
                placeholder="0"
                min="0"
                step="0.1"
                required
              />
            </div>

            {/* Fiber (optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span>🌿</span>
                <span>Fiber (g)</span>
              </label>
              <input
                type="number"
                value={formData.fiber}
                onChange={(e) => handleChange('fiber', e.target.value)}
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-lg font-medium transition-all duration-200 shadow-sm focus:shadow-md"
                placeholder="0 (optional)"
                min="0"
                step="0.1"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:shadow-md transition-all duration-200 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid()}
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 active:scale-95 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Add Food
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-5 text-center bg-gray-50 rounded-xl p-3">
          * Required fields
        </p>
      </div>
    </div>
  );
}
