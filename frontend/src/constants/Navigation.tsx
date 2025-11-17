import Search from "../pages/SearchPage";
import Planner from "../pages/PlannerPage";
import RecipeDetails from "../pages/RecipePage";

/**
 * TODO: Modify this when I deploy.
 */
export const BACKEND_BASE_PATH = "http://localhost:8000/api";

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
  // The App.tsx router will add route for: /recipe/:id
  {
    link: "/recipe/:id",
    label: "Recipe Details",
    element: <RecipeDetails />,
  },
];
