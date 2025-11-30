import Search from "../pages/SearchPage";
import Planner from "../pages/PlannerPage";
import RecipeDetails from "../pages/RecipePage";

/**
 * TODO: Modify this when I deploy.
 */
export const BACKEND_BASE_PATH = import.meta.env.VITE_API_BASE_URL;

export const PATHS: {
  link: string;
  label: string;
  element?: JSX.Element;
}[] = [
  {
    link: "/",
    label: "Search Recipes",
    element: <Search />,
  },
  {
    link: "/planner",
    label: "Meal Planner",
    element: <Planner />,
  },

  // Not shown in the navigation bar — but still a route.
  {
    link: "/recipe/:id",
    label: "Recipe Details",
    element: <RecipeDetails />,
  },
];
