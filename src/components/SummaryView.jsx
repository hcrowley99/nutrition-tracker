import { useMemo } from 'react';
import { calculateDailyTotals, formatDate, getTodayDate } from '../utils/calculations';

/**
 * Summary View Component
 * Shows weekly and monthly nutrition summaries
 */
export default function SummaryView({ loggedFoods, goals, viewType }) {
  // Get date range based on view type
  const dateRange = useMemo(() => {
    const today = new Date(getTodayDate() + 'T00:00:00');
    const dates = [];

    if (viewType === 'weekly') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }
    } else if (viewType === 'monthly') {
      // Current month
      const year = today.getFullYear();
      const month = today.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        if (date <= today) {
          dates.push(date.toISOString().split('T')[0]);
        }
      }
    }

    return dates;
  }, [viewType]);

  // Calculate totals for each day in the range
  const dailyData = useMemo(() => {
    return dateRange.map(date => {
      const totals = calculateDailyTotals(loggedFoods, date);
      const hasData = totals.calories > 0;
      const isOnTrack = hasData &&
        totals.calories >= goals.calories * 0.9 &&
        totals.calories <= goals.calories * 1.1;

      return {
        date,
        totals,
        hasData,
        isOnTrack
      };
    });
  }, [dateRange, loggedFoods, goals]);

  // Calculate aggregate statistics
  const stats = useMemo(() => {
    const daysWithData = dailyData.filter(d => d.hasData);
    const numDays = daysWithData.length;

    if (numDays === 0) {
      return {
        avgCalories: 0,
        avgProtein: 0,
        avgCarbs: 0,
        avgFat: 0,
        avgFiber: 0,
        totalCalories: 0,
        daysOnTrack: 0,
        highestDay: null,
        lowestDay: null,
        streak: 0
      };
    }

    const totals = daysWithData.reduce((acc, day) => ({
      calories: acc.calories + day.totals.calories,
      protein: acc.protein + day.totals.protein,
      carbs: acc.carbs + day.totals.carbs,
      fat: acc.fat + day.totals.fat,
      fiber: acc.fiber + day.totals.fiber
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    const daysOnTrack = daysWithData.filter(d => d.isOnTrack).length;

    // Find highest and lowest calorie days
    let highestDay = daysWithData[0];
    let lowestDay = daysWithData[0];

    daysWithData.forEach(day => {
      if (day.totals.calories > highestDay.totals.calories) highestDay = day;
      if (day.totals.calories < lowestDay.totals.calories) lowestDay = day;
    });

    // Calculate current streak (consecutive days on track, counting backwards from today)
    let streak = 0;
    for (let i = dailyData.length - 1; i >= 0; i--) {
      if (dailyData[i].hasData && dailyData[i].isOnTrack) {
        streak++;
      } else if (dailyData[i].hasData) {
        break; // Break streak if there's data but not on track
      }
      // Continue if no data (don't break streak for days without entries)
    }

    return {
      avgCalories: Math.round(totals.calories / numDays),
      avgProtein: Math.round(totals.protein / numDays),
      avgCarbs: Math.round(totals.carbs / numDays),
      avgFat: Math.round(totals.fat / numDays),
      avgFiber: Math.round(totals.fiber / numDays),
      totalCalories: Math.round(totals.calories),
      daysOnTrack,
      highestDay,
      lowestDay,
      streak
    };
  }, [dailyData, goals]);

  // Helper to format date for display
  const formatDayLabel = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    if (viewType === 'weekly') {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Helper to get bar width percentage
  const getBarWidth = (calories) => {
    if (!calories || goals.calories === 0) return 0;
    return Math.min((calories / goals.calories) * 100, 100);
  };

  // Helper to get bar color
  const getBarColor = (calories) => {
    if (!calories) return 'bg-gray-300';
    const percentage = (calories / goals.calories) * 100;
    if (percentage >= 90 && percentage <= 110) return 'bg-green-500';
    if (percentage > 110) return 'bg-red-500';
    return 'bg-yellow-500';
  };

  // Helper to get trend arrow
  const getTrendArrow = (value, target) => {
    const percentage = (value / target) * 100;
    if (percentage >= 90 && percentage <= 110) {
      return <span className="text-green-600">●</span>;
    }
    if (percentage < 90) {
      return <span className="text-yellow-600">↓</span>;
    }
    return <span className="text-red-600">↑</span>;
  };

  const viewTitle = viewType === 'weekly' ? 'Weekly Summary' : 'Monthly Summary';
  const periodLabel = viewType === 'weekly' ? 'Last 7 Days' : 'This Month';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-1">{viewTitle}</h2>
        <p className="text-sm text-gray-600">{periodLabel}</p>
      </div>

      {/* Aggregate Statistics */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary Statistics</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Avg Calories/Day</p>
            <p className="text-2xl font-bold text-blue-600">{stats.avgCalories}</p>
            <p className="text-xs text-gray-500">Goal: {goals.calories}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Days On Track</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.daysOnTrack}/{dailyData.filter(d => d.hasData).length}
            </p>
            <p className="text-xs text-gray-500">
              {dailyData.filter(d => d.hasData).length > 0
                ? Math.round((stats.daysOnTrack / dailyData.filter(d => d.hasData).length) * 100)
                : 0}% success rate
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Current Streak</p>
            <p className="text-2xl font-bold text-purple-600">{stats.streak}</p>
            <p className="text-xs text-gray-500">days</p>
          </div>

          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Total Calories</p>
            <p className="text-2xl font-bold text-orange-600">{stats.totalCalories.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{periodLabel.toLowerCase()}</p>
          </div>
        </div>

        {/* Average Macros */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">Average Daily Macros</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Protein</span>
              <span className="font-semibold text-gray-800">
                {getTrendArrow(stats.avgProtein, goals.protein)} {stats.avgProtein}g
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Carbs</span>
              <span className="font-semibold text-gray-800">
                {getTrendArrow(stats.avgCarbs, goals.carbs)} {stats.avgCarbs}g
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fat</span>
              <span className="font-semibold text-gray-800">
                {getTrendArrow(stats.avgFat, goals.fat)} {stats.avgFat}g
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fiber</span>
              <span className="font-semibold text-gray-800">
                {getTrendArrow(stats.avgFiber, goals.fiber)} {stats.avgFiber}g
              </span>
            </div>
          </div>
        </div>

        {/* Highest/Lowest Days */}
        {stats.highestDay && stats.lowestDay && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Highlights</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Highest Day</span>
                <span className="font-semibold text-red-600">
                  {formatDayLabel(stats.highestDay.date)}: {Math.round(stats.highestDay.totals.calories)} cal
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Lowest Day</span>
                <span className="font-semibold text-blue-600">
                  {formatDayLabel(stats.lowestDay.date)}: {Math.round(stats.lowestDay.totals.calories)} cal
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Daily Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Breakdown</h3>

        <div className="space-y-3">
          {dailyData.map((day) => (
            <div key={day.date} className="border-b border-gray-100 pb-3 last:border-0">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {formatDayLabel(day.date)}
                  </p>
                  {day.date === getTodayDate() && (
                    <span className="text-xs text-blue-600 font-medium">Today</span>
                  )}
                </div>
                <div className="text-right">
                  {day.hasData ? (
                    <>
                      <p className="text-sm font-bold text-gray-800">
                        {Math.round(day.totals.calories)} cal
                      </p>
                      <p className="text-xs text-gray-500">
                        P: {Math.round(day.totals.protein)}g ·
                        C: {Math.round(day.totals.carbs)}g ·
                        F: {Math.round(day.totals.fat)}g
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400">No data</p>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getBarColor(day.totals.calories)}`}
                  style={{ width: `${getBarWidth(day.totals.calories)}%` }}
                ></div>
              </div>

              {day.hasData && (
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((day.totals.calories / goals.calories) * 100)}% of goal
                  {day.isOnTrack && (
                    <span className="text-green-600 ml-2">✓ On track</span>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Under goal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>On track (90-110%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Over goal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
