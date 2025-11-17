import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetch(`/api/recipes/${id}`)
      .then((res) => res.json())
      .then(setRecipe);
  }, [id]);

  return (
    <div>
      <h1>Recipe Details</h1>
      <pre>{JSON.stringify(recipe, null, 2)}</pre>
    </div>
  );
}
