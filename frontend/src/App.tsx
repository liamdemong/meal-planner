import { MantineProvider } from "@mantine/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/Error";
import RootLayout from "./layouts/RootLayout";

import Search from "./pages/SearchPage";
import RecipeDetails from "./pages/RecipePage";
import Planner from "./pages/PlannerPage";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Search /> },
      { path: "/recipe/:id", element: <RecipeDetails /> },
      { path: "/planner", element: <Planner /> },
    ],
  },
]);

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <RouterProvider router={router} />
    </MantineProvider>
  );
}
