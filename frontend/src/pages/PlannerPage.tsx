import { useState, useEffect } from "react";

export default function PlannerPage() {
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    fetch("/api/mealplan")
      .then((res) => res.json())
      .then(setPlan);
  }, []);

  return (
    <div>
      <h1>Weekly Planner</h1>
      <pre>{JSON.stringify(plan, null, 2)}</pre>
    </div>
  );
}
