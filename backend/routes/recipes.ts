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

    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=12&addRecipeNutrition=true&apiKey=${apiKey}`;
    
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

router.get("/:id", (req, res) => {
  res.json({ message: `Recipe details placeholder ${req.params.id}` });
});

export default router;
