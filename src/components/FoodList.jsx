import MealSection from './MealSection';

/**
 * Food List Component
 * Displays foods organized by meal categories
 */

const MEAL_CATEGORIES = [
  { type: 'breakfast', title: 'Breakfast' },
  { type: 'lunch', title: 'Lunch' },
  { type: 'dinner', title: 'Dinner' },
  { type: 'snacks', title: 'Snacks' },
];

export default function FoodList({ foods, onDeleteFood, onAddFood }) {
  // Group foods by meal category
  // Foods without a meal property default to 'snacks' (for backwards compatibility)
  const foodsByMeal = MEAL_CATEGORIES.reduce((acc, meal) => {
    acc[meal.type] = foods.filter(f =>
      f.meal === meal.type || (!f.meal && meal.type === 'snacks')
    );
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {MEAL_CATEGORIES.map(meal => (
        <MealSection
          key={meal.type}
          title={meal.title}
          mealType={meal.type}
          foods={foodsByMeal[meal.type]}
          onDeleteFood={onDeleteFood}
          onAddFood={onAddFood}
        />
      ))}
    </div>
  );
}
