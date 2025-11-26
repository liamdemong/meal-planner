// Shared types across both frontend and backend!

export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes?: number;
  servings?: number;
}

export interface MealPlanEntry {
  id?: string;
  date: string; // YYYY-MM-DD
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  recipe: Recipe;
  userId?: string;
}

export interface DayMealPlan {
  date: string;
  meals: MealPlanEntry[];
}

export interface WeekMealPlan {
  weekStart: string; // starts monday
  days: DayMealPlan[];
}
