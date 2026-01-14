import CalorieRing from './CalorieRing';

/**
 * Daily Progress Component - Apple Health Inspired
 * Shows calorie ring and gradient macro cards
 */
export default function DailyProgress({ totals, goals, progress }) {
  // Macro nutrients with gradient colors
  const nutrients = [
    {
      key: 'protein',
      label: 'Protein',
      unit: 'g',
      icon: '💪',
      gradient: 'from-cyan-500 to-teal-400',
      bgGradient: 'from-cyan-900/40 to-teal-900/40',
      borderColor: 'border-cyan-700'
    },
    {
      key: 'carbs',
      label: 'Carbs',
      unit: 'g',
      icon: '🌾',
      gradient: 'from-yellow-400 to-amber-300',
      bgGradient: 'from-yellow-900/40 to-amber-900/40',
      borderColor: 'border-yellow-700'
    },
    {
      key: 'fat',
      label: 'Fat',
      unit: 'g',
      icon: '🥑',
      gradient: 'from-green-400 to-emerald-400',
      bgGradient: 'from-green-900/40 to-emerald-900/40',
      borderColor: 'border-green-700'
    },
    {
      key: 'fiber',
      label: 'Fiber',
      unit: 'g',
      icon: '🌿',
      gradient: 'from-blue-500 to-blue-400',
      bgGradient: 'from-blue-900/40 to-blue-900/40',
      borderColor: 'border-blue-700'
    },
  ];

  return (
    <div className="bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-card p-6 mb-6 border border-gray-700">
      {/* Calorie Ring - Hero Element */}
      <div className="flex justify-center mb-8">
        <CalorieRing current={totals.calories} goal={goals.calories} />
      </div>

      {/* Macro Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {nutrients.map(({ key, label, unit, icon, gradient, bgGradient, borderColor }) => {
          const value = Math.round(totals[key]);
          const goalValue = goals[key];
          const percentage = Math.min(progress[key], 100);

          return (
            <div
              key={key}
              className={`bg-gradient-to-br ${bgGradient} border-2 ${borderColor} rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200`}
            >
              {/* Icon and Label */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{icon}</span>
                <span className="text-sm font-semibold text-gray-200">{label}</span>
              </div>

              {/* Values */}
              <div className="mb-2">
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                    {value}
                  </span>
                  <span className="text-xs text-gray-400">/ {goalValue}{unit}</span>
                </div>
              </div>

              {/* Mini Progress Bar */}
              <div className="w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden mb-2">
                <div
                  className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Percentage */}
              <div className="text-xs font-medium text-gray-400">
                {Math.round(progress[key])}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
