// Shared types across both frontend and backend!

export interface Ingredient {
  id: number;
  name: string;
  original: string;
  amount: number;
  unit: string;
  image?: string;
}

export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes?: number;
  servings?: number;
  // Detailed fields from Get Recipe Information endpoint
  summary?: string;
  instructions?: string;
  extendedIngredients?: Ingredient[];
  analyzedInstructions?: any[];
  sourceUrl?: string;
  spoonacularSourceUrl?: string;
  healthScore?: number;
  pricePerServing?: number;
  cheap?: boolean;
  vegan?: boolean;
  vegetarian?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
  veryHealthy?: boolean;
  dishTypes?: string[];
}

export interface MealPlanEntry {
  id?: string;
  date: string; // YYYY-MM-DD
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  recipe: Recipe;
  userId: string; // Firebase user ID
}

export interface DayMealPlan {
  date: string;
  meals: MealPlanEntry[];
}

export interface WeekMealPlan {
  weekStart: string; // starts monday
  days: DayMealPlan[];
}
