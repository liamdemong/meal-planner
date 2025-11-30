import { useState } from "react";
import { Container } from "@mantine/core";
import { useAuth } from "../auth/AuthUserProvider";
import { authenticatedFetch } from "../utils/auth";
import { BACKEND_BASE_PATH } from "../constants/Navigation";

interface Nutrient {
  name: string;
  amount: number;
  unit: string;
}

interface Recipe {
  id: number;
  title: string;
  image: string;
  nutrition?: {
    nutrients: Nutrient[];
  };
}

export default function SearchPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMealType, setSelectedMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snack"
  >("lunch");

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search term");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${BACKEND_BASE_PATH}/api/recipes/search?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch recipes");
      }

      setRecipes(data.results || []);

      if (!data.results || data.results.length === 0) {
        setError("No recipes found. Try a different search term!");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getNutrientValue = (
    nutrients: Nutrient[] | undefined,
    name: string
  ) => {
    if (!nutrients) return "";
    const nutrient = nutrients.find((n) => n.name === name);
    return nutrient ? `${Math.round(nutrient.amount)} ${nutrient.unit}` : "";
  };

  const handleAddToMealPlan = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);

    // Set default date to today
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  };

  const confirmAddToMealPlan = async () => {
    if (!selectedRecipe || !selectedDate) return;

    if (!user) {
      alert("Please sign in to add recipes to your meal plan");
      return;
    }

    const mealData = {
      date: selectedDate,
      mealType: selectedMealType,
      recipe: {
        id: selectedRecipe.id,
        title: selectedRecipe.title,
        image: selectedRecipe.image,
      },
    };

    try {
      const res = await authenticatedFetch(
        `${BACKEND_BASE_PATH}/api/mealplan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mealData),
        }
      );

      if (res.ok) {
        alert("Recipe added to meal plan!");
        setShowModal(false);
        setSelectedRecipe(null);
      } else {
        const error = await res.json();
        alert(`Failed to add recipe: ${error.error}`);
      }
    } catch (error) {
      console.error("Error adding to meal plan:", error);
      if (error instanceof Error && error.message === "Not authenticated") {
        alert("Please sign in to add recipes to your meal plan");
      } else {
        alert("Failed to add recipe to meal plan");
      }
    }
  };

  return (
    <Container style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
      <h1 style={{ marginBottom: "2rem" }}>Recipe Search</h1>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          maxWidth: "600px",
          margin: "0 auto 2rem",
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for delicious recipes..."
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            fontSize: "1rem",
            border: "2px solid #e1e8ed",
            borderRadius: "8px",
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            fontWeight: 600,
            background: loading ? "#ccc" : "#1fc66b",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && (
        <div
          style={{
            color: "#e74c3c",
            textAlign: "center",
            padding: "1rem",
            background: "rgba(231, 76, 60, 0.1)",
            borderRadius: "8px",
            marginBottom: "2rem",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "1rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>
              {recipe.title}
            </h3>
            <img
              src={recipe.image}
              alt={recipe.title}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            />
            {recipe.nutrition && (
              <div
                style={{
                  display: "grid",
                  gap: "0.5rem",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                }}
              >
                <p>
                  <strong>Calories:</strong>{" "}
                  {getNutrientValue(recipe.nutrition.nutrients, "Calories")}
                </p>
                <p>
                  <strong>Carbs:</strong>{" "}
                  {getNutrientValue(
                    recipe.nutrition.nutrients,
                    "Carbohydrates"
                  )}
                </p>
                <p>
                  <strong>Protein:</strong>{" "}
                  {getNutrientValue(recipe.nutrition.nutrients, "Protein")}
                </p>
                <p>
                  <strong>Fat:</strong>{" "}
                  {getNutrientValue(recipe.nutrition.nutrients, "Fat")}
                </p>
              </div>
            )}
            <button
              onClick={() => handleAddToMealPlan(recipe)}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "#1fc66b",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              Add to Meal Plan
            </button>
          </div>
        ))}
      </div>

      {/* Modal for adding to meal plan */}
      {showModal && selectedRecipe && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "2rem",
              maxWidth: "500px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: "1rem" }}>Add to Meal Plan</h2>
            <p style={{ marginBottom: "1rem", color: "#666" }}>
              {selectedRecipe.title}
            </p>

            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 600,
                }}
              >
                Date:
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 600,
                }}
              >
                Meal Type:
              </label>
              <select
                value={selectedMealType}
                onChange={(e) =>
                  setSelectedMealType(
                    e.target.value as "breakfast" | "lunch" | "dinner" | "snack"
                  )
                }
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={confirmAddToMealPlan}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  background: "#1fc66b",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Confirm
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  background: "#e1e8ed",
                  color: "#333",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
