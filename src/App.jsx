import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateDailyTotals, calculateProgress, getTodayDate, formatDate } from './utils/calculations';
import { addToRecentFoods } from './utils/recentFoods';
import GoalsSetting from './components/GoalsSetting';
import DailyProgress from './components/DailyProgress';
import FoodSearch from './components/FoodSearch';
import FoodLogger from './components/FoodLogger';
import FoodList from './components/FoodList';
import CustomFoodEntry from './components/CustomFoodEntry';
import SummaryView from './components/SummaryView';
import BarcodeScanner from './components/BarcodeScanner';
import CopyFromDay from './components/CopyFromDay';

// Default nutrition goals
const DEFAULT_GOALS = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 65,
  fiber: 30,
};

function App() {
  // State management
  const [goals, setGoals] = useLocalStorage('nutrition-goals', DEFAULT_GOALS);
  const [loggedFoods, setLoggedFoods] = useLocalStorage('logged-foods', []);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [showCustomFoodModal, setShowCustomFoodModal] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [viewMode, setViewMode] = useState('daily'); // 'daily', 'weekly', 'monthly'

  // Calculate totals and progress for selected date
  const todaysFoods = loggedFoods.filter(food => food.date === selectedDate);
  const totals = calculateDailyTotals(loggedFoods, selectedDate);
  const progress = calculateProgress(totals, goals);

  // Handler: Save new goals
  const handleSaveGoals = (newGoals) => {
    setGoals(newGoals);
    setShowGoalsModal(false);
  };

  // Handler: Select food from search (opens logger modal)
  const handleSelectFood = (food) => {
    setSelectedFood(food);
  };

  // Handler: Add custom food (opens logger modal)
  const handleAddCustomFood = (customFood) => {
    setShowCustomFoodModal(false);
    setSelectedFood(customFood); // Pass to logger modal for quantity adjustment
  };

  // Handler: Food found from barcode scan (opens logger modal)
  const handleBarcodeScanned = (food) => {
    setShowBarcodeScanner(false);
    setSelectedFood(food); // Pass to logger modal for quantity adjustment
  };

  // Handler: Add food to log
  const handleAddFood = (loggedFood) => {
    const newFood = {
      ...loggedFood,
      id: Date.now().toString(), // Simple unique ID
      date: selectedDate,
    };

    setLoggedFoods([...loggedFoods, newFood]);

    // Track in recent foods (store per-serving values for quick re-add)
    addToRecentFoods({
      fdcId: loggedFood.fdcId,
      name: loggedFood.name,
      brandName: loggedFood.brandName,
      calories: loggedFood.calories / loggedFood.quantity,
      protein: loggedFood.protein / loggedFood.quantity,
      carbs: loggedFood.carbs / loggedFood.quantity,
      fat: loggedFood.fat / loggedFood.quantity,
      fiber: (loggedFood.fiber || 0) / loggedFood.quantity,
      servingSize: loggedFood.servingSize,
      servingUnit: loggedFood.servingUnit,
      dataType: loggedFood.dataType,
    });

    setSelectedFood(null); // Close modal
  };

  // Handler: Delete food from log
  const handleDeleteFood = (foodId) => {
    if (window.confirm('Delete this food entry?')) {
      setLoggedFoods(loggedFoods.filter(food => food.id !== foodId));
    }
  };

  // Handler: Copy foods from another date
  const handleCopyFoods = (foodsToCopy) => {
    const newFoods = foodsToCopy.map(food => ({
      ...food,
      id: Date.now().toString() + Math.random(), // New unique ID
      date: selectedDate, // Copy to current selected date
    }));

    setLoggedFoods([...loggedFoods, ...newFoods]);
  };

  // Handler: Change date
  const handleDateChange = (days) => {
    const currentDate = new Date(selectedDate + 'T00:00:00');
    currentDate.setDate(currentDate.getDate() + days);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white shadow-2xl">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">MaddiGPT</h1>
            <button
              onClick={() => setShowGoalsModal(true)}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border-2 border-white/30 rounded-xl text-sm font-semibold transition-all duration-200 backdrop-blur-sm"
            >
              Set Goals
            </button>
          </div>

          {/* View Mode Tabs */}
          <div className="mt-5 flex gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-1.5">
            <button
              onClick={() => setViewMode('daily')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                viewMode === 'daily'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                viewMode === 'weekly'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                viewMode === 'monthly'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              Monthly
            </button>
          </div>

          {/* Date Selector - Only show in daily view */}
          {viewMode === 'daily' && (
            <div className="mt-5 flex items-center justify-between">
              <button
                onClick={() => handleDateChange(-1)}
                className="p-3 hover:bg-white/15 rounded-xl transition-all duration-200 active:scale-95"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="text-center">
                <p className="text-xl font-semibold">{formatDate(selectedDate)}</p>
                {selectedDate === getTodayDate() && (
                  <span className="inline-block mt-1 px-3 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    Today
                  </span>
                )}
              </div>
              <button
                onClick={() => handleDateChange(1)}
                className="p-3 hover:bg-white/15 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={selectedDate === getTodayDate()}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Show Summary View or Daily View based on viewMode */}
        {viewMode === 'daily' ? (
          <>
            {/* Daily Progress */}
            <DailyProgress totals={totals} goals={goals} progress={progress} />

            {/* Food Search and Action Buttons */}
            <div className="space-y-3">
              <FoodSearch onSelectFood={handleSelectFood} />

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setShowBarcodeScanner(true)}
                  className="px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 shadow-md flex items-center justify-center gap-2 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="hidden sm:inline">Scan</span>
                </button>
                <button
                  onClick={() => setShowCustomFoodModal(true)}
                  className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 shadow-md active:scale-95"
                >
                  + Custom
                </button>
                <button
                  onClick={() => setShowCopyModal(true)}
                  className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 shadow-md flex items-center justify-center gap-2 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                  <span className="hidden sm:inline">Copy</span>
                </button>
              </div>
            </div>

            {/* Food List */}
            <FoodList foods={todaysFoods} onDeleteFood={handleDeleteFood} />
          </>
        ) : (
          <SummaryView loggedFoods={loggedFoods} goals={goals} viewType={viewMode} />
        )}
      </main>

      {/* Modals */}
      {showGoalsModal && (
        <GoalsSetting
          goals={goals}
          onSaveGoals={handleSaveGoals}
          onClose={() => setShowGoalsModal(false)}
        />
      )}

      {showCustomFoodModal && (
        <CustomFoodEntry
          onAddFood={handleAddCustomFood}
          onCancel={() => setShowCustomFoodModal(false)}
        />
      )}

      {showBarcodeScanner && (
        <BarcodeScanner
          onFoodFound={handleBarcodeScanned}
          onClose={() => setShowBarcodeScanner(false)}
        />
      )}

      {selectedFood && (
        <FoodLogger
          food={selectedFood}
          onAddFood={handleAddFood}
          onCancel={() => setSelectedFood(null)}
        />
      )}

      {showCopyModal && (
        <CopyFromDay
          loggedFoods={loggedFoods}
          selectedDate={selectedDate}
          onCopyFoods={handleCopyFoods}
          onClose={() => setShowCopyModal(false)}
        />
      )}
    </div>
  );
}

export default App;
