import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Recipe } from "@full-stack/types";
import { Container, Button } from "@mantine/core";
import { BACKEND_BASE_PATH } from "../constants/Navigation";

export default function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${BACKEND_BASE_PATH}/api/recipes/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch recipe");
        }
        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <Container style={{ paddingTop: "2rem", textAlign: "center" }}>
        <h1>Loading recipe...</h1>
      </Container>
    );
  }

  if (error || !recipe) {
    return (
      <Container style={{ paddingTop: "2rem", textAlign: "center" }}>
        <h1>Error Loading Recipe</h1>
        <p>{error || "Recipe not found"}</p>
        <Button onClick={() => navigate("/planner")}>Back to Planner</Button>
      </Container>
    );
  }

  // Remove HTML tags from summary
  const cleanSummary = recipe.summary?.replace(/<[^>]*>/g, "") || "";

  return (
    <Container style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
      <Button
        onClick={() => navigate("/planner")}
        style={{ marginBottom: "1rem" }}
      >
        ← Back to Planner
      </Button>

      {/* Recipe Header */}
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "2rem",
          marginBottom: "2rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ marginBottom: "1rem" }}>{recipe.title}</h1>
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{
            width: "100%",
            maxWidth: "600px",
            height: "400px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "1.5rem",
          }}
        />

        {/* Recipe Info */}
        <div
          style={{
            display: "flex",
            gap: "2rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          {recipe.readyInMinutes && (
            <div>
              <strong>Ready in:</strong> {recipe.readyInMinutes} minutes
            </div>
          )}
          {recipe.servings && (
            <div>
              <strong>Servings:</strong> {recipe.servings}
            </div>
          )}
          {recipe.healthScore && (
            <div>
              <strong>Health Score:</strong> {recipe.healthScore}/100
            </div>
          )}
        </div>

        {/* Diet Tags */}
        {(recipe.vegetarian ||
          recipe.vegan ||
          recipe.glutenFree ||
          recipe.dairyFree) && (
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {recipe.vegetarian && (
              <span
                style={{
                  padding: "0.25rem 0.75rem",
                  background: "#e8f5e9",
                  color: "#2e7d32",
                  borderRadius: "16px",
                  fontSize: "0.85rem",
                }}
              >
                Vegetarian
              </span>
            )}
            {recipe.vegan && (
              <span
                style={{
                  padding: "0.25rem 0.75rem",
                  background: "#e8f5e9",
                  color: "#2e7d32",
                  borderRadius: "16px",
                  fontSize: "0.85rem",
                }}
              >
                Vegan
              </span>
            )}
            {recipe.glutenFree && (
              <span
                style={{
                  padding: "0.25rem 0.75rem",
                  background: "#fff3e0",
                  color: "#e65100",
                  borderRadius: "16px",
                  fontSize: "0.85rem",
                }}
              >
                Gluten-Free
              </span>
            )}
            {recipe.dairyFree && (
              <span
                style={{
                  padding: "0.25rem 0.75rem",
                  background: "#e3f2fd",
                  color: "#1565c0",
                  borderRadius: "16px",
                  fontSize: "0.85rem",
                }}
              >
                Dairy-Free
              </span>
            )}
          </div>
        )}
      </div>

      {/* Summary */}
      {cleanSummary && (
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Summary</h2>
          <p style={{ lineHeight: "1.6" }}>{cleanSummary}</p>
        </div>
      )}

      {/* Ingredients */}
      {recipe.extendedIngredients && recipe.extendedIngredients.length > 0 && (
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Ingredients</h2>
          <ul style={{ lineHeight: "2" }}>
            {recipe.extendedIngredients.map((ingredient) => (
              <li key={ingredient.id}>{ingredient.original}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Instructions */}
      {recipe.instructions && (
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Instructions</h2>
          <div
            style={{ lineHeight: "1.8" }}
            dangerouslySetInnerHTML={{ __html: recipe.instructions }}
          />
        </div>
      )}

      {/* Source Link */}
      {recipe.sourceUrl && (
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Source</h2>
          <a
            href={recipe.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1976d2" }}
          >
            View Original Recipe
          </a>
        </div>
      )}
    </Container>
  );
}
