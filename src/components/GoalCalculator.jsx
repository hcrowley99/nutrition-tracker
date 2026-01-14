import { useState } from 'react';
import {
  calculateBMR,
  calculateTDEE,
  calculateMacros,
  calculateCalorieTarget,
  ACTIVITY_LEVELS,
  GOAL_PRESETS
} from '../utils/goalCalculations';

/**
 * Goal Calculator Component
 * Calculate nutrition goals based on user metrics using Mifflin-St Jeor formula
 */
export default function GoalCalculator({ onSaveGoals, onClose }) {
  const [step, setStep] = useState(1); // 1: metrics, 2: goal selection, 3: review
  const [unitSystem, setUnitSystem] = useState('imperial'); // 'imperial' or 'metric'
  const [metrics, setMetrics] = useState({
    weight: '',
    height: '',
    heightFeet: '',
    heightInches: '',
    age: '',
    sex: 'male',
    activityLevel: 'moderate',
  });
  const [selectedGoal, setSelectedGoal] = useState('balanced');
  const [calculatedGoals, setCalculatedGoals] = useState(null);

  // Convert weight to kg for calculations
  const getWeightInKg = () => {
    const weight = parseFloat(metrics.weight);
    if (unitSystem === 'imperial') {
      return weight * 0.453592; // lbs to kg
    }
    return weight;
  };

  // Convert height to cm for calculations
  const getHeightInCm = () => {
    if (unitSystem === 'imperial') {
      const feet = parseFloat(metrics.heightFeet) || 0;
      const inches = parseFloat(metrics.heightInches) || 0;
      const totalInches = (feet * 12) + inches;
      return totalInches * 2.54; // inches to cm
    }
    return parseFloat(metrics.height);
  };

  // Calculate goals based on metrics
  const calculateGoals = () => {
    const bmr = calculateBMR(
      getWeightInKg(),
      getHeightInCm(),
      parseInt(metrics.age),
      metrics.sex
    );

    const tdee = calculateTDEE(bmr, metrics.activityLevel);
    const calories = calculateCalorieTarget(tdee, selectedGoal);
    const macros = calculateMacros(calories, selectedGoal);

    return {
      calories,
      protein: macros.protein,
      carbs: macros.carbs,
      fat: macros.fat,
      fiber: 30, // Standard recommendation
      bmr,
      tdee,
    };
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate metrics based on unit system
      const hasHeight = unitSystem === 'imperial'
        ? (metrics.heightFeet || metrics.heightInches)
        : metrics.height;

      if (!metrics.weight || !hasHeight || !metrics.age) {
        alert('Please fill in all required fields');
        return;
      }

      const heightValue = getHeightInCm();
      if (parseFloat(metrics.weight) <= 0 || heightValue <= 0 || parseInt(metrics.age) <= 0) {
        alert('Please enter valid positive values');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Calculate and show preview
      const goals = calculateGoals();
      setCalculatedGoals(goals);

      // Store metrics in localStorage for future reference
      localStorage.setItem('user-metrics', JSON.stringify({ ...metrics, unitSystem }));

      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSave = () => {
    if (calculatedGoals) {
      onSaveGoals({
        calories: calculatedGoals.calories,
        protein: calculatedGoals.protein,
        carbs: calculatedGoals.carbs,
        fat: calculatedGoals.fat,
        fiber: calculatedGoals.fiber,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-gray-100 animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            🧮 Goal Calculator
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center items-center gap-3 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                step >= s
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-1 mx-1 transition-all duration-300 ${
                  step > s ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: User Metrics */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50/50 rounded-2xl p-5 border-2 border-blue-100">
              <p className="text-sm text-blue-900 font-medium">
                Enter your metrics to calculate personalized nutrition goals using the Mifflin-St Jeor formula
              </p>
            </div>

            {/* Unit System Toggle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Unit System
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setUnitSystem('imperial')}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    unitSystem === 'imperial'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Imperial (lbs, ft/in)
                </button>
                <button
                  type="button"
                  onClick={() => setUnitSystem('metric')}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    unitSystem === 'metric'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Metric (kg, cm)
                </button>
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Weight ({unitSystem === 'imperial' ? 'lbs' : 'kg'})
              </label>
              <input
                type="number"
                value={metrics.weight}
                onChange={(e) => setMetrics({ ...metrics, weight: e.target.value })}
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-lg font-medium transition-all duration-200"
                placeholder={unitSystem === 'imperial' ? '150' : '70'}
                step="0.1"
                min="0"
                required
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Height ({unitSystem === 'imperial' ? 'ft / in' : 'cm'})
              </label>
              {unitSystem === 'imperial' ? (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={metrics.heightFeet}
                      onChange={(e) => setMetrics({ ...metrics, heightFeet: e.target.value })}
                      className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-lg font-medium transition-all duration-200"
                      placeholder="5"
                      min="0"
                      max="8"
                    />
                    <span className="text-xs text-gray-500 mt-1 block text-center">feet</span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={metrics.heightInches}
                      onChange={(e) => setMetrics({ ...metrics, heightInches: e.target.value })}
                      className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-lg font-medium transition-all duration-200"
                      placeholder="10"
                      min="0"
                      max="11"
                      step="0.5"
                    />
                    <span className="text-xs text-gray-500 mt-1 block text-center">inches</span>
                  </div>
                </div>
              ) : (
                <input
                  type="number"
                  value={metrics.height}
                  onChange={(e) => setMetrics({ ...metrics, height: e.target.value })}
                  className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-lg font-medium transition-all duration-200"
                  placeholder="175"
                  step="0.1"
                  min="0"
                  required
                />
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🎂 Age (years)
              </label>
              <input
                type="number"
                value={metrics.age}
                onChange={(e) => setMetrics({ ...metrics, age: e.target.value })}
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-lg font-medium transition-all duration-200"
                placeholder="30"
                min="0"
                required
              />
            </div>

            {/* Sex */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                👤 Sex
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setMetrics({ ...metrics, sex: 'male' })}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    metrics.sex === 'male'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setMetrics({ ...metrics, sex: 'female' })}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    metrics.sex === 'female'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                🏃 Activity Level
              </label>
              <div className="space-y-2">
                {ACTIVITY_LEVELS.map((level) => (
                  <button
                    key={level.key}
                    type="button"
                    onClick={() => setMetrics({ ...metrics, activityLevel: level.key })}
                    className={`w-full text-left py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                      metrics.activityLevel === level.key
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-semibold">{level.label}</div>
                    <div className={`text-sm ${
                      metrics.activityLevel === level.key ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {level.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Goal Selection */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50/50 rounded-2xl p-5 border-2 border-blue-100">
              <p className="text-sm text-blue-900 font-medium">
                🎯 Choose your primary goal to get optimal macro distribution
              </p>
            </div>

            <div className="space-y-3">
              {GOAL_PRESETS.map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => setSelectedGoal(preset.key)}
                  className={`w-full text-left py-4 px-5 rounded-2xl font-medium transition-all duration-200 ${
                    selectedGoal === preset.key
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-xl scale-[1.02]'
                      : 'bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 text-gray-700 hover:border-blue-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{preset.emoji}</span>
                    <div className="flex-1">
                      <div className="font-bold text-lg">{preset.label}</div>
                      <div className={`text-sm ${
                        selectedGoal === preset.key ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {preset.description}
                      </div>
                      <div className={`text-xs mt-1 ${
                        selectedGoal === preset.key ? 'text-white/70' : 'text-gray-400'
                      }`}>
                        {preset.detail}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {step === 3 && calculatedGoals && (
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-2xl p-5 border-2 border-green-200">
              <p className="text-sm text-green-900 font-medium">
                ✅ Your personalized goals are ready! Review and save below.
              </p>
            </div>

            {/* Calculated Values */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-5 border-2 border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">📊 Your Metrics</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white rounded-xl p-3 border border-blue-100">
                  <p className="text-gray-600 font-medium">BMR</p>
                  <p className="text-2xl font-bold text-blue-600">{calculatedGoals.bmr}</p>
                  <p className="text-xs text-gray-400">calories/day at rest</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-cyan-100">
                  <p className="text-gray-600 font-medium">TDEE</p>
                  <p className="text-2xl font-bold text-cyan-600">{calculatedGoals.tdee}</p>
                  <p className="text-xs text-gray-400">total daily expenditure</p>
                </div>
              </div>
            </div>

            {/* Goal Preview */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-5 border-2 border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">🎯 Daily Goals</h3>
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-4 border-2 border-red-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">🔥 Calories</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                      {calculatedGoals.calories}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-xl p-3 border-2 border-cyan-100">
                    <p className="text-xs text-gray-600 font-semibold mb-1">💪 Protein</p>
                    <p className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-teal-400 bg-clip-text text-transparent">
                      {calculatedGoals.protein}g
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border-2 border-yellow-100">
                    <p className="text-xs text-gray-600 font-semibold mb-1">🌾 Carbs</p>
                    <p className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
                      {calculatedGoals.carbs}g
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border-2 border-green-100">
                    <p className="text-xs text-gray-600 font-semibold mb-1">🥑 Fat</p>
                    <p className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      {calculatedGoals.fat}g
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:shadow-md transition-all duration-200 active:scale-95"
            >
              ← Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 active:scale-95"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 active:scale-95"
            >
              💾 Save Goals
            </button>
          )}
        </div>

        {/* Helper Text */}
        <p className="text-xs text-gray-500 mt-5 text-center bg-gray-50 rounded-xl p-3">
          💡 Your metrics are saved locally for future calculations. You can switch between calculated and manual goals anytime.
        </p>
      </div>
    </div>
  );
}
