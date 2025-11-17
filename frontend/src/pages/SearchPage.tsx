import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    const res = await fetch(`/api/recipes/search?q=${query}`);
    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      <h1>Recipe Search</h1>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
