import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateDailyTotals, calculateProgress, getTodayDate, formatDate } from './utils/calculations';
import GoalsSetting from './components/GoalsSetting';
import DailyProgress from './components/DailyProgress';
import FoodSearch from './components/FoodSearch';
import FoodLogger from './components/FoodLogger';
import FoodList from './components/FoodList';
import CustomFoodEntry from './components/CustomFoodEntry';

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

  // Handler: Add food to log
  const handleAddFood = (loggedFood) => {
    const newFood = {
      ...loggedFood,
      id: Date.now().toString(), // Simple unique ID
      date: selectedDate,
    };

    setLoggedFoods([...loggedFoods, newFood]);
    setSelectedFood(null); // Close modal
  };

  // Handler: Delete food from log
  const handleDeleteFood = (foodId) => {
    if (window.confirm('Delete this food entry?')) {
      setLoggedFoods(loggedFoods.filter(food => food.id !== foodId));
    }
  };

  // Handler: Change date
  const handleDateChange = (days) => {
    const currentDate = new Date(selectedDate + 'T00:00:00');
    currentDate.setDate(currentDate.getDate() + days);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">NutriTrack</h1>
            <button
              onClick={() => setShowGoalsModal(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
            >
              Set Goals
            </button>
          </div>

          {/* Date Selector */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => handleDateChange(-1)}
              className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-center">
              <p className="text-lg font-semibold">{formatDate(selectedDate)}</p>
              {selectedDate === getTodayDate() && (
                <p className="text-sm text-blue-200">Today</p>
              )}
            </div>
            <button
              onClick={() => handleDateChange(1)}
              className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
              disabled={selectedDate === getTodayDate()}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Daily Progress */}
        <DailyProgress totals={totals} goals={goals} progress={progress} />

        {/* Food Search and Custom Food Button */}
        <div className="space-y-3">
          <FoodSearch onSelectFood={handleSelectFood} />

          {/* Add Custom Food Button */}
          <div className="text-center">
            <button
              onClick={() => setShowCustomFoodModal(true)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md"
            >
              + Add Custom Food
            </button>
          </div>
        </div>

        {/* Food List */}
        <FoodList foods={todaysFoods} onDeleteFood={handleDeleteFood} />
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

      {selectedFood && (
        <FoodLogger
          food={selectedFood}
          onAddFood={handleAddFood}
          onCancel={() => setSelectedFood(null)}
        />
      )}
    </div>
  );
}

export default App;
