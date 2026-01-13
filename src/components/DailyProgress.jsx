/**
 * Daily Progress Component
 * Shows current nutrition totals vs goals with progress bars
 */
export default function DailyProgress({ totals, goals, progress }) {
  // Determine color based on progress percentage
  const getColor = (percentage) => {
    if (percentage >= 90 && percentage <= 110) return 'bg-green-500';
    if (percentage >= 110) return 'bg-red-500';
    return 'bg-yellow-500';
  };

  const getTextColor = (percentage) => {
    if (percentage >= 90 && percentage <= 110) return 'text-green-600';
    if (percentage >= 110) return 'text-red-600';
    return 'text-yellow-600';
  };

  const nutrients = [
    { key: 'protein', label: 'Protein', unit: 'g' },
    { key: 'carbs', label: 'Carbs', unit: 'g' },
    { key: 'fat', label: 'Fat', unit: 'g' },
    { key: 'fiber', label: 'Fiber', unit: 'g' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      {/* Calories - Large Display */}
      <div className="text-center mb-6 pb-6 border-b border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Calories</p>
        <div className="flex items-center justify-center gap-2">
          <span className={`text-4xl font-bold ${getTextColor(progress.calories)}`}>
            {Math.round(totals.calories)}
          </span>
          <span className="text-2xl text-gray-400">/</span>
          <span className="text-2xl text-gray-600">{goals.calories}</span>
        </div>
        <div className="mt-3 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getColor(progress.calories)}`}
            style={{ width: `${Math.min(progress.calories, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {Math.round(progress.calories)}% of daily goal
        </p>
      </div>

      {/* Macros Grid */}
      <div className="grid grid-cols-1 gap-4">
        {nutrients.map(({ key, label, unit }) => (
          <div key={key}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              <span className={`text-sm font-semibold ${getTextColor(progress[key])}`}>
                {Math.round(totals[key])}{unit} / {goals[key]}{unit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getColor(progress[key])}`}
                style={{ width: `${Math.min(progress[key], 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round(progress[key])}%
            </p>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Under goal</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>On track</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Over goal</span>
        </div>
      </div>
    </div>
  );
}
