import { useState } from "react";

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
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search term");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/recipes/search?q=${encodeURIComponent(query)}`
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

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        Recipe Search
      </h1>

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
                style={{ display: "grid", gap: "0.5rem", fontSize: "0.9rem" }}
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
          </div>
        ))}
      </div>
    </div>
  );
}
