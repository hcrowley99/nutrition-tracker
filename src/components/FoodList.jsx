/**
 * Food List Component
 * Displays all foods logged for the selected date
 */
export default function FoodList({ foods, onDeleteFood }) {
  if (foods.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-400">No foods logged today</p>
        <p className="text-sm text-gray-400 mt-1">
          Search and add foods above to start tracking
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-3">
        Today's Foods
      </h2>

      <div className="space-y-2">
        {foods.map((food) => (
          <div
            key={food.id}
            className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{food.foodName}</h3>
                {food.brandName && (
                  <p className="text-sm text-gray-500">{food.brandName}</p>
                )}
                <p className="text-sm text-gray-500">
                  {food.quantity} × {food.servingSize}{food.servingUnit}
                </p>
              </div>
              <button
                onClick={() => onDeleteFood(food.id)}
                className="ml-2 text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
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

            {/* Nutrition Info */}
            <div className="flex gap-4 text-sm">
              <span className="text-gray-700">
                <span className="font-semibold">{Math.round(food.calories)}</span> cal
              </span>
              <span className="text-gray-600">P: {food.protein}g</span>
              <span className="text-gray-600">C: {food.carbs}g</span>
              <span className="text-gray-600">F: {food.fat}g</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
