import * as express from "express";
import { db } from "../firebase";
import { MealPlanEntry } from "@full-stack/types";

const router: express.Router = express.Router();
const COLLECTION = "mealPlans";

// GET all meal plan entries for a specific date range (default: current week)
router.get("/", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = db.collection(COLLECTION).orderBy("date", "asc");

    if (startDate) {
      query = query.where("date", ">=", startDate as string);
    }
    if (endDate) {
      query = query.where("date", "<=", endDate as string);
    }

    const snapshot = await query.get();
    const meals: MealPlanEntry[] = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as MealPlanEntry
    );

    res.json(meals);
  } catch (error) {
    console.error("Error fetching meal plan:", error);
    res.status(500).json({ error: "Failed to fetch meal plan" });
  }
});

// POST - Add a new meal to the plan
router.post("/", async (req, res) => {
  try {
    const mealData: Omit<MealPlanEntry, "id"> = req.body;

    if (!mealData.date || !mealData.mealType || !mealData.recipe) {
      return res.status(400).json({
        error:
          "Missing required fields: date, mealType, and recipe are required",
      });
    }

    const docRef = await db.collection(COLLECTION).add({
      ...mealData,
      createdAt: new Date().toISOString(),
    });

    const newMeal: MealPlanEntry = {
      id: docRef.id,
      ...mealData,
    };

    res.status(201).json(newMeal);
  } catch (error) {
    console.error("Error adding meal to plan:", error);
    res.status(500).json({ error: "Failed to add meal to plan" });
  }
});

// PUT - Update a meal in the plan
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData: Partial<MealPlanEntry> = req.body;

    // Remove id from update data if present
    delete updateData.id;

    const docRef = db.collection(COLLECTION).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Meal plan entry not found" });
    }

    await docRef.update({
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    const updatedMeal: MealPlanEntry = {
      id,
      ...doc.data(),
      ...updateData,
    } as MealPlanEntry;

    res.json(updatedMeal);
  } catch (error) {
    console.error("Error updating meal plan:", error);
    res.status(500).json({ error: "Failed to update meal plan" });
  }
});

// DELETE - Remove a meal from the plan
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db.collection(COLLECTION).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Meal plan entry not found" });
    }

    await docRef.delete();

    res.json({ message: "Meal removed from plan", id });
  } catch (error) {
    console.error("Error deleting meal from plan:", error);
    res.status(500).json({ error: "Failed to delete meal from plan" });
  }
});

export default router;
