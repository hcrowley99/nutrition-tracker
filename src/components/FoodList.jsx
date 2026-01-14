/**
 * Food List Component - Enhanced Design
 * Displays all foods logged for the selected date with beautiful cards
 */
export default function FoodList({ foods, onDeleteFood }) {
  if (foods.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-800/50 rounded-3xl border-2 border-dashed border-gray-600 p-12 text-center">
        <svg className="w-20 h-20 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-lg font-semibold text-gray-300 mb-1">No foods logged today</p>
        <p className="text-sm text-gray-500">
          Search and add foods above to start tracking
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-card p-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-5">
        Today's Foods
      </h2>

      <div className="space-y-3">
        {foods.map((food) => (
          <div
            key={food.id}
            className="bg-gradient-to-br from-gray-700 to-gray-700/50 border-2 border-gray-600 rounded-2xl p-4 hover:border-gray-500 hover:shadow-md transition-all duration-200 hover:translate-x-1"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 pr-3">
                <h3 className="font-semibold text-white text-lg leading-tight">{food.name}</h3>
                {food.brandName && (
                  <p className="text-sm text-gray-400 font-medium mt-0.5">{food.brandName}</p>
                )}
                <p className="text-sm text-gray-400 font-medium mt-1">
                  {food.quantity} × {food.servingSize}{food.servingUnit}
                </p>
              </div>
              <button
                onClick={() => onDeleteFood(food.id)}
                className="flex-shrink-0 p-2.5 bg-red-900/40 hover:bg-red-900/60 border-2 border-red-700 rounded-xl text-red-400 hover:scale-110 transition-all duration-150 active:scale-95"
                title="Delete"
              >
                <svg
                  className="w-5 h-5"
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

            {/* Nutrition Display */}
            <div className="flex items-center gap-4">
              {/* Calorie Badge */}
              <div className="bg-gradient-to-r from-red-900/40 to-pink-900/40 border-2 border-red-700 rounded-xl px-3 py-1.5">
                <span className="text-base font-bold text-red-400">{Math.round(food.calories)}</span>
                <span className="text-xs text-red-500 ml-0.5">cal</span>
              </div>

              {/* Macros */}
              <div className="flex gap-3 text-sm font-medium text-gray-300 flex-wrap">
                <span>P: <span className="font-bold">{food.protein}g</span></span>
                <span className="text-gray-500">•</span>
                <span>C: <span className="font-bold">{food.carbs}g</span></span>
                <span className="text-gray-500">•</span>
                <span>F: <span className="font-bold">{food.fat}g</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
