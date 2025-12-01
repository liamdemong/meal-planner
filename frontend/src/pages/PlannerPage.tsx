import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MealPlanEntry } from "@full-stack/types";
import { Container } from "@mantine/core";
import { useAuth } from "../auth/AuthUserProvider";
import { authenticatedFetch } from "../utils/auth";
import { BACKEND_BASE_PATH } from "../constants/Navigation";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MEAL_TYPES: Array<"breakfast" | "lunch" | "dinner" | "snack"> = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
];

export default function PlannerPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [mealPlan, setMealPlan] = useState<MealPlanEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Get current week's date range
  const getWeekRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Format as YYYY-MM-DD without timezone conversion
    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    return {
      start: formatDate(startOfWeek),
      end: formatDate(endOfWeek),
    };
  };

  const fetchMealPlan = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { start, end } = getWeekRange();
      const res = await authenticatedFetch(
        `${BACKEND_BASE_PATH}/api/mealplan?startDate=${start}&endDate=${end}`
      );
      const data = await res.json();
      setMealPlan(data);
    } catch (error) {
      console.error("Error fetching meal plan:", error);
      if (error instanceof Error && error.message === "Not authenticated") {
        // User needs to log in
        setMealPlan([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchMealPlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const handleDeleteMeal = async (id: string) => {
    if (!confirm("Are you sure you want to remove this meal?")) {
      return;
    }

    try {
      const res = await authenticatedFetch(
        `${BACKEND_BASE_PATH}/api/mealplan/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setMealPlan(mealPlan.filter((meal) => meal.id !== id));
      }
    } catch (error) {
      console.error("Error deleting meal:", error);
      alert("Failed to delete meal");
    }
  };

  const getMealsForDay = (date: string) => {
    return mealPlan.filter((meal) => meal.date === date);
  };

  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      dates.push(`${year}-${month}-${day}`);
    }

    return dates;
  };

  if (authLoading || loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Loading meal plan...</h1>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Please sign in to view your meal plan</h1>
        <p>
          Sign in to create and manage your personalized weekly meal planner.
        </p>
      </div>
    );
  }

  return (
    <Container
      size="xl"
      style={{ paddingTop: "2rem", paddingBottom: "2rem", width: "100%" }}
    >
      <h1 style={{ marginBottom: "2rem" }}>Weekly Meal Planner</h1>

      {/* Weekly Calendar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "1rem",
        }}
      >
        {getWeekDates().map((date, idx) => {
          const dayMeals = getMealsForDay(date);
          const dayName = DAYS_OF_WEEK[idx];
          const [, month, day] = date.split("-").map(Number);
          const displayDate = `${month}/${day}`;

          return (
            <div
              key={date}
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "1rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                minHeight: "400px",
              }}
            >
              <h3 style={{ marginBottom: "0.5rem", fontSize: "1.1rem" }}>
                {dayName}
              </h3>
              <p
                style={{
                  color: "#666",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                }}
              >
                {displayDate}
              </p>

              {MEAL_TYPES.map((mealType) => {
                const meal = dayMeals.find((m) => m.mealType === mealType);

                return (
                  <div
                    key={mealType}
                    style={{
                      marginBottom: "1rem",
                      padding: "0.75rem",
                      background: meal ? "#f0f8f4" : "#f8f9fa",
                      borderRadius: "8px",
                      border: meal ? "1px solid #1fc66b" : "1px solid #e1e8ed",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        marginBottom: "0.5rem",
                        textTransform: "capitalize",
                      }}
                    >
                      {mealType}
                    </div>
                    {meal ? (
                      <div>
                        <img
                          src={meal.recipe.image}
                          alt={meal.recipe.title}
                          onClick={() => navigate(`/recipe/${meal.recipe.id}`)}
                          style={{
                            width: "100%",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            marginBottom: "0.5rem",
                            cursor: "pointer",
                          }}
                        />
                        <div
                          style={{
                            fontSize: "0.85rem",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {meal.recipe.title}
                        </div>
                        <button
                          onClick={() => meal.id && handleDeleteMeal(meal.id)}
                          style={{
                            padding: "0.25rem 0.75rem",
                            background: "#e74c3c",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div style={{ fontSize: "0.75rem", color: "#999" }}>
                        No meal planned
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </Container>
  );
}
