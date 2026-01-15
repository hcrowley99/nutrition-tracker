import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateDailyTotals, calculateProgress, getTodayDate, formatDate } from './utils/calculations';
import { addToRecentFoods } from './utils/recentFoods';
import GoalsSetting from './components/GoalsSetting';
import DailyProgress from './components/DailyProgress';
import FoodLogger from './components/FoodLogger';
import FoodList from './components/FoodList';
import SummaryView from './components/SummaryView';
import AddFoodPage from './components/AddFoodPage';

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
  const [viewMode, setViewMode] = useState('daily'); // 'daily', 'weekly', 'monthly'

  // Add Food Page state
  const [showAddFoodPage, setShowAddFoodPage] = useState(false);
  const [activeMealCategory, setActiveMealCategory] = useState(null);

  // Calculate totals and progress for selected date
  const todaysFoods = loggedFoods.filter(food => food.date === selectedDate);
  const totals = calculateDailyTotals(loggedFoods, selectedDate);
  const progress = calculateProgress(totals, goals);

  // Handler: Save new goals
  const handleSaveGoals = (newGoals) => {
    setGoals(newGoals);
    setShowGoalsModal(false);
  };

  // Handler: Open Add Food page for a meal
  const handleOpenAddFood = (mealCategory) => {
    setActiveMealCategory(mealCategory);
    setShowAddFoodPage(true);
  };

  // Handler: Select food from Add Food page (opens logger modal)
  const handleSelectFood = (food) => {
    setSelectedFood(food);
  };

  // Handler: Add food to log
  const handleAddFood = (loggedFood) => {
    const newFood = {
      ...loggedFood,
      id: Date.now().toString(), // Simple unique ID
      date: selectedDate,
      meal: activeMealCategory, // Add meal category
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

    // Close both modal and page, return to main view
    setSelectedFood(null);
    setShowAddFoodPage(false);
    setActiveMealCategory(null);
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
      meal: activeMealCategory, // Copy to current meal category
    }));

    setLoggedFoods([...loggedFoods, ...newFoods]);

    // Close page and return to main view
    setShowAddFoodPage(false);
    setActiveMealCategory(null);
  };

  // Handler: Change date
  const handleDateChange = (days) => {
    const currentDate = new Date(selectedDate + 'T00:00:00');
    currentDate.setDate(currentDate.getDate() + days);
    // Use local time components instead of toISOString (which uses UTC)
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  };

  // Handler: Close Add Food page
  const handleCloseAddFoodPage = () => {
    setShowAddFoodPage(false);
    setActiveMealCategory(null);
    setSelectedFood(null);
  };

  // Render Add Food Page
  if (showAddFoodPage) {
    return (
      <>
        <AddFoodPage
          mealCategory={activeMealCategory}
          onSelectFood={handleSelectFood}
          onClose={handleCloseAddFoodPage}
          onCopyFoods={handleCopyFoods}
          loggedFoods={loggedFoods}
          selectedDate={selectedDate}
        />

        {/* FoodLogger modal overlays the Add Food page */}
        {selectedFood && (
          <FoodLogger
            food={selectedFood}
            onAddFood={handleAddFood}
            onCancel={() => setSelectedFood(null)}
          />
        )}
      </>
    );
  }

  // Render Main View
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

            {/* Food List with Meal Sections */}
            <FoodList
              foods={todaysFoods}
              onDeleteFood={handleDeleteFood}
              onAddFood={handleOpenAddFood}
            />
          </>
        ) : (
          <SummaryView loggedFoods={loggedFoods} goals={goals} viewType={viewMode} />
        )}
      </main>

      {/* Goals Modal */}
      {showGoalsModal && (
        <GoalsSetting
          goals={goals}
          onSaveGoals={handleSaveGoals}
          onClose={() => setShowGoalsModal(false)}
        />
      )}
    </div>
  );
}

export default App;
