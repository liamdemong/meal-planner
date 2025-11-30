import * as express from "express";
const router: express.Router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q as string;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const apiKey = process.env.SPOONACULAR_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured" });
    }

    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
      query
    )}&number=12&addRecipeNutrition=true&apiKey=${apiKey}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const recipeId = req.params.id;
    const apiKey = process.env.SPOONACULAR_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured" });
    }

    const apiUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=false&apiKey=${apiKey}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    res.status(500).json({ error: "Failed to fetch recipe details" });
  }
});

export default router;
