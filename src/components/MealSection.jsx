/**
 * Meal Section Component
 * Displays foods for a single meal category with add/delete functionality
 */

const MEAL_ICONS = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snacks: '🍿',
};

export default function MealSection({ title, mealType, foods, onDeleteFood, onAddFood }) {
  // Calculate meal totals
  const mealTotals = foods.reduce(
    (acc, food) => ({
      calories: acc.calories + (food.calories || 0),
      protein: acc.protein + (food.protein || 0),
      carbs: acc.carbs + (food.carbs || 0),
      fat: acc.fat + (food.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-card p-5 border border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{MEAL_ICONS[mealType]}</span>
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-sm text-gray-400">
              {mealTotals.calories > 0
                ? `${Math.round(mealTotals.calories)} cal`
                : 'No foods yet'}
            </p>
          </div>
        </div>
        <button
          onClick={() => onAddFood(mealType)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 active:scale-95"
        >
          + Add
        </button>
      </div>

      {/* Food Items */}
      {foods.length > 0 ? (
        <div className="space-y-2">
          {foods.map((food) => (
            <div
              key={food.id}
              className="bg-gradient-to-br from-gray-700 to-gray-700/50 border border-gray-600 rounded-xl p-3 hover:border-gray-500 transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-3 min-w-0">
                  <h4 className="font-medium text-white text-sm leading-tight truncate">
                    {food.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {food.displayAmount !== undefined
                      ? `${food.displayAmount} ${food.displayUnit}`
                      : `${food.quantity} × ${food.servingSize}${food.servingUnit}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Calorie Badge */}
                  <div className="bg-gray-800 border border-gray-600 rounded-lg px-2 py-1">
                    <span className="text-sm font-semibold text-red-400">
                      {Math.round(food.calories)}
                    </span>
                    <span className="text-xs text-gray-500 ml-0.5">cal</span>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => onDeleteFood(food.id)}
                    className="p-1.5 bg-red-900/30 hover:bg-red-900/50 border border-red-800 rounded-lg text-red-400 hover:scale-110 transition-all duration-150 active:scale-95"
                    title="Delete"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-6 text-center">
          <p className="text-gray-500 text-sm">
            Tap "+ Add" to log {mealType}
          </p>
        </div>
      )}

      {/* Meal Summary (when has foods) */}
      {foods.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="flex justify-between text-xs text-gray-400">
            <span>P: <span className="text-gray-300 font-medium">{Math.round(mealTotals.protein)}g</span></span>
            <span>C: <span className="text-gray-300 font-medium">{Math.round(mealTotals.carbs)}g</span></span>
            <span>F: <span className="text-gray-300 font-medium">{Math.round(mealTotals.fat)}g</span></span>
          </div>
        </div>
      )}
    </div>
  );
}
